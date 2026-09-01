import { NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { BookingRepository } from "@/lib/services/repositories";
import {
  authenticateRequest,
  errorResponse,
  successResponse
} from "@/lib/services/apiHelpers";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const { user, error: authError } = await authenticateRequest(req);
    if (authError) return authError;

    const supabase = await createClient();
    const repo = new BookingRepository(supabase);

    const { data: booking, error } = await repo.findById(id);

    if (error || !booking) {
      return errorResponse("Booking not found", 404);
    }

    // Verify user is part of booking (buyer or designer)
    if (booking.user_id !== user!.id && booking.designer_id !== user!.id && user!.role !== "admin") {
      return errorResponse("Unauthorized", 403);
    }

    // Get reviews for this booking if completed
    const { data: review } = await supabase
      .from("reviews")
      .select("*")
      .eq("booking_id", id)
      .single();

    return successResponse({
      booking: {
        ...booking,
        review: review || null
      }
    });
  } catch (err: any) {
    return errorResponse(err.message || "Internal server error", 500);
  }
}
