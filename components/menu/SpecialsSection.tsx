"use client";

import { Menu, MenuItem, BadgeConfig } from "@/lib/types";
import { TAG_DISPLAY } from "@/lib/defaults";
import { formatPrice, cn } from "@/lib/utils";
import { getBadgeById } from "@/lib/badges";

interface SpecialsSectionProps {
  specials: Menu["specials"];
  design: Menu["design"];
  badges: BadgeConfig[];
  activeBadgeFilters?: string[];
}

export default function SpecialsSection({
  specials,
  design,
  badges,
  activeBadgeFilters,
}: SpecialsSectionProps) {
  if (!specials.enabled || specials.items.length === 0) return null;

  const filteredItems =
    activeBadgeFilters && activeBadgeFilters.length > 0
      ? specials.items.filter(
          (item) => item.badge && activeBadgeFilters.includes(item.badge)
        )
      : specials.items;

  if (filteredItems.length === 0) return null;

  // Spec: price uses textColor when a theme is active, accentColor otherwise
  const priceColor = design.themeId
    ? "var(--menu-text)"
    : "var(--menu-accent)";

  return (
    <section id="specials" className="px-4 pt-6 pb-2">
      {/* Section title — same spec as category labels */}
      <div className="mb-1">
        <h2
          style={{
            fontFamily: "var(--menu-font-body)",
            color: "var(--menu-text-muted)",
            fontSize: "12px",
            fontWeight: 700,
            textTransform: "uppercase",
            letterSpacing: "0.1em",
          }}
        >
          {specials.title}
        </h2>
        <div
          className="mt-2"
          style={{
            height: "1.5px",
            backgroundColor: "var(--menu-border)",
          }}
        />
      </div>

      <div className="flex flex-col gap-3 mt-3">
        {filteredItems.map((item) => (
          <SpecialItemCard
            key={item.id}
            item={item}
            badges={badges}
            priceColor={priceColor}
          />
        ))}
      </div>
    </section>
  );
}

function SpecialItemCard({
  item,
  badges,
  priceColor,
}: {
  item: MenuItem;
  badges: BadgeConfig[];
  priceColor: string;
}) {
  const badge = item.badge ? getBadgeById(badges, item.badge) : undefined;
  const hasImage = !!item.image;

  return (
    <div
      className={cn("flex relative overflow-hidden", hasImage ? "gap-4" : "gap-0")}
      style={{
        padding: "14px 16px",
        borderRadius: "var(--menu-radius-lg)",
        backgroundColor: "var(--menu-surface)",
        borderLeft: "3px solid var(--menu-accent)",
      }}
    >
      {/* Image LEFT — larger for specials */}
      {hasImage && (
        <div className="flex-shrink-0">
          <img
            src={item.image}
            alt={item.name}
            className="w-[100px] h-[100px] object-cover"
            style={{ borderRadius: "var(--menu-radius-md)" }}
          />
        </div>
      )}

      {/* Text content */}
      <div className="flex-1 min-w-0">
        {/* Badge — spec: pill, badge/badgeText tokens */}
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

        {/* Name + price */}
        <div className="flex items-baseline justify-between gap-2">
          <h3
            className="leading-snug"
            style={{
              fontFamily: "var(--menu-font-body)",
              color: "var(--menu-text)",
              fontSize: "15px",
              fontWeight: 600,
              letterSpacing: "-0.01em",
            }}
          >
            {item.name}
          </h3>
          <span
            className="flex-shrink-0 whitespace-nowrap"
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

        {item.description && (
          <p
            className="mt-0.5"
            style={{
              fontFamily: "var(--menu-font-body)",
              color: "var(--menu-text-secondary)",
              fontSize: "13.5px",
              lineHeight: 1.5,
            }}
          >
            {item.description}
          </p>
        )}

        {/* Tags + sold out — dietary tag circles */}
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
