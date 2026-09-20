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

const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:8000";

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
