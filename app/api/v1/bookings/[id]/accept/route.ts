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

    // Only designer can accept
    if (booking.designer_id !== user!.id) {
      return errorResponse("Only the assigned designer can accept this booking", 403);
    }

    // Check current status
    if (booking.status !== "pending") {
      return errorResponse(`Cannot accept booking with status: ${booking.status}`, 409);
    }

    const { data, error } = await repo.updateStatus(id, "accepted");

    if (error) {
      return errorResponse("Failed to accept booking", 500);
    }

    await logActivity(user!.id, "ACCEPT_BOOKING", "bookings", id, "success");

    return successResponse({ booking: data });
  } catch (err: any) {
    return errorResponse(err.message || "Internal server error", 500);
  }
}
