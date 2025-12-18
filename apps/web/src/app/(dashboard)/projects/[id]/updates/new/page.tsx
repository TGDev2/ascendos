"use client";

import { use, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { trpc } from "@/lib/trpc/react";
import { SituationType } from "@ascendos/templates";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { SituationTypeSelector } from "@/components/generator/situation-type-selector";
import { OutputPreview } from "@/components/generator/output-preview";
import { ArrowLeft, Save } from "lucide-react";
import { getWeek, getYear } from "date-fns";

interface PageProps {
  params: Promise<{ id: string }>;
}

interface GeneratedOutput {
  emailSubject: string;
  emailBody: string;
  slackMessage: string;
  metadata: {
    generatedWith: string;
    tokensUsed: number;
    generationTimeMs: number;
  };
}

export default function NewUpdatePage({ params }: PageProps) {
  const { id: projectId } = use(params);
  const router = useRouter();
  const utils = trpc.useUtils();

  const { data: project, isLoading: projectLoading } = trpc.projects.get.useQuery({ id: projectId });

  // State pour les sélecteurs
  const [masterProfile, setMasterProfile] = useState<string>("");
  const [situationType, setSituationType] = useState<SituationType>(SituationType.NORMAL);

  // State pour le formulaire
  const [facts, setFacts] = useState([{ text: "" }]);
  const [decisions, setDecisions] = useState([{ description: "", deadline: "" }]);
  const [risks, setRisks] = useState([{ description: "", impact: "", mitigation: "" }]);

  // State pour la génération
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string>();
  const [output, setOutput] = useState<GeneratedOutput>();

  // Mutation pour sauvegarder
  const createUpdate = trpc.updates.create.useMutation({
    onSuccess: (update) => {
      utils.updates.list.invalidate({ projectId });
      utils.projects.get.invalidate({ id: projectId });
      if (update && update.id) {
        router.push(`/projects/${projectId}/updates/${update.id}`);
      }
    },
  });

  // Initialiser le master profile avec celui du projet
  if (project && !masterProfile && project.masterProfile) {
    setMasterProfile(project.masterProfile.id);
  }

  const addFact = () => setFacts([...facts, { text: "" }]);
  const addDecision = () => setDecisions([...decisions, { description: "", deadline: "" }]);
  const addRisk = () => setRisks([...risks, { description: "", impact: "", mitigation: "" }]);

  const handleGenerate = async () => {
    setIsGenerating(true);
    setError(undefined);

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          facts,
          decisionsNeeded: decisions,
          risksInput: risks,
          masterProfileSlug: masterProfile,
          situationType,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || data.message || 'Erreur lors de la génération');
      }

      setOutput(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
      console.error('Error generating update:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSave = () => {
    if (!output || !project) return;

    const now = new Date();
    const weekNumber = `W${getWeek(now).toString().padStart(2, '0')}`;
    const year = getYear(now);

    createUpdate.mutate({
      projectId,
      weekNumber,
      year,
      facts,
      decisionsNeeded: decisions,
      risksInput: risks,
      situationType,
      emailSubject: output.emailSubject,
      emailBody: output.emailBody,
      slackMessage: output.slackMessage,
      generatedWith: output.metadata.generatedWith,
      tokensUsed: output.metadata.tokensUsed,
      generationTimeMs: output.metadata.generationTimeMs,
    });
  };

  if (projectLoading) {
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
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" asChild>
              <Link href={`/projects/${projectId}`}>
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </Button>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Nouvel update</h1>
              <p className="text-muted-foreground">{project.name}</p>
            </div>
          </div>
        </div>

        {output && (
          <Button
            onClick={handleSave}
            disabled={createUpdate.isPending}
            size="lg"
          >
            <Save className="mr-2 h-4 w-4" />
            {createUpdate.isPending ? "Sauvegarde..." : "Sauvegarder l'update"}
          </Button>
        )}
      </div>

      {/* Sélecteurs */}
      <div className="space-y-8">
        <Card>
          <CardHeader>
            <CardTitle>Profil Maître</CardTitle>
            <CardDescription>
              {project.masterProfile.name} (configuré pour ce projet)
            </CardDescription>
          </CardHeader>
        </Card>

        <SituationTypeSelector value={situationType} onValueChange={setSituationType} />
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Left Column - Input Form */}
        <div className="space-y-6">
          {/* Faits */}
          <Card>
            <CardHeader>
              <CardTitle>Faits de la semaine</CardTitle>
              <CardDescription>
                Ce qui a été accompli, livré, ou avancé
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {facts.map((fact, index) => (
                <div key={index} className="space-y-2">
                  <Label htmlFor={`fact-${index}`}>Fait {index + 1}</Label>
                  <Textarea
                    id={`fact-${index}`}
                    placeholder="Ex: PR #182 règles livraison merged"
                    value={fact.text}
                    onChange={(e) => {
                      const newFacts = [...facts];
                      newFacts[index].text = e.target.value;
                      setFacts(newFacts);
                    }}
                    rows={2}
                  />
                </div>
              ))}
              <Button variant="outline" size="sm" onClick={addFact}>
                + Ajouter un fait
              </Button>
            </CardContent>
          </Card>

          {/* Décisions attendues */}
          <Card>
            <CardHeader>
              <CardTitle>Décisions attendues</CardTitle>
              <CardDescription>
                Validations ou arbitrages nécessaires
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {decisions.map((decision, index) => (
                <div key={index} className="space-y-2">
                  <Label htmlFor={`decision-${index}`}>Décision {index + 1}</Label>
                  <Textarea
                    id={`decision-${index}`}
                    placeholder="Ex: GO mise en production"
                    value={decision.description}
                    onChange={(e) => {
                      const newDecisions = [...decisions];
                      newDecisions[index].description = e.target.value;
                      setDecisions(newDecisions);
                    }}
                    rows={2}
                  />
                  <Input
                    placeholder="Échéance (optionnel) - Ex: jeudi 17h"
                    value={decision.deadline}
                    onChange={(e) => {
                      const newDecisions = [...decisions];
                      newDecisions[index].deadline = e.target.value;
                      setDecisions(newDecisions);
                    }}
                  />
                </div>
              ))}
              <Button variant="outline" size="sm" onClick={addDecision}>
                + Ajouter une décision
              </Button>
            </CardContent>
          </Card>

          {/* Risques */}
          <Card>
            <CardHeader>
              <CardTitle>Risques identifiés</CardTitle>
              <CardDescription>
                Points d'attention ou blocages potentiels
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {risks.map((risk, index) => (
                <div key={index} className="space-y-2">
                  <Label htmlFor={`risk-${index}`}>Risque {index + 1}</Label>
                  <Textarea
                    id={`risk-${index}`}
                    placeholder="Ex: Retour Legal CGV pas reçu"
                    value={risk.description}
                    onChange={(e) => {
                      const newRisks = [...risks];
                      newRisks[index].description = e.target.value;
                      setRisks(newRisks);
                    }}
                    rows={2}
                  />
                  <Input
                    placeholder="Impact - Ex: validation bloquée"
                    value={risk.impact}
                    onChange={(e) => {
                      const newRisks = [...risks];
                      newRisks[index].impact = e.target.value;
                      setRisks(newRisks);
                    }}
                  />
                  <Input
                    placeholder="Mitigation (optionnel) - Ex: proposer version A conservative"
                    value={risk.mitigation}
                    onChange={(e) => {
                      const newRisks = [...risks];
                      newRisks[index].mitigation = e.target.value;
                      setRisks(newRisks);
                    }}
                  />
                </div>
              ))}
              <Button variant="outline" size="sm" onClick={addRisk}>
                + Ajouter un risque
              </Button>
            </CardContent>
          </Card>

          {/* Generate Button */}
          <Button
            size="lg"
            className="w-full"
            onClick={handleGenerate}
            disabled={isGenerating}
          >
            {isGenerating ? "Génération en cours..." : "Générer l'update"}
          </Button>
        </div>

        {/* Right Column - Preview */}
        <OutputPreview
          emailSubject={output?.emailSubject}
          emailBody={output?.emailBody}
          slackMessage={output?.slackMessage}
          isLoading={isGenerating}
          error={error}
        />
      </div>
    </div>
  );
}
