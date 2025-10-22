// src/pages/NotificationsPage.jsx

import React, { useState, useMemo } from 'react';
// Importation des icônes
import {
  FaBell, FaTasks, FaPhone, FaCommentDots, FaUserPlus, FaCheckDouble
} from 'react-icons/fa';

// --- Données Fictives ---
const mockNotifications = [
  {
    id: 1,
    type: 'call',
    icon: <FaPhone className="text-red-500" />,
    text: "Appel manqué de 01 23 45 67 89",
    timestamp: 'Il y a 5 min',
    read: false
  },
  {
    id: 2,
    type: 'message',
    icon: <FaCommentDots className="text-blue-500" />,
    text: "Nouveau message vocal de M. DURAND",
    timestamp: 'Il y a 15 min',
    read: false
  },
  {
    id: 3,
    type: 'task',
    icon: <FaTasks className="text-purple-500" />,
    text: "Nouvelle tâche assignée : Rédiger facture M. Durand",
    timestamp: 'Il y a 1 heure',
    read: true
  },
  {
    id: 4,
    type: 'contact',
    icon: <FaUserPlus className="text-green-500" />,
    text: "Nouveau patient 'Mme. Alice Martin' a été ajouté.",
    timestamp: 'Hier, 14:30',
    read: true
  },
];
// -------------------------

export default function NotificationsPage() {
  const [activeTab, setActiveTab] = useState('all'); // 'all' or 'unread'
  
  // Logique pour filtrer la liste
  const filteredNotifications = useMemo(() => {
    if (activeTab === 'unread') {
      return mockNotifications.filter(n => !n.read);
    }
    return mockNotifications;
  }, [activeTab]);

  return (
    <div className="flex-1 p-6 overflow-y-auto bg-gray-50">
      <div className="max-w-3xl mx-auto">
        
        {/* En-tête de la page */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Notifications</h1>
          <button className="flex items-center gap-2 text-sm font-medium text-blue-600 hover:underline">
            <FaCheckDouble />
            Marquer tout comme lu
          </button>
        </div>

        {/* Onglets */}
        <div className="flex border-b border-gray-200 mb-4">
          <button
            onClick={() => setActiveTab('all')}
            className={`py-2 px-4 text-sm font-medium ${activeTab === 'all' ? 'text-gray-800 border-b-2 border-gray-800' : 'text-gray-500'}`}
          >
            Toutes
          </button>
          <button
            onClick={() => setActiveTab('unread')}
            className={`py-2 px-4 text-sm font-medium ${activeTab === 'unread' ? 'text-gray-800 border-b-2 border-gray-800' : 'text-gray-500'}`}
          >
            Non lues
          </button>
        </div>

        {/* Liste des notifications */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 divide-y divide-gray-200">
          {filteredNotifications.length > 0 ? (
            filteredNotifications.map(notif => (
              <div key={notif.id} className="flex items-start p-4 space-x-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                  {notif.icon}
                </div>
                <div className="flex-1">
                  <p className="text-gray-800">{notif.text}</p>
                  <p className="text-sm text-gray-500">{notif.timestamp}</p>
                </div>
                {!notif.read && (
                  <div className="w-3 h-3 bg-blue-500 rounded-full flex-shrink-0 mt-1"></div>
                )}
              </div>
            ))
          ) : (
            <p className="p-6 text-center text-gray-500">Vous n'avez aucune nouvelle notification.</p>
          )}
        </div>

      </div>
    </div>
  );
}