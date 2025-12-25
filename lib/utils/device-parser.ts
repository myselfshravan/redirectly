import { UAParser } from 'ua-parser-js';
import type { DeviceInfo } from '@/lib/types';

/**
 * Parse User-Agent string and extract device information
 * Uses ua-parser-js for consistent parsing
 */
export function parseUserAgent(userAgent: string): DeviceInfo {
  const parser = new UAParser(userAgent);
  const result = parser.getResult();

  // Determine device type
  let deviceType: DeviceInfo['type'] = 'unknown';
  if (result.device.type === 'mobile') {
    deviceType = 'mobile';
  } else if (result.device.type === 'tablet') {
    deviceType = 'tablet';
  } else if (result.device.type === undefined && result.os.name) {
    // If no device type but has OS, likely desktop
    deviceType = 'desktop';
  }

  return {
    type: deviceType,
    browser: result.browser.name || 'Unknown',
    browser_version: result.browser.version || 'Unknown',
    os: result.os.name || 'Unknown',
    os_version: result.os.version || 'Unknown',
    user_agent: userAgent,
  };
}

/**
 * Get a human-readable device type label
 */
export function getDeviceTypeLabel(type: DeviceInfo['type']): string {
  const labels = {
    mobile: 'Mobile',
    tablet: 'Tablet',
    desktop: 'Desktop',
    unknown: 'Unknown',
  };
  return labels[type];
}

/**
 * Get a formatted device string for display
 */
export function formatDeviceInfo(device: DeviceInfo): string {
  return `${device.browser} on ${device.os} (${getDeviceTypeLabel(device.type)})`;
}
