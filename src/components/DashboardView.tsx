import React, { useState, useEffect } from 'react';
import { User, SubApiKey, OrderLog } from '../types';
import { Language } from '../lib/translations';
import { apiClient } from '../lib/apiClient';
import { 
  KeyRound, Wallet, History, Plus, RefreshCw, Copy, Check, Eye, EyeOff, 
  Trash2, ToggleLeft, ToggleRight, ArrowUpRight, Search, Download, 
  ShieldCheck, AlertTriangle, ExternalLink, Terminal, CheckCircle2, Play, User as UserIcon
} from 'lucide-react';
import { FreeFireIcon } from './FreeFireIcon';

interface DashboardViewProps {
  user: User;
  lang: Language;
  onUpdateUser: (updated: User) => void;
  onLogout: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  user,
  onUpdateUser,
  onLogout
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'keys' | 'orders' | 'billing' | 'tester'>('overview');

  // Sub-keys state
  const [subKeys, setSubKeys] = useState<SubApiKey[]>([]);
  const [loadingSubKeys, setLoadingSubKeys] = useState(false);
  const [showCreateSubKeyModal, setShowCreateSubKeyModal] = useState(false);
  const [newSubKeyName, setNewSubKeyName] = useState('');
  const [newSubKeyDomain, setNewSubKeyDomain] = useState('*');
  const [newSubKeyLimit, setNewSubKeyLimit] = useState(60);

