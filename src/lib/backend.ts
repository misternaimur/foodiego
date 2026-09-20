import "server-only";

import { mintBackendToken } from "@/lib/backendAuth";

/**
 * Server-only bridge to the separate foodiego-backend Express API.
 *
 * Next.js route handlers verify the caller's Firebase session cookie first
 * (see src/lib/session.ts / src/lib/dal.ts) and only then call through to
 * this — the browser never talks to foodiego-backend directly, so no
 * separate token scheme is needed to keep this safe.
 */

// UPDATE (production-deploy fix): this used to silently fall back to
// "http://localhost:8000" whenever BACKEND_URL wasn't set — harmless in
// local dev (where that's genuinely the right default), but on Vercel
// there is no localhost:8000, so every order/favorite/address/chat call
// failed with a generic connection error that gave no hint of the real
// cause. BACKEND_URL was missing from Vercel's env entirely (it only ever
// existed in the gitignored .env.local — see .env.example). Production
// (VERCEL=1, set automatically by Vercel) now fails, on first actual use,
// with a message that names the actual missing variable instead of
// silently trying to fetch a dead address. This is resolved lazily
// (inside backendFetch, not at module load) so merely importing this file
// can never crash a route that doesn't end up calling it.
function resolveBackendUrl(): string {
  const configured = process.env.BACKEND_URL;
  if (configured) return configured;
  if (process.env.VERCEL || process.env.NODE_ENV === "production") {
    throw new Error(
      "Missing BACKEND_URL environment variable. Set it in the Vercel project's Environment Variables to the deployed foodiego-backend URL (e.g. https://foodiego-backend.vercel.app)."
    );
  }
  return "http://localhost:8000";
}

export class BackendError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "BackendError";
    this.status = status;
  }
}

export async function backendFetch<T = unknown>(
  path: string,
  init?: Omit<RequestInit, "body"> & { body?: unknown }
): Promise<T> {
  const { body, headers, ...rest } = init ?? {};
  const jsonBody = body !== undefined && typeof body !== "string";
  const BACKEND_URL = resolveBackendUrl();

  const res = await fetch(`${BACKEND_URL}${path}`, {
    ...rest,
    headers: {
      ...(jsonBody ? { "Content-Type": "application/json" } : {}),
      ...headers,
    },
    body: jsonBody ? JSON.stringify(body) : (body as BodyInit | undefined),
    cache: "no-store",
  });

  let payload: { success?: boolean; message?: string; data?: T } | null = null;
  try {
    payload = await res.json();
  } catch {
    // non-JSON response, fall through to the status-based error below
  }

  if (!res.ok || payload?.success === false) {
    throw new BackendError(payload?.message || "The backend request failed.", res.status);
  }

  return (payload?.data ?? payload) as T;
}

/**
 * Same as backendFetch, but attaches a freshly-minted `Authorization: Bearer`
 * token for the given session — for the handful of foodiego-backend routes
 * (chat, currently) that sit behind its own `protect` middleware instead of
 * being open server-to-server calls.
 */
export async function backendFetchAsUser<T = unknown>(
  session: { id: string; role: string },
  path: string,
  init?: Omit<RequestInit, "body"> & { body?: unknown }
): Promise<T> {
  const token = mintBackendToken(session);
  return backendFetch<T>(path, {
    ...init,
    headers: { ...init?.headers, Authorization: `Bearer ${token}` },
  });
}
