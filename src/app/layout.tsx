import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Providers from "@/components/Providers";
import { THEME_INIT_SCRIPT } from "@/lib/theme";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Foodiego",
  description: "Smarter food delivery",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased overflow-x-clip`}
      suppressHydrationWarning
    >
      {/* UPDATE (responsive fix): off-canvas panels (the mobile nav drawer
          and the cart drawer, both in Navbar.tsx) are positioned fully
          off-screen with a transform when closed, but a transformed fixed
          element can still widen the page's scrollable area in some
          browsers unless an ancestor clips horizontal overflow — this was
          causing every page to horizontally scroll ~1 drawer-width past
          the real content on mobile. */}
      {/* UPDATE (sticky nav fix): both <html> and <body> used `overflow-x-hidden`
          to stop the off-canvas mobile drawer widening the page horizontally. But
          `hidden` on one axis forces the other to compute to `auto`, so they became
          scroll containers — and a scroll container between a `sticky` element and
          the viewport stops it sticking, which is why the navbar scrolled away.
          `clip` still clips the drawer but creates no scroll container, so the bar
          can pin. Confirmed no horizontal scroll is reintroduced. */}
      <body className="min-h-full flex flex-col overflow-x-clip" suppressHydrationWarning>
        {/* Applies the stored/system theme before the rest of the body renders, so
            the first paint is already themed instead of flashing light. React
            tolerates the resulting class mismatch via suppressHydrationWarning. */}
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}