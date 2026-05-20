import AuthNav from "../../components/AuthNav";
import PublicFooter from "../../components/PublicFooter";

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-white">
      <AuthNav />
      <main className="mx-auto w-full max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="rounded-lg border border-gray-200 bg-white p-8 shadow-sm">
          <h1 className="text-3xl font-bold text-gray-900">Terms of Service</h1>
          <p className="mt-1 text-sm text-gray-600">Last updated: May 2026</p>

          <div className="mt-6 border-t border-gray-200 pt-6 text-gray-900">
            <section className="mt-6">
              <h2 className="text-xl font-semibold text-gray-900">Overview</h2>
              <p className="mt-3 leading-relaxed text-gray-700">
                These Terms govern your use of RunThisRepo. By accessing or using the service, you
                agree to these terms.
              </p>
            </section>

            <section className="mt-6">
              <h2 className="text-xl font-semibold text-gray-900">Use of Service</h2>
              <p className="mt-3 leading-relaxed text-gray-700">
                You agree to use RunThisRepo lawfully and not to misuse the platform.
              </p>
              <ul className="mt-3 list-inside list-disc leading-relaxed text-gray-700">
                <li>Do not attempt unauthorized access to accounts, systems, or data.</li>
                <li>Do not interfere with service reliability, limits, or security controls.</li>
                <li>Do not submit unlawful or abusive content.</li>
              </ul>
            </section>

            <section className="mt-6">
              <h2 className="text-xl font-semibold text-gray-900">Accounts and Data</h2>
              <p className="mt-3 leading-relaxed text-gray-700">
                If you create an account, you are responsible for your account activity. We may store
                account data, usage data, and analysis history to operate the service.
              </p>
            </section>

            <section className="mt-6">
              <h2 className="text-xl font-semibold text-gray-900">Service Provided As-Is</h2>
              <p className="mt-3 leading-relaxed text-gray-700">
                RunThisRepo is provided on an "as-is" and "as-available" basis without guarantees of
                uninterrupted availability, accuracy, or fitness for a particular purpose.
              </p>
            </section>

            <section className="mt-6">
              <h2 className="text-xl font-semibold text-gray-900">Limitation of Liability</h2>
              <p className="mt-3 leading-relaxed text-gray-700">
                To the maximum extent permitted by law, RunThisRepo and its operators are not liable for
                indirect, incidental, special, consequential, or punitive damages, or for loss of data,
                revenue, or profits arising from use of or inability to use the service.
              </p>
            </section>

            <section className="mt-6">
              <h2 className="text-xl font-semibold text-gray-900">Changes to Terms</h2>
              <p className="mt-3 leading-relaxed text-gray-700">
                We may update these Terms over time. Continued use of RunThisRepo after updates means you
                accept the revised Terms.
              </p>
            </section>

            <p className="mt-8 text-xs text-gray-500">
              These terms are intended for MVP-stage operation and may be refined as the service evolves.
            </p>
          </div>
        </div>
      </main>
      <PublicFooter />
    </div>
  );
}
