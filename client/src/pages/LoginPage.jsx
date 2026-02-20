import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaLock, FaUser } from 'react-icons/fa';
import logo from '../assets/logo.png'; // Assure-toi que le chemin est bon

export default function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await fetch('http://127.0.0.1:8000/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json' // Important pour que Symfony sache répondre en JSON
        },
        credentials: 'include', // Indispensable pour le cookie de session
        // On mappe 'email' vers 'username' car Symfony attend 'username' par défaut
        body: JSON.stringify({
          username: email,
          password: password
        })
      });

      // On vérifie d'abord si la réponse est bien du JSON
      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        throw new Error("Le serveur n'a pas répondu en JSON. Vérifiez l'URL ou les erreurs PHP.");
      }

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('isAuthenticated', 'true');
        localStorage.setItem('user', JSON.stringify(data));

        // On sauvegarde TOUT ce que le backend nous a envoyé
        localStorage.setItem('userEmail', data.email);
        localStorage.setItem('userFirstName', data.firstName); // <--- Nouveau
        localStorage.setItem('userLastName', data.lastName);   // <--- Nouveau

        navigate('/');
      } else {
        setError(data.error || 'Identifiants incorrects');
      }
    } catch (err) {
      console.error(err);
      setError("Erreur de connexion au serveur. Vérifiez qu'il est lancé.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md space-y-6">

        {/* En-tête avec Logo */}
        <div className="flex flex-col items-center">
          {/* Si l'image ne s'affiche pas, le texte alternatif apparaîtra */}
          <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mb-4">
            <img src={logo} alt="Logo" className="w-16 h-16 object-contain" />
          </div>
          <h1 className="text-2xl font-bold text-gray-800">Connexion Olympe</h1>
          <p className="text-gray-500 text-sm mt-1">Projet Olympe - Accès Sécurisé</p>
        </div>

        {/* Formulaire */}
        <form onSubmit={handleLogin} className="space-y-4">
          {error && (
            <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg border border-red-200">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaUser className="text-gray-400" />
              </div>
              <input
                type="email"
                required
                className="pl-10 block w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="votre@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Mot de passe</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaLock className="text-gray-400" />
              </div>
              <input
                type="password"
                required
                className="pl-10 block w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
          >
            Se connecter
          </button>
        </form>

        <div className="text-center mt-4">
          <a href="#" className="text-sm text-blue-600 hover:underline">Mot de passe oublié ?</a>
        </div>
      </div>
    </div>
  );
}