import Hero from "@/components/Hero";
import HowItWorksSection from "@/components/HowItWorks";
import PickedForYouSection from "@/components/PickedForYouSection";
import WhatAreYouCraving from "@/components/WhatAreYouCraving";
import { Navbar } from "@/components/Share/Navbar";
import Footer from "@/components/Share/Footer";
import { getOptionalSession } from "@/lib/dal";
import FAQSection from "@/components/FAQ";

const session = await getOptionalSession();

export default function Home() {
  return (
    <main className="flex-1 bg-amber-50 " suppressHydrationWarning>
     <Navbar user={session ? { name: session.name } : null} />
      <Hero />
      <WhatAreYouCraving />
      <PickedForYouSection />
      <FAQSection></FAQSection>
      <HowItWorksSection></HowItWorksSection>
      <Footer></Footer>
    </main>
  );
}