"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FileText, Shield, Scale } from "lucide-react";
import { cn } from "@/lib/utils";

const legalPages = [
  {
    title: "CGU",
    fullTitle: "Conditions Générales d'Utilisation",
    href: "/legal/terms",
    icon: FileText,
    description: "Règles d'utilisation du service",
  },
  {
    title: "Confidentialité",
    fullTitle: "Politique de Confidentialité",
    href: "/legal/privacy",
    icon: Shield,
    description: "Protection de vos données",
  },
  {
    title: "DPA",
    fullTitle: "Accord de Traitement des Données",
    href: "/legal/dpa",
    icon: Scale,
    description: "Conformité RGPD",
  },
];

export default function LegalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-gradient-to-b from-muted/30 to-background">
      {/* Header */}
      <div className="border-b bg-background/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-8">
          <div className="mx-auto max-w-4xl">
            <p className="text-sm font-medium text-primary mb-2">
              Documents légaux
            </p>
            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
              Centre de documentation juridique
            </h1>
            <p className="mt-2 text-muted-foreground">
              Consultez nos conditions d'utilisation, politique de
              confidentialité et accord de traitement des données.
            </p>
          </div>
        </div>
      </div>

      {/* Navigation tabs */}
      <div className="border-b bg-background/50">
        <div className="container mx-auto px-4">
          <nav className="mx-auto max-w-4xl">
            <ul className="flex gap-1 overflow-x-auto py-2 -mb-px">
              {legalPages.map((page) => {
                const isActive = pathname === page.href;
                const Icon = page.icon;
                return (
                  <li key={page.href}>
                    <Link
                      href={page.href}
                      className={cn(
                        "flex items-center gap-2 px-4 py-3 text-sm font-medium rounded-t-lg border-b-2 transition-colors whitespace-nowrap",
                        isActive
                          ? "border-primary text-primary bg-background"
                          : "border-transparent text-muted-foreground hover:text-foreground hover:bg-muted/50",
                      )}
                    >
                      <Icon className="h-4 w-4" />
                      <span className="hidden sm:inline">{page.fullTitle}</span>
                      <span className="sm:hidden">{page.title}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="mx-auto max-w-4xl">{children}</div>
      </div>
    </div>
  );
}
