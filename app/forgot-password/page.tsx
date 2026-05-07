"use client";

import { FormEvent, useState } from "react";
import AuthNav from "../../components/AuthNav";
import { createClient } from "../../lib/supabase/client";

export default function ForgotPasswordPage() {
  const supabase = createClient();
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setSuccessMessage(null);

    if (process.env.NODE_ENV === "development") {
      console.log("password reset requested");
    }

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });

    setIsLoading(false);

    if (error) {
      if (process.env.NODE_ENV === "development") {
        console.log("password reset request error", error.message);
      }
      setSuccessMessage(
        "If an account exists for this email, password reset instructions have been sent."
      );
      return;
    }

    if (process.env.NODE_ENV === "development") {
      console.log("password reset request success");
    }

    setSuccessMessage(
      "If an account exists for this email, password reset instructions have been sent."
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <AuthNav />
      <main className="px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto w-full max-w-md rounded-xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
          <h1 className="text-center text-2xl font-bold text-gray-900">Forgot password</h1>
          <p className="mt-2 text-center text-sm text-gray-600">
            Enter your account email and we&apos;ll send reset instructions.
          </p>

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

            {successMessage ? <p className="text-sm text-green-700">{successMessage}</p> : null}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full rounded-lg bg-blue-600 px-4 py-2.5 font-semibold text-white hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 disabled:opacity-60"
            >
              {isLoading ? "Sending..." : "Send reset link"}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}
