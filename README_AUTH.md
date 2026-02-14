# 🔐 Documentation & Installation (README)

Voici la procédure pour installer le projet proprement vu que vous ne l'avez jamais lancé.

## ℹ️ Informations Techniques

Avant de commencer, vérifiez que vous avez les bons outils :

* **Symfony** : Version `7.4.5` (Géré automatiquement par Composer)
* **PHP** : Version `8.2` ou supérieur (Impératif !)
* **Node.js** : Version `18` ou supérieur (Recommandé pour le React)
* **Base de données** : PostgreSQL (Géré par Docker)

## 🛠️ 1. PREMIÈRE INSTALLATION (À faire une seule fois)

Avant de lancer le projet, il faut installer les librairies et préparer la base de données.

**Dans le dossier `server` :**

```bash
# 1. Installer les dépendances PHP
composer install

# 2. Lancer Docker (pour la base de données)
docker compose up -d

# 3. Créer la base de données et les tables
php bin/console doctrine:database:create
php bin/console doctrine:migrations:migrate

# 4. (IMPORTANT) Créer les comptes Admin/Secrétaire par défaut
php bin/console doctrine:fixtures:load
# (Répondre 'yes' si demandé)
```

**Dans le dossier `client` :**

```bash
# Installer les dépendances React
npm install
```

---

## 🚀 2. DÉMARRAGE QUOTIDIEN

Une fois installé, voici comment lancer le projet tous les jours :

1.  **Base de données** : `docker compose up -d`
2.  **Backend (Symfony)** : `php -S 127.0.0.1:8000 -t public`
3.  **Frontend (React)** : `npm run dev` (dans le dossier client)

---

## 🔑 3. Comptes de test

### Admin (Accès total)
* **Email** : `admin@olympe.com`
* **Password** : `admin123`

### Secrétaire (Accès restreint)
* **Email** : `secret@olympe.com`
* **Password** : `secret123`

---

## ⚠️ 4. RÈGLES D'OR (À LIRE ABSOLUMENT)

1.  **L'IP magique** : Toujours utiliser **`http://127.0.0.1`** dans votre navigateur et votre code. **Bannissez `localhost`**, sinon vous aurez des problèmes de connexion (Cookie/CORS).
2.  **Le Fetch** : Dans vos requêtes React, ajoutez toujours `credentials: 'include'` pour que l'utilisateur reste connecté.

```javascript
// Exemple correct
fetch('[http://127.0.0.1:8000/api/clients](http://127.0.0.1:8000/api/clients)', {
  method: 'GET',
  credentials: 'include', // <--- INDISPENSABLE
  headers: { 'Content-Type': 'application/json' }
})
```

3.  **L'Authentification** :
    * **GET /api/me** : Pour savoir qui est connecté.
    * Si ça renvoie une erreur 401, c'est que vous n'êtes pas connecté ou que vous avez oublié `credentials: 'include'`.