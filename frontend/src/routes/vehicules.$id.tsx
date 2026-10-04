import { useEffect, useState } from "react";
import { Link, useRouterState } from "@/lib/router";
import {
  Fuel,
  Users,
  Gauge,
  Package,
  Leaf,
  Phone,
  ChevronRight,
  Check,
  ShieldCheck,
  Ship,
  FileText,
  ShoppingCart,
  ClipboardCheck,
  PhoneCall,
  Car,
  ChevronLeft,
  Maximize2,
  X,
  Award,
  TrendingUp,
  Mail,
  MapPin,
  Calendar,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { PreorderForm } from "@/components/preorder-form";
import { formatFcfa } from "@/data/vehicles";
import { usePublicVehicle } from "@/data/public-store";
import { useVehiclePageTracking } from "@/lib/analytics";
import type { Vehicle } from "@/lib/api";
import { ReservationDrawer } from "@/components/reservation-drawer";

// ════════════════════════════════════════════════════════════
// ImageGallery
// ════════════════════════════════════════════════════════════
function ImageGallery({
  images,
  activeIndex,
  setActiveIndex,
  vehicle,
}: {
  images: { id: number; url: string }[];
  activeIndex: number;
  setActiveIndex: (i: number) => void;
  vehicle: Vehicle;
}) {
  const [isPaused, setIsPaused] = useState(false);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const total = images.length;
  const hasMultiple = total > 1;

  useEffect(() => {
    if (!hasMultiple || isPaused || isLightboxOpen) return;
    const interval = setInterval(() => {
      setActiveIndex((activeIndex + 1) % total);
    }, 4000);
    return () => clearInterval(interval);
  }, [hasMultiple, isPaused, isLightboxOpen, activeIndex, total, setActiveIndex]);

  useEffect(() => {
    if (!hasMultiple) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") setActiveIndex((activeIndex + 1) % total);
      else if (e.key === "ArrowLeft") setActiveIndex((activeIndex - 1 + total) % total);
      else if (e.key === "Escape") setIsLightboxOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [hasMultiple, activeIndex, total, setActiveIndex]);

  useEffect(() => {
    document.body.style.overflow = isLightboxOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isLightboxOpen]);

  const goPrev = () => setActiveIndex((activeIndex - 1 + total) % total);
  const goNext = () => setActiveIndex((activeIndex + 1) % total);

  if (total === 0) {
    return (
      <div className="overflow-hidden rounded-lg bg-white p-2 shadow-sm">
        <div className="grid aspect-[4/3] w-full place-items-center rounded-md bg-slate-100 text-sm text-slate-400">
          Aucune image disponible
        </div>
      </div>
    );
  }

  const current = images[activeIndex] ?? images[0];
  if (!current) return null;

  return (
    <>
      <div className="overflow-hidden rounded-lg bg-white p-2 shadow-sm">
        <div
          className="group relative overflow-hidden rounded-md bg-slate-100"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          <button
            type="button"
            onClick={() => setIsLightboxOpen(true)}
            aria-label="Agrandir l'image"
            className="block w-full cursor-zoom-in"
          >
            <img
              key={current.id}
              src={current.url}
              alt={`${vehicle.brand} ${vehicle.model}`}
              draggable={false}
              className="aspect-[4/3] w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.02]"
            />
          </button>

          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/40 to-transparent" />

          <span className="absolute right-3 top-3 rounded-md bg-slate-900/80 px-2.5 py-1 text-xs font-semibold text-white backdrop-blur-sm">
            {vehicle.energy}
          </span>

          <span className="absolute bottom-3 right-3 rounded-md bg-black/60 px-2.5 py-1 text-xs font-semibold text-white backdrop-blur-sm">
            {activeIndex + 1} / {total}
          </span>

          <div className="pointer-events-none absolute left-3 top-3 flex h-8 w-8 items-center justify-center rounded-md bg-black/50 text-white opacity-0 backdrop-blur-sm transition-opacity duration-300 group-hover:opacity-100">
            <Maximize2 className="h-4 w-4" />
          </div>

          {hasMultiple && (
            <>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  goPrev();
                }}
                aria-label="Image précédente"
                className="absolute left-2 top-1/2 z-10 grid h-9 w-9 -translate-y-1/2 place-items-center rounded-md bg-white/95 text-slate-900 opacity-0 shadow-md transition-all duration-300 hover:bg-white group-hover:opacity-100"
              >
                <ChevronLeft className="h-4 w-4" strokeWidth={2.5} />
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  goNext();
                }}
                aria-label="Image suivante"
                className="absolute right-2 top-1/2 z-10 grid h-9 w-9 -translate-y-1/2 place-items-center rounded-md bg-white/95 text-slate-900 opacity-0 shadow-md transition-all duration-300 hover:bg-white group-hover:opacity-100"
              >
                <ChevronRight className="h-4 w-4" strokeWidth={2.5} />
              </button>
            </>
          )}

          {hasMultiple && (
            <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 items-center gap-1.5 rounded-md bg-black/40 px-2 py-1 backdrop-blur-sm">
              {images.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveIndex(i);
                  }}
                  aria-label={`Aller à l'image ${i + 1}`}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    i === activeIndex ? "w-5 bg-white" : "w-1.5 bg-white/50 hover:bg-white/80"
                  }`}
                />
              ))}
            </div>
          )}
        </div>

        {hasMultiple && (
          <div className="mt-2 grid grid-cols-4 gap-2 sm:grid-cols-5">
            {images.slice(0, 5).map((img, i) => (
              <button
                key={img.id || i}
                onClick={() => setActiveIndex(i)}
                aria-label={`Voir l'image ${i + 1}`}
                className={
                  "relative aspect-[4/3] overflow-hidden rounded-md border-2 transition-all duration-200 " +
                  (i === activeIndex
                    ? "border-slate-900"
                    : "border-transparent opacity-60 hover:opacity-100")
                }
              >
                <img src={img.url} alt="" className="h-full w-full object-cover" />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* ══════════ LIGHTBOX ══════════ */}
      {isLightboxOpen && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-md"
          onClick={() => setIsLightboxOpen(false)}
        >
          <button
            type="button"
            onClick={() => setIsLightboxOpen(false)}
            aria-label="Fermer"
            className="absolute right-4 top-4 z-10 grid h-10 w-10 place-items-center rounded-md bg-white/10 text-white transition-all hover:bg-white/20"
          >
            <X className="h-5 w-5" strokeWidth={2.5} />
          </button>

          {hasMultiple && (
            <span className="absolute left-4 top-4 rounded-md bg-white/10 px-3 py-1.5 text-sm font-bold text-white">
              {activeIndex + 1} / {total}
            </span>
          )}

          <img
            key={current.id}
            src={current.url}
            alt={`${vehicle.brand} ${vehicle.model}`}
            draggable={false}
            onClick={(e) => e.stopPropagation()}
            className="max-h-[85vh] max-w-[90vw] select-none object-contain"
          />

          {hasMultiple && (
            <>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  goPrev();
                }}
                aria-label="Image précédente"
                className="absolute left-4 top-1/2 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-md bg-white/10 text-white transition-all hover:bg-white/20"
              >
                <ChevronLeft className="h-6 w-6" strokeWidth={2.5} />
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  goNext();
                }}
                aria-label="Image suivante"
                className="absolute right-4 top-1/2 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-md bg-white/10 text-white transition-all hover:bg-white/20"
              >
                <ChevronRight className="h-6 w-6" strokeWidth={2.5} />
              </button>
            </>
          )}
        </div>
      )}
    </>
  );
}

