/**
 * Validate if a URL is safe and properly formatted
 * Prevents open redirect vulnerabilities and blocks internal IPs
 */
export function isValidTargetUrl(url: string): boolean {
  try {
    const parsed = new URL(url);

    // Only allow http/https protocols
    if (!['http:', 'https:'].includes(parsed.protocol)) {
      return false;
    }

    // Prevent localhost and internal IP addresses
    const hostname = parsed.hostname.toLowerCase();
    if (
      hostname === 'localhost' ||
      hostname === '127.0.0.1' ||
      hostname === '0.0.0.0' ||
      hostname === '::1' ||
      hostname.startsWith('127.') ||
      hostname.startsWith('192.168.') ||
      hostname.startsWith('10.') ||
      hostname.startsWith('172.16.') ||
      hostname.startsWith('172.17.') ||
      hostname.startsWith('172.18.') ||
      hostname.startsWith('172.19.') ||
      hostname.startsWith('172.2') || // 172.20-29
      hostname.startsWith('172.30') ||
      hostname.startsWith('172.31') ||
      hostname.includes('local.') ||
      hostname.endsWith('.local')
    ) {
      return false;
    }

    return true;
  } catch {
    // Invalid URL format
    return false;
  }
}

/**
 * Sanitize campaign ID to prevent injection attacks
 * Only allow alphanumeric characters, dashes, and underscores
 */
export function sanitizeCampaignId(campaignId: string): string {
  return campaignId.replace(/[^a-zA-Z0-9-_]/g, '');
}

/**
 * Validate campaign ID format
 */
export function isValidCampaignId(campaignId: string): boolean {
  // Must be 1-100 characters, alphanumeric, dash, or underscore
  return /^[a-zA-Z0-9-_]{1,100}$/.test(campaignId);
}

/**
 * Safely encode URL for use in query parameters
 */
export function encodeUrl(url: string): string {
  return encodeURIComponent(url);
}

/**
 * Safely decode URL from query parameters
 */
export function decodeUrl(encodedUrl: string): string {
  try {
    return decodeURIComponent(encodedUrl);
  } catch {
    return encodedUrl;
  }
}
