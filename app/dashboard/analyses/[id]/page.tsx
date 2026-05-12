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

function Badge({ children, variant = "slate" }: { children: React.ReactNode; variant?: string }) {
  const variants = {
    slate: "bg-slate-100 text-slate-700",
    blue: "bg-blue-100 text-blue-700",
    green: "bg-green-100 text-green-700",
    amber: "bg-amber-100 text-amber-700",
    red: "bg-red-100 text-red-700",
  };
  return (
    <span className={`inline-block rounded-full px-3 py-1 text-xs font-semibold ${variants[variant as keyof typeof variants] || variants.slate}`}>
      {children}
    </span>
  );
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
      <main className="min-h-screen bg-slate-50 px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto w-full max-w-5xl">
          <div className="flex gap-3">
            <svg className="h-5 w-5 animate-spin text-blue-600" fill="none" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" className="opacity-25" />
              <path fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" className="opacity-75" />
            </svg>
            <p className="text-slate-600">Loading analysis...</p>
          </div>
        </div>
      </main>
    );
  }

  if (error || !analysis) {
    return (
      <main className="min-h-screen bg-slate-50 px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto w-full max-w-5xl rounded-2xl border border-slate-200 bg-white p-8">
          <div className="flex gap-3">
            <svg className="h-5 w-5 flex-shrink-0 text-red-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            <p className="text-red-700">{error || "Analysis not found."}</p>
          </div>
          <Link href="/dashboard" className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-blue-700 hover:text-blue-800">
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to dashboard
          </Link>
        </div>
      </main>
    );
  }

  const data = analysis.analysis_json;

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-5xl">
        {/* Header */}
        <div className="mb-8 flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">{analysis.repo_name}</h1>
            <p className="mt-2 text-sm text-slate-600">
              {analysis.repo_url} • Analyzed on {new Date(analysis.created_at).toLocaleDateString()}
            </p>
          </div>
          <Link
            href="/dashboard"
            className="flex items-center gap-2 rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back
          </Link>
        </div>

        {/* Project Summary Hero Card */}
        <div className="mb-6 rounded-2xl border border-slate-200 bg-gradient-to-br from-blue-50 to-indigo-50 p-8 shadow-sm">
          <h2 className="text-2xl font-bold text-slate-900">Repository Setup Report</h2>
          <p className="mt-4 leading-relaxed text-slate-700">{data.projectSummary}</p>
          <div className="mt-6 flex flex-wrap gap-2">
            <Badge variant="blue">{data.detectedStack.packageManager}</Badge>
            {data.detectedStack.docker && <Badge variant="slate">Docker</Badge>}
            {data.detectedStack.database && <Badge variant="slate">{data.detectedStack.database}</Badge>}
          </div>
        </div>

        {/* Difficulty */}
        <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
          <h2 className="text-xl font-bold text-slate-900">Setup Difficulty</h2>
          <div className="mt-6 flex items-center gap-4">
            <Badge variant={data.difficulty.label === "easy" ? "green" : data.difficulty.label === "medium" ? "amber" : "red"}>
              {data.difficulty.label.toUpperCase()} ({data.difficulty.score}/5)
            </Badge>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className={`h-2 w-2 rounded-full ${i <= data.difficulty.score ? "bg-blue-600" : "bg-slate-200"}`} />
              ))}
            </div>
          </div>
          <p className="mt-4 text-slate-700">{data.difficulty.reason}</p>
        </div>

        {/* Detected Stack */}
        <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
          <h2 className="text-xl font-bold text-slate-900">Detected Stack</h2>
          <div className="mt-6 grid gap-6 sm:grid-cols-2">
            <div>
              <h3 className="mb-3 font-semibold text-slate-700">Languages</h3>
              {data.detectedStack.languages.length === 0 ? (
                <p className="text-slate-500">Not detected</p>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {data.detectedStack.languages.map((lang) => (
                    <Badge key={lang} variant="slate">{lang}</Badge>
                  ))}
                </div>
              )}
            </div>
            <div>
              <h3 className="mb-3 font-semibold text-slate-700">Frameworks</h3>
              {data.detectedStack.frameworks.length === 0 ? (
                <p className="text-slate-500">Not detected</p>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {data.detectedStack.frameworks.map((fw) => (
                    <Badge key={fw} variant="blue">{fw}</Badge>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Requirements */}
        {data.requirements.length > 0 && (
          <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
            <h2 className="text-xl font-bold text-slate-900">Requirements</h2>
            <div className="mt-6 space-y-3">
              {data.requirements.map((req, idx) => (
                <div key={idx} className="flex gap-3">
                  <svg className="h-5 w-5 flex-shrink-0 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="text-slate-700">{req}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Setup Steps */}
        <div className="mb-6 grid gap-6 lg:grid-cols-2">
          <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
            <h2 className="text-xl font-bold text-slate-900">Setup Steps - Windows</h2>
            <div className="mt-6 space-y-3">
              {data.setupStepsWindows.map((step, idx) => (
                <div key={idx} className="flex gap-3">
                  <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-blue-100 text-xs font-semibold text-blue-700">
                    {idx + 1}
                  </span>
                  <p className="pt-0.5 text-slate-700">{step}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
            <h2 className="text-xl font-bold text-slate-900">Setup Steps - macOS/Linux</h2>
            <div className="mt-6 space-y-3">
              {data.setupStepsMacLinux.map((step, idx) => (
                <div key={idx} className="flex gap-3">
                  <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-blue-100 text-xs font-semibold text-blue-700">
                    {idx + 1}
                  </span>
                  <p className="pt-0.5 text-slate-700">{step}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Environment Variables */}
        {data.envVariables.length > 0 && (
          <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
            <h2 className="text-xl font-bold text-slate-900">Environment Variables</h2>
            <div className="mt-6 space-y-3">
              {data.envVariables.map((env) => (
                <div key={env.name} className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                  <div className="flex items-start justify-between gap-3">
                    <p className="font-mono text-sm font-semibold text-slate-900">{env.name}</p>
                    <Badge variant={env.required ? "red" : "slate"}>{env.required ? "Required" : "Optional"}</Badge>
                  </div>
                  <p className="mt-2 text-sm text-slate-700">{env.description}</p>
                  <p className="mt-2 text-xs text-slate-600">
                    <span className="font-semibold">Where to get it:</span> {env.whereToGetIt}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Common Errors */}
        {data.commonErrors.length > 0 && (
          <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
            <h2 className="text-xl font-bold text-slate-900">Common Errors & Fixes</h2>
            <div className="mt-6 space-y-4">
              {data.commonErrors.map((item, idx) => (
                <div key={idx} className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                  <p className="font-semibold text-slate-900">{item.error}</p>
                  <div className="mt-3 space-y-2">
                    <div>
                      <p className="text-xs font-semibold text-slate-600">Likely Cause</p>
                      <p className="mt-1 text-sm text-slate-700">{item.likelyCause}</p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-slate-600">Fix</p>
                      <p className="mt-1 text-sm text-slate-700">{item.fix}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Security Warnings */}
        {data.securityWarnings.length > 0 && (
          <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
            <h2 className="text-xl font-bold text-slate-900">Security Warnings</h2>
            <div className="mt-6 space-y-4">
              {data.securityWarnings.map((item, idx) => {
                const variantMap = { low: "slate", medium: "amber", high: "red" };
                const variant = variantMap[item.level as keyof typeof variantMap] || "slate";
                const bgMap = {
                  slate: "bg-slate-50 border-slate-200",
                  amber: "bg-amber-50 border-amber-200",
                  red: "bg-red-50 border-red-200",
                };
                const textMap = {
                  slate: "text-slate-700",
                  amber: "text-amber-700",
                  red: "text-red-700",
                };
                return (
                  <div key={idx} className={`rounded-xl border p-4 ${bgMap[variant as keyof typeof bgMap]}`}>
                    <div className="flex items-start gap-3">
                      <Badge variant={variant}>
                        {item.level.toUpperCase()}
                      </Badge>
                      <div className="flex-1">
                        <p className={`font-semibold ${textMap[variant as keyof typeof textMap]}`}>{item.warning}</p>
                        <p className="mt-2 text-sm text-slate-700">{item.recommendation}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Next Best Action */}
        <div className="rounded-2xl border border-blue-200 bg-blue-50 p-8">
          <div className="flex gap-3">
            <svg className="h-6 w-6 flex-shrink-0 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 5v8a2 2 0 01-2 2h-5l-5 4v-4H4a2 2 0 01-2-2V5a2 2 0 012-2h12a2 2 0 012 2zm-11-1a1 1 0 11-2 0 1 1 0 012 0z" clipRule="evenodd" />
            </svg>
            <div>
              <h3 className="font-semibold text-blue-900">Next Best Action</h3>
              <p className="mt-2 text-sm text-blue-800">{data.nextBestAction}</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
