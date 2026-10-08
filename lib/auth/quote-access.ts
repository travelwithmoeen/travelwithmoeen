import { canEditRates } from "@/lib/auth/permissions";
import { getCurrentUser } from "@/lib/auth/session";

export async function getQuoteAccess() {
  const user = await getCurrentUser();
  return {
    signedIn: Boolean(user),
    rateEditor: Boolean(user && canEditRates(user.role)),
  };
}
