import { v4 as uuidv4 } from 'uuid';
import { getThemeById } from './themes';
import type { ThemeDefinition, ThemeId } from './types';

export function generateId(): string {
  return uuidv4();
}

export function formatPrice(price: number, currency: string): string {
  return `${currency}${price.toFixed(0)}`;
}

export function getContrastColor(hex: string): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.5 ? '#000000' : '#FFFFFF';
}

export function getWhatsAppUrl(number: string, restaurantName: string): string {
  const cleaned = number.replace(/\s+/g, '').replace(/[^+\d]/g, '');
  const message = encodeURIComponent(
    `Hi! I'd like to make a reservation at ${restaurantName}`
  );
  return `https://wa.me/${cleaned}?text=${message}`;
}

export function getGoogleMapsUrl(address: string): string {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
}

import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function compressImage(file: File, maxWidth: number = 1200, maxSizeKB: number = 500): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        if (width > maxWidth) {
          height = (height * maxWidth) / width;
          width = maxWidth;
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Could not get canvas context'));
          return;
        }
        ctx.drawImage(img, 0, 0, width, height);

        let quality = 0.8;
        let result = canvas.toDataURL('image/jpeg', quality);

        while (result.length > maxSizeKB * 1024 * 1.37 && quality > 0.1) {
          quality -= 0.1;
          result = canvas.toDataURL('image/jpeg', quality);
        }

        resolve(result);
      };
      img.onerror = reject;
      img.src = e.target?.result as string;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export function debounce<T extends (...args: unknown[]) => void>(fn: T, ms: number): T {
  let timer: NodeJS.Timeout;
  return ((...args: unknown[]) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), ms);
  }) as T;
}

/**
 * Border radius map shared across menu components.
 * Maps the design token to a CSS value.
 */
export const BORDER_RADIUS_MAP: Record<string, string> = {
  none: "0px",
  sm: "4px",
  md: "8px",
  lg: "16px",
  full: "9999px",
};

/* ---- Color utility helpers ---- */

function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const h = hex.replace('#', '');
  return {
    r: parseInt(h.slice(0, 2), 16),
    g: parseInt(h.slice(2, 4), 16),
    b: parseInt(h.slice(4, 6), 16),
  };
}

function rgbToHex(r: number, g: number, b: number): string {
  const clamp = (v: number) => Math.max(0, Math.min(255, Math.round(v)));
  return '#' + [clamp(r), clamp(g), clamp(b)].map((v) => v.toString(16).padStart(2, '0')).join('');
}

function mixColors(base: string, overlay: string, amount: number): string {
  const b = hexToRgb(base);
  const o = hexToRgb(overlay);
  return rgbToHex(
    b.r + (o.r - b.r) * amount,
    b.g + (o.g - b.g) * amount,
    b.b + (o.b - b.b) * amount,
  );
}

function blendWithWhite(hex: string, opacity: number): string {
  const c = hexToRgb(hex);
  return rgbToHex(
    c.r * opacity + 255 * (1 - opacity),
    c.g * opacity + 255 * (1 - opacity),
    c.b * opacity + 255 * (1 - opacity),
  );
}

function darken(hex: string, amount: number): string {
  const c = hexToRgb(hex);
  return rgbToHex(c.r * (1 - amount), c.g * (1 - amount), c.b * (1 - amount));
}

/**
 * Derive extended design tokens from the 4 core colors.
 * Used when no theme is active or the user has customized away from a theme.
 */
function deriveExtendedTokens(design: {
  primaryColor: string;
  accentColor: string;
  backgroundColor: string;
  textColor: string;
}) {
  const isDarkBg = getContrastColor(design.backgroundColor) === '#000000';

  return {
    surface: isDarkBg
      ? mixColors(design.backgroundColor, '#FFFFFF', 0.04)
      : '#FFFFFF',
    surfaceHover: mixColors(design.backgroundColor, design.primaryColor, 0.06),
    textSecondary: mixColors(design.backgroundColor, design.textColor, 0.70),
    textMuted: mixColors(design.backgroundColor, design.textColor, 0.45),
    accentHover: darken(design.accentColor, 0.12),
    accentText: getContrastColor(design.accentColor),
    border: mixColors(design.backgroundColor, design.primaryColor, 0.12),
    borderSubtle: mixColors(design.backgroundColor, design.primaryColor, 0.06),
    badge: isDarkBg
      ? mixColors(design.backgroundColor, design.accentColor, 0.12)
      : blendWithWhite(design.accentColor, 0.10),
    badgeText: design.accentColor,
  };
}

