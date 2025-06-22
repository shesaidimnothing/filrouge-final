'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import PageTransition from '../../components/animations/PageTransition';

const formVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

const inputVariants = {
  focus: { scale: 1.02 }
};

export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [remainingAttempts, setRemainingAttempts] = useState(3);
  const [isBlocked, setIsBlocked] = useState(false);
  const [blockedUntil, setBlockedUntil] = useState(null);
  const [countdown, setCountdown] = useState(0);
  const router = useRouter();
  const { login } = useAuth();

  // Gestion du compte à rebours
  useEffect(() => {
    let interval;
    if (isBlocked && countdown > 0) {
      interval = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) {
            setIsBlocked(false);
            setBlockedUntil(null);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isBlocked, countdown]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    try {
      const success = await login(email, password);
      if (success) {
        router.push('/'); // Redirection vers la page d'accueil après connexion
      }
    } catch (err) {
      // Gérer les différents types d'erreurs
      if (err.message && err.message.includes('Trop de tentatives échouées')) {
        setIsBlocked(true);
        setBlockedUntil(new Date(Date.now() + 30 * 1000)); // 30 secondes
        setCountdown(30);
        setError(err.message);
      } else if (err.remainingAttempts !== undefined) {
        setRemainingAttempts(err.remainingAttempts);
        setError(`Email ou mot de passe incorrect. Tentatives restantes : ${err.remainingAttempts}`);
      } else {
        setError(err.message || 'Une erreur est survenue lors de la connexion');
      }
    }
  };

  const isFormDisabled = isBlocked;

  return (
    <PageTransition>
      <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <motion.div
          variants={formVariants}
          initial="hidden"
          animate="visible"
          className="max-w-md w-full space-y-8"
        >
          <div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
              Connexion
            </h2>
          </div>
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className={`px-4 py-3 rounded relative ${isBlocked ? 'bg-orange-100 border border-orange-400 text-orange-700' : 'bg-red-100 border border-red-400 text-red-700'}`} role="alert">
                <span className="block sm:inline">{error}</span>
                {isBlocked && countdown > 0 && (
                  <div className="mt-2 text-sm">
                    <span className="font-medium">Temps restant : {countdown} secondes</span>
                  </div>
                )}
              </div>
            )}
            
            {!isBlocked && remainingAttempts < 3 && (
              <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded">
                <span className="text-sm">
                  ⚠️ Attention : {remainingAttempts} tentative{remainingAttempts > 1 ? 's' : ''} restante{remainingAttempts > 1 ? 's' : ''}
                </span>
              </div>
            )}

            <div className="rounded-md shadow-sm -space-y-px">
              <div>
                <label htmlFor="email" className="sr-only">Email</label>
                <motion.input
                  variants={inputVariants}
                  whileFocus="focus"
                  id="email"
                  name="email"
                  type="email"
                  required
                  disabled={isFormDisabled}
                  className={`appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm ${isFormDisabled ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                  placeholder="Adresse email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div>
                <label htmlFor="password" className="sr-only">Mot de passe</label>
                <motion.input
                  variants={inputVariants}
                  whileFocus="focus"
                  id="password"
                  name="password"
                  type="password"
                  required
                  disabled={isFormDisabled}
                  className={`appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm ${isFormDisabled ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                  placeholder="Mot de passe"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <div>
              <motion.button
                whileHover={!isFormDisabled ? { scale: 1.02 } : {}}
                whileTap={!isFormDisabled ? { scale: 0.98 } : {}}
                type="submit"
                disabled={isFormDisabled}
                className={`group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                  isFormDisabled 
                    ? 'bg-gray-400 cursor-not-allowed' 
                    : 'bg-blue-600 hover:bg-blue-700'
                }`}
              >
                {isBlocked ? `Réessayer dans ${countdown}s` : 'Se connecter'}
              </motion.button>
            </div>
          </form>
          <div className="text-center">
            <Link href="/register" className="text-blue-600 hover:text-blue-500">
              Pas encore de compte ? S'inscrire
            </Link>
          </div>
        </motion.div>
      </div>
    </PageTransition>
  );
} 