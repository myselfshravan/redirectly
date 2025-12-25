export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-white to-blue-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-indigo-600">Click Tracker</h1>
            <a
              href="/dashboard"
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium transition"
            >
              Dashboard
            </a>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          <h2 className="text-5xl font-bold text-gray-900 mb-6">
            Self-Hosted Link Tracking
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Track link clicks with custom URL parameters. Powered by Next.js,
            Firebase Firestore, and hybrid device fingerprinting for 85-90% accuracy.
          </p>
          <div className="flex gap-4 justify-center">
            <a
              href="/dashboard"
              className="px-8 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-semibold text-lg transition"
            >
              View Dashboard
            </a>
            <a
              href="#how-it-works"
              className="px-8 py-3 bg-white text-indigo-600 border-2 border-indigo-600 rounded-lg hover:bg-indigo-50 font-semibold text-lg transition"
            >
              Learn More
            </a>
          </div>
        </div>

        {/* Features */}
        <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-8" id="how-it-works">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="h-12 w-12 bg-indigo-600 rounded-lg flex items-center justify-center mb-4">
              <svg className="h-6 w-6 text-white" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                <path d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              Fast Tracking
            </h3>
            <p className="text-gray-600">
              Redirect users in under 500ms while capturing comprehensive analytics
              with hybrid server and client-side fingerprinting.
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="h-12 w-12 bg-indigo-600 rounded-lg flex items-center justify-center mb-4">
              <svg className="h-6 w-6 text-white" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                <path d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              Detailed Analytics
            </h3>
            <p className="text-gray-600">
              Track unique devices, total clicks, device types, browsers, operating
              systems, and referrers for each campaign.
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="h-12 w-12 bg-indigo-600 rounded-lg flex items-center justify-center mb-4">
              <svg className="h-6 w-6 text-white" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                <path d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              Privacy-Focused
            </h3>
            <p className="text-gray-600">
              Self-hosted on Vercel with Firebase. Your data stays under your control.
              No third-party tracking services.
            </p>
          </div>
        </div>

        {/* How to Use */}
        <div className="mt-24 bg-white rounded-lg shadow-lg p-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">
            How to Create Tracking Links
          </h3>
          <div className="space-y-4">
            <div>
              <p className="text-gray-700 font-medium mb-2">URL Format:</p>
              <code className="block bg-gray-100 p-4 rounded-lg text-sm overflow-x-auto">
                {process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/track/<span className="text-blue-600">[campaign-id]</span>?url=<span className="text-green-600">[target-url]</span>
              </code>
            </div>
            <div>
              <p className="text-gray-700 font-medium mb-2">Example:</p>
              <code className="block bg-gray-100 p-4 rounded-lg text-sm overflow-x-auto">
                {process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/track/instagram-bio?url=https://klydo.in/
              </code>
            </div>
            <div className="pt-4">
              <p className="text-gray-600">
                Replace <code className="bg-gray-100 px-2 py-1 rounded">campaign-id</code> with your
                campaign identifier and <code className="bg-gray-100 px-2 py-1 rounded">target-url</code> with
                the destination URL.
              </p>
            </div>
          </div>
        </div>

        {/* Tech Stack */}
        <div className="mt-24 text-center">
          <h3 className="text-2xl font-bold text-gray-900 mb-8">
            Built with Modern Technologies
          </h3>
          <div className="flex flex-wrap justify-center gap-6">
            <div className="bg-white px-6 py-3 rounded-lg shadow">
              <span className="font-semibold text-gray-700">Next.js 15</span>
            </div>
            <div className="bg-white px-6 py-3 rounded-lg shadow">
              <span className="font-semibold text-gray-700">Firebase Firestore</span>
            </div>
            <div className="bg-white px-6 py-3 rounded-lg shadow">
              <span className="font-semibold text-gray-700">TypeScript</span>
            </div>
            <div className="bg-white px-6 py-3 rounded-lg shadow">
              <span className="font-semibold text-gray-700">Tailwind CSS</span>
            </div>
            <div className="bg-white px-6 py-3 rounded-lg shadow">
              <span className="font-semibold text-gray-700">Vercel</span>
            </div>
            <div className="bg-white px-6 py-3 rounded-lg shadow">
              <span className="font-semibold text-gray-700">Thumbmark.js</span>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white mt-24 border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center text-gray-600">
          <p>Built with Next.js and Firebase</p>
        </div>
      </footer>
    </div>
  );
}
