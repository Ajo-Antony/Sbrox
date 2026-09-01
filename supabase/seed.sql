-- Supabase Seed Data
-- Test data for the designer marketplace platform
-- This file populates the database with sample data for development and testing

-- Disable RLS temporarily for seeding
ALTER TABLE users DISABLE ROW LEVEL SECURITY;
ALTER TABLE designers DISABLE ROW LEVEL SECURITY;
ALTER TABLE products DISABLE ROW LEVEL SECURITY;
ALTER TABLE bookings DISABLE ROW LEVEL SECURITY;
ALTER TABLE payments DISABLE ROW LEVEL SECURITY;
ALTER TABLE reviews DISABLE ROW LEVEL SECURITY;
ALTER TABLE disputes DISABLE ROW LEVEL SECURITY;
ALTER TABLE notifications DISABLE ROW LEVEL SECURITY;
ALTER TABLE admin_actions DISABLE ROW LEVEL SECURITY;

-- ===== USERS DATA =====
-- Note: In production, use proper auth.users. These are for testing with UUIDs

-- Superadmin
INSERT INTO users (id, email, full_name, role, is_verified, is_active, avatar_url, bio)
VALUES (
  'a0000000-0000-0000-0000-000000000001'::UUID,
  'superadmin@marketplace.com',
  'Super Admin',
  'superadmin',
  TRUE,
  TRUE,
  'https://api.dicebear.com/7.x/avataaars/svg?seed=superadmin',
  'Platform superadmin with full access'
)
ON CONFLICT DO NOTHING;

-- Admins
INSERT INTO users (id, email, full_name, role, is_verified, is_active, avatar_url, bio)
VALUES 
(
  'a0000000-0000-0000-0000-000000000002'::UUID,
  'admin1@marketplace.com',
  'Admin One',
  'admin',
  TRUE,
  TRUE,
  'https://api.dicebear.com/7.x/avataaars/svg?seed=admin1',
  'Content moderation and support'
),
(
  'a0000000-0000-0000-0000-000000000003'::UUID,
  'admin2@marketplace.com',
  'Admin Two',
  'admin',
  TRUE,
  TRUE,
  'https://api.dicebear.com/7.x/avataaars/svg?seed=admin2',
  'Payment and dispute resolution'
)
ON CONFLICT DO NOTHING;

-- Designers
INSERT INTO users (id, email, full_name, role, is_verified, is_active, avatar_url, bio, country, city, phone_number)
VALUES
(
  'a0000000-0000-0000-0000-000000000010'::UUID,
  'designer1@example.com',
  'Sarah Designer',
  'designer',
  TRUE,
  TRUE,
  'https://api.dicebear.com/7.x/avataaars/svg?seed=sarah',
  'UI/UX Designer with 5+ years experience',
  'India',
  'Bangalore',
  '+91-9000000001'
),
(
  'a0000000-0000-0000-0000-000000000011'::UUID,
  'designer2@example.com',
  'Alex Designer',
  'designer',
  TRUE,
  TRUE,
  'https://api.dicebear.com/7.x/avataaars/svg?seed=alex',
  'Web Developer specializing in React',
  'India',
  'Mumbai',
  '+91-9000000002'
),
(
  'a0000000-0000-0000-0000-000000000012'::UUID,
  'designer3@example.com',
  'Maya Designer',
  'designer',
  TRUE,
  TRUE,
  'https://api.dicebear.com/7.x/avataaars/svg?seed=maya',
  'Graphic Designer and brand specialist',
  'India',
  'Delhi',
  '+91-9000000003'
)
ON CONFLICT DO NOTHING;

