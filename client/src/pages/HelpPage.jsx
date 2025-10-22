// src/pages/HelpPage.jsx

import React from 'react';
// Importation des icônes
import {
  FaSearch, FaBook, FaPhone, FaCalendarAlt,
  FaPaperPlane, FaExternalLinkAlt, FaQuestionCircle
} from 'react-icons/fa';

// Petit composant pour les liens d'articles
const HelpArticle = ({ title }) => (
  <div className="flex justify-between items-center p-4 bg-white rounded-lg border border-gray-200 hover:shadow-sm cursor-pointer">
    <span className="font-medium text-gray-700">{title}</span>
    <FaExternalLinkAlt className="text-gray-400" />
  </div>
);

export default function HelpPage() {
  return (
    <div className="flex-1 p-6 md:p-8 overflow-y-auto bg-gray-50">
      <div className="max-w-4xl mx-auto">
        
        {/* En-tête et Barre de Recherche */}
        <div className="flex flex-col items-center mb-8">
          <FaQuestionCircle className="text-gray-400 mb-4" size={48} />
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Centre d'Aide</h1>
          <p className="text-lg text-gray-600 mb-6">Comment pouvons-nous vous aider ?</p>
          <div className="relative w-full max-w-lg">
            <input
              type="text"
              placeholder="Rechercher un article (ex: 'créer un RDV')..."
              className="w-full pl-12 pr-4 py-3 bg-white rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          </div>
        </div>

        {/* Catégories d'aide */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          
          {/* Catégorie 1: Gestion des Appels */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
              <FaPhone className="mr-3 text-blue-500" />
              Gestion des Appels
            </h3>
            <div className="space-y-3">
              <HelpArticle title="Comment prendre un appel entrant ?" />
              <HelpArticle title="Transférer un appel à un collègue" />
              <HelpArticle title="Écouter un message vocal" />
            </div>
          </div>

          {/* Catégorie 2: Calendrier */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
              <FaCalendarAlt className="mr-3 text-green-500" />
              Calendrier et RDV
            </h3>
            <div className="space-y-3">
              <HelpArticle title="Créer un nouveau rendez-vous" />
              <HelpArticle title="Modifier ou annuler un RDV" />
              <HelpArticle title="Gérer les indisponibilités" />
            </div>
          </div>
        </div>

        {/* Section: Contacter le Support */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Vous ne trouvez pas de réponse ?</h2>
          <p className="text-center text-gray-600 mb-6">Contactez notre équipe de support directement.</p>
          
          <form className="max-w-lg mx-auto space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Sujet</label>
              <input type="text" placeholder="Ex: Problème de connexion..." className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"/>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Votre message</label>
              <textarea rows="5" placeholder="Décrivez votre problème en détail..." className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"></textarea>
            </div>
            <div className="text-right">
              <button type="submit" className="inline-flex items-center gap-2 px-5 py-2 bg-gray-800 text-white font-semibold rounded-lg hover:bg-gray-700">
                <FaPaperPlane />
                Envoyer le message
              </button>
            </div>
          </form>
        </div>

      </div>
    </div>
  );
}