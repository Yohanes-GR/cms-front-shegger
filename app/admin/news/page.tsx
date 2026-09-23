"use client";

import { Field, SaveBar, inputClass, useSite } from "@/components/admin/useSite";
import { MediaField } from "@/components/admin/MediaField";
import { slugify } from "@/lib/data";
import type { NewsItem } from "@/lib/types";

const emptyNews = (): NewsItem => ({
  slug: `news-${Date.now()}`,
  title: "New article",
  date: new Date().toISOString().slice(0, 10),
  excerpt: "",
  body: "",
  image: "",
});

export default function AdminNewsPage() {
  const { site, setSite, save, saving, message, error } = useSite();
  if (!site) return <p>Loading…</p>;
  const items = site.news ?? [];
  const page = site.pages.news;

  function setItems(news: NewsItem[]) {
    setSite({ ...site, news });
  }

  return (
    <div>
      <div className="flex items-end justify-between gap-3">
        <div>
          <h1 className="text-3xl font-semibold text-brand">News & Insights</h1>
          <p className="mt-2 text-muted">Each article is stored in the database and shown on the website.</p>
        </div>
        <button
          type="button"
          className="rounded-sm bg-brand px-4 py-2 text-sm font-semibold text-white"
          onClick={() => setItems([emptyNews(), ...items])}
        >
          Add article
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
                setSite({ ...site, pages: { ...site.pages, news: { ...page, kicker: e.target.value } } })
              }
            />
          </Field>
          <Field label="Title">
            <input
              className={inputClass}
              value={page?.title ?? ""}
              onChange={(e) =>
                setSite({ ...site, pages: { ...site.pages, news: { ...page, title: e.target.value } } })
              }
            />
          </Field>
          <Field label="Intro text">
            <textarea
              rows={3}
              className={inputClass}
              value={page?.text ?? ""}
              onChange={(e) =>
                setSite({ ...site, pages: { ...site.pages, news: { ...page, text: e.target.value } } })
              }
            />
          </Field>
          <MediaField
            label="Banner photo"
            accept="image/*"
            value={page?.image ?? ""}
            onChange={(image) =>
              setSite({ ...site, pages: { ...site.pages, news: { ...page, image } } })
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
              <Field label="Headline">
                <input
                  className={inputClass}
                  value={item.title}
                  onChange={(e) => {
                    const news = items.map((row, idx) =>
                      idx === i
                        ? { ...row, title: e.target.value, slug: slugify(e.target.value) || row.slug }
                        : row,
                    );
                    setItems(news);
                  }}
                />
              </Field>
              <Field label="Date">
                <input
                  type="date"
                  className={inputClass}
                  value={item.date}
                  onChange={(e) => {
                    const news = items.map((row, idx) =>
                      idx === i ? { ...row, date: e.target.value } : row,
                    );
                    setItems(news);
                  }}
                />
              </Field>
            </div>
            <div className="mt-3 grid gap-3">
              <Field label="Short text">
                <textarea
                  rows={3}
                  className={inputClass}
                  value={item.excerpt}
                  onChange={(e) => {
                    const news = items.map((row, idx) =>
                      idx === i ? { ...row, excerpt: e.target.value } : row,
                    );
                    setItems(news);
                  }}
                />
              </Field>
              <Field label="Full article">
                <textarea
                  rows={8}
                  className={inputClass}
                  value={item.body}
                  onChange={(e) => {
                    const news = items.map((row, idx) =>
                      idx === i ? { ...row, body: e.target.value } : row,
                    );
                    setItems(news);
                  }}
                />
              </Field>
              <MediaField
                label="Photo"
                accept="image/*"
                value={item.image}
                onChange={(image) => {
                  const news = items.map((row, idx) => (idx === i ? { ...row, image } : row));
                  setItems(news);
                }}
              />
            </div>
          </section>
        ))}
      </div>
      <SaveBar saving={saving} message={message} error={error} onSave={() => save({ ...site, news: items })} />
    </div>
  );
}
