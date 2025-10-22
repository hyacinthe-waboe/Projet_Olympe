// src/App.jsx
import React from "react";
import { Routes, Route } from "react-router-dom";

// --- IMPORTS ---
import MainLayout from "./components/layout/MainLayout.jsx";
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
import HelpPage from './pages/HelpPage.jsx'; // <-- 1. NOUVEL IMPORT

export default function App() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
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
        <Route path="/help" element={<HelpPage />} /> {/* <-- 2. NOUVELLE ROUTE */}
      </Route>
    </Routes>
  );
}