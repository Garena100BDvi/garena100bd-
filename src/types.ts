export interface User {
  id: string;
  username: string;
  email: string;
  phone: string;
  password?: string;
  companyName: string;
  balance: number; // in BDT (৳)
  primaryApiKey: string;
  totalQueries: number;
  createdAt: string;
}

export interface SubApiKey {
  id: string;
  userId: string;
  name: string;
  key: string;
  allowedDomain: string;
  rateLimitPerMin: number;
  totalRequests: number;
  isActive: boolean;
  createdAt: string;
}

export interface OrderLog {
  id: string;
  userId: string;
  apiKey: string;
  keyName: string;
  uid: string;
  playerName: string;
  level: number;
  region: string;
  cost: number;
  status: 'SUCCESS' | 'CACHED' | 'NOT_FOUND' | 'FAILED';
  source: string;
  ip: string;
  latencyMs: number;
  timestamp: string;
}

export interface Transaction {
  id: string;
  userId: string;
  amount: number;
  method: 'bkash' | 'nagad' | 'rocket' | 'upay' | 'card' | 'admin_add' | 'admin_deduct';
  senderNumber: string;
  trxId: string;
  status: 'COMPLETED' | 'PENDING';
  timestamp: string;
}

export interface PlayerData {
  uid: string;
  name: string;
  level: number;
  region: string;
  cached?: boolean;
}

export interface PlayerCheckResponse {
  status: boolean;
  cached?: boolean;
  latency_ms?: number;
  data?: PlayerData;
  error?: string;
  message?: string;
  request_id?: string;
  cost_deducted?: number;
  balance_remaining?: number;
}

export interface HeroSlideConfig {
  id: string;
  badge: string;
  badgeBn: string;
  mainTitle: string;
  subTitleTag: string;
  heading: string;
  headingEn: string;
  description: string;
  descriptionEn: string;
  ctaPrimary: string;
  ctaPrimaryEn: string;
  ctaSecondary: string;
  ctaSecondaryEn: string;
  tagline: string;
  themeColor: string;
  bgImageUrl?: string;
}

export interface SiteConfig {
  siteTitle: string;
  siteSubtitle: string;
  brandName: string;
  brandTag: string;
  backgroundUrl: string;
  costPerCheck: number;
  noticeText: string;
  noticeActive: boolean;
  noticeBgColor: string;
  noticeTextColor: string;
  bkashNumber: string;
  nagadNumber: string;
  rocketNumber: string;
  telegramLink: string;
  whatsappNumber: string;
  heroSlides: HeroSlideConfig[];
}
