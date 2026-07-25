import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

const HOME_BY_ROLE: Record<string, string> = {
  user: "/user/browse",
  designer: "/designer/dashboard",
  admin: "/admin/dashboard",
  super_admin: "/super-admin/dashboard"
};

export default async function RootPage() {
  const supabase = await createClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) redirect("/user/browse"); // guests land on the public Browse screen

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  redirect(HOME_BY_ROLE[profile?.role ?? "user"] ?? "/user/browse");
}
