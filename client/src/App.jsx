// src/App.jsx
import React from "react";
import { Routes, Route } from "react-router-dom";

// --- CHEMINS RELATIFS CORRIGÉS ---
import MainLayout from "./components/layout/MainLayout.jsx";
import HomePage from "./pages/HomePage.jsx";
import CalendarPage from "./pages/CalendarPage.jsx";
import MessagesPage from './pages/MessagesPage.jsx';
import TasksPage from './pages/TasksPage.jsx'; // <-- 1. VÉRIFIEZ QUE L'IMPORT EST LÀ

const Placeholder = ({ title }) => (
  <div className="p-10 text-2xl font-bold">{title}</div>
);

export default function App() {
  return (
    <Routes>
      {/* Toutes les routes utilisent le MainLayout */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/calendar" element={<CalendarPage />} />
        <Route path="/mail" element={<MessagesPage />} />
        
        {/* Liens restants du sidebar */}
        <Route path="/dashboard" element={<Placeholder title="Dashboard" />} />
        <Route path="/phone" element={<Placeholder title="Téléphone" />} />
        <Route path="/users" element={<Placeholder title="Utilisateurs" />} />
        <Route path="/files" element={<Placeholder title="Fichiers" />} />
        
        {/* --- 2. CORRECTION PRINCIPALE ICI --- */}
        {/* Assurez-vous que cette ligne utilise bien <TasksPage /> */}
        <Route path="/tasks" element={<TasksPage />} />

      </Route>
    </Routes>
  );
}