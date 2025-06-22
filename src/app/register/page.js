'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../contexts/AuthContext';
import Link from 'next/link';

export default function Register() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    consentMarketing: false,
    consentNewsletter: false
  });
  const [error, setError] = useState('');
  const router = useRouter();
  const { register } = useAuth() || {};

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!register) return; // Protection si le contexte n'est pas encore disponible
    setError('');

    // Vérification du consentement obligatoire
    if (!formData.consentMarketing) {
      setError('Vous devez accepter les conditions d\'utilisation et la politique de confidentialité pour continuer.');
      return;
    }

    try {
      await register(formData.email, formData.password, formData.name, {
        consentMarketing: formData.consentMarketing,
        consentNewsletter: formData.consentNewsletter
      });
      router.push('/login');
    } catch (error) {
      console.error('Erreur:', error);
      setError(error.message);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Créer un compte
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Rejoignez notre communauté en quelques étapes simples
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
              {error}
            </div>
          )}
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="name" className="sr-only">Nom</label>
              <input
                id="name"
                name="name"
                type="text"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Nom complet"
                value={formData.name}
                onChange={handleChange}
              />
            </div>
            <div>
              <label htmlFor="email" className="sr-only">Email</label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Adresse email"
                value={formData.email}
                onChange={handleChange}
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">Mot de passe</label>
              <input
                id="password"
                name="password"
                type="password"
                required
                minLength="8"
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Mot de passe (minimum 8 caractères)"
                value={formData.password}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Section Consentements CNIL */}
          <div className="space-y-4">
            <div className="flex items-start">
              <div className="flex items-center h-5">
                <input
                  id="consentMarketing"
                  name="consentMarketing"
                  type="checkbox"
                  required
                  checked={formData.consentMarketing}
                  onChange={handleChange}
                  className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                />
              </div>
              <div className="ml-3 text-sm">
                <label htmlFor="consentMarketing" className="font-medium text-gray-700">
                  J'accepte les conditions d'utilisation et la politique de confidentialité *
                </label>
                <p className="text-gray-500">
                  En cochant cette case, vous acceptez que vos données personnelles soient traitées conformément à notre{' '}
                  <Link href="/privacy-policy" className="text-blue-600 hover:text-blue-500 underline">
                    politique de confidentialité
                  </Link>
                  {' '}et nos{' '}
                  <Link href="/terms" className="text-blue-600 hover:text-blue-500 underline">
                    conditions d'utilisation
                  </Link>
                  .
                </p>
              </div>
            </div>

            <div className="flex items-start">
              <div className="flex items-center h-5">
                <input
                  id="consentNewsletter"
                  name="consentNewsletter"
                  type="checkbox"
                  checked={formData.consentNewsletter}
                  onChange={handleChange}
                  className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                />
              </div>
              <div className="ml-3 text-sm">
                <label htmlFor="consentNewsletter" className="font-medium text-gray-700">
                  J'accepte de recevoir des newsletters et offres promotionnelles
                </label>
                <p className="text-gray-500">
                  Vous pouvez vous désabonner à tout moment. Ce consentement est optionnel et n'affecte pas votre inscription.
                </p>
              </div>
            </div>
          </div>

          {/* Informations sur le traitement des données */}
          <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
            <h4 className="text-sm font-medium text-blue-800 mb-2">
              Informations sur le traitement de vos données
            </h4>
            <ul className="text-xs text-blue-700 space-y-1">
              <li>• Responsable du traitement : REBUY-R</li>
              <li>• Finalité : Gestion de votre compte et amélioration de nos services</li>
              <li>• Base légale : Exécution du contrat et consentement</li>
              <li>• Durée de conservation : 3 ans après la dernière activité</li>
              <li>• Vos droits : Accès, rectification, effacement, portabilité, opposition</li>
              <li>• Contact DPO : dpo@rebuy-r.com</li>
            </ul>
          </div>

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              S'inscrire
            </button>
          </div>
        </form>
        <div className="text-center">
          <Link href="/login" className="text-blue-600 hover:text-blue-500">
            Déjà un compte ? Se connecter
          </Link>
        </div>
      </div>
    </div>
  );
} 