"use client";

import React, { useState, useCallback, useMemo } from "react";
import { Menu } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Check, AlertCircle, Plus, Trash2, ExternalLink, ChevronDown } from "lucide-react";

type Delivery = Menu["restaurant"]["delivery"];

export interface DeliveryPlatformCardsProps {
  delivery: Delivery;
  onChange: (delivery: Delivery) => void;
}

interface PlatformConfig {
  key: "uberEats" | "wolt" | "mrD" | "deliveroo";
  name: string;
  emoji: string;
  brandColor: string;
  placeholder: string;
  validate: (url: string) => boolean;
  detectPattern: RegExp;
}

const PLATFORMS: PlatformConfig[] = [
  {
    key: "uberEats",
    name: "Uber Eats",
    emoji: "🛵",
    brandColor: "#06C167",
    placeholder: "https://www.ubereats.com/za/store/your-restaurant/...",
    validate: (url) => url.includes("ubereats.com"),
    detectPattern: /ubereats\.com/i,
  },
  {
    key: "wolt",
    name: "Wolt",
    emoji: "🔵",
    brandColor: "#009DE0",
    placeholder: "https://wolt.com/en/zaf/cape-town/restaurant/your-restaurant",
    validate: (url) => url.includes("wolt.com"),
    detectPattern: /wolt\.com/i,
  },
  {
    key: "mrD",
    name: "Mr D",
    emoji: "🔴",
    brandColor: "#E8003D",
    placeholder: "https://www.mrdfood.com/restaurant/your-restaurant",
    validate: (url) => url.includes("mrdfood.com") || url.includes("mrd.co.za"),
    detectPattern: /mr[d]food\.com|mrd\.co\.za/i,
  },
  {
    key: "deliveroo",
    name: "Deliveroo",
    emoji: "🟢",
    brandColor: "#00CCBC",
    placeholder: "https://deliveroo.co.za/menu/...",
    validate: (url) => url.includes("deliveroo"),
    detectPattern: /deliveroo/i,
  },
];

function detectPlatform(url: string): PlatformConfig | null {
  for (const p of PLATFORMS) {
    if (p.detectPattern.test(url)) return p;
  }
  return null;
}

