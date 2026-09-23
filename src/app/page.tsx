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


export default async function Home() {
  const session = await getOptionalSession();

  return ( <AppLoader>
    <main className="flex-1 bg-[#FAF7EE]" suppressHydrationWarning>
      <Navbar user={session ? { name: session.name, role: session.role } : null} />
      <Hero />
      <WhatAreYouCraving />
      <PickedForYouSection />
      <CloudKitchens />
      <SpecialOffers />
      <AIRecommendation />
      <HowItWorksSection />
      <FAQSection />
      <Footer />
      <AIAssistantWidget />
    </main>
  </AppLoader>
  );
}