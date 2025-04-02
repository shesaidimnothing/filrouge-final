'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import Image from 'next/image';
import { use } from 'react';

export default function AdPage({ params }) {
  const [ad, setAd] = useState(null);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [messageSent, setMessageSent] = useState(false);
  const { user } = useAuth();
  const adId = use(params).id;

  useEffect(() => {
    fetchAdDetails();
  }, [adId]);

  const fetchAdDetails = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/ads/${adId}`, {
        credentials: 'include',
      });
      if (!response.ok) {
        throw new Error('Erreur lors du chargement de l\'annonce');
      }
      const data = await response.json();
      console.log('Détails de l\'annonce:', data);
      setAd(data);
    } catch (error) {
      console.error('Erreur:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user || !message.trim() || !ad) {
      console.log('Validation échouée:', { user, message: message.trim(), ad });
      return;
    }

    try {
      // S'assurer que l'utilisateur est connecté et a un ID
      if (!user.id) {
        console.log('Utilisateur non authentifié:', user);
        throw new Error('Utilisateur non authentifié');
      }

      const messageData = {
        content: message.trim(),
        receiverId: parseInt(ad.userId),
        adId: parseInt(ad.id)
      };

      console.log('Envoi du message avec les données:', {
        ...messageData,
        currentUser: user
      });

      const response = await fetch('/api/messages', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(messageData),
      });

      const responseData = await response.json();
      console.log('Réponse du serveur:', responseData);

      if (!response.ok) {
        console.error('Erreur serveur:', responseData);
        throw new Error(responseData.error || 'Erreur lors de l\'envoi du message');
      }

      console.log('Message envoyé avec succès:', responseData);

      setMessage('');
      setMessageSent(true);
      setError(null);
      setTimeout(() => setMessageSent(false), 3000);
    } catch (error) {
      console.error('Erreur détaillée:', error);
      setError(error.message);
      setMessageSent(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 py-8">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 py-8">
        <div className="container mx-auto px-4">
          <div className="text-center text-red-600">{error}</div>
        </div>
      </div>
    );
  }

  if (!ad) {
    return (
      <div className="min-h-screen bg-gray-100 py-8">
        <div className="container mx-auto px-4">
          <div className="text-center">Annonce non trouvée</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="container mx-auto px-4">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {ad.imageUrl && (
            <div className="relative h-96 w-full">
              <Image
                src={ad.imageUrl}
                alt={ad.title}
                fill
                className="object-cover"
              />
            </div>
          )}
          <div className="p-6">
            <h1 className="text-3xl font-bold mb-4">{ad.title}</h1>
            <p className="text-2xl font-bold text-blue-600 mb-4">
              {ad.price.toFixed(2)} €
            </p>
            <p className="text-gray-600 mb-6">{ad.description}</p>
            <div className="flex justify-between items-center mb-6">
              <span className="text-sm text-gray-500">
                Publié le {new Date(ad.createdAt).toLocaleDateString()}
              </span>
              <span className="text-sm text-gray-500">
                Catégorie: {ad.category}
              </span>
            </div>

            {user && user.id !== ad.userId && (
              <div className="mt-6 border-t pt-6">
                <h2 className="text-xl font-semibold mb-4">
                  Contacter le vendeur
                </h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows="4"
                    placeholder="Votre message..."
                    required
                  />
                  <button
                    type="submit"
                    className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Envoyer le message
                  </button>
                </form>
                {messageSent && (
                  <div className="mt-4 p-4 bg-green-100 text-green-700 rounded-lg">
                    Message envoyé avec succès !
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 