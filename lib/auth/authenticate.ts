import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { verifyPassword } from "@/lib/auth/password";
import type { Role } from "@/lib/auth/permissions";

export async function authenticate(email: string, password: string) {
  const normalized = email.trim().toLowerCase();
  const [user] = await db.select().from(users).where(eq(users.email, normalized)).limit(1);
  if (!user) return null;
  const match = await verifyPassword(password, user.passwordHash);
  if (!match) return null;
  return { id: user.id, email: user.email, role: user.role as Role };
}
