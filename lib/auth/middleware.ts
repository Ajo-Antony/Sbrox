import { NextResponse, type NextRequest } from "next/server";
import type { Role } from "./types";
import { getAllowedRoutesByRole, getDefaultRouteByRole } from "./roles";

const publicRoutes = ["/", "/login", "/signup", "/forgot-password", "/api/auth"];
const protectedRoutes = {
  "/super-admin": "superadmin",
  "/admin": "admin",
  "/designer": "designer",
  "/user": "user"
};

export function isPublicRoute(pathname: string): boolean {
  return publicRoutes.some((route) => {
    if (route === "/api/auth") {
      return pathname.startsWith(route);
    }
    return pathname === route || pathname.startsWith(route + "/");
  });
}

export function getRequiredRoleForRoute(pathname: string): Role | null {
  for (const [route, role] of Object.entries(protectedRoutes)) {
    if (pathname.startsWith(route)) {
      return role as Role;
    }
  }
  return null;
}

export function canAccessRoute(userRole: Role | null, pathname: string): boolean {
  if (!userRole) return isPublicRoute(pathname);

  const allowedRoutes = getAllowedRoutesByRole[userRole];
  return allowedRoutes.some((route) => pathname === route || pathname.startsWith(route + "/"));
}

export function getRedirectUrlForRole(role: Role): string {
  return getDefaultRouteByRole(role);
}

export function createRedirectResponse(url: string): NextResponse {
  return NextResponse.redirect(new URL(url, process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"));
}
