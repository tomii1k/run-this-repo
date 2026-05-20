import Link from "next/link";
import AuthNav from "../../components/AuthNav";
import PublicFooter from "../../components/PublicFooter";

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <AuthNav />
      <main className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="text-center">
          <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">Pricing</p>
          <h1 className="mt-3 text-4xl font-bold text-slate-900 sm:text-5xl">
            Choose your plan
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-600">
            Start free, upgrade when you need more power. All plans include secure authentication and saved analyses.
          </p>
        </div>

        <div className="mt-12 grid gap-8 lg:grid-cols-2">
          <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-slate-900">Starter</h2>
              <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                Free
              </span>
            </div>
            <p className="mt-4 text-4xl font-bold text-slate-900">$0</p>
            <p className="mt-2 text-sm text-slate-600">Perfect for trying RunThisRepo.</p>
            <ul className="mt-6 space-y-3 text-sm text-slate-700">
              <li>1 analysis per day</li>
              <li>Last 3 analyses history</li>
              <li>Basic setup report</li>
              <li>No advanced insights</li>
            </ul>
            <Link
              href="/signup?plan=free"
              className="mt-8 inline-flex w-full items-center justify-center rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-900 hover:bg-slate-50"
            >
              Continue with Free
            </Link>
          </div>

          <div className="relative rounded-2xl border-2 border-blue-600 bg-white p-8 shadow-xl">
            <div className="absolute -top-4 left-6 rounded-full bg-blue-600 px-3 py-1 text-xs font-semibold text-white">
              Most popular
            </div>
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-slate-900">Pro</h2>
              <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">
                50% off
              </span>
            </div>
            <p className="mt-4 text-4xl font-bold text-slate-900">
              <span className="mr-2 text-lg font-medium text-slate-400 line-through">$15</span>
              $8
              <span className="text-base font-medium text-slate-500">/month</span>
            </p>
            <p className="mt-2 text-sm text-slate-600">
              Best for founders and teams who analyze repos daily.
            </p>
            <ul className="mt-6 space-y-3 text-sm text-slate-700">
              <li>Unlimited analyses</li>
              <li>Full history</li>
              <li>Advanced insights</li>
              <li>Priority processing</li>
            </ul>
            <Link
              href="/signup?plan=pro"
              className="mt-8 inline-flex w-full items-center justify-center rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-700"
            >
              Start Pro
            </Link>
          </div>
        </div>

        <p className="mt-6 text-center text-sm text-slate-600">
          Just want to try it?{" "}
          <Link href="/signup?plan=free" className="font-semibold text-blue-600 hover:text-blue-700">
            Continue with free plan
          </Link>
          .
        </p>
      </main>
      <PublicFooter />
    </div>
  );
}
