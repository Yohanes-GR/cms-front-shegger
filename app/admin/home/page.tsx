"use client";

import { Field, SaveBar, inputClass, useSite } from "@/components/admin/useSite";
import { MediaField } from "@/components/admin/MediaField";

export default function AdminHomeEditor() {
  const { site, setSite, save, saving, message, error } = useSite();
  if (!site) return <p>Loading…</p>;
  const home = site.home;

  function update<K extends keyof typeof home>(key: K, value: (typeof home)[K]) {
    setSite((prev) => (prev ? { ...prev, home: { ...prev.home, [key]: value } } : prev));
  }

  return (
    <div>
      <h1 className="text-3xl font-semibold text-brand">Home & motion</h1>
      <p className="mt-2 text-muted">
        Edit hero copy, slideshow, and how images move (zoom, pan, fade, or still).
      </p>
      <div className="mt-8 grid gap-4 md:grid-cols-2">
        <Field label="Kicker">
          <input className={inputClass} value={home.kicker} onChange={(e) => update("kicker", e.target.value)} />
        </Field>
        <Field label="Title line 1">
          <input className={inputClass} value={home.title} onChange={(e) => update("title", e.target.value)} />
        </Field>
        <Field label="Title line 2">
          <input
            className={inputClass}
            value={home.titleLine2}
            onChange={(e) => update("titleLine2", e.target.value)}
          />
        </Field>
        <Field label="Subtitle">
          <textarea
            rows={3}
            className={inputClass}
            value={home.subtitle}
            onChange={(e) => update("subtitle", e.target.value)}
          />
        </Field>
      </div>
      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <Field label="Primary button label">
          <input
            className={inputClass}
            value={home.ctaPrimaryLabel}
            onChange={(e) => update("ctaPrimaryLabel", e.target.value)}
          />
        </Field>
        <Field label="Primary button link">
          <input
            className={inputClass}
            value={home.ctaPrimaryHref}
            onChange={(e) => update("ctaPrimaryHref", e.target.value)}
          />
        </Field>
        <Field label="Secondary button label">
          <input
            className={inputClass}
            value={home.ctaSecondaryLabel}
            onChange={(e) => update("ctaSecondaryLabel", e.target.value)}
          />
        </Field>
        <Field label="Secondary button link">
          <input
            className={inputClass}
            value={home.ctaSecondaryHref}
            onChange={(e) => update("ctaSecondaryHref", e.target.value)}
          />
        </Field>
      </div>
      <h2 className="mt-10 text-xl font-semibold text-brand">Motion background</h2>
      <div className="mt-4 grid gap-4 md:grid-cols-3">
        <Field label="Mode">
          <select
            className={inputClass}
            value={home.motion.mode}
            onChange={(e) =>
              update("motion", {
                ...home.motion,
                mode: e.target.value as typeof home.motion.mode,
              })
            }
          >
            <option value="slideshow">Image slideshow</option>
            <option value="video">Video only</option>
            <option value="both">Video + images</option>
          </select>
        </Field>
        <Field label="Image motion">
          <select
            className={inputClass}
            value={home.motion.effect || "kenburns"}
            onChange={(e) =>
              update("motion", {
                ...home.motion,
                effect: e.target.value as typeof home.motion.effect,
              })
            }
          >
            <option value="kenburns">Ken Burns (zoom in & out)</option>
            <option value="zoom-in">Zoom in</option>
            <option value="zoom-out">Zoom out</option>
            <option value="pan">Slow pan</option>
            <option value="fade">Fade only</option>
            <option value="still">Still (no zoom)</option>
          </select>
        </Field>
        <Field label="Slide interval (ms)">
          <input
            type="number"
            className={inputClass}
            value={home.motion.intervalMs}
            onChange={(e) =>
              update("motion", { ...home.motion, intervalMs: Number(e.target.value) || 7000 })
            }
          />
        </Field>
      </div>
      <div className="mt-4">
        <MediaField
          label="Hero video (mp4/webm)"
          value={home.motion.videoUrl}
          accept="video/*"
          onChange={(videoUrl) => update("motion", { ...home.motion, videoUrl })}
        />
      </div>
      <div className="mt-6 space-y-4">
        {home.motion.images.map((image, i) => (
          <div key={i} className="grid gap-3 rounded-xl bg-white p-4 shadow-sm md:grid-cols-[1fr_1fr_auto]">
            <MediaField
              label={`Image ${i + 1}`}
              value={image.src}
              accept="image/*"
              onChange={(src) => {
                const images = home.motion.images.map((item, idx) =>
                  idx === i ? { ...item, src } : item,
                );
                update("motion", { ...home.motion, images });
              }}
            />
            <Field label="Alt text">
              <input
                className={inputClass}
                value={image.alt}
                onChange={(e) => {
                  const images = home.motion.images.map((item, idx) =>
                    idx === i ? { ...item, alt: e.target.value } : item,
                  );
                  update("motion", { ...home.motion, images });
                }}
              />
            </Field>
            <button
              type="button"
              className="self-end text-sm text-red-600"
              onClick={() =>
                update("motion", {
                  ...home.motion,
                  images: home.motion.images.filter((_, idx) => idx !== i),
                })
              }
            >
              Remove
            </button>
          </div>
        ))}
        <button
          type="button"
          className="rounded-sm border border-brand px-4 py-2 text-sm font-semibold text-brand"
          onClick={() =>
            update("motion", {
              ...home.motion,
              images: [...home.motion.images, { src: "", alt: "" }],
            })
          }
        >
          Add motion image
        </button>
      </div>
      <h2 className="mt-10 text-xl font-semibold text-brand">Other home copy</h2>
      <div className="mt-4 grid gap-4 md:grid-cols-2">
        {(
          [
            ["divisionsKicker", "Divisions kicker"],
            ["divisionsTitle", "Divisions title"],
            ["processKicker", "Process kicker"],
            ["processTitle", "Process title"],
            ["projectsKicker", "Projects kicker"],
            ["projectsTitle", "Projects title"],
            ["ctaTitle", "Bottom CTA title"],
          ] as const
        ).map(([key, label]) => (
          <Field key={key} label={label}>
            <input className={inputClass} value={home[key]} onChange={(e) => update(key, e.target.value)} />
          </Field>
        ))}
        <Field label="Process text">
          <textarea
            rows={3}
            className={inputClass}
            value={home.processText}
            onChange={(e) => update("processText", e.target.value)}
          />
        </Field>
        <Field label="Bottom CTA text">
          <textarea
            rows={3}
            className={inputClass}
            value={home.ctaText}
            onChange={(e) => update("ctaText", e.target.value)}
          />
        </Field>
      </div>
      <h2 className="mt-10 text-xl font-semibold text-brand">Stats</h2>
      <p className="mt-1 text-sm text-muted">Numbers count up when visitors scroll to them.</p>
      <div className="mt-4 grid gap-3 md:grid-cols-2">
        {site.stats.map((stat, i) => (
          <div key={i} className="grid grid-cols-2 gap-2">
            <input
              className={inputClass}
              value={stat.value}
              onChange={(e) => {
                const stats = site.stats.map((item, idx) =>
                  idx === i ? { ...item, value: e.target.value } : item,
                );
                setSite({ ...site, stats });
              }}
            />
            <input
              className={inputClass}
              value={stat.label}
              onChange={(e) => {
                const stats = site.stats.map((item, idx) =>
                  idx === i ? { ...item, label: e.target.value } : item,
                );
                setSite({ ...site, stats });
              }}
            />
          </div>
        ))}
      </div>
      <button
        type="button"
        className="mt-3 text-sm font-semibold text-brand underline decoration-accent underline-offset-4"
        onClick={() =>
          setSite({
            ...site,
            stats: [...site.stats, { value: "0", label: "New stat" }],
          })
        }
      >
        Add a stat
      </button>
      <h2 className="mt-10 text-xl font-semibold text-brand">Process steps</h2>
      <div className="mt-4 space-y-3">
        {site.processSteps.map((step, i) => (
          <div key={i} className="grid gap-2 rounded-xl bg-white p-4 md:grid-cols-3">
            <input
              className={inputClass}
              value={step.n}
              onChange={(e) => {
                const processSteps = site.processSteps.map((item, idx) =>
                  idx === i ? { ...item, n: e.target.value } : item,
                );
                setSite({ ...site, processSteps });
              }}
            />
            <input
              className={inputClass}
              value={step.title}
              onChange={(e) => {
                const processSteps = site.processSteps.map((item, idx) =>
                  idx === i ? { ...item, title: e.target.value } : item,
                );
                setSite({ ...site, processSteps });
              }}
            />
            <input
              className={inputClass}
              value={step.text}
              onChange={(e) => {
                const processSteps = site.processSteps.map((item, idx) =>
                  idx === i ? { ...item, text: e.target.value } : item,
                );
                setSite({ ...site, processSteps });
              }}
            />
          </div>
        ))}
      </div>
      <SaveBar saving={saving} message={message} error={error} onSave={() => save(site)} />
    </div>
  );
}
