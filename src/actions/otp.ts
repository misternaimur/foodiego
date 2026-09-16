"use server";

import * as z from "zod";
import { dbConnect } from "@/lib/dbConnect";
import { User } from "@/models/User";
import {
  createRegistrationOtp,
  checkRegistrationOtp,
  type SendOtpResult,
  type CheckOtpResult,
} from "@/lib/otp";

const emailSchema = z.email({ error: "Please enter a valid email address." }).trim().toLowerCase();

// Step 1 of registration: e-mail a verification code (see src/lib/otp.ts for the
// dev-mode behaviour). Refuses addresses that already have an account.
export async function sendRegistrationOtp(rawEmail: string): Promise<SendOtpResult> {
  const parsed = emailSchema.safeParse(rawEmail);
  if (!parsed.success) {
    return { ok: false, message: "Please enter a valid email address." };
  }
  const email = parsed.data;

  await dbConnect();
  const existing = await User.findOne({ email }).lean();
  if (existing) {
    return { ok: false, message: "An account with this email already exists. Please sign in instead." };
  }

  return createRegistrationOtp(email);
}

// Step 2: confirm the code. On success the address is marked verified for a
// short window; the account-creation action then consumes it.
export async function verifyRegistrationOtp(
  rawEmail: string,
  code: string
): Promise<CheckOtpResult> {
  const parsed = emailSchema.safeParse(rawEmail);
  if (!parsed.success) {
    return { ok: false, message: "Please enter a valid email address." };
  }
  if (!/^\d{6}$/.test(code.trim())) {
    return { ok: false, message: "Enter the 6-digit code from your email." };
  }

  return checkRegistrationOtp(parsed.data, code);
}
