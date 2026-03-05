// src/pages/MessagesPage.jsx

import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useCall } from "../context/CallContext";
import { API_URL } from '../config/api'; // <--- AJOUT DE L'IMPORT ICI

// --- Icônes ---
const CalendarIcon = () => (
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
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
    <line x1="16" y1="2" x2="16" y2="6"></line>
    <line x1="8" y1="2" x2="8" y2="6"></line>
    <line x1="3" y1="10" x2="21" y2="10"></line>
  </svg>
);
const ListCheckIcon = () => (
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
    <path d="M9 11l3 3L22 4"></path>
    <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2 2V5a2 2 0 0 1 2-2h11"></path>
  </svg>
);

const TrashIcon = () => (
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
    <polyline points="3 6 5 6 21 6"></polyline>
    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
    <line x1="10" y1="11" x2="10" y2="17"></line>
    <line x1="14" y1="11" x2="14" y2="17"></line>
  </svg>
);

const SearchIcon = () => (
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
    <circle cx="11" cy="11" r="8"></circle>
    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
  </svg>
);
const ClockIcon = () => (
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
    <circle cx="12" cy="12" r="10"></circle>
    <polyline points="12 6 12 12 16 14"></polyline>
  </svg>
);
const CheckIcon = () => (
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
    <polyline points="20 6 9 17 4 12"></polyline>
  </svg>
);
const SendIcon = () => (
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
    <line x1="22" y1="2" x2="11" y2="13"></line>
    <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
  </svg>
);
const ShareIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="18" cy="5" r="3"></circle>
    <circle cx="6" cy="12" r="3"></circle>
    <circle cx="18" cy="19" r="3"></circle>
    <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line>
    <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
  </svg>
);
const MailIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
    <polyline points="22,6 12,13 2,6"></polyline>
  </svg>
);
const PhoneIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="14"
    height="14"
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
const BriefcaseIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
    <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
  </svg>
);
const InfoCircleIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="12" r="10"></circle>
    <line x1="12" y1="16" x2="12" y2="12"></line>
    <line x1="12" y1="8" x2="12.01" y2="8"></line>
  </svg>
);

