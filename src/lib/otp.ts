import "server-only";

import crypto from "node:crypto";
import { dbConnect } from "@/lib/dbConnect";
import { Otp } from "@/models/Otp";

// ============================================================
// E-MAIL OTP — server-side logic ("backend" control point)
// ------------------------------------------------------------
// createRegistrationOtp  -> make + "send" a 6-digit code
// checkRegistrationOtp   -> validate a code the user typed
// consumeVerifiedRegistrationOtp -> enforced inside the actual
//                           account-creation actions
//
// Delivery: if no SMTP_* env is configured the code is NOT
// e-mailed — it is logged on the server and returned to the
// caller as `devCode` so the flow is testable with any address.
// Wire a real transport in `deliverOtp` once SMTP creds exist.
// ============================================================

const CODE_TTL_MS = 10 * 60 * 1000; // code valid for 10 minutes
const RESEND_COOLDOWN_MS = 30 * 1000; // min gap between sends
const MAX_ATTEMPTS = 6; // wrong tries before the code is locked
const CONSUME_GRACE_MS = 15 * 60 * 1000; // verified -> account-created window

const PEPPER = process.env.SESSION_SECRET ?? "foodiego-otp-pepper";
const SMTP_CONFIGURED = Boolean(process.env.SMTP_HOST && process.env.SMTP_USER);

function normalize(email: string) {
  return email.trim().toLowerCase();
}

function hashCode(email: string, code: string) {
  return crypto.createHash("sha256").update(`${email}:${code}:${PEPPER}`).digest("hex");
}

function generateCode() {
  return crypto.randomInt(0, 1_000_000).toString().padStart(6, "0");
}

async function deliverOtp(email: string, code: string): Promise<{ delivered: boolean }> {
  if (!SMTP_CONFIGURED) {
    console.log(`[OTP] registration code for ${email}: ${code}`);
    return { delivered: false };
  }

  // TODO: real transport here (e.g. nodemailer) once SMTP_* is set. Until then
  // the code is only logged/returned so testing needs no inbox.
  console.log(`[OTP] (SMTP configured but no transport implemented) ${email}: ${code}`);
  return { delivered: false };
}

export type SendOtpResult =
  | { ok: true; devCode?: string }
  | { ok: false; message: string };

export async function createRegistrationOtp(rawEmail: string): Promise<SendOtpResult> {
  await dbConnect();
  const email = normalize(rawEmail);

  const existing = await Otp.findOne({ email, purpose: "register" }).lean();
  if (
    existing &&
    !existing.verifiedAt &&
    Date.now() - new Date(existing.updatedAt).getTime() < RESEND_COOLDOWN_MS
  ) {
    return { ok: false, message: "Please wait a few seconds before requesting another code." };
  }

  const code = generateCode();
  await Otp.findOneAndUpdate(
    { email, purpose: "register" },
    {
      email,
      purpose: "register",
      codeHash: hashCode(email, code),
      attempts: 0,
      verifiedAt: null,
      expiresAt: new Date(Date.now() + CODE_TTL_MS),
    },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );

  const { delivered } = await deliverOtp(email, code);
  return delivered ? { ok: true } : { ok: true, devCode: code };
}

export type CheckOtpResult = { ok: true } | { ok: false; message: string };

export async function checkRegistrationOtp(
  rawEmail: string,
  rawCode: string
): Promise<CheckOtpResult> {
  await dbConnect();
  const email = normalize(rawEmail);
  const code = rawCode.trim();

  const doc = await Otp.findOne({ email, purpose: "register" });
  if (!doc || doc.expiresAt.getTime() < Date.now()) {
    return { ok: false, message: "This code has expired. Please request a new one." };
  }
  if (doc.attempts >= MAX_ATTEMPTS) {
    return { ok: false, message: "Too many incorrect attempts. Please request a new code." };
  }
  if (doc.codeHash !== hashCode(email, code)) {
    doc.attempts += 1;
    await doc.save();
    return { ok: false, message: "Incorrect code. Please try again." };
  }

  doc.verifiedAt = new Date();
  await doc.save();
  return { ok: true };
}

// Enforced inside establishSession / registerRestaurant: the address must have a
// still-fresh verified code. Consumes (deletes) it so it cannot be reused.
export async function consumeVerifiedRegistrationOtp(rawEmail: string): Promise<boolean> {
  await dbConnect();
  const email = normalize(rawEmail);

  const doc = await Otp.findOne({ email, purpose: "register" });
  if (!doc || !doc.verifiedAt) return false;
  if (Date.now() - doc.verifiedAt.getTime() > CONSUME_GRACE_MS) return false;

  await doc.deleteOne();
  return true;
}
