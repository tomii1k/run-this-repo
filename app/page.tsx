"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import type { User } from "@supabase/supabase-js";
import { createClient } from "../lib/supabase/client";
import RepoInputForm from "./RepoInputForm";
import AnalysisResult from "./AnalysisResult";
import type { RepoAnalysis } from "../lib/schemas/repoAnalysisSchema";
import ErrorFixer from "../components/ErrorFixer";
import AuthNav from "../components/AuthNav";
import PublicFooter from "../components/PublicFooter";

export default function HomePage() {
  const isDevelopment = process.env.NODE_ENV === "development";
  const [user, setUser] = useState<User | null>(null);
  const [isHydrated, setIsHydrated] = useState(false);
  const [submittedRepo, setSubmittedRepo] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<RepoAnalysis | null>(null);

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

  // Prevent hydration mismatch by not rendering until after hydration
  if (!isHydrated) {
    return null;
  }

  async function handleAnalyze(url: string) {
    setSubmittedRepo(url);
    setIsLoading(true);
    setError(null);
    setAnalysis(null);

    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ repoUrl: url }),
      });

      // Handle 401 - redirect to login
      if (response.status === 401) {
        window.location.href = "/login";
        return;
      }

      let data: RepoAnalysis | { error?: string } | null = null;
      try {
        data = (await response.json()) as RepoAnalysis | { error?: string };
      } catch (parseError) {
        if (isDevelopment) {
          console.error("Failed to parse /api/analyze response JSON", parseError);
        }
      }

      if (!response.ok) {
        const message =
          data && "error" in data && data.error
            ? data.error
            : "Something went wrong while analyzing this repository.";
        setError(message);
        return;
      }

      if (!data) {
        setError("Unexpected response from the analyzer. Please try again.");
        return;
      }

      setAnalysis(data as RepoAnalysis);
    } catch (requestError) {
      if (isDevelopment) {
        console.error("POST /api/analyze failed", requestError);
      }
      setError("Network error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  // Show results page if analysis has been submitted
  if (submittedRepo && (analysis || error || isLoading)) {
    return (
      <div className="min-h-screen bg-slate-50">
        <AuthNav />

        <main className="mx-auto w-full max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
          <button
            onClick={() => {
              setSubmittedRepo(null);
              setAnalysis(null);
              setError(null);
            }}
            className="mb-8 flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-900"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to home
          </button>
          <AnalysisResult
            repoUrl={submittedRepo}
            isLoading={isLoading}
            error={error}
            analysis={analysis}
          />

          {analysis && submittedRepo ? (
            <section className="mt-8">
              <ErrorFixer repoUrl={submittedRepo} previousAnalysis={analysis} />
            </section>
          ) : null}
        </main>
        <PublicFooter />
      </div>
    );
  }

  // Logged-out users see hero conversion page
  if (!user) {
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
                Get all the information needed to run any repository in seconds.
              </p>
            </div>

            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {/* Feature 1 */}
              <div className="rounded-lg border border-slate-200 bg-white p-6">
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
                  Step-by-step instructions for Windows, Mac, and Linux
                </p>
              </div>

              {/* Feature 2 */}
              <div className="rounded-lg border border-slate-200 bg-white p-6">
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
              <div className="rounded-lg border border-slate-200 bg-white p-6">
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
              <div className="rounded-lg border border-slate-200 bg-white p-6">
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
                      d="M12 9v2m0 4v2m0 4v2M7 9h10m0 0a2 2 0 100-4H7a2 2 0 100 4zm0 0a2 2 0 110 4h10a2 2 0 110-4H7z"
                    />
                  </svg>
                </div>
                <h3 className="font-semibold text-slate-900">Safety Scan</h3>
                <p className="mt-2 text-sm text-slate-600">
                  Identify security risks before running unfamiliar code
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
        </main>

        <PublicFooter />
      </div>
    );
  }

  // Logged-in users can see analyzer (though we prefer them on dashboard)
  // Show results page if analysis has been submitted
  if (submittedRepo && (analysis || error || isLoading)) {
    return (
      <div className="min-h-screen bg-slate-50">
        <AuthNav />

        <main className="mx-auto w-full max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
          <button
            onClick={() => {
              setSubmittedRepo(null);
              setAnalysis(null);
              setError(null);
            }}
            className="mb-8 flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-900"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to home
          </button>
          <AnalysisResult
            repoUrl={submittedRepo}
            isLoading={isLoading}
            error={error}
            analysis={analysis}
          />

          {analysis && submittedRepo ? (
            <section className="mt-8">
              <ErrorFixer repoUrl={submittedRepo} previousAnalysis={analysis} />
            </section>
          ) : null}
        </main>
        <PublicFooter />
      </div>
    );
  }

  // Logged-in users see analyzer card + recent analyses on homepage
  // (or could redirect to /dashboard)
  return (
    <div className="min-h-screen bg-slate-50">
      <AuthNav />

      <main className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900">Analyze a Repository</h1>
          <p className="mt-2 text-slate-600">
            For a better experience, use the <Link href="/dashboard" className="font-semibold text-blue-600 hover:text-blue-700">Dashboard</Link>.
          </p>
        </div>

        <div className="mx-auto max-w-xl">
          <RepoInputForm onAnalyze={handleAnalyze} isLoading={isLoading} />
        </div>
      </main>

      <PublicFooter />
    </div>
  );
}