-- Regular Users
INSERT INTO users (id, email, full_name, role, is_verified, is_active, avatar_url, bio, country, city)
VALUES
(
  'a0000000-0000-0000-0000-000000000020'::UUID,
  'user1@example.com',
  'John User',
  'user',
  TRUE,
  TRUE,
  'https://api.dicebear.com/7.x/avataaars/svg?seed=john',
  'Looking for design services',
  'India',
  'Bangalore'
),
(
  'a0000000-0000-0000-0000-000000000021'::UUID,
  'user2@example.com',
  'Emma User',
  'user',
  TRUE,
  TRUE,
  'https://api.dicebear.com/7.x/avataaars/svg?seed=emma',
  'Startup founder seeking developers',
  'India',
  'Hyderabad'
),
(
  'a0000000-0000-0000-0000-000000000022'::UUID,
  'user3@example.com',
  'David User',
  'user',
  TRUE,
  TRUE,
  'https://api.dicebear.com/7.x/avataaars/svg?seed=david',
  'Need branding and marketing help',
  'India',
  'Pune'
)
ON CONFLICT DO NOTHING;

-- ===== DESIGNERS DATA =====
INSERT INTO designers (
  id, skills, hourly_rate, project_rate, subscription_tier, subscription_price,
  total_hours_available, hours_booked, total_projects_completed,
  average_rating, total_reviews, is_available, is_featured, cancellation_policy,
  response_time_hours, portfolio_items
)
VALUES
(
  'a0000000-0000-0000-0000-000000000010'::UUID,
  ARRAY['UI Design', 'UX Design', 'Figma', 'Prototyping', 'Wireframing'],
  2000.00,
  50000.00,
  'pro',
  15000.00,
  100,
  25,
  15,
  4.8,
  45,
  TRUE,
  TRUE,
  'flexible',
  2,
  ARRAY[
    'https://example.com/portfolio/1',
    'https://example.com/portfolio/2',
    'https://example.com/portfolio/3'
  ]
),
(
  'a0000000-0000-0000-0000-000000000011'::UUID,
  ARRAY['React', 'Node.js', 'TypeScript', 'Full-stack', 'APIs'],
  1500.00,
  75000.00,
  'premium',
  20000.00,
  120,
  40,
  22,
  4.9,
  58,
  TRUE,
  TRUE,
  'moderate',
  1,
  ARRAY[
    'https://example.com/portfolio/4',
    'https://example.com/portfolio/5'
  ]
),
(
  'a0000000-0000-0000-0000-000000000012'::UUID,
  ARRAY['Logo Design', 'Brand Identity', 'Illustration', 'Adobe Suite', 'Packaging'],
  1800.00,
  45000.00,
  'basic',
  10000.00,
  80,
  15,
  12,
  4.6,
  32,
  TRUE,
  FALSE,
  'strict',
  4,
  ARRAY[
    'https://example.com/portfolio/6',
    'https://example.com/portfolio/7'
  ]
)
ON CONFLICT DO NOTHING;

-- ===== PRODUCTS DATA =====
INSERT INTO products (
  id, user_id, title, description, category, price, status, quantity_available,
  tags, images, specifications
)
VALUES
(
  'a0000000-0000-0000-0000-000000001001'::UUID,
  'a0000000-0000-0000-0000-000000000020'::UUID,
  'E-commerce Website Design',
  'Need a modern e-commerce website design with product showcase and checkout flow',
  'design',
  75000.00,
  'active',
  1,
  ARRAY['design', 'ecommerce', 'ui', 'urgent'],
  ARRAY['https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400'],
  '{"pages": 15, "deadline": "30 days", "budget": "75000"}'::JSONB
),
(
  'a0000000-0000-0000-0000-000000001002'::UUID,
  'a0000000-0000-0000-0000-000000000021'::UUID,
  'Mobile App Development',
  'React Native mobile app for iOS and Android with backend API',
  'development',
  250000.00,
  'active',
  1,
  ARRAY['development', 'mobile', 'react', 'api'],
  ARRAY['https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=400'],
  '{"platforms": ["iOS", "Android"], "timeline": "3 months", "budget": "250000"}'::JSONB
),
(
  'a0000000-0000-0000-0000-000000001003'::UUID,
  'a0000000-0000-0000-0000-000000000022'::UUID,
  'Brand Identity Package',
  'Complete brand identity including logo, color palette, and brand guidelines',
  'design',
  50000.00,
  'active',
  1,
  ARRAY['branding', 'logo', 'identity'],
  ARRAY['https://images.unsplash.com/photo-1561821308-102ec4bebc04?w=400'],
  '{"deliverables": ["Logo", "Guidelines", "Palette"], "revisions": 5}'::JSONB
)
ON CONFLICT DO NOTHING;

