"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Menu } from "@/lib/types";
import { createEmptyMenu } from "@/lib/defaults";
import { saveMenu, saveDraft, getDraft, clearDraft } from "@/lib/storage";

import ProgressBar from "@/components/onboarding/ProgressBar";
import Step1Name from "@/components/onboarding/Step1Name";
import Step2Location from "@/components/onboarding/Step2Location";
import Step3Delivery from "@/components/onboarding/Step3Delivery";
import Step4Design from "@/components/onboarding/Step3Design";
import Step5Menu from "@/components/onboarding/Step4Menu";
import Step6Specials from "@/components/onboarding/Step5Specials";
import Step7Launch from "@/components/onboarding/Step6Launch";
import LivePreview from "@/components/onboarding/LivePreview";
import Button from "@/components/ui/Button";

const TOTAL_STEPS = 7;

export default function CreatePage() {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [menu, setMenu] = useState<Menu>(createEmptyMenu);
  const [mounted, setMounted] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  // Restore draft on mount
  useEffect(() => {
    const draft = getDraft();
    if (draft && draft.restaurant) {
      setMenu((prev) => ({ ...prev, ...draft } as Menu));
    }
    setMounted(true);
  }, []);

  // Auto-save draft whenever menu changes (after mount)
  useEffect(() => {
    if (!mounted) return;
    saveDraft(menu);
  }, [menu, mounted]);

  const updateMenu = useCallback((updates: Partial<Menu>) => {
    setMenu((prev) => ({ ...prev, ...updates }));
  }, []);

  const updateRestaurant = useCallback(
    (updates: Partial<Menu["restaurant"]>) => {
      setMenu((prev) => ({
        ...prev,
        restaurant: {
          ...prev.restaurant,
          ...updates,
          // Deep merge nested objects if they are provided
          ...(updates.delivery
            ? { delivery: { ...prev.restaurant.delivery, ...updates.delivery } }
            : {}),
          ...(updates.contact
            ? { contact: { ...prev.restaurant.contact, ...updates.contact } }
            : {}),
          ...(updates.social
            ? { social: { ...prev.restaurant.social, ...updates.social } }
            : {}),
          ...(updates.location
            ? { location: { ...prev.restaurant.location, ...updates.location } }
            : {}),
        },
      }));
    },
    []
  );

  const updateDesign = useCallback((updates: Partial<Menu["design"]>) => {
    setMenu((prev) => ({
      ...prev,
      design: { ...prev.design, ...updates },
    }));
  }, []);

  const stepProps = {
    menu,
    updateMenu,
    updateRestaurant,
    updateDesign,
  };

  const canProceed = (): boolean => {
    switch (currentStep) {
      case 1:
        return menu.restaurant.name.trim().length > 0;
      case 5:
        // At least one category with at least one named item
        return menu.categories.some(
          (cat) => cat.name.trim().length > 0 && cat.items.some((item) => item.name.trim().length > 0)
        );
      case 6:
        // Re-check menu completeness before final launch
        return menu.categories.some(
          (cat) => cat.name.trim().length > 0 && cat.items.some((item) => item.name.trim().length > 0)
        );
      default:
        return true;
    }
  };

  const handleNext = () => {
    if (currentStep === 6) {
      // Save the menu and advance to launch step
      saveMenu(menu);
      clearDraft();
      setCurrentStep(7);
      return;
    }
    if (currentStep < TOTAL_STEPS) {
      setCurrentStep((s) => s + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep((s) => s - 1);
    }
  };

  const menuUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/menu/${menu.id}`
      : "";

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <Step1Name {...stepProps} />;
      case 2:
        return <Step2Location {...stepProps} />;
      case 3:
        return <Step3Delivery {...stepProps} />;
      case 4:
        return <Step4Design {...stepProps} />;
      case 5:
        return <Step5Menu {...stepProps} />;
      case 6:
        return <Step6Specials {...stepProps} />;
      case 7:
        return <Step7Launch {...stepProps} menuUrl={menuUrl} />;
      default:
        return null;
    }
  };

  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-pulse text-muted-foreground text-sm">Loading...</div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Progress bar */}
      <div className="bg-card border-b border-border flex-shrink-0">
        <ProgressBar currentStep={currentStep} totalSteps={TOTAL_STEPS} />
      </div>

      {/* Main content — fills remaining height */}
      <div className="flex-1 flex flex-col lg:flex-row max-w-7xl mx-auto w-full min-h-0">
        {/* Step content — scrolls independently */}
        <div className="flex-1 px-4 sm:px-8 py-8 overflow-y-auto">
          <div className="max-w-xl mx-auto">{renderStep()}</div>
        </div>

        {/* Live preview (desktop) — fills column height, no outer scroll */}
        {currentStep < 7 && (
          <div className="hidden lg:flex w-[380px] border-l border-border bg-card p-8 flex-col min-h-0">
            <LivePreview menu={menu} />
          </div>
        )}
      </div>

      {/* Mobile preview toggle */}
      {currentStep < 7 && (
        <div className="lg:hidden fixed bottom-20 right-4 z-40">
          <button
            type="button"
            onClick={() => setShowPreview(!showPreview)}
            className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-primary-foreground bg-primary rounded-full shadow-warm-md hover:bg-[#d4654f] transition-colors"
          >
            {showPreview ? "Hide preview" : "Preview"}
          </button>
        </div>
      )}

      {/* Mobile preview overlay — phone frame owns the scroll, not this wrapper */}
      {showPreview && currentStep < 7 && (
        <div className="lg:hidden fixed inset-0 z-30 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-card rounded-2xl p-4 w-full max-w-sm flex flex-col max-h-[90vh]">
            <div className="flex justify-between items-center mb-4 flex-shrink-0">
              <span className="text-sm font-semibold text-muted-foreground">
                Preview
              </span>
              <button
                type="button"
                onClick={() => setShowPreview(false)}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Close
              </button>
            </div>
            <div className="flex-1 min-h-0">
              <LivePreview menu={menu} />
            </div>
          </div>
        </div>
      )}

      {/* Navigation buttons */}
      {currentStep < 7 && (
        <div className="bg-card border-t border-border px-8 py-5 flex-shrink-0">
          <div className="max-w-xl mx-auto flex items-center justify-between">
            {currentStep > 1 ? (
              <Button variant="ghost" size="md" onClick={handleBack}>
                Back
              </Button>
            ) : (
              <div />
            )}

            <div className="flex flex-col items-end gap-1">
              <Button
                variant="primary"
                size="lg"
                onClick={handleNext}
                disabled={!canProceed()}
              >
                {currentStep === 6 ? "Finish" : "Next"}
              </Button>
              {!canProceed() && (currentStep === 5 || currentStep === 6) && (
                <p className="text-xs text-destructive">
                  Add at least one category with one named item
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
