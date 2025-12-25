import { notFound, redirect } from 'next/navigation';
import { generateServerFingerprint, getReferrer } from '@/lib/fingerprint/server';
import { isValidTargetUrl, sanitizeCampaignId, decodeUrl } from '@/lib/utils/validation';
import TrackingClient from '@/components/TrackingClient';

interface TrackPageProps {
  params: Promise<{
    campaign_id: string;
  }>;
  searchParams: Promise<{
    url?: string;
  }>;
}

export default async function TrackPage({ params, searchParams }: TrackPageProps) {
  // Await the params and searchParams
  const { campaign_id } = await params;
  const { url: targetUrl } = await searchParams;

  // Validate campaign ID
  const sanitizedCampaignId = sanitizeCampaignId(campaign_id);
  if (!sanitizedCampaignId || sanitizedCampaignId.length === 0) {
    notFound();
  }

  // Validate target URL
  if (!targetUrl) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center p-8 bg-white rounded-lg shadow-md">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Missing Target URL</h1>
          <p className="text-gray-600">
            Please provide a target URL using the <code className="bg-gray-100 px-2 py-1 rounded">?url=</code> parameter.
          </p>
          <p className="text-sm text-gray-500 mt-4">
            Example: <code className="bg-gray-100 px-2 py-1 rounded">
              /track/{sanitizedCampaignId}?url=https://example.com
            </code>
          </p>
        </div>
      </div>
    );
  }

  const decodedUrl = decodeUrl(targetUrl);

  // Validate URL is safe
  if (!isValidTargetUrl(decodedUrl)) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center p-8 bg-white rounded-lg shadow-md">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Invalid Target URL</h1>
          <p className="text-gray-600">
            The provided URL is invalid or not allowed for security reasons.
          </p>
          <p className="text-sm text-gray-500 mt-4">
            Only http:// and https:// URLs are permitted.
          </p>
        </div>
      </div>
    );
  }

  // Generate server-side fingerprint
  const serverFingerprint = await generateServerFingerprint();
  const referrer = await getReferrer();

  // Render client component that will handle client-side fingerprinting and redirect
  return (
    <TrackingClient
      campaignId={sanitizedCampaignId}
      targetUrl={decodedUrl}
      serverHash={serverFingerprint.hash}
      serverComponents={serverFingerprint.components}
      referrer={referrer}
    />
  );
}

// Generate metadata
export async function generateMetadata({ params }: TrackPageProps) {
  const { campaign_id } = await params;
  return {
    title: `Redirecting - ${campaign_id}`,
    robots: 'noindex, nofollow',
  };
}
