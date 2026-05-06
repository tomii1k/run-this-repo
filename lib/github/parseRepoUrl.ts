// lib/github/parseRepoUrl.ts
// parseGitHubRepoUrl: Lightweight parser to accept common GitHub repo inputs.
// Returns { owner, repo } on success or null on invalid input.

// Examples:
// parseGitHubRepoUrl('https://github.com/vercel/next.js') => { owner: 'vercel', repo: 'next.js' }
// parseGitHubRepoUrl('https://github.com/vercel/next.js/') => { owner: 'vercel', repo: 'next.js' }
// parseGitHubRepoUrl('https://github.com/vercel/next.js.git') => { owner: 'vercel', repo: 'next.js' }
// parseGitHubRepoUrl('github.com/vercel/next.js') => { owner: 'vercel', repo: 'next.js' }
// parseGitHubRepoUrl('vercel/next.js') => { owner: 'vercel', repo: 'next.js' }
// parseGitHubRepoUrl('') => null
// parseGitHubRepoUrl('https://gitlab.com/owner/repo') => null

export function parseGitHubRepoUrl(
  input: string
): { owner: string; repo: string } | null {
  if (typeof input !== "string") return null;
  const raw = input.trim();
  if (!raw) return null;

  // Allowed name characters (simple conservative set)
  const nameRe = /^[A-Za-z0-9_.-]+$/;

  // 1) Short form: owner/repo or owner/repo.git with optional trailing slash
  const shortForm = /^([A-Za-z0-9_.-]+)\/([A-Za-z0-9_.-]+)(?:\.git)?\/?$/;
  const shortMatch = raw.match(shortForm);
  if (shortMatch) {
    const owner = shortMatch[1];
    let repo = shortMatch[2];
    if (!nameRe.test(owner) || !nameRe.test(repo)) return null;
    return { owner, repo };
  }

  // 2) URL-ish forms. If it starts with github.com or www.github.com, add https://
  let candidate = raw;
  if (!/^[a-zA-Z][a-zA-Z0-9+.-]*:\/\//.test(candidate)) {
    if (/^(www\.)?github\.com\//i.test(candidate) || /^github\.com\//i.test(candidate)) {
      candidate = `https://${candidate}`;
    }
  }

  try {
    const url = new URL(candidate);
    const host = url.hostname.toLowerCase();
    if (host !== "github.com" && host !== "www.github.com") return null;

    // Expect exactly two path segments: /owner/repo (reject deeper paths like /owner/repo/tree/...)
    const parts = url.pathname.split("/").filter(Boolean);
    if (parts.length !== 2) return null;

    const owner = parts[0];
    let repo = parts[1];
    // strip trailing .git if present
    if (repo.toLowerCase().endsWith(".git")) repo = repo.slice(0, -4);

    if (!owner || !repo) return null;
    if (!nameRe.test(owner) || !nameRe.test(repo)) return null;

    return { owner, repo };
  } catch (err) {
    return null;
  }
}
