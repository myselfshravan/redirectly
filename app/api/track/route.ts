import { NextRequest, NextResponse } from 'next/server';
import { storeTrackingData } from '@/lib/analytics/storage';
import { isValidFingerprint } from '@/lib/fingerprint/hybrid';
import { isValidTargetUrl, isValidCampaignId } from '@/lib/utils/validation';
import { checkRateLimit } from '@/lib/utils/rate-limiter';
import type { TrackingRequest, ApiResponse } from '@/lib/types';

export async function POST(request: NextRequest) {
  try {
    // Parse request body
    const body: TrackingRequest = await request.json();

    const {
      fingerprint,
      campaign_id,
      target_url,
      server_hash,
      client_hash,
      device,
      referrer,
      ip,
      language,
    } = body;

    // Validate required fields
    if (!fingerprint || !campaign_id || !target_url || !device) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          error: 'Missing required fields',
        },
        { status: 400 }
      );
    }

    // Validate fingerprint format
    if (!isValidFingerprint(fingerprint)) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          error: 'Invalid fingerprint format',
        },
        { status: 400 }
      );
    }

    // Validate campaign ID
    if (!isValidCampaignId(campaign_id)) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          error: 'Invalid campaign ID',
        },
        { status: 400 }
      );
    }

    // Validate target URL
    if (!isValidTargetUrl(target_url)) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          error: 'Invalid target URL',
        },
        { status: 400 }
      );
    }

    // Apply rate limiting (10 requests per minute per fingerprint)
    const rateLimitResult = checkRateLimit(fingerprint, 10);
    if (!rateLimitResult.success) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          error: 'Rate limit exceeded. Please try again later.',
        },
        { status: 429 }
      );
    }

    // Store tracking data in Firestore
    await storeTrackingData({
      fingerprint,
      campaign_id,
      target_url,
      server_hash: server_hash || '',
      client_hash: client_hash || '',
      device,
      referrer: referrer || null,
      ip: ip || null,
      language: language || 'unknown',
    });

    // Return success response
    return NextResponse.json<ApiResponse>(
      {
        success: true,
        data: {
          fingerprint,
          campaign_id,
        },
      },
      {
        status: 200,
        headers: {
          'X-RateLimit-Remaining': rateLimitResult.remaining.toString(),
        },
      }
    );
  } catch (error) {
    console.error('Tracking API error:', error);

    // Return error but don't block the user
    // Client will still redirect even if tracking fails
    return NextResponse.json<ApiResponse>(
      {
        success: false,
        error: 'Internal server error',
        warning: 'Tracking data may not have been recorded',
      },
      { status: 500 }
    );
  }
}

// Only allow POST requests
export async function GET() {
  return NextResponse.json<ApiResponse>(
    {
      success: false,
      error: 'Method not allowed. Use POST to track clicks.',
    },
    { status: 405 }
  );
}
