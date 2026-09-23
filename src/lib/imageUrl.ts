/**
 * Profile/cover photos are uploaded to an image host first and only the
 * resulting https URL is stored on the document. Anything else (a data: URI,
 * javascript:, a plain string) is refused. An empty string is allowed so a
 * photo can be cleared.
 */
export function isStorableImageUrl(value: unknown): value is string {
  if (typeof value !== "string") return false;
  if (value === "") return true;
  try {
    return new URL(value).protocol === "https:";
  } catch {
    return false;
  }
}
