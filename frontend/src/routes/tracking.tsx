import { useSearch } from "@/lib/router";
import { Ship } from "lucide-react";
import { TrackingPanel } from "@/components/tracking-panel";

export function TrackingPage() {
  const { code } = useSearch();

  return (
    <div>
      <section className="bg-gradient-navy py-14 text-navy-foreground">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <span className="inline-flex items-center gap-2 rounded-full glass-panel px-4 py-1.5 text-xs font-semibold">
            <Ship className="h-4 w-4 text-accent" />
            Suivi maritime en direct
          </span>
          <h1 className="mt-4 text-3xl font-extrabold sm:text-4xl">Suivi de commande</h1>
          <p className="mt-3 max-w-2xl text-navy-foreground/75">
            Saisissez la référence reçue par e-mail (RES-2026-007), votre code de rendez-vous (MW94)
            ou votre numéro de conteneur pour connaître l'avancement de votre véhicule.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-10 lg:px-8">
        <TrackingPanel key={code ?? ""} initialCode={code ?? ""} />
      </section>
    </div>
  );
}
