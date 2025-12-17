import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function HomePage() {
  return (
    <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 md:py-24">
      {/* Hero Section */}
      <div className="flex max-w-[64rem] flex-col items-center gap-4 text-center">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
          Updates sponsor-ready
          <span className="block text-primary">en 2 minutes</span>
        </h1>
        <p className="max-w-[42rem] leading-normal text-muted-foreground sm:text-xl sm:leading-8">
          Transformez vos notes brutes en updates hebdomadaires professionnels
          pour sponsors non-tech, avec dossier de continuité intégré.
        </p>
        <div className="flex gap-4">
          <Button size="lg" asChild>
            <Link href="/generator">Essayer gratuitement</Link>
          </Button>
        </div>
      </div>

      {/* Features */}
      <div className="mx-auto grid max-w-5xl gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <div className="flex flex-col gap-2 rounded-lg border p-6">
          <h3 className="font-bold">⚡️ 2 minutes</h3>
          <p className="text-sm text-muted-foreground">
            Plus de 1-2h à rédiger. Générez un update complet en quelques clics.
          </p>
        </div>
        <div className="flex flex-col gap-2 rounded-lg border p-6">
          <h3 className="font-bold">🎯 Politiquement safe</h3>
          <p className="text-sm text-muted-foreground">
            Ton adapté à votre sponsor. Ne fait jamais d'ombre au décideur.
          </p>
        </div>
        <div className="flex flex-col gap-2 rounded-lg border p-6">
          <h3 className="font-bold">📁 Dossier 1 page</h3>
          <p className="text-sm text-muted-foreground">
            Log décisions + risques. Consultable en 30s quand ça chauffe.
          </p>
        </div>
      </div>
    </div>
  );
}
