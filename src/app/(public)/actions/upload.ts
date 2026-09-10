"use server";

import * as z from "zod";
import { verifySession } from "@/lib/dal";
import { uploadToImgbb } from "@/lib/imgbb";

const ALLOWED_FOLDERS = ["restaurants", "menu-items", "avatars", "riders"] as const;

const UploadImageSchema = z.object({
  folder: z.enum(ALLOWED_FOLDERS).default("avatars"),
});

export type ImageUploadResult =
  | { success: true; data: { imageUrl: string } }
  | { success: false; error: string };

export async function uploadImage(formData: FormData): Promise<ImageUploadResult> {
  try {
    await verifySession();

    const fileValue = formData.get("file");
    if (!(fileValue instanceof File) || fileValue.size === 0) {
      return { success: false, error: "Please select an image to upload." };
    }

    const parsedOptions = UploadImageSchema.safeParse({
      folder: formData.get("folder") || "avatars",
    });
    if (!parsedOptions.success) {
      return { success: false, error: "Invalid upload destination." };
    }

    const result = await uploadToImgbb(fileValue, { name: parsedOptions.data.folder });
    if (!result.success) {
      return { success: false, error: result.message };
    }

    return { success: true, data: { imageUrl: result.url } };
  } catch (error) {
    console.error("Image upload failed:", error);
    return { success: false, error: "Image upload failed. Please try again." };
  }
}