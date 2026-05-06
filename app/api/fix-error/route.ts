import { NextResponse } from "next/server";
import { z } from "zod";

import {
  fixRepoErrorWithAI,
  FixRepoErrorWithAIError,
  RepoErrorFixSchema,
} from "../../../lib/ai/fixRepoErrorWithAI";
import { RepoAnalysisSchema } from "../../../lib/schemas/repoAnalysisSchema";

const FixErrorRequestSchema = z.object({
  repoUrl: z.string().trim().min(1),
  errorText: z.string().trim().min(1),
  previousAnalysis: RepoAnalysisSchema,
});

export async function POST(request: Request) {
  let requestBody: unknown;
  try {
    requestBody = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const parsedRequest = FixErrorRequestSchema.safeParse(requestBody);
  if (!parsedRequest.success) {
    return NextResponse.json(
      {
        error:
          "Invalid request body. Expected { repoUrl: string, errorText: string, previousAnalysis: RepoAnalysis }.",
      },
      { status: 400 }
    );
  }

  try {
    const result = await fixRepoErrorWithAI(parsedRequest.data);
    const validated = RepoErrorFixSchema.safeParse(result);
    if (!validated.success) {
      return NextResponse.json(
        { error: "Error fix response validation failed." },
        { status: 500 }
      );
    }

    return NextResponse.json(validated.data, { status: 200 });
  } catch (error) {
    if (error instanceof FixRepoErrorWithAIError) {
      return NextResponse.json(
        { error: "Failed to translate terminal error." },
        { status: 500 }
      );
    }

    return NextResponse.json({ error: "Internal server error." }, { status: 500 });
  }
}
