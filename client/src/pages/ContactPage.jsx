// src/pages/ContactPage.jsx

import React, { useState, useMemo, useEffect } from "react";
import {
  FaSearch,
  FaUserMd,
  FaPhone,
  FaEnvelope,
  FaMapMarkerAlt,
  FaBirthdayCake,
  FaEdit,
  FaTrash,
  FaBuilding,
  FaPlus,
  FaTimes,
} from "react-icons/fa";

// --- MODALE N°1 : FORMULAIRE CLIENT (Médecin) ---
const ClientFormModal = ({ isOpen, onClose, onSubmit, initialData }) => {
  // ✅ MODIF : Séparation nom/prénom dans le state
  const getInitialState = () => ({
    lastname: "",
    firstname: "",
    phone: "",
    email: "",
    specialty: "",
    address: "",
    birthDate: "",
  });

  const [formData, setFormData] = useState(getInitialState());

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        // On sépare le nom complet reçu pour l'affichage si on est en mode édition
        // (Note : Idéalement le backend enverrait déjà séparé, on adapte ici)
        let first = "",
          last = "";
        if (initialData.firstName && initialData.lastName) {
          first = initialData.firstName;
          last = initialData.lastName;
        } else {
          // Fallback si on a que "name" combiné
          const parts = (initialData.name || "").split(" ");
          first = parts[0] || "";
          last = parts.slice(1).join(" ") || "";
        }

        setFormData({
          ...initialData,
          firstname: first,
          lastname: last,
        });
      } else {
        setFormData(getInitialState());
      }
    }
  }, [isOpen, initialData]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const modalTitle = initialData ? "Modifier le Client" : "Ajouter un Client";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-lg mx-4">
        <form onSubmit={handleSubmit}>
          <div className="flex justify-between items-center p-4 border-b">
            <h3 className="text-xl font-semibold">{modalTitle}</h3>
            <button
              type="button"
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <FaTimes size={20} />
            </button>
          </div>
          <div className="p-6 space-y-4">
            {/* ✅ MODIF : Deux champs distincts */}
            <div className="grid grid-cols-2 gap-4">
              <FormInput
                label="Nom"
                name="lastname"
                value={formData.lastname || ""}
                onChange={handleChange}
                required={true}
              />
              <FormInput
                label="Prénom"
                name="firstname"
                value={formData.firstname || ""}
                onChange={handleChange}
                required={true}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormInput
                label="Téléphone"
                name="phone"
                type="tel"
                icon={FaPhone}
                value={formData.phone || ""}
                onChange={handleChange}
                required={true}
                pattern="[0-9]{8,}"
                helpText="8 chiffres minimum (chiffres uniquement)"
              />
              <FormInput
                label="Email"
                name="email"
                type="email"
                value={formData.email || ""}
                onChange={handleChange}
                required={true}
              />
            </div>
            <FormInput
              label="Date de naissance"
              name="birthDate"
              type="date"
              value={formData.birthDate || ""}
              onChange={handleChange}
            />
            <hr className="my-2" />
            <FormInput
              label="Spécialité (ex: Kinésithérapeute)"
              name="specialty"
              value={formData.specialty || ""}
              onChange={handleChange}
            />
            <FormInput
              label="Adresse"
              name="address"
              value={formData.address || ""}
              onChange={handleChange}
              required={true}
            />
          </div>
          <div className="flex justify-end items-center p-4 bg-gray-50 border-t rounded-b-lg">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-white text-gray-700 border border-gray-300 rounded-lg mr-2 hover:bg-gray-50"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Valider
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// --- MODALE N°2 : FORMULAIRE APPELANT (Patient) ---
const AppelantFormModal = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  clientList = [],
}) => {
  const getInitialState = () => ({
    lastname: "",
    firstname: "",
    phone: "",
    email: "",
    birthDate: "",
    linkedClient: "", // ✅ Utilisation directe de l'ID
  });

  const [formData, setFormData] = useState(getInitialState());

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        let first = initialData.firstname || "";
        let last = initialData.lastname || "";

        // Support pour le format combiné (si nom et prénom ne sont pas encore séparés en BDD)
        if (initialData.name && !initialData.firstname) {
          const parts = initialData.name.split(" ");
          first = parts[0];
          last = parts.slice(1).join(" ");
        }

        setFormData({
          ...initialData,
          firstname: first,
          lastname: last,
          linkedClient: initialData.linkedClient || "", // ✅ On récupère l'ID directement
        });
      } else {
        setFormData(getInitialState());
      }
    }
  }, [isOpen, initialData]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const modalTitle = initialData
    ? "Modifier l'Appelant"
    : "Ajouter un Appelant";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-lg mx-4">
        <form onSubmit={handleSubmit}>
          <div className="flex justify-between items-center p-4 border-b">
            <h3 className="text-xl font-semibold">{modalTitle}</h3>
            <button
              type="button"
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <FaTimes size={20} />
            </button>
          </div>
          <div className="p-6 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormInput
                label="Nom"
                name="lastname"
                value={formData.lastname || ""}
                onChange={handleChange}
                required={true}
              />
              <FormInput
                label="Prénom"
                name="firstname"
                value={formData.firstname || ""}
                onChange={handleChange}
                required={true}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormInput
                label="Téléphone"
                name="phone"
                type="tel"
                icon={FaPhone}
                value={formData.phone || ""}
                onChange={handleChange}
                required={true}
                pattern="[0-9]{8,}"
                helpText="8 chiffres minimum (chiffres uniquement)"
              />
              <FormInput
                label="Email"
                name="email"
                type="email"
                value={formData.email || ""}
                onChange={handleChange}
                required={true}
              />
            </div>

            <hr className="my-2" />
            <FormInput
              label="Date de naissance"
              name="birthDate"
              type="date"
              value={formData.birthDate || ""}
              onChange={handleChange}
            />

            {/* ✅ MODIF : Remplacement du datalist par un SELECT pour la fiabilité absolue */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Médecin traitant <span className="text-red-500">*</span>
              </label>
              <select
                name="linkedClient"
                value={formData.linkedClient || ""}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
              >
                <option value="">-- Sélectionner un médecin --</option>
                {clientList.map((client) => (
                  <option key={client.id} value={client.id}>
                    Dr. {client.name} ({client.specialty})
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="flex justify-end items-center p-4 bg-gray-50 border-t rounded-b-lg">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-white text-gray-700 border border-gray-300 rounded-lg mr-2 hover:bg-gray-50"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Valider
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// --- Composant Helper (Mise à jour avec icône et notice) ---
const FormInput = ({
  label,
  name,
  type = "text",
  value,
  onChange,
  required = false,
  list = null,
  icon: Icon,
  helpText,
  pattern,
}) => (
  <div>
    <label
      htmlFor={name}
      className="block text-sm font-medium text-gray-700 mb-1"
    >
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <div className="relative">
      {Icon && (
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
          <Icon size={16} />
        </div>
      )}
      <input
        type={type}
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        list={list}
        pattern={pattern}
        onKeyPress={(e) => {
          // Bloque tout ce qui n'est pas un chiffre si c'est un tel
          if (type === "tel" && !/[0-9]/.test(e.key)) {
            e.preventDefault();
          }
        }}
        className={`w-full ${Icon ? "pl-10" : "px-3"} py-2 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all`}
      />
    </div>
    {helpText && (
      <p className="mt-1 text-xs text-gray-500 italic">{helpText}</p>
    )}
  </div>
);

// --- PAGE PRINCIPALE ---
export default function ContactPage() {
  const [activeTab, setActiveTab] = useState("clients");
  const [searchTerm, setSearchTerm] = useState("");
  const [contacts, setContacts] = useState([]);
  const [selectedContact, setSelectedContact] = useState(null);
  const [isClientModalOpen, setIsClientModalOpen] = useState(false);
  const [isAppelantModalOpen, setIsAppelantModalOpen] = useState(false);
  const [contactToEdit, setContactToEdit] = useState(null);

  // --- CHARGEMENT ---
  useEffect(() => {
    const fetchData = async () => {
      try {
        const resClients = await fetch(
          "http://127.0.0.1:8000/api/admin/clients",
          { credentials: "include" },
        );
        const clientsData = resClients.ok ? await resClients.json() : [];

        const formattedClients = clientsData.map((c) => ({
          id: c.id,
          type: "client",
          firstName: c.firstName, // On garde les données brutes aussi
          lastName: c.lastName,
          name: `${c.firstName} ${c.lastName}`,
          specialty: c.specialty || "Spécialité inconnue",
          avatar: c.firstName.charAt(0).toUpperCase(),
          color: "bg-blue-600",
          phone: c.phone || "",
          email: c.email || "",
          address: c.address || "",
          birthDate: c.birthDate || "",
        }));

        const resAppelants = await fetch(
          "http://127.0.0.1:8000/api/appelants",
          { credentials: "include" },
        );
        const appelantsData = resAppelants.ok ? await resAppelants.json() : [];

        const formattedAppelants = appelantsData.map((a) => ({
          id: a.id,
          type: "appelant",
          firstname: a.firstname, // On garde les données brutes
          lastname: a.lastname,
          name: `${a.firstname} ${a.lastname}`,
          avatar: (
            a.firstname?.charAt(0) ||
            a.lastname?.charAt(0) ||
            "?"
          ).toUpperCase(),
          color: "bg-purple-600",
          phone: a.phone || "",
          email: a.email || "",
          birthDate: a.birthDate || "",
          linkedClient: a.linkedClient ? a.linkedClient.id : null,
        }));

        setContacts([...formattedClients, ...formattedAppelants]);

        if (formattedClients.length > 0 && !selectedContact) {
          setSelectedContact(formattedClients[0]);
        }
      } catch (error) {
        console.error("Erreur de chargement:", error);
      }
    };

    fetchData();
  }, []);

  const clientList = useMemo(
    () => contacts.filter((c) => c.type === "client"),
    [contacts],
  );

  const filteredContacts = useMemo(() => {
    const desiredType = activeTab === "clients" ? "client" : "appelant";
    const term = searchTerm.toLowerCase();
    return contacts.filter(
      (contact) =>
        contact.type === desiredType &&
        contact.name.toLowerCase().includes(term),
    );
  }, [activeTab, searchTerm, contacts]);

  useEffect(() => {
    if (filteredContacts.length === 0) {
      setSelectedContact(null);
      return;
    }
    if (
      !selectedContact ||
      !filteredContacts.some((c) => c.id === selectedContact.id)
    ) {
      if (
        filteredContacts[0].type ===
        (activeTab === "clients" ? "client" : "appelant")
      ) {
        setSelectedContact(filteredContacts[0]);
      }
    }
  }, [filteredContacts, activeTab]);

  // --- GESTION DES MODALES ---
  const handleOpenAddModal = () => {
    setContactToEdit(null);
    activeTab === "clients"
      ? setIsClientModalOpen(true)
      : setIsAppelantModalOpen(true);
  };

  const handleOpenEditModal = (contact) => {
    setContactToEdit(contact);
    contact.type === "client"
      ? setIsClientModalOpen(true)
      : setIsAppelantModalOpen(true);
  };

  const handleCloseModals = () => {
    setIsClientModalOpen(false);
    setIsAppelantModalOpen(false);
    setContactToEdit(null);
  };

  const handleDeleteContact = async (contactId) => {
    if (!window.confirm("Êtes-vous sûr de vouloir supprimer ce contact ?"))
      return;

    const contactToDelete = contacts.find((c) => c.id === contactId);
    if (!contactToDelete) return;

    const url =
      contactToDelete.type === "client"
        ? `http://127.0.0.1:8000/api/admin/clients/${contactId}`
        : `http://127.0.0.1:8000/api/appelants/${contactId}`;

    try {
      const response = await fetch(url, {
        method: "DELETE",
        credentials: "include",
      });

      // On récupère le texte brut d'abord au cas où ce ne soit pas du JSON
      const text = await response.text();
      let data = {};
      try {
        data = JSON.parse(text);
      } catch (e) {
        data = { error: "Erreur serveur inconnue" };
      }

      if (response.ok) {
        setContacts((prev) => prev.filter((c) => c.id !== contactId));
        if (selectedContact?.id === contactId) setSelectedContact(null);
        alert("Suppression réussie !"); // Optionnel : confirmation visuelle
      } else {
        // 🚨 Affiche enfin le message de blocage du backend (RDV liés)
        alert(`Attention : ${data.error || "Action impossible"}`);
      }
    } catch (error) {
      console.error("Erreur réseau:", error);
      alert("Erreur de connexion au serveur.");
    }
  };

  // --- SUBMIT CLIENTS (Médecins) ---
  const handleClientSubmit = async (formData) => {
    try {
      // ✅ Envoi direct du prénom et nom séparés
      const payload = {
        email: formData.email,
        firstName: formData.firstname, // React state -> API key
        lastName: formData.lastname, // React state -> API key
        phone: formData.phone,
        specialty: formData.specialty,
        address: formData.address,
        birthDate: formData.birthDate,
      };

      let response;
      if (contactToEdit) {
        response = await fetch(
          `http://127.0.0.1:8000/api/admin/clients/${contactToEdit.id}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
            },
            credentials: "include",
            body: JSON.stringify(payload),
          },
        );
      } else {
        response = await fetch("http://127.0.0.1:8000/api/admin/clients", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          credentials: "include",
          body: JSON.stringify(payload),
        });
      }

      if (response.ok) {
        const data = await response.json();
        const newContact = {
          id: data.id,
          type: "client",
          firstName: data.firstName,
          lastName: data.lastName,
          name: `${data.firstName} ${data.lastName}`,
          specialty: data.specialty || formData.specialty,
          phone: data.phone || formData.phone,
          email: data.email || formData.email,
          avatar: (data.firstName?.charAt(0) || "?").toUpperCase(),
          color: "bg-green-600",
          address: formData.address,
          birthDate: formData.birthDate,
        };

        if (contactToEdit) {
          setContacts((prev) =>
            prev.map((c) => (c.id === contactToEdit.id ? newContact : c)),
          );
        } else {
          setContacts((prev) => [newContact, ...prev]);
          setActiveTab("clients");
        }
        setSelectedContact(newContact);
        handleCloseModals();
      } else {
        const err = await response.json();
        alert("Erreur : " + (err.error || "Vérifiez les champs"));
      }
    } catch (error) {
      console.error("Erreur réseau:", error);
    }
  };

  // --- SUBMIT APPELANTS (Patients) ---
  const handleAppelantSubmit = async (formData) => {
    try {
      // ✅ On utilise directement l'ID stocké dans formData.linkedClient
      const payload = {
        firstname: formData.firstname,
        lastname: formData.lastname,
        phone: formData.phone,
        email: formData.email,
        birthDate: formData.birthDate,
        linkedClient: formData.linkedClient || null,
      };

      const response = await fetch(
        "http://127.0.0.1:8000/api/appelants/nouveau",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
          credentials: "include",
        },
      );

      if (response.ok) {
        const data = await response.json();
        const newContact = {
          id: data.id,
          type: "appelant",
          firstname: data.firstname,
          lastname: data.lastname,
          name: `${data.firstname} ${data.lastname}`,
          avatar: (data.firstname?.charAt(0) || "?").toUpperCase(),
          color: "bg-purple-600",
          phone: data.phone,
          email: data.email,
          birthDate: data.birthDate,
          linkedClient: formData.linkedClient
            ? Number(formData.linkedClient)
            : null,
        };

        if (contactToEdit) {
          setContacts((prev) =>
            prev.map((c) => (c.id === contactToEdit.id ? newContact : c)),
          );
        } else {
          setContacts((prev) => [newContact, ...prev]);
          setActiveTab("appelants");
        }
        setSelectedContact(newContact);
        handleCloseModals();
      } else {
        const errorData = await response.json();
        alert("Erreur : " + (errorData.error || "Erreur serveur"));
      }
    } catch (e) {
      console.error(e);
      alert("Erreur réseau");
    }
  };

  const ContactDetails = ({ contact, onEdit, onDelete, clientList }) => {
    if (!contact)
      return (
        <div className="flex items-center justify-center h-full text-gray-500">
          Sélectionnez un contact
        </div>
      );

    const isClient = contact.type === "client";
    let linkedClientDetails = null;
    if (!isClient && contact.linkedClient) {
      linkedClientDetails = clientList.find(
        (c) => c.id == contact.linkedClient,
      );
    }

    return (
      <div className="bg-white p-6 rounded-lg shadow-sm max-w-4xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-gray-200">
          <div className="flex items-center space-x-4">
            <div
              className={`w-20 h-20 rounded-full ${contact.color} flex items-center justify-center text-white text-3xl font-bold`}
            >
              {contact.avatar}
            </div>
            <div>
              <h2 className="text-3xl font-bold text-gray-900">
                {contact.name}
              </h2>
              <p
                className={`text-lg ${isClient ? "text-blue-600" : "text-gray-600"}`}
              >
                {isClient ? contact.specialty : "Appelant"}
              </p>
            </div>
          </div>
          <div className="flex space-x-2 mt-4 sm:mt-0">
            <button
              onClick={() => onEdit(contact)}
              className="p-2 bg-gray-100 rounded-lg text-gray-600 hover:bg-gray-200"
            >
              <FaEdit size={18} />
            </button>
            <button
              onClick={() => onDelete(contact.id)}
              className="p-2 bg-red-50 rounded-lg text-red-600 hover:bg-red-100"
            >
              <FaTrash size={18} />
            </button>
          </div>
        </div>
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
          <InfoItem
            icon={<FaPhone />}
            label="Téléphone"
            value={contact.phone || "Non renseigné"}
          />
          <InfoItem
            icon={<FaEnvelope />}
            label="Email"
            value={contact.email || "Non renseigné"}
          />
          {isClient ? (
            <>
              <InfoItem
                icon={<FaMapMarkerAlt />}
                label="Adresse"
                value={contact.address || "Non renseignée"}
              />
              <InfoItem
                icon={<FaBuilding />}
                label="Cabinet"
                value={contact.name}
              />
              <InfoItem
                icon={<FaBirthdayCake />}
                label="Date de naissance"
                value={contact.birthDate || "Non renseignée"}
              />
            </>
          ) : (
            <>
              <InfoItem
                icon={<FaBirthdayCake />}
                label="Date de naissance"
                value={contact.birthDate}
              />
              <div className="flex items-start space-x-3">
                <div className="text-gray-400 mt-1">
                  <FaUserMd />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    Médecin traitant
                  </p>
                  {linkedClientDetails ? (
                    <>
                      <p className="text-base text-gray-800">
                        {linkedClientDetails.name}
                      </p>
                      <p className="text-sm text-blue-600 italic">
                        {linkedClientDetails.specialty}
                      </p>
                    </>
                  ) : (
                    <p className="text-base text-gray-800">
                      {contact.linkedClient
                        ? "Médecin inconnu"
                        : "Non spécifié"}
                    </p>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    );
  };

  const InfoItem = ({ icon, label, value }) => (
    <div className="flex items-start space-x-3">
      <div className="text-gray-400 mt-1">{icon}</div>
      <div>
        <p className="text-sm font-medium text-gray-500">{label}</p>
        <p className="text-base text-gray-800">{value}</p>
      </div>
    </div>
  );

  return (
    <div className="flex flex-1 overflow-hidden relative">
      <div className="w-96 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-4 border-b border-gray-200">
          <div className="relative">
            <input
              type="text"
              placeholder="Rechercher..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-100 rounded-lg focus:ring-2 focus:ring-blue-500 focus:bg-white"
            />
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          </div>
        </div>
        <div className="p-4 border-b border-gray-200">
          <button
            onClick={handleOpenAddModal}
            className="w-full flex items-center justify-center space-x-2 py-2 px-4 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700"
          >
            <FaPlus />
            <span>
              {activeTab === "clients"
                ? "Ajouter un client"
                : "Ajouter un appelant"}
            </span>
          </button>
        </div>
        <div className="p-4 border-b border-gray-200">
          <div className="flex bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setActiveTab("clients")}
              className={`flex-1 py-2 rounded-md text-sm font-semibold ${activeTab === "clients" ? "bg-white shadow" : "text-gray-600"}`}
            >
              Clients
            </button>
            <button
              onClick={() => setActiveTab("appelants")}
              className={`flex-1 py-2 rounded-md text-sm font-semibold ${activeTab === "appelants" ? "bg-white shadow" : "text-gray-600"}`}
            >
              Appelants
            </button>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto">
          {filteredContacts.map((contact) => (
            <div
              key={contact.id}
              onClick={() => setSelectedContact(contact)}
              className={`flex items-center p-3 space-x-3 cursor-pointer ${selectedContact?.id === contact.id ? "bg-blue-50" : "hover:bg-gray-50"}`}
            >
              <div
                className={`w-10 h-10 rounded-full ${contact.color} flex-shrink-0 flex items-center justify-center font-bold text-white`}
              >
                {contact.avatar}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-gray-800 truncate">
                  {contact.name}
                </p>
                <p className="text-sm text-gray-500 truncate">
                  {contact.type === "client"
                    ? contact.specialty
                    : contact.phone}
                </p>
              </div>
            </div>
          ))}
          {filteredContacts.length === 0 && (
            <p className="p-4 text-center text-gray-500">
              Aucun contact trouvé.
            </p>
          )}
        </div>
      </div>
      <div className="flex-1 p-6 overflow-y-auto bg-gray-50">
        <ContactDetails
          contact={selectedContact}
          onEdit={handleOpenEditModal}
          onDelete={handleDeleteContact}
          clientList={clientList}
        />
      </div>
      <ClientFormModal
        isOpen={isClientModalOpen}
        onClose={handleCloseModals}
        onSubmit={handleClientSubmit}
        initialData={contactToEdit?.type === "client" ? contactToEdit : null}
      />
      <AppelantFormModal
        isOpen={isAppelantModalOpen}
        onClose={handleCloseModals}
        onSubmit={handleAppelantSubmit}
        initialData={contactToEdit?.type === "appelant" ? contactToEdit : null}
        clientList={clientList}
      />
    </div>
  );
}
