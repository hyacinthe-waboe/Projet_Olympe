# 🔐 Documentation Authentification

## 🚀 Démarrage

1. Lancer PostgreSQL : `docker compose up -d`
2. Lancer Symfony : `php -S 127.0.0.1:8000 -t public`
3. Lancer React : `npm run dev` (dans le dossier client)

## 🔑 Endpoints disponibles

### POST /login
Authentification admin
```json
{
  "username": "admin@olympe.com",
  "password": "password"
}
```

Authentification secrétaire
```json
{
  "username": "secret@olympe.com",
  "password": "secret123"
}
```

### GET /api/me
Récupère les infos de l'utilisateur connecté (nécessite authentification)

### POST /logout
Déconnexion

## 💻 Utilisation depuis React
```javascript
// Exemple de fetch avec authentification
fetch('http://127.0.0.1:8000/api/votre-endpoint', {
  method: 'GET',
  credentials: 'include', // IMPORTANT : envoie le cookie de session
  headers: {
    'Content-Type': 'application/json'
  }
})
```

## ⚠️ Points importants

- Toujours utiliser `127.0.0.1` (PAS `localhost`)
- Toujours inclure `credentials: 'include'` dans les fetch
- La session persiste automatiquement via cookies
- Pas besoin de token JWT ou Authorization header