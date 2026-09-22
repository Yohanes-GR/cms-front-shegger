"use client";

import { Field, SaveBar, inputClass, useSite } from "@/components/admin/useSite";
import { MediaField } from "@/components/admin/MediaField";

export default function AdminCompanyPage() {
  const { site, setSite, save, saving, message, error } = useSite();
  if (!site) return <p>Loading…</p>;

  return (
    <div>
      <h1 className="text-3xl font-semibold text-brand">Company</h1>
      <p className="mt-2 text-muted">These details appear in the header, footer, and contact page.</p>
      <div className="mt-8 max-w-xl">
        <MediaField
          label="Company logo"
          accept="image/*"
          contain
          value={site.company.logo ?? ""}
          onChange={(logo) => setSite({ ...site, company: { ...site.company, logo } })}
        />
        <p className="mt-2 text-xs text-muted">Shown in the header and footer. Upload a PNG or JPG with a clear mark.</p>
      </div>
      <div className="mt-8 grid gap-4 md:grid-cols-2">
        {(
          [
            ["name", "Name"],
            ["shortName", "Short name"],
            ["tagline", "Tagline"],
            ["phone", "Phone"],
            ["mobile", "Mobile"],
            ["email", "Email"],
            ["address", "Address"],
            ["mapsUrl", "Google Maps link"],
            ["hours", "Hours"],
          ] as const
        ).map(([key, label]) => (
          <Field key={key} label={label}>
            <input
              className={inputClass}
              value={site.company[key]}
              onChange={(e) =>
                setSite({ ...site, company: { ...site.company, [key]: e.target.value } })
              }
            />
          </Field>
        ))}
        <Field label="Description">
          <textarea
            rows={5}
            className={inputClass}
            value={site.company.description}
            onChange={(e) =>
              setSite({
                ...site,
                company: { ...site.company, description: e.target.value },
              })
            }
          />
        </Field>
      </div>
      <h2 className="mt-10 text-xl font-semibold text-brand">Social media</h2>
      <p className="mt-2 text-sm text-muted">
        Leave a field blank until the page exists. Facebook, LinkedIn, and X stay visible; other networks appear once you add a link.
      </p>
      <div className="mt-6 grid gap-4 md:grid-cols-2">
        {(
          [
            ["facebook", "Facebook"],
            ["instagram", "Instagram"],
            ["linkedin", "LinkedIn"],
            ["twitter", "X / Twitter"],
            ["youtube", "YouTube"],
            ["telegram", "Telegram"],
            ["whatsapp", "WhatsApp"],
          ] as const
        ).map(([key, label]) => (
          <Field key={key} label={label}>
            <input
              className={inputClass}
              value={site.company[key]}
              onChange={(e) =>
                setSite({ ...site, company: { ...site.company, [key]: e.target.value } })
              }
            />
          </Field>
        ))}
      </div>
      <SaveBar saving={saving} message={message} error={error} onSave={() => save(site)} />
    </div>
  );
}
