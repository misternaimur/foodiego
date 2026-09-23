"use client";

import React, { useState, useRef, useEffect, useCallback, useSyncExternalStore } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence, type Transition } from "framer-motion";
import {
  User,
  ShoppingBag,
  LayoutDashboard,
  Settings,
  LogOut,
  ChevronDown,
  UtensilsCrossed,
  Bike,
  ShoppingCart,
  Menu,
  X,
  Search,
  Sparkles,
} from "lucide-react";
import { useApp } from "@/context/AppContext";
import LogoText from "./LogoText";
import CartDrawer from "@/components/client/CartDrawer";
import NotificationBell from "@/components/shared/NotificationBell";
import ThemeToggle from "@/components/shared/ThemeToggle";

const springSlow: Transition = { type: "spring", stiffness: 300, damping: 28 };
const fadeDuration: Transition = { duration: 0.25, ease: "easeOut" };

export interface NavItem {
  label: string;
  href: string;
}

export interface NavbarProps {
  navItems?: NavItem[];
  user?:
    | {
        name?: string;
        email?: string;
        avatarUrl?: string;
        role?: string;
      }
    | null;
  onSearch?: (query: string) => void;
  onLogout?: () => void;
}

const defaultNavItems: NavItem[] = [
  { label: "Home", href: "/" },
  { label: "Discover restaurants", href: "/restaurants" },
  { label: "Offers", href: "/offers" },
];

