import Hero from "@/components/Hero";
import HungryCTA from "@/components/HungryCTA";
import WhatAreYouCraving from "@/components/WhatAreYouCraving";

export default function Home() {
  return (
    <main className="flex-1">
      <Hero></Hero>
      <HungryCTA />
      <WhatAreYouCraving></WhatAreYouCraving>
    </main>
  );
}