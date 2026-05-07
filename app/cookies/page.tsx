import AuthNav from "../../components/AuthNav";
import PublicFooter from "../../components/PublicFooter";

export default function CookiesPage() {
  return (
    <div className="min-h-screen bg-white">
      <AuthNav />
      <main className="mx-auto w-full max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="rounded-lg border border-gray-200 bg-white p-8 shadow-sm">
          <h1 className="text-3xl font-bold text-gray-900">Cookie Policy</h1>
          <p className="mt-1 text-sm text-gray-600">Last updated: May 2024</p>

          <div className="mt-6 border-t border-gray-200 pt-6 text-gray-900">
            <section className="mt-6">
              <h2 className="text-xl font-semibold text-gray-900">What Are Cookies?</h2>
              <p className="mt-3 text-gray-700 leading-relaxed">
                Cookies are small files of letters and numbers that are stored on your browser or the hard drive of your computer. They contain information about browsing habits.
              </p>
            </section>

            <section className="mt-6">
              <h2 className="text-xl font-semibold text-gray-900">How We Use Cookies</h2>
              <p className="mt-3 text-gray-700 leading-relaxed">
                RunThisRepo uses cookies for the following purposes:
              </p>
              <ul className="mt-2 list-inside list-disc text-gray-700 leading-relaxed">
                <li><strong>Authentication:</strong> To keep you logged in to your account</li>
                <li><strong>Preferences:</strong> To remember your settings and preferences</li>
                <li><strong>Analytics:</strong> To understand how you use our service</li>
                <li><strong>Security:</strong> To prevent fraud and enhance security</li>
              </ul>
            </section>

            <section className="mt-6">
              <h2 className="text-xl font-semibold text-gray-900">Types of Cookies We Use</h2>
              <div className="mt-3 space-y-3">
                <div>
                  <h3 className="font-medium text-gray-900">Essential Cookies</h3>
                  <p className="mt-1 text-gray-700">
                    Necessary for the basic functioning of our website and services.
                  </p>
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">Functional Cookies</h3>
                  <p className="mt-1 text-gray-700">
                    Used to remember your choices and provide a better experience.
                  </p>
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">Analytics Cookies</h3>
                  <p className="mt-1 text-gray-700">
                    Help us understand how visitors use our website.
                  </p>
                </div>
              </div>
            </section>

            <section className="mt-6">
              <h2 className="text-xl font-semibold text-gray-900">Your Cookie Choices</h2>
              <p className="mt-3 text-gray-700 leading-relaxed">
                Most web browsers allow you to control cookies through browser settings. You may refuse cookies or receive an alert before a cookie is placed. If you choose to refuse cookies, you may not be able to fully use all features of the RunThisRepo website and services.
              </p>
            </section>

            <section className="mt-6">
              <h2 className="text-xl font-semibold text-gray-900">Third-Party Cookies</h2>
              <p className="mt-3 text-gray-700 leading-relaxed">
                RunThisRepo may use third-party services that may place cookies on your device for analytics and advertising purposes. These third parties operate under their own privacy policies.
              </p>
            </section>

            <div className="mt-8 rounded-md bg-blue-50 p-4">
              <p className="text-sm text-blue-900">
                <strong>MVP Disclaimer:</strong> This page is provided as an MVP placeholder and should be reviewed before production launch.
              </p>
            </div>
          </div>
        </div>
      </main>
      <PublicFooter />
    </div>
  );
}
