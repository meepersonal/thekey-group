import { ArrowRight, Compass, ShieldCheck, CheckCircle2, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "@/lib/router";
import { usePublicSettings } from "@/data/public-store";
import { whatsappLink } from "@/lib/image";

export function HeroSection() {
  // Numéro WhatsApp piloté par Paramètres → Contact (clé `whatsapp_number`).
  const { data: settings } = usePublicSettings();
  const chatUrl = whatsappLink(settings?.whatsapp_number);

  return (
    <section className="relative flex min-h-[90vh] w-full flex-col justify-between overflow-hidden bg-black p-6 lg:p-12">
      {/* ─── Vidéo de fond en boucle ─── */}
      <video
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        className="absolute inset-0 h-full w-full object-cover opacity-75"
        src="hero.mp4"
      />

      {/* Dégradés superposés pour la lisibilité */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/85 via-black/50 to-black/95" />

      {/* ─── Contenu Haut ─── */}
      <div className="relative z-10 mx-auto w-full max-w-5xl pt-8 text-center lg:pt-16">
        {/* Badge autorité */}
        <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 font-display text-[11px] font-bold uppercase tracking-[0.2em] text-white backdrop-blur-md">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
          </span>
          THE KEY-GROUP • Livraison garantie en 30 jours
        </span>

        {/* ─── TITRE : douleur → solution ─── */}
        <h1 className="mt-6 font-display text-4xl font-black leading-[1.1] tracking-tight text-white sm:text-6xl lg:text-7xl">
          Arrêtez de payer{" "}
          <span className="relative inline-block">
            <span className="text-white/60 line-through decoration-red-500/70 decoration-[3px]">
              plus cher.
            </span>
          </span>
          <br />
          <span className="bg-gradient-to-r from-primary via-white to-accent bg-clip-text text-transparent">
            Faites venir votre véhicule.
          </span>
        </h1>

        {/* ─── DESCRIPTION : frustrations + promesse ─── */}
        <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-white/80 sm:text-lg">
          Fini les intermédiaires qui gonflent les prix, les frais cachés à l'arrivée et les mois
          d'attente sans nouvelle.{" "}
          <span className="font-semibold text-white">
            Sourcing, transport et dédouanement : on gère tout
          </span>
          , de l'usine en Chine jusqu'à votre port.{" "}
        </p>

        {/* ─── CTA ─── */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <Button
            asChild
            size="lg"
            className="group h-14 rounded-full bg-white px-9 font-display text-base font-bold text-black shadow-2xl shadow-white/10 transition hover:scale-[1.02] hover:bg-white/90"
          >
            <Link to="/catalogue" className="inline-flex items-center gap-2">
              Démarrer mon importation
              <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Link>
          </Button>

          <Button
            asChild
            size="lg"
            variant="outline"
            className="h-14 rounded-full border-2 border-white/30 bg-black/30 px-9 font-display text-base font-bold text-white backdrop-blur-md hover:border-white hover:bg-white/10"
          >
            {chatUrl ? (
              <a href={chatUrl} target="_blank" rel="noopener noreferrer">
                <MessageCircle className="mr-2 h-5 w-5" />
                Discuter sur WhatsApp
              </a>
            ) : (
              <Link to="/contact">
                <MessageCircle className="mr-2 h-5 w-5" />
                Discuter avec un conseiller
              </Link>
            )}
          </Button>
        </div>
      </div>
    </section>
  );
}
