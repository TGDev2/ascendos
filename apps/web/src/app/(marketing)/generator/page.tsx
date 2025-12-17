"use client";

import { useState } from "react";
import Link from "next/link";
import { SituationType } from "@ascendos/templates";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { MasterProfileSelector } from "@/components/generator/master-profile-selector";
import { SituationTypeSelector } from "@/components/generator/situation-type-selector";
import { OutputPreview } from "@/components/generator/output-preview";
import { ArrowRight } from "lucide-react";

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
  const [masterProfile, setMasterProfile] = useState<string>("non-tech-confiant");
  const [situationType, setSituationType] = useState<SituationType>(SituationType.NORMAL);

  // State pour le formulaire
  const [facts, setFacts] = useState([{ text: "" }]);
  const [decisions, setDecisions] = useState([{ description: "", deadline: "" }]);
  const [risks, setRisks] = useState([{ description: "", impact: "", mitigation: "" }]);

  // State pour la génération
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>();
  const [output, setOutput] = useState<GeneratedOutput>();

  const addFact = () => setFacts([...facts, { text: "" }]);
  const addDecision = () => setDecisions([...decisions, { description: "", deadline: "" }]);
  const addRisk = () => setRisks([...risks, { description: "", impact: "", mitigation: "" }]);

  const handleGenerate = async () => {
    setIsLoading(true);
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
      setIsLoading(false);
    }
  };

  return (
    <div className="container max-w-7xl py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Générateur d'update sponsor-ready</h1>
        <p className="mt-2 text-muted-foreground">
          Transformez vos notes en update professionnel en quelques clics
        </p>
      </div>

      {/* Sélecteurs */}
      <div className="mb-8 space-y-8">
        <MasterProfileSelector value={masterProfile} onValueChange={setMasterProfile} />
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
            disabled={isLoading}
          >
            {isLoading ? "Génération en cours..." : "Générer l'update"}
          </Button>

          {/* CTA "Sauvegarder" */}
          {output && !isLoading && (
            <Card className="border-primary bg-primary/5">
              <CardContent className="pt-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-1">
                    <h3 className="font-semibold">Sauvegardez vos updates</h3>
                    <p className="text-sm text-muted-foreground">
                      Créez un compte pour sauvegarder votre historique, construire votre dossier de continuité et recevoir des rappels hebdo.
                    </p>
                  </div>
                  <Button asChild>
                    <Link href="/sign-up">
                      Créer un compte
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Right Column - Preview */}
        <OutputPreview
          emailSubject={output?.emailSubject}
          emailBody={output?.emailBody}
          slackMessage={output?.slackMessage}
          isLoading={isLoading}
          error={error}
        />
      </div>
    </div>
  );
}
