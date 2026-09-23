"use client";

import Link from "next/link";
import { useSite } from "@/components/admin/useSite";

const cards = [
  { href: "/admin/home", title: "Home & motion", text: "Hero copy, slideshow, and video." },
  { href: "/admin/company", title: "Company", text: "Name, phone, email, address." },
  { href: "/admin/about", title: "About", text: "Story and why Sheger." },
  { href: "/admin/pages", title: "Page copy", text: "Services, projects, contact, real estate." },
  { href: "/admin/services", title: "Services", text: "Add, edit, and nest divisions." },
  { href: "/admin/projects", title: "Projects", text: "Portfolio items." },
  { href: "/admin/news", title: "News & Insights", text: "Articles with a photo, headline, and text." },
  { href: "/admin/careers", title: "Careers", text: "Open roles with a photo and description." },
  { href: "/admin/listings", title: "Real estate", text: "Finfine market listings." },
  { href: "/admin/partners", title: "Partners", text: "Client and partner logos." },
  { href: "/admin/media", title: "Media", text: "Upload images and motion video." },
];

export default function AdminHomePage() {
  const { site } = useSite();

  return (
    <div>
      <h1 className="text-3xl font-semibold text-brand">Dashboard</h1>
      <p className="mt-2 text-muted">
        Add, edit, and update every public page. Changes go live after you save.
      </p>
      <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <div className="rounded-xl bg-brand p-5 text-white">
          <p className="text-xs uppercase tracking-[0.18em] text-accent">Divisions</p>
          <p className="mt-2 text-3xl font-semibold">{site?.divisions.length ?? "—"}</p>
        </div>
        <div className="rounded-xl bg-white p-5 shadow-sm">
          <p className="text-xs uppercase tracking-[0.18em] text-accent">Projects</p>
          <p className="mt-2 text-3xl font-semibold text-brand">{site?.projects.length ?? "—"}</p>
        </div>
        <div className="rounded-xl bg-white p-5 shadow-sm">
          <p className="text-xs uppercase tracking-[0.18em] text-accent">Listings</p>
          <p className="mt-2 text-3xl font-semibold text-brand">{site?.listings.length ?? "—"}</p>
        </div>
      </div>
      <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) => (
          <Link
            key={card.href}
            href={card.href}
            className="rounded-xl bg-white p-5 shadow-sm ring-1 ring-black/5 hover:ring-accent/40"
          >
            <h2 className="font-semibold text-brand">{card.title}</h2>
            <p className="mt-2 text-sm text-muted">{card.text}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
