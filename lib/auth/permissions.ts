import { ROLES, type Role } from "@/lib/http/result";

export { ROLES, type Role };

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

export function canRunBackup(role: Role) {
  return role === "owner";
}
