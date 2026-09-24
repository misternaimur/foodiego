import { Navbar } from "@/components/Share/Navbar";
import Hero from "@/components/Hero";
import CloudKitchens from "@/components/CloudKitchens";
import WhatAreYouCraving from "@/components/WhatAreYouCraving";
import PickedForYouSection from "@/components/PickedForYouSection";
import SpecialOffers from "@/components/SpecialOffers";
import AIRecommendation from "@/components/AIRecommendation";
import HowItWorksSection from "@/components/HowItWorks";
import FAQSection from "@/components/FAQ";
import Footer from "@/components/Share/Footer";
import AIAssistantWidget from "@/components/AIAssistantWidget";
import { getOptionalSession } from "@/lib/dal";
import AppLoader from "@/components/AppLoader";
import LandingReveal, { LandingPageShell } from "@/components/Share/LandingReveal";


export default async function Home() {
  const session = await getOptionalSession();

  return (
    <AppLoader>
      <LandingPageShell>
        <main className="flex-1 bg-[#FAF7EE]" suppressHydrationWarning>
          <Navbar user={session ? { name: session.name, role: session.role, avatarUrl: session.avatarUrl } : null} />
          <LandingReveal className="landing-reveal-hero"><Hero /></LandingReveal>
          <LandingReveal><WhatAreYouCraving /></LandingReveal>
          <LandingReveal delay={0.04}><PickedForYouSection /></LandingReveal>
          <LandingReveal delay={0.04}><CloudKitchens /></LandingReveal>
          <LandingReveal delay={0.04}><SpecialOffers /></LandingReveal>
          <LandingReveal delay={0.04}><AIRecommendation /></LandingReveal>
          <LandingReveal delay={0.04}><HowItWorksSection /></LandingReveal>
          <LandingReveal delay={0.04}><FAQSection /></LandingReveal>
          <LandingReveal delay={0.04}><Footer /></LandingReveal>
          <AIAssistantWidget />
        </main>
      </LandingPageShell>
    </AppLoader>
  );
}