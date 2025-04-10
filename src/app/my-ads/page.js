'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import Link from 'next/link';
import PageTransition from '../../components/animations/PageTransition';
import { motion } from 'framer-motion';

export default function MyAds() {
  const [ads, setAds] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchMyAds();
    }
  }, [user]);

  const fetchMyAds = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/users/${user.id}/ads`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erreur lors du chargement des annonces');
      }

      setAds(data);
      setError('');
    } catch (error) {
      console.error('Erreur:', error);
      setError('Impossible de charger vos annonces');
      setAds([]);
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <PageTransition>
        <div className="bg-black text-white min-h-screen pt-32">
          <div className="max-w-[1000px] mx-auto px-6 lg:px-12 py-20">
            <div className="text-center text-white/60 font-light tracking-wide">
              VEUILLEZ VOUS CONNECTER POUR VOIR VOS ANNONCES
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
          <h1 className="text-xl font-light tracking-wide mb-8">MES ANNONCES</h1>
          
          {error && (
            <div className="border border-white/10 bg-red-500/10 text-white/60 px-4 py-3 mb-6">
              {error}
            </div>
          )}

          {loading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border border-white/20 border-t-white"></div>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 gap-8">
                {ads.map((ad) => (
                  <motion.div
                    key={ad.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="border border-white/10 p-6"
                  >
                    <h2 className="text-xl font-light mb-2">{ad.title}</h2>
                    <p className="text-white/60 mb-4">{ad.description}</p>
                    <p className="text-2xl font-light mb-6">{ad.price.toFixed(2)} €</p>
                    <div className="flex gap-4">
                      <Link
                        href={`/ad/${ad.id}`}
                        className="border border-white/20 px-6 py-2 text-sm hover:bg-white hover:text-black transition-colors duration-300"
                      >
                        VOIR L'ANNONCE
                      </Link>
                      <Link
                        href={`/edit-ad/${ad.id}`}
                        className="border border-white/20 px-6 py-2 text-sm hover:bg-white hover:text-black transition-colors duration-300"
                      >
                        MODIFIER
                      </Link>
                    </div>
                  </motion.div>
                ))}
              </div>

              {ads.length === 0 && (
                <div className="text-center text-white/60 font-light tracking-wide py-12">
                  VOUS N'AVEZ PAS ENCORE PUBLIÉ D'ANNONCES
                </div>
              )}

              <div className="mt-12 text-center">
                <Link
                  href="/create-ad"
                  className="border border-white/20 px-8 py-3 text-sm hover:bg-white hover:text-black transition-colors duration-300"
                >
                  CRÉER UNE NOUVELLE ANNONCE
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </PageTransition>
  );
} 