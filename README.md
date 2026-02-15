# 🔐 Mise à jour Backend de l'etape 1 : Accès Affectations Secrétaires

## 🛠️ Ce qui a été ajouté
* **Nouveau Contrôleur :** `src/Controller/MeAssignmentController.php`
* **Nouvelle Route :** `GET /api/me/assignments`

## ❓ Pourquoi cette modification ?
1.  **Déblocage des accès (Firewall) :**
    * Les routes commençant par `/api/admin` sont strictement réservées au `ROLE_ADMIN` dans le fichier `security.yaml`.
    * Les secrétaires (rôle `ROLE_SECRETAIRE`) étaient bloquées (Erreur 403) pour consulter leurs propres affectations.

2.  **Sécurité & Isolation des données :**
    * **Objectif :** Garantir qu'une secrétaire ne accède **qu'aux** clients qui lui sont affectés.
    * **Méthode :** L'API utilise désormais la session active (`$this->getUser()`) pour filtrer les résultats, plutôt que de demander un ID dans l'URL. Cela empêche tout accès non autorisé aux données d'une autre secrétaire.

  

# 🏥 Étape 2 : Gestion des Clients & Affectations Relationnelles

Ce module marque la transition d'un système à identifiants statiques vers une architecture **relationnelle** complète pour la gestion des médecins (clients) et de leurs secrétaires.

## ℹ️ 1. INFORMATIONS SUR CETTE ÉTAPE

L'objectif était de structurer la base de données pour lier les affectations à de véritables entités `Client` (médecins), permettant une gestion fine des consignes et des accès.

* **Branche Git** : `feat/backend-etape2-clients`
* **Statut** : Backend validé et opérationnel

---

## 🛠️ 2. MODIFICATIONS BACKEND (DÉTAILLÉES)

Voici la liste des fichiers créés ou modifiés pour cette étape :

### 📂 Fichiers Créés
* **`src/Entity/Client.php`** : Définition de l'entité Client (Nom, Prénom, Email, Spécialité, Phone, Instructions, WzApiKey, IsActive).
* **`src/Repository/ClientRepository.php`** : Gestion des requêtes liées à l'entité Client.
* **`src/Controller/Admin/ClientController.php`** : Mise en place du CRUD (Create, Read) pour que l'administrateur puisse gérer les médecins.

### 📂 Fichiers Modifiés
* **`src/Entity/Assignment.php`** :
    * Suppression de l'ancien champ `clientId` (integer).
    * Ajout d'une relation **ManyToOne** vers l'entité `Client`.
* **`src/Repository/AssignmentRepository.php`** :
    * Mise à jour de `findBySecretaire` avec un **Left Join** sur la table client pour optimiser les performances (évite le problème SQL N+1).
    * Mise à jour de `existsAssignment` pour utiliser la relation d'objet.
* **`src/Controller/Admin/AssignmentController.php`** : Adaptation des méthodes de création et de listing pour injecter et retourner des objets `Client` complets.
* **`src/Controller/MeAssignmentController.php`** : Enrichissement de la réponse JSON pour envoyer les détails du médecin (spécialité, nom, etc.) au front-end React.
* **`src/DataFixtures/AppFixtures.php`** : Ajout de la création de médecins de test et d'une affectation initiale (Sophie -> Dr House).

---

## 🧪 3. PROTOCOLE DE VALIDATION (TESTS)

Pour vérifier que l'étape 2 est correctement installée, suivez ces étapes :

### 1. Préparation des données
Relancez les fixtures pour injecter le médecin de test (Dr House) et son affectation à la secrétaire Sophie :

```bash 
php bin/console doctrine:fixtures:load
# Répondre 'yes'
```
### Étape B : Vérification Base de Données
Vérifiez que la table `client` contient bien les données :

```bash
php bin/console doctrine:query:sql "SELECT COUNT(*) FROM client"
# Résultat attendu : 1
```

