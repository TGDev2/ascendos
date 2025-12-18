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

interface CreateDecisionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  projectId: string;
}

interface DecisionFormData {
  description: string;
  context: string;
  decidedBy: string;
  tags: string;
  status: "PENDING" | "DECIDED" | "CANCELLED";
}

export function CreateDecisionDialog({
  open,
  onOpenChange,
  projectId,
}: CreateDecisionDialogProps) {
  const utils = trpc.useUtils();

  const form = useForm<DecisionFormData>({
    defaultValues: {
      description: "",
      context: "",
      decidedBy: "",
      tags: "",
      status: "PENDING",
    },
  });

  const createDecision = trpc.decisions.create.useMutation({
    onSuccess: () => {
      utils.decisions.list.invalidate({ projectId });
      utils.projects.get.invalidate({ id: projectId });
      onOpenChange(false);
      form.reset();
    },
  });

  const onSubmit = (data: DecisionFormData) => {
    const tags = data.tags
      .split(",")
      .map((tag) => tag.trim())
      .filter((tag) => tag.length > 0);

    createDecision.mutate({
      projectId,
      description: data.description,
      context: data.context || undefined,
      decidedBy: data.decidedBy || undefined,
      tags,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Nouvelle décision</DialogTitle>
          <DialogDescription>
            Ajouter une décision à suivre dans le projet
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              placeholder="Quelle décision doit être prise?"
              {...form.register("description", { required: true })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="context">Contexte</Label>
            <Textarea
              id="context"
              placeholder="Pourquoi cette décision est importante..."
              {...form.register("context")}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="decidedBy">Décideur</Label>
              <Input
                id="decidedBy"
                placeholder="Sophie (sponsor)"
                {...form.register("decidedBy")}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select
                value={form.watch("status")}
                onValueChange={(value) =>
                  form.setValue("status", value as DecisionFormData["status"])
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="PENDING">En attente</SelectItem>
                  <SelectItem value="DECIDED">Décidée</SelectItem>
                  <SelectItem value="CANCELLED">Annulée</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="tags">Tags</Label>
            <Input
              id="tags"
              placeholder="scope, tech, budget (séparés par virgule)"
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
            <Button type="submit" disabled={createDecision.isPending}>
              {createDecision.isPending ? "Création..." : "Créer"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
