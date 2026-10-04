"use client";

import type { WhyUsItem } from "@/data/home-data";

interface WhyUsSectionProps {
  items: WhyUsItem[];
}

export function WhyUsSection({ items }: WhyUsSectionProps) {
  return (
    <section
      id="pourquoi-nous"
      className="relative overflow-hidden border-t border-zinc-800/80 py-16 text-white lg:py-24"
      style={{
        backgroundColor: "#09090b", // zinc-950
        backgroundImage: `
          linear-gradient(to right, rgba(168, 85, 247, 0.08) 1px, transparent 1px),
          linear-gradient(to bottom, rgba(168, 85, 247, 0.08) 1px, transparent 1px),
          linear-gradient(to right, rgba(168, 85, 247, 0.16) 1px, transparent 1px),
          linear-gradient(to bottom, rgba(168, 85, 247, 0.16) 1px, transparent 1px)
        `,
        backgroundSize: "56px 56px, 56px 56px, 280px 280px, 280px 280px",
      }}
    >
      {/* Halo d'ambiance en arrière-plan */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/3 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/10 blur-[150px]"
      />

      {/* Contenu au-dessus */}
      <div className="relative z-10 mx-auto max-w-7xl px-4 lg:px-8">
        {/* ─── Header ─── */}
        <div className="mb-12 sm:mb-16 md:mb-20">
          <span className="block text-xs font-bold uppercase tracking-widest text-primary sm:text-sm">
            03 — Pourquoi nous
          </span>
          <h2 className="mt-3 font-display text-3xl font-black leading-tight tracking-tight text-white sm:text-4xl md:text-5xl lg:text-6xl">
            L&apos;importation,{" "}
            <span className="bg-gradient-to-r from-white via-white/90 to-primary bg-clip-text text-transparent">
              en toute sérénité.
            </span>
          </h2>
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-zinc-400 sm:text-lg">
            Un interlocuteur unique, un suivi transparent et un SAV local pour importer votre véhicule en toute sérénité.
          </p>
        </div>

        {/* ─── Cartes Dark Executive ─── */}
        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item, i) => (
            <div
              key={item.title}
              className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-zinc-800/80 bg-zinc-900/50 p-7 backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-primary/50 hover:bg-zinc-900/80 hover:shadow-2xl hover:shadow-primary/5"
            >
              {/* Numérotation en filigrane */}
              <span className="absolute right-6 top-6 font-display text-4xl font-black text-zinc-800/60 transition-colors duration-300 group-hover:text-primary/20">
                {String(i + 1).padStart(2, "0")}
              </span>

              <div>
                {/* Icône avec effet de brillance */}
                <span className="flex h-12 w-12 items-center justify-center rounded-xl border border-zinc-700/60 bg-zinc-800/80 text-primary shadow-inner transition-colors duration-300 group-hover:border-primary group-hover:bg-primary group-hover:text-black">
                  <item.icon className="h-5 w-5" strokeWidth={2} />
                </span>

                <h3 className="mt-6 font-display text-lg font-bold leading-tight text-white sm:text-xl">
                  {item.title}
                </h3>

                <p className="mt-3 text-sm leading-relaxed text-zinc-400">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}