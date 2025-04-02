import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import prisma from '../../../../utils/prisma';

export async function GET(request, { params }) {
  try {
    // Vérifier l'authentification de manière asynchrone
    const cookieStore = await cookies();
    const userDataCookie = cookieStore.get('userData');
    
    if (!userDataCookie) {
      return NextResponse.json(
        { error: 'Non authentifié' },
        { status: 401 }
      );
    }

    const userData = JSON.parse(userDataCookie.value);
    const currentUserId = parseInt(userData.id);
    
    // Attendre et récupérer les paramètres de manière asynchrone
    const resolvedParams = await params;
    const otherUserId = parseInt(resolvedParams.userId);

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
            id: true,
            name: true,
          },
        },
        receiver: {
          select: {
            id: true,
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

    // Formater les messages pour l'affichage
    const formattedMessages = messages.map(message => ({
      id: parseInt(message.id),
      content: message.content,
      createdAt: message.createdAt,
      senderId: parseInt(message.senderId),
      receiverId: parseInt(message.receiverId),
      status: message.status,
      sender: {
        ...message.sender,
        id: parseInt(message.sender.id)
      },
      receiver: {
        ...message.receiver,
        id: parseInt(message.receiver.id)
      }
    }));

    return NextResponse.json(formattedMessages);
  } catch (error) {
    console.error('Erreur lors de la récupération des messages:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des messages' },
      { status: 500 }
    );
  }
} 