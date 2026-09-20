"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Home,
  Package,
  Bike,
  DollarSign,
  History,
  Settings,
  LogOut,
  Menu,
  X,
  User,
  Star,
} from "lucide-react";
import { useApp } from "@/context/AppContext";

// UPDATE (rider-dashboard real-data fix): the sidebar used to hardcode
// "Afrin" and a fixed "4.9 Rating" on every rider sub-page (orders,
// deliveries, earnings, shift-history). It now shows the logged-in
// rider's real name (from AppContext) and real rating, fetched from the
// same /api/v1/rider/summary route the dashboard uses.

interface RiderShellContextValue {
  mobileMenu: boolean;
  setMobileMenu: (v: boolean) => void;
}

const RiderShellContext = createContext<RiderShellContextValue | null>(null);

export function useRiderShell() {
  const ctx = useContext(RiderShellContext);
  if (!ctx) throw new Error("useRiderShell must be used within RiderShell");
  return ctx;
}

const navItems = [
  { href: "/rider", icon: Home, label: "Dashboard" },
  { href: "/rider/orders", icon: Package, label: "Orders" },
  { href: "/rider/deliveries", icon: Bike, label: "Deliveries" },
  { href: "/rider/earnings", icon: DollarSign, label: "Earnings" },
  { href: "/rider/shift-history", icon: History, label: "Shift History" },
  { href: "/rider/settings", icon: Settings, label: "Settings" },
];

interface RiderShellProps {
  children: ReactNode;
  activePath: string;
}

export default function RiderShell({
  children,
  activePath,
}: RiderShellProps) {
  const [mobileMenu, setMobileMenu] = useState(false);
  const { user } = useApp();
  const [rating, setRating] = useState<number | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const res = await fetch("/api/v1/rider/summary");
      if (!res.ok || cancelled) return;
      const data = (await res.json()) as { performance: { rating: number } };
      if (!cancelled) setRating(data.performance.rating);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <RiderShellContext.Provider value={{ mobileMenu, setMobileMenu }}>
      <div className="min-h-screen bg-[#f8fafc] text-slate-900">
        <div className="flex min-h-screen">
          {/* ================= SIDEBAR ================= */}
          <aside
            className={`fixed left-0 top-0 z-50 h-screen w-64 border-r border-slate-200 bg-white transition-transform duration-300 lg:sticky lg:top-0 lg:z-30 lg:block lg:h-screen lg:translate-x-0 ${
              mobileMenu ? "translate-x-0" : "-translate-x-full"
            }`}
          >
            <div className="relative flex h-full flex-col">
              {/* Mobile Close Button */}
              <button
                onClick={() => setMobileMenu(false)}
                className="absolute right-4 top-5 z-10 rounded-lg p-2 transition hover:bg-slate-100 lg:hidden"
                aria-label="Close menu"
              >
                <X className="h-5 w-5 text-slate-600" />
              </button>

              {/* ================= RIDER PROFILE ================= */}
              <div className="border-b border-slate-100 px-5 py-6">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-green-100">
                    <User className="h-6 w-6 text-green-500" />
                  </div>
                  <div>
                    <p className="font-semibold text-slate-800">{user?.name || "Rider"}</p>
                    <p className="text-xs font-medium text-green-500">
                      Rider
                    </p>
                    <div className="mt-1 flex items-center gap-1 text-xs text-slate-500">
                      <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                      <span>{rating !== null ? rating.toFixed(1) : "—"} Rating</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* ================= NAVIGATION ================= */}
              <nav className="flex-1 px-4 py-5">
                {navItems.map((item) => {
                  const isActive = activePath === item.href;
                  const Icon = item.icon;
                  return (
                    <motion.a
                      key={item.href}
                      href={item.href}
                      onClick={() => setMobileMenu(false)}
                      whileHover={{ x: 2 }}
                      whileTap={{ scale: 0.98 }}
                      transition={{ type: "spring", stiffness: 400, damping: 25 }}
                      className={`mb-1 flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition ${
                        isActive
                          ? "bg-green-500 text-white shadow-sm"
                          : "text-slate-600 hover:bg-green-100 hover:text-green-500"
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                      {item.label}
                    </motion.a>
                  );
                })}

                {/* Logout */}
                <motion.button
                  type="button"
                  whileHover={{ x: 2 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ type: "spring", stiffness: 400, damping: 25 }}
                  className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-left text-sm font-medium text-slate-600 transition hover:bg-green-100 hover:text-green-500"
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </motion.button>
              </nav>
            </div>
          </aside>

          {/* ================= MOBILE OVERLAY ================= */}
          <AnimatePresence>
            {mobileMenu && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="fixed inset-0 z-40 bg-black/30 lg:hidden"
                onClick={() => setMobileMenu(false)}
              />
            )}
          </AnimatePresence>

          {/* ================= MAIN ================= */}
          <main className="min-w-0 flex-1">
            {/* Mobile Menu Button */}
            <MobileMenuButton />

            {/* Content with fade-in */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.35,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              {children}
            </motion.div>
          </main>
        </div>
      </div>
    </RiderShellContext.Provider>
  );
}

function MobileMenuButton() {
  const { setMobileMenu } = useRiderShell();
  return (
    <div className="px-5 pt-5 lg:hidden">
      <motion.button
        type="button"
        onClick={() => setMobileMenu(true)}
        whileTap={{ scale: 0.95 }}
        className="rounded-lg border border-slate-200 bg-white p-2 shadow-sm transition hover:bg-slate-50"
        aria-label="Open menu"
      >
        <Menu className="h-5 w-5 text-slate-700" />
      </motion.button>
    </div>
  );
}
