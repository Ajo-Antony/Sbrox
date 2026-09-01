import { NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { DisputeRepository } from "@/lib/services/repositories";
import {
  authenticateRequest,
  checkRole,
  errorResponse,
  successResponse,
  logActivity
} from "@/lib/services/apiHelpers";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const { user, error: authError } = await authenticateRequest(req);
    if (authError) return authError;

    const supabase = await createClient();
    const repo = new DisputeRepository(supabase);

    const { data: dispute, error } = await repo.findById(id);

    if (error || !dispute) {
      return errorResponse("Dispute not found", 404);
    }

    // Only admin or involved parties can view
    if (
      !checkRole(user!.role, ["admin", "super_admin"]) &&
      dispute.user_id !== user!.id &&
      dispute.booking?.user_id !== user!.id &&
      dispute.booking?.designer_id !== user!.id
    ) {
      return errorResponse("Unauthorized", 403);
    }

    return successResponse({ dispute });
  } catch (err: any) {
    return errorResponse(err.message || "Internal server error", 500);
  }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const { user, error: authError } = await authenticateRequest(req);
    if (authError) return authError;

    // Only admins can resolve disputes
    if (!checkRole(user!.role, ["admin", "super_admin"])) {
      return errorResponse("Only admins can resolve disputes", 403);
    }

    const supabase = await createClient();
    const repo = new DisputeRepository(supabase);

    const body = await req.json();

    if (!body.status || !["resolved", "dismissed", "escalated"].includes(body.status)) {
      return errorResponse("Valid status (resolved, dismissed, escalated) is required", 400);
    }

    if (!body.resolution || typeof body.resolution !== "string" || body.resolution.trim().length === 0) {
      return errorResponse("Resolution description is required", 400);
    }

    const { data, error } = await repo.updateStatus(id, body.status, body.resolution);

    if (error) {
      return errorResponse("Failed to resolve dispute", 500);
    }

    await logActivity(user!.id, "RESOLVE_DISPUTE", "disputes", id, "success", {
      status: body.status,
      resolution: body.resolution
    });

    return successResponse({ dispute: data });
  } catch (err: any) {
    return errorResponse(err.message || "Internal server error", 500);
  }
}
