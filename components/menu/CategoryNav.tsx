"use client";

import { Category, Menu, BadgeConfig } from "@/lib/types";
import { cn } from "@/lib/utils";
import { getActiveBadgesOnMenu } from "@/lib/badges";

interface CategoryNavProps {
  categories: Category[];
  specials: { enabled: boolean; title: string };
  design: Menu["design"];
  activeCategory: string;
  onCategoryClick: (categoryId: string) => void;
  badges: BadgeConfig[];
  activeBadgeFilters: string[];
  onBadgeFilterToggle: (badgeId: string) => void;
  delivery?: Menu["restaurant"]["delivery"];
  onRecordEvent?: (eventType: string) => void;
}

export default function CategoryNav({
  categories,
  specials,
  activeCategory,
  onCategoryClick,
  badges,
  activeBadgeFilters,
  onBadgeFilterToggle,
}: CategoryNavProps) {
  // Determine which badges are actually used on menu items
  const specialsData = specials.enabled ? { items: [] as { badge?: string }[] } : undefined;
  const activeBadges = getActiveBadgesOnMenu(badges, categories, specialsData);
  const showBadgeFilters = activeBadges.length > 0;

  const noFiltersActive = activeBadgeFilters.length === 0;

  return (
    <nav
      className="sticky top-0 z-10"
      style={{
        backgroundColor: "var(--menu-bg)",
        borderBottom: "1px solid var(--menu-border-subtle)",
        boxShadow: "var(--menu-shadow-sm)",
      }}
    >
      {/* Category pills row */}
      <div
        className="flex gap-1.5 overflow-x-auto px-4 py-2.5 hide-scrollbar"
        style={{ fontFamily: "var(--menu-font-body)" }}
      >
        {/* Specials tab (first, if enabled) */}
        {specials.enabled && (
          <NavPill
            label={specials.title}
            isActive={activeCategory === "specials"}
            onClick={() => onCategoryClick("specials")}
          />
        )}

        {/* Category tabs */}
        {categories.map((cat) => (
          <NavPill
            key={cat.id}
            label={cat.name}
            isActive={activeCategory === cat.id}
            onClick={() => onCategoryClick(cat.id)}
          />
        ))}
      </div>

      {/* Badge filter row */}
      {showBadgeFilters && (
        <div
          className="flex items-center gap-1.5 overflow-x-auto px-4 pb-2.5 hide-scrollbar"
          style={{ fontFamily: "var(--menu-font-body)" }}
        >
          {/* "All" chip */}
          <button
            onClick={() => {
              activeBadgeFilters.forEach((id) => onBadgeFilterToggle(id));
            }}
            className="flex-shrink-0 px-2.5 py-1 text-[11px] font-semibold transition-all whitespace-nowrap"
            style={{
              borderRadius: "var(--menu-radius-pill)",
              ...(noFiltersActive
                ? {
                    backgroundColor: "var(--menu-badge)",
                    color: "var(--menu-badge-text)",
                  }
                : {
                    backgroundColor: "var(--menu-surface)",
                    color: "var(--menu-text-muted)",
                  }),
            }}
          >
            All
          </button>

          {/* Badge chips — use badge's own color */}
          {activeBadges.map((badge) => {
            const isActive = activeBadgeFilters.includes(badge.id);
            return (
              <button
                key={badge.id}
                onClick={() => onBadgeFilterToggle(badge.id)}
                className="flex-shrink-0 px-2.5 py-1 text-[11px] font-semibold transition-all whitespace-nowrap"
                style={{
                  borderRadius: "var(--menu-radius-pill)",
                  ...(isActive
                    ? {
                        backgroundColor: `${badge.color}25`,
                        color: badge.color,
                        boxShadow: `0 0 0 1px ${badge.color}40`,
                      }
                    : {
                        backgroundColor: `${badge.color}0C`,
                        color: `${badge.color}BB`,
                      }),
                }}
              >
                {badge.icon} {badge.label}
              </button>
            );
          })}
        </div>
      )}
    </nav>
  );
}

function NavPill({
  label,
  isActive,
  onClick,
}: {
  label: string;
  isActive: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex-shrink-0 px-4 py-1.5 text-sm font-semibold transition-all whitespace-nowrap"
      )}
      style={{
        borderRadius: "var(--menu-radius-pill)",
        ...(isActive
          ? {
              backgroundColor: "var(--menu-accent)",
              color: "var(--menu-accent-text)",
              boxShadow: "var(--menu-shadow-sm)",
            }
          : {
              backgroundColor: "var(--menu-surface)",
              color: "var(--menu-text-secondary)",
            }),
      }}
    >
      {label}
    </button>
  );
}
