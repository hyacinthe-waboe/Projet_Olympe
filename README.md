# 🏥 Olympe - Plateforme de Télésecrétariat Médical

Application web de gestion de cabinets médicaux développée avec Symfony 7 et React 18.

---

## ℹ️ Prérequis

Avant de commencer, assurez-vous d'avoir installé :

* **PHP** : Version `8.2` ou supérieur
* **Composer** : Gestionnaire de dépendances PHP
* **Node.js** : Version `18` ou supérieur

---

## 🚀 Installation

### 1. Configuration de la base de données (Supabase)

Le projet utilise **Supabase** comme base de données PostgreSQL cloud.

**Créez votre fichier `.env` dans le dossier `server/` :**
```env
DATABASE_URL="postgresql://postgres:MOT_DE_PASSE@db.xkdvthavaxooemrjgrkh.supabase.co:5432/postgres?serverVersion=15&charset=utf8"
```

**⚠️ Demandez le mot de passe Supabase à un membre de l'équipe ou créez votre propre projet sur [supabase.com](https://supabase.com)**

---

### 2. Installation du Backend (Symfony)
```bash
# Dans le dossier server
cd server

# Installer les dépendances PHP
composer install

# Créer les tables dans Supabase
php bin/console doctrine:schema:create

# Charger les données de test (Admin, Secrétaires, Clients)
php bin/console doctrine:fixtures:load
# Répondre 'yes' quand demandé
```

---

### 3. Installation du Frontend (React)
```bash
# Dans le dossier client
cd client

# Installer les dépendances Node
npm install
```

---

## 🎮 Lancement du Projet

### Démarrage quotidien

**Terminal 1 - Backend :**
```bash
cd server
php -S 127.0.0.1:8000 -t public
```

**Terminal 2 - Frontend :**
```bash
cd client
npm run dev
```

**Accédez à l'application :** `http://127.0.0.1:5173`

---

## 🔑 Comptes de Test

### Administrateur (Accès complet)
* **Email** : `admin@olympe.com`
* **Mot de passe** : `admin123`

### Secrétaire (Accès restreint aux clients affectés)
* **Email** : `secret@olympe.com`
* **Mot de passe** : `secret123`

---

## 🗄️ Base de Données

Le projet utilise **Supabase** (PostgreSQL cloud) :

* ✅ Base de données partagée entre tous les membres de l'équipe
* ✅ Pas d'installation locale requise
* ✅ Accessible depuis n'importe quel PC

### Structure des tables

* `user` : Administrateurs et secrétaires
* `client` : Médecins/Cabinets médicaux
* `assignment` : Affectations secrétaire ↔ client
* `appelant` : Patients (avec déduplication par téléphone)
* `message`, `call_log`, `rendez_vous` : Historique

---

## 🛠️ Commandes Utiles

### Backend (Symfony)
```bash
# Voir toutes les routes
php bin/console debug:router

# Vider le cache
php bin/console cache:clear

# Recréer les tables (⚠️ Supprime les données)
php bin/console doctrine:schema:drop --force
php bin/console doctrine:schema:create
php bin/console doctrine:fixtures:load
```

---

## 📚 Stack Technique

* **Backend** : Symfony 7.4, Doctrine ORM, Nelmio CORS
* **Frontend** : React 18, Vite, TailwindCSS
* **Base de données** : PostgreSQL 15 (Supabase)
* **Authentification** : Sessions Symfony avec cookies HttpOnly
* **Sécurité** : RBAC (Role-Based Access Control)

---

## 👥 Équipe

Projet réalisé dans le cadre de la Licence MIASHS - Université Toulouse Jean Jaurès

---

## 📝 Licence

Projet académique - Tous droits réservés