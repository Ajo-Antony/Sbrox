import { createBrowserClient } from "@supabase/ssr";
import type { Database } from "../types";

const DEFAULT_SUPABASE_URL = "https://wfiqxdpbcflpezaengld.supabase.co";
const DEFAULT_SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndmaXF4ZHBiY2ZscGV6YWVuZ2xkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQ5MTUxNjAsImV4cCI6MjEwMDQ5MTE2MH0.mAUSL93MvDgsrcCVf_ytzeaKJBQlDbWI_bsNVNpx8Ww";

export function createClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || DEFAULT_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || DEFAULT_SUPABASE_ANON_KEY;
  return createBrowserClient<Database>(url, anonKey);
}
