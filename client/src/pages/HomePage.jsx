// src/pages/HomePage.jsx

import React, { useState, useEffect } from 'react';
import { FaTasks, FaCalendarAlt, FaCommentDots, FaPhoneAlt } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

// ----- Données fictives (Pour la partie téléphone non connectée) -----
const initialMissedCalls = [
    { id: 1, from: "01 23 45 67 89", time: "5 min" },
];
// -----------------------------

const HomePage = () => {
  const navigate = useNavigate();

  // --- ÉTATS CONNECTÉS AU BACKEND ---
  const [tasks, setTasks] = useState([]); // 🟢 Nouvel état vide par défaut
  const [appointments, setAppointments] = useState([]);
  const [messages, setMessages] = useState([]); 
  const [isLoading, setIsLoading] = useState(true);

  // État statique
  const [missedCalls] = useState(initialMissedCalls);

  // --- CHARGEMENT DES DONNÉES (RDV + MESSAGES + TÂCHES) ---
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // 1. Récupération des RDV
        const resRdv = await fetch('http://127.0.0.1:8000/api/dashboard', { credentials: 'include' });
        if (resRdv.ok) {
          const dataRdv = await resRdv.json();
          setAppointments(dataRdv.appointments);
        }

        // 2. Récupération des Messages Non Lus
        const resMsg = await fetch('http://127.0.0.1:8000/api/messages/unread', { credentials: 'include' });
        if (resMsg.ok) {
            const dataMsg = await resMsg.json();
            setMessages(dataMsg.messages);
        }

        // 3. 🟢 NOUVEAU : Récupération des Tâches
        const resTasks = await fetch('http://127.0.0.1:8000/api/tasks', { credentials: 'include' });
        if (resTasks.ok) {
            const dataTasks = await resTasks.json();
            // On filtre pour ne garder QUE celles qui ne sont pas terminées
            const activeTasks = dataTasks.filter(t => !t.isDone);
            setTasks(activeTasks);
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
    <div className="p-6 md:p-8 h-full overflow-y-auto bg-gray-50">

      <h1 className="text-3xl font-bold text-gray-800 mb-6">Tableau de bord</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">

        {/* --- Widget Tâches (CONNECTÉ AU BACKEND 🟢) --- */}
        <div className="bg-white p-5 rounded-lg shadow-sm flex flex-col">
          <h2 className="text-xl font-semibold text-gray-700 mb-4 flex items-center">
            <FaTasks className="mr-3 text-blue-500" />
            Tâches en cours
          </h2>
          
          <div className="flex-1">
              {isLoading ? (
                <p className="text-gray-400 italic">Chargement...</p>
              ) : (
                <ul className="space-y-3">
                  {/* On n'affiche que les 3 premières tâches avec .slice(0, 3) */}
                  {tasks.slice(0, 3).map(task => (
                    <li key={task.id} className="p-3 bg-gray-50 rounded-md border border-gray-200">
                      <p className="font-medium text-gray-900 truncate">{task.title}</p>
                      {/* On affiche le nom du créateur grâce à notre mode Supervision ! */}
                      <span className="text-xs text-gray-500 font-medium">
                          Par {task.ownerName} <span className="text-gray-400 font-normal">• {task.createdAt}</span>
                      </span>
                    </li>
                  ))}
                  
                  {!isLoading && tasks.length === 0 && (
                      <p className="text-gray-500 italic py-2">Aucune tâche en cours. Beau travail ! 🎉</p>
                  )}
                </ul>
              )}
          </div>

          <button onClick={() => navigate('/tasks')} className="mt-4 text-sm font-medium text-blue-600 hover:underline text-left">
            Voir toutes les tâches ({tasks.length}) &rarr;
          </button>
        </div>

        {/* --- Widget Rendez-vous (CONNECTÉ AU BACKEND 🟢) --- */}
        <div className="bg-white p-5 rounded-lg shadow-sm flex flex-col">
          <h2 className="text-xl font-semibold text-gray-700 mb-4 flex items-center">
            <FaCalendarAlt className="mr-3 text-green-500" />
            Prochains RDV (Aujourd'hui)
          </h2>
          
          <div className="flex-1">
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
          </div>

          <button onClick={() => navigate('/calendar')} className="mt-4 text-sm font-medium text-blue-600 hover:underline text-left">
            Ouvrir le calendrier &rarr;
          </button>
        </div>

        {/* --- Widget Messages Récents (CONNECTÉ AU BACKEND 🟢) --- */}
        <div className="bg-white p-5 rounded-lg shadow-sm flex flex-col">
          <h2 className="text-xl font-semibold text-gray-700 mb-4 flex items-center">
            <FaCommentDots className="mr-3 text-purple-500" />
            Messages non lus
          </h2>
          <div className="flex-1">
              <ul className="space-y-3">
                {messages.map(msg => (
                  <li key={msg.id} className="p-3 bg-gray-50 rounded-md border border-gray-200 truncate cursor-pointer hover:bg-gray-100 transition" onClick={() => navigate('/messages', { state: { openMessageId: msg.id } })}>
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
          </div>
          <button onClick={() => navigate('/messages')} className="mt-4 text-sm font-medium text-blue-600 hover:underline text-left">
            Ouvrir la messagerie &rarr;
          </button>
        </div>

        {/* --- Widget Appels Manqués (Statique pour l'instant) --- */}
        <div className="bg-white p-5 rounded-lg shadow-sm md:col-span-1 flex flex-col">
          <h2 className="text-xl font-semibold text-gray-700 mb-4 flex items-center">
            <FaPhoneAlt className="mr-3 text-red-500" />
            Appels manqués
          </h2>
          <div className="flex-1">
               <ul className="space-y-3">
                {missedCalls.map(call => (
                  <li key={call.id} className="p-3 bg-red-50 rounded-md border border-red-200">
                    <p className="font-medium text-gray-900">{call.from}</p>
                    <span className="text-sm text-gray-500">Il y a {call.time}</span>
                  </li>
                ))}
                 {missedCalls.length === 0 && <p className="text-gray-500 italic">Aucun appel manqué.</p>}
              </ul>
          </div>
          <button onClick={() => navigate('/phone')} className="mt-4 text-sm font-medium text-blue-600 hover:underline text-left">
            Voir l'historique &rarr;
          </button>
        </div>

      </div>
    </div>
  );
};

export default HomePage;