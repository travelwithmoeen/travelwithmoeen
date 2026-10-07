import { eq } from "drizzle-orm";
import { db } from "../lib/db";
import { users } from "../lib/db/schema";
import { hashPassword } from "../lib/auth/password";

async function main() {
  const email = process.env.OWNER_EMAIL?.trim().toLowerCase();
  const password = process.env.OWNER_PASSWORD;
  if (!email || !password) {
    console.error("Set OWNER_EMAIL and OWNER_PASSWORD in .env. Do not commit the password.");
    process.exit(1);
  }
  const existing = await db.select({ id: users.id }).from(users).where(eq(users.role, "owner")).limit(1);
  if (existing.length > 0) {
    console.log("An Owner login already exists. Nothing was changed.");
    process.exit(0);
  }
  await db.insert(users).values({
    email,
    passwordHash: await hashPassword(password),
    role: "owner",
  });
  console.log(`Owner login created for ${email}.`);
  process.exit(0);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
