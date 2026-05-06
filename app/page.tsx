"use client";

import React, { useState } from "react";
import RepoInputForm from "./RepoInputForm";
import AnalysisResult from "./AnalysisResult";
import type { RepoAnalysis } from "../lib/schemas/repoAnalysisSchema";
import ErrorFixer from "../components/ErrorFixer";
import AuthNav from "../components/AuthNav";

export default function HomePage() {
  const isDevelopment = process.env.NODE_ENV === "development";
  const [submittedRepo, setSubmittedRepo] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<RepoAnalysis | null>(null);

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
      <div className="min-h-screen bg-gray-50">
        <AuthNav />

        <main className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
          <button
            onClick={() => {
              setSubmittedRepo(null);
              setAnalysis(null);
              setError(null);
            }}
            className="mb-4 text-sm text-gray-600 hover:text-gray-900"
          >
            ← Back to home
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
      </div>
    );
  }

  // Show landing page
  return (
    <div className="min-h-screen bg-white">
      <AuthNav />

      <main className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <section className="py-16 sm:py-24">
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl md:text-6xl">
              Run any GitHub repo
              <span className="block text-blue-600">without guessing</span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-600 sm:text-xl">
              Paste a public GitHub repository URL and get exact setup steps, required environment
              variables, common errors, and safety warnings.
            </p>
          </div>

          {/* Input Section */}
          <div className="mx-auto mt-12 max-w-xl">
            <RepoInputForm onAnalyze={handleAnalyze} isLoading={isLoading} />
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-16 sm:py-24">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
              Everything you need to get started
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-lg text-gray-600">
              Get all the information needed to run any repository in seconds.
            </p>
          </div>

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {/* Feature 1 */}
            <div className="rounded-lg border border-gray-200 bg-gray-50 p-6">
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
              <h3 className="font-semibold text-gray-900">Setup Guide</h3>
              <p className="mt-2 text-sm text-gray-600">
                Step-by-step instructions for Windows, Mac, and Linux
              </p>
            </div>

            {/* Feature 2 */}
            <div className="rounded-lg border border-gray-200 bg-gray-50 p-6">
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
              <h3 className="font-semibold text-gray-900">Env Variables</h3>
              <p className="mt-2 text-sm text-gray-600">
                Identify and configure all required environment variables
              </p>
            </div>

            {/* Feature 3 */}
            <div className="rounded-lg border border-gray-200 bg-gray-50 p-6">
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
              <h3 className="font-semibold text-gray-900">Error Fixes</h3>
              <p className="mt-2 text-sm text-gray-600">
                Common errors with explanations and quick fixes
              </p>
            </div>

            {/* Feature 4 */}
            <div className="rounded-lg border border-gray-200 bg-gray-50 p-6">
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
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-900">Safety Scan</h3>
              <p className="mt-2 text-sm text-gray-600">
                Identify security warnings and suspicious dependencies
              </p>
            </div>
          </div>
        </section>

        {/* Example Section */}
        <section id="how-it-works" className="py-16 sm:py-24">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">How it works</h2>
            <p className="mx-auto mt-4 max-w-xl text-lg text-gray-600">
              Paste any GitHub repository URL above and get instant setup guidance.
            </p>
          </div>

          <div className="rounded-lg border border-gray-200 bg-gray-50 p-8">
            <div className="space-y-4">
              <div className="flex gap-4">
                <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-blue-600 text-white font-semibold text-sm">
                  1
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Enter a GitHub repository URL</p>
                  <p className="mt-1 text-sm text-gray-600">
                    Example: https://github.com/vercel/next.js
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-blue-600 text-white font-semibold text-sm">
                  2
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Click Analyze</p>
                  <p className="mt-1 text-sm text-gray-600">
                    We fetch the repository and analyze its configuration
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-blue-600 text-white font-semibold text-sm">
                  3
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Get your setup guide</p>
                  <p className="mt-1 text-sm text-gray-600">
                    Detailed steps, environment variables, and common errors specific to that repo
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 text-center sm:py-24">
          <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
            Ready to get started?
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-lg text-gray-600">
            Paste any public GitHub repository URL above to analyze it.
          </p>

          <div className="mx-auto mt-12 max-w-xl">
            <RepoInputForm onAnalyze={handleAnalyze} isLoading={isLoading} />
          </div>
        </section>

        <section id="pricing" className="pb-16 text-center sm:pb-24">
          <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">Pricing</h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-600">
            Free during MVP. Analyze public repositories and save your results in your dashboard.
          </p>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-100 bg-gray-50">
        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="text-center text-sm text-gray-600">
            <p>RunThisRepo helps beginners set up any GitHub repository with confidence.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
