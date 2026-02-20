// src/pages/CalendarPage.jsx

import React, { useState, useEffect } from "react";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import format from "date-fns/format";
import parse from "date-fns/parse";
import startOfWeek from "date-fns/startOfWeek";
import getDay from "date-fns/getDay";
import fr from "date-fns/locale/fr";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { FaTimes, FaTrash } from "react-icons/fa"; // Ajout de FaTrash

// --- CONFIGURATION ---
const locales = { fr: fr };
const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

const messagesFr = {
  allDay: "Journée",
  previous: "Précédent",
  next: "Suivant",
  today: "Aujourd'hui",
  month: "Mois",
  week: "Semaine",
  day: "Jour",
  agenda: "Agenda",
  date: "Date",
  time: "Heure",
  event: "Événement",
  noEventsInRange: "Aucun RDV.",
};

// --- PALETTE COULEURS DYNAMIQUE ---
// Cette fonction génère une couleur unique mais stable pour chaque ID
const getColorForClient = (clientId) => {
  if (!clientId) return { bg: "#f3f4f6", text: "#374151" }; // Gris si pas de médecin

  // 1. On utilise l'ID pour calculer une teinte (Hue) unique entre 0 et 360.
  // On multiplie par 137.5 (l'angle d'or) pour que des ID proches (1, 2, 3)
  // aient des couleurs très différentes (ex: Vert, puis Violet, puis Orange).
  const hue = (clientId * 137.508) % 360;

  return {
    // 2. On génère le code couleur HSL
    // Fond : Saturation 70% (douce), Luminosité 90% (pastel très clair pour la lisibilité)
    bg: `hsl(${hue}, 70%, 90%)`,

    // Texte : Même teinte, mais Luminosité 25% (foncé pour le contraste)
    text: `hsl(${hue}, 80%, 25%)`,
  };
};

// --- ICÔNES ---
const PhoneIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
  </svg>
);
const CloseIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="18" y1="6" x2="6" y2="18"></line>
    <line x1="6" y1="6" x2="18" y2="18"></line>
  </svg>
);
const ChevronLeftIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="15 18 9 12 15 6"></polyline>
  </svg>
);
const ChevronRightIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="9 18 15 12 9 6"></polyline>
  </svg>
);
const ChevronDownIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="6 9 12 15 18 9"></polyline>
  </svg>
);

