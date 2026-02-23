"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Menu, Category, MenuItem, BadgeConfig, DeliveryPlatform, ColorPreset, ThemeId } from "@/lib/types";
import { themeDefinitions, themeToDesignFields, getThemeById } from "@/lib/themes";
import { getMenu, saveMenu } from "@/lib/storage";
import { getStatTotal, getLast7DaysTotal } from "@/lib/stats";
import { DEFAULT_BADGES } from "@/lib/badges";
import { fontPairings } from "@/lib/fonts";
import { colorPresets } from "@/lib/colors";
import { cn, generateId } from "@/lib/utils";

import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import ColorPicker, { ColorPresetGrid } from "@/components/ui/ColorPicker";
import FontSelector from "@/components/ui/FontSelector";
import PatternSelector from "@/components/ui/PatternSelector";
import ImageUpload from "@/components/ui/ImageUpload";
import ThemeSelector from "@/components/ui/ThemeSelector";
import { Switch } from "@/components/ui/switch";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import LivePreview from "@/components/onboarding/LivePreview";
import QRCode from "@/components/ui/QRCode";
import { CategoryList, MenuItemEditSheet, DeleteConfirmDialog } from "@/components/menu-editor";
import { MemoizedMenuItemRow } from "@/components/menu-editor/MenuItemRow";

import {
  BarChart3,
  Eye,
  QrCode,
  MessageCircle,
  Copy,
  ExternalLink,
  Share2,
  Palette,
  UtensilsCrossed,
  Plus,
  Trash2,
  ChevronDown,
  ChevronUp,
  Image as ImageIcon,
  Check,
  Printer,
  Download,
  Globe,
  Award,
  Sparkles,
} from "lucide-react";

type TabKey = "share" | "style" | "menu";

type MenuSectionKey = "restaurant" | "badges" | "specials" | "categories";

const BORDER_RADIUS_OPTIONS: {
  value: Menu["design"]["borderRadius"];
  label: string;
  preview: string;
}[] = [
  { value: "none", label: "None", preview: "rounded-none" },
  { value: "sm", label: "Sm", preview: "rounded-sm" },
  { value: "md", label: "Md", preview: "rounded-md" },
  { value: "lg", label: "Lg", preview: "rounded-lg" },
  { value: "full", label: "Full", preview: "rounded-full" },
];