// ════════════════════════════════════════════════════════════
// VehiclePage
// ════════════════════════════════════════════════════════════
export function VehiclePage() {
  const pathname = useRouterState((s) => s.pathname);
  const id = pathname.split("/vehicules/")[1] ?? "";
  const { data: vehicle, isLoading, isError } = usePublicVehicle(id);
  const [imageIndex, setImageIndex] = useState(0);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  useVehiclePageTracking(vehicle?.id);

  useEffect(() => {
    setImageIndex(0);
  }, [id]);

  if (isLoading) return <VehiclePageSkeleton />;
  if (isError || !vehicle) return <VehicleNotFound />;

  return (
    <VehicleDetail
      vehicle={vehicle}
      imageIndex={imageIndex}
      setImageIndex={setImageIndex}
      isDrawerOpen={isDrawerOpen}
      setIsDrawerOpen={setIsDrawerOpen}
    />
  );
}

// ════════════════════════════════════════════════════════════
// VehicleDetail
// ════════════════════════════════════════════════════════════
function VehicleDetail({
  vehicle,
  imageIndex,
  setImageIndex,
  isDrawerOpen,
  setIsDrawerOpen,
}: {
  vehicle: Vehicle;
  imageIndex: number;
  setImageIndex: (i: number) => void;
  isDrawerOpen: boolean;
  setIsDrawerOpen: (open: boolean) => void;
}) {
  const total = vehicle.price_fcfa;
  const images = vehicle.vehicle_images;
  const safeIndex = images.length > 0 ? Math.min(imageIndex, images.length - 1) : 0;

  return (
    <div className="min-h-screen bg-slate-100">
      <div className="mx-auto max-w-7xl px-4 py-6 lg:px-8 lg:py-8">
        {/* Fil d'ariane */}
        <nav className="mb-5 flex items-center gap-2 text-xs text-slate-500">
          <Link to="/catalogue" className="transition-colors hover:text-slate-900">
            Catalogue
          </Link>
          <ChevronRight className="h-3 w-3" />
          <span className="font-medium text-slate-700">
            {vehicle.brand} {vehicle.model}
          </span>
        </nav>

        {/* ===================== SECTION PRODUIT ===================== */}
        <div className="grid gap-6 lg:grid-cols-12">
          {/* ----- Galerie (gauche) ----- */}
          <div className="lg:col-span-7">
            <ImageGallery
              images={images}
              activeIndex={safeIndex}
              setActiveIndex={setImageIndex}
              vehicle={vehicle}
            />

            {/* Fiche technique */}
            <div className="mt-4 rounded-lg bg-white p-5 shadow-sm">
              <h2 className="text-sm font-bold text-slate-900">Fiche technique</h2>
              <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
                <SpecItem label="Carburant" value={vehicle.energy} />
                <SpecItem label="Places" value={String(vehicle.nombre_places || "N/A")} />
                <SpecItem label="Motorisation" value={vehicle.engine || "N/A"} />
                <SpecItem label="Marque" value={vehicle.brand} />
              </div>

              <div className="mt-5 border-t border-slate-100 pt-5">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Motorisation
                </h3>
                <div className="mt-3 grid grid-cols-2 gap-4 sm:grid-cols-4">
                  <SpecItem label="Type" value={vehicle.energy} />
                  <SpecItem label="Moteur" value={vehicle.engine || "N/A"} />
                  <SpecItem label="Consommation" value={vehicle.consumption || "N/A"} />
                  <SpecItem label="Places" value={String(vehicle.nombre_places || "N/A")} />
                </div>
              </div>
            </div>
          </div>

          {/* ----- Infos + Prix (droite) — STICKY ----- */}
          <div className="hidden lg:col-span-5 lg:block">
            {/* Wrapper qui reste sticky pendant le scroll de la colonne gauche */}
            <div className="sticky top-24 space-y-4">
              <div className="space-y-4">
                {/* Carte principale */}
                <div className="rounded-lg bg-white p-6 shadow-sm">
                  {/* En-tête */}
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-md bg-slate-100 px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wider text-slate-600">
                      {vehicle.brand}
                    </span>
                    <span className="inline-flex items-center gap-1 rounded-md bg-slate-100 px-2 py-0.5 text-[11px] font-semibold text-slate-600">
                      <Award className="h-3 w-3" />
                      Vérifié
                    </span>
                  </div>

                  <h1 className="mt-3 text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
                    {vehicle.brand} {vehicle.model}
                  </h1>

                  <p className="mt-1.5 text-sm text-slate-500">
                    {vehicle.year} · {vehicle.condition} · {vehicle.energy} · {vehicle.transmission}
                  </p>

                  {/* Prix */}
                  <div className="mt-5 border-y border-slate-100 py-4">
                    <p className="text-xs font-medium uppercase tracking-wider text-slate-500">
                      Prix clés en main
                    </p>
                    <p className="mt-1 text-2xl font-bold text-slate-900">{formatFcfa(total)}</p>
                    <p className="mt-1 inline-flex items-center gap-1 text-xs text-emerald-600">
                      <TrendingUp className="h-3 w-3" />
                      Transport & dédouanement inclus
                    </p>
                  </div>

                  {/* Inclus */}
                  <ul className="mt-4 space-y-2 text-sm">
                    <IncludedItem>Transport maritime & assurance</IncludedItem>
                    <IncludedItem>Dédouanement & formalités</IncludedItem>
                    <IncludedItem>Livraison à Cotonou offerte</IncludedItem>
                  </ul>

                  {/* CTA */}
                  <div className="mt-5 flex flex-col gap-2">
                    <Button
                      size="lg"
                      data-track="cta:rdv-principal"
                      onClick={() => setIsDrawerOpen(true)}
                      className="h-12 w-full gap-2 rounded-lg bg-emerald-600 text-sm font-semibold text-white transition-colors hover:bg-emerald-700"
                    >
                      <Calendar className="h-4 w-4" />
                      Réserver votre RDV en agence
                    </Button>

                    <Button
                      variant="outline"
                      data-track="cta:conseiller"
                      className="h-11 w-full gap-2 rounded-lg border-slate-300 text-sm font-semibold text-slate-700 transition-colors hover:border-slate-400 hover:bg-slate-50"
                    >
                      <Phone className="h-4 w-4" />
                      Parler à un conseiller
                    </Button>

                    <div className="flex items-center justify-center gap-4 pt-1 text-[11px] text-slate-500">
                      <span className="inline-flex items-center gap-1">
                        <ShieldCheck className="h-3 w-3" />
                        Sans engagement
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <PhoneCall className="h-3 w-3" />
                        Réponse 24h
                      </span>
                    </div>
                  </div>
                </div>

                {/* Cartes réassurance */}
                <div className="grid grid-cols-3 gap-2">
                  <TrustCard icon={<ShieldCheck className="h-4 w-4" />} label="Inspecté" />
                  <TrustCard icon={<Ship className="h-4 w-4" />} label="Suivi live" />
                  <TrustCard icon={<FileText className="h-4 w-4" />} label="Dédouané" />
                </div>

                {/* Contact rapide */}
                <div className="rounded-lg bg-white p-5 shadow-sm">
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Contact rapide
                  </h3>
                  <ul className="mt-3 space-y-2.5 text-sm">
                    <li className="flex items-center gap-2 text-slate-600">
                      <Phone className="h-3.5 w-3.5 text-slate-400" />
                      +229 97 00 00 00
                    </li>
                    <li className="flex items-center gap-2 text-slate-600">
                      <Mail className="h-3.5 w-3.5 text-slate-400" />
                      contact@easycar.africa
                    </li>
                    <li className="flex items-center gap-2 text-slate-600">
                      <MapPin className="h-3.5 w-3.5 text-slate-400" />
                      Calavi, Abomey-Calavi, Bénin
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ===================== DESCRIPTION DÉTAILLÉE ===================== */}
        <section className="mt-6 rounded-lg bg-white p-6 shadow-sm sm:p-8">
          <div className="flex items-center gap-3">
            <div className="grid h-9 w-9 place-items-center rounded-md bg-slate-100 text-slate-700">
              <FileText className="h-4 w-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">Description détaillée</h2>
              <p className="text-xs text-slate-500">Caractéristiques et équipements du véhicule</p>
            </div>
          </div>

          <div className="mt-5 border-t border-slate-100 pt-5">
            {vehicle.description ? (
              <div
                className="text-sm leading-relaxed text-slate-600 [&_h1]:mb-3 [&_h1]:mt-5 [&_h1]:text-xl [&_h1]:font-bold [&_h1]:text-slate-900 [&_h2]:mb-2 [&_h2]:mt-4 [&_h2]:text-lg [&_h2]:font-bold [&_h2]:text-slate-900 [&_h3]:mb-2 [&_h3]:mt-4 [&_h3]:text-base [&_h3]:font-semibold [&_h3]:text-slate-900 [&_p]:my-2 [&_ul]:my-2 [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:my-2 [&_ol]:list-decimal [&_ol]:pl-5 [&_li]:my-1 [&_strong]:font-semibold [&_strong]:text-slate-900 [&_a]:text-slate-900 [&_a]:underline hover:[&_a]:text-slate-700"
                dangerouslySetInnerHTML={{ __html: vehicle.description }}
              />
            ) : (
              <DescriptionList vehicle={vehicle} />
            )}
          </div>
        </section>

        {/* ===================== PROCESSUS ===================== */}
        <section className="mt-6 rounded-lg bg-white p-6 shadow-sm sm:p-8">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Comment ça marche</h2>
            <p className="mt-1 text-sm text-slate-500">
              De la réservation à la remise des clés, nous nous occupons de tout.
            </p>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <ProcessStep
              index={1}
              icon={<ClipboardCheck className="h-4 w-4" />}
              title="Réservez votre RDV"
              text="Aucun paiement. Prise de rendez-vous en 2 minutes."
            />
            <ProcessStep
              index={2}
              icon={<PhoneCall className="h-4 w-4" />}
              title="Conseiller dédié"
              text="Un expert vous rappelle sous 24h."
            />
            <ProcessStep
              index={3}
              icon={<Car className="h-4 w-4" />}
              title="Visite en agence"
              text="Venez voir le véhicule et validez votre choix."
            />
            <ProcessStep
              index={4}
              icon={<Ship className="h-4 w-4" />}
              title="Suivi & livraison"
              text="Suivez votre véhicule jusqu'à Cotonou."
            />
          </div>
        </section>

        {/* ===================== CTA FINAL ===================== */}
        <section className="mt-6 rounded-lg bg-emerald-700 p-8 sm:p-12">
          <div className="flex flex-col items-start justify-between gap-8 lg:flex-row lg:items-center">
            <div className="text-white">
              <h2 className="text-2xl font-bold leading-tight sm:text-3xl">
                Prêt à recevoir votre {vehicle.brand} {vehicle.model} ?
              </h2>

              <p className="mt-3 max-w-2xl text-sm text-emerald-50">
                Réservez votre rendez-vous en agence — aucun paiement requis. Notre équipe vous
                recontacte sous 24h pour fixer la visite.
              </p>

              <ul className="mt-5 space-y-2 text-sm text-emerald-50">
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 shrink-0 text-emerald-200" />
                  Rendez-vous gratuit et sans engagement
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 shrink-0 text-emerald-200" />
                  Un conseiller dédié vous accompagne
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 shrink-0 text-emerald-200" />
                  Livraison au Port de Cotonou incluse
                </li>
              </ul>
            </div>

            <div className="w-full shrink-0 lg:w-auto">
              <div className="rounded-lg bg-emerald-800/60 p-5">
                <p className="text-[11px] font-bold uppercase tracking-wider text-emerald-100">
                  Prix clés en main
                </p>
                <p className="mt-1.5 text-3xl font-bold text-white">{formatFcfa(total)}</p>
                <p className="mt-1 text-xs text-emerald-100">Transport & dédouanement inclus</p>

                <Button
                  onClick={() => setIsDrawerOpen(true)}
                  size="lg"
                  data-track="cta:rdv-banniere"
                  className="mt-4 h-12 w-full gap-2 rounded-lg bg-white text-sm font-semibold text-emerald-700 transition-colors hover:bg-emerald-50"
                >
                  <Calendar className="h-4 w-4" />
                  Réserver votre RDV en agence
                </Button>

                <div className="mt-3 flex items-center justify-center gap-3 text-[11px] text-emerald-100">
                  <span className="inline-flex items-center gap-1">
                    <ShieldCheck className="h-3 w-3" />
                    Sans engagement
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <PhoneCall className="h-3 w-3" />
                    Réponse 24h
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* ═══════════════════════════════════════════════════════════
    BARRE FLOTTANTE MOBILE — Alert / Notification style
═══════════════════════════════════════════════════════════ */}
      <div className="fixed inset-x-0 bottom-0 z-40 p-3 lg:hidden">
        <div className="mx-auto max-w-7xl overflow-hidden border border-emerald-200 bg-white shadow-[0_8px_30px_rgba(0,0,0,0.12),0_2px_8px_rgba(16,185,129,0.15)]">
          {/* Liseré animé en haut */}
          <div className="h-1 w-full bg-gradient-to-r from-emerald-500 via-emerald-400 to-emerald-500" />

          <div className="px-4 py-3">
            {/* Ligne 1 : Véhicule + Prix + Scarcity */}
            <div className="mb-3 flex items-start justify-between gap-3">
              <div className="min-w-0 flex-1">
                <p className="truncate text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                  {vehicle.brand}
                </p>
                <p className="truncate text-sm font-bold leading-tight text-slate-900">
                  {vehicle.model}
                </p>
                <p className="mt-1 truncate text-xl font-extrabold leading-tight text-slate-900">
                  {formatFcfa(total)}
                </p>
              </div>

              <span className="flex shrink-0 items-center gap-1.5 bg-red-50 px-2 py-1.5 text-[10px] font-bold uppercase tracking-wider text-red-700">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-red-500" />
                Places limitées
              </span>
            </div>

            {/* Ligne 2 : 2 boutons */}
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="lg"
                data-track="cta:appeler"
                className="h-12 shrink-0 gap-2 border-slate-300 px-4 text-sm font-semibold text-slate-700 transition-colors hover:border-slate-400 hover:bg-slate-50"
              >
                <Phone className="h-4 w-4" />
                Appeler
              </Button>

              <Button
                size="lg"
                data-track="cta:rdv-bas"
                onClick={() => setIsDrawerOpen(true)}
                className="h-12 flex-1 gap-2 bg-emerald-600 text-sm font-bold text-white transition-colors hover:bg-emerald-700"
              >
                <Calendar className="h-4 w-4" />
                Réserver un RDV
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Espace pour ne pas masquer le contenu */}
      <div className="h-44 lg:hidden" aria-hidden />
      <ReservationDrawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen} vehicle={vehicle} />
    </div>
  );
}

