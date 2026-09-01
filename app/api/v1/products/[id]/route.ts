import { NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { ProductRepository } from "@/lib/services/repositories";
import { validateProductUpdate } from "@/lib/validators/productSchema";
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
    const repo = new ProductRepository(supabase);

    const { data: product, error } = await repo.findById(id);

    if (error || !product) {
      return errorResponse("Product not found", 404);
    }

    return successResponse({ product });
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
    const repo = new ProductRepository(supabase);

    const body = await req.json();

    // Validate input
    const validation = validateProductUpdate(body);
    if (!validation.valid) {
      return errorResponse(`Validation failed: ${validation.errors?.join(", ")}`, 400);
    }

    const { data, error } = await repo.update(id, user!.id, body);

    if (error || !data) {
      return errorResponse(error?.message || "Failed to update product", 403);
    }

    await logActivity(user!.id, "UPDATE_PRODUCT", "products", id, "success");

    return successResponse({ product: data });
  } catch (err: any) {
    return errorResponse(err.message || "Internal server error", 500);
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const { user, error: authError } = await authenticateRequest(req);
    if (authError) return authError;

    const supabase = await createClient();
    const repo = new ProductRepository(supabase);

    const { error } = await repo.delete(id, user!.id);

    if (error) {
      return errorResponse(error.message || "Failed to delete product", 403);
    }

    await logActivity(user!.id, "DELETE_PRODUCT", "products", id, "success");

    return successResponse({ message: "Product deleted successfully" });
  } catch (err: any) {
    return errorResponse(err.message || "Internal server error", 500);
  }
}
