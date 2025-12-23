"use client";

import { useState } from "react";
import Link from "next/link";
import { SituationType } from "@ascendos/templates";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { MasterProfileSelector } from "@/components/generator/master-profile-selector";
import { SituationTypeSelector } from "@/components/generator/situation-type-selector";
import { OutputPreview } from "@/components/generator/output-preview";
import {
  ArrowRight,
  CheckCircle2,
  FileText,
  AlertTriangle,
  Loader2,
  Sparkles,
  Trash2,
} from "lucide-react";

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

export default function GeneratorPage() {
  // State pour les sélecteurs
  const [masterProfile, setMasterProfile] =
    useState<string>("non-tech-confiant");
  const [situationType, setSituationType] = useState<SituationType>(
    SituationType.NORMAL
  );

  // State pour le formulaire
  const [facts, setFacts] = useState([{ text: "" }]);
  const [decisions, setDecisions] = useState([
    { description: "", deadline: "" },
  ]);
  const [risks, setRisks] = useState([
    { description: "", impact: "", mitigation: "" },
  ]);

  // State pour la génération
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>();
  const [output, setOutput] = useState<GeneratedOutput>();

  const addFact = () => setFacts([...facts, { text: "" }]);
  const removeFact = (index: number) => {
    if (facts.length > 1) {
      setFacts(facts.filter((_, i) => i !== index));
    }
  };

  const addDecision = () =>
    setDecisions([...decisions, { description: "", deadline: "" }]);
  const removeDecision = (index: number) => {
    if (decisions.length > 1) {
      setDecisions(decisions.filter((_, i) => i !== index));
    }
  };

  const addRisk = () =>
    setRisks([...risks, { description: "", impact: "", mitigation: "" }]);
  const removeRisk = (index: number) => {
    if (risks.length > 1) {
      setRisks(risks.filter((_, i) => i !== index));
    }
  };

  const handleGenerate = async () => {
    setIsLoading(true);
    setError(undefined);

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
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
        throw new Error(
          data.error || data.message || "Erreur lors de la génération"
        );
      }

      setOutput(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Une erreur est survenue");
      console.error("Error generating update:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // Calculer le nombre d'éléments remplis
  const filledFacts = facts.filter((f) => f.text.trim()).length;
  const filledDecisions = decisions.filter((d) => d.description.trim()).length;
  const filledRisks = risks.filter((r) => r.description.trim()).length;
  const canGenerate = filledFacts > 0 || filledDecisions > 0 || filledRisks > 0;

  return (
    <div className="min-h-screen bg-gradient-to-b from-muted/30 to-background">
      {/* Header */}
      <div className="border-b bg-background/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-8">
          <div className="mx-auto max-w-3xl text-center">
            <Badge variant="secondary" className="mb-4">
              Gratuit et sans inscription
            </Badge>
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Générateur d'update sponsor-ready
            </h1>
            <p className="mt-3 text-lg text-muted-foreground">
              Transformez vos notes brutes en communication professionnelle
              adaptée à votre sponsor. Résultat en moins de 30 secondes.
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Étape 1 : Configuration */}
        <div className="mx-auto max-w-6xl">
          <div className="mb-8">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
                1
              </div>
              <h2 className="text-xl font-semibold">Configuration</h2>
            </div>
            <div className="grid gap-6 lg:grid-cols-2">
              <MasterProfileSelector
                value={masterProfile}
                onValueChange={setMasterProfile}
              />
              <SituationTypeSelector
                value={situationType}
                onValueChange={setSituationType}
              />
            </div>
          </div>

          {/* Étape 2 : Contenu */}
          <div className="mb-8">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
                2
              </div>
              <h2 className="text-xl font-semibold">Votre contenu</h2>
              <div className="ml-auto flex items-center gap-2 text-sm text-muted-foreground">
                <span className="rounded-full bg-muted px-2 py-0.5">
                  {filledFacts + filledDecisions + filledRisks} élément(s)
                </span>
              </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-3">
              {/* Faits */}
              <Card className="border-green-200 bg-green-50/50 dark:border-green-900 dark:bg-green-950/20">
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-green-100 dark:bg-green-900">
                      <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />
                    </div>
                    <div>
                      <CardTitle className="text-base">
                        Faits de la semaine
                      </CardTitle>
                      <CardDescription className="text-xs">
                        Ce qui a été accompli
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  {facts.map((fact, index) => (
                    <div key={index} className="group relative">
                      <Textarea
                        placeholder="Ex: PR #182 règles livraison merged"
                        value={fact.text}
                        onChange={(e) => {
                          const newFacts = [...facts];
                          newFacts[index].text = e.target.value;
                          setFacts(newFacts);
                        }}
                        rows={2}
                        className="resize-none bg-background pr-8"
                      />
                      {facts.length > 1 && (
                        <button
                          type="button"
                          title="Supprimer ce fait"
                          onClick={() => removeFact(index)}
                          className="absolute right-2 top-2 rounded p-1 text-muted-foreground opacity-0 transition-opacity hover:bg-muted hover:text-foreground group-hover:opacity-100"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      )}
                    </div>
                  ))}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={addFact}
                    className="w-full border border-dashed text-muted-foreground hover:text-foreground"
                  >
                    + Ajouter un fait
                  </Button>
                </CardContent>
              </Card>

              {/* Décisions */}
              <Card className="border-blue-200 bg-blue-50/50 dark:border-blue-900 dark:bg-blue-950/20">
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900">
                      <FileText className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <CardTitle className="text-base">
                        Décisions attendues
                      </CardTitle>
                      <CardDescription className="text-xs">
                        Validations nécessaires
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  {decisions.map((decision, index) => (
                    <div key={index} className="group relative space-y-2">
                      <Textarea
                        placeholder="Ex: GO mise en production"
                        value={decision.description}
                        onChange={(e) => {
                          const newDecisions = [...decisions];
                          newDecisions[index].description = e.target.value;
                          setDecisions(newDecisions);
                        }}
                        rows={2}
                        className="resize-none bg-background pr-8"
                      />
                      <Input
                        placeholder="Échéance - Ex: jeudi 17h"
                        value={decision.deadline}
                        onChange={(e) => {
                          const newDecisions = [...decisions];
                          newDecisions[index].deadline = e.target.value;
                          setDecisions(newDecisions);
                        }}
                        className="bg-background text-sm"
                      />
                      {decisions.length > 1 && (
                        <button
                          type="button"
                          title="Supprimer cette décision"
                          onClick={() => removeDecision(index)}
                          className="absolute right-2 top-2 rounded p-1 text-muted-foreground opacity-0 transition-opacity hover:bg-muted hover:text-foreground group-hover:opacity-100"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      )}
                    </div>
                  ))}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={addDecision}
                    className="w-full border border-dashed text-muted-foreground hover:text-foreground"
                  >
                    + Ajouter une décision
                  </Button>
                </CardContent>
              </Card>

              {/* Risques */}
              <Card className="border-orange-200 bg-orange-50/50 dark:border-orange-900 dark:bg-orange-950/20">
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-orange-100 dark:bg-orange-900">
                      <AlertTriangle className="h-4 w-4 text-orange-600 dark:text-orange-400" />
                    </div>
                    <div>
                      <CardTitle className="text-base">
                        Risques identifiés
                      </CardTitle>
                      <CardDescription className="text-xs">
                        Points d'attention
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  {risks.map((risk, index) => (
                    <div key={index} className="group relative space-y-2">
                      <Textarea
                        placeholder="Ex: Retour Legal CGV pas reçu"
                        value={risk.description}
                        onChange={(e) => {
                          const newRisks = [...risks];
                          newRisks[index].description = e.target.value;
                          setRisks(newRisks);
                        }}
                        rows={2}
                        className="resize-none bg-background pr-8"
                      />
                      <Input
                        placeholder="Impact - Ex: validation bloquée"
                        value={risk.impact}
                        onChange={(e) => {
                          const newRisks = [...risks];
                          newRisks[index].impact = e.target.value;
                          setRisks(newRisks);
                        }}
                        className="bg-background text-sm"
                      />
                      <Input
                        placeholder="Mitigation - Ex: version A conservative"
                        value={risk.mitigation}
                        onChange={(e) => {
                          const newRisks = [...risks];
                          newRisks[index].mitigation = e.target.value;
                          setRisks(newRisks);
                        }}
                        className="bg-background text-sm"
                      />
                      {risks.length > 1 && (
                        <button
                          type="button"
                          title="Supprimer ce risque"
                          onClick={() => removeRisk(index)}
                          className="absolute right-2 top-2 rounded p-1 text-muted-foreground opacity-0 transition-opacity hover:bg-muted hover:text-foreground group-hover:opacity-100"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      )}
                    </div>
                  ))}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={addRisk}
                    className="w-full border border-dashed text-muted-foreground hover:text-foreground"
                  >
                    + Ajouter un risque
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Bouton générer */}
          <div className="mb-8 flex justify-center">
            <Button
              size="lg"
              onClick={handleGenerate}
              disabled={isLoading || !canGenerate}
              className="min-w-[250px] gap-2 text-base"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Génération en cours...
                </>
              ) : (
                <>
                  <Sparkles className="h-5 w-5" />
                  Générer l'update
                </>
              )}
            </Button>
          </div>

          {/* Étape 3 : Résultat */}
          <div>
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
                3
              </div>
              <h2 className="text-xl font-semibold">Résultat</h2>
              {output && !isLoading && (
                <Badge variant="secondary" className="ml-2">
                  Prêt à copier
                </Badge>
              )}
            </div>

            <OutputPreview
              emailSubject={output?.emailSubject}
              emailBody={output?.emailBody}
              slackMessage={output?.slackMessage}
              isLoading={isLoading}
              error={error}
            />

            {/* CTA "Sauvegarder" */}
            {output && !isLoading && (
              <Card className="mt-6 border-primary/50 bg-gradient-to-r from-primary/5 to-primary/10">
                <CardContent className="flex flex-col items-center gap-4 py-6 sm:flex-row sm:justify-between">
                  <div className="text-center sm:text-left">
                    <h3 className="font-semibold">
                      Envie de sauvegarder vos updates ?
                    </h3>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Créez un compte pour construire votre dossier de
                      continuité et recevoir des rappels hebdo.
                    </p>
                  </div>
                  <Button asChild className="shrink-0">
                    <Link href="/sign-up">
                      Créer un compte gratuit
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
