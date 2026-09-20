'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ArrowUpRight, Check, Clock, Mail, MapPin, Phone, Share2, Sparkles } from 'lucide-react';
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

const isExternalLink = (href: string) =>
  /^(mailto:|tel:|https?:)/.test(href);

const footerLinkClassName =
  'group inline-flex items-center gap-1 text-emerald-50/55 hover:text-white transition-colors duration-200';

function FooterLinkItem({ link }: { link: FooterLink }) {
  const content = (
    <>
      {link.label}
      <ArrowUpRight
        className="w-3 h-3 opacity-0 -translate-y-0.5 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200"
      />
    </>
  );

  if (isExternalLink(link.href)) {
    const isHttpLink = link.href.startsWith('http');

    return (
      <a
        href={link.href}
        aria-label={
          link.href.startsWith('mailto:')
            ? 'Email Foodiego support'
            : link.href.startsWith('tel:')
              ? 'Call Foodiego support'
              : link.label
        }
        className={footerLinkClassName}
        target={isHttpLink ? '_blank' : undefined}
        rel={isHttpLink ? 'noreferrer' : undefined}
      >
        {content}
      </a>
    );
  }

  return (
    <Link href={link.href} className={footerLinkClassName}>
      {content}
    </Link>
  );
}

const defaultColumns: FooterColumn[] = [
  {
    title: 'FOODIEGO',
    links: [
      { label: 'Home', href: '/' },
      { label: 'About Us', href: '/about' },
      { label: 'Restaurants', href: '/restaurants' },
      { label: 'Offers', href: '/offers' },
      { label: 'AI Assistant', href: '/ai-assistant' },
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
    title: 'SUPPORT',
    links: [
      { label: 'Contact support', href: 'mailto:support@foodiego.com' },
      { label: 'Help Center', href: '/ai-assistant' },
      { label: 'Track order', href: '/client/track' },
    ],
  },
  {
    title: 'ACCOUNT',
    links: [
      { label: 'Sign in', href: '/auth/login' },
      { label: 'Create account', href: '/auth/register' },
      { label: 'Favorites', href: '/favorites' },
    ],
  },
];

export const Footer: React.FC<FooterProps> = ({
  columns = defaultColumns,
  copyrightText = `© ${new Date().getFullYear()} Foodiego AI Logistics. All rights reserved.`,
}) => {
  const pathname = usePathname();
  const [shareState, setShareState] = useState<'idle' | 'copied' | 'shared'>('idle');

  const handleShare = async () => {
    const shareData = {
      title: 'Foodiego',
      text: 'Discover smarter food delivery with Foodiego.',
      url: window.location.href,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
        setShareState('shared');
      } catch {
        setShareState('idle');
      }
      return;
    }

    try {
      await navigator.clipboard.writeText(window.location.href);
      setShareState('copied');
    } catch {
      setShareState('idle');
    }
  };

  // Hide Footer on dashboard paths and auth pages (login/register)
  if (
    pathname?.startsWith('/admin') ||
    pathname?.startsWith('/vendor') ||
    pathname?.startsWith('/rider') ||
    pathname?.startsWith('/client') ||
    pathname?.startsWith('/auth')
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
            <div className="mt-5 space-y-2.5 text-xs text-emerald-50/70">
              <a
                href="mailto:support@foodiego.com"
                className="flex items-center gap-2 hover:text-white transition-colors"
              >
                <Mail className="w-4 h-4 text-emerald-300 shrink-0" />
                <span>support@foodiego.com</span>
              </a>

              <a
                href="tel:+18009023663"
                className="flex items-center gap-2 hover:text-white transition-colors"
              >
                <Phone className="w-4 h-4 text-emerald-300 shrink-0" />
                <span>+1 (800) 902-FOOD</span>
              </a>

              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-emerald-300 shrink-0" />
                <span>8:00 AM–11:00 PM daily</span>
              </div>

              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-emerald-300 shrink-0 mt-0.5" />
                <span>Major metropolitan zones & surrounding neighborhoods</span>
              </div>
            </div>

            <div className="flex items-center gap-3 mt-5">
              <button
                type="button"
                onClick={handleShare}
                aria-label={
                  shareState === 'copied'
                    ? 'Page link copied'
                    : shareState === 'shared'
                      ? 'Share platform'
                      : 'Share platform'
                }
                className="group w-9 h-9 rounded-full bg-white/10 border border-white/5 flex items-center justify-center text-white hover:bg-emerald-300 hover:text-[#103A27] transition-all duration-200"
              >
                {shareState === 'copied' ? (
                  <Check className="w-4 h-4" />
                ) : (
                  <Share2 className="w-4 h-4 group-hover:scale-110 transition-transform" />
                )}
              </button>

              <a
                href="mailto:support@foodiego.com"
                aria-label="Email support"
                className="group w-9 h-9 rounded-full bg-white/10 border border-white/5 flex items-center justify-center text-white hover:bg-emerald-300 hover:text-[#103A27] transition-all duration-200"
              >
                <Mail className="w-4 h-4 group-hover:scale-110 transition-transform" />
              </a>
            </div>

            {shareState !== 'idle' && (
              <p className="mt-2 text-[11px] text-emerald-300" aria-live="polite">
                {shareState === 'copied'
                  ? 'Page link copied to clipboard.'
                  : 'Share dialog opened.'}
              </p>
            )}
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
                    <FooterLinkItem link={link} />
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