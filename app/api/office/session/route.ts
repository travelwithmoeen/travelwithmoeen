import { getCurrentUser } from "@/lib/auth/session";
import {
  canDeleteRequest,
  canDeleteTour,
  canEditContent,
  canEditRates,
  canManageUsers,
  canRunBackup,
  canUpdateRequestStatus,
} from "@/lib/auth/permissions";

export async function GET() {
  const user = await getCurrentUser();
  if (!user) return Response.json({ ok: false }, { status: 401 });
  return Response.json({
    ok: true,
    id: user.id,
    email: user.email,
    role: user.role,
    canEditContent: canEditContent(user.role),
    canManageUsers: canManageUsers(user.role),
    canDeleteTour: canDeleteTour(user.role),
    canEditRates: canEditRates(user.role),
    canUpdateRequestStatus: canUpdateRequestStatus(user.role),
    canDeleteRequest: canDeleteRequest(user.role),
    canRunBackup: canRunBackup(user.role),
  });
}
