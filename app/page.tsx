"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import type { User } from "@supabase/supabase-js";
import { createClient } from "../lib/supabase/client";
import AuthNav from "../components/AuthNav";
import PublicFooter from "../components/PublicFooter";

export default function HomePage() {
  const [user, setUser] = useState<User | null>(null);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    let mounted = true;

    const loadUser = async () => {
      const { data } = await supabase.auth.getUser();
      if (mounted) {
        setUser(data.user ?? null);
        setIsHydrated(true);
      }
    };

    loadUser();

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (mounted) {
        setUser(session?.user ?? null);
      }
    });

    return () => {
      mounted = false;
      authListener.subscription.unsubscribe();
    };
  }, []);

  // Prevent hydration mismatch
  if (!isHydrated) {
    return null;
  }

  // Polished SaaS landing page for all users (logged-in and logged-out)
  return (
    <div className="relative min-h-screen bg-slate-50 overflow-hidden">
      {/* Premium background with multiple gradient layers */}
      <div className="absolute inset-0">
        {/* Base gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-slate-50 via-blue-50/30 to-slate-50"></div>

        {/* Large radial gradient for hero section */}
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-96 h-96 bg-gradient-to-br from-blue-400/15 via-blue-300/10 to-transparent rounded-full blur-3xl"></div>

        {/* Secondary accent glow on the right */}
        <div className="absolute top-1/3 -right-32 w-96 h-96 bg-gradient-to-l from-indigo-300/5 via-blue-200/5 to-transparent rounded-full blur-3xl"></div>

        {/* Subtle dot pattern using radial gradient */}
        <div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage:
              "radial-gradient(circle, rgba(71, 85, 105, 0.15) 1px, transparent 1px)",
            backgroundSize: "50px 50px",
          }}
        ></div>
      </div>

      {/* Content */}
      <div className="relative z-10">
        <AuthNav />

        <main className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          {/* Hero Section */}
          <section className="py-20 sm:py-28">
            <div className="relative">
              {/* Gradient blob behind hero text */}
              <div className="absolute -inset-10 bg-gradient-to-br from-blue-100/40 to-indigo-100/20 rounded-3xl blur-2xl -z-10"></div>

              <div className="text-center">
                <div className="inline-flex items-center gap-2 mb-6 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full border border-slate-200/50 shadow-sm">
                  <span className="inline-block w-2 h-2 bg-blue-600 rounded-full"></span>
                  <span className="text-xs font-semibold text-slate-700">Analyze GitHub Repos Instantly</span>
                </div>

                <h1 className="text-5xl font-bold tracking-tight text-slate-900 sm:text-6xl md:text-7xl">
                  Run any GitHub repo
                  <span className="block bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                    without guessing
                  </span>
                </h1>

                <p className="mx-auto mt-8 max-w-3xl text-lg text-slate-600 sm:text-xl leading-relaxed">
                  Get setup steps, environment variables, common fixes, and safety insights before you run unfamiliar code.
                </p>

                <div className="mx-auto mt-4 max-w-2xl">
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50/50 rounded-lg border border-blue-200/30">
                    <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m7 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="text-sm text-slate-600">
                      No code execution. Public repositories only. Setup guidance in seconds.
                    </span>
                  </div>
                </div>

                {/* CTA Buttons */}
                <div className="mx-auto mt-12 flex flex-col gap-4 sm:flex-row sm:justify-center">
                  {user ? (
                    <>
                      <Link
                        href="/dashboard"
                        className="rounded-lg bg-blue-600 px-8 py-4 font-semibold text-white hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 shadow-lg hover:shadow-xl"
                      >
                        Analyze repository
                      </Link>
                      <Link
                        href="/dashboard"
                        className="rounded-lg border border-slate-300 bg-white px-8 py-4 font-semibold text-slate-900 hover:bg-slate-50 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 shadow-md"
                      >
                        View dashboard
                      </Link>
                    </>
                  ) : (
                    <>
                      <Link
                        href="/signup"
                        className="rounded-lg bg-blue-600 px-8 py-4 font-semibold text-white hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 shadow-lg hover:shadow-xl"
                      >
                        Get started
                      </Link>
                      <Link
                        href="/login"
                        className="rounded-lg border border-slate-300 bg-white px-8 py-4 font-semibold text-slate-900 hover:bg-slate-50 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 shadow-md"
                      >
                        Log in
                      </Link>
                    </>
                  )}
                </div>
              </div>

              {/* Hero preview card */}
              <div className="mt-16 mx-auto max-w-3xl">
                <div className="rounded-2xl bg-white/60 backdrop-blur-sm border border-slate-200/50 shadow-2xl overflow-hidden">
                  <div className="bg-gradient-to-r from-slate-100 to-blue-50 px-6 py-4 border-b border-slate-200/50">
                    <div className="flex gap-2">
                      <div className="w-3 h-3 rounded-full bg-red-400"></div>
                      <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                      <div className="w-3 h-3 rounded-full bg-green-400"></div>
                    </div>
                  </div>
                  <div className="p-6 space-y-3">
                    <div className="h-4 bg-gradient-to-r from-slate-200 to-slate-100 rounded w-3/4"></div>
                    <div className="h-3 bg-slate-100 rounded w-full"></div>
                    <div className="h-3 bg-slate-100 rounded w-5/6"></div>
                    <div className="pt-2 space-y-2">
                      <div className="h-2 bg-blue-100 rounded w-full"></div>
                      <div className="h-2 bg-blue-100 rounded w-4/5"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Features Section */}
          <section id="features" className="py-16 sm:py-20">
            <div className="mb-12 text-center">
              <h2 className="text-4xl font-bold text-slate-900 sm:text-5xl">
                Everything you need to get started
              </h2>
              <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-600">
                Get all the information needed to run any repository safely and correctly.
              </p>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {/* Feature 1 */}
              <div className="group rounded-2xl border border-slate-200/60 bg-white/70 backdrop-blur-sm p-6 shadow-md hover:shadow-lg transition-all hover:border-slate-300 hover:bg-white">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-100 to-blue-50 group-hover:from-blue-200 group-hover:to-blue-100 transition-colors">
                  <svg
                    className="h-6 w-6 text-blue-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <h3 className="font-semibold text-slate-900">Setup Guide</h3>
                <p className="mt-2 text-sm text-slate-600">
                  Step-by-step instructions for Windows, macOS, and Linux
                </p>
              </div>

              {/* Feature 2 */}
              <div className="group rounded-2xl border border-slate-200/60 bg-white/70 backdrop-blur-sm p-6 shadow-md hover:shadow-lg transition-all hover:border-slate-300 hover:bg-white">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-100 to-blue-50 group-hover:from-blue-200 group-hover:to-blue-100 transition-colors">
                  <svg
                    className="h-6 w-6 text-blue-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
                    />
                  </svg>
                </div>
                <h3 className="font-semibold text-slate-900">Env Variables</h3>
                <p className="mt-2 text-sm text-slate-600">
                  Identify and configure all required environment variables
                </p>
              </div>

              {/* Feature 3 */}
              <div className="group rounded-2xl border border-slate-200/60 bg-white/70 backdrop-blur-sm p-6 shadow-md hover:shadow-lg transition-all hover:border-slate-300 hover:bg-white">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-100 to-blue-50 group-hover:from-blue-200 group-hover:to-blue-100 transition-colors">
                  <svg
                    className="h-6 w-6 text-blue-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                  </svg>
                </div>
                <h3 className="font-semibold text-slate-900">Error Fixes</h3>
                <p className="mt-2 text-sm text-slate-600">
                  Get solutions for common errors with practical next steps
                </p>
              </div>

              {/* Feature 4 */}
              <div className="group rounded-2xl border border-slate-200/60 bg-white/70 backdrop-blur-sm p-6 shadow-md hover:shadow-lg transition-all hover:border-slate-300 hover:bg-white">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-100 to-blue-50 group-hover:from-blue-200 group-hover:to-blue-100 transition-colors">
                  <svg
                    className="h-6 w-6 text-blue-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4M7 12a5 5 0 1110 0A5 5 0 017 12z"
                    />
                  </svg>
                </div>
                <h3 className="font-semibold text-slate-900">Safety Scan</h3>
                <p className="mt-2 text-sm text-slate-600">
                  Identify security risks and suspicious dependencies
                </p>
              </div>
            </div>
          </section>

          {/* How it Works Section */}
          <section id="how-it-works" className="py-16 sm:py-20">
            <div className="mb-12 text-center">
              <h2 className="text-4xl font-bold text-slate-900 sm:text-5xl">
                How it works
              </h2>
            </div>

            <div className="grid gap-6 sm:grid-cols-3">
              {/* Step 1 */}
              <div className="rounded-2xl border border-slate-200/60 bg-white/70 backdrop-blur-sm p-8 shadow-md hover:shadow-lg transition-all">
                <div className="flex items-center justify-center">
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-lg font-bold text-white shadow-md">
                    1
                  </div>
                </div>
                <h3 className="mt-6 text-center font-semibold text-slate-900">Paste GitHub URL</h3>
                <p className="mt-3 text-center text-sm text-slate-600">
                  Enter any public GitHub repository URL
                </p>
              </div>

              {/* Step 2 */}
              <div className="rounded-2xl border border-slate-200/60 bg-white/70 backdrop-blur-sm p-8 shadow-md hover:shadow-lg transition-all">
                <div className="flex items-center justify-center">
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-lg font-bold text-white shadow-md">
                    2
                  </div>
                </div>
                <h3 className="mt-6 text-center font-semibold text-slate-900">Run Analysis</h3>
                <p className="mt-3 text-center text-sm text-slate-600">
                  We analyze the repository in seconds
                </p>
              </div>

              {/* Step 3 */}
              <div className="rounded-2xl border border-slate-200/60 bg-white/70 backdrop-blur-sm p-8 shadow-md hover:shadow-lg transition-all">
                <div className="flex items-center justify-center">
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-lg font-bold text-white shadow-md">
                    3
                  </div>
                </div>
                <h3 className="mt-6 text-center font-semibold text-slate-900">Get Setup Report</h3>
                <p className="mt-3 text-center text-sm text-slate-600">
                  Follow the detailed setup guide for your OS
                </p>
              </div>
            </div>
          </section>

          {/* Pricing Section */}
          <section id="pricing" className="py-16 sm:py-20">
            <div className="mb-12 text-center">
              <h2 className="text-4xl font-bold text-slate-900 sm:text-5xl">Pricing</h2>
              <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-600">
                Start on Starter. Upgrade to Pro for unlimited analysis and faster processing.
              </p>
            </div>

            <div className="mx-auto grid max-w-5xl gap-6 lg:grid-cols-2">
              <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-md">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="text-2xl font-bold text-slate-900">Starter</h3>
                    <p className="mt-1 text-sm text-slate-600">Free plan</p>
                  </div>
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                    Basic
                  </span>
                </div>

                <div className="mt-6">
                  <p className="text-4xl font-bold text-slate-900">$0</p>
                  <p className="mt-1 text-sm text-slate-600">per month</p>
                </div>

                <div className="mt-6 space-y-3 text-sm text-slate-700">
                  <p className="rounded-lg bg-slate-50 px-3 py-2 font-medium">
                    1 analysis per day
                  </p>
                  <p className="rounded-lg bg-slate-50 px-3 py-2">
                    Last 3 analyses history
                  </p>
                  <p className="rounded-lg bg-slate-50 px-3 py-2">Basic setup report</p>
                  <p className="rounded-lg bg-slate-50 px-3 py-2 text-slate-500">
                    No advanced insights
                  </p>
                </div>

                <Link
                  href={user ? "/dashboard" : "/signup"}
                  className="mt-8 block w-full rounded-lg border border-slate-300 bg-white py-3 text-center font-semibold text-slate-900 hover:bg-slate-50"
                >
                  {user ? "Continue with Starter" : "Start free"}
                </Link>
              </div>

              <div className="relative rounded-2xl border-2 border-blue-500 bg-white p-8 shadow-xl">
                <div className="absolute -top-3 left-6 rounded-full bg-blue-600 px-3 py-1 text-xs font-semibold text-white">
                  Most popular
                </div>

                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="text-2xl font-bold text-slate-900">Pro</h3>
                    <p className="mt-1 text-sm text-slate-600">For power users</p>
                  </div>
                  <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-800">
                    50% off
                  </span>
                </div>

                <div className="mt-6 flex items-end gap-2">
                  <span className="text-lg text-slate-400 line-through">$15</span>
                  <span className="text-4xl font-bold text-slate-900">$8</span>
                  <span className="pb-1 text-sm text-slate-600">/month</span>
                </div>

                <div className="mt-6 space-y-3 text-sm text-slate-700">
                  <p className="rounded-lg bg-blue-50 px-3 py-2 font-medium text-blue-900">
                    Unlimited analyses
                  </p>
                  <p className="rounded-lg bg-blue-50 px-3 py-2">Full history</p>
                  <p className="rounded-lg bg-blue-50 px-3 py-2">Advanced insights</p>
                  <p className="rounded-lg bg-blue-50 px-3 py-2">Priority processing</p>
                </div>

                <Link
                  href={user ? "/dashboard" : "/signup"}
                  className="mt-8 block w-full rounded-lg bg-blue-600 py-3 text-center font-semibold text-white hover:bg-blue-700"
                >
                  Upgrade to Pro
                </Link>
                <p className="mt-2 text-center text-xs text-slate-500">
                  Limited-time offer. Payments coming soon.
                </p>
              </div>
            </div>
          </section>

          {/* Final CTA Section */}
          <section className="py-16 sm:py-20">
            <div className="rounded-2xl border border-slate-200/60 bg-gradient-to-br from-blue-50/60 to-indigo-50/40 backdrop-blur-sm p-8 text-center shadow-lg sm:p-12 hover:shadow-xl transition-shadow">
              <h2 className="text-4xl font-bold text-slate-900">Ready to get started?</h2>
              <p className="mx-auto mt-4 max-w-xl text-lg text-slate-600">
                {user
                  ? "Head to your dashboard and analyze your first repository today."
                  : "Create a free account to analyze repositories and save your setup guides."}
              </p>

              <div className="mx-auto mt-8 flex flex-col gap-4 sm:flex-row sm:justify-center">
                {user ? (
                  <>
                    <Link
                      href="/dashboard"
                      className="rounded-lg bg-blue-600 px-8 py-4 font-semibold text-white hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 shadow-lg hover:shadow-xl"
                    >
                      Go to dashboard
                    </Link>
                  </>
                ) : (
                  <>
                    <Link
                      href="/signup"
                      className="rounded-lg bg-blue-600 px-8 py-4 font-semibold text-white hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 shadow-lg hover:shadow-xl"
                    >
                      Create account
                    </Link>
                    <Link
                      href="/login"
                      className="rounded-lg border border-slate-300 bg-white px-8 py-4 font-semibold text-slate-900 hover:bg-slate-50 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 shadow-md"
                    >
                      Sign in
                    </Link>
                  </>
                )}
              </div>
            </div>
          </section>
        </main>

        <PublicFooter />
      </div>
    </div>
  );
}
