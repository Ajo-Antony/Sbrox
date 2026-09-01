import { NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { BookingRepository } from "@/lib/services/repositories";
import { validateBookingStatusUpdate } from "@/lib/validators/bookingSchema";
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

    // Verify permissions
    const isDesigner = booking.designer_id === user!.id;
    const isUser = booking.user_id === user!.id;
    const isAdmin = user!.role === "admin";

    if (!isDesigner && !isUser && !isAdmin) {
      return errorResponse("Unauthorized", 403);
    }

    const body = await req.json();

    // Validate status
    const validation = validateBookingStatusUpdate(body);
    if (!validation.valid) {
      return errorResponse(`Validation failed: ${validation.errors?.join(", ")}`, 400);
    }

    // Check status transition rules
    const validTransitions: Record<string, string[]> = {
      pending: ["accepted", "rejected", "cancelled"],
      accepted: ["in_progress", "completed", "cancelled"],
      in_progress: ["completed", "cancelled"],
      rejected: [],
      completed: ["disputed"],
      cancelled: []
    };

    const currentStatus = booking.status;
    if (!validTransitions[currentStatus]?.includes(body.status)) {
      return errorResponse(`Cannot transition from ${currentStatus} to ${body.status}`, 400);
    }

    // Only designer can accept/reject
    if (["accepted", "rejected"].includes(body.status) && !isDesigner) {
      return errorResponse("Only designer can accept or reject bookings", 403);
    }

    const { data, error } = await repo.updateStatus(id, body.status);

    if (error) {
      return errorResponse("Failed to update booking status", 500);
    }

    await logActivity(user!.id, "UPDATE_BOOKING_STATUS", "bookings", id, "success", {
      new_status: body.status
    });

    return successResponse({ booking: data });
  } catch (err: any) {
    return errorResponse(err.message || "Internal server error", 500);
  }
}
