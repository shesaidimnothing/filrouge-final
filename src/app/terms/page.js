'use client';

import PageTransition from '../../components/animations/PageTransition';

export default function Terms() {
  return (
    <PageTransition>
      <div className="bg-black text-white min-h-screen pt-32">
        <div className="max-w-4xl mx-auto px-6 lg:px-12 py-20">
          <h1 className="text-3xl font-light tracking-wide mb-8">CONDITIONS D'UTILISATION</h1>
          
          <div className="space-y-8 text-sm leading-relaxed">
            <section>
              <h2 className="text-xl font-light mb-4">1. PRÉSENTATION DU SERVICE</h2>
              <p className="mb-4">
                REBUY-R est une plateforme de petites annonces permettant aux utilisateurs de publier, 
                consulter et échanger sur des biens et services. Ces conditions d'utilisation régissent 
                l'utilisation de notre service.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-light mb-4">2. ACCEPTATION DES CONDITIONS</h2>
              <p className="mb-4">
                En utilisant notre service, vous acceptez d'être lié par ces conditions d'utilisation. 
                Si vous n'acceptez pas ces conditions, veuillez ne pas utiliser notre service.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-light mb-4">3. CRÉATION DE COMPTE</h2>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Vous devez avoir au moins 18 ans pour créer un compte</li>
                <li>Vous êtes responsable de la confidentialité de vos identifiants</li>
                <li>Vous devez fournir des informations exactes et à jour</li>
                <li>Un seul compte par personne est autorisé</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-light mb-4">4. PUBLICATION D'ANNONCES</h2>
              <p className="mb-4">Lors de la publication d'annonces, vous vous engagez à :</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Fournir des informations exactes et complètes</li>
                <li>Respecter les droits de propriété intellectuelle</li>
                <li>Ne pas publier de contenu illégal, offensant ou inapproprié</li>
                <li>Ne pas publier de contenu commercial sans autorisation</li>
                <li>Respecter les lois en vigueur</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-light mb-4">5. CONTENU INTERDIT</h2>
              <p className="mb-4">Il est interdit de publier :</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Du contenu pornographique ou sexuellement explicite</li>
                <li>Des armes, drogues ou substances illégales</li>
                <li>Du contenu discriminatoire ou haineux</li>
                <li>Des informations personnelles d'autrui</li>
                <li>Du spam ou du contenu commercial non autorisé</li>
                <li>Du contenu contrefait ou illégal</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-light mb-4">6. COMMUNICATIONS ENTRE UTILISATEURS</h2>
              <p className="mb-4">
                Les communications entre utilisateurs doivent respecter les règles de bonne conduite. 
                Nous nous réservons le droit de modérer les échanges et de suspendre les comptes 
                en cas de comportement inapproprié.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-light mb-4">7. RESPONSABILITÉS</h2>
              <p className="mb-4">
                REBUY-R agit en tant qu'hébergeur de contenu. Nous ne sommes pas responsables :
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Du contenu publié par les utilisateurs</li>
                <li>Des transactions entre utilisateurs</li>
                <li>De la qualité ou de la conformité des biens/services</li>
                <li>Des litiges entre utilisateurs</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-light mb-4">8. PROPRIÉTÉ INTELLECTUELLE</h2>
              <p className="mb-4">
                Le contenu de la plateforme (design, code, marques) appartient à REBUY-R. 
                Les utilisateurs conservent leurs droits sur le contenu qu'ils publient, 
                mais accordent à REBUY-R une licence d'utilisation.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-light mb-4">9. MODÉRATION ET SANCTIONS</h2>
              <p className="mb-4">
                Nous nous réservons le droit de :
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Modérer le contenu publié</li>
                <li>Suspendre ou supprimer des comptes</li>
                <li>Supprimer des annonces inappropriées</li>
                <li>Signaler les infractions aux autorités compétentes</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-light mb-4">10. PROTECTION DES DONNÉES</h2>
              <p className="mb-4">
                Le traitement de vos données personnelles est régi par notre politique de confidentialité, 
                accessible depuis notre site web. Nous nous engageons à respecter le RGPD.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-light mb-4">11. DISPONIBILITÉ DU SERVICE</h2>
              <p className="mb-4">
                Nous nous efforçons de maintenir le service disponible 24h/24 et 7j/7, 
                mais nous ne pouvons garantir une disponibilité continue. 
                Des interruptions peuvent survenir pour maintenance ou pour des raisons techniques.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-light mb-4">12. MODIFICATIONS</h2>
              <p className="mb-4">
                Nous nous réservons le droit de modifier ces conditions à tout moment. 
                Les modifications importantes vous seront notifiées par email ou via un avis sur le site.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-light mb-4">13. RÉSILIATION</h2>
              <p className="mb-4">
                Vous pouvez supprimer votre compte à tout moment. Nous pouvons également 
                suspendre ou supprimer votre compte en cas de non-respect de ces conditions.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-light mb-4">14. DROIT APPLICABLE</h2>
              <p className="mb-4">
                Ces conditions sont soumises au droit français. En cas de litige, 
                les tribunaux français seront seuls compétents.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-light mb-4">15. CONTACT</h2>
              <p className="mb-4">
                Pour toute question concernant ces conditions, contactez-nous :
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li><strong>Email :</strong> legal@rebuy-r.com</li>
                <li><strong>Adresse :</strong> Adresse générique</li>
              </ul>
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