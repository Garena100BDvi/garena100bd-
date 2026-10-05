import React from 'react';
import { ShieldCheck, Zap, Flame } from 'lucide-react';
import { Language, translations } from '../lib/translations';

interface PaymentGatewaysBarProps {
  lang: Language;
}

export const PaymentGatewaysBar: React.FC<PaymentGatewaysBarProps> = ({ lang }) => {
  const t = translations[lang];

  return (
    <section className="relative w-full border-y border-neutral-800/80 bg-[#060609] py-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
          <div>
            <div className="flex items-center gap-2 text-xs font-['Russo_One',sans-serif] uppercase tracking-wider text-[#FFB800]">
              <Flame className="h-3.5 w-3.5 fill-current" />
              <span>{t.instantActivation}</span>
              <span className="text-neutral-600">·</span>
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
              <span className="text-neutral-400 font-sans">০% এক্সট্রা চার্জ</span>
            </div>
            <h2 className="mt-1 text-lg font-bold text-white sm:text-xl font-sans">
              সহজ ও দ্রুততম ওয়ালেট রিচার্জ গেটওয়ে
            </h2>
            <p className="mt-0.5 text-xs text-neutral-400 sm:text-sm font-sans">
              বিকাশ, নগদ, রকেট, উপায় ও ভিসা/মাস্টারকার্ডের মাধ্যমে কোনো বাড়তি খরচ ছাড়াই সেকেন্ডে ব্যালেন্স যুক্ত করুন।
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="inline-flex items-center rounded-lg border border-[#FFB800]/30 bg-[#FFB800]/10 px-3 py-1.5 text-xs font-bold text-[#FFB800] font-['Russo_One',sans-serif]">
              ২৪/৭ অটোমেশন
            </span>
          </div>
        </div>

        {/* Payment Provider Cards - matching image.png visual style with gaming matte borders */}
        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4 md:grid-cols-7">
          {/* bKash */}
          <div className="group flex h-14 items-center justify-center rounded-xl border border-pink-500/30 bg-[#0e0e14] p-2.5 shadow-sm transition-all hover:border-pink-500 hover:bg-[#14141e]">
            <div className="flex items-center gap-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-pink-600 to-rose-600 text-xs font-bold text-white shadow-sm">
                b
              </span>
              <div className="flex flex-col">
                <span className="font-bold text-pink-500 text-sm tracking-tight font-sans">bKash</span>
                <span className="text-[9px] text-neutral-400 leading-none">বিকাশ পার্সোনাল</span>
              </div>
            </div>
          </div>

          {/* Rocket */}
          <div className="group flex h-14 items-center justify-center rounded-xl border border-purple-500/30 bg-[#0e0e14] p-2.5 shadow-sm transition-all hover:border-purple-500 hover:bg-[#14141e]">
            <div className="flex items-center gap-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-purple-700 text-xs font-extrabold text-white">
                R
              </span>
              <div className="flex flex-col">
                <span className="font-bold text-purple-400 text-sm tracking-tight font-sans">রকেট</span>
                <span className="text-[9px] text-neutral-400 leading-none">DBBL Rocket</span>
              </div>
            </div>
          </div>

          {/* Nagad */}
          <div className="group flex h-14 items-center justify-center rounded-xl border border-amber-500/30 bg-[#0e0e14] p-2.5 shadow-sm transition-all hover:border-amber-500 hover:bg-[#14141e]">
            <div className="flex items-center gap-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-amber-500 to-orange-600 text-xs font-extrabold text-white">
                ন
              </span>
              <div className="flex flex-col">
                <span className="font-bold text-amber-400 text-sm tracking-tight font-sans">নগদ</span>
                <span className="text-[9px] text-neutral-400 leading-none">Nagad Auto</span>
              </div>
            </div>
          </div>

          {/* Upay */}
          <div className="group flex h-14 items-center justify-center rounded-xl border border-sky-500/30 bg-[#0e0e14] p-2.5 shadow-sm transition-all hover:border-sky-500 hover:bg-[#14141e]">
            <div className="flex items-center gap-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-md bg-sky-600 text-xs font-black text-amber-300">
                U
              </span>
              <div className="flex flex-col">
                <span className="font-bold text-sky-400 text-sm tracking-tight font-sans">উপায়</span>
                <span className="text-[9px] text-neutral-400 leading-none">Upay UCB</span>
              </div>
            </div>
          </div>

          {/* Mastercard */}
          <div className="group flex h-14 items-center justify-center rounded-xl border border-rose-500/30 bg-[#0e0e14] p-2.5 shadow-sm transition-all hover:border-rose-500 hover:bg-[#14141e]">
            <div className="flex items-center gap-2">
              <div className="flex -space-x-2">
                <div className="h-5 w-5 rounded-full bg-red-600/90"></div>
                <div className="h-5 w-5 rounded-full bg-amber-500/90 mix-blend-screen"></div>
              </div>
              <div className="flex flex-col">
                <span className="font-semibold text-neutral-200 text-xs tracking-tight font-sans">Mastercard</span>
                <span className="text-[9px] text-neutral-400 leading-none">Debit / Credit</span>
              </div>
            </div>
          </div>

          {/* VISA */}
          <div className="group flex h-14 items-center justify-center rounded-xl border border-blue-500/30 bg-[#0e0e14] p-2.5 shadow-sm transition-all hover:border-blue-500 hover:bg-[#14141e]">
            <div className="flex items-center gap-2">
              <span className="font-extrabold italic text-blue-400 text-base tracking-tighter">
                VISA
              </span>
              <div className="flex flex-col">
                <span className="text-[9px] text-neutral-400 leading-none">Instant Pay</span>
              </div>
            </div>
          </div>

          {/* City Bank / BRAC */}
          <div className="group flex h-14 items-center justify-center rounded-xl border border-emerald-500/30 bg-[#0e0e14] p-2.5 shadow-sm transition-all hover:border-emerald-500 hover:bg-[#14141e]">
            <div className="flex items-center gap-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-md bg-emerald-800 text-[10px] font-bold text-white">
                IB
              </span>
              <div className="flex flex-col">
                <span className="font-bold text-emerald-400 text-xs tracking-tight font-sans">ব্যাংক</span>
                <span className="text-[9px] text-neutral-400 leading-none">City / BRAC</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
