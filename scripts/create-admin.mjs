import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import readline from "node:readline/promises";
import { stdin, stdout } from "node:process";

// Standalone provisioning script for the static "admin" role, which is never
// exposed as a choice on the public registration form. Run with:
//   node --env-file=.env scripts/create-admin.mjs

const MONGODB_URL = process.env.MongoDB_URL;

if (!MONGODB_URL) {
  console.error("Missing MongoDB_URL environment variable.");
  process.exit(1);
}

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true, unique: true },
    password: { type: String, required: true },
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

  await mongoose.connect(MONGODB_URL, { dbName: "foodiego" });

  const existing = await User.findOne({ email });
  if (existing) {
    console.error(`A user with email ${email} already exists (role: ${existing.role}).`);
    await mongoose.disconnect();
    process.exit(1);
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  await User.create({ name, email, password: hashedPassword, role: "admin" });

  console.log(`Admin account created for ${email}.`);
  await mongoose.disconnect();
}

main().catch(async (error) => {
  console.error(error);
  await mongoose.disconnect();
  process.exit(1);
});
