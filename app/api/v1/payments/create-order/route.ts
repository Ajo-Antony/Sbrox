import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { initiatePayment } from "@/lib/services/payment.service";

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user }
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { bookingId } = await req.json();
    if (!bookingId) {
      return NextResponse.json({ error: "bookingId is required" }, { status: 400 });
    }

    // Verify booking belongs to user or designer
    const { data: booking, error: bookingError } = await supabase
      .from("bookings")
      .select("id, user_id, designer_id, total")
      .eq("id", bookingId)
      .single();

    if (bookingError || !booking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }

    if (booking.user_id !== user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Check if payment already exists
    const { data: existingPayment } = await supabase
      .from("payments")
      .select()
      .eq("booking_id", bookingId)
      .neq("status", "failed")
      .single();

    if (existingPayment && existingPayment.status !== "failed") {
      return NextResponse.json(
        { orderId: existingPayment.razorpay_order_id },
        { status: 200 }
      );
    }

    const result = await initiatePayment(bookingId, booking.total);

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error("Error creating payment order:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal server error" },
      { status: 500 }
    );
  }
}
