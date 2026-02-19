"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Menu } from "@/lib/types";
import { getMenu, saveMenu } from "@/lib/storage";
import { createDemoMenu, DEMO_MENU_ID, TAG_DISPLAY } from "@/lib/defaults";
import { formatPrice } from "@/lib/utils";

export default function PrintMenuPage() {
  const params = useParams<{ menuId: string }>();
  const menuId = params.menuId;

  const [menu, setMenu] = useState<Menu | null>(null);
  const [notFound, setNotFound] = useState(false);

  // Load menu on mount
  useEffect(() => {
    let loaded: Menu | null = null;

    if (menuId === DEMO_MENU_ID) {
      const demo = createDemoMenu();
      saveMenu(demo);
      loaded = demo;
    } else {
      loaded = getMenu(menuId);
    }

    if (loaded) {
      setMenu(loaded);
    } else {
      setNotFound(true);
    }
  }, [menuId]);

  // Trigger print after rendering
  useEffect(() => {
    if (!menu) return;
    const timer = setTimeout(() => {
      window.print();
    }, 600);
    return () => clearTimeout(timer);
  }, [menu]);

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

  const origin =
    typeof window !== "undefined" ? window.location.origin : "";
  const publicUrl = `${origin}/menu/${menu.id}`;

  return (
    <>
      {/* Print-specific styles */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
            @media print {
              body {
                -webkit-print-color-adjust: exact;
                print-color-adjust: exact;
                margin: 0;
                padding: 0;
              }
              .no-print {
                display: none !important;
              }
              .print-category {
                break-inside: avoid;
                page-break-inside: avoid;
              }
              .print-item {
                break-inside: avoid;
                page-break-inside: avoid;
              }
              @page {
                margin: 1.5cm 2cm;
              }
            }
            @media screen {
              .print-container {
                max-width: 700px;
                margin: 0 auto;
                padding: 2rem 1rem;
              }
            }
          `,
        }}
      />

      {/* Screen-only back button */}
      <div className="no-print bg-gray-50 border-b border-gray-200 px-6 py-3 flex items-center justify-between">
        <Link
          href={`/menu/${menu.id}`}
          className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
        >
          &larr; Back to menu
        </Link>
        <button
          type="button"
          onClick={() => window.print()}
          className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Print
        </button>
      </div>

      <div className="print-container" style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}>
        {/* Header */}
        <header className="text-center mb-8 pb-6 border-b-2 border-gray-800">
          {menu.restaurant.logo && (
            <img
              src={menu.restaurant.logo}
              alt={`${menu.restaurant.name} logo`}
              className="mx-auto mb-4 max-w-[120px] max-h-[120px] object-contain"
            />
          )}
          <h1 className="text-3xl font-bold tracking-wide uppercase">
            {menu.restaurant.name}
          </h1>
          {menu.restaurant.tagline && (
            <p className="text-sm text-gray-600 mt-1 italic">
              {menu.restaurant.tagline}
            </p>
          )}
        </header>

        {/* Specials */}
        {menu.specials.enabled && menu.specials.items.length > 0 && (
          <section className="print-category mb-8">
            <h2 className="text-xl font-bold uppercase tracking-wide border-b border-gray-400 pb-1 mb-4">
              {menu.specials.title}
            </h2>
            <div className="flex flex-col gap-3">
              {menu.specials.items.map((item) => (
                <div key={item.id} className="print-item flex items-baseline gap-1">
                  <span className="font-semibold text-base">{item.name}</span>
                  {item.tags && item.tags.length > 0 && (
                    <span className="text-xs text-gray-500 ml-1">
                      ({item.tags.map((t) => TAG_DISPLAY[t] ?? t).join(", ")})
                    </span>
                  )}
                  <span className="flex-1 border-b border-dotted border-gray-300 mx-1 translate-y-[-3px]" />
                  <span className="font-semibold text-base whitespace-nowrap">
                    {formatPrice(item.price, item.currency)}
                  </span>
                </div>
              ))}
              {menu.specials.items.map(
                (item) =>
                  item.description && (
                    <p
                      key={`${item.id}-desc`}
                      className="text-xs text-gray-500 -mt-2 ml-4 italic"
                    >
                      {item.name}: {item.description}
                    </p>
                  )
              )}
            </div>
          </section>
        )}

        {/* Categories */}
        {menu.categories.map((category) => (
          <section key={category.id} className="print-category mb-8">
            <h2 className="text-xl font-bold uppercase tracking-wide border-b border-gray-400 pb-1 mb-4">
              {category.name}
            </h2>
            {category.description && (
              <p className="text-xs text-gray-500 mb-3 italic">
                {category.description}
              </p>
            )}
            <div className="flex flex-col gap-2">
              {category.items.map((item) => (
                <div key={item.id} className="print-item">
                  <div className="flex items-baseline gap-1">
                    <span className="font-semibold text-sm">
                      {item.name}
                    </span>
                    {item.tags && item.tags.length > 0 && (
                      <span className="text-xs text-gray-500 ml-0.5">
                        (
                        {item.tags
                          .map((t) => TAG_DISPLAY[t] ?? t)
                          .join(", ")}
                        )
                      </span>
                    )}
                    <span className="flex-1 border-b border-dotted border-gray-300 mx-1 translate-y-[-3px]" />
                    <span className="font-semibold text-sm whitespace-nowrap">
                      {formatPrice(item.price, item.currency)}
                    </span>
                  </div>
                  {item.description && (
                    <p className="text-xs text-gray-500 ml-2 mt-0.5">
                      {item.description}
                    </p>
                  )}
                  {!item.available && (
                    <p className="text-xs text-gray-400 italic ml-2">
                      Currently unavailable
                    </p>
                  )}
                </div>
              ))}
            </div>
          </section>
        ))}

        {/* Footer */}
        <footer className="mt-12 pt-6 border-t-2 border-gray-800 text-center text-sm text-gray-600">
          {menu.restaurant.location.address && (
            <p>{menu.restaurant.location.address}</p>
          )}
          {menu.restaurant.contact.phone && (
            <p className="mt-1">{menu.restaurant.contact.phone}</p>
          )}
          <p className="mt-3 text-xs text-gray-400">
            Scan to view online: {publicUrl}
          </p>
        </footer>
      </div>
    </>
  );
}
