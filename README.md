<h1 align="center">🏥 Olympe</h1>

<p align="center">
  <strong>Un espace de travail pour centraliser le télésecrétariat médical : patients, rendez-vous, messages et suivi des appels.</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React_19-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React 19">
  <img src="https://img.shields.io/badge/Symfony_7.4-000000?style=for-the-badge&logo=symfony&logoColor=white" alt="Symfony 7.4">
  <img src="https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white" alt="Tailwind CSS">
  <img src="https://img.shields.io/badge/PostgreSQL-4169E1?style=for-the-badge&logo=postgresql&logoColor=white" alt="PostgreSQL">
</p>

## 🩺 Le projet

Olympe est une application web de télésecrétariat médical réalisée en groupe dans le cadre de la **Licence MIASHS** à l'Université Toulouse - Jean Jaurès.

L'objectif est de réunir les outils du secrétariat dans une même interface : retrouver un patient, consulter son historique, organiser un rendez-vous, enregistrer un message et suivre les tâches à effectuer.

Le projet associe une interface **React** à une API **Symfony**, avec une base **PostgreSQL** pouvant être hébergée sur **Supabase**. Il comprend un espace administrateur et un espace secrétaire.

> Olympe reste un prototype universitaire. Plusieurs modules sont reliés à la base de données, tandis que d'autres sont des écrans de démonstration. La téléphonie est simulée.

## ✨ Fonctionnalités

- 👥 **Gestion de l'équipe** : création de comptes secrétaires, modification de leur état d'activation et affectation aux médecins depuis l'espace administrateur.
- 🩺 **Annuaire** : gestion des médecins et des patients, recherche de contacts et rapprochement des patients par numéro de téléphone.
- 📅 **Agenda** : création, modification et suppression de rendez-vous associés à un médecin et à un patient, avec plusieurs vues et un filtre par médecin.
- 💬 **Messages et consignes** : enregistrement de messages liés aux médecins ou aux patients, consultation et ajout de notes administratives.
- 📞 **Simulation d'appels** : appels entrants et sortants simulés, identification des contacts, historique enregistré et archivage des appels.
- ✅ **Suivi des tâches** : création de tâches, passage de « à faire » à « terminé » et transformation d'une note d'appel en tâche.
- 📋 **Fiche patient** : consultation des coordonnées et des historiques de rendez-vous, messages et appels.
- 🏠 **Tableau de bord** : aperçu des prochains rendez-vous de la journée, des messages non lus, des tâches et des appels manqués.

Les listes de rendez-vous et de messages tiennent compte des affectations des secrétaires dans les vues générales. L'administrateur dispose de fonctions de gestion et de supervision supplémentaires. Les contrôles d'accès restent à compléter sur certaines routes.

## 🛠️ Technologies

| Besoin | Solution |
|---|---|
| Interface utilisateur | React 19 et React Router 7 |
| Développement et compilation du frontend | Vite |
| Mise en page et icônes | Tailwind CSS 3 et React Icons |
| Calendrier | React Big Calendar et date-fns |
| API et logique serveur | PHP 8.2+ et Symfony 7.4 |
| Modèle de données | Doctrine ORM 3 et migrations Doctrine |
| Base de données | PostgreSQL, avec possibilité d'hébergement Supabase |
| Authentification | Connexion JSON Symfony, sessions et cookies HttpOnly |
| Échanges entre frontend et backend | API JSON et Nelmio CORS |

## 🧠 Notions travaillées

| Notion | Mise en pratique |
|---|---|
| Architecture client-serveur | Séparation entre l'interface React et l'API Symfony |
| Modélisation relationnelle | Liens entre utilisateurs, médecins, patients et historiques |
| API HTTP | Routes de consultation, création, modification et suppression |
| Gestion des rôles | Espaces administrateur et secrétaire, affectations aux médecins |
| État partagé dans React | Contexte d'appel conservé pendant la navigation |
| Parcours métier | Passage d'un appel à une fiche patient, un message ou une tâche |

## 📂 Organisation

| Dossier ou fichier | Contenu |
|---|---|
| `client/src/pages/` | Pages de l'application : accueil, agenda, contacts, messages, équipe… |
| `client/src/components/layout/` | Structure générale de l'interface et navigation |
| `client/src/context/CallContext.jsx` | État partagé et simulation des appels |
| `client/src/App.jsx` | Routes et protections de navigation côté frontend |
| `server/src/Controller/` | Routes de l'API et opérations métier |
| `server/src/Entity/` | Entités Doctrine : User, Client, Appelant, Assignment, Message, RendezVous, CallLog et Task |
| `server/src/Repository/` | Accès aux données |
| `server/src/DataFixtures/` | Comptes et données de démonstration |
| `server/config/` | Configuration Symfony, sécurité, sessions, CORS et Doctrine |
| `server/migrations/` | Historique des évolutions de la base |

