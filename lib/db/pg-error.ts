// The Postgres error code of a failed query, from the driver error or the Drizzle error that wraps
// it, such as 23505 for a unique index and 23503 for a foreign key.
export function pgErrorCode(error: unknown): string | undefined {
  const value = error as { code?: unknown; cause?: { code?: unknown } } | null;
  const code = value?.code ?? value?.cause?.code;
  return typeof code === "string" ? code : undefined;
}

export const UNIQUE_VIOLATION = "23505";
export const FOREIGN_KEY_VIOLATION = "23503";

// The name of the index or constraint that refused the row, such as roles_name_lower_idx.
export function pgConstraintName(error: unknown): string | undefined {
  const value = error as { constraint_name?: unknown; cause?: { constraint_name?: unknown } } | null;
  const name = value?.constraint_name ?? value?.cause?.constraint_name;
  return typeof name === "string" ? name : undefined;
}
