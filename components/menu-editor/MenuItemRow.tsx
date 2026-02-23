"use client";

import React, { useRef, useEffect } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, ChevronDown, ChevronUp, Trash2, ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { MenuItem, BadgeConfig } from "@/lib/types";
import Input, { Textarea } from "@/components/ui/Input";
import TagInput from "@/components/ui/TagInput";
import ImageUpload from "@/components/ui/ImageUpload";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface MenuItemRowProps {
  item: MenuItem;
  badges: BadgeConfig[];
  currency: string;
  isExpanded: boolean;
  onToggleExpand: () => void;
  onUpdate: (updates: Partial<MenuItem>) => void;
  onDelete: () => void;
}

export default function MenuItemRow({
  item,
  badges,
  currency,
  isExpanded,
  onToggleExpand,
  onUpdate,
  onDelete,
}: MenuItemRowProps) {
  const nameInputRef = useRef<HTMLInputElement>(null);
  const enabledBadges = badges.filter((b) => b.enabled);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: item.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  // Auto-focus the name field when expanding a new (empty) item
  useEffect(() => {
    if (isExpanded && !item.name && nameInputRef.current) {
      // Small delay to let the DOM settle after expand
      const t = setTimeout(() => nameInputRef.current?.focus(), 50);
      return () => clearTimeout(t);
    }
  }, [isExpanded, item.name]);

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "transition-colors duration-100",
        isDragging && "opacity-50 bg-accent/30"
      )}
    >
      {/* Collapsed row — always visible */}
      <div
        className={cn(
          "flex items-center gap-3 px-3 py-2.5 group cursor-pointer",
          "hover:bg-accent/50",
          isExpanded && "bg-accent/30"
        )}
        onClick={onToggleExpand}
      >
        {/* Drag handle */}
        <button
          type="button"
          className="shrink-0 touch-none cursor-grab active:cursor-grabbing text-muted-foreground/40 hover:text-muted-foreground transition-colors"
          onClick={(e) => e.stopPropagation()}
          {...attributes}
          {...listeners}
        >
          <GripVertical className="w-4 h-4" />
        </button>

        {/* Thumbnail */}
        <div className="shrink-0 w-10 h-10 rounded-lg overflow-hidden bg-muted flex items-center justify-center">
          {item.image ? (
            <img src={item.image} alt="" className="w-full h-full object-cover" />
          ) : (
            <ImageIcon className="w-4 h-4 text-muted-foreground/40" />
          )}
        </div>

        {/* Name + description */}
        <div className="flex-1 min-w-0">
          <p
            className={cn(
              "text-sm font-medium truncate",
              item.name ? "text-foreground" : "text-muted-foreground italic"
            )}
          >
            {item.name || "Untitled item"}
          </p>
          {item.description && (
            <p className="text-xs text-muted-foreground truncate">{item.description}</p>
          )}
        </div>

        {/* Price */}
        <span className="shrink-0 text-sm font-semibold text-muted-foreground tabular-nums">
          {item.price > 0 ? `${currency}${item.price.toFixed(2)}` : ""}
        </span>

        {/* Availability dot */}
        <div
          className={cn(
            "shrink-0 w-2 h-2 rounded-full",
            item.available ? "bg-green-500" : "bg-muted-foreground/30"
          )}
          title={item.available ? "Available" : "Unavailable"}
        />

        {/* Expand chevron */}
        <div className="shrink-0 text-muted-foreground/50">
          {isExpanded ? (
            <ChevronUp className="w-4 h-4" />
          ) : (
            <ChevronDown className="w-4 h-4" />
          )}
        </div>
      </div>

      {/* Expanded inline editor */}
      {isExpanded && (
        <div
          className="px-3 pb-4 pt-1 bg-accent/20 border-t border-border/30"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex flex-col gap-4 ml-7">
            {/* Image */}
            <ImageUpload
              label="Photo"
              value={item.image || undefined}
              onChange={(base64) => onUpdate({ image: base64 })}
              onClear={() => onUpdate({ image: undefined })}
              maxWidth={600}
              maxSizeKB={150}
            />

            {/* Name + Price */}
            <div className="flex gap-3">
              <Input
                ref={nameInputRef}
                label="Name"
                value={item.name}
                onChange={(e) => onUpdate({ name: e.target.value })}
                placeholder="Item name"
                className="flex-1"
              />
              <div className="flex flex-col gap-1.5 w-28">
                <label className="text-sm font-medium text-foreground">Price</label>
                <div className="flex items-center">
                  <span className="inline-flex items-center rounded-l-xl border border-r-0 border-input bg-muted/50 px-2.5 h-11 text-sm text-muted-foreground">
                    {currency}
                  </span>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={item.price || ""}
                    onChange={(e) =>
                      onUpdate({ price: parseFloat(e.target.value) || 0 })
                    }
                    placeholder="0"
                    className="w-full rounded-r-xl border border-input bg-card px-3 h-11 text-sm text-foreground placeholder:text-muted-foreground transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/30 focus-visible:border-primary focus-visible:ring-offset-1"
                  />
                </div>
              </div>
            </div>

            {/* Description */}
            <Textarea
              label="Description"
              value={item.description}
              onChange={(e) => onUpdate({ description: e.target.value })}
              placeholder="Describe this dish..."
              className="min-h-[80px]"
            />

            {/* Tags */}
            <TagInput
              label="Dietary Tags"
              value={item.tags ?? []}
              onChange={(tags) => onUpdate({ tags })}
            />

            {/* Badge */}
            {enabledBadges.length > 0 && (
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-foreground">Badge</label>
                <Select
                  value={item.badge || "__none__"}
                  onValueChange={(val) =>
                    onUpdate({ badge: val === "__none__" ? undefined : val })
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="__none__">None</SelectItem>
                    {enabledBadges.map((b) => (
                      <SelectItem key={b.id} value={b.id}>
                        {b.icon} {b.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Availability + Delete row */}
            <div className="flex items-center justify-between pt-1">
              <div className="flex items-center gap-3">
                <Switch
                  checked={item.available}
                  onCheckedChange={(checked) => onUpdate({ available: checked })}
                />
                <span className="text-sm text-muted-foreground">
                  {item.available ? "Available" : "Hidden"}
                </span>
              </div>
              <button
                type="button"
                onClick={onDelete}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-destructive hover:text-destructive hover:bg-destructive/10 rounded-md transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export const MemoizedMenuItemRow = React.memo(MenuItemRow);
