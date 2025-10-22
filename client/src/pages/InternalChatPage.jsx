// src/pages/InternalChatPage.jsx

import React, { useState, useMemo } from 'react';
// Importation des icônes
import {
  FaSearch, FaPaperPlane, FaUserCircle, FaCircle
} from 'react-icons/fa';

// --- Données Fictives ---
const colleagues = [
  { 
    id: 1, 
    name: 'John DOE', 
    avatar: <div className="w-10 h-10 rounded-full bg-gray-800"></div>, 
    status: 'online', 
    lastMessage: 'Ok, je m\'en occupe.' 
  },
  { 
    id: 2, 
    name: 'Marie CLAIRE', 
    avatar: <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold">M</div>, 
    status: 'offline', 
    lastMessage: 'Tu peux prendre l\'appel du Dr. Martin ?' 
  },
  { 
    id: 3, 
    name: 'Admin Système', 
    avatar: <div className="w-10 h-10 rounded-full bg-red-500 flex items-center justify-center text-white font-bold">A</div>, 
    status: 'offline', 
    lastMessage: 'Mise à jour du serveur ce soir.' 
  },
];

const messages = {
  1: [
    { from: 'John DOE', text: 'Salut, tu as pu voir pour le dossier Durand ?', time: '14:30' },
    { from: 'me', text: 'Oui, je viens de lui envoyer la facture.', time: '14:31' },
    { from: 'John DOE', text: 'Parfait, merci !', time: '14:31' },
    { from: 'John DOE', text: 'Ok, je m\'en occupe.', time: '14:32' },
  ],
  2: [
    { from: 'Marie CLAIRE', text: 'Tu peux prendre l\'appel du Dr. Martin ?', time: '11:05' },
  ],
  3: [
    { from: 'Admin Système', text: 'Mise à jour du serveur ce soir.', time: '09:15' },
  ],
};
// -------------------------

export default function InternalChatPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedChat, setSelectedChat] = useState(colleagues[0]);
  
  const currentMessages = messages[selectedChat.id] || [];

  return (
    <div className="flex flex-1 overflow-hidden">
      
      {/* --- Colonne de Gauche : Liste des Collègues --- */}
      <div className="w-96 bg-white border-r border-gray-200 flex flex-col">
        {/* En-tête et Recherche */}
        <div className="p-4 border-b border-gray-200">
           <h1 className="text-xl font-bold text-gray-800 mb-4">Chat Interne</h1>
          <div className="relative">
            <input
              type="text"
              placeholder="Rechercher un collègue..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-100 rounded-lg border border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
            />
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          </div>
        </div>

        {/* Liste des contacts */}
        <div className="flex-1 overflow-y-auto">
          {colleagues.filter(c => c.name.toLowerCase().includes(searchTerm.toLowerCase())).map(colleague => (
            <div
              key={colleague.id}
              onClick={() => setSelectedChat(colleague)}
              className={`flex items-center p-3 space-x-3 cursor-pointer ${selectedChat?.id === colleague.id ? 'bg-blue-50' : 'hover:bg-gray-50'}`}
            >
              <div className="relative">
                {colleague.avatar}
                <FaCircle className={`absolute bottom-0 right-0 w-3 h-3 border-2 border-white rounded-full ${colleague.status === 'online' ? 'text-green-500' : 'text-gray-400'}`} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-gray-800 truncate">{colleague.name}</p>
                <p className="text-sm text-gray-500 truncate">{colleague.lastMessage}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* --- Colonne de Droite : Fenêtre de Chat --- */}
      <div className="flex-1 flex flex-col bg-gray-50">
        {/* En-tête du chat */}
        <div className="h-16 bg-white border-b border-gray-200 flex items-center px-6 space-x-3">
            {selectedChat.avatar}
            <div>
                <p className="font-semibold text-gray-800">{selectedChat.name}</p>
                <p className="text-sm text-green-500 font-medium">{selectedChat.status === 'online' ? 'En ligne' : 'Hors ligne'}</p>
            </div>
        </div>
        
        {/* Messages */}
        <div className="flex-1 p-6 overflow-y-auto space-y-4">
            {currentMessages.map((msg, index) => (
                <div key={index} className={`flex ${msg.from === 'me' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`p-3 rounded-lg max-w-lg ${msg.from === 'me' ? 'bg-gray-800 text-white' : 'bg-white shadow-sm'}`}>
                        {msg.text}
                        <p className="text-xs mt-1 opacity-70 text-right">{msg.time}</p>
                    </div>
                </div>
            ))}
        </div>
        
        {/* Champ de saisie */}
        <div className="p-4 bg-white border-t border-gray-200">
            <div className="relative flex">
                <input 
                    type="text"
                    placeholder="Envoyer un message..."
                    className="flex-1 pl-4 pr-12 py-3 bg-gray-100 rounded-lg border border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button className="absolute right-2 top-1/2 -translate-y-1/2 p-3 bg-gray-800 text-white rounded-lg hover:bg-gray-700">
                    <FaPaperPlane />
                </button>
            </div>
        </div>
      </div>

    </div>
  );
}