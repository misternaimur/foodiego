import "server-only";

import jwt from "jsonwebtoken";

/**
 * Mints a token in the exact shape foodiego-backend/routes/userRoutes.js's
 * own signToken() produces ({ userId, role }, same JWT_SECRET), so its
 * `protect` middleware (and anything gated behind it, e.g. the chat routes)
 * accepts it — without Next either calling that login endpoint or the
 * browser ever holding a backend credential itself.
 */
export function mintBackendToken(session: { id: string; role: string }): string {
  const secret = process.env.BACKEND_JWT_SECRET;
  if (!secret) {
    throw new Error("Missing BACKEND_JWT_SECRET environment variable");
  }

  return jwt.sign({ userId: session.id, role: session.role }, secret, { expiresIn: "5m" });
}
