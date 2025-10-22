// src/pages/VoicemailPage.jsx

import React, { useState, useMemo } from 'react';
// Importation des icônes
import {
  FaSearch, FaPlay, FaPause, FaArchive, FaTrash,
  FaUser, FaPhone, FaTasks, FaClock
} from 'react-icons/fa';

// --- Données Fictives ---
const mockVoicemails = [
  {
    id: 1,
    contactName: 'M. DURAND Patrice',
    number: '07 66 55 44 33',
    timestamp: 'Aujourd\'hui, 09:15',
    duration: '0:32',
    audioUrl: '#', // Lien factice vers un MP3
    transcription: "Bonjour, c'est Patrice Durand. Je n'arrive pas à joindre le Dr. Martin pour mon RDV de demain. Pourriez-vous lui demander de me rappeler s'il vous plaît ? Merci.",
    status: 'new',
    contactKnown: true
  },
  {
    id: 2,
    contactName: 'Inconnu',
    number: '06 12 34 56 78',
    timestamp: 'Hier, 16:45',
    duration: '0:12',
    audioUrl: '#',
    transcription: "Oui bonjour... euh... je rappellerai. Au revoir.",
    status: 'new',
    contactKnown: false
  },
  {
    id: 3,
    contactName: 'Mme. Alice Martin',
    number: '06 11 22 33 44',
    timestamp: 'Hier, 14:02',
    duration: '0:45',
    audioUrl: '#',
    transcription: "Bonjour, c'est Alice Martin pour le Dr. Dupont. Je confirme mon rendez-vous de vendredi à 10h. Je voulais juste être sûre que c'était bien noté. Bonne journée !",
    status: 'processed',
    contactKnown: true
  },
];
// -------------------------

export default function VoicemailPage() {
  const [activeTab, setActiveTab] = useState('new'); // 'new' or 'processed'
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedVoicemail, setSelectedVoicemail] = useState(mockVoicemails[0]);
  const [isPlaying, setIsPlaying] = useState(false);

  // Logique pour filtrer la liste
  const filteredVoicemails = useMemo(() => {
    return mockVoicemails.filter(vm => {
      const matchesTab = vm.status === activeTab;
      const matchesSearch = (vm.contactName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                             vm.number.toLowerCase().includes(searchTerm.toLowerCase()));
      return matchesTab && matchesSearch;
    });
  }, [activeTab, searchTerm]);

  // Simule la lecture audio
  const togglePlay = () => {
    setIsPlaying(!isPlaying);
    // Dans une vraie app, vous contrôleriez un <audio> element ici
  };

  // Le composant qui affiche le lecteur détaillé
  const VoicemailPlayer = ({ voicemail }) => {
    if (!voicemail) {
      return (
        <div className="flex items-center justify-center h-full text-gray-500">
          Sélectionnez un message vocal à écouter
        </div>
      );
    }

    return (
      <div className="bg-white p-6 rounded-lg shadow-sm max-w-4xl mx-auto">
        {/* --- En-tête (Contact & Actions) --- */}
        <div className="flex justify-between items-start pb-4 border-b border-gray-200">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{voicemail.contactName}</h2>
            <p className="text-lg text-gray-600">{voicemail.number}</p>
            <p className="text-sm text-gray-500 mt-1">{voicemail.timestamp}</p>
          </div>
          <div className="flex space-x-2">
            <button title="Créer une tâche" className="p-2 bg-blue-100 rounded-lg text-blue-600 hover:bg-blue-200">
              <FaTasks size={18} />
            </button>
            <button title="Archiver" className="p-2 bg-gray-100 rounded-lg text-gray-600 hover:bg-gray-200">
              <FaArchive size={18} />
            </button>
            <button title="Supprimer" className="p-2 bg-red-50 rounded-lg text-red-600 hover:bg-red-100">
              <FaTrash size={18} />
            </button>
          </div>
        </div>

        {/* --- Lecteur Audio (Factice) --- */}
        <div className="my-6 p-4 bg-gray-50 rounded-lg flex items-center space-x-4">
          <button onClick={togglePlay} className="p-3 bg-gray-800 text-white rounded-full">
            {isPlaying ? <FaPause size={16} /> : <FaPlay size={16} />}
          </button>
          <div className="flex-1 h-2 bg-gray-200 rounded-full">
            <div className="w-1/4 h-2 bg-gray-800 rounded-full"></div> {/* Fausse progression */}
          </div>
          <span className="text-sm font-medium text-gray-700">{voicemail.duration}</span>
        </div>

        {/* --- Transcription --- */}
        <div className="mt-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Transcription</h3>
          <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
            <p className="text-gray-700 leading-relaxed">{voicemail.transcription}</p>
          </div>
        </div>
      </div>
    );
  };

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
              placeholder="Rechercher un message..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-100 rounded-lg border border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
            />
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          </div>
        </div>

        {/* Onglets Nouveaux / Traités */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setActiveTab('new')}
              className={`flex-1 py-2 rounded-md text-sm font-semibold ${activeTab === 'new' ? 'bg-white shadow' : 'text-gray-600'}`}
            >
              Nouveaux
            </button>
            <button
              onClick={() => setActiveTab('processed')}
              className={`flex-1 py-2 rounded-md text-sm font-semibold ${activeTab === 'processed' ? 'bg-white shadow' : 'text-gray-600'}`}
            >
              Traités
            </button>
          </div>
        </div>

        {/* Liste des messages */}
        <div className="flex-1 overflow-y-auto">
          {filteredVoicemails.map(vm => (
            <div
              key={vm.id}
              onClick={() => {
                setSelectedVoicemail(vm);
                setIsPlaying(false); // Arrête la lecture en changeant de msg
              }}
              className={`flex items-center p-3 space-x-3 cursor-pointer relative ${selectedVoicemail?.id === vm.id ? 'bg-blue-50' : 'hover:bg-gray-50'}`}
            >
              {vm.status === 'new' && (
                <span className="absolute left-1 top-1/2 -translate-y-1/2 w-2 h-2 bg-blue-500 rounded-full"></span>
              )}
              <div className="flex-1 min-w-0 pl-3">
                <div className="flex justify-between items-center">
                   <p className="font-semibold text-gray-800 truncate">{vm.contactName}</p>
                   <p className="text-xs text-gray-500">{vm.timestamp}</p>
                </div>
                <p className="text-sm text-gray-500 truncate">{vm.transcription}</p>
              </div>
            </div>
          ))}
          {filteredVoicemails.length === 0 && (
            <p className="p-4 text-center text-gray-500">Aucun message vocal trouvé.</p>
          )}
        </div>
      </div>

      {/* --- Colonne de Droite : Lecteur Détaillé --- */}
      <div className="flex-1 p-6 overflow-y-auto bg-gray-50">
        <VoicemailPlayer voicemail={selectedVoicemail} />
      </div>

    </div>
  );
}