"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { patterns, getPatternStyle } from "@/lib/patterns";

interface PatternSelectorProps {
  value: string;
  onChange: (patternId: string) => void;
  previewColor?: string;
}

export default function PatternSelector({
  value,
  onChange,
  previewColor = "#333333",
}: PatternSelectorProps) {
  return (
    <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
      {patterns.map((pattern) => {
        const isActive = value === pattern.id;
        const patternStyle = getPatternStyle(pattern.id, previewColor);

        return (
          <button
            key={pattern.id}
            type="button"
            onClick={() => onChange(pattern.id)}
            className={cn(
              "group relative flex flex-col items-center gap-1.5 rounded-xl border p-2 transition-all duration-150",
              "hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1",
              isActive
                ? "border-primary ring-2 ring-ring/30 shadow-sm"
                : "border-border hover:border-border/80"
            )}
          >
            <div className="relative w-full aspect-square rounded-lg bg-muted/50 overflow-hidden">
              {pattern.id === "none" ? (
                <div className="flex h-full w-full items-center justify-center">
                  <svg
                    className="h-5 w-5 text-muted-foreground/40"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728L5.636 5.636m12.728 0A9 9 0 015.636 18.364"
                    />
                  </svg>
                </div>
              ) : (
                <div
                  className="absolute inset-0"
                  style={{
                    ...patternStyle,
                    opacity: 0.3,
                  }}
                />
              )}

              {isActive && (
                <div className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary">
                  <svg
                    className="h-2.5 w-2.5 text-white"
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
                </div>
              )}
            </div>

            <span
              className={cn(
                "text-[11px] font-medium leading-none",
                isActive ? "text-primary" : "text-muted-foreground"
              )}
            >
              {pattern.name}
            </span>
          </button>
        );
      })}
    </div>
  );
}
