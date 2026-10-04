import { useState } from "react";
import {
  Anchor,
  CalendarClock,
  Check,
  Container as ContainerIcon,
  MessageCircle,
  Search,
  SearchX,
  Ship,
  Car,
  MapPin,
  Loader2,
  PackageSearch,
  Fuel,
  Settings2,
  Gauge,
  Users,
  ArrowRight,
  Copy,
  CheckCircle2,
  Clock3,
  Navigation,
  Plane,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useTracking } from "@/data/public-store";
import { CONTAINER_STAGES } from "@/data/admin-store";
import { waLink } from "@/data/tracking";

const formatDate = (value: string | null) =>
  value ? new Date(`${value.slice(0, 10)}T00:00:00`).toLocaleDateString("fr-FR") : "—";

const formatDateLong = (value: string | null) =>
  value
    ? new Date(`${value.slice(0, 10)}T00:00:00`).toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "short",
      year: "numeric",
    })
    : "—";

export function TrackingPanel({ initialCode = "" }: { initialCode?: string }) {
  const [input, setInput] = useState(initialCode);
  const [code, setCode] = useState(initialCode);
  const [copied, setCopied] = useState(false);

  const { data, isLoading, isError } = useTracking(code);
  const searched = Boolean(code.trim());

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setCode(input.trim());
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const reference = data?.preorder?.reference ?? data?.container?.code ?? "";

  return (
    <div className="w-full space-y-6">
      {/* ═══════════════════════════════════════════════════════
          BARRE DE RECHERCHE
      ═══════════════════════════════════════════════════════ */}
      <form
        onSubmit={onSubmit}
        className="surface-card mx-auto flex w-full max-w-3xl flex-col gap-2 p-2 sm:flex-row"
      >
        <div className="relative flex-1">
          <ContainerIcon className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="RES-2026-007, MW94 ou CONT-2026-…"
            aria-label="Référence de commande ou de conteneur"
            className="h-13 rounded-xl border-0 bg-transparent pl-12 text-base shadow-none focus-visible:ring-0"
          />
        </div>
        <Button
          type="submit"
          variant="accent"
          size="xl"
          disabled={isLoading}
          className="rounded-xl"
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Search className="h-4 w-4" />
          )}
          Suivre
        </Button>
      </form>

      {/* ═══════════════════════════════════════════════════════
          ÉTATS
      ═══════════════════════════════════════════════════════ */}
      {searched && isLoading && (
        <div className="surface-card mx-auto flex max-w-4xl flex-col items-center gap-5 p-14 text-center">
          <div className="relative">
            <div className="absolute inset-0 animate-ping rounded-full bg-accent/30" />
            <div className="relative grid h-14 w-14 place-items-center rounded-full bg-accent/10">
              <Loader2 className="h-6 w-6 animate-spin text-accent" />
            </div>
          </div>
          <div>
            <p className="font-semibold">Recherche en cours…</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Nous interrogeons nos serveurs pour retrouver votre commande.
            </p>
          </div>
        </div>
      )}

      {searched && (isError || !data) && !isLoading && (
        <div className="surface-card mx-auto flex max-w-2xl flex-col items-center gap-6 p-12 text-center">
          <span className="relative grid h-20 w-20 place-items-center rounded-3xl bg-gradient-to-br from-secondary to-secondary/50">
            <span className="absolute inset-0 rounded-3xl bg-accent/5 blur-xl" />
            <SearchX className="relative h-9 w-9 text-accent" />
          </span>
          <div>
            <h3 className="font-display text-2xl font-extrabold">Aucune commande trouvée</h3>
            <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
              Vérifiez la référence (format{" "}
              <span className="rounded bg-secondary px-1.5 py-0.5 font-mono text-xs font-semibold text-foreground">
                RES-2026-007
              </span>
              ), le code RDV (
              <span className="rounded bg-secondary px-1.5 py-0.5 font-mono text-xs font-semibold text-foreground">
                MW94
              </span>
              ) ou le numéro de conteneur.
            </p>
          </div>
          <Button asChild variant="accent" size="lg" className="rounded-xl">
            <a
              href={waLink(
                `Bonjour, je ne retrouve pas ma commande avec la référence : ${code}`,
              )}
              target="_blank"
              rel="noreferrer"
            >
              <MessageCircle className="h-4 w-4" />
              Contacter le support WhatsApp
            </a>
          </Button>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════
          RÉSULTAT
      ═══════════════════════════════════════════════════════ */}
      {data && (
        <div className="space-y-6">
          {/* ─── Bandeau de statut rapide ─── */}
          <div className="surface-card flex flex-wrap items-center justify-between gap-4 p-5 sm:p-6">
            <div className="flex items-center gap-4">
              <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-accent/20 to-accent/5 text-accent ring-1 ring-inset ring-accent/20">
                <Navigation className="h-5 w-5" />
              </span>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                  En ce moment
                </p>
                <p className="mt-0.5 font-display text-lg font-extrabold leading-tight">
                  {data.container
                    ? CONTAINER_STAGES[data.container.stage]
                    : "En attente d'affectation"}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {data.preorder && (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-accent/15 to-accent/5 px-3 py-1.5 text-xs font-bold text-accent ring-1 ring-inset ring-accent/20">
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-accent" />
                  {data.preorder.status}
                </span>
              )}
              {data.container && (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-secondary px-3 py-1.5 text-xs font-bold text-foreground">
                  Étape {data.container.stage + 1} / {CONTAINER_STAGES.length}
                </span>
              )}
            </div>
          </div>

          {/* ─── Grille 2 colonnes ─── */}
          <div className="grid gap-6 lg:grid-cols-[1fr_1.4fr]">
            {/* ═══ COLONNE GAUCHE ═══ */}
            <div className="space-y-6">
              {/* ─── Carte commande ─── */}
              <div className="surface-card relative overflow-hidden p-6">
                <div className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-accent/5 blur-3xl" />

                <div className="relative">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground">
                        Votre commande
                      </p>
                      <div className="mt-1 flex items-center gap-2">
                        <h3 className="font-display text-2xl font-extrabold tracking-tight">
                          {reference}
                        </h3>
                        <button
                          type="button"
                          onClick={() => handleCopy(reference)}
                          aria-label="Copier la référence"
                          className="grid h-7 w-7 place-items-center rounded-md text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                        >
                          {copied ? (
                            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                          ) : (
                            <Copy className="h-3.5 w-3.5" />
                          )}
                        </button>
                      </div>
                      {data.preorder?.appointment_code && (
                        <p className="mt-2 inline-flex items-center gap-2 rounded-lg bg-amber-50 px-2.5 py-1 text-[11px] font-bold text-amber-700 ring-1 ring-inset ring-amber-200">
                          <span className="tracking-widest">
                            Code RDV · {data.preorder.appointment_code}
                          </span>
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Véhicule */}
                  {data.vehicle ? (
                    <div className="mt-6 overflow-hidden rounded-2xl border border-border/60 bg-gradient-to-b from-secondary/40 to-secondary/10">
                      <div className="flex items-center gap-4 p-5">
                        {data.vehicle.image && (
                          <div className="relative shrink-0 overflow-hidden rounded-xl border border-border/60 bg-background shadow-lg">
                            <img
                              src={data.vehicle.image}
                              alt={`${data.vehicle.brand} ${data.vehicle.model}`}
                              loading="lazy"
                              className="h-24 w-32 object-cover"
                            />
                          </div>
                        )}
                        <div className="min-w-0 flex-1">
                          <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-accent">
                            {data.vehicle.brand}
                          </p>
                          <p className="mt-0.5 font-display text-xl font-extrabold leading-tight">
                            {data.vehicle.model}
                          </p>
                          <p className="mt-1 text-xs text-muted-foreground">
                            {[data.vehicle.year, data.vehicle.condition]
                              .filter(Boolean)
                              .join(" · ")}
                          </p>
                        </div>
                      </div>

                      <dl className="grid grid-cols-2 gap-2 border-t border-border/60 bg-background/70 p-4 sm:grid-cols-3">
                        {data.vehicle.year && (
                          <VehicleSpec
                            icon={CalendarClock}
                            label="Année"
                            value={String(data.vehicle.year)}
                          />
                        )}
                        {data.vehicle.energy && (
                          <VehicleSpec icon={Fuel} label="Énergie" value={data.vehicle.energy} />
                        )}
                        {data.vehicle.transmission && (
                          <VehicleSpec
                            icon={Settings2}
                            label="Transmission"
                            value={data.vehicle.transmission}
                          />
                        )}
                        {data.vehicle.condition && (
                          <VehicleSpec icon={Check} label="État" value={data.vehicle.condition} />
                        )}
                        {typeof data.vehicle.mileage_km === "number" && (
                          <VehicleSpec
                            icon={Gauge}
                            label="Kilométrage"
                            value={`${new Intl.NumberFormat("fr-FR").format(data.vehicle.mileage_km)} km`}
                          />
                        )}
                        {data.vehicle.nombre_places && (
                          <VehicleSpec
                            icon={Users}
                            label="Places"
                            value={String(data.vehicle.nombre_places)}
                          />
                        )}
                      </dl>
                    </div>
                  ) : (
                    <p className="mt-6 inline-flex items-center gap-2 rounded-xl bg-secondary/40 p-4 text-sm text-muted-foreground">
                      <Car className="h-4 w-4" />
                      Suivi par code conteneur — le véhicule n'est pas encore rattaché.
                    </p>
                  )}
                </div>
              </div>

              {/* ─── Carte conteneur ─── */}
              <div className="surface-card relative overflow-hidden p-6">
                <div className="pointer-events-none absolute -right-20 -bottom-20 h-48 w-48 rounded-full bg-sky-400/5 blur-3xl" />

                <div className="relative flex items-center gap-2.5">
                  <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-sky-100 to-sky-50 text-sky-600 ring-1 ring-inset ring-sky-200">
                    <ContainerIcon className="h-4 w-4" />
                  </span>
                  <h3 className="text-lg font-bold">Conteneur</h3>
                </div>

                {!data.container ? (
                  <p className="relative mt-5 inline-flex items-start gap-2 rounded-xl bg-secondary/40 p-4 text-sm text-muted-foreground">
                    <PackageSearch className="mt-0.5 h-4 w-4 shrink-0" />
                    Pas encore affecté à un conteneur. Vous serez notifié dès le chargement.
                  </p>
                ) : (
                  <dl className="relative mt-5 grid grid-cols-2 gap-4">
                    <InfoCell
                      icon={<ContainerIcon className="h-3.5 w-3.5" />}
                      label="N° conteneur"
                      value={data.container.code}
                      highlight
                    />
                    <InfoCell
                      icon={<Ship className="h-3.5 w-3.5" />}
                      label="Navire"
                      value={data.container.vessel || "—"}
                    />
                    <InfoCell
                      icon={<Anchor className="h-3.5 w-3.5" />}
                      label="Port de départ"
                      value={data.container.port_depart || "—"}
                    />
                    <InfoCell
                      icon={<Plane className="h-3.5 w-3.5" />}
                      label="Port d'arrivée"
                      value={data.container.port_arrivee || "—"}
                    />
                    <InfoCell
                      icon={<CalendarClock className="h-3.5 w-3.5" />}
                      label="Départ"
                      value={formatDateLong(data.container.departure_date)}
                    />
                    <InfoCell
                      icon={<CalendarClock className="h-3.5 w-3.5" />}
                      label="ETA estimée"
                      value={formatDateLong(data.container.eta)}
                      highlight
                    />
                  </dl>
                )}
              </div>
            </div>

            {/* ═══ COLONNE DROITE — Timeline ═══ */}
            {data.container && (
              <div className="surface-card relative overflow-hidden p-6 lg:p-8">
                <div className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full bg-accent/5 blur-3xl" />

                <div className="relative flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-emerald-100 to-emerald-50 text-emerald-600 ring-1 ring-inset ring-emerald-200">
                      <Ship className="h-4 w-4" />
                    </span>
                    <div>
                      <h3 className="text-lg font-bold">Suivi de l'expédition</h3>
                      <p className="text-xs text-muted-foreground">
                        Mise à jour en temps réel
                      </p>
                    </div>
                  </div>
                  <span className="hidden items-center gap-1.5 rounded-full bg-accent/10 px-3 py-1.5 text-[11px] font-bold text-accent ring-1 ring-inset ring-accent/20 sm:inline-flex">
                    <Clock3 className="h-3 w-3" />
                    {data.container.stage + 1} / {CONTAINER_STAGES.length}
                  </span>
                </div>

                {/* Barre de progression globale */}
                <div className="relative mt-6">
                  <div className="h-2 w-full overflow-hidden rounded-full bg-secondary">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-emerald-500 via-emerald-400 to-accent transition-all duration-700 ease-out"
                      style={{
                        width: `${((data.container.stage + 1) / CONTAINER_STAGES.length) * 100}%`,
                      }}
                    />
                  </div>
                  <div className="mt-2 flex justify-between text-[11px] font-semibold text-muted-foreground">
                    <span>Départ</span>
                    <span className="text-accent">
                      {Math.round(
                        ((data.container.stage + 1) / CONTAINER_STAGES.length) * 100,
                      )}
                      %
                    </span>
                    <span>Arrivée</span>
                  </div>
                </div>

                <ol className="relative mt-8">
                  {/* Rail de fond */}
                  <span
                    className="absolute left-[19px] top-0 w-0.5 bg-border"
                    style={{ height: "calc(100% - 2.5rem)" }}
                    aria-hidden
                  />

                  {/* Lueur animée */}
                  <span
                    className="pointer-events-none absolute left-[19px] top-0 w-0.5 overflow-hidden"
                    style={{
                      height: `calc(${((data.container.stage + 1) / CONTAINER_STAGES.length) * 100}% - 2rem)`,
                    }}
                    aria-hidden
                  >
                    <span className="animate-timeline-glow absolute left-0 h-16 w-0.5">
                      <span className="absolute inset-0 bg-gradient-to-b from-transparent via-accent to-transparent blur-[2px]" />
                      <span className="absolute inset-0 bg-gradient-to-b from-transparent via-accent/80 to-transparent" />
                    </span>
                  </span>

                  {CONTAINER_STAGES.map((label, index) => {
                    const isCurrent = index === data.container!.stage;
                    const isDone = index < data.container!.stage;

                    const event = [...data.events].reverse().find((e) => e.stage === index);

                    const dotClass = isCurrent
                      ? "bg-gradient-accent text-accent-foreground ring-4 ring-accent/20 shadow-lg shadow-accent/30"
                      : isDone
                        ? "bg-gradient-to-br from-emerald-500 to-emerald-600 text-white shadow-md shadow-emerald-500/20"
                        : "bg-secondary text-muted-foreground";

                    return (
                      <li key={label} className="relative flex gap-5 pb-8 last:pb-0">
                        {/* Pastille */}
                        <span
                          className={`relative z-10 grid h-10 w-10 shrink-0 place-items-center rounded-full text-sm font-bold transition-all ${dotClass}`}
                        >
                          {isCurrent && (
                            <span
                              className="animate-timeline-pulse absolute inset-0 rounded-full bg-accent"
                              aria-hidden
                            />
                          )}
                          <span className="relative z-10">
                            {isDone ? (
                              <Check className="h-5 w-5" strokeWidth={3} />
                            ) : isCurrent ? (
                              <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-current" />
                            ) : (
                              index + 1
                            )}
                          </span>
                        </span>

                        <div className="min-w-0 flex-1 pt-1">
                          <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1">
                            <p
                              className={`text-base font-bold leading-tight ${isCurrent
                                ? "text-accent"
                                : isDone
                                  ? "text-foreground"
                                  : "text-muted-foreground"
                                }`}
                            >
                              {label}
                            </p>

                            {isCurrent && (
                              <span className="rounded-full bg-accent/15 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-accent ring-1 ring-inset ring-accent/20">
                                En cours
                              </span>
                            )}
                            {isDone && !isCurrent && (
                              <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-emerald-700 ring-1 ring-inset ring-emerald-200">
                                Terminée
                              </span>
                            )}
                          </div>

                          {event ? (
                            <div className="mt-2.5 space-y-2 text-sm text-muted-foreground">
                              <p className="flex flex-wrap items-center gap-x-4 gap-y-1">
                                <span className="inline-flex items-center gap-1.5 font-semibold text-foreground">
                                  <CalendarClock className="h-3.5 w-3.5" />
                                  {formatDateLong(event.event_date)}
                                </span>
                                {event.location && (
                                  <span className="inline-flex items-center gap-1.5">
                                    <MapPin className="h-3.5 w-3.5" />
                                    {event.location}
                                  </span>
                                )}
                              </p>
                              {event.comments && (
                                <p className="rounded-r-lg border-l-2 border-accent/40 bg-secondary/50 py-2 pl-3 pr-3 text-slate-600">
                                  {event.comments}
                                </p>
                              )}
                            </div>
                          ) : (
                            isCurrent && (
                              <p className="mt-2 text-sm italic text-muted-foreground">
                                En attente de mise à jour…
                              </p>
                            )
                          )}
                        </div>
                      </li>
                    );
                  })}
                </ol>
              </div>
            )}
          </div>
        </div>
      )
      }
    </div >
  );
}

/* ═══════════ SOUS-COMPOSANTS ═══════════ */

function VehicleSpec({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
}) {
  return (
    <div className="group/spec min-w-0 rounded-lg bg-background/80 px-3 py-2 transition-colors hover:bg-background">
      <dt className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
        <Icon className="h-3 w-3 text-accent" />
        {label}
      </dt>
      <dd className="mt-1 truncate text-sm font-semibold text-foreground">{value}</dd>
    </div>
  );
}

function InfoCell({
  icon,
  label,
  value,
  highlight = false,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div className="min-w-0">
      <dt className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
        <span className="text-accent">{icon}</span>
        {label}
      </dt>
      <dd
        className={`mt-1 truncate text-sm font-semibold ${highlight ? "text-accent" : "text-foreground"
          }`}
      >
        {value}
      </dd>
    </div>
  );
}