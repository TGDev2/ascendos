"use client";

import { getAllMasterProfiles } from "@ascendos/templates";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface MasterProfileSelectorProps {
  value?: string;
  onValueChange: (value: string) => void;
}

export function MasterProfileSelector({ value, onValueChange }: MasterProfileSelectorProps) {
  const profiles = getAllMasterProfiles();

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-medium">Profil de votre sponsor</h3>
        <p className="text-sm text-muted-foreground">
          Sélectionnez le profil qui correspond le mieux à votre sponsor
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {profiles.map((profile) => (
          <Card
            key={profile.slug}
            className={cn(
              "cursor-pointer transition-all hover:border-primary",
              value === profile.slug && "border-primary ring-2 ring-primary ring-offset-2"
            )}
            onClick={() => onValueChange(profile.slug)}
          >
            <CardHeader>
              <CardTitle className="text-base">{profile.name}</CardTitle>
              <CardDescription className="line-clamp-2">
                {profile.description}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-xs text-muted-foreground">
                <div>
                  <span className="font-medium">Ton:</span> {profile.tone}
                </div>
                <div>
                  <span className="font-medium">Contraintes:</span>
                  <ul className="mt-1 list-inside list-disc space-y-0.5">
                    {profile.constraints.slice(0, 2).map((constraint, i) => (
                      <li key={i}>{constraint}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
