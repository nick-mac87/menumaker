"use client";

import React, { useState } from "react";
import { Menu, Category, MenuItem } from "@/lib/types";
import { generateId } from "@/lib/utils";
import { CURRENCIES } from "@/lib/defaults";
import Input, { Textarea } from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import TagInput from "@/components/ui/TagInput";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown, ChevronUp, Plus, Trash2, ImagePlus, X } from "lucide-react";
import { compressImage } from "@/lib/utils";

interface StepProps {
  menu: Menu;
  updateMenu: (updates: Partial<Menu>) => void;
  updateRestaurant: (updates: Partial<Menu["restaurant"]>) => void;
  updateDesign: (updates: Partial<Menu["design"]>) => void;
}

export default function Step4Menu({ menu, updateMenu }: StepProps) {
  const { categories } = menu;
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(
    () => new Set(categories.map((c) => c.id))
  );

  // Determine default currency from first item in first category, or 'R'
  const defaultCurrency =
    categories
      .flatMap((c) => c.items)
      .find((item) => item.currency)?.currency ?? "R";

  const [currency, setCurrency] = useState(defaultCurrency);

  const toggleCategory = (id: string) => {
    setExpandedCategories((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const updateCategories = (newCategories: Category[]) => {
    updateMenu({ categories: newCategories });
  };

  const handleCurrencyChange = (newCurrency: string) => {
    setCurrency(newCurrency);
    // Update all existing items with the new currency
    const updated = categories.map((cat) => ({
      ...cat,
      items: cat.items.map((item) => ({ ...item, currency: newCurrency })),
    }));
    updateCategories(updated);
  };

  const addCategory = () => {
    const newCat: Category = {
      id: generateId(),
      name: "",
      items: [],
    };
    const updated = [...categories, newCat];
    updateCategories(updated);
    setExpandedCategories((prev) => new Set(Array.from(prev).concat(newCat.id)));
  };

  const removeCategory = (catId: string) => {
    const cat = categories.find((c) => c.id === catId);
    const label = cat?.name || "this category";
    if (!window.confirm(`Delete "${label}" and all its items?`)) return;
    updateCategories(categories.filter((c) => c.id !== catId));
    setExpandedCategories((prev) => {
      const next = new Set(prev);
      next.delete(catId);
      return next;
    });
  };

  const updateCategoryField = (
    catId: string,
    field: keyof Pick<Category, "name" | "description">,
    value: string
  ) => {
    updateCategories(
      categories.map((c) => (c.id === catId ? { ...c, [field]: value } : c))
    );
  };

  const addItem = (catId: string) => {
    const newItem: MenuItem = {
      id: generateId(),
      name: "",
      description: "",
      price: 0,
      currency,
      tags: [],
      available: true,
    };
    updateCategories(
      categories.map((c) =>
        c.id === catId ? { ...c, items: [...c.items, newItem] } : c
      )
    );
  };

  const removeItem = (catId: string, itemId: string) => {
    const cat = categories.find((c) => c.id === catId);
    const item = cat?.items.find((i) => i.id === itemId);
    const label = item?.name || "this item";
    if (!window.confirm(`Delete "${label}"?`)) return;
    updateCategories(
      categories.map((c) =>
        c.id === catId
          ? { ...c, items: c.items.filter((i) => i.id !== itemId) }
          : c
      )
    );
  };

  const updateItem = (
    catId: string,
    itemId: string,
    updates: Partial<MenuItem>
  ) => {
    updateCategories(
      categories.map((c) =>
        c.id === catId
          ? {
              ...c,
              items: c.items.map((i) =>
                i.id === itemId ? { ...i, ...updates } : i
              ),
            }
          : c
      )
    );
  };

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

      {/* Quick-add category presets */}
      {categories.length === 0 && (
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-muted-foreground">Quick add</label>
          <div className="flex flex-wrap gap-2">
            {["Starters", "Mains", "Sides", "Desserts", "Drinks", "Specials"].map((preset) => (
              <button
                key={preset}
                type="button"
                onClick={() => {
                  const newCat: Category = { id: generateId(), name: preset, items: [] };
                  updateCategories([...categories, newCat]);
                  setExpandedCategories((prev) => new Set(Array.from(prev).concat(newCat.id)));
                }}
                className="inline-flex items-center gap-1 px-3 py-1.5 text-sm font-medium rounded-full border border-border bg-card text-foreground hover:bg-accent hover:border-primary/40 transition-all duration-150"
              >
                <Plus className="w-3 h-3" />
                {preset}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Categories */}
      <div className="flex flex-col gap-4">
        {categories.map((category) => {
          const isExpanded = expandedCategories.has(category.id);
          return (
            <Collapsible key={category.id} open={isExpanded} onOpenChange={() => toggleCategory(category.id)}>
              <div className="border border-border rounded-lg overflow-hidden bg-white shadow-sm">
                {/* Category header */}
                <div className="flex items-center gap-2 px-4 py-3 bg-muted/50 border-b border-border">
                  <CollapsibleTrigger asChild>
                    <button
                      type="button"
                      className="shrink-0 text-muted-foreground hover:text-foreground"
                    >
                      {isExpanded ? (
                        <ChevronUp className="w-4 h-4" />
                      ) : (
                        <ChevronDown className="w-4 h-4" />
                      )}
                    </button>
                  </CollapsibleTrigger>
                  <input
                    type="text"
                    value={category.name}
                    onChange={(e) =>
                      updateCategoryField(
                        category.id,
                        "name",
                        e.target.value
                      )
                    }
                    onClick={(e) => e.stopPropagation()}
                    placeholder="Category name"
                    className="flex-1 min-w-0 bg-transparent text-sm font-semibold text-foreground placeholder:text-muted-foreground focus:outline-none"
                  />
                  <span className="text-xs text-muted-foreground flex-shrink-0">
                    {category.items.length} item
                    {category.items.length !== 1 ? "s" : ""}
                  </span>
                  <button
                    type="button"
                    onClick={() => removeCategory(category.id)}
                    className="p-1 text-muted-foreground hover:text-red-500 transition-colors rounded-md hover:bg-red-50"
                    title="Remove category"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                {/* Category items */}
                <CollapsibleContent>
                  <div className="p-4 flex flex-col gap-3">
                    {category.items.length === 0 && (
                      <p className="text-sm text-muted-foreground text-center py-4">
                        No items yet. Add your first item below.
                      </p>
                    )}

                    {category.items.map((item) => (
                      <MenuItemEditor
                        key={item.id}
                        item={item}
                        currency={currency}
                        onUpdate={(updates) =>
                          updateItem(category.id, item.id, updates)
                        }
                        onRemove={() => removeItem(category.id, item.id)}
                      />
                    ))}

                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => addItem(category.id)}
                      className="self-start"
                    >
                      <Plus className="w-4 h-4" />
                      Add item
                    </Button>
                  </div>
                </CollapsibleContent>
              </div>
            </Collapsible>
          );
        })}
      </div>

      <Button
        type="button"
        variant="secondary"
        onClick={addCategory}
        className="self-start"
      >
        <Plus className="w-4 h-4" />
        Add category
      </Button>
    </div>
  );
}

/* ---- Menu Item Editor ---- */

function MenuItemEditor({
  item,
  currency,
  onUpdate,
  onRemove,
}: {
  item: MenuItem;
  currency: string;
  onUpdate: (updates: Partial<MenuItem>) => void;
  onRemove: () => void;
}) {
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleImageFile = async (file: File) => {
    if (!file.type.startsWith("image/")) return;
    try {
      const base64 = await compressImage(file, 600, 150);
      onUpdate({ image: base64 });
    } catch {
      // silently fail
    }
  };

  return (
    <div className="border border-border rounded-lg p-4 bg-white flex flex-col gap-3">
      <div className="flex items-start gap-3">
        {/* Image thumbnail */}
        <div className="flex-shrink-0">
          {item.image ? (
            <div className="relative group w-16 h-16 rounded-lg overflow-hidden border border-border">
              <img src={item.image} alt="" className="w-full h-full object-cover" />
              <button
                type="button"
                onClick={() => onUpdate({ image: undefined })}
                className="absolute top-0 right-0 p-0.5 bg-black/60 text-white rounded-bl-md opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="w-16 h-16 rounded-lg border-2 border-dashed border-border hover:border-primary/40 flex flex-col items-center justify-center gap-0.5 text-muted-foreground hover:text-primary transition-colors"
            >
              <ImagePlus className="w-4 h-4" />
              <span className="text-[9px] font-medium">Photo</span>
            </button>
          )}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleImageFile(file);
              e.target.value = "";
            }}
          />
        </div>

        {/* Fields */}
        <div className="flex-1 flex flex-col gap-3 min-w-0">
          <Input
            placeholder="Item name"
            value={item.name}
            onChange={(e) => onUpdate({ name: e.target.value })}
          />

          <Textarea
            placeholder="Description (optional)"
            value={item.description}
            onChange={(e) => onUpdate({ description: e.target.value })}
            className="min-h-[60px]"
          />

          <div className="flex items-center gap-3">
            <div className="flex flex-col gap-1.5 w-32">
              <label className="text-sm font-medium text-muted-foreground">
                Price
              </label>
              <div className="flex items-center">
                <span className="inline-flex items-center rounded-l-lg border border-r-0 border-border bg-muted/50 px-2 py-2 text-sm text-muted-foreground">
                  {currency}
                </span>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={item.price || ""}
                  onChange={(e) =>
                    onUpdate({
                      price: parseFloat(e.target.value) || 0,
                    })
                  }
                  placeholder="0"
                  className="w-full rounded-r-xl border border-border px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-offset-1 focus-visible:ring-ring"
                />
              </div>
            </div>

            {/* Available toggle */}
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-muted-foreground">
                Available
              </label>
              <Switch
                checked={item.available}
                onCheckedChange={(checked) => onUpdate({ available: checked })}
              />
            </div>
          </div>

          <TagInput
            label="Tags"
            value={item.tags ?? []}
            onChange={(tags) => onUpdate({ tags })}
          />
        </div>

        <button
          type="button"
          onClick={onRemove}
          className="p-1.5 text-muted-foreground hover:text-red-500 transition-colors rounded-md hover:bg-red-50 flex-shrink-0"
          title="Remove item"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