export default function DashboardPage() {
  const params = useParams<{ menuId: string }>();
  const menuId = params.menuId;

  const [menu, setMenu] = useState<Menu | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [activeTab, setActiveTab] = useState<TabKey>("share");
  const [showMobilePreview, setShowMobilePreview] = useState(false);

  useEffect(() => {
    const loaded = getMenu(menuId);
    if (loaded) {
      setMenu(loaded);
    } else {
      setNotFound(true);
    }
  }, [menuId]);

  useEffect(() => {
    if (menu) {
      saveMenu(menu);
    }
  }, [menu]);

  const updateMenu = useCallback((updater: (prev: Menu) => Menu) => {
    setMenu((prev) => {
      if (!prev) return prev;
      return updater(prev);
    });
  }, []);

  if (notFound) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-muted/50">
        <h1 className="text-xl font-semibold text-foreground">Menu not found</h1>
        <p className="text-muted-foreground text-sm">
          The menu you are looking for does not exist or has been deleted.
        </p>
        <Link href="/create">
          <Button>Create a New Menu</Button>
        </Link>
      </div>
    );
  }

  if (!menu) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted/50">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-border border-t-primary" />
          <p className="text-sm text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  const tabs: { key: TabKey; label: string; icon: React.ReactNode }[] = [
    { key: "share", label: "Share", icon: <Share2 className="h-4 w-4" /> },
    { key: "style", label: "Style", icon: <Palette className="h-4 w-4" /> },
    { key: "menu", label: "Menu", icon: <UtensilsCrossed className="h-4 w-4" /> },
  ];

  return (
    <div className="min-h-screen bg-muted/50">
      <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-border shadow-warm-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <Link href="/" className="text-muted-foreground hover:text-foreground shrink-0">
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
              </svg>
            </Link>
            <h1 className="font-semibold text-foreground truncate">
              {menu.restaurant.name || "Untitled Menu"}
            </h1>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <Link href={"/menu/" + menu.id} target="_blank">
              <Button variant="secondary" size="sm">
                <Eye className="h-4 w-4" />
                <span className="hidden sm:inline">View Menu</span>
              </Button>
            </Link>
            <Link href={"/menu/" + menu.id + "/print"} target="_blank">
              <Button variant="secondary" size="sm">
                <Printer className="h-4 w-4" />
                <span className="hidden sm:inline">Print</span>
              </Button>
            </Link>
            <Link href={"/dashboard/" + menu.id + "/gallery"}>
              <Button variant="secondary" size="sm">
                <ImageIcon className="h-4 w-4" aria-hidden="true" />
                <span className="hidden sm:inline">Gallery</span>
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as typeof activeTab)}>
        <div className="bg-white border-b border-border">
          <div className="max-w-7xl mx-auto px-4">
            <TabsList className="bg-transparent h-auto p-0 gap-1">
              {tabs.map((tab) => (
                <TabsTrigger
                  key={tab.key}
                  value={tab.key}
                  className="flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 rounded-none data-[state=active]:border-primary data-[state=active]:text-primary data-[state=active]:shadow-none border-transparent text-muted-foreground hover:text-foreground hover:border-border transition-colors"
                >
                  {tab.icon}{tab.label}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>
        </div>
        <div className="max-w-7xl mx-auto flex min-h-0">
          {/* Tab content — scrollable */}
          <main className="flex-1 min-w-0 px-4 py-6">
            <TabsContent value="share"><ShareTab menu={menu} menuId={menuId} /></TabsContent>
            <TabsContent value="style"><StyleTab menu={menu} updateMenu={updateMenu} /></TabsContent>
            <TabsContent value="menu"><MenuTab menu={menu} updateMenu={updateMenu} /></TabsContent>
          </main>

          {/* Live preview panel (desktop) */}
          <div className="hidden lg:flex w-[340px] shrink-0 border-l border-border bg-card sticky top-[105px] h-[calc(100vh-105px)] p-6 flex-col">
            <LivePreview menu={menu} />
          </div>
        </div>

        {/* Mobile preview toggle */}
        <div className="lg:hidden fixed bottom-6 right-4 z-40">
          <button
            type="button"
            onClick={() => setShowMobilePreview(!showMobilePreview)}
            className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-primary-foreground bg-primary rounded-full shadow-warm-md hover:bg-[#d4654f] transition-colors active:scale-[0.98]"
          >
            <Eye className="h-4 w-4" />
            {showMobilePreview ? "Hide preview" : "Preview"}
          </button>
        </div>

        {/* Mobile preview overlay */}
        {showMobilePreview && (
          <div className="lg:hidden fixed inset-0 z-30 bg-black/50 flex items-center justify-center p-4">
            <div className="bg-card rounded-2xl p-4 w-full max-w-sm flex flex-col max-h-[90vh]">
              <div className="flex justify-between items-center mb-4 flex-shrink-0">
                <span className="text-sm font-semibold text-muted-foreground">Preview</span>
                <button
                  type="button"
                  onClick={() => setShowMobilePreview(false)}
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
      </Tabs>
    </div>
  );
}

function ShareTab({ menu, menuId }: { menu: Menu; menuId: string }) {
  const [copied, setCopied] = useState(false);
  const [stats, setStats] = useState({
    menuViews: 0, menuViews7d: 0,
    qrScans: 0, qrScans7d: 0,
    whatsapp: 0, whatsapp7d: 0,
    interactions: 0, interactions7d: 0,
  });

  useEffect(() => {
    const deliveryTotal = getStatTotal(menuId, "delivery_click");
    const bookingTotal = getStatTotal(menuId, "booking_click");
    const directionsTotal = getStatTotal(menuId, "directions_click");
    const socialTotal = getStatTotal(menuId, "social_click");
    const phoneTotal = getStatTotal(menuId, "phone_click");
    const delivery7d = getLast7DaysTotal(menuId, "delivery_click");
    const booking7d = getLast7DaysTotal(menuId, "booking_click");
    const directions7d = getLast7DaysTotal(menuId, "directions_click");
    const social7d = getLast7DaysTotal(menuId, "social_click");
    const phone7d = getLast7DaysTotal(menuId, "phone_click");

    setStats({
      menuViews: getStatTotal(menuId, "menu_view"),
      menuViews7d: getLast7DaysTotal(menuId, "menu_view"),
      qrScans: getStatTotal(menuId, "qr_scan"),
      qrScans7d: getLast7DaysTotal(menuId, "qr_scan"),
      whatsapp: getStatTotal(menuId, "whatsapp_click"),
      whatsapp7d: getLast7DaysTotal(menuId, "whatsapp_click"),
      interactions: deliveryTotal + bookingTotal + directionsTotal + socialTotal + phoneTotal,
      interactions7d: delivery7d + booking7d + directions7d + social7d + phone7d,
    });
  }, [menuId]);

  const menuUrl = typeof window !== "undefined"
    ? window.location.origin + "/menu/" + menu.id
    : "/menu/" + menu.id;

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(menuUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      const input = document.createElement("input");
      input.value = menuUrl;
      document.body.appendChild(input);
      input.select();
      document.execCommand("copy");
      document.body.removeChild(input);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }, [menuUrl]);

  const handleShareWhatsApp = useCallback(() => {
    const text = encodeURIComponent("Check out our menu: " + menuUrl);
    window.open("https://wa.me/?text=" + text, "_blank");
  }, [menuUrl]);

  const statCards = [
    { label: "Menu Views", total: stats.menuViews, last7d: stats.menuViews7d, icon: <Eye className="h-5 w-5 text-primary" /> },
    { label: "QR Scans", total: stats.qrScans, last7d: stats.qrScans7d, icon: <QrCode className="h-5 w-5 text-purple-500" /> },
    { label: "WhatsApp Taps", total: stats.whatsapp, last7d: stats.whatsapp7d, icon: <MessageCircle className="h-5 w-5 text-green-500" /> },
    { label: "Interactions", total: stats.interactions, last7d: stats.interactions7d, icon: <BarChart3 className="h-5 w-5 text-orange-500" /> },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {statCards.map((card) => (
          <div key={card.label} className="bg-card rounded-2xl shadow-warm-sm hover-lift border border-border/50 p-5">
            <div className="flex items-center justify-between mb-2">{card.icon}</div>
            <p className="text-3xl font-extrabold text-foreground">{card.total}</p>
            <p className="text-sm text-muted-foreground mt-0.5">{card.label}</p>
            <p className="text-xs text-muted-foreground mt-1">Last 7 days: {card.last7d}</p>
          </div>
        ))}
      </div>

      <div className="bg-card rounded-2xl shadow-warm-sm border border-border/50 p-6">
        <h3 className="text-sm font-semibold text-foreground mb-3">Menu URL</h3>
        <div className="flex gap-2">
          <input type="text" value={menuUrl} readOnly className="flex-1 rounded-lg border border-border px-3 py-2 text-sm text-foreground bg-muted/50 truncate" />
          <Button variant="secondary" size="sm" onClick={handleCopy} className="shrink-0">
            {copied ? (<><Check className="h-4 w-4 text-green-500" />Copied!</>) : (<><Copy className="h-4 w-4" />Copy</>)}
          </Button>
          <Link href={"/menu/" + menu.id} target="_blank">
            <Button variant="secondary" size="sm" className="shrink-0">
              <ExternalLink className="h-4 w-4" />Open
            </Button>
          </Link>
        </div>
      </div>

      <div className="bg-card rounded-2xl shadow-warm-sm border border-border/50 p-6">
        <h3 className="text-sm font-semibold text-foreground mb-3">QR Code</h3>
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <div className="w-64 h-64 rounded-xl border border-border flex items-center justify-center bg-white p-3">
            <QRCode url={menuUrl + "?source=qr"} color={menu.design.primaryColor} logo={menu.restaurant.logo || undefined} size={232} />
          </div>
          <div className="flex flex-col gap-3">
            <p className="text-sm text-muted-foreground">Print this QR code and place it on your tables. Customers scan it to view your menu instantly.</p>
            <Button variant="secondary" size="sm" onClick={async () => {
              try {
                const { downloadQRCode } = await import("@/components/ui/QRCode");
                await downloadQRCode(menuUrl, menu.design.primaryColor, menu.restaurant.logo || undefined, (menu.restaurant.name || "menu") + "-qr.png");
              } catch {
                alert("QR download requires a modern browser.");
              }
            }}>
              <Download className="h-4 w-4" />Download QR
            </Button>
          </div>
        </div>
      </div>

      <div className="bg-card rounded-2xl shadow-warm-sm border border-border/50 p-6">
        <h3 className="text-sm font-semibold text-foreground mb-3">Quick Actions</h3>
        <div className="flex flex-wrap gap-3">
          <Button variant="accent" size="md" onClick={handleShareWhatsApp}>
            <MessageCircle className="h-4 w-4" />Share via WhatsApp
          </Button>
        </div>
      </div>
    </div>
  );
}

function StyleTab({ menu, updateMenu }: { menu: Menu; updateMenu: (updater: (prev: Menu) => Menu) => void }) {
  const updateDesign = useCallback(
    (field: keyof Menu["design"], value: string) => {
      updateMenu((prev) => ({ ...prev, design: { ...prev.design, [field]: value } }));
    },
    [updateMenu]
  );

  const applyColorPreset = useCallback(
    (preset: ColorPreset) => {
      updateMenu((prev) => ({
        ...prev,
        design: {
          ...prev.design,
          primaryColor: preset.primaryColor,
          accentColor: preset.accentColor,
          backgroundColor: preset.backgroundColor,
          textColor: preset.textColor,
        },
      }));
    },
    [updateMenu]
  );

  const applyFontPairing = useCallback(
    (pairingId: string) => {
      const pairing = fontPairings.find((p) => p.id === pairingId);
      if (pairing) {
        updateMenu((prev) => ({
          ...prev,
          design: { ...prev.design, headingFont: pairing.headingFont, bodyFont: pairing.bodyFont },
        }));
      }
    },
    [updateMenu]
  );

  const currentFontPairingId = useMemo(() => {
    const match = fontPairings.find(
      (p) => p.headingFont === menu.design.headingFont && p.bodyFont === menu.design.bodyFont
    );
    return match?.id || "classic";
  }, [menu.design.headingFont, menu.design.bodyFont]);

  const currentColorPresetId = useMemo(() => {
    const match = colorPresets.find(
      (p: ColorPreset) =>
        p.primaryColor === menu.design.primaryColor &&
        p.accentColor === menu.design.accentColor &&
        p.backgroundColor === menu.design.backgroundColor &&
        p.textColor === menu.design.textColor
    );
    return match?.id;
  }, [menu.design.primaryColor, menu.design.accentColor, menu.design.backgroundColor, menu.design.textColor]);

  const activeThemeId = useMemo(() => {
    return themeDefinitions.find((theme) => {
      const fields = themeToDesignFields(theme);
      return (
        fields.primaryColor === menu.design.primaryColor &&
        fields.accentColor === menu.design.accentColor &&
        fields.backgroundColor === menu.design.backgroundColor &&
        fields.textColor === menu.design.textColor &&
        fields.headingFont === menu.design.headingFont &&
        fields.bodyFont === menu.design.bodyFont
      );
    })?.id;
  }, [menu.design.primaryColor, menu.design.accentColor, menu.design.backgroundColor, menu.design.textColor, menu.design.headingFont, menu.design.bodyFont]);

  const handleThemeSelect = useCallback(
    (themeId: ThemeId) => {
      const theme = getThemeById(themeId);
      if (!theme) return;
      const fields = themeToDesignFields(theme);
      updateMenu((prev) => ({
        ...prev,
        design: { ...prev.design, ...fields },
      }));
    },
    [updateMenu]
  );

  return (
    <div className="space-y-6">
      <div className="bg-card rounded-2xl shadow-warm-sm border border-border/50 p-6">
        <h3 className="text-sm font-semibold text-foreground mb-3">Theme</h3>
        <ThemeSelector value={activeThemeId} onChange={handleThemeSelect} />
      </div>

      <div className="bg-card rounded-2xl shadow-warm-sm border border-border/50 p-6">
        <h3 className="text-sm font-semibold text-foreground mb-3">Current Palette</h3>
        <div className="flex gap-2">
          {[
            { label: "Primary", color: menu.design.primaryColor },
            { label: "Accent", color: menu.design.accentColor },
            { label: "Background", color: menu.design.backgroundColor },
            { label: "Text", color: menu.design.textColor },
          ].map((swatch) => (
            <div key={swatch.label} className="flex flex-col items-center gap-1">
              <div className="w-12 h-12 rounded-lg border border-border shadow-sm" style={{ backgroundColor: swatch.color }} />
              <span className="text-[10px] text-muted-foreground">{swatch.label}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-card rounded-2xl shadow-warm-sm border border-border/50 p-6">
        <h3 className="text-sm font-semibold text-foreground mb-3">Color Presets</h3>
        <ColorPresetGrid onSelect={applyColorPreset} activePresetId={currentColorPresetId} />
      </div>

      <div className="bg-card rounded-2xl shadow-warm-sm border border-border/50 p-6">
        <h3 className="text-sm font-semibold text-foreground mb-4">Custom Colors</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <ColorPicker label="Primary Color" value={menu.design.primaryColor} onChange={(c) => updateDesign("primaryColor", c)} />
          <ColorPicker label="Accent Color" value={menu.design.accentColor} onChange={(c) => updateDesign("accentColor", c)} />
          <ColorPicker label="Background Color" value={menu.design.backgroundColor} onChange={(c) => updateDesign("backgroundColor", c)} />
          <ColorPicker label="Text Color" value={menu.design.textColor} onChange={(c) => updateDesign("textColor", c)} />
        </div>
      </div>

      <div className="bg-card rounded-2xl shadow-warm-sm border border-border/50 p-6">
        <h3 className="text-sm font-semibold text-foreground mb-3">Font Pairing</h3>
        <FontSelector value={currentFontPairingId} onChange={applyFontPairing} />
      </div>

      <div className="bg-card rounded-2xl shadow-warm-sm border border-border/50 p-6">
        <h3 className="text-sm font-semibold text-foreground mb-3">Background Pattern</h3>
        <PatternSelector value={menu.design.backgroundPattern} onChange={(id) => updateDesign("backgroundPattern", id)} previewColor={menu.design.textColor} />
      </div>

      <div className="bg-card rounded-2xl shadow-warm-sm border border-border/50 p-6">
        <h3 className="text-sm font-semibold text-foreground mb-3">Border Radius</h3>
        <div className="flex gap-3 flex-wrap">
          {BORDER_RADIUS_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => updateMenu((prev) => ({ ...prev, design: { ...prev.design, borderRadius: opt.value } }))}
              className={cn(
                "flex flex-col items-center gap-2 rounded-xl border p-3 transition-all duration-150 min-w-[64px]",
                "hover:shadow-md focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-primary/40",
                menu.design.borderRadius === opt.value
                  ? "border-primary ring-2 ring-primary/30 shadow-sm"
                  : "border-border hover:border-border"
              )}
            >
              <div className={cn("w-10 h-10 border-2 border-muted-foreground", opt.preview)} style={{ backgroundColor: menu.design.primaryColor + "33" }} />
              <span className="text-xs font-medium text-muted-foreground">{opt.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function MenuTab({ menu, updateMenu }: { menu: Menu; updateMenu: (updater: (prev: Menu) => Menu) => void }) {
  const [expandedSections, setExpandedSections] = useState<Set<MenuSectionKey>>(() => new Set<MenuSectionKey>(["restaurant"]));

  const toggleSection = useCallback((key: MenuSectionKey) => {
    setExpandedSections((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  }, []);

  const handleCategoriesChange = useCallback((categories: Category[]) => {
    updateMenu((prev) => ({ ...prev, categories }));
  }, [updateMenu]);

  const currentCurrency = menu.categories[0]?.items[0]?.currency || "R";

  return (
    <div className="space-y-4">
      <CollapsibleSection title="Restaurant Info" icon={<Globe className="h-4 w-4" />} expanded={expandedSections.has("restaurant")} onToggle={() => toggleSection("restaurant")}>
        <RestaurantInfoSection menu={menu} updateMenu={updateMenu} />
      </CollapsibleSection>
      <CollapsibleSection title="Badges & Ribbons" icon={<Award className="h-4 w-4" />} expanded={expandedSections.has("badges")} onToggle={() => toggleSection("badges")}>
        <BadgesSection menu={menu} updateMenu={updateMenu} />
      </CollapsibleSection>
      <CollapsibleSection title="Specials" icon={<Sparkles className="h-4 w-4" />} expanded={expandedSections.has("specials")} onToggle={() => toggleSection("specials")}>
        <SpecialsSection menu={menu} updateMenu={updateMenu} />
      </CollapsibleSection>
      <CollapsibleSection title="Categories & Items" icon={<UtensilsCrossed className="h-4 w-4" />} expanded={expandedSections.has("categories")} onToggle={() => toggleSection("categories")}>
        <CategoryList
          categories={menu.categories}
          badges={menu.badges}
          currency={currentCurrency}
          onCategoriesChange={handleCategoriesChange}
        />
      </CollapsibleSection>
    </div>
  );
}

function CollapsibleSection({ title, icon, expanded, onToggle, children }: { title: string; icon: React.ReactNode; expanded: boolean; onToggle: () => void; children: React.ReactNode }) {
  return (
    <Collapsible open={expanded} onOpenChange={() => onToggle()}>
      <div className="bg-card rounded-2xl shadow-warm-sm border border-border/50 overflow-hidden">
        <CollapsibleTrigger asChild>
          <button className="w-full flex items-center justify-between px-6 py-5 text-left hover:bg-accent transition-colors duration-150">
            <div className="flex items-center gap-2">
              {icon}
              <h3 className="text-sm font-semibold">{title}</h3>
            </div>
            {expanded ? <ChevronUp className="h-4 w-4 text-muted-foreground" /> : <ChevronDown className="h-4 w-4 text-muted-foreground" />}
          </button>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <div className="px-6 pb-6 border-t border-border pt-4">
            {children}
          </div>
        </CollapsibleContent>
      </div>
    </Collapsible>
  );
}

function RestaurantInfoSection({ menu, updateMenu }: { menu: Menu; updateMenu: (updater: (prev: Menu) => Menu) => void }) {
  const updateRestaurant = useCallback((field: string, value: unknown) => {
    updateMenu((prev) => ({ ...prev, restaurant: { ...prev.restaurant, [field]: value } }));
  }, [updateMenu]);

  const updateContact = useCallback((field: string, value: string) => {
    updateMenu((prev) => ({ ...prev, restaurant: { ...prev.restaurant, contact: { ...prev.restaurant.contact, [field]: value } } }));
  }, [updateMenu]);

  const updateSocial = useCallback((field: string, value: string) => {
    updateMenu((prev) => ({ ...prev, restaurant: { ...prev.restaurant, social: { ...prev.restaurant.social, [field]: value } } }));
  }, [updateMenu]);

  const updateLocation = useCallback((field: string, value: string) => {
    updateMenu((prev) => ({ ...prev, restaurant: { ...prev.restaurant, location: { ...prev.restaurant.location, [field]: value } } }));
  }, [updateMenu]);

  const updateDelivery = useCallback((field: string, value: string) => {
    updateMenu((prev) => ({ ...prev, restaurant: { ...prev.restaurant, delivery: { ...(prev.restaurant.delivery || {}), [field]: value } } }));
  }, [updateMenu]);

  const hours = menu.restaurant.hours || {};
  const hoursEntries = Object.entries(hours);

  const addHoursEntry = useCallback(() => {
    updateMenu((prev) => {
      const existingHours = prev.restaurant.hours || {};
      const newKey = "New " + (Object.keys(existingHours).length + 1);
      return { ...prev, restaurant: { ...prev.restaurant, hours: { ...existingHours, [newKey]: "" } } };
    });
  }, [updateMenu]);

  const updateHoursKey = useCallback((oldKey: string, newKey: string) => {
    updateMenu((prev) => {
      const oldHours = prev.restaurant.hours || {};
      const entries = Object.entries(oldHours);
      const newHours: Record<string, string> = {};
      for (const [k, v] of entries) {
        if (k === oldKey) newHours[newKey] = v;
        else newHours[k] = v;
      }
      return { ...prev, restaurant: { ...prev.restaurant, hours: newHours } };
    });
  }, [updateMenu]);

  const updateHoursValue = useCallback((key: string, value: string) => {
    updateMenu((prev) => ({ ...prev, restaurant: { ...prev.restaurant, hours: { ...(prev.restaurant.hours || {}), [key]: value } } }));
  }, [updateMenu]);

  const removeHoursEntry = useCallback((key: string) => {
    updateMenu((prev) => {
      const newHours = { ...(prev.restaurant.hours || {}) };
      delete newHours[key];
      return { ...prev, restaurant: { ...prev.restaurant, hours: newHours } };
    });
  }, [updateMenu]);

  const customDelivery = menu.restaurant.delivery?.custom || [];

  const addCustomDelivery = useCallback(() => {
    updateMenu((prev) => ({
      ...prev,
      restaurant: { ...prev.restaurant, delivery: { ...(prev.restaurant.delivery || {}), custom: [...(prev.restaurant.delivery?.custom || []), { name: "", url: "" }] } },
    }));
  }, [updateMenu]);

  const updateCustomDelivery = useCallback((index: number, field: keyof DeliveryPlatform, value: string) => {
    updateMenu((prev) => {
      const custom = [...(prev.restaurant.delivery?.custom || [])];
      custom[index] = { ...custom[index], [field]: value };
      return { ...prev, restaurant: { ...prev.restaurant, delivery: { ...(prev.restaurant.delivery || {}), custom } } };
    });
  }, [updateMenu]);

  const removeCustomDelivery = useCallback((index: number) => {
    updateMenu((prev) => {
      const custom = [...(prev.restaurant.delivery?.custom || [])];
      custom.splice(index, 1);
      return { ...prev, restaurant: { ...prev.restaurant, delivery: { ...(prev.restaurant.delivery || {}), custom } } };
    });
  }, [updateMenu]);

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <Input label="Restaurant Name" value={menu.restaurant.name} onChange={(e) => updateRestaurant("name", e.target.value)} placeholder="e.g. The Yard" />
        <Input label="Tagline" value={menu.restaurant.tagline} onChange={(e) => updateRestaurant("tagline", e.target.value)} placeholder="e.g. Wood-fired flavours, neighbourhood vibes" />
        <ImageUpload label="Logo" value={menu.restaurant.logo || undefined} onChange={(base64) => updateRestaurant("logo", base64)} onClear={() => updateRestaurant("logo", "")} maxWidth={400} maxSizeKB={200} />
      </div>

      <div>
        <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">Location</h4>
        <Input label="Address" value={menu.restaurant.location.address} onChange={(e) => updateLocation("address", e.target.value)} placeholder="e.g. 12 Kloof Street, Gardens, Cape Town" />
      </div>

      <div>
        <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">Contact</h4>
        <div className="space-y-3">
          <Input label="Phone" value={menu.restaurant.contact.phone || ""} onChange={(e) => updateContact("phone", e.target.value)} placeholder="+27 21 423 1234" />
          <Input label="WhatsApp" value={menu.restaurant.contact.whatsapp || ""} onChange={(e) => updateContact("whatsapp", e.target.value)} placeholder="+27612345678" />
          <Input label="Email" value={menu.restaurant.contact.email || ""} onChange={(e) => updateContact("email", e.target.value)} placeholder="hello@restaurant.com" type="email" />
        </div>
      </div>

      <div>
        <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">Social Media</h4>
        <div className="space-y-3">
          <Input label="Instagram" value={menu.restaurant.social.instagram || ""} onChange={(e) => updateSocial("instagram", e.target.value)} placeholder="@yourrestaurant" />
          <Input label="Facebook" value={menu.restaurant.social.facebook || ""} onChange={(e) => updateSocial("facebook", e.target.value)} placeholder="yourrestaurant" />
          <Input label="TikTok" value={menu.restaurant.social.tiktok || ""} onChange={(e) => updateSocial("tiktok", e.target.value)} placeholder="@yourrestaurant" />
          <Input label="Website" value={menu.restaurant.social.website || ""} onChange={(e) => updateSocial("website", e.target.value)} placeholder="https://yourrestaurant.com" />
        </div>
      </div>

      <div>
        <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">Operating Hours</h4>
        <div className="space-y-2">
          {hoursEntries.map(([key, value], index) => (
            <div key={index} className="flex gap-2 items-start">
              <Input value={key} onChange={(e) => updateHoursKey(key, e.target.value)} placeholder="e.g. Mon - Fri" className="flex-1" />
              <Input value={value} onChange={(e) => updateHoursValue(key, e.target.value)} placeholder="e.g. 09:00 - 22:00" className="flex-1" />
              <button type="button" onClick={() => removeHoursEntry(key)} className="mt-2 p-1.5 text-muted-foreground hover:text-red-500 transition-colors">
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
          <Button variant="ghost" size="sm" onClick={addHoursEntry}><Plus className="h-4 w-4" />Add Hours</Button>
        </div>
      </div>

      <div>
        <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">Delivery Platforms</h4>
        <div className="space-y-3">
          <Input label="Uber Eats URL" value={menu.restaurant.delivery?.uberEats || ""} onChange={(e) => updateDelivery("uberEats", e.target.value)} placeholder="https://www.ubereats.com/store/..." />
          <Input label="Wolt URL" value={menu.restaurant.delivery?.wolt || ""} onChange={(e) => updateDelivery("wolt", e.target.value)} placeholder="https://wolt.com/..." />
          <Input label="Mr D URL" value={menu.restaurant.delivery?.mrD || ""} onChange={(e) => updateDelivery("mrD", e.target.value)} placeholder="https://www.mrd.co.za/..." />
          <Input label="Deliveroo URL" value={menu.restaurant.delivery?.deliveroo || ""} onChange={(e) => updateDelivery("deliveroo", e.target.value)} placeholder="https://deliveroo.com/..." />
          {customDelivery.map((platform, idx) => (
            <div key={idx} className="flex gap-2 items-start">
              <Input value={platform.name} onChange={(e) => updateCustomDelivery(idx, "name", e.target.value)} placeholder="Platform name" className="flex-1" />
              <Input value={platform.url} onChange={(e) => updateCustomDelivery(idx, "url", e.target.value)} placeholder="https://..." className="flex-1" />
              <button type="button" onClick={() => removeCustomDelivery(idx)} className="mt-2 p-1.5 text-muted-foreground hover:text-red-500 transition-colors">
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
          <Button variant="ghost" size="sm" onClick={addCustomDelivery}><Plus className="h-4 w-4" />Add Custom Delivery Link</Button>
        </div>
      </div>

      <div>
        <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">Table Booking</h4>
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <Switch
              checked={!!menu.restaurant.bookingEnabled}
              onCheckedChange={(checked) => updateRestaurant("bookingEnabled", checked)}
            />
            <span className="text-sm text-foreground">{menu.restaurant.bookingEnabled ? "Booking enabled" : "Booking disabled"}</span>
          </div>
          {menu.restaurant.bookingEnabled && (
            <Input label="Booking URL" value={menu.restaurant.bookingUrl || ""} onChange={(e) => updateRestaurant("bookingUrl", e.target.value)} placeholder="Leave empty to use WhatsApp" helperText="If empty, the booking button will open a WhatsApp message" />
          )}
        </div>
      </div>
    </div>
  );
}

function BadgesSection({ menu, updateMenu }: { menu: Menu; updateMenu: (updater: (prev: Menu) => Menu) => void }) {
  const defaultBadgeIds = DEFAULT_BADGES.map((b) => b.id);

  const updateBadge = useCallback((id: string, field: keyof BadgeConfig, value: string | boolean) => {
    updateMenu((prev) => ({ ...prev, badges: prev.badges.map((b) => (b.id === id ? { ...b, [field]: value } : b)) }));
  }, [updateMenu]);

  const addCustomBadge = useCallback(() => {
    const newBadge: BadgeConfig = { id: generateId(), label: "New Badge", icon: "\uD83C\uDFF7\uFE0F", color: "#6B7280", enabled: true };
    updateMenu((prev) => ({ ...prev, badges: [...prev.badges, newBadge] }));
  }, [updateMenu]);

  const removeBadge = useCallback((id: string) => {
    updateMenu((prev) => {
      const badge = prev.badges.find((b) => b.id === id);
      const label = badge?.label || "this badge";
      if (!window.confirm(`Delete "${label}"? Items using it will be unlinked.`)) return prev;
      return {
        ...prev,
        badges: prev.badges.filter((b) => b.id !== id),
        categories: prev.categories.map((cat) => ({ ...cat, items: cat.items.map((item) => (item.badge === id ? { ...item, badge: undefined } : item)) })),
        specials: { ...prev.specials, items: prev.specials.items.map((item) => (item.badge === id ? { ...item, badge: undefined } : item)) },
      };
    });
  }, [updateMenu]);

  return (
    <div className="space-y-4">
      <p className="text-xs text-muted-foreground">Assign badges to menu items below to highlight them on your menu. Customers see these as ribbons or labels on featured items.</p>
      <div className="space-y-3">
        {menu.badges.map((badge) => {
          const isDefault = defaultBadgeIds.includes(badge.id);
          return (
            <div key={badge.id} className="flex items-center gap-3 p-3 rounded-lg border border-border bg-muted/50">
              <input type="text" value={badge.icon} onChange={(e) => updateBadge(badge.id, "icon", e.target.value)} className="w-10 h-10 text-center text-lg rounded-lg border border-border bg-white" maxLength={4} />
              <Input value={badge.label} onChange={(e) => updateBadge(badge.id, "label", e.target.value)} className="flex-1" placeholder="Badge label" />
              <div className="relative shrink-0">
                <input type="color" value={badge.color} onChange={(e) => updateBadge(badge.id, "color", e.target.value)} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                <div className="w-8 h-8 rounded-lg border border-border cursor-pointer" style={{ backgroundColor: badge.color }} />
              </div>
              <Switch
                checked={badge.enabled}
                onCheckedChange={(checked) => updateBadge(badge.id, "enabled", checked)}
              />
              {!isDefault && (
                <button type="button" onClick={() => removeBadge(badge.id)} className="p-1 text-muted-foreground hover:text-red-500 transition-colors">
                  <Trash2 className="h-4 w-4" />
                </button>
              )}
            </div>
          );
        })}
      </div>
      <Button variant="ghost" size="sm" onClick={addCustomBadge}><Plus className="h-4 w-4" />Add Custom Badge</Button>
    </div>
  );
}

function SpecialsSection({ menu, updateMenu }: { menu: Menu; updateMenu: (updater: (prev: Menu) => Menu) => void }) {
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [deleteItemId, setDeleteItemId] = useState<string | null>(null);

  const currentCurrency = menu.categories[0]?.items[0]?.currency || "R";

  const addSpecialItem = useCallback(() => {
    const newItem: MenuItem = { id: generateId(), name: "", description: "", price: 0, currency: currentCurrency, tags: [], available: true };
    updateMenu((prev) => ({ ...prev, specials: { ...prev.specials, items: [...prev.specials.items, newItem] } }));
    setEditingItem(newItem);
  }, [updateMenu, currentCurrency]);

  const updateSpecialItem = useCallback((updates: Partial<MenuItem>) => {
    if (!editingItem) return;
    const updatedItem = { ...editingItem, ...updates };
    setEditingItem(updatedItem);
    updateMenu((prev) => ({
      ...prev,
      specials: { ...prev.specials, items: prev.specials.items.map((item) => (item.id === editingItem.id ? updatedItem : item)) },
    }));
  }, [updateMenu, editingItem]);

  const confirmDeleteItem = useCallback((itemId: string) => {
    updateMenu((prev) => ({
      ...prev,
      specials: { ...prev.specials, items: prev.specials.items.filter((i) => i.id !== itemId) },
    }));
    setEditingItem(null);
    setDeleteItemId(null);
  }, [updateMenu]);

  const deleteTarget = deleteItemId ? menu.specials.items.find((i) => i.id === deleteItemId) : null;

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <Switch
          checked={menu.specials.enabled}
          onCheckedChange={(checked) => updateMenu((prev) => ({ ...prev, specials: { ...prev.specials, enabled: checked } }))}
        />
        <span className="text-sm text-foreground">{menu.specials.enabled ? "Specials enabled" : "Specials disabled"}</span>
      </div>
      {menu.specials.enabled && (
        <>
          <Input label="Specials Title" value={menu.specials.title} onChange={(e) => updateMenu((prev) => ({ ...prev, specials: { ...prev.specials, title: e.target.value } }))} placeholder="e.g. Chef's Specials" />
          {menu.specials.items.length > 0 && (
            <div className="divide-y divide-border/50 rounded-lg border border-border/50 overflow-hidden bg-card">
              {menu.specials.items.map((item) => (
                <MemoizedMenuItemRow
                  key={item.id}
                  item={item}
                  currency={currentCurrency}
                  onEdit={() => setEditingItem(item)}
                  onDelete={() => setDeleteItemId(item.id)}
                />
              ))}
            </div>
          )}
          <Button variant="ghost" size="sm" onClick={addSpecialItem}><Plus className="h-4 w-4" />Add Special Item</Button>
        </>
      )}

      <MenuItemEditSheet
        open={!!editingItem}
        onOpenChange={(open) => { if (!open) setEditingItem(null); }}
        item={editingItem}
        badges={menu.badges}
        currency={currentCurrency}
        onUpdate={updateSpecialItem}
        onDelete={() => { if (editingItem) setDeleteItemId(editingItem.id); }}
      />

      <DeleteConfirmDialog
        open={!!deleteItemId}
        onOpenChange={(open) => { if (!open) setDeleteItemId(null); }}
        title="Delete special?"
        description={`This will remove "${deleteTarget?.name || "this special"}" from your menu.`}
        onConfirm={() => { if (deleteItemId) confirmDeleteItem(deleteItemId); }}
      />
    </div>
  );
}

