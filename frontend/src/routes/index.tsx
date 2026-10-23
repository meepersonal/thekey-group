import { WHY_US, WHY_CHINESE, TESTIMONIALS, TRUST_BADGES, TRUST_PARTNERS } from "@/data/home-data";
import { HeroSection } from "@/components/sections/hero-section";
import { PartnersSection } from "@/components/sections/partners-section";
import { TrustPartnersSection } from "@/components/sections/trust-partners-section";
import { WhyChineseSection } from "@/components/sections/why-chinese-section";
import { VideoSection } from "@/components/sections/video-section";
import { WhyUsSection } from "@/components/sections/why-us-section";
import { FeaturedVehiclesSection } from "@/components/sections/featured-vehicles-section";
import { SocialCommunitySection } from "@/components/sections/testimonials-section";
import { AgenciesSection } from "@/components/sections/agencies-section";
import { CtaSection } from "@/components/sections/cta-section";

export function Index() {
  return (
    <div>
      <HeroSection />
      <PartnersSection />
      {/* <TrustPartnersSection partners={TRUST_PARTNERS} /> */}
      <FeaturedVehiclesSection />
      {/* <WhyChineseSection items={WHY_CHINESE} /> */}
      <VideoSection />
      <WhyUsSection items={WHY_US} />
      <AgenciesSection />
      <SocialCommunitySection />
      <CtaSection />
    </div>
  );
}
