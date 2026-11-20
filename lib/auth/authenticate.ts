import { verifyPassword } from "@/lib/auth/password";
import { loadSessionUser } from "@/lib/auth/session-user";

// The login with that email and password, with its role and permissions (T-63), or null.
export async function authenticate(email: string, password: string) {
  const found = await loadSessionUser({ email: email.trim().toLowerCase() });
  if (!found) return null;
  const match = await verifyPassword(password, found.passwordHash);
  if (!match) return null;
  return found.user;
}
