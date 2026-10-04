import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "@/lib/router";

export function CtaSection() {
  return (
    <section className="mx-auto max-w-7xl px-4 pb-4 lg:px-8">
      <div className="rounded-3xl bg-gradient-navy px-6 py-12 text-center text-navy-foreground sm:px-12">
        <h2 className="font-display text-2xl font-extrabold sm:text-3xl">
          Prêt à importer votre véhicule ?
        </h2>
        <p className="mx-auto mt-3 max-w-2xl text-navy-foreground/75">
          Obtenez un devis détaillé en FCFA sous 24 h, avec délai de livraison estimé au Port de
          Cotonou.
        </p>
        <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
          <Button asChild variant="accent" size="lg">
            <Link to="/catalogue">
              Choisir votre véhicule
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
          <Button
            asChild
            size="lg"
            variant="outline"
            className="border-navy-foreground/30 bg-transparent text-navy-foreground hover:bg-navy-foreground/10"
          >
            <Link to="/tracking" search={{ code: "" }}>
              Suivre votre véhicule
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
