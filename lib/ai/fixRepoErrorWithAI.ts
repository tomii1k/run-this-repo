import OpenAI from "openai";
import { z } from "zod";

import type { RepoAnalysis } from "../schemas/repoAnalysisSchema";

export const RepoErrorFixSchema = z.object({
  likelyCause: z.string(),
  fixSteps: z.array(z.string()),
  commandsToTry: z.array(z.string()),
  whatNotToDo: z.array(z.string()),
});

export type RepoErrorFix = z.infer<typeof RepoErrorFixSchema>;

export type FixRepoErrorWithAIInput = {
  repoUrl: string;
  errorText: string;
  previousAnalysis: RepoAnalysis;
};

export class FixRepoErrorWithAIError extends Error {
  public readonly code:
    | "MISSING_OPENAI_API_KEY"
    | "INVALID_AI_RESPONSE"
    | "SCHEMA_VALIDATION_FAILED";

  constructor(code: FixRepoErrorWithAIError["code"], message: string) {
    super(message);
    this.name = "FixRepoErrorWithAIError";
    this.code = code;
  }
}

const DEFAULT_MODEL = "gpt-4.1-mini";

function buildInstructions(): string {
  return [
    "You are a practical terminal error translator for beginners.",
    "Return only valid JSON with keys: likelyCause, fixSteps, commandsToTry, whatNotToDo.",
    "Do not invent context that is not in the error text or previous analysis.",
    'If information is missing, say "unclear".',
    "If the error suggests missing environment variables, explain exactly where to place them (for example .env.local, .env, or shell export) based on the detected stack.",
    "If the error suggests package manager mismatch, explicitly state whether npm, pnpm, or yarn should be used based on previousAnalysis.detectedStack.packageManager.",
    "Prefer concrete commands and safe recovery steps.",
    "Warn users not to run unknown commands blindly.",
  ].join(" ");
}

function buildPayload(input: FixRepoErrorWithAIInput): string {
  return JSON.stringify(
    {
      repoUrl: input.repoUrl,
      errorText: input.errorText,
      previousAnalysis: input.previousAnalysis,
    },
    null,
    2
  );
}

export async function fixRepoErrorWithAI(
  input: FixRepoErrorWithAIInput
): Promise<RepoErrorFix> {
  const apiKey = process.env.OPENAI_API_KEY?.trim();
  if (!apiKey) {
    throw new FixRepoErrorWithAIError(
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
              "Translate this terminal error and suggest safe practical fixes.",
              "",
              buildPayload(input),
            ].join("\n"),
          },
        ],
      },
    ],
  });

  const rawOutput = response.output_text?.trim();
  if (!rawOutput) {
    throw new FixRepoErrorWithAIError(
      "INVALID_AI_RESPONSE",
      "AI returned an empty response."
    );
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(rawOutput);
  } catch {
    throw new FixRepoErrorWithAIError(
      "INVALID_AI_RESPONSE",
      "AI returned non-JSON output."
    );
  }

  const validated = RepoErrorFixSchema.safeParse(parsed);
  if (!validated.success) {
    throw new FixRepoErrorWithAIError(
      "SCHEMA_VALIDATION_FAILED",
      `AI response failed schema validation: ${validated.error.message}`
    );
  }

  return validated.data;
}
