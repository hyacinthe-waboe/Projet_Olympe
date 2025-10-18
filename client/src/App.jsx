// src/App.jsx
import React from "react";
import { Routes, Route } from "react-router-dom";

import MainLayout from "./components/layout/MainLayout.jsx";
import HomePage from "./pages/HomePage.jsx";
import CalendarPage from "./pages/CalendarPage.jsx";

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

        {/* Liens du sidebar */}
        <Route path="/dashboard" element={<Placeholder title="Dashboard" />} />
        <Route path="/phone" element={<Placeholder title="Téléphone" />} />
        <Route path="/users" element={<Placeholder title="Utilisateurs" />} />
        <Route path="/mail" element={<Placeholder title="Emails" />} />
        <Route path="/files" element={<Placeholder title="Fichiers" />} />
      </Route>
    </Routes>
  );
}
