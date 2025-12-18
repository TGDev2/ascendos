"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { LayoutDashboard, FolderKanban, Settings, Sparkles } from "lucide-react";

const navItems = [
  {
    title: "Projets",
    href: "/projects",
    icon: FolderKanban,
  },
  {
    title: "Paramètres",
    href: "/settings",
    icon: Settings,
  },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="flex h-full w-64 flex-col border-r bg-muted/10">
      {/* Logo */}
      <div className="flex h-16 items-center border-b px-6">
        <Link href="/projects" className="flex items-center gap-2 font-semibold">
          <Sparkles className="h-5 w-5" />
          <span>Ascendos</span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 p-4">
        {navItems.map((item) => {
          const isActive = pathname?.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.title}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="border-t p-4">
        <Link
          href="/generator"
          className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        >
          <LayoutDashboard className="h-4 w-4" />
          Générateur gratuit
        </Link>
      </div>
    </div>
  );
}
