import { createServiceRoleClient } from "@/lib/supabase/server";
import { createOrder, refundPayment } from "@/lib/payment/razorpay";
import { Payment } from "@/lib/types";

const DESIGNER_PAYOUT_PERCENTAGE = 0.85;
const PLATFORM_COMMISSION_PERCENTAGE = 0.15;

export async function initiatePayment(bookingId: string, amount: number) {
  const supabase = createServiceRoleClient();

  // Get booking details
  const { data: booking, error: bookingError } = await supabase
    .from("bookings")
    .select("*, designer:designers(profile_id), user_id")
    .eq("id", bookingId)
    .single();

  if (bookingError || !booking) {
    throw new Error(`Booking not found: ${bookingError?.message}`);
  }

  // Create Razorpay order
  const order = await createOrder({
    amount,
    receipt: `booking_${bookingId}`,
    notes: {
      booking_id: bookingId,
      user_id: booking.user_id,
      designer_id: booking.designer_id
    }
  });

  // Record payment in database
  const { data: payment, error: paymentError } = await supabase
    .from("payments")
    .insert({
      booking_id: bookingId,
      razorpay_order_id: order.id,
      amount: amount,
      status: "pending"
    })
    .select()
    .single();

  if (paymentError) {
    throw new Error(`Failed to record payment: ${paymentError.message}`);
  }

  return {
    orderId: order.id,
    paymentId: payment.id,
    amount: Number(order.amount) / 100,
    currency: order.currency
  };
}

export async function completePayment(
  bookingId: string,
  razorpayPaymentId: string,
  razorpayOrderId: string,
  razorpaySignature: string
) {
  const supabase = createServiceRoleClient();

  // Get payment record
  const { data: payment, error: paymentError } = await supabase
    .from("payments")
    .select()
    .eq("razorpay_order_id", razorpayOrderId)
    .single();

  if (paymentError || !payment) {
    throw new Error(`Payment record not found: ${paymentError?.message}`);
  }

  // Update payment to completed
  const { error: updateError } = await supabase
    .from("payments")
    .update({
      status: "completed",
      razorpay_payment_id: razorpayPaymentId
    })
    .eq("id", payment.id);

  if (updateError) {
    throw new Error(`Failed to update payment: ${updateError.message}`);
  }

  // Update booking to confirmed
  const { error: bookingError } = await supabase
    .from("bookings")
    .update({ status: "confirmed" })
    .eq("id", bookingId);

  if (bookingError) {
    console.error("Error updating booking:", bookingError);
  }

  // Calculate and record designer earnings
  await recordDesignerEarnings(payment);

  return { success: true, paymentId: payment.id };
}

export async function recordPayment(
  bookingId: string,
  amount: number,
  razorpayOrderId: string
) {
  const supabase = createServiceRoleClient();

  const { data, error } = await supabase
    .from("payments")
    .insert({
      booking_id: bookingId,
      razorpay_order_id: razorpayOrderId,
      amount: amount,
      status: "pending"
    })
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to record payment: ${error.message}`);
  }

  return data;
}

export async function handleRefund(paymentId: string, amount?: number) {
  const supabase = createServiceRoleClient();

  // Get payment record
  const { data: payment, error: fetchError } = await supabase
    .from("payments")
    .select()
    .eq("id", paymentId)
    .single();

  if (fetchError || !payment) {
    throw new Error(`Payment not found: ${fetchError?.message}`);
  }

  if (payment.razorpay_payment_id) {
    // Process refund with Razorpay
    const refundAmount = amount || payment.amount;
    await refundPayment({
      paymentId: payment.razorpay_payment_id,
      amount: refundAmount,
      notes: {
        refund_reason: "User requested refund"
      }
    });
  }

  // Update payment status
  const { error: updateError } = await supabase
    .from("payments")
    .update({
      status: "refunded"
    })
    .eq("id", paymentId);

  if (updateError) {
    throw new Error(`Failed to update payment: ${updateError.message}`);
  }

  // Revert designer earnings if fully refunded
  if (!amount || amount === payment.amount) {
    await revertDesignerEarnings(payment);
  }

  return { success: true };
}

export async function calculateCommission(amount: number): Promise<{
  designerPayout: number;
  platformCommission: number;
}> {
  return {
    designerPayout: Math.round(amount * DESIGNER_PAYOUT_PERCENTAGE * 100) / 100,
    platformCommission:
      Math.round(amount * PLATFORM_COMMISSION_PERCENTAGE * 100) / 100
  };
}

async function recordDesignerEarnings(payment: any): Promise<void> {
  const supabase = createServiceRoleClient();

  // Calculate commission
  const { designerPayout, platformCommission } = await calculateCommission(
    payment.amount
  );

  // Update payment record with earnings
  await supabase
    .from("payments")
    .update({
      designer_payout: designerPayout,
      platform_commission: platformCommission
    })
    .eq("id", payment.id);

  // Get booking to find designer
  const { data: booking } = await supabase
    .from("bookings")
    .select("designer_id")
    .eq("id", payment.booking_id)
    .single();

  if (booking) {
    // Update or create designer earnings record
    const { data: existingEarnings } = await supabase
      .from("designer_earnings")
      .select()
      .eq("designer_id", booking.designer_id)
      .single();

    if (existingEarnings) {
      await supabase
        .from("designer_earnings")
        .update({
          total_earned: (existingEarnings.total_earned || 0) + designerPayout,
          updated_at: new Date().toISOString()
        })
        .eq("designer_id", booking.designer_id);
    } else {
      await supabase.from("designer_earnings").insert({
        designer_id: booking.designer_id,
        total_earned: designerPayout,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      });
    }
  }
}

async function revertDesignerEarnings(payment: any): Promise<void> {
  const supabase = createServiceRoleClient();

  if (!payment.designer_payout) return;

  // Get booking to find designer
  const { data: booking } = await supabase
    .from("bookings")
    .select("designer_id")
    .eq("id", payment.booking_id)
    .single();

  if (booking) {
    // Update designer earnings
    const { data: existingEarnings } = await supabase
      .from("designer_earnings")
      .select()
      .eq("designer_id", booking.designer_id)
      .single();

    if (existingEarnings) {
      await supabase
        .from("designer_earnings")
        .update({
          total_earned: Math.max(
            0,
            (existingEarnings.total_earned || 0) - payment.designer_payout
          ),
          updated_at: new Date().toISOString()
        })
        .eq("designer_id", booking.designer_id);
    }
  }
}

export async function getDesignerEarnings(designerId: string) {
  const supabase = createServiceRoleClient();

  const { data, error } = await supabase
    .from("designer_earnings")
    .select()
    .eq("designer_id", designerId)
    .single();

  if (error && error.code !== "PGRST116") {
    console.error("Error fetching designer earnings:", error);
    return null;
  }

  return data || { designer_id: designerId, total_earned: 0 };
}

export async function updateDesignerEarnings(
  designerId: string,
  amountToAdd: number
) {
  const supabase = createServiceRoleClient();

  const existing = await getDesignerEarnings(designerId);

  if (existing && existing.id) {
    await supabase
      .from("designer_earnings")
      .update({
        total_earned: (existing.total_earned || 0) + amountToAdd,
        updated_at: new Date().toISOString()
      })
      .eq("id", existing.id);
  } else {
    await supabase.from("designer_earnings").insert({
      designer_id: designerId,
      total_earned: amountToAdd,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    });
  }
}
