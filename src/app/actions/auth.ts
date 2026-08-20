"use server";

import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";
import { RegisterFormSchema, LoginFormSchema, type FormState, type Role } from "@/lib/definitions";
import { dbConnect } from "@/lib/dbConnect";
import { User } from "@/models/User";
import { createSession, deleteSession } from "@/lib/session";

function roleHome(role: Role) {
  switch (role) {
    case "admin":
      return "/admin";
    case "restaurant":
      return "/dashboard/restaurant";
    case "rider":
      return "/dashboard/rider";
    default:
      return "/";
  }
}

export async function register(_state: FormState, formData: FormData): Promise<FormState> {
  const validatedFields = RegisterFormSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
    role: formData.get("role"),
  });

  if (!validatedFields.success) {
    return { errors: validatedFields.error.flatten().fieldErrors };
  }

  const { name, email, password, role } = validatedFields.data;

  await dbConnect();

  const existingUser = await User.findOne({ email }).lean();
  if (existingUser) {
    return { errors: { email: ["An account with this email already exists."] } };
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await User.create({ name, email, password: hashedPassword, role });

  await createSession(user._id.toString(), role, name);
  redirect(roleHome(role));
}

export async function login(_state: FormState, formData: FormData): Promise<FormState> {
  const validatedFields = LoginFormSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!validatedFields.success) {
    return { errors: validatedFields.error.flatten().fieldErrors };
  }

  const { email, password } = validatedFields.data;

  await dbConnect();

  const user = await User.findOne({ email });
  if (!user) {
    return { message: "Invalid email or password." };
  }

  const passwordsMatch = await bcrypt.compare(password, user.password);
  if (!passwordsMatch) {
    return { message: "Invalid email or password." };
  }

  await createSession(user._id.toString(), user.role, user.name);
  redirect(roleHome(user.role));
}

export async function logout() {
  await deleteSession();
  redirect("/login");
}
