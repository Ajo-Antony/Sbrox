"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/Button";
import { createClient } from "@/lib/supabase/client";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  async function handleReset(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters long");
      return;
    }

    setLoading(true);

    try {
      const supabase = createClient();
      const { error: updateError } = await supabase.auth.updateUser({ password });

      if (updateError) {
        setError(updateError.message);
      } else {
        setSuccess(true);
        setTimeout(() => {
          router.push("/login");
        }, 2000);
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center px-6 bg-canvas">
        <div className="w-full max-w-sm text-center">
          <div className="font-display font-semibold text-xl mb-2">Password reset</div>
          <div className="text-sm text-inksoft mb-6">Your password has been successfully reset. Redirecting to login...</div>
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
        <div className="text-inksoft text-sm mb-6">Create a new password</div>
        <form onSubmit={handleReset} className="flex flex-col gap-3">
          <input
            type="password"
            required
            placeholder="New password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border border-line rounded-xl2 px-4 py-3 text-sm bg-white"
          />
          <input
            type="password"
            required
            placeholder="Confirm password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="border border-line rounded-xl2 px-4 py-3 text-sm bg-white"
          />
          {error && <div className="text-xs text-coraldark">{error}</div>}
          <Button variant="primary" disabled={loading} className="mt-2">
            {loading ? "Resetting…" : "Reset password"}
          </Button>
        </form>
        <a href="/login" className="text-center block text-xs text-inksoft mt-4">
          Back to login
        </a>
      </div>
    </div>
  );
}
