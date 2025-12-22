import posthog from "posthog-js";

/**
 * PostHog Analytics for Ascendos
 *
 * Key events tracked:
 * - generation_started: User starts generating an update
 * - generation_completed: Update successfully generated
 * - update_copied: User copies generated content
 * - update_sent: User marks update as sent
 * - project_created: New project created
 * - decision_created: Decision added to register
 * - risk_created: Risk added to register
 * - dossier_exported: Continuity dossier exported
 * - subscription_started: User subscribes to a plan
 * - subscription_cancelled: User cancels subscription
 *
 * User properties:
 * - plan: TRIAL | TEAM | AGENCY
 * - organization_id
 * - projects_count
 */

const POSTHOG_KEY = process.env.NEXT_PUBLIC_POSTHOG_KEY;
const POSTHOG_HOST = process.env.NEXT_PUBLIC_POSTHOG_HOST || "https://eu.i.posthog.com";

let initialized = false;

/**
 * Initialize PostHog client-side analytics
 * Call this once in your app layout or provider
 */
export function initAnalytics(): void {
  if (typeof window === "undefined") return;
  if (initialized) return;
  if (!POSTHOG_KEY) {
    console.debug("[Analytics] PostHog key not configured, analytics disabled");
    return;
  }

  posthog.init(POSTHOG_KEY, {
    api_host: POSTHOG_HOST,
    // Respect Do Not Track
    respect_dnt: true,
    // Capture pageviews automatically
    capture_pageview: true,
    // Capture pageleaves for session duration
    capture_pageleave: true,
    // Disable autocapture for now (too noisy)
    autocapture: false,
    // Mask all text in session recordings for privacy
    session_recording: {
      maskAllInputs: true,
      maskTextSelector: "*",
    },
    // Disable in development
    loaded: (ph) => {
      if (process.env.NODE_ENV === "development") {
        ph.opt_out_capturing();
      }
    },
  });

  initialized = true;
}

/**
 * Identify the current user (call after login)
 */
export function identifyUser(
  userId: string,
  properties?: {
    email?: string;
    name?: string;
    organizationId?: string;
    organizationName?: string;
    plan?: string;
    role?: string;
  }
): void {
  if (!initialized || !POSTHOG_KEY) return;

  posthog.identify(userId, {
    ...properties,
    identified_at: new Date().toISOString(),
  });

  // Also set group for organization analytics
  if (properties?.organizationId) {
    posthog.group("organization", properties.organizationId, {
      name: properties.organizationName,
      plan: properties.plan,
    });
  }
}

/**
 * Reset user identity (call on logout)
 */
export function resetAnalytics(): void {
  if (!initialized || !POSTHOG_KEY) return;
  posthog.reset();
}

/**
 * Track a custom event
 */
export function trackEvent(
  eventName: string,
  properties?: Record<string, unknown>
): void {
  if (!initialized || !POSTHOG_KEY) return;

  posthog.capture(eventName, {
    ...properties,
    timestamp: new Date().toISOString(),
  });
}

// Pre-defined event helpers for type safety and consistency

export const analytics = {
  // Generation events
  generationStarted: (data: {
    masterProfile: string;
    situationType: string;
    factsCount: number;
    decisionsCount: number;
    risksCount: number;
  }) => trackEvent("generation_started", data),

  generationCompleted: (data: {
    masterProfile: string;
    situationType: string;
    tokensUsed: number;
    generationTimeMs: number;
  }) => trackEvent("generation_completed", data),

  generationFailed: (data: {
    error: string;
    masterProfile: string;
    situationType: string;
  }) => trackEvent("generation_failed", data),

  // Update events
  updateCopied: (data: { updateId: string; contentType: "email" | "slack" }) =>
    trackEvent("update_copied", data),

  updateSent: (data: { updateId: string; projectId: string }) =>
    trackEvent("update_sent", data),

  // Project events
  projectCreated: (data: { projectId: string; hasDescription: boolean }) =>
    trackEvent("project_created", data),

  projectArchived: (data: { projectId: string }) =>
    trackEvent("project_archived", data),

  // Register events
  decisionCreated: (data: {
    projectId: string;
    status: string;
    fromExtraction: boolean;
  }) => trackEvent("decision_created", data),

  riskCreated: (data: {
    projectId: string;
    severity: string;
    fromExtraction: boolean;
  }) => trackEvent("risk_created", data),

  // Export events
  dossierExported: (data: {
    projectId: string;
    format: "html" | "pdf";
    decisionsCount: number;
    risksCount: number;
  }) => trackEvent("dossier_exported", data),

  // Subscription events
  subscriptionStarted: (data: { plan: string; fromTrial: boolean }) =>
    trackEvent("subscription_started", data),

  subscriptionUpgraded: (data: { fromPlan: string; toPlan: string }) =>
    trackEvent("subscription_upgraded", data),

  subscriptionCancelled: (data: { plan: string; reason?: string }) =>
    trackEvent("subscription_cancelled", data),

  // Feature usage
  searchPerformed: (data: { query: string; resultsCount: number }) =>
    trackEvent("search_performed", { ...data, queryLength: data.query.length }),

  masterProfileChanged: (data: { projectId: string; newProfile: string }) =>
    trackEvent("master_profile_changed", data),

  // Onboarding
  signupCompleted: (data: { method: "email" | "google" | "github" }) =>
    trackEvent("signup_completed", data),

  onboardingStepCompleted: (data: { step: string; stepNumber: number }) =>
    trackEvent("onboarding_step_completed", data),
};

export default posthog;
