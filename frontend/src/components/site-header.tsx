"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Menu, X, ShieldCheck, ArrowUpRight, Phone } from "lucide-react";
import { Link, useRouterState, useNavigate } from "@/lib/router";
import { usePublicSettings } from "@/data/public-store";
import { ImageWithFallback } from "@/components/image-with-fallback";

// ─────────────────────────────────────────────
// HeaderLink
// ─────────────────────────────────────────────
interface HeaderLinkProps {
  to: string;
  label: string;
  onClick?: () => void;
  activeOptions?: { exact?: boolean };
  activeProps?: React.AnchorHTMLAttributes<HTMLAnchorElement>;
  inactiveProps?: React.AnchorHTMLAttributes<HTMLAnchorElement>;
  className?: string;
  children?: React.ReactNode;
}

function HeaderLink({
  to,
  label,
  onClick,
  activeOptions,
  activeProps,
  inactiveProps,
  className,
  children,
}: HeaderLinkProps) {
  const pathname = useRouterState((s) => s.pathname);
  const navigate = useNavigate();

  const [route, anchor] = to.includes("#") ? to.split("#", 2) : [to, null];
  const isAnchorLink = !!anchor;

  const isExact = activeOptions?.exact;
  const isActive = isAnchorLink
    ? false
    : isExact
      ? pathname === route
      : pathname === route || pathname.startsWith(route + "/");

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    onClick?.();

    if (isAnchorLink) {
      if (pathname === "/") {
        const target = document.getElementById(anchor!);
        if (target) {
          target.scrollIntoView({ behavior: "smooth", block: "start" });
          target.focus({ preventScroll: true });
        }
      } else {
        navigate("/");
        setTimeout(() => {
          const target = document.getElementById(anchor!);
          if (target) {
            target.scrollIntoView({ behavior: "smooth", block: "start" });
            target.focus({ preventScroll: true });
          }
        }, 100);
      }
    } else {
      navigate(route);
    }
  };

  const activeClassName = isActive ? activeProps?.className || "" : inactiveProps?.className || "";

  return (
    <a href={to} onClick={handleClick} className={`${className || ""} ${activeClassName}`.trim()}>
      {children ?? label}
    </a>
  );
}

// ─────────────────────────────────────────────
// Button
// ─────────────────────────────────────────────
const Button = ({
  children,
  variant = "default",
  size = "default",
  className = "",
  asChild = false,
  ...props
}: any) => {
  const base =
    "inline-flex items-center justify-center font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50";

  const variants: Record<string, string> = {
    default: "bg-foreground text-background shadow-sm hover:bg-foreground/90 hover:shadow-md",
    accent:
      "bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-md shadow-blue-500/25 hover:shadow-lg hover:shadow-blue-500/35 hover:brightness-110",
    emerald:
      "bg-emerald-600 text-white shadow-md shadow-emerald-600/20 hover:bg-emerald-500 hover:shadow-lg hover:shadow-emerald-500/30",
    outline:
      "border border-border bg-background shadow-sm hover:bg-secondary hover:border-primary/30",
    secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
    ghost: "hover:bg-accent hover:text-accent-foreground",
  };

  const sizes: Record<string, string> = {
    default: "h-9 px-4 py-2 text-sm rounded-full",
    sm: "h-9 rounded-full px-3.5 text-[13px]",
    lg: "h-11 rounded-full px-6 text-sm",
    icon: "h-9 w-9 rounded-full",
  };

  const classNames = `${base} ${variants[variant] || variants.default} ${sizes[size] || sizes.default
    } ${className}`;

  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children, {
      className: `${classNames} ${(children.props as any).className || ""}`.trim(),
      ...props,
    });
  }

  return (
    <button className={classNames} {...props}>
      {children}
    </button>
  );
};

// ─────────────────────────────────────────────
// Navigation data
// ─────────────────────────────────────────────
const linksPrimary = [
  { to: "/", label: "Accueil" },
  { to: "/catalogue", label: "Catalogue" },
  { to: "/#agences", label: "Agences" },
  { to: "/#pourquoi-nous", label: "Pourquoi nous" },
  { to: "/contact", label: "Contact" },
];

