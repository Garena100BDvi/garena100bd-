import React, { useState, useEffect } from 'react';
import { 
  Play, Copy, Check, Terminal, Shield, RefreshCw, Send, 
  AlertCircle, CheckCircle, Lock, Zap, ShieldCheck, Clock
} from 'lucide-react';
import { Language } from '../lib/translations';
import { apiClient } from '../lib/apiClient';
import { User } from '../types';

interface LivePlaygroundProps {
  lang: Language;
  currentUser: User | null;
  onOpenAuth?: () => void;
}

export const LivePlayground: React.FC<LivePlaygroundProps> = ({ currentUser }) => {
  const [uid, setUid] = useState('3588707062');
  const [keyMode, setKeyMode] = useState<'sandbox' | 'custom'>('sandbox');
  const [customKey, setCustomKey] = useState(currentUser?.primaryApiKey || '');
  
  // Real-time 1-second rotating sandbox token
  const [sandboxToken, setSandboxToken] = useState<string>('sbx_syncing...');
  const [isRotatingPulse, setIsRotatingPulse] = useState(false);
  
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<any>({
    status: true,
    request_id: 'SBX-LIVE01',
    sandbox: true,
    anti_capture_verified: true,
    token_type: 'ephemeral_1s_nonce',
    cached: true,
    latency_ms: 138,
    uid: '3588707062',
    name: 'FB: @GMRemyX',
    level: 69,
    region: 'BD',
    cost_deducted: 0.00,
    balance_remaining: 150.00
  });
  const [activeTab, setActiveTab] = useState<'curl' | 'php' | 'js' | 'python'>('curl');
  const [copied, setCopied] = useState(false);

  // Sync customKey if currentUser changes
  useEffect(() => {
    if (currentUser?.primaryApiKey) {
      setCustomKey(currentUser.primaryApiKey);
    }
  }, [currentUser]);

  // 1-Second Dynamic Token Auto-Rotation Loop
  useEffect(() => {
    let isMounted = true;

    const fetchToken = async () => {
      try {
        const res = await apiClient.getSandboxToken();
        if (isMounted && res.status && res.token) {
          setSandboxToken(res.token);
          setIsRotatingPulse(true);
          setTimeout(() => {
            if (isMounted) setIsRotatingPulse(false);
          }, 350);
        }
      } catch {
        // Fallback
      }
    };

    fetchToken();

    // Auto-rotates every 1000ms (1 second)
    const interval = setInterval(() => {
      fetchToken();
    }, 1000);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  const activeKey = keyMode === 'sandbox' ? sandboxToken : (customKey || sandboxToken);

  const handleExecute = async () => {
    if (!uid.trim()) return;
    setLoading(true);

    let keyToUse = activeKey;
    // If sandbox mode, ensure we fetch the fresh 1-second token right before execution to prevent latency expiry
    if (keyMode === 'sandbox') {
      try {
        const fresh = await apiClient.getSandboxToken();
        if (fresh.status && fresh.token) {
          keyToUse = fresh.token;
          setSandboxToken(fresh.token);
        }
      } catch {
        // use activeKey
      }
    }

    const res = await apiClient.checkPlayerWithKey(uid.trim(), keyToUse);
    setLoading(false);
    setResponse(res);
  };

  const getCurlSnippet = () => {
    const host = window.location.origin;
    return `# Auto-rotating ephemeral key (rotates every 1 sec, single-use anti-scrape nonce)
curl -X GET "${host}/api/v1/player?uid=${uid}&key=${activeKey}" \\
  -H "Accept: application/json" \\
  -H "X-Requested-With: GarenaGatewaySandbox"`;
  };

  const getPhpSnippet = () => {
    const host = window.location.origin;
    return `<?php
// GARENA API GATEWAY - Sandbox Request
// NOTE: Sandbox tokens rotate every 1 sec. For websites/bots, use your permanent Sub-API key.
$uid = "${uid}";
$apiKey = "${activeKey}";
$url = "${host}/api/v1/player?uid=" . urlencode($uid) . "&key=" . urlencode($apiKey);

$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, $url);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    "Accept: application/json",
    "X-Requested-With: GarenaGatewaySandbox"
]);
$response = curl_exec($ch);
curl_close($ch);

$result = json_decode($response, true);
if ($result && $result['status']) {
    echo "Player: " . $result['name'] . " (Lv " . $result['level'] . ", " . $result['region'] . ")\\n";
} else {
    echo "Error: " . ($result['message'] ?? 'Query failed');
}
?>`;
  };

  const getJsSnippet = () => {
    const host = window.location.origin;
    return `// Garena API Gateway - Real-time Node.js / Fetch
async function testPlayerQuery(uid, key) {
  const url = \`${host}/api/v1/player?uid=\${encodeURIComponent(uid)}&key=\${encodeURIComponent(key)}\`;
  const response = await fetch(url, {
    headers: { 'X-Requested-With': 'GarenaGatewaySandbox' }
  });
  const data = await response.json();
  
  if (data.status) {
    console.log('Player Verified:', data.name, 'Level:', data.level);
  } else {
    console.error('API Error:', data.message);
  }
}

testPlayerQuery("${uid}", "${activeKey}");`;
  };

  const getPythonSnippet = () => {
    const host = window.location.origin;
    return `import requests

# Garena Official API Sandbox
url = "${host}/api/v1/player"
params = {
    "uid": "${uid}",
    "key": "${activeKey}"
}
headers = { "X-Requested-With": "GarenaGatewaySandbox" }

response = requests.get(url, params=params, headers=headers)
data = response.json()

if data.get("status"):
    print(f"Verified: {data['name']} (Level {data['level']})")
else:
    print(f"Failed: {data.get('message')}")`;
  };

  const getCurrentSnippet = () => {
    switch (activeTab) {
      case 'curl': return getCurlSnippet();
      case 'php': return getPhpSnippet();
      case 'js': return getJsSnippet();
      case 'python': return getPythonSnippet();
    }
  };

  const copySnippet = () => {
    navigator.clipboard.writeText(getCurrentSnippet());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section className="py-12 bg-[#06060a] border-b border-neutral-800/80">
      <div className="mx-auto max-w-7xl px-3 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-neutral-800 pb-6">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#FFB800] font-['Russo_One',sans-serif]">
              <Terminal className="h-3.5 w-3.5" />
              <span>INTERACTIVE API SANDBOX · REAL-TIME VERIFIER</span>
            </div>
            <h2 className="mt-1 text-2xl font-bold text-white sm:text-3xl font-sans">
              Official Sub-API Console & Sandbox
            </h2>
            <p className="mt-1 text-xs sm:text-sm text-neutral-400">
              Test live player UID verification, response latency, and cryptographic payload protection in real time.
            </p>
          </div>

          {/* Anti-Capture Security Badges */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-500/30 bg-emerald-950/20 px-3 py-1 font-mono text-xs text-emerald-400">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
              <span>ANTI-CAPTURE SHIELD</span>
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-lg border border-[#FFB800]/30 bg-[#FFB800]/10 px-3 py-1 font-mono text-xs text-[#FFB800]">
              <Clock className="h-3.5 w-3.5 text-[#FFB800]" />
              <span>1s ROTATION</span>
            </span>
          </div>
        </div>

        {/* Playground Grid */}
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Controls Column */}
          <div className="lg:col-span-5 space-y-5">
            <div className="rounded-2xl border border-neutral-800 bg-[#0d0d14] p-5 shadow-xl">
              
              {/* Header of Configuration Card */}
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-neutral-800">
                <h3 className="text-sm font-bold text-white font-['Russo_One',sans-serif] uppercase tracking-wide">
                  Request Configuration
                </h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-neutral-900 border border-neutral-800 text-neutral-400">
                  HTTP GET / REST
                </span>
              </div>

              {/* Endpoint Display */}
              <div className="space-y-1.5 mb-4">
                <label className="text-[11px] font-mono text-neutral-400 uppercase tracking-wider">Gateway Endpoint</label>
                <div className="rounded-lg bg-black p-2.5 font-mono text-xs text-cyan-400 border border-neutral-800 overflow-x-auto flex items-center justify-between">
                  <span>/api/v1/player</span>
                  <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950/50 px-1.5 py-0.5 rounded">ONLINE</span>
                </div>
              </div>

              {/* Target UID */}
              <div className="space-y-1.5 mb-4">
                <div className="flex items-center justify-between">
                  <label className="text-[11px] font-mono text-neutral-400 uppercase tracking-wider">
                    Query Parameter: <span className="text-white font-bold">uid</span>
                  </label>
                  <span className="text-[10px] text-neutral-500 font-mono">6 - 14 digits</span>
                </div>
                <input
                  type="text"
                  value={uid}
                  onChange={(e) => setUid(e.target.value)}
                  placeholder="e.g. 3588707062"
                  className="w-full rounded-lg border border-neutral-700 bg-black px-3.5 py-2 font-mono text-xs text-white placeholder-neutral-500 focus:border-[#FFB800] focus:outline-none transition-colors"
                />
              </div>

              {/* API Key Mode Selector */}
              <div className="space-y-2 mb-4">
                <div className="flex items-center justify-between">
                  <label className="text-[11px] font-mono text-neutral-400 uppercase tracking-wider">
                    Query Parameter: <span className="text-white font-bold">key</span>
                  </label>
                  {currentUser && (
                    <div className="flex items-center gap-1 text-[11px]">
                      <button
                        type="button"
                        onClick={() => setKeyMode('sandbox')}
                        className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold transition-colors ${
                          keyMode === 'sandbox' 
                            ? 'bg-[#FFB800] text-black' 
                            : 'bg-neutral-800 text-neutral-400 hover:text-white'
                        }`}
                      >
                        1s Dynamic Key
                      </button>
                      <button
                        type="button"
                        onClick={() => setKeyMode('custom')}
                        className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold transition-colors ${
                          keyMode === 'custom' 
                            ? 'bg-[#FFB800] text-black' 
                            : 'bg-neutral-800 text-neutral-400 hover:text-white'
                        }`}
                      >
                        My Sub-Key
                      </button>
                    </div>
                  )}
                </div>

                {/* DYNAMIC SANDBOX KEY (Auto-rotating every 1s, Locked against tampering) */}
                {keyMode === 'sandbox' ? (
                  <div className="space-y-2">
                    <div className="relative">
                      <div className="absolute left-3 top-2.5 text-emerald-400">
                        <Lock className="h-4 w-4" />
                      </div>
                      <input
                        type="text"
                        readOnly
                        value={sandboxToken}
                        className={`w-full rounded-lg border bg-black/90 pl-9 pr-24 py-2 font-mono text-xs transition-all cursor-not-allowed select-all ${
                          isRotatingPulse 
                            ? 'border-emerald-400 shadow-[0_0_12px_rgba(52,211,153,0.3)] text-emerald-300' 
                            : 'border-neutral-800 text-emerald-400'
                        }`}
                        title="This key is cryptographically signed and changes every second. Tampering or editing is disabled to protect against unauthorized scraping."
                      />
                      <div className="absolute right-2.5 top-2 flex items-center gap-1.5">
                        <span className={`inline-block h-2 w-2 rounded-full ${isRotatingPulse ? 'bg-emerald-300 scale-125' : 'bg-emerald-500'} transition-transform duration-200 animate-pulse`} />
                        <span className="text-[10px] font-mono font-bold text-emerald-400 uppercase tracking-tighter">
                          1s ROTATING
                        </span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div>
                    <input
                      type="text"
                      value={customKey}
                      onChange={(e) => setCustomKey(e.target.value)}
                      placeholder="gar_live_... or gar_sub_..."
                      className="w-full rounded-lg border border-neutral-700 bg-black px-3.5 py-2 font-mono text-xs text-white placeholder-neutral-500 focus:border-[#FFB800] focus:outline-none"
                    />
                    <p className="mt-1 text-[10px] text-neutral-400 font-mono">
                      Using your personal account Sub-API Key.
                    </p>
                  </div>
                )}
              </div>

              {/* Run Button */}
              <button
                onClick={handleExecute}
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-[#FFB800] hover:bg-[#FFA500] py-3 text-xs font-['Russo_One',sans-serif] tracking-wider text-black transition-all shadow-[0_0_20px_rgba(255,184,0,0.3)] active:scale-[0.98] disabled:opacity-50 uppercase font-bold"
              >
                {loading ? (
                  <RefreshCw className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
                <span>Send Request (Execute API)</span>
              </button>

              {/* Status info footer */}
              <div className="mt-4 pt-3 border-t border-neutral-800 text-[11px] text-neutral-400 flex items-center justify-between font-mono">
                <span className="flex items-center gap-1">
                  <span>Cost:</span>
                  <strong className="text-emerald-400">৳0.00 (Sandbox Free)</strong>
                </span>
                <span className="flex items-center gap-1">
                  <span>Server Latency:</span>
                  <strong className="text-cyan-400">&lt;140ms</strong>
                </span>
              </div>

            </div>
          </div>

          {/* Response & Code Column */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Live Response Box */}
            <div className="rounded-2xl border border-neutral-800 bg-[#0d0d14] p-5 shadow-xl">
              
              <div className="flex flex-wrap items-center justify-between border-b border-neutral-800 pb-3 mb-4 gap-2">
                <div className="flex items-center gap-2">
                  <span className={`h-2.5 w-2.5 rounded-full ${response?.status ? 'bg-emerald-400' : 'bg-rose-400'} animate-pulse`} />
                  <span className="font-mono text-xs font-bold text-white">
                    HTTP {response?.status ? '200 OK' : '403 / 400'}
                  </span>
                  {response?.latency_ms && (
                    <span className="text-[11px] text-neutral-400 font-mono">({response.latency_ms}ms)</span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  {response?.anti_capture_verified && (
                    <span className="inline-flex items-center gap-1 rounded bg-emerald-500/10 px-2 py-0.5 text-[10px] text-emerald-400 border border-emerald-500/20 font-mono font-bold">
                      <ShieldCheck className="h-3 w-3" />
                      <span>ANTI-CAPTURE PASSED</span>
                    </span>
                  )}
                  {response?.status && response?.name && (
                    <span className="inline-flex items-center gap-1 rounded bg-[#FFB800]/10 px-2 py-0.5 text-[10px] text-[#FFB800] border border-[#FFB800]/20 font-mono font-bold">
                      <CheckCircle className="h-3 w-3" />
                      <span>VERIFIED PLAYER</span>
                    </span>
                  )}
                </div>
              </div>

              {/* JSON Response Output */}
              <div className="relative">
                <pre className="rounded-xl bg-black p-4 font-mono text-xs text-neutral-200 overflow-x-auto border border-neutral-800/80 max-h-64 leading-relaxed">
                  {JSON.stringify(response, null, 2)}
                </pre>
              </div>

              {/* Response summary pill if successful */}
              {response?.status && response?.name && (
                <div className="mt-3.5 rounded-xl border border-neutral-800 bg-neutral-900/60 p-3 grid grid-cols-3 gap-2 text-center font-mono">
                  <div>
                    <span className="text-[10px] text-neutral-500 block uppercase">Player Name</span>
                    <span className="text-xs font-bold text-[#FFB800] truncate block">{response.name}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-neutral-500 block uppercase">Level</span>
                    <span className="text-xs font-bold text-white block">{response.level}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-neutral-500 block uppercase">Region</span>
                    <span className="text-xs font-bold text-emerald-400 block">{response.region || 'BD'}</span>
                  </div>
                </div>
              )}
            </div>

            {/* Code Snippets Box */}
            <div className="rounded-2xl border border-neutral-800 bg-[#0d0d14] p-5 shadow-xl">
              
              <div className="flex items-center justify-between border-b border-neutral-800 pb-3 mb-4">
                <div className="flex items-center gap-1">
                  {(['curl', 'php', 'js', 'python'] as const).map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`rounded-lg px-3 py-1 font-mono text-xs font-bold uppercase transition-colors ${
                        activeTab === tab 
                          ? 'bg-[#FFB800] text-black shadow-sm' 
                          : 'text-neutral-400 hover:text-white hover:bg-neutral-800'
                      }`}
                    >
                      {tab}
                    </button>
                  ))}
                </div>

                <button
                  onClick={copySnippet}
                  className="flex items-center gap-1.5 rounded-lg border border-neutral-700 bg-black px-2.5 py-1 text-xs font-mono text-neutral-300 hover:text-white hover:border-neutral-500 transition-colors"
                >
                  {copied ? (
                    <>
                      <Check className="h-3.5 w-3.5 text-emerald-400" />
                      <span className="text-emerald-400">COPIED</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-3.5 w-3.5" />
                      <span>COPY</span>
                    </>
                  )}
                </button>
              </div>

              {/* Code Snippet Display */}
              <div className="relative">
                <pre className="rounded-xl bg-black p-4 font-mono text-xs text-cyan-300 overflow-x-auto border border-neutral-800 max-h-56">
                  {getCurrentSnippet()}
                </pre>
              </div>

              <div className="mt-3 text-[10px] text-neutral-500 font-mono flex items-center justify-between">
                <span>⚡ Key updates dynamically in real-time</span>
                <span>Permanent Sub-Keys available after sign-in</span>
              </div>

            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
