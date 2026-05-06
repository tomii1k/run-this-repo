import OpenAI from "openai";

import {
  RepoAnalysisSchema,
  type RepoAnalysis,
} from "../schemas/repoAnalysisSchema";
import type { SafetyScanResult } from "../analyzer/safetyScan";

export type FetchedRepoFile = {
  path: string;
  content: string;
  size: number;
  truncated?: boolean;
};

export type DetectedStack = {
  languages: string[];
  frameworks: string[];
  packageManager: string;
  needsEnvFile: boolean;
  envVariables: string[];
  needsDatabase: boolean;
  databaseHints: string[];
  needsDocker: boolean;
  startCommands: string[];
  testCommands: string[];
};

export type AnalyzeRepoWithAIInput = {
  repoUrl: string;
  fetchedFiles: FetchedRepoFile[];
  detectedStack: DetectedStack;
  safetyScan: SafetyScanResult;
};

export class AnalyzeRepoWithAIError extends Error {
  public readonly code:
    | "MISSING_OPENAI_API_KEY"
    | "INVALID_AI_RESPONSE"
    | "SCHEMA_VALIDATION_FAILED";

  constructor(code: AnalyzeRepoWithAIError["code"], message: string) {
    super(message);
    this.name = "AnalyzeRepoWithAIError";
    this.code = code;
  }
}

const DEFAULT_MODEL = "gpt-4.1-mini";
const MAX_FILE_CONTENT_CHARS = 8_000;
const MAX_FILES_IN_PROMPT = 25;

function truncateForPrompt(content: string): string {
  if (content.length <= MAX_FILE_CONTENT_CHARS) return content;
  return `${content.slice(0, MAX_FILE_CONTENT_CHARS)}\n\n[TRUNCATED_FOR_PROMPT]`;
}

function buildPromptPayload(input: AnalyzeRepoWithAIInput): string {
  const filesForPrompt = input.fetchedFiles.slice(0, MAX_FILES_IN_PROMPT).map((file) => ({
    path: file.path,
    size: file.size,
    truncated: Boolean(file.truncated),
    content: truncateForPrompt(file.content),
  }));

  return JSON.stringify(
    {
      repoUrl: input.repoUrl,
      detectedStack: input.detectedStack,
      safetyScan: input.safetyScan,
      files: filesForPrompt,
    },
    null,
    2
  );
}

function buildInstructions(): string {
  return [
    "You are a repository setup assistant for beginners.",
    "Return only valid JSON, no markdown and no additional text.",
    "Your JSON must match the required schema exactly.",
    "Do not invent files that were not provided.",
    "Do not invent API keys, tokens, secrets, or environment values.",
    'If something is unclear from the provided files, explicitly say "unclear".',
    "Prefer exact commands found in package.json scripts when available.",
    "Warn users not to run unknown code blindly and suggest manual review where appropriate.",
    "Generate beginner-friendly, practical guidance.",
    "Keep Windows PowerShell and Mac/Linux terminal setup steps separate.",
    "Use concise and actionable steps.",
  ].join(" ");
}

function buildSchemaGuide(): string {
  return JSON.stringify(
    {
      projectSummary: "string",
      detectedStack: {
        languages: ["string"],
        frameworks: ["string"],
        packageManager: "string",
        database: "string | null",
        docker: true,
      },
      difficulty: {
        score: "number (1-5)",
        label: "easy | medium | hard",
        reason: "string",
      },
      requirements: ["string"],
      setupStepsWindows: ["string"],
      setupStepsMacLinux: ["string"],
      envVariables: [
        {
          name: "string",
          required: true,
          description: "string",
          whereToGetIt: "string",
        },
      ],
      commonErrors: [
        {
          error: "string",
          likelyCause: "string",
          fix: "string",
        },
      ],
      securityWarnings: [
        {
          level: "low | medium | high",
          warning: "string",
          recommendation: "string",
        },
      ],
      nextBestAction: "string",
    },
    null,
    2
  );
}

export async function analyzeRepoWithAI(
  input: AnalyzeRepoWithAIInput
): Promise<RepoAnalysis> {
  const apiKey = process.env.OPENAI_API_KEY?.trim();
  if (!apiKey) {
    throw new AnalyzeRepoWithAIError(
      "MISSING_OPENAI_API_KEY",
      "Missing OPENAI_API_KEY."
    );
  }

  const client = new OpenAI({ apiKey });
  const model = process.env.OPENAI_MODEL?.trim() || DEFAULT_MODEL;

  const response = await client.responses.create({
    model,
    instructions: buildInstructions(),
    input: [
      {
        role: "user",
        content: [
          {
            type: "input_text",
            text: [
              "Analyze this repository context and produce structured setup guidance.",
              "",
              "Required JSON schema:",
              buildSchemaGuide(),
              "",
              "Repository context:",
              buildPromptPayload(input),
            ].join("\n"),
          },
        ],
      },
    ],
  });

  const rawOutput = response.output_text?.trim();
  if (!rawOutput) {
    throw new AnalyzeRepoWithAIError(
      "INVALID_AI_RESPONSE",
      "AI returned an empty response."
    );
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(rawOutput);
  } catch {
    throw new AnalyzeRepoWithAIError(
      "INVALID_AI_RESPONSE",
      "AI returned non-JSON output."
    );
  }

  const validated = RepoAnalysisSchema.safeParse(parsed);
  if (!validated.success) {
    throw new AnalyzeRepoWithAIError(
      "SCHEMA_VALIDATION_FAILED",
      `AI response failed schema validation: ${validated.error.message}`
    );
  }

  return validated.data;
}
