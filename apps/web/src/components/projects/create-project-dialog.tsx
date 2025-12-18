"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { trpc } from "@/lib/trpc/react";
import { masterProfiles } from "@ascendos/templates";
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

interface CreateProjectDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface ProjectFormData {
  name: string;
  description: string;
  masterProfileId: string;
  objectives: string[];
  sponsorName: string;
  sponsorRole: string;
  sponsorEmail: string;
}

const objectiveOptions = [
  "rassurer",
  "validation",
  "COPIL",
  "arbitrage",
  "reporting",
];

export function CreateProjectDialog({ open, onOpenChange }: CreateProjectDialogProps) {
  const router = useRouter();
  const utils = trpc.useUtils();
  const [selectedObjectives, setSelectedObjectives] = useState<string[]>([]);

  const form = useForm<ProjectFormData>({
    defaultValues: {
      name: "",
      description: "",
      masterProfileId: "",
      objectives: [],
      sponsorName: "",
      sponsorRole: "",
      sponsorEmail: "",
    },
  });

  const createProject = trpc.projects.create.useMutation({
    onSuccess: (project) => {
      utils.projects.list.invalidate();
      onOpenChange(false);
      form.reset();
      setSelectedObjectives([]);
      router.push(`/projects/${project.id}`);
    },
  });

  const onSubmit = (data: ProjectFormData) => {
    createProject.mutate({
      ...data,
      objectives: selectedObjectives,
      sponsorEmail: data.sponsorEmail || undefined,
    });
  };

  const toggleObjective = (obj: string) => {
    setSelectedObjectives((prev) =>
      prev.includes(obj) ? prev.filter((o) => o !== obj) : [...prev, obj]
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Créer un nouveau projet</DialogTitle>
          <DialogDescription>
            Configurez votre projet pour commencer à générer des updates
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          {/* Name */}
          <div className="space-y-2">
            <Label htmlFor="name">Nom du projet *</Label>
            <Input
              id="name"
              {...form.register("name", { required: true })}
              placeholder="Ex: Refonte site e-commerce"
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              {...form.register("description")}
              placeholder="Décrivez brièvement le projet..."
              rows={3}
            />
          </div>

          {/* Master Profile */}
          <div className="space-y-2">
            <Label htmlFor="masterProfile">Profil Maître (Sponsor) *</Label>
            <Select
              onValueChange={(value) => form.setValue("masterProfileId", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Sélectionnez un profil" />
              </SelectTrigger>
              <SelectContent>
                {masterProfiles.map((profile) => (
                  <SelectItem key={profile.id} value={profile.id}>
                    <div className="flex flex-col">
                      <span className="font-medium">{profile.name}</span>
                      <span className="text-xs text-muted-foreground">
                        {profile.description}
                      </span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Objectives */}
          <div className="space-y-2">
            <Label>Objectifs de communication</Label>
            <div className="flex flex-wrap gap-2">
              {objectiveOptions.map((obj) => (
                <Button
                  key={obj}
                  type="button"
                  variant={selectedObjectives.includes(obj) ? "default" : "outline"}
                  size="sm"
                  onClick={() => toggleObjective(obj)}
                >
                  {obj}
                </Button>
              ))}
            </div>
          </div>

          {/* Sponsor Info */}
          <div className="space-y-4 rounded-lg border p-4">
            <h4 className="font-medium">Informations du sponsor</h4>

            <div className="space-y-2">
              <Label htmlFor="sponsorName">Nom du sponsor</Label>
              <Input
                id="sponsorName"
                {...form.register("sponsorName")}
                placeholder="Ex: Sophie Martin"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="sponsorRole">Rôle</Label>
              <Input
                id="sponsorRole"
                {...form.register("sponsorRole")}
                placeholder="Ex: Directrice Marketing"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="sponsorEmail">Email</Label>
              <Input
                id="sponsorEmail"
                type="email"
                {...form.register("sponsorEmail")}
                placeholder="sophie.martin@example.com"
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={createProject.isPending}
            >
              Annuler
            </Button>
            <Button type="submit" disabled={createProject.isPending}>
              {createProject.isPending ? "Création..." : "Créer le projet"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
