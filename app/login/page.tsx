"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, useMemo, useState } from "react";
import { createClient } from "../../lib/supabase/client";
import AuthNav from "../../components/AuthNav";

export default function LoginPage() {
  const supabase = createClient();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const callbackError = useMemo(() => {
    if (searchParams.get("error") === "auth_callback_failed") {
      return "Authentication failed. Please try logging in again.";
    }
    return null;
  }, [searchParams]);

  const resetSuccessMessage = useMemo(() => {
    if (searchParams.get("message") === "password_updated") {
      return "Your password has been updated. Please log in with your new password.";
    }
    if (searchParams.get("message") === "logged_out") {
      return "You have been logged out successfully.";
    }
    return null;
  }, [searchParams]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setIsLoading(true);

    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setIsLoading(false);

    if (signInError) {
      const normalized = signInError.message.toLowerCase();
      if (normalized.includes("email not confirmed")) {
        setError("Please confirm your email before logging in. Check your inbox.");
      } else if (
        normalized.includes("invalid login credentials") ||
        normalized.includes("invalid_credentials")
      ) {
        setError("Wrong email or password.");
      } else {
        setError(signInError.message);
      }
      return;
    }

    router.push("/dashboard");
    router.refresh();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <AuthNav />
      <main className="px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto w-full max-w-md rounded-xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
          <h1 className="text-center text-2xl font-bold text-gray-900">Log in</h1>
          <p className="mt-2 text-center text-sm text-gray-600">Sign in to access your dashboard.</p>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600/20"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600/20"
              />
            </div>

            {callbackError ? <p className="text-sm text-red-700">{callbackError}</p> : null}
            {resetSuccessMessage ? (
              <p className="text-sm text-green-700">{resetSuccessMessage}</p>
            ) : null}
            {error ? <p className="text-sm text-red-700">{error}</p> : null}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full rounded-lg bg-blue-600 px-4 py-2.5 font-semibold text-white hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 disabled:opacity-60"
            >
              {isLoading ? "Signing in..." : "Log in"}
            </button>
          </form>

          <div className="mt-4 flex flex-col items-center gap-2 text-sm">
            <Link href="/signup" className="text-blue-700 hover:text-blue-800">
              Need an account? Sign up
            </Link>
            <Link href="/forgot-password" className="text-gray-600 hover:text-gray-800">
              Forgot password?
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
