import React from 'react';
import { KeyRound, ShieldAlert, FileCode2, History, Database, Cpu, Check, Layers, Flame } from 'lucide-react';
import { Language, translations } from '../lib/translations';

interface SubApiFeaturesProps {
  lang: Language;
  onOpenDocs: () => void;
  onOpenRegister?: () => void;
  onOpenLogin?: () => void;
}

export const SubApiFeatures: React.FC<SubApiFeaturesProps> = ({
  lang,
  onOpenDocs,
  onOpenRegister
}) => {
  const t = translations[lang];

  const features = [
    {
      icon: Cpu,
      title: t.feature1Title,
      desc: t.feature1Desc,
      tag: '140ms Ultra Fast'
    },
    {
      icon: KeyRound,
      title: t.feature2Title,
      desc: t.feature2Desc,
      tag: 'Multi-Key Control'
    },
    {
      icon: History,
      title: t.feature3Title,
      desc: t.feature3Desc,
      tag: 'Live Audit Trail'
    },
    {
      icon: Layers,
      title: t.feature4Title,
      desc: t.feature4Desc,
      tag: 'Pay As You Go'
    }
  ];

  return (
    <section className="py-16 bg-[#060608] border-t border-neutral-800">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#FFB800]/30 bg-[#FFB800]/10 px-3.5 py-1 text-xs font-['Russo_One',sans-serif] tracking-wider text-[#FFB800] uppercase">
            <Flame className="h-3.5 w-3.5 fill-current" />
            <span>মাল্টি-সাইট সাব-এপিআই আর্কিটেকচার</span>
          </div>
          <h2 className="text-2xl font-black tracking-tight text-white sm:text-3xl font-sans">
            {t.subApiTitle}
          </h2>
          <p className="text-sm text-neutral-400 sm:text-base leading-relaxed font-sans">
            {t.subApiSubtitle}
          </p>
        </div>

        {/* Feature Cards Grid */}
        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feat, idx) => {
            const Icon = feat.icon;
            return (
              <div
                key={idx}
                className="group relative rounded-2xl border border-neutral-800 bg-[#0d0d14] p-6 transition-all hover:border-[#FFB800]/50 hover:bg-[#12121c]"
              >
                <div className="flex items-center justify-between">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-black border border-[#FFB800]/40 text-[#FFB800] group-hover:scale-105 transition-transform">
                    <Icon className="h-5 w-5" />
                  </div>
                  <span className="text-[11px] font-mono text-[#FFB800] font-bold">
                    {feat.tag}
                  </span>
                </div>

                <h3 className="mt-4 text-base font-bold text-white group-hover:text-[#FFB800] transition-colors font-sans">
                  {feat.title}
                </h3>
                <p className="mt-2 text-xs sm:text-sm text-neutral-400 leading-relaxed font-sans">
                  {feat.desc}
                </p>
              </div>
            );
          })}
        </div>

        {/* Visual Architecture Flow: How Master Key + Sub Key connects to website */}
        <div className="mt-12 rounded-2xl border border-neutral-800 bg-[#0c0c12] p-6 sm:p-8 backdrop-blur-sm">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
            
            {/* Step 1 */}
            <div className="space-y-2 rounded-xl border border-neutral-800 bg-black p-4">
              <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#FFB800]">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#FFB800] text-black font-bold text-[11px]">1</span>
                <span>একাউন্ট তৈরি ও কি জেনারেট</span>
              </div>
              <p className="text-xs text-neutral-400 font-sans">
                ড্যাশবোর্ডে গিয়ে মাত্র ১ ক্লিকে আপনার মাস্টার কি অথবা ওয়েবসাইট নির্দিষ্ট সাব-এপিআই কি জেনারেট করুন।
              </p>
              <div className="rounded bg-neutral-900 px-2.5 py-1.5 font-mono text-[11px] text-[#FFB800]">
                gar_sub_myshop_8e91
              </div>
            </div>

            {/* Step 2 */}
            <div className="space-y-2 rounded-xl border border-neutral-800 bg-black p-4">
              <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#FFB800]">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#FFB800] text-black font-bold text-[11px]">2</span>
                <span>আপনার ওয়েবসাইটে লাগান</span>
              </div>
              <p className="text-xs text-neutral-400 font-sans">
                WooCommerce, WordPress ফর্ম কিংবা PHP কোডে এন্ডপয়েন্ট লিঙ্ক করে প্লেয়ারের নাম স্বয়ংক্রিয়ভাবে দেখান।
              </p>
              <div className="rounded bg-neutral-900 px-2.5 py-1.5 font-mono text-[11px] text-emerald-400 truncate">
                GET /api/v1/player?uid=12345678&key=...
              </div>
            </div>

            {/* Step 3 */}
            <div className="space-y-2 rounded-xl border border-neutral-800 bg-black p-4">
              <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#FFB800]">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#FFB800] text-black font-bold text-[11px]">3</span>
                <span>লাইভ অর্ডার হিস্টোরি দেখুন</span>
              </div>
              <p className="text-xs text-neutral-400 font-sans">
                আপনার ড্যাশবোর্ডে কোন সাইট থেকে কয়টি প্লেয়ার চেক হয়েছে তার পুঙ্খানুপুঙ্খ অর্ডার লগ মনিটর করুন।
              </p>
              <div className="rounded bg-neutral-900 px-2.5 py-1.5 font-mono text-[11px] text-amber-300">
                ORD-99120 · FB:ㅤ@GMRemyX · ৳০.০৫
              </div>
            </div>

          </div>

          <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-t border-neutral-800 pt-5">
            <div className="text-xs text-neutral-400 font-sans">
              ওয়ার্ডপ্রেস প্লাগইন ও কাস্টম পিএইচপি স্ক্রিপ্ট সম্পূর্ণ বিনামূল্যে পেয়ে যাচ্ছেন।
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={onOpenDocs}
                className="text-xs font-bold text-[#FFB800] hover:underline uppercase font-mono"
              >
                কোড উদাহরণ দেখুন →
              </button>
              <button
                onClick={onOpenRegister}
                className="rounded-lg bg-[#FFB800] hover:bg-[#FFA500] px-4 py-2 text-xs font-['Russo_One',sans-serif] tracking-wider text-black transition-all active:scale-95 font-bold uppercase"
              >
                এখনই শুরু করুন
              </button>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
