import type { NextConfig } from "next";
import { withSentryConfig } from "@sentry/nextjs";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  transpilePackages: [
    "@ascendos/database",
    "@ascendos/ai",
    "@ascendos/templates",
    "@ascendos/validators",
  ],
};

// Wrap with Sentry only if DSN is configured
const sentryConfig = process.env.SENTRY_DSN
  ? withSentryConfig(nextConfig, {
      // Sentry organization and project
      org: process.env.SENTRY_ORG,
      project: process.env.SENTRY_PROJECT,

      // Upload source maps during build
      sourcemaps: {
        disable: !process.env.SENTRY_AUTH_TOKEN,
      },

      // Suppresses source map uploading logs during build
      silent: !process.env.CI,

      // Automatically tree-shake Sentry logger statements
      disableLogger: true,

      // Hides source maps from generated client bundles
      hideSourceMaps: true,
    })
  : nextConfig;

export default sentryConfig;
