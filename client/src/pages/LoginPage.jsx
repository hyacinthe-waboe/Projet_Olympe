import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaLock, FaUser } from 'react-icons/fa';
import logo from '../assets/logo.png'; // Assure-toi que le chemin est bon

export default function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    
    // --- SIMULATION BACKEND ---
    // Ici, tu mettras plus tard ton appel API vers ton serveur Node.js
    // Pour l'instant, on accepte tout si les champs sont remplis
    if (email === 'admin@olympe.com' && password === 'admin') {
      
      // On stocke la preuve de connexion
      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('userEmail', email);

      // On redirige vers l'accueil
      navigate('/');
    } else {
      setError('Identifiants incorrects (Essayez: admin@olympe.com / admin)');
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
          <h1 className="text-2xl font-bold text-gray-800">Connexion Secrétaire</h1>
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