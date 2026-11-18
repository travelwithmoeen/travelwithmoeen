// The Postgres error code of a failed query, from the driver error or the Drizzle error that wraps
// it, such as 23505 for a unique index and 23503 for a foreign key.
export function pgErrorCode(error: unknown): string | undefined {
  const value = error as { code?: unknown; cause?: { code?: unknown } } | null;
  const code = value?.code ?? value?.cause?.code;
  return typeof code === "string" ? code : undefined;
}

export const UNIQUE_VIOLATION = "23505";
export const FOREIGN_KEY_VIOLATION = "23503";
