"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import type { WhyChineseItem } from "@/data/home-data";

interface WhyChineseSectionProps {
  items: WhyChineseItem[];
}

export function WhyChineseSection({ items }: WhyChineseSectionProps) {
  const [activeStep, setActiveStep] = useState(0);

  // Rotation automatique toutes les 3 secondes
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % items.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [items.length]);

  return (
    <section
      className="relative overflow-hidden bg-zinc-950 py-16 text-white sm:py-20 lg:py-32"
      style={{
        backgroundImage: `
          linear-gradient(to right, rgba(168, 85, 247, 0.08) 1px, transparent 1px),
          linear-gradient(to bottom, rgba(168, 85, 247, 0.08) 1px, transparent 1px),
          linear-gradient(to right, rgba(168, 85, 247, 0.16) 1px, transparent 1px),
          linear-gradient(to bottom, rgba(168, 85, 247, 0.16) 1px, transparent 1px)
        `,
        backgroundSize: "56px 56px, 56px 56px, 280px 280px, 280px 280px",
      }}
    >
      {/* Halo violet central */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/3 h-[600px] w-[800px] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-40 blur-[140px]"
        style={{
          background:
            "radial-gradient(circle, rgba(168, 85, 247, 0.35) 0%, rgba(139, 92, 246, 0.15) 40%, transparent 70%)",
        }}
      />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* ─── Header ─── */}
        <div className="mb-12 sm:mb-16 md:mb-20">
          <span className="block text-xs font-bold uppercase tracking-widest text-primary sm:text-sm">
            02 — Méthode
          </span>
          <h2 className="mt-3 font-display text-3xl font-black leading-tight tracking-tight text-white sm:text-4xl md:text-5xl lg:text-6xl">
            De la précommande à l'entretien.
          </h2>
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-zinc-400 sm:text-lg">
            Un parcours fluide, transparent et sans friction — de votre première visite à la réception
            de votre commande.
          </p>
        </div>

        {/* ─── Timeline ─── */}
        <div className="relative mt-12 sm:mt-16 lg:mt-24">
          {/* ═══════ VERSION DESKTOP (≥ lg) ═══════ */}
          <div className="hidden lg:block">
            <div className="absolute left-[12.5%] right-[12.5%] top-6 h-[2px]">
              <div className="absolute inset-0 h-full w-full bg-zinc-800" />

              <motion.div
                className="absolute left-0 top-0 h-full bg-gradient-to-r from-primary to-accent"
                initial={{ width: "0%" }}
                animate={{
                  width: items.length > 1 ? `${(activeStep / (items.length - 1)) * 100}%` : "100%",
                }}
                transition={{ duration: 0.6, ease: "easeInOut" }}
              />

              <motion.div
                className="absolute top-1/2 h-[3px] w-24 -translate-y-1/2 rounded-full bg-gradient-to-r from-transparent via-primary to-transparent opacity-90"
                style={{ filter: "blur(1px)" }}
                animate={{ left: ["-10%", "100%"] }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              />
            </div>

            <div className="relative grid grid-cols-4 gap-4 xl:gap-6">
              {items.map((item, i) => {
                const isActive = i === activeStep;
                const isCompleted = i <= activeStep;

                return (
                  <div
                    key={item.title}
                    onClick={() => setActiveStep(i)}
                    className="group flex cursor-pointer flex-col items-center text-center"
                  >
                    <div className="relative mb-6">
                      {isActive && (
                        <motion.span
                          className="absolute inset-0 rounded-full bg-primary/30 blur-md"
                          animate={{ scale: [1, 1.5, 1], opacity: [0.6, 0.2, 0.6] }}
                          transition={{ duration: 2, repeat: Infinity }}
                        />
                      )}
                      <div
                        className={`relative z-10 flex h-12 w-12 items-center justify-center rounded-full border-2 transition-all duration-500 ${isCompleted
                          ? "border-primary bg-primary font-extrabold text-black shadow-lg shadow-primary/20"
                          : "border-zinc-800 bg-zinc-900 text-zinc-500 group-hover:border-zinc-700"
                          }`}
                      >
                        <span className="text-sm">{String(i + 1).padStart(2, "0")}</span>
                      </div>
                    </div>

                    <h3
                      className={`mb-3 text-lg font-bold leading-tight transition-colors duration-500 xl:text-xl ${isCompleted ? "text-white" : "text-zinc-600 group-hover:text-zinc-400"
                        }`}
                    >
                      {item.title}
                    </h3>

                    <p className="mx-auto min-h-[6.5rem] max-w-[220px] text-xs leading-relaxed text-zinc-400">
                      {item.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* ═══════ VERSION MOBILE (< lg) ═══════ */}
          <div className="relative lg:hidden">
            <div className="absolute bottom-0 left-6 top-0 w-[2px] bg-zinc-800" />
            <motion.div
              className="absolute left-6 top-0 w-[2px] bg-gradient-to-b from-primary to-accent"
              initial={{ height: "0%" }}
              animate={{
                height: items.length > 1 ? `${(activeStep / (items.length - 1)) * 100}%` : "100%",
              }}
              transition={{ duration: 0.6, ease: "easeInOut" }}
            />

            <ul className="relative flex flex-col gap-8 sm:gap-10">
              {items.map((item, i) => {
                const isActive = i === activeStep;
                const isCompleted = i <= activeStep;

                return (
                  <li
                    key={item.title}
                    onClick={() => setActiveStep(i)}
                    className="relative flex cursor-pointer gap-4 sm:gap-5"
                  >
                    <div className="relative shrink-0">
                      {isActive && (
                        <motion.span
                          className="absolute inset-0 rounded-full bg-primary/30 blur-md"
                          animate={{ scale: [1, 1.5, 1], opacity: [0.6, 0.2, 0.6] }}
                          transition={{ duration: 2, repeat: Infinity }}
                        />
                      )}
                      <div
                        className={`relative z-10 flex h-12 w-12 items-center justify-center rounded-full border-2 transition-all duration-500 ${isCompleted
                          ? "border-primary bg-primary font-extrabold text-black shadow-lg shadow-primary/20"
                          : "border-zinc-800 bg-zinc-900 text-zinc-500"
                          }`}
                      >
                        <span className="text-sm">{String(i + 1).padStart(2, "0")}</span>
                      </div>
                    </div>

                    <div className="pb-1 pt-1">
                      <h3
                        className={`mb-2 text-base font-bold leading-tight transition-colors duration-500 sm:text-lg ${isCompleted ? "text-white" : "text-zinc-500"
                          }`}
                      >
                        {item.title}
                      </h3>
                      <p className="max-w-prose text-sm leading-relaxed text-zinc-400">
                        {item.description}
                      </p>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}