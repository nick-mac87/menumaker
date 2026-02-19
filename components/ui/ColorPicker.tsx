"use client";

import React, { useCallback } from "react";
import { cn } from "@/lib/utils";
import { colorPresets } from "@/lib/colors";
import { ColorPreset } from "@/lib/types";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Label } from "@/components/ui/label";

interface ColorPickerProps {
  value: string;
  onChange: (color: string) => void;
  label?: string;
}

export default function ColorPicker({ value, onChange, label }: ColorPickerProps) {
  const handleHexChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      let hex = e.target.value;
      if (!hex.startsWith("#")) {
        hex = "#" + hex;
      }
      if (/^#[0-9A-Fa-f]{0,6}$/.test(hex)) {
        onChange(hex);
      }
    },
    [onChange]
  );

  return (
    <div className="flex flex-col gap-1.5">
      {label && <Label>{label}</Label>}
      <Popover>
        <PopoverTrigger asChild>
          <button
            type="button"
            className="flex items-center gap-2 rounded-md border border-input px-3 py-2 transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1"
          >
            <div
              className="h-6 w-6 rounded border border-black/10 shadow-sm"
              style={{ backgroundColor: value }}
            />
            <span className="text-sm font-mono text-foreground">{value}</span>
          </button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-3" align="start">
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-3">
              <div className="relative">
                <input
                  type="color"
                  value={value}
                  onChange={(e) => onChange(e.target.value)}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <div
                  className="w-10 h-10 rounded-lg border border-input shadow-sm transition-all duration-150 hover:scale-105"
                  style={{ backgroundColor: value }}
                />
              </div>
              <input
                type="text"
                value={value}
                onChange={handleHexChange}
                maxLength={7}
                className={cn(
                  "w-28 rounded-md border border-input bg-background px-3 py-2 text-sm font-mono text-foreground",
                  "transition-colors",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1"
                )}
                placeholder="#000000"
              />
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}

interface ColorPresetGridProps {
  onSelect: (preset: ColorPreset) => void;
  activePresetId?: string;
}

export function ColorPresetGrid({ onSelect, activePresetId }: ColorPresetGridProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
      {colorPresets.map((preset) => {
        const isActive = activePresetId === preset.id;
        return (
          <button
            key={preset.id}
            type="button"
            onClick={() => onSelect(preset)}
            className={cn(
              "flex flex-col gap-2 rounded-xl border p-3 text-left transition-all duration-150",
              "hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1",
              isActive
                ? "border-primary ring-2 ring-ring/30 shadow-sm"
                : "border-border hover:border-border/80"
            )}
          >
            <div className="flex gap-1.5">
              <div
                className="h-6 w-6 rounded-full border border-black/10"
                style={{ backgroundColor: preset.primaryColor }}
                title="Primary"
              />
              <div
                className="h-6 w-6 rounded-full border border-black/10"
                style={{ backgroundColor: preset.accentColor }}
                title="Accent"
              />
              <div
                className="h-6 w-6 rounded-full border border-black/10"
                style={{ backgroundColor: preset.backgroundColor }}
                title="Background"
              />
              <div
                className="h-6 w-6 rounded-full border border-black/10"
                style={{ backgroundColor: preset.textColor }}
                title="Text"
              />
            </div>
            <span className="text-xs font-medium text-muted-foreground">
              {preset.name}
            </span>
          </button>
        );
      })}
    </div>
  );
}
