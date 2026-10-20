import { useEffect, useState } from "react";

export interface Promotion {
  id: string;
  variant: "promo" | "shipping" | "info";
  title: string;
  description?: string;
  badge?: string;
  expiresAt?: string;
  ctaLabel: string;
  ctaHref: string;
  priority: number;
  active: boolean;
}

const CACHE_KEY = "active_promotions_cache";
const CACHE_DURATION = 5 * 60 * 1000;

function readCache(): { data: Promotion[]; timestamp: number } | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (Date.now() - parsed.timestamp > CACHE_DURATION) {
      localStorage.removeItem(CACHE_KEY);
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}

function writeCache(data: Promotion[]) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify({ data, timestamp: Date.now() }));
  } catch {
    // ignore quota errors
  }
}

export function useActivePromotions() {
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const cached = readCache();
    if (cached) {
      setPromotions(cached.data);
      setIsLoading(false);
    }

    fetch("/api/promotions/active")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch");
        return res.json();
      })
      .then((json: { data: Promotion[] }) => {
        if (cancelled) return;
        const data = json.data ?? [];
        writeCache(data);
        setPromotions(data);
        setIsLoading(false);
      })
      .catch(() => {
        if (cancelled) return;
        setIsError(true);
        setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return { promotions, isLoading, isError };
}