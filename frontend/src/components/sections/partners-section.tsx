import { useMemo } from "react";
import { usePublicBrands } from "@/data/public-store";

/** Nombre minimal d'items pour que le bandeau défile sur un écran large. */
const MIN_MARQUEE_ITEMS = 10;
const MAX_REPEATS = 6;

export function PartnersSection() {
  const { data: brands = [], isLoading, isError } = usePublicBrands();

  const activeBrands = useMemo(() => brands.filter((brand) => brand.is_active !== false), [brands]);

  // Bandeau sans fin : on répète la liste si elle est trop courte pour remplir l'écran.
  const items = useMemo(() => {
    if (activeBrands.length === 0) return [];
    const repeats = Math.min(
      MAX_REPEATS,
      Math.max(2, Math.ceil(MIN_MARQUEE_ITEMS / activeBrands.length)),
    );
    return Array.from({ length: repeats }, () => activeBrands).flat();
  }, [activeBrands]);

  if (!isLoading && !isError && activeBrands.length === 0) return null;

  return (
    <section className="border-y border-border/60 bg-secondary/40 py-10">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <div className="text-center">
          <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-muted-foreground">
            Marques importées de Chine
          </p>
          <h2 className="mt-3 font-display text-xl font-extrabold tracking-tight sm:text-2xl">
            Les plus grands constructeurs chinois
          </h2>
          {!isLoading && !isError && (
            <p className="mt-2 text-sm text-muted-foreground">
              {activeBrands.length} marque{activeBrands.length > 1 ? "s" : ""} disponible
              {activeBrands.length > 1 ? "s" : ""} au catalogue
            </p>
          )}
        </div>
      </div>

      <div className="relative mt-6 overflow-hidden">
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-secondary/80 to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-secondary/80 to-transparent" />

        <div className="flex w-max animate-marquee gap-12 px-6">
          {isLoading
            ? Array.from({ length: 8 }, (_, index) => (
                <span
                  key={`skeleton-${index}`}
                  aria-hidden="true"
                  className="h-7 w-28 animate-pulse rounded-md bg-foreground/5"
                />
              ))
            : items.map((brand, index) => (
                <span
                  key={`${brand.id}-${index}`}
                  title={brand.origin ?? brand.name}
                  className="font-display text-xl font-extrabold tracking-tight text-muted-foreground/70 transition-colors hover:text-foreground sm:text-2xl"
                >
                  {brand.name}
                </span>
              ))}
        </div>
      </div>
    </section>
  );
}
