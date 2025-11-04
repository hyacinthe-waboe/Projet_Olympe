// src/pages/ContactPage.jsx

import React, { useState, useMemo, useEffect } from 'react';
import {
  FaSearch, FaUserMd, FaPhone, FaEnvelope,
  FaMapMarkerAlt, FaBirthdayCake, FaEdit, FaTrash, FaBuilding,
  FaPlus, FaTimes
} from 'react-icons/fa';

// --- Données Fictives Initiales ---
const initialContacts = [
  { id: 'c1', type: 'client', name: 'Dr. Martin Dupont', specialty: 'Médecin Généraliste', avatar: 'M', color: 'bg-blue-600', phone: '01 23 45 67 89', email: 'martin.dupont@cabinet.fr', address: '12 Rue de la Paix, 75001 Paris' },
  { id: 'c2', type: 'client', name: 'Mme. Sophie Lefevre', specialty: 'Kinésithérapeute', avatar: 'S', color: 'bg-green-600', phone: '04 98 76 54 32', email: 'sophie.lefevre@kine.fr', address: '34 Avenue des Pins, 13008 Marseille' },
  { id: 'p1', type: 'patient', name: 'M. DURAND Patrice', avatar: 'P', color: 'bg-gray-700', phone: '07 66 55 44 33', email: 'durand.patrice@gmail.com', birthDate: '1980-01-01', linkedClient: 'c1' },
];
// -------------------------


// --- MODALE N°1 : FORMULAIRE CLIENT ---
const ClientFormModal = ({ isOpen, onClose, onSubmit, initialData }) => {

  const getInitialState = () => ({
    name: '', phone: '', email: '', specialty: '', address: ''
  });

  const [formData, setFormData] = useState(getInitialState());

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setFormData(initialData); // Mode "Edit"
      } else {
        setFormData(getInitialState()); // Mode "Add"
      }
    }
  }, [isOpen, initialData]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
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
            <button type="button" onClick={onClose} className="text-gray-400 hover:text-gray-600">
              <FaTimes size={20} />
            </button>
          </div>
          <div className="p-6 space-y-4">
            <FormInput label="Nom complet" name="name" value={formData.name || ''} onChange={handleChange} required />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormInput label="Téléphone" name="phone" value={formData.phone || ''} onChange={handleChange} />
              <FormInput label="Email" name="email" type="email" value={formData.email || ''} onChange={handleChange} />
            </div>
            <hr className="my-2" />
            <FormInput label="Spécialité (ex: Kinésithérapeute)" name="specialty" value={formData.specialty || ''} onChange={handleChange} />
            <FormInput label="Adresse" name="address" value={formData.address || ''} onChange={handleChange} />
          </div>
          <div className="flex justify-end items-center p-4 bg-gray-50 border-t rounded-b-lg">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-white text-gray-700 border border-gray-300 rounded-lg mr-2 hover:bg-gray-50">
              Annuler
            </button>
            <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              Valider
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};


