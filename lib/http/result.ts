export const ROLES = ["owner", "manager", "editor"] as const;
export type Role = (typeof ROLES)[number];

export type ActionResult = { ok: true; message?: string } | { ok: false; error: string };
