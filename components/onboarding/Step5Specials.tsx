"use client";

import React from "react";
import { Menu, MenuItem } from "@/lib/types";
import { generateId } from "@/lib/utils";
import Input, { Textarea } from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import TagInput from "@/components/ui/TagInput";
import { Switch } from "@/components/ui/switch";
import { Plus, Trash2, Sparkles } from "lucide-react";

interface StepProps {
  menu: Menu;
  updateMenu: (updates: Partial<Menu>) => void;
  updateRestaurant: (updates: Partial<Menu["restaurant"]>) => void;
  updateDesign: (updates: Partial<Menu["design"]>) => void;
}

export default function Step5Specials({ menu, updateMenu }: StepProps) {
  const { specials } = menu;

  // Determine default currency from menu categories
  const defaultCurrency =
    menu.categories
      .flatMap((c) => c.items)
      .find((item) => item.currency)?.currency ?? "R";

  const updateSpecials = (updates: Partial<Menu["specials"]>) => {
    updateMenu({ specials: { ...specials, ...updates } });
  };

  const addSpecial = () => {
    const newItem: MenuItem = {
      id: generateId(),
      name: "",
      description: "",
      price: 0,
      currency: defaultCurrency,
      tags: [],
      available: true,
    };
    updateSpecials({ items: [...specials.items, newItem] });
  };

  const removeSpecial = (itemId: string) => {
    const item = specials.items.find((i) => i.id === itemId);
    const label = item?.name || "this special";
    if (!window.confirm(`Delete "${label}"?`)) return;
    updateSpecials({
      items: specials.items.filter((i) => i.id !== itemId),
    });
  };

  const updateSpecialItem = (itemId: string, updates: Partial<MenuItem>) => {
    updateSpecials({
      items: specials.items.map((i) =>
        i.id === itemId ? { ...i, ...updates } : i
      ),
    });
  };

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h2 className="text-3xl font-extrabold text-foreground">
          Any specials today?
        </h2>
        <p className="text-base text-muted-foreground mt-1">
          Specials appear at the top of your menu in a highlighted section.
        </p>
      </div>

      {/* Enable toggle */}
      <div className="flex items-center justify-between p-4 rounded-xl border border-border bg-muted/50">
        <div className="flex items-center gap-3">
          <Sparkles className="w-5 h-5 text-amber-500" />
          <div>
            <p className="text-sm font-medium text-foreground">
              Enable specials section
            </p>
            <p className="text-xs text-muted-foreground">
              Highlight daily deals or featured items
            </p>
          </div>
        </div>
        <Switch
          checked={specials.enabled}
          onCheckedChange={(checked) => updateSpecials({ enabled: checked })}
        />
      </div>

      {/* Specials content */}
      {specials.enabled && (
        <div className="flex flex-col gap-6">
          {/* Custom title */}
          <Input
            label="Section title"
            placeholder="Today's Specials"
            value={specials.title}
            onChange={(e) => updateSpecials({ title: e.target.value })}
          />

          {/* Special items */}
          <div className="flex flex-col gap-3">
            {specials.items.length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-4">
                No specials yet. Add your first special below.
              </p>
            )}

            {specials.items.map((item) => (
              <SpecialItemEditor
                key={item.id}
                item={item}
                currency={defaultCurrency}
                onUpdate={(updates) => updateSpecialItem(item.id, updates)}
                onRemove={() => removeSpecial(item.id)}
              />
            ))}
          </div>

          <Button
            type="button"
            variant="secondary"
            onClick={addSpecial}
            className="self-start"
          >
            <Plus className="w-4 h-4" />
            Add special
          </Button>
        </div>
      )}
    </div>
  );
}

/* ---- Special Item Editor ---- */

function SpecialItemEditor({
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
  return (
    <div className="border border-border rounded-lg p-4 bg-white flex flex-col gap-3 shadow-sm">
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 flex flex-col gap-3">
          <Input
            placeholder="Special name"
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
          title="Remove special"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
