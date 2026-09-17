import { useState } from "react";
import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import {
  ArrowLeft,
  BatteryCharging,
  Check,
  Cog,
  Fuel,
  Users,
  ShieldCheck,
  Ship,
  FileText,
  Gauge,
  Calendar,
  ClipboardCheck,
  PhoneCall,
  ShoppingCart
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { PreorderForm } from "@/components/preorder-form";
import { formatFcfa, formatUsd, getVehicle } from "@/data/vehicles";

export const Route = createFileRoute("/vehicules/$id")({
  loader: ({ params }) => {
    const vehicle = getVehicle(params.id);
    if (!vehicle) throw notFound();
    return { vehicle };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return {
        meta: [{ title: "Véhicule introuvable — AutoTrack Bénin" }, { name: "robots", content: "noindex" }],
      };
    }
    const v = loaderData.vehicle;
    const title = `${v.brand} ${v.model} — Précommande | AutoTrack Bénin`;
    const description = `${v.brand} ${v.model} ${v.year}, ${v.energy}, ${v.transmission}. Prix ${formatFcfa(v.priceFcfa)}, importation depuis la Chine avec suivi maritime.`;
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
      ],
    };
  },
  component: VehiclePage,
});

function VehiclePage() {
  const { vehicle } = Route.useLoaderData();
  const [imageIndex, setImageIndex] = useState(0);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const total = vehicle.priceFcfa;

  return (
    <div className="bg-slate-100/70 min-h-screen py-8">
      <div className="mx-auto max-w-7xl px-4 lg:px-8 space-y-8">

        {/* Fil d'ariane / Retour */}
        <Button asChild variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground hover:bg-slate-200/60">
          <Link to="/catalogue">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Retour au catalogue
          </Link>
        </Button>

        {/* SECTION PRINCIPALE : Galerie & Résumé Tarifaire */}
        <div className="grid gap-8 lg:grid-cols-12 items-start">

          {/* Galerie d'images */}
          <div className="lg:col-span-7 space-y-4">
            <div className="relative overflow-hidden rounded-3xl bg-slate-900 border border-slate-200 shadow-xl">
              <img
                src={vehicle.images[imageIndex]}
                alt={`${vehicle.brand} ${vehicle.model}`}
                width={1200}
                height={800}
                className="aspect-[16/10] w-full object-cover"
              />
              <Badge className="absolute top-4 left-4 bg-black/80 text-white backdrop-blur-md border-0 font-semibold px-3.5 py-1.5 shadow-md">
                {vehicle.condition}
              </Badge>
            </div>

            {/* Miniatures */}
            <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-none">
              {vehicle.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setImageIndex(i)}
                  className={
                    "relative shrink-0 h-20 w-28 overflow-hidden rounded-2xl border-2 transition-all duration-200 " +
                    (i === imageIndex
                      ? "border-primary shadow-lg ring-2 ring-primary/30 scale-105"
                      : "border-transparent opacity-60 hover:opacity-100 shadow-sm")
                  }
                >
                  <img
                    src={img}
                    alt={`Vue ${i + 1}`}
                    loading="lazy"
                    className="h-full w-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Fiche Synthétique & Carte Prix */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-xl space-y-6">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-primary">
                  {vehicle.brand} · {vehicle.category}
                </span>
                <h1 className="text-3xl font-extrabold text-foreground mt-1 tracking-tight">{vehicle.model}</h1>
              </div>

              {/* Badges rapides */}
              <div className="flex flex-wrap gap-2 text-xs">
                <span className="rounded-xl bg-slate-100 px-3 py-1.5 font-semibold text-slate-700 border border-slate-200">{vehicle.year}</span>
                <span className="rounded-xl bg-slate-100 px-3 py-1.5 font-semibold text-slate-700 border border-slate-200">{vehicle.energy}</span>
                <span className="rounded-xl bg-slate-100 px-3 py-1.5 font-semibold text-slate-700 border border-slate-200">{vehicle.transmission}</span>
              </div>

              {/* Card Tarifaire */}
              <div className="rounded-2xl bg-slate-900 text-white p-6 space-y-4 shadow-2xl relative overflow-hidden border border-slate-800">
                <div className="space-y-2 border-b border-slate-800 pb-4 text-sm">
                  <div className="flex justify-between text-slate-300">
                    <span>Prix véhicule rendu Cotonou</span>
                    <span className="font-semibold">{formatFcfa(total)}</span>
                  </div>
                  <div className="flex justify-between text-slate-400 text-xs">
                    <span>Valeur approximative</span>
                    <span>≈ {formatUsd(total)}</span>
                  </div>
                </div>

                <div>
                  <div className="text-3xl sm:text-4xl font-black text-amber-400 tracking-tight">
                    {formatFcfa(total)}
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1.5 leading-relaxed">
                    Prix estimé clés en main (livraison, transport maritime et dédouanement inclus).
                  </p>
                </div>
              </div>

              {/* BOUTON D'OUVERTURE DU DRAWER / SHEET */}
              <Sheet open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
                <SheetTrigger asChild>
                  <Button size="lg" className="w-full font-bold text-base h-13 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-200 gap-2">
                    <ShoppingCart className="h-5 w-5" />
                    Lancer la précommande
                  </Button>
                </SheetTrigger>

                <SheetContent className="w-full sm:max-w-xl md:max-w-2xl overflow-y-auto p-6 sm:p-8 shadow-2xl border-l border-slate-200">
                  <SheetHeader className="text-left space-y-2 border-b border-slate-100 pb-5">
                    <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary w-fit">
                      <ClipboardCheck className="h-4 w-4" />
                      Réservation
                    </div>
                    <SheetTitle className="text-2xl font-extrabold">
                      Précommander ce véhicule
                    </SheetTitle>
                    <SheetDescription className="text-sm text-muted-foreground">
                      {vehicle.brand} {vehicle.model} ({vehicle.year}) — <span className="font-bold text-foreground">{formatFcfa(total)}</span>
                    </SheetDescription>
                  </SheetHeader>

                  <div className="py-6 space-y-6">
                    <PreorderForm vehicle={vehicle} selected={[]} total={total} />

                    <div className="flex items-center gap-3 p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-muted-foreground shadow-sm">
                      <PhoneCall className="h-5 w-5 shrink-0 text-primary" />
                      <span>Un conseiller d'AutoTrack Bénin vous recontactera sous 24h pour finaliser les détails de commande.</span>
                    </div>
                  </div>
                </SheetContent>
              </Sheet>

            </div>
          </div>

        </div>

        {/* CARACTÉRISTIQUES DÉTAILLÉES */}
        <div className="grid gap-6 md:grid-cols-1">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xl space-y-5">
            <h2 className="text-lg font-bold text-foreground tracking-tight">Fiche technique</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <FeatureCard icon={<Calendar className="h-4 w-4" />} label="Année" value={vehicle.year} />
              <FeatureCard icon={<Gauge className="h-4 w-4" />} label="Kilométrage" value={`${new Intl.NumberFormat("fr-FR").format(vehicle.mileageKm)} km`} />
              <FeatureCard icon={<Fuel className="h-4 w-4" />} label="Énergie" value={vehicle.energy} />
              <FeatureCard icon={<Cog className="h-4 w-4" />} label="Transmission" value={vehicle.transmission} />
              <FeatureCard icon={<Cog className="h-4 w-4" />} label="Moteur" value={vehicle.engine} />
              <FeatureCard icon={<Users className="h-4 w-4" />} label="Places" value={`${vehicle.seats} places`} />
              {vehicle.battery && (
                <FeatureCard icon={<BatteryCharging className="h-4 w-4" />} label="Batterie" value={vehicle.battery} />
              )}
              <FeatureCard icon={<Fuel className="h-4 w-4" />} label="Consommation" value={vehicle.consumption} />
            </div>
          </div>

          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xl space-y-4">
            <h2 className="text-lg font-bold text-foreground tracking-tight">Description</h2>
            <div className="text-sm text-muted-foreground leading-relaxed">
              <p>Lorem ipsum dolor sit amet consectetur, adipisicing elit. Fugit itaque voluptate ad quia non. Molestias natus cupiditate sequi, aliquam expedita cum consequuntur accusantium et nisi, eaque nulla adipisci debitis tempore.</p>
            </div>
          </div>
        </div>

        {/* PROCESSUS D'IMPORTATION */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xl">
          <h2 className="text-lg font-bold text-foreground mb-6 tracking-tight">Inclus dans votre commande</h2>
          <div className="grid sm:grid-cols-3 gap-6">
            <ProcessStep
              icon={<ShieldCheck className="h-6 w-6 text-primary" />}
              title="Inspection 100% certifiée"
              desc="Rapport complet de l'état du véhicule avant expédition depuis la Chine."
            />
            <ProcessStep
              icon={<Ship className="h-6 w-6 text-primary" />}
              title="Suivi maritime en direct"
              desc="Code de tracking fourni pour suivre le navire jusqu'au Port de Cotonou (45-60j)."
            />
            <ProcessStep
              icon={<FileText className="h-6 w-6 text-primary" />}
              title="Dédouanement & Formalités"
              desc="Accompagnement complet pour les démarches administratives et douanières."
            />
          </div>
        </div>

      </div>
    </div>
  );
}

function FeatureCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-center gap-3 rounded-2xl bg-slate-50 p-3.5 border border-slate-200 shadow-sm hover:shadow-md transition-all">
      <div className="text-primary shrink-0 p-2 rounded-xl bg-white border border-slate-200 shadow-sm">{icon}</div>
      <div className="min-w-0">
        <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">{label}</p>
        <p className="text-xs font-bold text-foreground truncate">{value}</p>
      </div>
    </div>
  );
}

function ProcessStep({ icon, title, desc }: { icon: React.ReactNode; title: string; desc: string }) {
  return (
    <div className="flex flex-col items-start gap-3 p-5 rounded-2xl bg-slate-50 border border-slate-200 shadow-sm">
      <div className="p-2.5 rounded-xl bg-white shadow-sm border border-slate-200">{icon}</div>
      <div>
        <h3 className="text-sm font-bold text-foreground">{title}</h3>
        <p className="text-xs text-muted-foreground leading-relaxed mt-1">{desc}</p>
      </div>
    </div>
  );
}