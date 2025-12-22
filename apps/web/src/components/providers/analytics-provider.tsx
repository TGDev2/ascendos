"use client";

import { useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { initAnalytics, identifyUser, resetAnalytics } from "@/lib/analytics";

/**
 * Analytics Provider
 *
 * Initializes PostHog and identifies the user when they log in.
 * Place this component in your app layout.
 */
export function AnalyticsProvider({ children }: { children: React.ReactNode }) {
  const { user, isLoaded, isSignedIn } = useUser();

  useEffect(() => {
    // Initialize PostHog on mount
    initAnalytics();
  }, []);

  useEffect(() => {
    if (!isLoaded) return;

    if (isSignedIn && user) {
      // Identify the user when they sign in
      identifyUser(user.id, {
        email: user.primaryEmailAddress?.emailAddress,
        name: user.fullName || undefined,
        // Note: organization info would need to be fetched separately
        // or passed via a prop/context
      });
    } else {
      // Reset analytics when user signs out
      resetAnalytics();
    }
  }, [isLoaded, isSignedIn, user]);

  return <>{children}</>;
}
