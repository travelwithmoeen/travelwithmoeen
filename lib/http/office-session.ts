import { headers } from "next/headers";

export type OfficeSession = {
  id: number;
  email: string;
  // T-62 (BR-119): the person's own name, or null.
  name: string | null;
  // T-63: the role, read on each request, so a change applies on the next page (BR-129).
  roleId: number;
  roleName: string;
  isOwner: boolean;
  canReadRequests: boolean;
  canManageRoles: boolean;
  canEditContent: boolean;
  canManageUsers: boolean;
  canDeleteTour: boolean;
  canEditRates: boolean;
  canUpdateRequestStatus: boolean;
  canDeleteRequest: boolean;
  canRunBackup: boolean;
  newRequestCount: number;
};

export type OfficeUserRow = {
  id: number;
  email: string;
  name: string | null;
  roleId: number;
  roleName: string;
  isOwner: boolean;
};

export type OfficeRoleChoice = { id: number; name: string; isOwner: boolean };

async function officeUrl(path: string) {
  const configured = (process.env.API_BASE_URL ?? "").trim().replace(/\/$/, "");
  if (configured) return `${configured}${path}`;
  const headerStore = await headers();
  const host = headerStore.get("x-forwarded-host") ?? headerStore.get("host");
  const proto = headerStore.get("x-forwarded-proto") ?? "http";
  if (!host) throw new Error("The office API host is not set.");
  return `${proto}://${host}${path}`;
}

async function officeRequest(path: string) {
  const headerStore = await headers();
  return fetch(await officeUrl(path), {
    headers: { cookie: headerStore.get("cookie") ?? "" },
    cache: "no-store",
  });
}

export async function getOfficeSession(): Promise<OfficeSession | null> {
  const response = await officeRequest("/api/office/session");
  if (!response.ok) return null;
  const body = (await response.json()) as { ok: boolean } & Partial<OfficeSession>;
  if (!body.ok || !body.email || !body.roleName || body.id === undefined || body.roleId === undefined) return null;
  return {
    id: body.id,
    email: body.email,
    name: typeof body.name === "string" && body.name ? body.name : null,
    roleId: Number(body.roleId),
    roleName: String(body.roleName),
    isOwner: Boolean(body.isOwner),
    canReadRequests: Boolean(body.canReadRequests),
    canManageRoles: Boolean(body.canManageRoles),
    canEditContent: Boolean(body.canEditContent),
    canManageUsers: Boolean(body.canManageUsers),
    canDeleteTour: Boolean(body.canDeleteTour),
    canEditRates: Boolean(body.canEditRates),
    canUpdateRequestStatus: Boolean(body.canUpdateRequestStatus),
    canDeleteRequest: Boolean(body.canDeleteRequest),
    canRunBackup: Boolean(body.canRunBackup),
    newRequestCount: Number(body.newRequestCount) || 0,
  };
}

// T-63: the Roles page. Owner only, so any other reply is an empty page.
export type OfficeRoleRow = { id: number; name: string; isOwner: boolean; permissions: string[]; logins: number };
export type OfficePermission = { key: string; short: string; name: string; help: string };
export type OfficeRoles = { roles: OfficeRoleRow[]; permissions: OfficePermission[]; ownerOnly: string[] };

export async function getOfficeRoles(): Promise<OfficeRoles> {
  const response = await officeRequest("/api/office/roles");
  if (!response.ok) return { roles: [], permissions: [], ownerOnly: [] };
  const body = (await response.json()) as { ok: boolean } & Partial<OfficeRoles>;
  return { roles: body.roles ?? [], permissions: body.permissions ?? [], ownerOnly: body.ownerOnly ?? [] };
}

export type OfficeRequestRow = {
  id: number;
  kind: "contact" | "custom" | "booking";
  status: "new" | "in_progress" | "closed";
  name: string;
  phone: string;
  email: string;
  message: string;
  createdAt: string;
};

export async function getOfficeRequests(): Promise<OfficeRequestRow[]> {
  const response = await officeRequest("/api/office/requests");
  if (!response.ok) return [];
  const body = (await response.json()) as { ok: boolean; requests?: OfficeRequestRow[] };
  return body.requests ?? [];
}

export async function getOfficeUsers(): Promise<{ users: OfficeUserRow[]; roles: OfficeRoleChoice[] }> {
  const response = await officeRequest("/api/office/users");
  if (!response.ok) return { users: [], roles: [] };
  const body = (await response.json()) as { ok: boolean; users?: OfficeUserRow[]; roles?: OfficeRoleChoice[] };
  return { users: body.users ?? [], roles: body.roles ?? [] };
}

export type OfficeBackupRow = {
  name: string;
  size: number;
  uploadedAt: string;
};

export async function getOfficeBackups(): Promise<OfficeBackupRow[]> {
  const response = await officeRequest("/api/office/backup");
  if (!response.ok) return [];
  const body = (await response.json()) as { ok: boolean; backups?: OfficeBackupRow[] };
  return body.backups ?? [];
}

export type OfficeActivityRow = {
  id: number;
  at: string;
  userEmail: string;
  // T-62 (BR-119): the current name of the login with that email, or null.
  userName: string | null;
  area: "content" | "rates" | "requests" | "users" | "backups" | "roles";
  kind: string;
  recordId: string;
  text: string;
};

// The newest office saves the signed-in role may read, for the dashboard feed.
export async function getOfficeActivity(limit = 8): Promise<OfficeActivityRow[]> {
  const response = await officeRequest(`/api/office/activity?limit=${limit}`);
  if (!response.ok) return [];
  const body = (await response.json()) as { ok: boolean; rows?: OfficeActivityRow[] };
  return body.rows ?? [];
}

// "Saved by": the newest save of each record of one kind, keyed by the record. With no records
// named, every record of that kind.
export async function getSavedBy(kind: string, records: (string | number)[] = []): Promise<Record<string, OfficeActivityRow>> {
  const query = new URLSearchParams({ kind });
  for (const record of records) query.append("record", String(record));
  const response = await officeRequest(`/api/office/activity?${query}`);
  if (!response.ok) return {};
  const body = (await response.json()) as { ok: boolean; rows?: OfficeActivityRow[] };
  return Object.fromEntries((body.rows ?? []).map((row) => [row.recordId, row]));
}
