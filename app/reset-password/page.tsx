"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AuthNav from "../../components/AuthNav";
import { createClient } from "../../lib/supabase/client";

export default function ResetPasswordPage() {
  const supabase = createClient();
  const router = useRouter();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [hasSession, setHasSession] = useState(false);

  useEffect(() => {
    let mounted = true;

    const initializeRecovery = async () => {
      const currentUrl = new URL(window.location.href);
      const code = currentUrl.searchParams.get("code");

      if (code) {
        const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);
        if (exchangeError && mounted) {
          setError("Password reset link is invalid or expired.");
        }
      }

      const { data } = await supabase.auth.getSession();
      if (mounted && data.session) {
        setHasSession(true);
      }

      if (mounted) {
        setIsReady(true);
      }
    };

    void initializeRecovery();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "PASSWORD_RECOVERY" || session) {
        setHasSession(true);
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [supabase.auth]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (!hasSession) {
      setError("Reset session is missing or expired. Please request a new reset link.");
      return;
    }

    setIsLoading(true);
    const { error: updateError } = await supabase.auth.updateUser({ password: newPassword });
    setIsLoading(false);

    if (updateError) {
      setError(updateError.message);
      return;
    }

    router.push("/login?message=password_reset_success");
    router.refresh();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <AuthNav />
      <main className="px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto w-full max-w-md rounded-xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
          <h1 className="text-center text-2xl font-bold text-gray-900">Reset password</h1>
          <p className="mt-2 text-center text-sm text-gray-600">
            Set a new password for your account.
          </p>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div>
              <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">
                New password
              </label>
              <input
                id="newPassword"
                name="newPassword"
                type="password"
                autoComplete="new-password"
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600/20"
              />
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                Confirm new password
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                autoComplete="new-password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600/20"
              />
            </div>

            {error ? <p className="text-sm text-red-700">{error}</p> : null}
            {!hasSession && isReady ? (
              <p className="text-sm text-amber-700">
                Waiting for reset session. If this persists, request a new reset link.
              </p>
            ) : null}

            <button
              type="submit"
              disabled={isLoading || !isReady}
              className="w-full rounded-lg bg-blue-600 px-4 py-2.5 font-semibold text-white hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 disabled:opacity-60"
            >
              {isLoading ? "Updating password..." : "Update password"}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}
