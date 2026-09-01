"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { getCurrentUser, logout as logoutUser } from "@/lib/auth/session";
import { hasPermission, getDefaultRouteByRole } from "@/lib/auth/roles";
import type { AuthUser, Role } from "@/lib/auth/types";
import type { Permission } from "@/lib/auth/roles";

export function useAuth() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    async function loadUser() {
      try {
        const {
          data: { session }
        } = await supabase.auth.getSession();

        if (session?.user) {
          const authUser = await getCurrentUser(session.user.id);
          setUser(authUser);
          setIsAuthenticated(!!authUser);
        } else {
          setUser(null);
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error("Error loading user:", error);
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    }

    loadUser();

    const {
      data: { subscription }
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        const authUser = await getCurrentUser(session.user.id);
        setUser(authUser);
        setIsAuthenticated(!!authUser);
      } else {
        setUser(null);
        setIsAuthenticated(false);
      }
    });

    return () => {
      subscription?.unsubscribe();
    };
  }, [supabase]);

  async function logout() {
    try {
      await logoutUser();
      setUser(null);
      setIsAuthenticated(false);
    } catch (error) {
      console.error("Error logging out:", error);
      throw error;
    }
  }

  return {
    user,
    isLoading,
    isAuthenticated,
    logout
  };
}

export function useRole() {
  const { user, isLoading } = useAuth();

  return {
    role: user?.role || null,
    isLoading,
    isUser: user?.role === "user",
    isDesigner: user?.role === "designer",
    isAdmin: user?.role === "admin",
    isSuperAdmin: user?.role === "superadmin"
  };
}

export function useProtectedRoute(requiredRole?: Role) {
  const router = useRouter();
  const { user, isLoading, isAuthenticated } = useAuth();

  useEffect(() => {
    if (isLoading) return;

    if (!isAuthenticated) {
      router.push("/login");
      return;
    }

    if (requiredRole && user && user.role !== requiredRole) {
      const defaultRoute = getDefaultRouteByRole(user.role);
      router.push(defaultRoute);
    }
  }, [isLoading, isAuthenticated, requiredRole, user, router]);

  return {
    isLoading,
    isAuthenticated,
    user,
    canAccess: isAuthenticated && (!requiredRole || user?.role === requiredRole)
  };
}

export function usePermission(permission: Permission) {
  const { user } = useAuth();

  return {
    hasPermission: user ? hasPermission(user.role, permission) : false,
    user
  };
}

export function usePermissions(...permissions: Permission[]) {
  const { user } = useAuth();

  return {
    hasAny: user ? permissions.some((p) => hasPermission(user.role, p)) : false,
    hasAll: user ? permissions.every((p) => hasPermission(user.role, p)) : false,
    user
  };
}
