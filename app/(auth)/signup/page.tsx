"use client";
import { useState } from "react";
import Button from "@/components/ui/Button";
import { createClient } from "@/lib/supabase/client";
import type { Role } from "@/lib/auth/types";

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [role, setRole] = useState<Role>("user");
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const roleDescriptions: Record<Role, string> = {
    user: "Book design services",
    designer: "Offer 15-minute design calls",
    admin: "Admin panel access (request only)",
    superadmin: "Super admin access (request only)"
  };

  const isRestricted = role === "admin" || role === "superadmin";

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (isRestricted) {
      setError("Admin and superadmin roles cannot be self-registered. Please contact support.");
      setLoading(false);
      return;
    }

    const supabase = createClient();
    const { data, error: signupError } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: fullName, role } }
    });

    setLoading(false);

    if (signupError) {
      if (
        signupError.message.includes("profiles") ||
        signupError.message.includes("Database") ||
        signupError.status === 500
      ) {
        setError("Database tables missing: Please run supabase/schema.sql, policies.sql, and seed.sql in your Supabase SQL Editor.");
      } else {
        setError(signupError.message);
      }
      return;
    }

    if (data.user) setDone(true);
  }

  if (done) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center px-6 bg-canvas text-center">
        <div className="w-full max-w-sm">
          <div className="font-display font-semibold text-xl mb-2">Welcome to Quikdraw!</div>
          <div className="text-sm text-inksoft mb-4">
            {role === "designer"
              ? "An admin will review your profile before it goes live on Browse."
              : "Your account has been created. You can now sign in."}
          </div>
          <a href="/login" className="inline-block">
            <Button variant="primary">Sign in</Button>
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center px-6 bg-canvas">
      <div className="w-full max-w-sm">
        <div className="font-display font-semibold text-2xl mb-1">
          Quik<span className="text-coral">draw</span>
        </div>
        <div className="text-inksoft text-sm mb-6">Create your account</div>
        <form onSubmit={handleSignup} className="flex flex-col gap-3">
          <input
            required
            placeholder="Full name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="border border-line rounded-xl2 px-4 py-3 text-sm bg-white"
          />
          <input
            type="email"
            required
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border border-line rounded-xl2 px-4 py-3 text-sm bg-white"
          />
          <input
            type="password"
            required
            placeholder="Password (min 8 characters)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border border-line rounded-xl2 px-4 py-3 text-sm bg-white"
          />

          <div className="border border-line rounded-xl2 bg-white p-3">
            <label className="text-xs font-semibold text-ink mb-2 block">Account Type</label>
            <div className="flex flex-col gap-2">
              {(["user", "designer", "admin", "superadmin"] as Role[]).map((r) => (
                <label key={r} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="role"
                    value={r}
                    checked={role === r}
                    onChange={(e) => setRole(e.target.value as Role)}
                    disabled={r === "admin" || r === "superadmin"}
                    className="w-4 h-4"
                  />
                  <span className="text-sm">
                    {r.charAt(0).toUpperCase() + r.slice(1).replace(/([A-Z])/g, " $1")}
                  </span>
                  {(r === "admin" || r === "superadmin") && <span className="text-xs text-inksoft">(Request only)</span>}
                </label>
              ))}
            </div>
            <div className="text-xs text-inksoft mt-3">{roleDescriptions[role]}</div>
          </div>

          {error && <div className="text-xs text-coraldark">{error}</div>}
          <Button variant="primary" disabled={loading} className="mt-2">
            {loading ? "Creating account…" : "Sign up"}
          </Button>
        </form>
        <a href="/login" className="text-center block text-xs text-inksoft mt-4">
          Already have an account? Sign in
        </a>
      </div>
    </div>
  );
}
