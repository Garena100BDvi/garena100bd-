import React, { useState } from 'react';
import { Shield, Sparkles, ArrowRight, CheckCircle2, Clock, Copy, Check, Terminal, Play, Flame, Server } from 'lucide-react';
import { Language, translations } from '../lib/translations';
import { apiClient } from '../lib/apiClient';
import { PlayerData } from '../types';

interface HeroProps {
  lang: Language;
  onOpenAuth: (mode: 'login' | 'register') => void;
  onGoPlayground: () => void;
  onGoDocs: () => void;
}

export const Hero: React.FC<HeroProps> = ({
  lang,
  onOpenAuth,
  onGoPlayground,
  onGoDocs
}) => {
  const t = translations[lang];
  const [testUid, setTestUid] = useState('12345678');
  const [loading, setLoading] = useState(false);
  const [playerResult, setPlayerResult] = useState<PlayerData | null>({
    uid: '12345678',
    name: 'FB:ㅤ@GMRemyX',
    level: 69,
    region: 'BD',
    cached: true
  });
  const [latency, setLatency] = useState<number>(142);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'card' | 'json'>('card');
  const [copiedJson, setCopiedJson] = useState(false);

  const sampleUids = [
    { label: 'Prompt UID (12345678)', uid: '12345678' },
    { label: 'Pro Player (2074315264)', uid: '2074315264' },
    { label: 'BD Esports (1589320147)', uid: '1589320147' }
  ];

  const handleRunCheck = async (uidToTest = testUid) => {
    if (!uidToTest.trim()) return;
    setLoading(true);
    setErrorMsg(null);

    const startTime = Date.now();
    const result = await apiClient.checkPlayerPublic(uidToTest.trim());
    setLoading(false);
    setLatency(result.latency_ms || Math.max(120, Date.now() - startTime));

    if (result.status && result.data) {
      setPlayerResult(result.data);
    } else {
      setErrorMsg(result.error || 'Failed to fetch player data');
    }
  };

  const handleCopyJson = () => {
    if (!playerResult) return;
    navigator.clipboard.writeText(JSON.stringify(playerResult, null, 2));
    setCopiedJson(true);
    setTimeout(() => setCopiedJson(false), 2000);
  };

  return (
    <section className="relative overflow-hidden pt-8 pb-16 lg:pt-14 lg:pb-24">
      {/* Background Glow Mesh */}
      <div className="pointer-events-none absolute inset-0 -z-10 flex items-center justify-center opacity-30">
        <div className="h-[480px] w-[600px] rounded-full bg-gradient-to-tr from-cyan-600/30 to-blue-600/20 blur-[120px]" />
        <div className="h-[300px] w-[400px] rounded-full bg-gradient-to-br from-rose-500/20 to-amber-500/10 blur-[100px]" />
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-12 lg:gap-8">
          
          {/* Left Column: Hero Text & Pitch */}
          <div className="lg:col-span-6 space-y-6">
            {/* Trust badge */}
            <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-950/40 px-3.5 py-1 text-xs font-medium text-cyan-300 backdrop-blur-sm">
              <Shield className="h-3.5 w-3.5 text-cyan-400" />
              <span>{t.heroBadge}</span>
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
            </div>

            {/* Main Headline */}
            <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl lg:text-5xl" style={{ textWrap: 'balance' }}>
              {t.heroTitle}
            </h1>

            {/* Subtitle */}
            <p className="text-base text-slate-300 sm:text-lg leading-relaxed">
              {t.heroSubtitle}
            </p>

            {/* Bullet Proof Points */}
            <div className="grid grid-cols-2 gap-3 pt-1 text-xs sm:text-sm text-slate-300">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                <span>৯৯.৯৮% আপটাইম গ্যারান্টি</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                <span>গড় রেসপন্স মাত্র ১৪০ মিলিসেকেন্ড</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                <span>ওয়ার্ডপ্রেস ও পিএইচপি রেডি</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                <span>বিকাশ/নগদ অটো রিচার্জ</span>
              </div>
            </div>

            {/* Primary Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={() => onOpenAuth('register')}
                className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 via-cyan-400 to-blue-600 px-6 py-3 text-sm font-bold text-slate-950 shadow-lg shadow-cyan-500/25 hover:from-cyan-400 hover:to-blue-500 transition-all hover:scale-[1.02]"
              >
                <span>{t.heroBtnStart}</span>
                <ArrowRight className="h-4 w-4" />
              </button>

              <button
                onClick={onGoDocs}
                className="flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-900/80 px-5 py-3 text-sm font-semibold text-slate-200 hover:border-slate-600 hover:bg-slate-800 transition-colors"
              >
                <Terminal className="h-4 w-4 text-cyan-400" />
                <span>{t.heroBtnDocs}</span>
              </button>
            </div>

            {/* Developer Trust Indicator */}
            <div className="flex items-center gap-4 pt-3 border-t border-slate-800/80 text-xs text-slate-400">
              <div className="flex items-center gap-1.5 font-mono">
                <Server className="h-3.5 w-3.5 text-cyan-400" />
                <span className="text-white font-semibold tabular-nums">৩৮০+</span>
                <span>অ্যাক্টিভ টপআপ শপ</span>
              </div>
              <span>·</span>
              <div className="font-mono">
                <span className="text-white font-semibold tabular-nums">১,৮০,০০০+</span>
                <span>চেক সম্পন্ন</span>
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Live Garena UID Checker Terminal */}
          <div className="lg:col-span-6">
            <div className="relative rounded-2xl border border-slate-800 bg-slate-900/90 p-5 shadow-2xl backdrop-blur-xl ring-1 ring-white/10 sm:p-6">
              
              {/* Terminal Header */}
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <div className="flex space-x-1.5">
                    <div className="h-3 w-3 rounded-full bg-rose-500/80" />
                    <div className="h-3 w-3 rounded-full bg-amber-500/80" />
                    <div className="h-3 w-3 rounded-full bg-emerald-500/80" />
                  </div>
                  <span className="font-mono text-xs text-slate-400 pl-2">
                    garena://player-lookup-v1
                  </span>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => setViewMode('card')}
                    className={`rounded px-2 py-0.5 text-[11px] font-medium transition-colors ${
                      viewMode === 'card'
                        ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    Visual Card
                  </button>
                  <button
                    onClick={() => setViewMode('json')}
                    className={`rounded px-2 py-0.5 text-[11px] font-medium transition-colors ${
                      viewMode === 'json'
                        ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    Raw JSON
                  </button>
                </div>
              </div>

              {/* UID Input Bar */}
              <div className="mt-4">
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                  {t.heroInstantCheck}
                </label>
                <div className="flex items-center gap-2">
                  <div className="relative flex-1">
                    <input
                      type="text"
                      value={testUid}
                      onChange={(e) => setTestUid(e.target.value)}
                      placeholder={t.heroEnterUid}
                      className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-2.5 font-mono text-sm text-cyan-300 placeholder-slate-500 focus:border-cyan-400 focus:outline-none focus:ring-1 focus:ring-cyan-400"
                    />
                  </div>
                  <button
                    onClick={() => handleRunCheck()}
                    disabled={loading}
                    className="flex items-center gap-2 rounded-xl bg-cyan-500 px-4 py-2.5 text-xs font-bold text-slate-950 hover:bg-cyan-400 transition-colors disabled:opacity-50 whitespace-nowrap shadow-sm shadow-cyan-500/20"
                  >
                    {loading ? (
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-slate-950 border-t-transparent" />
                    ) : (
                      <Play className="h-3.5 w-3.5 fill-current" />
                    )}
                    <span>{t.heroCheckBtn}</span>
                  </button>
                </div>

                {/* Sample UIDs */}
                <div className="mt-2.5 flex flex-wrap items-center gap-1.5 text-xs">
                  <span className="text-slate-500 text-[11px]">{t.heroSampleUidHint}</span>
                  {sampleUids.map((s) => (
                    <button
                      key={s.uid}
                      onClick={() => {
                        setTestUid(s.uid);
                        handleRunCheck(s.uid);
                      }}
                      className="rounded-md border border-slate-800 bg-slate-950/80 px-2 py-0.5 font-mono text-[11px] text-cyan-400 hover:border-cyan-500/40 hover:bg-slate-800 transition-colors"
                    >
                      {s.uid}
                    </button>
                  ))}
                </div>
              </div>

              {/* Result Area */}
              <div className="mt-5">
                {errorMsg && (
                  <div className="rounded-xl border border-rose-500/30 bg-rose-950/30 p-3 text-xs text-rose-300">
                    {errorMsg}
                  </div>
                )}

                {playerResult && !errorMsg && (
                  <div>
                    {viewMode === 'card' ? (
                      /* Styled Gaming Card */
                      <div className="relative overflow-hidden rounded-xl border border-slate-800 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-4">
                        {/* Status bar */}
                        <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
                          <div className="flex items-center gap-2">
                            <span className="relative flex h-2.5 w-2.5">
                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                            </span>
                            <span className="text-xs font-semibold text-emerald-400">
                              {t.playerFound}
                            </span>
                          </div>

                          <div className="flex items-center gap-2 text-[11px] font-mono text-slate-400">
                            <Clock className="h-3 w-3 text-cyan-400" />
                            <span className="tabular-nums">{latency}ms</span>
                            <span className="text-slate-600">·</span>
                            <span className="text-cyan-400">{t.statusLive}</span>
                          </div>
                        </div>

                        {/* Player details */}
                        <div className="mt-4 grid grid-cols-12 gap-3 items-center">
                          {/* Player Avatar Badge */}
                          <div className="col-span-3 sm:col-span-2">
                            <div className="flex h-14 w-14 sm:h-16 sm:w-16 items-center justify-center rounded-xl bg-gradient-to-tr from-amber-500 via-rose-600 to-purple-600 p-0.5 shadow-md">
                              <div className="flex h-full w-full items-center justify-center rounded-[10px] bg-slate-950 font-mono font-bold text-lg text-amber-400">
                                L{playerResult.level}
                              </div>
                            </div>
                          </div>

                          {/* Player Name and UID */}
                          <div className="col-span-9 sm:col-span-10 pl-2">
                            <div className="flex items-center gap-2">
                              <h3 className="font-mono text-base sm:text-lg font-bold text-white tracking-wide">
                                {playerResult.name}
                              </h3>
                              <span className="rounded bg-rose-500/20 px-1.5 py-0.5 text-[10px] font-bold text-rose-400 border border-rose-500/30 uppercase">
                                Verified
                              </span>
                            </div>

                            <div className="mt-1.5 flex flex-wrap items-center gap-3 text-xs text-slate-400 font-mono">
                              <div>
                                <span className="text-slate-500">{t.playerUid}: </span>
                                <span className="text-cyan-300 font-semibold">{playerResult.uid}</span>
                              </div>
                              <span>·</span>
                              <div>
                                <span className="text-slate-500">{t.playerLevel}: </span>
                                <span className="text-amber-400 font-semibold">{playerResult.level}</span>
                              </div>
                              <span>·</span>
                              <div>
                                <span className="text-slate-500">{t.playerRegion}: </span>
                                <span className="text-emerald-400 font-semibold">{playerResult.region}</span>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Code generator hint */}
                        <div className="mt-4 flex items-center justify-between rounded-lg bg-slate-900/90 px-3 py-2 text-[11px] text-slate-400 font-mono">
                          <span className="truncate">GET /api/v1/player?uid={playerResult.uid}&key=YOUR_KEY</span>
                          <button
                            onClick={handleCopyJson}
                            className="flex items-center gap-1 text-cyan-400 hover:text-cyan-300 transition-colors ml-2 shrink-0"
                          >
                            {copiedJson ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />}
                            <span>{copiedJson ? 'Copied' : 'JSON'}</span>
                          </button>
                        </div>
                      </div>
                    ) : (
                      /* Raw JSON Viewer */
                      <div className="relative rounded-xl border border-slate-800 bg-slate-950 p-4 font-mono text-xs">
                        <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-2">
                          <span className="text-slate-500">HTTP 200 OK · application/json</span>
                          <button
                            onClick={handleCopyJson}
                            className="flex items-center gap-1 text-cyan-400 hover:text-cyan-300 text-xs"
                          >
                            {copiedJson ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                            <span>{copiedJson ? 'কপি হয়েছে' : 'Copy'}</span>
                          </button>
                        </div>
                        <pre className="text-emerald-400 overflow-x-auto max-h-48 leading-relaxed">
                          {JSON.stringify(playerResult, null, 2)}
                        </pre>
                      </div>
                    )}
                  </div>
                )}
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
