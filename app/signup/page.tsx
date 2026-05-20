"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { FormEvent, useState } from "react";
import { createClient } from "../../lib/supabase/client";
import AuthNav from "../../components/AuthNav";

interface PasswordValidation {
  minLength: boolean;
  hasUppercase: boolean;
  hasLowercase: boolean;
  hasNumber: boolean;
  hasSpecial: boolean;
}

function validatePassword(password: string): PasswordValidation {
  return {
    minLength: password.length >= 8,
    hasUppercase: /[A-Z]/.test(password),
    hasLowercase: /[a-z]/.test(password),
    hasNumber: /[0-9]/.test(password),
    hasSpecial: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password),
  };
}

function isPasswordValid(validation: PasswordValidation): boolean {
  return (
    validation.minLength &&
    validation.hasUppercase &&
    validation.hasLowercase &&
    validation.hasNumber &&
    validation.hasSpecial
  );
}

export default function SignupPage() {
  const supabase = createClient();
  const searchParams = useSearchParams();
  const initialPlan = searchParams.get("plan") === "free" ? "free" : "pro";
  const [selectedPlan, setSelectedPlan] = useState<"pro" | "free">(initialPlan);
  const isDevelopment = process.env.NODE_ENV === "development";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [marketingConsent, setMarketingConsent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [passwordValidation, setPasswordValidation] = useState<PasswordValidation>({
    minLength: false,
    hasUppercase: false,
    hasLowercase: false,
    hasNumber: false,
    hasSpecial: false,
  });

  const handlePasswordChange = (value: string) => {
    setPassword(value);
    setPasswordValidation(validatePassword(value));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setShowSuccessModal(false);
    if (isDevelopment) {
      console.info("signup started");
    }

    // Validate password strength
    if (!isPasswordValid(passwordValidation)) {
      if (isDevelopment) {
        console.info("signup validation failed");
      }
      setError("Please ensure your password meets all requirements.");
      return;
    }

    if (password !== confirmPassword) {
      if (isDevelopment) {
        console.info("signup validation failed");
      }
      setError("Passwords do not match.");
      return;
    }

    if (!acceptTerms) {
      if (isDevelopment) {
        console.info("signup validation failed");
      }
      setError("You must agree to the Terms of Service and Privacy Policy.");
      return;
    }

    setIsLoading(true);
    const { data, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
        data: {
          plan: selectedPlan,
          selected_plan: selectedPlan,
          marketing_consent: marketingConsent,
          terms_accepted: true,
          terms_accepted_at: new Date().toISOString(),
        },
      },
    });
    setIsLoading(false);

    if (signUpError) {
      if (isDevelopment) {
        console.error("signup error", signUpError.message);
      }
      const normalized = signUpError.message.toLowerCase();
      if (normalized.includes("already") || normalized.includes("registered")) {
        setError("This email is already registered. Please log in instead.");
      } else {
        setError(signUpError.message);
      }
      return;
    }

    if (!data.user) {
      if (isDevelopment) {
        console.error("signup error", "Unable to create account. Please try again.");
      }
      setError("Unable to create account. Please try again.");
      return;
    }

    if (Array.isArray(data.user.identities) && data.user.identities.length === 0) {
      if (isDevelopment) {
        console.info("signup validation failed");
      }
      setError("This email is already registered. Please log in instead.");
      return;
    }

    if (isDevelopment) {
      console.info("signup success");
    }
    setShowSuccessModal(true);
  };

  const PasswordCheckItem = ({ passed, text }: { passed: boolean; text: string }) => (
    <div className="flex items-center gap-2 text-sm">
      <span className={`inline-block h-4 w-4 rounded-full text-center text-xs font-bold ${passed ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-400'}`}>
        {passed ? '✓' : '○'}
      </span>
      <span className={passed ? 'text-green-700' : 'text-gray-600'}>{text}</span>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <AuthNav />
      <main className="px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto w-full max-w-md rounded-xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
          <h1 className="text-center text-2xl font-bold text-gray-900">Create account</h1>
          <p className="mt-2 text-center text-sm text-gray-600">Start saving analyses to your dashboard.</p>
          <div className="mt-4 rounded-lg border border-slate-200 bg-slate-50 px-4 py-3">
            <div className="flex items-center justify-between">
              <label htmlFor="plan" className="text-sm font-semibold text-slate-900">
                Choose your plan
              </label>
              <span className="rounded-full bg-blue-100 px-2 py-0.5 text-xs font-semibold text-blue-700">
                50% OFF
              </span>
            </div>
            <select
              id="plan"
              name="plan"
              value={selectedPlan}
              onChange={(e) => setSelectedPlan(e.target.value === "free" ? "free" : "pro")}
              className="mt-3 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600/20"
            >
              <option value="pro">Pro — $8/month (50% off)</option>
              <option value="free">Free — 1 analysis per day</option>
            </select>
            <p className="mt-3 text-sm text-slate-600">
              {selectedPlan === "pro"
                ? "Unlimited analyses, full history, advanced insights, priority processing."
                : "1 analysis per day, last 3 analyses saved, basic reports."}
            </p>
          </div>

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
                disabled={isLoading}
                className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600/20 disabled:bg-gray-100 disabled:text-gray-500"
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
                autoComplete="new-password"
                required
                value={password}
                onChange={(e) => handlePasswordChange(e.target.value)}
                disabled={isLoading}
                className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600/20 disabled:bg-gray-100 disabled:text-gray-500"
              />
              {password && (
                <div className="mt-3 space-y-1 rounded-lg bg-gray-50 p-3">
                  <PasswordCheckItem passed={passwordValidation.minLength} text="Minimum 8 characters" />
                  <PasswordCheckItem passed={passwordValidation.hasUppercase} text="One uppercase letter" />
                  <PasswordCheckItem passed={passwordValidation.hasLowercase} text="One lowercase letter" />
                  <PasswordCheckItem passed={passwordValidation.hasNumber} text="One number" />
                  <PasswordCheckItem passed={passwordValidation.hasSpecial} text="One special character" />
                </div>
              )}
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                Confirm password
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                autoComplete="new-password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                disabled={isLoading}
                className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600/20 disabled:bg-gray-100 disabled:text-gray-500"
              />
              {confirmPassword && password !== confirmPassword && (
                <p className="mt-1 text-xs text-red-600">Passwords do not match.</p>
              )}
            </div>

            <label className="flex items-start gap-2 text-sm text-gray-700">
              <input
                type="checkbox"
                checked={acceptTerms}
                onChange={(e) => setAcceptTerms(e.target.checked)}
                disabled={isLoading}
                className="mt-0.5 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-600 disabled:bg-gray-100"
              />
              <span>
                I agree to the Terms of Service and Privacy Policy.
              </span>
            </label>

            <label className="flex items-start gap-2 text-sm text-gray-700">
              <input
                type="checkbox"
                checked={marketingConsent}
                onChange={(e) => setMarketingConsent(e.target.checked)}
                disabled={isLoading}
                className="mt-0.5 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-600 disabled:bg-gray-100"
              />
              <span>I agree to receive product updates and marketing emails.</span>
            </label>

            {error ? <p className="text-sm text-red-700">{error}</p> : null}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full rounded-lg bg-blue-600 px-4 py-2.5 font-semibold text-white hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 disabled:opacity-60"
            >
              {isLoading ? "Creating account..." : "Sign up"}
            </button>
          </form>

          <p className="mt-4 text-center text-sm text-gray-600">
            Already have an account?{" "}
            <Link href="/login" className="text-blue-700 hover:text-blue-800">
              Log in
            </Link>
          </p>
        </div>
      </main>
      {showSuccessModal ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 px-4 py-6"
          role="dialog"
          aria-modal="true"
          aria-labelledby="signup-success-title"
        >
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl sm:p-8">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-blue-100">
                <svg
                  className="h-6 w-6 text-blue-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1.8}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3 7.5l9 6 9-6M4.5 7h15a1.5 1.5 0 011.5 1.5v7a1.5 1.5 0 01-1.5 1.5h-15A1.5 1.5 0 013 15.5v-7A1.5 1.5 0 014.5 7z"
                  />
                </svg>
              </div>
              <div>
                <h2 id="signup-success-title" className="text-xl font-semibold text-slate-900">
                  Check your email
                </h2>
                <p className="mt-1 text-sm text-slate-600">
                  We sent a confirmation link to your inbox. Please confirm your email address to
                  activate your RunThisRepo account.
                </p>
              </div>
            </div>

            {email ? (
              <div className="mt-4 rounded-lg border border-blue-100 bg-blue-50 px-4 py-3 text-sm text-blue-900">
                Sent to <span className="font-semibold">{email}</span>
              </div>
            ) : null}

            <p className="mt-4 text-xs text-slate-500">
              Didn&apos;t receive it? Check your spam folder.
            </p>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/login"
                className="inline-flex w-full items-center justify-center rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2"
              >
                Go to login
              </Link>
              <Link
                href="/"
                className="inline-flex w-full items-center justify-center rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2"
              >
                Back to home
              </Link>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
