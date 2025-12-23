"use client";

import { getAllMasterProfiles } from "@ascendos/templates";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { User, Users, Shield } from "lucide-react";

interface MasterProfileSelectorProps {
  value?: string;
  onValueChange: (value: string) => void;
}

const profileIcons: Record<string, React.ReactNode> = {
  "non-tech-confiant": <User className="h-4 w-4" />,
  "micro-manager": <Users className="h-4 w-4" />,
  "comite-risque-averse": <Shield className="h-4 w-4" />,
};

export function MasterProfileSelector({
  value,
  onValueChange,
}: MasterProfileSelectorProps) {
  const profiles = getAllMasterProfiles();

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base">Profil de votre sponsor</CardTitle>
        <CardDescription className="text-xs">
          Adaptez le ton et le niveau de détail
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-2">
        {profiles.map((profile) => (
          <button
            key={profile.slug}
            type="button"
            className={cn(
              "flex w-full items-start gap-3 rounded-lg border p-3 text-left transition-all hover:bg-accent",
              value === profile.slug &&
                "border-primary bg-primary/5 ring-1 ring-primary"
            )}
            onClick={() => onValueChange(profile.slug)}
          >
            <div
              className={cn(
                "mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-md",
                value === profile.slug
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground"
              )}
            >
              {profileIcons[profile.slug] || <User className="h-4 w-4" />}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <span className="font-medium text-sm">{profile.name}</span>
                {value === profile.slug && (
                  <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                    Sélectionné
                  </span>
                )}
              </div>
              <p className="mt-0.5 text-xs text-muted-foreground line-clamp-2">
                {profile.description}
              </p>
            </div>
          </button>
        ))}
      </CardContent>
    </Card>
  );
}
