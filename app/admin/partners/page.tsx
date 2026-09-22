"use client";

import { Field, SaveBar, inputClass, useSite } from "@/components/admin/useSite";
import { MediaField } from "@/components/admin/MediaField";
import type { Partner } from "@/lib/types";

const emptyPartner = (): Partner => ({
  name: "New partner",
  logo: "",
  url: "",
});

export default function AdminPartnersPage() {
  const { site, setSite, save, saving, message, error } = useSite();
  if (!site) return <p>Loading…</p>;

  const partners = site.partners ?? [];

  return (
    <div>
      <div className="flex items-end justify-between gap-3">
        <div>
          <h1 className="text-3xl font-semibold text-brand">Trusted partners</h1>
          <p className="mt-2 max-w-2xl text-muted">
            Add client and partner logos. They drift slowly across the homepage and About page.
            Upload a PNG with a transparent background when you can.
          </p>
        </div>
        <button
          type="button"
          className="rounded-sm bg-brand px-4 py-2 text-sm font-semibold text-white"
          onClick={() => setSite({ ...site, partners: [emptyPartner(), ...partners] })}
        >
          Add partner
        </button>
      </div>
      <div className="mt-8 space-y-6">
        {partners.length === 0 && (
          <p className="rounded-xl bg-white p-6 text-sm text-muted shadow-sm">
            No partners yet. Add a name and logo, then save.
          </p>
        )}
        {partners.map((partner, i) => (
          <section key={`${partner.name}-${i}`} className="rounded-xl bg-white p-5 shadow-sm">
            <div className="mb-3 flex justify-end">
              <button
                type="button"
                className="text-sm text-red-600"
                onClick={() =>
                  setSite({
                    ...site,
                    partners: partners.filter((_, idx) => idx !== i),
                  })
                }
              >
                Delete
              </button>
            </div>
            <div className="grid gap-3 md:grid-cols-2">
              <Field label="Name">
                <input
                  className={inputClass}
                  value={partner.name}
                  onChange={(e) => {
                    const next = partners.map((item, idx) =>
                      idx === i ? { ...item, name: e.target.value } : item,
                    );
                    setSite({ ...site, partners: next });
                  }}
                />
              </Field>
              <Field label="Website (optional)">
                <input
                  className={inputClass}
                  value={partner.url ?? ""}
                  placeholder="https://"
                  onChange={(e) => {
                    const next = partners.map((item, idx) =>
                      idx === i ? { ...item, url: e.target.value } : item,
                    );
                    setSite({ ...site, partners: next });
                  }}
                />
              </Field>
            </div>
            <div className="mt-3">
              <MediaField
                label="Logo"
                accept="image/*"
                contain
                value={partner.logo}
                onChange={(logo) => {
                  const next = partners.map((item, idx) =>
                    idx === i ? { ...item, logo } : item,
                  );
                  setSite({ ...site, partners: next });
                }}
              />
            </div>
          </section>
        ))}
      </div>
      <SaveBar saving={saving} message={message} error={error} onSave={() => save(site)} />
    </div>
  );
}
