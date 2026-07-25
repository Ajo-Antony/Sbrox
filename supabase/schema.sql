-- Quikdraw schema
-- Run in order: schema.sql -> policies.sql -> seed.sql

create extension if not exists "uuid-ossp";

do $$ begin
  create type role as enum ('user', 'designer', 'admin', 'super_admin');
exception when duplicate_object then null; end $$;

do $$ begin
  create type category as enum ('UI Design', 'Website Redesign', 'Photoshop');
exception when duplicate_object then null; end $$;

do $$ begin
  create type designer_status as enum ('pending_review', 'approved', 'suspended');
exception when duplicate_object then null; end $$;

do $$ begin
  create type booking_status as enum (
    'pending', 'confirmed', 'in_progress', 'completed', 'cancelled', 'disputed'
  );
exception when duplicate_object then null; end $$;

do $$ begin
  create type payment_status as enum ('created', 'paid', 'failed', 'refunded');
exception when duplicate_object then null; end $$;

-- One row per auth.users user, carrying the role that drives every
-- middleware/RLS decision in the app.
create table if not exists profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  role role not null default 'user',
  full_name text not null,
  avatar_url text,
  phone text,
  created_at timestamptz not null default now()
);

create table if not exists designers (
  id uuid primary key default uuid_generate_v4(),
  profile_id uuid not null references profiles (id) on delete cascade,
  headline text not null,
  bio text not null default '',
  categories category[] not null default '{}',
  rate_per_15min integer not null check (rate_per_15min > 0),
  rating numeric(2, 1) not null default 5.0,
  lat double precision not null,
  lng double precision not null,
  status designer_status not null default 'pending_review',
  is_available_now boolean not null default false,
  created_at timestamptz not null default now(),
  unique (profile_id)
);

create table if not exists portfolio_items (
  id uuid primary key default uuid_generate_v4(),
  designer_id uuid not null references designers (id) on delete cascade,
  image_url text not null,
  caption text,
  created_at timestamptz not null default now()
);

create table if not exists slots (
  id uuid primary key default uuid_generate_v4(),
  designer_id uuid not null references designers (id) on delete cascade,
  starts_at timestamptz not null,
  duration_minutes integer not null default 15,
  locked_by_booking_id uuid, -- set by book_slot(); null means free
  created_at timestamptz not null default now()
);
create index if not exists slots_designer_free_idx on slots (designer_id) where locked_by_booking_id is null;

create table if not exists bookings (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references profiles (id),
  designer_id uuid not null references designers (id),
  slot_id uuid not null references slots (id),
  category category not null,
  status booking_status not null default 'pending',
  rate integer not null,
  tip integer not null default 0,
  total integer generated always as (rate + tip) stored,
  payment_method text,
  created_at timestamptz not null default now()
);

do $$ begin
  alter table slots
    add constraint slots_locked_by_booking_fk
    foreign key (locked_by_booking_id) references bookings (id) on delete set null;
exception when duplicate_object then null; end $$;

create table if not exists payments (
  id uuid primary key default uuid_generate_v4(),
  booking_id uuid not null references bookings (id) on delete cascade,
  razorpay_order_id text not null unique,
  razorpay_payment_id text,
  amount integer not null,
  status payment_status not null default 'created',
  created_at timestamptz not null default now()
);

-- Creates the profiles row (and, for designer signups, the pending
-- designers row) the moment a new auth.users record appears.
create or replace function handle_new_user()
returns trigger as $$
begin
  insert into profiles (id, role, full_name)
  values (
    new.id,
    coalesce((new.raw_user_meta_data ->> 'role')::role, 'user'),
    coalesce(new.raw_user_meta_data ->> 'full_name', 'New user')
  )
  on conflict (id) do nothing;

  if (new.raw_user_meta_data ->> 'role') = 'designer' then
    insert into designers (profile_id, headline, rate_per_15min, lat, lng)
    values (new.id, 'New designer', 399, 9.9312, 76.2673)
    on conflict (profile_id) do nothing;
  end if;

  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure handle_new_user();

-- Atomically locks a free slot and inserts the booking in one transaction,
-- so two users racing for the same 15-minute slot can't both win it.
create or replace function book_slot(
  p_user_id uuid,
  p_designer_id uuid,
  p_slot_id uuid,
  p_category category,
  p_tip integer default 0,
  p_payment_method text default null
)
returns uuid as $$
declare
  v_booking_id uuid;
  v_rate integer;
begin
  select rate_per_15min into v_rate from designers where id = p_designer_id;
  if v_rate is null then
    raise exception 'Designer not found';
  end if;

  -- Row-level lock: fails immediately if another transaction is already
  -- booking this slot, instead of both succeeding.
  perform 1 from slots
    where id = p_slot_id and designer_id = p_designer_id and locked_by_booking_id is null
    for update;
  if not found then
    raise exception 'Slot no longer available';
  end if;

  insert into bookings (user_id, designer_id, slot_id, category, rate, tip, payment_method)
  values (p_user_id, p_designer_id, p_slot_id, p_category, v_rate, p_tip, p_payment_method)
  returning id into v_booking_id;

  update slots set locked_by_booking_id = v_booking_id where id = p_slot_id;

  return v_booking_id;
end;
$$ language plpgsql security definer;
