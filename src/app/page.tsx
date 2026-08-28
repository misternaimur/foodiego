import Hero from "@/components/Hero";
import HowItWorksSection from "@/components/HowItWorks";
import PickedForYouSection from "@/components/PickedForYouSection";
import WhatAreYouCraving from "@/components/WhatAreYouCraving";

export default function Home() {
  return (
    <main className="flex-1 bg-amber-50">
      <Hero />
      <WhatAreYouCraving />
      <PickedForYouSection />
      <HowItWorksSection></HowItWorksSection>
    </main>
  );
}