"use client";

import { Field, SaveBar, inputClass, useSite } from "@/components/admin/useSite";
import { MediaField } from "@/components/admin/MediaField";

export default function AdminAboutPage() {
  const { site, setSite, save, saving, message, error } = useSite();
  if (!site) return <p>Loading…</p>;
  const about = site.about;

  return (
    <div>
      <h1 className="text-3xl font-semibold text-brand">About</h1>
      <div className="mt-8 grid gap-4">
        <Field label="Kicker">
          <input
            className={inputClass}
            value={about.kicker}
            onChange={(e) => setSite({ ...site, about: { ...about, kicker: e.target.value } })}
          />
        </Field>
        <Field label="Title">
          <input
            className={inputClass}
            value={about.title}
            onChange={(e) => setSite({ ...site, about: { ...about, title: e.target.value } })}
          />
        </Field>
        <Field label="Intro">
          <textarea
            rows={3}
            className={inputClass}
            value={about.text}
            onChange={(e) => setSite({ ...site, about: { ...about, text: e.target.value } })}
          />
        </Field>
        <MediaField
          label="Hero image"
          accept="image/*"
          value={about.image}
          onChange={(image) => setSite({ ...site, about: { ...about, image } })}
        />
        <Field label="Why kicker">
          <input
            className={inputClass}
            value={about.whyKicker}
            onChange={(e) => setSite({ ...site, about: { ...about, whyKicker: e.target.value } })}
          />
        </Field>
        <Field label="Why title">
          <input
            className={inputClass}
            value={about.whyTitle}
            onChange={(e) => setSite({ ...site, about: { ...about, whyTitle: e.target.value } })}
          />
        </Field>
        {about.paragraphs.map((paragraph, i) => (
          <Field key={i} label={`Paragraph ${i + 1}`}>
            <textarea
              rows={4}
              className={inputClass}
              value={paragraph}
              onChange={(e) => {
                const paragraphs = about.paragraphs.map((item, idx) =>
                  idx === i ? e.target.value : item,
                );
                setSite({ ...site, about: { ...about, paragraphs } });
              }}
            />
          </Field>
        ))}
        <button
          type="button"
          className="w-fit rounded-sm border border-brand px-4 py-2 text-sm font-semibold text-brand"
          onClick={() =>
            setSite({ ...site, about: { ...about, paragraphs: [...about.paragraphs, ""] } })
          }
        >
          Add paragraph
        </button>
      </div>
      <SaveBar saving={saving} message={message} error={error} onSave={() => save(site)} />
    </div>
  );
}