const linksMobileMain = [
  { to: "/", label: "Accueil" },
  { to: "/catalogue", label: "Notre catalogue" },
  { to: "/#agences", label: "Nos agences" },
  { to: "/#pourquoi-nous", label: "Pourquoi nous" },
  { to: "/contact", label: "Contact" },
];

// ─────────────────────────────────────────────
// SiteHeader
// ─────────────────────────────────────────────
export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { data: siteSettings } = usePublicSettings();
  const logo = "https://key-group.geant.app/logo.png";
  const siteName = siteSettings?.site_name ?? null;

  const pathname = useRouterState((s) => s.pathname);
  const isHome = pathname === "/";

  // Scroll detection
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Scroll lock quand le menu mobile est ouvert
  useEffect(() => {
    if (open) {
      const scrollY = window.scrollY;
      document.body.style.position = "fixed";
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = "100%";
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.position = "";
        document.body.style.top = "";
        document.body.style.width = "";
        document.body.style.overflow = "";
        window.scrollTo(0, scrollY);
      };
    }
  }, [open]);

  // Fermer sur Escape
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  // Fermer le menu si on passe en desktop
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const handler = (e: MediaQueryListEvent) => {
      if (e.matches) setOpen(false);
    };
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  const closeMenu = useCallback(() => setOpen(false), []);

  // ─── Styles conditionnels (hauteurs réduites) ───
  const headerInnerClass = [
    // Marges haut/bas réduites
    "mx-auto mt-3 mb-2 max-w-7xl sm:mt-3.5 sm:mb-2.5",
    "rounded-[1.5rem] border transition-all duration-500 ease-out",
    isHome
      ? scrolled
        ? "border-border/60 bg-background/85 shadow-[0_8px_30px_-12px_rgba(0,0,0,0.15)] backdrop-blur-xl"
        : "border-white/10 bg-white/5 shadow-[0_8px_30px_-12px_rgba(0,0,0,0.08)] backdrop-blur-md"
      : scrolled
        ? "border-border/60 bg-background/85 shadow-[0_8px_30px_-12px_rgba(0,0,0,0.15)] backdrop-blur-xl"
        : "border-transparent bg-background/70 shadow-[0_8px_30px_-12px_rgba(0,0,0,0.06)] backdrop-blur-md",
  ].join(" ");

  // ⬇️ HAUTEUR RÉDUITE ICI
  const headerContainerClass = [
    "mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 transition-all duration-300 ease-out sm:gap-4 sm:px-5 lg:px-6",
    scrolled ? "h-12 sm:h-13" : "h-14 sm:h-15",
  ].join(" ");

  return (
    <>
      <header className="sticky top-0 z-50 w-full px-3 sm:px-4 lg:px-6">
        <div className={headerInnerClass}>
          <div className={headerContainerClass}>
            {/* Logo */}
            <HeaderLink
              to="/"
              onClick={closeMenu}
              aria-label="Retour à l'accueil"
              className="group relative flex shrink-0 items-center rounded-full outline-none transition-all duration-200 focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              <ImageWithFallback
                src={logo || "/public/logo.png"}
                alt={siteName || "THE KEY-GROUP"}
                width={150}
                height={40}
                loading="eager"
                wrapperClassName="h-6 w-auto sm:h-7 md:h-8 lg:h-9"
                className="h-6 w-auto select-none object-contain transition-transform duration-300 ease-out group-hover:scale-[1.03] sm:h-7 md:h-8 lg:h-9"
              />
            </HeaderLink>

            {/* Nav desktop */}
            <nav className="hidden flex-1 items-center justify-center lg:flex">
              <ul className="flex items-center gap-1 xl:gap-2">
                {linksPrimary.map((l) => (
                  <li key={l.to}>
                    <HeaderLink
                      to={l.to}
                      activeOptions={{ exact: l.to === "/" }}
                      activeProps={{ className: "text-primary bg-primary/8 font-bold" }}
                      inactiveProps={{
                        className:
                          "text-foreground/75 hover:text-foreground hover:bg-secondary/70",
                      }}
                      className="group relative inline-flex items-center whitespace-nowrap rounded-full px-3.5 py-2 text-[13.5px] font-semibold leading-none tracking-[-0.01em] transition-all duration-200"
                    >
                      {l.label}
                    </HeaderLink>
                  </li>
                ))}
              </ul>
            </nav>

            {/* Actions Desktop + Hamburger Mobile */}
            <div className="flex shrink-0 items-center justify-end gap-2.5 sm:gap-3">
              <div className="hidden lg:block">
                <Button
                  asChild
                  variant="emerald"
                  size="sm"
                  className="group h-9 gap-1.5 rounded-full px-4 text-[11px] font-bold tracking-wider"
                >
                  <Link to="/tracking" search={{ code: "" }}>
                    <ShieldCheck className="h-3.5 w-3.5 shrink-0" />
                    <span>Suivre mon véhicule</span>
                    <ArrowUpRight className="h-3 w-3 shrink-0 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </Link>
                </Button>
              </div>

              {/* Hamburger Mobile */}
              <button
                aria-label={open ? "Fermer le menu" : "Ouvrir le menu"}
                aria-expanded={open}
                aria-controls="mobile-menu"
                onClick={() => setOpen((v) => !v)}
                className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-border/60 bg-background/50 text-foreground transition-all duration-200 hover:bg-secondary active:scale-95 lg:hidden"
              >
                <span className="relative block h-4 w-4">
                  <Menu
                    className={`absolute inset-0 h-4 w-4 transition-all duration-300 ${open ? "rotate-90 opacity-0" : "rotate-0 opacity-100"
                      }`}
                    strokeWidth={2.2}
                  />
                  <X
                    className={`absolute inset-0 h-4 w-4 transition-all duration-300 ${open ? "rotate-0 opacity-100" : "-rotate-90 opacity-0"
                      }`}
                    strokeWidth={2.2}
                  />
                </span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* ───── Menu mobile ───── */}
      <div
        id="mobile-menu"
        aria-hidden={!open}
        className={`fixed inset-0 z-40 lg:hidden transition-opacity duration-300 ${open ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
          }`}
      >
        <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={closeMenu} />

        <div
          className={`absolute inset-x-0 top-0 h-[85vh] max-h-[85vh] w-full overflow-y-auto rounded-b-[2rem] border-b border-border/40 bg-background shadow-2xl transition-transform duration-300 ease-in-out ${open ? "translate-y-0" : "-translate-y-full"
            }`}
          style={{ paddingTop: scrolled ? "56px" : "64px" }}
        >
          <div className="flex flex-col px-5 pb-8 pt-6 sm:px-6 sm:pb-10 sm:pt-8">
            <nav className="flex flex-col gap-1">
              {linksMobileMain.map((l) => (
                <HeaderLink
                  key={l.to}
                  to={l.to}
                  onClick={closeMenu}
                  activeProps={{ className: "" }}
                  inactiveProps={{ className: "" }}
                  className="block rounded-2xl px-5 py-4 text-[17px] font-semibold tracking-[-0.01em] text-foreground/90 transition-colors hover:bg-secondary/60 hover:text-foreground active:scale-[0.99] sm:py-5 sm:text-[18px]"
                >
                  {l.label}
                </HeaderLink>
              ))}
            </nav>

            <div className="my-6 h-px bg-gradient-to-r from-transparent via-border to-transparent" />

            <div className="flex flex-col gap-3.5">
              <Button
                asChild
                variant="emerald"
                size="lg"
                className="group h-14 w-full rounded-full px-6 text-[16px] font-semibold tracking-[-0.01em]"
              >
                <Link to="/tracking" onClick={closeMenu}>
                  <span>Suivre le trajet de votre véhicule</span>
                </Link>
              </Button>
            </div>

            <p className="mt-6 text-center text-[12px] font-medium tracking-wide text-muted-foreground/60">
              Réponse sous 24h <span className="mx-1 opacity-60">•</span> Sans engagement
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

export default SiteHeader;