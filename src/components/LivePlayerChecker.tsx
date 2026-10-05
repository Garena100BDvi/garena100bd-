import React, { useState } from 'react';
import { Play, Copy, Check, Shield, Zap, AlertCircle, Clock } from 'lucide-react';
import { FreeFireIcon } from './FreeFireIcon';
import { apiClient } from '../lib/apiClient';
import { PlayerData } from '../types';
import { Language } from '../lib/translations';

interface LivePlayerCheckerProps {
  lang: Language;
}

export const LivePlayerChecker: React.FC<LivePlayerCheckerProps> = () => {
  const [testUid, setTestUid] = useState('3588707062');
  const [loading, setLoading] = useState(false);
  const [playerResult, setPlayerResult] = useState<PlayerData | null>({
    uid: '3588707062',
    name: 'FB: @GMRemyX',
    level: 69,
    region: 'BD',
    cached: true
  });
  const [latency, setLatency] = useState<number>(142);
  const [viewMode, setViewMode] = useState<'card' | 'json'>('card');
  const [copied, setCopied] = useState(false);
  const [copiedUid, setCopiedUid] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleRunCheck = async (uidToCheck?: string) => {
    const targetUid = uidToCheck || testUid;
    if (!targetUid.trim()) return;

    setLoading(true);
    setErrorMsg(null);
    const start = performance.now();

    try {
      const res = await apiClient.checkPlayerPublic(targetUid.trim());
      const end = performance.now();
      setLatency(Math.round(end - start));

      if (res.status && res.data) {
        setPlayerResult(res.data);
      } else {
        setErrorMsg(res.message || res.error || 'Failed to verify player UID. Please ensure the UID is correct.');
      }
    } catch {
      setErrorMsg('Server connection timeout. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopyJson = () => {
    if (!playerResult) return;
    navigator.clipboard.writeText(JSON.stringify(playerResult, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCopyUid = (uid: string) => {
    navigator.clipboard.writeText(uid);
    setCopiedUid(true);
    setTimeout(() => setCopiedUid(false), 2000);
  };

  return (
    <section className="py-8 sm:py-12 bg-[#08080c]/80 backdrop-blur-sm border-b border-neutral-800/80">
      <div className="mx-auto max-w-7xl px-3 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-3 mb-6">
          <div>
            <div className="inline-flex items-center gap-1.5 text-[11px] sm:text-xs font-bold uppercase tracking-widest text-[#FFB800] font-['Russo_One',sans-serif]">
              <FreeFireIcon className="h-3.5 w-3.5 fill-current text-[#FFB800]" />
              <span>LIVE GARENA FF HUD · REAL-TIME VERIFIER</span>
            </div>
            <h2 className="mt-1 text-xl sm:text-2xl lg:text-3xl font-black text-white font-sans tracking-tight">
              Instant Free Fire Player UID & Name Verification
            </h2>
            <p className="mt-0.5 text-xs text-neutral-400 font-sans">
              Enter any Free Fire player UID below to fetch verified in-game nickname, level, and regional server data in real-time.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="rounded-lg border border-neutral-800 bg-[#0e0e14] px-3 py-1 font-mono text-[11px] text-neutral-300">
              GATEWAY STATUS: <strong className="text-emerald-400">ONLINE (24/7)</strong>
            </span>
          </div>
        </div>

        {/* Checker Console Card */}
        <div className="rounded-2xl border border-neutral-800 bg-[#0d0d14]/90 p-4 sm:p-6 shadow-2xl backdrop-blur-xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6 items-start">
            
            {/* Left: Input Box */}
            <div className="lg:col-span-5 space-y-3">
              <div>
                <label className="block text-[11px] sm:text-xs font-['Russo_One',sans-serif] uppercase tracking-wider text-neutral-400 mb-1.5">
                  PLAYER UID
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={testUid}
                    onChange={(e) => setTestUid(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleRunCheck()}
                    placeholder="e.g. 3588707062"
                    className="w-full rounded-xl border border-neutral-700 bg-black px-3.5 py-2.5 font-mono text-sm text-[#FFB800] placeholder-neutral-600 focus:border-[#FFB800] focus:outline-none focus:ring-1 focus:ring-[#FFB800]"
                  />
                  <button
                    onClick={() => handleRunCheck()}
                    disabled={loading}
                    className="flex items-center gap-1.5 rounded-xl bg-[#FFB800] hover:bg-[#FFA500] px-4 sm:px-5 py-2.5 text-xs font-['Russo_One',sans-serif] tracking-wider text-black transition-all shadow-[0_0_12px_rgba(255,184,0,0.35)] active:scale-95 disabled:opacity-50 whitespace-nowrap font-bold uppercase shrink-0"
                  >
                    {loading ? (
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-black border-t-transparent" />
                    ) : (
                      <Play className="h-3.5 w-3.5 fill-current" />
                    )}
                    <span>VERIFY</span>
                  </button>
                </div>
              </div>

              <div className="text-[11px] text-neutral-400 font-mono space-y-0.5">
                <div>Rate: <span className="text-emerald-400 font-bold">৳0.05 / Check</span> · Response Latency: <span className="text-white">~140ms</span></div>
              </div>
            </div>

            {/* Right: Live Result Display */}
            <div className="lg:col-span-7">
              <div className="rounded-xl border border-neutral-800 bg-[#07070a] p-3.5 sm:p-4">
                
                {/* Header Row: Status + Mode Switcher */}
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-neutral-800/80 pb-2.5 mb-3">
                  <div className="flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="font-mono text-xs font-semibold text-emerald-400">
                      HTTP 200 OK · {latency}ms
                    </span>
                  </div>

                  <div className="flex items-center gap-1 font-['Russo_One',sans-serif] text-[10px] sm:text-xs">
                    <button
                      onClick={() => setViewMode('card')}
                      className={`px-2.5 py-1 rounded-md transition-colors uppercase ${
                        viewMode === 'card'
                          ? 'bg-[#FFB800] text-black font-bold'
                          : 'text-neutral-400 hover:text-white bg-neutral-900 border border-neutral-800'
                      }`}
                    >
                      VISUAL CARD
                    </button>
                    <button
                      onClick={() => setViewMode('json')}
                      className={`px-2.5 py-1 rounded-md transition-colors uppercase ${
                        viewMode === 'json'
                          ? 'bg-[#FFB800] text-black font-bold'
                          : 'text-neutral-400 hover:text-white bg-neutral-900 border border-neutral-800'
                      }`}
                    >
                      RAW JSON
                    </button>
                  </div>
                </div>

                {errorMsg && (
                  <div className="rounded-xl border border-rose-500/30 bg-rose-950/30 p-3 text-xs text-rose-300 flex items-center gap-2">
                    <AlertCircle className="h-4 w-4 shrink-0 text-rose-400" />
                    <span>{errorMsg}</span>
                  </div>
                )}

                {playerResult && !errorMsg && (
                  <div>
                    {viewMode === 'card' ? (
                      <div className="space-y-3">
                        
                        {/* Player Card Body */}
                        <div className="rounded-xl border border-neutral-800 bg-[#0e0e14] p-3 sm:p-4">
                          <div className="flex items-start gap-3">
                            {/* Level Badge Icon */}
                            <div className="flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-xl bg-gradient-to-br from-[#FFB800] via-[#FF7700] to-[#E60000] p-0.5 shadow-md shrink-0">
                              <div className="flex h-full w-full items-center justify-center rounded-[10px] bg-black font-['Russo_One',sans-serif] font-bold text-base sm:text-lg text-[#FFB800]">
                                L{playerResult.level}
                              </div>
                            </div>

                            {/* Name & Badge Column */}
                            <div className="min-w-0 flex-1 space-y-1">
                              <div className="flex flex-wrap items-center justify-between gap-1.5">
                                <h3 className="font-mono text-base sm:text-lg font-bold text-white tracking-wide truncate max-w-[190px] sm:max-w-none">
                                  {playerResult.name}
                                </h3>
                                <span className="rounded bg-[#FFB800]/20 px-2 py-0.5 text-[9px] font-['Russo_One',sans-serif] text-[#FFB800] border border-[#FFB800]/40 uppercase tracking-wider shrink-0">
                                  VERIFIED FF
                                </span>
                              </div>

                              {/* Metadata Badges Row */}
                              <div className="flex flex-wrap items-center gap-2 pt-0.5 text-[11px] font-mono">
                                <div className="flex items-center gap-1 bg-black px-2 py-0.5 rounded border border-neutral-800">
                                  <span className="text-neutral-400">UID:</span>
                                  <span className="text-[#FFB800] font-bold">{playerResult.uid}</span>
                                  <button
                                    onClick={() => handleCopyUid(playerResult.uid)}
                                    className="text-neutral-500 hover:text-white ml-0.5"
                                    title="Copy UID"
                                  >
                                    {copiedUid ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />}
                                  </button>
                                </div>

                                <div className="bg-black px-2 py-0.5 rounded border border-neutral-800">
                                  <span className="text-neutral-400">Level:</span> <strong className="text-white">{playerResult.level}</strong>
                                </div>

                                <div className="bg-black px-2 py-0.5 rounded border border-neutral-800">
                                  <span className="text-neutral-400">Region:</span> <strong className="text-emerald-400">{playerResult.region}</strong>
                                </div>
                              </div>
                            </div>
                          </div>

                        </div>

                        {/* Bottom Bar: Source + Copy JSON */}
                        <div className="flex items-center justify-between text-[11px] text-neutral-400 font-mono pt-1">
                          <span className="truncate max-w-[200px] sm:max-w-none">
                            Source: {playerResult.cached ? 'Memory Cache' : 'Live Gateway Query'}
                          </span>
                          <button
                            onClick={handleCopyJson}
                            className="flex items-center gap-1 rounded bg-neutral-900 border border-neutral-800 px-2.5 py-1 text-[#FFB800] hover:text-white hover:border-[#FFB800] transition-colors whitespace-nowrap shrink-0"
                          >
                            {copied ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />}
                            <span>{copied ? 'Copied' : 'Copy JSON'}</span>
                          </button>
                        </div>

                      </div>
                    ) : (
                      <div className="relative">
                        <button
                          onClick={handleCopyJson}
                          className="absolute right-2.5 top-2.5 flex items-center gap-1 rounded bg-neutral-900 px-2 py-1 text-[11px] text-[#FFB800] hover:text-white border border-neutral-800"
                        >
                          {copied ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />}
                          <span>{copied ? 'Copied' : 'Copy'}</span>
                        </button>
                        <pre className="overflow-x-auto rounded-lg bg-black p-3.5 font-mono text-[11px] text-emerald-400 leading-relaxed max-h-48">
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
