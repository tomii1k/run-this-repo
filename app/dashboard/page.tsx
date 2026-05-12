import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "../../lib/supabase/server";

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
    <main className="min-h-screen bg-gray-50 px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-4xl rounded-xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
            <p className="mt-1 text-sm text-gray-600">Signed in as {user.email}</p>
          </div>
          <div className="flex items-center gap-2">
            <Link
              href="/"
              className="rounded-md border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
            >
              Home
            </Link>
            <form action={logout}>
              <button
                type="submit"
                className="rounded-md bg-gray-900 px-4 py-2 text-sm font-semibold text-white hover:bg-gray-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-900 focus-visible:ring-offset-2"
              >
                Logout
              </button>
            </form>
          </div>
        </div>

        <section className="mt-8">
          <h2 className="text-lg font-semibold text-gray-900">Analysis History</h2>
          
          {!analyses || analyses.length === 0 ? (
            <div className="mt-4 rounded-lg border border-gray-200 bg-gray-50 p-4">
              <p className="text-sm text-gray-700">
                Your saved analysis history will appear here once you analyze repositories.
              </p>
              <Link
                href="/"
                className="mt-3 inline-block text-sm font-medium text-blue-700 hover:text-blue-800"
              >
                Analyze a repository →
              </Link>
            </div>
          ) : (
            <div className="mt-4 space-y-2">
              {analyses.map((analysis) => (
                <div
                  key={analysis.id}
                  className="flex items-center justify-between rounded-lg border border-gray-200 bg-gray-50 p-4 hover:bg-gray-100"
                >
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{analysis.repo_name}</p>
                    <p className="text-xs text-gray-600">{analysis.repo_url}</p>
                    <p className="mt-1 text-xs text-gray-500">
                      {new Date(analysis.created_at).toLocaleDateString()} at{" "}
                      {new Date(analysis.created_at).toLocaleTimeString()}
                    </p>
                  </div>
                  <Link
                    href={`/dashboard/analyses/${analysis.id}`}
                    className="ml-4 inline-block rounded-md bg-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-blue-700"
                  >
                    View
                  </Link>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
