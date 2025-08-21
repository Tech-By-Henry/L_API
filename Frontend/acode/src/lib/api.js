// src/lib/api.js
export const API_BASE = (import.meta.env.VITE_API_BASE_URL).replace(/\/$/, "");
export const NUB_BANKS_URL = import.meta.env.VITE_NUB_BANKS_URL;

/**
 * apiFetch(pathOrUrl, options)
 * - if pathOrUrl is a full URL (starts with http), it will fetch it directly.
 * - if pathOrUrl is a path (e.g. "/auth/api/login/") it will prepend API_BASE.
 * returns { ok, status, data, raw }
 */
export async function apiFetch(pathOrUrl, options = {}) {
  const url =
    /^https?:\/\//i.test(pathOrUrl)
      ? pathOrUrl
      : `${API_BASE.replace(/\/$/, "")}/${String(pathOrUrl).replace(/^\//, "")}`;

  const merged = {
    headers: { "Content-Type": "application/json", ...(options.headers || {}) },
    ...options,
  };

  const res = await fetch(url, merged);
  const text = await res.text();
  let data = null;
  try {
    data = text ? JSON.parse(text) : null;
  } catch (e) {
    data = text;
  }
  return { ok: res.ok, status: res.status, data, raw: res };
}
