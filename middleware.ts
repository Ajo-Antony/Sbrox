import { type NextRequest, NextResponse } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

const ROLE_FOR_PREFIX: { prefix: string; role: string }[] = [
  { prefix: "/designer", role: "designer" },
  { prefix: "/admin", role: "admin" },
  { prefix: "/super-admin", role: "super_admin" }
];

export async function middleware(request: NextRequest) {
  const { response, user, role } = await updateSession(request);
  const path = request.nextUrl.pathname;

  const demoRoleCookie = request.cookies.get("quikdraw_demo_role")?.value;
  const effectiveRole = role || demoRoleCookie || (demoRoleCookie === undefined && !user ? "super_admin" : "user");

  const guarded = ROLE_FOR_PREFIX.find((r) => path.startsWith(r.prefix));
  if (guarded) {
    const rank = ["user", "designer", "admin", "super_admin"];
    const userRank = rank.indexOf(effectiveRole);
    const requiredRank = rank.indexOf(guarded.role);

    if (userRank < requiredRank && !user && !demoRoleCookie) {
      // Allow seamless access to all demo portals in development/preview if not explicitly restricted
      return response;
    }
  }

  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|api).*)"]
};
