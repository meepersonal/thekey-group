import { Link } from "@tanstack/react-router";
import { Calendar, Fuel, Gauge, Settings2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatFcfa, formatUsd, type Vehicle } from "@/data/vehicles";

export function VehicleCard({ vehicle }: { vehicle: Vehicle }) {
  return (
    <article className="surface-card group flex flex-col overflow-hidden transition-transform duration-300 hover:-translate-y-1">
      <div className="relative aspect-[3/2] overflow-hidden bg-secondary">
        <img
          src={vehicle.images[0]}
          alt={`${vehicle.brand} ${vehicle.model}`}
          loading="lazy"
          width={1200}
          height={800}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {vehicle.badge && (
          <span className="absolute left-3 top-3 rounded-full bg-gradient-accent px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-accent-foreground">
            {vehicle.badge}
          </span>
        )}
        <span className="absolute right-3 top-3 rounded-full bg-primary/90 px-3 py-1 text-[11px] font-semibold text-primary-foreground">
          {vehicle.condition}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
          {vehicle.brand}
        </p>
        <h3 className="mt-1 text-lg font-bold">{vehicle.model}</h3>

        <div className="mt-4 grid grid-cols-2 gap-2 text-xs text-muted-foreground">
          <span className="flex items-center gap-1.5 rounded-lg bg-secondary px-2.5 py-2">
            <Fuel className="h-3.5 w-3.5 shrink-0 text-accent" />
            <span className="truncate">{vehicle.energy}</span>
          </span>
          <span className="flex items-center gap-1.5 rounded-lg bg-secondary px-2.5 py-2">
            <Settings2 className="h-3.5 w-3.5 shrink-0 text-accent" />
            <span className="truncate">{vehicle.transmission}</span>
          </span>
          <span className="flex items-center gap-1.5 rounded-lg bg-secondary px-2.5 py-2">
            <Calendar className="h-3.5 w-3.5 shrink-0 text-accent" />
            <span className="truncate">{vehicle.year}</span>
          </span>
          <span className="flex items-center gap-1.5 rounded-lg bg-secondary px-2.5 py-2">
            <Gauge className="h-3.5 w-3.5 shrink-0 text-accent" />
            <span className="truncate">
              {new Intl.NumberFormat("fr-FR").format(vehicle.mileageKm)} km
            </span>
          </span>
        </div>

        <div className="mt-5 flex items-end justify-between gap-3">
          <div className="min-w-0">
            <p className="truncate text-lg font-extrabold">{formatFcfa(vehicle.priceFcfa)}</p>
            <p className="text-xs text-muted-foreground">≈ {formatUsd(vehicle.priceFcfa)}</p>
          </div>
        </div>

        <Button asChild variant="accent" size="lg" className="mt-4 w-full">
          <Link to="/vehicules/$id" params={{ id: vehicle.id }}>
            Voir la fiche & Réserver
          </Link>
        </Button>
      </div>
    </article>
  );
}
