"use client";

import React from "react";
import { Menu } from "@/lib/types";
import DeliveryPlatformCards from "@/components/ui/DeliveryPlatformCards";

interface StepProps {
  menu: Menu;
  updateMenu: (updates: Partial<Menu>) => void;
  updateRestaurant: (updates: Partial<Menu["restaurant"]>) => void;
  updateDesign: (updates: Partial<Menu["design"]>) => void;
}

export default function Step3Delivery({ menu, updateRestaurant }: StepProps) {
  const delivery = menu.restaurant.delivery;

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h2 className="text-3xl font-extrabold text-foreground">
          Where can customers order from?
        </h2>
        <p className="text-base text-muted-foreground mt-1">
          Add your delivery links. Customers tap to order directly from your
          menu.
        </p>
      </div>

      <DeliveryPlatformCards
        delivery={delivery}
        onChange={(updated) => updateRestaurant({ delivery: updated })}
      />

      <p className="text-center text-sm text-muted-foreground">
        You can always add these later
      </p>
    </div>
  );
}
