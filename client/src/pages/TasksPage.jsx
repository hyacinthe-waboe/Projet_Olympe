// src/pages/TasksPage.jsx

import React, { useState, useEffect } from "react";
import { useLocation } from 'react-router-dom';
import { API_URL } from '../config/api'; // <--- AJOUT DE L'IMPORT ICI

// --- Icônes ---
const ShareIcon = () => (
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
    <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"></path>
    <polyline points="16 6 12 2 8 6"></polyline>
    <line x1="12" y1="2" x2="12" y2="15"></line>
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
const PlusIcon = () => (
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
    <line x1="12" y1="5" x2="12" y2="19"></line>
    <line x1="5" y1="12" x2="19" y2="12"></line>
  </svg>
);

// --- COMPOSANTS DE LA PAGE ---

// 1. Carte de tâche individuelle (Optimisée sans dépassement)
const TaskCard = ({ task, onToggle, onDelete, isHighlighted }) => (
  <div
    className={`p-4 rounded-xl border mb-3 flex items-start gap-3 transition-all duration-300 
        ${task.isDone ? 'opacity-60 bg-gray-50 border-gray-200' : 'bg-white border-blue-100 hover:shadow-sm'}
        /* Highlight : Bordure colorée et fond bleuté, mais pas d'ombre externe */
        ${isHighlighted ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-500 ring-inset' : ''} 
    `}
  >
    <input
      type="checkbox"
      checked={task.isDone}
      onChange={() => onToggle(task.id)}
      className="mt-1 w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 cursor-pointer"
    />
    <div className="flex-1 min-w-0">
      <h4 className={`font-semibold text-sm truncate ${task.isDone ? "line-through text-gray-500" : "text-gray-800"}`}>
        {task.title}
      </h4>
      <p className="text-xs text-gray-400 mt-1">
        Créé le {task.createdAt}{" "}
        <span className="font-medium text-gray-500">• {task.ownerName}</span>
      </p>
    </div>
    <button
      onClick={() => onDelete(task.id)}
      className="text-gray-300 hover:text-red-500 transition p-1"
      title="Supprimer la tâche"
    >
      <TrashIcon />
    </button>
  </div>
);

// 2. Colonne du Kanban (Sécurisée contre le scroll horizontal)
const KanbanColumn = ({ title, tasks, onToggle, onDelete, colorClass, highlightTaskId }) => (
  <div className="bg-gray-50 rounded-xl border border-gray-100 p-4 flex-1 flex flex-col h-full overflow-hidden">
    <h3 className="font-bold mb-4 flex items-center justify-between text-gray-800">
      {title}
      <span className={`text-xs px-2 py-1 rounded-full ${colorClass}`}>
        {tasks.length}
      </span>
    </h3>
    {/* Ajout de px-1 et overflow-x-hidden pour bloquer définitivement le scroll horizontal */}
    <div className="space-y-3 overflow-y-auto overflow-x-hidden flex-1 px-1">
      {tasks.map((task) => (
        <TaskCard
          key={task.id}
          task={task}
          onToggle={onToggle}
          onDelete={onDelete}
          isHighlighted={task.id === highlightTaskId}
        />
      ))}
      {tasks.length === 0 && (
        <div className="h-24 border-2 border-dashed border-gray-200 rounded-xl flex items-center justify-center text-gray-400 text-sm font-medium">
          Aucune tâche
        </div>
      )}
    </div>
  </div>
);

// --- COMPOSANT PRINCIPAL ---
export default function TasksPage() {
  const [tasks, setTasks] = useState([]);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const location = useLocation();
  const [activeHighlightId, setActiveHighlightId] = useState(null);

  useEffect(() => {
    // 1. On vérifie si un ID est passé dans la navigation
    const idFromDashboard = location.state?.highlightTaskId;

    if (idFromDashboard) {
      setActiveHighlightId(idFromDashboard);

      // 2. On lance un timer de 3 secondes pour effacer l'effet
      const timer = setTimeout(() => {
        setActiveHighlightId(null);
        // Optionnel : on nettoie l'état de navigation pour éviter 
        // que le highlight revienne si on rafraîchit la page
        window.history.replaceState({}, document.title);
      }, 3000);

      return () => clearTimeout(timer); // Nettoyage du timer si on quitte la page
    }
  }, [location]);

  // 🔄 Chargement initial des tâches
  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      // 👇 REMPLACEMENT PAR ${API_URL} 👇
      const res = await fetch(`${API_URL}/api/tasks`, {
        credentials: "include",
      });
      if (res.ok) setTasks(await res.json());
    } catch (e) {
      console.error("Erreur de chargement des tâches", e);
    }
  };

  // ➕ Création d'une tâche
  const handleCreateTask = async (e) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;

    try {
      // 👇 REMPLACEMENT PAR ${API_URL} 👇
      const res = await fetch(`${API_URL}/api/tasks`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: newTaskTitle }),
        credentials: "include",
      });
      if (res.ok) {
        setNewTaskTitle(""); // On vide le champ
        fetchTasks(); // On rafraîchit la liste
      }
    } catch (e) {
      console.error(e);
    }
  };

  // ✅ Cocher / Décocher
  const handleToggleTask = async (id) => {
    try {
      // 👇 REMPLACEMENT PAR ${API_URL} 👇
      const res = await fetch(`${API_URL}/api/tasks/${id}/toggle`, {
        method: "PUT",
        credentials: "include",
      });
      if (res.ok) {
        // Mise à jour immédiate côté front pour éviter un délai d'affichage
        setTasks((prev) =>
          prev.map((t) => (t.id === id ? { ...t, isDone: !t.isDone } : t)),
        );
      }
    } catch (e) {
      console.error(e);
    }
  };

  // 🗑️ Suppression
  const handleDeleteTask = async (id) => {
    if (!window.confirm("Voulez-vous vraiment supprimer cette tâche ?")) return;

    try {
      // 👇 REMPLACEMENT PAR ${API_URL} 👇
      const res = await fetch(`${API_URL}/api/tasks/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (res.ok) {
        setTasks((prev) => prev.filter((t) => t.id !== id));
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Séparation des tâches pour le Kanban
  const tasksToDo = tasks.filter((t) => !t.isDone);
  const tasksDone = tasks.filter((t) => t.isDone);

  return (
    <div className="flex flex-1 overflow-hidden bg-white">
      {/* Colonne principale (Contenu + Kanban) */}
      <div className="flex-1 flex flex-col p-8 h-full">
        {/* Header de la page */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">Mes Tâches</h2>
            <p className="text-sm text-gray-500 mt-1">
              Gérez vos rappels personnels (Privé)
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <button className="px-4 py-2 rounded-xl border border-gray-200 text-sm font-semibold flex items-center space-x-2 text-gray-600 hover:bg-gray-50 transition">
              <ShareIcon />
              <span>Partager</span>
            </button>
          </div>
        </div>

        {/* Barre de création rapide */}
        <form onSubmit={handleCreateTask} className="mb-8 flex gap-3">
          <input
            type="text"
            placeholder="Que devez-vous faire aujourd'hui ? (ex: Rappeler Mme Dupont à 14h)"
            value={newTaskTitle}
            onChange={(e) => setNewTaskTitle(e.target.value)}
            className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-5 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 transition"
          />
          <button
            type="submit"
            disabled={!newTaskTitle.trim()}
            className="bg-gray-900 text-white px-6 py-3 rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-gray-800 disabled:opacity-50 transition"
          >
            <PlusIcon /> Ajouter
          </button>
        </form>

        {/* Board Kanban */}
        <div className="flex flex-1 gap-6 overflow-hidden">
          <KanbanColumn
            title="À faire"
            tasks={tasksToDo}
            onToggle={handleToggleTask}
            onDelete={handleDeleteTask}
            colorClass="bg-blue-100 text-blue-700"
            highlightTaskId={activeHighlightId}
          />
          <KanbanColumn
            title="Terminées"
            tasks={tasksDone}
            onToggle={handleToggleTask}
            onDelete={handleDeleteTask}
            colorClass="bg-green-100 text-green-700"
            highlightTaskId={activeHighlightId}
          />
        </div>
      </div>
    </div>
  );
}