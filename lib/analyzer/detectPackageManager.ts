export type RepoFile = {
  path: string;
  content: string;
  size: number;
};

export type PackageManager =
  | "npm"
  | "pnpm"
  | "yarn"
  | "pip"
  | "poetry"
  | "docker"
  | "unknown";

export function detectPackageManager(files: RepoFile[]): PackageManager {
  const paths = new Set(files.map((file) => file.path.toLowerCase()));

  if (paths.has("pnpm-lock.yaml")) return "pnpm";
  if (paths.has("yarn.lock")) return "yarn";
  if (paths.has("package-lock.json")) return "npm";

  if (paths.has("poetry.lock")) return "poetry";
  if (paths.has("requirements.txt") || paths.has("pyproject.toml")) return "pip";

  if (paths.has("package.json")) return "npm";

  if (
    paths.has("dockerfile") ||
    paths.has("docker-compose.yml") ||
    paths.has("docker-compose.yaml")
  ) {
    return "docker";
  }

  return "unknown";
}
