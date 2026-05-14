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

  // Logged-in users: Welcome page with dashboard link
  if (user) {
    return (
      <div className="min-h-screen bg-slate-50">
        <AuthNav />

        <main className="mx-auto max-w-6xl px-4 py-24 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
              Welcome back!
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-600">
              Ready to analyze a repository and get setup guidance?
            </p>

            <div className="mt-8">
              <Link
                href="/dashboard"
                className="inline-block rounded-lg bg-blue-600 px-8 py-3 font-semibold text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2"
              >
                Go to Dashboard
              </Link>
            </div>
          </div>
        </main>

        <PublicFooter />
      </div>
    );
  }

  // Logged-out users: Polished SaaS landing page
  return (
    <div className="min-h-screen bg-slate-50">
      <AuthNav />

      <main className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <section className="py-20 sm:py-32">
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl md:text-6xl">
              Run any GitHub repo
              <span className="block text-blue-600">without guessing</span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-600 sm:text-xl">
              Get setup steps, environment variables, common fixes, and safety insights before you run unfamiliar code.
            </p>
            <p className="mx-auto mt-4 max-w-2xl text-sm text-slate-500">
              No code execution. Public repositories only. Setup guidance in seconds.
            </p>

            {/* CTA Buttons */}
            <div className="mx-auto mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
              <Link
                href="/signup"
                className="rounded-lg bg-blue-600 px-8 py-3 font-semibold text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2"
              >
                Get started
              </Link>
              <Link
                href="/login"
                className="rounded-lg border border-slate-300 bg-white px-8 py-3 font-semibold text-slate-900 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2"
              >
                Log in
              </Link>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-16 sm:py-24">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold text-slate-900 sm:text-4xl">
              Everything you need to get started
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-lg text-slate-600">
              Get all the information needed to run any repository safely and correctly.
            </p>
          </div>

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {/* Feature 1 */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100">
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
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100">
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
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100">
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
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100">
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
        <section id="how-it-works" className="py-16 sm:py-24">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold text-slate-900 sm:text-4xl">
              How it works
            </h2>
          </div>

          <div className="grid gap-8 sm:grid-cols-3">
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-lg font-bold text-blue-600">
                1
              </div>
              <h3 className="font-semibold text-slate-900">Paste GitHub URL</h3>
              <p className="mt-2 text-sm text-slate-600">
                Enter any public GitHub repository URL
              </p>
            </div>
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-lg font-bold text-blue-600">
                2
              </div>
              <h3 className="font-semibold text-slate-900">Run Analysis</h3>
              <p className="mt-2 text-sm text-slate-600">
                We analyze the repository in seconds
              </p>
            </div>
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-lg font-bold text-blue-600">
                3
              </div>
              <h3 className="font-semibold text-slate-900">Get Setup Report</h3>
              <p className="mt-2 text-sm text-slate-600">
                Follow the detailed setup guide for your OS
              </p>
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section id="pricing" className="py-16 text-center sm:py-24">
          <h2 className="text-3xl font-bold text-slate-900 sm:text-4xl">Pricing</h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-600">
            Free during MVP. Analyze public repositories and save your results in your dashboard.
          </p>
        </section>

        {/* CTA Section */}
        <section className="py-16 sm:py-24">
          <div className="rounded-2xl border border-slate-200 bg-gradient-to-br from-blue-50 to-indigo-50 p-12 text-center shadow-sm">
            <h2 className="text-3xl font-bold text-slate-900">Ready to get started?</h2>
            <p className="mx-auto mt-4 max-w-xl text-lg text-slate-600">
              Create a free account to analyze repositories and save your setup guides.
            </p>

            <div className="mx-auto mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
              <Link
                href="/signup"
                className="rounded-lg bg-blue-600 px-8 py-3 font-semibold text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2"
              >
                Create account
              </Link>
              <Link
                href="/login"
                className="rounded-lg border border-slate-300 bg-white px-8 py-3 font-semibold text-slate-900 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2"
              >
                Sign in
              </Link>
            </div>
          </div>
        </section>
      </main>

      <PublicFooter />
    </div>
  );
}
