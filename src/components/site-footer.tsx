import { Link } from "@tanstack/react-router";
import { Mail, MapPin, Phone, Ship } from "lucide-react";

export function SiteFooter() {
  return (
    <footer className="mt-24 bg-gradient-navy text-navy-foreground">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 md:grid-cols-2 lg:grid-cols-4 lg:px-8">
        <div>
          <div className="flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-accent text-accent-foreground">
              <Ship className="h-5 w-5" />
            </span>
            <span className="font-display text-lg font-extrabold">AutoTrack Bénin</span>
          </div>
          <p className="mt-4 text-sm text-navy-foreground/70">
            Importation de véhicules chinois, personnalisation sur-mesure et suivi maritime en temps
            réel jusqu'au Port de Cotonou.
          </p>
        </div>

        <div>
          <h4 className="text-sm font-bold uppercase tracking-wider text-accent">Liens rapides</h4>
          <ul className="mt-4 space-y-2 text-sm text-navy-foreground/75">
            <li>
              <Link to="/catalogue" className="hover:text-accent">
                Catalogue véhicules
              </Link>
            </li>
            <li>
              <Link to="/partenaires" className="hover:text-accent">
                Devenir partenaire
              </Link>
            </li>
            <li>
              <Link to="/a-propos" className="hover:text-accent">
                À propos
              </Link>
            </li>
            <li>
              <Link to="/contact" className="hover:text-accent">
                Contact
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-bold uppercase tracking-wider text-accent">Contact</h4>
          <ul className="mt-4 space-y-3 text-sm text-navy-foreground/75">
            <li className="flex items-start gap-2">
              <Mail className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
              <a href="mailto:mindsanni@gmail.com" className="hover:text-accent">
                mindsanni@gmail.com
              </a>
            </li>
            <li className="flex items-start gap-2">
              <Phone className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
              <span>+229 97 00 00 00 (WhatsApp)</span>
            </li>
            <li className="flex items-start gap-2">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
              <span>Calavi / Abomey-Calavi, Bénin</span>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-bold uppercase tracking-wider text-accent">Mentions</h4>
          <p className="mt-4 text-sm text-navy-foreground/70">
            Les prix affichés sont indicatifs et hors droits de douane. Données de démonstration.
          </p>
        </div>
      </div>
      <div className="border-t border-navy-foreground/10 py-5 text-center text-xs text-navy-foreground/60">
        © {new Date().getFullYear()} AutoTrack Bénin — Tous droits réservés.
      </div>
    </footer>
  );
}
