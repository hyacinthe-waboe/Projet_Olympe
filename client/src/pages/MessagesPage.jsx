// src/pages/MessagesPage.jsx

import React, { useState } from 'react';

// --- Icônes pour la page Messages ---
const SearchIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
);
const ClockIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
);
const VoicemailIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="5.5" cy="11.5" r="4.5"></circle><circle cx="18.5" cy="11.5" r="4.5"></circle><line x1="5.5" y1="16" x2="18.5" y2="16"></line></svg>
);
const PhoneIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
);
const SmileIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M8 14s1.5 2 4 2 4-2 4-2"></path><line x1="9" y1="9" x2="9.01" y2="9"></line><line x1="15" y1="9" x2="15.01" y2="9"></line></svg>
);
const MicIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path><path d="M19 10v2a7 7 0 0 1-14 0v-2"></path><line x1="12" y1="19" x2="12" y2="23"></line><line x1="8" y1="23" x2="16" y2="23"></line></svg>
);
const SendIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
);
const ShareIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="18" cy="5" r="3"></circle><circle cx="6" cy="12" r="3"></circle><circle cx="18" cy="19" r="3"></circle><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line></svg>
);
const EditIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
);
const MailIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
);
const BriefcaseIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path></svg>
);

// --- Données de simulation ---
const messagesList = [
    { id: 1, name: '01 23 45 67 89', message: 'Bonjour, je vous contacte...', time: '5 min', avatar: 'M' },
    { id: 2, name: '98 76 54 32 10', message: 'Le RDV est annulé.', time: 'Hier', avatar: 'D' },
    { id: 3, name: 'M. DURAND', message: 'Veuillez prendre RDV avec ...', time: 'Hier', avatar: 'M', selected: true },
    { id: 4, name: '07 77 77 77 77', message: 'Merci.', time: 'Hier', avatar: 'P' },
];

const conversation = [
    { id: 1, sender: 'other', message: 'Bonjour,' },
    { id: 2, sender: 'other', message: 'Veuillez prendre RDV avec le Dr FABRE, à partir de 16h internet coupe téléphone aussi.\n\nCordialement,' },
];

const contactInfo = {
    name: 'M. DURAND Patrice',
    number: '07 66 55 44 33',
    dob: '01/01/1980 - 41 ans',
    email: 'durand.patrice@email.com',
    profession: 'comptable',
};

