import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { Link } from "@/lib/router";
import { ArrowRight, Volume2, VolumeX, Play, Pause, Sparkles, CheckCircle2, ShieldCheck, Compass } from "lucide-react";
import { Button } from "@/components/ui/button";

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
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <section className="relative overflow-hidden border-t border-border/50 bg-background py-20 lg:py-28">
      {/* Halo lumineux d'ambiance en arrière-plan */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-20 top-1/2 -z-10 h-[500px] w-[500px] -translate-y-1/2 rounded-full bg-primary/10 blur-[130px]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-20 top-1/2 -z-10 h-[500px] w-[500px] -translate-y-1/2 rounded-full bg-accent/10 blur-[130px]"
      />

      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        {/* En-tête de section */}
        <div className="mb-12 text-center md:mb-16">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/5 px-4 py-1 text-xs font-semibold uppercase tracking-widest text-primary">
            02 — Notre partenaire {import.meta.env.VITE_WEBSITE_NAME}
          </span>
          <h2 className="mt-4 font-display text-3xl font-extrabold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
            Une vision.{" "}
            <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
              Une ambition.
            </span>
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
            Découvrez comment <strong className="font-semibold text-foreground">THE KEY-GROUP</strong> redéfinit l’importation automobile avec une approche transparente et sur-mesure.
          </p>
        </div>

        {/* Conteneur principal style "Carte Master" */}
        <div className="relative overflow-hidden rounded-3xl border border-border/80 bg-gradient-to-b from-card/80 to-card/40 p-6 shadow-2xl backdrop-blur-xl sm:p-10 lg:p-12">
          {/* Grille responsive Video + Informations */}
          <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-12 lg:gap-14">

            {/* ─── Colonne Vidéo (5 cols) ─── */}
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="flex justify-center lg:col-span-5"
            >
              <div className="group relative w-full max-w-[280px] sm:max-w-[310px]">
                {/* Shell Téléphone / Video Frame */}
                <div className="relative overflow-hidden rounded-[2.2rem] border border-white/20 bg-black shadow-2xl">
                  <div className="relative aspect-[9/16] w-full overflow-hidden">
                    <video
                      ref={videoRef}
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                      src="presentation.mp4"
                      autoPlay
                      muted
                      loop
                      playsInline
                      preload="metadata"
                    />

                    {/* Dégradés superposés pour lisibilité */}
                    <div className="pointer-events-none absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-black/70 via-black/20 to-transparent" />
                    <div className="pointer-events-none absolute inset-x-0 bottom-0 h-36 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

                    {/* Badge Haut : En direct / Sound State */}
                    <div className="absolute left-4 top-4 flex items-center gap-2">
                      <button
                        onClick={toggleMute}
                        className="flex items-center gap-2 rounded-full border border-white/20 bg-black/50 px-3 py-1.5 text-xs font-medium text-white backdrop-blur-md transition hover:bg-black/70"
                      >
                        {isMuted ? (
                          <>
                            <VolumeX className="h-3.5 w-3.5 text-white/70" />
                            <span>Activer le son</span>
                          </>
                        ) : (
                          <>
                            <Volume2 className="h-3.5 w-3.5 text-primary animate-pulse" />
                            <span>Son activé</span>
                          </>
                        )}
                      </button>
                    </div>

                    {/* Badge Bas : Commandes interactives */}
                    <div className="absolute bottom-4 inset-x-4 flex items-center justify-between">
                      <div className="text-xs text-white/90">
                        <p className="font-semibold">Message fondateur</p>
                        <p className="text-[10px] text-white/60">THE KEY-GROUP</p>
                      </div>

                      <button
                        onClick={togglePlay}
                        className="flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-black/60 text-white backdrop-blur-md transition hover:scale-110 active:scale-95"
                        aria-label={isPlaying ? "Mettre en pause" : "Lancer la vidéo"}
                      >
                        {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4 ml-0.5" />}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* ─── Colonne Contenu (7 cols) ─── */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="flex flex-col justify-center lg:col-span-7"
            >
              <h3 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                Redéfinir les standards de l’importation automobile.
              </h3>

              <p className="mt-4 text-base leading-relaxed text-muted-foreground sm:text-lg">
                Nous ne faisons pas que livrer des véhicules. Nous garantissons une expérience d'achat sereine, claire et sécurisée à chaque étape du processus.
              </p>

              {/* Puces de valeur ajoutée */}
              <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div className="rounded-2xl border border-border/60 bg-background/50 p-4 backdrop-blur-sm">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <Compass className="h-5 w-5" />
                  </div>
                  <h4 className="mt-3 text-sm font-semibold text-foreground">Accompagnement</h4>
                  <p className="mt-1 text-xs text-muted-foreground">Un conseiller dédié du choix à la remise des clés.</p>
                </div>

                <div className="rounded-2xl border border-border/60 bg-background/50 p-4 backdrop-blur-sm">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <ShieldCheck className="h-5 w-5" />
                  </div>
                  <h4 className="mt-3 text-sm font-semibold text-foreground">Transparence</h4>
                  <p className="mt-1 text-xs text-muted-foreground">Traçabilité complète et contrôle rigoureux.</p>
                </div>

                <div className="rounded-2xl border border-border/60 bg-background/50 p-4 backdrop-blur-sm">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <CheckCircle2 className="h-5 w-5" />
                  </div>
                  <h4 className="mt-3 text-sm font-semibold text-foreground">Livraison clé en main</h4>
                  <p className="mt-1 text-xs text-muted-foreground">Prise en charge logistique et administrative.</p>
                </div>
              </div>

              {/* Actions CTA */}
              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
                <Button asChild size="lg" variant="accent" className="w-full sm:w-auto shadow-lg shadow-accent/20">
                  <Link to="/contact" className="inline-flex items-center justify-center gap-2">
                    Parler à un conseiller
                    <ArrowRight className="h-4 w-4 shrink-0" />
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="w-full sm:w-auto">
                  <Link to="/a-propos">Notre histoire</Link>
                </Button>
              </div>
            </motion.div>

          </div>
        </div>
      </div>
    </section>
  );
}