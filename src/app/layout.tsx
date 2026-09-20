import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Providers from "@/components/Providers";
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
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased overflow-x-hidden`}
      suppressHydrationWarning
    >
      {/* UPDATE (responsive fix): off-canvas panels (the mobile nav drawer
          and the cart drawer, both in Navbar.tsx) are positioned fully
          off-screen with a transform when closed, but a transformed fixed
          element can still widen the page's scrollable area in some
          browsers unless an ancestor clips horizontal overflow — this was
          causing every page to horizontally scroll ~1 drawer-width past
          the real content on mobile. */}
      <body className="min-h-full flex flex-col overflow-x-hidden" suppressHydrationWarning>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}