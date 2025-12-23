/**
 * Vitest global setup file
 * This file runs before all tests
 */

// Mock environment variables for tests
process.env.NODE_ENV = "test";
process.env.DATABASE_URL = "postgresql://test:test@localhost:5432/test";
process.env.OPENAI_API_KEY = "sk-test-key";
process.env.CRON_SECRET = "test-cron-secret";

// Suppress console output during tests (optional)
// Uncomment if you want cleaner test output
// console.log = () => {};
// console.warn = () => {};
// console.error = () => {};
