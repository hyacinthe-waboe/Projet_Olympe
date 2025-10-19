// src/pages/EmailsPage.jsx

import React, { useState } from 'react';

// --- Icônes pour la page Emails ---
const SearchIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
);
const PlusIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
);
const StarIcon = ({ filled }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
);
const TagIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"></path><line x1="7" y1="7" x2="7.01" y2="7"></line></svg>
);
const FlagIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"></path><line x1="4" y1="22" x2="4" y2="15"></line></svg>
);
const ArrowLeftIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
);
const ArrowRightIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
);
const TrashIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
);
const ArchiveIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="21 8 21 21 3 21 3 8"></polyline><rect x="1" y="3" width="22" height="5"></rect><line x1="10" y1="12" x2="14" y2="12"></line></svg>
);
const ChevronDownSmIcon = () => ( // Plus petite que ChevronDownIcon
    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
);

// --- Données de simulation ---
const emailList = [
    { id: 1, sender: 'Exemple email n°1', subject: 'Contenu de l\'email...', time: '20:19', read: true, selected: true },
    { id: 2, sender: 'Exemple email n°2', subject: 'Contenu de l\'email...', time: 'Hier', read: false },
    { id: 3, sender: 'Exemple email n°3', subject: 'Contenu de l\'email...', time: '14/02/2021', read: true },
];

const currentEmail = {
    sender: 'Exemple de email n°1',
    subject: 'Contenu de l\'email...',
    to: 'john.doe@email.com',
    content: 'Contenu email',
};

// --- Composant: Colonne de gauche (Liste des emails) ---
const EmailList = () => {
    return (
        <div className="w-96 bg-white border-r border-gray-200 flex flex-col">
            {/* Header */}
            <div className="p-4 border-b border-gray-200">
                <h2 className="text-xl font-semibold">Emails</h2>
                <p className="text-sm text-gray-500">Samedi 13 février</p>
                <div className="flex space-x-2 mt-4">
                    <button className="px-4 py-2 rounded-lg bg-gray-800 text-white text-sm font-semibold flex items-center space-x-1">
                        <PlusIcon />
                        <span>Ajouter</span>
                    </button>
                    <button className="px-4 py-2 rounded-lg border border-gray-300 text-sm font-semibold">Contact</button>
                    <button className="p-2 border rounded-md text-gray-500 hover:bg-gray-100"><StarIcon /></button>
                    <button className="p-2 border rounded-md text-gray-500 hover:bg-gray-100"><TagIcon /></button>
                    <button className="p-2 border rounded-md text-gray-500 hover:bg-gray-100"><FlagIcon /></button>
                    <button className="p-2 border rounded-md text-gray-500 hover:bg-gray-100"><ArrowLeftIcon /></button>
                    <button className="p-2 border rounded-md text-gray-500 hover:bg-gray-100"><ArrowRightIcon /></button>
                    <button className="flex items-center space-x-1 p-2 bg-white border rounded-md shadow-sm text-sm font-medium">
                        <span>Boîte de réception</span>
                        <ChevronDownSmIcon />
                    </button>
                </div>
            </div>
            
            {/* Barre de recherche */}
            <div className="p-4 border-b border-gray-200">
                <div className="relative">
                    <input type="text" placeholder="Rechercher..." className="w-full pl-10 pr-4 py-2 bg-gray-100 rounded-lg text-sm" />
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"><SearchIcon /></div>
                </div>
            </div>

            {/* Onglets (simulés) */}
            <div className="p-4 border-b border-gray-200">
                <button className="font-semibold text-gray-800">Toutes les boites</button>
            </div>

            {/* Liste des emails */}
            <div className="flex-1 overflow-y-auto">
                {emailList.map(email => (
                    <div key={email.id} className={`flex p-3 space-x-3 cursor-pointer ${email.selected ? 'bg-blue-50' : 'hover:bg-gray-50'} ${!email.read ? 'font-semibold' : 'text-gray-700'}`}>
                        <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center font-bold text-gray-600 text-sm">
                            {email.sender[0]}
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-center">
                                <h3 className="text-sm truncate">{email.sender}</h3>
                                <span className="text-xs text-gray-500 flex-shrink-0 ml-2">{email.time}</span>
                            </div>
                            <p className="text-xs text-gray-600 truncate">{email.subject}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

// --- Composant: Colonne centrale (Contenu de l'email) ---
const EmailContent = () => (
    <div className="flex-1 flex flex-col bg-white">
        {/* Header de l'email */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold">{currentEmail.sender}</h3>
            <div className="flex items-center space-x-3 text-gray-500">
                <button className="p-2 bg-gray-100 rounded-md hover:text-gray-800"><StarIcon /></button>
                <button className="p-2 bg-gray-100 rounded-md hover:text-gray-800"><TrashIcon /></button>
                <button className="p-2 bg-gray-100 rounded-md hover:text-gray-800"><ArchiveIcon /></button>
                <button className="flex items-center space-x-1 p-2 bg-white border rounded-md shadow-sm text-sm font-medium">
                    <span>Client: Médecin Dupont</span>
                    <ChevronDownSmIcon />
                </button>
            </div>
        </div>

        {/* Détails de l'email */}
        <div className="p-4 border-b border-gray-200 text-sm text-gray-700">
            <p className="mb-1">De: <span className="font-medium">{currentEmail.sender}</span></p>
            <p>À: <span className="font-medium">{currentEmail.to}</span></p>
        </div>

        {/* Contenu de l'email */}
        <div className="flex-1 p-4 overflow-y-auto text-gray-800">
            <p>{currentEmail.content}</p>
            {/* Ici, le contenu réel de l'email serait rendu */}
        </div>
    </div>
);


// --- COMPOSANT PRINCIPAL DE LA PAGE EMAILS ---
export default function EmailsPage() {
  return (
    <div className="flex flex-1 overflow-hidden">
        <EmailList />
        <EmailContent />
    </div>
  );
}