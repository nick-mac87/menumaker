"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { useParams, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Menu } from "@/lib/types";
import { getMenu, saveMenu } from "@/lib/storage";
import { createDemoMenu, DEMO_MENU_ID } from "@/lib/defaults";
import { getFontUrl, isSystemFont } from "@/lib/fonts";
import { recordEvent } from "@/lib/stats";
import { StatEventType } from "@/lib/types";
import { getMenuDesignTokens } from "@/lib/utils";

import MenuHero from "@/components/menu/MenuHero";
import CategoryNav from "@/components/menu/CategoryNav";
import SpecialsSection from "@/components/menu/SpecialsSection";
import CategorySection from "@/components/menu/CategorySection";
import MenuFooter from "@/components/menu/MenuFooter";

export default function PublicMenuPage() {
  const params = useParams<{ menuId: string }>();
  const searchParams = useSearchParams();
  const menuId = params.menuId;

  const [menu, setMenu] = useState<Menu | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string>("");
  const [activeBadgeFilters, setActiveBadgeFilters] = useState<string[]>([]);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const hasTrackedView = useRef(false);

  // Load menu on mount
  useEffect(() => {
    let loaded: Menu | null = null;

    if (menuId === DEMO_MENU_ID) {
      // Always regenerate demo so code changes (e.g. new images) take effect
      const demo = createDemoMenu();
      saveMenu(demo);
      loaded = demo;
    } else {
      loaded = getMenu(menuId);
    }

    if (loaded) {
      setMenu(loaded);

      // Set initial active category
      if (loaded.specials.enabled && loaded.specials.items.length > 0) {
        setActiveCategory("specials");
      } else if (loaded.categories.length > 0) {
        setActiveCategory(loaded.categories[0].id);
      }
    } else {
      setNotFound(true);
    }
  }, [menuId]);

  // Track menu view and QR scan on mount
  useEffect(() => {
    if (!menu || hasTrackedView.current) return;
    hasTrackedView.current = true;

    recordEvent(menuId, "menu_view");

    const source = searchParams.get("source");
    if (source === "qr") {
      recordEvent(menuId, "qr_scan");
    }
  }, [menu, menuId, searchParams]);

  // Inject Google Fonts
  useEffect(() => {
    if (!menu) return;

    const fonts = [menu.design.headingFont, menu.design.bodyFont].filter(
      (f) => Boolean(f) && !isSystemFont(f)
    );
    if (fonts.length === 0) return;

    const url = getFontUrl(fonts);
    const existing = document.querySelector(
      `link[data-menu-fonts][href="${url}"]`
    );
    if (existing) return;

    document
      .querySelectorAll("link[data-menu-fonts]")
      .forEach((el) => el.remove());

    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = url;
    link.setAttribute("data-menu-fonts", "true");
    document.head.appendChild(link);
  }, [menu]);

  // Enable smooth scrolling on the html element
  useEffect(() => {
    document.documentElement.style.scrollBehavior = "smooth";
    return () => {
      document.documentElement.style.scrollBehavior = "";
    };
  }, []);

  // Show back-to-top FAB after scrolling down
  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 400);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // IntersectionObserver for active category tracking
  useEffect(() => {
    if (!menu) return;

    // Clean up previous observer
    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    const sectionIds: string[] = [];
    if (menu.specials.enabled && menu.specials.items.length > 0) {
      sectionIds.push("specials");
    }
    menu.categories.forEach((cat) => sectionIds.push(cat.id));

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveCategory(entry.target.id);
          }
        }
      },
      {
        rootMargin: "-20% 0px -60% 0px",
        threshold: 0,
      }
    );

    // Small delay to let DOM render
    const timer = setTimeout(() => {
      sectionIds.forEach((id) => {
        const el = document.getElementById(id);
        if (el) observer.observe(el);
      });
    }, 100);

    observerRef.current = observer;

    return () => {
      clearTimeout(timer);
      observer.disconnect();
    };
  }, [menu]);

  const handleCategoryClick = useCallback((categoryId: string) => {
    setActiveCategory(categoryId);
    const el = document.getElementById(categoryId);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, []);

  const handleBadgeFilterToggle = useCallback((badgeId: string) => {
    setActiveBadgeFilters((prev) =>
      prev.includes(badgeId)
        ? prev.filter((id) => id !== badgeId)
        : [...prev, badgeId]
    );
  }, []);

  const handleRecordEvent = useCallback(
    (eventType: string) => {
      recordEvent(menuId, eventType as StatEventType);
    },
    [menuId]
  );

  if (notFound) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-6 text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Menu not found
        </h1>
        <p className="text-gray-500 mb-6">
          The menu you are looking for does not exist or has been removed.
        </p>
        <Link
          href="/"
          className="inline-flex items-center px-6 py-2.5 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Go to MenuMaker
        </Link>
      </div>
    );
  }

  if (!menu) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-gray-400 text-sm">
          Loading menu...
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen max-w-lg mx-auto bg-menu-bg"
      style={getMenuDesignTokens(menu.design)}
    >
      <MenuHero menu={menu} onRecordEvent={handleRecordEvent} />

      <CategoryNav
        categories={menu.categories}
        specials={menu.specials}
        design={menu.design}
        activeCategory={activeCategory}
        onCategoryClick={handleCategoryClick}
        badges={menu.badges}
        activeBadgeFilters={activeBadgeFilters}
        onBadgeFilterToggle={handleBadgeFilterToggle}
        delivery={menu.restaurant.delivery}
        onRecordEvent={handleRecordEvent}
      />

      <SpecialsSection
        specials={menu.specials}
        design={menu.design}
        badges={menu.badges}
        activeBadgeFilters={activeBadgeFilters}
      />

      {menu.categories.map((category) => (
        <CategorySection
          key={category.id}
          category={category}
          design={menu.design}
          badges={menu.badges}
          activeBadgeFilters={activeBadgeFilters}
        />
      ))}

      <MenuFooter menu={menu} onRecordEvent={handleRecordEvent} />

      {/* Back to top FAB */}
      {showBackToTop && (
        <button
          type="button"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="fixed bottom-6 right-4 z-40 w-10 h-10 rounded-full shadow-lg flex items-center justify-center transition-all duration-200 hover:scale-110 active:scale-95"
          style={{
            backgroundColor: menu.design.accentColor,
            color: menu.design.backgroundColor,
          }}
          aria-label="Back to top"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 15.75l7.5-7.5 7.5 7.5" />
          </svg>
        </button>
      )}
    </div>
  );
}
