<!-- @format -->

# Foodiego Design Guidelines

## Color Palette

### Primary Colors

- **Green (Primary)**: `#10B981` - Main brand color, used for CTAs and primary actions
- **White**: `#FFFFFF` - Background and contrast
- **Dark Gray**: `#1F2937` - Text and primary content

### Secondary Colors

- **Light Green**: `#D1FAE5` - Backgrounds, hover states
- **Gray**: `#F3F4F6` - Secondary backgrounds
- **Red**: `#EF4444` - Destructive actions, alerts

### Neutral Palette

- **Dark Text**: `#111827` - Primary text
- **Medium Text**: `#6B7280` - Secondary text
- **Light Text**: `#9CA3AF` - Tertiary text, placeholders
- **Border**: `#E5E7EB` - Borders and dividers

## Typography

### Font Stack

```
Primary: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif
```

### Scales

- **Display**: 32px / 40px (line-height 1.25) - Hero sections, page titles
- **Heading 1**: 28px / 36px (line-height 1.28) - Main page headers
- **Heading 2**: 24px / 32px (line-height 1.33) - Section headers
- **Heading 3**: 20px / 28px (line-height 1.4) - Subsections
- **Body Large**: 18px / 28px (line-height 1.55) - Large body text
- **Body**: 16px / 24px (line-height 1.5) - Default body text
- **Body Small**: 14px / 20px (line-height 1.42) - Secondary text
- **Caption**: 12px / 16px (line-height 1.33) - Small labels, captions

### Font Weights

- **Regular**: 400
- **Medium**: 500
- **Semibold**: 600
- **Bold**: 700

## Components

### Buttons

#### Primary Button

- Background: Green (`#10B981`)
- Text: White
- Padding: 12px 24px
- Border Radius: 8px
- Hover: Darken green by 10%
- Active: Darken green by 20%
- Disabled: Gray background, reduced opacity

#### Secondary Button

- Background: Transparent
- Border: 2px solid Green
- Text: Green
- Padding: 10px 22px
- Border Radius: 8px
- Hover: Light green background

#### Icon Button

- Size: 40px × 40px
- Border Radius: 8px
- Center icon (24px)
- Hover: Gray background

### Cards

#### Food Card

- Border Radius: 12px
- Shadow: `0 4px 6px rgba(0, 0, 0, 0.1)`
- Hover Effect: Scale 1.02, shadow increase
- Image Ratio: 4:3
- Padding: 12px
- Gap between elements: 8px

#### Restaurant Card

- Similar to Food Card
- Include rating, delivery time, delivery fee
- Badge positioning: Top-right corner

### Input Fields

- Border: 1px solid `#E5E7EB`
- Border Radius: 8px
- Padding: 12px 16px
- Focus: Border color to Green, shadow
- Placeholder: `#9CA3AF`
- Background: White

### Navigation

- Height: 64px
- Shadow: Subtle (0 1px 3px rgba(0, 0, 0, 0.05))
- Logo size: 40px
- Menu items: 16px font, medium weight
- Active state: Green underline or background

## Spacing System

Base unit: 8px

- **xs**: 4px
- **sm**: 8px
- **md**: 16px
- **lg**: 24px
- **xl**: 32px
- **2xl**: 48px
- **3xl**: 64px

## Layout Grid

- Container max-width: 1280px
- Gutters: 16px (mobile), 24px (tablet), 32px (desktop)
- Columns: 12 column grid

## Responsive Breakpoints

- **Mobile**: 320px - 640px
- **Tablet**: 641px - 1024px
- **Desktop**: 1025px+

## Interactive States

### Hover

- Scale: 1.02 (for cards)
- Opacity: 0.9 (for text)
- Color shift: 10% darker for colored elements

### Active / Pressed

- Scale: 0.98
- Color shift: 20% darker

### Focus

- Outline: 2px solid Green
- Outline offset: 2px

### Disabled

- Opacity: 0.5
- Cursor: not-allowed
- No hover effects

## Shadows

### Subtle

```
box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05)
```

### Small

```
box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1)
```

### Medium

```
box-shadow: 0 10px 15px rgba(0, 0, 0, 0.1)
```

### Large

