"use client";

import { Link } from "@/lib/router";
import {
  AlertTriangle,
  ArrowRight,
  ImageOff,
  Calendar,
  Fuel,
  Settings2,
  Gauge,
  CheckCircle2,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ImageWithFallback } from "@/components/image-with-fallback";
import { vehicleImageUrl } from "@/lib/image";
import { useFeaturedVehicles } from "@/data/public-store";

const FEATURED_LIMIT = 6;

export function FeaturedVehiclesSection() {
  const { data, isLoading, isError, refetch } = useFeaturedVehicles(FEATURED_LIMIT);
  const featured = data ?? [];

  return (
    <section className="relative bg-white py-16 text-slate-900 lg:py-24 border-t border-slate-100">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">

        {/* ─── Header Réorganisé Lumineux ─── */}
        <div className="mb-14 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            <span className="mb-3 inline-flex items-center gap-2 rounded-full border border-primary/25 bg-primary/10 px-3.5 py-1 text-xs font-bold uppercase tracking-widest text-primary">
              <Sparkles className="h-3.5 w-3.5" />
              03 — Catalogue
            </span>
            <h2 className="mt-2 font-display text-4xl font-black leading-[1.1] tracking-tight text-slate-900 sm:text-5xl md:text-6xl">
              Véhicules{" "}
              <span className="bg-gradient-to-r from-primary via-slate-900 to-accent bg-clip-text text-transparent">
                en vedette.
              </span>
            </h2>
          </div>

          <div className="flex max-w-xs flex-col gap-4 text-sm font-medium leading-relaxed text-slate-600 sm:text-base">
            <p>Une sélection de nos meilleurs modèles disponibles à l'importation cette semaine.</p>

            <Link
              to="/catalogue"
              className="group inline-flex w-fit items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-slate-900 transition-all duration-300 hover:border-slate-900 hover:bg-slate-900 hover:text-white hover:shadow-md"
            >
              Tout le catalogue
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>

        {/* ─── Contenu ─── */}
        {isLoading ? (
          <FeaturedSkeleton />
        ) : isError ? (
          <ErrorState onRetry={() => refetch()} />
        ) : featured.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((v) => (
              <FeaturedVehicleCard key={v.id} vehicle={v} />
            ))}
          </div>
        )}

      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════
   CARTE VÉHICULE EN VEDETTE (LIGHT / WHITE)
   ═══════════════════════════════════════════════════════════ */
type FeaturedVehicle = {
  id: number | string;
  slug?: string | null;
  brand?: string | null;
  model?: string | null;
  year?: number | null;
  energy?: string | null;
  transmission?: string | null;
  mileage_km?: number | null;
  condition?: string | null;
  price_fcfa?: number | null;
  badge?: string | null;
  image?: string | null;
  vehicle_images?: { url?: string | null }[] | null;
  category?: string | null;
  nombre_places?: number | null;
};

