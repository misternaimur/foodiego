import Hero from "@/components/Hero";
import WhatAreYouCraving from "@/components/WhatAreYouCraving";

export default function Home() {
  return (
    <main className="flex-1">
      <Hero></Hero>
      <WhatAreYouCraving></WhatAreYouCraving>
    </main>
  );
}