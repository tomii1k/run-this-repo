import AuthNav from "../../components/AuthNav";
import PublicFooter from "../../components/PublicFooter";

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-white">
      <AuthNav />
      <main className="mx-auto w-full max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="rounded-lg border border-gray-200 bg-white p-8 shadow-sm">
          <h1 className="text-3xl font-bold text-gray-900">Terms of Service</h1>
          <p className="mt-1 text-sm text-gray-600">Last updated: May 2024</p>

          <div className="mt-6 border-t border-gray-200 pt-6 text-gray-900">
            <section className="mt-6">
              <h2 className="text-xl font-semibold text-gray-900">Overview</h2>
              <p className="mt-3 text-gray-700 leading-relaxed">
                These Terms of Service govern your use of RunThisRepo and its services. By accessing or using RunThisRepo, you agree to be bound by these terms.
              </p>
            </section>

            <section className="mt-6">
              <h2 className="text-xl font-semibold text-gray-900">Use License</h2>
              <p className="mt-3 text-gray-700 leading-relaxed">
                Permission is granted to temporarily download one copy of the materials (information or software) on RunThisRepo for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:
              </p>
              <ul className="mt-3 list-inside list-disc text-gray-700 leading-relaxed">
                <li>Modify or copy the materials</li>
                <li>Use the materials for any commercial purpose or for any public display</li>
                <li>Attempt to reverse engineer any software contained on RunThisRepo</li>
                <li>Remove any copyright or other proprietary notations from the materials</li>
                <li>Transfer the materials to another person or "mirror" the materials on any other server</li>
              </ul>
            </section>

            <section className="mt-6">
              <h2 className="text-xl font-semibold text-gray-900">Disclaimer</h2>
              <p className="mt-3 text-gray-700 leading-relaxed">
                The materials on RunThisRepo are provided on an 'as is' basis. RunThisRepo makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.
              </p>
            </section>

            <section className="mt-6">
              <h2 className="text-xl font-semibold text-gray-900">Limitations</h2>
              <p className="mt-3 text-gray-700 leading-relaxed">
                In no event shall RunThisRepo or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on RunThisRepo, even if RunThisRepo or an authorized representative has been notified orally or in writing of the possibility of such damage.
              </p>
            </section>

            <section className="mt-6">
              <h2 className="text-xl font-semibold text-gray-900">Accuracy of Materials</h2>
              <p className="mt-3 text-gray-700 leading-relaxed">
                The materials appearing on RunThisRepo could include technical, typographical, or photographic errors. RunThisRepo does not warrant that any of the materials on RunThisRepo are accurate, complete, or current. RunThisRepo may make changes to the materials contained on RunThisRepo at any time without notice.
              </p>
            </section>

            <div className="mt-8 rounded-md bg-blue-50 p-4">
              <p className="text-sm text-blue-900">
                <strong>MVP Disclaimer:</strong> This page is provided as an MVP placeholder and should be reviewed by legal counsel before production launch.
              </p>
            </div>
          </div>
        </div>
      </main>
      <PublicFooter />
    </div>
  );
}
