"use client";

import React from "react";
import { Menu, ColorPreset, ThemeId } from "@/lib/types";
import { cn } from "@/lib/utils";
import { colorPresets } from "@/lib/colors";
import { fontPairings } from "@/lib/fonts";
import { themeDefinitions, themeToDesignFields, getThemeById } from "@/lib/themes";
import ColorPicker, { ColorPresetGrid } from "@/components/ui/ColorPicker";
import FontSelector from "@/components/ui/FontSelector";
import PatternSelector from "@/components/ui/PatternSelector";
import ThemeSelector from "@/components/ui/ThemeSelector";

interface StepProps {
  menu: Menu;
  updateMenu: (updates: Partial<Menu>) => void;
  updateRestaurant: (updates: Partial<Menu["restaurant"]>) => void;
  updateDesign: (updates: Partial<Menu["design"]>) => void;
}

const BORDER_RADIUS_OPTIONS: {
  value: Menu["design"]["borderRadius"];
  label: string;
}[] = [
  { value: "none", label: "None" },
  { value: "sm", label: "Sm" },
  { value: "md", label: "Md" },
  { value: "lg", label: "Lg" },
  { value: "full", label: "Full" },
];

const BORDER_RADIUS_PREVIEW: Record<string, string> = {
  none: "rounded-none",
  sm: "rounded-sm",
  md: "rounded-md",
  lg: "rounded-lg",
  full: "rounded-full",
};

export default function Step3Design({ menu, updateDesign }: StepProps) {
  const { design } = menu;

  // Determine active preset (if colors match any preset exactly)
  const activePreset = colorPresets.find(
    (p) =>
      p.primaryColor === design.primaryColor &&
      p.accentColor === design.accentColor &&
      p.backgroundColor === design.backgroundColor &&
      p.textColor === design.textColor
  );

  // Determine active font pairing
  const activeFontPairing = fontPairings.find(
    (p) =>
      p.headingFont === design.headingFont && p.bodyFont === design.bodyFont
  );

  const handlePresetSelect = (preset: ColorPreset) => {
    updateDesign({
      primaryColor: preset.primaryColor,
      accentColor: preset.accentColor,
      backgroundColor: preset.backgroundColor,
      textColor: preset.textColor,
    });
  };

  const handleFontSelect = (pairingId: string) => {
    const pairing = fontPairings.find((p) => p.id === pairingId);
    if (pairing) {
      updateDesign({
        headingFont: pairing.headingFont,
        bodyFont: pairing.bodyFont,
      });
    }
  };

  // Determine active theme by comparing all fields
  const activeThemeId = themeDefinitions.find((theme) => {
    const fields = themeToDesignFields(theme);
    return (
      fields.primaryColor === design.primaryColor &&
      fields.accentColor === design.accentColor &&
      fields.backgroundColor === design.backgroundColor &&
      fields.textColor === design.textColor &&
      fields.headingFont === design.headingFont &&
      fields.bodyFont === design.bodyFont
    );
  })?.id;

  const handleThemeSelect = (themeId: ThemeId) => {
    const theme = getThemeById(themeId);
    if (!theme) return;
    updateDesign(themeToDesignFields(theme));
  };

  return (
    <div className="flex flex-col gap-10">
      <div>
        <h2 className="text-3xl font-extrabold text-foreground">Make it yours</h2>
        <p className="text-base text-muted-foreground mt-1">
          Customise colours, fonts, and style to match your brand.
        </p>
      </div>

      {/* Theme picker */}
      <section className="flex flex-col gap-4">
        <div>
          <h3 className="text-base font-semibold text-foreground">Theme</h3>
          <p className="text-sm text-muted-foreground mt-0.5">
            One-click style. Customise colours and fonts below.
          </p>
        </div>
        <ThemeSelector value={activeThemeId} onChange={handleThemeSelect} />
      </section>

      {/* Color scheme */}
      <section className="flex flex-col gap-4">
        <h3 className="text-base font-semibold text-foreground">
          Colour scheme
        </h3>

        <ColorPresetGrid
          onSelect={handlePresetSelect}
          activePresetId={activePreset?.id}
        />

        <div className="grid grid-cols-2 gap-4 mt-2">
          <ColorPicker
            label="Primary"
            value={design.primaryColor}
            onChange={(c) => updateDesign({ primaryColor: c })}
          />
          <ColorPicker
            label="Accent"
            value={design.accentColor}
            onChange={(c) => updateDesign({ accentColor: c })}
          />
          <ColorPicker
            label="Background"
            value={design.backgroundColor}
            onChange={(c) => updateDesign({ backgroundColor: c })}
          />
          <ColorPicker
            label="Text"
            value={design.textColor}
            onChange={(c) => updateDesign({ textColor: c })}
          />
        </div>
      </section>

      {/* Font pairing */}
      <section className="flex flex-col gap-4">
        <h3 className="text-base font-semibold text-foreground">Font pairing</h3>
        <FontSelector
          value={activeFontPairing?.id ?? ""}
          onChange={handleFontSelect}
        />
      </section>

      {/* Background pattern */}
      <section className="flex flex-col gap-4">
        <h3 className="text-base font-semibold text-foreground">
          Background pattern
        </h3>
        <PatternSelector
          value={design.backgroundPattern}
          onChange={(id) => updateDesign({ backgroundPattern: id })}
          previewColor={design.textColor}
        />
      </section>

      {/* Border radius */}
      <section className="flex flex-col gap-4">
        <h3 className="text-base font-semibold text-foreground">
          Border radius
        </h3>
        <div className="flex gap-3">
          {BORDER_RADIUS_OPTIONS.map((opt) => {
            const isActive = design.borderRadius === opt.value;
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => updateDesign({ borderRadius: opt.value })}
                className={cn(
                  "flex flex-col items-center gap-2 rounded-xl border p-3 flex-1 transition-all duration-150",
                  "hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1",
                  isActive
                    ? "border-primary ring-2 ring-ring/30 shadow-sm"
                    : "border-border hover:border-border/80"
                )}
              >
                <div
                  className={cn(
                    "w-10 h-7 border-2 border-gray-400",
                    BORDER_RADIUS_PREVIEW[opt.value]
                  )}
                  style={{
                    backgroundColor: isActive ? design.primaryColor : "#e5e7eb",
                    borderColor: isActive ? design.primaryColor : "#9ca3af",
                  }}
                />
                <span
                  className={cn(
                    "text-xs font-medium",
                    isActive ? "text-primary" : "text-muted-foreground"
                  )}
                >
                  {opt.label}
                </span>
              </button>
            );
          })}
        </div>
      </section>
    </div>
  );
}
