# Click Tracker

A self-hosted link tracking system that runs on Vercel's free tier with Firebase Firestore for analytics storage. Track link clicks with custom URL parameters and hybrid device fingerprinting for 85-90% accuracy.

## Features

- **Fast Tracking**: Redirect users in < 500ms while capturing comprehensive analytics
- **Hybrid Fingerprinting**: Combines server-side (headers) + client-side (Thumbmark.js) for accurate device identification
- **Detailed Analytics**: Track unique devices, total clicks, device types, browsers, OS, and referrers per campaign
- **Privacy-Focused**: Self-hosted on Vercel with Firebase - your data stays under your control
- **Dashboard**: Simple web UI to view analytics with charts, stats, and device breakdowns
- **Path-Based URLs**: Clean tracking links like `/track/campaign-name?url=target-url`

## Tech Stack

- **Frontend**: Next.js 15 (App Router), React 18, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes (Serverless Functions)
- **Database**: Firebase Firestore
- **Fingerprinting**: Thumbmark.js + ua-parser-js
- **Deployment**: Vercel
- **Charts**: Recharts
- **Auth**: Basic Auth middleware for dashboard

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Firebase account (free tier works)
- Vercel account (free tier works)

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd click-tracker
npm install
```

### 2. Firebase Setup

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project
3. Enable **Firestore Database**:
   - Click "Build" → "Firestore Database"
   - Click "Create Database"
   - Start in **production mode**
   - Choose a location

4. Set Firestore Security Rules:
   - Go to "Firestore Database" → "Rules"
   - Replace with:
   ```javascript
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       match /clicks/{document} {
         allow read, write: if false; // Server-only access
       }
     }
   }
   ```
   - Click "Publish"

5. Create Firestore Indexes:
   - Go to "Firestore Database" → "Indexes" → "Composite"
   - Create these indexes:
     - Collection ID: `clicks`, Fields: `campaign_id` (Ascending), `last_click` (Descending)
     - Collection ID: `clicks`, Fields: `campaign_id` (Ascending), `first_click` (Descending)

6. Get Firebase Config (Client):
   - Go to Project Settings → General
   - Scroll to "Your apps" → Click "Web" icon
   - Copy the config values

7. Get Firebase Admin SDK Key (Server):
   - Go to Project Settings → Service Accounts
   - Click "Generate new private key"
   - Download the JSON file

### 3. Environment Variables

Create `.env.local` file in the root directory:

```env
# Firebase Client (Public)
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abcdef

# Firebase Admin SDK (Private - Server-side only)
FIREBASE_ADMIN_PROJECT_ID=your-project-id
FIREBASE_ADMIN_CLIENT_EMAIL=firebase-adminsdk@your-project.iam.gserviceaccount.com
FIREBASE_ADMIN_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"

# Dashboard Authentication
DASHBOARD_USERNAME=admin
DASHBOARD_PASSWORD=your_secure_password_here

# Application URL
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

**Important**: For `FIREBASE_ADMIN_PRIVATE_KEY`, use the private key from the downloaded JSON file. Keep the quotes and `\n` for newlines.

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the landing page.

## Usage

### Creating Tracking Links

Use this URL format to create tracking links:

```
http://localhost:3000/track/[campaign-id]?url=[target-url]
```

**Example:**

```
http://localhost:3000/track/instagram-bio?url=https://klydo.in/
```

Replace:
- `[campaign-id]`: Your campaign identifier (alphanumeric, dashes, underscores)
- `[target-url]`: The destination URL (must be URL-encoded)

### Viewing Analytics

