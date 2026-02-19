export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  image?: string;
  tags?: string[];
  badge?: string; // badge config id
  available: boolean;
}

export interface Category {
  id: string;
  name: string;
  description?: string;
  image?: string;
  items: MenuItem[];
}

export interface GalleryImage {
  id: string;
  src: string; // base64
  caption?: string;
  linkedItemId?: string;
  createdAt: string;
}

export interface BadgeConfig {
  id: string;
  label: string;
  icon: string; // emoji
  color: string; // hex
  enabled: boolean;
}

export interface DeliveryPlatform {
  name: string;
  url: string;
}

export interface Menu {
  id: string;
  createdAt: string;
  updatedAt: string;
  plan: 'free' | 'pro';

  restaurant: {
    name: string;
    tagline: string;
    logo: string;
    coverImage?: string;
    location: {
      address: string;
      googleMapsUrl?: string;
    };
    contact: {
      phone?: string;
      whatsapp?: string;
      email?: string;
    };
    social: {
      instagram?: string;
      facebook?: string;
      tiktok?: string;
      website?: string;
    };
    hours?: Record<string, string>;
    delivery?: {
      uberEats?: string;
      wolt?: string;
      mrD?: string;
      deliveroo?: string;
      custom?: DeliveryPlatform[];
    };
    bookingEnabled: boolean;
    bookingUrl?: string;
  };

  design: {
    primaryColor: string;
    accentColor: string;
    backgroundColor: string;
    textColor: string;
    headingFont: string;
    bodyFont: string;
    backgroundPattern: string;
    borderRadius: 'none' | 'sm' | 'md' | 'lg' | 'full';
    menuStyle: 'clean' | 'classic' | 'bold';
    themeId?: ThemeId;
  };

  specials: {
    enabled: boolean;
    title: string;
    items: MenuItem[];
  };

  categories: Category[];
  gallery: GalleryImage[];
  badges: BadgeConfig[];
}

export type OnboardingStep = 1 | 2 | 3 | 4 | 5 | 6;

export interface FontPairing {
  id: string;
  name: string;
  headingFont: string;
  bodyFont: string;
}

export interface ColorPreset {
  id: string;
  name: string;
  primaryColor: string;
  accentColor: string;
  backgroundColor: string;
  textColor: string;
}

export interface PatternConfig {
  id: string;
  name: string;
  css: string;
}

export type StatEventType =
  | 'menu_view'
  | 'qr_scan'
  | 'whatsapp_click'
  | 'phone_click'
  | 'directions_click'
  | 'social_click'
  | 'delivery_click'
  | 'booking_click';

export interface MenuStats {
  totals: Record<string, number>;
  daily: Record<string, Record<string, number>>;
}

// ---- Theme System ----

export type ThemeId =
  | 'fun'
  | 'classy'
  | 'funky'
  | 'chic'
  | 'classic-theme'
  | 'finedining'
  | 'asian'
  | 'tapas'
  | 'coastal'
  | 'garden';

export interface ThemeColors {
  primary: string;
  bg: string;
  surface: string;
  surfaceHover: string;
  text: string;
  textSecondary: string;
  textMuted: string;
  accent: string;
  accentHover: string;
  accentText: string;
  border: string;
  borderSubtle: string;
  badge: string;
  badgeText: string;
}

export interface ThemeDefinition {
  id: ThemeId;
  name: string;
  description: string;
  emoji: string;
  colors: ThemeColors;
  fonts: { heading: string; body: string };
  radius: { sm: string; md: string; lg: string; pill: string };
  shadows: { sm: string; md: string; lg: string };
  backgroundPattern: string;
  borderRadius: 'none' | 'sm' | 'md' | 'lg' | 'full';
}
