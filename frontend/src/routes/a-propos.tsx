import { Link } from "@/lib/router";
import { Anchor, Building2, Globe2, HeartHandshake, Ship, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import heroPort from "@/assets/hero-port.jpg";

const VALUES = [
  {
    icon: Globe2,
    title: "Sourcing direct en Chine",
    text: "Nos acheteurs travaillent avec des concessions agréées à Guangzhou, Shenzhen et Shanghai.",
  },
  {
    icon: Anchor,
    title: "Maîtrise maritime",
    text: "Partenariats avec des armateurs desservant le Golfe de Guinée chaque semaine.",
  },
  {
    icon: Building2,
    title: "Dédouanement local",
    text: "Nos déclarants gèrent les formalités au Port Autonome de Cotonou.",
  },
  {
    icon: HeartHandshake,
    title: "Accompagnement humain",
    text: "Un conseiller dédié par dossier, joignable par WhatsApp du lundi au samedi.",
  },
];

const TEAM = [
  { name: "Mind Sanni", role: "Fondateur & Sourcing Chine", initials: "MS" },
  { name: "Aline Dossou", role: "Responsable logistique maritime", initials: "AD" },
  { name: "Karim Alassane", role: "Déclarant en douane", initials: "KA" },
  { name: "Prisca Hounkpè", role: "Relation clients", initials: "PH" },
];

const TIMELINE = [
  { year: "2019", text: "Premiers véhicules importés pour des clients particuliers à Calavi." },
  { year: "2021", text: "Ouverture d'un bureau de sourcing à Guangzhou." },
  { year: "2023", text: "Lancement du suivi de conteneur en ligne." },
  { year: "2026", text: "Plus de 480 véhicules livrés au Bénin et dans la sous-région." },
];

export function AboutPage() {
  return (
    <div>
      <section className="relative overflow-hidden">
        <img
          src={heroPort}
          alt="Port de Cotonou avec des conteneurs empilés"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-navy opacity-90" />
        <div className="relative mx-auto max-w-7xl px-4 py-16 text-navy-foreground lg:px-8">
          <span className="inline-flex items-center gap-2 rounded-full glass-panel px-4 py-1.5 text-xs font-semibold">
            <Ship className="h-4 w-4 text-accent" />
            Notre histoire
          </span>
          <h1 className="mt-4 max-w-3xl font-display text-3xl font-extrabold sm:text-4xl">
            L'importation automobile, sans zone d'ombre
          </h1>
          <p className="mt-4 max-w-2xl text-navy-foreground/80">
            AutoTrack Bénin est né d'un constat simple : acheter un véhicule à l'étranger reste
            stressant tant qu'on ne sait pas où il se trouve. Nous avons construit une plateforme
            qui montre chaque étape, du port chinois jusqu'à votre garage.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 lg:px-8">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {VALUES.map((v) => (
            <div key={v.title} className="surface-card p-6">
              <span className="grid h-11 w-11 place-items-center rounded-xl bg-gradient-accent text-accent-foreground">
                <v.icon className="h-5 w-5" />
              </span>
              <h2 className="mt-4 font-display text-lg font-bold">{v.title}</h2>
              <p className="mt-2 text-sm text-muted-foreground">{v.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-secondary/60 py-16">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <h2 className="font-display text-2xl font-extrabold sm:text-3xl">Notre parcours</h2>
          <ol className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {TIMELINE.map((t) => (
              <li key={t.year} className="surface-card p-6">
                <span className="font-display text-2xl font-extrabold text-accent">{t.year}</span>
                <p className="mt-2 text-sm text-muted-foreground">{t.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 lg:px-8">
        <div className="flex items-center gap-3">
          <Users className="h-6 w-6 text-accent" />
          <h2 className="font-display text-2xl font-extrabold sm:text-3xl">L'équipe</h2>
        </div>
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {TEAM.map((m) => (
            <div key={m.name} className="surface-card p-6 text-center">
              <span className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-gradient-navy font-display text-lg font-extrabold text-navy-foreground">
                {m.initials}
              </span>
              <h3 className="mt-4 font-display text-base font-bold">{m.name}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{m.role}</p>
            </div>
          ))}
        </div>

        <div className="mt-12 rounded-3xl bg-gradient-navy px-6 py-12 text-center text-navy-foreground sm:px-12">
          <h2 className="font-display text-2xl font-extrabold">Une question sur votre projet ?</h2>
          <p className="mx-auto mt-3 max-w-xl text-navy-foreground/75">
            Écrivez-nous : nous répondons sous 24 h ouvrées avec un devis détaillé.
          </p>
          <div className="mt-7">
            <Button asChild variant="accent" size="lg">
              <Link to="/contact">Nous contacter</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
