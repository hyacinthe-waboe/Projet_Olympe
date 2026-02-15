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

Suivez ces étapes dans l'ordre pour confirmer que tout est correctement configuré.

### Étape A : Réinitialisation des données
Dans le dossier `server`, injectez les données de test :
```bash
php bin/console doctrine:fixtures:load
# (Répondre 'yes' pour purger la base)
```

### Étape B : Vérification Base de Données
Vérifiez que la table `client` contient bien les données :

```bash
php bin/console doctrine:query:sql "SELECT COUNT(*) FROM client" "
" # Résultat attendu : 1 "
```

### Étape C : Test du Filtrage (Vue Secrétaire)
1. Connectez-vous sur l'interface React avec : `secret@olympe.com` / `secret123`.
2. Ouvrez l'URL : `http://127.0.0.1:8000/api/me/assignments`
3. **Validation** : Le JSON doit contenir l'objet `client` complet rattaché à Sophie (Gregory House) Il doit afficher une liste contenant le secretaire Sophie et le client Gregory House.

---

## ⚠️ 4. RÈGLES DE DÉVELOPPEMENT

1. **Intégrité Relationnelle** : Ne jamais manipuler d'ID de client en "dur" (integer) dans le code. Toujours passer par l'entité `Client` via le `ClientRepository`.
2. **Optimisation** : Toute nouvelle route listant des affectations doit obligatoirement utiliser une jointure (`Join`) pour récupérer les infos clients afin de préserver les performances du serveur.
3. **Sécurité** : Le filtrage par secrétaire doit toujours se faire via `$this->getUser()` et jamais via un paramètre d'URL modifiable par l'utilisateur.