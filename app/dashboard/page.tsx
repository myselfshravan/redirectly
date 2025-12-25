import { getAllCampaigns, getTotalStats } from '@/lib/analytics/queries';
import AnalyticsCard from '@/components/AnalyticsCard';
import CampaignList from '@/components/CampaignList';

export const metadata = {
  title: 'Dashboard - Click Tracker',
  description: 'View analytics for all your tracking campaigns',
};

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  const [campaigns, totalStats] = await Promise.all([
    getAllCampaigns(),
    getTotalStats(),
  ]);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-2">
            Track and analyze your link campaigns
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <AnalyticsCard
            title="Total Campaigns"
            value={totalStats.total_campaigns}
            icon={
              <svg className="h-8 w-8" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            }
          />
          <AnalyticsCard
            title="Unique Devices"
            value={totalStats.total_unique_devices}
            subtitle="Across all campaigns"
            icon={
              <svg className="h-8 w-8" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                <path d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            }
          />
          <AnalyticsCard
            title="Total Clicks"
            value={totalStats.total_clicks.toLocaleString()}
            subtitle="All time"
            icon={
              <svg className="h-8 w-8" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                <path d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
              </svg>
            }
          />
        </div>

        {/* Campaigns List */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Your Campaigns</h2>
          <CampaignList campaigns={campaigns} />
        </div>

        {/* Help Section */}
        <div className="mt-12 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-2">
            How to create a tracking link
          </h3>
          <p className="text-blue-800 mb-4">
            Use the following URL format to create tracking links:
          </p>
          <div className="bg-white rounded p-4 mb-4">
            <code className="text-sm text-gray-800 block overflow-x-auto">
              {process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/track/<span className="text-blue-600">[campaign-id]</span>?url=<span className="text-green-600">[target-url]</span>
            </code>
          </div>
          <div className="space-y-2 text-sm text-blue-800">
            <p>
              <strong>Example:</strong>
            </p>
            <code className="block bg-white rounded p-3 text-gray-800 overflow-x-auto">
              {process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/track/instagram-bio?url=https://klydo.in/
            </code>
          </div>
        </div>
      </div>
    </div>
  );
}
