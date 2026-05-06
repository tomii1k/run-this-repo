import { IMPORTANT_FILES } from "./importantFiles";

type RepoRef = {
  owner: string;
  repo: string;
};

export type RepoFile = {
  path: string;
  content: string;
  size: number;
  truncated?: boolean;
};

type RootContentEntry = {
  type: "file" | "dir" | "symlink" | "submodule";
  name: string;
  path: string;
  size?: number;
};

type ContentFileResponse = {
  type: "file";
  name: string;
  path: string;
  size: number;
  content?: string;
  encoding?: string;
  download_url?: string | null;
};

export class RepoFileFetchError extends Error {
  public readonly code:
    | "REPO_NOT_FOUND"
    | "RATE_LIMITED"
    | "INVALID_RESPONSE"
    | "PRIVATE_REPO_NOT_SUPPORTED"
    | "GITHUB_API_ERROR";
  public readonly status?: number;

  constructor(
    code: RepoFileFetchError["code"],
    message: string,
    status?: number
  ) {
    super(message);
    this.name = "RepoFileFetchError";
    this.code = code;
    this.status = status;
  }
}

const DEFAULT_MAX_FILE_CONTENT_BYTES = 50_000;
const GITHUB_API_BASE = "https://api.github.com";

function getGitHubHeaders(): HeadersInit {
  const headers: Record<string, string> = {
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
  };

  const token = process.env.GITHUB_TOKEN?.trim();
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  return headers;
}

async function parseGitHubResponse<T>(response: Response): Promise<T> {
  if (response.status === 404) {
    throw new RepoFileFetchError(
      "REPO_NOT_FOUND",
      "Repository not found or inaccessible.",
      404
    );
  }

  if (
    response.status === 429 ||
    (response.status === 403 &&
      response.headers.get("x-ratelimit-remaining") === "0")
  ) {
    throw new RepoFileFetchError(
      "RATE_LIMITED",
      "GitHub API rate limit reached. Please try again later.",
      response.status
    );
  }

  if (!response.ok) {
    throw new RepoFileFetchError(
      "GITHUB_API_ERROR",
      `GitHub API request failed with status ${response.status}.`,
      response.status
    );
  }

  let data: unknown;
  try {
    data = await response.json();
  } catch {
    throw new RepoFileFetchError(
      "INVALID_RESPONSE",
      "GitHub API returned non-JSON content."
    );
  }

  return data as T;
}

async function fetchRepoMetadata(
  owner: string,
  repo: string
): Promise<{ private: boolean }> {
  const res = await fetch(`${GITHUB_API_BASE}/repos/${owner}/${repo}`, {
    method: "GET",
    headers: getGitHubHeaders(),
    cache: "no-store",
  });
  const data = await parseGitHubResponse<{ private?: unknown }>(res);

  if (typeof data?.private !== "boolean") {
    throw new RepoFileFetchError(
      "INVALID_RESPONSE",
      "Invalid repository metadata received from GitHub."
    );
  }

  return { private: data.private };
}

async function fetchRootContents(
  owner: string,
  repo: string
): Promise<RootContentEntry[]> {
  const res = await fetch(`${GITHUB_API_BASE}/repos/${owner}/${repo}/contents`, {
    method: "GET",
    headers: getGitHubHeaders(),
    cache: "no-store",
  });
  const data = await parseGitHubResponse<unknown>(res);

  if (!Array.isArray(data)) {
    throw new RepoFileFetchError(
      "INVALID_RESPONSE",
      "Root contents response is not an array."
    );
  }

  const entries: RootContentEntry[] = [];
  for (const item of data) {
    const entry = item as Partial<RootContentEntry>;
    if (
      typeof entry?.name === "string" &&
      typeof entry?.path === "string" &&
      typeof entry?.type === "string"
    ) {
      entries.push({
        name: entry.name,
        path: entry.path,
        type: entry.type as RootContentEntry["type"],
        size: typeof entry.size === "number" ? entry.size : undefined,
      });
    }
  }

  return entries;
}

function decodeBase64ToUtf8(value: string): string {
  const normalized = value.replace(/\n/g, "");
  return Buffer.from(normalized, "base64").toString("utf8");
}

