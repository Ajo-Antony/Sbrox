import Razorpay from "razorpay";
import crypto from "crypto";

let razorpayClient: Razorpay | null = null;

export function getRazorpayClient() {
  if (!razorpayClient) {
    if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
      throw new Error(
        "RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET environment variables are required"
      );
    }
    razorpayClient = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET
    });
  }
  return razorpayClient;
}

export interface CreateOrderOptions {
  amount: number;
  currency?: string;
  receipt: string;
  notes?: Record<string, any>;
}

export async function createOrder(options: CreateOrderOptions) {
  try {
    const client = getRazorpayClient();
    const order = await client.orders.create({
      amount: Math.round(options.amount * 100),
      currency: options.currency || "INR",
      receipt: options.receipt,
      notes: options.notes || {}
    });
    return order;
  } catch (error) {
    console.error("Error creating Razorpay order:", error);
    throw error;
  }
}

export function verifySignature(
  orderId: string,
  paymentId: string,
  signature: string
): boolean {
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET!;
  const body = `${orderId}|${paymentId}`;
  const expectedSignature = crypto
    .createHmac("sha256", secret)
    .update(body)
    .digest("hex");
  return signature === expectedSignature;
}

export function verifyWebhookSignature(rawBody: string, signature: string): boolean {
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET!;
  const expectedSignature = crypto
    .createHmac("sha256", secret)
    .update(rawBody)
    .digest("hex");
  return signature === expectedSignature;
}

export interface RefundOptions {
  paymentId: string;
  amount?: number;
  notes?: Record<string, any>;
}

export async function refundPayment(options: RefundOptions) {
  try {
    const client = getRazorpayClient();
    const refund = await client.payments.refund(options.paymentId, {
      amount: options.amount ? Math.round(options.amount * 100) : undefined,
      notes: options.notes || {}
    });
    return refund;
  } catch (error) {
    console.error("Error refunding payment:", error);
    throw error;
  }
}

export async function getPaymentStatus(paymentId: string) {
  try {
    const client = getRazorpayClient();
    const payment = await client.payments.fetch(paymentId);
    return payment;
  } catch (error) {
    console.error("Error fetching payment status:", error);
    throw error;
  }
}

export async function getOrderStatus(orderId: string) {
  try {
    const client = getRazorpayClient();
    const order = await client.orders.fetch(orderId);
    return order;
  } catch (error) {
    console.error("Error fetching order status:", error);
    throw error;
  }
}
