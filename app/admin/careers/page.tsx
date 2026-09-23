"use client";

import { Field, SaveBar, inputClass, useSite } from "@/components/admin/useSite";
import { MediaField } from "@/components/admin/MediaField";
import { slugify } from "@/lib/data";
import type { Career } from "@/lib/types";

const emptyRole = (): Career => ({
  slug: `role-${Date.now()}`,
  title: "New role",
  location: "Addis Ababa",
  type: "Full-time",
  excerpt: "",
  body: "",
  image: "",
});

export default function AdminCareersPage() {
  const { site, setSite, save, saving, message, error } = useSite();
  if (!site) return <p>Loading…</p>;
  const items = site.careers ?? [];
  const page = site.pages.careers;

  function setItems(careers: Career[]) {
    setSite({ ...site, careers });
  }

  return (
    <div>
      <div className="flex items-end justify-between gap-3">
        <div>
          <h1 className="text-3xl font-semibold text-brand">Careers</h1>
          <p className="mt-2 text-muted">Each role is stored in the database and shown on the website.</p>
        </div>
        <button
          type="button"
          className="rounded-sm bg-brand px-4 py-2 text-sm font-semibold text-white"
          onClick={() => setItems([emptyRole(), ...items])}
        >
          Add role
        </button>
      </div>

      <section className="mt-8 rounded-xl bg-white p-5 shadow-sm">
        <h2 className="text-xl font-semibold text-brand">Page banner</h2>
        <div className="mt-4 grid gap-3">
          <Field label="Kicker">
            <input
              className={inputClass}
              value={page?.kicker ?? ""}
              onChange={(e) =>
                setSite({
                  ...site,
                  pages: { ...site.pages, careers: { ...page, kicker: e.target.value } },
                })
              }
            />
          </Field>
          <Field label="Title">
            <input
              className={inputClass}
              value={page?.title ?? ""}
              onChange={(e) =>
                setSite({
                  ...site,
                  pages: { ...site.pages, careers: { ...page, title: e.target.value } },
                })
              }
            />
          </Field>
          <Field label="Intro text">
            <textarea
              rows={3}
              className={inputClass}
              value={page?.text ?? ""}
              onChange={(e) =>
                setSite({
                  ...site,
                  pages: { ...site.pages, careers: { ...page, text: e.target.value } },
                })
              }
            />
          </Field>
          <MediaField
            label="Banner photo"
            accept="image/*"
            value={page?.image ?? ""}
            onChange={(image) =>
              setSite({ ...site, pages: { ...site.pages, careers: { ...page, image } } })
            }
          />
        </div>
      </section>

      <div className="mt-8 space-y-6">
        {items.map((item, i) => (
          <section key={item.slug + i} className="rounded-xl bg-white p-5 shadow-sm">
            <div className="mb-3 flex justify-end">
              <button
                type="button"
                className="text-sm text-red-600"
                onClick={() => setItems(items.filter((_, idx) => idx !== i))}
              >
                Delete
              </button>
            </div>
            <div className="grid gap-3 md:grid-cols-2">
              <Field label="Job title">
                <input
                  className={inputClass}
                  value={item.title}
                  onChange={(e) => {
                    const careers = items.map((row, idx) =>
                      idx === i
                        ? { ...row, title: e.target.value, slug: slugify(e.target.value) || row.slug }
                        : row,
                    );
                    setItems(careers);
                  }}
                />
              </Field>
              <Field label="Location">
                <input
                  className={inputClass}
                  value={item.location}
                  onChange={(e) => {
                    const careers = items.map((row, idx) =>
                      idx === i ? { ...row, location: e.target.value } : row,
                    );
                    setItems(careers);
                  }}
                />
              </Field>
              <Field label="Type">
                <select
                  className={inputClass}
                  value={item.type}
                  onChange={(e) => {
                    const careers = items.map((row, idx) =>
                      idx === i ? { ...row, type: e.target.value } : row,
                    );
                    setItems(careers);
                  }}
                >
                  {["Full-time", "Part-time", "Contract", "Internship"].map((type) => (
                    <option key={type}>{type}</option>
                  ))}
                </select>
              </Field>
            </div>
            <div className="mt-3 grid gap-3">
              <Field label="Short text">
                <textarea
                  rows={3}
                  className={inputClass}
                  value={item.excerpt}
                  onChange={(e) => {
                    const careers = items.map((row, idx) =>
                      idx === i ? { ...row, excerpt: e.target.value } : row,
                    );
                    setItems(careers);
                  }}
                />
              </Field>
              <Field label="Full description">
                <textarea
                  rows={8}
                  className={inputClass}
                  value={item.body}
                  onChange={(e) => {
                    const careers = items.map((row, idx) =>
                      idx === i ? { ...row, body: e.target.value } : row,
                    );
                    setItems(careers);
                  }}
                />
              </Field>
              <MediaField
                label="Photo"
                accept="image/*"
                value={item.image}
                onChange={(image) => {
                  const careers = items.map((row, idx) => (idx === i ? { ...row, image } : row));
                  setItems(careers);
                }}
              />
            </div>
          </section>
        ))}
      </div>
      <SaveBar
        saving={saving}
        message={message}
        error={error}
        onSave={() => save({ ...site, careers: items })}
      />
    </div>
  );
}
