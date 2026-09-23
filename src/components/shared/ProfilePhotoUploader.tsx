"use client";

import { useRef, useState } from "react";
import { Camera, LoaderCircle } from "lucide-react";
import { uploadImage } from "@/app/(public)/actions/upload";

const MAX_UPLOAD_BYTES = 5 * 1024 * 1024;

interface ProfilePhotoUploaderProps {
  /** The currently saved photo, if any. */
  imageUrl?: string | null;
  /** Used for the initial shown when there's no photo, and for alt text. */
  name: string;
  /**
   * Persists the uploaded image's URL (e.g. PATCH the profile). Throw to
   * report a failure - the preview is dropped and the message shown.
   */
  onUploaded: (url: string) => Promise<void>;
  /** Tailwind size classes for the avatar, e.g. "h-20 w-20". */
  sizeClassName?: string;
}

/**
 * Round avatar with a "change photo" overlay. Uploads through the same
 * uploadImage server action used for menu-item photos, then hands the
 * resulting URL to `onUploaded` to save it on the right profile.
 */
export default function ProfilePhotoUploader({
  imageUrl,
  name,
  onUploaded,
  sizeClassName = "h-20 w-20",
}: ProfilePhotoUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [broken, setBroken] = useState(false);

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    setError(null);
    if (!file.type.startsWith("image/")) {
      setError("Please choose an image file.");
      return;
    }
    if (file.size > MAX_UPLOAD_BYTES) {
      setError("Image must be smaller than 5MB.");
      return;
    }

    const localUrl = URL.createObjectURL(file);
    setPreview(localUrl);
    setUploading(true);
    try {
      const body = new FormData();
      body.append("file", file);
      body.append("folder", "avatars");
      const result = await uploadImage(body);
      if (!result.success) throw new Error(result.error);
      await onUploaded(result.data.secureUrl);
      setBroken(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed. Please try again.");
    } finally {
      setUploading(false);
      setPreview(null);
      URL.revokeObjectURL(localUrl);
    }
  };

  const src = preview || imageUrl;
  const initial = name.trim().charAt(0).toUpperCase() || "?";

  return (
    <div className="flex items-center gap-4">
      <input ref={inputRef} type="file" accept="image/*" onChange={handleFile} hidden />
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={uploading}
        className={`group relative shrink-0 overflow-hidden rounded-full bg-emerald-100 ring-4 ring-white shadow-md ${sizeClassName}`}
        aria-label={imageUrl ? "Change profile photo" : "Upload profile photo"}
      >
        {src && !broken ? (
          // eslint-disable-next-line @next/next/no-img-element -- user-uploaded URL from any image host
          <img src={src} alt={name} className="h-full w-full object-cover" onError={() => setBroken(true)} />
        ) : (
          <span className="flex h-full w-full items-center justify-center text-2xl font-black text-emerald-700">{initial}</span>
        )}
        <span
          className={`absolute inset-0 flex flex-col items-center justify-center gap-0.5 bg-slate-900/55 text-white transition-opacity ${
            uploading ? "opacity-100" : "opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100"
          }`}
        >
          {uploading ? <LoaderCircle className="h-5 w-5 animate-spin" /> : <Camera className="h-5 w-5" />}
          <span className="text-[10px] font-bold">{uploading ? "Uploading" : imageUrl ? "Change" : "Upload"}</span>
        </span>
      </button>
      <div className="min-w-0">
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="text-sm font-bold text-emerald-700 hover:underline disabled:opacity-60"
        >
          {uploading ? "Uploading photo..." : imageUrl ? "Change photo" : "Upload a photo"}
        </button>
        <p className="text-xs text-slate-500">JPG, PNG, WebP or GIF, up to 5MB.</p>
        {error && <p className="mt-1 text-xs font-semibold text-rose-600">{error}</p>}
      </div>
    </div>
  );
}
