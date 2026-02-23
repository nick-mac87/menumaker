"use client";

import React, { useCallback, useRef, useState } from "react";
import { Camera, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { compressImage } from "@/lib/utils";

interface ImageUploadProps {
  value?: string;
  onChange: (base64: string) => void;
  onClear?: () => void;
  label?: string;
  maxWidth?: number;
  maxSizeKB?: number;
  className?: string;
  /** Compact mode renders a small square thumbnail button instead of the full drop zone */
  compact?: boolean;
}

export default function ImageUpload({
  value,
  onChange,
  onClear,
  label,
  maxWidth = 1200,
  maxSizeKB = 500,
  className,
  compact = false,
}: ImageUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const processFile = useCallback(
    async (file: File) => {
      if (!file.type.startsWith("image/")) {
        setError("Please upload an image file (JPEG, PNG, etc.)");
        return;
      }

      setError(null);
      setIsProcessing(true);
      try {
        const base64 = await compressImage(file, maxWidth, maxSizeKB);
        onChange(base64);
      } catch {
        setError("Failed to process image. Please try another file.");
      } finally {
        setIsProcessing(false);
      }
    },
    [onChange, maxWidth, maxSizeKB]
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

      const file = e.dataTransfer.files?.[0];
      if (file) {
        processFile(file);
      }
    },
    [processFile]
  );

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        processFile(file);
      }
      // Reset input so the same file can be selected again
      e.target.value = "";
    },
    [processFile]
  );

  const handleClear = useCallback(() => {
    if (onClear) {
      onClear();
    } else {
      onChange("");
    }
    setError(null);
  }, [onClear, onChange]);

  const hiddenInput = (
    <input
      ref={fileInputRef}
      type="file"
      accept="image/*"
      onChange={handleFileChange}
      className="hidden"
    />
  );

  /* ------------------------------------------------------------------ */
  /* Compact variant                                                     */
  /* ------------------------------------------------------------------ */
  if (compact) {
    if (value) {
      return (
        <div className={cn("flex flex-col gap-1", className)}>
          {label && (
            <span className="text-xs font-medium text-muted-foreground">{label}</span>
          )}
          <div className="relative group w-20 h-20 rounded-lg overflow-hidden border border-border">
            <img src={value} alt="" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-150 flex items-center justify-center gap-1">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="opacity-0 group-hover:opacity-100 rounded-md bg-background/90 p-1 text-foreground shadow-sm hover:bg-background transition-all duration-150"
                title="Replace"
              >
                <Camera className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={handleClear}
                className="opacity-0 group-hover:opacity-100 rounded-md bg-background/90 p-1 text-destructive shadow-sm hover:bg-destructive/10 transition-all duration-150"
                title="Remove"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
          {hiddenInput}
        </div>
      );
    }

    return (
      <div className={cn("flex flex-col gap-1", className)}>
        {label && (
          <span className="text-xs font-medium text-muted-foreground">{label}</span>
        )}
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          disabled={isProcessing}
          className={cn(
            "flex flex-col items-center justify-center gap-1 w-20 h-20 rounded-lg border-2 border-dashed",
            "transition-all duration-150 cursor-pointer",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1",
            isDragging
              ? "border-primary bg-primary/5"
              : "border-muted-foreground/25 hover:border-muted-foreground/40 hover:bg-accent/50",
            isProcessing && "opacity-60 cursor-wait"
          )}
        >
          {isProcessing ? (
            <svg
              className="h-4 w-4 animate-spin text-primary"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
          ) : (
            <>
              <Camera className="w-4 h-4 text-muted-foreground/50" />
              <span className="text-[10px] font-medium text-muted-foreground/60">Add photo</span>
            </>
          )}
        </button>
        {error && <p className="text-xs text-destructive">{error}</p>}
        {hiddenInput}
      </div>
    );
  }

  /* ------------------------------------------------------------------ */
  /* Full-size variant (default)                                         */
  /* ------------------------------------------------------------------ */
  if (value) {
    return (
      <div className={cn("flex flex-col gap-1.5", className)}>
        {label && (
          <span className="text-sm font-medium text-foreground">{label}</span>
        )}
        <div className="relative group rounded-xl overflow-hidden border border-border shadow-sm">
          <img
            src={value}
            alt="Uploaded preview"
            className="w-full h-40 object-cover"
          />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-150 flex items-center justify-center">
            <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="rounded-lg bg-background px-3 py-1.5 text-xs font-medium text-foreground shadow-sm hover:bg-accent transition-colors duration-150"
              >
                Replace
              </button>
              <button
                type="button"
                onClick={handleClear}
                className="rounded-lg bg-background px-3 py-1.5 text-xs font-medium text-destructive shadow-sm hover:bg-destructive/10 transition-colors duration-150"
              >
                Remove
              </button>
            </div>
          </div>
        </div>
        {hiddenInput}
      </div>
    );
  }

  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      {label && (
        <span className="text-sm font-medium text-foreground">{label}</span>
      )}
      <button
        type="button"
        onClick={() => fileInputRef.current?.click()}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        disabled={isProcessing}
        className={cn(
          "relative flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed p-6",
          "transition-all duration-150 cursor-pointer",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1",
          isDragging
            ? "border-primary bg-primary/5"
            : "border-muted-foreground/30 hover:border-muted-foreground/50 hover:bg-accent/50",
          isProcessing && "opacity-60 cursor-wait"
        )}
      >
        {isProcessing ? (
          <div className="flex flex-col items-center gap-2">
            <svg
              className="h-6 w-6 animate-spin text-primary"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            <span className="text-xs text-muted-foreground">Processing...</span>
          </div>
        ) : (
          <>
            <svg
              className="h-8 w-8 text-muted-foreground/60"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0022.5 18.75V5.25A2.25 2.25 0 0020.25 3H3.75A2.25 2.25 0 001.5 5.25v13.5A2.25 2.25 0 003.75 21z"
              />
            </svg>
            <div className="text-center">
              <p className="text-sm font-medium text-muted-foreground">
                Drop an image here, or{" "}
                <span className="text-primary">browse</span>
              </p>
              <p className="text-xs text-muted-foreground/60 mt-0.5">
                JPEG, PNG up to 5MB
              </p>
            </div>
          </>
        )}
      </button>
      {error && <p className="text-xs text-destructive">{error}</p>}
      {hiddenInput}
    </div>
  );
}
