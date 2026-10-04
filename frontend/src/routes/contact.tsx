import { useState } from "react";
import { Link } from "@/lib/router";
import {
  ArrowRight,
  ArrowUpRight,
  Check,
  Clock,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  Send,
  ShieldCheck, Search, Navigation
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { waLink } from "@/data/tracking";

/* ============================================================
   DONNÉES
   ============================================================ */
const REGIONS = ["Toutes", "Île-de-France", "Sud-Est", "Sud-Ouest", "Nord", "Ouest"];

const AGENCIES = [
  {
    id: "paris",
    city: "Paris",
    postalCode: "75011",
    address: "42 rue de la Roquette",
    phone: "+33 1 23 45 67 89",
    hours: "Lun–Sam · 9h–19h",
    region: "Île-de-France",
    open: true,
    mapX: 52,
    mapY: 28,
  },
  {
    id: "lyon",
    city: "Lyon",
    postalCode: "69003",
    address: "18 avenue Jean Jaurès",
    phone: "+33 4 23 45 67 89",
    hours: "Lun–Sam · 9h–19h",
    region: "Sud-Est",
    open: true,
    mapX: 60,
    mapY: 52,
  },
  {
    id: "marseille",
    city: "Marseille",
    postalCode: "13006",
    address: "7 rue Paradis",
    phone: "+33 4 91 23 45 67",
    hours: "Lun–Sam · 9h–18h",
    region: "Sud-Est",
    open: true,
    mapX: 62,
    mapY: 72,
  },
  {
    id: "bordeaux",
    city: "Bordeaux",
    postalCode: "33000",
    address: "25 cours de l'Intendance",
    phone: "+33 5 56 23 45 67",
    hours: "Lun–Sam · 9h–19h",
    region: "Sud-Ouest",
    open: false,
    mapX: 32,
    mapY: 60,
  },
  {
    id: "lille",
    city: "Lille",
    postalCode: "59000",
    address: "12 rue Faidherbe",
    phone: "+33 3 20 23 45 67",
    hours: "Lun–Sam · 9h–19h",
    region: "Nord",
    open: true,
    mapX: 55,
    mapY: 8,
  },
  {
    id: "nantes",
    city: "Nantes",
    postalCode: "44000",
    address: "9 rue Crébillon",
    phone: "+33 2 40 23 45 67",
    hours: "Lun–Sam · 9h–18h",
    region: "Ouest",
    open: true,
    mapX: 22,
    mapY: 38,
  },
];

const SUBJECTS = [
  "Devis véhicule",
  "Suivi de conteneur",
  "Dédouanement",
  "Devenir partenaire",
  "Autre",
];

const CONTACT_INFO = [
  {
    icon: Phone,
    label: "Téléphone",
    value: "+229 97 00 00 00",
    href: "tel:+22997000000",
    hint: "Lun–Sam · 8h–19h",
  },
  {
    icon: MessageCircle,
    label: "WhatsApp",
    value: "+229 97 00 00 00",
    href: waLink("Bonjour The Key Group, j'aimerais des informations."),
    hint: "Réponse en moins d'1h",
  },
  {
    icon: Mail,
    label: "Email",
    value: "info@thekeygroup.com",
    href: "mailto:info@thekeygroup.com",
    hint: "Réponse sous 24h",
  },
  {
    icon: MapPin,
    label: "Sièges",
    value: "Ningbo, Chine · Cotonou, Bénin",
    href: "/agences",
    hint: "Voir toutes les agences",
  },
];

const AGENCIES_QUICK = [
  { city: "Paris", country: "France", phone: "+33 1 23 45 67 89" },
  { city: "Lyon", country: "France", phone: "+33 4 23 45 67 89" },
  { city: "Cotonou", country: "Bénin", phone: "+229 97 00 00 00" },
  { city: "Ningbo", country: "Chine", phone: "+86 20 1234 5678" },
];

const FAQ_EXPRESS = [
  {
    q: "En combien de temps avez-vous une réponse ?",
    a: "Moins de 24h par email, moins d'1h par WhatsApp pendant les heures ouvrées.",
  },
  {
    q: "Puis-je essayer un véhicule avant d'acheter ?",
    a: "Oui, nous organisons des journées d'essai dans plusieurs villes. Précisez votre ville dans le message.",
  },
  {
    q: "Faites-vous des devis pour l'export ?",
    a: "Oui, nous livrons en France, en Afrique et au Moyen-Orient. Indiquez votre destination dans le message.",
  },
];

// Classes réutilisables
const FIELD_CLASS = "h-12 text-base px-4";
const SELECT_CLASS =
  "h-12 w-full rounded-md border border-input bg-background px-4 text-base outline-none transition-colors focus-visible:border-primary focus-visible:ring-0";
const LABEL_CLASS =
  "text-[11px] font-semibold uppercase tracking-wider text-muted-foreground";

/* ============================================================
   PAGE
   ============================================================ */

export function ContactPage() {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    subject: SUBJECTS[0],
    message: "",
  });
  const [sent, setSent] = useState(false);

  const [region, setRegion] = useState("Toutes");
  const [search, setSearch] = useState("");

  const filteredAgencies = AGENCIES.filter((a) => {
    const matchRegion = region === "Toutes" || a.region === region;
    const q = search.trim().toLowerCase();
    const matchSearch =
      q === "" ||
      a.city.toLowerCase().includes(q) ||
      a.country.toLowerCase().includes(q) ||
      a.address.toLowerCase().includes(q);
    return matchRegion && matchSearch;
  });

  const set = (k: keyof typeof form) => (v: string) =>
    setForm((f) => ({ ...f, [k]: v }));

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.phone || !form.message) {
      toast.error("Merci de remplir votre nom, téléphone et message.");
      return;
    }
    setSent(true);
    toast.success("Message envoyé !", {
      description: "Notre équipe vous répond sous 24 h ouvrées.",
    });
    setForm({ name: "", phone: "", email: "", subject: SUBJECTS[0], message: "" });
  };

  return (
    <div>
      {/* ═══════════════════════════════════════════════════════
          HERO — aligné sur le style FeaturedVehiclesSection
      ═══════════════════════════════════════════════════════ */}
      <section className="bg-gradient-navy py-14 text-navy-foreground lg:py-20">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <span className="mb-4 block text-sm font-medium uppercase tracking-wider text-navy-foreground/60">
            03 — Contact
          </span>
          <h1 className="font-display text-4xl font-bold leading-[1.1] tracking-tight sm:text-5xl lg:text-7xl">
            Contactez-nous
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-navy-foreground/75 sm:text-lg">
            Une question sur un modèle, un devis ou votre conteneur en mer ?
            Écrivez-nous, nous répondons rapidement.          </p>
        </div>
      </section>

      {/* ──────────────────────────────────────────────
          SECTION 2 — FORMULAIRE + COORDONNÉES
          ────────────────────────────────────────────── */}
      <section className="bg-background">
        <div className="mx-auto max-w-7xl px-4 py-16 lg:px-8 lg:py-20">
          <div className="grid gap-10 lg:grid-cols-12 lg:gap-12">

            {/* Colonne gauche — Formulaire */}
            <div className="lg:col-span-7">
              <div className="rounded-3xl border border-border bg-background p-6 shadow-[inset_0_1px_0_rgba(255,255,255,0.06),inset_0_-1px_0_rgba(0,0,0,0.06),0_1px_2px_rgba(0,0,0,0.03)] sm:p-8">
                <h2 className="font-display text-xl font-bold text-foreground sm:text-2xl">
                  Envoyez-nous un message
                </h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Tous les champs marqués d'un astérisque sont obligatoires.
                </p>

                {sent ? (
                  /* État de succès */
                  <div className="mt-8 flex flex-col items-center justify-center rounded-2xl border border-emerald-500/20 bg-emerald-500/5 px-6 py-12 text-center">
                    <span className="grid h-14 w-14 place-items-center rounded-full bg-emerald-500/10 text-emerald-600">
                      <Check className="h-6 w-6" strokeWidth={3} />
                    </span>
                    <p className="mt-4 font-display text-lg font-bold text-foreground">
                      Message envoyé
                    </p>
                    <p className="mt-1 max-w-sm text-sm text-muted-foreground">
                      Merci ! Un conseiller vous recontacte sous 24h. Pour une
                      réponse plus rapide, contactez-nous sur WhatsApp.
                    </p>
                    <Button
                      variant="outline"
                      size="sm"
                      className="mt-6"
                      onClick={() => setSent(false)}
                    >
                      Envoyer un autre message
                    </Button>
                  </div>
                ) : (
                  <form onSubmit={submit} className="mt-8 space-y-5">
                    {/* Nom + Téléphone */}
                    <div className="grid gap-5 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="name" className={LABEL_CLASS}>
                          Nom complet *
                        </Label>
                        <Input
                          id="name"
                          value={form.name}
                          onChange={(e) => set("name")(e.target.value)}
                          placeholder="Ex : Karim A."
                          className={FIELD_CLASS}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone" className={LABEL_CLASS}>
                          Téléphone / WhatsApp *
                        </Label>
                        <Input
                          id="phone"
                          value={form.phone}
                          onChange={(e) => set("phone")(e.target.value)}
                          placeholder="+229 ..."
                          className={FIELD_CLASS}
                        />
                      </div>
                    </div>

                    {/* Email + Sujet */}
                    <div className="grid gap-5 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="email" className={LABEL_CLASS}>
                          E-mail
                        </Label>
                        <Input
                          id="email"
                          type="email"
                          value={form.email}
                          onChange={(e) => set("email")(e.target.value)}
                          placeholder="vous@exemple.com"
                          className={FIELD_CLASS}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="subject" className={LABEL_CLASS}>
                          Sujet
                        </Label>
                        <select
                          id="subject"
                          value={form.subject}
                          onChange={(e) => set("subject")(e.target.value)}
                          className={SELECT_CLASS}
                        >
                          {SUBJECTS.map((s) => (
                            <option key={s} value={s}>
                              {s}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {/* Message */}
                    <div className="space-y-2">
                      <Label htmlFor="message" className={LABEL_CLASS}>
                        Message *
                      </Label>
                      <Textarea
                        id="message"
                        rows={6}
                        value={form.message}
                        onChange={(e) => set("message")(e.target.value)}
                        placeholder="Décrivez votre besoin : modèle souhaité, budget, délai..."
                        className="min-h-[150px] px-4 py-3 text-base"
                      />
                    </div>

                    {/* Submit */}
                    <div className="flex flex-col gap-3 sm:flex-row">
                      <Button
                        type="submit"
                        variant="default"
                        size="lg"
                        className="h-12 gap-2 rounded-full bg-foreground px-6 text-base font-semibold text-background hover:bg-foreground/90"
                      >
                        <Send className="h-4 w-4" />
                        Envoyer
                      </Button>
                      <Button
                        asChild
                        size="lg"
                        variant="outline"
                        className="h-12 gap-2 rounded-full px-6 text-base font-semibold"
                      >
                        <a
                          href={waLink(
                            "Bonjour The Key Group, j'aimerais des informations."
                          )}
                          target="_blank"
                          rel="noreferrer"
                        >
                          <MessageCircle className="h-4 w-4" />
                          Discuter directment sur WhatsApp
                        </a>
                      </Button>
                    </div>

                    <p className="text-center text-[11px] leading-relaxed text-muted-foreground">
                      En soumettant ce formulaire, vous acceptez d'être recontacté
                      par un conseiller. Vos données restent confidentielles.
                    </p>
                  </form>
                )}
              </div>
            </div>

            {/* Colonne droite — Coordonnées */}
            <div className="lg:col-span-5">
              <div className="space-y-4">
                <div>
                  <h2 className="font-display text-xl font-bold text-foreground sm:text-2xl">
                    Nous joindre directement
                  </h2>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Choisissez le canal qui vous convient.
                  </p>
                </div>

                {/* Liste des contacts */}
                <ul className="space-y-3">
                  {CONTACT_INFO.map((c) => (
                    <li key={c.label}>
                      <a
                        href={c.href}
                        target={c.href.startsWith("http") ? "_blank" : undefined}
                        rel={
                          c.href.startsWith("http")
                            ? "noopener noreferrer"
                            : undefined
                        }
                        className="group flex items-start gap-4 rounded-2xl border border-border bg-background p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.06),inset_0_-1px_0_rgba(0,0,0,0.06),0_1px_2px_rgba(0,0,0,0.03)] transition-all duration-300 hover:-translate-y-0.5 hover:border-foreground/20 hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.08),inset_0_-1px_0_rgba(0,0,0,0.08),0_8px_24px_rgba(0,0,0,0.06)]"
                      >
                        <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl border border-border/80 bg-secondary text-foreground transition-colors group-hover:bg-foreground group-hover:text-background">
                          <c.icon className="h-4 w-4" strokeWidth={2} />
                        </span>
                        <div className="min-w-0 flex-1">
                          <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                            {c.label}
                          </p>
                          <p className="mt-0.5 truncate text-sm font-semibold text-foreground">
                            {c.value}
                          </p>
                          <p className="mt-0.5 text-xs text-muted-foreground">
                            {c.hint}
                          </p>
                        </div>
                        <ArrowUpRight className="mt-1 h-4 w-4 shrink-0 text-foreground/30 transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-foreground" />
                      </a>
                    </li>
                  ))}
                </ul>

                {/* Bloc horaires */}
                <div className="flex items-start gap-4 rounded-2xl border border-border/60 bg-secondary/40 p-5">
                  <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-background text-foreground">
                    <Clock className="h-4 w-4" strokeWidth={2} />
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-foreground">
                      Horaires d'ouverture
                    </p>
                    <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                      Lundi – Samedi : 8h – 19h
                      <br />
                      Dimanche : fermé
                      <br />
                      WhatsApp : 7j/7, 24h/24
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ──────────────────────────────────────────────
          SECTION 3 — AGENCES RAPIDES
          ────────────────────────────────────────────── */}
      <section className="border-t border-border/60 bg-background" id="agences">
        <div className="mx-auto max-w-7xl px-4 py-16 lg:px-8 lg:py-20">

          {/* Header + Recherche */}
          <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            {/* Titre + description */}
            <div className="max-w-2xl">
              <span className="inline-flex items-center gap-3 text-[10px] font-bold uppercase tracking-[0.25em] text-primary">
                <span className="h-px w-6 bg-primary/40" />
                Nos agences
              </span>

              <h2 className="mt-4 font-display text-3xl font-extrabold leading-[1.15] tracking-tight sm:text-4xl">
                Retrouvez-nous{" "}
                <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  près de chez vous
                </span>
              </h2>

              <p className="mt-4 text-base text-muted-foreground">
                {AGENCIES.length} agences en France, en Afrique et en Asie —
                avec des journées d'essai organisées chaque mois.
              </p>
            </div>

            {/* Champ de recherche */}
            <div className="relative w-full lg:w-80">
              <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Rechercher une ville, un pays..."
                aria-label="Rechercher une agence"
                className="h-11 w-full rounded-full border-border bg-background pl-10 pr-4 text-sm shadow-[inset_0_1px_0_rgba(255,255,255,0.06),inset_0_-1px_0_rgba(0,0,0,0.06)] transition-colors focus-visible:border-primary focus-visible:ring-0"
              />
            </div>
          </div>

          {/* Filtre par région */}
          <div className="mt-10 flex flex-wrap justify-center gap-2 lg:justify-start">
            {REGIONS.map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => setRegion(r)}
                className={`rounded-full border px-4 py-2 text-xs font-semibold transition-colors ${region === r
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-background text-muted-foreground hover:border-foreground/20 hover:text-foreground"
                  }`}
              >
                {r}
              </button>
            ))}
          </div>

          {/* Grille des agences */}
          {filteredAgencies.length > 0 ? (
            <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {filteredAgencies.map((a) => (
                <article
                  key={a.id}
                  className="group flex flex-col rounded-2xl border border-border bg-background p-6 shadow-[inset_0_1px_0_rgba(255,255,255,0.06),inset_0_-1px_0_rgba(0,0,0,0.06),0_1px_2px_rgba(0,0,0,0.03)] transition-all duration-300 hover:-translate-y-1 hover:border-foreground/20 hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.08),inset_0_-1px_0_rgba(0,0,0,0.08),0_12px_32px_rgba(0,0,0,0.08)]"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="font-display text-lg font-bold leading-tight text-foreground">
                        {a.city}
                      </h3>
                    </div>

                    <span
                      className={`shrink-0 rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider ${a.open
                        ? "bg-emerald-500/10 text-emerald-600"
                        : "bg-secondary text-muted-foreground"
                        }`}
                    >
                      {a.open ? "Ouvert" : "Fermé"}
                    </span>
                  </div>

                  <div className="my-4 h-px bg-border/60" />

                  <div className="flex-1 space-y-3">
                    <p className="flex items-start gap-2 text-sm text-muted-foreground">
                      <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-foreground/60" />
                      {a.address}
                    </p>
                    <p className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Phone className="h-4 w-4 shrink-0 text-foreground/60" />
                      {a.phone}
                    </p>
                    <p className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Clock className="h-4 w-4 shrink-0 text-foreground/60" />
                      {a.hours}
                    </p>
                  </div>

                  <div className="mt-5 flex gap-2">
                    <Button asChild variant="accent" size="sm" className="flex-1">
                      <Link to="/contact">
                        Prendre RDV
                        <ArrowRight className="h-3.5 w-3.5" />
                      </Link>
                    </Button>
                    <Button asChild variant="outline" size="sm">
                      <a
                        href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                          `${a.address}, ${a.city}`
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Navigation className="h-3.5 w-3.5" />
                        Itinéraire
                      </a>
                    </Button>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            /* État vide */
            <div className="mt-12 flex flex-col items-center justify-center rounded-2xl border border-dashed border-border/60 bg-secondary/20 px-6 py-16 text-center">
              <span className="grid h-12 w-12 place-items-center rounded-full bg-secondary text-muted-foreground">
                <Search className="h-5 w-5" />
              </span>
              <p className="mt-4 font-display text-base font-bold text-foreground">
                Aucune agence trouvée
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                Essayez un autre mot-clé ou changez de région.
              </p>
              <Button
                variant="outline"
                size="sm"
                className="mt-5"
                onClick={() => {
                  setSearch("");
                  setRegion("Toutes");
                }}
              >
                Réinitialiser la recherche
              </Button>
            </div>
          )}
        </div>
      </section>

    </div>
  );
}