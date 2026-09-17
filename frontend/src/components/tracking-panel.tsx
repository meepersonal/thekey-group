import { useState } from "react";
import {
  Anchor,
  CalendarClock,
  Check,
  Container,
  MessageCircle,
  Search,
  Ship,
  SearchX,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { findShipment, STEPS, waLink, type Shipment } from "@/data/tracking";

export function TrackingPanel({ initialCode = "" }: { initialCode?: string }) {
  const [code, setCode] = useState(initialCode);
  const [result, setResult] = useState<Shipment | null>(() =>
    initialCode ? (findShipment(initialCode) ?? null) : null,
  );
  const [searched, setSearched] = useState(Boolean(initialCode));

  const search = (e: React.FormEvent) => {
    e.preventDefault();
    setResult(findShipment(code) ?? null);
    setSearched(true);
  };

  return (
    <div className="space-y-8">
      <form onSubmit={search} className="surface-card flex flex-col gap-3 p-4 sm:flex-row">
        <div className="relative flex-1">
          <Container className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="Numéro de conteneur ou code de suivi (ex: TRACK123)"
            className="h-13 rounded-xl pl-11 text-base"
          />
        </div>
        <Button type="submit" variant="accent" size="xl">
          <Search className="h-4 w-4" />
          Suivre
        </Button>
      </form>

      {searched && !result && (
        <div className="surface-card flex flex-col items-center gap-4 p-10 text-center">
          <span className="grid h-14 w-14 place-items-center rounded-2xl bg-secondary">
            <SearchX className="h-7 w-7 text-accent" />
          </span>
          <div>
            <h3 className="text-lg font-bold">Aucun conteneur trouvé</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Vérifiez votre code de suivi. Codes de démonstration : TRACK123, CONT-2026-X99,
              AT-2026-0451, AT-2026-0788.
            </p>
          </div>
          <Button asChild variant="accent" size="lg">
            <a
              href={waLink(`Bonjour, je ne retrouve pas mon conteneur avec le code : ${code}`)}
              target="_blank"
              rel="noreferrer"
            >
              <MessageCircle className="h-4 w-4" />
              Contacter le support WhatsApp
            </a>
          </Button>
        </div>
      )}

      {result && (
        <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
          <div className="surface-card p-6">
            <h3 className="text-lg font-bold">Statut de l'expédition</h3>
            <p className="text-sm text-muted-foreground">{result.vehicle}</p>

            <ol className="mt-6 space-y-1">
              {STEPS.map((step, i) => {
                const done = i <= result.currentStep;
                const current = i === result.currentStep;
                return (
                  <li key={step.label} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <span
                        className={
                          "grid h-9 w-9 shrink-0 place-items-center rounded-full text-xs font-bold " +
                          (done
                            ? "bg-gradient-accent text-accent-foreground"
                            : "bg-secondary text-muted-foreground")
                        }
                      >
                        {done ? <Check className="h-4 w-4" /> : i + 1}
                      </span>
                      {i < STEPS.length - 1 && (
                        <span
                          className={
                            "my-1 w-0.5 flex-1 rounded " +
                            (i < result.currentStep ? "bg-accent" : "bg-border")
                          }
                        />
                      )}
                    </div>
                    <div className="pb-6">
                      <p
                        className={
                          "text-sm font-bold " + (current ? "text-accent" : done ? "" : "text-muted-foreground")
                        }
                      >
                        {step.label}
                        {current && (
                          <span className="ml-2 rounded-full bg-accent/15 px-2 py-0.5 text-[10px] font-bold uppercase text-accent">
                            En cours
                          </span>
                        )}
                      </p>
                      <p className="mt-0.5 text-sm text-muted-foreground">{step.description}</p>
                    </div>
                  </li>
                );
              })}
            </ol>
          </div>

          <div className="surface-card h-fit p-6">
            <h3 className="text-lg font-bold">Détails navire & conteneur</h3>
            <dl className="mt-5 space-y-4 text-sm">
              <Row icon={<Container className="h-4 w-4" />} label="N° de conteneur" value={result.container} />
              <Row icon={<Ship className="h-4 w-4" />} label="Navire" value={`${result.vessel} — ${result.carrier}`} />
              <Row icon={<Anchor className="h-4 w-4" />} label="Port de départ" value={result.portDepart} />
              <Row icon={<Anchor className="h-4 w-4" />} label="Port d'arrivée" value={result.portArrivee} />
              <Row icon={<CalendarClock className="h-4 w-4" />} label="Départ" value={result.departureDate} />
              <Row icon={<CalendarClock className="h-4 w-4" />} label="ETA estimée" value={result.eta} />
            </dl>
            <Button asChild variant="navy" size="lg" className="mt-6 w-full">
              <a
                href={waLink(
                  `Bonjour, je souhaite des nouvelles de mon conteneur ${result.container} (code ${result.code}).`,
                )}
                target="_blank"
                rel="noreferrer"
              >
                <MessageCircle className="h-4 w-4" />
                Demander une mise à jour
              </a>
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

function Row({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-start gap-3">
      <span className="mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-secondary text-accent">
        {icon}
      </span>
      <div className="min-w-0">
        <dt className="text-xs uppercase tracking-wide text-muted-foreground">{label}</dt>
        <dd className="font-semibold">{value}</dd>
      </div>
    </div>
  );
}
