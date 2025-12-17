"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export default function GeneratorPage() {
  const [facts, setFacts] = useState([{ text: "" }]);
  const [decisions, setDecisions] = useState([{ description: "", deadline: "" }]);
  const [risks, setRisks] = useState([{ description: "", impact: "", mitigation: "" }]);

  const addFact = () => setFacts([...facts, { text: "" }]);
  const addDecision = () => setDecisions([...decisions, { description: "", deadline: "" }]);
  const addRisk = () => setRisks([...risks, { description: "", impact: "", mitigation: "" }]);

  return (
    <div className="container max-w-6xl py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Générateur d'update sponsor-ready</h1>
        <p className="mt-2 text-muted-foreground">
          Transformez vos notes en update professionnel en quelques clics
        </p>
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
                    placeholder="Échéance (optionnel)"
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
                    placeholder="Impact"
                    value={risk.impact}
                    onChange={(e) => {
                      const newRisks = [...risks];
                      newRisks[index].impact = e.target.value;
                      setRisks(newRisks);
                    }}
                  />
                  <Input
                    placeholder="Mitigation (optionnel)"
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
          <Button size="lg" className="w-full">
            Générer l'update
          </Button>
        </div>

        {/* Right Column - Preview (placeholder) */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Preview Email</CardTitle>
              <CardDescription>
                L'update généré apparaîtra ici
              </CardDescription>
            </CardHeader>
            <CardContent className="min-h-[400px] text-sm text-muted-foreground">
              Remplissez le formulaire et cliquez sur "Générer" pour voir le résultat...
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Preview Slack</CardTitle>
              <CardDescription>
                Version courte pour Slack
              </CardDescription>
            </CardHeader>
            <CardContent className="min-h-[200px] text-sm text-muted-foreground">
              Remplissez le formulaire et cliquez sur "Générer" pour voir le résultat...
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
