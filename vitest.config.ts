import { defineConfig } from "vitest/config";
import path from "path";

export default defineConfig({
  test: {
    // Global test settings
    globals: true,
    environment: "node",

    // Test file patterns
    include: ["**/*.{test,spec}.{ts,tsx}"],
    exclude: ["**/node_modules/**", "**/dist/**", "**/.next/**"],

    // Coverage configuration
    coverage: {
      provider: "v8",
      reporter: ["text", "html", "lcov"],
      reportsDirectory: "./coverage",
      // Minimum coverage thresholds
      thresholds: {
        statements: 40,
        branches: 40,
        functions: 40,
        lines: 40,
      },
      // Files to include in coverage
      include: [
        "packages/*/src/**/*.ts",
        "apps/web/src/lib/**/*.ts",
        "apps/web/src/server/**/*.ts",
      ],
      // Files to exclude from coverage
      exclude: [
        "**/*.d.ts",
        "**/*.test.ts",
        "**/*.spec.ts",
        "**/node_modules/**",
        "**/index.ts", // Re-exports
      ],
    },

    // Timeout for async tests (10 seconds)
    testTimeout: 10000,

    // Setup files to run before tests
    setupFiles: ["./vitest.setup.ts"],
  },

  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./apps/web/src"),
      "@ascendos/database": path.resolve(__dirname, "./packages/database/src"),
      "@ascendos/ai": path.resolve(__dirname, "./packages/ai/src"),
      "@ascendos/templates": path.resolve(__dirname, "./packages/templates/src"),
      "@ascendos/validators": path.resolve(__dirname, "./packages/validators/src"),
    },
  },
});
