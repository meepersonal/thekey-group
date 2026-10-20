"use client";

import { useState, useEffect, useMemo } from "react";
import { Search, Car, AlertTriangle, X, ArrowRight, SlidersHorizontal } from "lucide-react";
import { Link } from "@/lib/router";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { usePublicBrands, usePublicCategories, usePublicVehiclesPage } from "@/data/public-store";
import { formatFcfa } from "@/data/vehicles";
import { vehicleImageUrl } from "@/lib/image";

const MAX_PRICE = 30000000;
const ITEMS_PER_PAGE = 12;

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

export function CataloguePage() {
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [brand, setBrand] = useState("");
  const [category, setCategory] = useState("");
  const [maxPrice, setMaxPrice] = useState(MAX_PRICE);
  const [page, setPage] = useState(1);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setSearch(searchInput.trim());
      setPage(1);
    }, 350);
    return () => clearTimeout(timer);
  }, [searchInput]);

  const params = useMemo(() => {
    const query: Record<string, string> = {
      per_page: String(ITEMS_PER_PAGE),
      page: String(page),
    };
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

  const updateFilter = (setter: (v: string) => void) => (value: string) => {
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
    <div className="bg-white min-h-screen font-sans text-gray-900">
      {/* ANIMATIONS CSS */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animated-card {
          opacity: 0;
          animation: fadeInUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `,
        }}
      />

      {/* TITRE DE LA PAGE */}
      <div className="mx-auto max-w-[1400px] px-4 pt-10 pb-6 lg:px-8">
        <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter text-black">
          Catalogue véhicules
        </h1>
        <p className="mt-3 text-gray-500 max-w-2xl text-sm leading-relaxed">
          Découvrez notre gamme complète de véhicules et engins, conçus pour les nouvelles énergies
          et les chantiers exigeants.
        </p>
      </div>

      {/* ═══════════════════════════════════════════════════════
          BARRE DE FILTRES (Non fixe, dans le flux)
      ═══════════════════════════════════════════════════════ */}
      <div className="border-y border-gray-200 bg-gray-50">
        <div className="mx-auto max-w-[1400px] px-4 py-4 lg:px-8">
          {/* Version Desktop : Tous les filtres sur une ligne */}
          <div className="hidden lg:flex lg:items-end lg:gap-4">
            {/* Recherche */}
            <div className="flex-1 min-w-[200px]">
              <Label
                htmlFor="q"
                className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-1.5"
              >
                <Search className="h-3 w-3" /> Recherche
              </Label>
              <div className="relative group">
                <Input
                  id="q"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  placeholder="Modèle, référence..."
                  className="h-10 pl-3 pr-8 border border-gray-300 rounded-none bg-white focus-visible:ring-0 focus-visible:border-emerald-600 transition-colors text-sm"
                />
                {searchInput && (
                  <button
                    type="button"
                    onClick={() => setSearchInput("")}
                    className="absolute right-2 top-1/2 grid h-6 w-6 -translate-y-1/2 place-items-center text-gray-400 hover:text-emerald-600 transition-colors"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>
            </div>

            {/* Marque */}
            <div className="w-44">
              <Label
                htmlFor="brand"
                className="block text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-1.5"
              >
                Marque
              </Label>
              <select
                id="brand"
                value={brand}
                onChange={(e) => updateFilter(setBrand)(e.target.value)}
                className="h-10 w-full border border-gray-300 bg-white px-2.5 text-sm rounded-none focus:outline-none focus:border-emerald-600 transition-colors appearance-none cursor-pointer hover:border-gray-400"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%236b7280' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`,
                  backgroundRepeat: "no-repeat",
                  backgroundPosition: "right 10px center",
                }}
              >
                <option value="">Toutes les marques</option>
                {brands?.map((b) => (
                  <option key={b.id} value={b.name}>
                    {b.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Catégorie */}
            <div className="w-44">
              <Label
                htmlFor="cat"
                className="block text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-1.5"
              >
                Catégorie
              </Label>
              <select
                id="cat"
                value={category}
                onChange={(e) => updateFilter(setCategory)(e.target.value)}
                className="h-10 w-full border border-gray-300 bg-white px-2.5 text-sm rounded-none focus:outline-none focus:border-emerald-600 transition-colors appearance-none cursor-pointer hover:border-gray-400"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%236b7280' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`,
                  backgroundRepeat: "no-repeat",
                  backgroundPosition: "right 10px center",
                }}
              >
                <option value="">Toutes les catégories</option>
                {categories?.map((c) => (
                  <option key={c.id} value={c.name}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Budget */}
            <div className="w-56">
              <div className="flex items-center justify-between mb-1.5">
                <Label className="text-[10px] font-bold uppercase tracking-wider text-gray-500">
                  Budget max
                </Label>
                <span className="text-xs font-bold text-emerald-600">{formatFcfa(maxPrice)}</span>
              </div>
              <div className="h-10 flex items-center px-1">
                <Slider
                  value={[maxPrice]}
                  onValueChange={(v) => {
                    setMaxPrice(v[0] ?? MAX_PRICE);
                    setPage(1);
                  }}
                  min={0}
                  max={MAX_PRICE}
                  step={500000}
                  className="[&_[role=slider]]:rounded-none [&_[role=slider]]:border-emerald-600 [&_[role=slider]]:bg-white [&_[role=slider]]:h-4 [&_[role=slider]]:w-4 [&_[role=slider]]:transition-transform [&_[role=slider]]:hover:scale-125 [&_.bg-primary]:bg-emerald-600 [&_.bg-secondary]:bg-gray-200"
                />
              </div>
            </div>

            {/* Reset Button */}
            <div className="ml-auto pb-1">
              {hasActiveFilters && (
                <button
                  type="button"
                  onClick={resetFilters}
                  className="inline-flex items-center gap-1.5 h-9 px-3 border border-gray-300 bg-white text-xs font-bold uppercase tracking-wider text-gray-600 hover:border-emerald-600 hover:text-emerald-600 transition-all duration-300"
                >
                  <X className="h-3.5 w-3.5" />
                  Effacer
                </button>
              )}
            </div>
          </div>

          {/* Version Mobile : Barre compacte avec bouton "Filtres" */}
          <div className="lg:hidden">
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <Input
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  placeholder="Rechercher..."
                  className="h-10 pl-9 pr-8 border border-gray-300 rounded-none bg-white text-sm"
                />
                {searchInput && (
                  <button
                    type="button"
                    onClick={() => setSearchInput("")}
                    className="absolute right-2 top-1/2 grid h-6 w-6 -translate-y-1/2 place-items-center text-gray-400"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>
              <button
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                className={`flex items-center gap-1.5 h-10 px-3 border text-xs font-bold uppercase tracking-wider transition-colors ${
                  hasActiveFilters
                    ? "border-emerald-600 bg-emerald-50 text-emerald-600"
                    : "border-gray-300 bg-white text-gray-600"
                }`}
              >
                <SlidersHorizontal className="h-3.5 w-3.5" />
                Filtres
                {hasActiveFilters && (
                  <span className="ml-1 flex h-4 w-4 items-center justify-center rounded-full bg-emerald-600 text-[10px] text-white">
                    !
                  </span>
                )}
              </button>
            </div>

            {/* Filtres mobiles dépliés */}
            {isFilterOpen && (
              <div className="mt-4 space-y-4 pt-4 border-t border-gray-200 animate-in slide-in-from-top-2 duration-300">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label className="block text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-1.5">
                      Marque
                    </Label>
                    <select
                      value={brand}
                      onChange={(e) => updateFilter(setBrand)(e.target.value)}
                      className="h-10 w-full border border-gray-300 bg-white px-2.5 text-sm rounded-none focus:outline-none focus:border-emerald-600"
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
                    <Label className="block text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-1.5">
                      Catégorie
                    </Label>
                    <select
                      value={category}
                      onChange={(e) => updateFilter(setCategory)(e.target.value)}
                      className="h-10 w-full border border-gray-300 bg-white px-2.5 text-sm rounded-none focus:outline-none focus:border-emerald-600"
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
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <Label className="text-[10px] font-bold uppercase tracking-wider text-gray-500">
                      Budget max
                    </Label>
                    <span className="text-xs font-bold text-emerald-600">
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
                    className="[&_[role=slider]]:rounded-none [&_[role=slider]]:border-emerald-600 [&_[role=slider]]:bg-white [&_[role=slider]]:h-4 [&_[role=slider]]:w-4 [&_.bg-primary]:bg-emerald-600 [&_.bg-secondary]:bg-gray-200"
                  />
                </div>
                {hasActiveFilters && (
                  <button
                    onClick={resetFilters}
                    className="w-full h-9 border border-gray-300 bg-white text-xs font-bold uppercase tracking-wider text-gray-600 hover:border-emerald-600 hover:text-emerald-600 transition-colors"
                  >
                    Effacer tous les filtres
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* GRILLE PRINCIPALE */}
      <section className="mx-auto max-w-[1400px] px-4 py-8 lg:px-8">
        <div className="flex items-center justify-between mb-5 pb-3 border-b border-gray-200">
          <p className="text-sm text-gray-500">
            {isLoading ? (
              "Chargement..."
            ) : (
              <>
                <span className="font-bold text-black uppercase tracking-tight">{total}</span>{" "}
                résultat{total > 1 ? "s" : ""}
              </>
            )}
          </p>
        </div>

        {isError ? (
          <ErrorState />
        ) : isLoading ? (
          <CatalogueSkeleton count={ITEMS_PER_PAGE} />
        ) : results.length > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 border-t border-l border-gray-200">
              {results.map((v: CatalogueVehicle, index: number) => (
                <CatalogueVehicleCard key={v.id} vehicle={v} index={index} />
              ))}
            </div>

            {totalPages > 1 && (
              <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 border-t-2 border-black pt-4">
                <p className="text-sm text-gray-500">
                  Page <span className="font-bold text-black">{currentPage}</span> sur{" "}
                  <span className="font-bold text-black">{totalPages}</span>
                </p>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={currentPage === 1 || isFetching}
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    className="rounded-none h-9 px-4 text-xs font-bold uppercase border-gray-300 hover:border-emerald-600 hover:bg-emerald-600 hover:text-white transition-all duration-300"
                  >
                    Précédent
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={currentPage === totalPages || isFetching}
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    className="rounded-none h-9 px-4 text-xs font-bold uppercase border-gray-300 hover:border-emerald-600 hover:bg-emerald-600 hover:text-white transition-all duration-300"
                  >
                    Suivant
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
   CARTE VÉHICULE - Style industriel + Image arrondie
   ═══════════════════════════════════════════════════════════ */
function CatalogueVehicleCard({ vehicle, index }: { vehicle: CatalogueVehicle; index: number }) {
  const { model, condition, energy, year } = vehicle;
  const to = `/vehicules/${vehicle.id}`;

  const imageUrl = useMemo(() => vehicleImageUrl(vehicle), [vehicle]);

  const specs = [
    { label: "Paramètre 1 :", value: "Poids utile/charge nominale" },
    { label: "Paramètre 2 :", value: energy ? `Énergie : ${energy}` : "Capacité du godet" },
    { label: "Paramètre 3", value: year ? `Année : ${year}` : "Puissance du moteur de traction" },
  ];

  return (
    <article
      className="animated-card flex flex-col border-r border-b border-gray-200 bg-white group h-full transition-all duration-300 hover:shadow-[0_10px_40px_-10px_rgba(0,0,0,0.1)] hover:-translate-y-1 hover:z-10 relative"
      style={{ animationDelay: `${index * 80}ms` }}
    >
      <Link to={to} className="flex flex-col flex-1 h-full">
        {/* 1. EN-TÊTE */}
        <div className="p-4 pb-0 h-[88px] flex flex-col justify-start">
          <p className="text-[13px] text-gray-500 mb-0.5 line-clamp-1 h-[18px]">
            {condition || "chargeur purement électrique"}
          </p>
          <h3 className="text-[22px] font-black text-black uppercase tracking-tight leading-none mt-1 line-clamp-2 transition-colors duration-300 group-hover:text-emerald-600">
            {model || "LE80-X5"}
          </h3>
        </div>

        {/* 2. IMAGE AVEC COINS ARRONDIS */}
        <div className="px-4 mt-2">
          <div className="relative aspect-[4/3] w-full rounded-xl overflow-hidden bg-gray-50 flex items-center justify-center p-2">
            {imageUrl ? (
              <img
                src={imageUrl}
                alt={model ?? "Véhicule"}
                className="max-h-full max-w-full object-contain mix-blend-multiply transition-transform duration-500 ease-out group-hover:scale-110"
                loading="lazy"
              />
            ) : (
              <Car className="h-16 w-16 text-gray-300" />
            )}
          </div>
        </div>

        {/* 3. SPÉCIFICATIONS */}
        <div className="p-4 pt-3 mt-auto space-y-3 border-t border-gray-100 flex-1">
          {specs.map((spec, i) => (
            <div key={i} className="text-[13px] leading-tight">
              <p className="text-gray-500 mb-0.5 line-clamp-1">{spec.label}</p>
              <p className="font-bold text-black line-clamp-2 min-h-[2.5em]">{spec.value}</p>
            </div>
          ))}
        </div>

        {/* 4. BOUTON D'ACTION */}
        <div className="p-4 pt-0 mt-auto">
          <div className="w-full flex items-center justify-between bg-gray-50 text-black border border-gray-200 rounded-lg px-4 py-3 text-[13px] font-bold uppercase tracking-wider transition-all duration-300 group-hover:bg-emerald-600 group-hover:text-white group-hover:border-emerald-600 group-hover:shadow-lg group-hover:shadow-emerald-600/20">
            <span>Voir le véhicule</span>
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
function ErrorState() {
  return (
    <div className="flex flex-col items-center justify-center gap-3 border border-gray-300 px-6 py-16 text-center">
      <AlertTriangle className="h-8 w-8 text-red-500" />
      <p className="font-bold text-black uppercase">Chargement impossible</p>
      <p className="max-w-sm text-sm text-gray-500">Le catalogue n'a pas pu être contacté.</p>
    </div>
  );
}

function EmptyState({ onReset }: { onReset: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 border border-gray-300 px-6 py-16 text-center">
      <Car className="h-8 w-8 text-gray-400" />
      <p className="font-bold text-black uppercase">Aucun équipement trouvé</p>
      <p className="max-w-sm text-sm text-gray-500">
        Essayez de modifier vos critères de recherche.
      </p>
      <Button
        variant="outline"
        size="sm"
        className="mt-2 rounded-none border-black text-black hover:bg-emerald-600 hover:border-emerald-600 hover:text-white uppercase text-xs font-bold transition-all duration-300"
        onClick={onReset}
      >
        Réinitialiser les filtres
      </Button>
    </div>
  );
}

function CatalogueSkeleton({ count }: { count: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 border-t border-l border-gray-200">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="border-r border-b border-gray-200 bg-white h-full flex flex-col">
          <div className="p-4 pb-0 h-[88px] flex flex-col justify-start space-y-2">
            <div className="h-3 w-3/4 bg-gray-100 rounded-sm animate-pulse" />
            <div className="h-6 w-1/2 bg-gray-100 rounded-sm animate-pulse" />
          </div>
          <div className="px-4 mt-2">
            <div className="aspect-[4/3] w-full bg-gray-50 rounded-xl animate-pulse" />
          </div>
          <div className="p-4 pt-3 flex-1 space-y-4 border-t border-gray-100">
            {Array.from({ length: 3 }).map((_, j) => (
              <div key={j} className="space-y-1.5">
                <div className="h-2.5 w-20 bg-gray-100 rounded-sm animate-pulse" />
                <div className="h-3 w-32 bg-gray-100 rounded-sm animate-pulse" />
              </div>
            ))}
          </div>
          <div className="p-4 pt-0 mt-auto">
            <div className="w-full h-11 bg-gray-50 animate-pulse" />
          </div>
        </div>
      ))}
    </div>
  );
}
