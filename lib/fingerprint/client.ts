'use client';

import { Thumbmark } from '@thumbmarkjs/thumbmarkjs';

/**
 * Generate client-side fingerprint using Thumbmark.js
 * This provides 90-95% accuracy for device identification
 * Only runs in the browser
 */
export async function generateClientFingerprint(): Promise<string> {
  try {
    const thumbmark = new Thumbmark();
    const result = await thumbmark.get();
    return result.hash;
  } catch (error) {
    console.error('Thumbmark.js fingerprint failed, using fallback:', error);
    // Fallback to simple browser fingerprint
    return generateFallbackFingerprint();
  }
}

/**
 * Fallback fingerprint generator for when Thumbmark.js fails
 * Uses basic browser properties
 */
function generateFallbackFingerprint(): string {
  if (typeof window === 'undefined') {
    return 'server-side-render';
  }

  const components = [
    navigator.userAgent,
    navigator.language,
    screen.width,
    screen.height,
    screen.colorDepth,
    new Date().getTimezoneOffset(),
    navigator.hardwareConcurrency || 'unknown',
    navigator.maxTouchPoints || 0,
  ].join('|');

  // Simple hash function for fallback
  return btoa(components)
    .replace(/=/g, '')
    .substring(0, 32);
}

/**
 * Combine server and client fingerprints using SubtleCrypto API
 * This runs in the browser and combines both hashes
 */
export async function combineClientFingerprints(
  serverHash: string,
  clientHash: string
): Promise<string> {
  try {
    const combined = `${serverHash}:${clientHash}`;
    const encoder = new TextEncoder();
    const data = encoder.encode(combined);

    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
  } catch (error) {
    console.error('SubtleCrypto failed, using fallback:', error);
    // Fallback: simple concatenation and base64
    return btoa(`${serverHash}:${clientHash}`)
      .replace(/=/g, '')
      .substring(0, 64);
  }
}
