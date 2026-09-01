import { NextRequest, NextResponse } from "next/server";
import {
  handlePaymentCaptured,
  handlePaymentFailed,
  handleRefundCreated,
  verifyWebhookSignature
} from "@/lib/payment/webhook";
import { RazorpayWebhookEvent } from "@/lib/types";

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.text();
    const signature = req.headers.get("x-razorpay-signature");
    const secret = process.env.RAZORPAY_WEBHOOK_SECRET!;

    if (!signature || !secret) {
      return NextResponse.json(
        { error: "Missing signature or secret" },
        { status: 400 }
      );
    }

    // Verify webhook signature
    const isValid = verifyWebhookSignature(rawBody, signature, secret);
    if (!isValid) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }

    const event: RazorpayWebhookEvent = JSON.parse(rawBody);

    let result;
    switch (event.event) {
      case "payment.authorized":
      case "payment.captured":
        result = await handlePaymentCaptured(event);
        break;

      case "payment.failed":
        result = await handlePaymentFailed(event);
        break;

      case "refund.created":
        result = await handleRefundCreated(event);
        break;

      default:
        console.log(`Unhandled webhook event: ${event.event}`);
        return NextResponse.json({ received: true, handled: false });
    }

    if (!result.success) {
      console.error(`Error handling ${event.event}:`, result.message);
    }

    return NextResponse.json({ received: true, ...result });
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal server error" },
      { status: 500 }
    );
  }
}
