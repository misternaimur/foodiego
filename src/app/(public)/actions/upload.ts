"use server";

import { verifySession } from "@/lib/dal";
import cloudinary from "@/lib/cloudinary";
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

function uploadBuffer(buffer: Buffer, folder: string) {
  return new Promise<{
    public_id: string;
    secure_url: string;
    width: number;
    height: number;
    format: string;
  }>((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: `foodiego/${folder}`,
        resource_type: "image",
        transformation: [
          { width: 1600, height: 1600, crop: "limit" },
          { quality: "auto", fetch_format: "auto" },
        ],
        invalidate: true,
      },
      (error, result) => {
        if (error || !result) {
          reject(error ?? new Error("Cloudinary did not return an upload result."));
          return;
        }
        resolve(result);
      },
    );

    stream.end(buffer);
  });
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

    const result = await uploadBuffer(buffer, parsedOptions.data.folder);
    return {
      success: true,
      data: {
        assetId: result.public_id,
        publicId: result.public_id,
        secureUrl: result.secure_url,
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