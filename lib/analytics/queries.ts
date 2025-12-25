import { getAdminDb } from '@/lib/firebase/admin';
import type {
  CampaignStats,
  DeviceAnalytics,
  CampaignAnalytics,
  DeviceBreakdown,
  BrowserStats,
  OSStats,
} from '@/lib/types';

/**
 * Get all campaigns with their stats
 */
export async function getAllCampaigns(): Promise<CampaignStats[]> {
  try {
    const db = getAdminDb();
    const snapshot = await db.collection('clicks').get();

    // Group by campaign_id and aggregate
    const campaigns = new Map<string, CampaignStats>();

    snapshot.forEach((doc) => {
      const data = doc.data();
      const campaignId = data.campaign_id;

      if (!campaigns.has(campaignId)) {
        campaigns.set(campaignId, {
          id: campaignId,
          campaign_id: campaignId,
          unique_devices: 0,
          total_clicks: 0,
          last_click: null,
        });
      }

      const campaign = campaigns.get(campaignId)!;
      campaign.unique_devices += 1;
      campaign.total_clicks += data.click_count || 1;

      const lastClick = data.last_click?.toDate();
      if (!campaign.last_click || (lastClick && lastClick > campaign.last_click)) {
        campaign.last_click = lastClick || null;
      }
    });

    return Array.from(campaigns.values()).sort((a, b) => {
      if (!a.last_click) return 1;
      if (!b.last_click) return -1;
      return b.last_click.getTime() - a.last_click.getTime();
    });
  } catch (error) {
    console.error('Error fetching all campaigns:', error);
    throw new Error('Failed to fetch campaigns');
  }
}

/**
 * Get detailed analytics for a specific campaign
 */
export async function getCampaignAnalytics(
  campaignId: string
): Promise<CampaignAnalytics> {
  try {
    const db = getAdminDb();
    const snapshot = await db
      .collection('clicks')
      .where('campaign_id', '==', campaignId)
      .get();

    const devices: DeviceAnalytics[] = [];
    let totalClicks = 0;

    snapshot.forEach((doc) => {
      const data = doc.data();
      devices.push({
        fingerprint: doc.id,
        device: data.device,
        first_click: data.first_click?.toDate() || new Date(),
        last_click: data.last_click?.toDate() || new Date(),
        click_count: data.click_count || 1,
        referrer: data.referrer || null,
      });
      totalClicks += data.click_count || 1;
    });

    return {
      campaign_id: campaignId,
      unique_devices: devices.length,
      total_clicks: totalClicks,
      devices,
    };
  } catch (error) {
    console.error('Error fetching campaign analytics:', error);
    throw new Error('Failed to fetch campaign analytics');
  }
}

/**
 * Get device type breakdown for a campaign
 */
export async function getDeviceBreakdown(
  campaignId: string
): Promise<DeviceBreakdown> {
  try {
    const analytics = await getCampaignAnalytics(campaignId);

    const breakdown: DeviceBreakdown = {
      mobile: 0,
      tablet: 0,
      desktop: 0,
      unknown: 0,
    };

    analytics.devices.forEach((device) => {
      breakdown[device.device.type] += 1;
    });

    return breakdown;
  } catch (error) {
    console.error('Error fetching device breakdown:', error);
    throw new Error('Failed to fetch device breakdown');
  }
}

/**
 * Get browser statistics for a campaign
 */
export async function getBrowserStats(campaignId: string): Promise<BrowserStats> {
  try {
    const analytics = await getCampaignAnalytics(campaignId);

    const stats: BrowserStats = {};

    analytics.devices.forEach((device) => {
      const browser = device.device.browser;
      stats[browser] = (stats[browser] || 0) + 1;
    });

    return stats;
  } catch (error) {
    console.error('Error fetching browser stats:', error);
    throw new Error('Failed to fetch browser stats');
  }
}

/**
 * Get OS statistics for a campaign
 */
export async function getOSStats(campaignId: string): Promise<OSStats> {
  try {
    const analytics = await getCampaignAnalytics(campaignId);

    const stats: OSStats = {};

    analytics.devices.forEach((device) => {
      const os = device.device.os;
      stats[os] = (stats[os] || 0) + 1;
    });

    return stats;
  } catch (error) {
    console.error('Error fetching OS stats:', error);
    throw new Error('Failed to fetch OS stats');
  }
}

/**
 * Get total statistics across all campaigns
 */
export async function getTotalStats(): Promise<{
  total_campaigns: number;
  total_unique_devices: number;
  total_clicks: number;
}> {
  try {
    const campaigns = await getAllCampaigns();

    return {
      total_campaigns: campaigns.length,
      total_unique_devices: campaigns.reduce((sum, c) => sum + c.unique_devices, 0),
      total_clicks: campaigns.reduce((sum, c) => sum + c.total_clicks, 0),
    };
  } catch (error) {
    console.error('Error fetching total stats:', error);
    throw new Error('Failed to fetch total stats');
  }
}