  // Orders state
  const [orders, setOrders] = useState<OrderLog[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [searchUid, setSearchUid] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  // API Key visibility & copy
  const [showPrimaryKey, setShowPrimaryKey] = useState(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Recharge state
  const [rechargeAmount, setRechargeAmount] = useState('200');
  const [rechargeMethod, setRechargeMethod] = useState<'bkash' | 'nagad' | 'rocket' | 'upay' | 'card'>('bkash');
  const [senderPhone, setSenderPhone] = useState('');
  const [trxId, setTrxId] = useState('');
  const [recharging, setRecharging] = useState(false);
  const [rechargeSuccess, setRechargeSuccess] = useState<string | null>(null);
  const [rechargeError, setRechargeError] = useState<string | null>(null);

  // In-dashboard tester
  const [testUid, setTestUid] = useState('12345678');
  const [testResult, setTestResult] = useState<any>(null);
  const [testLoading, setTestLoading] = useState(false);

  // Load Sub-keys and Orders
  const loadData = async () => {
    setLoadingSubKeys(true);
    setLoadingOrders(true);
    try {
      const keysRes = await apiClient.getSubKeys(user.id);
      if (keysRes.status && keysRes.subKeys) {
        setSubKeys(keysRes.subKeys);
      }
      const ordersRes = await apiClient.getOrders(user.id, searchUid, statusFilter);
      if (ordersRes.status && ordersRes.orders) {
        setOrders(ordersRes.orders);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingSubKeys(false);
      setLoadingOrders(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [user.id, statusFilter]);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(id);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  // Regenerate Primary Key
  const handleRegeneratePrimaryKey = async () => {
    if (!window.confirm('Warning: Regenerating your primary key will immediately invalidate your previous key. Are you sure?')) {
      return;
    }
    const res = await apiClient.regeneratePrimaryKey(user.id);
    if (res.status) {
      onUpdateUser({ ...user, primaryApiKey: res.primaryApiKey });
      alert('New primary API key generated successfully!');
    }
  };

  // Create Sub-API Key
  const handleCreateSubKey = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubKeyName.trim()) return;

    const res = await apiClient.createSubKey({
      userId: user.id,
      name: newSubKeyName.trim(),
      allowedDomain: newSubKeyDomain.trim() || '*',
      rateLimitPerMin: newSubKeyLimit
    });

    if (res.status && res.subKey) {
      setSubKeys([res.subKey, ...subKeys]);
      setShowCreateSubKeyModal(false);
      setNewSubKeyName('');
      setNewSubKeyDomain('*');
    }
  };

  // Toggle Sub-API Key Active Status
  const handleToggleSubKey = async (id: string) => {
    const res = await apiClient.toggleSubKey(id);
    if (res.status) {
      setSubKeys(subKeys.map(k => k.id === id ? { ...k, isActive: res.isActive } : k));
    }
  };

  // Delete Sub-API Key
  const handleDeleteSubKey = async (id: string) => {
    if (!window.confirm('Are you sure you want to permanently delete this sub-API key?')) return;
    const res = await apiClient.deleteSubKey(id);
    if (res.status) {
      setSubKeys(subKeys.filter(k => k.id !== id));
    }
  };

  // Recharge Wallet
  const handleRechargeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setRechargeError(null);
    setRechargeSuccess(null);

    const amt = parseFloat(rechargeAmount);
    if (isNaN(amt) || amt < 50) {
      setRechargeError('Minimum recharge amount is ৳50 BDT.');
      return;
    }
    if (!trxId.trim()) {
      setRechargeError('Please provide the transaction TrxID.');
      return;
    }

    setRecharging(true);
    const res = await apiClient.topupWallet({
      userId: user.id,
      amount: amt,
      method: rechargeMethod,
      senderNumber: senderPhone || '01XXXXXXXXX',
      trxId: trxId.trim()
    });
    setRecharging(false);

    if (res.status && res.newBalance !== undefined) {
      onUpdateUser({ ...user, balance: res.newBalance });
      setRechargeSuccess(`Success! ৳${amt} has been credited to your wallet. Current Balance: ৳${res.newBalance.toFixed(2)}`);
      setTrxId('');
      setSenderPhone('');
    } else {
      setRechargeError(res.message || 'Recharge verification failed.');
    }
  };

  // Run Test in Dashboard
  const handleRunTest = async () => {
    if (!testUid.trim()) return;
    setTestLoading(true);
    const res = await apiClient.checkPlayerWithKey(testUid.trim(), user.primaryApiKey);
    setTestLoading(false);
    setTestResult(res);
    if (res.status && res.balance_remaining !== undefined) {
      onUpdateUser({ ...user, balance: res.balance_remaining });
    }
  };

  // Export CSV
  const handleExportCsv = () => {
    if (orders.length === 0) return;
    const headers = ['Order ID', 'UID', 'Player Name', 'Level', 'Region', 'Status', 'Cost', 'Latency', 'Timestamp'];
    const rows = orders.map(o => [
      o.id,
      o.uid,
      `"${o.playerName}"`,
      o.level,
      o.region,
      o.status,
      o.cost,
      `${o.latencyMs}ms`,
      o.timestamp
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `garena_api_orders_${user.id}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-[#07070a] text-neutral-100 font-sans">
      
      {/* Top Banner / Breadcrumb Bar */}
      <div className="border-b border-neutral-800 bg-[#0c0c12]/95 backdrop-blur-md">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            
            {/* User & Company Identity */}
            <div>
              <div className="flex items-center gap-2 text-xs text-neutral-400 font-mono">
                <span className="text-white font-bold">{user.companyName}</span>
                <span aria-hidden="true">·</span>
                <span className="text-[#FFB800]">ID: {user.id}</span>
                <span aria-hidden="true" className="hidden sm:inline">·</span>
                <span className="hidden sm:inline">{user.email}</span>
              </div>
              <h1 className="text-xl sm:text-2xl font-['Russo_One',sans-serif] tracking-wider text-white mt-1 uppercase flex items-center gap-2">
                <FreeFireIcon className="h-5 w-5 text-[#FFB800] fill-current" />
                <span>DEVELOPER COMMAND CENTER</span>
              </h1>
            </div>

            {/* Wallet Balance Action Block */}
            <div className="flex items-center gap-2.5">
              <div className="flex items-center gap-2 rounded-xl border border-[#FFB800]/40 bg-[#FFB800]/10 px-3.5 py-1.5 sm:py-2">
                <Wallet className="h-4 w-4 text-[#FFB800]" />
                <div>
                  <span className="block text-[9px] uppercase tracking-wider text-neutral-400 font-mono leading-none">
                    WALLET BALANCE
                  </span>
                  <span className="font-mono text-sm sm:text-base font-bold text-[#FFB800] tabular-nums">
                    ৳{user.balance.toFixed(2)}
                  </span>
                </div>
              </div>

              <button
                onClick={() => setActiveTab('billing')}
                className="flex items-center gap-1 rounded-xl bg-[#FFB800] hover:bg-[#FFA500] px-3.5 py-2 text-xs font-['Russo_One',sans-serif] tracking-wider text-black transition-all shadow-[0_0_12px_rgba(255,184,0,0.35)] uppercase font-bold"
              >
                <ArrowUpRight className="h-4 w-4" />
                <span>TOP UP</span>
              </button>
            </div>

          </div>
        </div>

        {/* Tab Navigation */}
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-1 overflow-x-auto border-t border-neutral-800/80 pt-1 no-scrollbar">
            {[
              { id: 'overview', label: 'OVERVIEW', icon: History },
              { id: 'keys', label: 'API & SUB-KEYS', icon: KeyRound },
              { id: 'orders', label: 'ORDER LOGS', icon: History },
              { id: 'billing', label: 'BILLING & WALLET', icon: Wallet },
              { id: 'tester', label: 'API SANDBOX', icon: Terminal }
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-1.5 sm:gap-2 border-b-2 px-3 sm:px-4 py-2.5 text-xs font-['Russo_One',sans-serif] tracking-wider whitespace-nowrap transition-colors uppercase ${
                    isActive
                      ? 'border-[#FFB800] text-[#FFB800] bg-[#FFB800]/5'
                      : 'border-transparent text-neutral-400 hover:text-white'
                  }`}
                >
                  <Icon className="h-3.5 w-3.5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Dashboard Content */}
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        
        {/* TAB 1: OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="space-y-6 sm:space-y-8">
            
            {/* Metric Cards Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              <div className="rounded-2xl border border-neutral-800 bg-[#0d0d14] p-4 sm:p-5">
                <span className="text-[11px] sm:text-xs text-neutral-400 font-sans">Wallet Balance</span>
                <div className="mt-1.5 flex items-baseline justify-between">
                  <span className="font-mono text-xl sm:text-2xl font-bold text-[#FFB800] tabular-nums">
                    ৳{user.balance.toFixed(2)}
                  </span>
                  <button
                    onClick={() => setActiveTab('billing')}
                    className="text-[11px] text-[#FFB800] hover:underline font-mono"
                  >
                    + Add
                  </button>
                </div>
                <div className="mt-2 text-[10px] sm:text-[11px] text-neutral-400 font-mono">
                  Remaining: ~{Math.floor(user.balance / 0.05)} queries
                </div>
              </div>

              <div className="rounded-2xl border border-neutral-800 bg-[#0d0d14] p-4 sm:p-5">
                <span className="text-[11px] sm:text-xs text-neutral-400 font-sans">Total Requests Processed</span>
                <div className="mt-1.5 flex items-baseline justify-between">
                  <span className="font-mono text-xl sm:text-2xl font-bold text-white tabular-nums">
                    {user.totalQueries.toLocaleString()}
                  </span>
                  <span className="text-[10px] text-emerald-400 font-mono">99.9%</span>
                </div>
                <div className="mt-2 text-[10px] sm:text-[11px] text-neutral-400 font-mono">
                  Success verification rate
                </div>
              </div>

              <div className="rounded-2xl border border-neutral-800 bg-[#0d0d14] p-4 sm:p-5">
                <span className="text-[11px] sm:text-xs text-neutral-400 font-sans">Active Sub-API Keys</span>
                <div className="mt-1.5 flex items-baseline justify-between">
                  <span className="font-mono text-xl sm:text-2xl font-bold text-[#FFB800] tabular-nums">
                    {subKeys.filter(k => k.isActive).length}
                  </span>
                  <button
                    onClick={() => setActiveTab('keys')}
                    className="text-[11px] text-[#FFB800] hover:underline font-mono"
                  >
                    Manage
                  </button>
                </div>
                <div className="mt-2 text-[10px] sm:text-[11px] text-neutral-400 font-mono">
                  Total generated: {subKeys.length}
                </div>
              </div>

              <div className="rounded-2xl border border-neutral-800 bg-[#0d0d14] p-4 sm:p-5">
                <span className="text-[11px] sm:text-xs text-neutral-400 font-sans">Avg Response Latency</span>
                <div className="mt-1.5 flex items-baseline justify-between">
                  <span className="font-mono text-xl sm:text-2xl font-bold text-emerald-400 tabular-nums">
                    140 ms
                  </span>
                  <span className="text-[10px] text-emerald-400 font-mono">Fast</span>
                </div>
                <div className="mt-2 text-[10px] sm:text-[11px] text-neutral-400 font-mono">
                  High-speed cluster
                </div>
              </div>
            </div>

            {/* Master Key Card */}
            <div className="rounded-2xl border border-neutral-800 bg-[#0d0d14] p-4 sm:p-6 shadow-xl">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-neutral-800 pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <KeyRound className="h-4 w-4 text-[#FFB800]" />
                    <h3 className="font-['Russo_One',sans-serif] text-sm sm:text-base text-white uppercase tracking-wider">
                      MASTER API KEY
                    </h3>
                  </div>
                  <p className="mt-1 text-xs text-neutral-400 font-sans">
                    This key grants full access to all endpoints and your shared wallet balance. Keep it secure.
                  </p>
                </div>

                <button
                  onClick={() => setShowCreateSubKeyModal(true)}
                  className="flex items-center justify-center gap-1.5 rounded-xl bg-[#FFB800] hover:bg-[#FFA500] px-4 py-2 text-xs font-['Russo_One',sans-serif] tracking-wider text-black transition-all shadow-[0_0_12px_rgba(255,184,0,0.3)] uppercase font-bold"
                >
                  <Plus className="h-4 w-4" />
                  <span>+ Create Sub-Key</span>
                </button>
              </div>

              <div className="mt-4 flex flex-col sm:flex-row sm:items-center gap-3">
                <div className="flex-1 flex items-center justify-between rounded-xl bg-black px-3.5 py-2.5 border border-neutral-800">
                  <code className="font-mono text-xs sm:text-sm text-[#FFB800] truncate">
                    {showPrimaryKey ? user.primaryApiKey : `${user.primaryApiKey.slice(0, 10)}••••••••••••`}
                  </code>
                  <div className="flex items-center gap-1 shrink-0 ml-2">
                    <button
                      onClick={() => setShowPrimaryKey(!showPrimaryKey)}
                      className="p-1.5 text-neutral-400 hover:text-white"
                      title={showPrimaryKey ? 'Hide' : 'Show'}
                    >
                      {showPrimaryKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                    <button
                      onClick={() => handleCopy(user.primaryApiKey, 'master')}
                      className="flex items-center gap-1 rounded bg-[#FFB800] px-2.5 py-1 text-xs font-bold text-black hover:bg-[#FFA500]"
                    >
                      {copiedKey === 'master' ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                      <span>{copiedKey === 'master' ? 'Copied' : 'Copy'}</span>
                    </button>
                  </div>
                </div>

                <button
                  onClick={handleRegeneratePrimaryKey}
                  className="rounded-xl border border-neutral-700 bg-neutral-900 px-3.5 py-2.5 text-xs font-mono text-neutral-300 hover:text-rose-400 transition-colors shrink-0"
                >
                  Regenerate Key
                </button>
              </div>
            </div>

            {/* Recent Orders Preview */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-['Russo_One',sans-serif] text-sm text-white uppercase tracking-wider flex items-center gap-2">
                  <History className="h-4 w-4 text-[#FFB800]" />
                  <span>Recent Verification Logs</span>
                </h3>
                <button
                  onClick={() => setActiveTab('orders')}
                  className="text-xs text-[#FFB800] hover:underline font-mono"
                >
                  View All Orders →
                </button>
              </div>

              <div className="overflow-x-auto rounded-2xl border border-neutral-800 bg-[#0d0d14]">
                <table className="w-full text-left text-xs font-mono">
                  <thead className="border-b border-neutral-800 bg-black/80 text-neutral-400">
                    <tr>
                      <th className="py-3 px-4">UID</th>
                      <th className="py-3 px-4">Player Name</th>
                      <th className="py-3 px-4">Level</th>
                      <th className="py-3 px-4">Region</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4 text-right">Cost</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-800/60">
                    {orders.slice(0, 5).map((o) => (
                      <tr key={o.id} className="hover:bg-neutral-850/50">
                        <td className="py-3 px-4 text-[#FFB800] font-bold">{o.uid}</td>
                        <td className="py-3 px-4 text-white">{o.playerName}</td>
                        <td className="py-3 px-4 text-neutral-300">L{o.level}</td>
                        <td className="py-3 px-4 text-neutral-400">{o.region}</td>
                        <td className="py-3 px-4">
                          <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold ${
                            o.status === 'SUCCESS' || o.status === 'CACHED'
                              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                              : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                          }`}>
                            {o.status}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right text-emerald-400 font-bold">
                          ৳{o.cost.toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}

        {/* TAB 2: SUB-API KEYS */}
        {activeTab === 'keys' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-neutral-800 pb-4">
              <div>
                <h3 className="font-['Russo_One',sans-serif] text-base text-white uppercase tracking-wider flex items-center gap-2">
                  <KeyRound className="h-5 w-5 text-[#FFB800]" />
                  <span>Sub-API Keys Management</span>
                </h3>
                <p className="text-xs text-neutral-400 mt-0.5">
                  Generate distinct API keys for each client website, WooCommerce store, or Telegram bot.
                </p>
              </div>

              <button
                onClick={() => setShowCreateSubKeyModal(true)}
                className="flex items-center justify-center gap-1.5 rounded-xl bg-[#FFB800] hover:bg-[#FFA500] px-4 py-2.5 text-xs font-['Russo_One',sans-serif] tracking-wider text-black font-bold uppercase transition-all shadow-[0_0_12px_rgba(255,184,0,0.3)]"
              >
                <Plus className="h-4 w-4" />
                <span>+ Create Sub-Key</span>
              </button>
            </div>

            {/* Sub-keys list */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {subKeys.map((sk) => (
                <div key={sk.id} className="rounded-2xl border border-neutral-800 bg-[#0d0d14] p-5 space-y-3 shadow-lg">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-['Russo_One',sans-serif] text-sm text-white uppercase tracking-wider">
                        {sk.name}
                      </h4>
                      <span className="text-[10px] text-neutral-500 font-mono">
                        Created: {new Date(sk.createdAt).toLocaleDateString()}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleToggleSubKey(sk.id)}
                        className={`text-xs font-mono px-2 py-0.5 rounded font-bold ${
                          sk.isActive ? 'bg-emerald-500/20 text-emerald-400' : 'bg-neutral-800 text-neutral-400'
                        }`}
                      >
                        {sk.isActive ? 'ACTIVE' : 'PAUSED'}
                      </button>
                      <button
                        onClick={() => handleDeleteSubKey(sk.id)}
                        className="text-neutral-500 hover:text-rose-400 p-1"
                        title="Delete Key"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between rounded-xl bg-black px-3 py-2 border border-neutral-800">
                    <code className="text-xs font-mono text-[#FFB800] truncate">
                      {sk.key}
                    </code>
                    <button
                      onClick={() => handleCopy(sk.key, sk.id)}
                      className="text-neutral-400 hover:text-white ml-2 p-1"
                      title="Copy Key"
                    >
                      {copiedKey === sk.id ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                    </button>
                  </div>

                  <div className="grid grid-cols-3 gap-2 pt-1 text-[11px] font-mono text-neutral-400 border-t border-neutral-800/60">
                    <div>Domain: <strong className="text-white">{sk.allowedDomain}</strong></div>
                    <div>Rate: <strong className="text-white">{sk.rateLimitPerMin}/m</strong></div>
                    <div>Requests: <strong className="text-[#FFB800]">{sk.totalRequests}</strong></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: ORDER LOGS */}
        {activeTab === 'orders' && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-neutral-800 pb-4">
              <div>
                <h3 className="font-['Russo_One',sans-serif] text-base text-white uppercase tracking-wider flex items-center gap-2">
                  <History className="h-5 w-5 text-[#FFB800]" />
                  <span>Real-Time Order & Query Logs</span>
                </h3>
                <p className="text-xs text-neutral-400 mt-0.5">
                  Full audit trail of every player verification request executed under your account.
                </p>
              </div>

              <button
                onClick={handleExportCsv}
                className="flex items-center gap-1.5 rounded-xl border border-neutral-700 bg-neutral-900 px-3.5 py-2 text-xs font-mono text-neutral-200 hover:text-white"
              >
                <Download className="h-3.5 w-3.5 text-[#FFB800]" />
                <span>Export CSV</span>
              </button>
            </div>

            {/* Orders Table */}
            <div className="overflow-x-auto rounded-2xl border border-neutral-800 bg-[#0d0d14]">
              <table className="w-full text-left text-xs font-mono">
                <thead className="border-b border-neutral-800 bg-black/80 text-neutral-400">
                  <tr>
                    <th className="py-3 px-4">Order ID</th>
                    <th className="py-3 px-4">Player UID</th>
                    <th className="py-3 px-4">In-Game Name</th>
                    <th className="py-3 px-4">Level</th>
                    <th className="py-3 px-4">Region</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4">Latency</th>
                    <th className="py-3 px-4 text-right">Cost</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-800/60">
                  {orders.map((o) => (
                    <tr key={o.id} className="hover:bg-neutral-850/50">
                      <td className="py-3 px-4 text-neutral-500 font-mono">{o.id}</td>
                      <td className="py-3 px-4 text-[#FFB800] font-bold">{o.uid}</td>
                      <td className="py-3 px-4 text-white font-sans">{o.playerName}</td>
                      <td className="py-3 px-4 text-neutral-300">L{o.level}</td>
                      <td className="py-3 px-4 text-neutral-400">{o.region}</td>
                      <td className="py-3 px-4">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold ${
                          o.status === 'SUCCESS' || o.status === 'CACHED'
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                            : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                        }`}>
                          {o.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-neutral-400">{o.latencyMs}ms</td>
                      <td className="py-3 px-4 text-right text-emerald-400 font-bold">
                        ৳{o.cost.toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 4: BILLING & WALLET */}
        {activeTab === 'billing' && (
          <div className="space-y-6">
            <div className="border-b border-neutral-800 pb-4">
              <h3 className="font-['Russo_One',sans-serif] text-base text-white uppercase tracking-wider flex items-center gap-2">
                <Wallet className="h-5 w-5 text-[#FFB800]" />
                <span>Automated Wallet Top-Up</span>
              </h3>
              <p className="text-xs text-neutral-400 mt-0.5">
                Instantly recharge your API query balance via bKash, Nagad, Rocket, or Upay.
              </p>
            </div>

            {rechargeSuccess && (
              <div className="rounded-xl border border-emerald-500/40 bg-emerald-950/40 p-3 text-xs text-emerald-300 flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400" />
                <span>{rechargeSuccess}</span>
              </div>
            )}

            {rechargeError && (
              <div className="rounded-xl border border-rose-500/40 bg-rose-950/40 p-3 text-xs text-rose-300 flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 shrink-0 text-rose-400" />
                <span>{rechargeError}</span>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Payment Methods */}
              <div className="rounded-2xl border border-neutral-800 bg-[#0d0d14] p-5 space-y-4">
                <h4 className="font-['Russo_One',sans-serif] text-sm text-[#FFB800] uppercase tracking-wider">
                  Select Gateway
                </h4>

                <div className="grid grid-cols-2 gap-3">
                  {[
                    { id: 'bkash', name: 'bKash Merchant' },
                    { id: 'nagad', name: 'Nagad Auto' },
                    { id: 'rocket', name: 'DBBL Rocket' },
                    { id: 'upay', name: 'Upay UCB' }
                  ].map((m) => (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => setRechargeMethod(m.id as any)}
                      className={`rounded-xl border p-3 text-left transition-colors font-mono text-xs ${
                        rechargeMethod === m.id
                          ? 'border-[#FFB800] bg-[#FFB800]/10 text-white font-bold'
                          : 'border-neutral-800 bg-black text-neutral-400 hover:border-neutral-700'
                      }`}
                    >
                      {m.name}
                    </button>
                  ))}
                </div>

                <form onSubmit={handleRechargeSubmit} className="space-y-4 pt-2">
                  <div>
                    <label className="block text-xs font-semibold text-neutral-300 mb-1">
                      Recharge Amount (BDT)
                    </label>
                    <input
                      type="number"
                      min="50"
                      value={rechargeAmount}
                      onChange={(e) => setRechargeAmount(e.target.value)}
                      className="w-full rounded-xl border border-neutral-700 bg-black px-3.5 py-2.5 font-mono text-sm text-[#FFB800] focus:border-[#FFB800] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-neutral-300 mb-1">
                      Sender Mobile Number
                    </label>
                    <input
                      type="text"
                      placeholder="01XXXXXXXXX"
                      value={senderPhone}
                      onChange={(e) => setSenderPhone(e.target.value)}
                      className="w-full rounded-xl border border-neutral-700 bg-black px-3.5 py-2.5 font-mono text-sm text-white focus:border-[#FFB800] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-neutral-300 mb-1">
                      Transaction ID (TrxID)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. BL9A8X7Z"
                      value={trxId}
                      onChange={(e) => setTrxId(e.target.value)}
                      className="w-full rounded-xl border border-neutral-700 bg-black px-3.5 py-2.5 font-mono text-sm text-[#FFB800] uppercase focus:border-[#FFB800] focus:outline-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={recharging}
                    className="w-full rounded-xl bg-[#FFB800] hover:bg-[#FFA500] py-3 text-xs font-['Russo_One',sans-serif] tracking-wider text-black font-bold uppercase transition-all shadow-[0_0_15px_rgba(255,184,0,0.3)]"
                  >
                    {recharging ? 'Verifying TrxID...' : 'Confirm Recharge'}
                  </button>
                </form>
              </div>

              {/* Instructions */}
              <div className="rounded-2xl border border-neutral-800 bg-[#0d0d14] p-5 space-y-4">
                <h4 className="font-['Russo_One',sans-serif] text-sm text-white uppercase tracking-wider">
                  Payment Instructions
                </h4>
                <div className="space-y-3 text-xs text-neutral-300 leading-relaxed font-sans">
                  <p>1. Open your bKash, Nagad, or Rocket mobile app.</p>
                  <p>2. Select "Send Money" or "Payment" and transfer the exact amount to the official merchant number.</p>
                  <p>3. Copy the 8-character Transaction ID (TrxID) from your confirmation SMS.</p>
                  <p>4. Paste the TrxID in the form and click "Confirm Recharge". Your wallet balance will update instantly.</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: TESTER */}
        {activeTab === 'tester' && (
          <div className="space-y-6">
            <div className="border-b border-neutral-800 pb-4">
              <h3 className="font-['Russo_One',sans-serif] text-base text-white uppercase tracking-wider flex items-center gap-2">
                <Terminal className="h-5 w-5 text-[#FFB800]" />
                <span>Live Query Sandbox</span>
              </h3>
              <p className="text-xs text-neutral-400 mt-0.5">
                Execute live queries using your authenticated API credentials directly from this terminal.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="rounded-2xl border border-neutral-800 bg-[#0d0d14] p-5 space-y-4">
                <label className="block text-xs font-semibold text-neutral-300">
                  Target Free Fire Player UID
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={testUid}
                    onChange={(e) => setTestUid(e.target.value)}
                    placeholder="e.g. 12345678"
                    className="w-full rounded-xl border border-neutral-700 bg-black px-3.5 py-2.5 font-mono text-sm text-[#FFB800] focus:border-[#FFB800] focus:outline-none"
                  />
                  <button
                    onClick={handleRunTest}
                    disabled={testLoading}
                    className="rounded-xl bg-[#FFB800] px-5 py-2.5 text-xs font-['Russo_One',sans-serif] text-black font-bold uppercase shrink-0"
                  >
                    {testLoading ? 'Checking...' : 'Run Query'}
                  </button>
                </div>
              </div>

              <div className="rounded-2xl border border-neutral-800 bg-[#0d0d14] p-5">
                <h4 className="text-xs font-mono text-neutral-400 mb-2 uppercase">JSON Response</h4>
                <pre className="rounded-xl bg-black p-4 font-mono text-xs text-emerald-400 overflow-x-auto max-h-60">
                  {testResult ? JSON.stringify(testResult, null, 2) : '// Response payload will appear here...'}
                </pre>
              </div>
            </div>
          </div>
        )}

      </div>

      {/* Modal: Create Sub-Key */}
      {showCreateSubKeyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-md">
          <div className="w-full max-w-md rounded-2xl border border-neutral-800 bg-[#0e0e14] p-6 shadow-2xl">
            <h3 className="font-['Russo_One',sans-serif] text-base text-white uppercase tracking-wider flex items-center gap-2">
              <KeyRound className="h-5 w-5 text-[#FFB800]" />
              <span>Create New Sub-API Key</span>
            </h3>

            <form onSubmit={handleCreateSubKey} className="mt-4 space-y-4 font-sans">
              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1">
                  Key Label / Store Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. WooCommerce Store #1"
                  value={newSubKeyName}
                  onChange={(e) => setNewSubKeyName(e.target.value)}
                  className="w-full rounded-xl border border-neutral-700 bg-black px-3.5 py-2 text-xs text-white focus:border-[#FFB800] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1">
                  Allowed Domain (* for all)
                </label>
                <input
                  type="text"
                  placeholder="e.g. myshop.com or *"
                  value={newSubKeyDomain}
                  onChange={(e) => setNewSubKeyDomain(e.target.value)}
                  className="w-full rounded-xl border border-neutral-700 bg-black px-3.5 py-2 font-mono text-xs text-white focus:border-[#FFB800] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1">
                  Rate Limit (req/min)
                </label>
                <input
                  type="number"
                  min="10"
                  max="300"
                  value={newSubKeyLimit}
                  onChange={(e) => setNewSubKeyLimit(parseInt(e.target.value) || 60)}
                  className="w-full rounded-xl border border-neutral-700 bg-black px-3.5 py-2 font-mono text-xs text-[#FFB800] focus:border-[#FFB800] focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-neutral-800">
                <button
                  type="button"
                  onClick={() => setShowCreateSubKeyModal(false)}
                  className="rounded-xl border border-neutral-700 px-4 py-2 text-xs text-neutral-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-[#FFB800] px-5 py-2 text-xs font-['Russo_One',sans-serif] text-black font-bold uppercase"
                >
                  Generate Key
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
