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
      <body className="min-h-full flex flex-col overflow-x-clip" suppressHydrationWarning>
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}