// --- MODALE N°2 : FORMULAIRE PATIENT ---
const PatientFormModal = ({ isOpen, onClose, onSubmit, initialData, clientList = [] }) => {

  const getInitialState = () => ({
    name: '', phone: '', email: '', birthDate: '',
    linkedClientName: '' // Champ temporaire pour l'autocomplétion
  });

  const [formData, setFormData] = useState(getInitialState());

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        // Mode "Edit" : On a un ID, il faut trouver le nom
        const client = clientList.find(c => c.id === initialData.linkedClient);
        setFormData({
          ...initialData,
          linkedClientName: client ? client.name : '' // Afficher le nom
        });
      } else {
        // Mode "Add"
        setFormData(getInitialState());
      }
    }
  }, [isOpen, initialData, clientList]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData); // On envoie le formData (avec 'linkedClientName')
  };

  const modalTitle = initialData ? "Modifier le Patient" : "Ajouter un Patient";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-lg mx-4">
        <form onSubmit={handleSubmit}>
          <div className="flex justify-between items-center p-4 border-b">
            <h3 className="text-xl font-semibold">{modalTitle}</h3>
            <button type="button" onClick={onClose} className="text-gray-400 hover:text-gray-600">
              <FaTimes size={20} />
            </button>
          </div>
          <div className="p-6 space-y-4">
            <FormInput label="Nom complet" name="name" value={formData.name || ''} onChange={handleChange} required />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormInput label="Téléphone" name="phone" value={formData.phone || ''} onChange={handleChange} />
              <FormInput label="Email" name="email" type="email" value={formData.email || ''} onChange={handleChange} />
            </div>
            <hr className="my-2" />
            <FormInput label="Date de naissance" name="birthDate" type="date" value={formData.birthDate || ''} onChange={handleChange} />

            {/* Champ d'autocomplétion */}
            <FormInput
              label="Médecin traitant (tapez pour voir les suggestions)"
              name="linkedClientName" // On modifie le nom du médecin
              value={formData.linkedClientName || ''}
              onChange={handleChange}
              list="client-datalist" // On lie l'input au datalist
            />

            {/* La Datalist n'est rendue que si des clients existent */}
            {clientList.length > 0 && (
              <datalist id="client-datalist">
                {clientList.map(client => (
                  <option key={client.id} value={client.name}>
                    {client.specialty}
                  </option>
                ))}
              </datalist>
            )}

          </div>
          <div className="flex justify-end items-center p-4 bg-gray-50 border-t rounded-b-lg">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-white text-gray-700 border border-gray-300 rounded-lg mr-2 hover:bg-gray-50">
              Annuler
            </button>
            <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              Valider
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// --- Composant Helper pour les Inputs ---
const FormInput = ({ label, name, type = 'text', value, onChange, required = false, list = null }) => (
  <div>
    <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <input
      type={type}
      id={name}
      name={name}
      value={value}
      onChange={onChange}
      required={required}
      list={list} // Ajout de la prop 'list' pour le datalist
      className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
    />
  </div>
);


