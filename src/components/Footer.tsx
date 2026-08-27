'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

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
      { label: 'Add your restaurant', href: '/partner/restaurant' },
      { label: 'Sign up to deliver', href: '/partner/rider' },
      { label: 'Business Account', href: '/partner/business' },
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

  if (pathname && pathname.startsWith('/dashboard')) {
    return null;
  }

  return (
    <footer className="w-full bg-[#2d2d2d] text-[#a1a1a1]">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12 pt-14 pb-10">
        
        {/* Top Grid Area */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-10 lg:gap-8 pb-12">
          
          {/* Left Column: Brand Info & Quick Action Icons */}
          <div className="lg:col-span-2 space-y-5">
            <Link href="/" className="inline-block">
              <span className="text-3xl font-bold tracking-tight text-[#fce8e6]">
                Foodiego
              </span>
            </Link>

            <p className="text-sm leading-relaxed max-w-sm text-[#a1a1a1]">
              Delivering smarter, faster, and tastier meals straight to your door using advanced AI logistics.
            </p>

            {/* Social / Action Circle Buttons */}
            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                aria-label="Share platform"
                className="w-10 h-10 rounded-full bg-[#3d3d3d] flex items-center justify-center text-[#d1d1d1] hover:bg-[#4d4d4d] hover:text-white transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                </svg>
              </button>

              <a
                href="mailto:support@foodiego.com"
                aria-label="Email support"
                className="w-10 h-10 rounded-full bg-[#3d3d3d] flex items-center justify-center text-[#d1d1d1] hover:bg-[#4d4d4d] hover:text-white transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Navigation Link Columns */}
          {columns.map((col, idx) => (
            <div key={idx} className="space-y-4">
              <h4 className="text-xs font-bold tracking-wider text-[#e8927c] uppercase">
                {col.title}
              </h4>
              <ul className="space-y-3 text-sm">
                {col.links.map((link, linkIdx) => (
                  <li key={linkIdx}>
                    <Link 
                      href={link.href}
                      className="hover:text-white transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

        </div>

        {/* Bottom Bar Divider & Copyright */}
        <div className="border-t border-[#3d3d3d] pt-8">
          <p className="text-xs text-[#888888]">
            {copyrightText}
          </p>
        </div>

      </div>
    </footer>
  );
};

export default Footer;