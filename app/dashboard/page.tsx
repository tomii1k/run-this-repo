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

        <section className="mt-8 rounded-lg border border-gray-200 bg-gray-50 p-4">
          <p className="text-sm text-gray-700">
            Your saved analysis history will appear here once you analyze repositories while logged in.
          </p>
        </section>
      </div>
    </main>
  );
}
