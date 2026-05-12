"use client";

import React from "react";
import type { RepoAnalysis } from "../lib/schemas/repoAnalysisSchema";

type Props = {
  repoUrl: string | null;
  isLoading: boolean;
  error: string | null;
  analysis: RepoAnalysis | null;
};

function Badge({ children, variant = "gray" }: { children: React.ReactNode; variant?: string }) {
  const variantClasses = {
    gray: "bg-slate-100 text-slate-700",
    blue: "bg-blue-100 text-blue-700",
    green: "bg-green-100 text-green-700",
    amber: "bg-amber-100 text-amber-700",
    red: "bg-red-100 text-red-700",
  };
  return (
    <span className={`inline-block rounded-full px-3 py-1 text-xs font-semibold ${variantClasses[variant as keyof typeof variantClasses] || variantClasses.gray}`}>
      {children}
    </span>
  );
}

function DifficultyBadge({ level }: { level: "easy" | "medium" | "hard" }) {
  const variants = { easy: "green", medium: "amber", hard: "red" };
  return <Badge variant={variants[level]}>{level.toUpperCase()}</Badge>;
}

function DifficultyDots({ score }: { score: number }) {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((i) => (
        <div
          key={i}
          className={`h-2 w-2 rounded-full ${i <= score ? "bg-blue-600" : "bg-slate-200"}`}
        />
      ))}
    </div>
  );
}

