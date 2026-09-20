import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowLeft,
  Compass,
  Home,
  Sparkles,
  UtensilsCrossed,
} from "lucide-react";
import { Navbar } from "@/components/Share/Navbar";
import Footer from "@/components/Share/Footer";
import AIAssistantWidget from "@/components/AIAssistantWidget";
import { getOptionalSession } from "@/lib/dal";

export const metadata: Metadata = {
  title: "Page not found | Foodiego",
  description:
    "That page has gone missing. Browse restaurants, offers and more instead.",
};

// Public routes only — anything under /client, /vendor, /admin or /rider is
// auth-gated, so linking there from a 404 would just bounce the visitor to login.
const suggestions = [
  { href: "/restaurants", label: "Restaurants", icon: UtensilsCrossed },
  { href: "/offers", label: "Offers", icon: Sparkles },
  { href: "/foods", label: "Browse foods", icon: Compass },
];

/**
 * app/not-found.tsx — the root not-found file. As well as catching notFound()
 * calls, this handles any URL that matches no route in the whole app.
 *
 * It renders inside the ROOT layout, which only provides <html>, <body> and the
 * app providers — the navbar and footer live in the (public)/(main) route-group
 * layouts and so are not applied here. They are rendered explicitly below to
 * keep the page visually identical to the rest of the site.
 */
export default async function NotFound() {
  const session = await getOptionalSession();

  return (
    <>
      <Navbar
        user={session ? { name: session.name, role: session.role } : null}
      />

      <main className="relative flex flex-1 items-center justify-center overflow-hidden px-4 py-20 sm:py-24">
        {/* Decorative washes, matching the hero and other section backgrounds.
            The 300/400 tones stay light in dark mode by design, so they read as
            ambient glow on either theme. */}
        <div
          className="pointer-events-none absolute -top-24 -left-24 h-72 w-72 rounded-full bg-emerald-300/20 blur-3xl"
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute -bottom-28 -right-24 h-80 w-80 rounded-full bg-[#F49D37]/20 blur-3xl"
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute top-1/3 right-1/4 h-56 w-56 rounded-full bg-purple-300/15 blur-3xl"
          aria-hidden="true"
        />

        <div className="animate-fade-slide-in relative z-10 mx-auto w-full max-w-2xl text-center">
          {/* Pill tag */}
          <div className="mb-5 inline-flex items-center justify-center rounded-full bg-emerald-400 px-4 py-1.5 shadow-sm">
            <span className="text-[11px] font-extrabold uppercase tracking-widest text-[#123B27]">
              Error 404
            </span>
          </div>

          {/* Oversized status code in the brand's green / amber */}
          <p className="text-[80px] font-black leading-none tracking-tight sm:text-[120px]">
            <span className="text-[#124734]">4</span>
            <span className="text-[#F6A429]">0</span>
            <span className="text-[#124734]">4</span>
          </p>

          <h1 className="mt-3 text-2xl font-bold tracking-tight text-[#124734] sm:text-3xl lg:text-4xl">
            We couldn&apos;t find that page
          </h1>

          <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-slate-500 sm:text-base">
            The link may be broken, or the page may have been moved. Let&apos;s
            get you back to something delicious.
          </p>

          {/* Primary actions */}
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
            <Link
              href="/"
              className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#F6A429] px-7 py-3 font-semibold text-gray-900 shadow-md transition-all duration-200 hover:bg-[#e0931f] sm:w-auto"
            >
              <Home className="h-4 w-4" />
              Back to home
            </Link>

            <Link
              href="/restaurants"
              className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#124734] px-7 py-3 font-semibold text-white shadow-md transition-all duration-200 hover:bg-[#1a5c3a] sm:w-auto"
            >
              <UtensilsCrossed className="h-4 w-4" />
              Browse restaurants
            </Link>
          </div>

          {/* Helpful destinations */}
          <div className="mt-10 border-t border-[#E8E2D5] pt-6">
            <p className="text-xs font-extrabold uppercase tracking-[0.15em] text-[#F49D37]">
              Popular destinations
            </p>

            <div className="mt-4 flex flex-wrap items-center justify-center gap-2.5">
              {suggestions.map(({ href, label, icon: Icon }) => (
                <Link
                  key={href}
                  href={href}
                  className="inline-flex items-center gap-2 rounded-full border border-[#E8E2D5] bg-white/70 px-4 py-2 text-sm font-semibold text-[#374151] transition-colors duration-200 hover:border-[#124734]/30 hover:text-[#124734]"
                >
                  <Icon className="h-4 w-4" />
                  {label}
                </Link>
              ))}
            </div>

            <p className="mt-6 inline-flex items-center gap-1.5 text-sm text-slate-500">
              <ArrowLeft className="h-4 w-4" />
              Or press the back button to return to the previous page.
            </p>
          </div>
        </div>
      </main>

      <Footer />
      <AIAssistantWidget />
    </>
  );
}
