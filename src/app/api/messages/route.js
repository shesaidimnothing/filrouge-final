import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import prisma from '../../../utils/prisma';

export async function POST(request) {
  try {
    const body = await request.json();
    const { content, receiverId, adId } = body;

    // Vérifier l'authentification
    const cookieStore = cookies();
    const userDataCookie = cookieStore.get('userData');
    
    if (!userDataCookie) {
      return NextResponse.json(
        { error: 'Non authentifié' },
        { status: 401 }
      );
    }

    const userData = JSON.parse(userDataCookie.value);
    const senderId = userData.id;

    if (!content || !receiverId) {
      return NextResponse.json(
        { error: 'Le contenu et le destinataire sont requis' },
        { status: 400 }
      );
    }

    // Vérifier que l'expéditeur existe
    const sender = await prisma.user.findUnique({
      where: { id: parseInt(senderId) }
    });

    if (!sender) {
      return NextResponse.json(
        { error: 'Expéditeur non trouvé' },
        { status: 404 }
      );
    }

    // Vérifier que le destinataire existe
    const receiver = await prisma.user.findUnique({
      where: { id: parseInt(receiverId) }
    });

    if (!receiver) {
      return NextResponse.json(
        { error: 'Destinataire non trouvé' },
        { status: 404 }
      );
    }

    // Si un adId est fourni, vérifier que l'annonce existe
    if (adId) {
      const ad = await prisma.ad.findUnique({
        where: { id: parseInt(adId) }
      });

      if (!ad) {
        return NextResponse.json(
          { error: 'Annonce non trouvée' },
          { status: 404 }
        );
      }
    }

    const message = await prisma.privateMessage.create({
      data: {
        content: content.trim(),
        sender: {
          connect: { id: parseInt(senderId) }
        },
        receiver: {
          connect: { id: parseInt(receiverId) }
        },
        status: "sent",
        ad: adId ? {
          connect: { id: parseInt(adId) }
        } : undefined
      },
      include: {
        sender: {
          select: {
            name: true,
            email: true,
          },
        },
        receiver: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    });

    return NextResponse.json(message, { status: 201 });
  } catch (error) {
    console.error('Erreur détaillée:', error);
    return NextResponse.json(
      { error: error.message || 'Erreur lors de l\'envoi du message' },
      { status: 500 }
    );
  }
} 