# 📝 Projet Olympe - Module de Gestion des Tâches (POST-MVP Phase 1)

Ce document détaille l'implémentation du module de gestion des tâches (To-Do List), première étape majeure de la phase Post-MVP de l'application Olympe.

## ℹ️ 1. INFORMATIONS SUR CETTE ÉTAPE

* **Branche Git** : `feature/post-mvp-tasks`
* **Objectif** : Ajouter un système de rappels internes pour les secrétaires, avec un mode supervision pour l'administrateur et une intégration directe au tableau de bord.
* **Statut** : ✅ 100% Fonctionnel, Intégré et Sécurisé.

## 🛠️ 2. MODIFICATIONS DÉTAILLÉES

### 📂 Architecture Backend (Symfony)

* **`Task.php` (Nouvelle Entité)** :
    * Création de la table des tâches avec les champs : `title`, `isDone` (statut), `createdAt` et `owner` (relation ManyToOne vers l'utilisateur).
    * Cloisonnement natif : chaque tâche est liée à son créateur via la propriété `owner`.
* **`TaskController.php` (API & Sécurité)** :
    * **Mode Supervision** : La route `GET` détecte le rôle de l'utilisateur. Un administrateur reçoit toutes les tâches du centre (avec le nom du créateur), tandis qu'une secrétaire ne voit que les siennes.
    * **Droits Étendus** : Les fonctions `toggle` et `delete` vérifient si l'utilisateur est le propriétaire OU possède le rôle `ROLE_ADMIN` avant d'autoriser l'action.

### 📂 Architecture Frontend (React)

* **`TasksPage.jsx` (Kanban Interactif)** :
    * Interface organisée en deux colonnes : "À faire" et "Terminées".
    * Barre de création rapide en haut de page pour une saisie fluide.
    * Système de "Highlight" : gestion de la réception d'IDs via le Dashboard pour une navigation ciblée.
* **`HomePage.jsx` (Widget Dynamique)** :
    * Remplacement des données fictives par un appel API réel vers `/api/tasks`.
    * Filtrage automatique pour n'afficher que les tâches actives (`isDone: false`).
    * **Téléportation Instantanée** : Les tâches du dashboard sont cliquables et redirigent vers la page dédiée avec une sélection automatique du message/tâche cible.
* **`MessagesPage.jsx` (Optimisation UX)** :
    * Standardisation de la navigation : alignement de la logique de sélection sur celle des tâches.
    * Suppression des animations lourdes au profit d'une "téléportation" instantanée pour garantir la fluidité de l'interface.

## 🧪 3. PROTOCOLE DE VALIDATION (TESTS MÉTIER)

### Test A : Supervision Admin
1. Se connecter en tant qu'Admin.
2. Créer une tâche sous le compte Admin.
3. Vérifier que les tâches créées par les secrétaires sont visibles et portent la mention "Par [Nom de la secrétaire]".
    * **Résultat attendu** : Vue globale confirmée.

### Test B : Confidentialité Secrétaire
1. Se connecter en tant que Secrétaire A.
2. Vérifier que les tâches de la Secrétaire B et de l'Admin sont invisibles.
    * **Résultat attendu** : Cloisonnement strict confirmé.

### Test C : Flux Dashboard -> Tâche
1. Sur le Tableau de Bord, cliquer sur une tâche spécifique.
    * **Résultat attendu** : Redirection vers `/tasks` et sélection immédiate de la tâche concernée.

---
## 🚀 [Version 1.1] - Dossier Patient 360° & Finalisation MVP Messagerie

### ✨ Nouvelles Fonctionnalités
* **Dossier Patient 360° (`PatientDetailsPage`)** : 
  * Création d'une vue centralisée par patient.
  * Timeline chronologique fusionnant l'historique des Rendez-vous et des Messages liés au patient.
  * **Module Message Express** : Intégration d'un module d'envoi rapide de messages (consignes) au médecin directement depuis la fiche du patient, avec rafraîchissement automatique de la timeline.
* **Annuaire Connecté** : 
  * Ajout d'un bouton d'accès direct au "Dossier 360°" depuis la carte d'un appelant dans l'Annuaire.

### 🛠️ Améliorations Backend (Symfony)
* **API Sécurisée (`MeAssignmentController`)** : Enrichissement des données transmises à la secrétaire (ajout de l'email, adresse et date de naissance des médecins affectés) tout en maintenant le cloisonnement strict.
* **Messagerie Intelligente (`MessageController`)** :
  * **Auto-Routage** : Le backend identifie automatiquement le médecin traitant du patient et assigne le message au bon destinataire.
  * **Auto-Expéditeur** : Le nom de la secrétaire connectée est automatiquement signé sur les nouveaux messages.
  * **Typage dynamique (`senderType`)** : Le serveur fait désormais la distinction entre un message concernant un dossier médical (`patient`) et une consigne interne au secrétariat (`secretary`).
  * **Uniformisation des Titres** : La liste des messages affiche prioritairement le Nom du Patient, sauf s'il s'agit d'une consigne interne (affichage du nom de la secrétaire).

### 🎨 UX/UI & Sécurités Front-end
* **Protection des Données Inter-Secrétaires** : Dans l'annuaire, si une secrétaire modifie un patient rattaché à un médecin hors de son scope, le champ "Médecin traitant" est verrouillé en lecture seule pour éviter d'écraser l'affection par erreur.
* **Panneau d'information Dynamique (Messagerie)** : 
  * Adaptation visuelle selon la source du message (Badge "PATIENT" ou "SECRÉTAIRE").
  * Masquage intelligent des données non pertinentes (ex: le champ "Téléphone" et le bouton "Appeler" disparaissent pour les messages internes entre secrétaires et médecins).
  * Affichage de l'email professionnel correct en fonction du contexte.
