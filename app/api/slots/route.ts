import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(req: NextRequest) {
  const designerId = req.nextUrl.searchParams.get("designerId");
  if (!designerId) {
    return NextResponse.json({ error: "designerId is required" }, { status: 400 });
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("slots")
    .select("*")
    .eq("designer_id", designerId)
    .is("locked_by_booking_id", null)
    .order("starts_at", { ascending: true })
    .limit(3);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ slots: data });
}
