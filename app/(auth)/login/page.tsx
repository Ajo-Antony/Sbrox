"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/Button";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) {
      setError(error.message);
      return;
    }
    // Middleware reads the profile's role on the next request and routes
    // to /user, /designer, /admin, or /super-admin accordingly.
    router.push("/");
    router.refresh();
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center px-6 bg-canvas">
      <div className="w-full max-w-sm">
        <div className="font-display font-semibold text-2xl mb-1">
          Quik<span className="text-coral">draw</span>
        </div>
        <div className="text-inksoft text-sm mb-6">Sign in to continue</div>
        <form onSubmit={handleLogin} className="flex flex-col gap-3">
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
            {loading ? "Signing in…" : "Sign in"}
          </Button>
        </form>
        <a href="/signup" className="text-center block text-xs text-inksoft mt-4">
          New designer? Apply here
        </a>
      </div>
    </div>
  );
}
