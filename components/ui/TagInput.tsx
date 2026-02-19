"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { TAG_OPTIONS } from "@/lib/defaults";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Label } from "@/components/ui/label";
import { Check } from "lucide-react";

interface TagInputProps {
  value: string[];
  onChange: (tags: string[]) => void;
  label?: string;
}

export default function TagInput({ value, onChange, label }: TagInputProps) {
  return (
    <div className="flex flex-col gap-2">
      {label && <Label>{label}</Label>}
      <ToggleGroup
        type="multiple"
        value={value}
        onValueChange={onChange}
        className="flex flex-wrap justify-start gap-2"
      >
        {TAG_OPTIONS.map((tag) => (
          <ToggleGroupItem
            key={tag}
            value={tag}
            className={cn(
              "inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-xs font-medium",
              "border transition-colors",
              "data-[state=on]:bg-primary data-[state=on]:text-primary-foreground data-[state=on]:border-primary data-[state=on]:shadow-sm",
              "data-[state=off]:bg-background data-[state=off]:text-muted-foreground data-[state=off]:border-input data-[state=off]:hover:border-border/80 data-[state=off]:hover:bg-accent"
            )}
          >
            {value.includes(tag) && <Check className="h-3 w-3" />}
            {tag}
          </ToggleGroupItem>
        ))}
      </ToggleGroup>
    </div>
  );
}
