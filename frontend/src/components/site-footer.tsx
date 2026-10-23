import { ArrowUpRight } from "lucide-react";
import { Link } from "@/lib/router";
import { usePublicSettings } from "@/data/public-store";
import logo from "@/assets/key-group-navy.png.asset.json";

export function SiteFooter() {
  const { data: settings } = usePublicSettings();
  const phone = settings?.phones?.find((item) => item.label.toLowerCase() === "standard")?.value;
  const socials = settings?.socials?.filter((item) => item.url) ?? [];
  return <footer className="border-t border-navy-foreground/15 bg-navy text-navy-foreground"><div className="editorial-container pb-7 pt-14">
    <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr_1fr]">
      <div><Link to="/" aria-label="KEY GROUP — Accueil"><img src={logo.url} alt="THE KEY GROUP" width={196} height={34} className="key-logo brightness-0 invert" /></Link><p className="mt-5 max-w-xs text-xs leading-6 text-navy-foreground/60">Achat de véhicules en Chine et coordination de leur transport vers les pays d’Afrique.</p></div>
      <div><h2 className="mb-5 text-xs font-semibold">Explorer</h2><ul className="space-y-3 text-xs text-navy-foreground/60"><li><Link to="/catalogue">Nos véhicules</Link></li><li><Link to="/a-propos">À propos de KEY GROUP</Link></li><li><Link to="/partenaires">Devenir partenaire</Link></li><li><Link to="/tracking">Suivre une commande</Link></li></ul></div>
      <div><h2 className="mb-5 text-xs font-semibold">Nos services</h2><ul className="space-y-3 text-xs text-navy-foreground/60"><li><a href="/#services">Recherche de véhicules</a></li><li><a href="/#services">Accompagnement à l’achat</a></li><li><a href="/#services">Coordination du transport</a></li><li><a href="/#agences">Nos agences</a></li></ul></div>
      <div><h2 className="mb-5 text-xs font-semibold">Contact</h2><ul className="space-y-3 break-words text-xs text-navy-foreground/60">{settings?.email_contact && <li><a href={`mailto:${settings.email_contact}`}>{settings.email_contact}</a></li>}{phone && <li><a href={`tel:${phone.replace(/[^+\d]/g, "")}`}>{phone}</a></li>}{settings?.addresses?.map((address) => <li key={address.label}>{address.value}</li>)}<li><Link to="/contact" className="inline-flex items-center gap-2 text-navy-foreground">Échanger avec notre équipe <ArrowUpRight className="h-3 w-3" /></Link></li></ul></div>
    </div>
    <div className="mt-12 flex flex-col justify-between gap-5 border-t border-navy-foreground/15 pt-6 sm:flex-row"><p className="text-[10px] text-navy-foreground/50">© {new Date().getFullYear()} KEY GROUP. Tous droits réservés.</p><div className="flex flex-wrap gap-5 text-[10px] text-navy-foreground/60">{socials.map((social) => <a href={social.url} key={social.platform} target="_blank" rel="noopener noreferrer">{social.platform}</a>)}</div></div>
  </div></footer>;
}
