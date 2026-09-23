"use client";

import { Field, SaveBar, inputClass, useSite } from "@/components/admin/useSite";
import { MediaField } from "@/components/admin/MediaField";
import type { PageCopy } from "@/lib/types";

const keys = [
  ["services", "Services"],
  ["projects", "Projects"],
  ["contact", "Contact"],
  ["realEstate", "Real estate"],
  ["news", "News & Insights"],
  ["careers", "Careers"],
] as const;

export default function AdminPagesPage() {
  const { site, setSite, save, saving, message, error } = useSite();
  if (!site) return <p>Loading…</p>;

  function update(key: (typeof keys)[number][0], patch: Partial<PageCopy>) {
    setSite((prev) =>
      prev
        ? { ...prev, pages: { ...prev.pages, [key]: { ...prev.pages[key], ...patch } } }
        : prev,
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-semibold text-brand">Page copy</h1>
      <div className="mt-8 space-y-10">
        {keys.map(([key, label]) => {
          const page = site.pages[key];
          return (
            <section key={key} className="rounded-xl bg-white p-5 shadow-sm">
              <h2 className="text-xl font-semibold text-brand">{label}</h2>
              <div className="mt-4 grid gap-3">
                <Field label="Kicker">
                  <input
                    className={inputClass}
                    value={page.kicker}
                    onChange={(e) => update(key, { kicker: e.target.value })}
                  />
                </Field>
                <Field label="Title">
                  <input
                    className={inputClass}
                    value={page.title}
                    onChange={(e) => update(key, { title: e.target.value })}
                  />
                </Field>
                <Field label="Text">
                  <textarea
                    rows={3}
                    className={inputClass}
                    value={page.text}
                    onChange={(e) => update(key, { text: e.target.value })}
                  />
                </Field>
                <MediaField
                  label="Hero image"
                  accept="image/*"
                  value={page.image}
                  onChange={(image) => update(key, { image })}
                />
              </div>
            </section>
          );
        })}
      </div>
      <SaveBar saving={saving} message={message} error={error} onSave={() => save(site)} />
    </div>
  );
}
