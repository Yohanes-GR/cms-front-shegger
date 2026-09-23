"use client";

import { FormEvent, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { cmsFetch, setToken } from "@/lib/api";

function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [sending, setSending] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setSending(true);
    setError("");
    const res = await cmsFetch("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ username, password }),
    });
    const json = await res.json();
    if (!res.ok) {
      setError(json.message || "Login failed");
      setSending(false);
      return;
    }
    if (json.token) setToken(json.token);
    router.push(params.get("next") || "/admin");
    router.refresh();
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-brand-deep px-4">
      <form onSubmit={onSubmit} className="w-full max-w-sm rounded-xl bg-white p-8 shadow-xl">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-accent">
          CMS front
        </p>
        <h1 className="mt-2 text-2xl font-semibold text-brand">Sign in</h1>
        <p className="mt-2 text-sm text-muted">
          This editor writes to cms-back. The public website only reads from cms-back.
        </p>
        <label className="mt-6 grid gap-1 text-sm">
          <span className="font-medium">Username</span>
          <input
            value={username}
            autoComplete="username"
            onChange={(e) => setUsername(e.target.value)}
            className="rounded-sm border border-black/10 px-3 py-2.5 outline-none focus:border-accent"
          />
        </label>
        <label className="mt-4 grid gap-1 text-sm">
          <span className="font-medium">Password</span>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="rounded-sm border border-black/10 px-3 py-2.5 outline-none focus:border-accent"
          />
        </label>
        {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
        <button
          type="submit"
          disabled={sending}
          className="mt-6 w-full rounded-sm bg-brand py-3 text-sm font-semibold text-white disabled:opacity-60"
        >
          {sending ? "Signing in…" : "Enter dashboard"}
        </button>
      </form>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}
