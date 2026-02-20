# 🏛️ Projet Olympe - Solution de Télésecrétariat Médical (MVP FINALISÉ)

Ce dépôt contient la version aboutie du **Minimum Viable Product (MVP)**. L'application est désormais une plateforme métier complète, sécurisée et interconnectée, permettant une gestion multi-utilisateurs avec un cloisonnement étanche des données médicales.

## ℹ️ 1. INFORMATIONS SUR CETTE ÉTAPE

* **Branche Git** : "main"
* **Objectif** : Clôture du cycle de développement MVP, sécurisation totale des accès API et interconnexion des modules (Dashboard -> Messagerie).
* **Statut** : ✅ 100% Fonctionnel, Sécurisé et Documenté.

## 🛠️ 2. MODIFICATIONS DÉTAILLÉES

### 📂 Architecture Backend (Symfony)

* **`UserController.php` (Administration Équipe)** :
    * Implémentation du CRUD complet pour les secrétaires.
    * Hashage sécurisé des mots de passe et gestion des rôles (Admin vs Secrétaire).
    * Système de "Toggle" pour activer/désactiver les accès en un clic.
* **`RendezVousController.php` (Sécurisation de l'Agenda)** :
    * Intégration de la logique de "Data Scoping" : les secrétaires ne reçoivent que les RDV des médecins (clients) qui leur sont spécifiquement affectés via l'AssignmentRepository.
* **`AppelantController.php` (Protection des Données)** :
    * Sécurisation de la suppression des patients avec un bloc "try/catch" global.
    * Empêche la suppression si le patient possède un historique (RDV ou messages) pour éviter les crashs de contrainte d'intégrité.
* **`DashboardController.php` & `MessageController.php`** :
    * Filtrage des routes `/unread` et `/all` pour garantir que le tableau de bord et la messagerie respectent strictement le périmètre de chaque secrétaire.

### 📂 Architecture Frontend (React)

* **`MainLayout.jsx` (Navigation Intelligente)** :
    * Affichage conditionnel du menu "Équipe" réservé aux administrateurs.
    * Correction de la zone de survol (hover) des icônes pour une navigation fluide.
* **`HomePage.jsx` & `MessagesPage.jsx` (Deep Linking)** :
    * Branchement des boutons de raccourcis du Dashboard.
    * Navigation directe : cliquer sur un message dans le Dashboard redirige vers la messagerie et ouvre automatiquement le message sélectionné grâce à "useLocation" et "state".
* **`ContactPage.jsx` (UX & Fiabilité)** :
    * Correction de la collision d'IDs entre Clients et Appelants lors des suppressions.
    * Synchronisation automatique de la liste de droite lors du changement d'onglet (Clients/Appelants) via "useEffect".
* **Normalisation des données** :
    * Conversion systématique des IDs en entiers ("parseInt") avant chaque envoi "POST" ou "PUT" pour garantir la compatibilité avec le moteur Doctrine du Backend.

## 🧪 3. PROTOCOLE DE VALIDATION (TESTS MÉTIER)

### Test A : Isolation des données (Cloisonnement)
1. Créer deux secrétaires avec des médecins différents.
2. Vérifier que l'agenda et la messagerie de l'une ne contiennent AUCUNE donnée de l'autre.
    * **Résultat attendu** : Étanchéité totale confirmée par le serveur (403 ou tableau vide).

### Test B : Flux de travail Dashboard -> Message
1. Sur la Home, cliquer sur un message spécifique dans le widget.
    * **Résultat attendu** : La page /messages s'ouvre et le panneau de détail affiche immédiatement le contenu du message cliqué.

### Test C : Sécurité de Suppression
1. Tenter de supprimer un patient lié à un rendez-vous dans l'agenda.
    * **Résultat attendu** : Une alerte propre indique que la suppression est impossible car le dossier contient un historique.

## ⚙️ 4. INSTALLATION

" cd server "
" composer install "
" php bin/console doctrine:migrations:migrate "
" cd ../client "
" npm install "
" npm run dev "

## ⚠️ 5. RÈGLES D'OR DU PROJET

1. **Sécurité Inter-Ports** : Toujours utiliser "credentials: 'include'" dans les appels fetch pour maintenir la session entre le port 5173 (React) et 8000 (Symfony).
2. **Gestion des IDs** : Ne jamais envoyer d'IDs sous forme de chaînes de caractères ; toujours utiliser "parseInt()" côté Front.
3. **Fichiers Sensibles** : Les dossiers "vendor/", "node_modules/" et les fichiers ".env.local" sont strictement exclus du dépôt via les fichiers ".gitignore".
