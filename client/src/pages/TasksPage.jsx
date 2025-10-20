// src/pages/TasksPage.jsx

import React from 'react';

// --- Icônes nécessaires pour CETTE page ---
const ShareIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"></path><polyline points="16 6 12 2 8 6"></polyline><line x1="12" y1="2" x2="12" y2="15"></line></svg>
);
const ChevronDownIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
);

// --- Données de simulation ---
const tasksToDo = [
    { id: 1, title: 'Rédiger facture M. Durand', note: 'Ajouter option SMS.' },
    { id: 2, title: 'Envoyer facture M. Durand', note: 'Mettre en copie secretaire.' },
    { id: 3, title: 'Rappeler M.BOYE', note: 'Note: CEO Telkelle.' },
];
const tasksInProgress = [
    { id: 4, title: 'Traiter demandes Dr.DUPONT', note: 'Note: ...' },
];
const tasksDone = [];

// --- Composants de la page ---

// Carte de tâche individuelle
const TaskCard = ({ task }) => (
    <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm mb-3">
        <h4 className="font-semibold text-sm">{task.title}</h4>
        <p className="text-xs text-gray-500">{task.note}</p>
    </div>
);

// Colonne du Kanban
const KanbanColumn = ({ title, count, tasks }) => (
    <div className="bg-gray-100 rounded-lg p-4 flex-1">
        <h3 className="font-semibold mb-4">{title} ({count})</h3>
        <div className="space-y-3">
            {tasks.map(task => <TaskCard key={task.id} task={task} />)}
            {tasks.length === 0 && (
                <div className="h-24 border-2 border-dashed border-gray-300 rounded-lg"></div>
            )}
        </div>
    </div>
);

// Barre latérale de droite
const TasksSidebar = () => (
    <div className="w-80 bg-gray-50 border-l border-gray-200 flex flex-col p-4 space-y-4">
        <div className="bg-white p-4 rounded-md border shadow-sm flex-1">
            <h3 className="font-semibold mb-2">Notes</h3>
            <div className="h-32 bg-gray-50 rounded-md border"></div>
        </div>
        <div className="bg-white p-4 rounded-md border shadow-sm flex-1">
            <h3 className="font-semibold mb-2">Collaborateurs</h3>
            <div className="h-32 bg-gray-50 rounded-md border"></div>
        </div>
    </div>
);

// --- COMPOSANT PRINCIPAL DE LA PAGE ---
export default function TasksPage() {
  return (
    <div className="flex flex-1 overflow-hidden bg-white">
        
        {/* Colonne principale (Contenu + Kanban) */}
        <div className="flex-1 flex flex-col p-6">
            
            {/* Header de la page Tâches */}
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="text-2xl font-bold">Tâches</h2>
                    <p className="text-sm text-gray-500">Samedi 13 Février</p>
                </div>
                <div className="flex items-center space-x-2">
                    <button className="px-4 py-2 rounded-lg bg-gray-800 text-white text-sm font-semibold">+ Ajouter</button>
                    <button className="px-4 py-2 rounded-lg border border-gray-300 text-sm font-semibold flex items-center space-x-1">
                        <ShareIcon />
                        <span>Partager</span>
                    </button>
                </div>
            </div>

            {/* Filtre Client */}
            <div className="mb-6">
                <button className="flex items-center space-x-1 p-2 bg-white border rounded-md shadow-sm text-sm font-medium">
                    <span>Client: Médecin Dupont</span>
                    <ChevronDownIcon />
                </button>
            </div>

            {/* Board Kanban */}
            <div className="flex flex-1 gap-6 overflow-x-auto">
                <KanbanColumn title="À faire" count={tasksToDo.length} tasks={tasksToDo} />
                <KanbanColumn title="En cours" count={tasksInProgress.length} tasks={tasksInProgress} />
                <KanbanColumn title="Terminé" count={tasksDone.length} tasks={tasksDone} />
            </div>
        </div>

        {/* Barre latérale de droite */}
        <TasksSidebar />
    </div>
  );
}