```
box-shadow: 0 20px 25px rgba(0, 0, 0, 0.15)
```

## Accessibility

- **Color Contrast**: Maintain WCAG AA standard (4.5:1 for text)
- **Focus Indicators**: Always visible, 2px minimum
- **Touch Targets**: Minimum 44px × 44px
- **Font Size**: Minimum 16px for body text
- **Line Height**: 1.5 minimum for readability
- **Alt Text**: All images must have descriptive alt text

## Animation & Transitions

- **Default Duration**: 200ms
- **Easing**: `cubic-bezier(0.4, 0, 0.2, 1)`
- **Subtle Animations**:
  - Page transitions: 300ms fade
  - Button clicks: 150ms scale
  - Hover effects: 200ms color change
  - Modal entrance: 300ms slide + fade

## Light Mode (White)

### Color Scheme - Light

```css
:root[data-theme="light"] {
  /* Primary Colors */
  --color-primary: #10b981;
  --color-primary-dark: #059669;
  --color-primary-light: #d1fae5;

  /* Backgrounds */
  --color-bg-primary: #ffffff;
  --color-bg-secondary: #f9fafb;
  --color-bg-tertiary: #f3f4f6;

  /* Text Colors */
  --color-text-primary: #111827;
  --color-text-secondary: #6b7280;
  --color-text-tertiary: #9ca3af;

  /* Borders */
  --color-border-primary: #e5e7eb;
  --color-border-secondary: #d1d5db;

  /* Status Colors */
  --color-success: #10b981;
  --color-warning: #f59e0b;
  --color-error: #ef4444;
  --color-info: #3b82f6;

  /* Shadows */
  --shadow-subtle: 0 1px 2px rgba(0, 0, 0, 0.05);
  --shadow-sm: 0 4px 6px rgba(0, 0, 0, 0.1);
  --shadow-md: 0 10px 15px rgba(0, 0, 0, 0.1);
  --shadow-lg: 0 20px 25px rgba(0, 0, 0, 0.15);
}
```

## Dark Mode

### Color Scheme - Dark

```css
:root[data-theme="dark"] {
  /* Primary Colors */
  --color-primary: #10b981;
  --color-primary-dark: #059669;
  --color-primary-light: #064e3b;

  /* Backgrounds */
  --color-bg-primary: #0f172a;
  --color-bg-secondary: #1e293b;
  --color-bg-tertiary: #334155;

  /* Text Colors */
  --color-text-primary: #f8fafc;
  --color-text-secondary: #cbd5e1;
  --color-text-tertiary: #94a3b8;

  /* Borders */
  --color-border-primary: #475569;
  --color-border-secondary: #64748b;

  /* Status Colors */
  --color-success: #10b981;
  --color-warning: #f59e0b;
  --color-error: #ef4444;
  --color-info: #60a5fa;

  /* Shadows */
  --shadow-subtle: 0 1px 2px rgba(0, 0, 0, 0.3);
  --shadow-sm: 0 4px 6px rgba(0, 0, 0, 0.4);
  --shadow-md: 0 10px 15px rgba(0, 0, 0, 0.5);
  --shadow-lg: 0 20px 25px rgba(0, 0, 0, 0.6);
}
```

### Implementation Guide

#### 1. HTML Setup

```html
<!-- Default to light mode -->
<html data-theme="light">
  <head>
    <meta name="theme-color" content="#10B981" />
  </head>
  <body>
    <!-- Content -->
  </body>
</html>
```

#### 2. CSS Usage

```css
/* Use CSS custom properties for all colors */
body {
  background-color: var(--color-bg-primary);
  color: var(--color-text-primary);
}

.card {
  background: var(--color-bg-secondary);
  border: 1px solid var(--color-border-primary);
  box-shadow: var(--shadow-sm);
}

.button-primary {
  background: var(--color-primary);
  color: white;
}

.button-primary:hover {
  background: var(--color-primary-dark);
}
```

#### 3. JavaScript Theme Toggle

