// src/layout/MainLayout.jsx

import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import logo from '../../assets/logo.png';


// --- TOUTES LES ICÔNES (pour le layout) ---
// (J'ai copié toutes les icônes de votre HomePage ici)
const HomeIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
);
const PhoneIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
);
const UserIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
);
const CalendarIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
);
const MailIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
);
const FileTextIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
);
const LayoutDashboardIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>
);
const VoicemailIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="5.5" cy="11.5" r="4.5"></circle><circle cx="18.5" cy="11.5" r="4.5"></circle><line x1="5.5" y1="16" x2="18.5" y2="16"></line></svg>
);
const BellIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>
);
const MessageSquareIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
);
const HelpCircleIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
);
const SettingsIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>
);


// --- Composant: Barre latérale principale (MODIFIÉE) ---
const Sidebar = () => {
    // Fonction pour gérer les styles des liens actifs/inactifs
    const navLinkClasses = ({ isActive }) =>
      isActive
        ? 'p-3 bg-gray-100 rounded-lg text-gray-700' // Style si actif
        : 'p-3 text-gray-500 hover:bg-gray-100 rounded-lg'; // Style si inactif

    return (
        <div className="h-screen bg-white border-r border-gray-200 flex flex-col items-center py-4 space-y-6">
            <div className="w-12 h-12 flex items-center justify-center rounded-lg">
                <img src={logo} alt="Logo Projet Olympe" className="w-full h-full object-contain" />
            </div>
            <nav className="flex flex-col items-center space-y-4">
                <NavLink to="/" className={navLinkClasses} end><HomeIcon /></NavLink>
                <NavLink to="/dashboard" className={navLinkClasses}><LayoutDashboardIcon /></NavLink>
                <NavLink to="/phone" className={navLinkClasses}><PhoneIcon /></NavLink>
                <NavLink to="/users" className={navLinkClasses}><UserIcon /></NavLink>
                <NavLink to="/calendar" className={navLinkClasses}><CalendarIcon /></NavLink>
                <NavLink to="/mail" className={navLinkClasses}><MailIcon /></NavLink>
                <NavLink to="/files" className={navLinkClasses}><FileTextIcon /></NavLink>
            </nav>
        </div>
    );
};


// --- Composant: Header (copié depuis HomePage) ---
const Header = () => (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6">
        <div className="flex items-center space-x-2 text-gray-600">
            <div className="p-2 bg-green-100 text-green-700 rounded-full"><PhoneIcon /></div>
            <div>
                <p className="font-semibold">Appel en cours de <span className="text-black">07 66 55 44 33</span></p>
                <p className="text-sm">M. DURAND</p>
            </div>
        </div>
        
        <div className="flex items-center space-x-4">
            <div className="text-xs p-2 bg-gray-100 rounded-lg">Le client M. MARTIN a choisi d'enregistrer tous les appels</div>
            
            <nav className="flex items-center space-x-2">
                <button className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg" title="Messagerie vocale">
                    <VoicemailIcon />
                </button>
                <button className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg" title="Messagerie">
                    <MessageSquareIcon />
                </button>
                <button className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg relative" title="Notifications">
                    <BellIcon />
                </button>
                <button className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg" title="Aide">
                    <HelpCircleIcon />
                </button>
                <button className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg" title="Réglages">
                    <SettingsIcon />
                </button>
            </nav>

            <div className="w-px h-6 bg-gray-200"></div>

            <div className="flex items-center space-x-2">
                <div className="text-right">
                    <span className="font-semibold text-sm">John DOE</span>
                    <p className="text-xs text-green-500 font-semibold">En ligne</p>
                </div>
                <div className="relative">
                    <div className="w-8 h-8 rounded-full bg-gray-800"></div>
                    <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-white"></span>
                </div>
            </div>
        </div>
    </header>
);

// --- COMPOSANT PRINCIPAL DU LAYOUT ---
export default function MainLayout() {
  return (
    <div className="flex h-screen bg-gray-100 font-sans">
      <Sidebar />
      <div className="flex flex-col flex-1">
        <Header />
        
        {/* --- C'est ici que vos pages vont s'afficher --- */}
        <main className="flex flex-1 overflow-hidden">
          <Outlet /> 
        </main>
      </div>
    </div>
  );
}