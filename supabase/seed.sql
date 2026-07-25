-- Quikdraw seed data
-- Run after schema.sql + policies.sql, against a project that already has
-- the auth.users rows created (sign up each test account first, then run
-- this to backfill role + designer profile + slots).

-- Example: promote a signed-up user to super_admin
-- update profiles set role = 'super_admin' where id = '00000000-0000-0000-0000-000000000000';

-- Example: promote a signed-up user to admin
-- update profiles set role = 'admin' where id = '11111111-1111-1111-1111-111111111111';

-- Example designer + open slots (replace profile_id with a real designer's id)
-- insert into designers (profile_id, headline, bio, categories, rate_per_15min, rating, lat, lng, status, is_available_now)
-- values (
--   '22222222-2222-2222-2222-222222222222',
--   'UI design · Mobile apps',
--   'Product designer specialising in fintech and SaaS dashboards.',
--   array['UI Design']::category[],
--   499,
--   4.9,
--   9.9312, 76.2673,
--   'approved',
--   true
-- );

-- insert into slots (designer_id, starts_at, duration_minutes)
-- select id, now() + (n || ' minutes')::interval, 15
-- from designers, generate_series(0, 30, 15) as n
-- where headline = 'UI design · Mobile apps';
