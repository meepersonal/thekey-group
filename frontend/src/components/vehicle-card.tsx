import { Link } from "@/lib/router";
import { Calendar, Fuel, Gauge, Settings2, ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatFcfa, formatUsd } from "@/data/vehicles";
import { ImageWithFallback } from "@/components/image-with-fallback";
import { vehicleImageUrl } from "@/lib/image";
import type { Vehicle } from "@/lib/api";

export function VehicleCard({ vehicle, to }: { vehicle: Vehicle; to?: string }) {
  const cover = vehicleImageUrl(vehicle);

  return (
    <article className="surface-card group relative flex flex-col overflow-hidden rounded-2xl transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/5">
      {/* Image */}
      <div className="relative aspect-[3/2] overflow-hidden bg-secondary">
        <ImageWithFallback
          src={cover}
          alt={`${vehicle.brand} ${vehicle.model}`}
          width={1200}
          height={800}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />

        {/* Dégradé bas pour lisibilité */}
        <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/50 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

        {/* Badge (optionnel) */}
        {vehicle.badge && (
          <span className="absolute left-3 top-3 rounded-full bg-gradient-accent px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-accent-foreground shadow-md">
            {vehicle.badge}
          </span>
        )}

        {/* Condition */}
        <span className="absolute right-3 top-3 rounded-full bg-primary/90 px-3 py-1 text-[11px] font-semibold text-primary-foreground shadow-md backdrop-blur-sm">
          {vehicle.condition}
        </span>

        {/* Flèche au hover */}
        <div className="absolute bottom-3 right-3 flex h-9 w-9 translate-y-2 items-center justify-center rounded-full bg-white/95 text-foreground opacity-0 shadow-lg backdrop-blur-sm transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
          <ArrowUpRight className="h-4 w-4" />
        </div>
      </div>

      {/* Contenu */}
      <div className="flex flex-1 flex-col p-5">
        {/* Marque + Modèle */}
        <div>
          <p className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground">
            {vehicle.brand}
          </p>
          <h3 className="mt-1 font-display text-lg font-bold leading-tight line-clamp-1">
            {vehicle.model}
          </h3>
        </div>

        {/* Specs */}
        <div className="mt-4 grid grid-cols-2 gap-2 text-xs text-muted-foreground">
          <Spec icon={Fuel} label={vehicle.energy} />
          <Spec icon={Settings2} label={vehicle.transmission} />
          <Spec icon={Calendar} label={String(vehicle.year)} />
          <Spec
            icon={Gauge}
            label={`${new Intl.NumberFormat("fr-FR").format(vehicle.mileage_km)} km`}
          />
        </div>

        {/* Prix */}
        <div className="mt-5 flex items-end justify-between gap-3 border-t pt-4">
          <div className="min-w-0">
            <p className="truncate font-display text-xl font-extrabold tracking-tight">
              {formatFcfa(vehicle.price_fcfa)}
            </p>
            <p className="mt-0.5 text-xs text-muted-foreground">
              ≈ {formatUsd(vehicle.price_fcfa)}
            </p>
          </div>
        </div>

        {/* CTA */}
        <Button asChild variant="accent" size="lg" className="mt-4 w-full group/btn">
          <Link to={to ?? `/vehicules/${vehicle.id}`}>
            Voir la fiche & Réserver
            <ArrowUpRight className="ml-2 h-4 w-4 transition-transform group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5" />
          </Link>
        </Button>
      </div>
    </article>
  );
}

function Spec({ icon: Icon, label }: { icon: typeof Fuel; label: string }) {
  return (
    <span className="flex items-center gap-1.5 rounded-lg bg-secondary px-2.5 py-2 transition-colors group-hover:bg-secondary/70">
      <Icon className="h-3.5 w-3.5 shrink-0 text-accent" />
      <span className="truncate">{label}</span>
    </span>
  );
}
