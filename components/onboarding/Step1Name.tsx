"use client";

import React from "react";
import { Menu } from "@/lib/types";
import Input from "@/components/ui/Input";
import ImageUpload from "@/components/ui/ImageUpload";

interface StepProps {
  menu: Menu;
  updateMenu: (updates: Partial<Menu>) => void;
  updateRestaurant: (updates: Partial<Menu["restaurant"]>) => void;
  updateDesign: (updates: Partial<Menu["design"]>) => void;
}

export default function Step1Name({ menu, updateRestaurant }: StepProps) {
  return (
    <div className="flex flex-col gap-8">
      <div>
        <h2 className="text-3xl font-extrabold text-foreground">
          Let&apos;s name your place
        </h2>
        <p className="text-base text-muted-foreground mt-1">
          Tell us the basics about your restaurant.
        </p>
      </div>

      <div className="flex flex-col gap-6">
        <Input
          label="Restaurant name"
          placeholder="e.g., The Yard"
          value={menu.restaurant.name}
          onChange={(e) => updateRestaurant({ name: e.target.value })}
        />

        <Input
          label="Tagline"
          placeholder="e.g., Wood-fired flavours, neighbourhood vibes"
          value={menu.restaurant.tagline}
          onChange={(e) => updateRestaurant({ tagline: e.target.value })}
          helperText="A short phrase that captures your vibe"
        />

        <ImageUpload
          label="Logo"
          value={menu.restaurant.logo || undefined}
          onChange={(base64) => updateRestaurant({ logo: base64 })}
          onClear={() => updateRestaurant({ logo: "" })}
          maxWidth={512}
          maxSizeKB={300}
        />
      </div>
    </div>
  );
}
