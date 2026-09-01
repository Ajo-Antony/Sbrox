import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { completePayment } from "@/lib/services/payment.service";
import { verifySignature } from "@/lib/payment/razorpay";

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user }
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { bookingId, razorpayOrderId, razorpayPaymentId, razorpaySignature } =
      await req.json();

    if (!bookingId || !razorpayOrderId || !razorpayPaymentId || !razorpaySignature) {
      return NextResponse.json(
        {
          error:
            "bookingId, razorpayOrderId, razorpayPaymentId, and razorpaySignature are required"
        },
        { status: 400 }
      );
    }

    // Verify the signature
    const isValidSignature = verifySignature(
      razorpayOrderId,
      razorpayPaymentId,
      razorpaySignature
    );

    if (!isValidSignature) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }

    // Verify booking belongs to user
    const { data: booking, error: bookingError } = await supabase
      .from("bookings")
      .select("id, user_id")
      .eq("id", bookingId)
      .single();

    if (bookingError || !booking || booking.user_id !== user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Complete payment
    const result = await completePayment(
      bookingId,
      razorpayPaymentId,
      razorpayOrderId,
      razorpaySignature
    );

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error("Error verifying payment:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal server error" },
      { status: 500 }
    );
  }
}
