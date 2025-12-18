"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { trpc } from "@/lib/trpc/react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, Clock } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";

interface GlobalSearchBarProps {
  projectId: string;
}

export function GlobalSearchBar({ projectId }: GlobalSearchBarProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");

  // Debounce the search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  const { data: results, isLoading } = trpc.search.searchUpdates.useQuery(
    {
      projectId,
      query: debouncedQuery,
    },
    {
      enabled: debouncedQuery.length >= 2,
    }
  );

  const handleResultClick = (updateId: string) => {
    router.push(`/projects/${projectId}/updates/${updateId}`);
    setOpen(false);
    setQuery("");
  };

  return (
    <>
      <Button
        variant="outline"
        className="relative w-64 justify-start text-sm text-muted-foreground"
        onClick={() => setOpen(true)}
      >
        <Search className="mr-2 h-4 w-4" />
        <span>Rechercher updates...</span>
        <kbd className="pointer-events-none absolute right-2 hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex">
          Ctrl+K
        </kbd>
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Rechercher dans les updates</DialogTitle>
            <DialogDescription>
              Cherchez dans les emails et messages du projet
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <Input
              placeholder="Tapez pour rechercher..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              autoFocus
              className="w-full"
            />

            {/* Results */}
            <div className="max-h-[400px] overflow-y-auto">
              {isLoading && debouncedQuery.length >= 2 && (
                <p className="text-sm text-muted-foreground py-4 text-center">
                  Recherche...
                </p>
              )}

              {!isLoading && debouncedQuery.length >= 2 && results && results.length === 0 && (
                <p className="text-sm text-muted-foreground py-4 text-center">
                  Aucun résultat trouvé
                </p>
              )}

              {!isLoading && results && results.length > 0 && (
                <div className="space-y-2">
                  {results.map((result) => (
                    <button
                      key={result.id}
                      onClick={() => handleResultClick(result.id)}
                      className="w-full text-left p-3 rounded-lg border hover:bg-muted/50 transition-colors"
                    >
                      <div className="space-y-1">
                        <div className="font-medium">{result.emailSubject}</div>
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {result.snippet}
                        </p>
                        <div className="flex items-center gap-2 mt-2">
                          <Badge variant="outline">{result.situationType}</Badge>
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Clock className="h-3 w-3" />
                            {formatDistanceToNow(new Date(result.createdAt), {
                              addSuffix: true,
                              locale: fr,
                            })}
                          </div>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}

              {debouncedQuery.length < 2 && query.length < 2 && (
                <p className="text-sm text-muted-foreground py-4 text-center">
                  Tapez au moins 2 caractères pour rechercher
                </p>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
