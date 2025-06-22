'use client';

import PageTransition from '../../components/animations/PageTransition';

export default function PrivacyPolicy() {
  return (
    <PageTransition>
      <div className="bg-black text-white min-h-screen pt-32">
        <div className="max-w-4xl mx-auto px-6 lg:px-12 py-20">
          <h1 className="text-3xl font-light tracking-wide mb-8">POLITIQUE DE CONFIDENTIALITÉ</h1>
          
          <div className="space-y-8 text-sm leading-relaxed">
            <section>
              <h2 className="text-xl font-light mb-4">1. INFORMATIONS GÉNÉRALES</h2>
              <p className="mb-4">
                REBUY-R s'engage à protéger la vie privée de ses utilisateurs. Cette politique de confidentialité 
                décrit comment nous collectons, utilisons et protégeons vos informations personnelles conformément 
                au Règlement Général sur la Protection des Données (RGPD).
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li><strong>Responsable du traitement :</strong> REBUY-R</li>
                <li><strong>Adresse :</strong> Adresse générique</li>
                <li><strong>Email :</strong> dpo@rebuy-r.com</li>
                <li><strong>Directeur de la publication :</strong> Hugo Pottier</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-light mb-4">2. DONNÉES COLLECTÉES</h2>
              <p className="mb-4">Nous collectons les données suivantes :</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li><strong>Données d'identification :</strong> Nom, prénom, adresse email</li>
                <li><strong>Données de connexion :</strong> Mot de passe (chiffré)</li>
                <li><strong>Données de navigation :</strong> Pages visitées, temps de connexion</li>
                <li><strong>Données de consentement :</strong> Consentements marketing et newsletter</li>
                <li><strong>Données de contenu :</strong> Annonces publiées, messages échangés</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-light mb-4">3. FINALITÉS DU TRAITEMENT</h2>
              <p className="mb-4">Vos données sont utilisées pour :</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Gérer votre compte utilisateur</li>
                <li>Permettre la publication et la consultation d'annonces</li>
                <li>Faciliter les échanges entre utilisateurs</li>
                <li>Améliorer nos services et l'expérience utilisateur</li>
                <li>Envoyer des communications (avec votre consentement)</li>
                <li>Assurer la sécurité de la plateforme</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-light mb-4">4. BASE LÉGALE</h2>
              <p className="mb-4">Le traitement de vos données repose sur :</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li><strong>Exécution du contrat :</strong> Pour la fourniture de nos services</li>
                <li><strong>Consentement :</strong> Pour les communications marketing et newsletters</li>
                <li><strong>Intérêt légitime :</strong> Pour la sécurité et l'amélioration des services</li>
                <li><strong>Obligation légale :</strong> Pour la conservation des données comptables</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-light mb-4">5. DURÉE DE CONSERVATION</h2>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li><strong>Données de compte :</strong> 3 ans après la dernière activité</li>
                <li><strong>Données de navigation :</strong> 13 mois maximum</li>
                <li><strong>Données de consentement :</strong> Jusqu'au retrait du consentement</li>
                <li><strong>Données comptables :</strong> 10 ans (obligation légale)</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-light mb-4">6. VOS DROITS</h2>
              <p className="mb-4">Conformément au RGPD, vous disposez des droits suivants :</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li><strong>Droit d'accès :</strong> Connaître les données vous concernant</li>
                <li><strong>Droit de rectification :</strong> Corriger des données inexactes</li>
                <li><strong>Droit à l'effacement :</strong> Supprimer vos données</li>
                <li><strong>Droit à la portabilité :</strong> Récupérer vos données</li>
                <li><strong>Droit d'opposition :</strong> Refuser le traitement</li>
                <li><strong>Droit de limitation :</strong> Limiter le traitement</li>
                <li><strong>Droit de retrait :</strong> Retirer votre consentement</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-light mb-4">7. SÉCURITÉ</h2>
              <p className="mb-4">
                Nous mettons en œuvre des mesures techniques et organisationnelles appropriées 
                pour protéger vos données contre l'accès non autorisé, la modification, 
                la divulgation ou la destruction.
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Chiffrement des mots de passe</li>
                <li>Accès sécurisé aux serveurs</li>
                <li>Sauvegardes régulières</li>
                <li>Formation du personnel</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-light mb-4">8. COOKIES</h2>
              <p className="mb-4">
                Nous utilisons des cookies pour améliorer votre expérience. Vous pouvez 
                gérer vos préférences dans les paramètres de votre navigateur.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-light mb-4">9. PARTAGE DES DONNÉES</h2>
              <p className="mb-4">
                Nous ne vendons, n'échangeons ni ne louons vos données personnelles à des tiers. 
                Nous pouvons partager vos données uniquement dans les cas suivants :
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Avec votre consentement explicite</li>
                <li>Pour respecter une obligation légale</li>
                <li>Avec nos prestataires techniques (sous-traitants)</li>
                <li>Pour protéger nos droits et notre sécurité</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-light mb-4">10. CONTACT</h2>
              <p className="mb-4">
                Pour exercer vos droits ou pour toute question concernant cette politique, 
                contactez-nous :
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li><strong>Email :</strong> dpo@rebuy-r.com</li>
                <li><strong>Adresse postale :</strong> Adresse générique</li>
                <li><strong>Délai de réponse :</strong> 1 mois maximum</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-light mb-4">11. MODIFICATIONS</h2>
              <p>
                Cette politique peut être mise à jour. Les modifications importantes 
                vous seront notifiées par email ou via un avis sur notre site.
              </p>
            </section>

            <div className="border-t border-white/20 pt-8 mt-8">
              <p className="text-xs text-white/60">
                Dernière mise à jour : {new Date().toLocaleDateString('fr-FR')}
              </p>
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
} 