1. Navigate to [http://localhost:3000/dashboard](http://localhost:3000/dashboard)
2. Enter credentials (from `.env.local`):
   - Username: `admin` (or your `DASHBOARD_USERNAME`)
   - Password: (your `DASHBOARD_PASSWORD`)
3. View all campaigns and their stats
4. Click on a campaign to see detailed analytics

### Dashboard Features

**Main Dashboard:**
- Total campaigns, unique devices, total clicks
- List of all campaigns with stats
- Last click timestamp for each campaign

**Campaign Details:**
- Unique devices, total clicks, average clicks per device
- Device type breakdown (mobile, desktop, tablet)
- Top browsers and operating systems
- Device table with sortable/paginated data
- Tracking link for the campaign

## Deployment

### Deploy to Vercel

1. Push your code to GitHub:

```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin <your-github-repo-url>
git push -u origin main
```

2. Go to [Vercel](https://vercel.com)
3. Click "Add New" → "Project"
4. Import your GitHub repository
5. Configure Environment Variables:
   - Add all variables from `.env.local`
   - For `FIREBASE_ADMIN_PRIVATE_KEY`, make sure to keep the quotes and `\n` for newlines
6. Click "Deploy"

7. Once deployed, update `NEXT_PUBLIC_APP_URL` to your Vercel URL:
   ```
   NEXT_PUBLIC_APP_URL=https://your-project.vercel.app
   ```

### Post-Deployment

1. Test a tracking link:
   ```
   https://your-project.vercel.app/track/test?url=https://example.com
   ```

2. Check dashboard:
   ```
   https://your-project.vercel.app/dashboard
   ```

3. Verify Firestore data is being stored

## How It Works

### Tracking Flow

1. **User clicks tracking link**: `/track/campaign-id?url=target-url`
2. **Server component** (Next.js):
   - Validates campaign ID and target URL
   - Generates server-side fingerprint from headers (User-Agent, IP, Language)
   - Renders client component with server fingerprint
3. **Client component** (Browser):
   - Loads Thumbmark.js and generates client-side fingerprint
   - Combines server + client hashes using SHA256
   - Sends tracking data to `/api/track`
4. **API route**:
   - Validates data and applies rate limiting (10 req/min per fingerprint)
   - Stores/updates click data in Firestore using composite key: `{fingerprint}_{campaign_id}`
   - Same device clicking different campaigns = separate records (like referral tracking)
   - Same device clicking same campaign = updates click count
   - Returns success response
5. **Redirect**:
   - Client redirects user to target URL
   - Total latency: < 500ms

### Data Storage

**Document ID Structure**: `{fingerprint}_{campaign_id}_{url_hash}`

Where `url_hash` is the first 8 characters of an MD5 hash of the target URL.

This three-part composite key allows:
- ✅ Same device can click multiple campaigns (each gets its own record)
- ✅ Same campaign can track different target URLs separately (A/B testing, product variants)
- ✅ Track which specific URLs a device has visited under each campaign
- ✅ Re-clicking same campaign + same URL increments the click count

**Example**:
- Device ABC clicks `/track/promo?url=https://example.com/product-a` → Document: `ABC_promo_a1b2c3d4`
- Same device clicks `/track/promo?url=https://example.com/product-b` → Document: `ABC_promo_e5f6g7h8`
- Same device clicks `/track/twitter?url=https://example.com` → Document: `ABC_twitter_x9y8z7w6`
- Same device clicks `/track/promo?url=https://example.com/product-a` again → Updates `ABC_promo_a1b2c3d4` (click_count: 2)

**Use Cases**:
- **A/B Testing**: Same campaign, different landing pages - track which performs better
- **Product Variants**: Same campaign promoting different products - see which gets more interest
- **Multi-URL Campaigns**: Track performance of different content under one campaign umbrella

### Fingerprinting Strategy

**Hybrid Approach** (85-90% accuracy):
- **Server-side** (60-75% accuracy): User-Agent, IP address, Accept-Language headers
- **Client-side** (90-95% accuracy): Thumbmark.js analyzes canvas, fonts, screen, timezone, etc.
- **Combined**: SHA256(serverHash + clientHash) = unique device fingerprint

## Security

- **Firebase Admin SDK**: Only used server-side, credentials never exposed to client
- **Firestore Rules**: Deny all client access, server-only writes
- **Basic Auth**: Dashboard protected with username/password
- **URL Validation**: Blocks localhost, internal IPs, non-http(s) protocols
- **Rate Limiting**: 10 requests per minute per fingerprint
- **Campaign ID Sanitization**: Only alphanumeric, dash, underscore allowed

## Performance

- **Redirect Latency**: < 500ms (server fingerprint + client fingerprint + Firestore write)
- **Dashboard Load**: < 2s (server-side rendering with Firestore queries)
- **Firestore Indexes**: Composite indexes for fast queries
- **Vercel Edge**: Deployed to edge for low latency

## License

MIT License - feel free to use this project for personal or commercial purposes.
