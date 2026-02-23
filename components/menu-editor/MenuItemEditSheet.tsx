"use client";

import React from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
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
import Button from "@/components/ui/Button";
import { MenuItem, BadgeConfig } from "@/lib/types";

interface MenuItemEditSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  item: MenuItem | null;
  badges: BadgeConfig[];
  currency: string;
  onUpdate: (updates: Partial<MenuItem>) => void;
  onDelete: () => void;
}

export default function MenuItemEditSheet({
  open,
  onOpenChange,
  item,
  badges,
  currency,
  onUpdate,
  onDelete,
}: MenuItemEditSheetProps) {
  const enabledBadges = badges.filter((b) => b.enabled);

  if (!item) return null;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-md overflow-y-auto">
        <SheetHeader className="mb-6">
          <SheetTitle>{item.name || "New Item"}</SheetTitle>
          <SheetDescription>Edit item details</SheetDescription>
        </SheetHeader>

        <div className="flex flex-col gap-5">
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

          {/* Availability */}
          <div className="flex items-center justify-between py-2">
            <div>
              <p className="text-sm font-medium text-foreground">Available</p>
              <p className="text-xs text-muted-foreground">
                {item.available ? "Visible on your menu" : "Hidden from customers"}
              </p>
            </div>
            <Switch
              checked={item.available}
              onCheckedChange={(checked) => onUpdate({ available: checked })}
            />
          </div>

          {/* Delete */}
          <div className="border-t border-border pt-4 mt-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={onDelete}
              className="text-destructive hover:text-destructive hover:bg-destructive/10 w-full justify-center"
            >
              Delete item
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
