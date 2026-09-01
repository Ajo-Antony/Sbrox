"use client";
import { useState } from "react";
import Button from "@/components/ui/Button";
import { createClient } from "@/lib/supabase/client";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const supabase = createClient();
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`
      });

      if (resetError) {
        setError(resetError.message);
      } else {
        setSubmitted(true);
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  if (submitted) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center px-6 bg-canvas">
        <div className="w-full max-w-sm text-center">
          <div className="font-display font-semibold text-xl mb-2">Check your email</div>
          <div className="text-sm text-inksoft mb-6">
            We've sent a password reset link to <span className="font-medium">{email}</span>. Check your inbox and click
            the link to reset your password.
          </div>
          <a href="/login" className="text-sm text-coral hover:text-coraldark">
            Back to login
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
        <div className="text-inksoft text-sm mb-6">Reset your password</div>
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <input
            type="email"
            required
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border border-line rounded-xl2 px-4 py-3 text-sm bg-white"
          />
          {error && <div className="text-xs text-coraldark">{error}</div>}
          <Button variant="primary" disabled={loading} className="mt-2">
            {loading ? "Sending…" : "Send reset link"}
          </Button>
        </form>
        <a href="/login" className="text-center block text-xs text-inksoft mt-4">
          Remember your password? Sign in
        </a>
      </div>
    </div>
  );
}