```javascript
// Get current theme
const getCurrentTheme = () => {
  return document.documentElement.getAttribute("data-theme") || "light";
};

// Set theme
const setTheme = (theme) => {
  document.documentElement.setAttribute("data-theme", theme);
  localStorage.setItem("theme-preference", theme);
  updateMetaThemeColor(theme);
};

// Toggle theme
const toggleTheme = () => {
  const current = getCurrentTheme();
  const newTheme = current === "light" ? "dark" : "light";
  setTheme(newTheme);
};

// Detect system preference
const detectSystemTheme = () => {
  if (
    window.matchMedia &&
    window.matchMedia("(prefers-color-scheme: dark)").matches
  ) {
    return "dark";
  }
  return "light";
};

// Initialize theme on page load
const initTheme = () => {
  const savedTheme = localStorage.getItem("theme-preference");
  const systemTheme = detectSystemTheme();
  const theme = savedTheme || systemTheme || "light";
  setTheme(theme);
};

// Listen for system theme changes
if (window.matchMedia) {
  window
    .matchMedia("(prefers-color-scheme: dark)")
    .addEventListener("change", (e) => {
      if (!localStorage.getItem("theme-preference")) {
        setTheme(e.matches ? "dark" : "light");
      }
    });
}

// Call on app startup
initTheme();
```

#### 4. Update Meta Theme Color

```javascript
const updateMetaThemeColor = (theme) => {
  const metaThemeColor = document.querySelector('meta[name="theme-color"]');
  if (metaThemeColor) {
    metaThemeColor.setAttribute(
      "content",
      theme === "dark" ? "#0F172A" : "#10B981",
    );
  }
};
```

#### 5. React Implementation Example

```typescript
// hooks/useTheme.ts
import { useEffect, useState } from "react";

export const useTheme = () => {
  const [theme, setThemeState] = useState<"light" | "dark">("light");

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme-preference") as
      | "light"
      | "dark"
      | null;
    const systemTheme = window.matchMedia("(prefers-color-scheme: dark)")
      .matches
      ? "dark"
      : "light";
    const initialTheme = savedTheme || systemTheme || "light";

    setThemeState(initialTheme);
    document.documentElement.setAttribute("data-theme", initialTheme);
  }, []);

  const setTheme = (newTheme: "light" | "dark") => {
    setThemeState(newTheme);
    document.documentElement.setAttribute("data-theme", newTheme);
    localStorage.setItem("theme-preference", newTheme);
  };

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  return { theme, setTheme, toggleTheme };
};
```

### Dark Mode Specific Guidelines

#### Typography

- Increase line-height slightly for readability: 1.6 instead of 1.5
- Use lighter text colors for better contrast against dark backgrounds
- Avoid pure white (#FFFFFF) for text; use `#F8FAFC` instead

#### Components in Dark Mode

**Cards**

- Use `--color-bg-secondary` (#1E293B) for main card background
- Border color: `--color-border-primary` (#475569)
- Shadow adjusted for dark background visibility

**Buttons**

- Primary button maintains `--color-primary` (#10B981)
- Increase hover contrast: use `--color-primary-dark` (#059669)
- Secondary button text: `--color-primary` on dark background

**Images**

- Add subtle border in dark mode to improve visibility
- Consider border: 1px solid `var(--color-border-primary)`

**Forms & Inputs**

- Background: `--color-bg-secondary` (#1E293B)
- Border: `--color-border-primary` (#475569)
- Text: `--color-text-primary` (#F8FAFC)
- Placeholder: `--color-text-tertiary` (#94A3B8)

#### Accessibility in Dark Mode

- Maintain WCAG AA contrast ratios (4.5:1 for text)
- Test color contrast combinations for both modes
- Use tools like WebAIM contrast checker

### Transition Between Themes

```css
/* Smooth transition between themes */
* {
  transition:
    background-color 200ms ease-in-out,
    color 200ms ease-in-out,
    border-color 200ms ease-in-out;
}
```

### Testing Checklist

- [ ] Test all components in both light and dark modes
- [ ] Verify text contrast meets WCAG AA standards in both modes
- [ ] Test theme persistence across page reloads
- [ ] Test system preference detection
- [ ] Test manual theme toggle
- [ ] Verify images are visible in both modes
- [ ] Test on different devices and screen sizes
- [ ] Check performance (no jank during transitions)
