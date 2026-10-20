"use client";

import {
  ArrowUpRight,
  Facebook,
  Instagram,
  Linkedin,
  MessageCircle,
  Music2,
  Send,
  Share2,
  Twitter,
  Youtube,
} from "lucide-react";
import { usePublicSettings } from "@/data/public-store";
import type { TrustBadge } from "@/data/home-data";

type SocialIcon = React.ElementType;

const SOCIAL_PRESENTATION: Record<
  string,
  { icon: SocialIcon; ctaText: string; brandColor: string; bgGlow: string }
> = {
  facebook: { icon: Facebook, ctaText: "Rejoindre", brandColor: "text-[#1877F2]", bgGlow: "bg-[#1877F2]/10" },
  instagram: { icon: Instagram, ctaText: "Suivre", brandColor: "text-[#E1306C]", bgGlow: "bg-[#E1306C]/10" },
  whatsapp: { icon: MessageCircle, ctaText: "Discuter", brandColor: "text-[#25D366]", bgGlow: "bg-[#25D366]/10" },
  linkedin: { icon: Linkedin, ctaText: "Suivre", brandColor: "text-[#0A66C2]", bgGlow: "bg-[#0A66C2]/10" },
  x: { icon: Twitter, ctaText: "Suivre", brandColor: "text-zinc-900", bgGlow: "bg-zinc-900/10" },
  tiktok: { icon: Music2, ctaText: "Suivre", brandColor: "text-zinc-900", bgGlow: "bg-zinc-900/10" },
  youtube: { icon: Youtube, ctaText: "S'abonner", brandColor: "text-[#FF0000]", bgGlow: "bg-[#FF0000]/10" },
  telegram: { icon: Send, ctaText: "Rejoindre", brandColor: "text-[#0088cc]", bgGlow: "bg-[#0088cc]/10" },
};

const DEFAULT_PRESENTATION = {
  icon: Share2,
  ctaText: "Ouvrir",
  brandColor: "text-zinc-700",
  bgGlow: "bg-zinc-700/10",
};

const socialKey = (platform: string): string => {
  const normalized = platform.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
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
    return segment ? `@${segment}` : host;
  } catch {
    return url;
  }
};

const gridColsClass = (count: number): string => {
  if (count <= 1) return "grid-cols-1";
  if (count === 2) return "grid-cols-1 sm:grid-cols-2";
  if (count === 3) return "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3";
  return "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4";
};

interface SocialCommunitySectionProps {
  trustBadges?: TrustBadge[];
}

