import "server-only";

const IMGBB_UPLOAD_URL = "https://api.imgbb.com/1/upload";

// --- Imgbb raw API response shape ---
export interface ImgbbUploadResponse {
  success: boolean;
  status?: number;
  data?: {
    id: string;
    title: string;
    url_viewer?: string;
    url: string;
    display_url: string;
    width?: string;
    height?: string;
    size?: string;
    time?: string;
    expiration?: string;
    delete_url?: string;
  };
  error?: {
    message?: string;
    code?: number;
  };
}

export type UploadToImgbbResult =
  | { success: true; url: string; displayUrl: string; deleteUrl?: string }
  | { success: false; message: string };

const MAX_UPLOAD_BYTES = 5 * 1024 * 1024; // 5MB app-level cap (Imgbb allows up to 32MB)
const ALLOWED_MIME_TYPES = new Set(["image/jpeg", "image/png", "image/webp", "image/gif"]);

function isSupportedImage(buffer: Buffer, mimeType: string): boolean {
  if (mimeType === "image/jpeg") 
    return buffer.length > 2 && buffer[0] === 0xff && buffer[1] === 0xd8;
  if (mimeType === "image/png") 
    return buffer.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]));
  if (mimeType === "image/gif") 
  {
    const header = buffer.subarray(0, 6).toString("ascii");
    return header === "GIF87a" || header === "GIF89a";
  }
  if (mimeType === "image/webp") {
    return buffer.subarray(0, 4).toString("ascii") === "RIFF" && buffer.subarray(8, 12).toString("ascii") === "WEBP";
  }
  return false;
}

/**
 * Centralized Imgbb uploader. Every image-upload flow in Foodiego should
 * go through this single function — never call the Imgbb API directly
 * from a route/action.
 */
export async function uploadToImgbb(
  file: File,
  options?: { name?: string; expirationSeconds?: number }
): Promise<UploadToImgbbResult> {
  const apiKey = process.env.IMGBB_API_KEY;
  if (!apiKey) {
    console.error("IMGBB_API_KEY is not configured.");
    return { success: false, message: "Image upload is not configured. Please try again later." };
  }

  if (!file || file.size === 0) {
    return { success: false, message: "Please select an image to upload." };
  }
  if (!ALLOWED_MIME_TYPES.has(file.type)) {
    return { success: false, message: "Only JPEG, PNG, WebP, and GIF images are supported." };
  }
  if (file.size > MAX_UPLOAD_BYTES) {
    return { success: false, message: "Image must be smaller than 5MB." };
  }

  const buffer = Buffer.from(await file.arrayBuffer());

  if (!isSupportedImage(buffer, file.type)) {
    return { success: false, message: "The selected file is not a valid image." };
  }

  const form = new FormData();
  form.append("key", apiKey);
  form.append("image", buffer.toString("base64"));
  if (options?.name) form.append("name", options.name);
  if (options?.expirationSeconds) form.append("expiration", String(options.expirationSeconds));

  let response: Response;
  try {
    response = await fetch(IMGBB_UPLOAD_URL, { method: "POST", body: form });
  } catch (error) {
    console.error("Imgbb network error:", error);
    return { success: false, message: "Network error while uploading image. Please try again." };
  }

  let payload: ImgbbUploadResponse;
  try {
    payload = (await response.json()) as ImgbbUploadResponse;
  } catch (error) {
    console.error("Imgbb returned a non-JSON response:", error);
    return { success: false, message: "Image upload failed. Please try again." };
  }

  if (!response.ok || !payload.success || !payload.data?.url) {
    console.error("Imgbb upload failed:", payload.error?.message ?? response.statusText);
    return { success: false, message: "Image upload failed. Please try again." };
  }

  return {
    success: true,
    url: payload.data.url,
    displayUrl: payload.data.display_url ?? payload.data.url,
    deleteUrl: payload.data.delete_url,
  };
}