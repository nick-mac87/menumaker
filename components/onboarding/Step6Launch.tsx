"use client";

import React, { useState, useEffect } from "react";
import { Menu } from "@/lib/types";
import { cn } from "@/lib/utils";
import Button from "@/components/ui/Button";
import QRCode, { downloadQRCode } from "@/components/ui/QRCode";
import {
  ExternalLink,
  Download,
  LayoutDashboard,
  Check,
  Copy,
  PartyPopper,
} from "lucide-react";

interface StepProps {
  menu: Menu;
  updateMenu: (updates: Partial<Menu>) => void;
  updateRestaurant: (updates: Partial<Menu["restaurant"]>) => void;
  updateDesign: (updates: Partial<Menu["design"]>) => void;
}

interface Step6LaunchProps extends StepProps {
  menuUrl: string;
}

export default function Step6Launch({ menu, menuUrl }: Step6LaunchProps) {
  const [copied, setCopied] = useState(false);
  const [showConfetti, setShowConfetti] = useState(true);

  const origin =
    typeof window !== "undefined" ? window.location.origin : "";
  const fullMenuUrl = `${origin}/menu/${menu.id}`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(menuUrl || fullMenuUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      const input = document.createElement("input");
      input.value = menuUrl || fullMenuUrl;
      document.body.appendChild(input);
      input.select();
      document.execCommand("copy");
      document.body.removeChild(input);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => setShowConfetti(false), 4000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="flex flex-col items-center gap-8 text-center">
      {/* Celebration section */}
      <div className="relative w-full py-8">
        {/* Confetti animation */}
        {showConfetti && (
          <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
            {Array.from({ length: 30 }).map((_, i) => (
              <span
                key={i}
                className="confetti-dot"
                style={{
                  left: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 1.5}s`,
                  animationDuration: `${2 + Math.random() * 2}s`,
                  backgroundColor: [
                    "#E8725C",
                    "#2AA198",
                    "#F59E0B",
                    "#7C5CFC",
                    "#3B82F6",
                    "#EC4899",
                  ][i % 6],
                }}
              />
            ))}
          </div>
        )}

        <div className="relative z-10 flex flex-col items-center gap-3">
          <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center">
            <PartyPopper className="w-8 h-8 text-primary" />
          </div>
          <h2 className="text-3xl font-extrabold text-foreground">
            You&apos;re live!
          </h2>
          <p className="text-muted-foreground max-w-md">
            Your menu is ready to share with the world. Customers can scan the
            QR code or visit the link below.
          </p>
        </div>
      </div>

      {/* URL field */}
      <div className="w-full max-w-md">
        <label className="text-sm font-medium text-foreground/70 block text-left mb-1.5">
          Your menu URL
        </label>
        <div className="flex">
          <input
            type="text"
            readOnly
            value={menuUrl || fullMenuUrl}
            className="flex-1 rounded-l-xl border border-border px-3 py-2.5 text-sm text-foreground bg-muted/50 truncate focus:outline-none"
          />
          <button
            type="button"
            onClick={handleCopy}
            className={cn(
              "inline-flex items-center gap-1.5 rounded-r-xl border border-l-0 px-4 py-2.5 text-sm font-semibold transition-all duration-200",
              copied
                ? "bg-teal-500 border-teal-500 text-white"
                : "bg-card border-border text-foreground hover:bg-accent"
            )}
          >
            {copied ? (
              <>
                <Check className="w-4 h-4" />
                Copied!
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                Copy
              </>
            )}
          </button>
        </div>
      </div>

      {/* QR Code preview */}
      <div className="flex flex-col items-center gap-3">
        <div className="w-52 h-52 rounded-2xl border border-border bg-white flex items-center justify-center p-3">
          <QRCode
            url={menuUrl || fullMenuUrl}
            color={menu.design.primaryColor}
            logo={menu.restaurant.logo || undefined}
            size={184}
          />
        </div>
        <span className="text-xs text-muted-foreground">
          Scan to view your menu
        </span>
      </div>

      {/* Action buttons */}
      <div className="flex flex-col gap-3 w-full max-w-md">
        {/* Primary CTA - Go to Dashboard */}
        <a
          href={`/dashboard/${menu.id}`}
          className="block w-full"
        >
          <button
            type="button"
            className="w-full inline-flex items-center justify-center gap-2 px-6 py-4 text-lg font-semibold text-primary-foreground rounded-2xl shadow-warm-lg transition-all duration-150 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-primary/40 bg-primary hover:bg-[#d4654f] active:scale-[0.98]"
          >
            <LayoutDashboard className="w-5 h-5" />
            Go to Dashboard
          </button>
        </a>

        <p className="text-sm text-muted-foreground -mt-1">
          Your dashboard is where you manage your menu, track views, and share your menu with customers.
        </p>

        <div className="flex flex-col sm:flex-row gap-3">
          {/* View your menu */}
          <a
            href={`/menu/${menu.id}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1"
          >
            <Button variant="primary" size="lg" className="w-full">
              <ExternalLink className="w-4 h-4" />
              View your menu
            </Button>
          </a>

          {/* Download QR Code */}
          <Button
            variant="secondary"
            size="lg"
            className="flex-1"
            onClick={() => {
              downloadQRCode(
                menuUrl || fullMenuUrl,
                menu.design.primaryColor,
                menu.restaurant.logo || undefined,
                `${menu.restaurant.name || "menu"}-qr-code.png`
              );
            }}
          >
            <Download className="w-4 h-4" />
            Download QR Code
          </Button>
        </div>
      </div>

      {/* Confetti CSS animation */}
      <style jsx>{`
        @keyframes confetti-fall {
          0% {
            transform: translateY(-20px) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(300px) rotate(720deg);
            opacity: 0;
          }
        }
        .confetti-dot {
          position: absolute;
          top: -10px;
          width: 8px;
          height: 8px;
          border-radius: 50%;
          animation: confetti-fall linear forwards;
        }
      `}</style>
    </div>
  );
}
