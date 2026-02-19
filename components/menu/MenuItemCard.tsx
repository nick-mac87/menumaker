"use client";

import { useState } from "react";
import { MenuItem, Menu, BadgeConfig } from "@/lib/types";
import { TAG_DISPLAY } from "@/lib/defaults";
import { formatPrice, cn } from "@/lib/utils";
import { getBadgeById } from "@/lib/badges";

interface MenuItemCardProps {
  item: MenuItem;
  design: Menu["design"];
  badges: BadgeConfig[];
}

export default function MenuItemCard({ item, design, badges }: MenuItemCardProps) {
  const [expanded, setExpanded] = useState(false);
  const isLongDescription = (item.description?.length ?? 0) > 140;
  const badge = item.badge ? getBadgeById(badges, item.badge) : undefined;
  const hasImage = !!item.image;

  // Spec: price uses textColor when a theme is active, accentColor otherwise
  const priceColor = design.themeId
    ? "var(--menu-text)"
    : "var(--menu-accent)";

  return (
    <div
      className={cn(
        "flex transition-all hover:bg-[var(--menu-surface-hover)]",
        hasImage ? "gap-4" : "gap-0",
        !item.available && "opacity-40"
      )}
      style={{
        padding: "14px 16px",
        borderRadius: "var(--menu-radius-md)",
      }}
    >
      {/* Image LEFT — only rendered when present */}
      {hasImage && (
        <div className="flex-shrink-0">
          <img
            src={item.image}
            alt={item.name}
            className="w-[88px] h-[88px] object-cover"
            style={{ borderRadius: "var(--menu-radius-md)" }}
          />
        </div>
      )}

      {/* Text content */}
      <div className="flex-1 min-w-0">
        {/* Badge pill — spec: 2px 10px, 11px, 600, pill radius, badge/badgeText tokens */}
        {badge && (
          <span
            className="inline-flex items-center gap-1 mb-1"
            style={{
              padding: "2px 10px",
              fontSize: "11px",
              fontWeight: 600,
              letterSpacing: "0.02em",
              borderRadius: "var(--menu-radius-pill)",
              backgroundColor: "var(--menu-badge)",
              color: "var(--menu-badge-text)",
              fontFamily: "var(--menu-font-body)",
            }}
          >
            {badge.icon} {badge.label}
          </span>
        )}

        {/* Name + price row */}
        <div className="flex items-baseline justify-between gap-2">
          <h4
            className={cn(
              "leading-snug",
              !item.available && "line-through decoration-1"
            )}
            style={{
              fontFamily: "var(--menu-font-body)",
              color: "var(--menu-text)",
              fontSize: "15px",
              fontWeight: 600,
              letterSpacing: "-0.01em",
            }}
          >
            {item.name}
          </h4>

          {/* Dotted leader — only on text-only cards */}
          {!hasImage && (
            <span
              className="flex-1 border-b border-dotted mx-1 min-w-[16px] translate-y-[-3px]"
              style={{ borderColor: "var(--menu-border-subtle)" }}
              aria-hidden="true"
            />
          )}

          <span
            className={cn(
              "flex-shrink-0 whitespace-nowrap",
              !item.available && "line-through decoration-1 opacity-60"
            )}
            style={{
              fontFamily: "var(--menu-font-body)",
              color: priceColor,
              fontSize: "15px",
              fontWeight: 600,
            }}
          >
            {formatPrice(item.price, item.currency)}
          </span>
        </div>

        {/* Description — spec: 13.5px, textSecondary, line-height 1.5 */}
        {item.description && (
          <p
            className={cn(
              "mt-0.5",
              !expanded && isLongDescription && "line-clamp-2"
            )}
            style={{
              fontFamily: "var(--menu-font-body)",
              color: "var(--menu-text-secondary)",
              fontSize: "13.5px",
              lineHeight: 1.5,
            }}
            onClick={isLongDescription ? () => setExpanded(!expanded) : undefined}
            role={isLongDescription ? "button" : undefined}
          >
            {item.description}
          </p>
        )}
        {isLongDescription && (
          <button
            type="button"
            onClick={() => setExpanded(!expanded)}
            className="text-xs font-semibold mt-0.5"
            style={{ color: "var(--menu-accent)" }}
          >
            {expanded ? "Show less" : "Read more"}
          </button>
        )}

        {/* Tags + sold out */}
        {((item.tags && item.tags.length > 0) || !item.available) && (
          <div className="flex flex-wrap items-center gap-1.5 mt-1.5">
            {item.tags?.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center justify-center"
                style={{
                  width: "22px",
                  height: "22px",
                  borderRadius: "50%",
                  border: "1.5px solid var(--menu-border)",
                  fontSize: "9px",
                  fontWeight: 700,
                  letterSpacing: "0.05em",
                  color: "var(--menu-text-muted)",
                  fontFamily: "var(--menu-font-body)",
                }}
                title={TAG_DISPLAY[tag] ?? tag}
              >
                {tag}
              </span>
            ))}
            {!item.available && (
              <span
                className="inline-flex items-center px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide rounded"
                style={{
                  backgroundColor: "#EF44440F",
                  color: "#DC2626",
                }}
              >
                Sold out
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
