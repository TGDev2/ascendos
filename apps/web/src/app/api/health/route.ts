import { NextResponse } from "next/server";
import { db } from "@ascendos/database";
import { Redis } from "@upstash/redis";

export const runtime = "nodejs";

interface HealthCheckResult {
  status: "healthy" | "degraded" | "unhealthy";
  timestamp: string;
  version: string;
  checks: {
    database: CheckResult;
    redis: CheckResult;
    environment: CheckResult;
  };
}

interface CheckResult {
  status: "pass" | "fail" | "warn";
  message: string;
  latencyMs?: number;
}

/**
 * Health check endpoint for monitoring and deployment verification
 *
 * Returns:
 * - 200: All services healthy
 * - 503: One or more critical services unhealthy
 * - 500: Health check itself failed
 */
export async function GET() {
  const checks: HealthCheckResult["checks"] = {
    database: { status: "fail", message: "Not checked" },
    redis: { status: "fail", message: "Not checked" },
    environment: { status: "fail", message: "Not checked" },
  };

  // Check 1: Database connectivity
  const dbStart = Date.now();
  try {
    // Simple query to verify database is reachable
    await db.$queryRaw`SELECT 1`;
    checks.database = {
      status: "pass",
      message: "Database connection successful",
      latencyMs: Date.now() - dbStart,
    };
  } catch (error) {
    checks.database = {
      status: "fail",
      message: `Database connection failed: ${error instanceof Error ? error.message : "Unknown error"}`,
      latencyMs: Date.now() - dbStart,
    };
  }

  // Check 2: Redis connectivity (for rate limiting)
  const redisStart = Date.now();
  try {
    const redisUrl = process.env.UPSTASH_REDIS_REST_URL;
    const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN;

    if (!redisUrl || !redisToken) {
      checks.redis = {
        status: "warn",
        message: "Redis not configured (UPSTASH_REDIS_REST_URL/TOKEN missing) - rate limiting disabled",
        latencyMs: 0,
      };
    } else {
      const redis = new Redis({
        url: redisUrl,
        token: redisToken,
      });

      // Simple ping to verify Redis is reachable
      await redis.ping();
      checks.redis = {
        status: "pass",
        message: "Redis connection successful",
        latencyMs: Date.now() - redisStart,
      };
    }
  } catch (error) {
    checks.redis = {
      status: "fail",
      message: `Redis connection failed: ${error instanceof Error ? error.message : "Unknown error"}`,
      latencyMs: Date.now() - redisStart,
    };
  }

  // Check 3: Required environment variables
  const requiredEnvVars = [
    "DATABASE_URL",
    "NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY",
    "CLERK_SECRET_KEY",
    "OPENAI_API_KEY",
  ];

  const optionalEnvVars = [
    "STRIPE_SECRET_KEY",
    "STRIPE_WEBHOOK_SECRET",
    "UPSTASH_REDIS_REST_URL",
    "UPSTASH_REDIS_REST_TOKEN",
    "RESEND_API_KEY",
    "CRON_SECRET",
    "ANTHROPIC_API_KEY",
    "SENTRY_DSN",
  ];

  const missingRequired = requiredEnvVars.filter((v) => !process.env[v]);
  const missingOptional = optionalEnvVars.filter((v) => !process.env[v]);

  if (missingRequired.length > 0) {
    checks.environment = {
      status: "fail",
      message: `Missing required env vars: ${missingRequired.join(", ")}`,
    };
  } else if (missingOptional.length > 0) {
    checks.environment = {
      status: "warn",
      message: `Missing optional env vars: ${missingOptional.join(", ")}`,
    };
  } else {
    checks.environment = {
      status: "pass",
      message: "All environment variables configured",
    };
  }

  // Determine overall health status
  const hasFailure = Object.values(checks).some((c) => c.status === "fail");
  const hasWarning = Object.values(checks).some((c) => c.status === "warn");

  let overallStatus: HealthCheckResult["status"];
  if (hasFailure) {
    overallStatus = "unhealthy";
  } else if (hasWarning) {
    overallStatus = "degraded";
  } else {
    overallStatus = "healthy";
  }

  const result: HealthCheckResult = {
    status: overallStatus,
    timestamp: new Date().toISOString(),
    version: process.env.VERCEL_GIT_COMMIT_SHA?.substring(0, 7) || "dev",
    checks,
  };

  // Return appropriate HTTP status code
  const httpStatus = overallStatus === "unhealthy" ? 503 : 200;

  return NextResponse.json(result, { status: httpStatus });
}
