import { useMemo, useState } from "react";
import { ArrowRight, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link } from "@/lib/router";
import { usePublicBrands, usePublicVehicles } from "@/data/public-store";
import { vehicleImageUrl } from "@/lib/image";
import { EMPTY_FILTERS, filterVehicles, type VehicleFilters } from "./home-model";

export function HomeCatalogue() {
  const { data: vehicles = [], isLoading, isError, refetch } = usePublicVehicles({ per_page: "100" });
  const { data: brands = [] } = usePublicBrands();
  const [filters, setFilters] = useState<VehicleFilters>(EMPTY_FILTERS);
  const filtered = useMemo(() => filterVehicles(vehicles, filters), [vehicles, filters]);
  const update = (key: keyof VehicleFilters, value: string) => setFilters((previous) => ({ ...previous, [key]: value }));
  const fields: { key: keyof VehicleFilters; label: string; values: string[] }[] = [
    { key: "brand", label: "Toutes les marques", values: [...new Set(vehicles.map((v) => v.brand))] },
    { key: "category", label: "Toutes les catégories", values: [...new Set(vehicles.map((v) => v.category))] },
    { key: "year", label: "Toutes les années", values: [...new Set(vehicles.map((v) => String(v.year)))].sort().reverse() },
    { key: "energy", label: "Toutes les énergies", values: [...new Set(vehicles.map((v) => v.energy))] },
    { key: "status", label: "Disponibilité", values: [...new Set(vehicles.map((v) => v.status))] },
  ];
  return <>
    <section className="border-b border-border bg-background py-8 sm:py-10" aria-label="Marques automobiles">
      <div className="editorial-container flex flex-col items-center gap-7 lg:flex-row lg:justify-between">
        <p className="max-w-48 text-xs leading-relaxed text-muted-foreground">Les marques que nous<br className="hidden lg:block" /> vous aidons à trouver</p>
        <div className="flex w-full flex-wrap items-center justify-center gap-x-10 gap-y-4 lg:w-auto lg:justify-end">{brands.filter((b) => b.is_active).map((brand) => <Button key={brand.id} variant="ghost" className="brand-wordmark h-10 rounded-none px-0 hover:bg-transparent" onClick={() => { update("brand", brand.name); document.getElementById("selection")?.scrollIntoView(); }}>{brand.name}</Button>)}</div>
      </div>
    </section>
    <section id="selection" className="editorial-section bg-secondary">
      <div className="editorial-container">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end"><div><span className="editorial-kicker">01 / Notre sélection</span><h1 className="editorial-title max-w-xl">Découvrez notre sélection<br className="hidden sm:block" /> de véhicules.</h1></div><Link to="/catalogue" className="inline-flex items-center gap-3 text-sm font-semibold">Voir tout le catalogue <ArrowRight className="h-4 w-4" /></Link></div>
        <div className="my-8 grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-6">
          <div className="relative col-span-2 md:col-span-1"><Search className="absolute left-3 top-3.5 h-4 w-4 text-muted-foreground" /><Input className="home-filter pl-9 shadow-none" aria-label="Rechercher un véhicule" placeholder="Marque, modèle…" value={filters.search} onChange={(event) => update("search", event.target.value)} /></div>
          {fields.map((field) => <select className="home-filter" aria-label={field.label} key={field.key} value={filters[field.key]} onChange={(event) => update(field.key, event.target.value)}><option value="">{field.label}</option>{field.values.filter(Boolean).map((value) => <option key={value} value={value}>{value}</option>)}</select>)}
        </div>
        {isLoading ? <div className="grid grid-cols-2 gap-6 lg:grid-cols-4">{[0, 1, 2, 3].map((id) => <div key={id} className="aspect-[3/4] animate-pulse bg-border/40" />)}</div> : isError ? <div className="border-t border-border py-10"><p className="text-muted-foreground">Le catalogue est momentanément indisponible.</p><Button variant="outline" className="mt-4 rounded-none" onClick={() => refetch()}>Réessayer</Button></div> : filtered.length === 0 ? <div className="py-10"><p className="text-muted-foreground">Aucun véhicule ne correspond à votre recherche.</p><Button variant="link" onClick={() => setFilters(EMPTY_FILTERS)}>Effacer les filtres</Button></div> : <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">{filtered.slice(0, 8).map((vehicle) => {
          const image = vehicleImageUrl(vehicle);
          return <article key={vehicle.id} className="catalogue-item min-w-0"><Link to={`/vehicules/${vehicle.id}`} className="block overflow-hidden" aria-label={`Voir ${vehicle.model}`}>{image ? <img className="catalogue-photo" src={image} alt={`${vehicle.brand} ${vehicle.model}`} loading="lazy" width={600} height={450} onError={(event) => { event.currentTarget.style.visibility = "hidden"; }} /> : <div className="catalogue-photo flex items-center justify-center text-xs text-muted-foreground">Photo à venir</div>}</Link><div className="pt-5"><div className="mb-2 flex items-center justify-between gap-2 text-[10px] uppercase text-muted-foreground"><span>{vehicle.brand}</span><span className="border-l border-primary pl-2">{vehicle.status || "Disponibilité sur demande"}</span></div><h2 className="min-h-12 text-base font-bold leading-snug">{vehicle.model.replace(new RegExp(`^${vehicle.brand}\\s+`, "i"), "")}</h2><p className="mt-2 text-xs text-muted-foreground">{[vehicle.year, vehicle.energy, vehicle.category].filter(Boolean).join(" · ")}</p><div className="mt-5 border-t border-border pt-4"><Link to="/contact" className="text-xs text-muted-foreground">Demander un devis</Link><Button asChild variant="link" className="mt-2 flex h-auto justify-between rounded-none p-0 text-sm text-navy"><Link to={`/vehicules/${vehicle.id}`}>Voir le véhicule <ArrowRight /></Link></Button></div></div></article>;
        })}</div>}
      </div>
    </section>
  </>;
}
