import { NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { AvailabilityRepository, DesignerRepository } from "@/lib/services/repositories";
import { validateAvailability } from "@/lib/validators/designerSchema";
import {
  authenticateRequest,
  errorResponse,
  successResponse,
  logActivity
} from "@/lib/services/apiHelpers";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const supabase = await createClient();
    const repo = new AvailabilityRepository(supabase);

    const { data, error } = await repo.getSchedule(id);

    if (error) {
      return errorResponse("Failed to fetch availability", 500);
    }

    return successResponse({ availability: data || [] });
  } catch (err: any) {
    return errorResponse(err.message || "Internal server error", 500);
  }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const { user, error: authError } = await authenticateRequest(req);
    if (authError) return authError;

    const supabase = await createClient();
    const designerRepo = new DesignerRepository(supabase);
    const availabilityRepo = new AvailabilityRepository(supabase);

    // Verify designer belongs to user
    const { data: designer, error: fetchError } = await designerRepo.findById(id);
    if (fetchError || !designer || designer.profile_id !== user!.id) {
      return errorResponse("Unauthorized", 403);
    }

    const body = await req.json();

    if (!Array.isArray(body.schedules) || body.schedules.length === 0) {
      return errorResponse("Schedules array is required and must not be empty", 400);
    }

    // Validate each schedule
    for (const schedule of body.schedules) {
      const validation = validateAvailability(schedule);
      if (!validation.valid) {
        return errorResponse(`Validation failed: ${validation.errors?.join(", ")}`, 400);
      }
    }

    const { data, error } = await availabilityRepo.setSchedule(id, body.schedules);

    if (error) {
      return errorResponse("Failed to set availability", 500);
    }

    await logActivity(user!.id, "SET_AVAILABILITY", "designer_availability", id, "success");

    return successResponse({ availability: data || [] });
  } catch (err: any) {
    return errorResponse(err.message || "Internal server error", 500);
  }
}