-- ===== BOOKINGS DATA =====
INSERT INTO bookings (
  id, user_id, designer_id, product_id, type, status, title, description,
  start_date, total_hours, total_price, advance_payment
)
VALUES
(
  'a0000000-0000-0000-0000-000000002001'::UUID,
  'a0000000-0000-0000-0000-000000000020'::UUID,
  'a0000000-0000-0000-0000-000000000010'::UUID,
  'a0000000-0000-0000-0000-000000001001'::UUID,
  'project',
  'completed',
  'E-commerce Design Project',
  'Design for new online store',
  '2024-06-01',
  40.0,
  75000.00,
  40000.00
),
(
  'a0000000-0000-0000-0000-000000002002'::UUID,
  'a0000000-0000-0000-0000-000000000021'::UUID,
  'a0000000-0000-0000-0000-000000000011'::UUID,
  'a0000000-0000-0000-0000-000000001002'::UUID,
  'project',
  'in_progress',
  'Mobile App Development',
  'React Native app with 3 month timeline',
  '2024-07-01',
  240.0,
  250000.00,
  100000.00
),
(
  'a0000000-0000-0000-0000-000000002003'::UUID,
  'a0000000-0000-0000-0000-000000000022'::UUID,
  'a0000000-0000-0000-0000-000000000012'::UUID,
  'a0000000-0000-0000-0000-000000001003'::UUID,
  'project',
  'pending',
  'Brand Identity Package',
  'Complete branding solution for startup',
  '2024-07-15',
  30.0,
  50000.00,
  25000.00
)
ON CONFLICT DO NOTHING;

-- ===== PAYMENTS DATA =====
INSERT INTO payments (
  id, booking_id, user_id, designer_id, amount, currency, status,
  method, razorpay_order_id, payment_date, description
)
VALUES
(
  'a0000000-0000-0000-0000-000000003001'::UUID,
  'a0000000-0000-0000-0000-000000002001'::UUID,
  'a0000000-0000-0000-0000-000000000020'::UUID,
  'a0000000-0000-0000-0000-000000000010'::UUID,
  40000.00,
  'INR',
  'completed',
  'upi',
  'order_KTwKs8KZmZJ82N',
  '2024-06-01 10:30:00+05:30',
  'Advance payment for e-commerce design'
),
(
  'a0000000-0000-0000-0000-000000003002'::UUID,
  'a0000000-0000-0000-0000-000000002001'::UUID,
  'a0000000-0000-0000-0000-000000000020'::UUID,
  'a0000000-0000-0000-0000-000000000010'::UUID,
  35000.00,
  'INR',
  'completed',
  'upi',
  'order_KTwLs8KZmZJ82O',
  '2024-06-28 15:45:00+05:30',
  'Final payment for e-commerce design'
),
(
  'a0000000-0000-0000-0000-000000003003'::UUID,
  'a0000000-0000-0000-0000-000000002002'::UUID,
  'a0000000-0000-0000-0000-000000000021'::UUID,
  'a0000000-0000-0000-0000-000000000011'::UUID,
  100000.00,
  'INR',
  'completed',
  'bank_transfer',
  'order_KTwMs8KZmZJ82P',
  '2024-07-01 09:00:00+05:30',
  'Advance payment for mobile app development'
)
ON CONFLICT DO NOTHING;