/* ═══════════ SOUS-COMPOSANTS ═══════════ */

function SpecItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md bg-slate-50 px-3 py-2.5">
      <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">{label}</p>
      <p className="mt-0.5 truncate text-sm font-semibold text-slate-900">{value}</p>
    </div>
  );
}

function ProcessStep({
  index,
  icon,
  title,
  text,
}: {
  index: number;
  icon: React.ReactNode;
  title: string;
  text: string;
}) {
  return (
    <div className="rounded-md border border-slate-100 bg-slate-50/50 p-5">
      <div className="flex items-center gap-2.5">
        <span className="grid h-8 w-8 place-items-center rounded-md bg-white text-slate-700 shadow-sm">
          {icon}
        </span>
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
          Étape {String(index).padStart(2, "0")}
        </span>
      </div>
      <h3 className="mt-3 text-sm font-bold text-slate-900">{title}</h3>
      <p className="mt-1.5 text-xs leading-relaxed text-slate-500">{text}</p>
    </div>
  );
}

function VehiclePageSkeleton() {
  return (
    <div className="min-h-screen bg-slate-100">
      <div className="mx-auto max-w-7xl px-4 py-6 lg:px-8 lg:py-8">
        <div className="grid gap-6 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <div className="aspect-[4/3] w-full animate-pulse rounded-lg bg-slate-200" />
          </div>
          <div className="lg:col-span-5">
            <div className="space-y-4 rounded-lg bg-white p-6 shadow-sm">
              <div className="h-4 w-24 animate-pulse rounded bg-slate-200" />
              <div className="h-6 w-64 animate-pulse rounded bg-slate-200" />
              <div className="h-8 w-40 animate-pulse rounded bg-slate-200" />
              <div className="h-12 w-full animate-pulse rounded-md bg-slate-200" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function VehicleNotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-slate-100 px-6 text-center">
      <span className="grid h-14 w-14 place-items-center rounded-full bg-slate-200 text-slate-500">
        <Car className="h-6 w-6" />
      </span>
      <h1 className="text-2xl font-bold text-slate-900">Véhicule introuvable</h1>
      <p className="max-w-sm text-sm text-slate-500">
        Ce véhicule n'est plus disponible ou n'a jamais été publié. Consultez le catalogue pour les
        modèles disponibles.
      </p>
      <Button asChild className="mt-2 rounded-md">
        <Link to="/catalogue">Voir le catalogue</Link>
      </Button>
    </div>
  );
}

