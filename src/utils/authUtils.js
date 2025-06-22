import prisma from './prisma';

const MAX_LOGIN_ATTEMPTS = 3;
const BLOCK_DURATION_MINUTES = 0.5; // 30 secondes

export async function checkLoginAttempts(email, ipAddress = null, userAgent = null) {
  try {
    // Vérifier s'il y a un blocage actif
    const blockedAttempt = await prisma.loginAttempt.findFirst({
      where: {
        email,
        blockedUntil: {
          gt: new Date()
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    if (blockedAttempt) {
      const remainingTime = Math.ceil((blockedAttempt.blockedUntil - new Date()) / 1000);
      return {
        blocked: true,
        remainingTime,
        message: `Trop de tentatives échouées. Réessayez dans ${remainingTime} secondes.`
      };
    }

    // Compter les tentatives échouées récentes (dernières 30 minutes)
    const recentFailedAttempts = await prisma.loginAttempt.count({
      where: {
        email,
        success: false,
        createdAt: {
          gte: new Date(Date.now() - 30 * 60 * 1000) // 30 minutes
        }
      }
    });

    if (recentFailedAttempts >= MAX_LOGIN_ATTEMPTS) {
      // Créer un blocage
      const blockedUntil = new Date(Date.now() + BLOCK_DURATION_MINUTES * 60 * 1000);
      await prisma.loginAttempt.create({
        data: {
          email,
          ipAddress,
          userAgent,
          success: false,
          blockedUntil
        }
      });

      return {
        blocked: true,
        remainingTime: BLOCK_DURATION_MINUTES * 60,
        message: `Trop de tentatives échouées. Réessayez dans ${BLOCK_DURATION_MINUTES * 60} secondes.`
      };
    }

    return {
      blocked: false,
      remainingAttempts: MAX_LOGIN_ATTEMPTS - recentFailedAttempts
    };
  } catch (error) {
    console.error('Erreur lors de la vérification des tentatives de connexion:', error);
    return {
      blocked: false,
      remainingAttempts: MAX_LOGIN_ATTEMPTS
    };
  }
}

export async function recordLoginAttempt(email, success, ipAddress = null, userAgent = null) {
  try {
    await prisma.loginAttempt.create({
      data: {
        email,
        ipAddress,
        userAgent,
        success
      }
    });
  } catch (error) {
    console.error('Erreur lors de l\'enregistrement de la tentative de connexion:', error);
  }
}

export async function clearLoginAttempts(email) {
  try {
    await prisma.loginAttempt.deleteMany({
      where: {
        email
      }
    });
  } catch (error) {
    console.error('Erreur lors de la suppression des tentatives de connexion:', error);
  }
} 