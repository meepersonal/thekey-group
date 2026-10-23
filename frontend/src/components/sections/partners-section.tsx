import { useMemo } from "react";
import { usePublicBrands } from "@/data/public-store";
import { ArrowRight } from "lucide-react";

export function PartnersSection() {
  const { data: brands = [], isLoading, isError } = usePublicBrands();

  // Tri alphabétique + filtrage des marques actives
  const activeBrands = useMemo(() => {
    return brands
      .filter((brand) => brand.is_active !== false)
      .sort((a, b) => a.name.localeCompare(b.name, "fr", { sensitivity: "base" }));
  }, [brands]);

  if (!isLoading && !isError && activeBrands.length === 0) return null;

  return (
    <section className="relative border-y border-border/40 bg-background py-20 overflow-hidden">
      {/* Décor de fond subtil */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />

      <div className="relative mx-auto max-w-7xl px-4 lg:px-8">

        {/* --- EN-TÊTE --- */}
        <div className="mb-12 sm:mb-16">
          <span className="block text-xs font-bold uppercase tracking-widest text-emerald-600 sm:text-sm">
            01 — Catalogue de modèles
          </span>
          <h2 className="mt-3 font-display text-3xl font-black leading-tight tracking-tight text-black sm:text-4xl md:text-5xl">
            Les marques que nous exportons
          </h2>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-gray-500">
            {isLoading || isError
              ? "Chargement du catalogue..."
              : `Découvrez les ${activeBrands.length} marque${activeBrands.length > 1 ? "s" : ""} de véhicules et d'équipements que nous exportons vers vos marchés.`
            }
          </p>
        </div>

        {/* --- GRILLE DE CARTES --- */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">

          {/* SKELETONS DE CHARGEMENT */}
          {isLoading &&
            Array.from({ length: 8 }, (_, index) => (
              <div
                key={`skeleton-${index}`}
                className="flex flex-col justify-between rounded-3xl border border-border/50 bg-card p-6 shadow-sm h-[260px] animate-pulse"
              >
                <div className="flex items-center gap-4">
                  <div className="h-14 w-14 rounded-2xl bg-muted" />
                  <div className="h-6 w-32 rounded-md bg-muted" />
                </div>
                <div className="space-y-2">
                  <div className="h-4 w-full rounded bg-muted" />
                  <div className="h-4 w-2/3 rounded bg-muted" />
                </div>
                <div className="h-12 w-full rounded-xl bg-muted" />
              </div>
            ))}

          {/* CARTES DES MARQUES */}
          {!isLoading && !isError && activeBrands.map((brand) => (
            <div
              key={brand.id}
              className="group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-border/60 bg-white p-6 transition-all duration-500 ease-out hover:-translate-y-1.5 hover:border-primary hover:bg-primary hover:shadow-2xl hover:shadow-primary/20"
            >
              <div className="relative z-10">
                {/* Icône / Logo */}
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-secondary/40 text-muted-foreground mb-6 transition-all duration-300 group-hover:scale-105 group-hover:bg-white/20 group-hover:text-white">
                  {brand.logo_url ? (
                    <img
                      src={brand.logo_url}
                      alt={brand.name}
                      className="h-8 w-8 object-contain transition-all duration-300 group-hover:brightness-0 group-hover:invert"
                    />
                  ) : (
                    <span className="text-xl font-black font-display">
                      {brand.name.charAt(0).toUpperCase()}
                    </span>
                  )}
                </div>

                {/* Titre et Description */}
                <h3 className="font-display text-xl font-bold tracking-tight text-foreground mb-2 transition-colors duration-300 group-hover:text-white">
                  {brand.name}
                </h3>
                <p className="text-sm text-muted-foreground line-clamp-2 transition-colors duration-300 group-hover:text-white/80">
                  Véhicules et équipements {brand.name} disponibles à l&apos;export.
                </p>
              </div>

              {/* Bouton d'action */}
              <div className="relative z-10 mt-8">
                <a
                  href={`/vehicules?marque=${brand.id}`}
                  className="flex w-full items-center justify-between rounded-xl bg-secondary/50 px-5 py-3 text-sm font-semibold text-foreground transition-all duration-300 group-hover:bg-white group-hover:text-primary"
                >
                  <span>Voir les véhicules</span>
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-black/5 transition-colors group-hover:bg-primary/10">
                    <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
                  </div>
                </a>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}