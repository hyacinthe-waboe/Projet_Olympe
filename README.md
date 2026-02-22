## 📞 Étape 8 : Finalisation du Standard Téléphonique & Interconnexions

Ce module vient clôturer le développement du pôle de Télésecrétariat en le connectant définitivement aux autres modules de l'application (Dashboard, Messagerie, Fiche 360°) et en affinant les règles métiers pour correspondre parfaitement au MVP.

## ℹ️ 1. INFORMATIONS SUR CETTE ÉTAPE

* **Branche Git** : `feat/etape8-standard-finalisation`
* **Objectif** : Boucler le flux des appels (Click-to-Call, Appels manqués), nettoyer l'UX de la messagerie, et implémenter les purges de données (RGPD).
* **Statut** : ✅ 100% Fonctionnel, Intégré et Sécurisé.

## 🛠️ 2. MODIFICATIONS DÉTAILLÉES

### 📂 Architecture Backend (Symfony)

* **`CallLog.php` (Évolution de l'Entité)** :
    * Ajout de la propriété booléenne `isArchived` (Soft Delete) pour permettre de masquer un appel de la vue standard sans le supprimer du dossier médical.
* **`CallLogController.php` & `AppelantController.php` (Logique de Purge)** :
    * **Soft Delete** : Modification de la route `DELETE /api/calls/{id}`. Au lieu de détruire la donnée, le contrôleur passe `isArchived` à `true`.
    * **Bouton Nucléaire (Hard Delete)** : Création de la route `DELETE /api/appelants/{id}/clear-history`. Cette route détruit de manière irréversible toutes les données liées à un patient (Appels, Messages, RDVs) pour répondre aux exigences RGPD.
* **`MessageController.php` (Ajustement Métier MVP)** :
    * **Auto-Clôture** : Modification de la route de création (`create`). L'application étant un outil de saisie pour secrétaires, tout message sortant (envoyé au médecin) est désormais enregistré avec `isRead = true` par défaut pour ne pas polluer l'onglet "Nouveaux".

### 📂 Architecture Frontend (React)

* **`CallContext.jsx` & `MessagesPage.jsx` (Click-to-Call)** :
    * Séparation stricte des responsabilités : le `CallContext` gère la logique de l'appel, et la page `MessagesPage` gère la navigation (`useNavigate`).
    * **Téléportation** : Depuis l'annuaire des messages, un clic sur l'icône téléphone déclenche l'appel en arrière-plan et bascule automatiquement l'interface sur l'écran du standard (`/phone`).
    * **Épuration UI** : Suppression du bloc redondant "Actions rapides" dans le panneau latéral droit de la messagerie pour alléger l'interface.
* **`HomePage.jsx` (Dashboard Connecté)** :
    * Remplacement des données statiques du widget "Appels manqués" par l'API réelle (`/api/calls`).
    * Filtrage dynamique pour isoler le statut `missed`.
    * Redirection au clic sur un appel manqué vers l'historique détaillé du standard téléphonique.
* **`PatientDetailsPage.jsx` (Timeline 360° & RGPD)** :
    * Ajout du bouton rouge "Vider l'historique complet" connecté à la route de Hard Delete.
    * Ajout d'une alerte de confirmation critique avant la destruction des données.

## 🧪 3. PROTOCOLE DE VALIDATION (TESTS MÉTIER)

### Test A : Click-to-Call & Téléportation
1. Ouvrir la page Messagerie, cliquer sur "Contact" pour ouvrir l'annuaire.
2. Cliquer sur l'icône "Téléphone" d'un patient.
    * **Résultat attendu** : Redirection instantanée vers `/phone`, le standard s'ouvre avec l'appel en cours (bulle verte "En ligne") et le numéro pré-composé.

### Test B : Purges et RGPD (Soft vs Hard Delete)
1. Passer un appel avec un patient et raccrocher.
2. Sur la page Téléphone, cliquer sur l'icône Corbeille de cet appel.
    * **Résultat attendu 1** : L'appel disparaît du standard téléphonique.
3. Ouvrir l'Historique 360° du patient concerné.
    * **Résultat attendu 2** : L'appel est toujours visible dans la Timeline (Soft Delete validé).
4. Cliquer sur le bouton rouge "Vider l'historique complet" et confirmer.
    * **Résultat attendu 3** : La page se vide intégralement, affichant "Aucune donnée historique trouvée" (Hard Delete validé).

### Test C : Flux Dashboard -> Appels Manqués
1. Simuler un appel entrant et cliquer sur "Refuser".
2. Retourner sur le Tableau de bord (`/`).
    * **Résultat attendu** : L'appel apparaît dans la tuile rouge "Appels manqués". Un clic sur la tuile redirige vers le standard téléphonique.

### Test D : Logique de Messagerie Sortante
1. Créer un "Nouveau message" pour un médecin depuis la modale de la Messagerie.
    * **Résultat attendu** : Le message est bien envoyé, mais l'onglet "Nouveaux" reste à 0. Le message est visible uniquement dans l'onglet "Tous".
  
---

## 🔄 4. Procédure Git : Basculer sur l'Étape 8 et forcer la synchronisation

Voici la marche à suivre infaillible pour passer de `main` à ta branche finale, récupérer le code proprement, et régler le problème des fichiers "fantômes".

### 📍 1. Vérifier son emplacement
Toujours commencer par vérifier où l'on se trouve pour éviter les erreurs.

```bash 
git status
```

### 📡 2. Rafraîchir l'historique distant
On demande à Git de télécharger la liste des dernières branches disponibles sur GitHub (sans toucher à tes fichiers locaux).

```bash
git fetch origin
```

### 🔀 3. Basculer sur la bonne branche
On quitte `main` pour aller physiquement sur la branche de l'étape 8.

```bash
 git switch feat/etape8-standard-appels 
*(Note : si tu as une vieille version de Git, utilise `git checkout feat/etape8-standard-appels`)*
```
### 📥 4. Récupérer le code (Pull classique)
On télécharge les fichiers de la branche.

```bash
 git pull origin feat/etape8-standard-appels 
```
### 🚨 CAS D'URGENCE : Fichiers manquants (Hard Reset)
Si, après l'étape 4, ton dossier `server` est à moitié vide (pas de `composer.json`, pas de `.env`, etc.), c'est que ton Git local est désynchronisé (souvent à cause d'un sous-module fantôme). 

Voici la technique du bulldozer pour écraser ta version locale et la forcer à devenir le clone absolu et parfait de GitHub :

```bash
git fetch origin 
git reset --hard origin/feat/etape8-standard-appels 
```
*(Après ça, tes fichiers apparaîtront instantanément !)*


### 📦 5. Reconstruire le projet (Routine Post-Pull)
Git ne téléchargeant pas les lourdes librairies, il faut toujours dire à ton ordinateur de les réinstaller après un pull ou un reset réussi.

**A. Pour le Backend (Symfony) :**
```bash
cd server
composer install 
docker compose up -d
php -S 127.0.0.1:8000 -t public
```

**B. Pour le Frontend (React) :**
```bash
cd ../client
npm install 
npm run dev
```
