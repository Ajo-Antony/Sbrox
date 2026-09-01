/**
 * Database Schema Types
 * Complete TypeScript interfaces for all Supabase tables
 * Generated to match the migrations in supabase/migrations/
 */

// User roles enum
export enum UserRole {
  SUPERADMIN = 'superadmin',
  ADMIN = 'admin',
  DESIGNER = 'designer',
  USER = 'user',
}

// Product status and category enums
export enum ProductStatus {
  ACTIVE = 'active',
  DRAFT = 'draft',
  ARCHIVED = 'archived',
  SOLD = 'sold',
}

export enum ProductCategory {
  DESIGN = 'design',
  DEVELOPMENT = 'development',
  CONTENT = 'content',
  MARKETING = 'marketing',
  OTHER = 'other',
}

// Booking types and status
export enum BookingType {
  HOURLY = 'hourly',
  PROJECT = 'project',
  SUBSCRIPTION = 'subscription',
}

export enum BookingStatus {
  PENDING = 'pending',
  ACCEPTED = 'accepted',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
  DISPUTED = 'disputed',
}

// Payment enums
export enum PaymentStatus {
  PENDING = 'pending',
  PROCESSING = 'processing',
  COMPLETED = 'completed',
  FAILED = 'failed',
  REFUNDED = 'refunded',
  DISPUTED = 'disputed',
}

export enum PaymentMethod {
  CREDIT_CARD = 'credit_card',
  DEBIT_CARD = 'debit_card',
  UPI = 'upi',
  WALLET = 'wallet',
  BANK_TRANSFER = 'bank_transfer',
}

// Dispute enums
export enum DisputeStatus {
  OPEN = 'open',
  UNDER_REVIEW = 'under_review',
  RESOLVED = 'resolved',
  CLOSED = 'closed',
  APPEALED = 'appealed',
}

export enum DisputePriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  URGENT = 'urgent',
}

// Notification type enum
export enum NotificationType {
  BOOKING_REQUEST = 'booking_request',
  BOOKING_ACCEPTED = 'booking_accepted',
  BOOKING_REJECTED = 'booking_rejected',
  BOOKING_COMPLETED = 'booking_completed',
  BOOKING_CANCELLED = 'booking_cancelled',
  PAYMENT_RECEIVED = 'payment_received',
  PAYMENT_FAILED = 'payment_failed',
  REFUND_ISSUED = 'refund_issued',
  NEW_REVIEW = 'new_review',
  NEW_MESSAGE = 'new_message',
  REVIEW_RESPONSE = 'review_response',
  DISPUTE_RAISED = 'dispute_raised',
  DISPUTE_RESOLVED = 'dispute_resolved',
  DISPUTE_APPEAL = 'dispute_appeal',
  ADMIN_ACTION = 'admin_action',
  PROFILE_UPDATED = 'profile_updated',
  SKILL_ENDORSEMENT = 'skill_endorsement',
  PRODUCT_LISTED = 'product_listed',
  PRODUCT_SOLD = 'product_sold',
  PRODUCT_REMOVED = 'product_removed',
  SUBSCRIPTION_EXPIRING = 'subscription_expiring',
  SUBSCRIPTION_RENEWED = 'subscription_renewed',
  SYSTEM_ALERT = 'system_alert',
  PROMOTION = 'promotion',
  OTHER = 'other',
}

// Admin action type enum
export enum AdminActionType {
  USER_CREATED = 'user_created',
  USER_UPDATED = 'user_updated',
  USER_DELETED = 'user_deleted',
  USER_VERIFIED = 'user_verified',
  USER_SUSPENDED = 'user_suspended',
  USER_ACTIVATED = 'user_activated',
  DESIGNER_FEATURED = 'designer_featured',
  DESIGNER_UNFEATURED = 'designer_unfeatured',
  DESIGNER_VERIFIED = 'designer_verified',
  DESIGNER_SUSPENDED = 'designer_suspended',
  PRODUCT_FEATURED = 'product_featured',
  PRODUCT_ARCHIVED = 'product_archived',
  PRODUCT_APPROVED = 'product_approved',
  PRODUCT_REJECTED = 'product_rejected',
  BOOKING_CANCELLED = 'booking_cancelled',
  BOOKING_APPROVED = 'booking_approved',
  BOOKING_REJECTED = 'booking_rejected',
  PAYMENT_REFUNDED = 'payment_refunded',
  PAYMENT_DISPUTED = 'payment_disputed',
  PAYMENT_VERIFIED = 'payment_verified',
  DISPUTE_RESOLVED = 'dispute_resolved',
  DISPUTE_APPEALED = 'dispute_appealed',
  DISPUTE_CLOSED = 'dispute_closed',
  CONTENT_MODERATED = 'content_moderated',
  CONTENT_REMOVED = 'content_removed',
  CONTENT_APPROVED = 'content_approved',
  COMMISSION_UPDATED = 'commission_updated',
  PAYMENT_SETTING_UPDATED = 'payment_setting_updated',
  USER_BANNED = 'user_banned',
  USER_UNBANNED = 'user_unbanned',
  OTHER = 'other',
}

// Users Table
export interface User {
  id: string;
  email: string;
  full_name: string;
  role: UserRole;
  avatar_url?: string;
  bio?: string;
  phone_number?: string;
  country?: string;
  city?: string;
  timezone?: string;
  is_verified: boolean;
  is_active: boolean;
  verification_token?: string;
  verification_token_expires_at?: string;
  last_login_at?: string;
  created_at: string;
  updated_at: string;
  deleted_at?: string;
}

