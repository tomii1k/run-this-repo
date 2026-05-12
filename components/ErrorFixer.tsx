"use client";

import { useState } from "react";

import type { RepoAnalysis } from "../lib/schemas/repoAnalysisSchema";
import type { RepoErrorFix } from "../lib/ai/fixRepoErrorWithAI";

type ErrorFixerProps = {
  repoUrl: string;
  previousAnalysis: RepoAnalysis;
};

export default function ErrorFixer({ repoUrl, previousAnalysis }: ErrorFixerProps) {
  const [errorText, setErrorText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<RepoErrorFix | null>(null);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!errorText.trim()) return;

    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch("/api/fix-error", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          repoUrl,
          errorText: errorText.trim(),
          previousAnalysis,
        }),
      });

      const data = (await response.json()) as RepoErrorFix | { error?: string };
      if (!response.ok) {
        const message =
          "error" in data && data.error
            ? data.error
            : "Could not translate this terminal error.";
        setError(message);
        return;
      }

      setResult(data as RepoErrorFix);
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-slate-900">Terminal Error Translator</h2>
        <p className="mt-2 text-slate-600">
          Paste a terminal error and get the likely cause with practical next steps.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="errorText" className="block text-sm font-medium text-slate-700">
            Error message
          </label>
          <textarea
            id="errorText"
            value={errorText}
            onChange={(event) => setErrorText(event.target.value)}
            placeholder="Paste your terminal error here..."
            disabled={isLoading}
            rows={8}
            className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-4 py-3 font-mono text-sm text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 disabled:bg-slate-50 disabled:text-slate-500"
          />
        </div>

        <button
          type="submit"
          disabled={isLoading || !errorText.trim()}
          className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 disabled:opacity-60"
        >
          {isLoading ? (
            <>
              <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" className="opacity-25" />
                <path
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  className="opacity-75"
                />
              </svg>
              Translating...
            </>
          ) : (
            <>
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Explain Error
            </>
          )}
        </button>
      </form>

      {error && (
        <div className="mt-6 rounded-lg border border-red-200 bg-red-50 p-4">
          <div className="flex gap-3">
            <svg className="h-5 w-5 flex-shrink-0 text-red-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            <p className="text-sm text-red-800">{error}</p>
          </div>
        </div>
      )}

      {result && (
        <div className="mt-6 space-y-4">
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
            <h3 className="font-semibold text-slate-900">Likely Cause</h3>
            <p className="mt-2 text-sm text-slate-700">{result.likelyCause}</p>
          </div>

          <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
            <h3 className="font-semibold text-slate-900">Fix Steps</h3>
            {result.fixSteps.length === 0 ? (
              <p className="mt-2 text-sm text-slate-500">No fix steps provided.</p>
            ) : (
              <ul className="mt-2 space-y-2">
                {result.fixSteps.map((step, idx) => (
                  <li key={idx} className="flex gap-3 text-sm text-slate-700">
                    <span className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-blue-100 text-xs font-semibold text-blue-700">
                      {idx + 1}
                    </span>
                    {step}
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
            <h3 className="font-semibold text-slate-900">Commands to Try</h3>
            {result.commandsToTry.length === 0 ? (
              <p className="mt-2 text-sm text-slate-500">No commands provided.</p>
            ) : (
              <ul className="mt-2 space-y-2">
                {result.commandsToTry.map((cmd, idx) => (
                  <li key={idx} className="rounded bg-slate-900 p-2 text-xs font-mono text-slate-100">
                    {cmd}
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
            <h3 className="font-semibold text-slate-900">What Not to Do</h3>
            {result.whatNotToDo.length === 0 ? (
              <p className="mt-2 text-sm text-slate-500">No warnings provided.</p>
            ) : (
              <ul className="mt-2 space-y-2">
                {result.whatNotToDo.map((warning, idx) => (
                  <li key={idx} className="flex gap-2 text-sm text-slate-700">
                    <span className="text-amber-600">⚠</span>
                    {warning}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
