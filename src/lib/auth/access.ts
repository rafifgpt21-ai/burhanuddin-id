export const adminRoles = ["SUPER_ADMIN", "ADMIN", "EDITOR"] as const;

export type AdminRoleName = (typeof adminRoles)[number];

export function isAdminRole(value: string): value is AdminRoleName {
  return adminRoles.includes(value as AdminRoleName);
}

export function canAccessAdmin(role: string) {
  return isAdminRole(role);
}

export function canManageUsers(role: string) {
  return role === "SUPER_ADMIN";
}

export function canPermanentlyDelete(role: string) {
  return role === "SUPER_ADMIN" || role === "ADMIN";
}
