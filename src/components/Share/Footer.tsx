'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ArrowUpRight, Mail, Share2, Sparkles } from 'lucide-react';
import Logo from './LogoWhite';

export interface FooterLink {
  label: string;
  href: string;
}

export interface FooterColumn {
  title: string;
  links: FooterLink[];
}

export interface FooterProps {
  columns?: FooterColumn[];
  copyrightText?: string;
}

const defaultColumns: FooterColumn[] = [
  {
    title: 'FOODIEGO',
    links: [
      { label: 'About Us', href: '/about' },
      { label: 'Careers', href: '/careers' },
      { label: 'Blog', href: '/blog' },
      { label: 'Sustainability', href: '/sustainability' },
    ],
  },
  {
    title: 'FOR PARTNERS',
    links: [
      { label: 'Add your restaurant', href: '/auth/register/restaurant' },
      { label: 'Sign up to deliver', href: '/auth/register/rider' },
      { label: 'Business Account', href: '/auth/register' },
    ],
  },
  {
    title: 'LEGAL',
    links: [
      { label: 'Terms of Service', href: '/terms' },
      { label: 'Privacy Policy', href: '/privacy' },
      { label: 'Cookie Policy', href: '/cookies' },
    ],
  },
  {
    title: 'SUPPORT',
    links: [
      { label: 'Contact', href: '/contact' },
      { label: 'Help Center', href: '/help' },
    ],
  },
];

export const Footer: React.FC<FooterProps> = ({
  columns = defaultColumns,
  copyrightText = `© ${new Date().getFullYear()} Foodiego AI Logistics. All rights reserved.`,
}) => {
  const pathname = usePathname();

  // Hide Footer on dashboard paths
  if (
    pathname?.startsWith('/admin') ||
    pathname?.startsWith('/vendor') ||
    pathname?.startsWith('/rider') ||
    pathname?.startsWith('/client')
  ) {
    return null;
  }

  return (
    <footer className="relative w-full overflow-hidden bg-[#103A27] text-emerald-50">

      {/* Subtle Decorative Glows */}
      <div className="absolute -top-32 right-0 w-72 h-72 rounded-full bg-purple-500/10 blur-[90px]" />
      <div className="absolute -bottom-32 -left-20 w-72 h-72 rounded-full bg-emerald-400/10 blur-[90px]" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12 pt-8 pb-5">

        {/* Main Footer */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-7 lg:gap-7 pb-6">

          {/* Brand Column */}
          <div className="lg:col-span-2">

            {/* Logo */}
            <div className="mb-3">
              <Logo />
            </div>

            {/* Description */}
            <p className="text-sm leading-relaxed max-w-sm text-emerald-50/60">
              Delivering smarter, faster, and tastier meals straight to your
              door using advanced AI logistics.
            </p>

            {/* Brand Message */}
            <div className="flex items-center gap-2 mt-3">
              <Sparkles className="w-4 h-4 text-emerald-300 shrink-0" />

              <span className="text-xs font-medium text-emerald-50/55">
                Delivering happiness, one meal at a time.
              </span>
            </div>

            {/* Social / Contact Buttons */}
            <div className="flex items-center gap-3 mt-4">

              <button
                type="button"
                aria-label="Share platform"
                className="group w-9 h-9 rounded-full bg-white/10 border border-white/5 flex items-center justify-center text-white hover:bg-emerald-300 hover:text-[#103A27] transition-all duration-200"
              >
                <Share2 className="w-4 h-4 group-hover:scale-110 transition-transform" />
              </button>

              <a
                href="mailto:support@foodiego.com"
                aria-label="Email support"
                className="group w-9 h-9 rounded-full bg-white/10 border border-white/5 flex items-center justify-center text-white hover:bg-emerald-300 hover:text-[#103A27] transition-all duration-200"
              >
                <Mail className="w-4 h-4 group-hover:scale-110 transition-transform" />
              </a>

            </div>
          </div>

          {/* Navigation Columns */}
          {columns.map((col, idx) => (
            <div key={idx} className="space-y-3">

              <h4 className="text-[11px] font-extrabold tracking-[0.18em] text-emerald-300 uppercase">
                {col.title}
              </h4>

              <ul className="space-y-2 text-sm font-medium">

                {col.links.map((link, linkIdx) => (
                  <li key={linkIdx}>
                    <Link
                      href={link.href}
                      className="group inline-flex items-center gap-1 text-emerald-50/55 hover:text-white transition-colors duration-200"
                    >
                      {link.label}

                      <ArrowUpRight
                        className="w-3 h-3 opacity-0 -translate-y-0.5 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200"
                      />
                    </Link>
                  </li>
                ))}

              </ul>
            </div>
          ))}

        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10 pt-4 flex flex-col sm:flex-row items-center justify-between gap-3">

          <p className="text-xs text-emerald-50/40 font-medium text-center sm:text-left">
            {copyrightText}
          </p>

          <div className="flex items-center gap-2 text-xs text-emerald-50/40">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-300" />
            <span>Made with care by Foodiego</span>
          </div>

        </div>

      </div>
    </footer>
  );
};

export default Footer;