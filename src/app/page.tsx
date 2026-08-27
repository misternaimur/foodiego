import Hero from "@/components/Hero";
import HungryCTA from "@/components/HungryCTA";
import NotSure from "@/components/NotSure";
import PickedForYouSection from "@/components/PickedForYouSection";
import WhatAreYouCraving from "@/components/WhatAreYouCraving";

export default function Home() {
  return (
    <main className="flex-1">
      <Hero />
      <NotSure />
      <HungryCTA />
      <WhatAreYouCraving />
      <PickedForYouSection />
    </main>
  );
}