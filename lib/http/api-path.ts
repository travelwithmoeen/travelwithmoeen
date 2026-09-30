export function apiPath(path: string) {
  const base = (process.env.API_BASE_URL ?? "").trim().replace(/\/$/, "");
  return `${base}${path}`;
}
