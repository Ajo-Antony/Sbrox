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

  const guarded = ROLE_FOR_PREFIX.find((r) => path.startsWith(r.prefix));
  if (guarded) {
    if (!user) {
      const url = request.nextUrl.clone();
      url.pathname = "/login";
      return NextResponse.redirect(url);
    }
    // Super admins can see everything below them; admins can't reach
    // super-admin routes, designers can't reach admin routes, etc.
    const rank = ["user", "designer", "admin", "super_admin"];
    if (rank.indexOf(role ?? "user") < rank.indexOf(guarded.role)) {
      const url = request.nextUrl.clone();
      url.pathname = "/";
      return NextResponse.redirect(url);
    }
  }

  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|api).*)"]
};