-- ===== REVIEWS DATA =====
INSERT INTO reviews (
  id, booking_id, from_user_id, to_designer_id, rating, comment,
  professionalism, quality, communication, on_time_delivery,
  would_recommend
)
VALUES
(
  'a0000000-0000-0000-0000-000000004001'::UUID,
  'a0000000-0000-0000-0000-000000002001'::UUID,
  'a0000000-0000-0000-0000-000000000020'::UUID,
  'a0000000-0000-0000-0000-000000000010'::UUID,
  5,
  'Excellent designer! The UI/UX design was beyond expectations. Sarah understood our requirements perfectly and delivered on time.',
  5,
  5,
  5,
  TRUE,
  TRUE
),
(
  'a0000000-0000-0000-0000-000000004002'::UUID,
  'a0000000-0000-0000-0000-000000002002'::UUID,
  'a0000000-0000-0000-0000-000000000021'::UUID,
  'a0000000-0000-0000-0000-000000000011'::UUID,
  4,
  'Alex is a skilled developer. Good communication and problem-solving. Project is progressing well.',
  5,
  4,
  4,
  TRUE,
  TRUE
)
ON CONFLICT DO NOTHING;

-- ===== NOTIFICATIONS DATA =====
INSERT INTO notifications (
  id, user_id, type, title, message, is_read, created_at
)
VALUES
(
  'a0000000-0000-0000-0000-000000005001'::UUID,
  'a0000000-0000-0000-0000-000000000010'::UUID,
  'booking_request',
  'New booking request',
  'John User has sent you a booking request for E-commerce Design',
  TRUE,
  NOW() - INTERVAL '5 days'
),
(
  'a0000000-0000-0000-0000-000000005002'::UUID,
  'a0000000-0000-0000-0000-000000000020'::UUID,
  'booking_completed',
  'Booking completed',
  'Your booking with Sarah Designer has been completed successfully',
  TRUE,
  NOW() - INTERVAL '2 days'
),
(
  'a0000000-0000-0000-0000-000000005003'::UUID,
  'a0000000-0000-0000-0000-000000000010'::UUID,
  'new_review',
  'You received a new review',
  'John User left you a 5-star review: Excellent designer!',
  FALSE,
  NOW()
)
ON CONFLICT DO NOTHING;

-- ===== ADMIN ACTIONS DATA =====
INSERT INTO admin_actions (
  id, admin_id, action_type, target_id, target_type, reason, details
)
VALUES
(
  'a0000000-0000-0000-0000-000000006001'::UUID,
  'a0000000-0000-0000-0000-000000000002'::UUID,
  'user_verified',
  'a0000000-0000-0000-0000-000000000010'::UUID,
  'user',
  'Email verification completed',
  '{"email": "designer1@example.com", "verification_method": "email"}'::JSONB
),
(
  'a0000000-0000-0000-0000-000000006002'::UUID,
  'a0000000-0000-0000-0000-000000000003'::UUID,
  'designer_featured',
  'a0000000-0000-0000-0000-000000000010'::UUID,
  'designer',
  'High quality designer with excellent reviews',
  '{"featured_until": "2025-01-25", "reason": "quality"}'::JSONB
),
(
  'a0000000-0000-0000-0000-000000006003'::UUID,
  'a0000000-0000-0000-0000-000000000002'::UUID,
  'payment_verified',
  'a0000000-0000-0000-0000-000000003001'::UUID,
  'payment',
  'Payment verification and settlement',
  '{"razorpay_payment_id": "pay_KTwKs8KZmZJ82N", "status": "verified"}'::JSONB
)
ON CONFLICT DO NOTHING;

-- ===== RE-ENABLE RLS =====
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE designers ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE disputes ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_actions ENABLE ROW LEVEL SECURITY;

-- Print summary
SELECT 'Seed data successfully inserted!' as message;
