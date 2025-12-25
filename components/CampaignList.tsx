import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';
import type { CampaignStats } from '@/lib/types';

interface CampaignListProps {
  campaigns: CampaignStats[];
}

export default function CampaignList({ campaigns }: CampaignListProps) {
  if (campaigns.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-8 text-center">
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          No campaigns yet
        </h3>
        <p className="text-gray-600 mb-4">
          Create your first tracking link to get started!
        </p>
        <div className="bg-gray-50 rounded p-4 text-left max-w-2xl mx-auto">
          <p className="text-sm font-medium text-gray-700 mb-2">
            Example tracking link:
          </p>
          <code className="text-sm bg-gray-800 text-green-400 p-2 rounded block overflow-x-auto">
            {process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/track/my-campaign?url=https://example.com
          </code>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {campaigns.map((campaign) => (
        <Link
          key={campaign.id}
          href={`/dashboard/${campaign.campaign_id}`}
          className="block bg-white rounded-lg shadow hover:shadow-lg transition-shadow duration-200 overflow-hidden border border-gray-200 hover:border-indigo-500"
        >
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 truncate">
                {campaign.campaign_id}
              </h3>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                Active
              </span>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Unique Devices</span>
                <span className="text-2xl font-bold text-indigo-600">
                  {campaign.unique_devices}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Total Clicks</span>
                <span className="text-lg font-semibold text-gray-900">
                  {campaign.total_clicks}
                </span>
              </div>

              {campaign.last_click && (
                <div className="pt-3 border-t border-gray-200">
                  <p className="text-xs text-gray-500">
                    Last click{' '}
                    {formatDistanceToNow(campaign.last_click, { addSuffix: true })}
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="bg-gray-50 px-6 py-3 border-t border-gray-200">
            <span className="text-sm text-indigo-600 font-medium hover:text-indigo-700">
              View details →
            </span>
          </div>
        </Link>
      ))}
    </div>
  );
}