/**
 * Returns a CSSProperties object that sets CSS custom properties
 * for the menu design tokens. Spread this onto a wrapper element's
 * `style` prop so that Tailwind `menu-*` utilities resolve correctly.
 *
 * When a themeId is present and the 4 core colors still match the theme,
 * exact theme tokens are used. Otherwise, extended tokens are derived.
 */
export function getMenuDesignTokens(
  design: {
    primaryColor: string;
    accentColor: string;
    backgroundColor: string;
    textColor: string;
    headingFont: string;
    bodyFont: string;
    borderRadius: string;
    themeId?: ThemeId;
  }
): React.CSSProperties {
  // Check if a theme still applies (user hasn't customized away from it)
  let themeMatch: ThemeDefinition | undefined;
  if (design.themeId) {
    const theme = getThemeById(design.themeId);
    if (
      theme &&
      design.primaryColor === theme.colors.primary &&
      design.accentColor === theme.colors.accent &&
      design.backgroundColor === theme.colors.bg &&
      design.textColor === theme.colors.text
    ) {
      themeMatch = theme;
    }
  }

  const extended = themeMatch
    ? {
        surface: themeMatch.colors.surface,
        surfaceHover: themeMatch.colors.surfaceHover,
        textSecondary: themeMatch.colors.textSecondary,
        textMuted: themeMatch.colors.textMuted,
        accentHover: themeMatch.colors.accentHover,
        accentText: themeMatch.colors.accentText,
        border: themeMatch.colors.border,
        borderSubtle: themeMatch.colors.borderSubtle,
        badge: themeMatch.colors.badge,
        badgeText: themeMatch.colors.badgeText,
      }
    : deriveExtendedTokens(design);

  return {
    // Core tokens
    '--menu-primary': design.primaryColor,
    '--menu-accent': design.accentColor,
    '--menu-bg': design.backgroundColor,
    '--menu-text': design.textColor,
    '--menu-font-heading': design.headingFont,
    '--menu-font-body': design.bodyFont,
    '--menu-radius': BORDER_RADIUS_MAP[design.borderRadius] ?? '8px',
    // Extended color tokens
    '--menu-surface': extended.surface,
    '--menu-surface-hover': extended.surfaceHover,
    '--menu-text-secondary': extended.textSecondary,
    '--menu-text-muted': extended.textMuted,
    '--menu-accent-hover': extended.accentHover,
    '--menu-accent-text': extended.accentText,
    '--menu-border': extended.border,
    '--menu-border-subtle': extended.borderSubtle,
    '--menu-badge': extended.badge,
    '--menu-badge-text': extended.badgeText,
    // Radius tokens
    '--menu-radius-sm': themeMatch ? themeMatch.radius.sm : '4px',
    '--menu-radius-md': themeMatch ? themeMatch.radius.md : (BORDER_RADIUS_MAP[design.borderRadius] ?? '8px'),
    '--menu-radius-lg': themeMatch ? themeMatch.radius.lg : '16px',
    '--menu-radius-pill': '9999px',
    // Shadow tokens
    '--menu-shadow-sm': themeMatch ? themeMatch.shadows.sm : '0 1px 2px rgba(0,0,0,0.05)',
    '--menu-shadow-md': themeMatch ? themeMatch.shadows.md : '0 4px 6px rgba(0,0,0,0.07)',
    '--menu-shadow-lg': themeMatch ? themeMatch.shadows.lg : '0 10px 15px rgba(0,0,0,0.1)',
  } as React.CSSProperties;
}