// Designers Table
export interface Designer {
  id: string;
  skills: string[];
  hourly_rate?: number;
  project_rate?: number;
  subscription_tier?: string;
  subscription_price?: number;
  total_hours_available: number;
  hours_booked: number;
  total_projects_completed: number;
  average_rating: number;
  total_reviews: number;
  is_available: boolean;
  is_featured: boolean;
  cancellation_policy?: string;
  response_time_hours: number;
  portfolio_items: string[];
  social_links: Record<string, string>;
  documents: Record<string, any>;
  bank_account_verified: boolean;
  tax_id?: string;
  created_at: string;
  updated_at: string;
  deleted_at?: string;
}

// Products Table
export interface Product {
  id: string;
  user_id: string;
  title: string;
  description: string;
  category: ProductCategory;
  price: number;
  status: ProductStatus;
  images: string[];
  specifications: Record<string, any>;
  designer_id?: string;
  quantity_available: number;
  quantity_sold: number;
  tags: string[];
  featured_until?: string;
  views_count: number;
  created_at: string;
  updated_at: string;
  deleted_at?: string;
}

// Bookings Table
export interface Booking {
  id: string;
  user_id: string;
  designer_id: string;
  product_id?: string;
  type: BookingType;
  status: BookingStatus;
  title: string;
  description?: string;
  start_date: string;
  end_date?: string;
  start_time?: string;
  end_time?: string;
  total_hours?: number;
  total_price: number;
  advance_payment?: number;
  remaining_balance?: number;
  notes: Record<string, any>;
  accepted_at?: string;
  started_at?: string;
  completed_at?: string;
  cancelled_at?: string;
  cancellation_reason?: string;
  created_at: string;
  updated_at: string;
}

// Payments Table
export interface Payment {
  id: string;
  booking_id?: string;
  user_id: string;
  designer_id: string;
  amount: number;
  currency: string;
  status: PaymentStatus;
  method: PaymentMethod;
  razorpay_order_id?: string;
  razorpay_payment_id?: string;
  razorpay_signature?: string;
  razorpay_refund_id?: string;
  receipt_url?: string;
  invoice_url?: string;
  transaction_fee?: number;
  net_amount?: number;
  payment_date?: string;
  refund_date?: string;
  refund_reason?: string;
  description?: string;
  metadata: Record<string, any>;
  created_at: string;
  updated_at: string;
}

// Reviews Table
export interface Review {
  id: string;
  booking_id: string;
  from_user_id: string;
  to_designer_id: string;
  rating: number;
  comment?: string;
  professionalism?: number;
  quality?: number;
  communication?: number;
  on_time_delivery?: boolean;
  would_recommend: boolean;
  images: string[];
  is_verified_purchase: boolean;
  helpful_count: number;
  unhelpful_count: number;
  response_from_designer?: string;
  response_at?: string;
  is_flagged: boolean;
  flag_reason?: string;
  created_at: string;
  updated_at: string;
}

// Disputes Table
export interface Dispute {
  id: string;
  booking_id: string;
  raised_by_user_id: string;
  raised_against_user_id: string;
  status: DisputeStatus;
  priority: DisputePriority;
  title: string;
  description: string;
  evidence: string[];
  category?: string;
  resolution_requested?: string;
  refund_requested?: number;
  admin_assigned_to?: string;
  admin_notes?: string;
  resolution_details?: string;
  resolved_at?: string;
  resolution_date?: string;
  appeal_reason?: string;
  appealed_at?: string;
  created_at: string;
  updated_at: string;
}

// Notifications Table
export interface Notification {
  id: string;
  user_id: string;
  type: NotificationType;
  title: string;
  message?: string;
  data: Record<string, any>;
  related_user_id?: string;
  related_booking_id?: string;
  related_payment_id?: string;
  related_review_id?: string;
  related_dispute_id?: string;
  action_url?: string;
  is_read: boolean;
  read_at?: string;
  is_archived: boolean;
  archived_at?: string;
  created_at: string;
  updated_at: string;
}

// Admin Actions Table
export interface AdminAction {
  id: string;
  admin_id: string;
  action_type: AdminActionType;
  target_id?: string;
  target_type?: string;
  reason?: string;
  details: Record<string, any>;
  status?: string;
  ip_address?: string;
  user_agent?: string;
  old_values?: Record<string, any>;
  new_values?: Record<string, any>;
  created_at: string;
  updated_at: string;
}

// Combined type for database schema
export interface Database {
  users: User;
  designers: Designer;
  products: Product;
  bookings: Booking;
  payments: Payment;
  reviews: Review;
  disputes: Dispute;
  notifications: Notification;
  admin_actions: AdminAction;
}

// Helper types for API responses
export interface BookingWithDesigner extends Booking {
  designer?: Designer & User;
}

export interface ReviewWithUser extends Review {
  reviewer?: User;
  designer?: Designer & User;
}

export interface PaymentWithDetails extends Payment {
  booking?: Booking;
  payer?: User;
  receiver?: Designer & User;
}

export interface DisputeWithDetails extends Dispute {
  booking?: Booking;
  raised_by?: User;
  raised_against?: User;
  assigned_admin?: User;
}
