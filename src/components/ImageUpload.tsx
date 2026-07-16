"use client";

import { useState, useRef } from "react";

interface ImageUploadProps {
  currentUrl?: string;
  onUpload: (url: string) => void;
  accept?: string;
  label?: string;
  size?: "sm" | "lg";
}

export default function ImageUpload({ currentUrl, onUpload, accept = "image/*", label = "Image", size = "sm" }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState(currentUrl || "");
  const [error, setError] = useState("");
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleFile(file: File) {
    setError("");
    setUploading(true);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Upload failed");
      setPreview(data.url);
      onUpload(data.url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  }

  async function handleInput(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    await handleFile(file);
    e.target.value = "";
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  }

  function handleDragOver(e: React.DragEvent) {
    e.preventDefault();
    setDragOver(true);
  }

  function handleDragLeave(e: React.DragEvent) {
    e.preventDefault();
    setDragOver(false);
  }

  if (size === "lg") {
    const isPdf = preview?.includes(".pdf") || preview?.includes("pdf");
    return (
      <div>
        <label className="font-label-md text-label-md text-on-surface-variant block mb-unit-xs">{label}</label>
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={() => inputRef.current?.click()}
          className={`relative w-full h-48 rounded-xl border-2 border-dashed flex flex-col items-center justify-center gap-2 cursor-pointer transition-all ${
            dragOver
              ? "border-primary bg-primary/5"
              : preview
                ? "border-outline-variant bg-surface-container-low"
                : "border-outline-variant bg-surface-container-lowest hover:border-primary/50 hover:bg-surface-container-low"
          }`}
        >
          <input ref={inputRef} type="file" accept={accept} onChange={handleInput} className="hidden" />
          {uploading ? (
            <div className="flex flex-col items-center gap-2">
              <span className="material-symbols-outlined text-3xl text-primary animate-spin">progress_activity</span>
              <span className="text-sm text-on-surface-variant">Uploading...</span>
            </div>
          ) : preview ? (
            <>
              {isPdf ? (
                <div className="flex flex-col items-center gap-2">
                  <span className="material-symbols-outlined text-4xl text-secondary">picture_as_pdf</span>
                  <span className="text-xs text-on-surface-variant truncate max-w-[200px]">{preview.split("/").pop()}</span>
                </div>
              ) : (
                <img src={preview} alt="" className="w-full h-full object-contain rounded-xl" onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
              )}
              <div className="absolute bottom-2 right-2 flex gap-1">
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); inputRef.current?.click(); }}
                  className="px-2 py-1 bg-surface/90 rounded-lg text-xs text-on-surface shadow-sm hover:bg-surface-container-low transition-colors"
                >
                  Change
                </button>
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); setPreview(""); onUpload(""); }}
                  className="px-2 py-1 bg-red-50/90 rounded-lg text-xs text-secondary shadow-sm hover:bg-red-100 transition-colors"
                >
                  Remove
                </button>
              </div>
            </>
          ) : (
            <>
              <span className="material-symbols-outlined text-3xl text-outline">cloud_upload</span>
              <div className="text-center">
                <p className="text-sm font-medium text-on-surface-variant">Drop file here or click to browse</p>
                <p className="text-xs text-outline mt-0.5">{accept === "image/*" ? "PNG, JPG, WEBP up to 10MB" : "PDF up to 50MB"}</p>
              </div>
            </>
          )}
        </div>
        {error && <p className="text-xs text-secondary mt-1">{error}</p>}
      </div>
    );
  }

  return (
    <div>
      <label className="font-label-md text-label-md text-on-surface-variant block mb-unit-xs">{label}</label>
      <div className="flex items-start gap-3">
        {preview && (
          <div className="w-16 h-20 rounded-lg overflow-hidden border border-outline-variant shrink-0 bg-surface-container-high">
            <img src={preview} alt="" className="w-full h-full object-cover" onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
          </div>
        )}
        <div className="flex-grow">
          <input ref={inputRef} type="file" accept={accept} onChange={handleInput} className="hidden" />
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={uploading}
            className="w-full h-10 flex items-center justify-center gap-2 bg-surface-container-low border border-outline-variant border-dashed rounded-lg text-sm text-on-surface-variant hover:bg-surface-container-high transition-colors disabled:opacity-50"
          >
            {uploading ? (
              <>
                <span className="material-symbols-outlined text-sm animate-spin">progress_activity</span>
                Uploading...
              </>
            ) : (
              <>
                <span className="material-symbols-outlined text-sm">cloud_upload</span>
                {currentUrl ? "Change file" : "Upload file"}
              </>
            )}
          </button>
          {error && <p className="text-xs text-secondary mt-1">{error}</p>}
        </div>
      </div>
    </div>
  );
}
