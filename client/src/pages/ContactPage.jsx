// src/pages/ContactPage.jsx

import React, { useState, useMemo } from 'react';
// Importation des icônes
import {
  FaSearch, FaUserMd, FaUser, FaPhone, FaEnvelope,
  FaMapMarkerAlt, FaBirthdayCake, FaEdit, FaTrash, FaBuilding
} from 'react-icons/fa';

// --- Données Fictives ---
const mockContacts = [
  // Clients (Médecins, Kinés, etc.)
  {
    id: 'c1',
    type: 'client',
    name: 'Dr. Martin Dupont',
    specialty: 'Médecin Généraliste',
    avatar: 'M',
    color: 'bg-blue-600',
    phone: '01 23 45 67 89',
    email: 'martin.dupont@cabinet.fr',
    address: '12 Rue de la Paix, 75001 Paris'
  },
  {
    id: 'c2',
    type: 'client',
    name: 'Mme. Sophie Lefevre',
    specialty: 'Kinésithérapeute',
    avatar: 'S',
    color: 'bg-green-600',
    phone: '04 98 76 54 32',
    email: 'sophie.lefevre@kine.fr',
    address: '34 Avenue des Pins, 13008 Marseille'
  },
  // Patients
  {
    id: 'p1',
    type: 'patient',
    name: 'M. DURAND Patrice',
    avatar: 'P',
    color: 'bg-gray-700',
    phone: '07 66 55 44 33',
    email: 'durand.patrice@gmail.com',
    birthDate: '01/01/1980',
    linkedClient: 'Dr. Martin Dupont'
  },
  {
    id: 'p2',
    type: 'patient',
    name: 'Mme. Alice Martin',
    avatar: 'A',
    color: 'bg-purple-700',
    phone: '06 11 22 33 44',
    email: 'alice.martin@email.com',
    birthDate: '15/06/1992',
    linkedClient: 'Mme. Sophie Lefevre'
  }
];
// -------------------------

export default function ContactPage() {
  const [activeTab, setActiveTab] = useState('clients'); // 'clients' or 'patients'
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedContact, setSelectedContact] = useState(mockContacts[0]); // Sélectionne le 1er contact par défaut

  // Logique pour filtrer la liste de contacts
  const filteredContacts = useMemo(() => {
    return mockContacts.filter(contact => {
      const matchesTab = contact.type === activeTab;
      const matchesSearch = contact.name.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesTab && matchesSearch;
    });
  }, [activeTab, searchTerm]);

  // Le composant qui affiche la "Fiche Contact" détaillée
  const ContactDetails = ({ contact }) => {
    if (!contact) {
      return (
        <div className="flex items-center justify-center h-full text-gray-500">
          Sélectionnez un contact pour voir les détails
        </div>
      );
    }

    const isClient = contact.type === 'client';

    return (
      <div className="bg-white p-6 rounded-lg shadow-sm max-w-4xl mx-auto">
        {/* --- En-tête de la fiche --- */}
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
            <button className="p-2 bg-gray-100 rounded-lg text-gray-600 hover:bg-gray-200">
              <FaEdit size={18} />
            </button>
            <button className="p-2 bg-red-50 rounded-lg text-red-600 hover:bg-red-100">
              <FaTrash size={18} />
            </button>
          </div>
        </div>

        {/* --- Informations détaillées --- */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
          <InfoItem icon={<FaPhone />} label="Téléphone" value={contact.phone} />
          <InfoItem icon={<FaEnvelope />} label="Email" value={contact.email} />

          {isClient ? (
            // Infos spécifiques au CLIENT
            <>
              <InfoItem icon={<FaMapMarkerAlt />} label="Adresse" value={contact.address} />
              <InfoItem icon={<FaBuilding />} label="Cabinet" value={contact.name} />
            </>
          ) : (
            // Infos spécifiques au PATIENT
            <>
              <InfoItem icon={<FaBirthdayCake />} label="Date de naissance" value={contact.birthDate} />
              <InfoItem icon={<FaUserMd />} label="Médecin traitant" value={contact.linkedClient} />
            </>
          )}
        </div>
      </div>
    );
  };

  // Petit composant pour une ligne d'info (icône + label + valeur)
  const InfoItem = ({ icon, label, value }) => (
    <div className="flex items-start space-x-3">
      <div className="text-gray-400 mt-1">{icon}</div>
      <div>
        <p className="text-sm font-medium text-gray-500">{label}</p>
        <p className="text-base text-gray-800">{value}</p>
      </div>
    </div>
  );

  // Rendu principal de la page
  return (
    <div className="flex flex-1 overflow-hidden">
      
      {/* --- Colonne de Gauche : Liste & Recherche --- */}
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

      {/* --- Colonne de Droite : Fiche Contact Détaillée --- */}
      <div className="flex-1 p-6 overflow-y-auto bg-gray-50">
        <ContactDetails contact={selectedContact} />
      </div>

    </div>
  );
}