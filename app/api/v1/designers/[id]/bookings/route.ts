import { NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { DesignerRepository } from "@/lib/services/repositories";
import {
  authenticateRequest,
  errorResponse,
  successResponse,
  getPaginationParams
} from "@/lib/services/apiHelpers";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const { user, error: authError } = await authenticateRequest(req);
    if (authError) return authError;

    const supabase = await createClient();
    const repo = new DesignerRepository(supabase);
    const { limit, offset } = getPaginationParams(req);

    // Verify designer belongs to user (or user is admin)
    const { data: designer } = await supabase.from("designers").select("profile_id").eq("id", id).single();

    if (!designer || (designer.profile_id !== user!.id && user!.role !== "admin")) {
      return errorResponse("Unauthorized", 403);
    }

    // Get status filter
    const status = req.nextUrl.searchParams.get("status");

    const { data, error } = await repo.getBookings(id, limit, offset);

    if (error) {
      return errorResponse("Failed to fetch bookings", 500);
    }

    let bookings = data || [];

    // Filter by status if provided
    if (status) {
      bookings = bookings.filter((b: any) => b.status === status);
    }

    return successResponse({
      bookings: bookings.slice(0, limit),
      total: bookings.length,
      limit,
      offset
    });
  } catch (err: any) {
    return errorResponse(err.message || "Internal server error", 500);
  }
}
