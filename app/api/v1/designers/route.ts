import { NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { DesignerRepository } from "@/lib/services/repositories";
import {
  authenticateRequest,
  checkRole,
  errorResponse,
  successResponse,
  logActivity,
  getPaginationParams
} from "@/lib/services/apiHelpers";
import { validateDesignerRegistration } from "@/lib/validators/designerSchema";

export async function GET(req: NextRequest) {
  try {
    const supabase = await createClient();
    const repo = new DesignerRepository(supabase);
    const { limit, offset } = getPaginationParams(req);

    // Get query filters
    const skill = req.nextUrl.searchParams.get("skill");
    const minPrice = req.nextUrl.searchParams.get("minPrice");
    const maxPrice = req.nextUrl.searchParams.get("maxPrice");

    const filters: any = {};
    if (skill) filters.skill = skill;
    if (minPrice) filters.minPrice = parseFloat(minPrice);
    if (maxPrice) filters.maxPrice = parseFloat(maxPrice);

    const { data, error } = await repo.findAll(filters);

    if (error) {
      return errorResponse("Failed to fetch designers", 500);
    }

    // Apply price range filtering if needed
    let designers = data || [];
    if (minPrice || maxPrice) {
      designers = designers.filter((d: any) => {
        const rate = d.rate_hourly || 0;
        if (minPrice && rate < parseFloat(minPrice)) return false;
        if (maxPrice && rate > parseFloat(maxPrice)) return false;
        return true;
      });
    }

    return successResponse({
      designers: designers.slice(offset, offset + limit),
      total: designers.length,
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

    if (!checkRole(user!.role, ["user"])) {
      return errorResponse("Only regular users can become designers", 403);
    }

    const supabase = await createClient();
    const repo = new DesignerRepository(supabase);

    // Check if already a designer
    const { data: existingDesigner } = await supabase
      .from("designers")
      .select("id")
      .eq("profile_id", user!.id)
      .single();

    if (existingDesigner) {
      return errorResponse("You are already registered as a designer", 409);
    }

    const body = await req.json();

    // Validate input
    const validation = validateDesignerRegistration(body);
    if (!validation.valid) {
      return errorResponse(`Validation failed: ${validation.errors?.join(", ")}`, 400);
    }

    const { data, error } = await repo.create(user!.id, body);

    if (error) {
      return errorResponse("Failed to register designer", 500);
    }

    // Add portfolio items if provided
    if (body.portfolio_items && body.portfolio_items.length > 0) {
      await supabase.from("portfolio_items").insert(
        body.portfolio_items.map((item: any) => ({
          designer_id: data.id,
          ...item
        }))
      );
    }

    await logActivity(user!.id, "REGISTER_DESIGNER", "designers", data.id, "success");

    return successResponse({ designer: data }, 201);
  } catch (err: any) {
    return errorResponse(err.message || "Internal server error", 500);
  }
}
