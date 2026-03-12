"use client";

import React, { useState, useCallback, useRef } from "react";
import { Category } from "@/lib/types";
import { Sparkles, Upload, CheckCircle, AlertCircle, Loader2, X } from "lucide-react";
import Button from "@/components/ui/Button";

interface ScanMenuUploadProps {
  onSuccess: (categories: Category[]) => void;
  onSkip: () => void;
}

type Status = "idle" | "previewing" | "scanning" | "success" | "error";

export default function ScanMenuUpload({ onSuccess, onSkip }: ScanMenuUploadProps) {
  const [status, setStatus] = useState<Status>("idle");
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [result, setResult] = useState<{ categories: Category[]; itemCount: number } | null>(null);
  const [errorMsg, setErrorMsg] = useState("");
  const [isDragOver, setIsDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback((f: File) => {
    if (f.size > 10 * 1024 * 1024) {
      setErrorMsg("Image must be under 10MB");
      setStatus("error");
      return;
    }
    setFile(f);
    setStatus("previewing");
    const reader = new FileReader();
    reader.onload = (e) => setPreview(e.target?.result as string);
    reader.readAsDataURL(f);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragOver(false);
      const f = e.dataTransfer.files[0];
      if (f) handleFile(f);
    },
    [handleFile]
  );

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const f = e.target.files?.[0];
      if (f) handleFile(f);
    },
    [handleFile]
  );

  const scan = useCallback(async () => {
    if (!file) return;
    setStatus("scanning");
    setErrorMsg("");
    try {
      const formData = new FormData();
      formData.append("image", file);
      const res = await fetch("/api/parse-menu", { method: "POST", body: formData });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to parse menu");
      }
      setResult(data);
      setStatus("success");
      // Small delay so user sees the success state
      setTimeout(() => onSuccess(data.categories), 1200);
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "Something went wrong");
      setStatus("error");
    }
  }, [file, onSuccess]);

  const reset = useCallback(() => {
    setFile(null);
    setPreview(null);
    setResult(null);
    setErrorMsg("");
    setStatus("idle");
    if (inputRef.current) inputRef.current.value = "";
  }, []);

  return (
    <div className="flex flex-col gap-4">
      {/* Upload zone */}
      {(status === "idle" || status === "error") && (
        <>
          <div
            onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
            onDragLeave={() => setIsDragOver(false)}
            onDrop={handleDrop}
            onClick={() => inputRef.current?.click()}
            className={`relative flex flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed p-8 cursor-pointer transition-all duration-200 ${
              isDragOver
                ? "border-primary bg-primary/5 scale-[1.01]"
                : "border-border hover:border-primary/50 hover:bg-muted/50"
            }`}
          >
            <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 text-primary">
              <Sparkles className="h-6 w-6" />
            </div>
            <div className="text-center">
              <p className="text-sm font-semibold text-foreground">
                Drop a menu photo here or click to upload
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                JPG, PNG, WebP or HEIC &middot; up to 10MB
              </p>
            </div>
            <input
              ref={inputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp,image/heic,.jpg,.jpeg,.png,.webp,.heic"
              onChange={handleInputChange}
              className="hidden"
            />
          </div>
          {status === "error" && (
            <div className="flex items-center gap-2 p-3 rounded-xl bg-red-50 border border-red-200 text-sm text-red-700">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span className="flex-1">{errorMsg}</span>
              <button type="button" onClick={reset} className="text-red-500 hover:text-red-700">
                <X className="h-4 w-4" />
              </button>
            </div>
          )}
        </>
      )}

      {/* Preview + scan */}
      {status === "previewing" && preview && (
        <div className="flex flex-col gap-3">
          <div className="relative rounded-2xl overflow-hidden border border-border">
            <img src={preview} alt="Menu preview" className="w-full max-h-64 object-cover" />
            <button
              type="button"
              onClick={reset}
              className="absolute top-2 right-2 p-1.5 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          <Button onClick={scan} size="md">
            <Sparkles className="h-4 w-4" />
            Scan menu
          </Button>
        </div>
      )}

      {/* Scanning state */}
      {status === "scanning" && preview && (
        <div className="flex flex-col items-center gap-4 p-6">
          <div className="relative rounded-2xl overflow-hidden border border-border opacity-60">
            <img src={preview} alt="Scanning..." className="w-full max-h-48 object-cover" />
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" />
            Scanning menu...
          </div>
        </div>
      )}

      {/* Success state */}
      {status === "success" && result && (
        <div className="flex items-center gap-3 p-4 rounded-2xl bg-green-50 border border-green-200">
          <CheckCircle className="h-5 w-5 text-green-600 shrink-0" />
          <div>
            <p className="text-sm font-semibold text-green-800">
              Found {result.itemCount} items across {result.categories.length} categories
            </p>
            <p className="text-xs text-green-600 mt-0.5">Adding to your menu...</p>
          </div>
        </div>
      )}

      {/* Skip link */}
      {status !== "success" && status !== "scanning" && (
        <button
          type="button"
          onClick={onSkip}
          className="text-sm text-muted-foreground hover:text-foreground transition-colors text-center"
        >
          Skip &mdash; I&apos;ll add items manually
        </button>
      )}
    </div>
  );
}
