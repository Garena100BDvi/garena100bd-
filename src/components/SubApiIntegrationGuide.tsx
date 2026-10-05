import React, { useState } from 'react';
import { 
  Code2, Copy, Check, Terminal, ExternalLink, BookOpen, 
  Layers, ShieldCheck, CheckCircle2, AlertCircle, FileCode, Cpu 
} from 'lucide-react';
import { Language } from '../lib/translations';

interface SubApiIntegrationGuideProps {
  lang: Language;
  onOpenRegister?: () => void;
  onOpenLogin?: () => void;
}

export const SubApiIntegrationGuide: React.FC<SubApiIntegrationGuideProps> = () => {
  const [activeTab, setActiveTab] = useState<'curl' | 'php' | 'wordpress' | 'telegram' | 'nodejs'>('php');
  const [copied, setCopied] = useState(false);

  const hostUrl = window.location.origin;

  // Code snippets
  const curlCode = `# 1. Direct GET Request with Query Parameter
curl -X GET "${hostUrl}/api/v1/player?uid=12345678&key=gar_sub_YOUR_KEY" \\
     -H "Accept: application/json"

# 2. Or using Bearer Authorization Header
curl -X GET "${hostUrl}/api/v1/player?uid=12345678" \\
     -H "Authorization: Bearer gar_sub_YOUR_KEY" \\
     -H "Accept: application/json"`;

  const phpCode = `<?php
/**
 * Official Garena Free Fire Player UID Lookup (GET Method)
 * Safe for PHP 7.4, 8.0, 8.1, 8.2, 8.3
 */

function checkGarenaPlayer($uid, $subApiKey) {
    $endpoint = "${hostUrl}/api/v1/player?" . http_build_query([
        'uid' => $uid,
        'key' => $subApiKey
    ]);

    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $endpoint);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_TIMEOUT, 6);
    curl_setopt($ch, CURLOPT_HTTPHEADER, [
        'Accept: application/json',
        'User-Agent: TopUp-Store-Client/1.0'
    ]);

    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    $curlError = curl_error($ch);
    curl_close($ch);

    if ($curlError) {
        return ['status' => false, 'message' => 'CURL Error: ' . $curlError];
    }

    $result = json_decode($response, true);
    if ($httpCode === 200 && !empty($result['status'])) {
        return [
            'status' => true,
            'name'   => $result['name'],
            'level'  => $result['level'],
            'region' => $result['region'],
            'uid'    => $result['uid']
        ];
    }

    return [
        'status'  => false,
        'message' => $result['message'] ?? 'Player lookup failed'
    ];
}

// Example usage in your Diamond Top-up Shop
$playerUid = $_GET['uid'] ?? '12345678';
$apiKey = 'gar_sub_topupshop_bd91'; // Your Sub-API Key

header('Content-Type: application/json');
echo json_encode(checkGarenaPlayer($playerUid, $apiKey));
?>`;

  const wordpressCode = `<?php
/**
 * WordPress / WooCommerce Ajax Hook for Free Fire Player Verification
 * Place this in your child theme functions.php or a custom plugin
 */

add_action('wp_ajax_verify_freefire_uid', 'handle_ff_player_lookup');
add_action('wp_ajax_nopriv_verify_freefire_uid', 'handle_ff_player_lookup');

function handle_ff_player_lookup() {
    check_ajax_referer('ff_lookup_nonce', 'security');

    $uid = sanitize_text_field($_POST['player_uid'] ?? '');
    if (empty($uid)) {
        wp_send_json_error(['message' => 'Player UID is required']);
    }

    $apiKey = 'gar_sub_YOUR_SUB_KEY';
    $url = add_query_arg([
        'uid' => $uid,
        'key' => $apiKey
    ], '${hostUrl}/api/v1/player');

    $response = wp_remote_get($url, [
        'timeout' => 5,
        'headers' => ['Accept' => 'application/json']
    ]);

    if (is_wp_error($response)) {
        wp_send_json_error(['message' => $response->get_error_message()]);
    }

    $data = json_decode(wp_remote_retrieve_body($response), true);
    if (!empty($data['status'])) {
        wp_send_json_success($data);
    } else {
        wp_send_json_error(['message' => $data['message'] ?? 'Player not found']);
    }
}
?>`;

  const telegramCode = `# Python 3.9+ Telegram Bot Free Fire UID Verification Handler
# Uses 'requests' library to call the Garena Sub-API

import requests
from telegram import Update
from telegram.ext import ApplicationBuilder, CommandHandler, ContextTypes

SUB_API_KEY = "gar_sub_YOUR_KEY"
GATEWAY_URL = "${hostUrl}/api/v1/player"

async def check_command(update: Update, context: ContextTypes.DEFAULT_TYPE):
    if not context.args:
        await update.message.reply_text("Please provide a UID: /check <UID>")
        return

    uid = context.args[0]
    await update.message.reply_text(f"🔍 Verifying UID: {uid}...")

    try:
        response = requests.get(GATEWAY_URL, params={"uid": uid, "key": SUB_API_KEY}, timeout=5)
        data = response.json()

        if data.get("status"):
            msg = (
                f"✅ **Player Found**\\n"
                f"👤 Name: \`{data['name']}\`\\n"
                f"⭐ Level: {data['level']}\\n"
                f"🌐 Region: {data['region']}\\n"
                f"🆔 UID: \`{data['uid']}\`"
            )
        else:
            msg = f"❌ Error: {data.get('message', 'Invalid UID')}"

        await update.message.reply_text(msg, parse_mode="Markdown")
    except Exception as e:
        await update.message.reply_text(f"⚠️ Gateway error: {str(e)}")`;

  const nodejsCode = `// Node.js (CommonJS or ES Modules) with Axios
import axios from 'axios';

async function verifyPlayerUid(uid, subApiKey) {
  try {
    const response = await axios.get('${hostUrl}/api/v1/player', {
      params: {
        uid: uid,
        key: subApiKey
      },
      headers: {
        'Accept': 'application/json'
      },
      timeout: 5000
    });

    if (response.data.status) {
      console.log('Player Found:', response.data.name, 'Level:', response.data.level);
      return response.data;
    } else {
      console.error('Lookup failed:', response.data.message);
      return null;
    }
  } catch (error) {
    console.error('API Connection Error:', error.message);
    throw error;
  }
}

// Call Example
verifyPlayerUid('3588707062', 'gar_sub_topupshop_bd91');`;

  const getActiveCode = () => {
    switch (activeTab) {
      case 'curl': return curlCode;
      case 'php': return phpCode;
      case 'wordpress': return wordpressCode;
      case 'telegram': return telegramCode;
      case 'nodejs': return nodejsCode;
    }
  };

  const copyCode = () => {
    navigator.clipboard.writeText(getActiveCode());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section className="py-16 bg-slate-900/60 border-t border-slate-800">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Section Title */}
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/20 bg-cyan-950/40 px-3.5 py-1 text-xs font-semibold text-cyan-400 font-mono">
            <BookOpen className="h-3.5 w-3.5" />
            <span>OFFICIAL DEVELOPER DOCUMENTATION</span>
          </div>
          <h2 className="mt-3 text-2xl font-bold tracking-tight text-white sm:text-3xl">
            Sub-API Integration Specifications
          </h2>
          <p className="mt-2 text-sm text-slate-300 leading-relaxed">
            Complete integration guide for connecting your WordPress/WooCommerce Diamond Top-up store, custom PHP web application, or automated Telegram bots to the Garena Sub-API Gateway.
          </p>
        </div>

        {/* Endpoint Specification Box */}
        <div className="mt-8 rounded-2xl border border-slate-800 bg-slate-950 p-6 shadow-xl">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800/80 pb-5">
            <div className="flex items-center gap-3">
              <span className="rounded-lg bg-emerald-500/10 px-3 py-1 font-mono text-xs font-bold text-emerald-400 border border-emerald-500/30">
                GET
              </span>
              <code className="font-mono text-sm sm:text-base font-bold text-cyan-300">
                /api/v1/player
              </code>
            </div>
            <div className="flex items-center gap-3 text-xs text-slate-400 font-mono">
              <span>Rate Limit: <strong>60–300 req/min</strong></span>
              <span>·</span>
              <span>Cost: <strong className="text-emerald-400">৳0.05 / query</strong></span>
            </div>
          </div>

          {/* Parameters Table */}
          <div className="mt-6">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 font-mono">
              Query Parameters
            </h4>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono">
                <thead className="border-b border-slate-800 text-slate-400">
                  <tr>
                    <th className="py-2.5 px-3">Parameter</th>
                    <th className="py-2.5 px-3">Type</th>
                    <th className="py-2.5 px-3">Requirement</th>
                    <th className="py-2.5 px-3">Description & Example</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  <tr>
                    <td className="py-3 px-3 text-cyan-300 font-bold">uid</td>
                    <td className="py-3 px-3 text-amber-400">string</td>
                    <td className="py-3 px-3 text-rose-400 font-bold">REQUIRED</td>
                    <td className="py-3 px-3 text-slate-300 font-sans">
                      Target Free Fire player UID (e.g. <code className="text-cyan-400">12345678</code> or <code className="text-cyan-400">3588707062</code>)
                    </td>
                  </tr>
                  <tr>
                    <td className="py-3 px-3 text-cyan-300 font-bold">key</td>
                    <td className="py-3 px-3 text-amber-400">string</td>
                    <td className="py-3 px-3 text-rose-400 font-bold">REQUIRED</td>
                    <td className="py-3 px-3 text-slate-300 font-sans">
                      Your master API key or domain-isolated Sub-API Key (<code className="text-cyan-400">gar_sub_...</code>)
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Code Snippets Section */}
        <div className="mt-8 rounded-2xl border border-slate-800 bg-slate-950 p-5 sm:p-7 shadow-2xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4 mb-4">
            
            {/* Tabs */}
            <div className="flex flex-wrap items-center gap-1.5">
              {[
                { id: 'php', label: 'PHP (cURL GET)' },
                { id: 'wordpress', label: 'WordPress / WooCommerce' },
                { id: 'telegram', label: 'Telegram Bot (Python)' },
                { id: 'curl', label: 'cURL (Bash)' },
                { id: 'nodejs', label: 'Node.js (Axios)' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors font-mono ${
                    activeTab === tab.id
                      ? 'bg-cyan-500 text-slate-950 shadow-sm'
                      : 'text-slate-400 hover:text-white bg-slate-900 border border-slate-800'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <button
              onClick={copyCode}
              className="flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-900 px-3.5 py-1.5 text-xs font-medium text-cyan-400 hover:border-cyan-500/50 hover:text-white transition-colors"
            >
              {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
              <span>{copied ? 'Copied' : 'Copy Code'}</span>
            </button>
          </div>

          <pre className="overflow-x-auto rounded-xl bg-slate-900/90 p-4 font-mono text-xs text-slate-200 leading-relaxed max-h-[460px]">
            {getActiveCode()}
          </pre>

          {/* Response Status Codes Reference */}
          <div className="mt-6 pt-5 border-t border-slate-800/80">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 font-mono">
              HTTP Response Status Codes
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 text-xs font-mono">
              <div className="rounded-lg border border-emerald-500/30 bg-emerald-950/20 p-2.5">
                <span className="text-emerald-400 font-bold block">200 OK</span>
                <span className="text-[11px] text-slate-400 font-sans">Verified Player Data</span>
              </div>
              <div className="rounded-lg border border-slate-800 bg-slate-900 p-2.5">
                <span className="text-amber-400 font-bold block">400 Bad Request</span>
                <span className="text-[11px] text-slate-400 font-sans">Invalid UID Format</span>
              </div>
              <div className="rounded-lg border border-slate-800 bg-slate-900 p-2.5">
                <span className="text-rose-400 font-bold block">401 Unauthorized</span>
                <span className="text-[11px] text-slate-400 font-sans">Invalid API Key</span>
              </div>
              <div className="rounded-lg border border-slate-800 bg-slate-900 p-2.5">
                <span className="text-purple-400 font-bold block">402 Payment Req</span>
                <span className="text-[11px] text-slate-400 font-sans">Insufficient Balance</span>
              </div>
              <div className="rounded-lg border border-slate-800 bg-slate-900 p-2.5">
                <span className="text-slate-400 font-bold block">500 Server Error</span>
                <span className="text-[11px] text-slate-400 font-sans">Gateway Timeout</span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
