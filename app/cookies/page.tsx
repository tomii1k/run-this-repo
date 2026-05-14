import AuthNav from "../../components/AuthNav";
import PublicFooter from "../../components/PublicFooter";

export default function CookiesPage() {
  return (
    <div className="min-h-screen bg-white">
      <AuthNav />
      <main className="mx-auto w-full max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="rounded-lg border border-gray-200 bg-white p-8 shadow-sm">
          <h1 className="text-3xl font-bold text-gray-900">Cookie Policy</h1>
          <p className="mt-1 text-sm text-gray-600">Last updated: May 2026</p>

          <div className="mt-6 border-t border-gray-200 pt-6 text-gray-900">
            <section className="mt-6">
              <h2 className="text-xl font-semibold text-gray-900">What Are Cookies?</h2>
              <p className="mt-3 text-gray-700 leading-relaxed">
                Cookies are small text files stored in your browser. They help us maintain sessions, store preferences, and understand how you use our service.
              </p>
            </section>

            <section className="mt-6">
              <h2 className="text-xl font-semibold text-gray-900">How We Use Cookies</h2>
              <p className="mt-3 text-gray-700 leading-relaxed">
                RunThisRepo uses cookies for essential functionality and service improvement.
              </p>
              <ul className="mt-3 list-inside list-disc text-gray-700 leading-relaxed">
                <li>
                  <strong>Authentication:</strong> Session and authentication cookies to keep you logged in and secure account access.
                </li>
                <li>
                  <strong>Functionality:</strong> Cookies to remember your preferences and provide a consistent experience.
                </li>
                <li>
                  <strong>Service improvement:</strong> Technical cookies to understand service usage and reliability.
                </li>
              </ul>
            </section>

            <section className="mt-6">
              <h2 className="text-xl font-semibold text-gray-900">Essential vs. Non-Essential Cookies</h2>
              <div className="mt-3 space-y-3">
                <div>
                  <h3 className="font-medium text-gray-900">Essential Cookies</h3>
                  <p className="mt-1 text-gray-700">
                    Required for authentication, security, and basic site functionality. These are necessary to use RunThisRepo and cannot be disabled.
                  </p>
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">Functional/Analytics Cookies</h3>
                  <p className="mt-1 text-gray-700">
                    Used to improve service quality and understand usage patterns. You can typically control these via browser settings.
                  </p>
                </div>
              </div>
            </section>

            <section className="mt-6">
              <h2 className="text-xl font-semibold text-gray-900">Your Cookie Choices</h2>
              <p className="mt-3 text-gray-700 leading-relaxed">
                You can control cookies through your browser settings. Disabling non-essential cookies may not affect core functionality, but disabling essential (authentication) cookies will prevent you from using RunThisRepo.
              </p>
            </section>

            <section className="mt-6">
              <h2 className="text-xl font-semibold text-gray-900">Third-Party Services</h2>
              <p className="mt-3 text-gray-700 leading-relaxed">
                We use third-party services (such as our authentication and analytics providers) that may set their own cookies. These services operate under their own privacy policies. We do not sell or share cookies for marketing purposes without your consent.
              </p>
            </section>

            <p className="mt-8 text-xs text-gray-500">
              This policy is intended for MVP-level transparency and may be updated as the service develops.
            </p>
          </div>
        </div>
      </main>
      <PublicFooter />
    </div>
  );
}
