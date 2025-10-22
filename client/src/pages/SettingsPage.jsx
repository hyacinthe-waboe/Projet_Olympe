// src/pages/SettingsPage.jsx

import React, { useState } from 'react';
// Importation des icônes (avec ajouts)
import {
  FaUserCircle, FaBell, FaPalette, FaShieldAlt,
  FaCreditCard, FaQuestionCircle, FaMicrophone, FaVolumeUp,
  FaKey, FaToggleOn, FaFileInvoice, FaExternalLinkAlt
} from 'react-icons/fa';

// --- Sous-composants pour chaque section de paramètres ---

// ... (ProfileSettings, NotificationSettings, AudioSettings, AppearanceSettings restent les mêmes)

const ProfileSettings = () => (
  <div>
    <h2 className="text-2xl font-bold text-gray-800 mb-6">Mon Profil</h2>
    <div className="bg-white p-6 rounded-lg shadow-sm space-y-4">
      <div className="flex items-center space-x-4">
        <div className="w-16 h-16 rounded-full bg-gray-800 flex items-center justify-center text-white font-bold text-2xl">
          JD
        </div>
        <div>
          <button className="text-sm font-semibold bg-gray-200 px-4 py-2 rounded-lg hover:bg-gray-300">Changer l'avatar</button>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Nom complet</label>
          <input type="text" defaultValue="John DOE" className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"/>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Adresse email</label>
          <input type="email" defaultValue="john.doe@telemed.com" className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"/>
        </div>
      </div>
       <div className="pt-4 border-t border-gray-200">
         <button className="px-5 py-2 bg-gray-800 text-white font-semibold rounded-lg hover:bg-gray-700">Enregistrer les modifications</button>
      </div>
    </div>
  </div>
);

const NotificationSettings = () => (
  <div>
    <h2 className="text-2xl font-bold text-gray-800 mb-6">Notifications</h2>
    <div className="bg-white p-6 rounded-lg shadow-sm space-y-4">
      <p className="text-gray-600">Choisissez comment vous souhaitez être notifié.</p>
      <div className="flex justify-between items-center p-3 border rounded-lg">
        <span>Nouvel appel entrant</span>
        <ToggleSwitch enabled={true} />
      </div>
      <div className="flex justify-between items-center p-3 border rounded-lg">
        <span>Nouveau message</span>
        <ToggleSwitch enabled={true} />
      </div>
       <div className="flex justify-between items-center p-3 border rounded-lg">
        <span>Nouvelle tâche assignée</span>
        <ToggleSwitch enabled={false} />
      </div>
      <div className="flex justify-between items-center p-3 border rounded-lg">
        <span>Notification sonore</span>
        <ToggleSwitch enabled={true} />
      </div>
    </div>
  </div>
);

const AudioSettings = () => (
    <div>
    <h2 className="text-2xl font-bold text-gray-800 mb-6">Périphériques Audio & Vidéo</h2>
    <div className="bg-white p-6 rounded-lg shadow-sm space-y-4">
        <div>
            <label className="block text-sm font-medium text-gray-700">Microphone</label>
            <select className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500">
                <option>Par défaut - Microphone (Realtek)</option>
                <option>Casque Pro USB</option>
            </select>
        </div>
        <div>
            <label className="block text-sm font-medium text-gray-700">Haut-parleurs</label>
            <select className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500">
                <option>Par défaut - Haut-parleurs (Realtek)</option>
                <option>Casque Pro USB</option>
            </select>
        </div>
    </div>
  </div>
)

const AppearanceSettings = () => (
  <div>
    <h2 className="text-2xl font-bold text-gray-800 mb-6">Apparence</h2>
    <div className="bg-white p-6 rounded-lg shadow-sm space-y-4">
      <p>Choisissez un thème pour l'application.</p>
       <div className="flex space-x-4">
            <button className="flex-1 py-3 border-2 border-blue-500 rounded-lg font-semibold">Clair</button>
            <button className="flex-1 py-3 border rounded-lg font-semibold">Sombre</button>
            <button className="flex-1 py-3 border rounded-lg font-semibold">Système</button>
       </div>
    </div>
  </div>
);

