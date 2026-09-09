import mongoose, { Schema, models, model } from "mongoose";

// ============================================================
// OTP MODEL -> "otps" collection
// ------------------------------------------------------------
// One short-lived e-mail verification code per (email, purpose).
// Used to gate customer / restaurant registration: the account
// is only created once a code sent to the address is confirmed.
// A TTL index drops the row automatically after it expires.
// ============================================================
export interface OtpDocument {
  _id: mongoose.Types.ObjectId;
  email: string;
  purpose: string;
  codeHash: string;
  attempts: number;
  verifiedAt?: Date | null;
  expiresAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const OtpSchema = new Schema<OtpDocument>(
  {
    email: { type: String, required: true, trim: true, lowercase: true },
    purpose: { type: String, required: true, default: "register" },
    codeHash: { type: String, required: true },
    attempts: { type: Number, default: 0 },
    verifiedAt: { type: Date, default: null },
    expiresAt: { type: Date, required: true },
  },
  { timestamps: true }
);

// Only one live code per address+purpose (re-sending upserts this row).
OtpSchema.index({ email: 1, purpose: 1 }, { unique: true });
// Mongo removes the document once `expiresAt` is in the past.
OtpSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export const Otp =
  (models.Otp as mongoose.Model<OtpDocument>) || model<OtpDocument>("Otp", OtpSchema, "otps");

export default Otp;
