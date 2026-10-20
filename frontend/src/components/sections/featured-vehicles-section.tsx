"use client";

import { useEffect, useMemo, useState } from "react";
import { Link } from "@/lib/router";
import {
  AlertTriangle,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Car,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { vehicleImageUrl } from "@/lib/image";
import { useFeaturedVehicles, usePublicVehicles } from "@/data/public-store";

const FEATURED_LIMIT = 6; // 3 par ligne x 2 lignes

export function FeaturedVehiclesSection() {
  const {
    data: featuredData,
    isLoading: featuredLoading,
    isError: featuredError,
    refetch: refetchFeatured,
  } = useFeaturedVehicles(FEATURED_LIMIT);
  const featured = featuredData ?? [];

  const {
    data: latestVehicles,
    isLoading: latestLoading,
    isError: latestError,
    refetch: refetchLatest,
  } = usePublicVehicles({
    per_page: String(FEATURED_LIMIT),
    sort: "-created_at",
  });
  const latest = latestVehicles ?? [];

  const vehicles = featured.length > 0 ? featured : latest;
  const isLoading = featuredLoading || (featured.length === 0 && latestLoading);
  const isError = featuredError || (featured.length === 0 && latestError);
  const refetch = featured.length > 0 ? refetchFeatured : refetchLatest;
  const isFallback = featured.length === 0 && latest.length > 0;

  return (
    <section className="relative bg-white py-16 text-gray-900 lg:py-24 border-t border-gray-200">

      <style dangerouslySetInnerHTML={{
        __html: `
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animated-card {
          opacity: 0;
          animation: fadeInUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}} />

      <div className="mx-auto max-w-[1400px] px-4 lg:px-8">

        {/* Header (INCHANGÉ) */}
        <div className="mb-12 sm:mb-16">
          <span className="block text-xs font-bold uppercase tracking-widest text-emerald-600 sm:text-sm">
            01 — Véhicules en vedette
          </span>
          <h2 className="mt-3 font-display text-3xl font-black leading-tight tracking-tight text-black sm:text-4xl md:text-5xl">
            Notre sélection du moment
          </h2>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-gray-500">
            Une sélection de modèles vérifiés, disponibles immédiatement à l'importation — prix transparents, état contrôlé, livraison suivie.
          </p>
        </div>

        {/* Grille */}
        {isLoading ? (
          <FeaturedSkeleton />
        ) : isError ? (
          <ErrorState onRetry={() => refetch()} />
        ) : vehicles.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 border-t border-l border-gray-200">
            {vehicles.slice(0, FEATURED_LIMIT).map((v, index) => (
              <FeaturedVehicleCard key={v.id} vehicle={v} index={index} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════
   CARTE VÉHICULE - Hauteur équilibrée
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

function FeaturedVehicleCard({ vehicle, index }: { vehicle: FeaturedVehicle; index: number }) {
  const { id, brand, model, year, energy, transmission, mileage_km, condition, price_fcfa, badge } = vehicle;
  const to = `/vehicules/${id}`;

  const images = useMemo(() => {
    const list: string[] = [];
    const main = vehicleImageUrl(vehicle);
    if (main) list.push(main);
    if (Array.isArray(vehicle.vehicle_images)) {
      vehicle.vehicle_images.forEach((img) => {
        if (img?.url && !list.includes(img.url)) list.push(img.url);
      });
    }
    return list.filter(Boolean);
  }, [vehicle]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const hasMultiple = images.length > 1;

  useEffect(() => { setCurrentIndex(0); }, [vehicle.id]);

  const goPrev = (e: React.MouseEvent) => { e.preventDefault(); e.stopPropagation(); setCurrentIndex((i) => (i - 1 + images.length) % images.length); };
  const goNext = (e: React.MouseEvent) => { e.preventDefault(); e.stopPropagation(); setCurrentIndex((i) => (i + 1) % images.length); };

  const specs = [
    { label: "Année", value: year ? String(year) : null },
    { label: "Énergie", value: energy ?? null },
    { label: "Km", value: typeof mileage_km === "number" ? new Intl.NumberFormat("fr-FR").format(mileage_km) : null },
  ].filter((s) => s.value);

  return (
    <article
      className="animated-card flex flex-col border-r border-b border-gray-200 bg-white group h-full transition-all duration-300 hover:shadow-[0_10px_40px_-10px_rgba(0,0,0,0.1)] hover:-translate-y-1 hover:z-10 relative"
      style={{ animationDelay: `${index * 80}ms` }}
    >
      <Link to={to} className="flex flex-col flex-1 h-full">

        {/* 1. EN-TÊTE (Hauteur moyenne) */}
        <div className="p-4 pb-0 h-[76px] flex flex-col justify-start">
          <p className="text-[12px] text-gray-500 mb-0.5 line-clamp-1">
            {condition || brand || "Véhicule en vedette"}
          </p>
          <h3 className="text-[20px] font-black text-black uppercase tracking-tight leading-none mt-0.5 line-clamp-2 transition-colors duration-300 group-hover:text-emerald-600">
            {model || "Modèle"}
          </h3>
        </div>

        {/* 2. IMAGE (Ratio standard) */}
        <div className="px-4 mt-2">
          <div className="relative aspect-[4/3] w-full rounded-xl overflow-hidden bg-gray-50 flex items-center justify-center p-2">
            {images.length > 0 ? (
              images.map((url, i) => (
                <img
                  key={url}
                  src={url}
                  alt={`${brand ?? ""} ${model ?? ""}`.trim()}
                  loading={i === 0 ? "eager" : "lazy"}
                  className={
                    "absolute max-h-full max-w-full object-contain mix-blend-multiply transition-all duration-500 ease-out " +
                    (i === currentIndex
                      ? "opacity-100 scale-100 group-hover:scale-110"
                      : "pointer-events-none opacity-0 scale-105")
                  }
                />
              ))
            ) : (
              <Car className="h-14 w-14 text-gray-300" />
            )}

            {hasMultiple && (
              <>
                <button type="button" onClick={goPrev} aria-label="Précédent" className="absolute left-1.5 top-1/2 z-20 grid h-7 w-7 -translate-y-1/2 place-items-center rounded-full bg-white/80 text-gray-900 opacity-0 shadow-sm transition-all duration-300 hover:scale-110 group-hover:opacity-100">
                  <ChevronLeft className="h-3.5 w-3.5" />
                </button>
                <button type="button" onClick={goNext} aria-label="Suivant" className="absolute right-1.5 top-1/2 z-20 grid h-7 w-7 -translate-y-1/2 place-items-center rounded-full bg-white/80 text-gray-900 opacity-0 shadow-sm transition-all duration-300 hover:scale-110 group-hover:opacity-100">
                  <ChevronRight className="h-3.5 w-3.5" />
                </button>
              </>
            )}

            {badge && (
              <span className="absolute top-2 left-2 z-20 bg-white/90 backdrop-blur text-[9px] font-bold uppercase tracking-wider text-gray-800 px-2 py-0.5 rounded shadow-sm">
                {badge}
              </span>
            )}
          </div>
        </div>

        {/* 3. SPÉCIFICATIONS (3 lignes équilibrées) */}
        <div className="p-4 pt-3 mt-auto space-y-2 border-t border-gray-100 flex-1">
          {specs.map((spec, i) => (
            <div key={i} className="flex justify-between items-center text-[12px] border-b border-gray-50 pb-1.5 last:border-0 last:pb-0">
              <span className="text-gray-500">{spec.label}</span>
              <span className="font-bold text-black text-right">{spec.value}</span>
            </div>
          ))}
        </div>

        {/* 4. PRIX + BOUTON */}
        <div className="p-4 pt-0 mt-auto">
          <div className="flex items-end justify-between mb-3">
            <div>
              <p className="text-[9px] font-bold uppercase tracking-wider text-gray-400">Prix</p>
              <p className="font-black text-[15px] text-black">
                {typeof price_fcfa === "number"
                  ? new Intl.NumberFormat("fr-FR", { style: "currency", currency: "XOF", maximumFractionDigits: 0 }).format(price_fcfa)
                  : "Sur demande"}
              </p>
            </div>
          </div>
          <div className="w-full flex items-center justify-between bg-gray-50 text-black border border-gray-200 rounded-lg px-4 py-2.5 text-[12px] font-bold uppercase tracking-wider transition-all duration-300 group-hover:bg-emerald-600 group-hover:text-white group-hover:border-emerald-600 group-hover:shadow-lg group-hover:shadow-emerald-600/20">
            <span>Commander</span>
            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
          </div>
        </div>
      </Link>
    </article>
  );
}

/* ═══════════════════════════════════════════════════════════
   ÉTATS & SKELETON
   ═══════════════════════════════════════════════════════════ */
function ErrorState({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 border border-gray-300 px-6 py-16 text-center">
      <AlertTriangle className="h-8 w-8 text-red-500" />
      <p className="font-bold text-black uppercase">Chargement impossible</p>
      <p className="max-w-sm text-sm text-gray-500">Le catalogue n'a pas pu être contacté.</p>
      <Button variant="outline" size="sm" className="mt-2 rounded-none border-black text-black hover:bg-emerald-600 hover:border-emerald-600 hover:text-white uppercase text-xs font-bold transition-all duration-300" onClick={onRetry}>
        Réessayer
      </Button>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center gap-3 border border-gray-300 px-6 py-16 text-center">
      <Car className="h-8 w-8 text-gray-400" />
      <p className="font-bold text-black uppercase">Aucun véhicule en vedette</p>
    </div>
  );
}

function FeaturedSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 border-t border-l border-gray-200">
      {Array.from({ length: FEATURED_LIMIT }).map((_, i) => (
        <div key={i} className="border-r border-b border-gray-200 bg-white h-full flex flex-col">
          <div className="p-4 pb-0 h-[76px] flex flex-col justify-start space-y-2">
            <div className="h-2.5 w-1/2 bg-gray-100 rounded-sm animate-pulse" />
            <div className="h-5 w-3/4 bg-gray-100 rounded-sm animate-pulse" />
          </div>
          <div className="px-4 mt-2">
            <div className="aspect-[4/3] w-full bg-gray-50 rounded-xl animate-pulse" />
          </div>
          <div className="p-4 pt-3 flex-1 space-y-3 border-t border-gray-100">
            {Array.from({ length: 3 }).map((_, j) => (
              <div key={j} className="flex justify-between">
                <div className="h-2.5 w-12 bg-gray-100 rounded-sm animate-pulse" />
                <div className="h-2.5 w-16 bg-gray-100 rounded-sm animate-pulse" />
              </div>
            ))}
          </div>
          <div className="p-4 pt-0 mt-auto">
            <div className="w-full h-10 bg-gray-50 animate-pulse rounded-lg" />
          </div>
        </div>
      ))}
    </div>
  );
}