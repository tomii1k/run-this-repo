import AuthNav from "../../components/AuthNav";
import PublicFooter from "../../components/PublicFooter";

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-white">
      <AuthNav />
      <main className="mx-auto w-full max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="rounded-lg border border-gray-200 bg-white p-8 shadow-sm">
          <h1 className="text-3xl font-bold text-gray-900">Contact Us</h1>
          <p className="mt-1 text-sm text-gray-600">Last updated: May 2024</p>

          <div className="mt-6 border-t border-gray-200 pt-6 text-gray-900">
            <section className="mt-6">
              <h2 className="text-xl font-semibold text-gray-900">Get in Touch</h2>
              <p className="mt-3 text-gray-700 leading-relaxed">
                We'd love to hear from you! Whether you have a question about RunThisRepo, need support, want to report a bug, or just want to say hello, feel free to reach out.
              </p>
            </section>

            <section className="mt-6">
              <h2 className="text-xl font-semibold text-gray-900">Contact Information</h2>
              <div className="mt-3 space-y-3">
                <div>
                  <h3 className="font-medium text-gray-900">Email</h3>
                  <p className="mt-1 text-gray-700">
                    <a href="mailto:support@runthisrepo.com" className="text-blue-700 hover:text-blue-800 hover:underline">
                      support@runthisrepo.com
                    </a>
                  </p>
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">Response Time</h3>
                  <p className="mt-1 text-gray-700">
                    We typically respond to inquiries within 24-48 hours.
                  </p>
                </div>
              </div>
            </section>

            <section className="mt-6">
              <h2 className="text-xl font-semibold text-gray-900">What to Include</h2>
              <p className="mt-3 text-gray-700 leading-relaxed">
                To help us assist you better, please include relevant information such as:
              </p>
              <ul className="mt-2 list-inside list-disc text-gray-700 leading-relaxed">
                <li>Your name and email address</li>
                <li>A clear subject line describing your inquiry</li>
                <li>Details about your issue or question</li>
                <li>Any relevant error messages or screenshots</li>
              </ul>
            </section>

            <section className="mt-6">
              <h2 className="text-xl font-semibold text-gray-900">Support Categories</h2>
              <div className="mt-3 space-y-2">
                <p className="text-gray-700"><strong>Bug Reports:</strong> Help us improve by reporting issues you encounter</p>
                <p className="text-gray-700"><strong>Feature Requests:</strong> Let us know what features would help you</p>
                <p className="text-gray-700"><strong>General Support:</strong> Questions about how to use RunThisRepo</p>
                <p className="text-gray-700"><strong>Partnerships:</strong> Interested in collaborating? We'd love to hear from you</p>
              </div>
            </section>

            <section className="mt-6">
              <h2 className="text-xl font-semibold text-gray-900">Connect With Us</h2>
              <p className="mt-3 text-gray-700 leading-relaxed">
                Follow RunThisRepo on GitHub to stay updated on new features and improvements.
              </p>
            </section>

            <p className="mt-8 text-xs text-gray-500">
              This page may be updated as RunThisRepo develops.
            </p>
          </div>
        </div>
      </main>
      <PublicFooter />
    </div>
  );
}