function TrustCard({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <div className="flex flex-col items-center gap-1.5 rounded-lg bg-white px-2 py-3 text-center shadow-sm">
      <span className="text-slate-700">{icon}</span>
      <span className="text-[11px] font-semibold text-slate-700">{label}</span>
    </div>
  );
}

function IncludedItem({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex items-center gap-2 text-slate-600">
      <Check className="h-3.5 w-3.5 shrink-0 text-emerald-500" />
      <span>{children}</span>
    </li>
  );
}

function DescriptionList({ vehicle }: { vehicle: Vehicle }) {
  const specs: { label: string; value: string }[] = [
    { label: "Catégorie", value: vehicle.category },
    { label: "État", value: vehicle.condition },
    { label: "Année", value: String(vehicle.year) },
    { label: "Kilométrage", value: `${vehicle.mileage_km} km` },
    { label: "Énergie", value: vehicle.energy },
    { label: "Boîte", value: vehicle.transmission },
    { label: "Moteur", value: vehicle.engine || "—" },
    { label: "Consommation", value: vehicle.consumption || "—" },
    { label: "Places", value: `${vehicle.nombre_places}` },
    { label: "Prix", value: formatFcfa(vehicle.price_fcfa) },
  ];

  return (
    <div className="grid gap-x-8 gap-y-2 sm:grid-cols-2">
      {specs.map((spec) => (
        <div
          key={spec.label}
          className="flex items-center justify-between gap-4 border-b border-slate-100 py-2 text-sm"
        >
          <span className="text-slate-500">{spec.label}</span>
          <span className="text-right font-semibold text-slate-900">{spec.value}</span>
        </div>
      ))}

      {vehicle.highlights.length > 0 && (
        <div className="sm:col-span-2">
          <p className="mb-2 mt-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
            Points forts
          </p>
          <ul className="space-y-1.5">
            {vehicle.highlights.map((h) => (
              <li key={h} className="flex items-start gap-2 text-sm text-slate-600">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-slate-400" />
                {h}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
