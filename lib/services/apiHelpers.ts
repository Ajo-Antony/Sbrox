import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export interface AuthUser {
  id: string;
  email: string;
  role: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  code?: string;
}

/**
 * Authenticate request and get user info
 */
export async function authenticateRequest(req: NextRequest): Promise<{
  user: AuthUser | null;
  error: NextResponse | null;
}> {
  const supabase = await createClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    return {
      user: null,
      error: NextResponse.json({ error: "Authentication required" }, { status: 401 })
    };
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  return {
    user: {
      id: user.id,
      email: user.email || "",
      role: profile?.role || "user"
    },
    error: null
  };
}

/**
 * Check if user has required role
 */
export function checkRole(userRole: string, allowedRoles: string[]): boolean {
  return allowedRoles.includes(userRole);
}

/**
 * Create error response
 */
export function errorResponse(message: string, status: number = 400, code?: string): NextResponse {
  return NextResponse.json(
    {
      success: false,
      error: message,
      code: code || "ERROR"
    },
    { status }
  );
}

/**
 * Create success response
 */
export function successResponse<T>(data: T, status: number = 200): NextResponse {
  return NextResponse.json(
    {
      success: true,
      data
    },
    { status }
  );
}

/**
 * Log activity
 */
export async function logActivity(
  userId: string,
  action: string,
  resource: string,
  resourceId: string,
  status: "success" | "failure",
  details?: any
): Promise<void> {
  const supabase = await createClient();

  await supabase.from("activity_logs").insert({
    user_id: userId,
    action,
    resource,
    resource_id: resourceId,
    status,
    details: details || {},
    timestamp: new Date().toISOString()
  });
}

/**
 * Validate required fields
 */
export function validateRequiredFields(data: any, fields: string[]): {
  valid: boolean;
  errors?: string[];
} {
  const errors: string[] = [];

  for (const field of fields) {
    if (!data[field]) {
      errors.push(`${field} is required`);
    }
  }

  return {
    valid: errors.length === 0,
    errors: errors.length > 0 ? errors : undefined
  };
}

/**
 * Parse JSON safely
 */
export function safeParseJSON(jsonString: string): any {
  try {
    return JSON.parse(jsonString);
  } catch {
    return null;
  }
}

/**
 * Get query parameters
 */
export function getQueryParams(req: NextRequest): Record<string, string | string[]> {
  const params: Record<string, string | string[]> = {};

  req.nextUrl.searchParams.forEach((value, key) => {
    params[key] = value;
  });

  return params;
}

/**
 * Paginate results
 */
export function getPaginationParams(req: NextRequest): { limit: number; offset: number } {
  const limit = Math.min(parseInt(req.nextUrl.searchParams.get("limit") || "20"), 100);
  const offset = parseInt(req.nextUrl.searchParams.get("offset") || "0");

  return { limit: Math.max(1, limit), offset: Math.max(0, offset) };
}
