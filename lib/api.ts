export function cmsApiUrl() {
  return (process.env.NEXT_PUBLIC_CMS_API_URL || "http://127.0.0.1:3001").replace(/\/$/, "");
}

export function getToken() {
  if (typeof window === "undefined") return "";
  return localStorage.getItem("sbg_admin_token") || "";
}

export function setToken(token: string) {
  localStorage.setItem("sbg_admin_token", token);
}

export function clearToken() {
  localStorage.removeItem("sbg_admin_token");
}

export function authHeaders(json = true) {
  const headers: Record<string, string> = {};
  if (json) headers["Content-Type"] = "application/json";
  const token = getToken();
  if (token) headers.Authorization = `Bearer ${token}`;
  return headers;
}

export async function cmsFetch(path: string, init: RequestInit = {}) {
  const json = !(init.body instanceof FormData);
  const response = await fetch(`${cmsApiUrl()}${path}`, {
    ...init,
    credentials: "include",
    headers: {
      ...authHeaders(json),
      ...(init.headers || {}),
    },
  });
  return response;
}
