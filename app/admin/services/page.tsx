"use client";

import { Field, SaveBar, inputClass, useSite } from "@/components/admin/useSite";
import { MediaField } from "@/components/admin/MediaField";
import { slugify, type ContentNode, type Division } from "@/lib/data";

const emptyNode = (): ContentNode => ({
  slug: `service-${Date.now()}`,
  title: "New service",
  summary: "",
  description: "",
  image: "",
  logo: "",
  highlights: ["", "", ""],
  gallery: [],
  children: [],
});

function NodeEditor({
  node,
  onChange,
  onRemove,
  depth = 0,
}: {
  node: ContentNode;
  onChange: (node: ContentNode) => void;
  onRemove: () => void;
  depth?: number;
}) {
  const highlights = node.highlights ?? ["", "", ""];
  return (
    <div
      className="space-y-3 rounded-xl border border-black/10 bg-white p-4"
      style={{ marginLeft: depth * 12 }}
    >
      <div className="flex items-center justify-between gap-3">
        <p className="font-semibold text-brand">{node.title || "Untitled"}</p>
        <button type="button" className="text-sm text-red-600" onClick={onRemove}>
          Delete
        </button>
      </div>
      <div className="grid gap-3 md:grid-cols-2">
        <Field label="Title">
          <input
            className={inputClass}
            value={node.title}
            onChange={(e) => {
              const title = e.target.value;
              onChange({
                ...node,
                title,
                slug: node.slug.startsWith("service-") ? slugify(title) || node.slug : node.slug,
              });
            }}
          />
        </Field>
        <Field label="Slug">
          <input
            className={inputClass}
            value={node.slug}
            onChange={(e) => onChange({ ...node, slug: slugify(e.target.value) || node.slug })}
          />
        </Field>
      </div>
      <Field label="Summary">
        <textarea
          rows={2}
          className={inputClass}
          value={node.summary}
          onChange={(e) => onChange({ ...node, summary: e.target.value })}
        />
      </Field>
      <Field label="Description">
        <textarea
          rows={4}
          className={inputClass}
          value={node.description}
          onChange={(e) => onChange({ ...node, description: e.target.value })}
        />
      </Field>
      <MediaField
        label="Logo"
        accept="image/*"
        contain
        value={node.logo ?? ""}
        onChange={(logo) => onChange({ ...node, logo })}
      />
      <MediaField
        label="Image"
        accept="image/*"
        value={node.image}
        onChange={(image) => onChange({ ...node, image })}
      />
      <ExtraPhotosEditor
        photos={node.gallery ?? []}
        onChange={(gallery) => onChange({ ...node, gallery })}
      />
      <div className="grid gap-2 md:grid-cols-3">
        {highlights.map((item, i) => (
          <input
            key={i}
            className={inputClass}
            placeholder={`Highlight ${i + 1}`}
            value={item}
            onChange={(e) => {
              const next = [...highlights];
              next[i] = e.target.value;
              onChange({ ...node, highlights: next });
            }}
          />
        ))}
      </div>
      <div className="space-y-3">
        {(node.children ?? []).map((child, i) => (
          <NodeEditor
            key={child.slug + i}
            node={child}
            depth={depth + 1}
            onChange={(next) => {
              const children = (node.children ?? []).map((item, idx) =>
                idx === i ? next : item,
              );
              onChange({ ...node, children });
            }}
            onRemove={() =>
              onChange({
                ...node,
                children: (node.children ?? []).filter((_, idx) => idx !== i),
              })
            }
          />
        ))}
        <button
          type="button"
          className="rounded-sm border border-brand px-3 py-2 text-xs font-semibold text-brand"
          onClick={() => onChange({ ...node, children: [...(node.children ?? []), emptyNode()] })}
        >
          Add nested service
        </button>
      </div>
    </div>
  );
}

function ExtraPhotosEditor({
  photos,
  onChange,
}: {
  photos: string[];
  onChange: (photos: string[]) => void;
}) {
  return (
    <div className="space-y-3 rounded-lg bg-sand/80 p-3">
      <p className="text-sm font-medium text-ink">Extra photos</p>
      <p className="text-xs text-muted">
        These appear under the service page. They are not used on the moving home image.
      </p>
      {photos.map((src, i) => (
        <div key={i} className="rounded-md border border-black/5 bg-white p-3">
          <MediaField
            label={`Photo ${i + 1}`}
            accept="image/*"
            value={src}
            onChange={(next) => onChange(photos.map((item, idx) => (idx === i ? next : item)))}
          />
          <button
            type="button"
            className="mt-2 text-xs text-red-600"
            onClick={() => onChange(photos.filter((_, idx) => idx !== i))}
          >
            Remove photo
          </button>
        </div>
      ))}
      <button
        type="button"
        className="rounded-sm border border-brand px-3 py-2 text-xs font-semibold text-brand"
        onClick={() => onChange([...photos, ""])}
      >
        Add extra photo
      </button>
    </div>
  );
}

