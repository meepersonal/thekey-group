import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  BadgeCheck,
  Building2,
  Car,
  CheckCircle2,
  FileCheck2,
  Handshake,
  MessageCircle,
  Ship,
  Store,
  UsersRound,
} from "lucide-react";
import heroPort from "@/assets/hero-port.jpg";
import { Button } from "@/components/ui/button";
import { waLink } from "@/data/tracking";

const partnerProfiles = [
  {
    icon: Store,
    title: "Revendeurs automobiles",
    text: "Accédez à des modèles chinois vérifiés, avec disponibilité, prix indicatifs et suivi maritime clair.",
  },
  {
    icon: Building2,
    title: "Entreprises & institutions",
    text: "Constituez une flotte adaptée à vos usages avec accompagnement sur le choix, l'importation et la livraison.",
  },
  {
    icon: UsersRound,
    title: "Apporteurs d'affaires",
    text: "Recommandez des clients qualifiés et suivez chaque dossier depuis la demande jusqu'à la remise du véhicule.",
  },
] as const;

const benefits = [
  "Catalogue de véhicules chinois adapté au marché béninois",
  "Accompagnement de la demande jusqu'à l'arrivée au Port de Cotonou",
  "Suivi des conteneurs et communication proactive sur les étapes clés",
  "Process commercial structuré pour convertir les prospects plus vite",
] as const;

const steps = [
  { title: "Candidature", text: "Vous présentez votre activité, votre zone et le type de clients que vous accompagnez." },
  { title: "Validation", text: "L'équipe Key Group vérifie l'adéquation commerciale et définit les modalités de collaboration." },
  { title: "Activation", text: "Vous recevez les supports nécessaires pour orienter les demandes vers les bons véhicules." },
  { title: "Suivi", text: "Chaque dossier partenaire est suivi avec visibilité sur la commande, le navire et la livraison." },
] as const;

export const Route = createFileRoute("/partenaires")({
  head: () => ({
    meta: [
      { title: "Devenir partenaire Key Group — Import auto Chine Bénin" },
      {
        name: "description",
        content:
          "Rejoignez le réseau partenaire Key Group pour développer l'importation de véhicules chinois au Bénin avec suivi maritime et accompagnement commercial.",
      },
      { property: "og:title", content: "Devenir partenaire Key Group" },
      {
        property: "og:description",
        content:
          "Un programme partenaire pour revendeurs, entreprises et apporteurs d'affaires dans l'import automobile Chine-Bénin.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: PartnersPage,
});

function PartnersPage() {
  return (
    <div>
      <section className="relative overflow-hidden bg-navy text-navy-foreground">
        <img
          src={heroPort}
          alt="Port maritime et véhicules importés pour le réseau partenaire Key Group"
          width={1600}
          height={1000}
          className="absolute inset-0 h-full w-full object-cover opacity-35"
        />
        <div className="absolute inset-0 bg-gradient-navy opacity-90" />
        <div className="relative mx-auto max-w-7xl px-4 py-16 sm:py-20 lg:px-8">
          <span className="inline-flex items-center gap-2 rounded-full glass-panel px-4 py-1.5 text-xs font-semibold">
            <Handshake className="h-4 w-4 text-accent" />
            Programme partenaire Key Group
          </span>
          <h1 className="mt-5 max-w-4xl text-4xl font-extrabold leading-tight sm:text-5xl">
            Devenir un partenaire de Key Group
          </h1>
          <p className="mt-4 max-w-2xl text-base text-navy-foreground/78 sm:text-lg">
            Développez vos ventes de véhicules importés de Chine avec un partenaire structuré,
            un catalogue lisible et un suivi maritime transparent jusqu'au Bénin.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button asChild variant="accent" size="xl">
              <a
                href={waLink(
                  "Bonjour Key Group, je souhaite devenir partenaire pour l'importation de véhicules depuis la Chine.",
                )}
                target="_blank"
                rel="noreferrer"
              >
                <MessageCircle className="h-4 w-4" />
                Postuler sur WhatsApp
              </a>
            </Button>
            <Button asChild variant="outlineLight" size="xl">
              <Link to="/contact">
                Contacter l'équipe
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12 lg:px-8">
        <div className="grid gap-4 md:grid-cols-3">
          {partnerProfiles.map((profile) => (
            <article key={profile.title} className="surface-card p-6">
              <span className="grid h-12 w-12 place-items-center rounded-xl bg-secondary text-accent">
                <profile.icon className="h-6 w-6" />
              </span>
              <h2 className="mt-5 text-xl font-bold">{profile.title}</h2>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">{profile.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="bg-secondary/70 py-12">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 lg:grid-cols-[0.9fr_1.1fr] lg:px-8">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-background px-4 py-1.5 text-xs font-bold text-accent">
              <BadgeCheck className="h-4 w-4" />
              Ce que Key Group apporte
            </span>
            <h2 className="mt-4 text-3xl font-extrabold">Un cadre fiable pour vendre et suivre les dossiers.</h2>
            <p className="mt-3 text-sm leading-6 text-muted-foreground">
              Le programme partenaire aide les professionnels à proposer une offre automobile claire,
              depuis le choix du modèle jusqu'à l'arrivée du conteneur.
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {benefits.map((benefit) => (
              <div key={benefit} className="flex gap-3 rounded-xl border border-border bg-background p-4">
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-accent" />
                <p className="text-sm font-semibold leading-6">{benefit}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12 lg:px-8">
        <div className="mb-7 flex flex-col justify-between gap-3 md:flex-row md:items-end">
          <div>
            <h2 className="text-3xl font-extrabold">Comment rejoindre le réseau</h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
              Un parcours simple pour qualifier la collaboration, aligner les objectifs et lancer les premiers dossiers.
            </p>
          </div>
          <Button asChild variant="navy">
            <Link to="/catalogue">
              <Car className="h-4 w-4" />
              Voir le catalogue
            </Link>
          </Button>
        </div>
        <div className="grid gap-4 md:grid-cols-4">
          {steps.map((step, index) => (
            <article key={step.title} className="surface-card p-5">
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-accent text-sm font-extrabold text-accent-foreground">
                {index + 1}
              </span>
              <h3 className="mt-4 font-bold">{step.title}</h3>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">{step.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-14 lg:px-8">
        <div className="overflow-hidden rounded-2xl bg-gradient-navy p-6 text-navy-foreground shadow-glow md:p-8">
          <div className="grid gap-8 md:grid-cols-[1fr_auto] md:items-center">
            <div>
              <span className="inline-flex items-center gap-2 text-xs font-bold uppercase text-accent">
                <Ship className="h-4 w-4" />
                Importation Chine → Bénin
              </span>
              <h2 className="mt-3 text-2xl font-extrabold">Prêt à construire une collaboration durable ?</h2>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-navy-foreground/75">
                Présentez votre activité, votre marché et vos objectifs. L'équipe Key Group vous répondra avec les prochaines étapes.
              </p>
            </div>
            <Button asChild variant="accent" size="xl">
              <a
                href={waLink("Bonjour Key Group, je souhaite déposer une candidature partenaire.")}
                target="_blank"
                rel="noreferrer"
              >
                <FileCheck2 className="h-4 w-4" />
                Déposer ma candidature
              </a>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}