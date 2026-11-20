import { eq } from "drizzle-orm";
import { db } from "../lib/db";
import { rolePermissions, roles, users } from "../lib/db/schema";
import { hashPassword } from "../lib/auth/password";
import { STARTING_ROLES } from "../lib/auth/permissions";

async function main() {
  const email = process.env.OWNER_EMAIL?.trim().toLowerCase();
  const password = process.env.OWNER_PASSWORD;
  if (!email || !password) {
    console.error("Set OWNER_EMAIL and OWNER_PASSWORD in .env. Do not commit the password.");
    process.exit(1);
  }
  // T-63: a database made with db:push has the roles table but no rows. It gets the starting roles,
  // Owner, Manager, and Editor, with the permissions in lib/auth/permissions.ts.
  if ((await db.select({ id: roles.id }).from(roles).limit(1)).length === 0) {
    for (const role of STARTING_ROLES) {
      const [row] = await db.insert(roles).values({ name: role.name, isOwner: role.isOwner }).returning({ id: roles.id });
      if (row && role.permissions.length) await db.insert(rolePermissions).values(role.permissions.map((permission) => ({ roleId: row.id, permission })));
    }
  }
  const [ownerRole] = await db.select({ id: roles.id }).from(roles).where(eq(roles.isOwner, true)).limit(1);
  if (!ownerRole) throw new Error("The Owner role is missing.");
  const existing = await db.select({ id: users.id }).from(users).where(eq(users.roleId, ownerRole.id)).limit(1);
  if (existing.length > 0) {
    console.log("An Owner login already exists. Nothing was changed.");
    process.exit(0);
  }
  await db.insert(users).values({
    email,
    passwordHash: await hashPassword(password),
    roleId: ownerRole.id,
  });
  console.log(`Owner login created for ${email}.`);
  process.exit(0);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
