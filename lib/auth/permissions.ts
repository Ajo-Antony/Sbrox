import type { Role } from "./types";
import { hasPermission, hasHigherOrEqualRole } from "./roles";
import type { Permission } from "./roles";

export function isAuthorized(role: Role | null, permission: Permission): boolean {
  if (!role) return false;
  return hasPermission(role, permission);
}

export function requiresRole(role: Role | null, requiredRole: Role): boolean {
  if (!role) return false;
  return hasHigherOrEqualRole(role, requiredRole);
}

export function canAccessRoute(role: Role | null, requiredRole: Role): boolean {
  if (!role) return false;
  return hasHigherOrEqualRole(role, requiredRole);
}

export class AuthorizationError extends Error {
  constructor(message: string = "Access denied") {
    super(message);
    this.name = "AuthorizationError";
  }
}

export function assertAuthorized(role: Role | null, permission: Permission): void {
  if (!isAuthorized(role, permission)) {
    throw new AuthorizationError(`Missing permission: ${permission}`);
  }
}

export function assertRole(role: Role | null, requiredRole: Role): void {
  if (!requiresRole(role, requiredRole)) {
    throw new AuthorizationError(`Required role: ${requiredRole}`);
  }
}
