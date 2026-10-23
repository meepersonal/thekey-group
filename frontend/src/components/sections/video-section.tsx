import { useState, useRef } from "react";
import { Link } from "@/lib/router";
import {
  ArrowRight,
  Volume2,
  VolumeX,
  Play,
  Pause,
  CheckCircle2,
  ShieldCheck,
  Compass,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const values = [
  {
    icon: Compass,
    title: "Accompagnement",
    desc: "Un conseiller dédié du choix à la remise des clés.",
    number: "01",
  },
  {
    icon: ShieldCheck,
    title: "Transparence",
    desc: "Traçabilité complète et contrôle rigoureux.",
    number: "02",
  },
  {
    icon: CheckCircle2,
    title: "Livraison clé en main",
    desc: "Prise en charge logistique et administrative.",
    number: "03",
  },
];

export function VideoSection() {
  const [isMuted, setIsMuted] = useState(true);
  const [isPlaying, setIsPlaying] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) videoRef.current.pause();
      else videoRef.current.play();
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <section className="relative overflow-hidden border-t border-slate-100 bg-gradient-to-b from-white via-slate-50/50 to-white py-20 sm:py-24 lg:py-32">
      {/* Décor ambiant */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-40 top-1/4 h-[500px] w-[500px] rounded-full bg-primary/10 blur-[140px]" />
        <div className="absolute -right-40 bottom-1/4 h-[500px] w-[500px] rounded-full bg-accent/10 blur-[140px]" />
        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage:
              "linear-gradient(to right, #0f172a 1px, transparent 1px), linear-gradient(to bottom, #0f172a 1px, transparent 1px)",
            backgroundSize: "64px 64px",
          }}
        />
      </div>

      <div className="relative mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">

        <div className="grid grid-cols-1 items-center gap-14 lg:grid-cols-12 lg:gap-20">
          {/* ═══════ VIDÉO ═══════ */}
          <div className="relative flex justify-center lg:col-span-5">
            {/* Anneau lumineux statique */}
            <div
              aria-hidden="true"
              className="absolute inset-0 -z-10 m-auto h-[480px] w-[480px] rounded-full opacity-40 blur-xl"
              style={{
                background:
                  "conic-gradient(from 0deg, transparent, hsl(var(--primary) / 0.7), transparent, hsl(var(--accent) / 0.7), transparent)",
              }}
            />

            {/* Ombre au sol */}
            <div
              aria-hidden="true"
              className="absolute -bottom-3 left-1/2 -z-10 h-10 w-3/4 -translate-x-1/2 rounded-[50%] bg-slate-900/40 blur-3xl"
            />

            {/* Carte vidéo */}
            <div className="group relative w-full max-w-[340px] cursor-pointer sm:max-w-[380px] lg:max-w-[400px]">
              {/* Cadre */}
              <div className="relative rounded-[2rem] border border-slate-200/40 bg-gradient-to-b from-white to-slate-100 p-2.5 shadow-[0_25px_70px_-20px_rgba(15,23,42,0.35)] sm:p-3">
                {/* Reflet haut */}
                <div className="pointer-events-none absolute inset-x-6 top-1 h-px bg-gradient-to-r from-transparent via-white to-transparent" />

                <div className="relative overflow-hidden rounded-[1.5rem] bg-black">
                  <div className="relative aspect-[9/16] w-full overflow-hidden">
                    <video
                      ref={videoRef}
                      className="h-full w-full object-cover"
                      src="presentation.mp4"
                      autoPlay
                      muted
                      loop
                      playsInline
                      preload="metadata"
                    />

                    <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-black/60 to-transparent" />
                    <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

                    {/* Badge son */}
                    <button
                      onClick={toggleMute}
                      className="absolute left-3 top-3 flex items-center gap-1.5 rounded-full border border-white/20 bg-black/40 px-3 py-1.5 text-[10px] font-medium text-white backdrop-blur-md transition-colors hover:bg-black/60 sm:left-4 sm:top-4 sm:text-xs"
                    >
                      {isMuted ? (
                        <>
                          <VolumeX className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                          <span className="hidden sm:inline">Son</span>
                        </>
                      ) : (
                        <>
                          <Volume2 className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                          <span className="hidden sm:inline">Son</span>
                        </>
                      )}
                    </button>

                    <div className="absolute inset-x-3 bottom-3 flex items-end justify-between sm:inset-x-5 sm:bottom-5">
                      <div>
                        <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/90 sm:text-xs">
                          Message fondateur
                        </p>
                        <p className="mt-1 text-[9px] uppercase tracking-[0.3em] text-white/50 sm:text-[10px]">
                          The Key-Group
                        </p>
                      </div>

                      <button
                        onClick={togglePlay}
                        className="flex h-11 w-11 items-center justify-center rounded-full border border-white/30 bg-white/10 text-white backdrop-blur-md transition-colors hover:bg-white/20 sm:h-12 sm:w-12"
                      >
                        {isPlaying ? (
                          <Pause className="h-4 w-4" />
                        ) : (
                          <Play className="ml-0.5 h-4 w-4" />
                        )}
                      </button>
                    </div>

                    <div className="absolute right-3 top-3 flex items-center gap-1.5 rounded-full border border-white/20 bg-black/40 px-2.5 py-1 backdrop-blur-md sm:right-4 sm:top-4">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                      <span className="text-[9px] font-semibold uppercase tracking-wider text-white/90 sm:text-[10px]">
                        Live
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ═══════ CONTENU ═══════ */}
          <div className="flex flex-col justify-center text-center lg:col-span-7 lg:text-left">
            <div className="flex items-center justify-center gap-3 lg:justify-start">
              <span className="block text-xs font-bold uppercase tracking-widest text-primary sm:text-sm">
                04 — Engagement key-group
              </span>
            </div>

            <h3 className="mt-6 font-display text-3xl font-black leading-[1.1] tracking-[-0.02em] text-slate-900 sm:text-4xl lg:text-5xl">
              Redéfinir les standards
              <br className="hidden sm:block" />{" "}
              <span className="italic font-light text-slate-700">
                de l'importation automobile.
              </span>
            </h3>

            <p className="mt-6 text-base leading-relaxed text-slate-600 sm:text-lg">
              Nous ne faisons pas que livrer des véhicules. Nous garantissons une expérience
              d'achat sereine, claire et sécurisée à chaque étape du processus.
            </p>

            <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-3">
              {values.map((v) => {
                const Icon = v.icon;
                return (
                  <div
                    key={v.title}
                    className="group relative overflow-hidden rounded-2xl border border-slate-200/70 bg-white/70 p-5 text-left backdrop-blur-sm transition-colors hover:border-primary/30"
                  >
                    <div className="pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full bg-primary/10 opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-100" />

                    <div className="relative flex items-center justify-between">
                      <span className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-primary/15 to-accent/10 text-primary ring-1 ring-primary/10">
                        <Icon className="h-5 w-5" />
                      </span>
                      <span className="font-display text-[10px] font-bold tracking-[0.2em] text-slate-300">
                        {v.number}
                      </span>
                    </div>

                    <h4 className="relative mt-4 font-display text-base font-bold tracking-tight text-slate-900">
                      {v.title}
                    </h4>
                    <p className="relative mt-1.5 text-[13px] leading-relaxed text-slate-500">
                      {v.desc}
                    </p>

                    <div className="absolute inset-x-5 bottom-0 h-px scale-x-0 bg-gradient-to-r from-primary/60 via-accent/60 to-transparent transition-transform duration-500 group-hover:scale-x-100" />
                  </div>
                );
              })}
            </div>

            <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-center lg:justify-start">
              <Button
                asChild
                size="lg"
                variant="accent"
                className="group relative h-13 w-full overflow-hidden rounded-full px-8 font-display text-sm font-bold tracking-wide shadow-lg shadow-accent/25 sm:w-auto"
              >
                <Link to="/contact" className="inline-flex items-center justify-center gap-2">
                  <span className="relative z-10">Parler à un conseiller</span>
                  <ArrowRight className="relative z-10 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  <span className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/25 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}