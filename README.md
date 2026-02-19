# 📬 Étape 5 : Messagerie Métier, Sécurité MVP & Filtrage des Accès (Front/Back)

Cette étape marque le passage d'un socle technique à une application métier opérationnelle. Elle implémente la **gestion des messages**, le **cloisonnement des données** par secrétaire (exigence MVP) et la **persistance des notes administratives**.

## ℹ️ 1. INFORMATIONS SUR CETTE ÉTAPE

* **Branche Git** : `feature/messaging-security-mvp`
* **Objectif** : Finaliser le module Messagerie et garantir qu'une secrétaire ne voit que les clients qui lui sont affectés.
* **Statut** : ✅ Validé & Fonctionnel

## 🛠️ 2. MODIFICATIONS DÉTAILLÉES

### 📂 Côté Backend (Symfony)

* **`src/Entity/User.php`** :
    * **Gouvernance MVP** : Ajout d'une relation `ManyToMany` avec l'entité `Client`. Cette structure permet l'affectation flexible de plusieurs médecins à une même secrétaire.
* **`src/Controller/MessageController.php`** :
    * **Filtrage de Sécurité** : Refonte des méthodes `all` et `unread`. Elles injectent désormais l'utilisateur connecté via `$this->getUser()` et filtrent les messages par `client_id` basé sur la liste d'affectation de l'utilisateur.
    * **Persistance des Notes** : Création de la route `POST /note` pour sauvegarder les consignes internes sans modifier l'état "Lu/Non-lu" du message.
    * **Nettoyage de Base** : Implémentation de la méthode `delete` pour autoriser la suppression physique des entrées obsolètes.
* **`src/Controller/SecurityController.php`** :
    * **Payload Étendu** : La route `/login` renvoie désormais le `firstName`, le `lastName` et les `roles` pour personnaliser l'interface dès la connexion.

### 📂 Côté Frontend (React)

#### A. Module Messagerie (`MessagesPage.jsx`)
* **Architecture Tri-partite** :
    * **`MessageList`** : Gestion des onglets "Tous / Nouveaux" et intégration d'un système de **sélection multiple** par cases à cocher.
    * **`Conversation`** : Vue interactive permettant le basculement rapide entre les états "Traité" et "Non lu".
    * **`InfoPanel`** : Panneau latéral affichant les données du patient et le formulaire de notes internes.
* **Logique de Persistance** :
    * **Sauvegarde Silencieuse** : Utilisation de l'événement `onBlur` sur les notes administratives pour déclencher une sauvegarde automatique dès que la secrétaire quitte le champ de saisie.
* **Annuaire Rapide** : Implémentation d'une modale flottante connectée au référentiel des Appelants, permettant de déclencher un appel fictif sans rompre le flux de travail des messages.

## 🧪 3. PROTOCOLE DE VALIDATION (TESTS)

### Test A : Étanchéité des Données (Règle d'Or MVP)
1. Connectez-vous avec le compte `admin@olympe.com`.
2. Allez dans "Messages" et tentez de créer un "+ Nouveau".
    * **Attendu** : La liste des médecins doit être vide (si aucune affectation n'est faite en base).
3. Utilisez la route `/api/messages/link-test` pour lier un médecin.
4. Actualisez la page.
    * **Attendu** : Seuls les messages et le médecin lié doivent apparaître. Preuve que le filtrage par session fonctionne.

### Test B : Gestion des États et Sélection
1. Cliquez sur un message dans l'onglet "Nouveaux". Cliquez sur "Traiter".
    * **Attendu** : Le message disparaît de l'onglet "Nouveaux" et la conversation suivante est sélectionnée automatiquement.
2. Cliquez sur "Remettre en non lu".
    * **Attendu** : Le message réapparaît instantanément dans la liste prioritaire.

### Test C : Persistance des Notes de Secrétariat
1. Dans le panneau "Info" à droite, saisissez un texte dans "Notes administratives".
2. Cliquez n'importe où ailleurs sur la page (déclenchement du `onBlur`).
3. Rafraîchissez la page (Touche F5).
    * **Attendu** : Le texte saisi doit être intact. Preuve que la requête `POST /note` a été validée.

### Test D : Suppression de Masse
1. Cochez 3 messages différents via les cases à cocher de la liste de gauche.
2. Cliquez sur le bouton rouge "Supprimer (3)" apparu en haut de la liste.
3. Validez l'alerte de confirmation native.
    * **Attendu** : Les 3 messages disparaissent de la liste et de la base de données.

### Test E : Annuaire et Appel
1. Cliquez sur le bouton "Contact" à côté de "+ Nouveau".
2. Saisissez le nom d'un patient existant.
3. Cliquez sur l'icône téléphone bleue.
    * **Attendu** : Une alerte "Appel vers [Numéro]..." s'affiche. Preuve de la liaison avec le référentiel Appelants.

## ⚠️ 4. RÈGLES DE DÉVELOPPEMENT

1. **Sécurité Inter-Ports** : Toujours inclure `credentials: 'include'` dans les `fetch` vers Symfony pour que le serveur puisse identifier la secrétaire via ses cookies de session.
2. **Synchronisation d'État** : Lors de la mise à jour d'une note, mettre à jour à la fois `selectedMsg` (pour l'affichage immédiat) et la liste `messages` (pour éviter un rollback visuel lors du changement de filtre).
3. **Méthode HTTP** : Préférer le `POST` pour les mises à jour partielles (comme les notes) afin de contourner les limitations de certains pare-feux sur le `PATCH` ou `PUT`.