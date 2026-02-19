"use client";

import { ThemeId, ThemeDefinition } from "@/lib/types";
import { themeDefinitions } from "@/lib/themes";
import { cn } from "@/lib/utils";

interface ThemeSelectorProps {
  value?: ThemeId;
  onChange: (themeId: ThemeId) => void;
}

export default function ThemeSelector({ value, onChange }: ThemeSelectorProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
      {themeDefinitions.map((theme) => (
        <ThemeCard
          key={theme.id}
          theme={theme}
          isActive={value === theme.id}
          onClick={() => onChange(theme.id)}
        />
      ))}
    </div>
  );
}

function ThemeCard({
  theme,
  isActive,
  onClick,
}: {
  theme: ThemeDefinition;
  isActive: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex flex-col rounded-xl border overflow-hidden text-left transition-all duration-150",
        "hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1",
        isActive
          ? "ring-2 shadow-sm"
          : "border-border hover:border-border/80"
      )}
      style={{
        borderColor: isActive ? theme.colors.accent : undefined,
        boxShadow: isActive
          ? `0 0 0 2px ${theme.colors.accent}40`
          : undefined,
      }}
    >
      {/* Preview block */}
      <div
        className="relative px-3 pt-3 pb-2"
        style={{ backgroundColor: theme.colors.bg }}
      >
        {/* Mini restaurant name preview */}
        <div
          className="text-sm font-normal leading-tight truncate"
          style={{
            fontFamily: theme.fonts.heading,
            color: theme.colors.text,
            letterSpacing: "-0.02em",
          }}
        >
          Restaurant
        </div>
        <div
          className="text-[10px] mt-0.5 truncate"
          style={{
            fontFamily: theme.fonts.body,
            color: theme.colors.textMuted,
            fontStyle: "italic",
          }}
        >
          Fresh seasonal food
        </div>

        {/* Color dots */}
        <div className="flex gap-1.5 mt-2">
          {[
            theme.colors.primary,
            theme.colors.accent,
            theme.colors.bg,
            theme.colors.text,
          ].map((color, i) => (
            <div
              key={i}
              className="w-3.5 h-3.5 rounded-full border"
              style={{
                backgroundColor: color,
                borderColor:
                  color === theme.colors.bg
                    ? theme.colors.border
                    : "transparent",
              }}
            />
          ))}
        </div>
      </div>

      {/* Label bar */}
      <div className="px-3 py-2 border-t border-border/50 bg-card">
        <div className="flex items-center gap-1.5">
          <span className="text-xs">{theme.emoji}</span>
          <span className="text-xs font-semibold text-foreground truncate">
            {theme.name}
          </span>
        </div>
        <p className="text-[10px] text-muted-foreground mt-0.5 leading-tight truncate">
          {theme.description}
        </p>
      </div>
    </button>
  );
}
