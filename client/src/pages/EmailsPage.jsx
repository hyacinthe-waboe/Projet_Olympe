// src/pages/EmailsPage.jsx

import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom'; 

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
const ChevronDownSmIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
);
const PinIcon = ({ filled }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 10c0 1.1-.9 2-2 2H5c-1.1 0-2-.9-2-2V3c0-1.1.9-2 2-2h14c1.1 0 2 .9 2 2v7z" />
        <line x1="12" y1="12" x2="12" y2="22" />
        <line x1="8" y1="16" x2="16" y2="16" />
    </svg>
);
// --- AJOUT : Icône pour fermer la modale ---
const CloseIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
);


// --- Données de simulation initiales ---
const initialEmailList = [
    { id: 1, sender: 'Exemple email n°1', subject: 'Contenu de l\'email...', time: '20:19', read: true, isFavorite: false, isPinned: false, to: 'john.doe@email.com', content: 'Contenu email 1' },
    { id: 2, sender: 'Exemple email n°2', subject: 'Contenu de l\'email...', time: 'Hier', read: false, isFavorite: true, isPinned: false, to: 'jane.smith@email.com', content: 'Contenu email 2' },
    { id: 3, sender: 'Exemple email n°3', subject: 'Contenu de l\'email...', time: '14/02/2021', read: true, isFavorite: false, isPinned: true, to: 'bob.johnson@email.com', content: 'Contenu email 3' },
];


