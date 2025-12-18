"use client";

import { useState } from "react";
import Link from "next/link";
import { trpc } from "@/lib/trpc/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { CreateProjectDialog } from "@/components/projects/create-project-dialog";
import { Plus, Archive, Folder, Clock, AlertCircle, CheckCircle2 } from "lucide-react";

export default function ProjectsPage() {
  const [showArchived, setShowArchived] = useState(false);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);

  const { data: projects, isLoading } = trpc.projects.list.useQuery({
    archived: showArchived,
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Projets</h1>
          <p className="text-muted-foreground">
            Gérez vos projets et leurs updates hebdomadaires
          </p>
        </div>
        <Button onClick={() => setCreateDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Nouveau projet
        </Button>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-2">
        <Button
          variant={!showArchived ? "default" : "outline"}
          size="sm"
          onClick={() => setShowArchived(false)}
        >
          <Folder className="mr-2 h-4 w-4" />
          Actifs
        </Button>
        <Button
          variant={showArchived ? "default" : "outline"}
          size="sm"
          onClick={() => setShowArchived(true)}
        >
          <Archive className="mr-2 h-4 w-4" />
          Archivés
        </Button>
      </div>

      {/* Projects Grid */}
      {isLoading ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-20 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : projects && projects.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <Link key={project.id} href={`/projects/${project.id}`}>
              <Card className="h-full transition-colors hover:bg-muted/50">
                <CardHeader>
                  <CardTitle className="flex items-start justify-between">
                    <span className="line-clamp-1">{project.name}</span>
                    {project.archived && (
                      <Archive className="h-4 w-4 text-muted-foreground" />
                    )}
                  </CardTitle>
                  <CardDescription className="line-clamp-2">
                    {project.description || "Aucune description"}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Sponsor Info */}
                  {project.sponsorName && (
                    <div className="text-sm">
                      <p className="font-medium">Sponsor</p>
                      <p className="text-muted-foreground">
                        {project.sponsorName}
                        {project.sponsorRole && ` - ${project.sponsorRole}`}
                      </p>
                    </div>
                  )}

                  {/* Master Profile */}
                  <div className="text-sm">
                    <p className="font-medium">Profil Maître</p>
                    <p className="text-muted-foreground">
                      {project.masterProfile.name}
                    </p>
                  </div>

                  {/* Stats */}
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {project._count.updates} updates
                    </div>
                    <div className="flex items-center gap-1">
                      <CheckCircle2 className="h-4 w-4" />
                      {project._count.decisions} décisions
                    </div>
                    <div className="flex items-center gap-1">
                      <AlertCircle className="h-4 w-4" />
                      {project._count.risks} risques
                    </div>
                  </div>

                  {/* Objectives */}
                  {project.objectives.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {project.objectives.map((obj) => (
                        <span
                          key={obj}
                          className="rounded-full bg-primary/10 px-2 py-1 text-xs font-medium text-primary"
                        >
                          {obj}
                        </span>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Folder className="mb-4 h-12 w-12 text-muted-foreground" />
            <p className="text-lg font-medium">Aucun projet</p>
            <p className="mb-4 text-sm text-muted-foreground">
              {showArchived
                ? "Vous n'avez aucun projet archivé"
                : "Créez votre premier projet pour commencer"}
            </p>
            {!showArchived && (
              <Button onClick={() => setCreateDialogOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Créer un projet
              </Button>
            )}
          </CardContent>
        </Card>
      )}

      {/* Create Project Dialog */}
      <CreateProjectDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
      />
    </div>
  );
}
