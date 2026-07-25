"use client";
import { useState } from "react";
import Button from "@/components/ui/Button";
import { createClient } from "@/lib/supabase/client";

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const supabase = createClient();
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: fullName, role: "designer" } }
    });
    setLoading(false);
    if (error) {
      setError(error.message);
      return;
    }
    // A DB trigger (see supabase/schema.sql) creates the matching `profiles`
    // and `designers` rows with status "pending_review" once data.user exists.
    if (data.user) setDone(true);
  }

  if (done) {
    return (
      <div className="app-shell flex flex-col justify-center px-6 min-h-screen text-center">
        <div className="font-display font-semibold text-xl mb-2">Application received</div>
        <div className="text-sm text-inksoft">
          An admin will review your profile before it goes live on Browse.
        </div>
      </div>
    );
  }

  return (
    <div className="app-shell flex flex-col justify-center px-6 min-h-screen">
      <div className="font-display font-semibold text-2xl mb-1">Apply as a designer</div>
      <div className="text-inksoft text-sm mb-6">Get booked for 15-minute design calls</div>
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
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="border border-line rounded-xl2 px-4 py-3 text-sm bg-white"
        />
        {error && <div className="text-xs text-coraldark">{error}</div>}
        <Button variant="primary" disabled={loading} className="mt-2">
          {loading ? "Submitting…" : "Submit application"}
        </Button>
      </form>
    </div>
  );
}
