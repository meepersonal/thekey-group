import { describe, expect, it } from "vitest";
import { EMPTY_FILTERS, filterVehicles, HERO_INTERVAL, visiblePromotions } from "./home-model";
import type { Vehicle } from "@/lib/api";
import type { Promotion } from "@/hooks/use-active-promotions";

describe("homepage requirements", () => {
  it("advances photographs every five seconds", () => expect(HERO_INTERVAL).toBe(5000));
  it("filters catalogue by actual availability", () => {
    const vehicles = [{ id: 1, status: "En Stock" }, { id: 2, status: "Sur commande" }] as Vehicle[];
    expect(filterVehicles(vehicles, { ...EMPTY_FILTERS, status: "En Stock" }).map((v) => v.id)).toEqual([1]);
  });
  it("does not display inactive promotions", () => {
    expect(visiblePromotions([{ id: "hidden", active: false }] as Promotion[])).toEqual([]);
  });
  it("does not display expired promotions", () => {
    expect(visiblePromotions([{ id: "expired", active: true, expiresAt: "2026-10-01T00:00:00Z" }] as Promotion[], Date.parse("2026-10-23T00:00:00Z"))).toEqual([]);
  });
});