// --- Composant: Colonne de gauche (Liste des emails) ---
const EmailList = ({ 
    emails, 
    onSelectEmail, 
    selectedEmailId, 
    onSetFilter, 
    onSelectPrevious, 
    onSelectNext, 
    canSelectPrevious, 
    canSelectNext,
    onComposeClick // --- AJOUT : prop pour ouvrir la modale ---
}) => {
    return (
        <div className="w-96 bg-white border-r border-gray-200 flex flex-col">
            {/* Header */}
            <div className="p-4 border-b border-gray-200">
                <h2 className="text-xl font-semibold">Emails</h2>
                <p className="text-sm text-gray-500">Samedi 13 février</p>
                <div className="flex space-x-2 mt-4">
                    {/* --- MODIFIÉ : onClick pour ouvrir la modale --- */}
                    <button 
                        onClick={onComposeClick}
                        className="px-4 py-2 rounded-lg bg-gray-800 text-white text-sm font-semibold flex items-center space-x-1"
                    >
                        <PlusIcon />
                        <span>Nouveau message</span>
                    </button>
                    
                    <Link to="/contacts" className="px-4 py-2 rounded-lg border border-gray-300 text-sm font-semibold">
                        Contact
                    </Link>
                    
                    <button 
                        onClick={() => onSetFilter('favorites')} 
                        className="p-2 border rounded-md text-gray-500 hover:bg-gray-100"
                        title="Afficher les favoris"
                    >
                        <StarIcon />
                    </button>
                    
                    <button 
                        onClick={() => alert('Logique pour ajouter un libellé à implémenter')}
                        className="p-2 border rounded-md text-gray-500 hover:bg-gray-100"
                        title="Ajouter un libellé"
                    >
                        <TagIcon />
                    </button>
                    <button className="p-2 border rounded-md text-gray-500 hover:bg-gray-100"><FlagIcon /></button>
                    
                    <button 
                        onClick={onSelectPrevious} 
                        disabled={!canSelectPrevious}
                        className="p-2 border rounded-md text-gray-500 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                        title="Email précédent"
                    >
                        <ArrowLeftIcon />
                    </button>
                    <button 
                        onClick={onSelectNext}
                        disabled={!canSelectNext}
                        className="p-2 border rounded-md text-gray-500 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                        title="Email suivant"
                    >
                        <ArrowRightIcon />
                    </button>
                    
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

            {/* Onglets */}
            <div className="p-4 border-b border-gray-200">
                <button onClick={() => onSetFilter('all')} className="font-semibold text-gray-800">
                    Toutes les boites
                </button>
            </div>

            {/* Liste des emails */}
            <div className="flex-1 overflow-y-auto">
                {emails.map(email => (
                    <div 
                        key={email.id} 
                        onClick={() => onSelectEmail(email.id)}
                        className={`flex p-3 space-x-3 cursor-pointer ${selectedEmailId === email.id ? 'bg-blue-50' : 'hover:bg-gray-50'} ${!email.read ? 'font-semibold' : 'text-gray-700'}`}
                    >
                        <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center font-bold text-gray-600 text-sm">
                            {email.sender[0]}
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-center">
                                <h3 className="text-sm truncate">{email.sender}</h3>
                                <span className="text-xs text-gray-500 flex-shrink-0 ml-2">{email.time}</span>
                            </div>
                            <p className="text-xs text-gray-600 truncate">{email.subject}</p>
                            
                            <div className="flex space-x-2 mt-1">
                                {email.isPinned && <PinIcon filled={true} />}
                                {email.isFavorite && <StarIcon filled={true} />}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

// --- Composant: Colonne centrale (Contenu de l'email) ---
const EmailContent = ({ email, onToggleFavorite, onTogglePinned }) => {
    if (!email) {
        return (
            <div className="flex-1 flex items-center justify-center bg-white text-gray-500">
                Sélectionnez un email pour le lire.
            </div>
        );
    }

    return (
        <div className="flex-1 flex flex-col bg-white">
            {/* Header de l'email */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold">{email.sender}</h3>
                <div className="flex items-center space-x-3 text-gray-500">
                    
                    <button 
                        onClick={() => onTogglePinned(email.id)}
                        className="p-2 bg-gray-100 rounded-md hover:text-gray-800"
                        title={email.isPinned ? "Désépingler" : "Épingler"}
                    >
                        <PinIcon filled={email.isPinned} />
                    </button>

                    <button 
                        onClick={() => onToggleFavorite(email.id)} 
                        className="p-2 bg-gray-100 rounded-md hover:text-gray-800"
                        title={email.isFavorite ? "Retirer des favoris" : "Mettre en favoris"}
                    >
                        <StarIcon filled={email.isFavorite} />
                    </button>
                    
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
                <p className="mb-1">De: <span className="font-medium">{email.sender}</span></p>
                <p>À: <span className="font-medium">{email.to}</span></p>
            </div>

            {/* Contenu de l'email */}
            <div className="flex-1 p-4 overflow-y-auto text-gray-800">
                <p>{email.content}</p>
            </div>
        </div>
    );
};

// --- AJOUT : Composant pour la fenêtre de composition d'email ---
const EmailCompose = ({ onClose }) => {
    // États locaux pour les champs du formulaire
    const [to, setTo] = useState('');
    const [subject, setSubject] = useState('');
    const [body, setBody] = useState('');

    const handleSend = () => {
        // Logique d'envoi (simulation)
        alert(`Simulation d'envoi :\nÀ: ${to}\nObjet: ${subject}\nCorps: ${body}`);
        onClose(); // Fermer la modale après l'envoi
    };

    return (
        // Conteneur de la modale : position fixe en bas à droite, z-index élevé
        <div className="fixed bottom-0 right-16 w-full max-w-md bg-white border border-gray-300 rounded-t-lg shadow-2xl z-50">
            {/* Header de la modale */}
            <div className="flex justify-between items-center bg-gray-700 text-white p-3 rounded-t-lg">
                <h3 className="font-semibold">Nouveau message</h3>
                <button onClick={onClose} className="hover:bg-gray-600 rounded-full p-1">
                    <CloseIcon />
                </button>
            </div>
            
            {/* Formulaire */}
            <form onSubmit={(e) => { e.preventDefault(); handleSend(); }}>
                <div className="p-4 space-y-3">
                    {/* Champ "À" */}
                    <div className="border-b border-gray-300">
                        <input 
                            type="email" 
                            placeholder="À" 
                            value={to}
                            onChange={(e) => setTo(e.target.value)}
                            className="w-full p-2 text-sm focus:outline-none"
                            required
                        />
                    </div>
                    {/* Champ "Objet" */}
                    <div className="border-b border-gray-300">
                        <input 
                            type="text" 
                            placeholder="Objet" 
                            value={subject}
                            onChange={(e) => setSubject(e.target.value)}
                            className="w-full p-2 text-sm focus:outline-none"
                        />
                    </div>
                    {/* Champ "Contenu" */}
                    <div>
                        <textarea 
                            value={body}
                            onChange={(e) => setBody(e.target.value)}
                            className="w-full h-48 p-2 text-sm focus:outline-none resize-none"
                        />
                    </div>
                </div>
                
                {/* Pied de page de la modale avec le bouton "Envoyer" */}
                <div className="p-3 border-t border-gray-200 bg-gray-50">
                    <button 
                        type="submit"
                        className="bg-blue-600 text-white font-semibold px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        Envoyer
                    </button>
                </div>
            </form>
        </div>
    );
};


// --- COMPOSANT PRINCIPAL DE LA PAGE EMAILS ---
export default function EmailsPage() {
    const [emails, setEmails] = useState(initialEmailList);
    const [selectedEmailId, setSelectedEmailId] = useState(1); 
    const [filter, setFilter] = useState('all'); 
    
    // --- AJOUT : État pour la fenêtre de composition ---
    const [isComposing, setIsComposing] = useState(false);

    const handleToggleFavorite = (id) => {
        setEmails(currentEmails =>
            currentEmails.map(email =>
                email.id === id ? { ...email, isFavorite: !email.isFavorite } : email
            )
        );
    };

    const handleTogglePinned = (id) => {
        setEmails(currentEmails =>
            currentEmails.map(email =>
                email.id === id ? { ...email, isPinned: !email.isPinned } : email
            )
        );
    };
    
    const handleSelectEmail = (id) => {
        setSelectedEmailId(id);
        setEmails(currentEmails =>
            currentEmails.map(email =>
                email.id === id ? { ...email, read: true } : email
            )
        );
    };

    const filteredAndSortedEmails = useMemo(() => {
        return emails
            .filter(email => {
                if (filter === 'favorites') return email.isFavorite;
                return true;
            })
            .sort((a, b) => {
                if (a.isPinned && !b.isPinned) return -1;
                if (!a.isPinned && b.isPinned) return 1;
                return b.id - a.id; 
            });
    }, [emails, filter]);

    const currentEmailIndex = filteredAndSortedEmails.findIndex(e => e.id === selectedEmailId);
    
    const canSelectPrevious = currentEmailIndex > 0;
    const canSelectNext = currentEmailIndex < filteredAndSortedEmails.length - 1;

    const handleSelectPrevious = () => {
        if (canSelectPrevious) {
            const previousEmailId = filteredAndSortedEmails[currentEmailIndex - 1].id;
            handleSelectEmail(previousEmailId);
        }
    };

    const handleSelectNext = () => {
        if (canSelectNext) {
            const nextEmailId = filteredAndSortedEmails[currentEmailIndex + 1].id;
            handleSelectEmail(nextEmailId);
        }
    };

    const selectedEmail = emails.find(e => e.id === selectedEmailId);

    return (
        <div className="flex flex-1 overflow-hidden">
            <EmailList 
                emails={filteredAndSortedEmails}
                onSelectEmail={handleSelectEmail}
                selectedEmailId={selectedEmailId}
                onSetFilter={setFilter}
                onSelectPrevious={handleSelectPrevious}
                onSelectNext={handleSelectNext}
                canSelectPrevious={canSelectPrevious}
                canSelectNext={canSelectNext}
                // --- AJOUT : Passer la fonction pour ouvrir ---
                onComposeClick={() => setIsComposing(true)}
            />
            <EmailContent 
                email={selectedEmail}
                onToggleFavorite={handleToggleFavorite}
                onTogglePinned={handleTogglePinned}
            />

            {/* --- AJOUT : Affichage conditionnel de la modale --- */}
            {isComposing && (
                <EmailCompose 
                    onClose={() => setIsComposing(false)} 
                />
            )}
        </div>
    );
}