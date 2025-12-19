#!/usr/bin/env tsx

/**
 * Smoke Tests for Preview Deployments
 *
 * Tests critical endpoints to ensure:
 * 1. /api/generate works (free generator - main entry point for prospects)
 * 2. /api/trpc works (authenticated routes)
 * 3. No 500 errors or timeouts
 */

const DEPLOYMENT_URL = process.env.DEPLOYMENT_URL || 'http://localhost:3000';
const TIMEOUT_MS = 30000; // 30s max per test

interface TestResult {
  name: string;
  passed: boolean;
  error?: string;
  duration: number;
}

const results: TestResult[] = [];

async function fetchWithTimeout(url: string, options: RequestInit = {}, timeout = TIMEOUT_MS) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });
    clearTimeout(timeoutId);
    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    throw error;
  }
}

/**
 * Test 1: /api/generate endpoint (free generator - critical!)
 */
async function testGenerateEndpoint() {
  const start = Date.now();
  try {
    console.log('🧪 Testing /api/generate endpoint...');

    const response = await fetchWithTimeout(`${DEPLOYMENT_URL}/api/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        facts: [{ text: 'Smoke test fact' }],
        decisionsNeeded: [{ description: 'Test decision', deadline: '2024-12-31' }],
        risksInput: [{ description: 'Test risk', impact: 'medium' }],
        masterProfileSlug: 'executive',
        situationType: 'status-update',
      }),
    });

    const duration = Date.now() - start;

    // Check status code
    if (response.status === 500) {
      throw new Error(`500 Internal Server Error - ${await response.text()}`);
    }

    // For free generator, we accept 200 (success) or 429 (rate limit) or 400 (validation)
    if (![200, 400, 429].includes(response.status)) {
      throw new Error(`Unexpected status ${response.status}: ${await response.text()}`);
    }

    // Try to parse JSON
    const data = await response.json();

    console.log(`✅ /api/generate responded in ${duration}ms with status ${response.status}`);

    results.push({
      name: '/api/generate',
      passed: true,
      duration,
    });
  } catch (error) {
    const duration = Date.now() - start;
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error(`❌ /api/generate failed: ${errorMessage}`);

    results.push({
      name: '/api/generate',
      passed: false,
      error: errorMessage,
      duration,
    });
  }
}

/**
 * Test 2: /api/trpc endpoint health check
 */
async function testTRPCEndpoint() {
  const start = Date.now();
  try {
    console.log('🧪 Testing /api/trpc endpoint...');

    // Simple health check - call a public procedure if available, or check if endpoint responds
    const response = await fetchWithTimeout(`${DEPLOYMENT_URL}/api/trpc`, {
      method: 'GET',
    });

    const duration = Date.now() - start;

    // tRPC should respond (even if with 404 for missing procedure, but not 500)
    if (response.status === 500) {
      throw new Error(`500 Internal Server Error - ${await response.text()}`);
    }

    console.log(`✅ /api/trpc responded in ${duration}ms with status ${response.status}`);

    results.push({
      name: '/api/trpc',
      passed: true,
      duration,
    });
  } catch (error) {
    const duration = Date.now() - start;
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error(`❌ /api/trpc failed: ${errorMessage}`);

    results.push({
      name: '/api/trpc',
      passed: false,
      error: errorMessage,
      duration,
    });
  }
}

/**
 * Test 3: Homepage loads
 */
async function testHomepage() {
  const start = Date.now();
  try {
    console.log('🧪 Testing homepage...');

    const response = await fetchWithTimeout(`${DEPLOYMENT_URL}/`, {
      method: 'GET',
    });

    const duration = Date.now() - start;

    if (response.status === 500) {
      throw new Error(`500 Internal Server Error`);
    }

    if (!response.ok) {
      throw new Error(`Status ${response.status}`);
    }

    console.log(`✅ Homepage responded in ${duration}ms`);

    results.push({
      name: 'Homepage',
      passed: true,
      duration,
    });
  } catch (error) {
    const duration = Date.now() - start;
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error(`❌ Homepage failed: ${errorMessage}`);

    results.push({
      name: 'Homepage',
      passed: false,
      error: errorMessage,
      duration,
    });
  }
}

/**
 * Main test runner
 */
async function runSmokeTests() {
  console.log(`\n🔥 Running smoke tests on: ${DEPLOYMENT_URL}\n`);

  await testHomepage();
  await testGenerateEndpoint();
  await testTRPCEndpoint();

  console.log('\n📊 Test Results:\n');
  console.table(results);

  const passed = results.filter(r => r.passed).length;
  const failed = results.filter(r => !r.passed).length;

  console.log(`\n✅ Passed: ${passed}`);
  console.log(`❌ Failed: ${failed}\n`);

  if (failed > 0) {
    console.error('❌ Smoke tests failed!\n');
    console.error('Failed tests:');
    results.filter(r => !r.passed).forEach(r => {
      console.error(`  - ${r.name}: ${r.error}`);
    });
    process.exit(1);
  }

  console.log('✅ All smoke tests passed!\n');
  process.exit(0);
}

// Run tests
runSmokeTests().catch(error => {
  console.error('Fatal error running smoke tests:', error);
  process.exit(1);
});