function FeaturedVehicleCard({ vehicle }: { vehicle: FeaturedVehicle }) {
  const {
    id,
    brand,
    model,
    year,
    energy,
    transmission,
    mileage_km,
    condition,
    price_fcfa,
    badge,
    category,
    nombre_places,
  } = vehicle;

  const cover = vehicleImageUrl(vehicle);
  const to = `/vehicules/${id}`;

  const specs = [
    { icon: Calendar, label: "Année", value: year ? String(year) : null },
    { icon: Fuel, label: "Énergie", value: energy ?? null },
    { icon: Settings2, label: "Boîte", value: transmission ?? null },
    {
      icon: Gauge,
      label: "Km",
      value:
        typeof mileage_km === "number" ? new Intl.NumberFormat("fr-FR").format(mileage_km) : null,
    },
  ].filter((s) => s.value);

  return (
    <article className="group relative flex flex-col overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-slate-300 hover:shadow-xl">
      {/* ─── Image ─── */}
      <Link to={to} className="relative block aspect-[3/2] overflow-hidden bg-slate-100">
        <ImageWithFallback
          src={cover}
          alt={`${brand ?? ""} ${model ?? ""}`.trim()}
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
        />

        {/* Dégradé d'ombrage bas pour les textes sur l'image */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-slate-900/60 via-slate-900/20 to-transparent" />

        {/* Badges superposés */}
        <div className="absolute left-3 top-3 flex flex-wrap gap-1.5">
          {badge && (
            <span className="rounded-full bg-slate-900/90 px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-wider text-white shadow-sm backdrop-blur-md">
              {badge}
            </span>
          )}
          {category && (
            <span className="rounded-full border border-white/20 bg-white/90 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-900 shadow-sm backdrop-blur-md">
              {category}
            </span>
          )}
        </div>

        {/* Marque en filigrane discret */}
        {brand && (
          <p className="absolute bottom-3 left-3 text-[10px] font-black uppercase tracking-[0.2em] text-white/90">
            {brand}
          </p>
        )}
      </Link>

      {/* ─── Contenu ─── */}
      <div className="flex flex-1 flex-col p-5">
        {/* Titre */}
        <Link to={to} className="block">
          <h3 className="font-display text-lg font-bold leading-tight tracking-tight text-slate-900 transition-colors group-hover:text-primary">
            {model ?? "Véhicule"}
          </h3>
        </Link>

        {/* État + places */}
        <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-slate-500">
          {condition && (
            <span className="inline-flex items-center gap-1 font-semibold text-emerald-600">
              <CheckCircle2 className="h-3.5 w-3.5" />
              {condition}
            </span>
          )}
          {typeof nombre_places === "number" && (
            <>
              {condition && <span className="h-1 w-1 rounded-full bg-slate-300" />}
              <span>{nombre_places} places</span>
            </>
          )}
        </div>

        {/* ═══════ CARACTÉRISTIQUES ═══════ */}
        {specs.length > 0 && (
          <div className="mt-4 grid grid-cols-2 gap-2">
            {specs.map((s, i) => {
              const Icon = s.icon;
              return (
                <div
                  key={i}
                  className="flex items-center gap-2 rounded-xl border border-slate-100 bg-slate-50 px-2.5 py-2"
                >
                  <span className="grid h-7 w-7 shrink-0 place-items-center rounded-lg border border-slate-200 bg-white text-slate-700 shadow-xs">
                    <Icon className="h-3.5 w-3.5" />
                  </span>
                  <div className="min-w-0">
                    <p className="text-[9px] font-bold uppercase tracking-wider text-slate-400">
                      {s.label}
                    </p>
                    <p className="truncate text-xs font-semibold text-slate-800">{s.value}</p>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* ─── Prix + CTA ─── */}
        <div className="mt-5 border-t border-slate-100 pt-4">
          <div className="flex items-end justify-between gap-3">
            <div className="min-w-0">
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Prix livré
              </p>
              <p className="mt-0.5 font-display text-lg font-black tracking-tight text-slate-900">
                {typeof price_fcfa === "number"
                  ? new Intl.NumberFormat("fr-FR", {
                    style: "currency",
                    currency: "XOF",
                    maximumFractionDigits: 0,
                  }).format(price_fcfa)
                  : "Sur demande"}
              </p>
            </div>
          </div>

          {/* CTA pleine largeur */}
          <Link
            to={to}
            className="group/cta mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-3 text-xs font-bold uppercase tracking-wider text-white shadow-md shadow-emerald-600/20 transition-all hover:-translate-y-0.5 hover:bg-emerald-700 hover:shadow-lg hover:shadow-emerald-600/30"
          >
            Commander ce modèle
            <ArrowRight className="h-4 w-4 transition-transform group-hover/cta:translate-x-1" />
          </Link>
        </div>
      </div>
    </article>
  );
}

/* ═══════════════════════════════════════════════════════════
   ÉTATS
   ═══════════════════════════════════════════════════════════ */

function ErrorState({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="mt-8 flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-6 py-16 text-center">
      <span className="grid h-12 w-12 place-items-center rounded-full bg-red-50 text-red-600">
        <AlertTriangle className="h-5 w-5" />
      </span>
      <p className="font-display text-base font-bold text-slate-900">
        Impossible de charger les véhicules
      </p>
      <p className="max-w-sm text-sm text-slate-500">
        Le catalogue n'a pas pu être contacté. Réessayez dans un instant.
      </p>
      <Button variant="outline" size="sm" className="mt-2 border-slate-300 text-slate-700 hover:bg-slate-100" onClick={onRetry}>
        Réessayer
      </Button>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="mt-8 flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-6 py-16 text-center">
      <span className="grid h-12 w-12 place-items-center rounded-full bg-slate-100 text-slate-400">
        <ImageOff className="h-5 w-5" />
      </span>
      <p className="font-display text-base font-bold text-slate-900">Aucun véhicule en vedette</p>
      <p className="max-w-sm text-sm text-slate-500">
        Les véhicules mis en avant apparaîtront ici prochainement.
      </p>
    </div>
  );
}

function FeaturedSkeleton() {
  return (
    <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: FEATURED_LIMIT }).map((_, i) => (
        <div key={i} className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white" aria-hidden="true">
          <div className="aspect-[3/2] animate-pulse bg-slate-100" />
          <div className="space-y-3 p-5">
            <div className="h-5 w-32 animate-pulse rounded bg-slate-100" />
            <div className="h-3 w-24 animate-pulse rounded bg-slate-100" />
            <div className="grid grid-cols-2 gap-2 pt-1">
              {Array.from({ length: 4 }).map((__, j) => (
                <div
                  key={j}
                  className="flex items-center gap-2 rounded-xl border border-slate-100 bg-slate-50 px-2.5 py-2"
                >
                  <div className="h-7 w-7 shrink-0 animate-pulse rounded-lg bg-slate-200" />
                  <div className="min-w-0 flex-1 space-y-1">
                    <div className="h-2 w-10 animate-pulse rounded bg-slate-200" />
                    <div className="h-2.5 w-14 animate-pulse rounded bg-slate-200" />
                  </div>
                </div>
              ))}
            </div>
            <div className="pt-4">
              <div className="h-7 w-24 animate-pulse rounded bg-slate-100" />
              <div className="mt-4 h-11 w-full animate-pulse rounded-xl bg-slate-100" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}