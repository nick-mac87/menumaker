"use client";

import React, { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { FontPairing } from "@/lib/types";
import { fontPairings, getFontUrl, getAllFontNames } from "@/lib/fonts";

interface FontSelectorProps {
  value: string;
  onChange: (pairingId: string) => void;
}

export default function FontSelector({ value, onChange }: FontSelectorProps) {
  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {
    const allFonts = getAllFontNames();
    const url = getFontUrl(allFonts);

    const existing = document.querySelector(`link[href="${url}"]`);
    if (existing) {
      setFontsLoaded(true);
      return;
    }

    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = url;
    link.onload = () => setFontsLoaded(true);
    document.head.appendChild(link);

    return () => {
      // Keep the link so fonts stay cached across re-renders
    };
  }, []);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      {fontPairings.map((pairing) => (
        <FontCard
          key={pairing.id}
          pairing={pairing}
          isActive={value === pairing.id}
          fontsLoaded={fontsLoaded}
          onClick={() => onChange(pairing.id)}
        />
      ))}
    </div>
  );
}

interface FontCardProps {
  pairing: FontPairing;
  isActive: boolean;
  fontsLoaded: boolean;
  onClick: () => void;
}

function FontCard({ pairing, isActive, fontsLoaded, onClick }: FontCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex flex-col gap-2 rounded-xl border p-4 text-left transition-all duration-150",
        "hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1",
        isActive
          ? "border-primary ring-2 ring-ring/30 shadow-sm bg-primary/5"
          : "border-border hover:border-border/80 bg-background"
      )}
    >
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
          {pairing.name}
        </span>
        {isActive && (
          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary">
            <svg
              className="h-3 w-3 text-white"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={3}
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4.5 12.75l6 6 9-13.5"
              />
            </svg>
          </span>
        )}
      </div>

      <div
        className={cn(
          "transition-opacity duration-300",
          fontsLoaded ? "opacity-100" : "opacity-40"
        )}
      >
        <p
          className="text-lg font-bold text-foreground leading-tight"
          style={{ fontFamily: `'${pairing.headingFont}', serif` }}
        >
          Daily Specials
        </p>
        <p
          className="text-sm text-muted-foreground mt-1 leading-relaxed"
          style={{ fontFamily: `'${pairing.bodyFont}', sans-serif` }}
        >
          Freshly prepared with local ingredients
        </p>
      </div>

      <div className="flex gap-1 mt-1 flex-wrap">
        <span className="text-[10px] text-muted-foreground bg-muted rounded px-1.5 py-0.5">
          {pairing.headingFont}
        </span>
        <span className="text-[10px] text-muted-foreground bg-muted rounded px-1.5 py-0.5">
          {pairing.bodyFont}
        </span>
      </div>
    </button>
  );
}
