import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "../../lib/supabase/server";
import AuthNav from "../../components/AuthNav";
import PublicFooter from "../../components/PublicFooter";

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Fetch latest 5 analyses
  const { data: analyses } = await supabase
    .from("repo_analyses")
    .select("id, repo_name, repo_url, created_at")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(5);

  async function logout() {
    "use server";
    const serverSupabase = await createClient();
    await serverSupabase.auth.signOut();
    redirect("/login?message=logged_out");
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <AuthNav />

      <main className="mx-auto w-full max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Dashboard</h1>
            <p className="mt-1 text-sm text-slate-600">Signed in as {user.email}</p>
          </div>
          <div className="flex items-center gap-2">
            <Link
              href="/"
              className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
            >
              Home
            </Link>
            <form action={logout}>
              <button
                type="submit"
                className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900 focus-visible:ring-offset-2"
              >
                Logout
              </button>
            </form>
          </div>
        </div>

        {/* Analyzer Card */}
        <section className="mb-8 rounded-2xl border border-slate-200 bg-gradient-to-br from-blue-50 to-indigo-50 p-8 shadow-sm">
          <h2 className="text-2xl font-bold text-slate-900">Analyze a Repository</h2>
          <p className="mt-2 text-slate-600">
            Paste a GitHub repository URL to get setup steps, environment variables, and safety insights.
          </p>

          <div className="mt-6 space-y-3">
            <div className="flex flex-col gap-2 sm:flex-row">
              <input
                type="text"
                placeholder="https://github.com/username/repository"
                className="flex-1 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm text-slate-900 placeholder-slate-500 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600/20"
              />
              <Link
                href="/"
                className="rounded-lg bg-blue-600 px-6 py-2 text-sm font-semibold text-white hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2"
              >
                Analyze
              </Link>
            </div>
            <p className="text-xs text-slate-500">
              💡 Note: Use the homepage analyzer for the full experience with validation and error handling.
            </p>
          </div>
        </section>

        {/* Recent Analyses */}
        <section>
          <h2 className="text-xl font-bold text-slate-900">Recent Analyses</h2>
          
          {!analyses || analyses.length === 0 ? (
            <div className="mt-4 rounded-xl border border-slate-200 bg-white p-6">
              <p className="text-slate-700">
                No analyses yet. <Link href="/" className="font-semibold text-blue-600 hover:text-blue-700">Analyze a repository →</Link>
              </p>
            </div>
          ) : (
            <div className="mt-4 space-y-2">
              {analyses.map((analysis) => (
                <div
                  key={analysis.id}
                  className="flex items-center justify-between rounded-lg border border-slate-200 bg-white p-4 hover:bg-slate-50"
                >
                  <div className="flex-1">
                    <p className="font-medium text-slate-900">{analysis.repo_name}</p>
                    <p className="text-xs text-slate-600">{analysis.repo_url}</p>
                    <p className="mt-1 text-xs text-slate-500">
                      {new Date(analysis.created_at).toLocaleDateString()} at{" "}
                      {new Date(analysis.created_at).toLocaleTimeString()}
                    </p>
                  </div>
                  <Link
                    href={`/dashboard/analyses/${analysis.id}`}
                    className="ml-4 inline-block rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
                  >
                    View
                  </Link>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>

      <PublicFooter />
    </div>
  );
}
