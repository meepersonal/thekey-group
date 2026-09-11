import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  BadgeCheck,
  Container,
  Search,
  Ship,
  ShieldCheck,
  Sparkles,
  Truck,
  Wallet,
} from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { VehicleCard } from "@/components/vehicle-card";
import { VEHICLES } from "@/data/vehicles";
import heroPort from "@/assets/hero-port.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "AutoTrack Bénin — Importation de véhicules chinois & suivi maritime" },
      {
        name: "description",
        content:
          "Importez votre véhicule chinois (BYD, Chery, Changan, GAC, Jetour) au Bénin : catalogue, personnalisation et suivi de conteneur en temps réel jusqu'au Port de Cotonou.",
      },
      {
        property: "og:title",
        content: "AutoTrack Bénin — Importation de véhicules chinois & suivi maritime",
      },
      {
        property: "og:description",
        content:
          "Catalogue de véhicules importés de Chine, devis instantané en FCFA et suivi de conteneur jusqu'à Cotonou.",
      },
    ],
  }),
  component: Index,
});

const STATS = [
  { value: "480+", label: "Véhicules livrés" },
  { value: "35 j", label: "Délai moyen Chine → Cotonou" },
  { value: "9", label: "Marques partenaires" },
  { value: "24/7", label: "Suivi de conteneur" },
];

const STEPS = [
  {
    icon: Search,
    title: "1. Choisissez",
    text: "Parcourez le catalogue et configurez les options qui vous plaisent.",
  },
  {
    icon: Wallet,
    title: "2. Réservez",
    text: "Devis instantané en FCFA et USD, acompte et confirmation par WhatsApp.",
  },
  {
    icon: Ship,
    title: "3. Suivez",
    text: "Votre conteneur est traçable en direct, de la Chine au Port de Cotonou.",
  },
  {
    icon: Truck,
    title: "4. Recevez",
    text: "Dédouanement, immatriculation et livraison à Cotonou ou Calavi.",
  },
];

const WHY = [
  {
    icon: ShieldCheck,
    title: "Véhicules inspectés",
    text: "Contrôle 150 points en Chine avant chargement, rapport photo transmis.",
  },
  {
    icon: Container,
    title: "Logistique maîtrisée",
    text: "Conteneurs scellés, assurance transport et partenaires maritimes fiables.",
  },
  {
    icon: BadgeCheck,
    title: "Prix transparents",
    text: "Prix affichés en FCFA et USD, options chiffrées, aucune surprise.",
  },
  {
    icon: Sparkles,
    title: "Personnalisation",
    text: "Jantes, teinte de vitres, caméra 360°, chargeur rapide et bien plus.",
  },
];

function Index() {
  const [code, setCode] = useState("");
  const featured = VEHICLES.slice(0, 6);

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <img
          src={heroPort}
          alt="Porte-conteneurs au port de Cotonou au coucher du soleil"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-navy opacity-90" />
        <div className="relative mx-auto max-w-7xl px-4 py-20 text-navy-foreground sm:py-28 lg:px-8">
          <span className="inline-flex items-center gap-2 rounded-full glass-panel px-4 py-1.5 text-xs font-semibold">
            <Ship className="h-4 w-4 text-accent" />
            Chine → Port de Cotonou
          </span>
          <h1 className="mt-5 max-w-3xl font-display text-4xl font-extrabold leading-tight sm:text-5xl lg:text-6xl">
            Votre véhicule chinois, importé et suivi{" "}
            <span className="text-accent">en temps réel</span>
          </h1>
          <p className="mt-5 max-w-2xl text-base text-navy-foreground/80 sm:text-lg">
            BYD, Chery, Changan, GAC, Jetour : choisissez, personnalisez et suivez votre conteneur
            jusqu'à sa livraison au Bénin.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button asChild variant="accent" size="lg">
              <Link to="/catalogue">
                Voir le catalogue
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-navy-foreground/30 bg-transparent text-navy-foreground hover:bg-navy-foreground/10"
            >
              <Link to="/contact">Parler à un conseiller</Link>
            </Button>
          </div>

          {/* Tracking quick search */}
          <form
            className="mt-10 max-w-xl rounded-2xl glass-panel p-3 sm:flex sm:items-center sm:gap-3"
            onSubmit={(e) => {
              e.preventDefault();
            }}
          >
            <Input
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="Code de suivi (ex : TRACK123)"
              aria-label="Code de suivi"
              className="border-navy-foreground/20 bg-background/95 text-foreground"
            />
            <Button asChild variant="accent" className="mt-3 w-full sm:mt-0 sm:w-auto">
              <Link to="/tracking" search={{ code }}>
                <Search className="h-4 w-4" />
                Suivre
              </Link>
            </Button>
          </form>

          <dl className="mt-12 grid grid-cols-2 gap-6 sm:grid-cols-4">
            {STATS.map((s) => (
              <div key={s.label}>
                <dt className="font-display text-2xl font-extrabold text-accent sm:text-3xl">
                  {s.value}
                </dt>
                <dd className="mt-1 text-xs text-navy-foreground/70 sm:text-sm">{s.label}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* Featured vehicles */}
      <section className="mx-auto max-w-7xl px-4 py-16 lg:px-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="font-display text-2xl font-extrabold sm:text-3xl">
              Véhicules en vedette
            </h2>
            <p className="mt-2 text-muted-foreground">
              Une sélection de modèles disponibles à la commande cette semaine.
            </p>
          </div>
          <Button asChild variant="outline">
            <Link to="/catalogue">
              Tout le catalogue
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>

        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((v) => (
            <VehicleCard key={v.id} vehicle={v} />
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="bg-secondary/60 py-16">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <h2 className="font-display text-2xl font-extrabold sm:text-3xl">Comment ça marche</h2>
          <p className="mt-2 max-w-2xl text-muted-foreground">
            Quatre étapes simples, de la commande à la remise des clés.
          </p>
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {STEPS.map((s) => (
              <div key={s.title} className="surface-card p-6">
                <span className="grid h-11 w-11 place-items-center rounded-xl bg-gradient-navy text-navy-foreground">
                  <s.icon className="h-5 w-5" />
                </span>
                <h3 className="mt-4 font-display text-lg font-bold">{s.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{s.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why us */}
      <section className="mx-auto max-w-7xl px-4 py-16 lg:px-8">
        <h2 className="font-display text-2xl font-extrabold sm:text-3xl">Pourquoi nous choisir</h2>
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {WHY.map((w) => (
            <div key={w.title} className="surface-card p-6">
              <span className="grid h-11 w-11 place-items-center rounded-xl bg-gradient-accent text-accent-foreground">
                <w.icon className="h-5 w-5" />
              </span>
              <h3 className="mt-4 font-display text-lg font-bold">{w.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{w.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
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
              <Link to="/catalogue">Configurer mon véhicule</Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-navy-foreground/30 bg-transparent text-navy-foreground hover:bg-navy-foreground/10"
            >
              <Link to="/tracking" search={{ code: "" }}>Suivre mon conteneur</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
