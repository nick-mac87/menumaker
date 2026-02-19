"use client";

import React from "react";
import { Menu } from "@/lib/types";
import Input from "@/components/ui/Input";

interface StepProps {
  menu: Menu;
  updateMenu: (updates: Partial<Menu>) => void;
  updateRestaurant: (updates: Partial<Menu["restaurant"]>) => void;
  updateDesign: (updates: Partial<Menu["design"]>) => void;
}

export default function Step2Location({ menu, updateRestaurant }: StepProps) {
  const { location, contact, social } = menu.restaurant;

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h2 className="text-3xl font-extrabold text-foreground">
          Where can people find you?
        </h2>
        <p className="text-base text-muted-foreground mt-1">
          Help customers reach you. Only the address is required.
        </p>
      </div>

      {/* Address */}
      <div className="flex flex-col gap-6">
        <Input
          label="Address"
          placeholder="e.g., 12 Kloof Street, Gardens, Cape Town"
          value={location.address}
          onChange={(e) =>
            updateRestaurant({
              location: { ...location, address: e.target.value },
            })
          }
        />
      </div>

      {/* Contact info */}
      <div className="flex flex-col gap-4">
        <h3 className="text-sm font-semibold text-foreground/70 uppercase tracking-wide">
          Contact
        </h3>

        <Input
          label="Phone (optional)"
          placeholder="+27 21 423 1234"
          value={contact.phone ?? ""}
          onChange={(e) =>
            updateRestaurant({
              contact: { ...contact, phone: e.target.value || undefined },
            })
          }
        />

        <Input
          label="WhatsApp (optional)"
          placeholder="+27 61 234 5678"
          value={contact.whatsapp ?? ""}
          onChange={(e) =>
            updateRestaurant({
              contact: { ...contact, whatsapp: e.target.value || undefined },
            })
          }
        />

        <Input
          label="Email (optional)"
          placeholder="hello@yourplace.co.za"
          type="email"
          value={contact.email ?? ""}
          onChange={(e) =>
            updateRestaurant({
              contact: { ...contact, email: e.target.value || undefined },
            })
          }
        />
      </div>

      {/* Social handles */}
      <div className="flex flex-col gap-4">
        <h3 className="text-sm font-semibold text-foreground/70 uppercase tracking-wide">
          Social handles
        </h3>

        <div className="flex flex-col gap-4">
          <SocialInput
            label="Instagram (optional)"
            prefix="@"
            placeholder="yourplace"
            value={social.instagram ?? ""}
            onChange={(val) =>
              updateRestaurant({
                social: { ...social, instagram: val || undefined },
              })
            }
          />

          <SocialInput
            label="Facebook (optional)"
            prefix="@"
            placeholder="yourplace"
            value={social.facebook ?? ""}
            onChange={(val) =>
              updateRestaurant({
                social: { ...social, facebook: val || undefined },
              })
            }
          />

          <SocialInput
            label="TikTok (optional)"
            prefix="@"
            placeholder="yourplace"
            value={social.tiktok ?? ""}
            onChange={(val) =>
              updateRestaurant({
                social: { ...social, tiktok: val || undefined },
              })
            }
          />
        </div>
      </div>
    </div>
  );
}

function SocialInput({
  label,
  prefix,
  placeholder,
  value,
  onChange,
}: {
  label: string;
  prefix: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
}) {
  // Strip leading @ from stored value for display
  const displayValue = value.replace(/^@/, "");

  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-medium text-foreground/70">{label}</label>
      <div className="flex">
        <span className="inline-flex items-center rounded-l-xl border border-r-0 border-border bg-muted/50 px-3 text-sm text-muted-foreground">
          {prefix}
        </span>
        <input
          type="text"
          placeholder={placeholder}
          value={displayValue}
          onChange={(e) => {
            const raw = e.target.value.replace(/^@/, "");
            onChange(raw ? `@${raw}` : "");
          }}
          className="flex-1 rounded-r-lg border border-input px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1"
        />
      </div>
    </div>
  );
}
