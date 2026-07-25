import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

const HOME_BY_ROLE: Record<string, string> = {
  user: "/user/browse",
  designer: "/designer/dashboard",
  admin: "/admin/dashboard",
  super_admin: "/super-admin/dashboard"
};

export default async function RootPage() {
  let targetPath = "/user/browse";
  try {
    const supabase = await createClient();
    const {
      data: { user }
    } = await supabase.auth.getUser();

    if (user) {
      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();

      targetPath = HOME_BY_ROLE[profile?.role ?? "user"] ?? "/user/browse";
    }
  } catch {
    targetPath = "/user/browse";
  }

  redirect(targetPath);
}
