"use client";

import React, { useState, useCallback } from "react";
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
  useSortable,
  arrayMove,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, ChevronDown, ChevronUp, Plus, Trash2, ImagePlus } from "lucide-react";
import { cn } from "@/lib/utils";
import { Category, MenuItem, BadgeConfig } from "@/lib/types";
import { generateId } from "@/lib/utils";
import Button from "@/components/ui/Button";
import ImageUpload from "@/components/ui/ImageUpload";
import { MemoizedMenuItemRow } from "./MenuItemRow";
import MenuItemEditSheet from "./MenuItemEditSheet";
import DeleteConfirmDialog from "./DeleteConfirmDialog";
import EmptyState from "./EmptyState";

interface CategoryCardProps {
  category: Category;
  badges: BadgeConfig[];
  currency: string;
  isExpanded: boolean;
  onToggleExpand: () => void;
  onUpdate: (updated: Category) => void;
  onDelete: () => void;
  canDelete: boolean;
}

export default function CategoryCard({
  category,
  badges,
  currency,
  isExpanded,
  onToggleExpand,
  onUpdate,
  onDelete,
  canDelete,
}: CategoryCardProps) {
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<{ type: "category" | "item"; id?: string } | null>(null);
  const [showCategoryImage, setShowCategoryImage] = useState(!!category.image);

  // Sortable for this category card (used by parent CategoryList)
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: category.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  // DnD sensors for item reordering within this category
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleItemDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;
      if (!over || active.id === over.id) return;

      const oldIndex = category.items.findIndex((i) => i.id === active.id);
      const newIndex = category.items.findIndex((i) => i.id === over.id);
      if (oldIndex === -1 || newIndex === -1) return;

      onUpdate({
        ...category,
        items: arrayMove(category.items, oldIndex, newIndex),
      });
    },
    [category, onUpdate]
  );

  const addItem = useCallback(() => {
    const newItem: MenuItem = {
      id: generateId(),
      name: "",
      description: "",
      price: 0,
      currency,
      tags: [],
      available: true,
    };
    onUpdate({ ...category, items: [...category.items, newItem] });
    setEditingItem(newItem);
  }, [category, currency, onUpdate]);

  const updateItem = useCallback(
    (updates: Partial<MenuItem>) => {
      if (!editingItem) return;
      const updatedItem = { ...editingItem, ...updates };
      setEditingItem(updatedItem);
      onUpdate({
        ...category,
        items: category.items.map((i) =>
          i.id === editingItem.id ? updatedItem : i
        ),
      });
    },
    [editingItem, category, onUpdate]
  );

  const confirmDeleteItem = useCallback(
    (itemId: string) => {
      onUpdate({
        ...category,
        items: category.items.filter((i) => i.id !== itemId),
      });
      setEditingItem(null);
      setDeleteTarget(null);
    },
    [category, onUpdate]
  );

  const handleDeleteFromSheet = useCallback(() => {
    if (!editingItem) return;
    setDeleteTarget({ type: "item", id: editingItem.id });
  }, [editingItem]);

  return (
    <>
      <div
        ref={setNodeRef}
        style={style}
        className={cn(
          "category-accent-bar transition-all duration-150",
          isDragging && "opacity-50"
        )}
      >
        {/* Category header */}
        <div className="flex items-start gap-2 py-3">
          {/* Drag handle */}
          <button
            type="button"
            className="shrink-0 mt-1 touch-none cursor-grab active:cursor-grabbing text-muted-foreground/40 hover:text-muted-foreground transition-colors"
            {...attributes}
            {...listeners}
          >
            <GripVertical className="w-4 h-4" />
          </button>

          {/* Name + description */}
          <div className="flex-1 min-w-0">
            <input
              type="text"
              value={category.name}
              onChange={(e) => onUpdate({ ...category, name: e.target.value })}
              placeholder="Category name"
              className="w-full bg-transparent text-base font-semibold text-foreground placeholder:text-muted-foreground focus:outline-none"
            />
            <input
              type="text"
              value={category.description || ""}
              onChange={(e) =>
                onUpdate({ ...category, description: e.target.value || undefined })
              }
              placeholder="Add a description (optional)"
              className="w-full bg-transparent text-sm text-muted-foreground placeholder:text-muted-foreground/60 focus:outline-none mt-0.5"
            />
          </div>

          {/* Item count pill */}
          <span className="shrink-0 mt-1 inline-flex items-center rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">
            {category.items.length} item{category.items.length !== 1 ? "s" : ""}
          </span>

          {/* Category image toggle */}
          <button
            type="button"
            onClick={() => setShowCategoryImage(!showCategoryImage)}
            className={cn(
              "shrink-0 mt-0.5 p-1.5 rounded-md transition-colors",
              showCategoryImage || category.image
                ? "text-primary bg-primary/10"
                : "text-muted-foreground/40 hover:text-muted-foreground hover:bg-accent"
            )}
            title="Category image"
          >
            <ImagePlus className="w-4 h-4" />
          </button>

          {/* Expand/collapse */}
          <button
            type="button"
            onClick={onToggleExpand}
            className="shrink-0 mt-0.5 p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
          >
            {isExpanded ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </button>

          {/* Delete */}
          {canDelete && (
            <button
              type="button"
              onClick={() => setDeleteTarget({ type: "category" })}
              className="shrink-0 mt-0.5 p-1.5 rounded-md text-muted-foreground/40 hover:text-destructive hover:bg-destructive/10 transition-colors"
              title="Delete category"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Category image (collapsible) */}
        {showCategoryImage && (
          <div className="pb-3 ml-6">
            <ImageUpload
              value={category.image || undefined}
              onChange={(base64) => onUpdate({ ...category, image: base64 })}
              onClear={() => {
                onUpdate({ ...category, image: undefined });
                setShowCategoryImage(false);
              }}
              maxWidth={800}
              maxSizeKB={200}
            />
          </div>
        )}

        {/* Items list (collapsible) */}
        {isExpanded && (
          <div className="ml-6 pb-2">
            {category.items.length === 0 ? (
              <EmptyState
                icon={<Plus className="w-5 h-5" />}
                title="No items yet"
                description="Add your first dish, drink, or menu item."
                action={
                  <Button variant="ghost" size="sm" onClick={addItem}>
                    <Plus className="w-4 h-4" />
                    Add item
                  </Button>
                }
              />
            ) : (
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleItemDragEnd}
              >
                <SortableContext
                  items={category.items.map((i) => i.id)}
                  strategy={verticalListSortingStrategy}
                >
                  <div className="divide-y divide-border/50 rounded-lg border border-border/50 overflow-hidden bg-card">
                    {category.items.map((item) => (
                      <MemoizedMenuItemRow
                        key={item.id}
                        item={item}
                        currency={currency}
                        onEdit={() => setEditingItem(item)}
                        onDelete={() =>
                          setDeleteTarget({ type: "item", id: item.id })
                        }
                      />
                    ))}
                  </div>
                </SortableContext>
              </DndContext>
            )}

            {category.items.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={addItem}
                className="mt-2"
              >
                <Plus className="w-4 h-4" />
                Add item
              </Button>
            )}
          </div>
        )}
      </div>

      {/* Item edit sheet */}
      <MenuItemEditSheet
        open={!!editingItem}
        onOpenChange={(open) => {
          if (!open) setEditingItem(null);
        }}
        item={editingItem}
        badges={badges}
        currency={currency}
        onUpdate={updateItem}
        onDelete={handleDeleteFromSheet}
      />

      {/* Delete confirmation */}
      <DeleteConfirmDialog
        open={!!deleteTarget}
        onOpenChange={(open) => {
          if (!open) setDeleteTarget(null);
        }}
        title={
          deleteTarget?.type === "category"
            ? "Delete category?"
            : "Delete item?"
        }
        description={
          deleteTarget?.type === "category"
            ? `This will remove "${category.name || "this category"}" and all ${category.items.length} item${category.items.length !== 1 ? "s" : ""}.`
            : `This will remove "${category.items.find((i) => i.id === deleteTarget?.id)?.name || "this item"}" from your menu.`
        }
        onConfirm={() => {
          if (deleteTarget?.type === "category") {
            onDelete();
          } else if (deleteTarget?.id) {
            confirmDeleteItem(deleteTarget.id);
          }
          setDeleteTarget(null);
        }}
      />
    </>
  );
}

export const MemoizedCategoryCard = React.memo(CategoryCard);
