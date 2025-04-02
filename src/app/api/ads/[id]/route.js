import { NextResponse } from 'next/server';
import prisma from '@/utils/prisma';

export async function GET(request, { params }) {
  try {
    // Récupérer et parser l'ID de manière asynchrone
    const id = parseInt(params.id);

    const ad = await prisma.ad.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    if (!ad) {
      return NextResponse.json(
        { error: 'Annonce non trouvée' },
        { status: 404 }
      );
    }

    return NextResponse.json(ad);
  } catch (error) {
    console.error('Erreur lors de la récupération de l\'annonce:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération de l\'annonce' },
      { status: 500 }
    );
  }
} 