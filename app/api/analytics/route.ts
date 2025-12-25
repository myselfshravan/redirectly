import { NextRequest, NextResponse } from 'next/server';
import {
  getAllCampaigns,
  getCampaignAnalytics,
  getTotalStats,
  getDeviceBreakdown,
  getBrowserStats,
  getOSStats,
} from '@/lib/analytics/queries';
import type { ApiResponse } from '@/lib/types';

/**
 * GET /api/analytics?campaign_id=xxx
 * Get analytics for a specific campaign or all campaigns
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const campaignId = searchParams.get('campaign_id');
    const type = searchParams.get('type'); // 'overview' | 'devices' | 'browsers' | 'os'

    // If no campaign ID, return all campaigns
    if (!campaignId) {
      const [campaigns, totalStats] = await Promise.all([
        getAllCampaigns(),
        getTotalStats(),
      ]);

      return NextResponse.json<ApiResponse>(
        {
          success: true,
          data: {
            campaigns,
            total: totalStats,
          },
        },
        { status: 200 }
      );
    }

    // Get specific campaign analytics based on type
    switch (type) {
      case 'devices':
        const deviceBreakdown = await getDeviceBreakdown(campaignId);
        return NextResponse.json<ApiResponse>(
          {
            success: true,
            data: deviceBreakdown,
          },
          { status: 200 }
        );

      case 'browsers':
        const browserStats = await getBrowserStats(campaignId);
        return NextResponse.json<ApiResponse>(
          {
            success: true,
            data: browserStats,
          },
          { status: 200 }
        );

      case 'os':
        const osStats = await getOSStats(campaignId);
        return NextResponse.json<ApiResponse>(
          {
            success: true,
            data: osStats,
          },
          { status: 200 }
        );

      default:
        // Default: return full campaign analytics
        const analytics = await getCampaignAnalytics(campaignId);
        return NextResponse.json<ApiResponse>(
          {
            success: true,
            data: analytics,
          },
          { status: 200 }
        );
    }
  } catch (error) {
    console.error('Analytics API error:', error);

    return NextResponse.json<ApiResponse>(
      {
        success: false,
        error: 'Failed to fetch analytics data',
      },
      { status: 500 }
    );
  }
}
