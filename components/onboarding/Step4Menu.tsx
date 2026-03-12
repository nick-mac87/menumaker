"use client";

import React, { useState, useCallback } from "react";
import { Menu, Category } from "@/lib/types";
import { CURRENCIES } from "@/lib/defaults";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CategoryList } from "@/components/menu-editor";
import ScanMenuUpload from "@/components/onboarding/ScanMenuUpload";
import { Camera } from "lucide-react";
import Button from "@/components/ui/Button";

interface StepProps {
  menu: Menu;
  updateMenu: (updates: Partial<Menu>) => void;
  updateRestaurant: (updates: Partial<Menu["restaurant"]>) => void;
  updateDesign: (updates: Partial<Menu["design"]>) => void;
}

export default function Step4Menu({ menu, updateMenu }: StepProps) {
  const { categories } = menu;
  const [showRescan, setShowRescan] = useState(false);

  const hasItems = categories.some((c) => c.items.length > 0);

  // Determine default currency from first item in first category, or 'R'
  const defaultCurrency =
    categories
      .flatMap((c) => c.items)
      .find((item) => item.currency)?.currency ?? "R";

  const [currency, setCurrency] = useState(defaultCurrency);

  const handleCurrencyChange = (newCurrency: string) => {
    setCurrency(newCurrency);
    // Update all existing items with the new currency
    const updated = categories.map((cat) => ({
      ...cat,
      items: cat.items.map((item) => ({ ...item, currency: newCurrency })),
    }));
    updateMenu({ categories: updated });
  };

  const handleCategoriesChange = useCallback(
    (newCategories: Category[]) => {
      updateMenu({ categories: newCategories });
    },
    [updateMenu]
  );

  const handleScanSuccess = useCallback(
    (scanned: Category[]) => {
      if (hasItems) {
        if (window.confirm("Append scanned items to your existing menu? (Cancel to replace)")) {
          updateMenu({ categories: [...categories, ...scanned] });
        } else {
          updateMenu({ categories: scanned });
        }
      } else {
        updateMenu({ categories: scanned });
      }
      setShowRescan(false);
      // Sync currency from scanned items
      const firstCurrency = scanned.flatMap((c) => c.items).find((i) => i.currency)?.currency;
      if (firstCurrency) setCurrency(firstCurrency);
    },
    [categories, hasItems, updateMenu]
  );

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h2 className="text-3xl font-extrabold text-foreground">Build your menu</h2>
        <p className="text-base text-muted-foreground mt-1">
          Add categories and items. You can always edit these later.
        </p>
      </div>

      {/* Scan menu shortcut */}
      {!hasItems && !showRescan && (
        <div className="rounded-2xl border border-border bg-card shadow-warm-sm p-6">
          <div className="flex items-center gap-2 mb-1">
            <Camera className="h-4 w-4 text-primary" />
            <h3 className="text-sm font-semibold text-foreground">Got a physical menu? Scan it</h3>
          </div>
          <p className="text-xs text-muted-foreground mb-4">
            Upload a photo and AI will extract your categories and items automatically.
          </p>
          <ScanMenuUpload onSuccess={handleScanSuccess} onSkip={() => {}} />
        </div>
      )}

      {hasItems && !showRescan && (
        <Button variant="ghost" size="sm" onClick={() => setShowRescan(true)} className="self-start">
          <Camera className="h-4 w-4" />
          Re-scan menu photo
        </Button>
      )}

      {showRescan && (
        <div className="rounded-2xl border border-border bg-card shadow-warm-sm p-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-foreground">Scan menu photo</h3>
            <button type="button" onClick={() => setShowRescan(false)} className="text-xs text-muted-foreground hover:text-foreground">
              Cancel
            </button>
          </div>
          <ScanMenuUpload onSuccess={handleScanSuccess} onSkip={() => setShowRescan(false)} />
        </div>
      )}

      {/* Currency selector */}
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-muted-foreground">Currency</label>
        <Select value={currency} onValueChange={handleCurrencyChange}>
          <SelectTrigger className="w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {CURRENCIES.map((c) => (
              <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Categories & Items */}
      <CategoryList
        categories={categories}
        badges={menu.badges || []}
        currency={currency}
        onCategoriesChange={handleCategoriesChange}
        showQuickAddPresets
      />
    </div>
  );
}
