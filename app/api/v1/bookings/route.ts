import { NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { BookingRepository, DesignerRepository } from "@/lib/services/repositories";
import { validateBookingCreation } from "@/lib/validators/bookingSchema";
import {
  authenticateRequest,
  errorResponse,
  successResponse,
  logActivity,
  getPaginationParams
} from "@/lib/services/apiHelpers";
import { calculateTotalPrice, checkAvailability } from "@/lib/utils/booking";

export async function GET(req: NextRequest) {
  try {
    const { user, error: authError } = await authenticateRequest(req);
    if (authError) return authError;

    const supabase = await createClient();
    const repo = new BookingRepository(supabase);
    const { limit, offset } = getPaginationParams(req);

    const { data, error } = await repo.findByUserId(user!.id, limit, offset);

    if (error) {
      return errorResponse("Failed to fetch bookings", 500);
    }

    return successResponse({
      bookings: data || [],
      total: data?.length || 0,
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
    const bookingRepo = new BookingRepository(supabase);
    const designerRepo = new DesignerRepository(supabase);

    const body = await req.json();

    // Validate input
    const validation = validateBookingCreation(body);
    if (!validation.valid) {
      return errorResponse(`Validation failed: ${validation.errors?.join(", ")}`, 400);
    }

    // Get designer
    const { data: designer, error: designerError } = await designerRepo.findById(body.designer_id);
    if (designerError || !designer) {
      return errorResponse("Designer not found", 404);
    }

    // Check availability
    const { data: schedules } = await supabase
      .from("designer_availability")
      .select("*")
      .eq("designer_id", body.designer_id);

    if (schedules && schedules.length > 0) {
      const availability = checkAvailability(schedules, new Date(body.start_date), body.duration_minutes || 60);
      if (!availability.available) {
        return errorResponse(availability.reason || "Designer not available", 409);
      }
    }

    // Calculate total price
    let totalPrice = 0;
    try {
      totalPrice = calculateTotalPrice(
        body.pricing_model,
        {
          rate_hourly: designer.rate_hourly,
          rate_project: designer.rate_project,
          rate_subscription: designer.rate_subscription
        },
        body.duration_minutes,
        body.tip || 0
      );
    } catch (err: any) {
      return errorResponse(err.message, 400);
    }

    // Create booking
    const bookingData = {
      ...body,
      total_price: totalPrice
    };

    const { data, error } = await bookingRepo.create(user!.id, bookingData);

    if (error) {
      return errorResponse("Failed to create booking", 500);
    }

    await logActivity(user!.id, "CREATE_BOOKING", "bookings", data.id, "success", {
      designer_id: body.designer_id,
      total_price: totalPrice
    });

    return successResponse({ booking: data }, 201);
  } catch (err: any) {
    return errorResponse(err.message || "Internal server error", 500);
  }
}
