"use client";

import React, { useState } from "react";
import { Crown, Check } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

interface UpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const proFeatures = [
  'Remove "Made with MenuMaker" branding',
  "Unlimited gallery images",
  "Detailed analytics & daily trends",
  "Delivery platform integrations",
  "Custom booking system",
  "Priority support",
  "Branded QR code (no watermark)",
];

export default function UpgradeModal({ isOpen, onClose }: UpgradeModalProps) {
  const [notified, setNotified] = useState(false);

  const handleNotify = () => {
    try {
      const existing = localStorage.getItem("menumaker_pro_notify");
      if (!existing) {
        localStorage.setItem("menumaker_pro_notify", new Date().toISOString());
      }
    } catch {
      // localStorage may not be available
    }
    setNotified(true);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-md p-8 rounded-2xl">
        <DialogHeader className="flex flex-col items-center text-center">
          <div className="w-14 h-14 rounded-full bg-gradient-to-br from-violet-600 to-blue-600 flex items-center justify-center mb-4">
            <Crown className="w-7 h-7 text-white" />
          </div>
          <DialogTitle className="text-2xl font-bold">
            Upgrade to MenuMaker Pro
          </DialogTitle>
          <DialogDescription className="sr-only">
            Upgrade to access pro features
          </DialogDescription>
        </DialogHeader>

        {/* Price */}
        <div className="flex items-center justify-center gap-3 mb-2">
          <span className="text-3xl font-bold">$9/month</span>
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-700">
            Coming soon
          </span>
        </div>

        {/* Features */}
        <ul className="space-y-3 mb-4">
          {proFeatures.map((feature) => (
            <li key={feature} className="flex items-start gap-3">
              <div className="flex-shrink-0 w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center mt-0.5">
                <Check className="w-3 h-3 text-emerald-600" />
              </div>
              <span className="text-sm text-muted-foreground">{feature}</span>
            </li>
          ))}
        </ul>

        {/* CTA */}
        {notified ? (
          <div className="text-center py-3 px-4 rounded-xl bg-emerald-50 border border-emerald-200">
            <p className="text-sm font-medium text-emerald-700">
              Thanks! We&apos;ll let you know when Pro is available.
            </p>
          </div>
        ) : (
          <button
            type="button"
            onClick={handleNotify}
            className="w-full py-3 px-6 text-base font-semibold text-white rounded-xl bg-gradient-to-r from-violet-600 to-blue-600 hover:opacity-90 transition-opacity shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ring"
          >
            Notify me when available
          </button>
        )}
      </DialogContent>
    </Dialog>
  );
}
