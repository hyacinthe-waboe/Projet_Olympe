# 🏥 Étape 2 : Gestion des Clients & Affectations Relationnelles

Cette étape a permis de transformer le système d'ID "fictifs" en une véritable base de données relationnelle pour la gestion des médecins.

## 🛠️ Modifications Backend

1. **Nouvelle Entité `Client` :**
   * Création de la table `client` pour stocker les fiches médecins (Nom, Prénom, Spécialité, Consignes, Clé API WZ).
   * Ajout du contrôleur `src/Controller/Admin/ClientController.php` pour le CRUD Admin.

2. **Refonte de l'Entité `Assignment` :**
   * Suppression de l'ancien champ `clientId` (integer).
   * Création d'une relation **ManyToOne** vers l'entité `Client`.
   * Mise à jour du `AssignmentRepository` avec un `leftJoin` pour optimiser les performances (évite le problème des requêtes N+1).

3. **Sécurisation du filtrage :**
   * Le `MeAssignmentController` utilise désormais l'objet `User` en session pour ne retourner que les objets `Client` associés via la table d'affectation.

## ✅ Validation des tests
* **Données de test :** Injection via `AppFixtures.php` d'un médecin (Gregory House) et d'une affectation.
* **Résultat API :** L'endpoint `/api/me/assignments` retourne bien un JSON structuré incluant les détails du médecin pour la secrétaire connectée.

## 🧪 Procédure de Test (Validation)

Suivez ces étapes pour confirmer que l'architecture relationnelle est bien en place :

### 1. Réinitialisation des données
Relancer les fixtures pour injecter le médecin de test (Dr House) et son affectation à la secrétaire Sophie :
```bash
php bin/console doctrine:fixtures:load
# Répondez 'yes' pour purger la base
```

### 2. Vérification de l'intégrité BDD
Vérifiez manuellement que le médecin a bien été créé :
```bash
php bin/console doctrine:query:sql "SELECT COUNT(*) FROM client"
# Résultat attendu : 1
```
### 3. Test de la Vue Secrétaire (Filtrage)
Connectez-vous sur l'interface React avec secret@olympe.com (Sophie).

Ouvrez l'URL API : http://127.0.0.1:8000/api/me/assignments

Validation : Vous devez voir un JSON structuré incluant l'objet client (id, firstName: "Gregory", lastName: "House").

### 4. Test de la Vue Admin (Liste globale)
Connectez-vous avec admin@olympe.com.

Ouvrez l'URL API : http://127.0.0.1:8000/api/admin/assignments

Validation : La liste doit afficher à la fois les informations de la secrétaire et celles du client associé grâce à la jointure.

## 📌 État du projet
Branche actuelle : feat/backend-etape2-clients.

Statut : Backend de l'étape 2 validé.