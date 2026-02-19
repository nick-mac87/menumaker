"use client";

import React from "react";
import { Menu } from "@/lib/types";
import { getFormattedHours } from "@/lib/hours";
import { getMenuDesignTokens } from "@/lib/utils";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";

interface HoursModalProps {
  hours: Record<string, string>;
  design: Menu["design"];
  isOpen: boolean;
  onClose: () => void;
}

export default function HoursModal({
  hours,
  design,
  isOpen,
  onClose,
}: HoursModalProps) {
  const formattedHours = getFormattedHours(hours);

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <SheetContent
        side="bottom"
        className="rounded-t-2xl max-w-lg mx-auto px-6 pt-2 pb-8 [&>button]:hidden"
        style={{
          ...getMenuDesignTokens(design),
          backgroundColor: "var(--menu-surface)",
          color: "var(--menu-text)",
        }}
      >
        <SheetTitle className="sr-only">Opening Hours</SheetTitle>

        {/* Drag indicator */}
        <div className="flex justify-center mb-4">
          <div
            className="w-10 h-1 rounded-full"
            style={{ backgroundColor: "var(--menu-border)" }}
          />
        </div>

        {/* Header */}
        <h3
          className="text-lg font-semibold mb-4"
          style={{ fontFamily: "var(--menu-font-heading)", color: "var(--menu-text)" }}
        >
          Opening Hours
        </h3>

        {/* Hours list */}
        <div className="flex flex-col gap-3" style={{ fontFamily: "var(--menu-font-body)" }}>
          {formattedHours.map((entry, i) => (
            <div
              key={i}
              className="flex items-center justify-between py-2 px-3"
              style={{
                borderRadius: "var(--menu-radius-md)",
                backgroundColor: entry.isToday
                  ? "var(--menu-surface-hover)"
                  : "transparent",
              }}
            >
              <div className="flex items-center gap-2.5">
                {entry.isToday && (
                  <div
                    className="w-2 h-2 rounded-full flex-shrink-0"
                    style={{ backgroundColor: "var(--menu-accent)" }}
                  />
                )}
                <span
                  className="text-sm"
                  style={{
                    fontWeight: entry.isToday ? 700 : 400,
                    color: entry.isToday
                      ? "var(--menu-text)"
                      : "var(--menu-text-secondary)",
                  }}
                >
                  {entry.day}
                </span>
              </div>
              <span
                className="text-sm"
                style={{
                  fontWeight: entry.isToday ? 700 : 500,
                  color: entry.isToday
                    ? "var(--menu-accent)"
                    : "var(--menu-text)",
                }}
              >
                {entry.time}
              </span>
            </div>
          ))}
        </div>
      </SheetContent>
    </Sheet>
  );
}
