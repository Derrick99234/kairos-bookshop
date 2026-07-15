"use client";

import { useState, useRef } from "react";

interface ImageUploadProps {
  currentUrl?: string;
  onUpload: (url: string) => void;
  accept?: string;
  label?: string;
}

export default function ImageUpload({ currentUrl, onUpload, accept = "image/*", label = "Image" }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState(currentUrl || "");
  const [error, setError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

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
          <input ref={inputRef} type="file" accept={accept} onChange={handleFile} className="hidden" />
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
