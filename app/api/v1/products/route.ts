import { NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { ProductRepository } from "@/lib/services/repositories";
import { validateProductCreation } from "@/lib/validators/productSchema";
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
    const repo = new ProductRepository(supabase);
    const { limit, offset } = getPaginationParams(req);

    // Get query filters
    const category = req.nextUrl.searchParams.get("category");
    const maxPrice = req.nextUrl.searchParams.get("maxPrice");
    const designerId = req.nextUrl.searchParams.get("designerId");

    const filters: any = {};
    if (category) filters.category = category;
    if (maxPrice) filters.maxPrice = parseFloat(maxPrice);
    if (designerId) filters.designerId = designerId;

    const { data, error } = await repo.findAll(filters);

    if (error) {
      return errorResponse("Failed to fetch products", 500);
    }

    return successResponse({
      products: (data || []).slice(offset, offset + limit),
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
    const repo = new ProductRepository(supabase);

    const body = await req.json();

    // Validate input
    const validation = validateProductCreation(body);
    if (!validation.valid) {
      return errorResponse(`Validation failed: ${validation.errors?.join(", ")}`, 400);
    }

    const { data, error } = await repo.create(user!.id, body);

    if (error) {
      return errorResponse("Failed to create product", 500);
    }

    await logActivity(user!.id, "CREATE_PRODUCT", "products", data.id, "success");

    return successResponse({ product: data }, 201);
  } catch (err: any) {
    return errorResponse(err.message || "Internal server error", 500);
  }
}
