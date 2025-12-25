import { LRUCache } from 'lru-cache';
import type { RateLimitResult } from '@/lib/types';

// In-memory cache for Vercel free tier
// Stores timestamps of recent requests per identifier
const ratelimit = new LRUCache<string, number[]>({
  max: 500, // Maximum number of tracked identifiers
  ttl: 60000, // 1 minute TTL
});

/**
 * Check if a request is within rate limits
 * @param identifier - Unique identifier for the requester (e.g., fingerprint or IP)
 * @param limit - Maximum number of requests allowed per minute
 * @returns Object indicating if request is allowed and remaining quota
 */
export function checkRateLimit(
  identifier: string,
  limit: number = 10
): RateLimitResult {
  const now = Date.now();
  const windowStart = now - 60000; // 1 minute window

  // Get previous requests for this identifier
  const requests = ratelimit.get(identifier) || [];

  // Filter to only recent requests within the time window
  const recentRequests = requests.filter((time) => time > windowStart);

  // Check if limit exceeded
  if (recentRequests.length >= limit) {
    return { success: false, remaining: 0 };
  }

  // Add current request timestamp
  recentRequests.push(now);
  ratelimit.set(identifier, recentRequests);

  return {
    success: true,
    remaining: limit - recentRequests.length,
  };
}

/**
 * Clear rate limit for a specific identifier (useful for testing)
 */
export function clearRateLimit(identifier: string): void {
  ratelimit.delete(identifier);
}
