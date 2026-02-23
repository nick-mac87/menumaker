"use client";

import React, { useState, useCallback } from "react";
import { Menu, Category } from "@/lib/types";
import { CURRENCIES } from "@/lib/defaults";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CategoryList } from "@/components/menu-editor";

interface StepProps {
  menu: Menu;
  updateMenu: (updates: Partial<Menu>) => void;
  updateRestaurant: (updates: Partial<Menu["restaurant"]>) => void;
  updateDesign: (updates: Partial<Menu["design"]>) => void;
}

export default function Step4Menu({ menu, updateMenu }: StepProps) {
  const { categories } = menu;

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

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h2 className="text-3xl font-extrabold text-foreground">Build your menu</h2>
        <p className="text-base text-muted-foreground mt-1">
          Add categories and items. You can always edit these later.
        </p>
      </div>

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
