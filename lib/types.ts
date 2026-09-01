export type Role = "user" | "designer" | "admin" | "super_admin";

export type Category = "UI Design" | "Website Redesign" | "Photoshop";

export type BookingStatus =
  | "pending"
  | "confirmed"
  | "in_progress"
  | "completed"
  | "cancelled"
  | "disputed";

export type DesignerStatus = "pending_review" | "approved" | "suspended";

export interface Profile {
  id: string;
  role: Role;
  full_name: string;
  avatar_url: string | null;
  phone: string | null;
  created_at: string;
}

export interface Designer {
  id: string;
  profile_id: string;
  headline: string;
  bio: string;
  categories: Category[];
  rate_per_15min: number;
  rating: number;
  lat: number;
  lng: number;
  status: DesignerStatus;
  is_available_now: boolean;
  created_at: string;
}

export interface PortfolioItem {
  id: string;
  designer_id: string;
  image_url: string;
  caption: string | null;
  created_at: string;
}

export interface Slot {
  id: string;
  designer_id: string;
  starts_at: string;
  duration_minutes: number;
  locked_by_booking_id: string | null;
}

export interface Booking {
  id: string;
  user_id: string;
  designer_id: string;
  slot_id: string;
  category: Category;
  status: BookingStatus;
  rate: number;
  tip: number;
  total: number;
  payment_method: string | null;
  created_at: string;
}

export interface Payment {
  id: string;
  booking_id: string;
  razorpay_order_id: string;
  razorpay_payment_id: string | null;
  amount: number;
  status: "pending" | "completed" | "failed" | "refunded";
  designer_payout: number | null;
  platform_commission: number | null;
  receipt_id: string | null;
  created_at: string;
}

export interface PaymentMethod {
  hourly: number;
  perProject: number;
  subscription: number;
}

export interface RazorpayWebhookEvent {
  id: string;
  entity: string;
  event: string;
  created_at: number;
  payload: {
    payment?: {
      entity: {
        id: string;
        order_id: string;
        amount: number;
        status: string;
      };
    };
    refund?: {
      entity: {
        id: string;
        payment_id: string;
        amount: number;
        status: string;
      };
    };
  };
}

// Minimal Supabase Database type — extend with `supabase gen types typescript`
// once the project is linked. Kept here so the client factories type-check.
export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: Profile;
        Insert: Partial<Profile>;
        Update: Partial<Profile>;
        Relationships: [];
      };
      designers: {
        Row: Designer;
        Insert: Partial<Designer>;
        Update: Partial<Designer>;
        Relationships: [];
      };
      portfolio_items: {
        Row: PortfolioItem;
        Insert: Partial<PortfolioItem>;
        Update: Partial<PortfolioItem>;
        Relationships: [];
      };
      slots: {
        Row: Slot;
        Insert: Partial<Slot>;
        Update: Partial<Slot>;
        Relationships: [];
      };
      bookings: {
        Row: Booking;
        Insert: Partial<Booking>;
        Update: Partial<Booking>;
        Relationships: [];
      };
      payments: {
        Row: Payment;
        Insert: Partial<Payment>;
        Update: Partial<Payment>;
        Relationships: [];
      };
    };
    Views: {};
    Functions: {
      book_slot: {
        Args: {
          p_user_id: string;
          p_designer_id: string;
          p_slot_id: string;
          p_category: Category;
          p_tip?: number;
          p_payment_method?: string | null;
        };
        Returns: string;
      };
    };
    Enums: {
      role: Role;
      category: Category;
      designer_status: DesignerStatus;
      booking_status: BookingStatus;
    };
    CompositeTypes: {};
  };
};
