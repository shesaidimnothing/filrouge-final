'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import PageTransition from '../../../components/animations/PageTransition';
import AdCard from '../../../components/AdCard';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

export default function CategoryPage() {
  const [ads, setAds] = useState([]);
  const [loading, setLoading] = useState(true);
  const params = useParams();

  useEffect(() => {
    const fetchAds = async () => {
      try {
        const response = await fetch(`/api/ads/category/${params.category}`);
        const data = await response.json();
        setAds(data);
      } catch (error) {
        console.error('Erreur lors de la récupération des annonces:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAds();
  }, [params.category]);

  return (
    <PageTransition>
      <div className="bg-black text-white min-h-screen pt-32">
        <div className="max-w-[1000px] mx-auto px-6 lg:px-12 py-20">
          <h1 className="text-xl font-light mb-8 tracking-wide uppercase">
            {params.category.replace(/-/g, ' ')}
          </h1>
          {loading ? (
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
              AUCUNE ANNONCE DISPONIBLE DANS CETTE CATÉGORIE
            </div>
          )}
        </div>
      </div>
    </PageTransition>
  );
} 