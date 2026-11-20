import { can, isOwner } from "@/lib/auth/permissions";
import { getCurrentUser, type SessionUser } from "@/lib/auth/session";

// What the office screens read about the signed-in person. T-63: the can… answers come from their
// role's permissions, read on each request, so a role change shows on their next page (BR-129).
export async function getSessionView() {
  const user = await getCurrentUser();
  return user ? sessionViewOf(user) : null;
}

export function sessionViewOf(user: SessionUser) {
  return {
    id: user.id,
    email: user.email,
    name: user.name ?? null,
    roleId: user.roleId,
    roleName: user.roleName,
    isOwner: isOwner(user),
    canReadRequests: can(user, "requests.read"),
    canEditContent: can(user, "content.edit"),
    canManageUsers: isOwner(user),
    canManageRoles: isOwner(user),
    canDeleteTour: can(user, "tours.delete"),
    canEditRates: can(user, "rates.edit"),
    canUpdateRequestStatus: can(user, "requests.status"),
    canDeleteRequest: isOwner(user),
    canRunBackup: isOwner(user),
  };
}
