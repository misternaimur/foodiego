"use server";

import { verifySession } from "@/lib/dal";
import { z } from "zod";

const MAX_IMAGE_SIZE = 5 * 1024 * 1024;
const ALLOWED_MIME_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"] as const;
const ALLOWED_FOLDERS = ["restaurants", "menu-items", "avatars"] as const;

const UploadImageSchema = z.object({
  folder: z.enum(ALLOWED_FOLDERS).default("avatars"),
});

export type ImageUploadResult =
  | {
      success: true;
      data: {
        assetId: string;
        publicId: string;
        secureUrl: string;
        width: number;
        height: number;
        format: string;
      };
    }
  | { success: false; error: string };

function isSupportedImage(buffer: Buffer, mimeType: string) {
  if (mimeType === "image/jpeg") {
    return buffer.length > 2 && buffer[0] === 0xff && buffer[1] === 0xd8;
  }
  if (mimeType === "image/png") {
    return buffer.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]));
  }
  if (mimeType === "image/gif") {
    return buffer.subarray(0, 6).toString("ascii") === "GIF87a" || buffer.subarray(0, 6).toString("ascii") === "GIF89a";
  }
  if (mimeType === "image/webp") {
    return buffer.subarray(0, 4).toString("ascii") === "RIFF" && buffer.subarray(8, 12).toString("ascii") === "WEBP";
  }
  return false;
}

async function uploadToImgBB(buffer: Buffer, fileName: string, mimeType: string) {
  const apiKey = process.env.IMGBB_API_KEY;
  if (!apiKey) throw new Error("Missing IMGBB_API_KEY environment variable.");

  const body = new URLSearchParams({
    key: apiKey,
    image: buffer.toString("base64"),
    name: fileName.replace(/\.[^/.]+$/, ""),
  });
  const response = await fetch("https://api.imgbb.com/1/upload", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body,
  });
  const payload = (await response.json()) as {
    success?: boolean;
    error?: { message?: string };
    data?: {
      id?: string;
      url?: string;
      display_url?: string;
      width?: number;
      height?: number;
      image?: { extension?: string };
    };
  };

  if (!response.ok || !payload.success || !payload.data?.url) {
    throw new Error(payload.error?.message || `ImgBB upload failed (${response.status}).`);
  }
  return {
    id: payload.data.id || fileName,
    url: payload.data.display_url || payload.data.url,
    width: payload.data.width || 0,
    height: payload.data.height || 0,
    format: payload.data.image?.extension || mimeType.split("/")[1] || "image",
  };
}

export async function uploadImage(formData: FormData): Promise<ImageUploadResult> {
  try {
    await verifySession();

    const fileValue = formData.get("file");
    if (!(fileValue instanceof File) || fileValue.size === 0) {
      return { success: false, error: "Please select an image to upload." };
    }
    if (fileValue.size > MAX_IMAGE_SIZE) {
      return { success: false, error: "Image must be smaller than 5MB." };
    }

    const parsedOptions = UploadImageSchema.safeParse({
      folder: formData.get("folder") || "avatars",
    });
    if (!parsedOptions.success) {
      return { success: false, error: "Invalid upload destination." };
    }
    if (!(ALLOWED_MIME_TYPES as readonly string[]).includes(fileValue.type)) {
      return { success: false, error: "Only JPEG, PNG, WebP, and GIF images are supported." };
    }

    const buffer = Buffer.from(await fileValue.arrayBuffer());
    if (!isSupportedImage(buffer, fileValue.type)) {
      return { success: false, error: "The selected file is not a valid image." };
    }

    const result = await uploadToImgBB(buffer, fileValue.name, fileValue.type);
    return {
      success: true,
      data: {
        assetId: result.id,
        publicId: result.id,
        secureUrl: result.url,
        width: result.width,
        height: result.height,
        format: result.format,
      },
    };
  } catch (error) {
    console.error("Image upload failed:", error);
    return { success: false, error: "Image upload failed. Please try again." };
  }
}