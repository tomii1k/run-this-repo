#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// First, create all required directories
const basePath = process.cwd();
const dirs = [
  path.join(basePath, 'lib', 'supabase'),
  path.join(basePath, 'app', 'login'),
  path.join(basePath, 'app', 'dashboard', 'analyses', '[id]'),
  path.join(basePath, 'app', 'api', 'auth', 'logout'),
  path.join(basePath, 'app', 'api', 'analyses', 'save'),
];

console.log('Creating directories...');
dirs.forEach(dir => {
  fs.mkdirSync(dir, { recursive: true });
  console.log(`✓ Created: ${dir}`);
});

// File contents
const files = {
  'lib/supabase/client.ts': `import { createBrowserClient } from "@supabase/ssr";

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}`,
  
  'lib/supabase/server.ts': `import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // Cookies can throw in edge runtime
          }
        },
      },
    }
  );
}`,
  
  'app/login/page.tsx': `"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "../../lib/supabase/client";

export default function LoginPage() {
  const router = useRouter();
  const supabase = createClient();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSignUp, setIsSignUp] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      if (isSignUp) {
        const { error: signUpError } = await supabase.auth.signUp({
          email,
          password,
        });

        if (signUpError) {
          setError(signUpError.message);
          return;
        }

        setEmail("");
        setPassword("");
        setIsSignUp(false);
        alert("Sign up successful! Please sign in with your credentials.");
      } else {
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (signInError) {
          setError(signInError.message);
          return;
        }

        router.push("/dashboard");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div>
          <Link href="/">
            <h1 className="text-2xl font-bold text-gray-900 text-center mb-2">
              RunThisRepo
            </h1>
          </Link>
          <h2 className="text-center text-2xl font-bold text-gray-900">
            {isSignUp ? "Create your account" : "Sign in to your account"}
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            {isSignUp ? "Already have an account? " : "Don't have an account? "}
            <button
              type="button"
              onClick={() => {
                setIsSignUp(!isSignUp);
                setError(null);
              }}
              className="font-medium text-blue-600 hover:text-blue-500"
            >
              {isSignUp ? "Sign in" : "Sign up"}
            </button>
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
                className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:bg-gray-100"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete={isSignUp ? "new-password" : "current-password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
                className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:bg-gray-100"
                placeholder="••••••••"
              />
            </div>
          </div>

          {error && (
            <div className="rounded-lg border border-red-200 bg-red-50 p-3">
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading || !email || !password}
            className="w-full rounded-lg bg-blue-600 px-4 py-2.5 font-semibold text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {isLoading ? "Loading..." : isSignUp ? "Create account" : "Sign in"}
          </button>
        </form>

        <p className="text-center text-sm text-gray-600">
          Or continue as{" "}
          <Link href="/" className="font-medium text-blue-600 hover:text-blue-500">
            anonymous user
          </Link>
        </p>
      </div>
    </div>
  );
}`,

  'app/dashboard/page.tsx': `import React from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "../../lib/supabase/server";
import type { RepoAnalysis } from "../../lib/schemas/repoAnalysisSchema";

interface SavedAnalysis {
  id: string;
  repo_url: string;
  analysis: RepoAnalysis;
  created_at: string;
}

function extractRepoName(url: string): string {
  try {
    const match = url.match(/github\\.com\\/([^\\/]+)\\/([^\\/]+)/);
    if (match) {
      return \`\${match[1]}/\${match[2]}\`;
    }
    return url;
  } catch {
    return url;
  }
}

export default async function DashboardPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: analyses, error } = await supabase
    .from("repo_analyses")
    .select("id, repo_url, analysis, created_at")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(5);

  if (error) {
    console.error("Failed to fetch analyses:", error);
  }

  const savedAnalyses = (analyses || []) as SavedAnalysis[];

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="border-b border-gray-200 bg-white">
        <div className="mx-auto max-w-6xl px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <Link href="/">
              <div className="text-xl font-bold text-gray-900 hover:text-gray-700 cursor-pointer">
                RunThisRepo
              </div>
            </Link>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">{user.email}</span>
              <Link
                href="/api/auth/logout"
                className="text-sm font-medium text-gray-600 hover:text-gray-900"
              >
                Logout
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <main className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Your Analyses</h1>
          <p className="mt-2 text-gray-600">View your last 5 repository analyses</p>
        </div>

        {savedAnalyses.length === 0 ? (
          <div className="rounded-lg border border-dashed border-gray-300 bg-gray-50 p-12 text-center">
            <p className="text-gray-500 mb-4">No analyses saved yet</p>
            <Link
              href="/"
              className="inline-flex rounded-lg bg-blue-600 px-4 py-2 font-semibold text-white hover:bg-blue-700"
            >
              Analyze a repository
            </Link>
          </div>
        ) : (
          <div className="grid gap-4">
            {savedAnalyses.map((item) => (
              <Link key={item.id} href={\`/dashboard/analyses/\${item.id}\`}>
                <div className="rounded-lg border border-gray-200 bg-white p-6 hover:shadow-md transition-shadow cursor-pointer">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        {extractRepoName(item.repo_url)}
                      </h3>
                      <p className="mt-1 text-sm text-gray-600">{item.repo_url}</p>
                      <p className="mt-2 text-xs text-gray-500">
                        {new Date(item.created_at).toLocaleDateString()} at{" "}
                        {new Date(item.created_at).toLocaleTimeString()}
                      </p>
                    </div>
                    <svg
                      className="h-5 w-5 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}`,

  'app/dashboard/analyses/[id]/page.tsx': `import React from "react";
import Link from "next/link";
import { redirect, notFound } from "next/navigation";
import { createClient } from "../../../../lib/supabase/server";
import AnalysisResult from "../../../../app/AnalysisResult";
import type { RepoAnalysis } from "../../../../lib/schemas/repoAnalysisSchema";

interface PageParams {
  params: Promise<{
    id: string;
  }>;
}

export default async function AnalysisDetailPage({ params }: PageParams) {
  const { id } = await params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: analysis, error } = await supabase
    .from("repo_analyses")
    .select("id, repo_url, analysis, created_at")
    .eq("id", id)
    .eq("user_id", user.id)
    .single();

  if (error || !analysis) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="border-b border-gray-200 bg-white">
        <div className="mx-auto max-w-6xl px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <Link href="/">
              <div className="text-xl font-bold text-gray-900 hover:text-gray-700 cursor-pointer">
                RunThisRepo
              </div>
            </Link>
            <Link
              href="/dashboard"
              className="text-sm text-gray-600 hover:text-gray-900"
            >
              ← Back to dashboard
            </Link>
          </div>
        </div>
      </nav>

      <main className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        <AnalysisResult
          repoUrl={analysis.repo_url}
          isLoading={false}
          error={null}
          analysis={analysis.analysis as RepoAnalysis}
        />
      </main>
    </div>
  );
}`,

  'app/api/auth/logout/route.ts': `import { createClient } from "../../../../lib/supabase/server";
import { redirect } from "next/navigation";

export async function GET() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/");
}`,

  'app/api/analyses/save/route.ts': `import { NextResponse } from "next/server";
import { createClient } from "../../../../lib/supabase/server";
import type { RepoAnalysis } from "../../../../lib/schemas/repoAnalysisSchema";

interface SaveAnalysisRequest {
  repoUrl: string;
  analysis: RepoAnalysis;
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as SaveAnalysisRequest;
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not authenticated" },
        { status: 401 }
      );
    }

    const { error } = await supabase.from("repo_analyses").insert({
      user_id: user.id,
      repo_url: body.repoUrl,
      analysis: body.analysis,
    });

    if (error) {
      console.error("Failed to save analysis:", error);
      return NextResponse.json(
        { success: false, message: "Failed to save analysis" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("POST /api/analyses/save failed:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}`
};

console.log('\nCreating files...');
Object.entries(files).forEach(([filePath, content]) => {
  const fullPath = path.join(basePath, filePath);
  const directory = path.dirname(fullPath);
  
  // Ensure directory exists
  fs.mkdirSync(directory, { recursive: true });
  
  // Write the file
  fs.writeFileSync(fullPath, content, 'utf8');
  console.log(`✓ Created: ${filePath}`);
});

console.log('\n✨ Setup complete! All files have been created successfully.');
