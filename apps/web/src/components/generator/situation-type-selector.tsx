"use client";

import { getAllSituationTemplates, SituationType } from "@ascendos/templates";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import {
  Calendar,
  CheckSquare,
  AlertTriangle,
  Clock,
  Scale,
  BarChart3,
} from "lucide-react";

interface SituationTypeSelectorProps {
  value?: SituationType;
  onValueChange: (value: SituationType) => void;
}

const situationIcons: Record<SituationType, React.ReactNode> = {
  [SituationType.NORMAL]: <Calendar className="h-4 w-4" />,
  [SituationType.VALIDATION]: <CheckSquare className="h-4 w-4" />,
  [SituationType.RISK]: <AlertTriangle className="h-4 w-4" />,
  [SituationType.DELAY]: <Clock className="h-4 w-4" />,
  [SituationType.ARBITRAGE]: <Scale className="h-4 w-4" />,
  [SituationType.PRE_COPIL]: <BarChart3 className="h-4 w-4" />,
};

export function SituationTypeSelector({
  value,
  onValueChange,
}: SituationTypeSelectorProps) {
  const situations = getAllSituationTemplates();

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base">Type de situation</CardTitle>
        <CardDescription className="text-xs">
          Contexte de cette semaine
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-2">
          {situations.map((situation) => (
            <button
              key={situation.type}
              type="button"
              className={cn(
                "flex items-center gap-2 rounded-lg border p-3 text-left transition-all hover:bg-accent",
                value === situation.type &&
                  "border-primary bg-primary/5 ring-1 ring-primary"
              )}
              onClick={() => onValueChange(situation.type)}
            >
              <div
                className={cn(
                  "flex h-8 w-8 shrink-0 items-center justify-center rounded-md",
                  value === situation.type
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground"
                )}
              >
                {situationIcons[situation.type]}
              </div>
              <div className="min-w-0">
                <span className="block truncate text-sm font-medium">
                  {situation.name}
                </span>
              </div>
            </button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
