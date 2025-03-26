import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import prisma from '../../../utils/prisma';

export async function POST(request) {
  try {
    console.log('Début de la requête POST');

    // Lire le corps de la requête une seule fois
    const requestClone = request.clone();
    const body = await request.json();
    console.log('Données reçues:', JSON.stringify(body, null, 2));
    
    const { title, description, price, category, userId, imageUrl } = body;

    // Vérifier que tous les champs requis sont présents
    if (!title || !description || !price || !category || !userId) {
      console.log('Champs manquants:', { title, description, price, category, userId });
      return new NextResponse(
        JSON.stringify({ 
          success: false, 
          error: 'Tous les champs sont requis',
          receivedData: { title, description, price, category, userId }
        }),
        { 
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    // Vérifier l'authentification
    const cookieStore = cookies();
    console.log('Tous les cookies:', cookieStore.getAll().map(c => c.name));
    
    const userDataCookie = cookieStore.get('userData');
    console.log('Cookie userData:', userDataCookie?.value);
    console.log('Request headers:', requestClone.headers);

    // Utiliser l'ID utilisateur fourni dans le corps de la requête
    // et ignorer la vérification du cookie pour le moment
    
    // Créer l'annonce
    console.log('Tentative de création de l\'annonce avec:', {
      title,
      description,
      price: parseFloat(price),
      category,
      userId: parseInt(userId),
      imageUrl
    });

    const ad = await prisma.ad.create({
      data: {
        title,
        description,
        price: parseFloat(price),
        category,
        userId: parseInt(userId),
        imageUrl
      },
      include: {
        user: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    });

    console.log('Annonce créée avec succès:', ad);

    return new NextResponse(
      JSON.stringify({
        success: true,
        ad,
        message: 'Annonce créée avec succès'
      }),
      { 
        status: 201,
        headers: { 'Content-Type': 'application/json' }
      }
    );
    
  } catch (error) {
    console.error('Erreur détaillée:', {
      message: error.message,
      stack: error.stack,
      name: error.name,
      code: error.code
    });

    return new NextResponse(
      JSON.stringify({
        success: false,
        error: 'Erreur lors de la création de l\'annonce',
        details: error.message
      }),
      { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
}

export async function GET() {
  try {
    const ads = await prisma.ad.findMany({
      include: {
        user: {
          select: {
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return new NextResponse(
      JSON.stringify(ads),
      { 
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  } catch (error) {
    console.error('Erreur lors de la récupération des annonces:', error);
    return new NextResponse(
      JSON.stringify({
        success: false,
        error: 'Erreur lors de la récupération des annonces'
      }),
      { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
} 