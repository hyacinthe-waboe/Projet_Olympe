# 📅 Étape 4 : Intégration Complète Agenda & Contacts (Front/Back)

Cette étape marque la **connexion finale** entre l'interface React et le Backend Symfony. Elle transforme les maquettes en une application fonctionnelle avec persistance des données, validation métier et sécurisation des suppressions.

## ℹ️ 1. INFORMATIONS SUR CETTE ÉTAPE

* **Branche Git** : `feature/agenda-contacts-backend`
* **Objectif** : Rendre l'Agenda et la page Contacts totalement dynamiques, sécurisés et synchronisés.
* **Statut** : ✅ Validé & Fonctionnel

## 🛠️ 2. MODIFICATIONS DÉTAILLÉES

### 📂 Côté Backend (Symfony)

* **`src/Controller/AppelantController.php`** :
    * **Synchronisation Relationnelle** : Refonte de la méthode `createOrUpdate`. Désormais, lors d'une modification de médecin traitant, l'ancien lien est supprimé (`removeClient`) avant d'ajouter le nouveau, garantissant une relation unique.
    * **Sécurisation de la Suppression** : La méthode `delete` injecte désormais `RendezVousRepository`. Avant de supprimer un patient, elle vérifie s'il possède des RDV. Si oui, elle renvoie une **Erreur 400** bloquante avec un message explicite.
    * **Correction Variable** : Correction du bug de nommage (`$this->appelantRepository` vs `$this->repository`).

### 📂 Côté Frontend (React)

#### A. Module Agenda (`CalendarPage.jsx`)
* **Logique Métier (Règles Business)** :
    * **Limite de Capacité** : Algorithme empêchant la création de plus de **2 rendez-vous simultanés** sur le même créneau horaire.
    * **Verrouillage Temporel** : Interdiction stricte (visuelle et logique) de créer ou déplacer un RDV dans le passé.
* **Design & UX** :
    * **Couleurs Dynamiques** : Implémentation d'un générateur HSL basé sur l'ID du médecin (Angle d'Or) pour garantir des couleurs uniques et stables sans limite de nombre.
    * **Composants Visuels** :
        * `WeekEventComponent` : Affichage optimisé "Titre + Patient + Médecin". Sur les créneaux conflictuels, le médecin s'aligne pour ne pas être masqué.
        * `AgendaEventComponent` : Vue liste structurée en colonnes alignées.
    * **Gestion des Jours** : Les jours passés sont grisés automatiquement via `dayPropGetter`.

#### B. Module Contacts (`ContactPage.jsx`)
* **Fiabilisation des Données** :
    * **Typage Strict** : Correction des comparaisons d'ID (`Number()` et `==`) pour éviter le bug "Médecin inconnu" lors de l'affichage.
    * **Nettoyage** : Suppression des doublons de propriétés dans l'objet `newContact` lors de la soumission.
* **Composants de Formulaire** :
    * **Input Téléphone** : Ajout d'une icône visuelle et d'un pattern de validation HTML5 (8 chiffres minimum, chiffres uniquement).
    * **Sélecteur Médecin** : Passage d'une `datalist` instable à un `<select>` natif pour garantir l'envoi d'un ID valide.
* **Gestion des Erreurs** : Affichage d'une `alert()` explicite si le backend refuse une suppression (cas du patient lié à un RDV).

  ### 📦 Installation des Dépendances (Mise à jour)
Cette étape introduit des librairies graphiques pour le calendrier. Si vous récupérez le projet, lancez cette commande dans le dossier `client` pour les installer :

```bash
npm install react-big-calendar date-fns
```

## 🧪 3. PROTOCOLE DE VALIDATION (TESTS)

Voici les scénarios à exécuter pour valider cette version.

### Test A : Sécurité de l'Agenda
1.  Essayez de cliquer sur une case d'hier ou d'avant-hier.
    * **Attendu** : Curseur interdit + Alerte "Impossible de créer dans le passé".
2.  Créez 2 RDV sur le même créneau (ex: Lundi 10h00). Essayez d'en créer un 3ème.
    * **Attendu** : Blocage immédiat avec message "Créneau saturé (Max 2)".

### Test B : Persistance des Contacts (Le Test "F5")
1.  Allez dans "Contacts", modifiez un patient existant.
2.  Changez son médecin traitant via le menu déroulant. Validez.
3.  Rafraîchissez la page (Touche F5).
    * **Attendu** : Le patient doit toujours afficher le *nouveau* médecin (preuve que la base de données a bien supprimé l'ancien lien pour mettre le nouveau).

### Test C : Intégrité des Données (Suppression)
1.  Prenez un patient qui a un RDV visible dans l'agenda.
2.  Allez dans "Contacts" et tentez de le supprimer.
    * **Attendu** : Message d'erreur rouge "Impossible de supprimer ce patient car il est lié à des rendez-vous". Le patient ne doit pas disparaître.

## ⚠️ 4. RÈGLES DE DÉVELOPPEMENT

1.  **Typage ID** : Le Backend renvoie souvent des ID en `int`, mais les formulaires HTML les traitent en `string`. Toujours utiliser `Number()` ou une comparaison souple (`==`) pour les sélecteurs.
2.  **Harmonie Visuelle** : Ne jamais coder de couleurs "en dur" pour les médecins. Toujours utiliser la fonction `getColorForClient(id)` pour assurer la cohérence entre la Sidebar et le Calendrier.
3.  **Priorité Serveur** : C'est toujours le Backend (Symfony) qui a le dernier mot sur la sécurité (ex: empêcher la suppression). Le Frontend ne fait qu'afficher le message d'erreur du serveur.
