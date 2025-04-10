'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import PageTransition from '../components/animations/PageTransition';
import AdCard from '../components/AdCard';
import { useAuth } from '../contexts/AuthContext';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

export default function Home() {
  const [ads, setAds] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    fetchAds();
  }, []);

  const fetchAds = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/ads');
      if (!response.ok) {
        throw new Error('Erreur lors du chargement des annonces');
      }
      const data = await response.json();
      setAds(data || []);
    } catch (error) {
      console.error('Erreur lors du chargement des annonces:', error);
      setAds([]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <PageTransition>
      <div className="bg-black text-white min-h-screen pt-32">
        {/* Bannière principale */}
        <motion.div 
          className="border-b border-white/30"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="max-w-[1800px] mx-auto px-6 lg:px-12 py-20">
            <div className="max-w-3xl">
              <h1 className="heading-xl mb-8">Trouvez ce que vous cherchez.</h1>
              <p className="text-xl font-light text-white/80 mb-8">
                Une plateforme minimaliste pour vos annonces, conçue pour une expérience simple et efficace.
              </p>
              <Link
                href="/create-ad"
                className="inline-block border border-white/20 px-8 py-4 text-sm hover:bg-white hover:text-black transition-colors duration-300"
              >
                DÉPOSER UNE ANNONCE
              </Link>
            </div>
          </div>
        </motion.div>

        {/* Section Catégories Principales */}
        <div className="border-b border-white/30">
          <div className="max-w-[1800px] mx-auto px-6 lg:px-12 py-16">
            <h2 className="text-xl font-light mb-8 tracking-wide">CATÉGORIES PRINCIPALES</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 lg:gap-6">
              <Link href="/category/immobilier" className="group">
                <div className="aspect-[4/3] relative overflow-hidden border border-white/10 hover:border-white/30 transition-colors">
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/60" />
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <h3 className="text-sm tracking-wide font-light">IMMOBILIER</h3>
                  </div>
                </div>
              </Link>
              <Link href="/category/vehicules" className="group">
                <div className="aspect-[4/3] relative overflow-hidden border border-white/10 hover:border-white/30 transition-colors">
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/60" />
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <h3 className="text-sm tracking-wide font-light">VÉHICULES</h3>
                  </div>
                </div>
              </Link>
              <Link href="/category/mode" className="group">
                <div className="aspect-[4/3] relative overflow-hidden border border-white/10 hover:border-white/30 transition-colors">
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/60" />
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <h3 className="text-sm tracking-wide font-light">MODE</h3>
                  </div>
                </div>
              </Link>
              <Link href="/category/multimedia" className="group">
                <div className="aspect-[4/3] relative overflow-hidden border border-white/10 hover:border-white/30 transition-colors">
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/60" />
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <h3 className="text-sm tracking-wide font-light">MULTIMÉDIA</h3>
                  </div>
                </div>
              </Link>
            </div>
          </div>
        </div>

        {/* Section Annonces récentes */}
        <div className="max-w-[1000px] mx-auto px-6 lg:px-12 py-20">
          <h2 className="text-xl font-light mb-8 tracking-wide">ANNONCES RÉCENTES</h2>
          {isLoading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border border-white/20 border-t-white"></div>
            </div>
          ) : ads.length > 0 ? (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 gap-8"
            >
              {ads.map((ad) => (
                <AdCard key={ad.id} ad={ad} />
              ))}
            </motion.div>
          ) : (
            <div className="text-center py-12 text-white/60 font-light tracking-wide">
              AUCUNE ANNONCE DISPONIBLE
            </div>
          )}
        </div>
      </div>
    </PageTransition>
  );
}
