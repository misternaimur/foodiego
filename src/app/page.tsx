import Hero from "@/components/Hero";
import PickedForYouSection from "@/components/PickedForYouSection";
import WhatAreYouCraving from "@/components/WhatAreYouCraving";

export default function Home() {
  return (
    <main className="flex-1">
      <Hero />
      <WhatAreYouCraving />
      <PickedForYouSection />
    </main>
  );
}