"use client";

import { useState } from "react";
import Link from "next/link";
import { trpc } from "@/lib/trpc/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, Bell, Loader2, Check } from "lucide-react";

const DAYS = [
  { value: 0, label: "Lundi" },
  { value: 1, label: "Mardi" },
  { value: 2, label: "Mercredi" },
  { value: 3, label: "Jeudi" },
  { value: 4, label: "Vendredi" },
  { value: 5, label: "Samedi" },
  { value: 6, label: "Dimanche" },
];

const HOURS = Array.from({ length: 24 }, (_, i) => ({
  value: i,
  label: `${i.toString().padStart(2, "0")}:00`,
}));

export default function PreferencesPage() {
  const utils = trpc.useUtils();
  const [saved, setSaved] = useState(false);

  const { data: settings, isLoading } = trpc.settings.get.useQuery();

  const updateSettings = trpc.settings.update.useMutation({
    onSuccess: () => {
      utils.settings.get.invalidate();
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    },
  });

  const handleReminderToggle = async (enabled: boolean) => {
    await updateSettings.mutateAsync({
      weeklyReminderEnabled: enabled,
    });
  };

  const handleDayChange = async (day: string) => {
    await updateSettings.mutateAsync({
      weeklyReminderDay: parseInt(day),
    });
  };

  const handleHourChange = async (hour: string) => {
    await updateSettings.mutateAsync({
      weeklyReminderHour: parseInt(hour),
    });
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  if (!settings) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Préférences</h1>
        <Card>
          <CardContent className="py-12">
            <p className="text-center text-muted-foreground">
              Impossible de charger les préférences
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/settings/billing">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Préférences</h1>
          <p className="text-muted-foreground">
            Configurez les paramètres de votre organisation
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

      {/* Weekly Reminders */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            <CardTitle>Rappels hebdomadaires</CardTitle>
          </div>
          <CardDescription>
            Recevez un email de rappel pour créer vos updates chaque semaine
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="reminder-enabled">Activer les rappels</Label>
              <p className="text-sm text-muted-foreground">
                Un email sera envoyé aux administrateurs de l'organisation
              </p>
            </div>
            <Switch
              id="reminder-enabled"
              checked={settings.weeklyReminderEnabled}
              onCheckedChange={handleReminderToggle}
              disabled={updateSettings.isPending}
            />
          </div>

          {settings.weeklyReminderEnabled && (
            <>
              <div className="space-y-2">
                <Label htmlFor="reminder-day">Jour de la semaine</Label>
                <Select
                  value={settings.weeklyReminderDay.toString()}
                  onValueChange={handleDayChange}
                  disabled={updateSettings.isPending}
                >
                  <SelectTrigger id="reminder-day">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {DAYS.map((day) => (
                      <SelectItem key={day.value} value={day.value.toString()}>
                        {day.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="reminder-hour">Heure (UTC)</Label>
                <Select
                  value={settings.weeklyReminderHour.toString()}
                  onValueChange={handleHourChange}
                  disabled={updateSettings.isPending}
                >
                  <SelectTrigger id="reminder-hour">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {HOURS.map((hour) => (
                      <SelectItem key={hour.value} value={hour.value.toString()}>
                        {hour.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">
                  Les rappels sont envoyés en UTC. Ajustez selon votre fuseau horaire.
                </p>
              </div>

              <div className="p-4 bg-muted/50 rounded-lg">
                <p className="text-sm">
                  <strong>Rappel configuré :</strong> Tous les{" "}
                  <strong>{DAYS.find((d) => d.value === settings.weeklyReminderDay)?.label}</strong>{" "}
                  à <strong>{HOURS.find((h) => h.value === settings.weeklyReminderHour)?.label}</strong>{" "}
                  UTC
                </p>
              </div>
            </>
          )}

          {updateSettings.isPending && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" />
              Enregistrement...
            </div>
          )}
        </CardContent>
      </Card>

      {/* Future sections can be added here */}
      <Card>
        <CardHeader>
          <CardTitle>Autres paramètres</CardTitle>
          <CardDescription>
            D'autres options de configuration seront disponibles prochainement
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-muted-foreground">
            <ul className="space-y-2">
              <li>• Rétention des données (RGPD)</li>
              <li>• Redaction automatique</li>
              <li>• Clés API personnalisées (BYOK)</li>
              <li>• Branding d'export</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