export default function AnalysisResult({ repoUrl, isLoading, error, analysis }: Props) {
  if (!repoUrl) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-slate-50 p-12 text-center">
        <svg className="mx-auto h-12 w-12 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        <p className="mt-4 text-slate-600">
          No repository analyzed yet. Enter a GitHub repo URL above and click Analyze.
        </p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-12">
        <div className="flex items-center gap-4">
          <svg className="h-6 w-6 animate-spin text-blue-600" fill="none" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" className="opacity-25" />
            <path
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              className="opacity-75"
            />
          </svg>
          <div>
            <p className="font-semibold text-slate-900">Analyzing repository...</p>
            <p className="mt-1 text-sm text-slate-600">This can take a moment depending on repository size</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 p-6">
        <div className="flex gap-3">
          <svg className="h-5 w-5 flex-shrink-0 text-red-600" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
          <div>
            <p className="font-semibold text-red-900">Couldn&apos;t analyze this repository</p>
            <p className="mt-1 text-sm text-red-800">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  if (!analysis) {
    return null;
  }

  return (
    <div className="space-y-6">
      {/* Hero Card - Project Summary */}
      <div className="rounded-2xl border border-slate-200 bg-gradient-to-br from-blue-50 to-indigo-50 p-8 shadow-sm">
        <h1 className="text-3xl font-bold text-slate-900">Repository Setup Report</h1>
        <p className="mt-3 leading-relaxed text-slate-700">{analysis.projectSummary}</p>
        
        <div className="mt-6 flex flex-wrap gap-2">
          <Badge variant="blue">{analysis.detectedStack.packageManager}</Badge>
          {analysis.detectedStack.docker && <Badge variant="gray">Docker</Badge>}
          {analysis.detectedStack.database && <Badge variant="gray">{analysis.detectedStack.database}</Badge>}
          <DifficultyBadge level={analysis.difficulty.label} />
        </div>
      </div>

      {/* Detected Stack */}
      <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
        <h2 className="text-xl font-bold text-slate-900">Detected Stack</h2>
        <div className="mt-6 grid gap-6 sm:grid-cols-2">
          <div>
            <h3 className="mb-3 font-semibold text-slate-700">Languages</h3>
            {analysis.detectedStack.languages.length === 0 ? (
              <p className="text-slate-500">Not detected</p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {analysis.detectedStack.languages.map((lang) => (
                  <Badge key={lang} variant="gray">{lang}</Badge>
                ))}
              </div>
            )}
          </div>
          <div>
            <h3 className="mb-3 font-semibold text-slate-700">Frameworks</h3>
            {analysis.detectedStack.frameworks.length === 0 ? (
              <p className="text-slate-500">Not detected</p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {analysis.detectedStack.frameworks.map((framework) => (
                  <Badge key={framework} variant="blue">{framework}</Badge>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Difficulty */}
      <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
        <h2 className="text-xl font-bold text-slate-900">Setup Difficulty</h2>
        <div className="mt-6 space-y-4">
          <div>
            <div className="flex items-center gap-3">
              <DifficultyBadge level={analysis.difficulty.label} />
              <span className="text-sm font-medium text-slate-600">Score: {analysis.difficulty.score}/5</span>
            </div>
            <div className="mt-2">
              <DifficultyDots score={analysis.difficulty.score} />
            </div>
          </div>
          <p className="text-slate-700">{analysis.difficulty.reason}</p>
        </div>
      </div>

      {/* Requirements */}
      <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
        <h2 className="text-xl font-bold text-slate-900">Requirements</h2>
        {analysis.requirements.length === 0 ? (
          <p className="mt-4 text-slate-500">No requirements specified.</p>
        ) : (
          <div className="mt-6 space-y-3">
            {analysis.requirements.map((req, idx) => (
              <div key={idx} className="flex gap-3">
                <svg className="h-5 w-5 flex-shrink-0 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span className="text-slate-700">{req}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Setup Steps */}
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
          <h2 className="text-xl font-bold text-slate-900">Setup Steps - Windows</h2>
          <div className="mt-6 space-y-3">
            {analysis.setupStepsWindows.map((step, idx) => (
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
            {analysis.setupStepsMacLinux.map((step, idx) => (
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
      <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
        <h2 className="text-xl font-bold text-slate-900">Environment Variables</h2>
        {analysis.envVariables.length === 0 ? (
          <p className="mt-4 text-slate-500">No environment variables detected.</p>
        ) : (
          <div className="mt-6 space-y-3">
            {analysis.envVariables.map((env) => (
              <div key={env.name} className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                <div className="flex items-start justify-between">
                  <p className="font-mono text-sm font-semibold text-slate-900">{env.name}</p>
                  <Badge variant={env.required ? "red" : "gray"}>{env.required ? "Required" : "Optional"}</Badge>
                </div>
                <p className="mt-2 text-sm text-slate-700">{env.description}</p>
                <p className="mt-2 text-xs text-slate-600">
                  <span className="font-semibold">Where to get it:</span> {env.whereToGetIt}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Common Errors */}
      <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
        <h2 className="text-xl font-bold text-slate-900">Common Errors & Fixes</h2>
        {analysis.commonErrors.length === 0 ? (
          <p className="mt-4 text-slate-500">No common errors documented.</p>
        ) : (
          <div className="mt-6 space-y-4">
            {analysis.commonErrors.map((item, idx) => (
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
        )}
      </div>

      {/* Security Warnings */}
      <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
        <h2 className="text-xl font-bold text-slate-900">Security Warnings</h2>
        {analysis.securityWarnings.length === 0 ? (
          <div className="mt-4 rounded-xl bg-green-50 p-4">
            <p className="text-sm font-medium text-green-800">✓ No security warnings detected</p>
          </div>
        ) : (
          <div className="mt-6 space-y-4">
            {analysis.securityWarnings.map((item, idx) => {
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
        )}
      </div>

      {/* Next Best Action */}
      <div className="rounded-2xl border border-blue-200 bg-blue-50 p-8">
        <div className="flex gap-3">
          <svg className="h-6 w-6 flex-shrink-0 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 5v8a2 2 0 01-2 2h-5l-5 4v-4H4a2 2 0 01-2-2V5a2 2 0 012-2h12a2 2 0 012 2zm-11-1a1 1 0 11-2 0 1 1 0 012 0z" clipRule="evenodd" />
          </svg>
          <div>
            <h3 className="font-semibold text-blue-900">Next Best Action</h3>
            <p className="mt-2 text-sm text-blue-800">{analysis.nextBestAction}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
