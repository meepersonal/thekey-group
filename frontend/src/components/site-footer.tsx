import { Link } from "@/lib/router";
import {
  Mail,
  MapPin,
  Phone,
  Ship,
  ArrowRight,
  Facebook,
  Instagram,
  Linkedin,
  Youtube,
  MessageCircle,
} from "lucide-react";

const SOCIALS = [
  { icon: Facebook, label: "Facebook", href: "https://facebook.com/thekeygroup" },
  { icon: Instagram, label: "Instagram", href: "https://instagram.com/thekeygroup" },
  { icon: Linkedin, label: "LinkedIn", href: "https://linkedin.com/company/thekeygroup" },
  { icon: Youtube, label: "YouTube", href: "https://youtube.com/@thekeygroup" },
];

const NAV_LINKS = [
  { to: "/catalogue", label: "Catalogue véhicules" },
  { to: "/partenaires", label: "Devenir partenaire" },
  { to: "/a-propos", label: "À propos" },
  { to: "/contact", label: "Contact" },
];

const AGENCIES = [
  { city: "Paris", country: "France" },
  { city: "Lyon", country: "France" },
  { city: "Cotonou", country: "Bénin" },
  { city: "Ningbo", country: "Chine" },
];

export function SiteFooter() {
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
              <span className="font-display text-lg font-extrabold">
                The Key Group
              </span>
            </Link>

            <p className="mt-5 max-w-sm text-sm leading-relaxed text-background/60">
              Importateur et distributeur officiel de véhicules chinois.
              Personnalisation sur-mesure, suivi maritime en temps réel
              et SAV local jusqu'à la remise des clés.
            </p>

            {/* Réseaux sociaux */}
            <div className="mt-6 flex items-center gap-2">
              {SOCIALS.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  className="grid h-9 w-9 place-items-center rounded-lg border border-background/10 bg-background/5 text-background/70 transition-colors hover:border-background/20 hover:bg-background/10 hover:text-background"
                >
                  <s.icon className="h-4 w-4" />
                </a>
              ))}
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
              {AGENCIES.map((a) => (
                <li key={a.city}>
                  <Link
                    to="/agences"
                    className="group flex items-center justify-between gap-2 text-sm text-background/70 transition-colors hover:text-background"
                  >
                    <span>{a.city}</span>
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
                  href="mailto:info@thekeygroup.com"
                  className="group flex items-start gap-3 text-sm text-background/70 transition-colors hover:text-background"
                >
                  <span className="mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-lg border border-background/10 bg-background/5 text-background/60 transition-colors group-hover:border-background/20 group-hover:text-background">
                    <Mail className="h-3.5 w-3.5" />
                  </span>
                  <span>
                    <span className="block text-[11px] uppercase tracking-wider text-background/40">
                      Email
                    </span>
                    info@thekeygroup.com
                  </span>
                </a>
              </li>

              {/* Téléphone / WhatsApp */}
              <li>
                <a
                  href="https://wa.me/22997000000"
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
                    +229 97 00 00 00
                  </span>
                </a>
              </li>

              {/* Localisation */}
              <li>
                <div className="flex items-start gap-3 text-sm text-background/70">
                  <span className="mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-lg border border-background/10 bg-background/5 text-background/60">
                    <MapPin className="h-3.5 w-3.5" />
                  </span>
                  <span>
                    <span className="block text-[11px] uppercase tracking-wider text-background/40">
                      Sièges
                    </span>
                    Ningbo, Chine · Cotonou, Bénin
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