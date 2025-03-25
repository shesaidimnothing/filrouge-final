import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST() {
  const cookieStore = cookies();
  
  // Supprimer le cookie d'authentification
  cookieStore.delete('userData');
  
  return new NextResponse(
    JSON.stringify({ 
      success: true,
      message: 'Déconnexion réussie'
    }),
    { status: 200 }
  );
} 