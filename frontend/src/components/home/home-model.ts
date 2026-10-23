import type { Vehicle } from "@/lib/api";
import type { Promotion } from "@/hooks/use-active-promotions";

export const HERO_INTERVAL = 5000;
export type VehicleFilters = { search: string; brand: string; category: string; year: string; energy: string; status: string };
export const EMPTY_FILTERS: VehicleFilters = { search: "", brand: "", category: "", year: "", energy: "", status: "" };
export function filterVehicles(vehicles: Vehicle[], filters: VehicleFilters) {
  const search = filters.search.trim().toLocaleLowerCase("fr");
  return vehicles.filter((vehicle) =>
    (!search || `${vehicle.brand} ${vehicle.model}`.toLocaleLowerCase("fr").includes(search)) &&
    (!filters.brand || vehicle.brand === filters.brand) &&
    (!filters.category || vehicle.category === filters.category) &&
    (!filters.year || String(vehicle.year) === filters.year) &&
    (!filters.energy || vehicle.energy === filters.energy) &&
    (!filters.status || vehicle.status === filters.status));
}
export function visiblePromotions(promotions: Promotion[], now = Date.now()) {
  return promotions.filter((promotion) => promotion.active && (!promotion.expiresAt || Date.parse(promotion.expiresAt) > now));
}