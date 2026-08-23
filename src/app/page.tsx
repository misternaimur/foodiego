import Hero from "@/components/Hero";
import HungryCTA from "@/components/HungryCTA";
import NotSure from "@/components/NotSure";
import WhatAreYouCraving from "@/components/WhatAreYouCraving";

export default function Home() {
  return (
    <main className="flex-1">
      <Hero></Hero>
      <NotSure></NotSure>
      <HungryCTA />
      <WhatAreYouCraving></WhatAreYouCraving>
    </main>
  );
}