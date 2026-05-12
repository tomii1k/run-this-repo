"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { createClient } from "../../../../lib/supabase/client";
import type { RepoAnalysis } from "../../../../lib/schemas/repoAnalysisSchema";

interface AnalysisRecord {
  id: string;
  user_id: string;
  repo_name: string;
  repo_url: string;
  analysis_json: RepoAnalysis;
  created_at: string;
}

export default function AnalysisDetailPage() {
  const params = useParams();
  const router = useRouter();
  const analysisId = params.id as string;
  const supabase = createClient();

  const [analysis, setAnalysis] = useState<AnalysisRecord | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchAnalysis() {
      try {
        const { data: userData } = await supabase.auth.getUser();
        if (!userData.user) {
          router.push("/login");
          return;
        }

        const { data, error: fetchError } = await supabase
          .from("repo_analyses")
          .select("*")
          .eq("id", analysisId)
          .eq("user_id", userData.user.id)
          .single();

        if (fetchError || !data) {
          setError("Analysis not found or access denied.");
          setIsLoading(false);
          return;
        }

        setAnalysis(data as AnalysisRecord);
      } catch (err) {
        setError("Failed to load analysis.");
        console.error("Error fetching analysis:", err);
      } finally {
        setIsLoading(false);
      }
    }

    fetchAnalysis();
  }, [analysisId, supabase, router]);

  if (isLoading) {
    return (
      <main className="min-h-screen bg-gray-50 px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto w-full max-w-4xl">
          <p className="text-gray-600">Loading analysis...</p>
        </div>
      </main>
    );
  }

  if (error || !analysis) {
    return (
      <main className="min-h-screen bg-gray-50 px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto w-full max-w-4xl rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <p className="text-red-700">{error || "Analysis not found."}</p>
          <Link href="/dashboard" className="mt-4 text-blue-700 hover:text-blue-800">
            ← Back to dashboard
          </Link>
        </div>
      </main>
    );
  }

  const data = analysis.analysis_json;

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-4xl">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{analysis.repo_name}</h1>
            <p className="mt-2 text-sm text-gray-600">
              {analysis.repo_url} • Analyzed on{" "}
              {new Date(analysis.created_at).toLocaleDateString()}
            </p>
          </div>
          <Link
            href="/dashboard"
            className="rounded-md border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
          >
            ← Back
          </Link>
        </div>

        {/* Project Summary */}
        <section className="mb-6 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-bold text-gray-900">Project Summary</h2>
          <p className="mt-3 leading-relaxed text-gray-700">{data.projectSummary}</p>
        </section>

        {/* Difficulty */}
        <section className="mb-6 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-bold text-gray-900">Setup Difficulty</h2>
          <div className="mt-3">
            <div className="flex items-center gap-2">
              <span className="inline-block rounded-full bg-blue-100 px-3 py-1 text-sm font-semibold text-blue-900">
                {data.difficulty.label.toUpperCase()} ({data.difficulty.score}/5)
              </span>
            </div>
            <p className="mt-2 text-gray-700">{data.difficulty.reason}</p>
          </div>
        </section>

        {/* Detected Stack */}
        <section className="mb-6 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-bold text-gray-900">Detected Stack</h2>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            {data.detectedStack.languages.length > 0 && (
              <div>
                <p className="text-sm font-medium text-gray-600">Languages</p>
                <p className="mt-1 text-gray-900">{data.detectedStack.languages.join(", ")}</p>
              </div>
            )}
            {data.detectedStack.frameworks.length > 0 && (
              <div>
                <p className="text-sm font-medium text-gray-600">Frameworks</p>
                <p className="mt-1 text-gray-900">{data.detectedStack.frameworks.join(", ")}</p>
              </div>
            )}
            <div>
              <p className="text-sm font-medium text-gray-600">Package Manager</p>
              <p className="mt-1 text-gray-900">{data.detectedStack.packageManager}</p>
            </div>
            {data.detectedStack.database && (
              <div>
                <p className="text-sm font-medium text-gray-600">Database</p>
                <p className="mt-1 text-gray-900">{data.detectedStack.database}</p>
              </div>
            )}
            <div>
              <p className="text-sm font-medium text-gray-600">Docker</p>
              <p className="mt-1 text-gray-900">{data.detectedStack.docker ? "Yes" : "No"}</p>
            </div>
          </div>
        </section>

        {/* Requirements */}
        {data.requirements.length > 0 && (
          <section className="mb-6 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-bold text-gray-900">Requirements</h2>
            <ul className="mt-3 list-inside list-disc space-y-1 text-gray-700">
              {data.requirements.map((req, idx) => (
                <li key={idx}>{req}</li>
              ))}
            </ul>
          </section>
        )}

        {/* Setup Steps */}
        <section className="mb-6 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-bold text-gray-900">Setup Steps (Windows)</h2>
          <ol className="mt-3 list-inside list-decimal space-y-2 text-gray-700">
            {data.setupStepsWindows.map((step, idx) => (
              <li key={idx}>{step}</li>
            ))}
          </ol>
        </section>

        <section className="mb-6 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-bold text-gray-900">Setup Steps (macOS/Linux)</h2>
          <ol className="mt-3 list-inside list-decimal space-y-2 text-gray-700">
            {data.setupStepsMacLinux.map((step, idx) => (
              <li key={idx}>{step}</li>
            ))}
          </ol>
        </section>

        {/* Environment Variables */}
        {data.envVariables.length > 0 && (
          <section className="mb-6 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-bold text-gray-900">Environment Variables</h2>
            <div className="mt-3 space-y-3">
              {data.envVariables.map((env, idx) => (
                <div key={idx} className="rounded-lg border border-gray-200 bg-gray-50 p-3">
                  <p className="font-mono text-sm font-bold text-gray-900">
                    {env.name}
                    {env.required && <span className="text-red-600"> *</span>}
                  </p>
                  <p className="mt-1 text-sm text-gray-700">{env.description}</p>
                  <p className="mt-1 text-xs text-gray-600">Get it: {env.whereToGetIt}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Common Errors */}
        {data.commonErrors.length > 0 && (
          <section className="mb-6 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-bold text-gray-900">Common Errors & Fixes</h2>
            <div className="mt-3 space-y-3">
              {data.commonErrors.map((err, idx) => (
                <div key={idx} className="rounded-lg border border-red-200 bg-red-50 p-3">
                  <p className="font-bold text-red-900">{err.error}</p>
                  <p className="mt-1 text-sm text-red-800">Likely cause: {err.likelyCause}</p>
                  <p className="mt-1 text-sm text-red-800">Fix: {err.fix}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Security Warnings */}
        {data.securityWarnings.length > 0 && (
          <section className="mb-6 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-bold text-gray-900">Security Warnings</h2>
            <div className="mt-3 space-y-3">
              {data.securityWarnings.map((warning, idx) => {
                let bgColor = "bg-yellow-50 border-yellow-200";
                let textColor = "text-yellow-900";
                if (warning.level === "high") {
                  bgColor = "bg-red-50 border-red-200";
                  textColor = "text-red-900";
                } else if (warning.level === "medium") {
                  bgColor = "bg-orange-50 border-orange-200";
                  textColor = "text-orange-900";
                }
                return (
                  <div key={idx} className={`rounded-lg border ${bgColor} p-3`}>
                    <p className={`font-bold ${textColor}`}>
                      {warning.level.toUpperCase()}: {warning.warning}
                    </p>
                    <p className={`mt-1 text-sm ${textColor}`}>Recommendation: {warning.recommendation}</p>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* Next Best Action */}
        <section className="mb-6 rounded-xl border border-green-200 bg-green-50 p-6">
          <h2 className="text-xl font-bold text-green-900">Next Best Action</h2>
          <p className="mt-3 text-green-800">{data.nextBestAction}</p>
        </section>

        <div className="mt-8 mb-6">
          <Link
            href="/dashboard"
            className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
          >
            ← Back to dashboard
          </Link>
        </div>
      </div>
    </main>
  );
}