export function SocialCommunitySection({ trustBadges = [] }: SocialCommunitySectionProps) {
  const { data: settings, isLoading, isError } = usePublicSettings();

  const channels = (settings?.socials ?? [])
    .filter((entry): entry is { platform: string; url: string } => Boolean(entry?.url))
    .map((entry) => {
      const key = socialKey(entry.platform);
      const { icon, ctaText, brandColor, bgGlow } = SOCIAL_PRESENTATION[key] ?? DEFAULT_PRESENTATION;
      return {
        id: `${key}-${entry.url}`,
        name: entry.platform,
        handle: socialHandle(entry.url),
        icon,
        ctaText,
        brandColor,
        bgGlow,
        url: entry.url,
      };
    });

  const isEmpty = !isLoading && !isError && channels.length === 0;

  return (
    <section className="relative bg-white py-24 lg:py-32 border-t border-zinc-200 overflow-hidden">

      {/* Grille de fond très subtile */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />

      <style dangerouslySetInnerHTML={{
        __html: `
        @keyframes fadeInUpSocial {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animated-social-card {
          opacity: 0;
          animation: fadeInUpSocial 0.7s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}} />

      <div className="relative mx-auto max-w-7xl px-4 lg:px-8">

        {/* En-tête */}
        <div className="mb-16 sm:mb-20 text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-white px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-zinc-600 shadow-sm mb-6">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
            06 — Communauté & Contact
          </span>
          <h2 className="font-display text-4xl font-black leading-[1.1] tracking-tight text-zinc-900 sm:text-5xl md:text-6xl">
            Restons connectés sur vos réseaux préférés
          </h2>
          <p className="mt-6 mx-auto max-w-2xl text-lg leading-relaxed text-zinc-500">
            Témoignages vidéos, arrivages en direct et assistance rapide via nos canaux officiels.
          </p>
        </div>

        {/* Grille */}
        <div className={`grid gap-5 ${gridColsClass(channels.length || 4)}`}>
          {isLoading &&
            [0, 1, 2, 3].map((slot) => (
              <div key={slot} className="h-64 animate-pulse rounded-3xl border border-zinc-200 bg-zinc-50" />
            ))}

          {isError && (
            <p className="col-span-full rounded-3xl border border-dashed border-zinc-300 bg-zinc-50 px-6 py-12 text-center text-sm text-zinc-600">
              Nos canaux sont momentanément indisponibles. Écrivez-nous via la page{" "}
              <a href="/contact" className="font-semibold text-emerald-600 underline">Contact</a>.
            </p>
          )}

          {isEmpty && (
            <p className="col-span-full rounded-3xl border border-dashed border-zinc-300 bg-zinc-50 px-6 py-12 text-center text-sm text-zinc-600">
              Aucun réseau social n'est encore publié.
            </p>
          )}

          {channels.map((channel, index) => {
            const ChannelIcon = channel.icon;
            return (
              <a
                key={channel.id}
                href={channel.url}
                target="_blank"
                rel="noopener noreferrer"
                className="animated-social-card group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-zinc-200 bg-white p-6 transition-all duration-500 hover:-translate-y-1.5 hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)] hover:border-emerald-600/30"
                style={{ animationDelay: `${index * 80}ms` }}
              >
                {/* Lueur subtile au survol */}
                <div className={`absolute -right-16 -top-16 h-40 w-40 rounded-full blur-3xl transition-all duration-700 opacity-0 group-hover:opacity-100 ${channel.bgGlow}`} />

                <div className="relative z-10">
                  {/* Icône */}
                  <div className={`flex h-14 w-14 items-center justify-center rounded-2xl bg-zinc-50 border border-zinc-100 transition-all duration-500 group-hover:scale-110 group-hover:rotate-3 group-hover:bg-white group-hover:shadow-lg ${channel.brandColor}`}>
                    <ChannelIcon className="h-7 w-7" strokeWidth={1.8} />
                  </div>

                  {/* Titre & Handle */}
                  <div className="mt-6">
                    <h3 className="font-display text-xl font-bold text-zinc-900 group-hover:text-emerald-600 transition-colors">
                      {channel.name}
                    </h3>
                    <p className="text-sm font-medium text-zinc-500 mt-1">{channel.handle}</p>
                  </div>
                </div>

                {/* Footer / CTA */}
                <div className="relative z-10 mt-8 pt-5 border-t border-zinc-100 flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-widest text-zinc-400 group-hover:text-emerald-600 transition-colors">
                    {channel.ctaText}
                  </span>
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-zinc-50 text-zinc-600 border border-zinc-100 transition-all duration-500 group-hover:bg-emerald-600 group-hover:text-white group-hover:border-emerald-600 group-hover:rotate-45">
                    <ArrowUpRight className="h-4 w-4" strokeWidth={2.5} />
                  </div>
                </div>
              </a>
            );
          })}
        </div>

        {/* Badges de réassurance */}
        {trustBadges.length > 0 && (
          <div className="mt-20 grid gap-6 rounded-3xl border border-zinc-200 bg-white/80 backdrop-blur-sm p-8 shadow-sm sm:grid-cols-3">
            {trustBadges.map((b) => (
              <div key={b.label} className="flex items-center gap-4 border-zinc-200 sm:border-r sm:pr-6 sm:last:border-r-0">
                <span className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl border border-zinc-100 bg-zinc-50 text-emerald-600">
                  <b.icon className="h-7 w-7" strokeWidth={2} />
                </span>
                <div>
                  <p className="font-display text-xl font-black text-zinc-900">{b.value}</p>
                  <p className="font-display text-xs font-bold uppercase tracking-widest text-zinc-500 mt-0.5">{b.label}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}