import AuthNav from "../../components/AuthNav";
import PublicFooter from "../../components/PublicFooter";

export default function AccessibilityPage() {
  return (
    <div className="min-h-screen bg-white">
      <AuthNav />
      <main className="mx-auto w-full max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="rounded-lg border border-gray-200 bg-white p-8 shadow-sm">
          <h1 className="text-3xl font-bold text-gray-900">Accessibility Statement</h1>
          <p className="mt-1 text-sm text-gray-600">Last updated: May 2024</p>

          <div className="mt-6 border-t border-gray-200 pt-6 text-gray-900">
            <section className="mt-6">
              <h2 className="text-xl font-semibold text-gray-900">Our Commitment</h2>
              <p className="mt-3 text-gray-700 leading-relaxed">
                RunThisRepo is committed to ensuring digital accessibility for people with disabilities. We are continually improving the user experience for everyone and applying the relevant accessibility standards.
              </p>
            </section>

            <section className="mt-6">
              <h2 className="text-xl font-semibold text-gray-900">WCAG Compliance</h2>
              <p className="mt-3 text-gray-700 leading-relaxed">
                We aim to conform to the Web Content Accessibility Guidelines (WCAG) 2.1 Level AA standards. These guidelines explain how to make web content more accessible to people with disabilities and others.
              </p>
            </section>

            <section className="mt-6">
              <h2 className="text-xl font-semibold text-gray-900">Accessibility Features</h2>
              <p className="mt-3 text-gray-700 leading-relaxed">
                RunThisRepo includes the following accessibility features:
              </p>
              <ul className="mt-2 list-inside list-disc text-gray-700 leading-relaxed">
                <li>Semantic HTML structure for screen reader compatibility</li>
                <li>High contrast text and backgrounds for readability</li>
                <li>Keyboard navigation support throughout the application</li>
                <li>Proper heading hierarchy for document structure</li>
                <li>Alternative text for images and icons</li>
                <li>Form labels and error messages clearly associated with inputs</li>
                <li>Responsive design for use on various devices</li>
              </ul>
            </section>

            <section className="mt-6">
              <h2 className="text-xl font-semibold text-gray-900">Feedback</h2>
              <p className="mt-3 text-gray-700 leading-relaxed">
                We welcome feedback on the accessibility of RunThisRepo. Please let us know if you encounter accessibility barriers by contacting us at{" "}
                <a href="mailto:support@runthisrepo.com" className="text-blue-700 hover:text-blue-800 hover:underline">
                  support@runthisrepo.com
                </a>
              </p>
            </section>

            <section className="mt-6">
              <h2 className="text-xl font-semibold text-gray-900">Known Limitations</h2>
              <p className="mt-3 text-gray-700 leading-relaxed">
                While we strive to make RunThisRepo fully accessible, we are aware of the following limitations:
              </p>
              <ul className="mt-2 list-inside list-disc text-gray-700 leading-relaxed">
                <li>Some third-party content may not be fully accessible</li>
                <li>Real-time analysis results may require additional accessibility refinement</li>
              </ul>
              <p className="mt-3 text-gray-700 leading-relaxed">
                We are actively working to address these limitations.
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
