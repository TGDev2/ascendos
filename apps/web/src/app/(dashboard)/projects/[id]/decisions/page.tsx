"use client";

import { use, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Plus, X } from "lucide-react";
import { DecisionsList } from "@/components/projects/decisions-list";
import { CreateDecisionDialog } from "@/components/projects/create-decision-dialog";
import { Badge } from "@/components/ui/badge";

type DecisionStatus = "PENDING" | "DECIDED" | "CANCELLED";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function DecisionsPage({ params }: PageProps) {
  const { id } = use(params);
  const [statusFilter, setStatusFilter] = useState<DecisionStatus[]>([]);
  const [tagsFilter, setTagsFilter] = useState<string[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleStatusToggle = (status: DecisionStatus) => {
    if (statusFilter.includes(status)) {
      setStatusFilter(statusFilter.filter((s) => s !== status));
    } else {
      setStatusFilter([...statusFilter, status]);
    }
  };

  const clearFilters = () => {
    setStatusFilter([]);
    setTagsFilter([]);
  };

  const hasFilters = statusFilter.length > 0 || tagsFilter.length > 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" asChild>
            <Link href={`/projects/${id}`}>
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <h1 className="text-3xl font-bold">Log des décisions</h1>
        </div>
        <Button onClick={() => setDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Nouvelle décision
        </Button>
      </div>

      {/* Filters Bar */}
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium">Filtres</h3>
              {hasFilters && (
                <Button variant="ghost" size="sm" onClick={clearFilters}>
                  <X className="mr-1 h-3 w-3" />
                  Effacer
                </Button>
              )}
            </div>

            <div className="space-y-3">
              {/* Status Filter */}
              <div className="space-y-2">
                <label className="text-sm text-muted-foreground">Status</label>
                <div className="flex flex-wrap gap-2">
                  <Badge
                    variant={statusFilter.includes("PENDING") ? "default" : "outline"}
                    className="cursor-pointer"
                    onClick={() => handleStatusToggle("PENDING")}
                  >
                    En attente
                  </Badge>
                  <Badge
                    variant={statusFilter.includes("DECIDED") ? "default" : "outline"}
                    className="cursor-pointer"
                    onClick={() => handleStatusToggle("DECIDED")}
                  >
                    Décidée
                  </Badge>
                  <Badge
                    variant={statusFilter.includes("CANCELLED") ? "default" : "outline"}
                    className="cursor-pointer"
                    onClick={() => handleStatusToggle("CANCELLED")}
                  >
                    Annulée
                  </Badge>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Decisions List */}
      <DecisionsList
        projectId={id}
        statusFilter={statusFilter.length > 0 ? statusFilter : undefined}
        tagsFilter={tagsFilter.length > 0 ? tagsFilter : undefined}
        limit={50}
      />

      <CreateDecisionDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        projectId={id}
      />
    </div>
  );
}
