"use client";

import { use, useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { trpc } from "@/lib/trpc/react";
import { masterProfiles } from "@ascendos/templates";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { ArrowLeft, Check, Loader2, Trash2 } from "lucide-react";

interface ProjectSettingsPageProps {
  params: Promise<{ id: string }>;
}

interface ProjectFormData {
  name: string;
  description: string;
  masterProfileId: string;
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

export default function ProjectSettingsPage({
  params,
}: ProjectSettingsPageProps) {
  const { id } = use(params);
  const router = useRouter();
  const utils = trpc.useUtils();
  const [saved, setSaved] = useState(false);
  const [selectedObjectives, setSelectedObjectives] = useState<string[]>([]);

  const { data: project, isLoading } = trpc.projects.get.useQuery({ id });

  const form = useForm<ProjectFormData>({
    defaultValues: {
      name: "",
      description: "",
      masterProfileId: "",
      sponsorName: "",
      sponsorRole: "",
      sponsorEmail: "",
    },
  });

  // Initialize form when project data is loaded
  useEffect(() => {
    if (project) {
      form.reset({
        name: project.name,
        description: project.description || "",
        masterProfileId: project.masterProfileId,
        sponsorName: project.sponsorName || "",
        sponsorRole: project.sponsorRole || "",
        sponsorEmail: project.sponsorEmail || "",
      });
      setSelectedObjectives(project.objectives || []);
    }
  }, [project, form]);

  const updateProject = trpc.projects.update.useMutation({
    onSuccess: () => {
      utils.projects.get.invalidate({ id });
      utils.projects.list.invalidate();
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    },
  });

  const deleteProject = trpc.projects.delete.useMutation({
    onSuccess: () => {
      utils.projects.list.invalidate();
      router.push("/projects");
    },
  });

  const onSubmit = (data: ProjectFormData) => {
    updateProject.mutate({
      id,
      ...data,
      objectives: selectedObjectives,
      sponsorEmail: data.sponsorEmail || undefined,
    });
  };

  const toggleObjective = (obj: string) => {
    setSelectedObjectives((prev) =>
      prev.includes(obj) ? prev.filter((o) => o !== obj) : [...prev, obj],
    );
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  if (!project) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <p className="text-lg font-medium">Projet non trouvé</p>
          <Button asChild className="mt-4">
            <Link href="/projects">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Retour aux projets
            </Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" asChild>
          <Link href={`/projects/${id}`}>
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Paramètres du projet
          </h1>
          <p className="text-muted-foreground">
            Modifiez les informations de votre projet
          </p>
        </div>
      </div>

      {/* Success message */}
      {saved && (
        <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg text-green-900">
          <Check className="h-4 w-4" />
          <span className="text-sm font-medium">Paramètres enregistrés</span>
        </div>
      )}

      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* General Info */}
        <Card>
          <CardHeader>
            <CardTitle>Informations générales</CardTitle>
            <CardDescription>
              Les informations de base de votre projet
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
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
                value={form.watch("masterProfileId")}
                onValueChange={(value) =>
                  form.setValue("masterProfileId", value)
                }
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
                    variant={
                      selectedObjectives.includes(obj) ? "default" : "outline"
                    }
                    size="sm"
                    onClick={() => toggleObjective(obj)}
                  >
                    {obj}
                  </Button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Sponsor Info */}
        <Card>
          <CardHeader>
            <CardTitle>Informations du sponsor</CardTitle>
            <CardDescription>Coordonnées du sponsor du projet</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
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
          </CardContent>
        </Card>

        {/* Save Button */}
        <div className="flex justify-end">
          <Button type="submit" disabled={updateProject.isPending}>
            {updateProject.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Enregistrement...
              </>
            ) : (
              "Enregistrer les modifications"
            )}
          </Button>
        </div>
      </form>

      {/* Danger Zone */}
      <Card className="border-destructive">
        <CardHeader>
          <CardTitle className="text-destructive">Zone de danger</CardTitle>
          <CardDescription>Actions irréversibles sur ce projet</CardDescription>
        </CardHeader>
        <CardContent>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive">
                <Trash2 className="mr-2 h-4 w-4" />
                Supprimer le projet
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Êtes-vous sûr ?</AlertDialogTitle>
                <AlertDialogDescription>
                  Cette action est irréversible. Toutes les données du projet
                  (updates, décisions, risques) seront définitivement
                  supprimées.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Annuler</AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => deleteProject.mutate({ id })}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  {deleteProject.isPending ? "Suppression..." : "Supprimer"}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </CardContent>
      </Card>
    </div>
  );
}
