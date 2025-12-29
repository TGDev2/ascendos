"use client";

import { ReactNode } from "react";
import { ReadOnlyBanner } from "@/components/read-only-banner";

interface DashboardShellProps {
  children: ReactNode;
}

/**
 * Shell wrapper pour le dashboard qui inclut:
 * - La bannière de mode lecture seule (si applicable)
 * - Le contenu du dashboard
 */
export function DashboardShell({ children }: DashboardShellProps) {
  return (
    <>
      <ReadOnlyBanner />
      {children}
    </>
  );
}
