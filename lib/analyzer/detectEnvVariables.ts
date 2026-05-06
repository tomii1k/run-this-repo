export type RepoFile = {
  path: string;
  content: string;
  size: number;
};

type EnvDetectionResult = {
  needsEnvFile: boolean;
  envVariables: string[];
};

const ENV_NAME_PATTERN = /^[A-Z_][A-Z0-9_]*$/;

function collectFromEnvExample(content: string, target: Set<string>): void {
  const lines = content.split(/\r?\n/);
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;

    const keyMatch = trimmed.match(/^([A-Za-z_][A-Za-z0-9_]*)\s*=/);
    if (!keyMatch) continue;
    const key = keyMatch[1].toUpperCase();
    if (ENV_NAME_PATTERN.test(key)) target.add(key);
  }
}

function collectFromSource(content: string, target: Set<string>): void {
  const patterns = [
    /process\.env\.([A-Za-z_][A-Za-z0-9_]*)/g,
    /process\.env\[['"]([A-Za-z_][A-Za-z0-9_]*)['"]\]/g,
    /os\.getenv\(\s*['"]([A-Za-z_][A-Za-z0-9_]*)['"]/g,
    /os\.environ\.get\(\s*['"]([A-Za-z_][A-Za-z0-9_]*)['"]/g,
    /os\.environ\[['"]([A-Za-z_][A-Za-z0-9_]*)['"]\]/g,
  ];

  for (const pattern of patterns) {
    for (const match of content.matchAll(pattern)) {
      const key = match[1]?.toUpperCase();
      if (key && ENV_NAME_PATTERN.test(key)) {
        target.add(key);
      }
    }
  }
}

export function detectEnvVariables(files: RepoFile[]): EnvDetectionResult {
  const envVariables = new Set<string>();
  let needsEnvFile = false;

  for (const file of files) {
    const path = file.path.toLowerCase();

    if (path === ".env.example" || path === ".env.local.example") {
      needsEnvFile = true;
      collectFromEnvExample(file.content, envVariables);
    }

    collectFromSource(file.content, envVariables);
  }

  return {
    needsEnvFile,
    envVariables: [...envVariables].sort(),
  };
}
