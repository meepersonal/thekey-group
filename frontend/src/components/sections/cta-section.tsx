import { ArrowRight, ArrowUpRight, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "@/lib/router";

export function CtaSection() {
  return (
    <section className="mx-auto max-w-7xl px-4 pb-4 lg:px-8">
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-600 via-emerald-600 to-emerald-700 px-6 py-12 text-center text-white sm:px-12">

        {/* Motif décoratif discret en arrière-plan */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-10"
          style={{
            backgroundImage:
              "radial-gradient(circle, white 1.5px, transparent 1.5px)",
            backgroundSize: "24px 24px",
          }}
        />

        {/* Halo lumineux */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute left-1/2 top-0 h-64 w-[600px] -translate-x-1/2 rounded-full bg-white/10 blur-[100px]"
        />

        <div className="relative z-10">
          <h2 className="font-display text-2xl font-extrabold sm:text-3xl">
            Prêt à importer votre véhicule ?
          </h2>

          <p className="mx-auto mt-3 max-w-2xl text-sm text-white/85 sm:text-base">
            Obtenez un devis détaillé en FCFA sous 24 h, avec délai de livraison estimé au Port de
            votre pays.
          </p>

          <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
            {/* CTA principal — émeraude (cohérent avec le header) */}
            <Button
              asChild
              size="lg"
              className="group h-12 gap-2 rounded-full bg-white px-7 text-sm font-bold text-emerald-700 shadow-lg shadow-emerald-900/20 transition hover:scale-[1.02] hover:bg-white/90"
            >
              <Link to="/catalogue" className="inline-flex items-center gap-2">
                Choisir votre véhicule
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>

            {/* CTA secondaire — outline */}
            <Button
              asChild
              size="lg"
              className="group h-12 gap-2 rounded-full border-2 border-white/30 bg-transparent px-7 text-sm font-bold text-white backdrop-blur-md transition hover:border-white hover:bg-white/10"
            >
              <Link
                to="/tracking"
                search={{ code: "" }}
                className="inline-flex items-center gap-2"
              >
                <ShieldCheck className="h-4 w-4 shrink-0" />
                Suivre votre véhicule
                <ArrowUpRight className="h-3.5 w-3.5 shrink-0 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}