// --- Composant: Colonne de gauche (Liste des messages) ---
const MessageList = () => {
    const [activeTab, setActiveTab] = useState('Tous');

    return (
        <div className="w-96 bg-white border-r border-gray-200 flex flex-col">
            {/* Header */}
            <div className="p-4 border-b border-gray-200">
                <h2 className="text-xl font-semibold">Messages</h2>
                <p className="text-sm text-gray-500">Samedi 13 Février</p>
                <div className="flex space-x-2 mt-4">
                    <button className="px-4 py-2 rounded-lg bg-gray-800 text-white text-sm font-semibold">+ Nouveau</button>
                    <button className="px-4 py-2 rounded-lg border border-gray-300 text-sm font-semibold">Contact</button>
                </div>
            </div>
            
            {/* Barre de recherche et onglets */}
            <div className="p-4 border-b border-gray-200">
                <div className="relative mb-4">
                    <input type="text" placeholder="Rechercher..." className="w-full pl-10 pr-4 py-2 bg-gray-100 rounded-lg text-sm" />
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"><SearchIcon /></div>
                </div>
                <div className="flex bg-gray-100 rounded-lg p-1">
                    <button onClick={() => setActiveTab('Tous')} className={`flex-1 py-1 rounded-md text-sm ${activeTab === 'Tous' ? 'bg-white shadow' : ''}`}>Tous</button>
                    <button onClick={() => setActiveTab('Nouveaux')} className={`flex-1 py-1 rounded-md text-sm ${activeTab === 'Nouveaux' ? 'bg-white shadow' : ''}`}>Nouveaux</button>
                </div>
            </div>

            {/* Liste */}
            <div className="flex-1 overflow-y-auto">
                {messagesList.map(msg => (
                    <div key={msg.id} className={`flex p-3 space-x-3 cursor-pointer ${msg.selected ? 'bg-blue-50' : 'hover:bg-gray-50'}`}>
                        <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center font-bold text-gray-600">{msg.avatar}</div>
                        <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-center">
                                <h3 className="font-semibold text-sm truncate">{msg.name}</h3>
                                <span className="text-xs text-gray-500 flex-shrink-0 ml-2">{msg.time}</span>
                            </div>
                            <p className="text-sm text-gray-600 truncate">{msg.message}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

// --- Composant: Colonne centrale (Conversation) ---
const Conversation = () => (
    <div className="flex-1 flex flex-col bg-white">
        {/* Header Conversation */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold">M. DURAND Patrice</h3>
            <div className="flex items-center space-x-3 text-gray-500">
                <button className="hover:text-gray-800"><VoicemailIcon /></button>
                <button className="hover:text-gray-800"><ClockIcon /></button>
                <button className="p-2 bg-green-500 text-white rounded-full"><PhoneIcon /></button>
            </div>
        </div>

        {/* Bulles de chat */}
        <div className="flex-1 p-4 space-y-4 overflow-y-auto bg-gray-50">
            {conversation.map(chat => (
                <div key={chat.id} className="flex">
                    <div className="bg-white p-3 rounded-lg border border-gray-200 max-w-md" style={{whiteSpace: 'pre-wrap'}}>
                        {chat.message}
                    </div>
                </div>
            ))}
        </div>

        {/* Barre de saisie */}
        <div className="p-4 bg-white border-t border-gray-200">
            <div className="flex items-center space-x-2">
                <button className="p-2 text-gray-500 hover:bg-gray-100 rounded-full"><SearchIcon /></button>
                <button className="p-2 text-gray-500 hover:bg-gray-100 rounded-full"><SmileIcon /></button>
                <button className="p-2 text-gray-500 hover:bg-gray-100 rounded-full"><MicIcon /></button>
                <input type="text" placeholder="Envoyer un message..." className="flex-1 px-4 py-2 bg-gray-100 rounded-full text-sm" />
                <button className="p-3 bg-blue-500 text-white rounded-full hover:bg-blue-600">
                    <SendIcon />
                </button>
            </div>
        </div>
    </div>
);

// --- Composant: Colonne de droite (Info Contact) ---
const InfoPanel = () => (
    <div className="w-96 bg-gray-50 border-l border-gray-200 p-6 flex flex-col space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Info</h2>
            <div className="flex space-x-2 text-gray-500">
                <button className="hover:text-gray-800"><ShareIcon /></button>
                <button className="hover:text-gray-800"><EditIcon /></button>
            </div>
        </div>

        {/* Carte Contact */}
        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
            <div className="flex items-center space-x-4 mb-4">
                <div className="w-16 h-16 rounded-full bg-gray-800 text-white flex items-center justify-center text-3xl font-bold">
                    P
                </div>
                <div>
                    <h3 className="text-lg font-bold">{contactInfo.name}</h3>
                    <p className="text-sm text-gray-600">{contactInfo.number}</p>
                    <p className="text-xs text-gray-500">{contactInfo.dob}</p>
                </div>
            </div>
            <div className="space-y-2 text-sm">
                <div className="flex items-center text-gray-700">
                    <MailIcon />
                    <span className="ml-2">{contactInfo.email}</span>
                </div>
                <div className="flex items-center text-gray-700">
                    <BriefcaseIcon />
                    <span className="ml-2">Profession: {contactInfo.profession}</span>
                </div>
            </div>
        </div>

        {/* Section Détails */}
        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm flex-1">
            <h3 className="text-lg font-semibold">Détails</h3>
            {/* Le contenu de "Détails" peut être ajouté ici */}
        </div>
    </div>
);

// --- COMPOSANT PRINCIPAL DE LA PAGE ---
export default function MessagesPage() {
  return (
    <div className="flex flex-1 overflow-hidden">
        <MessageList />
        <Conversation />
        <InfoPanel />
    </div>
  );
}