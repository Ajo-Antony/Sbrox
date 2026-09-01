export interface DesignerRegistrationInput {
  headline: string;
  bio: string;
  skills: string[];
  categories: string[];
  rate_hourly?: number;
  rate_project?: number;
  rate_subscription?: number;
  portfolio_items?: Array<{ url: string; caption?: string }>;
}

export interface DesignerUpdateInput {
  headline?: string;
  bio?: string;
  skills?: string[];
  categories?: string[];
  rate_hourly?: number;
  rate_project?: number;
  rate_subscription?: number;
}

export interface AvailabilityInput {
  day_of_week: number; // 0-6 (Monday-Sunday)
  start_time: string; // HH:mm format
  end_time: string;
  is_available: boolean;
}

export function validateDesignerRegistration(data: any): {
  valid: boolean;
  errors?: string[];
} {
  const errors: string[] = [];

  if (!data.headline || typeof data.headline !== "string" || data.headline.trim().length < 10) {
    errors.push("Headline must be at least 10 characters");
  }

  if (!data.bio || typeof data.bio !== "string" || data.bio.trim().length < 20) {
    errors.push("Bio must be at least 20 characters");
  }

  if (!Array.isArray(data.skills) || data.skills.length === 0) {
    errors.push("At least one skill is required");
  }

  if (!Array.isArray(data.categories) || data.categories.length === 0) {
    errors.push("At least one category is required");
  }

  const rates = [data.rate_hourly, data.rate_project, data.rate_subscription];
  if (rates.every((r) => !r)) {
    errors.push("At least one pricing model (hourly, project, or subscription) is required");
  }

  if (data.rate_hourly && (typeof data.rate_hourly !== "number" || data.rate_hourly <= 0)) {
    errors.push("Hourly rate must be a positive number");
  }

  if (data.rate_project && (typeof data.rate_project !== "number" || data.rate_project <= 0)) {
    errors.push("Project rate must be a positive number");
  }

  if (
    data.rate_subscription &&
    (typeof data.rate_subscription !== "number" || data.rate_subscription <= 0)
  ) {
    errors.push("Subscription rate must be a positive number");
  }

  return {
    valid: errors.length === 0,
    errors: errors.length > 0 ? errors : undefined
  };
}

export function validateDesignerUpdate(data: any): {
  valid: boolean;
  errors?: string[];
} {
  const errors: string[] = [];

  if (data.headline !== undefined) {
    if (typeof data.headline !== "string" || data.headline.trim().length < 10) {
      errors.push("Headline must be at least 10 characters");
    }
  }

  if (data.bio !== undefined) {
    if (typeof data.bio !== "string" || data.bio.trim().length < 20) {
      errors.push("Bio must be at least 20 characters");
    }
  }

  if (data.skills !== undefined && !Array.isArray(data.skills)) {
    errors.push("Skills must be an array");
  }

  if (data.categories !== undefined && !Array.isArray(data.categories)) {
    errors.push("Categories must be an array");
  }

  if (data.rate_hourly !== undefined) {
    if (typeof data.rate_hourly !== "number" || data.rate_hourly <= 0) {
      errors.push("Hourly rate must be a positive number");
    }
  }

  if (data.rate_project !== undefined) {
    if (typeof data.rate_project !== "number" || data.rate_project <= 0) {
      errors.push("Project rate must be a positive number");
    }
  }

  if (data.rate_subscription !== undefined) {
    if (typeof data.rate_subscription !== "number" || data.rate_subscription <= 0) {
      errors.push("Subscription rate must be a positive number");
    }
  }

  return {
    valid: errors.length === 0,
    errors: errors.length > 0 ? errors : undefined
  };
}

export function validateAvailability(data: any): {
  valid: boolean;
  errors?: string[];
} {
  const errors: string[] = [];

  if (typeof data.day_of_week !== "number" || data.day_of_week < 0 || data.day_of_week > 6) {
    errors.push("Day of week must be between 0-6");
  }

  if (!data.start_time || !/^\d{2}:\d{2}$/.test(data.start_time)) {
    errors.push("Start time must be in HH:mm format");
  }

  if (!data.end_time || !/^\d{2}:\d{2}$/.test(data.end_time)) {
    errors.push("End time must be in HH:mm format");
  }

  if (data.start_time && data.end_time && data.start_time >= data.end_time) {
    errors.push("Start time must be before end time");
  }

  if (typeof data.is_available !== "boolean") {
    errors.push("is_available must be a boolean");
  }

  return {
    valid: errors.length === 0,
    errors: errors.length > 0 ? errors : undefined
  };
}
