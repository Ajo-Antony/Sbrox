import { createServerClient } from "@supabase/ssr";
import { createClient as createRawClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import type { Database } from "../types";

const DEFAULT_SUPABASE_URL = "https://wfiqxdpbcflpezaengld.supabase.co";
const DEFAULT_SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndmaXF4ZHBiY2ZscGV6YWVuZ2xkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQ5MTUxNjAsImV4cCI6MjEwMDQ5MTE2MH0.mAUSL93MvDgsrcCVf_ytzeaKJBQlDbWI_bsNVNpx8Ww";
const DEFAULT_SUPABASE_SERVICE_ROLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndmaXF4ZHBiY2ZscGV6YWVuZ2xkIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4NDkxNTE2MCwiZXhwIjoyMTAwNDkxMTYwfQ.RvVlTa0SvEQLWQ7P8ez-50sQVMNh8JxwfNn3N7GKsvg";

export async function createClient() {
  const cookieStore = await cookies();
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || DEFAULT_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || DEFAULT_SUPABASE_ANON_KEY;

  return createServerClient<Database>(
    url,
    anonKey,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // Called from a Server Component with no write access — safe to ignore
            // when middleware is refreshing the session.
          }
        }
      }
    }
  );
}

// Elevated client for trusted server-only operations (admin approvals, payouts).
// Never import this into client components.
export function createServiceRoleClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || DEFAULT_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || DEFAULT_SUPABASE_SERVICE_ROLE_KEY;
  return createRawClient<Database>(
    url,
    serviceKey,
    { auth: { persistSession: false } }
  );
}
