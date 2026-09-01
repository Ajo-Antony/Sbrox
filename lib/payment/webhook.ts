import crypto from "crypto";
import { createServiceRoleClient } from "@/lib/supabase/server";
import { RazorpayWebhookEvent } from "@/lib/types";

export function verifyWebhookSignature(
  rawBody: string,
  signature: string,
  secret: string
): boolean {
  const expectedSignature = crypto
    .createHmac("sha256", secret)
    .update(rawBody)
    .digest("hex");
  return signature === expectedSignature;
}

export async function handlePaymentCaptured(
  event: RazorpayWebhookEvent
): Promise<{ success: boolean; message: string }> {
  try {
    const supabase = createServiceRoleClient();
    const paymentEntity = event.payload.payment?.entity;

    if (!paymentEntity) {
      return { success: false, message: "Invalid payment entity" };
    }

    const orderId = paymentEntity.order_id;
    const paymentId = paymentEntity.id;

    // Update payment status to completed
    const { data: payment, error: paymentError } = await supabase
      .from("payments")
      .update({
        status: "completed",
        razorpay_payment_id: paymentId
      })
      .eq("razorpay_order_id", orderId)
      .select()
      .single();

    if (paymentError) {
      console.error("Error updating payment:", paymentError);
      return { success: false, message: paymentError.message };
    }

    // Update booking status to confirmed
    if (payment?.booking_id) {
      const { error: bookingError } = await supabase
        .from("bookings")
        .update({ status: "confirmed" })
        .eq("id", payment.booking_id);

      if (bookingError) {
        console.error("Error updating booking:", bookingError);
      }

      // Calculate and update designer earnings
      await updateDesignerEarnings(payment);
    }

    return { success: true, message: "Payment captured successfully" };
  } catch (error) {
    console.error("Error handling payment.captured:", error);
    return { success: false, message: String(error) };
  }
}

export async function handlePaymentFailed(
  event: RazorpayWebhookEvent
): Promise<{ success: boolean; message: string }> {
  try {
    const supabase = createServiceRoleClient();
    const paymentEntity = event.payload.payment?.entity;

    if (!paymentEntity) {
      return { success: false, message: "Invalid payment entity" };
    }

    const orderId = paymentEntity.order_id;

    // Update payment status to failed
    const { error } = await supabase
      .from("payments")
      .update({ status: "failed" })
      .eq("razorpay_order_id", orderId);

    if (error) {
      console.error("Error updating payment:", error);
      return { success: false, message: error.message };
    }

    return { success: true, message: "Payment failed status updated" };
  } catch (error) {
    console.error("Error handling payment.failed:", error);
    return { success: false, message: String(error) };
  }
}

export async function handleRefundCreated(
  event: RazorpayWebhookEvent
): Promise<{ success: boolean; message: string }> {
  try {
    const supabase = createServiceRoleClient();
    const refundEntity = event.payload.refund?.entity;

    if (!refundEntity) {
      return { success: false, message: "Invalid refund entity" };
    }

    const paymentId = refundEntity.payment_id;
    const refundId = refundEntity.id;

    // Get payment record
    const { data: payment, error: fetchError } = await supabase
      .from("payments")
      .select()
      .eq("razorpay_payment_id", paymentId)
      .single();

    if (fetchError || !payment) {
      console.error("Error fetching payment:", fetchError);
      return { success: false, message: "Payment not found" };
    }

    // Update payment status to refunded
    const { error: updateError } = await supabase
      .from("payments")
      .update({
        status: "refunded",
        razorpay_refund_id: refundId
      })
      .eq("id", payment.id);

    if (updateError) {
      console.error("Error updating payment:", updateError);
      return { success: false, message: updateError.message };
    }

    // Revert designer earnings
    if (payment.designer_payout) {
      await revertDesignerEarnings(payment);
    }

    return { success: true, message: "Refund created successfully" };
  } catch (error) {
    console.error("Error handling refund.created:", error);
    return { success: false, message: String(error) };
  }
}

async function updateDesignerEarnings(payment: any): Promise<void> {
  const supabase = createServiceRoleClient();

  // Calculate commission (15% to platform, 85% to designer)
  const designerPayout = Math.round(payment.amount * 0.85 * 100) / 100;
  const platformCommission = payment.amount - designerPayout;

  // Update payment record with earnings
  await supabase
    .from("payments")
    .update({
      designer_payout: designerPayout,
      platform_commission: platformCommission
    })
    .eq("id", payment.id);

  // Update designer's total earnings
  const { data: booking } = await supabase
    .from("bookings")
    .select("designer_id")
    .eq("id", payment.booking_id)
    .single();

  if (booking) {
    const { data: designerStats } = await supabase
      .from("designer_earnings")
      .select("total_earned")
      .eq("designer_id", booking.designer_id)
      .single();

    if (designerStats) {
      await supabase
        .from("designer_earnings")
        .update({
          total_earned: (designerStats.total_earned || 0) + designerPayout
        })
        .eq("designer_id", booking.designer_id);
    } else {
      await supabase.from("designer_earnings").insert({
        designer_id: booking.designer_id,
        total_earned: designerPayout
      });
    }
  }
}

async function revertDesignerEarnings(payment: any): Promise<void> {
  const supabase = createServiceRoleClient();

  // Revert designer's total earnings
  const { data: booking } = await supabase
    .from("bookings")
    .select("designer_id")
    .eq("id", payment.booking_id)
    .single();

  if (booking && payment.designer_payout) {
    const { data: designerStats } = await supabase
      .from("designer_earnings")
      .select("total_earned")
      .eq("designer_id", booking.designer_id)
      .single();

    if (designerStats) {
      await supabase
        .from("designer_earnings")
        .update({
          total_earned: Math.max(
            0,
            (designerStats.total_earned || 0) - payment.designer_payout
          )
        })
        .eq("designer_id", booking.designer_id);
    }
  }
}