// --- 1. COMPOSANT GAUCHE : LISTE DES MESSAGES ---
const MessageList = ({
  messages,
  selectedId,
  onSelect,
  activeTab,
  setActiveTab,
  searchQuery,
  setSearchQuery,
  onNewClick,
  onContactClick,
  selectedToDelete,
  setSelectedToDelete,
  onDeleteMultiple,
}) => {
  const displayedMessages = messages.filter((msg) => {
    const tabMatch = activeTab === "Nouveaux" ? !msg.isRead : true;
    const searchMatch =
      msg.from.toLowerCase().includes(searchQuery.toLowerCase()) ||
      msg.doctorName.toLowerCase().includes(searchQuery.toLowerCase());

    return tabMatch && searchMatch;
  });

  const toggleSelection = (id) => {
    setSelectedToDelete((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  };

  return (
    <div className="w-80 md:w-96 bg-white border-r border-gray-200 flex flex-col h-full z-10 shadow-sm">
      <div className="p-5 border-b border-gray-100 flex-shrink-0">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-800">Messages</h2>
          {selectedToDelete.length > 0 && (
            <button
              onClick={onDeleteMultiple}
              className="flex items-center gap-2 text-xs font-bold text-red-600 bg-red-50 px-3 py-1.5 rounded-lg hover:bg-red-100 transition"
            >
              <TrashIcon /> Supprimer ({selectedToDelete.length})
            </button>
          )}
        </div>
        <div className="mt-4">
          <button
            onClick={onNewClick}
            className="px-5 py-2 rounded-lg bg-gray-900 text-white text-sm font-semibold shadow-md hover:bg-gray-800 transition"
          >
            + Nouveau
          </button>
          <button
            onClick={onContactClick}
            className="ml-2 px-5 py-2 rounded-lg border border-gray-200 text-gray-600 text-sm font-semibold hover:bg-gray-50 transition"
          >
            Contact
          </button>
        </div>
      </div>

      <div className="p-4 border-b border-gray-100 flex-shrink-0 bg-gray-50/50">
        <div className="relative mb-4">
          <input
            type="text"
            placeholder="Rechercher..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-100 focus:border-blue-300 outline-none transition"
          />
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            <SearchIcon />
          </div>
        </div>
        <div className="flex bg-gray-200/60 rounded-lg p-1">
          <button
            onClick={() => setActiveTab("Tous")}
            className={`flex-1 py-1.5 rounded-md text-sm font-medium transition ${activeTab === "Tous" ? "bg-white shadow-sm text-gray-900" : "text-gray-500 hover:text-gray-700"}`}
          >
            Tous
          </button>
          <button
            onClick={() => setActiveTab("Nouveaux")}
            className={`flex-1 py-1.5 rounded-md text-sm font-medium transition ${activeTab === "Nouveaux" ? "bg-white shadow-sm text-gray-900" : "text-gray-500 hover:text-gray-700"}`}
          >
            Nouveaux
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {displayedMessages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-40 text-gray-400">
            <p className="text-sm">
              {activeTab === "Nouveaux" ? "Tout est lu ! ✅" : "Aucun message."}
            </p>
          </div>
        )}
        {displayedMessages.map((msg) => (
          <div
            key={msg.id}
            onClick={() => onSelect(msg)}
            className={`flex p-4 space-x-3 cursor-pointer border-b border-gray-50
    ${msg.id === selectedId ? "bg-blue-50/60 border-l-4 border-l-blue-500" : "hover:bg-gray-50"} 
    ${msg.isRead ? "opacity-60" : ""}
`}
          >
            <div
              className="flex items-center"
              onClick={(e) => e.stopPropagation()}
            >
              <input
                type="checkbox"
                checked={selectedToDelete.includes(msg.id)}
                onChange={() => toggleSelection(msg.id)}
                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 cursor-pointer"
              />
            </div>
            <div
              className={`w-10 h-10 rounded-full flex-shrink-0 flex items-center justify-center font-bold text-white shadow-sm ${msg.isRead ? "bg-gray-400" : "bg-gradient-to-br from-blue-500 to-blue-600"}`}
            >
              {msg.from.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-center mb-0.5">
                <h3
                  className={`text-sm truncate ${msg.isRead ? "font-medium text-gray-700" : "font-bold text-gray-900"}`}
                >
                  {msg.from}
                </h3>
                <span className="text-xs text-gray-400 flex-shrink-0 ml-2">
                  {msg.date}
                </span>
              </div>
              <p className="text-xs font-semibold text-blue-600 mb-1 truncate">
                Pour: Dr. {msg.doctorName}
              </p>
              <p className="text-sm text-gray-500 truncate">{msg.snippet}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// --- 2. COMPOSANT CENTRAL : CONVERSATION ---
const Conversation = ({
  selectedMsg,
  onMarkRead,
  onSendReply,
  onMarkUnread,
  onDelete,
}) => {
  const [replyText, setReplyText] = useState("");

  const handleSend = () => {
    if (replyText.trim() && selectedMsg) {
      onSendReply(selectedMsg, replyText);
      setReplyText("");
    }
  };

  if (!selectedMsg) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center bg-gray-50/50 text-gray-400">
        <p>Sélectionnez un message pour voir les détails.</p>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-white h-full relative z-0">
      <div className="flex items-center justify-between p-5 border-b border-gray-100 flex-shrink-0 bg-white">
        <div>
          <h3 className="text-lg font-bold text-gray-800">
            {selectedMsg.from}
          </h3>
          <p className="text-xs text-gray-500">
            Dossier médical • Dr. {selectedMsg.doctorName}
          </p>
        </div>
        <div className="flex items-center space-x-3">
          {!selectedMsg.isRead && (
            <button
              onClick={() => onMarkRead(selectedMsg.id)}
              className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition shadow-sm flex items-center gap-2 font-medium text-sm"
            >
              <CheckIcon /> Traiter
            </button>
          )}
          {selectedMsg.isRead && (
            <button
              onClick={() => onMarkUnread(selectedMsg.id)}
              className="text-xs text-blue-600 hover:underline font-bold"
            >
              Remettre en non lu
            </button>
          )}
          {selectedMsg.isRead && (
            <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-medium border border-gray-200">
              Traité le {new Date().toLocaleDateString()}
            </span>
          )}
          <button
            onClick={() => onDelete([selectedMsg.id])}
            className="text-red-400 hover:text-red-600 transition ml-2"
          >
            <TrashIcon />
          </button>
          <button className="text-gray-400 hover:text-gray-600">
            <ClockIcon />
          </button>
        </div>
      </div>

      <div className="flex-1 p-8 overflow-y-auto bg-gray-50/30">
        <div className="flex flex-col space-y-4">
          <div className="flex items-start">
            <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-xs font-bold text-gray-600 mr-3 mt-1">
              {selectedMsg.from.charAt(0)}
            </div>
            <div className="bg-white p-5 rounded-2xl rounded-tl-none border border-gray-100 shadow-sm max-w-2xl">
              <div className="whitespace-pre-wrap text-gray-800 leading-relaxed text-sm">
                {selectedMsg.fullContent}
              </div>
              <p className="text-xs text-gray-400 mt-3 text-right">
                {selectedMsg.date}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="p-5 bg-white border-t border-gray-100 flex-shrink-0">
        <div className="flex items-center gap-3 bg-gray-50 p-2 rounded-xl border border-gray-200 focus-within:ring-2 focus-within:ring-blue-100 transition">
          <input
            type="text"
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            placeholder="Écrire une note ou une réponse..."
            className="flex-1 px-4 py-2 bg-transparent text-sm focus:outline-none text-gray-700"
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
          />
          <button
            onClick={handleSend}
            className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 shadow-sm transition"
          >
            <SendIcon />
          </button>
        </div>
      </div>
    </div>
  );
};

// --- 3. COMPOSANT DROITE : INFOS (MISE À JOUR MAJEURE) ---
const InfoPanel = ({ selectedMsg, onSaveNote }) => {
  const [localNote, setLocalNote] = useState("");

  // Synchronisation : On met à jour le texte local quand on change de message
  useEffect(() => {
    if (selectedMsg) {
      setLocalNote(selectedMsg.adminNote || "");
    }
  }, [selectedMsg?.id]); // On surveille l'ID pour ne pas réinitialiser pendant la saisie

  // Si aucun message n'est sélectionné, on affiche un panneau vide structuré
  if (!selectedMsg)
    return (
      <div className="w-96 bg-gray-50 border-l border-gray-200 hidden xl:block"></div>
    );

  return (
    <div className="w-96 bg-gray-50 border-l border-gray-200 flex flex-col h-full overflow-y-auto hidden xl:flex shadow-inner">
      {/* 1. Header Info */}
      <div className="p-5 flex justify-between items-center">
        <h2 className="text-lg font-bold text-gray-800">Info</h2>
        <div className="flex space-x-3 text-gray-400">
          <button className="hover:text-gray-600 transition">
            <ClockIcon />
          </button>
          <button className="hover:text-gray-600 transition">
            <ShareIcon />
          </button>
        </div>
      </div>

      <div className="px-5 pb-5">
        {/* 2. Carte Contact Patient */}
        <div className="bg-gray-200/80 rounded-xl p-6 mb-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 rounded-full bg-gray-800 text-white flex items-center justify-center text-2xl font-bold shadow-md">
              {selectedMsg.from.charAt(0).toUpperCase()}
            </div>
            <div className="overflow-hidden">
              <h3 className="text-lg font-bold text-gray-900 truncate">
                {selectedMsg.from}
              </h3>
              <p className="text-xs text-gray-500 uppercase tracking-wide">
                {selectedMsg.senderType === "patient"
                  ? "Patient"
                  : "Secrétaire"}
              </p>
            </div>
          </div>

          <div className="space-y-3 mt-4 pt-4 border-t border-gray-300/50">
            {/* On n'affiche le téléphone QUE si c'est un patient */}
            {selectedMsg.senderType === "patient" && (
              <div className="flex items-center text-sm text-gray-700">
                <PhoneIcon />
                <span className="ml-3 font-medium">
                  {selectedMsg.patient?.phone || "Non renseigné"}
                </span>
              </div>
            )}

            {/* On affiche l'email envoyé par le PHP (contactEmail) */}
            <div className="flex items-center text-sm text-gray-700">
              <MailIcon />
              <span className="ml-3 truncate font-medium">
                {selectedMsg.contactEmail || "Pas d'email"}
              </span>
            </div>
          </div>
        </div>

        {/* 4. Notes Administratives (Éditables) */}
        <div className="mb-6">
          <h3 className="text-sm font-bold text-gray-900 mb-3 border-b border-gray-200 pb-2">
            Notes administratives
          </h3>
          <div className="space-y-4">
            <div className="relative group">
              <textarea
                value={localNote}
                onChange={(e) => setLocalNote(e.target.value)}
                onBlur={() => {
                  // Sauvegarde uniquement si le contenu a changé
                  if (localNote !== (selectedMsg.adminNote || "")) {
                    onSaveNote(selectedMsg.id, localNote);
                  }
                }}
                placeholder="Ajouter une note interne sur ce dossier..."
                className="w-full h-32 p-4 bg-white rounded-xl border border-gray-200 shadow-sm text-sm text-gray-700 focus:ring-2 focus:ring-blue-100 outline-none resize-none transition"
              />
              <div className="absolute bottom-2 right-3 text-[10px] text-gray-400 opacity-0 group-focus-within:opacity-100 transition">
                Sauvegarde automatique...
              </div>
            </div>

            {/* 5. Médecin Destinataire */}
            <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
              <h4 className="text-xs font-semibold text-gray-500 uppercase mb-2 flex items-center gap-2">
                <InfoCircleIcon /> Concerne le médecin
              </h4>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-xs">
                  Dr
                </div>
                <div>
                  <p className="font-bold text-gray-800 text-sm">
                    Dr. {selectedMsg.doctorName}
                  </p>
                  <p className="text-xs text-gray-500">Médecin titulaire</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- COMPOSANT PRINCIPAL ---
export default function MessagesPage() {
  const location = useLocation();
  const [messages, setMessages] = useState([]);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [contactSearch, setContactSearch] = useState("");
  const [selectedMsg, setSelectedMsg] = useState(null);
  const [activeTab, setActiveTab] = useState("Nouveaux");
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [clients, setClients] = useState([]);
  const [appelants, setAppelants] = useState([]);
  const [newMsgData, setNewMsgData] = useState({
    client_id: "",
    appelant_id: "",
    content: "",
    senderName: "Secrétariat",
  });
  const [selectedToDelete, setSelectedToDelete] = useState([]);
  const navigate = useNavigate();
  const { startOutgoingCall } = useCall();

  // 1. Chargement initial des données
  useEffect(() => {
    fetchMessages();
    fetchInitialData();
  }, []);

  // 🚀 LOGIQUE DE TÉLÉPORTATION UNIQUE
  useEffect(() => {
    const targetId = location.state?.openMessageId;

    if (targetId && messages.length > 0) {
      const msgToOpen = messages.find((m) => m.id === targetId);

      if (msgToOpen) {
        // 1. On force l'onglet sur "Tous" pour que le message soit visible
        setActiveTab("Tous");
        // 2. On sélectionne le message immédiatement
        setSelectedMsg(msgToOpen);
        // 3. On nettoie l'état de navigation
        window.history.replaceState({}, document.title);
      }
    }
  }, [location.state, messages]); // On surveille l'arrivée des messages

  // 🔄 Sélection automatique intelligente
  useEffect(() => {
    // On ne lance l'auto-sélection QUE s'il n'y a pas de demande de téléportation en cours
    if (location.state?.openMessageId) return;

    const filtered = messages.filter((msg) => {
      const tabMatch = activeTab === "Nouveaux" ? !msg.isRead : true;
      const searchMatch =
        msg.from.toLowerCase().includes(searchQuery.toLowerCase()) ||
        msg.doctorName.toLowerCase().includes(searchQuery.toLowerCase());
      return tabMatch && searchMatch;
    });

    const isStillVisible =
      selectedMsg && filtered.some((m) => m.id === selectedMsg.id);

    if (!isStillVisible && filtered.length > 0) {
      setSelectedMsg(filtered[0]);
    }
  }, [activeTab, messages, searchQuery, location.state]);

  // 🟢 LA FONCTION CLICK-TO-CALL :
  const handleCallPatient = async (phoneNumber) => {
    if (!phoneNumber) {
      alert("Ce patient n'a pas de numéro enregistré.");
      return;
    }
    // On lance l'appel globalement
    await startOutgoingCall(phoneNumber);
    // On redirige la secrétaire vers le téléphone
    navigate("/phone"); // (Assure-toi que c'est bien la route de ta page Téléphone)
  };

  // 🗑️ NOUVELLE FONCTION : Gérer la suppression
  const handleDeleteMessages = async (idsToDelete) => {
    if (
      !window.confirm(
        `Êtes-vous sûr de vouloir supprimer ${idsToDelete.length} message(s) ?`,
      )
    )
      return;

    try {
      await Promise.all(
        idsToDelete.map((id) =>
          // 👇 REMPLACEMENT PAR ${API_URL} 👇
          fetch(`${API_URL}/api/messages/${id}`, {
            method: "DELETE",
            credentials: "include",
          }),
        ),
      );

      setMessages((prev) => prev.filter((m) => !idsToDelete.includes(m.id)));
      setSelectedToDelete([]);
      if (selectedMsg && idsToDelete.includes(selectedMsg.id)) {
        setSelectedMsg(null);
      }
    } catch (e) {
      console.error("Erreur lors de la suppression", e);
    }
  };

  // 📝 NOUVELLE FONCTION : Sauvegarder la note
  const handleSaveNote = async (id, note) => {
    if (!id) return;

    try {
      // 👇 REMPLACEMENT PAR ${API_URL} 👇
      const res = await fetch(`${API_URL}/api/messages/${id}/note`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ note: note }),
        credentials: "include",
      });

      if (res.ok) {
        // 1. On met d'abord à jour le message sélectionné (Affichage immédiat)
        setSelectedMsg((prev) =>
          prev && prev.id === id ? { ...prev, adminNote: note } : prev,
        );

        // 2. On met à jour la liste globale SANS changer la référence du message sélectionné
        // Cela évite que le useEffect de sélection automatique ne s'embrouille.
        setMessages((prev) =>
          prev.map((m) => (m.id === id ? { ...m, adminNote: note } : m)),
        );
      }
    } catch (e) {
      console.error("Erreur réseau :", e);
    }
  };

  const fetchMessages = async () => {
    try {
      // 👇 REMPLACEMENT PAR ${API_URL} 👇
      const res = await fetch(`${API_URL}/api/messages/all`, {
        credentials: "include",
      });
      if (res.ok) {
        const data = await res.json();
        setMessages(data.messages);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleMarkRead = async (id) => {
    try {
      // 👇 REMPLACEMENT PAR ${API_URL} 👇
      const res = await fetch(`${API_URL}/api/messages/${id}/read`, {
        method: "POST",
        credentials: "include",
      });
      if (res.ok) {
        setMessages((prev) =>
          prev.map((m) => (m.id === id ? { ...m, isRead: true } : m)),
        );
        if (selectedMsg?.id === id)
          setSelectedMsg((prev) => ({ ...prev, isRead: true }));
      }
    } catch (e) {
      alert("Erreur réseau");
    }
  };

  const handleMarkUnread = async (id) => {
    try {
      // 👇 REMPLACEMENT PAR ${API_URL} 👇
      const res = await fetch(
        `${API_URL}/api/messages/${id}/unread`,
        { method: "POST", credentials: "include" },
      );
      if (res.ok) {
        setMessages((prev) =>
          prev.map((m) => (m.id === id ? { ...m, isRead: false } : m)),
        );
        if (selectedMsg?.id === id)
          setSelectedMsg((prev) => ({ ...prev, isRead: false }));
      }
    } catch (e) {
      alert("Erreur réseau");
    }
  };

  const fetchInitialData = async () => {
    try {
      const [resCl, resAp] = await Promise.all([
        // 👇 REMPLACEMENT PAR ${API_URL} 👇
        fetch(`${API_URL}/api/me/assignments`, {
          credentials: "include",
        }),
        // 👇 REMPLACEMENT PAR ${API_URL} 👇
        fetch(`${API_URL}/api/appelants`, {
          credentials: "include",
        }),
      ]);
      if (resCl.ok) {
        const data = await resCl.json();
        const array =
          data["hydra:member"] ||
          (Array.isArray(data) ? data : Object.values(data));
        setClients(
          array.map((item) => item.client || item).filter((c) => c && c.id),
        );
      }
      if (resAp.ok) {
        const data = await resAp.json();
        const array =
          data["hydra:member"] ||
          (Array.isArray(data) ? data : Object.values(data));
        setAppelants(array);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleCreateMessage = async (e) => {
    e.preventDefault();
    try {
      // 👇 REMPLACEMENT PAR ${API_URL} 👇
      const res = await fetch(`${API_URL}/api/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newMsgData),
        credentials: "include",
      });
      if (res.ok) {
        setIsModalOpen(false);
        setNewMsgData({
          client_id: "",
          appelant_id: "",
          content: "",
          senderName: "Secrétariat",
        });
        fetchMessages();
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="flex flex-1 overflow-hidden h-screen bg-white">
      <MessageList
        messages={messages}
        selectedId={selectedMsg?.id}
        onSelect={setSelectedMsg}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onNewClick={() => setIsModalOpen(true)}
        onContactClick={() => setIsContactModalOpen(true)}
        selectedToDelete={selectedToDelete}
        setSelectedToDelete={setSelectedToDelete}
        onDeleteMultiple={() => handleDeleteMessages(selectedToDelete)}
      />
      <Conversation
        selectedMsg={selectedMsg}
        onMarkRead={handleMarkRead}
        onMarkUnread={handleMarkUnread}
        onSendReply={() => { }}
        onDelete={handleDeleteMessages}
      />
      <InfoPanel selectedMsg={selectedMsg} onSaveNote={handleSaveNote} />

      {/* --- MODALE NOUVEAU MESSAGE (DESIGN OLYMPE) --- */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden border border-gray-100">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <h3 className="text-xl font-bold text-gray-800">
                Nouveau Message
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 transition"
              >
                ✕
              </button>
            </div>
            <form onSubmit={handleCreateMessage} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
                  Médecin destinataire
                </label>
                <select
                  required
                  className="w-full border border-gray-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-blue-100 outline-none"
                  value={newMsgData.client_id}
                  onChange={(e) =>
                    setNewMsgData({ ...newMsgData, client_id: e.target.value })
                  }
                >
                  <option value="">Sélectionner un médecin...</option>
                  {clients.map((c) => (
                    <option key={c.id} value={c.id}>
                      Dr. {c.lastName}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
                  Patient concerné (Facultatif)
                </label>
                <select
                  className="w-full border border-gray-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-blue-100 outline-none"
                  value={newMsgData.appelant_id}
                  onChange={(e) => {
                    const id = e.target.value;
                    const patient = appelants.find((a) => a.id == id);
                    setNewMsgData({
                      ...newMsgData,
                      appelant_id: id,
                      // Si un patient est choisi, on prend son nom, sinon on remet "Secrétariat"
                      senderName: patient
                        ? `${patient.firstname} ${patient.lastname}`
                        : "Secrétariat",
                    });
                  }}
                >
                  <option value="">
                    Aucun patient lié (Envoyé par le Secrétariat)
                  </option>
                  {appelants.map((a) => (
                    <option key={a.id} value={a.id}>
                      {a.firstname} {a.lastname}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
                  Message
                </label>
                <textarea
                  required
                  placeholder="Écrivez les consignes ici..."
                  className="w-full border border-gray-200 rounded-xl p-3 text-sm h-32 focus:ring-2 focus:ring-blue-100 outline-none"
                  value={newMsgData.content}
                  onChange={(e) =>
                    setNewMsgData({ ...newMsgData, content: e.target.value })
                  }
                />
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-3 text-gray-500 font-semibold hover:bg-gray-50 rounded-xl transition"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 bg-gray-900 text-white font-semibold rounded-xl hover:bg-gray-800 shadow-lg transition"
                >
                  Envoyer le message
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- MODALE ANNUAIRE RAPIDE --- */}
      {isContactModalOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden border border-gray-100 flex flex-col max-h-[80vh]">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <h3 className="text-xl font-bold text-gray-800">
                Annuaire Patients
              </h3>
              <button
                onClick={() => setIsContactModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 transition"
              >
                ✕
              </button>
            </div>

            <div className="p-4 bg-gray-50 border-b border-gray-100">
              <input
                type="text"
                placeholder="Rechercher un patient..."
                className="w-full p-3 rounded-xl border border-gray-200 text-sm outline-none focus:ring-2 focus:ring-blue-100"
                value={contactSearch}
                onChange={(e) => setContactSearch(e.target.value)}
              />
            </div>

            <div className="flex-1 overflow-y-auto p-2">
              {appelants
                .filter((a) =>
                  `${a.firstname} ${a.lastname}`
                    .toLowerCase()
                    .includes(contactSearch.toLowerCase()),
                )
                .map((a) => (
                  <div
                    key={a.id}
                    className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-xl transition border-b border-gray-50 last:border-0"
                  >
                    <div>
                      <p className="font-bold text-gray-900">
                        {a.firstname} {a.lastname}
                      </p>
                      <p className="text-xs text-gray-500">{a.phone}</p>
                    </div>
                    <button
                      className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-600 hover:text-white transition"
                      onClick={() => handleCallPatient(a.phone)}
                    >
                      <PhoneIcon />
                    </button>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}