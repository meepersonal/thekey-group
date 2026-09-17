import { createFileRoute } from "@tanstack/react-router";
import { Ship } from "lucide-react";
import { TrackingPanel } from "@/components/tracking-panel";

export const Route = createFileRoute("/tracking")({
  validateSearch: (search: Record<string, unknown>) => ({
    code: typeof search["code"] === "string" ? (search["code"] as string) : "",
  }),
  head: () => ({
    meta: [
      { title: "Suivi de conteneur maritime — AutoTrack Bénin" },
      {
        name: "description",
        content:
          "Suivez en temps réel votre conteneur de véhicule importé de Chine jusqu'au Port de Cotonou : navire, ETA et dédouanement.",
      },
      { property: "og:title", content: "Suivi de conteneur maritime — AutoTrack Bénin" },
      {
        property: "og:description",
        content: "Entrez votre numéro de conteneur et suivez votre véhicule de la Chine à Cotonou.",
      },
    ],
  }),
  component: TrackingPage,
});

function TrackingPage() {
  const { code } = Route.useSearch();

  return (
    <div>
      <section className="bg-gradient-navy py-14 text-navy-foreground">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <span className="inline-flex items-center gap-2 rounded-full glass-panel px-4 py-1.5 text-xs font-semibold">
            <Ship className="h-4 w-4 text-accent" />
            Suivi maritime en direct
          </span>
          <h1 className="mt-4 text-3xl font-extrabold sm:text-4xl">Tracking de conteneur</h1>
          <p className="mt-3 max-w-2xl text-navy-foreground/75">
            Entrez votre numéro de conteneur ou votre code de suivi pour connaître la position et la
            date d'arrivée estimée de votre véhicule.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-10 lg:px-8">
        <TrackingPanel key={code} initialCode={code} />
      </section>
    </div>
  );
}
