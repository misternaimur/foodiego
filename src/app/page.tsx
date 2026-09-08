import Hero from "@/components/Hero";
import HowItWorksSection from "@/components/HowItWorks";
import PickedForYouSection from "@/components/PickedForYouSection";
import WhatAreYouCraving from "@/components/WhatAreYouCraving";
import { Navbar } from "@/components/Share/Navbar";
import Footer from "@/components/Share/Footer";
import { getOptionalSession } from "@/lib/dal";
import FAQSection from "@/components/FAQ";

export default async function Home() {
  const session = await getOptionalSession();

  return (
    <main className="flex-1 bg-amber-50" suppressHydrationWarning>
      <Navbar user={session ? { name: session.name, role: session.role } : null} />
      <Hero />
      <WhatAreYouCraving />
      <PickedForYouSection />
      <FAQSection />
      <HowItWorksSection />
      <Footer />
    </main>
  );
}