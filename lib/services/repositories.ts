import { SupabaseClient } from "@supabase/supabase-js";

export class DesignerRepository {
  constructor(private supabase: SupabaseClient) {}

  async create(profileId: string, designerData: any) {
    const { data, error } = await this.supabase
      .from("designers")
      .insert({
        profile_id: profileId,
        headline: designerData.headline,
        bio: designerData.bio,
        skills: designerData.skills,
        categories: designerData.categories,
        rate_hourly: designerData.rate_hourly,
        rate_project: designerData.rate_project,
        rate_subscription: designerData.rate_subscription,
        status: "pending_review"
      })
      .select()
      .single();

    return { data, error };
  }

  async findById(id: string) {
    const { data, error } = await this.supabase
      .from("designers")
      .select(`
        *,
        profiles(id, full_name, avatar_url, phone)
      `)
      .eq("id", id)
      .single();

    return { data, error };
  }

  async findAll(filters?: { skill?: string; minPrice?: number; maxPrice?: number; status?: string }) {
    let query = this.supabase.from("designers").select(`
      *,
      profiles(id, full_name, avatar_url)
    `);

    if (filters?.status) {
      query = query.eq("status", filters.status);
    } else {
      query = query.eq("status", "approved");
    }

    if (filters?.skill) {
      query = query.contains("skills", [filters.skill]);
    }

    const { data, error } = await query.limit(50);
    return { data, error };
  }

  async update(id: string, updateData: any) {
    const { data, error } = await this.supabase
      .from("designers")
      .update(updateData)
      .eq("id", id)
      .select()
      .single();

    return { data, error };
  }

  async getBookings(designerId: string, limit: number = 20, offset: number = 0) {
    const { data, error } = await this.supabase
      .from("bookings")
      .select(`
        *,
        users:user_id(id, full_name, avatar_url)
      `)
      .eq("designer_id", designerId)
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1);

    return { data, error };
  }

  async getEarnings(designerId: string, startDate?: string, endDate?: string) {
    let query = this.supabase
      .from("bookings")
      .select("total_price, status, created_at")
      .eq("designer_id", designerId)
      .eq("status", "completed");

    if (startDate) {
      query = query.gte("created_at", startDate);
    }

    if (endDate) {
      query = query.lte("created_at", endDate);
    }

    const { data, error } = await query;

    if (error) return { data: null, error };

    const totalEarnings = (data || []).reduce((sum, booking) => sum + (booking.total_price || 0), 0);
    const bookingCount = data?.length || 0;

    return {
      data: {
        total_earnings: totalEarnings,
        booking_count: bookingCount,
        average_per_booking: bookingCount > 0 ? totalEarnings / bookingCount : 0
      },
      error: null
    };
  }

  async getRating(designerId: string) {
    const { data, error } = await this.supabase
      .from("reviews")
      .select("rating")
      .eq("designer_id", designerId);

    if (error) return { data: null, error };

    const ratings = data || [];
    const avgRating = ratings.length > 0 ? ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length : 0;

    return { data: { average_rating: avgRating, review_count: ratings.length }, error: null };
  }
}

export class ProductRepository {
  constructor(private supabase: SupabaseClient) {}

  async create(userId: string, productData: any) {
    const { data, error } = await this.supabase
      .from("products")
      .insert({
        user_id: userId,
        name: productData.name,
        description: productData.description,
        category: productData.category,
        price: productData.price,
        images: productData.images || [],
        specifications: productData.specifications || {}
      })
      .select()
      .single();

    return { data, error };
  }

  async findById(id: string) {
    const { data, error } = await this.supabase
      .from("products")
      .select(`
        *,
        creator:user_id(id, full_name, avatar_url)
      `)
      .eq("id", id)
      .single();

    return { data, error };
  }

  async findAll(filters?: { category?: string; maxPrice?: number; designerId?: string }) {
    let query = this.supabase.from("products").select(`
      *,
      creator:user_id(id, full_name, avatar_url)
    `);

    if (filters?.category) {
      query = query.eq("category", filters.category);
    }

    if (filters?.maxPrice) {
      query = query.lte("price", filters.maxPrice);
    }

    if (filters?.designerId) {
      query = query.eq("user_id", filters.designerId);
    }

    const { data, error } = await query.order("created_at", { ascending: false }).limit(50);

    return { data, error };
  }

  async update(id: string, userId: string, updateData: any) {
    // Verify ownership
    const { data: product, error: fetchError } = await this.supabase
      .from("products")
      .select("user_id")
      .eq("id", id)
      .single();

    if (fetchError || product?.user_id !== userId) {
      return { data: null, error: { message: "Unauthorized" } };
    }

    const { data, error } = await this.supabase
      .from("products")
      .update(updateData)
      .eq("id", id)
      .select()
      .single();

    return { data, error };
  }

  async delete(id: string, userId: string) {
    const { data: product, error: fetchError } = await this.supabase
      .from("products")
      .select("user_id")
      .eq("id", id)
      .single();

    if (fetchError || product?.user_id !== userId) {
      return { error: { message: "Unauthorized" } };
    }

    const { error } = await this.supabase.from("products").delete().eq("id", id);

    return { error };
  }
}

