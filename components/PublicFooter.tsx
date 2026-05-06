import Link from "next/link";

export default function PublicFooter() {
  return (
    <footer className="border-t border-gray-100 bg-gray-50">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 text-lg font-semibold text-gray-900">
              <svg aria-hidden="true" width="20" height="20" viewBox="0 0 512 512" fill="none" className="rounded">
                <rect width="512" height="512" rx="104" fill="url(#footer-logo-gradient)" />
                <path d="M145 189L205 249L145 309" stroke="white" strokeWidth="34" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M232 323H335" stroke="white" strokeWidth="34" strokeLinecap="round" />
                <circle cx="326" cy="165" r="25" fill="white" />
                <circle cx="326" cy="347" r="25" fill="white" />
                <circle cx="384" cy="256" r="25" fill="white" />
                <path d="M326 190V218C326 239 343 256 364 256H384" stroke="white" strokeWidth="24" strokeLinecap="round" />
                <path d="M326 322V294C326 273 343 256 364 256H384" stroke="white" strokeWidth="24" strokeLinecap="round" />
                <defs>
                  <linearGradient id="footer-logo-gradient" x1="48" y1="48" x2="464" y2="464" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#2563EB" />
                    <stop offset="1" stopColor="#06B6D4" />
                  </linearGradient>
                </defs>
              </svg>
              RunThisRepo
            </div>
            <p className="mt-2 text-sm text-gray-600">From GitHub URL to working localhost.</p>
          </div>

          <nav aria-label="Footer links" className="grid grid-cols-2 gap-x-8 gap-y-2 text-sm sm:grid-cols-3">
            <Link href="/terms" className="text-gray-600 hover:text-gray-900">
              Terms of Service
            </Link>
            <Link href="/privacy" className="text-gray-600 hover:text-gray-900">
              Privacy Policy
            </Link>
            <Link href="/cookies" className="text-gray-600 hover:text-gray-900">
              Cookie Policy
            </Link>
            <Link href="/accessibility" className="text-gray-600 hover:text-gray-900">
              Accessibility
            </Link>
            <Link href="/contact" className="text-gray-600 hover:text-gray-900">
              Contact
            </Link>
            <a
              href="https://github.com/tomii1k/run-this-repo"
              target="_blank"
              rel="noreferrer"
              className="text-gray-600 hover:text-gray-900"
            >
              GitHub
            </a>
          </nav>
        </div>

        <p className="mt-8 text-sm text-gray-500">© 2026 RunThisRepo. All rights reserved.</p>
      </div>
    </footer>
  );
}
