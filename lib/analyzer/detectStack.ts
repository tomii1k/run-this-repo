import {
  detectPackageManager,
  type PackageManager,
  type RepoFile as PackageManagerRepoFile,
} from "./detectPackageManager";
import { detectEnvVariables } from "./detectEnvVariables";

export type RepoFile = PackageManagerRepoFile;

export type StackDetectionResult = {
  languages: string[];
  frameworks: string[];
  packageManager: PackageManager;
  needsEnvFile: boolean;
  envVariables: string[];
  needsDatabase: boolean;
  databaseHints: string[];
  needsDocker: boolean;
  startCommands: string[];
  testCommands: string[];
};

type PackageJson = {
  dependencies?: Record<string, string>;
  devDependencies?: Record<string, string>;
  scripts?: Record<string, string>;
};

function hasFile(files: RepoFile[], path: string): boolean {
  const normalized = path.toLowerCase();
  return files.some((file) => file.path.toLowerCase() === normalized);
}

function getFile(files: RepoFile[], path: string): RepoFile | undefined {
  const normalized = path.toLowerCase();
  return files.find((file) => file.path.toLowerCase() === normalized);
}

function parsePackageJson(files: RepoFile[]): PackageJson | null {
  const packageJsonFile = getFile(files, "package.json");
  if (!packageJsonFile) return null;

  try {
    const parsed = JSON.parse(packageJsonFile.content) as PackageJson;
    return parsed && typeof parsed === "object" ? parsed : null;
  } catch {
    return null;
  }
}

function hasDependency(
  packageJson: PackageJson | null,
  dependencyName: string
): boolean {
  if (!packageJson) return false;
  return Boolean(
    packageJson.dependencies?.[dependencyName] ||
      packageJson.devDependencies?.[dependencyName]
  );
}

function toCommand(packageManager: PackageManager, scriptName: string): string {
  if (packageManager === "pnpm") return `pnpm ${scriptName}`;
  if (packageManager === "yarn") return `yarn ${scriptName}`;
  return `npm run ${scriptName}`;
}

function uniq(values: string[]): string[] {
  return [...new Set(values)];
}

function detectPythonFrameworks(files: RepoFile[]): string[] {
  const frameworks = new Set<string>();

  if (hasFile(files, "manage.py")) {
    frameworks.add("Django");
  }

  const pythonEntrypoints = [
    getFile(files, "main.py")?.content ?? "",
    getFile(files, "app.py")?.content ?? "",
  ].join("\n");

  if (/(^|\n)\s*(from|import)\s+fastapi\b/i.test(pythonEntrypoints)) {
    frameworks.add("FastAPI");
  }
  if (/(^|\n)\s*(from|import)\s+flask\b/i.test(pythonEntrypoints)) {
    frameworks.add("Flask");
  }

  return [...frameworks];
}

function detectDatabaseNeeds(
  files: RepoFile[],
  packageJson: PackageJson | null,
  envVariables: string[]
): { needsDatabase: boolean; databaseHints: string[] } {
  const hints = new Set<string>();

  if (hasFile(files, "prisma/schema.prisma")) {
    hints.add("Prisma schema detected (prisma/schema.prisma).");
  }

  const dbDeps = [
    "prisma",
    "@prisma/client",
    "sequelize",
    "typeorm",
    "mongoose",
    "pg",
    "mysql",
    "mysql2",
    "sqlite3",
    "drizzle-orm",
    "knex",
  ];

  for (const dep of dbDeps) {
    if (hasDependency(packageJson, dep)) {
      hints.add(`Database-related dependency detected: ${dep}.`);
    }
  }

  for (const envVar of envVariables) {
    if (
      envVar.includes("DATABASE_URL") ||
      envVar.includes("DB_") ||
      envVar.includes("POSTGRES") ||
      envVar.includes("MYSQL") ||
      envVar.includes("MONGO")
    ) {
      hints.add(`Environment variable suggests database usage: ${envVar}.`);
    }
  }

  const composeFile =
    getFile(files, "docker-compose.yml") ?? getFile(files, "docker-compose.yaml");
  if (composeFile) {
    const composeText = composeFile.content.toLowerCase();
    if (
      composeText.includes("postgres") ||
      composeText.includes("mysql") ||
      composeText.includes("mariadb") ||
      composeText.includes("mongodb") ||
      composeText.includes("redis")
    ) {
      hints.add("Docker Compose includes database/cache service hints.");
    }
  }

  const databaseHints = [...hints];
  return {
    needsDatabase: databaseHints.length > 0,
    databaseHints,
  };
}

