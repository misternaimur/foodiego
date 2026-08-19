"use client";

import { useState } from "react";
import Link from "next/link";

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="w-full border-b border-gray-200 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60" suppressHydrationWarning>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center">
              <span className="text-2xl font-black tracking-tight text-pink-600">Foodiego</span>
            </Link>
          </div>

          <div className="hidden md:flex items-center gap-6">
            <Link href="/" className="text-sm font-medium text-gray-900 hover:text-pink-600">
              Home
            </Link>
            <Link href="/menu" className="text-sm font-medium text-gray-900 hover:text-pink-600">
              Menu
            </Link>
            <Link href="/orders" className="text-sm font-medium text-gray-900 hover:text-pink-600">
              Orders
            </Link>
            <Link href="/cart" className="text-sm font-medium text-gray-900 hover:text-pink-600">
              Cart
            </Link>
          </div>

          <button
            type="button"
            className="md:hidden inline-flex items-center justify-center rounded-md p-2 text-gray-700 hover:bg-gray-100"
            onClick={() => setMobileOpen((prev) => !prev)}
            aria-expanded={mobileOpen}
            aria-label="Toggle navigation"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              {mobileOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="md:hidden border-t border-gray-200 bg-white">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-3 space-y-1">
            <Link href="/" className="block rounded-md px-3 py-2 text-base font-medium text-gray-900 hover:bg-gray-50">
              Home
            </Link>
            <Link href="/menu" className="block rounded-md px-3 py-2 text-base font-medium text-gray-900 hover:bg-gray-50">
              Menu
            </Link>
            <Link href="/orders" className="block rounded-md px-3 py-2 text-base font-medium text-gray-900 hover:bg-gray-50">
              Orders
            </Link>
            <Link href="/cart" className="block rounded-md px-3 py-2 text-base font-medium text-gray-900 hover:bg-gray-50">
              Cart
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
