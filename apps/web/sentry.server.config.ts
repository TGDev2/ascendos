import * as Sentry from "@sentry/nextjs";

// Only initialize Sentry if DSN is configured
if (process.env.SENTRY_DSN) {
  Sentry.init({
    dsn: process.env.SENTRY_DSN,

    // Environment
    environment: process.env.NODE_ENV,

    // Performance Monitoring
    tracesSampleRate: process.env.NODE_ENV === "production" ? 0.1 : 1.0,

    // Debug mode in development
    debug: process.env.NODE_ENV === "development",

    // Filter out noisy errors
    ignoreErrors: [
      // Expected errors that don't need tracking
      "NEXT_NOT_FOUND",
      "NEXT_REDIRECT",
    ],

    // PII scrubbing
    beforeSend(event: Sentry.ErrorEvent) {
      // Scrub potentially sensitive data from server errors
      if (event.request?.headers) {
        delete event.request.headers["authorization"];
        delete event.request.headers["cookie"];
        delete event.request.headers["x-clerk-auth-token"];
      }

      // Scrub sensitive data from breadcrumbs
      if (event.breadcrumbs) {
        event.breadcrumbs = event.breadcrumbs.map((breadcrumb: Sentry.Breadcrumb) => {
          if (breadcrumb.data?.url) {
            // Remove query params that might contain sensitive data
            try {
              const url = new URL(breadcrumb.data.url);
              url.searchParams.forEach((_, key) => {
                if (["token", "key", "secret", "password"].some((s) => key.toLowerCase().includes(s))) {
                  url.searchParams.set(key, "[FILTERED]");
                }
              });
              breadcrumb.data.url = url.toString();
            } catch {
              // Not a valid URL, skip
            }
          }
          return breadcrumb;
        });
      }

      return event;
    },
  });
}