### Étape C : Test du Filtrage (Vue Secrétaire)
1. Connectez-vous sur l'interface React avec : `secret@olympe.com` / `secret123`.
2. Ouvrez l'URL : `http://127.0.0.1:8000/api/me/assignments`
3. **Validation** : Le JSON doit contenir l'objet `client` complet rattaché à Sophie (Gregory House).

### Étape D : Test de la Vue Globale (Vue Admin)
1. Connectez-vous avec : `admin@olympe.com` / `admin123`.
2. Ouvrez l'URL : `http://127.0.0.1:8000/api/admin/assignments`
3. **Validation** : La liste doit afficher l'affectation avec les noms de la secrétaire ET du client grâce à la jointure.
---

## ⚠️ 4. RÈGLES DE DÉVELOPPEMENT

1. **Intégrité Relationnelle** : Ne jamais manipuler d'ID de client en "dur" (integer) dans le code. Toujours passer par l'entité `Client` via le `ClientRepository`.
2. **Optimisation** : Toute nouvelle route listant des affectations doit obligatoirement utiliser une jointure (`Join`) pour récupérer les infos clients afin de préserver les performances du serveur.
3. **Sécurité** : Le filtrage par secrétaire doit toujours se faire via `$this->getUser()` et jamais via un paramètre d'URL modifiable par l'utilisateur.



# 🏥 Étape 3 : Gestion des Appelants (Patients)

Ce module gère l'annuaire des patients qui appellent le cabinet. L'objectif critique était d'éviter les doublons (avoir 10 fiches pour le même M. Martin).

## ℹ️ 1. INFORMATIONS

* **Branche Git** : `feat/backend-etape3-patients`
* **Objectif** : Centraliser les appelants et gérer la déduplication par numéro de téléphone.

---

## 🛠️ 2. MODIFICATIONS BACKEND

### 📂 Fichiers Créés
* **`src/Entity/Appelant.php`** :
    * Contient les infos patient (Nom, Prénom, Téléphone).
    * **Sécurité** : Utilise l'attribut `#[UniqueEntity]` pour empêcher les doublons de numéros.
    * **Relation** : ManyToMany vers `Client` (Un patient peut appeler pour plusieurs médecins).
    * **Serialisation** : Groupe `appelant:read` pour contrôler les données exposées.
* **`src/Repository/AppelantRepository.php`** : Gestion des requêtes SQL pour les appelants.
* **`src/Controller/AppelantController.php`** :
    * `GET /api/appelants/search` : Recherche rapide par téléphone.
    * `POST /api/appelants/nouveau` : "Smart Create". Si le patient existe, on le met à jour. Sinon, on le crée.

---

## 🧪 3. PROTOCOLE DE VALIDATION (TESTS)

Comme il n'y a pas encore d'interface graphique pour cette partie, les tests se font via le terminal (PowerShell/Curl).

### Test A : Création & Déduplication
Lancez cette commande deux fois de suite.
* **Attendu** : La première fois, l'ID est créé (ex: 1). La deuxième fois, l'ID reste le même (1) et le message indique "Mise à jour".

" Invoke-RestMethod -Uri "http://127.0.0.1:8000/api/appelants/nouveau" -Method Post -ContentType "application/json" -Body '{"phone": "0601020304", "lastname": "DUPONT", "firstname": "Jean", "client_id": 2}' "

### Test B : Recherche par téléphone
Vérifiez que le système retrouve la fiche.

" Invoke-RestMethod -Uri "http://127.0.0.1:8000/api/appelants/search?phone=0601020304" -Method Get "

---

## ⚠️ 4. RÈGLES DE DÉVELOPPEMENT

1.  **Unicité** : Le numéro de téléphone est la clé unique (`unique=true`).
2.  **Logique Smart** : Ne jamais utiliser un simple `persist()` pour créer un appelant. Toujours vérifier son existence (`findOneBy`) avant pour éviter les erreurs SQL.

