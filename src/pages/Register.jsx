'use client';

import { useState } from 'react';
import { useNavigate, BrowserRouter } from 'react-router-dom';
import { useAuth, AuthProvider } from '../contexts/AuthContext';

function RegisterContent() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = await register(email, password, name);
    if (success) {
      navigate('/');
    }
  };

  return (
    <div className="container mx-auto mt-8 max-w-md">
      <h2 className="text-2xl font-bold mb-4">Inscription</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1">Nom</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div>
          <label className="block mb-1">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div>
          <label className="block mb-1">Mot de passe</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
        >
          S'inscrire
        </button>
      </form>
    </div>
  );
}

// Composant pour le rendu côté serveur qui ne dépend pas de useNavigate
function RegisterSSR() {
  return (
    <div className="container mx-auto mt-8 max-w-md">
      <h2 className="text-2xl font-bold mb-4">Inscription</h2>
      <p>Chargement du formulaire...</p>
    </div>
  );
}

function Register() {
  // Vérifier si window est défini (côté client)
  const isClient = typeof window !== 'undefined';

  return (
    <AuthProvider>
      {isClient ? (
        <BrowserRouter>
          <RegisterContent />
        </BrowserRouter>
      ) : (
        <RegisterSSR />
      )}
    </AuthProvider>
  );
}

export default Register; 