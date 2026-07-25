import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import type { Database } from "../types";

const DEFAULT_SUPABASE_URL = "https://wfiqxdpbcflpezaengld.supabase.co";
const DEFAULT_SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndmaXF4ZHBiY2ZscGV6YWVuZ2xkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQ5MTUxNjAsImV4cCI6MjEwMDQ5MTE2MH0.mAUSL93MvDgsrcCVf_ytzeaKJBQlDbWI_bsNVNpx8Ww";

export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({ request });

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || DEFAULT_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || DEFAULT_SUPABASE_ANON_KEY;

  try {
    const supabase = createServerClient<Database>(
      url,
      anonKey,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll();
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
            response = NextResponse.next({ request });
            cookiesToSet.forEach(({ name, value, options }) =>
              response.cookies.set(name, value, options)
            );
          }
        }
      }
    );

    const {
      data: { user }
    } = await supabase.auth.getUser();

    let profile: { role: string } | null = null;
    if (user) {
      const { data } = await supabase.from("profiles").select("role").eq("id", user.id).single();
      profile = data;
    }

    return { response, user, role: profile?.role ?? null };
  } catch (e) {
    return { response, user: null, role: null };
  }
}
