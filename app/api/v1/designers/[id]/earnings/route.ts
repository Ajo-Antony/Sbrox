import { NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { DesignerRepository } from "@/lib/services/repositories";
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
    const repo = new DesignerRepository(supabase);

    // Verify designer belongs to user
    const { data: designer } = await supabase
      .from("designers")
      .select("profile_id")
      .eq("id", id)
      .single();

    if (!designer || (designer.profile_id !== user!.id && user!.role !== "admin")) {
      return errorResponse("Unauthorized", 403);
    }

    // Get date range filters
    const startDate = req.nextUrl.searchParams.get("startDate");
    const endDate = req.nextUrl.searchParams.get("endDate");

    const { data: earnings, error } = await repo.getEarnings(id, startDate || undefined, endDate || undefined);

    if (error) {
      return errorResponse("Failed to fetch earnings", 500);
    }

    // Get monthly breakdown
    const { data: monthlyData } = await supabase
      .from("bookings")
      .select("total_price, created_at")
      .eq("designer_id", id)
      .eq("status", "completed");

    const monthlyBreakdown: Record<string, number> = {};
    (monthlyData || []).forEach((booking: any) => {
      const date = new Date(booking.created_at);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
      monthlyBreakdown[monthKey] = (monthlyBreakdown[monthKey] || 0) + booking.total_price;
    });

    return successResponse({
      earnings: earnings,
      monthly_breakdown: monthlyBreakdown
    });
  } catch (err: any) {
    return errorResponse(err.message || "Internal server error", 500);
  }
}
