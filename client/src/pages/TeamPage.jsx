import React, { useState, useEffect } from "react";
import {
  FaSearch,
  FaPlus,
  FaEnvelope,
  FaUserMd,
  FaCheckCircle,
  FaTimesCircle,
} from "react-icons/fa";

// --- MODALE : AJOUTER UNE SECRÉTAIRE ---
const SecretaryFormModal = ({ isOpen, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
    // On réinitialise le formulaire après soumission
    setFormData({ firstName: "", lastName: "", email: "", password: "" });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
          <h3 className="text-lg font-bold text-gray-900">
            Nouvelle Secrétaire
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <FaTimesCircle size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Prénom
              </label>
              <input
                type="text"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                value={formData.firstName}
                onChange={(e) =>
                  setFormData({ ...formData, firstName: e.target.value })
                }
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nom
              </label>
              <input
                type="text"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                value={formData.lastName}
                onChange={(e) =>
                  setFormData({ ...formData, lastName: e.target.value })
                }
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Mot de passe provisoire
            </label>
            <input
              type="password"
              required
              minLength="6"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
            />
          </div>

          <div className="pt-4 flex justify-end space-x-3 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-medium"
            >
              Créer le compte
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// --- MODALE : GÉRER LES AFFECTATIONS ---
const AssignmentModal = ({
  isOpen,
  onClose,
  user,
  allClients,
  assignments,
  onToggleAssignment,
}) => {
  if (!isOpen || !user) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-lg overflow-hidden border border-gray-100">
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
          <div>
            <h3 className="text-lg font-bold text-gray-900">
              Affectations : {user.firstName} {user.lastName}
            </h3>
            <p className="text-xs text-gray-500">
              Cochez les médecins dont cette secrétaire a la charge
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <FaTimesCircle size={24} />
          </button>
        </div>

        <div className="p-6 max-h-[60vh] overflow-y-auto space-y-2">
          {allClients.length === 0 ? (
            <p className="text-center text-gray-500 py-4">
              Aucun médecin (client) créé pour le moment.
            </p>
          ) : (
            allClients.map((client) => {
              // On vérifie si ce médecin est déjà affecté
              const currentAssignment = assignments.find(
                (a) => a.client.id === client.id,
              );
              const isAssigned = !!currentAssignment;

              return (
                <div
                  key={client.id}
                  onClick={() =>
                    onToggleAssignment(client.id, currentAssignment?.id)
                  }
                  className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-all ${isAssigned ? "border-blue-200 bg-blue-50 shadow-sm" : "border-gray-100 hover:bg-gray-50"}`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white ${isAssigned ? "bg-blue-600" : "bg-gray-300"}`}
                    >
                      Dr
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-800">
                        Dr. {client.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {client.specialty}
                      </p>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    readOnly
                    checked={isAssigned}
                    className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                  />
                </div>
              );
            })
          )}
        </div>
        <div className="p-4 bg-gray-50 border-t flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-gray-800 text-white text-sm font-bold rounded-lg hover:bg-gray-900 transition"
          >
            Terminer
          </button>
        </div>
      </div>
    </div>
  );
};

export default function TeamPage() {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  // Variable pour ouvrir/fermer la modale d'ajout
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  // Fonction temporaire pour voir si la modale récupère bien les données
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [allClients, setAllClients] = useState([]); // Tous les médecins existants
  const [userAssignments, setUserAssignments] = useState([]); // Affectations de la secrétaire sélectionnée

  const handleCreateSecretary = async (formData) => {
    try {
      const response = await fetch("http://127.0.0.1:8000/api/admin/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (response.ok) {
        // 1. On ajoute la nouvelle secrétaire à la liste locale
        setUsers([result.user, ...users]);
        // 2. On la sélectionne pour voir son profil
        setSelectedUser(result.user);
        // 3. On ferme la fenêtre
        setIsAddModalOpen(false);
        alert("Compte secrétaire créé avec succès !");
      } else {
        alert("Erreur : " + (result.error || "Vérifiez les données"));
      }
    } catch (error) {
      console.error("Erreur lors de la création :", error);
      alert("Erreur de connexion au serveur");
    }
  };
  // --- CHARGEMENT ---
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    
    try {
      const response = await fetch("http://127.0.0.1:8000/api/admin/users", {
        credentials: "include",
      });
      if (response.ok) {
        const data = await response.json();
        // ✅ FORCE la conversion en tableau pour éviter l'erreur .filter
        const usersArray = Array.isArray(data) ? data : Object.values(data);
        setUsers(usersArray);

        // On sélectionne le premier utilisateur si la liste n'est pas vide
        if (usersArray.length > 0 && !selectedUser) {
          setSelectedUser(usersArray[0]);
        }
      }
    } catch (error) {
      console.error("Erreur fetch", error);
    } finally {
      setLoading(false);
    }
    };

    const fetchAllClients = async () => {
    try {
        const res = await fetch("http://127.0.0.1:8000/api/admin/clients", { credentials: "include" });
        if (res.ok) {
            const data = await res.json();
            setAllClients(data.map(c => ({ id: c.id, name: `${c.firstName} ${c.lastName}`, specialty: c.specialty })));
        }
    } catch (e) { console.error("Erreur clients", e); }
};

// ✅ AJOUT INDISPENSABLE : Récupère les affectations réelles depuis la BDD
const fetchUserAssignments = async (secretaireId) => {
    try {
        const res = await fetch(`http://127.0.0.1:8000/api/admin/assignments/secretaire/${secretaireId}`, { 
            credentials: "include" 
        });
        if (res.ok) {
            const data = await res.json();
            // Déballage du format Hydra de Symfony si nécessaire
            const array = data['hydra:member'] || (Array.isArray(data) ? data : Object.values(data));
            setUserAssignments(array);
        }
    } catch (e) { 
        console.error("Erreur chargement affectations :", e); 
    }
};

const handleToggleAssignment = async (clientId, assignmentId) => {
    // 🔍 Fonction helper pour extraire l'ID si c'est un texte (ex: "/api/users/8")
    const cleanId = (id) => {
        if (typeof id === 'string' && id.includes('/')) {
            return parseInt(id.split('/').pop());
        }
        return parseInt(id);
    };

    try {
        if (assignmentId) {
            await fetch(`http://127.0.0.1:8000/api/admin/assignments/${cleanId(assignmentId)}`, { 
                method: 'DELETE', 
                credentials: 'include' 
            });
        } else {
            await fetch(`http://127.0.0.1:8000/api/admin/assignments`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                // ✅ On utilise cleanId pour envoyer des chiffres à 100%
                body: JSON.stringify({ 
                    secretaireId: cleanId(selectedUser.id), 
                    clientId: cleanId(clientId) 
                }),
                credentials: 'include'
            });
        }
        fetchUserAssignments(selectedUser.id);
    } catch (error) {
        console.error("Erreur affectation:", error);
    }
};

  // --- ACTION : TOGGLE STATUT ---
  const toggleUserStatus = async (id) => {
    try {
      const response = await fetch(
        `http://127.0.0.1:8000/api/admin/users/${id}/toggle`,
        {
          method: "PATCH",
          credentials: "include",
        },
      );
      if (response.ok) {
        setUsers(
          users.map((u) =>
            u.id === id ? { ...u, isActivate: !u.isActivate } : u,
          ),
        );
        if (selectedUser && selectedUser.id === id) {
          setSelectedUser({
            ...selectedUser,
            isActivate: !selectedUser.isActivate,
          });
        }
      }
    } catch (error) {
      console.error("Erreur toggle", error);
    }
  };

  // --- FILTRAGE SÉCURISÉ ---
  const filteredUsers = (Array.isArray(users) ? users : []).filter((user) => {
    const fullName =
      `${user.firstName || ""} ${user.lastName || ""}`.toLowerCase();
    return fullName.includes(searchTerm.toLowerCase());
  });

  // --- COMPOSANT DÉTAIL (Copie stricte de ContactDetails) ---
  const UserDetails = ({ user, onToggle }) => {
    if (!user) {
      return (
        <div className="flex items-center justify-center h-full text-gray-500 bg-white rounded-lg border-2 border-dashed border-gray-200">
          Sélectionnez une secrétaire dans la liste pour voir les détails.
        </div>
      );
    }

    return (
      <div className="bg-white p-6 rounded-lg shadow-sm max-w-4xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-gray-200">
          <div className="flex items-center space-x-4">
            <div className="w-20 h-20 rounded-full bg-blue-600 flex items-center justify-center text-white text-3xl font-bold">
              {user.firstName ? user.firstName.charAt(0).toUpperCase() : "U"}
            </div>
            <div>
              <h2 className="text-3xl font-bold text-gray-900">
                {user.firstName} {user.lastName}
              </h2>
              <p className="text-lg text-blue-600">Secrétaire</p>
            </div>
          </div>
          <div className="flex space-x-2 mt-4 sm:mt-0">
            <button
              onClick={() => onToggle(user.id)}
              className={`px-4 py-2 text-sm font-medium rounded-md border ${user.isActivate ? "border-red-200 text-red-600 hover:bg-red-50" : "border-green-200 text-green-600 hover:bg-green-50"}`}
            >
              {user.isActivate ? "Désactiver le compte" : "Activer le compte"}
            </button>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
          <div className="flex items-start space-x-3">
            <div className="text-gray-400 mt-1">
              <FaEnvelope />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Email</p>
              <p className="text-base text-gray-800">{user.email}</p>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <div className="text-gray-400 mt-1">
              <FaUserMd />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">
                Médecins affectés
              </p>
              <p 
    onClick={() => {
        fetchAllClients();
        fetchUserAssignments(selectedUser.id);
        setIsAssignModalOpen(true);
    }}
    className="text-base text-blue-600 font-medium cursor-pointer hover:underline flex items-center gap-1"
>
    Gérer les affectations ➔
</p>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <div
              className={`mt-1 ${user.isActivate ? "text-green-500" : "text-red-500"}`}
            >
              {user.isActivate ? <FaCheckCircle /> : <FaTimesCircle />}
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Statut actuel</p>
              <p className="text-base text-gray-800">
                {user.isActivate ? "🟢 Compte Actif" : "🔴 Compte Inactif"}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    // 🚨 LES MÊMES CLASSES QUE CONTACTPAGE
    <div className="flex flex-1 overflow-hidden relative">
      {/* COLONNE GAUCHE (W-96 comme ContactPage) */}
      <div className="w-96 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-4 border-b border-gray-200">
          <div className="relative">
            <input
              type="text"
              placeholder="Rechercher..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-100 rounded-lg focus:ring-2 focus:ring-blue-500 focus:bg-white"
            />
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          </div>
        </div>
        <div className="p-4 border-b border-gray-200">
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="w-full flex items-center justify-center space-x-2 py-2 px-4 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700"
          >
            <FaPlus />
            <span>Ajouter une secrétaire</span>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <p className="p-4 text-center text-gray-500">Chargement...</p>
          ) : filteredUsers.length === 0 ? (
            <p className="p-4 text-center text-gray-500">
              Aucune secrétaire trouvée.
            </p>
          ) : (
            filteredUsers.map((user) => (
              <div
                key={user.id}
                onClick={() => setSelectedUser(user)}
                className={`flex items-center p-3 space-x-3 cursor-pointer ${selectedUser?.id === user.id ? "bg-blue-50" : "hover:bg-gray-50"}`}
              >
                <div className="w-10 h-10 rounded-full bg-blue-100 flex-shrink-0 flex items-center justify-center font-bold text-blue-600">
                  {user.firstName
                    ? user.firstName.charAt(0).toUpperCase()
                    : "U"}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-800 truncate">
                    {user.firstName} {user.lastName}
                  </p>
                  <p className="text-sm text-gray-500 truncate">
                    {user.isActivate ? "🟢 Active" : "🔴 Inactive"}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* ZONE PRINCIPALE DROITE */}
      <div className="flex-1 p-6 overflow-y-auto bg-gray-50">
        <UserDetails user={selectedUser} onToggle={toggleUserStatus} />
      </div>

      {/* ✅ LA MODALE EST APPELÉE ICI */}
      <SecretaryFormModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSubmit={handleCreateSecretary}
      />
      <AssignmentModal 
    isOpen={isAssignModalOpen}
    onClose={() => setIsAssignModalOpen(false)}
    user={selectedUser}
    allClients={allClients}
    assignments={userAssignments}
    onToggleAssignment={handleToggleAssignment}
/>
    </div>
  );
}
