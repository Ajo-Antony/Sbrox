export type Role = "superadmin" | "admin" | "designer" | "user";

export interface AuthUser {
  id: string;
  email: string;
  fullName: string | null;
  role: Role;
  avatar_url: string | null;
  phone: string | null;
  createdAt: string;
}

export interface Session {
  user: AuthUser | null;
  isAuthenticated: boolean;
  role: Role | null;
}

export interface AuthContextType {
  user: AuthUser | null;
  session: Session | null;
  role: Role | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  logout: () => Promise<void>;
}
