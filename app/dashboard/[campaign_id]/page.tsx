import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  getCampaignAnalytics,
  getDeviceBreakdown,
  getBrowserStats,
  getOSStats,
} from '@/lib/analytics/queries';
import AnalyticsCard from '@/components/AnalyticsCard';
import DeviceTable from '@/components/DeviceTable';

interface CampaignPageProps {
  params: Promise<{
    campaign_id: string;
  }>;
}

export const dynamic = 'force-dynamic';

export default async function CampaignPage({ params }: CampaignPageProps) {
  const { campaign_id } = await params;

  try {
    const [analytics, deviceBreakdown, browserStats, osStats] = await Promise.all([
      getCampaignAnalytics(campaign_id),
      getDeviceBreakdown(campaign_id),
      getBrowserStats(campaign_id),
      getOSStats(campaign_id),
    ]);

    const avgClicksPerDevice =
      analytics.unique_devices > 0
        ? (analytics.total_clicks / analytics.unique_devices).toFixed(1)
        : '0';

    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <Link
              href="/dashboard"
              className="text-indigo-600 hover:text-indigo-700 font-medium mb-4 inline-block"
            >
              ← Back to Dashboard
            </Link>
            <h1 className="text-3xl font-bold text-gray-900">{campaign_id}</h1>
            <p className="text-gray-600 mt-2">Campaign analytics and insights</p>
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <AnalyticsCard
              title="Unique Devices"
              value={analytics.unique_devices}
              subtitle="Individual visitors"
              icon={
                <svg className="h-8 w-8" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                  <path d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              }
            />
            <AnalyticsCard
              title="Total Clicks"
              value={analytics.total_clicks}
              subtitle="All time"
              icon={
                <svg className="h-8 w-8" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                  <path d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
                </svg>
              }
            />
            <AnalyticsCard
              title="Avg. Clicks/Device"
              value={avgClicksPerDevice}
              subtitle="Engagement rate"
              icon={
                <svg className="h-8 w-8" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                  <path d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              }
            />
          </div>

          {/* Device Breakdown */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Device Types
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Mobile</span>
                  <span className="font-semibold text-gray-900">
                    {deviceBreakdown.mobile}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Desktop</span>
                  <span className="font-semibold text-gray-900">
                    {deviceBreakdown.desktop}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Tablet</span>
                  <span className="font-semibold text-gray-900">
                    {deviceBreakdown.tablet}
                  </span>
                </div>
                {deviceBreakdown.unknown > 0 && (
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Unknown</span>
                    <span className="font-semibold text-gray-900">
                      {deviceBreakdown.unknown}
                    </span>
                  </div>
                )}
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Top Browsers
              </h3>
              <div className="space-y-3">
                {Object.entries(browserStats)
                  .sort(([, a], [, b]) => b - a)
                  .slice(0, 5)
                  .map(([browser, count]) => (
                    <div key={browser} className="flex justify-between items-center">
                      <span className="text-gray-600">{browser}</span>
                      <span className="font-semibold text-gray-900">{count}</span>
                    </div>
                  ))}
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Operating Systems
              </h3>
              <div className="space-y-3">
                {Object.entries(osStats)
                  .sort(([, a], [, b]) => b - a)
                  .slice(0, 5)
                  .map(([os, count]) => (
                    <div key={os} className="flex justify-between items-center">
                      <span className="text-gray-600">{os}</span>
                      <span className="font-semibold text-gray-900">{count}</span>
                    </div>
                  ))}
              </div>
            </div>
          </div>

          {/* Device Table */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Device Details
            </h2>
            <DeviceTable devices={analytics.devices} />
          </div>

          {/* Tracking Link */}
          <div className="mt-8 bg-green-50 border border-green-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-green-900 mb-2">
              Tracking Link
            </h3>
            <p className="text-green-800 mb-3">
              Use this link to track clicks for this campaign:
            </p>
            <div className="bg-white rounded p-4">
              <code className="text-sm text-gray-800 block overflow-x-auto">
                {process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/track/{campaign_id}?url=YOUR_TARGET_URL
              </code>
            </div>
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error('Error fetching campaign analytics:', error);
    notFound();
  }
}

export async function generateMetadata({ params }: CampaignPageProps) {
  const { campaign_id } = await params;
  return {
    title: `${campaign_id} - Click Tracker`,
    description: `Analytics for campaign: ${campaign_id}`,
  };
}
