import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import prisma from '@/utils/prisma';

export async function POST(request) {
  try {
    console.log('Début de la requête POST');

    // Récupérer les cookies pour vérifier l'authentification
    const cookieStore = cookies();
    const userDataCookie = cookieStore.get('userData');
    console.log('Cookie userData:', userDataCookie?.value);

    if (!userDataCookie?.value) {
      console.log('Pas de cookie userData');
      return new NextResponse(
        JSON.stringify({ success: false, error: 'Non autorisé' }),
        { 
          status: 401,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    // Récupérer les données de l'annonce
    const body = await request.json();
    console.log('Données reçues:', JSON.stringify(body, null, 2));

    const { title, description, price, category, imageUrl } = body;

    // Vérifier que tous les champs requis sont présents
    if (!title || !description || !price || !category) {
      console.log('Champs manquants:', { title, description, price, category });
      return new NextResponse(
        JSON.stringify({ 
          success: false, 
          error: 'Tous les champs sont requis',
          receivedData: { title, description, price, category }
        }),
        { 
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    // Récupérer l'ID de l'utilisateur depuis le cookie
    const userData = JSON.parse(userDataCookie.value);
    const userId = userData.id;
    console.log('ID de l\'utilisateur:', userId);

    // Vérifier que l'utilisateur existe
    const user = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (!user) {
      console.log('Utilisateur non trouvé:', userId);
      return new NextResponse(
        JSON.stringify({
          success: false,
          error: 'Utilisateur non trouvé'
        }),
        {
          status: 404,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    // Créer l'annonce
    console.log('Tentative de création de l\'annonce avec:', {
      title,
      description,
      price: parseFloat(price),
      category,
      userId,
      imageUrl
    });

    const ad = await prisma.ad.create({
      data: {
        title,
        description,
        price: parseFloat(price),
        category,
        userId,
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

    // Si c'est une erreur Prisma
    if (error.code) {
      return new NextResponse(
        JSON.stringify({
          success: false,
          error: 'Erreur de base de données',
          details: error.message,
          code: error.code
        }),
        { 
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

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
  } finally {
    console.log('Fin de la requête POST');
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
        createdAt: 'desc'
      }
    });

    return NextResponse.json(ads);
  } catch (error) {
    console.error('Erreur lors de la récupération des annonces:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des annonces' },
      { status: 500 }
    );
  }
} 