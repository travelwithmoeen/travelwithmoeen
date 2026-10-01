export const ROLES = ["owner", "manager", "editor"] as const;
export type Role = (typeof ROLES)[number];

export type ActionResult = { ok: true; message?: string } | { ok: false; error: string; status?: 403 };

export function forbidden(error: string): ActionResult {
  return { ok: false, error, status: 403 };
}
