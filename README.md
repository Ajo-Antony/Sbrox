# Quikdraw

15-minute instant design bookings — Next.js 15 (App Router) + Supabase + Razorpay.

## Folder structure

```
app/
  (auth)/login, (auth)/signup      — shared auth, no role required
  user/                            — browse, book, pay, track bookings
  designer/                        — dashboard, bookings, availability, portfolio, earnings
  admin/                           — designer approvals, all bookings, categories, disputes
  super-admin/                     — cross-market analytics, admin management, commission, settings
  api/                             — designers, slots, bookings, payments/webhook, admin/designers/[id]/approve
components/
  ui/                              — Button, Card, Badge, StatCard (shared primitives)
  shared/                          — BottomNav (role-aware), TopBar
  user/, designer/, admin/, super-admin/  — role-specific pieces
lib/
  supabase/                        — browser client, server client, middleware session helper
  data.ts                          — data-access seam (currently reads lib/mock-data.ts)
  types.ts, constants.ts, utils.ts
supabase/
  schema.sql, policies.sql, seed.sql
middleware.ts                      — refreshes the session + gates /designer, /admin, /super-admin by role
```

## Roles

One `profiles.role` enum drives everything: `user`, `designer`, `admin`, `super_admin`.
`middleware.ts` reads it on every request and redirects anyone without
sufficient rank away from a guarded route. `app/page.tsx` sends a signed-in
user straight to their role's home screen.

## Getting it running

1. `npm install`
2. Create a Supabase project, then in the SQL editor run, in order:
   `supabase/schema.sql` → `supabase/policies.sql`.
3. Copy `.env.example` to `.env.local` and fill in the Supabase + Razorpay keys.
4. Sign up a test account at `/signup`, then in the SQL editor promote it
   (see the commented examples in `supabase/seed.sql`) to `admin` or
   `super_admin` as needed, and add a few `designers` + `slots` rows so
   Browse has something to show.
5. `npm run dev`

## Wiring the real data

Every screen currently reads from `lib/mock-data.ts` through `lib/data.ts`
so the UI runs before a Supabase project is even connected. Each function in
`lib/data.ts` has the real Supabase query commented directly above the mock
return — uncomment it once `schema.sql` is applied and seeded, and no
call site elsewhere in `app/` needs to change.

## Booking flow, end to end

1. `GET /api/slots?designerId=` — free slots for a designer.
2. `POST /api/bookings` — calls the `book_slot()` Postgres function, which
   row-locks the slot and inserts the booking in one transaction so two
   people can't win the same 15-minute slot.
3. Client creates a Razorpay order for the booking total and opens Razorpay
   Checkout (UPI / card / wallet / net banking all come bundled).
4. `POST /api/payments/webhook` verifies the Razorpay signature and flips
   the booking to `confirmed` once `payment.captured` arrives.

## Notes

- Distance ("near me") is a Haversine calculation in `lib/utils.ts` for now;
  swap for a PostGIS `<->` query once designer density makes an index worth it.
- Realtime: subscribe to `slots` changes scoped to a `designer_id` so a
  booking screen can grey out a slot the instant someone else locks it.
