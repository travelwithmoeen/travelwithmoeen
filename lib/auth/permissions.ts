export const ROLES = ["owner", "manager", "editor"] as const;
export type Role = (typeof ROLES)[number];

export function isRole(value: string): value is Role {
  return ROLES.includes(value as Role);
}

export function canEditContent(role: Role) {
  return role === "owner" || role === "editor";
}

export function canEditRates(role: Role) {
  return role === "owner" || role === "manager";
}

export function canManageUsers(role: Role) {
  return role === "owner";
}

export function canDeleteTour(role: Role) {
  return role === "owner";
}

export function canUpdateRequestStatus(role: Role) {
  return role === "owner" || role === "manager";
}

export function canDeleteRequest(role: Role) {
  return role === "owner";
}
