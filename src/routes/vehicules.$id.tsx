import { useMemo, useState } from "react";
import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft, BatteryCharging, Check, Cog, Fuel, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { PreorderForm } from "@/components/preorder-form";
import { OPTIONS, formatFcfa, formatUsd, getVehicle } from "@/data/vehicles";

export const Route = createFileRoute("/vehicules/$id")({
  loader: ({ params }) => {
    const vehicle = getVehicle(params.id);
    if (!vehicle) throw notFound();
    return { vehicle };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return {
        meta: [{ title: "Véhicule introuvable — AutoTrack Bénin" }, { name: "robots", content: "noindex" }],
      };
    }
    const v = loaderData.vehicle;
    const title = `${v.brand} ${v.model} — Précommande | AutoTrack Bénin`;
    const description = `${v.brand} ${v.model} ${v.year}, ${v.energy}, ${v.transmission}. Prix ${formatFcfa(v.priceFcfa)}, importation depuis la Chine avec suivi maritime.`;
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
      ],
    };
  },
  component: VehiclePage,
});

function VehiclePage() {
  const { vehicle } = Route.useLoaderData();
  const [imageIndex, setImageIndex] = useState(0);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const selected = useMemo(() => OPTIONS.filter((o) => selectedIds.includes(o.id)), [selectedIds]);
  const total = vehicle.priceFcfa + selected.reduce((s, o) => s + o.price, 0);

  const toggle = (id: string) =>
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 lg:px-8">
      <Button asChild variant="ghost" size="sm" className="mb-4">
        <Link to="/catalogue">
          <ArrowLeft className="h-4 w-4" />
          Retour au catalogue
        </Link>
      </Button>

      <div className="grid gap-8 lg:grid-cols-[1.15fr_1fr]">
        <div>
          <div className="surface-card overflow-hidden">
            <img
              src={vehicle.images[imageIndex]}
              alt={`${vehicle.brand} ${vehicle.model}`}
              width={1200}
              height={800}
              className="aspect-[3/2] w-full object-cover"
            />
          </div>
          <div className="mt-3 flex gap-3">
            {vehicle.images.map((img, i) => (
              <button
                key={i}
                onClick={() => setImageIndex(i)}
                className={
                  "h-20 w-28 overflow-hidden rounded-xl border-2 transition-colors " +
                  (i === imageIndex ? "border-accent" : "border-border")
                }
              >
                <img
                  src={img}
                  alt={`Vue ${i + 1}`}
                  loading="lazy"
                  width={1200}
                  height={800}
                  className="h-full w-full object-cover"
                />
              </button>
            ))}
          </div>

          <div className="mt-8">
            <h2 className="text-xl font-bold">Spécifications techniques</h2>
            <Accordion type="single" collapsible defaultValue="specs" className="mt-3">
              <AccordionItem value="specs">
                <AccordionTrigger>Motorisation & performances</AccordionTrigger>
                <AccordionContent>
                  <dl className="grid gap-3 sm:grid-cols-2">
                    <Spec icon={<Cog className="h-4 w-4" />} label="Moteur" value={vehicle.engine} />
                    <Spec icon={<Fuel className="h-4 w-4" />} label="Énergie" value={vehicle.energy} />
                    {vehicle.battery && (
                      <Spec
                        icon={<BatteryCharging className="h-4 w-4" />}
                        label="Batterie"
                        value={vehicle.battery}
                      />
                    )}
                    <Spec icon={<Cog className="h-4 w-4" />} label="Transmission" value={vehicle.transmission} />
                    <Spec icon={<Fuel className="h-4 w-4" />} label="Consommation" value={vehicle.consumption} />
                    <Spec icon={<Users className="h-4 w-4" />} label="Places" value={`${vehicle.seats} places`} />
                  </dl>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="equip">
                <AccordionTrigger>Équipements inclus</AccordionTrigger>
                <AccordionContent>
                  <ul className="space-y-2">
                    {vehicle.highlights.map((h) => (
                      <li key={h} className="flex items-center gap-2 text-sm">
                        <Check className="h-4 w-4 text-accent" />
                        {h}
                      </li>
                    ))}
                  </ul>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="import">
                <AccordionTrigger>Importation & délais</AccordionTrigger>
                <AccordionContent>
                  <p className="text-sm text-muted-foreground">
                    Délai moyen de 45 à 60 jours entre la commande et la livraison au Port de
                    Cotonou. Inspection avant départ, suivi maritime en direct et assistance au
                    dédouanement inclus.
                  </p>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>

        <div className="space-y-6">
          <div className="surface-card p-6">
            <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
              {vehicle.brand} · {vehicle.category}
            </p>
            <h1 className="mt-1 text-3xl font-extrabold">{vehicle.model}</h1>
            <div className="mt-2 flex flex-wrap gap-2 text-xs">
              <span className="rounded-full bg-secondary px-3 py-1 font-semibold">{vehicle.condition}</span>
              <span className="rounded-full bg-secondary px-3 py-1 font-semibold">{vehicle.year}</span>
              <span className="rounded-full bg-secondary px-3 py-1 font-semibold">
                {new Intl.NumberFormat("fr-FR").format(vehicle.mileageKm)} km
              </span>
            </div>

            <div className="mt-6 border-t border-border pt-5">
              <h2 className="text-sm font-bold uppercase tracking-wide">Personnalisez votre véhicule</h2>
              <div className="mt-3 space-y-2">
                {OPTIONS.map((o) => {
                  const active = selectedIds.includes(o.id);
                  return (
                    <button
                      key={o.id}
                      onClick={() => toggle(o.id)}
                      className={
                        "flex w-full items-center justify-between gap-3 rounded-xl border px-4 py-3 text-left text-sm transition-colors " +
                        (active ? "border-accent bg-accent/10" : "border-border hover:bg-secondary")
                      }
                    >
                      <span className="flex min-w-0 items-center gap-3">
                        <span
                          className={
                            "grid h-5 w-5 shrink-0 place-items-center rounded-md border " +
                            (active ? "border-accent bg-accent text-accent-foreground" : "border-border")
                          }
                        >
                          {active && <Check className="h-3.5 w-3.5" />}
                        </span>
                        <span className="truncate font-medium">{o.label}</span>
                      </span>
                      <span className="shrink-0 text-xs font-bold text-muted-foreground">
                        +{formatFcfa(o.price)}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="mt-6 rounded-xl bg-gradient-navy p-5 text-navy-foreground">
              <div className="flex items-center justify-between text-sm text-navy-foreground/70">
                <span>Prix de base</span>
                <span>{formatFcfa(vehicle.priceFcfa)}</span>
              </div>
              <div className="mt-1 flex items-center justify-between text-sm text-navy-foreground/70">
                <span>Options ({selected.length})</span>
                <span>+{formatFcfa(total - vehicle.priceFcfa)}</span>
              </div>
              <div className="mt-3 flex items-end justify-between border-t border-navy-foreground/15 pt-3">
                <span className="text-sm font-semibold">Total estimé</span>
                <span className="text-right">
                  <span className="block text-2xl font-extrabold">{formatFcfa(total)}</span>
                  <span className="text-xs text-navy-foreground/60">≈ {formatUsd(total)}</span>
                </span>
              </div>
            </div>

            <Button asChild variant="accent" size="xl" className="mt-5 w-full">
              <a href="#precommande">Précommander ce véhicule</a>
            </Button>
          </div>

          <PreorderForm vehicle={vehicle} selected={selected} total={total} />
        </div>
      </div>
    </div>
  );
}

function Spec({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-start gap-3">
      <span className="mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-secondary text-accent">
        {icon}
      </span>
      <div className="min-w-0">
        <dt className="text-xs uppercase tracking-wide text-muted-foreground">{label}</dt>
        <dd className="text-sm font-semibold">{value}</dd>
      </div>
    </div>
  );
}
