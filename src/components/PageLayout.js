'use client';

import { motion } from 'framer-motion';

export default function PageLayout({ children, title, subtitle }) {
  return (
    <div className="min-h-screen pt-32">
      <motion.div 
        className="border-b border-white/10"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="max-w-[1800px] mx-auto px-6 lg:px-12 py-16">
          <div className="max-w-3xl">
            {title && <h1 className="heading-xl mb-6">{title}</h1>}
            {subtitle && (
              <p className="text-xl font-light text-white/80 mb-8">
                {subtitle}
              </p>
            )}
          </div>
        </div>
      </motion.div>

      <div className="max-w-[1800px] mx-auto px-6 lg:px-12 py-16">
        {children}
      </div>
    </div>
  );
} 