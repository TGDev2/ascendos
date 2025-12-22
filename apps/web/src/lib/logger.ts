import pino from "pino";

/**
 * Structured Logger for Ascendos
 *
 * Features:
 * - JSON structured logs in production (for log aggregation)
 * - Pretty printed logs in development
 * - Automatic context enrichment (request ID, user ID, etc.)
 * - Log levels: trace, debug, info, warn, error, fatal
 *
 * Usage:
 * ```ts
 * import { logger, createRequestLogger } from "@/lib/logger";
 *
 * // Basic logging
 * logger.info("User created", { userId: "123" });
 *
 * // Request-scoped logging
 * const reqLogger = createRequestLogger(requestId, userId);
 * reqLogger.info("Processing request");
 * ```
 */

const isDevelopment = process.env.NODE_ENV === "development";

// Base logger configuration
const baseConfig: pino.LoggerOptions = {
  level: process.env.LOG_LEVEL || (isDevelopment ? "debug" : "info"),
  // Redact sensitive fields
  redact: {
    paths: [
      "password",
      "token",
      "apiKey",
      "api_key",
      "authorization",
      "cookie",
      "email",
      "*.password",
      "*.token",
      "*.apiKey",
      "*.api_key",
      "headers.authorization",
      "headers.cookie",
    ],
    censor: "[REDACTED]",
  },
  // Add base context
  base: {
    service: "ascendos-web",
    version: process.env.VERCEL_GIT_COMMIT_SHA?.substring(0, 7) || "dev",
    env: process.env.NODE_ENV || "development",
  },
  // Timestamp format
  timestamp: pino.stdTimeFunctions.isoTime,
  // Format error objects properly
  formatters: {
    level: (label) => ({ level: label }),
    bindings: (bindings) => ({
      pid: bindings.pid,
      hostname: bindings.hostname,
    }),
  },
};

// Create the base logger
// In development, use pino-pretty for readable output
// In production, output raw JSON for log aggregation services
export const logger = isDevelopment
  ? pino({
      ...baseConfig,
      transport: {
        target: "pino-pretty",
        options: {
          colorize: true,
          translateTime: "HH:MM:ss",
          ignore: "pid,hostname,service,version,env",
        },
      },
    })
  : pino(baseConfig);

/**
 * Create a child logger with request context
 * Use this for request-scoped logging to correlate all logs from a single request
 */
export function createRequestLogger(
  requestId: string,
  userId?: string,
  organizationId?: string
): pino.Logger {
  return logger.child({
    requestId,
    ...(userId && { userId }),
    ...(organizationId && { organizationId }),
  });
}

/**
 * Create a child logger for a specific component/module
 * Use this to add context about where the log is coming from
 */
export function createModuleLogger(moduleName: string): pino.Logger {
  return logger.child({ module: moduleName });
}

/**
 * Log an API request (for middleware/route handlers)
 */
export function logApiRequest(
  method: string,
  path: string,
  statusCode: number,
  durationMs: number,
  extra?: Record<string, unknown>
): void {
  const logData = {
    method,
    path,
    statusCode,
    durationMs,
    ...extra,
  };

  if (statusCode >= 500) {
    logger.error(logData, "API request failed");
  } else if (statusCode >= 400) {
    logger.warn(logData, "API request client error");
  } else {
    logger.info(logData, "API request completed");
  }
}

/**
 * Log an error with stack trace and context
 */
export function logError(
  error: Error | unknown,
  context?: Record<string, unknown>
): void {
  if (error instanceof Error) {
    logger.error(
      {
        err: {
          message: error.message,
          name: error.name,
          stack: error.stack,
        },
        ...context,
      },
      error.message
    );
  } else {
    logger.error({ err: error, ...context }, "Unknown error occurred");
  }
}

/**
 * Log a business event (for analytics/audit purposes)
 */
export function logBusinessEvent(
  eventName: string,
  data: Record<string, unknown>
): void {
  logger.info(
    {
      event: eventName,
      eventType: "business",
      ...data,
    },
    `Business event: ${eventName}`
  );
}

/**
 * Log a security event (for audit/security monitoring)
 */
export function logSecurityEvent(
  eventName: string,
  data: Record<string, unknown>
): void {
  logger.warn(
    {
      event: eventName,
      eventType: "security",
      ...data,
    },
    `Security event: ${eventName}`
  );
}

// Pre-configured module loggers for common use cases
export const loggers = {
  api: createModuleLogger("api"),
  auth: createModuleLogger("auth"),
  billing: createModuleLogger("billing"),
  ai: createModuleLogger("ai"),
  cron: createModuleLogger("cron"),
  webhook: createModuleLogger("webhook"),
};
