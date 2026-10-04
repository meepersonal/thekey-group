import { useMemo, useState } from "react";
import { ArrowRight, Clock, Loader2, MapPin, Navigation, Phone, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link } from "@/lib/router";
import { usePublicAgences } from "@/data/public-store";
import type { Agence } from "@/lib/api";

export function AgenciesSection() {
  const { data: agences = [], isLoading, isError } = usePublicAgences();
  const [search, setSearch] = useState("");
  console.log(agences);
  const filteredAgences = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return agences;
    return agences.filter(
      (agence) =>
        agence.name.toLowerCase().includes(query) ||
        agence.location.toLowerCase().includes(query) ||
        (agence.phone ?? "").toLowerCase().includes(query),
    );
  }, [agences, search]);

  return (
    <section className="border-t border-border/60 bg-background" id="agences">
      <div className="mx-auto max-w-7xl px-4 py-16 lg:px-8 lg:py-20">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-3 text-[10px] font-bold uppercase tracking-[0.25em] text-primary">
              <span className="h-px w-6 bg-primary/40" />
              Nos agences
            </span>

            <h2 className="mt-4 font-display text-3xl font-extrabold leading-[1.15] tracking-tight sm:text-4xl">
              Retrouvez-nous{" "}
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                près de chez vous
              </span>
            </h2>

            <p className="mt-4 text-base text-muted-foreground">
              {isLoading
                ? "Chargement des agences…"
                : `${agences.length} agence${agences.length > 1 ? "s" : ""} disponible${agences.length > 1 ? "s" : ""
                } — rendez-vous sur place ou par téléphone.`}
            </p>
          </div>

          {agences.length > 0 && (
            <div className="relative w-full lg:w-80">
              <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Rechercher une ville, une adresse..."
                aria-label="Rechercher une agence"
                className="h-11 w-full rounded-full border-border bg-background pl-10 pr-4 text-sm shadow-[inset_0_1px_0_rgba(255,255,255,0.06),inset_0_-1px_0_rgba(0,0,0,0.06)] transition-colors focus-visible:border-primary focus-visible:ring-0"
              />
            </div>
          )}
        </div>

        {isLoading ? (
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {[0, 1, 2].map((slot) => (
              <div
                key={slot}
                className="h-56 animate-pulse rounded-2xl border border-border/60 bg-secondary/20"
              />
            ))}
          </div>
        ) : isError ? (
          <EmptyState
            title="Agences indisponibles"
            description="Impossible de charger la liste des agences. Réessayez dans quelques instants ou contactez-nous."
          />
        ) : filteredAgences.length > 0 ? (
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {filteredAgences.map((agence) => (
              <AgencyCard key={agence.id} agence={agence} />
            ))}
          </div>
        ) : (
          <EmptyState
            title={agences.length === 0 ? "Aucune agence pour le moment" : "Aucune agence trouvée"}
            description={
              agences.length === 0
                ? "Aucune agence n'est encore publiée. Ajoutez-en depuis l'administration, rubrique Paramètres → Agences."
                : "Aucun nom, adresse ou numéro ne correspond à votre recherche."
            }
            action={
              search ? (
                <Button variant="outline" size="sm" onClick={() => setSearch("")}>
                  Réinitialiser la recherche
                </Button>
              ) : null
            }
          />
        )}
      </div>
    </section>
  );
}

function EmptyState({
  title,
  description,
  action,
}: {
  title: string;
  description: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="mt-12 flex flex-col items-center justify-center rounded-2xl border border-dashed border-border/60 bg-secondary/20 px-6 py-16 text-center">
      <span className="grid h-12 w-12 place-items-center rounded-full bg-secondary text-muted-foreground">
        {action ? <Search className="h-5 w-5" /> : <Loader2 className="h-5 w-5" />}
      </span>
      <p className="mt-4 font-display text-base font-bold text-foreground">{title}</p>
      <p className="mt-1 max-w-sm text-sm text-muted-foreground">{description}</p>
      {action}
    </div>
  );
}

function AgencyCard({ agence }: { agence: Agence }) {
  const mapsUrl =
    agence.map_url ??
    `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(agence.location)}`;

  return (
    <article className="group flex flex-col rounded-2xl border border-border bg-background p-6 shadow-[inset_0_1px_0_rgba(255,255,255,0.06),inset_0_-1px_0_rgba(0,0,0,0.06),0_1px_2px_rgba(0,0,0,0.03)] transition-all duration-300 hover:-translate-y-1 hover:border-foreground/20 hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.08),inset_0_-1px_0_rgba(0,0,0,0.08),0_12px_32px_rgba(0,0,0,0.08)]">
      <div className="flex items-start justify-between gap-3">
        <h3 className="font-display text-lg font-bold leading-tight text-foreground">
          {agence.name}
        </h3>

        <span className="shrink-0 rounded-full bg-secondary px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
          {agence.is_active ? "Ouverte" : "Fermée"}
        </span>
      </div>

      <div className="my-4 h-px bg-border/60" />

      <div className="flex-1 space-y-3">
        <p className="flex items-start gap-2 text-sm text-muted-foreground">
          <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-foreground/60" />
          {agence.location}
        </p>
        {agence.phone && (
          <p className="flex items-center gap-2 text-sm text-muted-foreground">
            <Phone className="h-4 w-4 shrink-0 text-foreground/60" />
            <a href={`tel:${agence.phone.replace(/\s+/g, "")}`} className="hover:text-foreground">
              {agence.phone}
            </a>
          </p>
        )}
        {agence.hours && (
          <p className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="h-4 w-4 shrink-0 text-foreground/60" />
            {agence.hours}
          </p>
        )}
      </div>

      <div className="mt-5 flex gap-2">
        <Button asChild variant="accent" size="sm" className="flex-1">
          <Link to="/contact">
            Prendre RDV
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </Button>
        <Button asChild variant="outline" size="sm">
          <a href={mapsUrl} target="_blank" rel="noopener noreferrer">
            <Navigation className="h-3.5 w-3.5" />
            Itinéraire
          </a>
        </Button>
      </div>
    </article>
  );
}
