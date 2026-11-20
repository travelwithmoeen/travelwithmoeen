import { asc, count, eq, sql } from "drizzle-orm";
import { db } from "@/lib/db";
import { FOREIGN_KEY_VIOLATION, pgErrorCode } from "@/lib/db/pg-error";
import { roles, users } from "@/lib/db/schema";
import { hashPassword } from "@/lib/auth/password";
import { isOwner } from "@/lib/auth/permissions";
import type { SessionUser } from "@/lib/auth/session";
import { forbidden, type ActionResult } from "@/lib/http/result";
import { recordActivity } from "@/lib/office/activity";

export type { ActionResult };

export type RoleChoice = { id: number; name: string; isOwner: boolean };

// T-63 (BR-128): every role, the Owner role first, for the Users role picker.
// The role was deleted between the check and the save. The foreign key refuses the row.
const ROLE_GONE = "That role was just deleted. Choose another role.";

export async function roleChoices(): Promise<RoleChoice[]> {
  return db.select({ id: roles.id, name: roles.name, isOwner: roles.isOwner }).from(roles).orderBy(sql`${roles.isOwner} desc`, asc(roles.id));
}

// A role named by its id, or by its name without regard to case, such as "manager". A form sends
// the id. A name keeps older forms and checks working.
async function findRole(value: string): Promise<RoleChoice | null> {
  const text = value.trim();
  if (!text) return null;
  const [row] = /^\d+$/.test(text)
    ? await db.select({ id: roles.id, name: roles.name, isOwner: roles.isOwner }).from(roles).where(eq(roles.id, Number(text))).limit(1)
    : await db.select({ id: roles.id, name: roles.name, isOwner: roles.isOwner }).from(roles).where(eq(sql`lower(${roles.name})`, text.toLowerCase())).limit(1);
  return row ?? null;
}

async function ownerCount() {
  const [row] = await db.select({ value: count() }).from(users).innerJoin(roles, eq(roles.id, users.roleId)).where(eq(roles.isOwner, true));
  return row?.value ?? 0;
}

export async function listUsersAs(actor: SessionUser) {
  if (!isOwner(actor)) {
    return forbidden("Only the Owner can see logins.");
  }
  const rows = await db
    .select({ id: users.id, email: users.email, name: users.name, roleId: users.roleId, roleName: roles.name, isOwner: roles.isOwner })
    .from(users)
    .innerJoin(roles, eq(roles.id, users.roleId))
    .orderBy(asc(users.email));
  return { ok: true as const, users: rows, roles: await roleChoices() };
}

export async function createUserAs(
  actor: SessionUser,
  input: { email: string; password: string; role: string },
): Promise<ActionResult> {
  if (!isOwner(actor)) {
    return forbidden("Only the Owner can create a login.");
  }
  const email = input.email.trim().toLowerCase();
  if (!email.includes("@")) {
    return { ok: false, error: "Enter an email address." };
  }
  if (input.password.length < 8) {
    return { ok: false, error: "Use a password of at least 8 characters." };
  }
  const role = await findRole(input.role);
  if (!role) {
    return { ok: false, error: "Choose a role." };
  }
  const existing = await db.select({ id: users.id }).from(users).where(eq(users.email, email)).limit(1);
  if (existing.length > 0) {
    return { ok: false, error: "That email already has a login." };
  }
  const passwordHash = await hashPassword(input.password);
  try {
    await db.transaction(async (tx) => {
      const [created] = await tx.insert(users).values({ email, passwordHash, roleId: role.id }).returning({ id: users.id });
      // The login's email and role only. Never the password.
      await recordActivity(tx, actor, { kind: "user", recordId: created?.id, text: `Created a login for ${email} as ${role.name}` });
    });
  } catch (error) {
    if (pgErrorCode(error) === FOREIGN_KEY_VIOLATION) return { ok: false, error: ROLE_GONE };
    throw error;
  }
  return { ok: true, message: "Login created." };
}

export async function removeUserAs(actor: SessionUser, userId: number | null): Promise<ActionResult> {
  if (!isOwner(actor)) {
    return forbidden("Only the Owner can remove a login.");
  }
  if (userId === null) return { ok: false, error: "That login was not found." };
  if (actor.id === userId) {
    return { ok: false, error: "You cannot remove your own login." };
  }
  const [target] = await db
    .select({ id: users.id, email: users.email, isOwner: roles.isOwner })
    .from(users)
    .innerJoin(roles, eq(roles.id, users.roleId))
    .where(eq(users.id, userId))
    .limit(1);
  if (!target) {
    return { ok: false, error: "That login was not found." };
  }
  if (target.isOwner && (await ownerCount()) <= 1) {
    return { ok: false, error: "The last Owner login cannot be removed." };
  }
  await db.transaction(async (tx) => {
    await tx.delete(users).where(eq(users.id, userId));
    await recordActivity(tx, actor, { kind: "user", recordId: userId, text: `Removed the login ${target.email}` });
  });
  return { ok: true, message: "Login removed." };
}

// BR-128: any role that exists. The last Owner still cannot move to another role.
export async function changeRoleAs(actor: SessionUser, userId: number | null, roleValue: string): Promise<ActionResult> {
  if (!isOwner(actor)) {
    return forbidden("Only the Owner can change a role.");
  }
  if (userId === null) return { ok: false, error: "That login was not found." };
  const role = await findRole(roleValue);
  if (!role) {
    return { ok: false, error: "Choose a role." };
  }
  const [target] = await db
    .select({ id: users.id, email: users.email, isOwner: roles.isOwner })
    .from(users)
    .innerJoin(roles, eq(roles.id, users.roleId))
    .where(eq(users.id, userId))
    .limit(1);
  if (!target) {
    return { ok: false, error: "That login was not found." };
  }
  if (target.isOwner && !role.isOwner && (await ownerCount()) <= 1) {
    return { ok: false, error: "The last Owner cannot change to another role." };
  }
  try {
    await db.transaction(async (tx) => {
      await tx.update(users).set({ roleId: role.id }).where(eq(users.id, userId));
      await recordActivity(tx, actor, { kind: "user", recordId: userId, text: `Changed ${target.email} to ${role.name}` });
    });
  } catch (error) {
    if (pgErrorCode(error) === FOREIGN_KEY_VIOLATION) return { ok: false, error: ROLE_GONE };
    throw error;
  }
  return { ok: true, message: "Role updated." };
}
