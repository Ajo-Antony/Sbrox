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

    // Only designer or user can mark as complete, admin can override
    const isDesigner = booking.designer_id === user!.id;
    const isUser = booking.user_id === user!.id;
    const isAdmin = user!.role === "admin";

    if (!isDesigner && !isUser && !isAdmin) {
      return errorResponse("Unauthorized", 403);
    }

    // Check current status
    if (booking.status !== "accepted" && booking.status !== "in_progress") {
      return errorResponse(`Cannot complete booking with status: ${booking.status}`, 409);
    }

    const body = await req.json();
    const completionNotes = body.notes || "";

    const { data, error } = await repo.updateStatus(id, "completed");

    if (error) {
      return errorResponse("Failed to complete booking", 500);
    }

    // Store completion notes if provided
    if (completionNotes) {
      await supabase.from("booking_completion_notes").insert({
        booking_id: id,
        completed_by: user!.id,
        notes: completionNotes,
        created_at: new Date().toISOString()
      });
    }

    await logActivity(user!.id, "COMPLETE_BOOKING", "bookings", id, "success", {
      notes: completionNotes
    });

    return successResponse({ booking: data, message: "Booking marked as completed" });
  } catch (err: any) {
    return errorResponse(err.message || "Internal server error", 500);
  }
}
