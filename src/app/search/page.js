'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import PageTransition from '../../components/animations/PageTransition';
import AdCard from '../../components/AdCard';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

function SearchContent() {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const searchParams = useSearchParams();
  const query = searchParams.get('q');

  useEffect(() => {
    const fetchResults = async () => {
      if (!query) {
        setLoading(false);
        return;
      }
      
      try {
        const response = await fetch(`/api/ads/search?q=${encodeURIComponent(query)}`);
        const data = await response.json();
        setResults(data);
      } catch (error) {
        console.error('Erreur de recherche:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [query]);

  return (
    <PageTransition>
      <div className="bg-black text-white min-h-screen pt-32">
        <div className="max-w-[1000px] mx-auto px-6 lg:px-12 py-20">
          <h1 className="text-xl font-light mb-8 tracking-wide">
            RÉSULTATS POUR "{query || ''}"
          </h1>
          {loading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border border-white/20 border-t-white"></div>
            </div>
          ) : results.length > 0 ? (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 gap-8"
            >
              {results.map((ad) => (
                <AdCard key={ad.id} ad={ad} />
              ))}
            </motion.div>
          ) : (
            <div className="text-center py-12 text-white/60 font-light tracking-wide">
              AUCUNE ANNONCE TROUVÉE
            </div>
          )}
        </div>
      </div>
    </PageTransition>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border border-white/20 border-t-white"></div>
      </div>
    }>
      <SearchContent />
    </Suspense>
  );
} 