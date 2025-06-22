import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import prisma from '@/utils/prisma';
import { checkLoginAttempts, recordLoginAttempt, clearLoginAttempts } from '@/utils/authUtils';

export async function POST(request) {
  try {
    const { email, password } = await request.json();
    
    // Récupérer l'IP et le User-Agent pour la sécurité
    const forwarded = request.headers.get('x-forwarded-for');
    const ipAddress = forwarded ? forwarded.split(',')[0] : 'unknown';
    const userAgent = request.headers.get('user-agent') || 'unknown';

    // Vérifier les tentatives de connexion
    const attemptCheck = await checkLoginAttempts(email, ipAddress, userAgent);
    
    if (attemptCheck.blocked) {
      return new NextResponse(
        JSON.stringify({ 
          error: attemptCheck.message,
          blocked: true,
          remainingTime: attemptCheck.remainingTime
        }),
        { status: 429 } // Too Many Requests
      );
    }

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      // Enregistrer la tentative échouée
      await recordLoginAttempt(email, false, ipAddress, userAgent);
      
      return new NextResponse(
        JSON.stringify({ 
          error: 'Email ou mot de passe incorrect',
          remainingAttempts: attemptCheck.remainingAttempts - 1
        }),
        { status: 401 }
      );
    }

    let isValidPassword = false;

    // Si le mot de passe n'est pas chiffré (ancien utilisateur)
    if (!user.password.startsWith('$2')) {
      // Comparer directement pour les anciens comptes
      isValidPassword = (password === user.password);
      
      if (isValidPassword) {
        // Mettre à jour le mot de passe avec une version chiffrée
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        
        await prisma.user.update({
          where: { id: user.id },
          data: { password: hashedPassword }
        });
      }
    } else {
      // Pour les nouveaux comptes, utiliser bcrypt.compare
      isValidPassword = await bcrypt.compare(password, user.password);
    }

    if (!isValidPassword) {
      // Enregistrer la tentative échouée
      await recordLoginAttempt(email, false, ipAddress, userAgent);
      
      return new NextResponse(
        JSON.stringify({ 
          error: 'Email ou mot de passe incorrect',
          remainingAttempts: attemptCheck.remainingAttempts - 1
        }),
        { status: 401 }
      );
    }

    // Connexion réussie - enregistrer la tentative et nettoyer les anciennes
    await recordLoginAttempt(email, true, ipAddress, userAgent);
    await clearLoginAttempts(email);

    const { password: _, ...userWithoutPassword } = user;
    return new NextResponse(
      JSON.stringify({ 
        user: userWithoutPassword,
        message: 'Connexion réussie'
      }),
      { status: 200 }
    );
    
  } catch (error) {
    console.error('Erreur de connexion:', error);
    return new NextResponse(
      JSON.stringify({ error: 'Erreur lors de la connexion' }),
      { status: 500 }
    );
  }
} 