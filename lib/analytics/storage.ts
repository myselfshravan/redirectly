import { getAdminDb } from '@/lib/firebase/admin';
import { FieldValue } from 'firebase-admin/firestore';
import type { TrackingRequest, ClickData } from '@/lib/types';
import crypto from 'crypto';

/**
 * Generate a short hash of the target URL for use in document ID
 */
function hashUrl(url: string): string {
  return crypto.createHash('md5').update(url).digest('hex').substring(0, 8);
}

/**
 * Store or update tracking data in Firestore
 * Creates a new document if it doesn't exist, or updates existing one
 */
export async function storeTrackingData(data: TrackingRequest): Promise<void> {
  try {
    const db = getAdminDb();
    // Use composite key: fingerprint + campaign_id + url_hash
    // This allows same device to click multiple campaigns AND different URLs
    const urlHash = hashUrl(data.target_url);
    const docId = `${data.fingerprint}_${data.campaign_id}_${urlHash}`;
    const docRef = db.collection('clicks').doc(docId);

    // Check if document exists
    const doc = await docRef.get();

    const now = FieldValue.serverTimestamp();

    if (!doc.exists) {
      // Create new document for first-time visitor to this campaign
      await docRef.set({
        fingerprint: data.fingerprint,
        campaign_id: data.campaign_id,
        target_url: data.target_url,
        first_click: now,
        last_click: now,
        created_at: now,
        updated_at: now,
        click_count: 1,
        device: data.device,
        referrer: data.referrer,
        ip: data.ip,
        language: data.language,
        server_hash: data.server_hash,
        client_hash: data.client_hash,
      });
    } else {
      // Update existing document for returning visitor to same campaign
      await docRef.update({
        last_click: now,
        updated_at: now,
        click_count: FieldValue.increment(1),
        // Update target URL in case it changed
        target_url: data.target_url,
      });
    }
  } catch (error) {
    console.error('Error storing tracking data:', error);
    throw new Error('Failed to store tracking data');
  }
}

/**
 * Get a single click record by fingerprint
 */
export async function getClickByFingerprint(
  fingerprint: string
): Promise<ClickData | null> {
  try {
    const db = getAdminDb();
    const doc = await db.collection('clicks').doc(fingerprint).get();

    if (!doc.exists) {
      return null;
    }

    return doc.data() as ClickData;
  } catch (error) {
    console.error('Error fetching click data:', error);
    return null;
  }
}

/**
 * Delete old tracking data (for GDPR compliance or cleanup)
 * Deletes records older than specified days
 */
export async function deleteOldTrackingData(daysOld: number = 90): Promise<number> {
  try {
    const db = getAdminDb();
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysOld);

    const snapshot = await db
      .collection('clicks')
      .where('last_click', '<', cutoffDate)
      .get();

    const batch = db.batch();
    snapshot.docs.forEach((doc) => {
      batch.delete(doc.ref);
    });

    await batch.commit();
    return snapshot.size;
  } catch (error) {
    console.error('Error deleting old tracking data:', error);
    throw new Error('Failed to delete old tracking data');
  }
}
