// src/App.jsx
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

// --- IMPORTS ---
import MainLayout from "./components/layout/MainLayout.jsx";
import LoginPage from "./pages/LoginPage.jsx"; 

// Tes pages existantes
import HomePage from "./pages/HomePage.jsx";
import TelephonePage from "./pages/TelephonePage.jsx";
import CalendarPage from "./pages/CalendarPage.jsx";
import MessagesPage from './pages/MessagesPage.jsx';
import TasksPage from './pages/TasksPage.jsx';
import EmailsPage from './pages/EmailsPage.jsx';
import ContactPage from './pages/ContactPage.jsx';
import FilesPage from './pages/FilesPage.jsx';
import SettingsPage from './pages/SettingsPage.jsx';
import VoicemailPage from './pages/VoicemailPage.jsx';
import InternalChatPage from './pages/InternalChatPage.jsx';
import NotificationsPage from './pages/NotificationsPage.jsx';
import HelpPage from './pages/HelpPage.jsx';
import TeamPage from './pages/TeamPage.jsx';
import PatientDetailsPage from './pages/PatientDetailsPage';

// --- COMPOSANT DE PROTECTION ---
// Si pas connecté, on renvoie vers /login
const ProtectedRoute = ({ children }) => {
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

const AdminRoute = ({ children }) => {
  const userStr = localStorage.getItem('user');
  const userData = userStr ? JSON.parse(userStr) : null;
  const roles = userData?.roles || userData?.user?.roles || [];
  console.log("Roles détectés :", roles);
  
  if (!roles.includes('ROLE_ADMIN')) {
    return <Navigate to="/" replace />;
  }
  return children;
};

export default function App() {
  return (
    <Routes>
      {/* 1. La route Login est HORS du MainLayout et est publique */}
      <Route path="/login" element={<LoginPage />} />

      {/* 2. Toutes les autres routes sont protégées et utilisent le MainLayout */}
      <Route element={
        <ProtectedRoute>
          <MainLayout />
        </ProtectedRoute>
      }>
        <Route path="/" element={<HomePage />} />
        <Route path="/phone" element={<TelephonePage />} />
        <Route path="/calendar" element={<CalendarPage />} />
        <Route path="/emails" element={<EmailsPage />} />
        <Route path="/messages" element={<MessagesPage />} />
        <Route path="/tasks" element={<TasksPage />} />
        <Route path="/users" element={<ContactPage />} />
        <Route path="/files" element={<FilesPage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/voicemail" element={<VoicemailPage />} />
        <Route path="/internal-chat" element={<InternalChatPage />} />
        <Route path="/notifications" element={<NotificationsPage />} />
        <Route path="/help" element={<HelpPage />} />
        <Route path="/team" element={<AdminRoute><TeamPage /></AdminRoute>} />
        <Route path="/patient/:id" element={<PatientDetailsPage />} />
      </Route>

      {/* Redirection par défaut : Si l'URL n'existe pas, on renvoie vers l'accueil (qui renverra vers Login si besoin) */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}