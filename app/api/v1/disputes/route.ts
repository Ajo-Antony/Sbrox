import { NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { DisputeRepository, BookingRepository } from "@/lib/services/repositories";
import { validateDisputeCreation } from "@/lib/validators/reviewSchema";
import {
  authenticateRequest,
  checkRole,
  errorResponse,
  successResponse,
  logActivity,
  getPaginationParams
} from "@/lib/services/apiHelpers";

export async function GET(req: NextRequest) {
  try {
    const { user, error: authError } = await authenticateRequest(req);
    if (authError) return authError;

    // Only admins can list all disputes
    if (!checkRole(user!.role, ["admin", "super_admin"])) {
      return errorResponse("Only admins can view all disputes", 403);
    }

    const supabase = await createClient();
    const repo = new DisputeRepository(supabase);
    const { limit, offset } = getPaginationParams(req);

    // Get status filter
    const status = req.nextUrl.searchParams.get("status");

    const { data, error } = await repo.findAll(limit, offset);

    if (error) {
      return errorResponse("Failed to fetch disputes", 500);
    }

    let disputes = data || [];

    if (status) {
      disputes = disputes.filter((d: any) => d.status === status);
    }

    return successResponse({
      disputes: disputes.slice(0, limit),
      total: disputes.length,
      limit,
      offset
    });
  } catch (err: any) {
    return errorResponse(err.message || "Internal server error", 500);
  }
}

export async function POST(req: NextRequest) {
  try {
    const { user, error: authError } = await authenticateRequest(req);
    if (authError) return authError;

    const supabase = await createClient();
    const disputeRepo = new DisputeRepository(supabase);
    const bookingRepo = new BookingRepository(supabase);

    const body = await req.json();

    // Validate input
    const validation = validateDisputeCreation(body);
    if (!validation.valid) {
      return errorResponse(`Validation failed: ${validation.errors?.join(", ")}`, 400);
    }

    // Verify booking exists
    const { data: booking, error: bookingError } = await bookingRepo.findById(body.booking_id);
    if (bookingError || !booking) {
      return errorResponse("Booking not found", 404);
    }

    // Verify user is part of the booking
    if (booking.user_id !== user!.id && booking.designer_id !== user!.id) {
      return errorResponse("Unauthorized", 403);
    }

    // Booking should be completed or in progress
    if (!["completed", "in_progress", "accepted"].includes(booking.status)) {
      return errorResponse("Can only dispute active or completed bookings", 409);
    }

    // Check if dispute already exists for this booking
    const { data: existingDisputes } = await supabase
      .from("disputes")
      .select("id")
      .eq("booking_id", body.booking_id)
      .eq("status", "open");

    if (existingDisputes && existingDisputes.length > 0) {
      return errorResponse("An open dispute already exists for this booking", 409);
    }

    const { data, error } = await disputeRepo.create(user!.id, body);

    if (error) {
      return errorResponse("Failed to create dispute", 500);
    }

    await logActivity(user!.id, "CREATE_DISPUTE", "disputes", data.id, "success", {
      booking_id: body.booking_id,
      reason: body.reason
    });

    return successResponse({ dispute: data }, 201);
  } catch (err: any) {
    return errorResponse(err.message || "Internal server error", 500);
  }
}