export function detectStack(files: RepoFile[]): StackDetectionResult {
  const packageJson = parsePackageJson(files);
  const packageManager = detectPackageManager(files);
  const { needsEnvFile, envVariables } = detectEnvVariables(files);

  const languages = new Set<string>();
  const frameworks = new Set<string>();
  const startCommands: string[] = [];
  const testCommands: string[] = [];

  if (hasFile(files, "package.json")) {
    languages.add("Node.js");
  }
  if (hasFile(files, "requirements.txt") || hasFile(files, "pyproject.toml")) {
    languages.add("Python");
  }
  if (hasFile(files, "go.mod")) {
    languages.add("Go");
  }
  if (hasFile(files, "cargo.toml")) {
    languages.add("Rust");
  }
  if (hasFile(files, "composer.json")) {
    languages.add("PHP");
  }
  if (hasFile(files, "gemfile")) {
    languages.add("Ruby");
  }

  if (
    hasFile(files, "next.config.js") ||
    hasFile(files, "next.config.ts") ||
    hasDependency(packageJson, "next")
  ) {
    frameworks.add("Next.js");
  }
  if (
    hasFile(files, "vite.config.ts") ||
    hasFile(files, "vite.config.js") ||
    hasDependency(packageJson, "vite")
  ) {
    frameworks.add("Vite");
  }
  if (hasFile(files, "prisma/schema.prisma")) {
    frameworks.add("Prisma");
  }
  if (hasFile(files, "docker-compose.yml") || hasFile(files, "docker-compose.yaml")) {
    frameworks.add("Docker Compose");
  }

  for (const framework of detectPythonFrameworks(files)) {
    frameworks.add(framework);
  }

  const scripts = packageJson?.scripts ?? {};
  for (const scriptName of ["dev", "start", "build"] as const) {
    if (scripts[scriptName]) {
      startCommands.push(toCommand(packageManager, scriptName));
    }
  }
  if (scripts.test) {
    testCommands.push(toCommand(packageManager, "test"));
  }

  if (startCommands.length === 0 && hasFile(files, "manage.py")) {
    startCommands.push("python manage.py runserver");
  }
  if (testCommands.length === 0 && hasFile(files, "manage.py")) {
    testCommands.push("python manage.py test");
  }
  if (startCommands.length === 0 && hasFile(files, "main.py")) {
    startCommands.push("python main.py");
  }
  if (startCommands.length === 0 && hasFile(files, "app.py")) {
    startCommands.push("python app.py");
  }

  const needsDocker =
    hasFile(files, "dockerfile") ||
    hasFile(files, "docker-compose.yml") ||
    hasFile(files, "docker-compose.yaml");
  if (needsDocker && startCommands.length === 0) {
    startCommands.push("docker compose up --build");
  }

  const { needsDatabase, databaseHints } = detectDatabaseNeeds(
    files,
    packageJson,
    envVariables
  );

  return {
    languages: uniq([...languages]),
    frameworks: uniq([...frameworks]),
    packageManager,
    needsEnvFile,
    envVariables: uniq(envVariables),
    needsDatabase,
    databaseHints,
    needsDocker,
    startCommands: uniq(startCommands),
    testCommands: uniq(testCommands),
  };
}
