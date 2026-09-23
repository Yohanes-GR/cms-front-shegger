"use client";

import Link from "next/link";
import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { clearToken, cmsFetch, getToken } from "@/lib/api";

const links = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/home", label: "Home & motion" },
  { href: "/admin/company", label: "Company" },
  { href: "/admin/about", label: "About" },
  { href: "/admin/pages", label: "Page copy" },
  { href: "/admin/services", label: "Services" },
  { href: "/admin/projects", label: "Projects" },
  { href: "/admin/news", label: "News & Insights" },
  { href: "/admin/careers", label: "Careers" },
  { href: "/admin/listings", label: "Real estate" },
  { href: "/admin/partners", label: "Partners" },
  { href: "/admin/media", label: "Media" },
  { href: "/admin/users", label: "Users" },
];

export function AdminFrame({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const websiteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

  useEffect(() => {
    if (pathname === "/admin/login") return;
    if (!getToken()) router.replace("/admin/login");
  }, [pathname, router]);

  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  async function logout() {
    await cmsFetch("/api/auth/logout", { method: "POST" }).catch(() => {});
    clearToken();
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <div className="min-h-screen bg-sand text-ink">
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-60 flex-col bg-brand-deep text-white lg:flex">
        <div className="border-b border-white/10 px-5 py-5">
          <p className="text-[11px] uppercase tracking-[0.22em] text-accent">CMS</p>
          <p className="mt-1 font-semibold">Sheger Admin</p>
        </div>
        <nav className="flex-1 space-y-1 p-3">
          {links.map((link) => {
            const active =
              link.href === "/admin"
                ? pathname === "/admin"
                : pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`block rounded-sm px-3 py-2 text-sm ${
                  active ? "bg-white/10 text-accent" : "text-white/80 hover:bg-white/5"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>
        <div className="space-y-2 border-t border-white/10 p-4">
          <a href={websiteUrl} className="block text-sm text-white/70 hover:text-accent">
            View website
          </a>
          <button type="button" onClick={logout} className="text-sm text-white/70 hover:text-accent">
            Sign out
          </button>
        </div>
      </aside>
      <div className="lg:pl-60">
        <header className="sticky top-0 z-30 flex items-center justify-between border-b border-black/5 bg-white px-4 py-3 lg:hidden">
          <p className="font-semibold text-brand">Sheger CMS</p>
          <a href={websiteUrl} className="text-sm text-accent">
            View site
          </a>
        </header>
        <nav className="flex gap-2 overflow-x-auto border-b border-black/5 bg-white px-4 py-2 text-sm lg:hidden">
          {links.map((link) => (
            <Link key={link.href} href={link.href} className="whitespace-nowrap text-brand">
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="p-4 lg:p-8">{children}</div>
      </div>
    </div>
  );
}
