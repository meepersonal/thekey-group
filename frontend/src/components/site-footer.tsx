import { Link } from "@/lib/router";
import { usePublicAgences, usePublicSettings } from "@/data/public-store";
import {
  Mail,
  MapPin,
  Ship,
  ArrowRight,
  Facebook,
  Instagram,
  Linkedin,
  Youtube,
  MessageCircle,
  Phone,
} from "lucide-react";

const NAV_LINKS = [
  { to: "/catalogue", label: "Catalogue véhicules" },
  { to: "/partenaires", label: "Devenir partenaire" },
  { to: "/a-propos", label: "À propos" },
  { to: "/contact", label: "Contact" },
];

export function SiteFooter() {
  const { data: agences } = usePublicAgences();
  const { data: settings } = usePublicSettings();

  // Helper: build socials map from settings
  const socialsMap = new Map<string, string>();
  settings?.socials?.forEach((s) => {
    if (s.url) socialsMap.set(s.platform.toLowerCase(), s.url);
  });
  if (settings?.facebook_url) socialsMap.set("facebook", settings.facebook_url);
  if (settings?.instagram_url) socialsMap.set("instagram", settings.instagram_url);
  if (settings?.linkedin_url) socialsMap.set("linkedin", settings.linkedin_url);
  const socials = Array.from(socialsMap.entries()).map(([platform, url]) => ({ platform, url }));

  // Helper: get primary phone from phones array or fallback
  const primaryPhone = settings?.phones?.find((p) => p.label === "Standard")?.value
    || settings?.phones?.[0]?.value
    || settings?.support_phone
    || "+229 97 00 00 00";

  // Helper: get WhatsApp phone
  const whatsappPhone = settings?.phones?.find((p) => p.label === "WhatsApp")?.value
    || settings?.whatsapp_number
    || "+229 97 00 00 00";

  // Helper: get primary email
  const primaryEmail = settings?.email_contact || "info@thekeygroup.com";

  // Helper: get addresses
  const addresses = settings?.addresses?.length
    ? settings.addresses.map((a) => a.value).join(" · ")
    : "Ningbo, Chine · Cotonou, Bénin";

  // Social icons map
  const iconMap: Record<string, typeof Facebook> = {
    facebook: Facebook,
    instagram: Instagram,
    linkedin: Linkedin,
    youtube: Youtube,
  };
  return (
    <footer className="relative overflow-hidden border-t border-background/10 bg-foreground text-background">
      <div className="mx-auto max-w-7xl px-4 py-16 lg:px-8 lg:py-20">
        {/* Grille principale */}
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-8">
          {/* Colonne 1 — Marque */}
          <div className="lg:col-span-4">
            <Link to="/" className="inline-flex items-center gap-3">
              <span className="grid h-10 w-10 place-items-center rounded-xl border border-background/10 bg-background/5 text-accent">
                <Ship className="h-5 w-5" />
              </span>
              <span className="font-display text-lg font-extrabold">The Key Group</span>
            </Link>

            <p className="mt-5 max-w-sm text-sm leading-relaxed text-background/60">
              Importateur et distributeur officiel de véhicules chinois. Personnalisation
              sur-mesure, suivi maritime en temps réel et SAV local jusqu'à la remise des clés.
            </p>

            {/* Réseaux sociaux */}
            <div className="mt-6 flex items-center gap-2">
              {socials.map((s) => {
                const Icon = iconMap[s.platform] || Facebook;
                return (
                  <a
                    key={s.platform}
                    href={s.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={s.platform}
                    className="grid h-9 w-9 place-items-center rounded-lg border border-background/10 bg-background/5 text-background/70 transition-colors hover:border-background/20 hover:bg-background/10 hover:text-background"
                  >
                    <Icon className="h-4 w-4" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Colonne 2 — Navigation */}
          <div className="lg:col-span-2">
            <h4 className="text-[11px] font-bold uppercase tracking-[0.2em] text-background/50">
              Liens rapides
            </h4>
            <ul className="mt-5 space-y-3">
              {NAV_LINKS.map((l) => (
                <li key={l.to}>
                  <Link
                    to={l.to}
                    className="text-sm text-background/70 transition-colors hover:text-background"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Colonne 3 — Agences */}
          <div className="lg:col-span-3">
            <h4 className="text-[11px] font-bold uppercase tracking-[0.2em] text-background/50">
              Nos agences
            </h4>
            <ul className="mt-5 space-y-3">
              {agences
                ?.filter((a) => a.is_active)
                .map((a) => (
                  <li key={a.id}>
                    <Link
                      to="/agences"
                      className="group flex items-center justify-between gap-2 text-sm text-background/70 transition-colors hover:text-background"
                    >
                      <span>{a.name}</span>
                    </Link>
                  </li>
                ))}
              <li className="pt-2">
                <Link
                  to="/agences"
                  className="inline-flex items-center gap-1 text-sm font-semibold text-accent transition-colors hover:text-accent/80"
                >
                  Voir toutes les agences
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </li>
            </ul>
          </div>

          {/* Colonne 4 — Contact */}
          <div className="lg:col-span-3">
            <h4 className="text-[11px] font-bold uppercase tracking-[0.2em] text-background/50">
              Contact
            </h4>
            <ul className="mt-5 space-y-4">
              {/* Email */}
              <li>
                <a
                  href={`mailto:${primaryEmail}`}
                  className="group flex items-start gap-3 text-sm text-background/70 transition-colors hover:text-background"
                >
                  <span className="mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-lg border border-background/10 bg-background/5 text-background/60 transition-colors group-hover:border-background/20 group-hover:text-background">
                    <Mail className="h-3.5 w-3.5" />
                  </span>
                  <span>
                    <span className="block text-[11px] uppercase tracking-wider text-background/40">
                      Email
                    </span>
                    {primaryEmail}
                  </span>
                </a>
              </li>

              {/* Téléphone / WhatsApp */}
              <li>
                <a
                  href={`https://wa.me/${whatsappPhone.replace(/\D/g, "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-start gap-3 text-sm text-background/70 transition-colors hover:text-background"
                >
                  <span className="mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-lg border border-background/10 bg-background/5 text-background/60 transition-colors group-hover:border-background/20 group-hover:text-background">
                    <MessageCircle className="h-3.5 w-3.5" />
                  </span>
                  <span>
                    <span className="block text-[11px] uppercase tracking-wider text-background/40">
                      WhatsApp
                    </span>
                    {whatsappPhone}
                  </span>
                </a>
              </li>

              {/* Téléphone Standard */}
              {/* <li>
                <a
                  href={`tel:${primaryPhone.replace(/\D/g, "")}`}
                  className="group flex items-start gap-3 text-sm text-background/70 transition-colors hover:text-background"
                >
                  <span className="mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-lg border border-background/10 bg-background/5 text-background/60 transition-colors group-hover:border-background/20 group-hover:text-background">
                    <Phone className="h-3.5 w-3.5" />
                  </span>
                  <span>
                    <span className="block text-[11px] uppercase tracking-wider text-background/40">
                      Téléphone
                    </span>
                    {primaryPhone}
                  </span>
                </a>
              </li> */}

              {/* Localisation */}
              <li>
                <div className="flex items-start gap-3 text-sm text-background/70">
                  <span className="mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-lg border border-background/10 bg-background/5 text-background/60">
                    <MapPin className="h-3.5 w-3.5" />
                  </span>
                  <span>
                    <span className="block text-[11px] uppercase tracking-wider text-background/40">
                      Siège
                    </span>
                    {addresses}
                  </span>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Séparateur */}
        <div className="my-12 h-px bg-background/10" />

        {/* Bas de footer */}
        <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
          <p className="text-xs text-background/50">
            © {new Date().getFullYear()} The Key Group — Tous droits réservés.
          </p>

          <ul className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
            <li>
              <Link
                to="/mentions-legales"
                className="text-xs text-background/50 transition-colors hover:text-background/80"
              >
                Mentions légales
              </Link>
            </li>
            <li>
              <Link
                to="/confidentialite"
                className="text-xs text-background/50 transition-colors hover:text-background/80"
              >
                Confidentialité
              </Link>
            </li>
            <li>
              <Link
                to="/cgv"
                className="text-xs text-background/50 transition-colors hover:text-background/80"
              >
                CGV
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
