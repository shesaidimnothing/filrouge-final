import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import prisma from '@/utils/prisma';

export async function POST(request) {
  try {
    console.log('Début de la requête POST /api/messages');

    // Vérifier l'authentification
    const cookieStore = cookies();
    const userDataCookie = cookieStore.get('userData');
    console.log('Cookie userData:', userDataCookie?.value);
    
    if (!userDataCookie) {
      console.log('Cookie userData non trouvé');
      return NextResponse.json(
        { error: 'Non authentifié' },
        { status: 401 }
      );
    }

    const userData = JSON.parse(userDataCookie.value);
    console.log('Données utilisateur parsées:', userData);

    if (!userData || !userData.id) {
      console.log('Données utilisateur invalides:', userData);
      return NextResponse.json(
        { error: 'Données utilisateur invalides' },
        { status: 401 }
      );
    }

    const senderId = userData.id;
    console.log('ID de l\'expéditeur:', senderId);

    // Récupérer les données du message
    const body = await request.json();
    console.log('Données reçues:', body);

    const { content, receiverId, adId } = body;
    console.log('Données extraites:', { content, receiverId, adId });

    if (!content || !receiverId || !adId) {
      console.log('Données manquantes:', { content, receiverId, adId });
      return NextResponse.json(
        { error: 'Le contenu, le destinataire et l\'annonce sont requis' },
        { status: 400 }
      );
    }

    // Vérifier que l'annonce existe
    const ad = await prisma.ad.findUnique({
      where: { id: parseInt(adId) },
      include: {
        user: true
      }
    });

    if (!ad) {
      console.log('Annonce non trouvée pour l\'ID:', adId);
      return NextResponse.json(
        { error: 'Annonce non trouvée' },
        { status: 404 }
      );
    }

    console.log('Annonce trouvée:', ad);

    // Vérifier que l'expéditeur existe
    const sender = await prisma.user.findUnique({
      where: { id: parseInt(senderId) }
    });

    if (!sender) {
      console.log('Expéditeur non trouvé pour l\'ID:', senderId);
      return NextResponse.json(
        { error: 'Expéditeur non trouvé' },
        { status: 404 }
      );
    }

    console.log('Expéditeur trouvé:', sender);

    // Vérifier que le destinataire existe
    const receiver = await prisma.user.findUnique({
      where: { id: parseInt(receiverId) }
    });

    if (!receiver) {
      console.log('Destinataire non trouvé pour l\'ID:', receiverId);
      return NextResponse.json(
        { error: 'Destinataire non trouvé' },
        { status: 404 }
      );
    }

    console.log('Destinataire trouvé:', receiver);

    // Créer le message
    const message = await prisma.privateMessage.create({
      data: {
        content,
        senderId: parseInt(senderId),
        receiverId: parseInt(receiverId),
        adId: parseInt(adId),
        status: 'SENT'
      },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        receiver: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    });

    console.log('Message créé avec succès:', message);
    return NextResponse.json(message);
  } catch (error) {
    console.error('Erreur détaillée lors de l\'envoi du message:', {
      message: error.message,
      stack: error.stack,
      name: error.name,
      code: error.code
    });
    return NextResponse.json(
      { error: 'Erreur lors de l\'envoi du message', details: error.message },
      { status: 500 }
    );
  }
} 