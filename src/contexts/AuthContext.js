'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUserState] = useState(null);
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedUser = localStorage.getItem('userData');
      if (storedUser) {
        try {
          const userData = JSON.parse(storedUser);
          setUserState(userData);
          // Synchroniser avec le cookie
          document.cookie = `userData=${storedUser}; path=/; max-age=86400`;
        } catch (error) {
          console.error('Erreur de parsing des données utilisateur', error);
        }
      }
    }
  }, []);

  const updateUser = (userData) => {
    if (typeof window !== 'undefined') {
      if (userData) {
        const userDataString = JSON.stringify(userData);
        localStorage.setItem('userData', userDataString);
        document.cookie = `userData=${userDataString}; path=/; max-age=86400`;
      } else {
        localStorage.removeItem('userData');
        document.cookie = 'userData=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT';
      }
      setUserState(userData);
    }
  };

  const login = async (email, password) => {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (!response.ok) {
        // Créer une erreur avec les informations supplémentaires
        const error = new Error(data.error || 'Erreur lors de la connexion');
        
        // Ajouter les informations de tentatives restantes
        if (data.remainingAttempts !== undefined) {
          error.remainingAttempts = data.remainingAttempts;
        }
        
        // Ajouter les informations de blocage
        if (data.blocked) {
          error.blocked = true;
          error.remainingTime = data.remainingTime;
        }
        
        throw error;
      }

      updateUser(data.user);
      return true;
    } catch (error) {
      console.error('Erreur de connexion:', error);
      throw error; // Propager l'erreur pour que le composant puisse la gérer
    }
  };

  const register = async (email, password, name, consentData = {}) => {
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          name, 
          email, 
          password,
          consentMarketing: consentData.consentMarketing || false,
          consentNewsletter: consentData.consentNewsletter || false
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erreur lors de l\'inscription');
      }

      updateUser(data.user);
      return true;
    } catch (error) {
      console.error('Erreur d\'inscription:', error);
      throw error;
    }
  };

  const logout = () => {
    updateUser(null);
    router.push('/login');
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      setUser: updateUser, 
      login, 
      register,
      logout 
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth doit être utilisé à l\'intérieur d\'un AuthProvider');
  }
  return context;
} 