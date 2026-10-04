import { useEffect, useMemo, useState } from "react";
import {
  Search,
  SlidersHorizontal,
  ChevronLeft,
  ChevronRight,
  Car,
  ArrowRight,
  AlertTriangle,
  Calendar,
  Fuel,
  Settings2,
  Gauge,
  CheckCircle2,
  X,
} from "lucide-react";
import { Link } from "@/lib/router";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { usePublicBrands, usePublicCategories, usePublicVehiclesPage } from "@/data/public-store";
import { formatFcfa } from "@/data/vehicles";
import { ImageWithFallback } from "@/components/image-with-fallback";
import { vehicleImageUrl } from "@/lib/image";

const MAX_PRICE = 30000000;
const ITEMS_PER_PAGE = 9;

type CatalogueVehicle = {
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

const FIELD_CLASS =
  "h-11 w-full rounded-md border border-input bg-background px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-accent/50";

export function CataloguePage() {
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [brand, setBrand] = useState("");
  const [category, setCategory] = useState("");
  const [maxPrice, setMaxPrice] = useState(MAX_PRICE);
  const [page, setPage] = useState(1);

  useEffect(() => {
    const timer = setTimeout(() => {
      setSearch(searchInput.trim());
      setPage(1);
    }, 350);
    return () => clearTimeout(timer);
  }, [searchInput]);

  const params = useMemo(() => {
    const query: Record<string, string> = { per_page: String(ITEMS_PER_PAGE), page: String(page) };
    if (search) query["search"] = search;
    if (brand) query["brand"] = brand;
    if (category) query["category"] = category;
    if (maxPrice < MAX_PRICE) query["max_price"] = String(maxPrice);
    return query;
  }, [search, brand, category, maxPrice, page]);

  const { data: vehicles, isLoading, isError, isFetching } = usePublicVehiclesPage(params);
  const { data: brands } = usePublicBrands();
  const { data: categories } = usePublicCategories();

  const results = vehicles?.data ?? [];
  const meta = vehicles?.meta;
  const total = meta?.total ?? 0;
  const totalPages = meta?.last_page ?? 1;
  const currentPage = meta?.current_page ?? page;

  const updateFilter =
    <T,>(setter: (v: T) => void) =>
    (value: T) => {
      setter(value);
      setPage(1);
    };

  const resetFilters = () => {
    setSearchInput("");
    setSearch("");
    setBrand("");
    setCategory("");
    setMaxPrice(MAX_PRICE);
    setPage(1);
  };

  const hasActiveFilters =
    Boolean(search) || Boolean(brand) || Boolean(category) || maxPrice < MAX_PRICE;

  return (
    <div>
      {/* ═══════════════════════════════════════════════════════
          HERO — aligné sur le style FeaturedVehiclesSection
      ═══════════════════════════════════════════════════════ */}
      <section className="bg-gradient-navy py-14 text-navy-foreground lg:py-20">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <span className="mb-4 block text-sm font-medium uppercase tracking-wider text-navy-foreground/60">
            01 — Catalogue
          </span>
          <h1 className="font-display text-4xl font-bold leading-[1.1] tracking-tight sm:text-5xl lg:text-7xl">
            Catalogue de véhicules.
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-navy-foreground/75 sm:text-lg">
            Des modèles chinois neufs et d'occasion certifiée, livrés au Port de Cotonou.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12 lg:px-8 lg:py-16">
        {/* ═══════════════════════════════════════════════════════
            FILTRES
        ═══════════════════════════════════════════════════════ */}
        <div className="surface-card rounded-2xl border border-border p-5 sm:p-6">
          {/* Ligne 1 : Recherche + Marque + Catégorie */}
          <div className="grid items-end gap-4 md:grid-cols-2 lg:grid-cols-4">
            <div className="lg:col-span-2">
              <Label
                htmlFor="q"
                className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-muted-foreground"
              >
                <SlidersHorizontal className="h-3.5 w-3.5" /> Recherche
              </Label>
              <div className="relative mt-2">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="q"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  placeholder="Marque ou modèle (BYD, Jetour…)"
                  className={"pl-9 " + FIELD_CLASS}
                />
                {searchInput && (
                  <button
                    type="button"
                    onClick={() => setSearchInput("")}
                    aria-label="Effacer la recherche"
                    className="absolute right-2.5 top-1/2 grid h-6 w-6 -translate-y-1/2 place-items-center rounded-md text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>
            </div>

            <div>
              <Label
                htmlFor="brand"
                className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground"
              >
                Marque
              </Label>
              <select
                id="brand"
                value={brand}
                onChange={(e) => updateFilter(setBrand)(e.target.value)}
                className={"mt-2 " + FIELD_CLASS}
              >
                <option value="">Toutes les marques</option>
                {brands?.map((b) => (
                  <option key={b.id} value={b.name}>
                    {b.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <Label
                htmlFor="cat"
                className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground"
              >
                Catégorie
              </Label>
              <select
                id="cat"
                value={category}
                onChange={(e) => updateFilter(setCategory)(e.target.value)}
                className={"mt-2 " + FIELD_CLASS}
              >
                <option value="">Toutes les catégories</option>
                {categories?.map((c) => (
                  <option key={c.id} value={c.name}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Ligne 2 : Budget */}
          <div className="mt-5 border-t border-border/60 pt-5">
            <div className="flex items-center justify-between">
              <Label className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                Budget maximum
              </Label>
              <span className="font-display text-base font-extrabold text-slate-900">
                {formatFcfa(maxPrice)}
              </span>
            </div>
            <Slider
              value={[maxPrice]}
              onValueChange={(v) => {
                setMaxPrice(v[0] ?? MAX_PRICE);
                setPage(1);
              }}
              min={0}
              max={MAX_PRICE}
              step={500000}
              className="mt-4"
            />
          </div>
        </div>

        {/* ═══════════════════════════════════════════════════════
            RÉSULTATS + RÉINITIALISER
        ═══════════════════════════════════════════════════════ */}
        <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm text-muted-foreground">
            {isLoading ? (
              "Chargement des véhicules…"
            ) : (
              <>
                <span className="font-display font-extrabold text-slate-900">{total}</span> véhicule
                {total > 1 ? "s" : ""} correspondant à votre recherche
              </>
            )}
          </p>

          {hasActiveFilters && (
            <button
              type="button"
              onClick={resetFilters}
              className="inline-flex items-center gap-1.5 rounded-full border border-border bg-white px-3.5 py-1.5 text-xs font-semibold text-slate-700 transition-all hover:border-slate-400 hover:bg-slate-50"
            >
              <X className="h-3.5 w-3.5" />
              Réinitialiser les filtres
            </button>
          )}
        </div>

        {/* ═══════════════════════════════════════════════════════
            CONTENU
        ═══════════════════════════════════════════════════════ */}
        {isError ? (
          <ErrorState />
        ) : isLoading ? (
          <CatalogueSkeleton count={ITEMS_PER_PAGE} />
        ) : results.length ? (
          <>
            <div
              className={
                "mt-6 grid gap-6 transition-opacity duration-300 sm:grid-cols-2 lg:grid-cols-3 " +
                (isFetching ? "opacity-60" : "opacity-100")
              }
            >
              {results.map((v) => (
                <CatalogueVehicleCard key={v.id} vehicle={v} />
              ))}
            </div>

            {/* ═══════════════════════════════════════════════════
                PAGINATION
            ═══════════════════════════════════════════════════ */}
            {totalPages > 1 && (
              <div className="mt-12 flex flex-col items-center justify-between gap-4 sm:flex-row">
                <p className="text-sm text-muted-foreground">
                  Page <span className="font-semibold text-slate-900">{currentPage}</span> sur{" "}
                  <span className="font-semibold text-slate-900">{totalPages}</span>
                </p>

                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={currentPage === 1 || isFetching}
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    className="gap-1.5 rounded-full"
                  >
                    <ChevronLeft className="h-4 w-4" />
                    Précédent
                  </Button>

                  <div className="hidden items-center gap-1 sm:flex">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                      <button
                        key={p}
                        onClick={() => setPage(p)}
                        className={
                          "h-9 w-9 rounded-full text-sm font-semibold transition-all " +
                          (p === currentPage
                            ? "bg-slate-900 text-white shadow-md"
                            : "text-slate-500 hover:bg-slate-100 hover:text-slate-900")
                        }
                        aria-current={p === currentPage ? "page" : undefined}
                      >
                        {p}
                      </button>
                    ))}
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    disabled={currentPage === totalPages || isFetching}
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    className="gap-1.5 rounded-full"
                  >
                    Suivant
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </>
        ) : (
          <EmptyState onReset={resetFilters} />
        )}
      </section>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   CARTE VÉHICULE — alignée sur FeaturedVehicleCard
   ═══════════════════════════════════════════════════════════ */
function CatalogueVehicleCard({ vehicle }: { vehicle: CatalogueVehicle }) {
  const {
    id,
    slug,
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
    <article className="group surface-card relative flex flex-col overflow-hidden rounded-2xl transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
      {/* ─── Image ─── */}
      <Link to={to} className="relative block aspect-[3/2] overflow-hidden bg-secondary">
        <ImageWithFallback
          src={cover}
          alt={`${brand ?? ""} ${model ?? ""}`.trim()}
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
        />

        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/50 to-transparent" />

        <div className="absolute left-3 top-3 flex flex-wrap gap-1.5">
          {badge && (
            <span className="rounded-full bg-white/95 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-900 shadow-sm backdrop-blur-sm">
              {badge}
            </span>
          )}
          {category && (
            <span className="rounded-full bg-slate-900/85 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-white shadow-sm backdrop-blur-sm">
              {category}
            </span>
          )}
        </div>

        {brand && (
          <p className="absolute bottom-3 left-3 text-[10px] font-bold uppercase tracking-[0.15em] text-white/90">
            {brand}
          </p>
        )}
      </Link>

      {/* ─── Contenu ─── */}
      <div className="flex flex-1 flex-col p-5">
        <Link to={to} className="block">
          <h3 className="font-display text-lg font-extrabold leading-tight tracking-tight text-slate-900 transition-colors group-hover:!text-emerald-600">
            {model ?? "Véhicule"}
          </h3>
        </Link>

        <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-muted-foreground">
          {condition && (
            <span className="inline-flex items-center gap-1">
              <CheckCircle2 className="h-3 w-3 text-emerald-500" />
              {condition}
            </span>
          )}
          {typeof nombre_places === "number" && (
            <>
              {condition && <span className="h-1 w-1 rounded-full bg-muted-foreground/40" />}
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
                  className="flex items-center gap-2 rounded-lg border border-border/60 bg-slate-50/60 px-2.5 py-2"
                >
                  <span className="grid h-7 w-7 shrink-0 place-items-center rounded-md bg-white text-slate-700 shadow-sm ring-1 ring-inset ring-slate-200">
                    <Icon className="h-3.5 w-3.5" />
                  </span>
                  <div className="min-w-0">
                    <p className="text-[9px] font-bold uppercase tracking-wider text-slate-500">
                      {s.label}
                    </p>
                    <p className="truncate text-xs font-semibold text-slate-900">{s.value}</p>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* ─── Prix + CTA ─── */}
        <div className="mt-5 border-t border-border/60 pt-4">
          <div className="flex items-end justify-between gap-3">
            <div className="min-w-0">
              <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                Prix
              </p>
              <p className="mt-0.5 font-display text-lg font-extrabold tracking-tight text-slate-900">
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

          <Link
            to={to}
            className="group/cta mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-3 text-sm font-bold text-white shadow-md shadow-emerald-600/20 transition-all hover:-translate-y-0.5 hover:bg-emerald-700 hover:shadow-lg hover:shadow-emerald-600/30"
          >
            Passer à votre commande
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

function ErrorState() {
  return (
    <div className="mt-8 flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-border/60 bg-secondary/20 px-6 py-16 text-center">
      <span className="grid h-12 w-12 place-items-center rounded-full bg-destructive/10 text-destructive">
        <AlertTriangle className="h-5 w-5" />
      </span>
      <p className="font-display text-base font-bold text-foreground">Chargement impossible</p>
      <p className="max-w-sm text-sm text-muted-foreground">
        Le catalogue n'a pas pu être contacté. Réessayez dans un instant.
      </p>
    </div>
  );
}

function EmptyState({ onReset }: { onReset: () => void }) {
  return (
    <div className="mt-8 flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-border/60 bg-secondary/20 px-6 py-16 text-center">
      <span className="grid h-12 w-12 place-items-center rounded-full bg-secondary text-muted-foreground">
        <Car className="h-5 w-5" />
      </span>
      <p className="font-display text-base font-bold text-foreground">
        Aucun véhicule ne correspond
      </p>
      <p className="max-w-sm text-sm text-muted-foreground">
        Essayez d'élargir votre budget ou de changer de catégorie.
      </p>
      <Button variant="outline" size="sm" className="mt-2 rounded-full" onClick={onReset}>
        Réinitialiser les filtres
      </Button>
    </div>
  );
}

function CatalogueSkeleton({ count }: { count: number }) {
  return (
    <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="surface-card overflow-hidden rounded-2xl" aria-hidden="true">
          <div className="aspect-[3/2] animate-pulse bg-secondary" />
          <div className="space-y-3 p-5">
            <div className="h-5 w-32 animate-pulse rounded bg-secondary" />
            <div className="h-3 w-24 animate-pulse rounded bg-secondary" />
            <div className="grid grid-cols-2 gap-2 pt-1">
              {Array.from({ length: 4 }).map((__, j) => (
                <div
                  key={j}
                  className="flex items-center gap-2 rounded-lg border border-border/60 bg-slate-50/60 px-2.5 py-2"
                >
                  <div className="h-7 w-7 shrink-0 animate-pulse rounded-md bg-secondary" />
                  <div className="min-w-0 flex-1 space-y-1">
                    <div className="h-2 w-10 animate-pulse rounded bg-secondary" />
                    <div className="h-2.5 w-14 animate-pulse rounded bg-secondary" />
                  </div>
                </div>
              ))}
            </div>
            <div className="pt-4">
              <div className="h-7 w-24 animate-pulse rounded bg-secondary" />
              <div className="mt-4 h-11 w-full animate-pulse rounded-xl bg-secondary" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
