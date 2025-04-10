'use client';

import { motion } from 'framer-motion';

export default function About() {
  return (
    <div className="min-h-screen pt-40 pb-20 px-6 lg:px-12">
      <div className="max-w-[1800px] mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="space-y-12"
        >
          <h1 className="heading-xl mb-16">ABOUT</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
            <div className="space-y-8">
              <p className="text-lg font-light leading-relaxed text-white/80">
                Fondé en 2024, Projet Fil Rouge est né d'une vision simple mais ambitieuse : créer une plateforme d'annonces qui redéfinit les standards du marché en ligne. Notre approche minimaliste et notre design épuré ne sont pas simplement esthétiques - ils reflètent notre engagement envers la clarté et l'efficacité.
              </p>
              <p className="text-lg font-light leading-relaxed text-white/80">
                Dans un monde digital saturé, nous avons choisi de nous concentrer sur l'essentiel. Chaque fonctionnalité, chaque interaction a été pensée pour offrir une expérience fluide et intuitive, permettant aux utilisateurs de se concentrer sur ce qui compte vraiment : leurs transactions.
              </p>
            </div>
            
            <div className="space-y-12">
              <div className="space-y-4">
                <h2 className="text-2xl font-light">Notre Mission</h2>
                <p className="text-lg font-light leading-relaxed text-white/80">
                  Faciliter les connexions entre vendeurs et acheteurs à travers une plateforme qui privilégie la simplicité et l'efficacité, tout en maintenant les plus hauts standards de sécurité et de fiabilité.
                </p>
              </div>
              
              <div className="grid grid-cols-2 gap-8">
                <div>
                  <h3 className="text-5xl font-light mb-2">20K+</h3>
                  <p className="text-sm font-light text-white/60">Utilisateurs Actifs</p>
                </div>
                <div>
                  <h3 className="text-5xl font-light mb-2">50K+</h3>
                  <p className="text-sm font-light text-white/60">Annonces Publiées</p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="space-y-4">
              <h3 className="text-xl font-light">Design Minimaliste</h3>
              <p className="text-base font-light leading-relaxed text-white/80">
                Une interface épurée qui met en valeur vos annonces et facilite la navigation.
              </p>
            </div>
            <div className="space-y-4">
              <h3 className="text-xl font-light">Sécurité Avancée</h3>
              <p className="text-base font-light leading-relaxed text-white/80">
                Protection des données et des transactions avec les dernières technologies.
              </p>
            </div>
            <div className="space-y-4">
              <h3 className="text-xl font-light">Support 24/7</h3>
              <p className="text-base font-light leading-relaxed text-white/80">
                Une équipe dédiée pour vous accompagner à chaque étape.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
} 