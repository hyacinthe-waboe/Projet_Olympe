// src/pages/HomePage.jsx

import React, { useState, useEffect } from 'react';
import { FaTasks, FaCalendarAlt, FaCommentDots, FaPhoneAlt } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom'; // Pour la navigation

// ----- Données fictives (Pour les parties non connectées à la BDD) -----
const initialTasks = [
  { id: 1, text: "Rappeler M.BOYE", label: "Note: LED Télétravail" },
  { id: 2, text: "Rédiger facture M. Durand", label: "Ajouter option SMS" },
  { id: 3, text: "Traiter demandes Dr.DUPONT", label: "Note..." },
];

const initialMessages = [
  { id: 1, from: "M. DURAND", snippet: "Veuillez prendre RDV avec le Dr FABRE..." },
  { id: 2, from: "01 23 45 67 89", snippet: "Bonjour, je vous contacte..." },
];

const initialMissedCalls = [
    { id: 1, from: "01 23 45 67 89", time: "5 min" },
];
// -----------------------------

const HomePage = () => {
  const navigate = useNavigate(); // Hook pour changer de page

  // --- ÉTATS (DATA) ---
  const [tasks] = useState(initialTasks); 
  const [missedCalls] = useState(initialMissedCalls);

  // Etats connectés au Backend
  const [appointments, setAppointments] = useState([]);
  const [messages, setMessages] = useState([]); 
  const [isLoading, setIsLoading] = useState(true);

  // --- CHARGEMENT DES DONNÉES (RDV + MESSAGES) ---
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // 1. Récupération des RDV
        const resRdv = await fetch('http://127.0.0.1:8000/api/dashboard', {
          credentials: 'include'
        });
        if (resRdv.ok) {
          const dataRdv = await resRdv.json();
          setAppointments(dataRdv.appointments);
        }

        // 2. Récupération des Messages Non Lus
        const resMsg = await fetch('http://127.0.0.1:8000/api/messages/unread', {
          credentials: 'include'
        });
        if (resMsg.ok) {
            const dataMsg = await resMsg.json();
            setMessages(dataMsg.messages);
        }

      } catch (error) {
        console.error("Erreur réseau:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    // Conteneur principal avec padding
    <div className="p-6 md:p-8 h-full overflow-y-auto bg-gray-50">

      {/* Titre de la page */}
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Tableau de bord</h1>

      {/* Grille de Widgets */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">

        {/* --- Widget Tâches (Statique pour l'instant) --- */}
        <div className="bg-white p-5 rounded-lg shadow-sm">
          <h2 className="text-xl font-semibold text-gray-700 mb-4 flex items-center">
            <FaTasks className="mr-3 text-blue-500" />
            Tâches en cours
          </h2>
          <ul className="space-y-3">
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

        {/* --- Widget Rendez-vous (CONNECTÉ AU BACKEND 🟢) --- */}
        <div className="bg-white p-5 rounded-lg shadow-sm">
          <h2 className="text-xl font-semibold text-gray-700 mb-4 flex items-center">
            <FaCalendarAlt className="mr-3 text-green-500" />
            Prochains RDV (Aujourd'hui)
          </h2>
          
          {isLoading ? (
            <p className="text-gray-400 italic">Chargement...</p>
          ) : (
            <ul className="space-y-3">
                {appointments.map(appt => (
                <li key={appt.id} className="p-3 bg-gray-50 rounded-md border border-gray-200">
                    <p className="font-medium text-gray-900">
                    <span className="text-green-600 font-bold">{appt.time}</span> - {appt.name}
                    </p>
                </li>
                ))}
                
                {appointments.length === 0 && (
                    <p className="text-gray-500 italic py-2">Aucun rendez-vous prévu pour le reste de la journée.</p>
                )}
            </ul>
          )}

          <button 
            onClick={() => navigate('/calendar')} // Redirection vers l'agenda
            className="mt-4 text-sm font-medium text-blue-600 hover:underline"
          >
            Ouvrir le calendrier &rarr;
          </button>
        </div>

        {/* --- Widget Messages Récents (Statique pour l'instant) --- */}
        <div className="bg-white p-5 rounded-lg shadow-sm">
          <h2 className="text-xl font-semibold text-gray-700 mb-4 flex items-center">
            <FaCommentDots className="mr-3 text-purple-500" />
            Messages non lus
          </h2>
          <ul className="space-y-3">
            {messages.map(msg => (
              <li key={msg.id} className="p-3 bg-gray-50 rounded-md border border-gray-200 truncate cursor-pointer hover:bg-gray-100 transition">
                <div className="flex justify-between items-center mb-1">
                    <span className="font-medium text-gray-900">{msg.from}</span>
                    <span className="text-xs text-gray-400">{msg.date}</span>
                </div>
                <p className="text-xs text-blue-600 font-semibold mb-1">Pour: Dr. {msg.doctorName}</p>
                <p className="text-sm text-gray-600 truncate">{msg.snippet}</p>
              </li>
            ))}
            
            {!isLoading && messages.length === 0 && (
                <p className="text-gray-500 italic py-2">Aucun nouveau message.</p>
            )}
          </ul>
          <button className="mt-4 text-sm font-medium text-blue-600 hover:underline">
            Ouvrir la messagerie &rarr;
          </button>
        </div>

        {/* --- Widget Appels Manqués (Statique pour l'instant) --- */}
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