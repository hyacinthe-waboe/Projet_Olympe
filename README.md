## 🔐 Mise à jour Backend : Accès Affectations Secrétaires

### 🛠️ Ce qui a été ajouté
* **Nouveau Contrôleur :** `src/Controller/MeAssignmentController.php`
* **Nouvelle Route :** `GET /api/me/assignments`

### ❓ Pourquoi cette modification ?
1.  **Déblocage des accès (Firewall) :**
    * Les routes commençant par `/api/admin` sont strictement réservées au `ROLE_ADMIN` dans le fichier `security.yaml`.
    * Les secrétaires (rôle `ROLE_SECRETAIRE`) étaient bloquées (Erreur 403) pour consulter leurs propres affectations.

2.  **Sécurité & Isolation des données :**
    * **Objectif :** Garantir qu'une secrétaire ne accède **qu'aux** clients qui lui sont affectés.
    * **Méthode :** L'API utilise désormais la session active (`$this->getUser()`) pour filtrer les résultats, plutôt que de demander un ID dans l'URL. Cela empêche tout accès non autorisé aux données d'une autre secrétaire.