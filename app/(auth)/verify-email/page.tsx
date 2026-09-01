"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/Button";
import { createClient } from "@/lib/supabase/client";

export default function VerifyEmailPage() {
  const router = useRouter();
  const [verifying, setVerifying] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function verifyEmail() {
      try {
        const hash = window.location.hash;
        if (!hash) {
          setError("Invalid verification link");
          setVerifying(false);
          return;
        }

        const supabase = createClient();

        // Handle the verification token from the hash
        // Supabase automatically processes this via the auth listener
        const { data } = await supabase.auth.getSession();
        if (data.session) {
          setVerifying(false);
          setTimeout(() => {
            router.push("/");
          }, 1500);
        } else {
          setError("Verification failed. Please try signing up again.");
          setVerifying(false);
        }
      } catch (err) {
        setError("An error occurred during verification");
        setVerifying(false);
      }
    }

    verifyEmail();
  }, [router]);

  if (verifying) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center px-6 bg-canvas">
        <div className="w-full max-w-sm text-center">
          <div className="font-display font-semibold text-xl mb-2">Verifying email...</div>
          <div className="text-sm text-inksoft">Please wait while we verify your email address.</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center px-6 bg-canvas">
        <div className="w-full max-w-sm text-center">
          <div className="font-display font-semibold text-xl mb-2">Verification failed</div>
          <div className="text-sm text-coraldark mb-6">{error}</div>
          <a href="/signup" className="inline-block">
            <Button variant="primary">Try again</Button>
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center px-6 bg-canvas">
      <div className="w-full max-w-sm text-center">
        <div className="font-display font-semibold text-xl mb-2">Email verified!</div>
        <div className="text-sm text-inksoft">Your email has been verified. Redirecting...</div>
      </div>
    </div>
  );
}
