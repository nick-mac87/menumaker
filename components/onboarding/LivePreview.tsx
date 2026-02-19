"use client";

import React, { useState, useEffect } from "react";
import { Menu } from "@/lib/types";
import { getMenuDesignTokens } from "@/lib/utils";
import { getFontUrl, isSystemFont } from "@/lib/fonts";
import MenuHero from "@/components/menu/MenuHero";
import CategoryNav from "@/components/menu/CategoryNav";
import SpecialsSection from "@/components/menu/SpecialsSection";
import CategorySection from "@/components/menu/CategorySection";
import MenuFooter from "@/components/menu/MenuFooter";

interface LivePreviewProps {
  menu: Menu;
}

export default function LivePreview({ menu }: LivePreviewProps) {
  const [activeCategory, setActiveCategory] = useState<string>(() => {
    if (menu.specials.enabled && menu.specials.items.length > 0) {
      return "specials";
    }
    return menu.categories[0]?.id ?? "";
  });

  const [activeBadgeFilters, setActiveBadgeFilters] = useState<string[]>([]);

  const handleBadgeFilterToggle = (badgeId: string) => {
    setActiveBadgeFilters((prev) =>
      prev.includes(badgeId)
        ? prev.filter((id) => id !== badgeId)
        : [...prev, badgeId]
    );
  };

  // Inject Google Fonts for the selected heading and body fonts
  useEffect(() => {
    const fonts = [menu.design.headingFont, menu.design.bodyFont].filter(
      (f) => Boolean(f) && !isSystemFont(f)
    );
    if (fonts.length === 0) return;

    const url = getFontUrl(fonts);

    // Avoid duplicate link tags
    const existing = document.querySelector(
      `link[data-preview-fonts][href="${url}"]`
    );
    if (existing) return;

    // Remove any previous preview font links
    document
      .querySelectorAll("link[data-preview-fonts]")
      .forEach((el) => el.remove());

    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = url;
    link.setAttribute("data-preview-fonts", "true");
    document.head.appendChild(link);

    return () => {
      // Keep the link for caching; remove marker is enough
    };
  }, [menu.design.headingFont, menu.design.bodyFont]);

  const hasMinimalData = !menu.restaurant.name.trim();

  return (
    <div className="flex flex-col items-center h-full">
      <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 flex-shrink-0">
        Preview
      </span>

      {/* Phone frame mockup — uses flex column so the screen area fills available height */}
      <div className="relative w-full max-w-sm rounded-[2rem] border-[3px] border-gray-800 bg-gray-800 shadow-2xl flex flex-col min-h-0 flex-1">
        {/* Notch */}
        <div className="relative z-20 flex justify-center bg-gray-800 py-1 flex-shrink-0">
          <div className="w-24 h-5 bg-gray-800 rounded-b-2xl" />
        </div>

        {/* Screen content — sole scroll container, sets menu design tokens */}
        <div
          className="flex-1 min-h-0 overflow-y-auto hide-scrollbar bg-menu-bg"
          style={getMenuDesignTokens(menu.design)}
        >
          {hasMinimalData ? (
            <div className="flex flex-col items-center justify-center min-h-[300px] px-8 text-center">
              <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center mb-4">
                <svg
                  className="w-6 h-6 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
              </div>
              <p className="text-sm text-gray-500 leading-relaxed">
                Start filling in your details to see your menu come to life
              </p>
            </div>
          ) : (
            <>
              <MenuHero menu={menu} />

              <CategoryNav
                categories={menu.categories}
                specials={menu.specials}
                design={menu.design}
                activeCategory={activeCategory}
                onCategoryClick={setActiveCategory}
                badges={menu.badges ?? []}
                activeBadgeFilters={activeBadgeFilters}
                onBadgeFilterToggle={handleBadgeFilterToggle}
              />

              <SpecialsSection
                specials={menu.specials}
                design={menu.design}
                badges={menu.badges ?? []}
                activeBadgeFilters={activeBadgeFilters}
              />

              {menu.categories.map((category) => (
                <CategorySection
                  key={category.id}
                  category={category}
                  design={menu.design}
                  badges={menu.badges ?? []}
                  activeBadgeFilters={activeBadgeFilters}
                />
              ))}

              <MenuFooter menu={menu} />
            </>
          )}
        </div>

        {/* Bottom bar */}
        <div className="relative z-20 flex justify-center bg-gray-800 py-2 flex-shrink-0">
          <div className="w-28 h-1 bg-gray-600 rounded-full" />
        </div>
      </div>
    </div>
  );
}
