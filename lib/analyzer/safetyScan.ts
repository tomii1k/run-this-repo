export type RepoFile = {
  path: string;
  content: string;
  size: number;
};

export type ParsedPackageJson = {
  scripts?: Record<string, string>;
};

export type SafetyWarning = {
  title: string;
  explanation: string;
  filePath: string;
  evidence: string;
};

export type SafetyScanResult = {
  riskLevel: "low" | "medium" | "high";
  warnings: SafetyWarning[];
};

type RuleMatch = {
  title: string;
  explanation: string;
  pattern: RegExp;
};

const CONTENT_RULES: RuleMatch[] = [
  {
    title: "Shell pipe download execution",
    explanation:
      "Potential risk: piping remote script output to a shell can execute unreviewed code and needs manual review.",
    pattern: /\bcurl\b[\s\S]{0,120}\|\s*(bash|sh)\b/i,
  },
  {
    title: "Wget pipe download execution",
    explanation:
      "Potential risk: piping downloaded content directly into a shell needs manual review.",
    pattern: /\bwget\b[\s\S]{0,120}\|\s*(bash|sh)\b/i,
  },
  {
    title: "Destructive remove command",
    explanation:
      "Potential risk: forceful recursive deletion commands should be reviewed for safety.",
    pattern: /\brm\s+-rf\b/i,
  },
  {
    title: "PowerShell download-and-execute pattern",
    explanation:
      "Potential risk: download-and-execute patterns in PowerShell can run untrusted payloads and need manual review.",
    pattern:
      /\b(powershell|pwsh)\b[\s\S]{0,180}(invoke-webrequest|iwr|downloadstring|new-object\s+net\.webclient)[\s\S]{0,180}(iex|invoke-expression)\b/i,
  },
  {
    title: "Reading .env and sending over network",
    explanation:
      "Potential risk: code appears to access .env content and send data over network. This should be manually reviewed.",
    pattern:
      /(\.env|dotenv|readFileSync\([^)]*\.env|open\([^)]*\.env)[\s\S]{0,220}(fetch\(|axios\.|http\.request|https\.request|requests\.|urllib\.|socket\.)/i,
  },
  {
    title: "Potential crypto-miner indicators",
    explanation:
      "Potential risk: keywords associated with mining software were found. This may be benign but needs manual review.",
    pattern:
      /\b(stratum\+tcp|xmrig|cryptonight|minergate|coinhive|monero|ethash|cpuminer)\b/i,
  },
  {
    title: "Obfuscated long base64-like string",
    explanation:
      "Potential risk: very long encoded strings can indicate obfuscated payloads and should be reviewed manually.",
    pattern: /(?:["'`])([A-Za-z0-9+/]{200,}={0,2})(?:["'`])/,
  },
  {
    title: "Node child_process usage",
    explanation:
      "Potential risk: spawning shell commands via child_process can be unsafe depending on inputs and command source.",
    pattern:
      /\b(require\(["']child_process["']\)|from\s+["']child_process["']|child_process\.(exec|spawn|fork|execFile)|\bexec\(|\bspawn\()/i,
  },
  {
    title: "Dynamic code execution usage",
    explanation:
      "Potential risk: eval-like dynamic execution patterns should be reviewed for injection risks.",
    pattern: /\b(eval\s*\(|new Function\s*\()/i,
  },
  {
    title: "Potential hardcoded private key",
    explanation:
      "Potential risk: private key material appears to be committed. Rotate secrets and review exposure immediately.",
    pattern: /-----BEGIN (RSA|EC|OPENSSH|DSA|PRIVATE) KEY-----/i,
  },
  {
    title: "Potential hardcoded API key/token",
    explanation:
      "Potential risk: key/token-like string found in source. This may be a placeholder but needs manual review.",
    pattern:
      /\b(ghp_[A-Za-z0-9]{20,}|github_pat_[A-Za-z0-9_]{20,}|sk-[A-Za-z0-9]{20,}|AIza[0-9A-Za-z\-_]{20,}|xox[baprs]-[A-Za-z0-9-]{20,})\b/,
  },
];

function safeSnippet(content: string, index: number, max = 180): string {
  const start = Math.max(0, index - Math.floor(max / 3));
  const end = Math.min(content.length, start + max);
  return content.slice(start, end).replace(/\s+/g, " ").trim();
}

function addWarning(
  warnings: SafetyWarning[],
  warning: SafetyWarning,
  dedupeKeySet: Set<string>
): void {
  const key = `${warning.filePath}:${warning.title}:${warning.evidence}`;
  if (dedupeKeySet.has(key)) return;
  dedupeKeySet.add(key);
  warnings.push(warning);
}

function scoreRisk(warnings: SafetyWarning[]): "low" | "medium" | "high" {
  if (warnings.length === 0) return "low";

  const highSignalTitles = new Set([
    "Potential hardcoded private key",
    "PowerShell download-and-execute pattern",
    "Reading .env and sending over network",
    "Potential crypto-miner indicators",
  ]);

  const highSignalCount = warnings.filter((w) =>
    highSignalTitles.has(w.title)
  ).length;

  if (highSignalCount >= 2 || warnings.length >= 6) return "high";
  return "medium";
}

export function safetyScan(input: {
  files: RepoFile[];
  packageJson?: ParsedPackageJson | null;
}): SafetyScanResult {
  const warnings: SafetyWarning[] = [];
  const dedupe = new Set<string>();

  const { files, packageJson } = input;

  const scripts = packageJson?.scripts ?? {};
  for (const hook of ["preinstall", "postinstall", "prepare"] as const) {
    const script = scripts[hook];
    if (!script) continue;

    addWarning(
      warnings,
      {
        title: `package.json ${hook} script`,
        explanation:
          "Potential risk: install lifecycle scripts execute automatically and should be reviewed before running.",
        filePath: "package.json",
        evidence: `${hook}: ${script}`.slice(0, 200),
      },
      dedupe
    );
  }

  for (const file of files) {
    for (const rule of CONTENT_RULES) {
      const match = rule.pattern.exec(file.content);
      if (!match || typeof match.index !== "number") continue;

      addWarning(
        warnings,
        {
          title: rule.title,
          explanation: rule.explanation,
          filePath: file.path,
          evidence: safeSnippet(file.content, match.index),
        },
        dedupe
      );
    }
  }

  return {
    riskLevel: scoreRisk(warnings),
    warnings,
  };
}
