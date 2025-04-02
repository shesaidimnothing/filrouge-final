import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import prisma from '../../../../utils/prisma';

export async function GET() {
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
    const userId = parseInt(userData.id);

    // Récupérer tous les messages envoyés et reçus par l'utilisateur
    const messages = await prisma.privateMessage.findMany({
      where: {
        OR: [
          { senderId: userId },
          { receiverId: userId }
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
        createdAt: 'desc'
      }
    });

    // Grouper les messages par conversation
    const conversations = messages.reduce((acc, message) => {
      // Déterminer l'autre utilisateur de la conversation
      const otherUser = message.senderId === userId ? message.receiver : message.sender;
      const otherUserId = parseInt(otherUser.id);

      // Créer ou mettre à jour la conversation
      if (!acc[otherUserId]) {
        acc[otherUserId] = {
          userId: otherUserId,
          userName: otherUser.name,
          lastMessage: message.content,
          lastMessageDate: message.createdAt,
          unreadCount: message.receiverId === userId && message.status === 'SENT' ? 1 : 0
        };
      } else {
        // Mettre à jour la conversation si le message est plus récent
        if (message.createdAt > acc[otherUserId].lastMessageDate) {
          acc[otherUserId].lastMessage = message.content;
          acc[otherUserId].lastMessageDate = message.createdAt;
        }
        // Incrémenter le compteur de messages non lus si nécessaire
        if (message.receiverId === userId && message.status === 'SENT') {
          acc[otherUserId].unreadCount++;
        }
      }

      return acc;
    }, {});

    // Convertir l'objet en tableau et trier par date du dernier message
    const sortedConversations = Object.values(conversations).sort((a, b) => 
      new Date(b.lastMessageDate) - new Date(a.lastMessageDate)
    );

    return NextResponse.json(sortedConversations);
  } catch (error) {
    console.error('Erreur lors de la récupération des conversations:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des conversations' },
      { status: 500 }
    );
  }
} 