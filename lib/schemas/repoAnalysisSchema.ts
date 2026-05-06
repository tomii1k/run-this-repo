import { z } from "zod";

export const RepoAnalysisSchema = z.object({
  projectSummary: z.string(),
  detectedStack: z.object({
    languages: z.array(z.string()),
    frameworks: z.array(z.string()),
    packageManager: z.string(),
    database: z.string().nullable(),
    docker: z.boolean(),
  }),
  difficulty: z.object({
    score: z.number().int().min(1).max(5),
    label: z.enum(["easy", "medium", "hard"]),
    reason: z.string(),
  }),
  requirements: z.array(z.string()),
  setupStepsWindows: z.array(z.string()),
  setupStepsMacLinux: z.array(z.string()),
  envVariables: z.array(
    z.object({
      name: z.string(),
      required: z.boolean(),
      description: z.string(),
      whereToGetIt: z.string(),
    })
  ),
  commonErrors: z.array(
    z.object({
      error: z.string(),
      likelyCause: z.string(),
      fix: z.string(),
    })
  ),
  securityWarnings: z.array(
    z.object({
      level: z.enum(["low", "medium", "high"]),
      warning: z.string(),
      recommendation: z.string(),
    })
  ),
  nextBestAction: z.string(),
});

export type RepoAnalysis = z.infer<typeof RepoAnalysisSchema>;
