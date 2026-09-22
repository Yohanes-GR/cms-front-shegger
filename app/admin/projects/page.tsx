"use client";

import { Field, SaveBar, inputClass, useSite } from "@/components/admin/useSite";
import { MediaField } from "@/components/admin/MediaField";
import { slugify } from "@/lib/data";
import type { Project } from "@/lib/types";

const emptyProject = (): Project => ({
  slug: `project-${Date.now()}`,
  title: "New project",
  category: "Building",
  division: "",
  location: "",
  year: `${new Date().getFullYear()}`,
  image: "",
  summary: "",
});

export default function AdminProjectsPage() {
  const { site, setSite, save, saving, message, error } = useSite();
  if (!site) return <p>Loading…</p>;

  return (
    <div>
      <div className="flex items-end justify-between gap-3">
        <div>
          <h1 className="text-3xl font-semibold text-brand">Projects</h1>
          <p className="mt-2 text-muted">Portfolio items shown on Home and Projects.</p>
        </div>
        <button
          type="button"
          className="rounded-sm bg-brand px-4 py-2 text-sm font-semibold text-white"
          onClick={() => setSite({ ...site, projects: [emptyProject(), ...site.projects] })}
        >
          Add project
        </button>
      </div>
      <div className="mt-8 space-y-6">
        {site.projects.map((project, i) => (
          <section key={project.slug + i} className="rounded-xl bg-white p-5 shadow-sm">
            <div className="mb-3 flex justify-end">
              <button
                type="button"
                className="text-sm text-red-600"
                onClick={() =>
                  setSite({ ...site, projects: site.projects.filter((_, idx) => idx !== i) })
                }
              >
                Delete
              </button>
            </div>
            <div className="grid gap-3 md:grid-cols-2">
              <Field label="Title">
                <input
                  className={inputClass}
                  value={project.title}
                  onChange={(e) => {
                    const projects = site.projects.map((item, idx) =>
                      idx === i
                        ? {
                            ...item,
                            title: e.target.value,
                            slug: slugify(e.target.value) || item.slug,
                          }
                        : item,
                    );
                    setSite({ ...site, projects });
                  }}
                />
              </Field>
              <Field label="Category">
                <input
                  className={inputClass}
                  value={project.category}
                  onChange={(e) => {
                    const projects = site.projects.map((item, idx) =>
                      idx === i ? { ...item, category: e.target.value } : item,
                    );
                    setSite({ ...site, projects });
                  }}
                />
              </Field>
              <Field label="Location">
                <input
                  className={inputClass}
                  value={project.location}
                  onChange={(e) => {
                    const projects = site.projects.map((item, idx) =>
                      idx === i ? { ...item, location: e.target.value } : item,
                    );
                    setSite({ ...site, projects });
                  }}
                />
              </Field>
              <Field label="Year">
                <input
                  className={inputClass}
                  value={project.year}
                  onChange={(e) => {
                    const projects = site.projects.map((item, idx) =>
                      idx === i ? { ...item, year: e.target.value } : item,
                    );
                    setSite({ ...site, projects });
                  }}
                />
              </Field>
              <Field label="Division slug">
                <input
                  className={inputClass}
                  value={project.division}
                  onChange={(e) => {
                    const projects = site.projects.map((item, idx) =>
                      idx === i ? { ...item, division: e.target.value } : item,
                    );
                    setSite({ ...site, projects });
                  }}
                />
              </Field>
            </div>
            <div className="mt-3 grid gap-3">
              <Field label="Summary">
                <textarea
                  rows={3}
                  className={inputClass}
                  value={project.summary}
                  onChange={(e) => {
                    const projects = site.projects.map((item, idx) =>
                      idx === i ? { ...item, summary: e.target.value } : item,
                    );
                    setSite({ ...site, projects });
                  }}
                />
              </Field>
              <MediaField
                label="Image"
                accept="image/*"
                value={project.image}
                onChange={(image) => {
                  const projects = site.projects.map((item, idx) =>
                    idx === i ? { ...item, image } : item,
                  );
                  setSite({ ...site, projects });
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
