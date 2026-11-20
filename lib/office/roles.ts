import { asc, count, eq, sql } from "drizzle-orm";
import { db } from "@/lib/db";
import { FOREIGN_KEY_VIOLATION, pgConstraintName, pgErrorCode, UNIQUE_VIOLATION } from "@/lib/db/pg-error";
import { rolePermissions, roles, users } from "@/lib/db/schema";
import { isOwner, isPermissionKey, OWNER_ONLY, PERMISSION_KEYS, PERMISSIONS, type PermissionKey } from "@/lib/auth/permissions";
import type { SessionUser } from "@/lib/auth/session";
import { forbidden, type ActionResult } from "@/lib/http/result";
import { recordActivity } from "@/lib/office/activity";

// T-63 (BR-123 to BR-127, design section 17): the Roles page and POST /api/office/roles.

export type RoleRow = { id: number; name: string; isOwner: boolean; permissions: PermissionKey[]; logins: number };

const NAME_MIN = 2;
const NAME_MAX = 40;
const OWNER_LOCKED = "The Owner role cannot be changed.";
const NAME_TAKEN = "A role with that name already exists.";
const NOT_FOUND = "That role was not found.";
const HAS_LOGINS = "Move these logins to another role first.";
// Only this index means the name is taken. Any other unique error is a save that ran into another.
const NAME_INDEX = "roles_name_lower_idx";
const SAVED_MEANWHILE = "Someone else just saved this role. Open it again.";

type Outcome = { ok: false; error: string } | { ok: true; changed: boolean };

function uniqueError(error: unknown) {
  return pgConstraintName(error) === NAME_INDEX ? NAME_TAKEN : SAVED_MEANWHILE;
}

// Every role, the Owner role first, each with its permissions and how many logins have it. The Owner
// role is listed with every permission, because it always has them (BR-125).
export async function listRolesAs(actor: SessionUser) {
  if (!isOwner(actor)) return forbidden("Only the Owner can see roles.");
  const [rows, grants, logins] = await Promise.all([
    db.select({ id: roles.id, name: roles.name, isOwner: roles.isOwner }).from(roles).orderBy(sql`${roles.isOwner} desc`, asc(roles.id)),
    db.select({ roleId: rolePermissions.roleId, permission: rolePermissions.permission }).from(rolePermissions),
    db.select({ roleId: users.roleId, value: count() }).from(users).groupBy(users.roleId),
  ]);
  const list: RoleRow[] = rows.map((role) => ({
    ...role,
    permissions: role.isOwner
      ? [...PERMISSION_KEYS]
      : PERMISSION_KEYS.filter((key) => grants.some((grant) => grant.roleId === role.id && grant.permission === key)),
    logins: logins.find((row) => row.roleId === role.id)?.value ?? 0,
  }));
  // The page shows the fixed lists from lib/auth/permissions.ts, which a screen does not import.
  return {
    ok: true as const,
    roles: list,
    permissions: PERMISSIONS.map(({ key, short, name, help }) => ({ key, short, name, help })),
    ownerOnly: [...OWNER_ONLY],
  };
}

function readName(value: FormDataEntryValue | null): { name: string } | { error: string } {
  const name = String(value ?? "").trim().replace(/\s+/g, " ");
  if (name.length < NAME_MIN || name.length > NAME_MAX) return { error: `Use a role name of ${NAME_MIN} to ${NAME_MAX} characters.` };
  return { name };
}

// Only keys from the fixed list. An Owner-only action is not a key, so it is refused here too.
function readPermissions(formData: FormData): { permissions: PermissionKey[] } | { error: string } {
  const values = formData.getAll("permission").map((value) => String(value));
  const unknown = values.find((value) => !isPermissionKey(value));
  if (unknown !== undefined) return { error: "That permission does not exist." };
  return { permissions: PERMISSION_KEYS.filter((key) => values.includes(key)) };
}

function readRoleId(value: FormDataEntryValue | null) {
  const text = String(value ?? "").trim();
  return /^\d{1,9}$/.test(text) ? Number(text) : null;
}

async function nameTaken(name: string, exceptId?: number) {
  const [row] = await db.select({ id: roles.id }).from(roles).where(eq(sql`lower(${roles.name})`, name.toLowerCase())).limit(1);
  return Boolean(row && row.id !== exceptId);
}

// The keys a save added and removed, for the activity row (BR-130).
function changeText(before: PermissionKey[], after: PermissionKey[]) {
  const added = after.filter((key) => !before.includes(key));
  const removed = before.filter((key) => !after.includes(key));
  const parts = [];
  if (added.length) parts.push(`added ${added.join(", ")}`);
  if (removed.length) parts.push(`removed ${removed.join(", ")}`);
  return parts.join("; ");
}

export async function saveRoleAs(actor: SessionUser, formData: FormData): Promise<ActionResult> {
  // First, before reading anything else in the form, so a non-Owner learns nothing (design section 17).
  if (!isOwner(actor)) return forbidden("Only the Owner can manage roles.");
  const action = String(formData.get("action") ?? "");
  if (action === "add") return addRole(actor, formData);
  if (action === "update") return updateRole(actor, formData);
  if (action === "delete") return deleteRole(actor, formData);
  return { ok: false, error: "Choose add, update, or delete." };
}

