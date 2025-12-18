import { Redis } from "@upstash/redis";
import type { Plan } from "@prisma/client";

export interface RateLimitResult {
  allowed: boolean;
  limit: number;
  remaining: number;
  resetAt?: Date;
}

export interface UsageResult {
  current: number;
  limit: number;
  resetAt?: Date;
}

/**
 * Rate Limiter Service avec Upstash Redis
 *
 * Limites:
 * - TRIAL: 5 générations totales (pour toute l'organisation, pendant le trial)
 * - TEAM: 10 générations/jour/utilisateur
 * - AGENCY: 50 générations/jour/utilisateur
 */
export class RateLimiter {
  private redis: Redis;

  constructor() {
    const url = process.env.UPSTASH_REDIS_REST_URL;
    const token = process.env.UPSTASH_REDIS_REST_TOKEN;

    if (!url || !token) {
      console.warn(
        "⚠️  Upstash Redis credentials not found. Rate limiting will fail open (allow all requests)."
      );
    }

    this.redis = new Redis({
      url: url || "",
      token: token || "",
    });
  }

  /**
   * Vérifie et incrémente le compteur de rate limit
   * Retourne allowed=false si la limite est atteinte
   */
  async checkAndIncrement(
    plan: Plan,
    organizationId: string,
    userId: string,
    trialEndsAt?: Date | null
  ): Promise<RateLimitResult> {
    try {
      // Vérifier si le trial est expiré (pour les orgs TRIAL)
      if (plan === "TRIAL" && trialEndsAt) {
        const now = new Date();
        if (now > new Date(trialEndsAt)) {
          return {
            allowed: false,
            limit: 5,
            remaining: 0,
            resetAt: undefined,
          };
        }
      }

      // Récupérer la config de limit en fonction du plan
      const { key, limit, ttl } = this.getLimitConfig(
        plan,
        organizationId,
        userId
      );

      // Incrémenter le compteur atomiquement
      const count = await this.redis.incr(key);

      // Si c'est la première incrémentation, définir le TTL
      if (count === 1 && ttl) {
        await this.redis.expire(key, ttl);
      }

      // Calculer le resetAt en fonction du TTL
      let resetAt: Date | undefined;
      if (ttl) {
        const ttlRemaining = await this.redis.ttl(key);
        if (ttlRemaining > 0) {
          resetAt = new Date(Date.now() + ttlRemaining * 1000);
        }
      }

      const allowed = count <= limit;
      const remaining = Math.max(0, limit - count);

      return {
        allowed,
        limit,
        remaining,
        resetAt,
      };
    } catch (error) {
      // En cas d'erreur Redis, fail open (allow request)
      console.error("❌ Rate limiter error:", error);
      return {
        allowed: true,
        limit: this.getPlanLimit(plan),
        remaining: 999,
      };
    }
  }

  /**
   * Récupère l'usage actuel sans incrémenter
   */
  async getUsage(
    plan: Plan,
    organizationId: string,
    userId: string
  ): Promise<UsageResult> {
    try {
      const { key, limit, ttl } = this.getLimitConfig(
        plan,
        organizationId,
        userId
      );

      const count = (await this.redis.get<number>(key)) || 0;

      let resetAt: Date | undefined;
      if (ttl) {
        const ttlRemaining = await this.redis.ttl(key);
        if (ttlRemaining > 0) {
          resetAt = new Date(Date.now() + ttlRemaining * 1000);
        }
      }

      return {
        current: count,
        limit,
        resetAt,
      };
    } catch (error) {
      console.error("❌ Error getting usage:", error);
      return {
        current: 0,
        limit: this.getPlanLimit(plan),
      };
    }
  }

  /**
   * Récupère la configuration de limite pour un plan
   */
  private getLimitConfig(
    plan: Plan,
    organizationId: string,
    userId: string
  ): { key: string; limit: number; ttl: number | null } {
    switch (plan) {
      case "TRIAL":
        // Trial: Total pour l'organisation (pas de TTL, on compte pour toute la durée du trial)
        return {
          key: `rate_limit:trial:${organizationId}:total`,
          limit: 5,
          ttl: null, // Pas de TTL, on reset manuellement après upgrade
        };

      case "TEAM":
        // Team: 10 générations/jour/utilisateur
        return {
          key: `rate_limit:team:${userId}:${this.getDateKey()}`,
          limit: 10,
          ttl: this.getSecondsUntilMidnightUTC(),
        };

      case "AGENCY":
        // Agency: 50 générations/jour/utilisateur
        return {
          key: `rate_limit:agency:${userId}:${this.getDateKey()}`,
          limit: 50,
          ttl: this.getSecondsUntilMidnightUTC(),
        };

      default:
        // Fallback sécurisé
        return {
          key: `rate_limit:unknown:${userId}:${this.getDateKey()}`,
          limit: 5,
          ttl: 86400, // 24h
        };
    }
  }

  /**
   * Retourne la limite du plan (helper)
   */
  private getPlanLimit(plan: Plan): number {
    switch (plan) {
      case "TRIAL":
        return 5;
      case "TEAM":
        return 10;
      case "AGENCY":
        return 50;
      default:
        return 5;
    }
  }

  /**
   * Retourne la clé de date UTC au format YYYY-MM-DD
   */
  private getDateKey(): string {
    const now = new Date();
    const year = now.getUTCFullYear();
    const month = String(now.getUTCMonth() + 1).padStart(2, "0");
    const day = String(now.getUTCDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }

  /**
   * Calcule le nombre de secondes jusqu'à minuit UTC
   * Pour définir le TTL des clés quotidiennes
   */
  private getSecondsUntilMidnightUTC(): number {
    const now = new Date();
    const midnight = new Date(
      Date.UTC(
        now.getUTCFullYear(),
        now.getUTCMonth(),
        now.getUTCDate() + 1,
        0,
        0,
        0,
        0
      )
    );
    return Math.floor((midnight.getTime() - now.getTime()) / 1000);
  }

  /**
   * Reset le compteur pour une organisation (utile après upgrade)
   */
  async resetOrganizationLimit(organizationId: string): Promise<void> {
    try {
      const key = `rate_limit:trial:${organizationId}:total`;
      await this.redis.del(key);
    } catch (error) {
      console.error("❌ Error resetting organization limit:", error);
    }
  }

  /**
   * Reset le compteur pour un utilisateur (utile pour testing)
   */
  async resetUserLimit(plan: Plan, userId: string): Promise<void> {
    try {
      const dateKey = this.getDateKey();
      const key = `rate_limit:${plan.toLowerCase()}:${userId}:${dateKey}`;
      await this.redis.del(key);
    } catch (error) {
      console.error("❌ Error resetting user limit:", error);
    }
  }
}

// Export singleton instance
export const rateLimiter = new RateLimiter();
