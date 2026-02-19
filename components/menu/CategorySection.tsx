"use client";

import { Category, Menu, BadgeConfig } from "@/lib/types";
import MenuItemCard from "./MenuItemCard";

interface CategorySectionProps {
  category: Category;
  design: Menu["design"];
  badges: BadgeConfig[];
  activeBadgeFilters?: string[];
}

export default function CategorySection({
  category,
  design,
  badges,
  activeBadgeFilters,
}: CategorySectionProps) {
  // Filter items by active badge filters
  const filteredItems =
    activeBadgeFilters && activeBadgeFilters.length > 0
      ? category.items.filter(
          (item) => item.badge && activeBadgeFilters.includes(item.badge)
        )
      : category.items;

  // If no items visible after filtering, hide the entire section
  if (filteredItems.length === 0) return null;

  return (
    <section id={category.id} style={{ marginBottom: "32px" }} className="px-4 pt-10 pb-4">
      {/* Category header — spec: 12px, 700, uppercase, body font, textMuted, 0.1em tracking */}
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
          {category.name}
        </h2>
        {/* Separator — spec: 1.5px solid border below label */}
        <div
          className="mt-2"
          style={{
            height: "1.5px",
            backgroundColor: "var(--menu-border)",
          }}
        />
      </div>

      {/* Category description */}
      {category.description && (
        <p
          className="text-sm mt-2 mb-3"
          style={{
            fontFamily: "var(--menu-font-body)",
            color: "var(--menu-text-secondary)",
          }}
        >
          {category.description}
        </p>
      )}

      {/* Category image */}
      {category.image && (
        <img
          src={category.image}
          alt={category.name}
          className="w-full max-h-48 object-cover mb-4"
          style={{ borderRadius: "var(--menu-radius-md)" }}
        />
      )}

      {/* Menu items with subtle dividers */}
      <div className="flex flex-col">
        {filteredItems.map((item, index) => (
          <div key={item.id}>
            <MenuItemCard item={item} design={design} badges={badges} />
            {index < filteredItems.length - 1 && (
              <div
                className="mx-4 h-px"
                style={{ backgroundColor: "var(--menu-border-subtle)" }}
              />
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
