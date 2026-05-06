import { NextResponse } from "next/server";
import { z } from "zod";

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

export async function POST(request: Request) {
  const isDevelopment = process.env.NODE_ENV === "development";
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
