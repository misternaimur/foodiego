"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import { Sun, Moon, Eye, Check } from "lucide-react";
import {
  applyTheme,
  getActiveTheme,
  type Theme,
} from "@/lib/theme";

export interface ThemeToggleProps {
  /** Overrides the default pill styling, to match whichever header mounts it. */
  className?: string;
  /** Renders a text label alongside the icon, for list/sidebar row layouts. */
  showLabel?: boolean;
}

/**
 * Three-state theme picker with hover-triggered dropdown.
 * Shows Light / Dark / Colorblind-safe options. The theme is read from the <html>
 * class rather than prop or context state, so the picker always reflects what the
 * pre-paint script applied.
 */
export default function ThemeToggle({ className, showLabel = false }: ThemeToggleProps) {
  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(false);
  const [activeTheme, setActiveTheme] = useState<Theme>("light");
  const dropdownRef = useRef<HTMLDivElement>(null);
  // React 19 requires an explicit initial value. ReturnType<typeof setTimeout>
  // keeps this correct in both the browser and the Node build/test environment.
  const closeTimeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => {
    setMounted(true);
    setActiveTheme(getActiveTheme());
  }, []);

  // Outside click handler
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleThemeChange = (theme: Theme) => {
    applyTheme(theme);
    setActiveTheme(theme);
    setOpen(false);
  };

  const handleMouseEnter = () => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
    }
    setOpen(true);
  };

  const handleMouseLeave = () => {
    // Small delay before closing, so mouse can travel to dropdown
    closeTimeoutRef.current = setTimeout(() => setOpen(false), 100);
  };

  const getCurrentIcon = () => {
    if (activeTheme === "dark") return <Moon className="w-5 h-5" />;
    if (activeTheme === "colorblind") return <Eye className="w-5 h-5" />;
    return <Sun className="w-5 h-5" />;
  };

  const getCurrentLabel = () => {
    if (activeTheme === "dark") return "Dark mode";
    if (activeTheme === "colorblind") return "Colorblind-safe";
    return "Light mode";
  };

  const defaultClassName =
    "relative flex items-center justify-center w-10 h-10 rounded-full bg-white/60 hover:bg-white border border-gray-200/50 text-gray-600 hover:text-gray-900 transition-colors cursor-pointer";

  return (
    <div
      ref={dropdownRef}
      className="relative"
      /* Hover lives on the wrapper, not the button: the menu sits 8px below the
         trigger, so a handler on the button alone would fire mouseleave while the
         pointer crosses that gap and close the menu before it could be clicked. */
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Current theme button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setOpen(!open)}
        className={className || defaultClassName}
        aria-label={`Current theme: ${getCurrentLabel()}. Click or hover to change.`}
        aria-haspopup="menu"
        aria-expanded={open}
      >
        {mounted && getCurrentIcon()}
        {showLabel && mounted && <span className="ml-2">{getCurrentLabel()}</span>}
      </motion.button>

      {/* Dropdown menu. Deliberately plain CSS rather than a framer enter
          animation: the menu has to be visible the instant it opens, and a
          JS-driven animation that never advances (rAF does not fire in a
          backgrounded tab) would leave it mounted but stuck at opacity 0. */}
      {open && mounted && (
        <div
          className="animate-fade-slide-in absolute right-0 top-full mt-2 w-56 rounded-xl bg-white shadow-xl border border-gray-200/80 overflow-hidden z-50"
          role="menu"
          aria-label="Theme"
        >
            <div className="p-1.5">
              {/* Light option */}
              <button
                type="button"
                role="menuitem"
                onClick={() => handleThemeChange("light")}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors text-left ${
                  activeTheme === "light" ? "bg-amber-50" : "hover:bg-gray-50"
                }`}
              >
                <Sun className="w-4 h-4 text-amber-500 flex-shrink-0" />
                <span className="text-sm font-medium text-gray-700 flex-1">Light</span>
                {activeTheme === "light" && (
                  <Check className="w-4 h-4 text-amber-600 flex-shrink-0" />
                )}
              </button>

              {/* Dark option */}
              <button
                type="button"
                role="menuitem"
                onClick={() => handleThemeChange("dark")}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors text-left ${
                  activeTheme === "dark" ? "bg-indigo-50" : "hover:bg-gray-50"
                }`}
              >
                <Moon className="w-4 h-4 text-indigo-600 flex-shrink-0" />
                <span className="text-sm font-medium text-gray-700 flex-1">Dark</span>
                {activeTheme === "dark" && (
                  <Check className="w-4 h-4 text-indigo-600 flex-shrink-0" />
                )}
              </button>

              {/* Colorblind-safe option */}
              <button
                type="button"
                role="menuitem"
                onClick={() => handleThemeChange("colorblind")}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors text-left ${
                  activeTheme === "colorblind" ? "bg-blue-50" : "hover:bg-gray-50"
                }`}
              >
                <Eye className="w-4 h-4 text-blue-600 flex-shrink-0" />
                <span className="text-sm font-medium text-gray-700 flex-1">Colorblind-safe</span>
                {activeTheme === "colorblind" && (
                  <Check className="w-4 h-4 text-blue-600 flex-shrink-0" />
                )}
              </button>
            </div>
        </div>
      )}
    </div>
  );
}
