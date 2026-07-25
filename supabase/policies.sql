-- Quikdraw RLS policies
-- Run after schema.sql. Every table starts locked down; policies below
-- open exactly the access each role needs.

alter table profiles enable row level security;
alter table designers enable row level security;
alter table portfolio_items enable row level security;
alter table slots enable row level security;
alter table bookings enable row level security;
alter table payments enable row level security;

-- Helper: current user's role, read once per statement.
create function current_role_name()
returns role as $$
  select role from profiles where id = auth.uid();
$$ language sql stable security definer;

-- ---------- profiles ----------
create policy "read own profile" on profiles
  for select using (id = auth.uid());

create policy "admins read all profiles" on profiles
  for select using (current_role_name() in ('admin', 'super_admin'));

create policy "update own profile" on profiles
  for update using (id = auth.uid());

create policy "super_admin manages roles" on profiles
  for update using (current_role_name() = 'super_admin');

-- ---------- designers ----------
create policy "anyone reads approved designers" on designers
  for select using (status = 'approved' or profile_id = auth.uid());

create policy "admins read all designers" on designers
  for select using (current_role_name() in ('admin', 'super_admin'));

create policy "designer updates own listing" on designers
  for update using (profile_id = auth.uid());

create policy "admins moderate designers" on designers
  for update using (current_role_name() in ('admin', 'super_admin'));

-- ---------- portfolio_items ----------
create policy "anyone reads portfolio of approved designers" on portfolio_items
  for select using (
    exists (
      select 1 from designers d
      where d.id = designer_id and (d.status = 'approved' or d.profile_id = auth.uid())
    )
  );

create policy "designer manages own portfolio" on portfolio_items
  for all using (
    exists (select 1 from designers d where d.id = designer_id and d.profile_id = auth.uid())
  );

-- ---------- slots ----------
create policy "anyone reads slots of approved designers" on slots
  for select using (
    exists (select 1 from designers d where d.id = designer_id and d.status = 'approved')
  );

create policy "designer manages own slots" on slots
  for all using (
    exists (select 1 from designers d where d.id = designer_id and d.profile_id = auth.uid())
  );

-- ---------- bookings ----------
create policy "user reads own bookings" on bookings
  for select using (user_id = auth.uid());

create policy "designer reads bookings made with them" on bookings
  for select using (
    exists (select 1 from designers d where d.id = designer_id and d.profile_id = auth.uid())
  );

create policy "admins read all bookings" on bookings
  for select using (current_role_name() in ('admin', 'super_admin'));

create policy "designer updates status of own bookings" on bookings
  for update using (
    exists (select 1 from designers d where d.id = designer_id and d.profile_id = auth.uid())
  );

create policy "admins resolve disputed bookings" on bookings
  for update using (current_role_name() in ('admin', 'super_admin'));

-- Inserts always go through book_slot(), which runs as security definer,
-- so no direct insert policy is needed for regular users.

-- ---------- payments ----------
-- Payments are only ever written by the service-role client from the
-- webhook route, so the only policy here is read access for the payer.
create policy "user reads own payments" on payments
  for select using (
    exists (select 1 from bookings b where b.id = booking_id and b.user_id = auth.uid())
  );

create policy "admins read all payments" on payments
  for select using (current_role_name() in ('admin', 'super_admin'));
