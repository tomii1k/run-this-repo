import AuthNav from "../../components/AuthNav";
import PublicFooter from "../../components/PublicFooter";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-white">
      <AuthNav />
      <main className="mx-auto w-full max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="rounded-lg border border-gray-200 bg-white p-8 shadow-sm">
          <h1 className="text-3xl font-bold text-gray-900">Privacy Policy</h1>
          <p className="mt-1 text-sm text-gray-600">Last updated: May 2026</p>

          <div className="mt-6 border-t border-gray-200 pt-6 text-gray-900">
            <section className="mt-6">
              <h2 className="text-xl font-semibold text-gray-900">Introduction</h2>
              <p className="mt-3 text-gray-700 leading-relaxed">
                This policy explains what data RunThisRepo ("we," "us," or "our") collects,
                how we use it, and the choices you have when using our service.
              </p>
            </section>

            <section className="mt-6">
              <h2 className="text-xl font-semibold text-gray-900">Information We Collect</h2>
              <ul className="mt-2 list-inside list-disc text-gray-700 leading-relaxed">
                <li>
                  <strong>Account data:</strong> email address and authentication-related data.
                </li>
                <li>
                  <strong>Usage data:</strong> product activity and technical metadata such as pages viewed,
                  timestamps, and basic device/browser information.
                </li>
                <li>
                  <strong>Repository data:</strong> GitHub repository URLs you submit for analysis.
                </li>
              </ul>
            </section>

            <section className="mt-6">
              <h2 className="text-xl font-semibold text-gray-900">How We Use Data</h2>
              <ul className="mt-2 list-inside list-disc text-gray-700 leading-relaxed">
                <li>To provide and maintain our service</li>
                <li>To store and display your analysis history in your account</li>
                <li>To monitor usage and improve reliability and performance</li>
                <li>To send service communications related to your account</li>
                <li>To send marketing emails only if you have consented</li>
              </ul>
            </section>

            <section className="mt-6">
              <h2 className="text-xl font-semibold text-gray-900">Analysis History Storage</h2>
              <p className="mt-3 text-gray-700 leading-relaxed">
                We store analysis outputs and related repository metadata so you can access previous
                reports from your dashboard.
              </p>
            </section>

            <section className="mt-6">
              <h2 className="text-xl font-semibold text-gray-900">Cookies and Authentication</h2>
              <p className="mt-3 text-gray-700 leading-relaxed">
                We use cookies and similar session mechanisms for authentication, keeping you signed in,
                and securing account access. See our Cookie Policy for more details.
              </ul>
            </section>

            <section className="mt-6">
              <h2 className="text-xl font-semibold text-gray-900">Security</h2>
              <p className="mt-3 text-gray-700 leading-relaxed">
                We use reasonable safeguards to protect data. No method of storage or transmission is
                fully secure, and we cannot guarantee absolute security.
              </p>
            </section>

            <section className="mt-6">
              <h2 className="text-xl font-semibold text-gray-900">Contact Us</h2>
              <p className="mt-3 text-gray-700 leading-relaxed">
                If you have any questions about this Privacy Policy, please contact us at{" "}
                <a href="mailto:support@runthisrepo.com" className="text-blue-700 hover:text-blue-800 hover:underline">
                  support@runthisrepo.com
                </a>
              </p>
            </section>

            <p className="mt-8 text-xs text-gray-500">
              This policy is intended as MVP-level transparency and may be updated as the service evolves.
            </p>
          </div>
        </div>
      </main>
      <PublicFooter />
    </div>
  );
}
