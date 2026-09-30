import { asc, count, eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { hashPassword } from "@/lib/auth/password";
import { canManageUsers, isRole, type Role } from "@/lib/auth/permissions";
import type { SessionUser } from "@/lib/auth/session";
import type { ActionResult } from "@/lib/http/result";

export type { ActionResult };

export async function listUsersAs(actor: SessionUser) {
  if (!canManageUsers(actor.role)) {
    return { ok: false as const, error: "Only the Owner can see logins." };
  }
  const rows = await db
    .select({ id: users.id, email: users.email, role: users.role })
    .from(users)
    .orderBy(asc(users.email));
  return { ok: true as const, users: rows };
}

export async function createUserAs(
  actor: SessionUser,
  input: { email: string; password: string; role: string },
): Promise<ActionResult> {
  if (!canManageUsers(actor.role)) {
    return { ok: false, error: "Only the Owner can create a login." };
  }
  const email = input.email.trim().toLowerCase();
  if (!email.includes("@")) {
    return { ok: false, error: "Enter an email address." };
  }
  if (input.password.length < 8) {
    return { ok: false, error: "Use a password of at least 8 characters." };
  }
  if (!isRole(input.role)) {
    return { ok: false, error: "Choose Owner, Manager, or Editor." };
  }
  const existing = await db.select({ id: users.id }).from(users).where(eq(users.email, email)).limit(1);
  if (existing.length > 0) {
    return { ok: false, error: "That email already has a login." };
  }
  await db.insert(users).values({
    email,
    passwordHash: await hashPassword(input.password),
    role: input.role,
  });
  return { ok: true, message: "Login created." };
}

export async function removeUserAs(actor: SessionUser, userId: number): Promise<ActionResult> {
  if (!canManageUsers(actor.role)) {
    return { ok: false, error: "Only the Owner can remove a login." };
  }
  if (actor.id === userId) {
    return { ok: false, error: "You cannot remove your own login." };
  }
  const [target] = await db.select().from(users).where(eq(users.id, userId)).limit(1);
  if (!target) {
    return { ok: false, error: "That login was not found." };
  }
  if (target.role === "owner") {
    const [owners] = await db.select({ value: count() }).from(users).where(eq(users.role, "owner"));
    if ((owners?.value ?? 0) <= 1) {
      return { ok: false, error: "The last Owner login cannot be removed." };
    }
  }
  await db.delete(users).where(eq(users.id, userId));
  return { ok: true, message: "Login removed." };
}

export async function changeRoleAs(actor: SessionUser, userId: number, role: string): Promise<ActionResult> {
  if (!canManageUsers(actor.role)) {
    return { ok: false, error: "Only the Owner can change a role." };
  }
  if (!isRole(role)) {
    return { ok: false, error: "Choose Owner, Manager, or Editor." };
  }
  const [target] = await db.select().from(users).where(eq(users.id, userId)).limit(1);
  if (!target) {
    return { ok: false, error: "That login was not found." };
  }
  if (target.role === "owner" && role !== "owner") {
    const [owners] = await db.select({ value: count() }).from(users).where(eq(users.role, "owner"));
    if ((owners?.value ?? 0) <= 1) {
      return { ok: false, error: "The last Owner cannot change to another role." };
    }
  }
  await db.update(users).set({ role: role as Role }).where(eq(users.id, userId));
  return { ok: true, message: "Role updated." };
}
