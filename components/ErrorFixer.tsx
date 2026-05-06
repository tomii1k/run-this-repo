"use client";

import { useState } from "react";

import type { RepoAnalysis } from "../lib/schemas/repoAnalysisSchema";
import type { RepoErrorFix } from "../lib/ai/fixRepoErrorWithAI";

type ErrorFixerProps = {
  repoUrl: string;
  previousAnalysis: RepoAnalysis;
};

function List({ items }: { items: string[] }) {
  if (items.length === 0) return <p className="text-gray-500">No items.</p>;

  return (
    <ul className="list-disc space-y-1 pl-5">
      {items.map((item, index) => (
        <li key={`${item}-${index}`}>{item}</li>
      ))}
    </ul>
  );
}

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
    <section className="rounded-lg border border-gray-200 bg-white p-4">
      <h2 className="text-lg font-semibold text-gray-900">Terminal Error Translator</h2>
      <p className="mt-1 text-sm text-gray-600">
        Paste a terminal error and get likely cause and practical next steps.
      </p>

      <form onSubmit={handleSubmit} className="mt-4 space-y-3">
        <textarea
          value={errorText}
          onChange={(event) => setErrorText(event.target.value)}
          placeholder="Paste your terminal error here..."
          disabled={isLoading}
          rows={6}
          className="w-full rounded border border-gray-300 p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 disabled:bg-gray-100"
        />
        <button
          type="submit"
          disabled={isLoading || !errorText.trim()}
          className="rounded bg-blue-600 px-4 py-2 text-white disabled:opacity-50"
        >
          {isLoading ? "Translating..." : "Explain Error"}
        </button>
      </form>

      {error && (
        <div className="mt-4 rounded border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {result && (
        <div className="mt-4 space-y-4">
          <div className="rounded border border-gray-200 p-3">
            <h3 className="font-medium">Likely Cause</h3>
            <p className="mt-1 text-sm text-gray-700">{result.likelyCause}</p>
          </div>
          <div className="rounded border border-gray-200 p-3">
            <h3 className="font-medium">Fix Steps</h3>
            <div className="mt-1 text-sm text-gray-700">
              <List items={result.fixSteps} />
            </div>
          </div>
          <div className="rounded border border-gray-200 p-3">
            <h3 className="font-medium">Commands to Try</h3>
            <div className="mt-1 text-sm text-gray-700">
              <List items={result.commandsToTry} />
            </div>
          </div>
          <div className="rounded border border-gray-200 p-3">
            <h3 className="font-medium">What Not to Do</h3>
            <div className="mt-1 text-sm text-gray-700">
              <List items={result.whatNotToDo} />
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
