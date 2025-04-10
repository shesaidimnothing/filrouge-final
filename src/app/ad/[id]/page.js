'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import Image from 'next/image';
import { use } from 'react';
import PageTransition from '../../../components/animations/PageTransition';
import { motion } from 'framer-motion';

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
      const response = await fetch(`/api/ads/${adId}`);
      if (!response.ok) {
        throw new Error('Erreur lors du chargement de l\'annonce');
      }
      const data = await response.json();
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
    try {
      const response = await fetch('/api/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          adId: ad.id,
          message,
          recipientId: ad.userId,
        }),
      });

      if (!response.ok) {
        throw new Error('Erreur lors de l\'envoi du message');
      }

      setMessage('');
      setMessageSent(true);
      setTimeout(() => setMessageSent(false), 3000);
    } catch (error) {
      console.error('Erreur:', error);
    }
  };

  if (loading) {
    return (
      <PageTransition>
        <div className="bg-black text-white min-h-screen pt-32">
          <div className="max-w-[1000px] mx-auto px-6 lg:px-12 py-20">
            <div className="flex justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border border-white/20 border-t-white"></div>
            </div>
          </div>
        </div>
      </PageTransition>
    );
  }

  if (error) {
    return (
      <PageTransition>
        <div className="bg-black text-white min-h-screen pt-32">
          <div className="max-w-[1000px] mx-auto px-6 lg:px-12 py-20">
            <div className="text-center text-white/60 font-light tracking-wide">
              {error}
            </div>
          </div>
        </div>
      </PageTransition>
    );
  }

  if (!ad) {
    return (
      <PageTransition>
        <div className="bg-black text-white min-h-screen pt-32">
          <div className="max-w-[1000px] mx-auto px-6 lg:px-12 py-20">
            <div className="text-center text-white/60 font-light tracking-wide">
              ANNONCE NON TROUVÉE
            </div>
          </div>
        </div>
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      <div className="bg-black text-white min-h-screen pt-32">
        <div className="max-w-[1000px] mx-auto px-6 lg:px-12 py-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="border border-white/10"
          >
            {ad.imageUrl && (
              <div className="relative h-[400px] w-full overflow-hidden">
                <Image
                  src={ad.imageUrl}
                  alt={ad.title}
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-black/20"></div>
              </div>
            )}
            <div className="p-8 space-y-6">
              <div>
                <p className="text-sm tracking-wider text-white/70 mb-2">
                  {new Date(ad.createdAt).toLocaleDateString('fr-FR', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric'
                  })}
                </p>
                <h1 className="text-3xl font-light tracking-wide mb-4">{ad.title}</h1>
                <p className="text-2xl font-light mb-6">{ad.price.toFixed(2)} €</p>
                <p className="text-white/80 font-light">{ad.description}</p>
              </div>

              <div className="space-y-3 pt-6 border-t border-white/10">
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span className="text-white/80">{ad.location}</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                  </svg>
                  <span className="text-white/80">{ad.category}</span>
                </div>
              </div>

              {user && user.id !== ad.userId && (
                <div className="pt-6 border-t border-white/10">
                  <h2 className="text-xl font-light tracking-wide mb-4">CONTACTER LE VENDEUR</h2>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <textarea
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      className="w-full p-4 bg-black border border-white/20 text-white placeholder-white/50 focus:border-white/50 transition-colors"
                      rows="4"
                      placeholder="Votre message..."
                      required
                    />
                    <button
                      type="submit"
                      className="w-full border border-white/20 px-8 py-4 text-sm hover:bg-white hover:text-black transition-colors duration-300"
                    >
                      ENVOYER LE MESSAGE
                    </button>
                  </form>
                  {messageSent && (
                    <div className="mt-4 p-4 border border-white/20 text-white/80 text-center">
                      MESSAGE ENVOYÉ AVEC SUCCÈS
                    </div>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </PageTransition>
  );
} 