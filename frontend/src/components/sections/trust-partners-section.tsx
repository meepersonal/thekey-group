import type { TrustPartner } from "@/data/home-data";

interface TrustPartnersSectionProps {
  partners: TrustPartner[];
}

export function TrustPartnersSection({ partners }: TrustPartnersSectionProps) {
  const items = [...partners, ...partners];

  return (
    <section className="border-y border-border/60 bg-secondary/30">
      <div className="mx-auto max-w-7xl px-4 py-10 lg:px-8 lg:py-12">
        <div>
          <div className="text-center">
            <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-muted-foreground">
              Nos partenaires de confiance
            </p>
            <h2 className="mt-2 font-display text-xl font-extrabold tracking-tight sm:text-2xl">
              Un accompagnement complet, à chaque étape
            </h2>
          </div>

          <div className="relative mt-8 overflow-hidden">
            <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-secondary/30 to-transparent" />
            <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-secondary/30 to-transparent" />

            <div
              className="flex w-max animate-marquee gap-5 px-6"
              style={{ animationDuration: "60s" }}
            >
              {items.map((partner, index) => (
                <div
                  key={`${partner.title}-${index}`}
                  className="group flex w-[300px] shrink-0 flex-col items-start rounded-2xl border border-border bg-background p-6 shadow-[inset_0_1px_0_rgba(255,255,255,0.06),inset_0_-1px_0_rgba(0,0,0,0.08),0_1px_2px_rgba(0,0,0,0.04)] transition-all duration-300 hover:-translate-y-1 hover:border-foreground/20 hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.08),inset_0_-1px_0_rgba(0,0,0,0.1),0_8px_24px_rgba(0,0,0,0.08)] sm:w-[340px]"
                >
                  <span className="grid h-12 w-12 place-items-center rounded-xl border border-border/80 bg-secondary text-foreground shadow-[inset_0_1px_0_rgba(255,255,255,0.05),inset_0_-1px_0_rgba(0,0,0,0.06)] transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                    <partner.icon className="h-5 w-5" strokeWidth={2} />
                  </span>

                  <h3 className="mt-5 font-display text-base font-bold leading-tight text-foreground">
                    {partner.title}
                  </h3>

                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {partner.description}
                  </p>

                  <span className="mt-4 inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/70">
                    <span className="h-1 w-1 rounded-full bg-emerald-500" />
                    {partner.tag}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