// --- SECTIONS MISES À JOUR AVEC UN CONTENU PROPRE ---

const SecuritySettings = () => (
  <div>
    <h2 className="text-2xl font-bold text-gray-800 mb-6">Sécurité et Connexion</h2>
    
    <div className="bg-white p-6 rounded-lg shadow-sm space-y-4 mb-6">
      <h3 className="text-lg font-semibold text-gray-800">Changer le mot de passe</h3>
      <div className="grid grid-cols-1 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Mot de passe actuel</label>
          <input type="password" placeholder="••••••••" className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"/>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Nouveau mot de passe</label>
          <input type="password" placeholder="Nouveau mot de passe" className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"/>
        </div>
      </div>
       <div className="pt-4 border-t border-gray-200">
         <button className="px-5 py-2 bg-gray-800 text-white font-semibold rounded-lg hover:bg-gray-700">Mettre à jour le mot de passe</button>
      </div>
    </div>

    <div className="bg-white p-6 rounded-lg shadow-sm space-y-4">
       <h3 className="text-lg font-semibold text-gray-800">Authentification à deux facteurs</h3>
       <div className="flex justify-between items-center p-3 border rounded-lg">
        <div>
            <p className="font-medium">Statut</p>
            <p className="text-sm text-gray-600">L'authentification à deux facteurs n'est pas activée.</p>
        </div>
        <ToggleSwitch enabled={false} />
      </div>
    </div>
  </div>
);

const SubscriptionSettings = () => (
  <div>
    <h2 className="text-2xl font-bold text-gray-800 mb-6">Abonnement et Facturation</h2>
    
    <div className="bg-white p-6 rounded-lg shadow-sm space-y-4 mb-6">
      <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
        <div>
            <p className="text-sm font-medium text-gray-600">Forfait Actuel</p>
            <p className="text-2xl font-bold text-blue-600">Forfait Professionnel</p>
            <p className="text-sm text-gray-600">Prochain renouvellement le 1er Nov. 2025</p>
        </div>
        <button className="px-5 py-2 bg-gray-200 text-gray-800 font-semibold rounded-lg hover:bg-gray-300">Gérer l'abonnement</button>
      </div>
       <div className="pt-4">
          <h3 className="text-lg font-semibold text-gray-800">Moyen de paiement</h3>
          <p className="mt-2 text-gray-700">Carte Visa se terminant par •••• 4242</p>
          <button className="mt-2 text-sm font-medium text-blue-600 hover:underline">Mettre à jour</button>
      </div>
    </div>

    <div className="bg-white p-6 rounded-lg shadow-sm space-y-4">
        <h3 className="text-lg font-semibold text-gray-800">Historique des factures</h3>
        <ul className="space-y-3">
            <li className="flex justify-between items-center p-3 border rounded-lg">
                <span className="text-gray-700">Facture Octobre 2025</span>
                <button className="flex items-center gap-2 text-sm text-blue-600 font-medium"><FaFileInvoice /> Télécharger</button>
            </li>
            <li className="flex justify-between items-center p-3 border rounded-lg">
                <span className="text-gray-700">Facture Septembre 2025</span>
                <button className="flex items-center gap-2 text-sm text-blue-600 font-medium"><FaFileInvoice /> Télécharger</button>
            </li>
        </ul>
    </div>
  </div>
);

