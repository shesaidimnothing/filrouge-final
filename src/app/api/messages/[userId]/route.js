import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import prisma from '../../../../utils/prisma';

export async function GET(request, { params }) {
  try {
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
    const currentUserId = userData.id;
    const otherUserId = parseInt(params.userId);

    // Récupérer les messages entre les deux utilisateurs
    const messages = await prisma.privateMessage.findMany({
      where: {
        OR: [
          {
            AND: [
              { senderId: currentUserId },
              { receiverId: otherUserId }
            ]
          },
          {
            AND: [
              { senderId: otherUserId },
              { receiverId: currentUserId }
            ]
          }
        ]
      },
      include: {
        sender: {
          select: {
            name: true,
          },
        },
        receiver: {
          select: {
            name: true,
          },
        },
      },
      orderBy: {
        createdAt: 'asc'
      }
    });

    // Marquer les messages reçus comme lus
    await prisma.privateMessage.updateMany({
      where: {
        senderId: otherUserId,
        receiverId: currentUserId,
        status: 'SENT'
      },
      data: {
        status: 'READ'
      }
    });

    return NextResponse.json(messages);
  } catch (error) {
    console.error('Erreur lors de la récupération des messages:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des messages' },
      { status: 500 }
    );
  }
} 