export class BookingRepository {
  constructor(private supabase: SupabaseClient) {}

  async create(userId: string, bookingData: any) {
    const { data, error } = await this.supabase
      .from("bookings")
      .insert({
        user_id: userId,
        designer_id: bookingData.designer_id,
        pricing_model: bookingData.pricing_model,
        duration_minutes: bookingData.duration_minutes,
        description: bookingData.description,
        start_date: bookingData.start_date,
        end_date: bookingData.end_date,
        total_price: bookingData.total_price,
        tip: bookingData.tip || 0,
        status: "pending"
      })
      .select()
      .single();

    return { data, error };
  }

  async findById(id: string) {
    const { data, error } = await this.supabase
      .from("bookings")
      .select(`
        *,
        user:user_id(id, full_name, avatar_url),
        designer:designer_id(id, headline, rate_hourly, rate_project, rate_subscription)
      `)
      .eq("id", id)
      .single();

    return { data, error };
  }

  async findByUserId(userId: string, limit: number = 20, offset: number = 0) {
    const { data, error } = await this.supabase
      .from("bookings")
      .select(`
        *,
        designer:designer_id(id, headline, avatar_url)
      `)
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1);

    return { data, error };
  }

  async updateStatus(id: string, status: string) {
    const { data, error } = await this.supabase
      .from("bookings")
      .update({ status, updated_at: new Date().toISOString() })
      .eq("id", id)
      .select()
      .single();

    return { data, error };
  }

  async findByDesignerId(designerId: string, limit: number = 20, offset: number = 0) {
    const { data, error } = await this.supabase
      .from("bookings")
      .select(`
        *,
        user:user_id(id, full_name, avatar_url)
      `)
      .eq("designer_id", designerId)
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1);

    return { data, error };
  }
}

export class ReviewRepository {
  constructor(private supabase: SupabaseClient) {}

  async create(userId: string, reviewData: any) {
    const { data, error } = await this.supabase
      .from("reviews")
      .insert({
        user_id: userId,
        booking_id: reviewData.booking_id,
        designer_id: reviewData.designer_id,
        rating: reviewData.rating,
        comment: reviewData.comment
      })
      .select()
      .single();

    return { data, error };
  }

  async findByDesignerId(designerId: string, limit: number = 20, offset: number = 0) {
    const { data, error } = await this.supabase
      .from("reviews")
      .select(`
        *,
        user:user_id(id, full_name, avatar_url)
      `)
      .eq("designer_id", designerId)
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1);

    return { data, error };
  }

  async findByBookingId(bookingId: string) {
    const { data, error } = await this.supabase
      .from("reviews")
      .select("*")
      .eq("booking_id", bookingId)
      .single();

    return { data, error };
  }
}

export class DisputeRepository {
  constructor(private supabase: SupabaseClient) {}

  async create(userId: string, disputeData: any) {
    const { data, error } = await this.supabase
      .from("disputes")
      .insert({
        user_id: userId,
        booking_id: disputeData.booking_id,
        reason: disputeData.reason,
        description: disputeData.description,
        evidence_urls: disputeData.evidence_urls || [],
        status: "open"
      })
      .select()
      .single();

    return { data, error };
  }

  async findAll(limit: number = 50, offset: number = 0) {
    const { data, error } = await this.supabase
      .from("disputes")
      .select(`
        *,
        user:user_id(id, full_name),
        booking:booking_id(id, designer_id, user_id)
      `)
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1);

    return { data, error };
  }

  async findById(id: string) {
    const { data, error } = await this.supabase
      .from("disputes")
      .select(`
        *,
        user:user_id(id, full_name, avatar_url),
        booking:booking_id(id, designer_id, user_id, total_price)
      `)
      .eq("id", id)
      .single();

    return { data, error };
  }

  async updateStatus(id: string, status: string, resolution?: string) {
    const updateData: any = { status, resolved_at: new Date().toISOString() };
    if (resolution) {
      updateData.resolution = resolution;
    }

    const { data, error } = await this.supabase
      .from("disputes")
      .update(updateData)
      .eq("id", id)
      .select()
      .single();

    return { data, error };
  }
}

export class AvailabilityRepository {
  constructor(private supabase: SupabaseClient) {}

  async setSchedule(designerId: string, schedules: any[]) {
    const { error: deleteError } = await this.supabase
      .from("designer_availability")
      .delete()
      .eq("designer_id", designerId);

    if (deleteError) return { data: null, error: deleteError };

    const schedulesToInsert = schedules.map((s) => ({
      designer_id: designerId,
      day_of_week: s.day_of_week,
      start_time: s.start_time,
      end_time: s.end_time,
      is_available: s.is_available
    }));

    const { data, error } = await this.supabase
      .from("designer_availability")
      .insert(schedulesToInsert)
      .select();

    return { data, error };
  }

  async getSchedule(designerId: string) {
    const { data, error } = await this.supabase
      .from("designer_availability")
      .select("*")
      .eq("designer_id", designerId)
      .order("day_of_week");

    return { data, error };
  }
}
