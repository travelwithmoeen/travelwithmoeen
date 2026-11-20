import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { rolePermissions, roles, users } from "@/lib/db/schema";
import { isPermissionKey, type PermissionKey } from "@/lib/auth/permissions";

// T-63 (BR-129): a signed-in person with their role and its permissions, read from the database on
// each request, so a change to a role applies on that person's next page or save. Not cached.
export type SessionUser = {
  id: number;
  email: string;
  // T-62 (BR-119): the person's own name. Null or missing means no name, and the email shows.
  name?: string | null;
  roleId: number;
  roleName: string;
  isOwner: boolean;
  permissions: PermissionKey[];
};

// The login with that id or email, with its role and the role's permissions, or null.
export async function loadSessionUser(where: { id: number } | { email: string }) {
  const [row] = await db
    .select({ id: users.id, email: users.email, name: users.name, passwordHash: users.passwordHash, roleId: roles.id, roleName: roles.name, isOwner: roles.isOwner })
    .from(users)
    .innerJoin(roles, eq(roles.id, users.roleId))
    .where("id" in where ? eq(users.id, where.id) : eq(users.email, where.email))
    .limit(1);
  if (!row) return null;
  const granted = row.isOwner ? [] : await db.select({ permission: rolePermissions.permission }).from(rolePermissions).where(eq(rolePermissions.roleId, row.roleId));
  const user: SessionUser = {
    id: row.id,
    email: row.email,
    name: row.name ?? null,
    roleId: row.roleId,
    roleName: row.roleName,
    isOwner: row.isOwner,
    permissions: granted.map((item) => item.permission).filter(isPermissionKey),
  };
  return { user, passwordHash: row.passwordHash };
}
