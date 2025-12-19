import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { db, rateLimiter } from '@ascendos/database';

export const runtime = 'nodejs';

/**
 * API de monitoring pour les admins
 * Permet de visualiser les IPs bloquées et les patterns d'abuse
 */
export async function GET(_req: NextRequest) {
  try {
    // Vérifier l'authentification
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Vérifier que l'utilisateur est admin/owner
    const user = await db.user.findUnique({
      where: { clerkId: userId },
      include: { organization: true },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Vérifier que l'utilisateur est OWNER de son organisation
    // Seuls les owners ont accès aux données de monitoring sensibles
    if (user.role !== 'OWNER') {
      console.warn(`[Monitoring] Unauthorized access attempt by user ${user.id} with role ${user.role}`);
      return NextResponse.json(
        { error: 'Access denied. Only organization owners can access monitoring data.' },
        { status: 403 }
      );
    }

    // Récupérer les IPs bloquées récemment
    const blockedIPs = await rateLimiter.getBlockedIPs(100);

    // Grouper par IP pour voir les récidivistes
    const ipStats = blockedIPs.reduce((acc, item) => {
      if (!acc[item.ip]) {
        acc[item.ip] = {
          ip: item.ip,
          blockCount: 0,
          lastBlocked: item.timestamp,
          reasons: [],
        };
      }
      acc[item.ip].blockCount += 1;
      acc[item.ip].reasons.push(item.reason);
      if (new Date(item.timestamp) > new Date(acc[item.ip].lastBlocked)) {
        acc[item.ip].lastBlocked = item.timestamp;
      }
      return acc;
    }, {} as Record<string, {
      ip: string;
      blockCount: number;
      lastBlocked: string;
      reasons: string[];
    }>);

    // Convertir en array et trier par nombre de blocks
    const sortedStats = Object.values(ipStats)
      .sort((a, b) => b.blockCount - a.blockCount);

    // Stats globales
    const stats = {
      totalBlockedRequests: blockedIPs.length,
      uniqueIPs: sortedStats.length,
      topOffenders: sortedStats.slice(0, 10),
      recentBlocks: blockedIPs.slice(0, 20),
    };

    return NextResponse.json(stats);

  } catch (error) {
    console.error('Error in /api/admin/monitoring:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
