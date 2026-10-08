import {
  canDeleteRequest,
  canDeleteTour,
  canEditContent,
  canEditRates,
  canManageUsers,
  canRunBackup,
  canUpdateRequestStatus,
} from "@/lib/auth/permissions";
import { getCurrentUser } from "@/lib/auth/session";

export async function getSessionView() {
  const user = await getCurrentUser();
  if (!user) return null;
  return {
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
  };
}
