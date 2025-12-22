import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { db, rateLimiter } from '@ascendos/database';
import { loggers, logError, logSecurityEvent } from '@/lib/logger';
import { subDays, startOfDay, startOfWeek } from 'date-fns';

export const runtime = 'nodejs';

/**
 * API de monitoring pour les admins
 * Fournit des statistiques complètes sur:
 * - Organisations (par plan)
 * - Usage (générations, tokens)
 * - Sécurité (IPs bloquées, tentatives)
 * - Projets et utilisateurs
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
    if (user.role !== 'OWNER') {
      logSecurityEvent('monitoring_access_denied', { userId: user.id, role: user.role });
      return NextResponse.json(
        { error: 'Access denied. Only organization owners can access monitoring data.' },
        { status: 403 }
      );
    }

    const now = new Date();
    const todayStart = startOfDay(now);
    const weekStart = startOfWeek(now, { weekStartsOn: 1 }); // Monday
    const thirtyDaysAgo = subDays(now, 30);

    // Fetch all stats in parallel for performance
    const [
      // Organization stats
      orgsByPlan,
      totalOrgs,

      // User stats
      totalUsers,

      // Project stats
      totalProjects,
      activeProjects,

      // Update stats
      updatesToday,
      updatesThisWeek,
      updatesLast30Days,

      // Usage stats (for this organization only)
      orgUsageToday,
      orgUsageThisWeek,

      // Decision/Risk stats
      totalDecisions,
      pendingDecisions,
      totalRisks,
      openRisks,

      // Blocked IPs
      blockedIPs,
    ] = await Promise.all([
      // Orgs by plan
      db.organization.groupBy({
        by: ['plan'],
        _count: true,
      }),
      db.organization.count(),

      // Users
      db.user.count(),

      // Projects
      db.project.count(),
      db.project.count({ where: { archived: false } }),

      // Updates
      db.update.count({ where: { createdAt: { gte: todayStart } } }),
      db.update.count({ where: { createdAt: { gte: weekStart } } }),
      db.update.count({ where: { createdAt: { gte: thirtyDaysAgo } } }),

      // Org usage
      db.usageLog.aggregate({
        where: {
          organizationId: user.organizationId,
          createdAt: { gte: todayStart },
        },
        _sum: { tokensUsed: true },
        _count: true,
      }),
      db.usageLog.aggregate({
        where: {
          organizationId: user.organizationId,
          createdAt: { gte: weekStart },
        },
        _sum: { tokensUsed: true },
        _count: true,
      }),

      // Decisions/Risks
      db.decision.count(),
      db.decision.count({ where: { status: 'PENDING' } }),
      db.risk.count(),
      db.risk.count({ where: { status: 'OPEN' } }),

      // Security
      rateLimiter.getBlockedIPs(100),
    ]);

    // Process blocked IPs
    const ipStats = blockedIPs.reduce((acc, item) => {
      if (!acc[item.ip]) {
        acc[item.ip] = {
          ip: item.ip,
          blockCount: 0,
          lastBlocked: item.timestamp,
          reasons: [] as string[],
        };
      }
      acc[item.ip].blockCount += 1;
      if (!acc[item.ip].reasons.includes(item.reason)) {
        acc[item.ip].reasons.push(item.reason);
      }
      if (new Date(item.timestamp) > new Date(acc[item.ip].lastBlocked)) {
        acc[item.ip].lastBlocked = item.timestamp;
      }
      return acc;
    }, {} as Record<string, { ip: string; blockCount: number; lastBlocked: string; reasons: string[] }>);

    const sortedIPStats = Object.values(ipStats)
      .sort((a, b) => b.blockCount - a.blockCount);

    // Build response
    const stats = {
      timestamp: now.toISOString(),

      // Organization overview (platform-wide)
      organizations: {
        total: totalOrgs,
        byPlan: Object.fromEntries(
          orgsByPlan.map(g => [g.plan, g._count])
        ),
      },

      // User stats
      users: {
        total: totalUsers,
      },

      // Project stats
      projects: {
        total: totalProjects,
        active: activeProjects,
        archived: totalProjects - activeProjects,
      },

      // Update generation stats
      updates: {
        today: updatesToday,
        thisWeek: updatesThisWeek,
        last30Days: updatesLast30Days,
      },

      // Organization-specific usage (for the requesting user's org)
      myOrganization: {
        id: user.organizationId,
        name: user.organization?.name,
        plan: user.organization?.plan,
        usage: {
          today: {
            generations: orgUsageToday._count,
            tokensUsed: orgUsageToday._sum.tokensUsed || 0,
          },
          thisWeek: {
            generations: orgUsageThisWeek._count,
            tokensUsed: orgUsageThisWeek._sum.tokensUsed || 0,
          },
        },
      },

      // Registers
      decisions: {
        total: totalDecisions,
        pending: pendingDecisions,
        resolved: totalDecisions - pendingDecisions,
      },
      risks: {
        total: totalRisks,
        open: openRisks,
        resolved: totalRisks - openRisks,
      },

      // Security monitoring
      security: {
        blockedRequests: {
          total: blockedIPs.length,
          uniqueIPs: sortedIPStats.length,
        },
        topOffenders: sortedIPStats.slice(0, 10),
        recentBlocks: blockedIPs.slice(0, 20),
      },
    };

    loggers.api.info({ userId: user.id }, 'Monitoring dashboard accessed');

    return NextResponse.json(stats);

  } catch (error) {
    logError(error, { endpoint: '/api/admin/monitoring' });
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
