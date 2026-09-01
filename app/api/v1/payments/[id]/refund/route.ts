import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { handleRefund } from "@/lib/services/payment.service";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createClient();
    const {
      data: { user }
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const paymentId = id;
    const { amount } = await req.json();

    // Get payment with booking info
    const { data: payment, error: paymentError } = await supabase
      .from("payments")
      .select("*, bookings(user_id, designer_id, status)")
      .eq("id", paymentId)
      .single();

    if (paymentError || !payment) {
      return NextResponse.json({ error: "Payment not found" }, { status: 404 });
    }

    // Verify user is either the buyer or admin
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    if (
      payment.bookings?.user_id !== user.id &&
      profile?.role !== "admin" &&
      profile?.role !== "super_admin"
    ) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Check if booking is in refundable status
    if (payment.status === "refunded") {
      return NextResponse.json(
        { error: "Payment already refunded" },
        { status: 400 }
      );
    }

    if (payment.status !== "completed") {
      return NextResponse.json(
        { error: "Only completed payments can be refunded" },
        { status: 400 }
      );
    }

    // Process refund
    const result = await handleRefund(paymentId, amount);

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error("Error refunding payment:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal server error" },
      { status: 500 }
    );
  }
}
