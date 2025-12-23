import Link from "next/link";
import { SignInButton, SignUpButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                <svg
                  className="h-5 w-5 text-primary-foreground"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                  />
                </svg>
              </div>
              <span className="text-lg font-bold">Ascendos</span>
            </Link>
            <nav className="hidden items-center gap-6 md:flex">
              <Link
                href="#fonctionnalites"
                className="text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                Fonctionnalités
              </Link>
              <Link
                href="#demo"
                className="text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                Démo
              </Link>
              <Link
                href="#tarifs"
                className="text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                Tarifs
              </Link>
              <Link
                href="#faq"
                className="text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                FAQ
              </Link>
            </nav>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/generator"
              className="hidden text-sm font-medium text-muted-foreground transition-colors hover:text-foreground sm:block"
            >
              Générateur gratuit
            </Link>
            <SignedOut>
              <SignInButton mode="modal">
                <Button variant="ghost" size="sm">
                  Connexion
                </Button>
              </SignInButton>
              <SignUpButton mode="modal">
                <Button size="sm">
                  S'inscrire
                </Button>
              </SignUpButton>
            </SignedOut>
            <SignedIn>
              <UserButton />
            </SignedIn>
          </div>
        </div>
      </header>
      <main className="flex-1">{children}</main>
      <footer className="border-t bg-muted/30">
        <div className="container mx-auto px-4 py-12">
          <div className="grid gap-8 md:grid-cols-4">
            {/* Brand */}
            <div className="space-y-4">
              <Link href="/" className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                  <svg
                    className="h-5 w-5 text-primary-foreground"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                    />
                  </svg>
                </div>
                <span className="text-lg font-bold">Ascendos</span>
              </Link>
              <p className="text-sm text-muted-foreground">
                Updates sponsor-ready en 2 minutes. Dossier de continuité
                intégré.
              </p>
            </div>

            {/* Product */}
            <div className="space-y-4">
              <h4 className="text-sm font-semibold">Produit</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link
                    href="#fonctionnalites"
                    className="text-muted-foreground transition-colors hover:text-foreground"
                  >
                    Fonctionnalités
                  </Link>
                </li>
                <li>
                  <Link
                    href="#tarifs"
                    className="text-muted-foreground transition-colors hover:text-foreground"
                  >
                    Tarifs
                  </Link>
                </li>
                <li>
                  <Link
                    href="/generator"
                    className="text-muted-foreground transition-colors hover:text-foreground"
                  >
                    Générateur gratuit
                  </Link>
                </li>
              </ul>
            </div>

            {/* Resources */}
            <div className="space-y-4">
              <h4 className="text-sm font-semibold">Ressources</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link
                    href="#demo"
                    className="text-muted-foreground transition-colors hover:text-foreground"
                  >
                    Démonstration
                  </Link>
                </li>
                <li>
                  <Link
                    href="#faq"
                    className="text-muted-foreground transition-colors hover:text-foreground"
                  >
                    FAQ
                  </Link>
                </li>
                <li>
                  <Link
                    href="mailto:contact@ascendos.app"
                    className="text-muted-foreground transition-colors hover:text-foreground"
                  >
                    Contact
                  </Link>
                </li>
              </ul>
            </div>

            {/* Legal */}
            <div className="space-y-4">
              <h4 className="text-sm font-semibold">Légal</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link
                    href="/legal/terms"
                    className="text-muted-foreground transition-colors hover:text-foreground"
                  >
                    Conditions d'utilisation
                  </Link>
                </li>
                <li>
                  <Link
                    href="/legal/privacy"
                    className="text-muted-foreground transition-colors hover:text-foreground"
                  >
                    Politique de confidentialité
                  </Link>
                </li>
                <li>
                  <Link
                    href="/legal/dpa"
                    className="text-muted-foreground transition-colors hover:text-foreground"
                  >
                    DPA
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t pt-8 md:flex-row">
            <p className="text-center text-sm text-muted-foreground">
              © {new Date().getFullYear()} Ascendos. Tous droits réservés.
            </p>
            <div className="flex items-center gap-4">
              <span className="text-xs text-muted-foreground">
                Hébergé en Europe
              </span>
              <span className="text-muted-foreground">•</span>
              <span className="text-xs text-muted-foreground">
                RGPD compliant
              </span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
