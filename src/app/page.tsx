import Hero from "@/components/Hero";
import HungryCTA from "@/components/HungryCTA";
import PickedForYouSection from "@/components/PickedForYouSection";
import WhatAreYouCraving from "@/components/WhatAreYouCraving";

export default function Home() {
  return (
    <main className="flex-1">
      <Hero></Hero>
      <WhatAreYouCraving></WhatAreYouCraving>
      <PickedForYouSection></PickedForYouSection>
      <HungryCTA></HungryCTA>
    </main>
  );
}

