"use client";

import {
  ArrowUpRight,
  Facebook,
  Globe2,
  Instagram,
  Linkedin,
  Loader2,
  MessageCircle,
  Music2,
  Send,
  Share2,
  Twitter,
  Youtube,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { usePublicSettings } from "@/data/public-store";
import type { TrustBadge } from "@/data/home-data";

type SocialIcon = React.ElementType;

const SOCIAL_PRESENTATION: Record<
  string,
  { icon: SocialIcon; colorClass: string; bgGlow: string; ctaText: string }
> = {
  facebook: {
    icon: Facebook,
    colorClass: "from-blue-600 to-blue-800 text-white",
    bgGlow: "bg-blue-500/10",
    ctaText: "Rejoindre",
  },
  instagram: {
    icon: Instagram,
    colorClass: "from-purple-600 via-pink-600 to-amber-500 text-white",
    bgGlow: "bg-purple-500/10",
    ctaText: "Suivre",
  },
  whatsapp: {
    icon: MessageCircle,
    colorClass: "from-emerald-500 to-emerald-700 text-white",
    bgGlow: "bg-emerald-500/10",
    ctaText: "Discuter",
  },
  linkedin: {
    icon: Linkedin,
    colorClass: "from-sky-700 to-sky-900 text-white",
    bgGlow: "bg-sky-500/10",
    ctaText: "Suivre",
  },
  x: {
    icon: Twitter,
    colorClass: "from-zinc-800 to-zinc-950 text-white",
    bgGlow: "bg-zinc-500/10",
    ctaText: "Suivre",
  },
  tiktok: {
    icon: Music2,
    colorClass: "from-zinc-900 to-black text-white",
    bgGlow: "bg-pink-500/10",
    ctaText: "Suivre",
  },
  youtube: {
    icon: Youtube,
    colorClass: "from-red-600 to-red-800 text-white",
    bgGlow: "bg-red-500/10",
    ctaText: "S'abonner",
  },
  telegram: {
    icon: Send,
    colorClass: "from-sky-500 to-sky-700 text-white",
    bgGlow: "bg-sky-400/10",
    ctaText: "Rejoindre",
  },
};

const DEFAULT_PRESENTATION = {
  icon: Share2,
  colorClass: "from-zinc-700 to-zinc-900 text-white",
  bgGlow: "bg-zinc-500/10",
  ctaText: "Ouvrir",
};

/** Résout la clé de la carte à partir du libellé saisi dans l'administration. */
const socialKey = (platform: string): string => {
  const normalized = platform
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");

  const [firstWord = ""] = normalized.split(/[^a-z0-9]+/).filter(Boolean);
  return firstWord;
};

const socialHandle = (url: string) => {
  try {
    const { hostname, pathname } = new URL(url);
    const host = hostname.replace(/^www\./, "");
    const segment = pathname.split("/").filter(Boolean).pop() ?? "";
    if (host.includes("wa.me") || host.includes("whatsapp")) {
      return `+${segment.replace(/\D/g, "")}`;
    }
    return segment ? `${host}/${segment}` : host;
  } catch {
    return url;
  }
};

interface SocialCommunitySectionProps {
  trustBadges?: TrustBadge[];
}

export function SocialCommunitySection({ trustBadges = [] }: SocialCommunitySectionProps) {
  const { data: settings, isLoading, isError } = usePublicSettings();

  // Canaux pilotés par l'administration : Paramètres → Contact → Réseaux sociaux.
  const channels = (settings?.socials ?? [])
    .filter((entry): entry is { platform: string; url: string } => Boolean(entry?.url))
    .map((entry) => {
      const key = socialKey(entry.platform);
      const { icon, colorClass, bgGlow, ctaText } =
        SOCIAL_PRESENTATION[key] ?? DEFAULT_PRESENTATION;
      return {
        id: `${key}-${entry.url}`,
        name: entry.platform,
        handle: socialHandle(entry.url),
        icon,
        colorClass,
        bgGlow,
        ctaText,
        url: entry.url,
      };
    });

  const isEmpty = !isLoading && !isError && channels.length === 0;

  return (
    <section className="relative overflow-hidden border-t border-zinc-200/80 bg-white py-20 text-zinc-900 lg:py-28">
      {/* Halo d'ambiance discret en arrière-plan */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-0 -z-10 h-[500px] w-[600px] -translate-x-1/2 rounded-full bg-primary/5 blur-[150px]"
      />

      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        {/* ─── En-tête ─── */}
        <div className="mx-auto max-w-2xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5 font-display text-xs font-bold uppercase tracking-widest text-primary">
            Communauté &amp; Contact
          </span>

          <h2 className="mt-4 font-display text-3xl font-black leading-[1.15] tracking-tight text-zinc-900 sm:text-4xl lg:text-5xl">
            Restons connectés sur vos{" "}
            <span className="bg-gradient-to-r from-zinc-900 via-zinc-800 to-primary bg-clip-text text-transparent">
              réseaux préférés.
            </span>
          </h2>

          <p className="mt-4 font-display text-base leading-relaxed text-zinc-600 sm:text-lg font-medium">
            Témoignages vidéos, arrivages en direct et assistance rapide via nos canaux officiels.
          </p>
        </div>

        {/* ─── Grille des cartes réseaux sociaux ─── */}
        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {isLoading &&
            [0, 1, 2, 3].map((slot) => (
              <div
                key={slot}
                className="h-72 animate-pulse rounded-3xl border border-zinc-200/80 bg-zinc-50/70"
              />
            ))}

          {isError && (
            <p className="col-span-full rounded-3xl border border-dashed border-zinc-300 bg-zinc-50/70 px-6 py-12 text-center text-sm text-zinc-600">
              Nos canaux sont momentanément indisponibles. Vous pouvez nous écrire directement via
              la page{" "}
              <a href="/contact" className="font-semibold underline">
                Contact
              </a>
              .
            </p>
          )}

          {isEmpty && (
            <p className="col-span-full rounded-3xl border border-dashed border-zinc-300 bg-zinc-50/70 px-6 py-12 text-center text-sm text-zinc-600">
              Aucun réseau social n&apos;est encore publié. Ajoutez-les depuis
              l&apos;administration, rubrique Paramètres → Contact → Réseaux sociaux.
            </p>
          )}

          {channels.map((channel) => {
            const ChannelIcon = channel.icon;
            return (
              <div
                key={channel.id}
                className="group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-zinc-200/80 bg-zinc-50/70 p-6 transition duration-300 hover:-translate-y-1 hover:border-primary/40 hover:bg-white hover:shadow-xl hover:shadow-zinc-200/60"
              >
                {/* Effet d'éclat discret au survol */}
                <div
                  aria-hidden="true"
                  className={`pointer-events-none absolute -right-12 -top-12 h-36 w-36 rounded-full transition duration-500 group-hover:scale-150 ${channel.bgGlow}`}
                />

                <div>
                  {/* En-tête carte : Icône + Badge */}
                  <div className="flex items-center justify-between gap-2">
                    <div
                      className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br shadow-sm ${channel.colorClass}`}
                    >
                      <ChannelIcon className="h-5 w-5" />
                    </div>

                    <span className="rounded-full border border-zinc-200 bg-white px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-zinc-700 shadow-2xs">
                      {channel.ctaText}
                    </span>
                  </div>

                  <div className="mt-4">
                    <h3 className="font-display text-lg font-bold text-zinc-900">{channel.name}</h3>
                    <p className="text-xs font-medium text-zinc-500">{channel.handle}</p>
                  </div>

                  <p className="mt-4 truncate text-xs leading-relaxed text-zinc-600 font-medium">
                    {channel.url}
                  </p>
                </div>

                {/* Bouton d'action */}
                <div className="mt-6 border-t border-zinc-200/80 pt-4">
                  <Button
                    asChild
                    className="w-full h-10 rounded-xl font-display font-bold border-zinc-300 bg-white text-zinc-900 transition duration-300 group-hover:border-primary group-hover:bg-primary group-hover:text-black shadow-xs"
                    variant="outline"
                  >
                    <a
                      href={channel.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-1.5 text-[11px] font-extrabold uppercase tracking-wider"
                    >
                      <span>{channel.ctaText}</span>
                      <ArrowUpRight className="h-3.5 w-3.5 shrink-0 transition duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </a>
                  </Button>
                </div>
              </div>
            );
          })}
        </div>

        {/* ─── Badges de réassurance ─── */}
        {trustBadges.length > 0 && (
          <div className="mt-16 grid gap-6 rounded-3xl border border-zinc-200/80 bg-zinc-50/80 p-6 shadow-xs sm:grid-cols-3">
            {trustBadges.map((b) => (
              <div
                key={b.label}
                className="flex items-center gap-4 border-zinc-200/80 sm:border-r sm:last:border-r-0 sm:pr-4"
              >
                <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl border border-zinc-200 bg-white text-primary shadow-2xs">
                  <b.icon className="h-6 w-6" strokeWidth={2} />
                </span>
                <div>
                  <p className="font-display text-lg font-extrabold text-zinc-900">{b.value}</p>
                  <p className="font-display text-xs uppercase tracking-wider text-zinc-500 font-bold">
                    {b.label}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
