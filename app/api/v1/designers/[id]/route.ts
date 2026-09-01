import { NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { DesignerRepository } from "@/lib/services/repositories";
import { validateDesignerUpdate } from "@/lib/validators/designerSchema";
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
    const repo = new DesignerRepository(supabase);

    const { data: designer, error } = await repo.findById(id);

    if (error || !designer) {
      return errorResponse("Designer not found", 404);
    }

    // Fetch portfolio items
    const { data: portfolio } = await supabase
      .from("portfolio_items")
      .select("*")
      .eq("designer_id", id);

    // Fetch reviews
    const { data: reviews } = await supabase
      .from("reviews")
      .select(`
        *,
        user:user_id(id, full_name, avatar_url)
      `)
      .eq("designer_id", id)
      .order("created_at", { ascending: false })
      .limit(10);

    // Get rating
    const { data: ratingData } = await repo.getRating(id);

    return successResponse({
      designer: {
        ...designer,
        portfolio_items: portfolio || [],
        reviews: reviews || [],
        rating: ratingData
      }
    });
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
    const repo = new DesignerRepository(supabase);

    // Verify designer belongs to user
    const { data: designer, error: fetchError } = await repo.findById(id);
    if (fetchError || !designer || designer.profile_id !== user!.id) {
      return errorResponse("Unauthorized", 403);
    }

    const body = await req.json();

    // Validate input
    const validation = validateDesignerUpdate(body);
    if (!validation.valid) {
      return errorResponse(`Validation failed: ${validation.errors?.join(", ")}`, 400);
    }

    const { data, error } = await repo.update(id, body);

    if (error) {
      return errorResponse("Failed to update designer", 500);
    }

    await logActivity(user!.id, "UPDATE_DESIGNER", "designers", id, "success");

    return successResponse({ designer: data });
  } catch (err: any) {
    return errorResponse(err.message || "Internal server error", 500);
  }
}