// --- COMPOSANT PRINCIPAL DE LA PAGE ---
export default function ContactPage() {
  const [activeTab, setActiveTab] = useState('clients'); // 'clients' | 'patients'
  const [searchTerm, setSearchTerm] = useState('');

  const [contacts, setContacts] = useState(initialContacts);
  const [selectedContact, setSelectedContact] = useState(initialContacts[0]);

  // Deux états pour deux modales
  const [isClientModalOpen, setIsClientModalOpen] = useState(false);
  const [isPatientModalOpen, setIsPatientModalOpen] = useState(false);

  const [contactToEdit, setContactToEdit] = useState(null);

  // Liste mémorisée des clients (pour la dropdown/datalist)
  const clientList = useMemo(
    () => contacts.filter(c => c.type === 'client'),
    [contacts]
  );

  // Liste filtrée pour l'affichage à gauche (CORRIGÉE)
  const filteredContacts = useMemo(() => {
    const desiredType = activeTab === 'clients' ? 'client' : 'patient';
    const term = searchTerm.toLowerCase();
    return contacts.filter(contact =>
      contact.type === desiredType &&
      contact.name.toLowerCase().includes(term)
    );
  }, [activeTab, searchTerm, contacts]);

  // Sélectionner automatiquement un élément pertinent quand la liste filtrée change
  useEffect(() => {
    if (filteredContacts.length === 0) {
      setSelectedContact(null);
      return;
    }
    // si l'élément sélectionné n'est pas dans la liste filtrée, sélectionner le premier
    if (!selectedContact || !filteredContacts.some(c => c.id === selectedContact.id)) {
      setSelectedContact(filteredContacts[0]);
    }
  }, [filteredContacts]); // eslint-disable-line react-hooks/exhaustive-deps

  // --- GESTION DES MODALES ---

  const handleOpenAddModal = () => {
    setContactToEdit(null); // Mode "Ajout"
    if (activeTab === 'clients') {
      setIsClientModalOpen(true);
    } else {
      setIsPatientModalOpen(true);
    }
  };

  const handleOpenEditModal = (contact) => {
    setContactToEdit(contact); // Mode "Edit"
    if (contact.type === 'client') {
      setIsClientModalOpen(true);
    } else {
      setIsPatientModalOpen(true);
    }
  };

  const handleCloseModals = () => {
    setIsClientModalOpen(false);
    setIsPatientModalOpen(false);
    setContactToEdit(null);
  };

  const handleDeleteContact = (contactId) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer ce contact ?")) {
      setContacts(prevContacts =>
        prevContacts.filter(contact => contact.id !== contactId)
      );
      if (selectedContact && selectedContact.id === contactId) {
        setSelectedContact(null);
      }
    }
  };

  // --- GESTION DES SOUMISSIONS ---

  const handleClientSubmit = (formData) => {
    if (contactToEdit) {
      // --- Logique de MODIFICATION (Client) ---
      const updatedContact = { ...contactToEdit, ...formData };
      setContacts(prev => prev.map(c => c.id === contactToEdit.id ? updatedContact : c));
      setSelectedContact(updatedContact);
      setSearchTerm(''); // Vider la recherche
    } else {
      // --- Logique d'AJOUT (Client) ---
      const newContact = {
        ...formData,
        id: `c_${Date.now()}`,
        type: 'client',
        avatar: (formData.name?.charAt(0) || '?').toUpperCase(),
        color: 'bg-green-600',
      };
      setContacts(prev => [newContact, ...prev]);
      setSelectedContact(newContact);

      // Réinitialiser
      setSearchTerm('');
      setActiveTab('clients'); // s'assurer d'être sur l'onglet Clients
    }
    handleCloseModals();
  };

  const handlePatientSubmit = (formData) => {
    // Convertir le 'linkedClientName' en 'linkedClient' (ID)
    const matchingClient = clientList.find(c => c.name === formData.linkedClientName);

    const finalPatientData = {
      ...formData,
      linkedClient: matchingClient ? matchingClient.id : null, // On stocke l'ID
    };
    delete finalPatientData.linkedClientName; // On supprime le champ temporaire

    if (contactToEdit) {
      // --- Logique de MODIFICATION (Patient) ---
      const updatedContact = { ...contactToEdit, ...finalPatientData };
      setContacts(prev => prev.map(c => c.id === contactToEdit.id ? updatedContact : c));
      setSelectedContact(updatedContact);
      setSearchTerm(''); // Vider la recherche
    } else {
      // --- Logique d'AJOUT (Patient) ---
      const newContact = {
        ...finalPatientData,
        id: `p_${Date.now()}`,
        type: 'patient',
        avatar: (formData.name?.charAt(0) || '?').toUpperCase(),
        color: 'bg-purple-600',
      };
      setContacts(prev => [newContact, ...prev]);
      setSelectedContact(newContact);

      // Réinitialiser
      setSearchTerm('');
      setActiveTab('patients'); // s'assurer d'être sur l'onglet Patients
    }
    handleCloseModals();
  };


  // --- Composant Fiche Détaillée ---
  const ContactDetails = ({ contact, onEdit, onDelete, clientList }) => {
    if (!contact) {
      return (
        <div className="flex items-center justify-center h-full text-gray-500">
          Sélectionnez un contact pour voir les détails
        </div>
      );
    }
    const isClient = contact.type === 'client';

    // Trouver les détails du médecin lié (si c'est un patient)
    let linkedClientDetails = null;
    if (!isClient && contact.linkedClient) {
      linkedClientDetails = clientList.find(c => c.id === contact.linkedClient);
    }

    return (
      <div className="bg-white p-6 rounded-lg shadow-sm max-w-4xl mx-auto">
        {/* En-tête de la fiche */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-gray-200">
          <div className="flex items-center space-x-4">
            <div className={`w-20 h-20 rounded-full ${contact.color} flex items-center justify-center text-white text-3xl font-bold`}>
              {contact.avatar}
            </div>
            <div>
              <h2 className="text-3xl font-bold text-gray-900">{contact.name}</h2>
              <p className={`text-lg ${isClient ? 'text-blue-600' : 'text-gray-600'}`}>
                {isClient ? contact.specialty : 'Patient'}
              </p>
            </div>
          </div>
          <div className="flex space-x-2 mt-4 sm:mt-0">
            <button onClick={() => onEdit(contact)} className="p-2 bg-gray-100 rounded-lg text-gray-600 hover:bg-gray-200">
              <FaEdit size={18} />
            </button>
            <button onClick={() => onDelete(contact.id)} className="p-2 bg-red-50 rounded-lg text-red-600 hover:bg-red-100">
              <FaTrash size={18} />
            </button>
          </div>
        </div>

        {/* Informations détaillées */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
          <InfoItem icon={<FaPhone />} label="Téléphone" value={contact.phone} />
          <InfoItem icon={<FaEnvelope />} label="Email" value={contact.email} />

          {isClient ? (
            // Champs CLIENT
            <>
              <InfoItem icon={<FaMapMarkerAlt />} label="Adresse" value={contact.address} />
              <InfoItem icon={<FaBuilding />} label="Cabinet" value={contact.name} />
            </>
          ) : (
            // Champs PATIENT
            <>
              <InfoItem icon={<FaBirthdayCake />} label="Date de naissance" value={contact.birthDate} />
              {/* Affichage du médecin traitant */}
              <div className="flex items-start space-x-3">
                <div className="text-gray-400 mt-1"><FaUserMd /></div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Médecin traitant</p>
                  {linkedClientDetails ? (
                    <>
                      <p className="text-base text-gray-800">{linkedClientDetails.name}</p>
                      <p className="text-sm text-blue-600 italic">{linkedClientDetails.specialty}</p>
                    </>
                  ) : (
                    <p className="text-base text-gray-800">{contact.linkedClient ? 'Médecin inconnu' : 'Non spécifié'}</p>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    );
  };

  // --- Composant Helper Ligne d'Info ---
  const InfoItem = ({ icon, label, value }) => (
    <div className="flex items-start space-x-3">
      <div className="text-gray-400 mt-1">{icon}</div>
      <div>
        <p className="text-sm font-medium text-gray-500">{label}</p>
        <p className="text-base text-gray-800">{value}</p>
      </div>
    </div>
  );

  // --- Rendu principal de la page ---
  return (
    <div className="flex flex-1 overflow-hidden relative">

      {/* --- Colonne de Gauche --- */}
      <div className="w-96 bg-white border-r border-gray-200 flex flex-col">
        {/* Barre de recherche */}
        <div className="p-4 border-b border-gray-200">
          <div className="relative">
            <input
              type="text"
              placeholder="Rechercher un contact..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-100 rounded-lg border border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
            />
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          </div>
        </div>

        {/* Bouton "Ajouter" */}
        <div className="p-4 border-b border-gray-200">
          <button
            onClick={handleOpenAddModal}
            className="w-full flex items-center justify-center space-x-2 py-2 px-4 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-colors"
          >
            <FaPlus />
            <span>
              {activeTab === 'clients' ? 'Ajouter un client' : 'Ajouter un patient'}
            </span>
          </button>
        </div>

        {/* Onglets Clients / Patients */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setActiveTab('clients')}
              className={`flex-1 py-2 rounded-md text-sm font-semibold ${activeTab === 'clients' ? 'bg-white shadow' : 'text-gray-600'}`}
            >
              Clients
            </button>
            <button
              onClick={() => setActiveTab('patients')}
              className={`flex-1 py-2 rounded-md text-sm font-semibold ${activeTab === 'patients' ? 'bg-white shadow' : 'text-gray-600'}`}
            >
              Patients
            </button>
          </div>
        </div>

        {/* Liste des contacts */}
        <div className="flex-1 overflow-y-auto">
          {filteredContacts.map(contact => (
            <div
              key={contact.id}
              onClick={() => setSelectedContact(contact)}
              className={`flex items-center p-3 space-x-3 cursor-pointer ${selectedContact?.id === contact.id ? 'bg-blue-50' : 'hover:bg-gray-50'}`}
            >
              <div className={`w-10 h-10 rounded-full ${contact.color} flex-shrink-0 flex items-center justify-center font-bold text-white`}>
                {contact.avatar}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-gray-800 truncate">{contact.name}</p>
                <p className="text-sm text-gray-500 truncate">
                  {contact.type === 'client' ? contact.specialty : contact.phone}
                </p>
              </div>
            </div>
          ))}
          {filteredContacts.length === 0 && (
            <p className="p-4 text-center text-gray-500">Aucun contact trouvé.</p>
          )}
        </div>
      </div>

      {/* --- Colonne de Droite --- */}
      <div className="flex-1 p-6 overflow-y-auto bg-gray-50">
        <ContactDetails
          contact={selectedContact}
          onEdit={handleOpenEditModal}
          onDelete={handleDeleteContact}
          clientList={clientList}
        />
      </div>

      {/* --- Rendu des DEUX Modales --- */}
      <ClientFormModal
        isOpen={isClientModalOpen}
        onClose={handleCloseModals}
        onSubmit={handleClientSubmit}
        initialData={contactToEdit?.type === 'client' ? contactToEdit : null}
      />

      <PatientFormModal
        isOpen={isPatientModalOpen}
        onClose={handleCloseModals}
        onSubmit={handlePatientSubmit}
        initialData={contactToEdit?.type === 'patient' ? contactToEdit : null}
        clientList={clientList}
      />

    </div>
  );
}
