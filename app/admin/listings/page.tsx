"use client";

import { Field, SaveBar, inputClass, useSite } from "@/components/admin/useSite";
import { MediaField } from "@/components/admin/MediaField";
import type { Listing } from "@/lib/types";

const emptyListing = (): Listing => ({
  id: `FR-${Date.now().toString().slice(-4)}`,
  title: "New listing",
  type: "Apartment",
  status: "For sale",
  area: "",
  size: "",
  price: "",
  image: "",
});

export default function AdminListingsPage() {
  const { site, setSite, save, saving, message, error } = useSite();
  if (!site) return <p>Loading…</p>;

  return (
    <div>
      <div className="flex items-end justify-between gap-3">
        <div>
          <h1 className="text-3xl font-semibold text-brand">Real estate listings</h1>
          <p className="mt-2 text-muted">Finfine market cards. Add, edit, or remove any listing.</p>
        </div>
        <button
          type="button"
          className="rounded-sm bg-brand px-4 py-2 text-sm font-semibold text-white"
          onClick={() => setSite({ ...site, listings: [emptyListing(), ...site.listings] })}
        >
          Add listing
        </button>
      </div>
      <div className="mt-8 space-y-6">
        {site.listings.map((listing, i) => (
          <section key={listing.id + i} className="rounded-xl bg-white p-5 shadow-sm">
            <div className="mb-3 flex justify-end">
              <button
                type="button"
                className="text-sm text-red-600"
                onClick={() =>
                  setSite({ ...site, listings: site.listings.filter((_, idx) => idx !== i) })
                }
              >
                Delete
              </button>
            </div>
            <div className="grid gap-3 md:grid-cols-2">
              {(
                [
                  ["id", "ID"],
                  ["title", "Title"],
                  ["type", "Type"],
                  ["status", "Status"],
                  ["area", "Area"],
                  ["size", "Size"],
                  ["price", "Price"],
                ] as const
              ).map(([key, label]) => (
                <Field key={key} label={label}>
                  <input
                    className={inputClass}
                    value={listing[key]}
                    onChange={(e) => {
                      const listings = site.listings.map((item, idx) =>
                        idx === i ? { ...item, [key]: e.target.value } : item,
                      );
                      setSite({ ...site, listings });
                    }}
                  />
                </Field>
              ))}
            </div>
            <div className="mt-3">
              <MediaField
                label="Image"
                accept="image/*"
                value={listing.image}
                onChange={(image) => {
                  const listings = site.listings.map((item, idx) =>
                    idx === i ? { ...item, image } : item,
                  );
                  setSite({ ...site, listings });
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
