export interface ReviewInput {
  booking_id: string;
  rating: number; // 1-5
  comment: string;
}

export interface DisputeInput {
  booking_id: string;
  reason: string;
  description: string;
  evidence_urls?: string[];
}

export function validateReviewCreation(data: any): {
  valid: boolean;
  errors?: string[];
} {
  const errors: string[] = [];

  if (!data.booking_id || typeof data.booking_id !== "string") {
    errors.push("Valid booking_id is required");
  }

  if (typeof data.rating !== "number" || data.rating < 1 || data.rating > 5) {
    errors.push("Rating must be a number between 1 and 5");
  }

  if (!data.comment || typeof data.comment !== "string" || data.comment.trim().length < 10) {
    errors.push("Comment must be at least 10 characters");
  }

  return {
    valid: errors.length === 0,
    errors: errors.length > 0 ? errors : undefined
  };
}

export function validateDisputeCreation(data: any): {
  valid: boolean;
  errors?: string[];
} {
  const errors: string[] = [];

  if (!data.booking_id || typeof data.booking_id !== "string") {
    errors.push("Valid booking_id is required");
  }

  if (!data.reason || typeof data.reason !== "string" || data.reason.trim().length === 0) {
    errors.push("Reason is required");
  }

  if (!data.description || typeof data.description !== "string" || data.description.trim().length < 20) {
    errors.push("Description must be at least 20 characters");
  }

  if (data.evidence_urls !== undefined) {
    if (!Array.isArray(data.evidence_urls)) {
      errors.push("Evidence URLs must be an array");
    } else if (data.evidence_urls.some((url: any) => typeof url !== "string" || !isValidUrl(url))) {
      errors.push("All evidence URLs must be valid");
    }
  }

  return {
    valid: errors.length === 0,
    errors: errors.length > 0 ? errors : undefined
  };
}

function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}
