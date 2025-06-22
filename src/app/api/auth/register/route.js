import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import prisma from '@/utils/prisma';

export async function POST(request) {
  try {
    const { email, password, name, consentMarketing, consentNewsletter } = await request.json();
    
    console.log('Données reçues:', { email, name, consentMarketing, consentNewsletter });

    // Validation des données
    if (!email || !password || !name) {
      console.log('Validation échouée: champs manquants');
      return NextResponse.json({ 
        error: 'Tous les champs sont requis' 
      }, { status: 400 });
    }

    // Validation du consentement obligatoire
    if (!consentMarketing) {
      console.log('Validation échouée: consentement marketing manquant');
      return NextResponse.json({ 
        error: 'Vous devez accepter les conditions d\'utilisation et la politique de confidentialité' 
      }, { status: 400 });
    }

    // Validation de l'email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      console.log('Validation échouée: format email invalide');
      return NextResponse.json({ 
        error: 'Format d\'email invalide' 
      }, { status: 400 });
    }

    // Validation du mot de passe (minimum 8 caractères)
    if (password.length < 8) {
      console.log('Validation échouée: mot de passe trop court');
      return NextResponse.json({ 
        error: 'Le mot de passe doit contenir au moins 8 caractères' 
      }, { status: 400 });
    }

    console.log('Vérification de l\'existence de l\'utilisateur...');
    // Vérifier si l'email existe déjà
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      console.log('Utilisateur déjà existant');
      return NextResponse.json({ 
        error: 'Cet email est déjà utilisé' 
      }, { status: 409 });
    }

    console.log('Chiffrement du mot de passe...');
    // Chiffrer le mot de passe
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    console.log('Création de l\'utilisateur...');
    // Créer le nouvel utilisateur avec les consentements
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        consentMarketing: consentMarketing || false,
        consentNewsletter: consentNewsletter || false,
        consentDate: new Date(),
        lastActivity: new Date()
      },
      select: {
        id: true,
        email: true,
        name: true,
        consentMarketing: true,
        consentNewsletter: true,
        consentDate: true,
        createdAt: true
      }
    });

    console.log('Utilisateur créé avec succès:', user.id);

    // Log de l'inscription pour audit
    console.log(`Nouvel utilisateur inscrit: ${email} - Consentement marketing: ${consentMarketing}, Newsletter: ${consentNewsletter}`);

    return NextResponse.json({
      user,
      message: 'Inscription réussie'
    }, { status: 201 });

  } catch (error) {
    console.error('Erreur détaillée d\'inscription:', error);
    console.error('Stack trace:', error.stack);
    return NextResponse.json({ 
      error: 'Erreur lors de l\'inscription' 
    }, { status: 500 });
  }
} 