async function addRole(actor: SessionUser, formData: FormData): Promise<ActionResult> {
  const name = readName(formData.get("name"));
  if ("error" in name) return { ok: false, error: name.error };
  const picked = readPermissions(formData);
  if ("error" in picked) return { ok: false, error: picked.error };
  if (await nameTaken(name.name)) return { ok: false, error: NAME_TAKEN };
  try {
    await db.transaction(async (tx) => {
      const [created] = await tx.insert(roles).values({ name: name.name }).returning({ id: roles.id });
      if (!created) throw new Error("The role was not added.");
      if (picked.permissions.length) {
        await tx.insert(rolePermissions).values(picked.permissions.map((permission) => ({ roleId: created.id, permission })));
      }
      const keys = picked.permissions.length ? picked.permissions.join(", ") : "no permissions";
      await recordActivity(tx, actor, { kind: "role", recordId: created.id, text: `Added the role ${name.name} with ${keys}` });
    });
  } catch (error) {
    if (pgErrorCode(error) === UNIQUE_VIOLATION) return { ok: false, error: uniqueError(error) };
    throw error;
  }
  return { ok: true, message: `Role added: ${name.name}.` };
}

async function updateRole(actor: SessionUser, formData: FormData): Promise<ActionResult> {
  const id = readRoleId(formData.get("roleId"));
  if (id === null) return { ok: false, error: NOT_FOUND };
  const [role] = await db.select({ id: roles.id, isOwner: roles.isOwner }).from(roles).where(eq(roles.id, id)).limit(1);
  if (!role) return { ok: false, error: NOT_FOUND };
  if (role.isOwner) return { ok: false, error: OWNER_LOCKED };
  const name = readName(formData.get("name"));
  if ("error" in name) return { ok: false, error: name.error };
  const picked = readPermissions(formData);
  if ("error" in picked) return { ok: false, error: picked.error };
  if (await nameTaken(name.name, id)) return { ok: false, error: NAME_TAKEN };

  let outcome: Outcome;
  try {
    outcome = await db.transaction(async (tx): Promise<Outcome> => {
      // T-63 review: the role row is locked first, so a second save of this role waits for this one
      // and then reads what it saved. Its activity row then names the right keys added and removed.
      const [locked] = await tx.select({ id: roles.id, name: roles.name, isOwner: roles.isOwner }).from(roles).where(eq(roles.id, id)).for("update");
      if (!locked) return { ok: false, error: NOT_FOUND };
      if (locked.isOwner) return { ok: false, error: OWNER_LOCKED };
      const current = await tx.select({ permission: rolePermissions.permission }).from(rolePermissions).where(eq(rolePermissions.roleId, id));
      const before = PERMISSION_KEYS.filter((key) => current.some((row) => row.permission === key));
      const renamed = name.name !== locked.name;
      const keys = changeText(before, picked.permissions);
      if (!renamed && !keys) return { ok: true, changed: false };
      if (renamed) await tx.update(roles).set({ name: name.name }).where(eq(roles.id, id));
      if (keys) {
        await tx.delete(rolePermissions).where(eq(rolePermissions.roleId, id));
        if (picked.permissions.length) {
          await tx.insert(rolePermissions).values(picked.permissions.map((permission) => ({ roleId: id, permission })));
        }
      }
      const parts = [renamed ? `Renamed the role ${locked.name} to ${name.name}` : `Changed the role ${locked.name}`];
      if (keys) parts.push(keys);
      await recordActivity(tx, actor, { kind: "role", recordId: id, text: parts.join(": ") });
      return { ok: true, changed: true };
    });
  } catch (error) {
    if (pgErrorCode(error) === UNIQUE_VIOLATION) return { ok: false, error: uniqueError(error) };
    throw error;
  }
  if (!outcome.ok) return outcome;
  return { ok: true, message: outcome.changed ? `Role saved: ${name.name}.` : "Nothing changed." };
}

async function deleteRole(actor: SessionUser, formData: FormData): Promise<ActionResult> {
  const id = readRoleId(formData.get("roleId"));
  if (id === null) return { ok: false, error: NOT_FOUND };
  let deleted = "";
  try {
    const outcome = await db.transaction(async (tx): Promise<Outcome> => {
      // Locked like a save, so a delete and an edit of one role run one after the other.
      const [locked] = await tx.select({ id: roles.id, name: roles.name, isOwner: roles.isOwner }).from(roles).where(eq(roles.id, id)).for("update");
      if (!locked) return { ok: false, error: NOT_FOUND };
      if (locked.isOwner) return { ok: false, error: OWNER_LOCKED };
      const [logins] = await tx.select({ value: count() }).from(users).where(eq(users.roleId, id));
      if ((logins?.value ?? 0) > 0) return { ok: false, error: HAS_LOGINS };
      // The permissions go with it (on delete cascade). users.role_id has no cascade, so a login
      // given this role meanwhile stops the delete.
      await tx.delete(roles).where(eq(roles.id, id));
      await recordActivity(tx, actor, { kind: "role", recordId: id, text: `Deleted the role ${locked.name}` });
      deleted = locked.name;
      return { ok: true, changed: true };
    });
    if (!outcome.ok) return outcome;
  } catch (error) {
    if (pgErrorCode(error) === FOREIGN_KEY_VIOLATION) return { ok: false, error: HAS_LOGINS };
    throw error;
  }
  return { ok: true, message: `Role deleted: ${deleted}.` };
}
