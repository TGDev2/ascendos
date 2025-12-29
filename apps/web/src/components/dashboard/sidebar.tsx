"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { usePaywall } from "@/hooks/use-paywall";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  LayoutDashboard,
  FolderKanban,
  Settings,
  Sparkles,
  Crown,
} from "lucide-react";

const navItems = [
  {
    title: "Projets",
    href: "/projects",
    icon: FolderKanban,
  },
  {
    title: "Paramètres",
    href: "/settings",
    icon: Settings,
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const { plan, quotas, trialDaysRemaining, isTrialExpired, isLoading } =
    usePaywall();

  return (
    <div className="flex h-full w-64 flex-col border-r bg-muted/10">
      {/* Logo */}
      <div className="flex h-16 items-center border-b px-6">
        <Link
          href="/projects"
          className="flex items-center gap-2 font-semibold"
        >
          <Sparkles className="h-5 w-5" />
          <span>Ascendos</span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 p-4">
        {navItems.map((item) => {
          const isActive = pathname?.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground",
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.title}
            </Link>
          );
        })}
      </nav>

      {/* Quota Indicator */}
      {!isLoading && (
        <div className="border-t p-4">
          <div className="space-y-3">
            {/* Plan Badge */}
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-muted-foreground">
                Plan
              </span>
              <Badge
                variant={plan === "TRIAL" ? "secondary" : "default"}
                className="text-xs"
              >
                {plan === "AGENCY" && <Crown className="mr-1 h-3 w-3" />}
                {plan || "TRIAL"}
              </Badge>
            </div>

            {/* Trial Days Remaining */}
            {plan === "TRIAL" && !isTrialExpired && trialDaysRemaining > 0 && (
              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Essai gratuit</span>
                  <span
                    className={cn(
                      "font-medium",
                      trialDaysRemaining <= 3
                        ? "text-orange-500"
                        : "text-muted-foreground",
                    )}
                  >
                    {trialDaysRemaining}j restants
                  </span>
                </div>
                <Progress
                  value={Math.max(0, (trialDaysRemaining / 14) * 100)}
                  className="h-1.5"
                />
              </div>
            )}

            {/* Trial Expired Warning */}
            {isTrialExpired && (
              <div className="rounded-md bg-destructive/10 p-2 text-center">
                <p className="text-xs font-medium text-destructive">
                  Essai expiré
                </p>
                <Link
                  href="/settings/billing"
                  className="text-xs text-primary hover:underline"
                >
                  Passer au plan Team
                </Link>
              </div>
            )}

            {/* Project Quota */}
            {quotas.maxProjects !== -1 && (
              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Projets</span>
                  <span
                    className={cn(
                      "font-medium",
                      quotas.isProjectLimitReached
                        ? "text-orange-500"
                        : "text-muted-foreground",
                    )}
                  >
                    {quotas.currentProjects}/{quotas.maxProjects}
                  </span>
                </div>
                <Progress
                  value={(quotas.currentProjects / quotas.maxProjects) * 100}
                  className={cn(
                    "h-1.5",
                    quotas.isProjectLimitReached && "[&>div]:bg-orange-500",
                  )}
                />
              </div>
            )}

            {/* Unlimited Projects Badge */}
            {quotas.maxProjects === -1 && (
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">Projets</span>
                <span className="font-medium text-green-600">Illimité</span>
              </div>
            )}

            {/* Upgrade CTA for TRIAL */}
            {plan === "TRIAL" && !isTrialExpired && (
              <Link
                href="/settings/billing"
                className="flex items-center justify-center gap-1 rounded-md bg-primary/10 px-3 py-2 text-xs font-medium text-primary transition-colors hover:bg-primary/20"
              >
                <Crown className="h-3 w-3" />
                Passer au plan Team
              </Link>
            )}
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="border-t p-4">
        <Link
          href="/generator"
          className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        >
          <LayoutDashboard className="h-4 w-4" />
          Générateur gratuit
        </Link>
      </div>
    </div>
  );
}
