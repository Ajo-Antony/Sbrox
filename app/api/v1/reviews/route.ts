import { NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { ReviewRepository, BookingRepository } from "@/lib/services/repositories";
import { validateReviewCreation } from "@/lib/validators/reviewSchema";
import {
  authenticateRequest,
  errorResponse,
  successResponse,
  logActivity,
  getPaginationParams
} from "@/lib/services/apiHelpers";

export async function GET(req: NextRequest) {
  try {
    const supabase = await createClient();
    const designerId = req.nextUrl.searchParams.get("designer_id");
    const { limit, offset } = getPaginationParams(req);

    if (!designerId) {
      return errorResponse("designer_id query parameter is required", 400);
    }

    const repo = new ReviewRepository(supabase);
    const { data, error } = await repo.findByDesignerId(designerId, limit, offset);

    if (error) {
      return errorResponse("Failed to fetch reviews", 500);
    }

    // Calculate average rating
    const reviews = data || [];
    const avgRating = reviews.length > 0 ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length : 0;

    return successResponse({
      reviews,
      average_rating: avgRating,
      total: reviews.length,
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
    const reviewRepo = new ReviewRepository(supabase);
    const bookingRepo = new BookingRepository(supabase);

    const body = await req.json();

    // Validate input
    const validation = validateReviewCreation(body);
    if (!validation.valid) {
      return errorResponse(`Validation failed: ${validation.errors?.join(", ")}`, 400);
    }

    // Verify booking exists and is completed
    const { data: booking, error: bookingError } = await bookingRepo.findById(body.booking_id);
    if (bookingError || !booking) {
      return errorResponse("Booking not found", 404);
    }

    if (booking.status !== "completed") {
      return errorResponse("Can only review completed bookings", 409);
    }

    // Verify user is the one who booked
    if (booking.user_id !== user!.id) {
      return errorResponse("Only the booking user can leave a review", 403);
    }

    // Check if review already exists
    const { data: existingReview } = await reviewRepo.findByBookingId(body.booking_id);
    if (existingReview) {
      return errorResponse("A review already exists for this booking", 409);
    }

    const reviewData = {
      ...body,
      designer_id: booking.designer_id
    };

    const { data, error } = await reviewRepo.create(user!.id, reviewData);

    if (error) {
      return errorResponse("Failed to create review", 500);
    }

    await logActivity(user!.id, "CREATE_REVIEW", "reviews", data.id, "success", {
      designer_id: booking.designer_id,
      rating: body.rating
    });

    return successResponse({ review: data }, 201);
  } catch (err: any) {
    return errorResponse(err.message || "Internal server error", 500);
  }
}
