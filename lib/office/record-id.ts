// T-52: the largest id a Postgres integer column holds.
const MAX_RECORD_ID = 2_147_483_647;

// Reads the id of a record from a form: a whole number from 1 to 2,147,483,647, or null. Anything
// else, such as "abc", "1.5", "0", "-1", "1e4", an empty value, or a number too large for the
// column, is null, so the save can answer 400 instead of the database refusing it with a 500.
export function readRecordId(value: FormDataEntryValue | null): number | null {
  if (typeof value !== "string") return null;
  const text = value.trim();
  if (!/^\d+$/.test(text)) return null;
  const id = Number(text);
  return id >= 1 && id <= MAX_RECORD_ID ? id : null;
}
