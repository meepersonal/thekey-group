"use client";

import { useEffect, useState } from "react";
import { Link } from "@/lib/router";
import { X, Sparkles, Truck, Info, AlertCircle } from "lucide-react";
import { useActivePromotions } from "@/hooks/use-active-promotions";

const ICON_MAP = {
  promo: Sparkles,
  shipping: Truck,
  info: Info,
} as const;

export function PromoBottomBanner() {
  const { promotions, isLoading, isError } = useActivePromotions();
  const [dismissed, setDismissed] = useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const stored = localStorage.getItem("dismissed_promos");
    if (stored) setDismissed(JSON.parse(stored));
  }, []);

  const visible = promotions.filter((p) => !dismissed.includes(p.id));
  if (!visible.length) return null;

  const promo = visible[currentIndex]!;

  const handleDismiss = (id: string) => {
    const next = [...dismissed, id];
    setDismissed(next);
    localStorage.setItem("dismissed_promos", JSON.stringify(next));
    if (currentIndex >= visible.length - 1) setCurrentIndex(0);
  };

  const handleNext = () => setCurrentIndex((i) => (i + 1) % visible.length);
  const handlePrev = () => setCurrentIndex((i) => (i - 1 + visible.length) % visible.length);

  const Icon = ICON_MAP[promo.variant] ?? Info;

  return (
    <div
      className="fixed bottom-4 right-4 left-4 z-50 md:bottom-6 md:right-6 md:left-auto md:w-96"
      role="status"
      aria-live="polite"
    >
      <div
        className="relative overflow-hidden rounded-2xl border border-primary/20 bg-white/95 backdrop-blur-xl shadow-[0_25px_50px_-12px_rgba(0,0,0,0.25)] ring-1 ring-primary/10"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-accent/5" />
        <div className="relative flex items-center gap-3 p-4">
          <span className="shrink-0 grid h-9 w-9 place-items-center rounded-xl bg-primary/10 text-primary">
            <Icon className="h-5 w-5" />
          </span>

          <div className="min-w-0 flex-1">
            {promo.badge && (
              <span className="mb-0.5 inline-block rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-primary">
                {promo.badge}
              </span>
            )}
            <p className="font-display text-sm font-bold leading-tight text-slate-900">
              {promo.title}
            </p>
            {promo.description && (
              <p className="mt-0.5 text-xs leading-relaxed text-slate-600">{promo.description}</p>
            )}
          </div>

          {visible.length > 1 && (
            <div className="shrink-0 flex items-center gap-1">
              <button
                onClick={handlePrev}
                className="grid h-8 w-8 place-items-center rounded-lg text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700"
                aria-label="Promotion précédente"
              >
                <span className="h-4 w-4">‹</span>
              </button>
              <span className="text-xs font-mono text-slate-400">
                {currentIndex + 1}/{visible.length}
              </span>
              <button
                onClick={handleNext}
                className="grid h-8 w-8 place-items-center rounded-lg text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700"
                aria-label="Promotion suivante"
              >
                <span className="h-4 w-4">›</span>
              </button>
            </div>
          )}

          <Link
            to={promo.ctaHref}
            className="shrink-0 inline-flex items-center gap-1.5 rounded-xl bg-primary px-3 py-2 text-xs font-bold uppercase tracking-wider text-white shadow-md shadow-primary/20 transition-all hover:bg-primary/90 hover:shadow-lg"
          >
            {promo.ctaLabel}
            <span className="h-3.5 w-3.5">→</span>
          </Link>

          <button
            onClick={() => handleDismiss(promo.id)}
            className="shrink-0 grid h-8 w-8 place-items-center rounded-lg text-slate-300 transition-colors hover:bg-slate-100 hover:text-slate-600"
            aria-label="Masquer cette promotion"
          >
            <X className="h-4 w-4" strokeWidth={2.5} />
          </button>
        </div>

        {promo.expiresAt && (
          <div className="absolute bottom-0 right-0 h-0.5 bg-gradient-to-r from-primary/50 to-accent/50">
            <div
              className="h-full bg-primary"
              style={{
                width: `${Math.max(
                  0,
                  Math.min(
                    100,
                    (new Date(promo.expiresAt).getTime() - Date.now()) /
                      (new Date(promo.expiresAt).getTime() - Date.now() + 864e5) *
                      100
                  )
                )}%`,
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
}