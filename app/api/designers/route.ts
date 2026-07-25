import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(req: NextRequest) {
  const category = req.nextUrl.searchParams.get("category");
  const supabase = await createClient();

  let query = supabase.from("designers").select("*, profiles(full_name)").eq("status", "approved");
  if (category && category !== "All") query = query.contains("categories", [category]);

  const { data, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ designers: data });
}
