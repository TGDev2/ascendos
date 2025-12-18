"use client";

import { use } from "react";
import Link from "next/link";
import { trpc } from "@/lib/trpc/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { UpdatesList } from "@/components/projects/updates-list";
import { DecisionsList } from "@/components/projects/decisions-list";
import { RisksList } from "@/components/projects/risks-list";
import { GlobalSearchBar } from "@/components/projects/global-search-bar";
import {
  ArrowLeft,
  Plus,
  Archive,
  ArchiveRestore,
  Settings,
  Clock,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

interface ProjectPageProps {
  params: Promise<{ id: string }>;
}

export default function ProjectPage({ params }: ProjectPageProps) {
  const { id } = use(params);
  const utils = trpc.useUtils();

  const { data: project, isLoading } = trpc.projects.get.useQuery({ id });

  const archiveProject = trpc.projects.archive.useMutation({
    onSuccess: () => {
      utils.projects.get.invalidate({ id });
      utils.projects.list.invalidate();
    },
  });

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
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/projects">
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </Button>
            <h1 className="text-3xl font-bold tracking-tight">{project.name}</h1>
            {project.archived && (
              <span className="rounded-full bg-muted px-3 py-1 text-sm font-medium">
                Archivé
              </span>
            )}
          </div>
          {project.description && (
            <p className="text-muted-foreground">{project.description}</p>
          )}
        </div>

        <div className="flex items-center gap-2">
          <GlobalSearchBar projectId={project.id} />
          <Button
            variant="outline"
            onClick={() =>
              archiveProject.mutate({
                id: project.id,
                archived: !project.archived,
              })
            }
            disabled={archiveProject.isPending}
          >
            {project.archived ? (
              <>
                <ArchiveRestore className="mr-2 h-4 w-4" />
                Désarchiver
              </>
            ) : (
              <>
                <Archive className="mr-2 h-4 w-4" />
                Archiver
              </>
            )}
          </Button>
          <Button variant="outline" asChild>
            <Link href={`/projects/${project.id}/settings`}>
              <Settings className="mr-2 h-4 w-4" />
              Paramètres
            </Link>
          </Button>
        </div>
      </div>

      {/* Project Info Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Updates</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{project._count.updates}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Décisions</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{project._count.decisions}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Risques</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{project._count.risks}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Profil Maître</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm font-medium">{project.masterProfile.name}</div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="updates" className="space-y-4">
        <div className="flex items-center justify-between">
          <TabsList>
            <TabsTrigger value="updates">Updates</TabsTrigger>
            <TabsTrigger value="decisions">Décisions</TabsTrigger>
            <TabsTrigger value="risks">Risques</TabsTrigger>
            <TabsTrigger value="export">Export</TabsTrigger>
          </TabsList>

          <Button asChild>
            <Link href={`/projects/${project.id}/updates/new`}>
              <Plus className="mr-2 h-4 w-4" />
              Nouvel update
            </Link>
          </Button>
        </div>

        <TabsContent value="updates" className="space-y-4">
          <UpdatesList projectId={project.id} />
        </TabsContent>

        <TabsContent value="decisions" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0">
              <div>
                <CardTitle>Log des décisions</CardTitle>
                <CardDescription>
                  Dernières décisions identifiées
                </CardDescription>
              </div>
              <Button variant="outline" asChild>
                <Link href={`/projects/${project.id}/decisions`}>
                  Voir tout ({project._count.decisions})
                </Link>
              </Button>
            </CardHeader>
            <CardContent>
              <DecisionsList projectId={project.id} limit={5} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="risks" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0">
              <div>
                <CardTitle>Registre des risques</CardTitle>
                <CardDescription>
                  Derniers risques identifiés
                </CardDescription>
              </div>
              <Button variant="outline" asChild>
                <Link href={`/projects/${project.id}/risks`}>
                  Voir tout ({project._count.risks})
                </Link>
              </Button>
            </CardHeader>
            <CardContent>
              <RisksList projectId={project.id} limit={5} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="export" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Exporter le dossier</CardTitle>
              <CardDescription>
                Générez un dossier de continuité complet en PDF
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Options d'export (à implémenter dans Phase 4)
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
