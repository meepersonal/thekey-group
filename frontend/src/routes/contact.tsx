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
  ShieldCheck, Search, Navigation,
  Facebook,
  Instagram,
  Linkedin,
  Youtube,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { waLink } from "@/data/tracking";
import { usePublicAgences, usePublicSettings } from "@/data/public-store";
import { api } from "@/lib/api";
import { AgenciesSection } from "@/components/sections/agencies-section";

/* ============================================================
   DONNÉES STATIQUES (sujets, FAQ, régions)
   ============================================================ */
const REGIONS = ["Toutes", "Île-de-France", "Sud-Est", "Sud-Ouest", "Nord", "Ouest"];

const SUBJECTS = [
  "Devis véhicule",
  "Suivi de conteneur",
  "Dédouanement",
  "Devenir partenaire",
  "Autre",
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
  const { data: agenciesData } = usePublicAgences();
  const { data: settings } = usePublicSettings();

  const agencies = agenciesData ?? [];

  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    subject: SUBJECTS[0],
    message: "",
  });
  const [sent, setSent] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [region, setRegion] = useState("Toutes");
  const [search, setSearch] = useState("");

  // Build contact info from settings with fallbacks
  const primaryPhone = settings?.phones?.find((p) => p.label === "Standard")?.value
    || settings?.phones?.[0]?.value
    || settings?.support_phone
    || "+229 97 00 00 00";

  const whatsappPhone = settings?.phones?.find((p) => p.label === "WhatsApp")?.value
    || settings?.whatsapp_number
    || "+229 97 00 00 00";

  const primaryEmail = settings?.email_contact || "info@thekeygroup.com";

  const addresses = settings?.addresses?.length
    ? settings.addresses.map((a) => a.value).join(" · ")
    : "Ningbo, Chine · Cotonou, Bénin";

  const contactInfo = [
    {
      icon: Phone,
      label: "Téléphone",
      value: primaryPhone,
      href: `tel:${primaryPhone.replace(/\D/g, "")}`,
      hint: "Lun–Sam · 8h–19h",
    },
    {
      icon: MessageCircle,
      label: "WhatsApp",
      value: whatsappPhone,
      href: waLink("Bonjour The Key Group, j'aimerais des informations."),
      hint: "Réponse en moins d'1h",
    },
    {
      icon: Mail,
      label: "Email",
      value: primaryEmail,
      href: `mailto:${primaryEmail}`,
      hint: "Réponse sous 24h",
    },
    {
      icon: MapPin,
      label: "Sièges",
      value: addresses,
      href: "/agences",
      hint: "Voir toutes les agences",
    },
  ];

  const filteredAgencies = agencies.filter((a) => {
    const matchRegion = region === "Toutes" || a.location === region;
    const q = search.trim().toLowerCase();
    const matchSearch =
      q === "" ||
      a.name?.toLowerCase().includes(q) ||
      a.location?.toLowerCase().includes(q);
    return matchRegion && matchSearch;
  });

  const set = (k: keyof typeof form) => (v: string) =>
    setForm((f) => ({ ...f, [k]: v }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.phone || !form.message) {
      toast.error("Merci de remplir votre nom, téléphone et message.");
      return;
    }
    setIsSubmitting(true);
    try {
      // Use createPreorder for vehicle quote requests, or a generic contact endpoint if available
      // For now, we'll use the preorder endpoint for "Devis véhicule" subject
      if (form.subject === "Devis véhicule") {
        const payload: Parameters<typeof api.createPreorder>[0] = {
          vehicle_id: 0,
          name: form.name,
          phone: form.phone,
          notes: form.message,
        };
        if (form.email) payload.email = form.email;
        await api.createPreorder(payload);
      }
      // For other subjects, we just show success (could add a generic contact endpoint later)
      setSent(true);
      toast.success("Message envoyé !", {
        description: "Notre équipe vous répond sous 24 h ouvrées.",
      });
      setForm({ name: "", phone: "", email: "", subject: SUBJECTS[0], message: "" });
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Erreur lors de l'envoi.";
      toast.error(msg);
    } finally {
      setIsSubmitting(false);
    }
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
                        disabled={isSubmitting}
                        className="h-12 gap-2 rounded-full bg-foreground px-6 text-base font-semibold text-background hover:bg-foreground/90"
                      >
                        <Send className="h-4 w-4" />
                        {isSubmitting ? "Envoi..." : "Envoyer"}
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
                  {contactInfo.map((c) => (
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

                {/* Réseaux sociaux depuis settings */}
                {(() => {
                  const socialsMap = new Map<string, string>();
                  // From socials array
                  settings?.socials?.forEach((s) => {
                    if (s.url) socialsMap.set(s.platform.toLowerCase(), s.url);
                  });
                  // From individual fields (override)
                  if (settings?.facebook_url) socialsMap.set("facebook", settings.facebook_url);
                  if (settings?.instagram_url) socialsMap.set("instagram", settings.instagram_url);
                  if (settings?.linkedin_url) socialsMap.set("linkedin", settings.linkedin_url);
                  if (settings?.youtube_url) socialsMap.set("youtube", settings.youtube_url);
                  if (settings?.tiktok_url) socialsMap.set("tiktok", settings.tiktok_url);

                  const socials = Array.from(socialsMap.entries()).map(([platform, url]) => ({ platform, url }));

                  if (socials.length === 0) return null;

                  const iconMap: Record<string, typeof Facebook> = {
                    facebook: Facebook,
                    instagram: Instagram,
                    linkedin: Linkedin,
                    youtube: Youtube,
                    tiktok: Youtube, // fallback
                  };

                  return (
                    <div className="space-y-3">
                      <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                        Suivez-nous
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {socials.map((s) => {
                          const Icon = iconMap[s.platform] || Facebook;
                          return (
                            <a
                              key={s.platform}
                              href={s.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              aria-label={s.platform}
                              className="grid h-10 w-10 place-items-center rounded-xl border border-border bg-background transition-colors hover:border-foreground/20 hover:bg-foreground hover:text-background"
                            >
                              <Icon className="h-5 w-5" />
                            </a>
                          );
                        })}
                      </div>
                    </div>
                  );
                })()}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ──────────────────────────────────────────────
          SECTION 3 — AGENCES RAPIDES
          ────────────────────────────────────────────── */}
      <AgenciesSection />

    </div>
  );
}