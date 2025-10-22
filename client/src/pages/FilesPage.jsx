// src/pages/FilesPage.jsx

import React, { useState, useMemo } from 'react';
// Importation des icônes
import {
  FaSearch, FaFolder, FaFilePdf, FaFileWord, FaFileExcel,
  FaFileAlt, FaArrowLeft, FaPlus, FaFolderOpen
} from 'react-icons/fa';

// --- Données Fictives ---
// Structure de dossiers simple
const allFiles = [
  // Racine (parentId: null)
  { id: 'f1', type: 'folder', name: 'Procédures Internes', parentId: null },
  { id: 'f2', type: 'folder', name: 'Clients Actifs', parentId: null },
  { id: 'f3', type: 'folder', name: 'Archives', parentId: null },
  { id: 'f4', type: 'file', fileType: 'pdf', name: 'Memo_RGPD_2025.pdf', parentId: null, size: '1.2 Mo' },

  // Dans "Procédures Internes" (parentId: 'f1')
  { id: 'f1-1', type: 'file', fileType: 'pdf', name: 'Prise_de_RDV.pdf', parentId: 'f1', size: '450 Ko' },
  { id: 'f1-2', type: 'file', fileType: 'word', name: 'Script_Accueil.docx', parentId: 'f1', size: '120 Ko' },

  // Dans "Clients Actifs" (parentId: 'f2')
  { id: 'f2-1', type: 'folder', name: 'Dr. Martin Dupont', parentId: 'f2' },
  { id: 'f2-2', type: 'folder', name: 'Mme. Sophie Lefevre', parentId: 'f2' },

  // Dans "Dr. Martin Dupont" (parentId: 'f2-1')
  { id: 'f2-1-1', type: 'file', fileType: 'excel', name: 'Liste_Patients_Dupont.xlsx', parentId: 'f2-1', size: '800 Ko' },
  { id: 'f2-1-2', type: 'file', fileType: 'text', name: 'Consignes_DrDupont.txt', parentId: 'f2-1', size: '5 Ko' },
  
  // Dans "Archives" (parentId: 'f3')
  { id: 'f3-1', type: 'file', fileType: 'pdf', name: 'Factures_2024.pdf', parentId: 'f3', size: '15.4 Mo' },
];

// Fonction pour récupérer l'icône en fonction du type de fichier
const getFileIcon = (fileType) => {
  switch (fileType) {
    case 'pdf': return <FaFilePdf className="text-red-500" size={32} />;
    case 'word': return <FaFileWord className="text-blue-500" size={32} />;
    case 'excel': return <FaFileExcel className="text-green-500" size={32} />;
    default: return <FaFileAlt className="text-gray-500" size={32} />;
  }
};

export default function FilesPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentFolderId, setCurrentFolderId] = useState(null); // 'null' représente la racine

  // Trouve le dossier actuel (pour afficher le nom et le chemin)
  const currentFolder = useMemo(() => {
    return allFiles.find(f => f.id === currentFolderId);
  }, [currentFolderId]);
  
  // Logique pour filtrer les fichiers/dossiers à afficher
  const itemsToShow = useMemo(() => {
    return allFiles.filter(item => {
      // 1. Filtrer par dossier parent
      const isInCurrentFolder = item.parentId === currentFolderId;
      
      // 2. Filtrer par recherche (si une recherche est active, on cherche partout)
      if (searchTerm) {
        return item.name.toLowerCase().includes(searchTerm.toLowerCase());
      }
      
      // 3. Sinon, on affiche juste le contenu du dossier
      return isInCurrentFolder;
    });
  }, [currentFolderId, searchTerm]);

  // Gère le clic sur un item (dossier ou fichier)
  const handleItemClick = (item) => {
    if (item.type === 'folder') {
      setCurrentFolderId(item.id); // Entre dans le dossier
      setSearchTerm(''); // Réinitialise la recherche
    } else {
      // Logique pour ouvrir un fichier (ex: alert, modal, etc.)
      alert(`Ouverture du fichier : ${item.name}`);
    }
  };

  // Gère le retour au dossier parent
  const handleGoBack = () => {
    if (searchTerm) {
      // Si on est en train de chercher, le "retour" annule la recherche
      setSearchTerm('');
    } else if (currentFolder) {
      // Sinon, on remonte au dossier parent
      setCurrentFolderId(currentFolder.parentId);
    }
  };

  return (
    <div className="flex flex-1 overflow-hidden bg-gray-50">
      
      {/* --- Colonne de Gauche : Navigation (optionnelle, simplifiée ici) --- */}
      {/* Pour cette version, nous n'utilisons qu'une seule vue principale */}
      {/* Vous pourriez ajouter un arbre de dossiers ici plus tard */}

      {/* --- Contenu Principal : Grille de fichiers --- */}
      <div className="flex-1 p-6 overflow-y-auto">
        
        {/* Barre d'en-tête (Recherche et Actions) */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
          <div className="flex items-center text-gray-700">
            {(currentFolder || searchTerm) && (
              <button
                onClick={handleGoBack}
                className="p-2 rounded-full text-gray-600 hover:bg-gray-200 mr-2"
              >
                <FaArrowLeft />
              </button>
            )}
            <h1 className="text-2xl font-bold">
              {searchTerm 
                ? `Résultats pour "${searchTerm}"`
                : (currentFolder ? currentFolder.name : 'Tous les fichiers')
              }
            </h1>
          </div>
          
          <div className="flex items-center gap-4 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-64">
              <input
                type="text"
                placeholder="Rechercher un fichier..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-white rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            </div>
            <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-800 text-white text-sm font-semibold">
              <FaPlus size={14} />
              Ajouter
            </button>
          </div>
        </div>

        {/* Grille des fichiers et dossiers */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {itemsToShow.map(item => (
            <div
              key={item.id}
              onClick={() => handleItemClick(item)}
              className="flex flex-col items-center justify-center p-4 bg-white rounded-lg border border-gray-200 shadow-sm cursor-pointer hover:shadow-md hover:border-blue-500 transition-all"
            >
              <div className="mb-3">
                {item.type === 'folder' 
                  ? <FaFolderOpen className="text-blue-400" size={32} /> 
                  : getFileIcon(item.fileType)
                }
              </div>
              <p className="text-sm font-medium text-gray-800 text-center truncate w-full" title={item.name}>
                {item.name}
              </p>
              {item.type === 'file' && (
                <p className="text-xs text-gray-500">{item.size}</p>
              )}
            </div>
          ))}
        </div>

        {/* Message si le dossier ou la recherche est vide */}
        {itemsToShow.length === 0 && (
          <div className="flex flex-col items-center justify-center h-64 text-gray-500">
            <FaFolderOpen size={48} className="mb-4" />
            <p className="text-lg">
              {searchTerm ? 'Aucun fichier trouvé' : 'Ce dossier est vide'}
            </p>
          </div>
        )}

      </div>
    </div>
  );
}