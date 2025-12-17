"use client";

import { getAllSituationTemplates, SituationType } from "@ascendos/templates";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

interface SituationTypeSelectorProps {
  value?: SituationType;
  onValueChange: (value: SituationType) => void;
}

export function SituationTypeSelector({ value, onValueChange }: SituationTypeSelectorProps) {
  const situations = getAllSituationTemplates();

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-medium">Type de situation</h3>
        <p className="text-sm text-muted-foreground">
          Sélectionnez le contexte de cette semaine
        </p>
      </div>

      <RadioGroup
        value={value}
        onValueChange={(v) => onValueChange(v as SituationType)}
        className="grid gap-3"
      >
        {situations.map((situation) => (
          <div
            key={situation.type}
            className="flex items-start space-x-3 space-y-0 rounded-md border p-4 hover:bg-accent"
          >
            <RadioGroupItem value={situation.type} id={situation.type} />
            <div className="flex-1 space-y-1">
              <Label
                htmlFor={situation.type}
                className="cursor-pointer font-medium leading-none"
              >
                {situation.name}
              </Label>
              <p className="text-sm text-muted-foreground">
                {situation.description}
              </p>
            </div>
          </div>
        ))}
      </RadioGroup>
    </div>
  );
}
