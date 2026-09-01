export interface ProductInput {
  name: string;
  description: string;
  category: string;
  price: number;
  images?: string[];
  specifications?: Record<string, string>;
}

export interface ProductUpdateInput {
  name?: string;
  description?: string;
  category?: string;
  price?: number;
  images?: string[];
  specifications?: Record<string, string>;
}

export function validateProductCreation(data: any): {
  valid: boolean;
  errors?: string[];
} {
  const errors: string[] = [];

  if (!data.name || typeof data.name !== "string" || data.name.trim().length < 3) {
    errors.push("Product name must be at least 3 characters");
  }

  if (!data.description || typeof data.description !== "string" || data.description.trim().length < 20) {
    errors.push("Description must be at least 20 characters");
  }

  if (!data.category || typeof data.category !== "string" || data.category.trim().length === 0) {
    errors.push("Category is required");
  }

  if (typeof data.price !== "number" || data.price <= 0) {
    errors.push("Price must be a positive number");
  }

  if (data.images !== undefined && !Array.isArray(data.images)) {
    errors.push("Images must be an array of URLs");
  }

  if (data.images && data.images.some((img: any) => typeof img !== "string" || !isValidUrl(img))) {
    errors.push("All images must be valid URLs");
  }

  if (data.specifications !== undefined && typeof data.specifications !== "object") {
    errors.push("Specifications must be an object");
  }

  return {
    valid: errors.length === 0,
    errors: errors.length > 0 ? errors : undefined
  };
}

export function validateProductUpdate(data: any): {
  valid: boolean;
  errors?: string[];
} {
  const errors: string[] = [];

  if (data.name !== undefined) {
    if (typeof data.name !== "string" || data.name.trim().length < 3) {
      errors.push("Product name must be at least 3 characters");
    }
  }

  if (data.description !== undefined) {
    if (typeof data.description !== "string" || data.description.trim().length < 20) {
      errors.push("Description must be at least 20 characters");
    }
  }

  if (data.category !== undefined) {
    if (typeof data.category !== "string" || data.category.trim().length === 0) {
      errors.push("Category is required");
    }
  }

  if (data.price !== undefined) {
    if (typeof data.price !== "number" || data.price <= 0) {
      errors.push("Price must be a positive number");
    }
  }

  if (data.images !== undefined && !Array.isArray(data.images)) {
    errors.push("Images must be an array of URLs");
  }

  if (data.images && data.images.some((img: any) => typeof img !== "string" || !isValidUrl(img))) {
    errors.push("All images must be valid URLs");
  }

  if (data.specifications !== undefined && typeof data.specifications !== "object") {
    errors.push("Specifications must be an object");
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
