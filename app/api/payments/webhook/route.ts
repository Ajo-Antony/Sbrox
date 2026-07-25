import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { createServiceRoleClient } from "@/lib/supabase/server";

// Razorpay signs the raw webhook body with your webhook secret (HMAC SHA256).
// Configure this URL + the same secret in the Razorpay dashboard.
export async function POST(req: NextRequest) {
  const rawBody = await req.text();
  const signature = req.headers.get("x-razorpay-signature");
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET!;

  const expected = crypto.createHmac("sha256", secret).update(rawBody).digest("hex");
  if (signature !== expected) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  const event = JSON.parse(rawBody);
  const supabase = createServiceRoleClient();

  if (event.event === "payment.captured") {
    const orderId = event.payload.payment.entity.order_id;
    const paymentId = event.payload.payment.entity.id;

    await supabase
      .from("payments")
      .update({ status: "paid", razorpay_payment_id: paymentId })
      .eq("razorpay_order_id", orderId);

    const { data: payment } = await supabase
      .from("payments")
      .select("booking_id")
      .eq("razorpay_order_id", orderId)
      .single();

    if (payment) {
      await supabase.from("bookings").update({ status: "confirmed" }).eq("id", payment.booking_id);
    }
  }

  if (event.event === "payment.failed") {
    const orderId = event.payload.payment.entity.order_id;
    await supabase.from("payments").update({ status: "failed" }).eq("razorpay_order_id", orderId);
  }

  return NextResponse.json({ received: true });
}
