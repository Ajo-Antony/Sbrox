# Authentication & Role-Based Authorization System

This directory contains the complete authentication and role-based authorization system for the Quikdraw designer marketplace.

## Roles & Permissions

### Role Hierarchy
- **superadmin** (Level 3): Full platform access, manage admins, platform settings
- **admin** (Level 2): Moderate permissions, manage users/designers, disputes, categories
- **designer** (Level 1): Offer design services, manage portfolio, availability, view earnings
- **user** (Level 0): Book design services, manage profile, view bookings

### Permissions System
The system supports fine-grained permissions:
- `view:dashboard` - Access to dashboard
- `manage:users` - Create/update/delete users
- `manage:designers` - Approve/suspend designers
- `manage:bookings` - Handle bookings
- `manage:payments` - Process payments
- `manage:disputes` - Handle disputes
- `manage:categories` - Manage design categories
- `manage:admins` - Create/remove admins
- `manage:platform` - Platform settings
- `approve:designers` - Approve pending designers
- `view:analytics` - View platform analytics
- And more...

## Files Overview

### `types.ts`
Core TypeScript interfaces:
- `Role` - Role type definition
- `AuthUser` - User object with role
- `Session` - Session state
- `AuthContextType` - Auth context shape

### `roles.ts`
Role definitions and hierarchy:
- `rolePermissions` - Map of role -> permissions
- `getAllowedRoutesByRole` - Route access by role
- `getDefaultRouteByRole` - Landing page by role
- `hasHigherOrEqualRole()` - Role comparison
- `hasPermission()` - Permission check
- `isProtectedRoute()` - Route protection check

### `session.ts`
Session management utilities:
- `getSession()` - Get current session
- `getCurrentUser()` - Get user with role
- `getUserRole()` - Get just the role
- `logout()` - Sign out user
- `updateUserProfile()` - Update user info

### `permissions.ts`
Authorization checks:
- `isAuthorized()` - Check if user has permission
- `requiresRole()` - Role requirement check
- `canAccessRoute()` - Route access check
- `assertAuthorized()` - Throw if unauthorized
- `assertRole()` - Throw if role insufficient

### `middleware.ts`
Route protection:
- `isPublicRoute()` - Check if route is public
- `getRequiredRoleForRoute()` - Get role requirement
- `canAccessRoute()` - Route access check
- `getRedirectUrlForRole()` - Redirect destination by role

## Usage Examples

### Server-Side: Get Current User

```typescript
import { getCurrentUser } from "@/lib/auth/session";

async function getProfile(userId: string) {
  const user = await getCurrentUser(userId);
  if (!user) {
    throw new Error("User not found");
  }
  return user;
}
```

### Client-Side: Use Auth Hook

```typescript
"use client";
import { useAuth } from "@/hooks/useAuth";

export default function Dashboard() {
  const { user, isLoading, isAuthenticated } = useAuth();

  if (isLoading) return <div>Loading...</div>;
  if (!isAuthenticated) return <div>Not logged in</div>;

  return <div>Welcome, {user?.fullName}</div>;
}
```

### Check Permissions

```typescript
"use client";
import { usePermission } from "@/hooks/useAuth";

export default function AdminPanel() {
  const { hasPermission } = usePermission("manage:users");

  if (!hasPermission) {
    return <div>Access Denied</div>;
  }

  return <div>Admin Panel</div>;
}
```

### Check Role

```typescript
"use client";
import { useRole } from "@/hooks/useAuth";

export default function DesignerPanel() {
  const { isDesigner, isSuperAdmin } = useRole();

  if (!isDesigner && !isSuperAdmin) {
    return <div>Only designers can access this</div>;
  }

  return <div>Designer Tools</div>;
}
```

### Protected Route

```typescript
"use client";
import { useProtectedRoute } from "@/hooks/useAuth";

export default function AdminDashboard() {
  const { canAccess, isLoading } = useProtectedRoute("admin");

  if (isLoading) return <div>Loading...</div>;
  if (!canAccess) return <div>Access Denied</div>;

  return <div>Admin Dashboard</div>;
}
```

### Server Authorization

```typescript
import { assertAuthorized, assertRole } from "@/lib/auth/permissions";
import { getCurrentUser } from "@/lib/auth/session";

export async function POST(req: Request) {
  const user = await getCurrentUser(userId);
  
  // Check permission
  assertAuthorized(user.role, "manage:users");
  
  // Or check role
  assertRole(user.role, "admin");

  // Proceed with operation...
}
```

## Routes

### Public Routes
- `/` - Home
- `/login` - Sign in
- `/signup` - Create account
- `/forgot-password` - Password reset request
- `/reset-password` - Password reset form
- `/verify-email` - Email verification

### Protected Routes
- `/user/**` - User portal
- `/designer/**` - Designer portal
- `/admin/**` - Admin panel
- `/super-admin/**` - Superadmin panel

### Middleware Protection
The Next.js middleware (`middleware.ts`) automatically:
1. Checks if user is authenticated
2. Redirects to login if not
3. Validates role-based route access
4. Redirects to role-specific dashboard on login

## Setup Instructions

### 1. Install Dependencies
The project uses Supabase Auth. Make sure your `.env.local` has:

```env
NEXT_PUBLIC_SUPABASE_URL=your_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key
SUPABASE_SERVICE_ROLE_KEY=your_service_key
NEXTAUTH_SECRET=your_secret
NEXTAUTH_URL=http://localhost:3000
```

### 2. Database Schema
Ensure your Supabase database has a `profiles` table with:
- `id` (uuid, PK)
- `email` (text)
- `full_name` (text)
- `role` (enum: user, designer, admin, superadmin)
- `avatar_url` (text, nullable)
- `phone` (text, nullable)
- `created_at` (timestamp)

### 3. Enable Row-Level Security (RLS)
Configure RLS policies on the profiles table:
- Users can read their own profile
- Users can update their own profile
- Admins can read all profiles
- Superadmin can do anything

## Best Practices

1. **Always validate on the server**: Don't trust client-side role checks
2. **Use permissions, not roles**: Check specific permissions instead of roles when possible
3. **Protect API routes**: Use `assertAuthorized()` or `assertRole()` in API routes
4. **Loading states**: Always handle loading state in components using hooks
5. **Error boundaries**: Wrap role-protected components with error boundaries
6. **Environment variables**: Keep secrets in environment variables, never commit them

## Testing Auth

### Test Sign Up (All 4 Roles)
1. Go to `/signup`
2. Select role (user, designer)
3. Fill in details
4. Submit

### Test Sign In
1. Go to `/login`
2. Enter credentials
3. Check redirect to role dashboard

### Test Password Reset
1. Go to `/forgot-password`
2. Enter email
3. Check email for reset link
4. Reset password at `/reset-password`

### Test Role-Based Access
1. Sign in as different roles
2. Check dashboard redirects
3. Try accessing protected routes
4. Verify access control

## Troubleshooting

### "User not found" errors
- Check Supabase connection
- Ensure profiles table exists
- Verify RLS policies

### Redirect loops
- Check middleware.ts role logic
- Verify role is set correctly in profiles table
- Check route configuration

### Session not persisting
- Clear browser cookies/storage
- Check Supabase session settings
- Verify auth state listener in useAuth

## Future Enhancements

- [ ] OAuth integration (Google, GitHub)
- [ ] Two-factor authentication
- [ ] Session management dashboard
- [ ] Audit logging for auth events
- [ ] Rate limiting on auth endpoints
- [ ] Email verification requirement
- [ ] Social login
- [ ] API key management for integrations
