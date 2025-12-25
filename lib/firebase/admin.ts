import { initializeApp, getApps, cert, App } from 'firebase-admin/app';
import { getFirestore, Firestore } from 'firebase-admin/firestore';

let adminApp: App;
let adminDb: Firestore;

/**
 * Initialize Firebase Admin SDK
 * This is used for server-side operations only
 */
function initializeFirebaseAdmin() {
  if (getApps().length === 0) {
    // Parse the private key (handle escaped newlines)
    const privateKey = process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(
      /\\n/g,
      '\n'
    );

    if (!privateKey || !process.env.FIREBASE_ADMIN_CLIENT_EMAIL || !process.env.FIREBASE_ADMIN_PROJECT_ID) {
      throw new Error(
        'Firebase Admin credentials are missing. Please check your environment variables.'
      );
    }

    adminApp = initializeApp({
      credential: cert({
        projectId: process.env.FIREBASE_ADMIN_PROJECT_ID,
        clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
        privateKey: privateKey,
      }),
      projectId: process.env.FIREBASE_ADMIN_PROJECT_ID,
    });

    adminDb = getFirestore(adminApp);
  } else {
    adminApp = getApps()[0];
    adminDb = getFirestore(adminApp);
  }

  return { adminApp, adminDb };
}

// Export initialized instances
export function getAdminDb(): Firestore {
  if (!adminDb) {
    const { adminDb: db } = initializeFirebaseAdmin();
    return db;
  }
  return adminDb;
}

export function getAdminApp(): App {
  if (!adminApp) {
    const { adminApp: app } = initializeFirebaseAdmin();
    return app;
  }
  return adminApp;
}
