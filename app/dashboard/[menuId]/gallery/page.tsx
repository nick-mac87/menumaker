"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Menu, GalleryImage } from "@/lib/types";
import { getMenu, saveMenu } from "@/lib/storage";
import { cn, generateId, compressImage } from "@/lib/utils";

import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

import {
  ArrowLeft,
  Upload,
  Trash2,
  Image as ImageIcon,
  Camera,
  Link as LinkIcon,
  Crown,
} from "lucide-react";

export default function GalleryPage() {
  const params = useParams<{ menuId: string }>();
  const menuId = params.menuId;

  const [menu, setMenu] = useState<Menu | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load menu
  useEffect(() => {
    const loaded = getMenu(menuId);
    if (loaded) {
      setMenu(loaded);
    } else {
      setNotFound(true);
    }
  }, [menuId]);

  // Auto-save
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

  // Get all menu items (categories + specials) for linking
  const allMenuItems: { id: string; name: string; category: string }[] = [];
  if (menu) {
    for (const cat of menu.categories) {
      for (const item of cat.items) {
        if (item.name) {
          allMenuItems.push({ id: item.id, name: item.name, category: cat.name });
        }
      }
    }
    if (menu.specials.enabled) {
      for (const item of menu.specials.items) {
        if (item.name) {
          allMenuItems.push({ id: item.id, name: item.name, category: "Specials" });
        }
      }
    }
  }

  // Upload handler
  const handleFiles = useCallback(
    async (files: FileList | File[]) => {
      if (!menu) return;

      const isFree = menu.plan === "free";
      const currentCount = menu.gallery.length;
      const maxFree = 5;

      if (isFree && currentCount >= maxFree) {
        return; // Should not reach here if UI guards properly
      }

      setIsUploading(true);

      const fileArray = Array.from(files);
      const remainingSlots = isFree ? maxFree - currentCount : Infinity;
      const filesToProcess = fileArray.slice(0, remainingSlots);

      const newImages: GalleryImage[] = [];

      for (const file of filesToProcess) {
        if (!file.type.startsWith("image/")) continue;
        try {
          const compressed = await compressImage(file, 1200, 500);
          newImages.push({
            id: generateId(),
            src: compressed,
            caption: "",
            createdAt: new Date().toISOString(),
          });
        } catch {
          // Skip files that fail to compress
        }
      }

      if (newImages.length > 0) {
        updateMenu((prev) => ({
          ...prev,
          gallery: [...prev.gallery, ...newImages],
        }));
      }

      setIsUploading(false);
    },
    [menu, updateMenu]
  );

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;
      if (files && files.length > 0) {
        handleFiles(files);
      }
      e.target.value = "";
    },
    [handleFiles]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);
      const files = e.dataTransfer.files;
      if (files && files.length > 0) {
        handleFiles(files);
      }
    },
    [handleFiles]
  );

  // Update caption
  const updateCaption = useCallback(
    (imageId: string, caption: string) => {
      updateMenu((prev) => ({
        ...prev,
        gallery: prev.gallery.map((img) =>
          img.id === imageId ? { ...img, caption } : img
        ),
      }));
    },
    [updateMenu]
  );

  // Link image to menu item
  const linkToItem = useCallback(
    (imageId: string, itemId: string) => {
      updateMenu((prev) => {
        const image = prev.gallery.find((img) => img.id === imageId);
        if (!image) return prev;

        // Update linked item ID on gallery image
        const updatedGallery = prev.gallery.map((img) =>
          img.id === imageId
            ? { ...img, linkedItemId: itemId || undefined }
            : img
        );

        // Set image on the menu item
        let updatedCategories = prev.categories;
        let updatedSpecials = prev.specials;

        if (itemId) {
          updatedCategories = prev.categories.map((cat) => ({
            ...cat,
            items: cat.items.map((item) =>
              item.id === itemId ? { ...item, image: image.src } : item
            ),
          }));
          updatedSpecials = {
            ...prev.specials,
            items: prev.specials.items.map((item) =>
              item.id === itemId ? { ...item, image: image.src } : item
            ),
          };
        }

        return {
          ...prev,
          gallery: updatedGallery,
          categories: updatedCategories,
          specials: updatedSpecials,
        };
      });
    },
    [updateMenu]
  );

  // Delete image
  const deleteImage = useCallback(
    (imageId: string) => {
      if (!window.confirm("Delete this image? This cannot be undone.")) return;
      updateMenu((prev) => ({
        ...prev,
        gallery: prev.gallery.filter((img) => img.id !== imageId),
      }));
    },
    [updateMenu]
  );

  // Not found
  if (notFound) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-background">
        <h1 className="text-xl font-semibold text-foreground">Menu not found</h1>
        <Link href="/create">
          <Button>Create a New Menu</Button>
        </Link>
      </div>
    );
  }

  // Loading
  if (!menu) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-border border-t-primary" />
          <p className="text-sm text-muted-foreground">Loading gallery...</p>
        </div>
      </div>
    );
  }

  const isFree = menu.plan === "free";
  const galleryFull = isFree && menu.gallery.length >= 5;

  return (
    <div className="min-h-screen bg-background">
      {/* Top bar */}
      <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-border shadow-warm-sm">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center gap-3">
          <Link
            href={"/dashboard/" + menu.id}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground text-sm font-medium transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Link>
          <div className="h-4 w-px bg-border" />
          <h1 className="font-semibold text-foreground">Gallery</h1>
          <span className="text-xs text-muted-foreground ml-auto">
            {menu.gallery.length} image{menu.gallery.length !== 1 ? "s" : ""}
            {isFree ? " / 5 (free tier)" : ""}
          </span>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-6 space-y-6">
        {/* Upload Area */}
        {galleryFull ? (
          <div className="rounded-xl border-2 border-dashed border-amber-300 bg-amber-50 p-8 text-center">
            <Crown className="h-10 w-10 text-amber-500 mx-auto mb-3" />
            <h3 className="text-sm font-semibold text-amber-800 mb-1">
              Free tier limit reached
            </h3>
            <p className="text-xs text-amber-600 mb-4">
              You have reached the maximum of 5 gallery images on the free plan.
              Upgrade to Pro for unlimited images.
            </p>
            <Button variant="primary" size="sm">
              <Crown className="h-4 w-4" />
              Upgrade to Pro
            </Button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            disabled={isUploading}
            className={cn(
              "w-full rounded-2xl border-2 border-dashed p-10 transition-all duration-150 cursor-pointer",
              "focus:outline-none focus:ring-2 focus:ring-offset-1 focus-visible:ring-ring",
              isDragging
                ? "border-primary bg-red-50"
                : "border-border hover:border-primary/40 hover:bg-accent",
              isUploading && "opacity-60 cursor-wait"
            )}
          >
            {isUploading ? (
              <div className="flex flex-col items-center gap-2">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-border border-t-primary" />
                <p className="text-sm text-muted-foreground">Processing images...</p>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-2">
                <div className="flex items-center gap-3">
                  <Upload className="h-8 w-8 text-muted-foreground" />
                  <Camera className="h-8 w-8 text-muted-foreground" />
                </div>
                <p className="text-sm font-medium text-foreground/70">
                  Drop images here, or <span className="text-primary font-semibold">browse</span>
                </p>
                <p className="text-xs text-muted-foreground">
                  JPEG, PNG up to 5MB each. Images will be compressed automatically.
                </p>
              </div>
            )}
          </button>
        )}

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          capture="environment"
          multiple
          onChange={handleFileChange}
          className="hidden"
        />

        {/* Gallery Grid */}
        {menu.gallery.length === 0 ? (
          <div className="text-center py-12">
            <ImageIcon className="h-12 w-12 text-muted-foreground/40 mx-auto mb-3" aria-hidden="true" />
            <p className="text-sm text-muted-foreground">No images yet</p>
            <p className="text-xs text-muted-foreground mt-1">
              Upload photos of your dishes to showcase them on your menu
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {menu.gallery.map((image) => (
              <div
                key={image.id}
                className="bg-card rounded-2xl shadow-warm-sm hover-lift border border-border/50 overflow-hidden"
              >
                {/* Image */}
                <div className="aspect-square relative group">
                  <img
                    src={image.src}
                    alt={image.caption || "Gallery image"}
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => deleteImage(image.id)}
                    className="absolute top-2 right-2 p-1.5 rounded-lg bg-black/50 text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>

                {/* Caption & Link */}
                <div className="p-3 space-y-2">
                  <Input
                    value={image.caption || ""}
                    onChange={(e) => updateCaption(image.id, e.target.value)}
                    placeholder="Add a caption..."
                    className="text-xs"
                  />
                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-medium text-muted-foreground flex items-center gap-1">
                      <LinkIcon className="h-3 w-3" />
                      Link to item
                    </label>
                    <Select
                      value={image.linkedItemId || "__none__"}
                      onValueChange={(val) => linkToItem(image.id, val === "__none__" ? "" : val)}
                    >
                      <SelectTrigger className="w-full text-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="__none__">None</SelectItem>
                        {allMenuItems.map((item) => (
                          <SelectItem key={item.id} value={item.id}>
                            {item.category} - {item.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
