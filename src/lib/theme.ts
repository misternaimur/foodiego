/**
 * Theme plumbing shared by the pre-paint script in `layout.tsx` and the theme
 * picker. The theme lives as `dark` or `colorblind` classes on <html> rather
 * than in React state, so the document can be themed before React hydrates.
 */

export const THEME_STORAGE_KEY = "foodiego_theme";

export type Theme = "light" | "dark" | "colorblind";

/**
 * Applies the stored theme, falling back to the OS preference. Inlined as a
 * blocking script in `<head>`-position so the first paint is already correct —
 * otherwise a stored theme flashes on every navigation that server-renders the page.
 */
export const THEME_INIT_SCRIPT = `(function(){try{var k=${JSON.stringify(
  THEME_STORAGE_KEY
)};var s=localStorage.getItem(k);var t=s||"";if(t!=="light"&&t!=="dark"&&t!=="colorblind"){t=window.matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light";}var r=document.documentElement;r.classList.remove("dark","colorblind");if(t==="dark"){r.classList.add("dark");r.style.colorScheme="dark";}else if(t==="colorblind"){r.classList.add("colorblind");r.style.colorScheme="light";}else{r.style.colorScheme="light";}}catch(e){}})();`;

/** Reads whether dark mode is currently applied to the document. */
export function isDarkActive(): boolean {
  return document.documentElement.classList.contains("dark");
}

/** Reads whether colorblind mode is currently applied to the document. */
export function isColorblindActive(): boolean {
  return document.documentElement.classList.contains("colorblind");
}

/** Returns the currently active theme. */
export function getActiveTheme(): Theme {
  if (isColorblindActive()) return "colorblind";
  if (isDarkActive()) return "dark";
  return "light";
}

/** Applies a theme to the document and persists the explicit choice. */
export function applyTheme(theme: Theme): void {
  const root = document.documentElement;
  root.classList.remove("dark", "colorblind");
  
  if (theme === "dark") {
    root.classList.add("dark");
    root.style.colorScheme = "dark";
  } else if (theme === "colorblind") {
    root.classList.add("colorblind");
    root.style.colorScheme = "light";
  } else {
    root.style.colorScheme = "light";
  }
  
  try {
    localStorage.setItem(THEME_STORAGE_KEY, theme);
  } catch {
    // Private mode / storage disabled: the class still applies for this session.
  }
}

/** Returns the stored theme preference, if valid. */
export function getStoredTheme(): Theme | null {
  try {
    const stored = localStorage.getItem(THEME_STORAGE_KEY);
    if (stored === "light" || stored === "dark" || stored === "colorblind") {
      return stored;
    }
  } catch {
    // Storage access failed
  }
  return null;
}
