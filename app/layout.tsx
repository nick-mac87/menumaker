import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "MenuMaker — Beautiful restaurant menus in minutes",
  description:
    "Create a beautiful, mobile-friendly restaurant menu. Share it with a QR code. Update it anytime — no app to download.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className="min-h-screen bg-background text-foreground antialiased"
        style={{ fontFamily: "'Inter', system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif" }}
      >
        {children}
      </body>
    </html>
  );
}
