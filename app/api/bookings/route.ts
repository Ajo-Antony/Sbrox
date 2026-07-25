import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Sign in required" }, { status: 401 });

  const { designerId, slotId, category, tip = 0, paymentMethod } = await req.json();
  if (!designerId || !slotId || !category) {
    return NextResponse.json({ error: "designerId, slotId, category are required" }, { status: 400 });
  }

  // book_slot() is a Postgres function (see supabase/schema.sql) that locks the
  // slot row, inserts the booking, and rolls back if the slot was already
  // taken — this is what prevents the double-booking race Realtime alone
  // can't guarantee.
  const { data, error } = await supabase.rpc("book_slot", {
    p_user_id: user.id,
    p_designer_id: designerId,
    p_slot_id: slotId,
    p_category: category,
    p_tip: tip,
    p_payment_method: paymentMethod ?? null
  });

  if (error) return NextResponse.json({ error: error.message }, { status: 409 });
  return NextResponse.json({ bookingId: data });
}
