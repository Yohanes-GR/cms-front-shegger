"use client";

import { FormEvent, useEffect, useState } from "react";
import { Field, inputClass } from "@/components/admin/useSite";
import { cmsFetch } from "@/lib/api";

type CmsUser = {
  id: string;
  username: string;
  createdAt: string;
};

export default function AdminUsersPage() {
  const [users, setUsers] = useState<CmsUser[]>([]);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [drafts, setDrafts] = useState<Record<string, { username: string; password: string }>>({});
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function load() {
    const res = await cmsFetch("/api/users");
    const json = await res.json();
    if (!res.ok) throw new Error(json.message || "Could not load users.");
    const next = json as CmsUser[];
    setUsers(next);
    setDrafts(
      Object.fromEntries(next.map((user) => [user.id, { username: user.username, password: "" }])),
    );
  }

  useEffect(() => {
    load().catch((err) => setError(err instanceof Error ? err.message : "Could not load users."));
  }, []);

  async function createUser(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError("");
    setMessage("");
    try {
      const res = await cmsFetch("/api/users", {
        method: "POST",
        body: JSON.stringify({ username, password }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.message || "Could not add user.");
      setUsername("");
      setPassword("");
      setMessage("User added.");
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not add user.");
    } finally {
      setBusy(false);
    }
  }

  async function saveUser(id: string) {
    const draft = drafts[id];
    if (!draft) return;
    setBusy(true);
    setError("");
    setMessage("");
    try {
      const res = await cmsFetch("/api/users", {
        method: "PUT",
        body: JSON.stringify({
          id,
          username: draft.username,
          password: draft.password,
        }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.message || "Could not update user.");
      setMessage("User updated.");
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not update user.");
    } finally {
      setBusy(false);
    }
  }

  async function removeUser(id: string) {
    setBusy(true);
    setError("");
    setMessage("");
    try {
      const res = await cmsFetch(`/api/users?id=${encodeURIComponent(id)}`, { method: "DELETE" });
      const json = await res.json();
      if (!res.ok) throw new Error(json.message || "Could not delete user.");
      setMessage("User deleted.");
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not delete user.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div>
      <h1 className="text-3xl font-semibold text-brand">CMS users</h1>
      <p className="mt-2 max-w-2xl text-muted">
        Usernames and passwords are stored in the database. Leave the password blank to keep the current one.
      </p>

      <form onSubmit={createUser} className="mt-8 rounded-xl bg-white p-5 shadow-sm">
        <h2 className="font-semibold text-brand">Add user</h2>
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          <Field label="Username">
            <input className={inputClass} value={username} onChange={(e) => setUsername(e.target.value)} />
          </Field>
          <Field label="Password">
            <input
              className={inputClass}
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </Field>
        </div>
        <button
          type="submit"
          disabled={busy}
          className="mt-4 rounded-sm bg-brand px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
        >
          Add user
        </button>
      </form>

      <div className="mt-6 space-y-4">
        {users.map((user) => {
          const draft = drafts[user.id] || { username: user.username, password: "" };
          return (
            <section key={user.id} className="rounded-xl bg-white p-5 shadow-sm">
              <div className="grid gap-3 md:grid-cols-2">
                <Field label="Username">
                  <input
                    className={inputClass}
                    value={draft.username}
                    onChange={(e) =>
                      setDrafts({ ...drafts, [user.id]: { ...draft, username: e.target.value } })
                    }
                  />
                </Field>
                <Field label="New password">
                  <input
                    className={inputClass}
                    type="password"
                    value={draft.password}
                    placeholder="Leave blank to keep"
                    onChange={(e) =>
                      setDrafts({ ...drafts, [user.id]: { ...draft, password: e.target.value } })
                    }
                  />
                </Field>
              </div>
              <div className="mt-4 flex gap-4">
                <button
                  type="button"
                  disabled={busy}
                  onClick={() => saveUser(user.id)}
                  className="rounded-sm bg-brand px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
                >
                  Save
                </button>
                <button
                  type="button"
                  disabled={busy}
                  onClick={() => removeUser(user.id)}
                  className="text-sm text-red-600"
                >
                  Delete
                </button>
              </div>
            </section>
          );
        })}
      </div>
      {message && <p className="mt-4 text-sm text-brand">{message}</p>}
      {error && <p className="mt-4 text-sm text-red-600">{error}</p>}
    </div>
  );
}
