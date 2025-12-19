import * as Sentry from "@sentry/nextjs";

// Only initialize Sentry if DSN is configured
if (process.env.NEXT_PUBLIC_SENTRY_DSN) {
  Sentry.init({
    dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,

    // Environment
    environment: process.env.NODE_ENV,

    // Performance Monitoring
    tracesSampleRate: process.env.NODE_ENV === "production" ? 0.1 : 1.0,

    // Session Replay (only in production)
    replaysSessionSampleRate: 0.1,
    replaysOnErrorSampleRate: 1.0,

    // Debug mode in development
    debug: process.env.NODE_ENV === "development",

    // Filter out noisy errors
    ignoreErrors: [
      // Network errors that users see
      "Failed to fetch",
      "NetworkError",
      "Load failed",
      // Browser extensions
      "chrome-extension://",
      // React hydration errors (common, usually harmless)
      "Hydration failed",
      "There was an error while hydrating",
    ],

    // PII scrubbing
    beforeSend(event: Sentry.ErrorEvent) {
      // Scrub potentially sensitive data
      if (event.request?.headers) {
        delete event.request.headers["authorization"];
        delete event.request.headers["cookie"];
      }
      return event;
    },

    integrations: [
      Sentry.replayIntegration({
        // Mask all text content for privacy
        maskAllText: true,
        // Block all media for performance
        blockAllMedia: true,
      }),
    ],
  });
}
