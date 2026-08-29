import Hero from "@/components/Hero";
import HowItWorksSection from "@/components/HowItWorks";
import PickedForYouSection from "@/components/PickedForYouSection";
import WhatAreYouCraving from "@/components/WhatAreYouCraving";
import FAQSection from "@/components/FAQ";
export default function Home() {
  return (
    <main className="flex-1 bg-amber-50 " suppressHydrationWarning>
      <Hero />
      <WhatAreYouCraving />
      <PickedForYouSection />
      <FAQSection></FAQSection>
      <HowItWorksSection></HowItWorksSection>
    </main>
  );
}