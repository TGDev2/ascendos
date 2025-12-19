import * as Sentry from "@sentry/nextjs";

// Only initialize Sentry if DSN is configured
if (process.env.SENTRY_DSN) {
  Sentry.init({
    dsn: process.env.SENTRY_DSN,

    // Environment
    environment: process.env.NODE_ENV,

    // Performance Monitoring (lower sample rate for edge)
    tracesSampleRate: process.env.NODE_ENV === "production" ? 0.05 : 0.5,

    // Debug mode in development
    debug: process.env.NODE_ENV === "development",
  });
}
