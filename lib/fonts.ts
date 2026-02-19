import { FontPairing } from './types';

export const fontPairings: FontPairing[] = [
  {
    id: 'classic',
    name: 'Classic',
    headingFont: 'DM Serif Display',
    bodyFont: 'Inter',
  },
  {
    id: 'modern',
    name: 'Modern',
    headingFont: 'Space Grotesk',
    bodyFont: 'DM Sans',
  },
  {
    id: 'warm',
    name: 'Warm',
    headingFont: 'Playfair Display',
    bodyFont: 'Lato',
  },
  {
    id: 'minimal',
    name: 'Minimal',
    headingFont: 'Inter',
    bodyFont: 'Inter',
  },
  {
    id: 'bold',
    name: 'Bold',
    headingFont: 'Archivo Black',
    bodyFont: 'Work Sans',
  },
  {
    id: 'elegant',
    name: 'Elegant',
    headingFont: 'Cormorant Garamond',
    bodyFont: 'Montserrat',
  },
  {
    id: 'friendly',
    name: 'Friendly',
    headingFont: 'Nunito',
    bodyFont: 'Nunito Sans',
  },
  {
    id: 'editorial',
    name: 'Editorial',
    headingFont: 'Fraunces',
    bodyFont: 'Source Sans 3',
  },
];

export function getFontUrl(fonts: string[]): string {
  const families = fonts
    .map((f) => f.replace(/ /g, '+'))
    .map((f) => `family=${f}:wght@400;500;600;700`)
    .join('&');
  return `https://fonts.googleapis.com/css2?${families}&display=swap`;
}

const SYSTEM_FONT_FAMILIES = new Set([
  'Georgia',
  'Times New Roman',
  'Palatino Linotype',
  'Book Antiqua',
  'Palatino',
  'Trebuchet MS',
  'Gill Sans',
  'Impact',
  'Arial Black',
  'Helvetica Neue',
  'Helvetica',
  'Arial',
  'system-ui',
  '-apple-system',
  'Segoe UI',
  'sans-serif',
  'serif',
]);

/**
 * Returns true if the font name is a system/web-safe font
 * that doesn't need to be loaded from Google Fonts.
 */
export function isSystemFont(fontName: string): boolean {
  // Check exact match first
  if (SYSTEM_FONT_FAMILIES.has(fontName)) return true;
  // Check if the font string is a comma-separated list of system fonts
  const parts = fontName.split(',').map((s) => s.trim().replace(/['"]/g, ''));
  return parts.every((p) => SYSTEM_FONT_FAMILIES.has(p));
}

export function getAllFontNames(): string[] {
  const names = new Set<string>();
  fontPairings.forEach((p) => {
    names.add(p.headingFont);
    names.add(p.bodyFont);
  });
  return Array.from(names);
}
