import { NextResponse } from "next/server";
import { z } from "zod";
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";

import { analyzeRepoWithAI, AnalyzeRepoWithAIError } from "../../../lib/ai/analyzeRepoWithAI";
import { detectStack } from "../../../lib/analyzer/detectStack";
import { safetyScan, type ParsedPackageJson } from "../../../lib/analyzer/safetyScan";
import { fetchRepoFiles, RepoFileFetchError } from "../../../lib/github/fetchRepoFiles";
import { parseGitHubRepoUrl } from "../../../lib/github/parseRepoUrl";
import { RepoAnalysisSchema } from "../../../lib/schemas/repoAnalysisSchema";

const AnalyzeRequestSchema = z.object({
  repoUrl: z.string().trim().min(1),
});

function parsePackageJsonScripts(
  fetchedFiles: { path: string; content: string }[]
): ParsedPackageJson | null {
  const packageJsonFile = fetchedFiles.find(
    (file) => file.path.toLowerCase() === "package.json"
  );
  if (!packageJsonFile) return null;

  try {
    const parsed = JSON.parse(packageJsonFile.content) as { scripts?: unknown };
    if (!parsed || typeof parsed !== "object") return null;
    if (!parsed.scripts || typeof parsed.scripts !== "object") return null;

    const scriptEntries = Object.entries(parsed.scripts).filter(
      ([key, value]) => typeof key === "string" && typeof value === "string"
    );

    return {
      scripts: Object.fromEntries(scriptEntries),
    };
  } catch {
    return null;
  }
}

async function getUserId(): Promise<string | null> {
  const cookieStore = await cookies();
  const supabase = createServerClient(
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

  const { data } = await supabase.auth.getUser();
  return data.user?.id || null;
}

async function saveAnalysis(
  userId: string,
  repoUrl: string,
  repoName: string,
  analysis: unknown
): Promise<void> {
  const cookieStore = await cookies();
  const supabase = createServerClient(
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

  const { error } = await supabase.from("repo_analyses").insert({
    user_id: userId,
    repo_url: repoUrl,
    repo_name: repoName,
    analysis_json: analysis,
    created_at: new Date().toISOString(),
  });

  if (error && process.env.NODE_ENV === "development") {
    console.error("Failed to save analysis to database:", error);
  }
}

export async function POST(request: Request) {
  const isDevelopment = process.env.NODE_ENV === "development";

  // Check authentication - require logged-in user
  const userId = await getUserId();
  if (!userId) {
    return NextResponse.json(
      { error: "Authentication required. Please log in to analyze repositories." },
      { status: 401 }
    );
  }

  let requestBody: unknown;
  try {
    requestBody = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid JSON body." },
      { status: 400 }
    );
  }

  const parsedRequest = AnalyzeRequestSchema.safeParse(requestBody);
  if (!parsedRequest.success) {
    return NextResponse.json(
      { error: "Invalid request body. Expected { repoUrl: string }." },
      { status: 400 }
    );
  }

  const parsedRepo = parseGitHubRepoUrl(parsedRequest.data.repoUrl);
  if (!parsedRepo) {
    return NextResponse.json(
      { error: "Invalid GitHub repository URL." },
      { status: 400 }
    );
  }

  try {
    const fetchedFiles = await fetchRepoFiles(parsedRepo);
    const stack = detectStack(fetchedFiles);
    const parsedPackageJson = parsePackageJsonScripts(fetchedFiles);
    const safety = safetyScan({
      files: fetchedFiles,
      packageJson: parsedPackageJson,
    });

    const analysis = await analyzeRepoWithAI({
      repoUrl: parsedRequest.data.repoUrl,
      fetchedFiles,
      detectedStack: stack,
      safetyScan: safety,
    });

    const validated = RepoAnalysisSchema.safeParse(analysis);
    if (!validated.success) {
      return NextResponse.json(
        { error: "Analysis schema validation failed." },
        { status: 500 }
      );
    }

    // Save analysis for authenticated user
    const repoName = parsedRepo.owner + "/" + parsedRepo.repo;
    await saveAnalysis(userId, parsedRequest.data.repoUrl, repoName, validated.data);

    return NextResponse.json(validated.data, { status: 200 });
  } catch (error) {
    if (isDevelopment) {
      console.error("POST /api/analyze failed", error);
    }

    if (error instanceof RepoFileFetchError) {
      if (error.code === "REPO_NOT_FOUND") {
        return NextResponse.json(
          { error: "Repository not found." },
          { status: 404 }
        );
      }

      if (error.code === "RATE_LIMITED") {
        return NextResponse.json(
          { error: "GitHub API rate limit reached. Please try again later." },
          { status: 429 }
        );
      }

      return NextResponse.json(
        { error: "Failed to fetch repository files." },
        { status: 500 }
      );
    }

    if (error instanceof AnalyzeRepoWithAIError) {
      return NextResponse.json(
        { error: "Failed to generate repository analysis." },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { error: "Internal server error." },
      { status: 500 }
    );
  }
}
