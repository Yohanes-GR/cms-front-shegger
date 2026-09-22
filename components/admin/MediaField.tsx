"use client";

import { useState } from "react";
import { cmsFetch } from "@/lib/api";
import { inputClass } from "./useSite";

type Props = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  accept?: string;
  contain?: boolean;
};

export function MediaField({
  label,
  value,
  onChange,
  accept = "image/*,video/*",
  contain = false,
}: Props) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const isVideo = /\.(mp4|webm|ogg)$/i.test(value) || value.startsWith("data:video");

  async function onFile(file?: File) {
    if (!file) return;
    setUploading(true);
    setError("");
    const data = new FormData();
    data.append("file", file);
    try {
      const res = await cmsFetch("/api/media", { method: "POST", body: data });
      const json = await res.json();
      if (!res.ok) throw new Error(json.message || "Upload failed");
      onChange(json.url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="grid gap-2 text-sm">
      <span className="font-medium text-ink">{label}</span>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="https://… or /uploads/…"
        className={inputClass}
      />
      <div className="flex flex-wrap items-center gap-3">
        <label className="cursor-pointer rounded-sm bg-brand px-3 py-2 text-xs font-semibold text-white">
          {uploading ? "Uploading…" : "Upload file"}
          <input
            type="file"
            accept={accept}
            className="hidden"
            onChange={(e) => onFile(e.target.files?.[0])}
          />
        </label>
        {error && <span className="text-xs text-red-600">{error}</span>}
      </div>
      {value && (
        <div className="overflow-hidden rounded-md bg-black/5">
          {isVideo ? (
            <video src={value} className="h-32 w-full object-cover" muted />
          ) : (
            <div
              className={`h-32 ${contain ? "bg-white bg-contain bg-center bg-no-repeat" : "bg-cover bg-center"}`}
              style={{ backgroundImage: `url(${value})` }}
            />
          )}
        </div>
      )}
    </div>
  );
}
