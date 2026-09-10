import type { AdminVehicleStatus, OrderStatus } from "@/data/admin-store";
import { cn } from "@/lib/utils";

const base =
  "inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-bold whitespace-nowrap";

const orderStyles: Record<OrderStatus, string> = {
  "Nouvelle demande": "bg-accent/15 text-accent",
  "Prise en charge": "bg-navy/10 text-navy",
  "Acompte Versé": "bg-success/15 text-success",
  Annulée: "bg-destructive/15 text-destructive",
};

export function OrderStatusBadge({ status }: { status: OrderStatus }) {
  return <span className={cn(base, orderStyles[status])}>{status}</span>;
}

const vehicleStyles: Record<AdminVehicleStatus, string> = {
  "En Stock": "bg-success/15 text-success",
  "Sur Commande": "bg-accent/15 text-accent",
  Masqué: "bg-muted text-muted-foreground",
};

export function VehicleStatusBadge({ status }: { status: AdminVehicleStatus }) {
  return <span className={cn(base, vehicleStyles[status])}>{status}</span>;
}
