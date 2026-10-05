export type Language = 'bn' | 'en';

export const translations = {
  bn: {
    brandName: 'গেরেনা অফিশিয়াল এপিআই বিডি',
    brandTag: 'অফিসিয়াল গেটওয়ে',
    navFeatures: 'এপিআই সুবিধাসমূহ',
    navPlayground: 'লাইভ টেস্ট',
    navSubApi: 'সাব এপিআই ডক্স',
    navPricing: 'প্রাইসিং',
    navPayments: 'পেমেন্ট মেথড',
    navDashboard: 'ড্যাশবোর্ড',
    navSignIn: 'লগইন',
    navRegister: 'রেজিস্ট্রেশন',
    navSignOut: 'লগআউট',

    // Hero
    heroBadge: 'গেরেনা অফিশিয়াল ফ্রি ফায়ার প্লেয়ার ভেরিফিকেশন ইঞ্জিন',
    heroTitle: 'ফ্রি ফায়ার প্লেয়ার নেম ও অ্যাকাউন্ট চেক অফিসিয়াল এপিআই',
    heroSubtitle: 'আপনার টপ-আপ ওয়েবসাইট, শপ কিংবা বটের জন্য দ্রুততম গেরেনা প্লেয়ার ইউআইডি নেম ভেরিফিকেশন এপিআই। তাৎক্ষণিক সাব-এপিআই কি জেনারেট করে নিজের ওয়েবসাইটে যুক্ত করুন।',
    heroBtnStart: 'এপিআই কি জেনারেট করুন',
    heroBtnDocs: 'ইন্টিগ্রেশন গাইড দেখুন',
    heroInstantCheck: 'সরাসরি ইউআইডি টেস্ট করুন',
    heroEnterUid: 'প্লেয়ার ইউআইডি দিন (যেমন: 12345678)',
    heroCheckBtn: 'চেক করুন',
    heroSampleUidHint: 'বাস্তব ইউআইডি ট্রাই করুন:',

    // Player Result Card
    playerFound: 'প্লেয়ার অ্যাকাউন্ট সফলভাবে যাচাইকৃত',
    playerName: 'প্লেয়ারের নাম',
    playerLevel: 'লেভেল',
    playerRegion: 'সার্ভার রিজিয়ন',
    playerUid: 'ইউআইডি',
    responseLatency: 'রেসপন্স সময়',
    statusCached: 'ক্যাশড মেমরি',
    statusLive: 'লাইভ গেরেনা সার্ভার',

    // Payment Section
    paymentHeading: 'সহজ ও ইনস্ট্যান্ট ওয়ালেট রিচার্জ পার্টনার্স',
    paymentSub: 'কোনো অতিরিক্ত চার্জ ছাড়াই বিকাশ, নগদ, রকেট, উপায় ও ভিসা/মাস্টারকার্ডের মাধ্যমে তাৎক্ষণিক অটো ব্যালেন্স লোড করুন।',
    instantActivation: 'স্বয়ংক্রিয় ইনস্ট্যান্ট ব্যালেন্স যোগ',

    // Sub-API features
    subApiTitle: 'সাব-এপিআই কি (Sub-API Key) সিস্টেম',
    subApiSubtitle: 'একটি মাস্টার অ্যাকাউন্ট থেকে একাধিক ওয়েবসাইটের জন্য পৃথক সাব-এপিআই কি জেনারেট করুন। প্রতিটি সাইটের আলাদা রেট লিমিট ও অর্ডার হিস্টোরি ট্র্যাক করুন।',
    feature1Title: 'ইনস্ট্যান্ট প্লেয়ার নেম চেক',
    feature1Desc: 'মাত্র ১৪০ মিলিসেকেন্ডে সঠিক প্লেয়ার নেম, লেভেল ও সার্ভার রিজিয়ন ডাটা রিটার্ন করে।',
    feature2Title: 'সাব-এপিআই কি ব্যবস্থাপনা',
    feature2Desc: 'প্রতিটি ক্লায়েন্ট বা ডোমেইনের জন্য আলাদা কি, ডোমেন রেস্ট্রিকশন এবং রিকোয়েস্ট লিমিট সেট করুন।',
    feature3Title: 'বিস্তারিত অর্ডার ও রিকোয়েস্ট লগ',
    feature3Desc: 'আপনার এপিআই কি দিয়ে কোন ওয়েবসাইট থেকে কখন কোন ইউআইডি চেক করা হয়েছে তার সম্পূর্ণ লাইভ হিস্টোরি।',
    feature4Title: 'সাশ্রয়ী ও ফেয়ার বিলিং',
    feature4Desc: 'প্রতি সফল ইউআইডি চেকে মাত্র ৳০.০৫ (৫ পয়সা)। কোনো মাসিক হিডেন ফি নেই।',

    // Dashboard
    dashTitle: 'ডেভেলপার কন্ট্রোল প্যানেল',
    dashSubtitle: 'আপনার এপিআই কি, সাব-এপিআই, অর্ডার লগ এবং ওয়ালেট ব্যালেন্স পরিচালনা করুন',
    tabOverview: 'সারসংক্ষেপ',
    tabApiKeys: 'এপিআই ও সাব-এপিআই',
    tabOrders: 'অর্ডার হিস্টোরি',
    tabPlayground: 'এপিআই প্লেগ্রাউন্ড',
    tabBilling: 'ওয়ালেট ও রিচার্জ',
    tabDocs: 'ইন্টিগ্রেশন গাইড',

    // Metrics
    metricBalance: 'বর্তমান ওয়ালেট ব্যালেন্স',
    metricTodayChecks: 'আজকের সফল চেক',
    metricTotalOrders: 'মোট প্রসেসকৃত রিকোয়েস্ট',
    metricAvgLatency: 'গড় রেসপন্স টাইম',
    rechargeNow: 'রিচার্জ করুন',
    copyKey: 'কি কপি করুন',
    regenerateKey: 'নতুন কি তৈরি করুন',
    createSubKey: '+ নতুন সাব-এপিআই কি',

    // Tables
    colRequestId: 'রিকোয়েস্ট আইডি',
    colTime: 'সময়',
    colUid: 'প্লেয়ার ইউআইডি',
    colPlayer: 'প্লেয়ার নাম',
    colLevel: 'লেভেল',
    colRegion: 'রিজিয়ন',
    colCost: 'খরচ (টাকা)',
    colStatus: 'স্ট্যাটাস',
    colSource: 'উৎস / ডোমেন',
    noOrdersFound: 'কোনো অর্ডার লগ পাওয়া যায়নি',

    // API Key section
    primaryKeyTitle: 'মাস্টার এপিআই কি (Primary Key)',
    primaryKeyDesc: 'এই কি দিয়ে আপনার সমস্ত সার্ভিস এবং এপিআই এন্ডপয়েন্ট এক্সেস করা যাবে। এটি গোপন রাখুন।',
    subKeyTitle: 'আপনার সক্রিয় সাব-এপিআই কি সমূহ',
    subKeyDesc: 'বিভিন্ন ওয়েবসাইট ও মোবাইল অ্যাপ্লিকেশনে ব্যবহারের জন্য আলাদা সাব-এপিআই কি।',
    endpointUrl: 'এপিআই এন্ডপয়েন্ট ইউআরএল',

    // Recharge
    rechargeTitle: 'ইনস্ট্যান্ট ওয়ালেট রিচার্জ',
    selectMethod: 'পেমেন্ট মাধ্যম বেছে নিন',
    amountLabel: 'রিচার্জের পরিমাণ (টাকা)',
    senderPhone: 'প্রেরকের মোবাইল নম্বর',
    trxIdLabel: 'ট্রানজেকশন আইডি (TrxID)',
    submitRecharge: 'ব্যালেন্স যুক্ত করুন',
    rechargeInstructions: 'টাকা পাঠানোর নিয়মাবলি'
  },
  en: {
    brandName: 'GARENA API BD',
    brandTag: 'Official Gateway',
    navFeatures: 'Features',
    navPlayground: 'Live Tester',
    navSubApi: 'Sub-API Docs',
    navPricing: 'Pricing',
    navPayments: 'Payment Partners',
    navDashboard: 'Dashboard',
    navSignIn: 'Sign In',
    navRegister: 'Register',
    navSignOut: 'Sign Out',

    // Hero
    heroBadge: 'Official Garena Free Fire Player Verification Engine',
    heroTitle: 'Official Free Fire Player UID & Name Verification API',
    heroSubtitle: 'The fastest, high-availability Garena Free Fire player lookup API for diamond top-up websites, shops, and automated bots. Generate Sub-API keys instantly for multiple websites.',
    heroBtnStart: 'Get API Key',
    heroBtnDocs: 'Integration Guide',
    heroInstantCheck: 'Direct UID Lookup Test',
    heroEnterUid: 'Enter Player UID (e.g. 12345678)',
    heroCheckBtn: 'Check UID',
    heroSampleUidHint: 'Try sample UIDs:',

    // Player Result Card
    playerFound: 'Player Account Verified Successfully',
    playerName: 'Player Name',
    playerLevel: 'Level',
    playerRegion: 'Server Region',
    playerUid: 'UID',
    responseLatency: 'Response Latency',
    statusCached: 'Cached Memory',
    statusLive: 'Live Garena Server',

    // Payment Section
    paymentHeading: 'Automated Wallet Top-up Partners',
    paymentSub: 'Instantly reload your developer balance via bKash, Nagad, Rocket, Upay, and Visa/Mastercard without hidden fees.',
    instantActivation: 'Automated Instant Credit',

    // Sub-API features
    subApiTitle: 'Advanced Sub-API Key Architecture',
    subApiSubtitle: 'Provision independent Sub-API keys for each client website from a single parent balance. Monitor domain-specific request telemetry and order history.',
    feature1Title: 'Instant Player Name Lookup',
    feature1Desc: 'Returns verified player name, level, and regional server data in under 140ms.',
    feature2Title: 'Granular Sub-API Controls',
    feature2Desc: 'Set custom rate limits, domain whitelist restrictions, and toggle sub-keys per client website.',
    feature3Title: 'Detailed Order & Query Logs',
    feature3Desc: 'Full real-time audit log of every player UID lookup, source IP, timestamp, and status code.',
    feature4Title: 'Transparent Pay-As-You-Go',
    feature4Desc: 'Just ৳0.05 BDT per successful player lookup. No monthly recurring fees or expiration.',

    // Dashboard
    dashTitle: 'Developer Command Center',
    dashSubtitle: 'Manage your primary master keys, client sub-keys, order logs, and billing balance.',
    tabOverview: 'Overview',
    tabApiKeys: 'API & Sub-Keys',
    tabOrders: 'Order History',
    tabPlayground: 'Live Playground',
    tabBilling: 'Wallet & Top-up',
    tabDocs: 'Integration Docs',

    // Metrics
    metricBalance: 'Active Balance',
    metricTodayChecks: 'Successful Checks Today',
    metricTotalOrders: 'Total Requests Processed',
    metricAvgLatency: 'Avg Gateway Latency',
    rechargeNow: 'Add Funds',
    copyKey: 'Copy Key',
    regenerateKey: 'Regenerate Key',
    createSubKey: '+ New Sub-API Key',

    // Tables
    colRequestId: 'Request ID',
    colTime: 'Timestamp',
    colUid: 'Target UID',
    colPlayer: 'Player Name',
    colLevel: 'Level',
    colRegion: 'Region',
    colCost: 'Cost (BDT)',
    colStatus: 'Status',
    colSource: 'Source / Referrer',
    noOrdersFound: 'No order logs found matching criteria',

    // API Key section
    primaryKeyTitle: 'Master Primary API Key',
    primaryKeyDesc: 'Full access to your account billing and all endpoints. Keep this token private.',
    subKeyTitle: 'Active Sub-API Keys',
    subKeyDesc: 'Isolated keys tailored for embedding into specific WordPress, PHP, or mobile applications.',
    endpointUrl: 'Public Gateway Endpoint',

    // Recharge
    rechargeTitle: 'Instant Wallet Top-up',
    selectMethod: 'Choose Payment Gateway',
    amountLabel: 'Amount in BDT (৳)',
    senderPhone: 'Sender Mobile Number',
    trxIdLabel: 'Transaction ID (TrxID)',
    submitRecharge: 'Confirm Recharge',
    rechargeInstructions: 'Payment Instructions'
  }
};
