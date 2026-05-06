"use client";

import React from "react";
import type { RepoAnalysis } from "../lib/schemas/repoAnalysisSchema";

type Props = {
  repoUrl: string | null;
  isLoading: boolean;
  error: string | null;
  analysis: RepoAnalysis | null;
};

function Card({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-lg border border-gray-200 bg-white p-6">
      <h3 className="mb-4 text-lg font-semibold text-gray-900">{title}</h3>
      <div className="space-y-3 text-sm text-gray-700">{children}</div>
    </section>
  );
}

function List({ items }: { items: string[] }) {
  if (items.length === 0) return <p className="text-gray-500">No items provided.</p>;
  return (
    <ul className="list-disc space-y-2 pl-5">
      {items.map((item, index) => (
        <li key={`${item}-${index}`} className="text-gray-700">{item}</li>
      ))}
    </ul>
  );
}

export default function AnalysisResult({ repoUrl, isLoading, error, analysis }: Props) {
  if (!repoUrl) {
    return (
      <div className="rounded-lg border border-dashed border-gray-300 bg-gray-50 p-8 text-center">
        <p className="text-gray-500">
          No repository analyzed yet. Enter a GitHub repo URL above and click Analyze.
        </p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="rounded-lg border border-dashed border-gray-300 bg-gray-50 p-8">
          <div className="flex items-center gap-3">
            <svg className="h-5 w-5 animate-spin text-blue-600" fill="none" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" className="opacity-25" />
              <path
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                className="opacity-75"
              />
            </svg>
            <div>
              <p className="font-semibold text-gray-900">Analyzing <strong>{repoUrl}</strong></p>
              <p className="mt-1 text-sm text-gray-600">This can take a bit depending on repository size...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-6">
        <div className="flex gap-3">
          <svg className="h-5 w-5 flex-shrink-0 text-red-600" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
              clipRule="evenodd"
            />
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
      {/* Summary */}
      <Card title="Project Summary">
        <p className="leading-relaxed">{analysis.projectSummary}</p>
      </Card>

      {/* Detected Stack */}
      <Card title="Detected Stack">
        <div className="grid gap-6 sm:grid-cols-2">
          <div>
            <p className="mb-2 font-semibold text-gray-900">Languages</p>
            <List items={analysis.detectedStack.languages} />
          </div>
          <div>
            <p className="mb-2 font-semibold text-gray-900">Frameworks</p>
            <List items={analysis.detectedStack.frameworks} />
          </div>
          <div>
            <p className="mb-2 font-semibold text-gray-900">Package Manager</p>
            <p className="text-gray-700">{analysis.detectedStack.packageManager}</p>
          </div>
          <div>
            <p className="mb-2 font-semibold text-gray-900">Database</p>
            <p className="text-gray-700">{analysis.detectedStack.database ?? "Unclear"}</p>
          </div>
          <div>
            <p className="mb-2 font-semibold text-gray-900">Docker</p>
            <p className="text-gray-700">{analysis.detectedStack.docker ? "Yes" : "No"}</p>
          </div>
        </div>
      </Card>

      {/* Difficulty */}
      <Card title="Difficulty Level">
        <div className="space-y-2">
          <div className="flex items-baseline gap-2">
            <span className="font-semibold text-gray-900">Score:</span>
            <span className="text-gray-700">{analysis.difficulty.score}/5</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-semibold text-gray-900">Label:</span>
            <span className="text-gray-700">{analysis.difficulty.label}</span>
          </div>
          <div className="flex gap-2">
            <span className="font-semibold text-gray-900">Reason:</span>
            <span className="text-gray-700">{analysis.difficulty.reason}</span>
          </div>
        </div>
      </Card>

      {/* Requirements */}
      <Card title="Requirements">
        <List items={analysis.requirements} />
      </Card>

      {/* Windows Setup */}
      <Card title="Setup Steps - Windows">
        <List items={analysis.setupStepsWindows} />
      </Card>

      {/* Mac/Linux Setup */}
      <Card title="Setup Steps - Mac/Linux">
        <List items={analysis.setupStepsMacLinux} />
      </Card>

      {/* Environment Variables */}
      <Card title="Environment Variables">
        {analysis.envVariables.length === 0 ? (
          <p className="text-gray-500">No environment variables listed.</p>
        ) : (
          <div className="space-y-4">
            {analysis.envVariables.map((item) => (
              <div key={item.name} className="rounded border border-gray-200 bg-gray-50 p-4">
                <div className="flex items-start justify-between">
                  <p className="font-semibold text-gray-900">{item.name}</p>
                  <span className="inline-flex rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800">
                    {item.required ? "Required" : "Optional"}
                  </span>
                </div>
                <p className="mt-2 text-gray-700">{item.description}</p>
                <p className="mt-2 text-sm text-gray-600">
                  <span className="font-semibold">Where to get it:</span> {item.whereToGetIt}
                </p>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Common Errors */}
      <Card title="Common Errors">
        {analysis.commonErrors.length === 0 ? (
          <p className="text-gray-500">No common errors listed.</p>
        ) : (
          <div className="space-y-4">
            {analysis.commonErrors.map((item, index) => (
              <div key={`${item.error}-${index}`} className="rounded border border-gray-200 bg-gray-50 p-4">
                <p className="font-semibold text-red-700">{item.error}</p>
                <p className="mt-2 text-sm">
                  <span className="font-semibold text-gray-900">Likely cause:</span>{" "}
                  <span className="text-gray-700">{item.likelyCause}</span>
                </p>
                <p className="mt-2 text-sm">
                  <span className="font-semibold text-gray-900">Fix:</span>{" "}
                  <span className="text-gray-700">{item.fix}</span>
                </p>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Security Warnings */}
      <Card title="Security Warnings">
        {analysis.securityWarnings.length === 0 ? (
          <div className="rounded bg-green-50 p-4">
            <p className="text-sm text-green-800">✓ No security warnings reported</p>
          </div>
        ) : (
          <div className="space-y-4">
            {analysis.securityWarnings.map((item, index) => (
              <div
                key={`${item.warning}-${index}`}
                className={`rounded border p-4 ${
                  item.level === "critical"
                    ? "border-red-200 bg-red-50"
                    : item.level === "high"
                      ? "border-orange-200 bg-orange-50"
                      : "border-yellow-200 bg-yellow-50"
                }`}
              >
                <p className="font-semibold text-gray-900">
                  [{item.level.toUpperCase()}] {item.warning}
                </p>
                <p className="mt-2 text-sm text-gray-700">{item.recommendation}</p>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Next Best Action */}
      <Card title="Next Best Action">
        <div className="rounded-lg bg-blue-50 p-4">
          <p className="text-gray-900">{analysis.nextBestAction}</p>
        </div>
      </Card>
    </div>
  );
}