const HelpSettings = () => (
  <div>
    <h2 className="text-2xl font-bold text-gray-800 mb-6">Aide et Support</h2>

    <div className="bg-white p-6 rounded-lg shadow-sm space-y-4 mb-6">
      <h3 className="text-lg font-semibold text-gray-800">Contacter le support</h3>
      <p className="text-sm text-gray-600">Vous rencontrez un problème ? Notre équipe est là pour vous aider.</p>
      <div className="grid grid-cols-1 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Sujet</label>
          <input type="text" placeholder="Ex: Problème de connexion..." className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"/>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Votre message</label>
          <textarea rows="5" placeholder="Décrivez votre problème en détail..." className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"></textarea>
        </div>
      </div>
       <div className="pt-4 border-t border-gray-200">
         <button className="px-5 py-2 bg-gray-800 text-white font-semibold rounded-lg hover:bg-gray-700">Envoyer le message</button>
      </div>
    </div>

    <div className="bg-white p-6 rounded-lg shadow-sm space-y-4">
       <h3 className="text-lg font-semibold text-gray-800">Base de connaissance</h3>
       <p className="text-sm text-gray-600">Trouvez des réponses et des guides dans notre centre d'aide.</p>
       <button className="w-full flex justify-between items-center p-4 bg-gray-50 hover:bg-gray-100 border rounded-lg">
           <span className="font-semibold text-gray-700">Visiter le Centre d'Aide</span>
           <FaExternalLinkAlt className="text-gray-500" />
       </button>
    </div>
  </div>
);

// --- Composant principal de la page de paramètres ---

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('profile');

  const renderContent = () => {
    switch (activeTab) {
      case 'profile': return <ProfileSettings />;
      case 'notifications': return <NotificationSettings />;
      case 'audio': return <AudioSettings />;
      case 'appearance': return <AppearanceSettings />;
      // --- APPEL DES NOUVELLES SECTIONS ---
      case 'security': return <SecuritySettings />;
      case 'subscription': return <SubscriptionSettings />;
      case 'help': return <HelpSettings />;
      default: return <ProfileSettings />;
    }
  };
  
  // Petit composant réutilisable pour le bouton de navigation
  const NavButton = ({ id, icon, label }) => (
    <button
        onClick={() => setActiveTab(id)}
        className={`w-full flex items-center space-x-3 p-3 rounded-lg text-left ${activeTab === id ? 'bg-gray-200 font-semibold text-gray-900' : 'hover:bg-gray-100 text-gray-600'}`}
    >
        {icon}
        <span>{label}</span>
    </button>
  );

  return (
    <div className="flex flex-1 overflow-hidden bg-gray-50">
      
      {/* --- Colonne de Gauche : Navigation des Paramètres --- */}
      <div className="w-80 bg-white border-r border-gray-200 p-4">
        <h1 className="text-xl font-bold text-gray-800 mb-6">Paramètres</h1>
        <nav className="space-y-2">
            <NavButton id="profile" icon={<FaUserCircle size={18} />} label="Mon Profil" />
            <NavButton id="notifications" icon={<FaBell size={18} />} label="Notifications" />
            <NavButton id="audio" icon={<FaMicrophone size={18} />} label="Périphériques Audio" />
            <NavButton id="appearance" icon={<FaPalette size={18} />} label="Apparence" />
            <NavButton id="security" icon={<FaShieldAlt size={18} />} label="Sécurité" />
            <NavButton id="subscription" icon={<FaCreditCard size={18} />} label="Abonnement" />
            <NavButton id="help" icon={<FaQuestionCircle size={18} />} label="Aide" />
        </nav>
      </div>

      {/* --- Contenu de Droite : Section Active --- */}
      <div className="flex-1 p-8 overflow-y-auto">
        {renderContent()}
      </div>
    </div>
  );
}

// Composant de toggle réutilisable
const ToggleSwitch = ({ enabled }) => {
  const [isEnabled, setIsEnabled] = useState(enabled);
  return (
    <button
      onClick={() => setIsEnabled(!isEnabled)}
      className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors ${isEnabled ? 'bg-blue-600' : 'bg-gray-300'}`}
    >
      <span className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform ${isEnabled ? 'translate-x-6' : 'translate-x-1'}`} />
    </button>
  );
};