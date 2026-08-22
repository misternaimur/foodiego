import mongoose from "mongoose";
import { cert, initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import readline from "node:readline/promises";
import { stdin, stdout } from "node:process";

// Standalone provisioning script for the static "admin" role, which is never
// exposed as a choice on the public registration form. Run with:
//   node --env-file=.env scripts/create-admin.mjs

const MONGODB_URL = process.env.MongoDB_URL;
const FIREBASE_PROJECT_ID = process.env.FIREBASE_PROJECT_ID;
const FIREBASE_CLIENT_EMAIL = process.env.FIREBASE_CLIENT_EMAIL;
const FIREBASE_PRIVATE_KEY = process.env.FIREBASE_PRIVATE_KEY;

if (!MONGODB_URL) {
  console.error("Missing MongoDB_URL environment variable.");
  process.exit(1);
}

if (!FIREBASE_PROJECT_ID || !FIREBASE_CLIENT_EMAIL || !FIREBASE_PRIVATE_KEY) {
  console.error(
    "Missing FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, or FIREBASE_PRIVATE_KEY environment variable."
  );
  process.exit(1);
}

const firebaseApp = initializeApp({
  credential: cert({
    projectId: FIREBASE_PROJECT_ID,
    clientEmail: FIREBASE_CLIENT_EMAIL,
    privateKey: FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n"),
  }),
});
const adminAuth = getAuth(firebaseApp);

const UserSchema = new mongoose.Schema(
  {
    uid: { type: String, required: true, unique: true, index: true },
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true, unique: true },
    role: { type: String, enum: ["customer", "restaurant", "rider", "admin"], required: true },
  },
  { timestamps: true }
);

const User = mongoose.models.User || mongoose.model("User", UserSchema);

async function main() {
  const rl = readline.createInterface({ input: stdin, output: stdout });

  const name = (await rl.question("Admin name: ")).trim();
  const email = (await rl.question("Admin email: ")).trim().toLowerCase();
  const password = await rl.question("Admin password (min 8 chars): ");

  rl.close();

  if (!name || !email || password.length < 8) {
    console.error("Name, a valid email, and a password of at least 8 characters are required.");
    process.exit(1);
  }

  await mongoose.connect(MONGODB_URL, { dbName: "FoodBackend" });

  const existing = await User.findOne({ email });
  if (existing) {
    console.error(`A user with email ${email} already exists (role: ${existing.role}).`);
    await mongoose.disconnect();
    process.exit(1);
  }

  const firebaseUser = await adminAuth.createUser({
    email,
    password,
    displayName: name,
  });

  await User.create({ uid: firebaseUser.uid, name, email, role: "admin" });

  console.log(`Admin account created for ${email}.`);
  await mongoose.disconnect();
}

main().catch(async (error) => {
  console.error(error);
  await mongoose.disconnect();
  process.exit(1);
});
