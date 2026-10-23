import { useEffect, useState } from "react";
import { Menu, ArrowUpRight } from "lucide-react";
import { Link, useRouterState } from "@/lib/router";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import logo from "@/assets/key-group-navy.png.asset.json";

const navigation = [
  { to: "/", label: "Accueil" },
  { to: "/catalogue", label: "Véhicules" },
  { to: "/#services", label: "Nos services", anchor: true },
  { to: "/#realisations", label: "Nos réalisations", anchor: true },
  { to: "/#agences", label: "Nos agences", anchor: true },
  { to: "/contact", label: "Contact" },
];
export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = useRouterState((s) => s.pathname);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 32);
    onScroll(); window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  useEffect(() => setOpen(false), [pathname]);
  return <header className={`sticky top-0 z-40 border-b bg-background text-navy transition-shadow ${scrolled ? "border-border shadow-sm" : "border-transparent"}`}>
    <div className="editorial-container flex h-[76px] items-center justify-between gap-4 max-sm:h-16">
      <Link to="/" aria-label="KEY GROUP — Accueil"><img src={logo.url} className="key-logo" width={196} height={34} alt="THE KEY GROUP" /></Link>
      <nav aria-label="Navigation principale" className="hidden items-center gap-6 xl:flex">
        {navigation.map((item) => item.anchor ? <a key={item.to} href={item.to} className="text-xs font-medium transition-colors hover:text-primary">{item.label}</a> : <Link key={item.to} to={item.to} className={`text-xs font-medium transition-colors hover:text-primary ${pathname === item.to ? "text-navy font-bold" : "text-muted-foreground"}`}>{item.label}</Link>)}
      </nav>
      <div className="flex items-center gap-2">
        <Button asChild className="h-10 rounded-none px-5 text-xs max-sm:px-3"><Link to="/contact"><span className="hidden sm:inline">Demander un devis</span><span className="sm:hidden">Devis</span><ArrowUpRight /></Link></Button>
        <Sheet open={open} onOpenChange={setOpen}><SheetTrigger asChild><Button variant="ghost" size="icon" className="rounded-none xl:hidden" aria-label="Ouvrir le menu"><Menu /></Button></SheetTrigger>
          <SheetContent className="bg-background"><SheetTitle>KEY GROUP</SheetTitle><nav className="mt-10 flex flex-col gap-6" aria-label="Navigation mobile">{navigation.map((item) => item.anchor ? <a href={item.to} onClick={() => setOpen(false)} key={item.to} className="text-lg">{item.label}</a> : <Link to={item.to} key={item.to} onClick={() => setOpen(false)} className="text-lg">{item.label}</Link>)}<Link to="/partenaires">Devenir partenaire</Link><Link to="/tracking">Suivre ma commande</Link></nav></SheetContent>
        </Sheet>
      </div>
    </div>
  </header>;
}