Dans le code, **Client** désigne un médecin ou un client du télésecrétariat, et **Appelant** désigne un patient.

## 🚀 Installation et utilisation

### Prérequis

Prévoir **Git**, **PHP 8.2 ou supérieur**, **Composer**, **Node.js avec npm** et une **base PostgreSQL dédiée aux essais**. L'extension PHP `pdo_pgsql` doit être activée.

### 1. Récupérer le projet

```bash
git clone https://github.com/hyacinthe-waboe/Projet_Olympe.git
cd Projet_Olympe
```

### 2. Configurer la base de données

Créer `server/.env.local`, qui est ignoré par Git, pour y placer sa propre configuration :

```dotenv
APP_ENV=dev
APP_SECRET=REMPLACER_PAR_UN_SECRET_ALEATOIRE
DATABASE_URL="postgresql://UTILISATEUR:MOT_DE_PASSE@HOTE:5432/NOM_BASE?serverVersion=VERSION_POSTGRESQL&charset=utf8"
```

Remplacer les valeurs par celles de sa base PostgreSQL. Pour Supabase, reprendre les paramètres de connexion de son propre projet et les options SSL nécessaires. Ne pas publier ses identifiants dans le dépôt.

### 3. Installer le backend

```bash
cd server
composer install
```

Pour une **première installation sur une base vide réservée au développement**, créer le schéma à partir des entités actuelles :

```bash
php bin/console doctrine:schema:create
```

Les migrations présentes ne décrivent pas encore tout le modèle actuel, notamment la table des rendez-vous et certains champs ajoutés aux contacts. Cette procédure initialise donc directement le schéma ; elle ne doit pas être utilisée sur une base existante ni mélangée sans vérification avec l'historique des migrations.

Charger ensuite les données de démonstration, uniquement dans cette base de test :

```bash
php bin/console doctrine:fixtures:load
```

> ⚠️ Le chargement des fixtures efface les données existantes par défaut. Vérifier la base ciblée avant de confirmer.

### 4. Installer le frontend

Depuis la racine du dépôt :

```bash
cd client
npm install
```

### 5. Lancer l'application

Dans un premier terminal, depuis la racine :

```bash
cd server
php -S 127.0.0.1:8000 -t public
```

Dans un second terminal :

```bash
cd client
npm run dev
```

Ouvrir **http://127.0.0.1:5173**.

Utiliser cette adresse plutôt que `localhost` : les appels API et la configuration CORS du dépôt utilisent explicitement `127.0.0.1`.

### Comptes de démonstration

Ces comptes sont créés par les fixtures :

| Rôle | Email | Mot de passe |
|---|---|---|
| Administrateur | `admin@olympe.com` | `admin123` |
| Secrétaire | `secret@olympe.com` | `secret123` |

Les fixtures créent également un médecin de démonstration et une affectation à la secrétaire. Ces identifiants sont réservés aux essais locaux.

### Commandes utiles

Dans `client/`, compiler le frontend :

```bash
npm run build
```

Dans `server/`, consulter les routes ou vérifier le schéma :

```bash
php bin/console debug:router
php bin/console doctrine:schema:validate
```

## 🚧 Limites actuelles

- **Téléphonie simulée** : aucun raccordement à un opérateur ni échange audio réel n'est implémenté.
- **Modules de démonstration** : emails, fichiers, messagerie interne et messagerie vocale utilisent des données fictives ; les notifications et plusieurs paramètres restent des maquettes.
- **Sécurité à compléter** : les rôles et sessions sont présents, mais les vérifications d'autorisation ne sont pas homogènes sur toutes les routes. Le prototype ne doit pas être exposé tel quel ni recevoir de vraies données de patients.
- **Configuration locale** : l'adresse du backend est écrite directement dans plusieurs composants React.
- **Migrations à synchroniser** : leur historique ne suffit pas à reconstruire l'ensemble du schéma actuel.
- **Tests à développer** : des dépendances de test sont présentes, mais le dépôt ne contient pas encore de suite de tests applicatifs ; le dossier backend `tests/` contient uniquement le fichier d'initialisation.

## 👥 Équipe et cadre

Projet réalisé en groupe dans le cadre de la **Licence MIASHS — Université Toulouse - Jean Jaurès**.

## 📝 Licence

Projet académique — tous droits réservés. Le backend est déclaré sous licence propriétaire dans `composer.json`.

<p align="center"><em>Un projet pour relier une interface web aux besoins concrets du secrétariat médical. 🏥</em></p>
