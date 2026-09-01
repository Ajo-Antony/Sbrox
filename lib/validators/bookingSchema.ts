export type PricingModel = "hourly" | "project" | "subscription";

export interface BookingInput {
  designer_id: string;
  pricing_model: PricingModel;
  duration_minutes?: number; // for hourly
  description: string;
  start_date: string; // ISO date
  end_date?: string; // ISO date
  tip?: number;
  payment_method?: string;
}

export interface BookingStatusUpdateInput {
  status: "accepted" | "rejected" | "completed" | "cancelled";
}

export function validateBookingCreation(data: any): {
  valid: boolean;
  errors?: string[];
} {
  const errors: string[] = [];

  if (!data.designer_id || typeof data.designer_id !== "string") {
    errors.push("Valid designer_id is required");
  }

  if (!["hourly", "project", "subscription"].includes(data.pricing_model)) {
    errors.push("Pricing model must be one of: hourly, project, subscription");
  }

  if (data.pricing_model === "hourly") {
    if (!data.duration_minutes || typeof data.duration_minutes !== "number" || data.duration_minutes <= 0) {
      errors.push("Duration in minutes is required and must be positive for hourly bookings");
    }
  }

  if (!data.description || typeof data.description !== "string" || data.description.trim().length < 10) {
    errors.push("Description must be at least 10 characters");
  }

  if (!data.start_date || isNaN(new Date(data.start_date).getTime())) {
    errors.push("Valid start_date is required");
  }

  if (data.end_date && isNaN(new Date(data.end_date).getTime())) {
    errors.push("end_date must be a valid date");
  }

  if (data.start_date && data.end_date) {
    const startDate = new Date(data.start_date);
    const endDate = new Date(data.end_date);
    if (startDate >= endDate) {
      errors.push("End date must be after start date");
    }
  }

  if (data.tip !== undefined && (typeof data.tip !== "number" || data.tip < 0)) {
    errors.push("Tip must be a non-negative number");
  }

  return {
    valid: errors.length === 0,
    errors: errors.length > 0 ? errors : undefined
  };
}

export function validateBookingStatusUpdate(data: any): {
  valid: boolean;
  errors?: string[];
} {
  const errors: string[] = [];

  if (!["accepted", "rejected", "completed", "cancelled"].includes(data.status)) {
    errors.push("Status must be one of: accepted, rejected, completed, cancelled");
  }

  return {
    valid: errors.length === 0,
    errors: errors.length > 0 ? errors : undefined
  };
}
