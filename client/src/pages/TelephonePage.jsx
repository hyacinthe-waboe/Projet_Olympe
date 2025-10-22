// src/pages/TelephonePage.jsx

import React, { useState } from 'react';

// --- ICÔNES (Uniquement celles utilisées dans CETTE page) ---
const PhoneIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
);
const UserIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
);
const MailIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
);


// --- DONNÉES DE SIMULATION (MOCK DATA) ---
const calls = [
    { id: 1, number: '01 23 45 67 89', status: 'missed', time: '5 min', user: { name: '', avatar: '' } },
    { id: 2, number: '98 76 54 32 10', status: 'incoming', time: 'Hier', user: { name: '', avatar: 'D' } },
    { id: 3, number: 'M. DURAND', status: 'outgoing', time: 'Hier', user: { name: 'M. DURAND', avatar: 'M' }, selected: true },
    { id: 4, number: '01 23 45 67 89', status: 'incoming', time: 'Hier', user: { name: '', avatar: '' } },
];

const selectedCaller = {
    name: 'M. DURAND Patrice',
    number: '07 66 55 44 33',
    birthDate: '01/01/1980',
    email: 'durand.patrice@gmail.com',
    profession: 'comptable',
    history: [
        { type: 'call', time: 'Hier à 16h03', duration: '3 min', direction: 'outgoing' },
        { type: 'email', time: 'Jeudi 11 Février', subject: 'Documents pour réunion' },
        { type: 'sms', time: 'Mercredi 10 Février', message: 'Bonjour, je vous confirme le RDV du 15 février. Merci' },
    ]
};


// --- COMPOSANTS DE L'INTERFACE ---

// Composant: Liste des appels
const CallList = () => {
    const [activeTab, setActiveTab] = useState('Tous');
    return (
        <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
            <div className="p-4 border-b border-gray-200">
                <div className="flex space-x-2">
                    <button className="px-4 py-2 rounded-lg bg-gray-800 text-white text-sm font-semibold">+ Nouveau</button>
                    <button className="px-4 py-2 rounded-lg border border-gray-300 text-sm font-semibold">Contact</button>
                </div>
            </div>
            <div className="p-4 border-b border-gray-200">
                <div className="flex bg-gray-100 rounded-lg p-1">
                    <button onClick={() => setActiveTab('Tous')} className={`flex-1 py-1 rounded-md text-sm ${activeTab === 'Tous' ? 'bg-white shadow' : ''}`}>Tous</button>
                    <button onClick={() => setActiveTab('Manqués')} className={`flex-1 py-1 rounded-md text-sm ${activeTab === 'Manqués' ? 'bg-white shadow' : ''}`}>Manqués</button>
                </div>
            </div>
            <div className="flex-1 overflow-y-auto">
                {calls.map(call => (
                    <div key={call.id} className={`flex items-center p-3 space-x-3 cursor-pointer ${call.selected ? 'bg-blue-50' : 'hover:bg-gray-50'}`}>
                        <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center font-bold text-gray-600">{call.user.avatar}</div>
                        <div className="flex-1">
                            <p className={`font-semibold ${call.status === 'missed' ? 'text-red-500' : 'text-gray-800'}`}>{call.number}</p>
                            <p className="text-sm text-gray-500">{call.status === 'missed' ? 'Appel manqué' : `Appel ${call.status === 'incoming' ? 'entrant' : 'sortant'} - Durée ${call.time}`}</p>
                        </div>
                        <div className="text-sm text-gray-400">{call.time}</div>
                    </div>
                ))}
            </div>
        </div>
    );
};

// Composant: Détails de l'appelant
const CallerDetails = ({ caller }) => (
    <div className="flex-1 bg-white p-6 overflow-y-auto">
        <div className="flex justify-between items-start">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Fiche appelant</h2>
             <button className="text-gray-500"> {/* Share Icon */}
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="18" cy="5" r="3"></circle><circle cx="6" cy="12" r="3"></circle><circle cx="18" cy="19" r="3"></circle><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line></svg>
            </button>
        </div>
        <div className="flex items-center space-x-4 mb-6">
            <div className="w-16 h-16 rounded-full bg-gray-800 flex items-center justify-center text-white text-3xl font-bold">P</div>
            <div>
                <h3 className="text-xl font-bold">{caller.name}</h3>
                <p className="text-gray-600">{caller.number}</p>
                <p className="text-sm text-gray-500">Né le {caller.birthDate}</p>
            </div>
        </div>
        <div className="space-y-2 text-sm mb-8">
            <p className="text-gray-600 flex items-center"><MailIcon /> <span className="ml-2">{caller.email}</span></p>
            <p className="text-gray-600 flex items-center"><UserIcon /> <span className="ml-2">Profession: {caller.profession}</span></p>
        </div>

        <h4 className="font-semibold mb-4">Historique</h4>
        <div className="space-y-4">
            {caller.history.map((item, index) => (
                <div key={index} className="flex space-x-4">
                     <div className="text-gray-500">{/* Icon based on type */}</div>
                     <div>
                         <p className="font-semibold">{item.time}</p>
                         <p className="text-sm text-gray-600">{item.subject || item.message || `Appel sortant - Durée ${item.duration}`}</p>
                     </div>
                </div>
            ))}
        </div>
    </div>
);

// Composant: Panneau de notes avec clavier
const NotesPanel = () => {
    const keys = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '*', '0', '#'];
    return (
        <div className="w-80 bg-gray-50 border-l border-gray-200 flex flex-col p-4">
            <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold">Note</h3>
                <div>
                    <button className="p-2 text-gray-500 hover:bg-gray-200 rounded-full">&lt;</button>
                    <button className="p-2 text-gray-500 hover:bg-gray-200 rounded-full">&gt;</button>
                </div>
            </div>
            <div className="w-full h-32 bg-white rounded-lg border border-gray-200 p-2 mb-4">
                {/* Text area for notes */}
            </div>
            <div className="grid grid-cols-3 gap-2">
                {keys.map(key => (
                    <button key={key} className="py-3 bg-white border border-gray-200 rounded-lg text-xl font-semibold text-gray-700 hover:bg-gray-100">{key}</button>
                ))}
            </div>
            <div className="flex justify-center space-x-4 mt-4">
                <button className="p-4 bg-green-500 text-white rounded-full"><PhoneIcon /></button>
                <button className="p-4 bg-white border border-gray-200 text-gray-600 rounded-full"><UserIcon /></button>
            </div>
        </div>
    );
};

// --- COMPOSANT PRINCIPAL DE LA PAGE ---
// Corrigé : HomePage est devenu TelephonePage
export default function TelephonePage() {
  return (
    // Ce div remplace l'ancien <main>
    <div className="flex flex-1 p-4 gap-4 overflow-hidden">
        <CallList />
        <div className="flex-1 bg-white rounded-lg border border-gray-200 overflow-y-auto">
            <CallerDetails caller={selectedCaller} />
        </div>
        <NotesPanel />
    </div>
  );
}