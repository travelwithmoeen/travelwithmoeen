// T-54: Postgres refuses the NUL character in text, so a request that carried it into a query
// would fail with a 500. This finds it in any text value of a form, a JSON body, or a single value,
// so the route can refuse the request before any query.
export const NUL_TEXT_ERROR = "Some text has a character that cannot be saved.";

export function hasNulText(value: unknown): boolean {
  if (typeof value === "string") return value.includes("\u0000");
  if (value instanceof FormData) {
    for (const [key, entry] of value.entries()) {
      if (hasNulText(key) || hasNulText(entry)) return true;
    }
    return false;
  }
  if (Array.isArray(value)) return value.some(hasNulText);
  if (value && typeof value === "object" && !(value instanceof Blob)) {
    return Object.entries(value).some(([key, entry]) => hasNulText(key) || hasNulText(entry));
  }
  return false;
}
