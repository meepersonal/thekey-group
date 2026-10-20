import { useMemo, useState } from "react";
import {
  ArrowRight,
  Clock,
  Loader2,
  MapPin,
  Navigation,
  Phone,
  Search,
  Building2,
  MessageCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link } from "@/lib/router";
import { usePublicAgences } from "@/data/public-store";
import type { Agence } from "@/lib/api";

export function AgenciesSection() {
  const { data: agences = [], isLoading, isError } = usePublicAgences();
  const [search, setSearch] = useState("");

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
    <section
      id="agences"
      className="relative overflow-hidden border-t border-black/10 bg-white py-16 text-black sm:py-20 lg:py-32"
    >
      <div className="relative z-10 mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">

        {/* ═══════════════════════════════════════════
            HEADER
           ═══════════════════════════════════════════ */}
        <div className="mb-4 sm:mb-6 md:mb-8">
          <span className="block text-xs font-bold uppercase tracking-widest text-primary sm:text-sm">
            05 — Nos agences
          </span>
          <h2 className="mt-3 font-display text-3xl font-black leading-tight tracking-tight text-black sm:text-4xl md:text-5xl lg:text-6xl">
            Retrouvez-nous près de chez vous.
          </h2>
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-zinc-600 sm:text-lg">
            Découvrez nos agences à travers le monde. Un interlocuteur unique, un suivi
            transparent et un SAV local pour importer votre véhicule en toute sérénité.
          </p>
        </div>

        {/* ─── Recherche ─── */}
        {agences.length > 0 && (
          <div className="mb-10 max-w-md">
            <div className="relative">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-black/40" />
              <Input
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Rechercher une ville, une adresse..."
                aria-label="Rechercher une agence"
                className="h-12 w-full rounded-full border border-black/15 bg-white pl-11 pr-4 text-sm text-black transition-colors placeholder:text-black/40 focus-visible:border-primary focus-visible:ring-0"
              />
            </div>
            <p className="mt-3 text-xs text-black/50">
              <span className="font-semibold text-black">{filteredAgences.length}</span>{" "}
              {filteredAgences.length > 1 ? "agences disponibles" : "agence disponible"}
            </p>
          </div>
        )}

        {/* ─── Contenu ─── */}
        {isLoading ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {[0, 1, 2, 3, 4, 5].map((slot) => (
              <div
                key={slot}
                className="h-64 animate-pulse rounded-2xl border border-black/10 bg-black/5"
              />
            ))}
          </div>
        ) : isError ? (
          <EmptyState
            title="Agences indisponibles"
            description="Impossible de charger la liste des agences. Réessayez dans quelques instants ou contactez-nous."
            icon={<Building2 className="h-5 w-5" />}
          />
        ) : filteredAgences.length > 0 ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {filteredAgences.map((agence) => (
              <AgencyCard key={agence.id} agence={agence} />
            ))}
          </div>
        ) : (
          <EmptyState
            title={
              agences.length === 0
                ? "Aucune agence pour le moment"
                : "Aucune agence trouvée"
            }
            description={
              agences.length === 0
                ? "Aucune agence n'est encore publiée. Ajoutez-en depuis l'administration, rubrique Paramètres → Agences."
                : "Aucun nom, adresse ou numéro ne correspond à votre recherche."
            }
            icon={<Search className="h-5 w-5" />}
            action={
              search ? (
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-4 rounded-full border-black/20 text-black hover:border-black hover:bg-black hover:text-white"
                  onClick={() => setSearch("")}
                >
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

/* ═══════════════════════════════════════════════════════════
   HELPERS
   ═══════════════════════════════════════════════════════════ */

/**
 * Normalise un numéro de téléphone pour WhatsApp :
 * - retire tout sauf les chiffres
 * - ajoute l'indicatif pays si nécessaire
 */
function normalizeWhatsAppNumber(phone: string, defaultCountryCode = "229"): string {
  const digits = phone.replace(/\D/g, "");

  // Si le numéro commence déjà par l'indicatif (ex: 229…), on le garde
  if (digits.startsWith(defaultCountryCode)) {
    return digits;
  }

  // Sinon on l'ajoute
  return `${defaultCountryCode}${digits}`;
}

/**
 * Construit le lien WhatsApp avec message pré-rempli
 */
function buildWhatsAppUrl(phone: string, agenceName: string): string {
  const number = normalizeWhatsAppNumber(phone);
  const message = `Bonjour ${agenceName}, je souhaite prendre un rendez-vous pour importer un véhicule. Pourriez-vous m'indiquer vos disponibilités ? Merci.`;
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
}

/* ═══════════════════════════════════════════════════════════
   ÉTAT VIDE
   ═══════════════════════════════════════════════════════════ */
function EmptyState({
  title,
  description,
  icon,
  action,
}: {
  title: string;
  description: string;
  icon?: React.ReactNode;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-black/15 bg-black/[0.02] px-6 py-16 text-center">
      <span className="grid h-12 w-12 place-items-center rounded-full bg-white text-black/40 ring-1 ring-black/10">
        {icon ?? <Loader2 className="h-5 w-5" />}
      </span>
      <p className="mt-4 font-display text-base font-bold text-black">{title}</p>
      <p className="mt-1 max-w-sm text-sm text-black/50">{description}</p>
      {action}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   CARTE AGENCE
   ═══════════════════════════════════════════════════════════ */
function AgencyCard({ agence }: { agence: Agence }) {
  const mapsUrl =
    agence.map_url ??
    `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(agence.location)}`;

  const isOpen = agence.is_active;
  const hasPhone = Boolean(agence.phone);

  // URL WhatsApp avec message pré-rempli
  const whatsappUrl = hasPhone
    ? buildWhatsAppUrl(agence.phone!, agence.name)
    : null;

  return (
    <article className="group relative flex flex-col overflow-hidden rounded-2xl border border-black/10 bg-white p-6 transition-all duration-300 hover:-translate-y-1 hover:border-black hover:shadow-xl">
      <div className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-primary/10 opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-100" />

      <div className="relative flex items-start justify-between gap-3">
        <div className="flex min-w-0 flex-1 items-center gap-2.5">
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-black text-primary">
            <Building2 className="h-4 w-4" />
          </span>
          <h3 className="truncate font-display text-lg font-bold leading-tight tracking-tight text-black">
            {agence.name}
          </h3>
        </div>

        <span
          className={`shrink-0 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider ${isOpen ? "bg-primary text-white" : "bg-black/5 text-black/50"
            }`}
        >
          {isOpen ? "Ouverte" : "Fermée"}
        </span>
      </div>

      <div className="relative my-5 h-px bg-black/10" />

      <div className="relative flex-1 space-y-3">
        <p className="flex items-start gap-2.5 text-sm leading-relaxed text-black/70">
          <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-black/40" />
          <span>{agence.location}</span>
        </p>

        {agence.phone && (
          <p className="flex items-center gap-2.5 text-sm text-black/70">
            <Phone className="h-4 w-4 shrink-0 text-black/40" />
            <a
              href={`tel:${agence.phone.replace(/\s+/g, "")}`}
              className="font-medium transition-colors hover:text-primary"
            >
              {agence.phone}
            </a>
          </p>
        )}

        {agence.hours && (
          <p className="flex items-center gap-2.5 text-sm text-black/70">
            <Clock className="h-4 w-4 shrink-0 text-black/40" />
            <span>{agence.hours}</span>
          </p>
        )}
      </div>

      <div className="relative mt-6 flex gap-2">
        {/* ─── Bouton Prendre RDV (WhatsApp) ─── */}
        {whatsappUrl ? (
          <Button
            asChild
            variant="accent"
            size="sm"
            className="group/cta flex-1 rounded-full bg-emerald-600 font-display text-xs font-bold tracking-wide text-white hover:bg-emerald-700"
          >
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-1.5"
              aria-label={`Prendre rendez-vous avec ${agence.name} sur WhatsApp`}
            >
              <MessageCircle className="h-3.5 w-3.5" />
              Prendre RDV
              <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover/cta:translate-x-0.5" />
            </a>
          </Button>
        ) : (
          // Fallback si pas de numéro
          <Button
            asChild
            variant="outline"
            size="sm"
            className="flex-1 rounded-full border border-black/20 bg-white font-display text-xs font-bold tracking-wide text-black hover:border-black hover:bg-black hover:text-white"
          >
            <Link to="/contact" className="inline-flex items-center justify-center gap-1.5">
              Nous contacter
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </Button>
        )}

        {/* ─── Bouton Itinéraire ─── */}
        <Button
          asChild
          variant="outline"
          size="sm"
          className="rounded-full border border-black/20 bg-white font-display text-xs font-bold tracking-wide text-black hover:border-black hover:bg-black hover:text-white"
        >
          <a
            href={mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-1.5"
          >
            <Navigation className="h-3.5 w-3.5" />
            Itinéraire
          </a>
        </Button>
      </div>
    </article>
  );
}