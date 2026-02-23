"use client";

import React, { useState, useCallback, useMemo } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";
import { Plus, UtensilsCrossed } from "lucide-react";
import { Category, BadgeConfig } from "@/lib/types";
import { generateId } from "@/lib/utils";
import Button from "@/components/ui/Button";
import { MemoizedCategoryCard } from "./CategoryCard";
import EmptyState from "./EmptyState";

interface CategoryListProps {
  categories: Category[];
  badges: BadgeConfig[];
  currency: string;
  onCategoriesChange: (categories: Category[]) => void;
  showQuickAddPresets?: boolean;
}

const QUICK_ADD_PRESETS = ["Starters", "Mains", "Sides", "Desserts", "Drinks", "Specials"];

export default function CategoryList({
  categories,
  badges,
  currency,
  onCategoriesChange,
  showQuickAddPresets = false,
}: CategoryListProps) {
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(
    () => new Set(categories.map((c) => c.id))
  );

  const totalItems = useMemo(
    () => categories.reduce((sum, c) => sum + c.items.length, 0),
    [categories]
  );

  // DnD sensors for category reordering
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const toggleCategory = useCallback((id: string) => {
    setExpandedCategories((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const expandAll = useCallback(() => {
    setExpandedCategories(new Set(categories.map((c) => c.id)));
  }, [categories]);

  const collapseAll = useCallback(() => {
    setExpandedCategories(new Set());
  }, []);

  const handleCategoryDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;
      if (!over || active.id === over.id) return;

      const oldIndex = categories.findIndex((c) => c.id === active.id);
      const newIndex = categories.findIndex((c) => c.id === over.id);
      if (oldIndex === -1 || newIndex === -1) return;

      onCategoriesChange(arrayMove(categories, oldIndex, newIndex));
    },
    [categories, onCategoriesChange]
  );

  const addCategory = useCallback(
    (name = "") => {
      const newCat: Category = { id: generateId(), name, items: [] };
      onCategoriesChange([...categories, newCat]);
      setExpandedCategories((prev) => new Set([...prev, newCat.id]));
    },
    [categories, onCategoriesChange]
  );

  const updateCategory = useCallback(
    (updated: Category) => {
      onCategoriesChange(
        categories.map((c) => (c.id === updated.id ? updated : c))
      );
    },
    [categories, onCategoriesChange]
  );

  const deleteCategory = useCallback(
    (catId: string) => {
      onCategoriesChange(categories.filter((c) => c.id !== catId));
      setExpandedCategories((prev) => {
        const next = new Set(prev);
        next.delete(catId);
        return next;
      });
    },
    [categories, onCategoriesChange]
  );

  // Empty state
  if (categories.length === 0) {
    return (
      <div>
        <EmptyState
          icon={<UtensilsCrossed className="w-5 h-5" />}
          title="Start building your menu"
          description="Add your first category to organize dishes, drinks, and more."
          action={
            <Button variant="secondary" size="sm" onClick={() => addCategory()}>
              <Plus className="w-4 h-4" />
              Add category
            </Button>
          }
        />
        {showQuickAddPresets && (
          <div className="flex flex-col items-center gap-2 mt-2">
            <span className="text-xs font-medium text-muted-foreground">Or quick add:</span>
            <div className="flex flex-wrap justify-center gap-2">
              {QUICK_ADD_PRESETS.map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => addCategory(preset)}
                  className="inline-flex items-center gap-1 px-3 py-1.5 text-sm font-medium rounded-full border border-border bg-card text-foreground hover:bg-accent hover:border-primary/40 transition-all duration-150"
                >
                  <Plus className="w-3 h-3" />
                  {preset}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-1">
      {/* Toolbar */}
      <div className="flex items-center justify-between py-2">
        <span className="text-xs font-medium text-muted-foreground">
          {categories.length} categor{categories.length !== 1 ? "ies" : "y"} &middot; {totalItems} item{totalItems !== 1 ? "s" : ""}
        </span>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={expandAll}
            className="text-xs text-muted-foreground hover:text-foreground px-2 py-1 rounded-md hover:bg-accent transition-colors"
          >
            Expand all
          </button>
          <span className="text-muted-foreground/30">|</span>
          <button
            type="button"
            onClick={collapseAll}
            className="text-xs text-muted-foreground hover:text-foreground px-2 py-1 rounded-md hover:bg-accent transition-colors"
          >
            Collapse all
          </button>
        </div>
      </div>

      {/* Category list with DnD */}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleCategoryDragEnd}
      >
        <SortableContext
          items={categories.map((c) => c.id)}
          strategy={verticalListSortingStrategy}
        >
          <div className="flex flex-col divide-y divide-border/40">
            {categories.map((category) => (
              <MemoizedCategoryCard
                key={category.id}
                category={category}
                badges={badges}
                currency={currency}
                isExpanded={expandedCategories.has(category.id)}
                onToggleExpand={() => toggleCategory(category.id)}
                onUpdate={updateCategory}
                onDelete={() => deleteCategory(category.id)}
                canDelete={categories.length > 1}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>

      {/* Add category button */}
      <div className="pt-2">
        <Button variant="secondary" size="sm" onClick={() => addCategory()}>
          <Plus className="w-4 h-4" />
          Add category
        </Button>
      </div>
    </div>
  );
}
