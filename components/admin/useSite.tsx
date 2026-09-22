"use client";

import { useEffect, useState, type SetStateAction } from "react";
import type { SiteContent } from "@/lib/types";
import { cmsFetch } from "@/lib/api";

type SiteDraft = SiteContent | null;

export function useSite() {
  const [site, setSiteState] = useState<SiteDraft>(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const setSite = (next: SiteDraft | object | ((prev: SiteDraft) => SiteDraft)) => {
    setSiteState(next as SetStateAction<SiteDraft>);
  };

  useEffect(() => {
    cmsFetch("/api/site")
      .then((res) => res.json())
      .then(setSite)
      .catch(() => setError("Could not load content from cms-back."));
  }, []);

  async function save(next: SiteContent) {
    setSaving(true);
    setError("");
    setMessage("");
    try {
      const res = await cmsFetch("/api/site", {
        method: "PUT",
        body: JSON.stringify(next),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.message || "Save failed");
      setSite(next);
      setMessage("Saved to cms-back.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save failed");
    } finally {
      setSaving(false);
    }
  }

  return { site, setSite, save, saving, message, error };
}

export function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="grid gap-1 text-sm">
      <span className="font-medium text-ink">{label}</span>
      {children}
    </label>
  );
}

export const inputClass =
  "w-full rounded-sm border border-black/10 bg-white px-3 py-2 outline-none focus:border-accent";

export function SaveBar({
  saving,
  message,
  error,
  onSave,
}: {
  saving: boolean;
  message: string;
  error: string;
  onSave: () => void;
}) {
  return (
    <div className="sticky bottom-4 z-20 mt-8 flex flex-wrap items-center gap-3 rounded-lg bg-brand p-4 text-white shadow-lg">
      <button
        type="button"
        onClick={onSave}
        disabled={saving}
        className="rounded-sm bg-accent px-5 py-2 text-sm font-semibold hover:bg-accent-dark disabled:opacity-60"
      >
        {saving ? "Saving…" : "Save changes"}
      </button>
      {message && <span className="text-sm text-white/80">{message}</span>}
      {error && <span className="text-sm text-red-200">{error}</span>}
    </div>
  );
}