// --- MODALE INTELLIGENTE (Création / Édition / Suppression) ---
const RdvModal = ({
  isOpen,
  onClose,
  onSubmit,
  onDelete,
  clients,
  appelants,
  initialData,
  isEditMode,
  fixedClient,
}) => {
  const [formData, setFormData] = useState({
    id: null,
    title: "",
    start: "",
    end: "",
    description: "",
    clientId: "",
    appelantId: "",
  });

  useEffect(() => {
    if (isOpen && initialData) {
      const formatForInput = (dateObj) => {
        if (!dateObj) return "";
        const offset = dateObj.getTimezoneOffset() * 60000;
        const localDate = new Date(dateObj.getTime() - offset);
        return localDate.toISOString().slice(0, 16);
      };

      setFormData({
        id: initialData.id || null,
        title: initialData.title || "",
        start: formatForInput(initialData.start),
        end: formatForInput(initialData.end),
        description: initialData.description || "",
        // Si on a un médecin imposé (fixedClient) ET qu'on crée un nouveau RDV (pas d'ID), on force ce médecin.
        // Sinon, on garde celui du RDV existant.
        clientId: initialData.clientId || fixedClient || "",
        appelantId: initialData.appelantId || "",
      });
    }
  }, [isOpen, initialData, fixedClient]); // On ajoute fixedClient aux dépendances

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();

    // ⛔ VALIDATION HORAIRE (8h - 18h)
    const startDate = new Date(formData.start);
    const endDate = new Date(formData.end);
    const startHour = startDate.getHours();
    const endHour = endDate.getHours();

    if (
      startHour < 8 ||
      startHour >= 18 ||
      endHour < 8 ||
      endHour > 18 ||
      (endHour === 18 && endDate.getMinutes() > 0)
    ) {
      alert("⚠️ Horaire invalide !\nLe cabinet est ouvert de 08h00 à 18h00.");
      return;
    }

    // Si tout est bon, on envoie
    onSubmit(formData);
  };

  const handleDelete = () => {
    if (window.confirm("Voulez-vous vraiment supprimer ce rendez-vous ?")) {
      onDelete(formData.id);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-lg mx-4 p-6">
        <div className="flex justify-between items-center mb-4 border-b pb-2">
          <h3 className="text-xl font-bold text-gray-800">
            {isEditMode ? "Modifier le Rendez-vous" : "Nouveau Rendez-vous"}
          </h3>
          <button onClick={onClose}>
            <FaTimes />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Titre
            </label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              className="w-full border rounded px-3 py-2 mt-1"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Début
              </label>
              <input
                type="datetime-local"
                required
                value={formData.start}
                onChange={(e) =>
                  setFormData({ ...formData, start: e.target.value })
                }
                className="w-full border rounded px-3 py-2 mt-1"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Fin
              </label>
              <input
                type="datetime-local"
                required
                value={formData.end}
                onChange={(e) =>
                  setFormData({ ...formData, end: e.target.value })
                }
                className="w-full border rounded px-3 py-2 mt-1"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Médecin *
              </label>
              <select
                required
                value={formData.clientId}
                onChange={(e) =>
                  setFormData({ ...formData, clientId: e.target.value })
                }
                disabled={!!fixedClient}
                className={`w-full border rounded px-3 py-2 mt-1 ${fixedClient ? "bg-gray-100 text-gray-500 cursor-not-allowed" : "bg-white"}`}
              >
                <option value="">Choisir...</option>
                {clients.map((c) => (
                  <option key={c.id} value={c.id}>
                    Dr. {c.lastName}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Patient *
              </label>
              <select
                required
                value={formData.appelantId}
                onChange={(e) =>
                  setFormData({ ...formData, appelantId: e.target.value })
                }
                className="w-full border rounded px-3 py-2 mt-1 bg-white"
              >
                <option value="">Choisir...</option>
                {appelants.map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.firstname} {a.lastname}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="flex justify-between pt-4">
            {/* Bouton Supprimer (Uniquement en mode édition) */}
            <div>
              {isEditMode && (
                <button
                  type="button"
                  onClick={handleDelete}
                  className="px-4 py-2 bg-red-100 text-red-600 rounded hover:bg-red-200 flex items-center gap-2"
                >
                  <FaTrash /> Supprimer
                </button>
              )}
            </div>

            <div className="flex">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded mr-2"
              >
                Annuler
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Enregistrer
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

// --- COMPOSANT BARRE D'APPELS ---
const ActiveCallsBar = () => (
  <div className="bg-white p-4 border-b border-gray-200 flex-shrink-0">
    <div className="flex space-x-4">
      <div className="flex items-center justify-between p-2 px-3 bg-gray-100 rounded-lg shadow-sm">
        <div className="flex items-center space-x-2">
          <PhoneIcon />
          <span className="font-medium text-sm">
            Appel entrant de 01 23 45 67 89
          </span>
          <span className="text-sm text-gray-600">Médecin Dupont</span>
        </div>
        <button className="ml-4 text-gray-500 hover:text-gray-800">
          <CloseIcon />
        </button>
      </div>
    </div>
  </div>
);

// --- COMPOSANT SIDEBAR ---
const RightSidebar = ({ clients, selectedClient, onChangeClient }) => {
  return (
    <div className="w-80 bg-gray-50 border-l border-gray-200 flex flex-col p-4 space-y-4 overflow-y-auto">
      <div className="relative">
        <select
          value={selectedClient}
          onChange={(e) => onChangeClient(e.target.value)}
          className="w-full p-2 pl-3 pr-10 bg-white border rounded-md shadow-sm appearance-none text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Tous les médecins</option>
          {clients.map((c) => (
            <option key={c.id} value={c.id}>
              Agenda: Dr. {c.lastName}
            </option>
          ))}
        </select>
        <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none text-gray-500">
          <ChevronDownIcon />
        </div>
      </div>

      {/* LÉGENDE MÉDECINS (Utilise maintenant les couleurs dynamiques) */}
      <div className="bg-white p-4 rounded-md border shadow-sm flex-1">
        <h3 className="font-semibold mb-3 text-gray-700">Légende Médecins</h3>
        <div className="space-y-2">
          {clients.map((client) => {
            const style = getColorForClient(client.id); // Utilise la fonction globale
            return (
              <div key={client.id} className="flex items-center gap-2 text-sm">
                <span
                  className="w-4 h-4 rounded-full border border-gray-200 shadow-sm flex-shrink-0"
                  style={{ backgroundColor: style.bg }}
                ></span>
                <span className="text-gray-700 font-medium truncate">
                  Dr. {client.lastName}
                </span>
              </div>
            );
          })}
          {clients.length === 0 && (
            <p className="text-sm text-gray-400 italic">Aucun médecin</p>
          )}
        </div>
      </div>
    </div>
  );
};

// --- PAGE PRINCIPALE ---
export default function CalendarPage() {
  const userStr = localStorage.getItem("user");
  const userData = userStr ? JSON.parse(userStr) : null;
  const isAdmin = (userData?.roles || userData?.user?.roles || []).includes(
    "ROLE_ADMIN",
  );
  const [events, setEvents] = useState([]);
  const [clients, setClients] = useState([]);
  const [appelants, setAppelants] = useState([]);
  const [selectedClient, setSelectedClient] = useState("");

  // États pour la modale
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalData, setModalData] = useState(null); // Les données du RDV sélectionné
  const [isEditMode, setIsEditMode] = useState(false);

  useEffect(() => {
    fetchData();
  }, [selectedClient]);

const fetchData = async () => {
        try {
            const clientUrl = isAdmin 
                ? 'http://127.0.0.1:8000/api/admin/clients' 
                : 'http://127.0.0.1:8000/api/me/assignments';

            const resCl = await fetch(clientUrl, { credentials: 'include' });
            if(resCl.ok) {
                const data = await resCl.json();
                // ✅ Gestion Hydra + Aplatissement
                const array = data['hydra:member'] || (Array.isArray(data) ? data : []);
                setClients(array.map(item => {
                    const c = item.client || item;
                    return { ...c, lastName: c.lastName || c.lastname || "" };
                }).filter(c => c && c.id));
            }

            const resAp = await fetch('http://127.0.0.1:8000/api/appelants', { credentials: 'include' });
            if(resAp.ok) {
                const data = await resAp.json();
                const array = data['hydra:member'] || (Array.isArray(data) ? data : []);
                setAppelants(array.filter(a => a && a.id));
            }

      let url = "http://127.0.0.1:8000/api/rendezvous";

      if (selectedClient) url += `?client_id=${selectedClient}`;
      const resRdv = await fetch(url, { credentials: "include" });
      if (resRdv.ok) {
        const data = await resRdv.json();
        setEvents(
          data.map((evt) => ({
            ...evt,
            start: new Date(evt.start),
            end: new Date(evt.end),
            title: evt.title.split("(")[0].trim(),
          })),
        );
      }
    } catch (e) {
      console.error(e);
    }
  };

  // --- ACTIONS DU CALENDRIER ---

  // 1. Clic sur une case vide -> CRÉATION
  const handleSelectSlot = ({ start }) => {
    const now = new Date();

    // On autorise un petit délai de grâce (ex: clic à 14h00 alors qu'il est 14h01)
    // Mais on bloque franchement le passé
    if (start < now) {
      alert("⏳ Impossible de créer un rendez-vous dans le passé !");
      return;
    }

    // Prépare une date de fin par défaut (+30min)
    const end = new Date(start.getTime() + 30 * 60000);
    setModalData({
      start,
      end,
      title: "",
      clientId: selectedClient,
      appelantId: "",
    });
    setIsEditMode(false);
    setIsModalOpen(true);
  };

  // 2. Clic sur un RDV existant -> ÉDITION
  const handleSelectEvent = (event) => {
    setModalData(event); // L'objet event contient déjà id, start, end, clientId, appelantId...
    setIsEditMode(true);
    setIsModalOpen(true);
  };

  // 3. Soumission du formulaire (Création OU Modif)
  const handleSubmitRdv = async (formData) => {
    // 1. Définir les dates
    const startNew = new Date(formData.start);
    const endNew = new Date(formData.end);
    const now = new Date();

    // ⛔ SÉCURITÉ : Pas de RDV dans le passé
    if (startNew < now) {
      alert("❌ Impossible de planifier un rendez-vous à une date passée.");
      return;
    }

    // ... (Garde ton code existant pour la validation des 2 RDV max ici) ...
    const conflicts = events.filter(
      (e) => e.id !== formData.id && startNew < e.end && endNew > e.start,
    );

    if (conflicts.length >= 2) {
      alert(
        "❌ Créneau saturé : Il ne peut pas y avoir plus de 2 rendez-vous simultanés.",
      );
      return;
    }

    // ... (Reste de ta fonction d'envoi fetch) ...

    try {
      let url = "http://127.0.0.1:8000/api/rendezvous";
      let method = "POST";

      if (formData.id) {
        url += `/${formData.id}`;
        method = "PUT";
      }

      const res = await fetch(url, {
        method: method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
        credentials: "include",
      });

      if (res.ok) {
        setIsModalOpen(false);
        fetchData();
      } else {
        const txt = await res.text();
        alert("Erreur serveur : " + txt);
      }
    } catch (e) {
      alert("Erreur réseau");
    }
  };

  // 4. Suppression
  const handleDeleteRdv = async (rdvId) => {
    try {
      const res = await fetch(`http://127.0.0.1:8000/api/rendezvous/${rdvId}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (res.ok) {
        setIsModalOpen(false);
        fetchData();
      } else {
        alert("Impossible de supprimer.");
      }
    } catch (e) {
      alert("Erreur réseau");
    }
  };

// --- PALETTE COULEURS DYNAMIQUE & GESTION DU PASSÉ ---
  const eventStyleGetter = (event) => {
    const colors = getColorForClient(event.clientId);
    
    // 🕒 Vérification : est-ce que le rendez-vous est terminé ?
    // On compare la date de fin du RDV avec l'heure actuelle
    const isPast = new Date(event.end) < new Date();

    return {
      style: {
        backgroundColor: colors.bg,
        color: colors.text,
        borderRadius: '6px',
        border: 'none',
        borderLeft: `4px solid ${colors.border}`,
        display: 'block',
        fontSize: '0.85rem',
        fontWeight: '500',
        // ✨ L'effet visuel :
        opacity: isPast ? 0.5 : 1,       // 50% de transparence si c'est passé
        filter: isPast ? 'grayscale(20%)' : 'none', // Optionnel : un léger voile gris
        cursor: 'pointer',
      },
    };
  };

  // --- STYLE DES JOURS (Griser le passé) ---
  const dayPropGetter = (date) => {
    const now = new Date();
    // On crée une date "Aujourd'hui à 00h00" pour comparer proprement
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    // Si la date de la colonne est avant aujourd'hui -> on grise
    if (date < today) {
      return {
        style: {
          backgroundColor: "#f3f4f6", // Gris clair
          cursor: "not-allowed", // Curseur "interdit"
        },
      };
    }
    return {};
  };

  // --- 1. COMPOSANT POUR LA VUE SEMAINE / JOUR (Version Overlap-Friendly) ---
  const WeekEventComponent = ({ event }) => (
    <div className="h-full w-full flex flex-col p-1 overflow-hidden leading-tight">
      {/* GROUPE INFOS : Titre et Patient */}
      <div className="flex flex-col mb-1">
        <div className="font-bold text-xs truncate">{event.title}</div>
        <div className="text-[10px] opacity-90 truncate">
          {event.appelantName}
        </div>
      </div>

      {/* MÉDECIN : Aligné à gauche pour éviter d'être caché par le RDV d'à côté */}
      {!selectedClient && (
        <div className="text-[10px] italic opacity-80 truncate text-left bg-white/40 px-1 rounded max-w-full">
          👨‍⚕️ {event.clientName}
        </div>
      )}
    </div>
  );

  // --- 2. COMPOSANT POUR LA VUE AGENDA (Liste tableau) ---
  const AgendaEventComponent = ({ event }) => (
    <div className="flex flex-row items-center justify-between w-full h-full">
      {/* Colonne 1 : Titre */}
      <div className="font-bold text-sm w-1/3 truncate">{event.title}</div>

      {/* Colonne 2 : Patient (Centré) */}
      <div className="text-sm opacity-90 w-1/3 text-center truncate border-l border-black/10">
        👤 {event.appelantName}
      </div>

      {/* Colonne 3 : Médecin (Aligné à droite) */}
      <div className="text-sm italic opacity-80 w-1/3 text-right truncate border-l border-black/10">
        {!selectedClient ? `👨‍⚕️ ${event.clientName}` : ""}
      </div>
    </div>
  );

  return (
    <div className="flex flex-1 overflow-hidden bg-gray-100 h-screen">
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        <ActiveCallsBar />
        <div className="flex-1 p-4 bg-white m-4 rounded shadow-sm flex flex-col overflow-hidden">
          <div className="flex-1 overflow-y-auto">
            <Calendar
              localizer={localizer}
              events={events}
              startAccessor="start"
              endAccessor="end"
              style={{ minHeight: "1500px" }}
              messages={messagesFr}
              culture="fr"
              selectable
              onSelectSlot={handleSelectSlot} // Clic vide -> Créer
              onSelectEvent={handleSelectEvent} // Clic RDV -> Modifier
              defaultView="week"
              min={new Date(0, 0, 0, 8, 0, 0)}
              max={new Date(0, 0, 0, 18, 0, 0)}
              eventPropGetter={eventStyleGetter}
              dayPropGetter={dayPropGetter}
              components={{
                event: WeekEventComponent, // Pour Semaine / Jour
                agenda: {
                  event: AgendaEventComponent, // Spécifique pour la vue Agenda
                },
              }}
            />
          </div>
        </div>
      </div>
      <RightSidebar
        clients={clients}
        selectedClient={selectedClient}
        onChangeClient={setSelectedClient}
      />

      {/* MODALE UNIQUE (Create / Edit / Delete) */}
      <RdvModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmitRdv}
        onDelete={handleDeleteRdv}
        clients={clients}
        appelants={appelants}
        initialData={modalData}
        isEditMode={isEditMode}
        fixedClient={selectedClient}
      />
    </div>
  );
}
