import { Navbar } from "@/components/Share/Navbar";
import Hero from "@/components/Hero";
import WhatAreYouCraving from "@/components/WhatAreYouCraving";
import PickedForYouSection from "@/components/PickedForYouSection";
import SpecialOffers from "@/components/SpecialOffers";
import AIRecommendation from "@/components/AIRecommendation";
import HowItWorksSection from "@/components/HowItWorks";
import FAQSection from "@/components/FAQ";
import Footer from "@/components/Share/Footer";
import AIAssistantWidget from "@/components/AIAssistantWidget";
import { getOptionalSession } from "@/lib/dal";




export default async function Home() {
  const session = await getOptionalSession();

  return (
    <main className="flex-1 bg-gradient-to-br from-green-100 via-purple-50 to-emerald-100" suppressHydrationWarning>
      <Navbar user={session ? { name: session.name, role: session.role } : null} />
      <Hero />
      <WhatAreYouCraving />
      <PickedForYouSection />
      <SpecialOffers />
      <AIRecommendation />
      <HowItWorksSection />
      <FAQSection />
      <Footer />
      <AIAssistantWidget />
    </main>
  );
}