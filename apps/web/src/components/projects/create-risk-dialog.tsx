"use client";

import { useForm } from "react-hook-form";
import { trpc } from "@/lib/trpc/react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface CreateRiskDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  projectId: string;
}

interface RiskFormData {
  description: string;
  impact: string;
  mitigation: string;
  severity: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  status: "OPEN" | "MONITORING" | "MITIGATED" | "RESOLVED" | "CANCELLED";
  tags: string;
}

export function CreateRiskDialog({
  open,
  onOpenChange,
  projectId,
}: CreateRiskDialogProps) {
  const utils = trpc.useUtils();

  const form = useForm<RiskFormData>({
    defaultValues: {
      description: "",
      impact: "",
      mitigation: "",
      severity: "MEDIUM",
      status: "OPEN",
      tags: "",
    },
  });

  const createRisk = trpc.risks.create.useMutation({
    onSuccess: () => {
      utils.risks.list.invalidate({ projectId });
      utils.projects.get.invalidate({ id: projectId });
      onOpenChange(false);
      form.reset();
    },
  });

  const onSubmit = (data: RiskFormData) => {
    const tags = data.tags
      .split(",")
      .map((tag) => tag.trim())
      .filter((tag) => tag.length > 0);

    createRisk.mutate({
      projectId,
      description: data.description,
      impact: data.impact,
      mitigation: data.mitigation || undefined,
      severity: data.severity,
      tags,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Nouveau risque</DialogTitle>
          <DialogDescription>
            Ajouter un risque à surveiller dans le projet
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              placeholder="Quel est le risque?"
              {...form.register("description", { required: true })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="impact">Impact *</Label>
            <Input
              id="impact"
              placeholder="Retard de 2 jours, bloquant, etc."
              {...form.register("impact", { required: true })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="mitigation">Plan de mitigation</Label>
            <Textarea
              id="mitigation"
              placeholder="Comment atténuer ce risque..."
              {...form.register("mitigation")}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="severity">Sévérité *</Label>
              <Select
                value={form.watch("severity")}
                onValueChange={(value) =>
                  form.setValue("severity", value as RiskFormData["severity"])
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="LOW">
                    <span className="flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-blue-600"></span>
                      Faible
                    </span>
                  </SelectItem>
                  <SelectItem value="MEDIUM">
                    <span className="flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-yellow-600"></span>
                      Moyen
                    </span>
                  </SelectItem>
                  <SelectItem value="HIGH">
                    <span className="flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-orange-600"></span>
                      Élevé
                    </span>
                  </SelectItem>
                  <SelectItem value="CRITICAL">
                    <span className="flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-red-600"></span>
                      Critique
                    </span>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select
                value={form.watch("status")}
                onValueChange={(value) =>
                  form.setValue("status", value as RiskFormData["status"])
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="OPEN">Ouvert</SelectItem>
                  <SelectItem value="MONITORING">Surveillance</SelectItem>
                  <SelectItem value="MITIGATED">Mitigé</SelectItem>
                  <SelectItem value="RESOLVED">Résolu</SelectItem>
                  <SelectItem value="CANCELLED">Annulé</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="tags">Tags</Label>
            <Input
              id="tags"
              placeholder="legal, tech, externe (séparés par virgule)"
              {...form.register("tags")}
            />
            <p className="text-xs text-muted-foreground">
              Séparez les tags par des virgules
            </p>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Annuler
            </Button>
            <Button type="submit" disabled={createRisk.isPending}>
              {createRisk.isPending ? "Création..." : "Créer"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
