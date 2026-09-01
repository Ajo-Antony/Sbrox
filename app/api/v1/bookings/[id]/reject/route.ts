import { NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { BookingRepository } from "@/lib/services/repositories";
import {
  authenticateRequest,
  errorResponse,
  successResponse,
  logActivity
} from "@/lib/services/apiHelpers";

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const { user, error: authError } = await authenticateRequest(req);
    if (authError) return authError;

    const supabase = await createClient();
    const repo = new BookingRepository(supabase);

    // Get booking
    const { data: booking, error: fetchError } = await repo.findById(id);
    if (fetchError || !booking) {
      return errorResponse("Booking not found", 404);
    }

    // Only designer can reject
    if (booking.designer_id !== user!.id) {
      return errorResponse("Only the assigned designer can reject this booking", 403);
    }

    // Check current status
    if (booking.status !== "pending") {
      return errorResponse(`Cannot reject booking with status: ${booking.status}`, 409);
    }

    const body = await req.json();
    const rejectionReason = body.reason || "Designer declined";

    const { data, error } = await repo.updateStatus(id, "rejected");

    if (error) {
      return errorResponse("Failed to reject booking", 500);
    }

    // Log rejection reason
    await supabase.from("booking_rejections").insert({
      booking_id: id,
      designer_id: user!.id,
      reason: rejectionReason,
      created_at: new Date().toISOString()
    });

    await logActivity(user!.id, "REJECT_BOOKING", "bookings", id, "success", {
      reason: rejectionReason
    });

    return successResponse({ booking: data, message: "Booking rejected successfully" });
  } catch (err: any) {
    return errorResponse(err.message || "Internal server error", 500);
  }
}
