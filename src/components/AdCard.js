'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';

const AdCard = ({ ad }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="group relative bg-black border border-white/10 hover:border-white/30 transition-colors duration-300"
    >
      <div className="flex flex-col">
        <div className="relative h-[200px] w-full overflow-hidden">
          {ad.imageUrl ? (
            <>
              <img
                src={ad.imageUrl}
                alt={ad.title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors duration-300" />
            </>
          ) : (
            <div className="w-full h-full bg-white/5 flex items-center justify-center">
              <svg className="w-12 h-12 text-white/20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          )}
        </div>
        <div className="p-6">
          <p className="text-sm tracking-wider text-white/70 mb-2">
            {new Date(ad.createdAt).toLocaleDateString('fr-FR', {
              day: 'numeric',
              month: 'long',
              year: 'numeric'
            })}
          </p>
          <h3 className="text-xl font-light tracking-wide mb-3">
            {ad.title}
          </h3>
          <p className="text-white/80 font-light text-sm line-clamp-2 mb-4">
            {ad.description}
          </p>
          <div className="space-y-2 mb-4">
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span className="text-white/80 text-sm">{ad.location}</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
              </svg>
              <span className="text-white/80 text-sm">{ad.category}</span>
            </div>
          </div>
          <div className="flex justify-between items-center pt-4 border-t border-white/10">
            <span className="text-xl font-light">
              {ad.price.toFixed(2)} €
            </span>
            <Link
              href={`/ad/${ad.id}`}
              className="inline-flex items-center gap-2 px-4 py-2 border border-white/20 text-sm tracking-wider hover:bg-white hover:text-black transition-all duration-300"
            >
              VOIR
              <svg 
                className="w-4 h-4 transform group-hover:translate-x-1 transition-transform duration-300" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default AdCard; 