export default function AdminServicesPage() {
  const { site, setSite, save, saving, message, error } = useSite();
  if (!site) return <p>Loading…</p>;

  function updateDivision(index: number, next: Division) {
    setSite((prev) =>
      prev
        ? {
            ...prev,
            divisions: prev.divisions.map((item, i) => (i === index ? next : item)),
          }
        : prev,
    );
  }

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-3xl font-semibold text-brand">Services</h1>
          <p className="mt-2 text-muted">Add, edit, nest, or delete any division and service. Each one can have its own logo.</p>
        </div>
        <button
          type="button"
          className="rounded-sm bg-brand px-4 py-2 text-sm font-semibold text-white"
          onClick={() =>
            setSite({
              ...site,
              divisions: [
                ...site.divisions,
                {
                  ...emptyNode(),
                  code: String(site.divisions.length + 1).padStart(2, "0"),
                  shortName: "New division",
                  title: "New division",
                  accent: "",
                },
              ],
            })
          }
        >
          Add division
        </button>
      </div>
      <div className="mt-8 space-y-8">
        {site.divisions.map((division, i) => (
          <section key={division.slug + i} className="rounded-xl bg-mist p-5">
            <div className="mb-4 flex justify-between">
              <h2 className="text-xl font-semibold text-brand">{division.title}</h2>
              <button
                type="button"
                className="text-sm text-red-600"
                onClick={() =>
                  setSite({
                    ...site,
                    divisions: site.divisions.filter((_, idx) => idx !== i),
                  })
                }
              >
                Delete division
              </button>
            </div>
            <div className="grid gap-3 md:grid-cols-2">
              <Field label="Code">
                <input
                  className={inputClass}
                  value={division.code}
                  onChange={(e) => updateDivision(i, { ...division, code: e.target.value })}
                />
              </Field>
              <Field label="Short name">
                <input
                  className={inputClass}
                  value={division.shortName}
                  onChange={(e) => updateDivision(i, { ...division, shortName: e.target.value })}
                />
              </Field>
              <Field label="Title">
                <input
                  className={inputClass}
                  value={division.title}
                  onChange={(e) => updateDivision(i, { ...division, title: e.target.value })}
                />
              </Field>
              <Field label="Slug">
                <input
                  className={inputClass}
                  value={division.slug}
                  onChange={(e) =>
                    updateDivision(i, { ...division, slug: slugify(e.target.value) || division.slug })
                  }
                />
              </Field>
              <Field label="Accent">
                <input
                  className={inputClass}
                  value={division.accent}
                  onChange={(e) => updateDivision(i, { ...division, accent: e.target.value })}
                />
              </Field>
            </div>
            <div className="mt-3 grid gap-3">
              <Field label="Summary">
                <textarea
                  rows={2}
                  className={inputClass}
                  value={division.summary}
                  onChange={(e) => updateDivision(i, { ...division, summary: e.target.value })}
                />
              </Field>
              <Field label="Description">
                <textarea
                  rows={4}
                  className={inputClass}
                  value={division.description}
                  onChange={(e) => updateDivision(i, { ...division, description: e.target.value })}
                />
              </Field>
              <MediaField
                label="Logo"
                accept="image/*"
                contain
                value={division.logo ?? ""}
                onChange={(logo) => updateDivision(i, { ...division, logo })}
              />
              <MediaField
                label="Image"
                accept="image/*"
                value={division.image}
                onChange={(image) => updateDivision(i, { ...division, image })}
              />
              <ExtraPhotosEditor
                photos={division.gallery ?? []}
                onChange={(gallery) => updateDivision(i, { ...division, gallery })}
              />
            </div>
            <div className="mt-5 space-y-3">
              {(division.children ?? []).map((child, c) => (
                <NodeEditor
                  key={child.slug + c}
                  node={child}
                  onChange={(next) => {
                    const children = (division.children ?? []).map((item, idx) =>
                      idx === c ? next : item,
                    );
                    updateDivision(i, { ...division, children });
                  }}
                  onRemove={() =>
                    updateDivision(i, {
                      ...division,
                      children: (division.children ?? []).filter((_, idx) => idx !== c),
                    })
                  }
                />
              ))}
              <button
                type="button"
                className="rounded-sm border border-brand px-4 py-2 text-sm font-semibold text-brand"
                onClick={() =>
                  updateDivision(i, {
                    ...division,
                    children: [...(division.children ?? []), emptyNode()],
                  })
                }
              >
                Add service
              </button>
            </div>
          </section>
        ))}
      </div>
      <SaveBar saving={saving} message={message} error={error} onSave={() => save(site)} />
    </div>
  );
}
