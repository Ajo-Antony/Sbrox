import type { Role } from "./types";

export type { Role } from "./types";

export type Permission =
  | "view:dashboard"
  | "manage:users"
  | "manage:designers"
  | "manage:bookings"
  | "manage:payments"
  | "manage:disputes"
  | "manage:categories"
  | "manage:admins"
  | "manage:platform"
  | "view:bookings"
  | "create:booking"
  | "manage:profile"
  | "manage:portfolio"
  | "manage:availability"
  | "view:analytics"
  | "approve:designers"
  | "view:earnings";

export const rolePermissions: Record<Role, Permission[]> = {
  superadmin: [
    // All permissions
    "view:dashboard",
    "manage:users",
    "manage:designers",
    "manage:bookings",
    "manage:payments",
    "manage:disputes",
    "manage:categories",
    "manage:admins",
    "manage:platform",
    "view:bookings",
    "create:booking",
    "manage:profile",
    "manage:portfolio",
    "manage:availability",
    "view:analytics",
    "approve:designers",
    "view:earnings"
  ],
  admin: [
    // Moderate permissions
    "view:dashboard",
    "manage:users",
    "manage:designers",
    "manage:bookings",
    "manage:payments",
    "manage:disputes",
    "manage:categories",
    "view:bookings",
    "view:analytics",
    "approve:designers"
  ],
  designer: [
    // Designer-specific permissions
    "view:dashboard",
    "manage:profile",
    "manage:portfolio",
    "manage:availability",
    "view:bookings",
    "view:earnings"
  ],
  user: [
    // Limited user permissions
    "view:dashboard",
    "create:booking",
    "view:bookings",
    "manage:profile"
  ]
};

export function hasPermission(role: Role, permission: Permission): boolean {
  return rolePermissions[role]?.includes(permission) ?? false;
}

export function hasAnyPermission(role: Role, permissions: Permission[]): boolean {
  return permissions.some((p) => hasPermission(role, p));
}

export function hasAllPermissions(role: Role, permissions: Permission[]): boolean {
  return permissions.every((p) => hasPermission(role, p));
}

export const roleHierarchy: Record<Role, number> = {
  user: 0,
  designer: 1,
  admin: 2,
  superadmin: 3
};

export function hasHigherOrEqualRole(role: Role, requiredRole: Role): boolean {
  return roleHierarchy[role] >= roleHierarchy[requiredRole];
}

export const getAllowedRoutesByRole: Record<Role, string[]> = {
  superadmin: ["/super-admin", "/admin", "/designer", "/user", "/"],
  admin: ["/admin", "/designer", "/user", "/"],
  designer: ["/designer", "/user", "/"],
  user: ["/user", "/"]
};

export function getDefaultRouteByRole(role: Role): string {
  const roleRoutes: Record<Role, string> = {
    superadmin: "/super-admin/dashboard",
    admin: "/admin/dashboard",
    designer: "/designer/dashboard",
    user: "/"
  };
  return roleRoutes[role];
}

export function isProtectedRoute(role: Role | null, pathname: string): boolean {
  if (!role) return false;

  const allowedRoutes = getAllowedRoutesByRole[role];
  return allowedRoutes.some((route) => pathname.startsWith(route));
}
