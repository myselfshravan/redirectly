'use client';

import { useEffect, useState } from 'react';
import { generateClientFingerprint, combineClientFingerprints } from '@/lib/fingerprint/client';
import { parseUserAgent } from '@/lib/utils/device-parser';
import type { FingerprintComponents, DeviceInfo } from '@/lib/types';

interface TrackingClientProps {
  campaignId: string;
  targetUrl: string;
  serverHash: string;
  serverComponents: FingerprintComponents;
  referrer: string | null;
}

export default function TrackingClient({
  campaignId,
  targetUrl,
  serverHash,
  serverComponents,
  referrer,
}: TrackingClientProps) {
  const [status, setStatus] = useState<'loading' | 'redirecting' | 'error'>('loading');
  const [error, setError] = useState<string>('');

  useEffect(() => {
    async function trackAndRedirect() {
      try {
        // Generate client-side fingerprint
        const clientHash = await generateClientFingerprint();

        // Combine server and client fingerprints
        const finalFingerprint = await combineClientFingerprints(serverHash, clientHash);

        // Parse device information
        const device: DeviceInfo = parseUserAgent(serverComponents.userAgent);

        // Send tracking data to API
        const response = await fetch('/api/track', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            fingerprint: finalFingerprint,
            campaign_id: campaignId,
            target_url: targetUrl,
            server_hash: serverHash,
            client_hash: clientHash,
            device,
            referrer,
            ip: serverComponents.ip,
            language: serverComponents.language,
          }),
        });

        if (!response.ok) {
          throw new Error('Failed to store tracking data');
        }

        // Update status
        setStatus('redirecting');

        // Redirect to target URL
        window.location.href = targetUrl;
      } catch (err) {
        console.error('Tracking error:', err);
        setError(err instanceof Error ? err.message : 'Unknown error');
        setStatus('error');

        // Still redirect after a short delay, even if tracking fails
        setTimeout(() => {
          window.location.href = targetUrl;
        }, 2000);
      }
    }

    trackAndRedirect();
  }, [campaignId, targetUrl, serverHash, serverComponents, referrer]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="text-center p-8 bg-white rounded-lg shadow-lg max-w-md">
        {status === 'loading' && (
          <>
            <div className="mb-4">
              <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-indigo-600 border-r-transparent"></div>
            </div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-2">
              Preparing your link...
            </h2>
            <p className="text-gray-600">This will only take a moment</p>
          </>
        )}

        {status === 'redirecting' && (
          <>
            <div className="mb-4 text-green-600">
              <svg
                className="inline-block h-12 w-12"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path d="M5 13l4 4L19 7"></path>
              </svg>
            </div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-2">
              Redirecting...
            </h2>
            <p className="text-gray-600">Taking you to your destination</p>
          </>
        )}

        {status === 'error' && (
          <>
            <div className="mb-4 text-yellow-600">
              <svg
                className="inline-block h-12 w-12"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
              </svg>
            </div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-2">
              Redirecting anyway...
            </h2>
            <p className="text-gray-600 text-sm">
              Tracking temporarily unavailable: {error}
            </p>
          </>
        )}

        <div className="mt-6 text-xs text-gray-400">
          Campaign: {campaignId}
        </div>
      </div>
    </div>
  );
}
