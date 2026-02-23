"use client";

import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, Pencil, Trash2, ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { MenuItem } from "@/lib/types";

interface MenuItemRowProps {
  item: MenuItem;
  currency: string;
  onEdit: () => void;
  onDelete: () => void;
}

export default function MenuItemRow({ item, currency, onEdit, onDelete }: MenuItemRowProps) {
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

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "flex items-center gap-3 px-3 py-2.5 group transition-colors duration-100",
        "hover:bg-accent/50",
        isDragging && "opacity-50 bg-accent/30"
      )}
    >
      {/* Drag handle */}
      <button
        type="button"
        className="shrink-0 touch-none cursor-grab active:cursor-grabbing text-muted-foreground/40 hover:text-muted-foreground transition-colors"
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
      <div className="flex-1 min-w-0 cursor-pointer" onClick={onEdit}>
        <p className={cn(
          "text-sm font-medium truncate",
          item.name ? "text-foreground" : "text-muted-foreground italic"
        )}>
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

      {/* Actions (visible on hover) */}
      <div className="shrink-0 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-100">
        <button
          type="button"
          onClick={onEdit}
          className="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
          title="Edit item"
        >
          <Pencil className="w-3.5 h-3.5" />
        </button>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          className="p-1.5 rounded-md text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
          title="Delete item"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}

export const MemoizedMenuItemRow = React.memo(MenuItemRow);
