import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        // Menu design tokens — set via CSS custom properties at runtime
        menu: {
          primary: "var(--menu-primary)",
          accent: "var(--menu-accent)",
          bg: "var(--menu-bg)",
          text: "var(--menu-text)",
          surface: "var(--menu-surface)",
          "surface-hover": "var(--menu-surface-hover)",
          "text-secondary": "var(--menu-text-secondary)",
          "text-muted": "var(--menu-text-muted)",
          "accent-hover": "var(--menu-accent-hover)",
          "accent-text": "var(--menu-accent-text)",
          border: "var(--menu-border)",
          "border-subtle": "var(--menu-border-subtle)",
          badge: "var(--menu-badge)",
          "badge-text": "var(--menu-badge-text)",
        },
      },
      fontFamily: {
        "menu-heading": "var(--menu-font-heading)",
        "menu-body": "var(--menu-font-body)",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
        xl: "calc(var(--radius) + 4px)",
        "2xl": "calc(var(--radius) + 8px)",
        pill: "9999px",
        menu: "var(--menu-radius)",
        "menu-sm": "var(--menu-radius-sm)",
        "menu-md": "var(--menu-radius-md)",
        "menu-lg": "var(--menu-radius-lg)",
        "menu-pill": "var(--menu-radius-pill)",
      },
      boxShadow: {
        "menu-sm": "var(--menu-shadow-sm)",
        "menu-md": "var(--menu-shadow-md)",
        "menu-lg": "var(--menu-shadow-lg)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "scale-in": {
          "0%": { opacity: "0", transform: "scale(0.95)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        "pulse-glow": {
          "0%, 100%": { boxShadow: "0 0 0 0 rgba(232, 114, 92, 0.4)" },
          "50%": { boxShadow: "0 0 0 8px rgba(232, 114, 92, 0)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-up": "fade-up 0.5s ease-out forwards",
        "scale-in": "scale-in 0.3s ease-out forwards",
        "pulse-glow": "pulse-glow 2s ease-in-out infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
export default config;
