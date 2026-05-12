import AuthNav from "../../components/AuthNav";
import PublicFooter from "../../components/PublicFooter";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-white">
      <AuthNav />
      <main className="mx-auto w-full max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="rounded-lg border border-gray-200 bg-white p-8 shadow-sm">
          <h1 className="text-3xl font-bold text-gray-900">Privacy Policy</h1>
          <p className="mt-1 text-sm text-gray-600">Last updated: May 2024</p>

          <div className="mt-6 border-t border-gray-200 pt-6 text-gray-900">
            <section className="mt-6">
              <h2 className="text-xl font-semibold text-gray-900">Introduction</h2>
              <p className="mt-3 text-gray-700 leading-relaxed">
                RunThisRepo ("we," "us," or "our") operates the RunThisRepo website. This page informs you of our policies regarding the collection, use, and disclosure of personal data when you use our service and the choices you have associated with that data.
              </p>
            </section>

            <section className="mt-6">
              <h2 className="text-xl font-semibold text-gray-900">Information Collection and Use</h2>
              <p className="mt-3 text-gray-700 leading-relaxed">
                We collect several different types of information for various purposes to provide and improve our service to you.
              </p>
              <h3 className="mt-4 font-medium text-gray-900">Types of Data Collected:</h3>
              <ul className="mt-2 list-inside list-disc text-gray-700 leading-relaxed">
                <li><strong>Personal Data:</strong> Email address, first name, last name, password (hashed)</li>
                <li><strong>Usage Data:</strong> Browser type, IP address, pages visited, time and date of visit</li>
                <li><strong>Repository Data:</strong> GitHub repository URLs analyzed by you</li>
              </ul>
            </section>

            <section className="mt-6">
              <h2 className="text-xl font-semibold text-gray-900">Use of Data</h2>
              <p className="mt-3 text-gray-700 leading-relaxed">
                RunThisRepo uses the collected data for various purposes:
              </p>
              <ul className="mt-2 list-inside list-disc text-gray-700 leading-relaxed">
                <li>To provide and maintain our service</li>
                <li>To notify you about changes to our service</li>
                <li>To send promotional communications (only with your consent)</li>
                <li>To analyze usage patterns to improve our service</li>
              </ul>
            </section>

            <section className="mt-6">
              <h2 className="text-xl font-semibold text-gray-900">Security</h2>
              <p className="mt-3 text-gray-700 leading-relaxed">
                The security of your data is important to us but remember that no method of transmission over the Internet or method of electronic storage is 100% secure. While we strive to use commercially acceptable means to protect your personal data, we cannot guarantee its absolute security.
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
              These policies may be updated as RunThisRepo develops.
            </p>
          </div>
        </div>
      </main>
      <PublicFooter />
    </div>
  );
}
