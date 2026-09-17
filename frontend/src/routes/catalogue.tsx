import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Search, SlidersHorizontal } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { VehicleCard } from "@/components/vehicle-card";
import { CATEGORIES, VEHICLES, formatFcfa, type Category, type Condition } from "@/data/vehicles";

export const Route = createFileRoute("/catalogue")({
  head: () => ({
    meta: [
      { title: "Catalogue de véhicules chinois importés — AutoTrack Bénin" },
      {
        name: "description",
        content:
          "SUV, berlines, pick-up, électriques et hybrides BYD, Changan, GAC, Jetour et Chery importés de Chine, prix en FCFA.",
      },
      { property: "og:title", content: "Catalogue de véhicules chinois — AutoTrack Bénin" },
      {
        property: "og:description",
        content: "Filtrez par marque, catégorie, budget et état, puis précommandez en ligne.",
      },
    ],
  }),
  component: CataloguePage,
});

const MAX_PRICE = 30000000;

function CataloguePage() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<Category | "Toutes">("Toutes");
  const [condition, setCondition] = useState<Condition | "Tous">("Tous");
  const [maxPrice, setMaxPrice] = useState(MAX_PRICE);

  const results = useMemo(
    () =>
      VEHICLES.filter((v) => {
        const q = query.trim().toLowerCase();
        const matchQuery =
          !q ||
          `${v.brand} ${v.model}`.toLowerCase().includes(q) ||
          v.category.toLowerCase().includes(q);
        const matchCat = category === "Toutes" || v.category === category;
        const matchCond = condition === "Tous" || v.condition === condition;
        return matchQuery && matchCat && matchCond && v.priceFcfa <= maxPrice;
      }),
    [query, category, condition, maxPrice],
  );

  return (
    <div>
      <section className="bg-gradient-navy py-14 text-navy-foreground">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <h1 className="text-3xl font-extrabold sm:text-4xl">Catalogue de véhicules</h1>
          <p className="mt-3 max-w-2xl text-navy-foreground/75">
            Des modèles chinois neufs et d'occasion certifiée, livrés au Port de Cotonou.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-10 lg:px-8">
        <div className="surface-card grid gap-5 p-5 lg:grid-cols-4">
          <div className="lg:col-span-2">
            <Label htmlFor="q" className="flex items-center gap-2">
              <SlidersHorizontal className="h-4 w-4 text-accent" /> Recherche
            </Label>
            <div className="relative mt-1.5">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="q"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Marque ou modèle (BYD, Jetour…)"
                className="pl-9"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="cat">Catégorie</Label>
            <select
              id="cat"
              value={category}
              onChange={(e) => setCategory(e.target.value as Category | "Toutes")}
              className="mt-1.5 h-9 w-full rounded-md border border-input bg-background px-3 text-sm"
            >
              <option value="Toutes">Toutes les catégories</option>
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          <div>
            <Label htmlFor="cond">État</Label>
            <select
              id="cond"
              value={condition}
              onChange={(e) => setCondition(e.target.value as Condition | "Tous")}
              className="mt-1.5 h-9 w-full rounded-md border border-input bg-background px-3 text-sm"
            >
              <option value="Tous">Neuf & occasion</option>
              <option value="Neuf">Neuf</option>
              <option value="Occasion certifiée">Occasion certifiée</option>
            </select>
          </div>

          <div className="lg:col-span-4">
            <div className="flex items-center justify-between">
              <Label>Budget maximum</Label>
              <span className="text-sm font-bold text-accent">{formatFcfa(maxPrice)}</span>
            </div>
            <Slider
              value={[maxPrice]}
              onValueChange={(v) => setMaxPrice(v[0] ?? MAX_PRICE)}
              min={5000000}
              max={MAX_PRICE}
              step={500000}
              className="mt-3"
            />
          </div>
        </div>

        <div className="mt-6 flex items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            {results.length} véhicule(s) correspondant à votre recherche
          </p>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setQuery("");
              setCategory("Toutes");
              setCondition("Tous");
              setMaxPrice(MAX_PRICE);
            }}
          >
            Réinitialiser
          </Button>
        </div>

        {results.length ? (
          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {results.map((v) => (
              <VehicleCard key={v.id} vehicle={v} />
            ))}
          </div>
        ) : (
          <div className="surface-card mt-6 p-12 text-center">
            <h3 className="text-lg font-bold">Aucun véhicule ne correspond</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Élargissez votre budget ou changez de catégorie.
            </p>
          </div>
        )}
      </section>
    </div>
  );
}