export default function DeliveryPlatformCards({
  delivery,
  onChange,
}: DeliveryPlatformCardsProps) {
  const [expandedCards, setExpandedCards] = useState<Set<string>>(new Set());
  const [suggestion, setSuggestion] = useState<{
    fromKey: string;
    toKey: string;
    toName: string;
    url: string;
  } | null>(null);

  const d = useMemo(() => delivery || {}, [delivery]);

  const toggleCard = useCallback((key: string) => {
    setExpandedCards((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  }, []);

  const updatePlatformUrl = useCallback(
    (key: string, url: string) => {
      setSuggestion(null);

      // Smart URL detection: if user pastes a URL that belongs to a different platform
      const detected = url ? detectPlatform(url) : null;
      if (detected && detected.key !== key && url.startsWith("http")) {
        const currentValue = d[detected.key as keyof typeof d];
        if (!currentValue) {
          setSuggestion({
            fromKey: key,
            toKey: detected.key,
            toName: detected.name,
            url,
          });
        }
      }

      onChange({ ...d, [key]: url || undefined });
    },
    [d, onChange]
  );

  const acceptSuggestion = useCallback(() => {
    if (!suggestion) return;
    // Move URL to correct platform, clear from wrong one
    onChange({
      ...d,
      [suggestion.fromKey]: undefined,
      [suggestion.toKey]: suggestion.url,
    });
    setExpandedCards((prev) => {
      const next = new Set(prev);
      next.add(suggestion.toKey);
      return next;
    });
    setSuggestion(null);
  }, [suggestion, d, onChange]);

  const addCustomPlatform = useCallback(() => {
    const custom = [...(d.custom || []), { name: "", url: "" }];
    onChange({ ...d, custom });
  }, [d, onChange]);

  const updateCustom = useCallback(
    (index: number, field: "name" | "url", value: string) => {
      const custom = [...(d.custom || [])];
      custom[index] = { ...custom[index], [field]: value };
      onChange({ ...d, custom });
    },
    [d, onChange]
  );

  const removeCustom = useCallback(
    (index: number) => {
      const custom = [...(d.custom || [])];
      custom.splice(index, 1);
      onChange({ ...d, custom });
    },
    [d, onChange]
  );

  return (
    <div className="flex flex-col gap-3">
      {PLATFORMS.map((platform) => {
        const url = (d[platform.key] as string) || "";
        const isConnected = !!url && platform.validate(url);
        const isExpanded = expandedCards.has(platform.key);
        const hasUrl = !!url;
        const isInvalid = hasUrl && !platform.validate(url);

        return (
          <div
            key={platform.key}
            className={cn(
              "rounded-2xl border-2 transition-all duration-200 overflow-hidden",
              isConnected
                ? "border-emerald-300 bg-emerald-50/50 dark:bg-emerald-950/20 dark:border-emerald-700"
                : "border-border bg-card hover:border-border/80"
            )}
          >
            {/* Card header */}
            <button
              type="button"
              onClick={() => toggleCard(platform.key)}
              className="w-full flex items-center gap-3 px-4 py-3.5 text-left transition-colors"
            >
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center text-lg flex-shrink-0"
                style={{
                  backgroundColor: `${platform.brandColor}18`,
                }}
              >
                {platform.emoji}
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-sm text-foreground">
                  {platform.name}
                </div>
                {isConnected ? (
                  <div className="flex items-center gap-1 text-xs text-emerald-600 dark:text-emerald-400 font-medium">
                    <Check className="w-3 h-3" />
                    Connected
                  </div>
                ) : (
                  <div className="text-xs text-muted-foreground">
                    Not connected
                  </div>
                )}
              </div>
              <ChevronDown
                className={cn(
                  "w-4 h-4 text-muted-foreground transition-transform duration-200",
                  isExpanded && "rotate-180"
                )}
              />
            </button>

            {/* Expanded input */}
            {isExpanded && (
              <div className="px-4 pb-4">
                <div className="relative">
                  <input
                    type="url"
                    value={url}
                    onChange={(e) =>
                      updatePlatformUrl(platform.key, e.target.value)
                    }
                    placeholder={platform.placeholder}
                    className={cn(
                      "w-full rounded-xl border px-3 py-2.5 text-sm transition-colors",
                      "placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-offset-1",
                      isInvalid
                        ? "border-red-300 focus:ring-red-400 bg-red-50/50 dark:bg-red-950/20"
                        : isConnected
                          ? "border-emerald-300 focus:ring-emerald-400 bg-white dark:bg-background"
                          : "border-input focus:ring-ring bg-white dark:bg-background"
                    )}
                  />
                  {isConnected && (
                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                      <Check className="w-4 h-4 text-emerald-500" />
                    </div>
                  )}
                </div>
                {isInvalid && (
                  <p className="flex items-center gap-1 mt-1.5 text-xs text-red-500">
                    <AlertCircle className="w-3 h-3" />
                    URL should contain &ldquo;{platform.key === "mrD" ? "mrdfood.com or mrd.co.za" : platform.name.toLowerCase().replace(/\s/g, "") + ".com"}&rdquo;
                  </p>
                )}

                {/* Smart URL suggestion */}
                {suggestion && suggestion.fromKey === platform.key && (
                  <button
                    type="button"
                    onClick={acceptSuggestion}
                    className="mt-2 flex items-center gap-2 px-3 py-2 rounded-lg bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 text-xs text-amber-700 dark:text-amber-400 hover:bg-amber-100 dark:hover:bg-amber-950/50 transition-colors w-full"
                  >
                    <ExternalLink className="w-3 h-3 flex-shrink-0" />
                    <span>
                      This looks like a <strong>{suggestion.toName}</strong> URL.
                      Move it there?
                    </span>
                  </button>
                )}
              </div>
            )}
          </div>
        );
      })}

      {/* Custom platforms */}
      {(d.custom || []).map((custom, index) => {
        const isConnected = !!custom.name && !!custom.url;
        return (
          <div
            key={index}
            className={cn(
              "rounded-2xl border-2 p-4 transition-all duration-200",
              isConnected
                ? "border-emerald-300 bg-emerald-50/50 dark:bg-emerald-950/20 dark:border-emerald-700"
                : "border-border bg-card"
            )}
          >
            <div className="flex items-start gap-2">
              <div className="flex-1 flex flex-col gap-2">
                <input
                  type="text"
                  value={custom.name}
                  onChange={(e) => updateCustom(index, "name", e.target.value)}
                  placeholder="Platform name"
                  className="w-full rounded-xl border border-input px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-1 bg-white dark:bg-background"
                />
                <input
                  type="url"
                  value={custom.url}
                  onChange={(e) => updateCustom(index, "url", e.target.value)}
                  placeholder="https://..."
                  className="w-full rounded-xl border border-input px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-1 bg-white dark:bg-background"
                />
              </div>
              <button
                type="button"
                onClick={() => removeCustom(index)}
                className="mt-2 p-1.5 text-muted-foreground hover:text-red-500 transition-colors"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
            {isConnected && (
              <div className="flex items-center gap-1 mt-2 text-xs text-emerald-600 dark:text-emerald-400 font-medium">
                <Check className="w-3 h-3" />
                Connected
              </div>
            )}
          </div>
        );
      })}

      {/* Add custom button */}
      <button
        type="button"
        onClick={addCustomPlatform}
        className="flex items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-border px-4 py-3.5 text-sm text-muted-foreground hover:border-foreground/30 hover:text-foreground transition-colors"
      >
        <Plus className="w-4 h-4" />
        Add custom platform
      </button>
    </div>
  );
}
