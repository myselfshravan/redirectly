import { Timestamp } from 'firebase/firestore';

// Device information types
export interface DeviceInfo {
  type: 'mobile' | 'tablet' | 'desktop' | 'unknown';
  browser: string;
  browser_version: string;
  os: string;
  os_version: string;
  user_agent: string;
}

// Fingerprint components
export interface FingerprintComponents {
  userAgent: string;
  ip: string;
  language: string;
}

export interface ServerFingerprintResult {
  hash: string;
  components: FingerprintComponents;
}

// Click tracking data (stored in Firestore)
export interface ClickData {
  fingerprint: string;
  campaign_id: string;
  target_url: string;
  first_click: Timestamp;
  last_click: Timestamp;
  created_at: Timestamp;
  updated_at: Timestamp;
  click_count: number;
  device: DeviceInfo;
  referrer: string | null;
  ip: string | null;
  language: string;
  server_hash: string;
  client_hash: string;
}

// Tracking request payload
export interface TrackingRequest {
  fingerprint: string;
  campaign_id: string;
  target_url: string;
  server_hash: string;
  client_hash: string;
  device: DeviceInfo;
  referrer: string | null;
  ip: string | null;
  language: string;
}

// Analytics types
export interface CampaignStats {
  id: string;
  campaign_id: string;
  unique_devices: number;
  total_clicks: number;
  last_click: Date | null;
}

export interface DeviceAnalytics {
  fingerprint: string;
  device: DeviceInfo;
  first_click: Date;
  last_click: Date;
  click_count: number;
  referrer: string | null;
}

export interface CampaignAnalytics {
  campaign_id: string;
  unique_devices: number;
  total_clicks: number;
  devices: DeviceAnalytics[];
}

// Dashboard types
export interface DeviceBreakdown {
  mobile: number;
  tablet: number;
  desktop: number;
  unknown: number;
}

export interface BrowserStats {
  [browser: string]: number;
}

export interface OSStats {
  [os: string]: number;
}

// API response types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  warning?: string;
}

export interface RateLimitResult {
  success: boolean;
  remaining: number;
}

// Chart data types
export interface ChartDataPoint {
  date: string;
  clicks: number;
}
