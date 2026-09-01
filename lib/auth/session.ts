import { createClient } from "@/lib/supabase/client";
import type { AuthUser, Role, Session } from "./types";

export async function getSession(): Promise<Session | null> {
  try {
    const supabase = createClient();
    const {
      data: { session }
    } = await supabase.auth.getSession();

    if (!session?.user) {
      return null;
    }

    const user = await getCurrentUser(session.user.id);
    return {
      user,
      isAuthenticated: !!user,
      role: user?.role ?? null
    };
  } catch (error) {
    console.error("Error getting session:", error);
    return null;
  }
}

export async function getCurrentUser(userId: string): Promise<AuthUser | null> {
  try {
    const supabase = createClient();

    const { data: profile, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single();

    if (error || !profile) {
      return null;
    }

    return {
      id: profile.id,
      email: profile.email || "",
      fullName: profile.full_name || null,
      role: (profile.role as Role) || "user",
      avatar_url: profile.avatar_url || null,
      phone: profile.phone || null,
      createdAt: profile.created_at
    };
  } catch (error) {
    console.error("Error getting current user:", error);
    return null;
  }
}

export async function getUserRole(userId: string): Promise<Role | null> {
  try {
    const user = await getCurrentUser(userId);
    return user?.role ?? null;
  } catch (error) {
    console.error("Error getting user role:", error);
    return null;
  }
}

export async function logout(): Promise<void> {
  try {
    const supabase = createClient();
    await supabase.auth.signOut();
  } catch (error) {
    console.error("Error logging out:", error);
    throw error;
  }
}

export async function updateUserProfile(userId: string, data: Partial<AuthUser>): Promise<AuthUser | null> {
  try {
    const supabase = createClient();

    const { error } = await supabase
      .from("profiles")
      .update({
        full_name: data.fullName,
        avatar_url: data.avatar_url,
        phone: data.phone
      })
      .eq("id", userId);

    if (error) {
      throw error;
    }

    return getCurrentUser(userId);
  } catch (error) {
    console.error("Error updating user profile:", error);
    return null;
  }
}
