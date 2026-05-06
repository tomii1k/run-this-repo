export default function ContactPage() {
  return (
    <main className="mx-auto min-h-screen w-full max-w-3xl px-4 py-12 sm:px-6">
      <h1 className="text-3xl font-bold text-gray-900">Contact</h1>
      <p className="mt-4 text-gray-700">
        Contact us for support, feedback, or partnership requests.
      </p>
      <p className="mt-2 text-gray-700">
        Email: <a className="text-blue-700 hover:text-blue-800" href="mailto:support@runthisrepo.com">support@runthisrepo.com</a>
      </p>
      <p className="mt-2 text-gray-600">
        This page is an MVP placeholder and should be reviewed before production launch.
      </p>
    </main>
  );
}
