// src/pages/HomePage.jsx

import React from 'react';
// Vous pouvez importer vos propres icônes ou une bibliothèque comme react-icons
import { FaTasks, FaCalendarAlt, FaCommentDots, FaPhoneAlt } from 'react-icons/fa';

// ----- Données fictives -----
// Remplacez-les par vos vraies données (state, props, ou fetch API)
const tasks = [
  { id: 1, text: "Rappeler M.BOYE", label: "Note: LED Télétravail" },
  { id: 2, text: "Rédiger facture M. Durand", label: "Ajouter option SMS" },
  { id: 3, text: "Traiter demandes Dr.DUPONT", label: "Note..." },
];

const appointments = [
  { id: 1, time: "09:00", name: "RDV M. Dupont" },
  { id: 2, time: "11:00", name: "Réunion" },
  { id: 3, time: "12:00", name: "RDV Mme. MARTIN" },
];

const messages = [
  { id: 1, from: "M. DURAND", snippet: "Veuillez prendre RDV avec le Dr FABRE..." },
  { id: 2, from: "01 23 45 67 89", snippet: "Bonjour, je vous contacte..." },
];

const missedCalls = [
    { id: 1, from: "01 23 45 67 89", time: "5 min" },
];
// -----------------------------


const HomePage = () => {
  return (
    // Conteneur principal avec padding
    <div className="p-6 md:p-8 h-full overflow-y-auto bg-gray-50">

      {/* Titre de la page */}
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Tableau de bord</h1>

      {/* Grille de Widgets */}
      {/* S'adapte en 2 colonnes sur écrans moyens, et 3 sur grands écrans */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">

        {/* --- Widget Tâches --- */}
        <div className="bg-white p-5 rounded-lg shadow-sm">
          <h2 className="text-xl font-semibold text-gray-700 mb-4 flex items-center">
            <FaTasks className="mr-3 text-blue-500" />
            Tâches en cours
          </h2>
          <ul className="space-y-3">
            {/* Affiche les 3 premières tâches "À faire" ou "En cours" */}
            {tasks.slice(0, 3).map(task => (
              <li key={task.id} className="p-3 bg-gray-50 rounded-md border border-gray-200">
                <p className="font-medium text-gray-900">{task.text}</p>
                <span className="text-sm text-gray-500">{task.label}</span>
              </li>
            ))}
            {tasks.length === 0 && <p className="text-gray-500">Aucune tâche en cours.</p>}
          </ul>
          <button className="mt-4 text-sm font-medium text-blue-600 hover:underline">
            Voir toutes les tâches &rarr;
          </button>
        </div>

        {/* --- Widget Rendez-vous --- */}
        <div className="bg-white p-5 rounded-lg shadow-sm">
          <h2 className="text-xl font-semibold text-gray-700 mb-4 flex items-center">
            <FaCalendarAlt className="mr-3 text-green-500" />
            Prochains RDV (Aujourd'hui)
          </h2>
          <ul className="space-y-3">
            {/* Affiche les 3 prochains RDV */}
            {appointments.slice(0, 3).map(appt => (
              <li key={appt.id} className="p-3 bg-gray-50 rounded-md border border-gray-200">
                <p className="font-medium text-gray-900">
                  <span className="text-green-600">{appt.time}</span> - {appt.name}
                </p>
              </li>
            ))}
            {appointments.length === 0 && <p className="text-gray-500">Aucun RDV prévu aujourd'hui.</p>}
          </ul>
          <button className="mt-4 text-sm font-medium text-blue-600 hover:underline">
            Ouvrir le calendrier &rarr;
          </button>
        </div>

        {/* --- Widget Messages Récents --- */}
        <div className="bg-white p-5 rounded-lg shadow-sm">
          <h2 className="text-xl font-semibold text-gray-700 mb-4 flex items-center">
            <FaCommentDots className="mr-3 text-purple-500" />
            Messages non lus
          </h2>
          <ul className="space-y-3">
            {messages.map(msg => (
              <li key={msg.id} className="p-3 bg-gray-50 rounded-md border border-gray-200 truncate">
                <p className="font-medium text-gray-900">{msg.from}</p>
                <p className="text-sm text-gray-600 truncate">{msg.snippet}</p>
              </li>
            ))}
            {messages.length === 0 && <p className="text-gray-500">Aucun nouveau message.</p>}
          </ul>
          <button className="mt-4 text-sm font-medium text-blue-600 hover:underline">
            Ouvrir la messagerie &rarr;
          </button>
        </div>

        {/* --- Widget Appels Manqués (optionnel) --- */}
        <div className="bg-white p-5 rounded-lg shadow-sm md:col-span-1">
          <h2 className="text-xl font-semibold text-gray-700 mb-4 flex items-center">
            <FaPhoneAlt className="mr-3 text-red-500" />
            Appels manqués
          </h2>
           <ul className="space-y-3">
            {missedCalls.map(call => (
              <li key={call.id} className="p-3 bg-red-50 rounded-md border border-red-200">
                <p className="font-medium text-gray-900">{call.from}</p>
                <span className="text-sm text-gray-500">Il y a {call.time}</span>
              </li>
            ))}
             {missedCalls.length === 0 && <p className="text-gray-500">Aucun appel manqué.</p>}
          </ul>
          <button className="mt-4 text-sm font-medium text-blue-600 hover:underline">
            Voir l'historique &rarr;
          </button>
        </div>

      </div>
    </div>
  );
};

export default HomePage;