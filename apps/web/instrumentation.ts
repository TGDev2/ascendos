/**
 * Next.js Instrumentation Hook
 *
 * This file is automatically loaded by Next.js and allows us to
 * register hooks that run at startup.
 *
 * Used for:
 * - Sentry initialization (server-side)
 * - OpenTelemetry setup (future)
 * - Database connection pooling (future)
 */

export async function register() {
  // Server-side Sentry initialization
  if (process.env.NEXT_RUNTIME === "nodejs") {
    await import("./sentry.server.config");
  }

  // Edge runtime Sentry initialization
  if (process.env.NEXT_RUNTIME === "edge") {
    await import("./sentry.edge.config");
  }
}

/**
 * Error handler for instrumentation
 * Called when an error occurs during the instrumentation process
 */
export function onRequestError(
  error: unknown,
  request: {
    path: string;
    method: string;
    headers: Record<string, string>;
  },
  context: {
    routerKind: "Pages Router" | "App Router";
    routePath: string;
    routeType: "render" | "route" | "action" | "middleware";
    revalidateReason: "on-demand" | "stale" | undefined;
  }
) {
  // Only import Sentry if configured
  if (process.env.SENTRY_DSN) {
    import("@sentry/nextjs").then(({ captureException }) => {
      captureException(error, {
        extra: {
          path: request.path,
          method: request.method,
          routerKind: context.routerKind,
          routePath: context.routePath,
          routeType: context.routeType,
        },
      });
    });
  }
}
