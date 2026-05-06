"use client";

import React, { useState } from "react";

type Props = {
  onAnalyze: (repoUrl: string) => void | Promise<void>;
  isLoading?: boolean;
};

export default function RepoInputForm({ onAnalyze, isLoading = false }: Props) {
  const [value, setValue] = useState("");
  const [error, setError] = useState<string | null>(null);

  function validateUrl(input: string) {
    const trimmed = input.trim();
    return /^(?:https?:\/\/)?(?:www\.)?github\.com\/[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+(?:\.git)?\/?$/.test(trimmed);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!validateUrl(value)) {
      setError(
        "Please enter a valid public GitHub repository URL (example: https://github.com/owner/repo)."
      );
      return;
    }

    await onAnalyze(value.trim());
  }

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="flex flex-col gap-2 sm:flex-row">
        <input
          aria-label="GitHub repository URL"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="https://github.com/owner/repo"
          disabled={isLoading}
          className="flex-1 rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:bg-gray-100 disabled:text-gray-500"
        />
        <button
          type="submit"
          disabled={!value.trim() || isLoading}
          className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 disabled:bg-gray-400 disabled:cursor-not-allowed sm:w-auto"
        >
          {isLoading ? (
            <>
              <svg className="mr-2 h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" className="opacity-25" />
                <path
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  className="opacity-75"
                />
              </svg>
              Analyzing...
            </>
          ) : (
            "Analyze"
          )}
        </button>
      </div>

      {error && (
        <p className="mt-2 text-sm text-red-600">{error}</p>
      )}
    </form>
  );
}