export const Navbar: React.FC<NavbarProps> = ({
  navItems = defaultNavItems,
  user: propUser = null,
  onSearch,
  onLogout,
}) => {
  const pathname = usePathname();
  const router = useRouter();

  const [searchQuery, setSearchQuery] = useState("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [hoveredHref, setHoveredHref] = useState<string | null>(null);

  const isMounted = useSyncExternalStore(() => () => {}, () => true, () => false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const { cart, user: contextUser, logoutUser } = useApp();
  const user = propUser ?? contextUser;
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const role = propUser?.role;
  const dashboardHref =
    role === "admin"
      ? "/admin"
      : role === "restaurant"
      ? "/vendor"
      : role === "rider"
      ? "/rider"
      : "/client";

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 60);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = useCallback(async () => {
    if (onLogout) {
      onLogout();
      return;
    }
    await logoutUser();
  }, [onLogout, logoutUser]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsMobileMenuOpen(false);
        setIsDropdownOpen(false);
      }
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, []);

  if (
    pathname?.startsWith("/admin") ||
    pathname?.startsWith("/vendor") ||
    pathname?.startsWith("/rider") ||
    pathname?.startsWith("/client") ||
    pathname?.startsWith("/auth")
  ) {
    return null;
  }

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(searchQuery);
    } else if (searchQuery.trim()) {
      router.push(`/restaurants?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <>
      {/* Announcement banner. Sits outside the sticky group on purpose: it should
          scroll away with the page while the nav bar stays pinned. */}
      <AnimatePresence>
        {!user && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            className="w-full bg-[#124734] text-white/90 overflow-hidden"
          >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 flex items-center justify-center gap-3 text-xs">
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5, ...springSlow }}
              >
                <Link
                  href="/auth/register/restaurant"
                  className="inline-flex items-center gap-1.5 font-bold border border-white/40 rounded-full px-3.5 py-1.5 hover:bg-white hover:text-[#124734] hover:border-white transition-colors duration-200 cursor-pointer"
                >
                  <UtensilsCrossed size={13} />
                  <span>Create a restaurant account</span>
                </Link>
              </motion.div>
              <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.6, ...springSlow }}
                >
                  <Link
                    href="/auth/register/rider"
                    className="inline-flex items-center gap-1.5 font-bold border border-white/40 rounded-full px-3.5 py-1.5 hover:bg-white hover:text-[#124734] hover:border-white transition-colors duration-200 cursor-pointer"
                  >
                    <Bike size={13} />
                    <span>Create a rider account</span>
                  </Link>
                </motion.div>
              </div>
            </motion.div>
        )}
      </AnimatePresence>

      {/* The sticky element is this wrapper, not the header inside it. Sticky is
          clamped to the parent's box: when the header itself was sticky here, its
          only travel was the height of its own wrapper, so it scrolled straight
          off the page. As a direct child of the layout, this wrapper's containing
          block spans the page, so the bar stays pinned all the way down.

          The scroll-linked y offset was dropped with it — nudging a pinned bar to
          -4px would clip it against the top edge instead of easing it out of view. */}
      <motion.div className="sticky top-0 z-50 w-full">
        <motion.header
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ ...springSlow, delay: 0.2 }}
          className="relative w-full transition-all duration-300"
          style={{
            /* Colour values come from CSS variables (globals.css) so the bar
               follows the active theme. Inline styles cannot be overridden by a
               stylesheet, so these cannot be plain utility classes. */
            background: isScrolled ? "var(--nav-bg-scrolled)" : "var(--nav-bg)",
            backdropFilter: isScrolled
              ? "blur(20px) saturate(1.5)"
              : "blur(12px) saturate(1.2)",
            WebkitBackdropFilter: isScrolled
              ? "blur(20px) saturate(1.5)"
              : "blur(12px) saturate(1.2)",
            borderBottom: isScrolled
              ? "1px solid var(--nav-border-scrolled)"
              : "1px solid var(--nav-border)",
            boxShadow: isScrolled
              ? "0 4px 30px var(--nav-shadow)"
              : "none",
          }}
        >
          {/* Brand accent hairline along the bottom edge */}
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-linear-to-r from-transparent via-[#10B981]/45 to-transparent" />
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-[72px] flex items-center justify-between gap-4">
            {/* Left: Logo & Nav */}
            <div className="flex items-center gap-6 lg:gap-8">
              <motion.div
                whileHover={{ scale: 1.03 }}
                transition={{ ...springSlow }}
              >
                  <LogoText />
              </motion.div>

              {/* UPDATE (nav-selection redesign): the active marker used to be an
                  underline anchored to the bottom of the link's py-6 padding box -
                  ~24px below the text, at the very bottom edge of the bar. It's
                  now a sliding pill inside a glass capsule: the active pill and a
                  hover pill both use shared layoutIds so they glide between
                  links on a spring, the active one sweeps a shine across itself
                  on arrival. */}
              <nav
                className="hidden lg:flex items-center gap-1 rounded-full border border-[#124734]/10 bg-white/50 p-1 shadow-[inset_0_1px_0_rgba(255,255,255,0.6),0_1px_2px_rgba(18,71,52,0.06)] backdrop-blur-md"
                onMouseLeave={() => setHoveredHref(null)}
              >
                {navItems.map((item, i) => {
                  const isActive =
                    item.href === "/" ? pathname === "/" : pathname === item.href || !!pathname?.startsWith(`${item.href}/`);
                  const isHovered = hoveredHref === item.href && !isActive;
                  return (
                    <motion.div
                      key={item.href}
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 + i * 0.06, ...springSlow }}
                    >
                      <Link
                        href={item.href}
                        onMouseEnter={() => setHoveredHref(item.href)}
                        onFocus={() => setHoveredHref(item.href)}
                        aria-current={isActive ? "page" : undefined}
                        className={`group relative block whitespace-nowrap rounded-full px-4 py-2 text-sm font-semibold transition-colors duration-300 ${
                          isActive ? "text-white" : "text-[#124734]"
                        }`}
                      >
                        {isHovered && (
                          <motion.span
                            layoutId="navHoverPill"
                            className="absolute inset-0 rounded-full bg-[#124734]/8"
                            transition={{ type: "spring", stiffness: 420, damping: 34 }}
                          />
                        )}
                        {isActive && (
                          <motion.span
                            layoutId="navActivePill"
                            className="absolute inset-0 overflow-hidden rounded-full bg-linear-to-r from-[#124734] to-[#1d6b48] shadow-[0_8px_22px_-8px_rgba(18,71,52,0.75)]"
                            transition={{ type: "spring", stiffness: 380, damping: 30 }}
                          >
                            <motion.span
                              key={pathname}
                              className="absolute inset-y-0 -left-1/2 w-1/2 -skew-x-12 bg-linear-to-r from-transparent via-white/35 to-transparent"
                              initial={{ x: "0%" }}
                              animate={{ x: "400%" }}
                              transition={{ duration: 0.9, ease: "easeOut", delay: 0.15 }}
                            />
                          </motion.span>
                        )}
                        <span className="relative z-10">{item.label}</span>
                      </Link>
                    </motion.div>
                  );
                })}
              </nav>
            </div>

            {/* Center: Search */}
            <motion.form
              onSubmit={handleSearchSubmit}
              className="hidden md:flex flex-1 max-w-sm mx-2 lg:mx-4"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5, ...springSlow }}
            >
              <div className="relative w-full">
                <div
                  className={`absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors duration-200 ${
                    isSearchFocused ? "text-[#124734]" : "text-[#9CA3AF]"
                  }`}
                >
                  <Search size={16} strokeWidth={2.2} />
                </div>
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setIsSearchFocused(true)}
                  onBlur={() => setIsSearchFocused(false)}
                  placeholder="Search food or restaurants..."
                  className="w-full bg-[#ECE7D9] text-sm text-[#1F2937] placeholder-[#9CA3AF] rounded-full pl-11 pr-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#124734]/15 focus:bg-white transition-all duration-200 border border-transparent focus:border-[#124734]/20"
                />
              </div>
            </motion.form>

            {/* Right: Actions */}
            <div className="flex items-center gap-4 sm:gap-5 shrink-0">
              {/* Light / dark switch */}
              <ThemeToggle />

              {/* Cart */}
              <motion.button
                onClick={() => setIsCartOpen(true)}
                className="relative p-2 text-[#6B7280] hover:text-[#124734] transition-colors duration-200 bg-white/60 hover:bg-white rounded-full border border-gray-200/50 cursor-pointer"
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.92 }}
                aria-label="Cart"
              >
                <ShoppingCart className="w-5 h-5" />
                <AnimatePresence>
                  {isMounted && cartCount > 0 && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      transition={{ type: "spring", stiffness: 500, damping: 15 }}
                      className="absolute -top-1 -right-1 bg-[#F6A429] text-[#1F2937] text-[10px] font-extrabold h-4 w-4 rounded-full flex items-center justify-center"
                    >
                      {cartCount}
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.button>

              {/* Notifications — signed-in users only */}
              {user && (
                <NotificationBell buttonClassName="relative p-2 text-[#6B7280] hover:text-[#15462D] transition-colors duration-200 bg-white/60 hover:bg-white rounded-full border border-gray-200/50 cursor-pointer" />
              )}

              {/* User Dropdown */}
              {user ? (
                <div className="relative" ref={dropdownRef}>
                  <motion.button
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="flex items-center gap-2 text-sm font-semibold text-[#124734] bg-white border border-[#E8E2D5] hover:bg-gray-50 px-3 py-1.5 rounded-full transition-colors duration-200 focus:outline-none cursor-pointer"
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                  >
                    <div className="w-7 h-7 rounded-full bg-emerald-100 overflow-hidden flex items-center justify-center relative border border-emerald-200">
                      {user.avatarUrl ? (
                        <Image src={user.avatarUrl} alt="User Avatar" fill className="object-cover" />
                      ) : (
                        <span className="text-xs font-bold text-[#124734]">
                          {user.name ? user.name.charAt(0).toUpperCase() : "U"}
                        </span>
                      )}
                    </div>
                    <span className="hidden sm:inline-block max-w-[140px] truncate">{user.name || "Account"}</span>
                    <motion.div
                      animate={{ rotate: isDropdownOpen ? 180 : 0 }}
                      transition={{ duration: 0.25, ease: "easeInOut" }}
                    >
                      <ChevronDown size={14} className="text-gray-500" />
                    </motion.div>
                  </motion.button>

                  <AnimatePresence>
                    {isDropdownOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -8, scale: 0.96 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -8, scale: 0.96, transition: { duration: 0.15 } }}
                        transition={{ ...springSlow }}
                        className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-[0_10px_40px_rgba(21,70,45,0.12)] border border-[#E8E2D5] py-2 z-50"
                      >
                        <div className="px-4 py-3 border-b border-[#E8E2D5]/60">
                          <p className="text-sm font-semibold text-[#1F2937] truncate">{user.name || "User"}</p>
                          <p className="text-xs text-[#9CA3AF] truncate">{user.email || "user@example.com"}</p>
                        </div>

                        <div className="py-1">
                          {[
                            { href: "/account", icon: <User size={16} className="text-[#124734]" />, label: "Profile" },
                            { href: "/client/cart", icon: <ShoppingBag size={16} className="text-[#124734]" />, label: "My Cart" },
                            { href: dashboardHref, icon: <LayoutDashboard size={16} className="text-[#124734]" />, label: "Dashboard" },
                            { href: "/settings", icon: <Settings size={16} className="text-[#124734]" />, label: "Settings" },
                          ].map((item, i) => (
                            <motion.div
                              key={item.href}
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: i * 0.04, ...springSlow }}
                            >
                              <Link
                                href={item.href}
                                onClick={() => setIsDropdownOpen(false)}
                                className="flex items-center gap-3 px-4 py-2.5 text-sm text-[#374151] hover:bg-[#FAF7EE] transition-colors duration-150 cursor-pointer"
                              >
                                {item.icon}
                                <span className="font-medium">{item.label}</span>
                              </Link>
                            </motion.div>
                          ))}
                        </div>

                        <div className="pt-1 border-t border-[#E8E2D5]/60">
                          <motion.button
                            onClick={async () => {
                              setIsDropdownOpen(false);
                              await handleLogout();
                            }}
                            className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors duration-150 text-left font-medium cursor-pointer"
                          >
                            <LogOut size={16} />
                            <span>Logout</span>
                          </motion.button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                // UPDATE (responsive fix): this block had no responsive
                // class at all, so it rendered at every width — combined
                // with the "lg:hidden" hamburger button right next to it,
                // both showed at once below the lg breakpoint and pushed
                // the header ~125px past the viewport (mobile already has
                // its own Sign in/Order Now buttons inside the drawer
                // below, so this is desktop-only now).
                <motion.div
                  className="hidden lg:flex items-center gap-3"
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6, ...fadeDuration }}
                >
                  <Link
                    href="/auth/login"
                    className="text-sm font-bold text-[#374151] hover:text-[#124734] transition-colors duration-200 px-2 py-1 cursor-pointer"
                  >
                    Sign in
                  </Link>
                  <motion.div
                    whileHover={{ scale: 1.04 }}
                    whileTap={{ scale: 0.96 }}
                    transition={{ ...springSlow }}
                  >
                    <Link
                      href="/auth/register"
                      className="inline-flex items-center justify-center text-xs font-extrabold tracking-wider text-[#1F2937] bg-[#F6A429] hover:bg-[#e0931f] uppercase px-5 py-2.5 rounded-full transition-colors duration-200 shadow-sm cursor-pointer"
                    >
                      Order Now
                    </Link>
                  </motion.div>
                </motion.div>
              )}

              {/* Mobile toggle */}
              <motion.button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden p-2 text-[#374151] hover:text-[#124734] bg-white/60 rounded-full border border-gray-200/50 cursor-pointer"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                aria-label="Toggle menu"
              >
                <AnimatePresence mode="wait">
                  {isMobileMenuOpen ? (
                    <motion.div
                      key="close"
                      initial={{ rotate: -90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: 90, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <X className="w-5 h-5" />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="menu"
                      initial={{ rotate: 90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: -90, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Menu className="w-5 h-5" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.button>
            </div>
          </div>
        </motion.header>
      </motion.div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="lg:hidden fixed inset-0 bg-black/20 z-40"
              onClick={() => setIsMobileMenuOpen(false)}
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%", transition: { duration: 0.25, ease: "easeInOut" } }}
              transition={{ type: "spring", stiffness: 300, damping: 32 }}
              className="lg:hidden fixed top-0 right-0 bottom-0 w-[320px] bg-[#FAF7EE] z-50 shadow-2xl flex flex-col overflow-y-auto"
            >
              <div className="p-5 border-b border-[#E8E2D5] flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-[#F6A429]" />
                  <span className="font-bold text-[#124734]">FoodieGo</span>
                </div>
                <motion.button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2 text-gray-500 hover:text-[#124734] rounded-full hover:bg-white transition-colors cursor-pointer"
                  whileHover={{ rotate: 90 }}
                  transition={{ duration: 0.3 }}
                  aria-label="Close menu"
                >
                  <X className="w-5 h-5" />
                </motion.button>
              </div>

              <div className="p-4">
                <form onSubmit={handleSearchSubmit} className="pb-2">
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                      <Search size={16} />
                    </div>
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search food or restaurants..."
                      className="w-full bg-[#ECE7D9] text-sm text-[#1F2937] placeholder-gray-500 rounded-full pl-11 pr-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#124734]/20 focus:bg-white transition-all border border-transparent focus:border-[#124734]/30"
                    />
                  </div>
                </form>
              </div>

              <div className="px-4 space-y-1">
                {navItems.map((item, i) => {
                  const isActive = pathname === item.href;
                  return (
                    <motion.div
                      key={item.href}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05, ...springSlow }}
                    >
                      <Link
                        href={item.href}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className={`flex items-center justify-between py-3 px-4 rounded-xl text-sm font-semibold transition-colors duration-200 cursor-pointer ${
                          isActive
                            ? "bg-[#124734] text-white"
                            : "text-[#374151] hover:bg-white"
                        }`}
                      >
                        <span>{item.label}</span>
                        {isActive && (
                          <motion.div
                            layoutId="mobileActiveDot"
                            className="w-1.5 h-1.5 rounded-full bg-[#F6A429]"
                            transition={{ type: "spring", stiffness: 500 }}
                          />
                        )}
                      </Link>
                    </motion.div>
                  );
                })}
              </div>

              <div className="mt-auto p-4 border-t border-[#E8E2D5] space-y-3">
                {!user ? (
                  <>
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3, ...springSlow }}
                    >
                      <Link
                        href="/auth/register"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="block text-center w-full py-3 text-xs font-bold uppercase tracking-wider text-[#1F2937] bg-[#F6A429] rounded-full shadow-sm cursor-pointer hover:bg-[#e0931f] transition-colors duration-200"
                      >
                        Order Now
                      </Link>
                    </motion.div>
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4, ...springSlow }}
                      className="flex gap-3"
                    >
                      <Link
                        href="/auth/login"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="flex-1 text-center py-3 text-sm font-semibold text-white bg-[#124734] rounded-full hover:bg-[#1a5c3a] transition-colors duration-200 cursor-pointer"
                      >
                        Sign in
                      </Link>
                    </motion.div>
                  </>
                ) : (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, ...springSlow }}
                    className="space-y-1 pt-3 border-t border-[#E8E2D5]"
                  >
                    {[
                      { href: "/profile", label: "Profile" },
                      { href: "/client/cart", label: "My Cart" },
                      { href: dashboardHref, label: "Dashboard" },
                      { href: "/settings", label: "Settings" },
                    ].map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="block py-2.5 text-sm text-[#374151] font-medium hover:text-[#124734] transition-colors duration-150 cursor-pointer"
                      >
                        {item.label}
                      </Link>
                    ))}
                    <button
                      onClick={async () => {
                        setIsMobileMenuOpen(false);
                        await handleLogout();
                      }}
                      className="block w-full text-left py-2.5 text-sm text-red-500 font-medium cursor-pointer"
                    >
                      Logout
                    </button>
                  </motion.div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  );
};

export default Navbar;