function truncateContent(content: string, maxBytes: number): string {
  const byteLength = Buffer.byteLength(content, "utf8");
  if (byteLength <= maxBytes) {
    return content;
  }

  const truncated = Buffer.from(content, "utf8")
    .subarray(0, maxBytes)
    .toString("utf8");
  return `${truncated}\n\n[TRUNCATED]`;
}

async function fetchFileByPath(
  owner: string,
  repo: string,
  path: string,
  maxFileContentBytes: number
): Promise<RepoFile | null> {
  const res = await fetch(
    `${GITHUB_API_BASE}/repos/${owner}/${repo}/contents/${encodeURIComponent(path).replace(/%2F/g, "/")}`,
    {
      method: "GET",
      headers: getGitHubHeaders(),
      cache: "no-store",
    }
  );

  if (res.status === 404) {
    return null;
  }

  const data = await parseGitHubResponse<unknown>(res);
  const file = data as Partial<ContentFileResponse>;

  if (file?.type !== "file" || typeof file.path !== "string") {
    return null;
  }

  if (typeof file.size !== "number") {
    throw new RepoFileFetchError(
      "INVALID_RESPONSE",
      `Invalid file size for ${path}.`
    );
  }

  let content = "";
  if (typeof file.content === "string" && file.encoding === "base64") {
    content = decodeBase64ToUtf8(file.content);
  } else if (typeof file.download_url === "string" && file.download_url) {
    const rawRes = await fetch(file.download_url, {
      method: "GET",
      headers: getGitHubHeaders(),
      cache: "no-store",
    });
    if (!rawRes.ok) {
      throw new RepoFileFetchError(
        "GITHUB_API_ERROR",
        `Failed to download raw file for ${path}.`,
        rawRes.status
      );
    }
    content = await rawRes.text();
  } else {
    throw new RepoFileFetchError(
      "INVALID_RESPONSE",
      `No readable file content returned for ${path}.`
    );
  }

  const truncatedContent = truncateContent(content, maxFileContentBytes);
  return {
    path: file.path,
    content: truncatedContent,
    size: file.size,
    truncated: Buffer.byteLength(content, "utf8") > maxFileContentBytes,
  };
}

function resolveImportantPathsFromRoot(rootEntries: RootContentEntry[]): string[] {
  const entryMap = new Map<string, RootContentEntry>();
  for (const entry of rootEntries) {
    entryMap.set(entry.path.toLowerCase(), entry);
  }

  const resolved: string[] = [];
  for (const path of IMPORTANT_FILES) {
    if (!path.includes("/")) {
      const entry = entryMap.get(path.toLowerCase());
      if (entry?.type === "file") {
        resolved.push(entry.path);
      }
      continue;
    }

    const [topLevelDir] = path.split("/");
    const dirEntry = entryMap.get(topLevelDir.toLowerCase());
    if (dirEntry?.type === "dir") {
      resolved.push(path);
    }
  }

  return resolved;
}

export async function fetchRepoFiles(
  { owner, repo }: RepoRef,
  options?: { maxFileContentBytes?: number }
): Promise<RepoFile[]> {
  const maxFileContentBytes =
    options?.maxFileContentBytes ?? DEFAULT_MAX_FILE_CONTENT_BYTES;

  if (!owner?.trim() || !repo?.trim()) {
    throw new RepoFileFetchError(
      "INVALID_RESPONSE",
      "Owner and repo are required."
    );
  }

  const metadata = await fetchRepoMetadata(owner, repo);
  if (metadata.private) {
    throw new RepoFileFetchError(
      "PRIVATE_REPO_NOT_SUPPORTED",
      "Private repositories are not supported in this MVP."
    );
  }

  // 1) Fetch repository root contents first.
  const rootContents = await fetchRootContents(owner, repo);

  // 2) Fetch only important files that exist (or likely exist for nested paths).
  const importantPaths = resolveImportantPathsFromRoot(rootContents);
  const fetched = await Promise.all(
    importantPaths.map((path) =>
      fetchFileByPath(owner, repo, path, maxFileContentBytes)
    )
  );

  return fetched.filter((item): item is RepoFile => item !== null);
}
