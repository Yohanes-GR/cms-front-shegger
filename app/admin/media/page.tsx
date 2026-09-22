"use client";

import { useEffect, useState } from "react";
import { cmsFetch } from "@/lib/api";

type FileItem = { name: string; url: string };

export default function AdminMediaPage() {
  const [files, setFiles] = useState<FileItem[]>([]);
  const [error, setError] = useState("");
  const [uploading, setUploading] = useState(false);

  async function load() {
    const res = await cmsFetch("/api/media");
    setFiles(await res.json());
  }

  useEffect(() => {
    load().catch(() => setError("Could not load media."));
  }, []);

  async function onUpload(file?: File) {
    if (!file) return;
    setUploading(true);
    setError("");
    const data = new FormData();
    data.append("file", file);
    const res = await cmsFetch("/api/media", { method: "POST", body: data });
    const json = await res.json();
    if (!res.ok) setError(json.message || "Upload failed");
    await load();
    setUploading(false);
  }

  async function onDelete(name: string) {
    await cmsFetch("/api/media", {
      method: "DELETE",
      body: JSON.stringify({ name }),
    });
    await load();
  }

  return (
    <div>
      <h1 className="text-3xl font-semibold text-brand">Media library</h1>
      <p className="mt-2 text-muted">
        Upload images or motion video, then paste the URL into any content field.
      </p>
      <label className="mt-6 inline-flex cursor-pointer rounded-sm bg-brand px-4 py-2 text-sm font-semibold text-white">
        {uploading ? "Uploading…" : "Upload image or video"}
        <input
          type="file"
          accept="image/*,video/*"
          className="hidden"
          onChange={(e) => onUpload(e.target.files?.[0])}
        />
      </label>
      {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {files.map((file) => (
          <article key={file.name} className="overflow-hidden rounded-xl bg-white shadow-sm">
            {/\.(mp4|webm|ogg)$/i.test(file.name) ? (
              <video src={file.url} className="h-40 w-full object-cover" muted />
            ) : (
              <div
                className="h-40 bg-cover bg-center"
                style={{ backgroundImage: `url(${file.url})` }}
              />
            )}
            <div className="space-y-2 p-3">
              <p className="break-all text-xs text-muted">{file.url}</p>
              <div className="flex gap-3">
                <button
                  type="button"
                  className="text-sm text-brand"
                  onClick={() => navigator.clipboard.writeText(file.url)}
                >
                  Copy URL
                </button>
                <button
                  type="button"
                  className="text-sm text-red-600"
                  onClick={() => onDelete(file.name)}
                >
                  Delete
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
