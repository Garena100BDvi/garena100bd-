import React, { useState, useEffect, useRef } from 'react';
import { 
  Shield, KeyRound, User as UserIcon, Plus, Trash2, Edit3, 
  Save, RefreshCw, Check, ArrowRight, DollarSign, Wallet, 
  Settings, Image, Layout, AlertCircle, CheckCircle2, Eye, EyeOff,
  LogOut, ExternalLink, Globe, Flame, Lock, ChevronDown, ChevronUp, Bell,
  Upload, X, Palette, Sparkles, Sliders, Smartphone, CreditCard
} from 'lucide-react';
import { apiClient } from '../lib/apiClient';
import { User, SiteConfig, HeroSlideConfig } from '../types';

interface AdminPanelProps {
  onClose: () => void;
  onConfigUpdated?: (newConfig: SiteConfig) => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({ onClose, onConfigUpdated }) => {
  // Admin authentication state
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [adminUsername, setAdminUsername] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [adminAuthError, setAdminAuthError] = useState<string | null>(null);
  const [adminAuthLoading, setAdminAuthLoading] = useState(false);

  // Active Navigation Tab
  const [activeTab, setActiveTab] = useState<'cms' | 'notice' | 'banners' | 'users' | 'stats' | 'security'>('cms');

  // Admin Password & Credentials Change state
  const [currAdminPass, setCurrAdminPass] = useState('');
  const [newAdminUser, setNewAdminUser] = useState('');
  const [newAdminPass, setNewAdminPass] = useState('');
  const [confirmAdminPass, setConfirmAdminPass] = useState('');
  const [showCurrPass, setShowCurrPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);
  const [passChangeLoading, setPassChangeLoading] = useState(false);
  const [passChangeSuccess, setPassChangeSuccess] = useState<string | null>(null);
  const [passChangeError, setPassChangeError] = useState<string | null>(null);

  // Site Configuration state
  const [config, setConfig] = useState<SiteConfig | null>(null);
  const [configSaving, setConfigSaving] = useState(false);
  const [configSuccess, setConfigSuccess] = useState<string | null>(null);

  // Background Image Upload state
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  // User Management state
  const [users, setUsers] = useState<User[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [showCreateUserModal, setShowCreateUserModal] = useState(false);
  const [newUsername, setNewUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newCompanyName, setNewCompanyName] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newBalance, setNewBalance] = useState('100');
  const [createUserError, setCreateUserError] = useState<string | null>(null);

  // Balance Update Modal
  const [balanceModal, setBalanceModal] = useState<{
    isOpen: boolean;
    user: User | null;
    action: 'add' | 'deduct';
    amount: string;
  }>({
    isOpen: false,
    user: null,
    action: 'add',
    amount: '100'
  });

  // Password Edit Modal
  const [passwordModal, setPasswordModal] = useState<{
    isOpen: boolean;
    user: User | null;
    newPass: string;
  }>({
    isOpen: false,
    user: null,
    newPass: ''
  });

  // Password visibility map
  const [showPasswords, setShowPasswords] = useState<{ [userId: string]: boolean }>({});

  // Check existing session
  useEffect(() => {
    const token = sessionStorage.getItem('atx_admin_token');
    if (token) {
      setIsAdminLoggedIn(true);
      fetchInitialData();
    }
  }, []);

  const fetchInitialData = async () => {
    const res = await apiClient.getSiteConfig();
    if (res.status && res.siteConfig) {
      // Ensure color defaults if not set
      setConfig({
        ...res.siteConfig,
        noticeBgColor: res.siteConfig.noticeBgColor || '#FFB800',
        noticeTextColor: res.siteConfig.noticeTextColor || '#000000'
      });
    }
    fetchUsers();
  };

  const fetchUsers = async () => {
    setLoadingUsers(true);
    const usersRes = await apiClient.getAdminUsers();
    setLoadingUsers(false);
    if (usersRes.status && usersRes.users) {
      setUsers(usersRes.users);
    }
  };

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAdminAuthError(null);
    setAdminAuthLoading(true);

    const res = await apiClient.adminLogin(adminUsername, adminPassword);
    setAdminAuthLoading(false);

    if (res.status && res.token) {
      sessionStorage.setItem('atx_admin_token', res.token);
      setIsAdminLoggedIn(true);
      fetchInitialData();
    } else {
      setAdminAuthError(res.message || 'Invalid admin credentials');
    }
  };

  const handleAdminLogout = () => {
    sessionStorage.removeItem('atx_admin_token');
    setIsAdminLoggedIn(false);
  };

  const handleChangeAdminPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPassChangeError(null);
    setPassChangeSuccess(null);

    if (!currAdminPass) {
      setPassChangeError('Please enter your current admin password.');
      return;
    }

    if (!newAdminPass) {
      setPassChangeError('Please enter a new password.');
      return;
    }

    if (newAdminPass.length < 4) {
      setPassChangeError('New password must be at least 4 characters long.');
      return;
    }

    if (newAdminPass !== confirmAdminPass) {
      setPassChangeError('New passwords do not match. Please re-check.');
      return;
    }

    setPassChangeLoading(true);
    const res = await apiClient.changeAdminPassword({
      currentPassword: currAdminPass,
      newUsername: newAdminUser.trim() || undefined,
      newPassword: newAdminPass
    });
    setPassChangeLoading(false);

    if (res.status) {
      setPassChangeSuccess(res.message || 'Admin credentials updated successfully!');
      setCurrAdminPass('');
      setNewAdminPass('');
      setConfirmAdminPass('');
      setTimeout(() => setPassChangeSuccess(null), 5000);
    } else {
      setPassChangeError(res.message || 'Failed to update admin password.');
    }
  };

  // Save Site Config
  const handleSaveConfig = async () => {
    if (!config) return;
    setConfigSaving(true);
    setConfigSuccess(null);

    const res = await apiClient.updateSiteConfig(config);
    setConfigSaving(false);

    if (res.status && res.siteConfig) {
      setConfig(res.siteConfig);
      setConfigSuccess('Settings updated and published successfully!');
      if (onConfigUpdated) onConfigUpdated(res.siteConfig);
      setTimeout(() => setConfigSuccess(null), 3000);
    }
  };

  // Handle Direct Background Image Upload
  const handleImageFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setUploadError('Please select a valid image file (PNG, JPG, WEBP)');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setUploadError('Image size exceeds 10MB limit');
      return;
    }

    setUploadError(null);
    setUploadingImage(true);

    const reader = new FileReader();
    reader.onload = async () => {
      const base64 = reader.result as string;
      const res = await apiClient.uploadAdminImage(base64, file.name);
      setUploadingImage(false);

      if (res.status && res.url) {
        if (config) {
          const updated = { ...config, backgroundUrl: res.url };
          setConfig(updated);
          if (onConfigUpdated) onConfigUpdated(updated);
          // Auto save uploaded background to database
          apiClient.updateSiteConfig(updated).then((saveRes) => {
            if (saveRes.status && saveRes.siteConfig) {
              if (onConfigUpdated) onConfigUpdated(saveRes.siteConfig);
              setConfigSuccess('Background image uploaded and applied to homepage successfully!');
              setTimeout(() => setConfigSuccess(null), 4000);
            }
          });
        }
      } else {
        setUploadError(res.message || 'Image upload failed');
      }
    };
    reader.onerror = () => {
      setUploadingImage(false);
      setUploadError('Failed to read file');
    };
    reader.readAsDataURL(file);
  };

  // Create Client User
  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreateUserError(null);

    if (!newUsername || !newPassword) {
      setCreateUserError('Username and Password are required');
      return;
    }

    const res = await apiClient.adminCreateUser({
      username: newUsername,
      password: newPassword,
      companyName: newCompanyName,
      phone: newPhone,
      email: newEmail,
      balance: parseFloat(newBalance) || 0
    });

    if (res.status && res.user) {
      setShowCreateUserModal(false);
      setNewUsername('');
      setNewPassword('');
      setNewCompanyName('');
      setNewPhone('');
      setNewEmail('');
      setNewBalance('100');
      fetchUsers();
    } else {
      setCreateUserError(res.message || 'Failed to create user');
    }
  };

  // Balance Update (Add / Deduct)
  const handleBalanceSubmit = async () => {
    if (!balanceModal.user) return;
    const amt = parseFloat(balanceModal.amount);
    if (isNaN(amt) || amt <= 0) {
      alert('Please enter a valid amount');
      return;
    }

    const res = await apiClient.adminUpdateBalance({
      userId: balanceModal.user.id,
      action: balanceModal.action,
      amount: amt
    });

    if (res.status) {
      setBalanceModal({ isOpen: false, user: null, action: 'add', amount: '100' });
      fetchUsers();
    } else {
      alert(res.message || 'Balance update failed');
    }
  };

  // Change Password
  const handlePasswordSubmit = async () => {
    if (!passwordModal.user) return;
    if (!passwordModal.newPass || passwordModal.newPass.length < 4) {
      alert('Password must be at least 4 characters');
      return;
    }

    const res = await apiClient.adminChangePassword(passwordModal.user.id, passwordModal.newPass);
    if (res.status) {
      setPasswordModal({ isOpen: false, user: null, newPass: '' });
      fetchUsers();
      alert('Password updated successfully');
    } else {
      alert(res.message || 'Failed to update password');
    }
  };

  // Reset Key
  const handleResetKey = async (userId: string) => {
    if (!window.confirm('Are you sure you want to regenerate the API key for this user?')) return;
    const res = await apiClient.adminResetKey(userId);
    if (res.status) {
      fetchUsers();
      alert('New API Key generated');
    }
  };

  // Delete User
  const handleDeleteUser = async (userId: string) => {
    if (!window.confirm('Are you sure you want to delete this user and all associated sub-keys?')) return;
    const res = await apiClient.adminDeleteUser(userId);
    if (res.status) {
      fetchUsers();
    }
  };

  // Notice Bar Color Presets
  const noticeColorPresets = [
    { name: 'Golden Flame', bg: '#FFB800', text: '#000000' },
    { name: 'Danger Crimson', bg: '#E60000', text: '#FFFFFF' },
    { name: 'Cyber Cyan', bg: '#00E5FF', text: '#000000' },
    { name: 'Emerald Green', bg: '#10B981', text: '#FFFFFF' },
    { name: 'Royal Violet', bg: '#8B5CF6', text: '#FFFFFF' },
    { name: 'Matte Obsidian', bg: '#18181B', text: '#FFB800' }
  ];

  // Preset Backgrounds
  const backgroundPresets = [
    { name: 'Default Dark Flame', url: '' },
    { name: 'Battle Cyber Grid', url: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=1600&auto=format&fit=crop' },
    { name: 'Fire Inferno Arena', url: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?q=80&w=1600&auto=format&fit=crop' },
    { name: 'Matrix Neon Tech', url: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=1600&auto=format&fit=crop' }
  ];

  // ================= 1. ADMIN LOGIN VIEW (100% ENGLISH) =================
  if (!isAdminLoggedIn) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 backdrop-blur-md">
        <div className="relative w-full max-w-md rounded-2xl border border-neutral-800 bg-[#0c0c14] p-6 sm:p-8 shadow-2xl">
          
          <div className="text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-black border border-[#FFB800]/50 text-[#FFB800] shadow-[0_0_20px_rgba(255,184,0,0.35)] mb-3">
              <Shield className="h-7 w-7 text-[#FFB800]" />
            </div>
            <h2 className="text-2xl font-['Russo_One',sans-serif] tracking-wider text-white uppercase">
              ATX ADMIN PANEL
            </h2>
            <p className="mt-1 text-xs text-neutral-400 font-mono">
              SECURE MANAGEMENT CONSOLE · ROUTE /admin84326
            </p>
          </div>

          {adminAuthError && (
            <div className="mt-4 rounded-xl border border-rose-500/40 bg-rose-950/40 p-3 text-xs text-rose-300 flex items-center gap-2">
              <AlertCircle className="h-4 w-4 shrink-0 text-rose-400" />
              <span>{adminAuthError}</span>
            </div>
          )}

          <form onSubmit={handleAdminLogin} className="mt-5 space-y-4 font-sans">
            <div>
              <label className="block text-xs font-semibold text-neutral-300 mb-1">
                Admin Username
              </label>
              <input
                type="text"
                required
                placeholder="ATX"
                value={adminUsername}
                onChange={(e) => setAdminUsername(e.target.value)}
                className="w-full rounded-xl border border-neutral-700 bg-black px-4 py-2.5 font-mono text-sm text-[#FFB800] uppercase placeholder-neutral-600 focus:border-[#FFB800] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-300 mb-1">
                Password
              </label>
              <input
                type="password"
                required
                placeholder="112233"
                value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)}
                className="w-full rounded-xl border border-neutral-700 bg-black px-4 py-2.5 font-mono text-sm text-white placeholder-neutral-600 focus:border-[#FFB800] focus:outline-none"
              />
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="w-1/3 rounded-xl border border-neutral-800 bg-neutral-900 py-3 text-xs font-medium text-neutral-300 hover:text-white"
              >
                Close
              </button>
              <button
                type="submit"
                disabled={adminAuthLoading}
                className="w-2/3 rounded-xl bg-[#FFB800] hover:bg-[#FFA500] py-3 text-xs font-['Russo_One',sans-serif] tracking-wider text-black font-bold uppercase transition-all shadow-[0_0_15px_rgba(255,184,0,0.35)]"
              >
                {adminAuthLoading ? 'Authenticating...' : 'Sign In'}
              </button>
            </div>
          </form>

        </div>
      </div>
    );
  }

  // ================= 2. LOGGED-IN ADMIN PANEL (100% ENGLISH) =================
  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-[#07070a] text-neutral-100 flex flex-col font-sans">
      
      {/* Top Admin Header */}
      <header className="sticky top-0 z-40 border-b border-neutral-800 bg-[#0c0c14]/95 backdrop-blur-md px-4 py-3 sm:px-6">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#FFB800] text-black">
              <Shield className="h-5 w-5 font-bold" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-['Russo_One',sans-serif] text-base font-bold text-white tracking-wider">
                  ATX ADMIN CONSOLE
                </span>
                <span className="rounded bg-emerald-500/20 px-2 py-0.5 font-mono text-[9px] font-bold text-emerald-400 border border-emerald-500/40">
                  SUPER ADMIN
                </span>
              </div>
              <span className="text-[10px] text-neutral-400 font-mono">
                Website CMS · Background Manager · User Balance Controller
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="flex items-center gap-1.5 rounded-xl border border-neutral-700 bg-neutral-900 px-3 py-1.5 text-xs text-neutral-300 hover:text-white"
            >
              <ExternalLink className="h-3.5 w-3.5 text-[#FFB800]" />
              <span className="hidden sm:inline">View Live Site</span>
            </button>

            <button
              onClick={handleAdminLogout}
              className="flex items-center gap-1.5 rounded-xl border border-rose-500/30 bg-rose-950/20 px-3 py-1.5 text-xs font-bold text-rose-400 hover:bg-rose-950/40"
            >
              <LogOut className="h-3.5 w-3.5" />
              <span>Sign Out</span>
            </button>
          </div>

        </div>

        {/* Tab Navigation (100% English) */}
        <div className="mx-auto max-w-7xl mt-3 flex space-x-1 overflow-x-auto border-t border-neutral-800/80 pt-2 no-scrollbar">
          {[
            { id: 'cms', label: 'General & Background', icon: Settings },
            { id: 'notice', label: 'Notice Bar & Colors', icon: Palette },
            { id: 'banners', label: 'Hero Slides Manager', icon: Image },
            { id: 'users', label: 'Users & Balance Control', icon: UserIcon },
            { id: 'stats', label: 'System Overview & Logs', icon: Layout },
            { id: 'security', label: 'Admin Password & Security', icon: KeyRound }
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-['Russo_One',sans-serif] tracking-wider whitespace-nowrap transition-colors uppercase ${
                  isActive
                    ? 'bg-[#FFB800] text-black font-bold shadow-md shadow-[#FFB800]/20'
                    : 'text-neutral-400 hover:text-white hover:bg-neutral-900'
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </header>

      {/* Main Body */}
      <main className="flex-1 mx-auto w-full max-w-7xl px-4 py-6 sm:px-6">
        
        {configSuccess && (
          <div className="mb-4 rounded-xl border border-emerald-500/40 bg-emerald-950/40 p-3 text-xs text-emerald-300 flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400" />
            <span>{configSuccess}</span>
          </div>
        )}

        {/* ================= TAB 1: GENERAL & BACKGROUND SETTINGS ================= */}
        {activeTab === 'cms' && config && (
          <div className="space-y-6">
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-neutral-800 pb-4">
              <div>
                <h3 className="font-['Russo_One',sans-serif] text-lg text-white uppercase tracking-wider flex items-center gap-2">
                  <Settings className="h-5 w-5 text-[#FFB800]" />
                  <span>Website Branding & Background Configuration</span>
                </h3>
                <p className="text-xs text-neutral-400 mt-0.5">
                  Customize website branding, per-check API rates, and upload background image directly.
                </p>
              </div>

              <button
                onClick={handleSaveConfig}
                disabled={configSaving}
                className="flex items-center justify-center gap-2 rounded-xl bg-[#FFB800] hover:bg-[#FFA500] px-5 py-2.5 text-xs font-['Russo_One',sans-serif] tracking-wider text-black font-bold uppercase transition-all shadow-[0_0_15px_rgba(255,184,0,0.35)]"
              >
                <Save className="h-4 w-4" />
                <span>{configSaving ? 'Saving...' : 'Save Settings'}</span>
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              {/* Brand & Titles */}
              <div className="rounded-2xl border border-neutral-800 bg-[#0d0d14] p-5 space-y-4">
                <h4 className="font-['Russo_One',sans-serif] text-sm text-[#FFB800] uppercase tracking-wider">
                  Brand & Page Title
                </h4>

                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1">
                    Website Title (Browser Tab)
                  </label>
                  <input
                    type="text"
                    value={config.siteTitle}
                    onChange={(e) => setConfig({ ...config, siteTitle: e.target.value })}
                    className="w-full rounded-xl border border-neutral-700 bg-black px-3.5 py-2.5 text-xs text-white focus:border-[#FFB800] focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-neutral-300 mb-1">
                      Brand Name (Left Text)
                    </label>
                    <input
                      type="text"
                      value={config.brandName}
                      onChange={(e) => setConfig({ ...config, brandName: e.target.value })}
                      className="w-full rounded-xl border border-neutral-700 bg-black px-3.5 py-2.5 text-xs text-white font-mono focus:border-[#FFB800] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-neutral-300 mb-1">
                      Brand Tag (Gold Text)
                    </label>
                    <input
                      type="text"
                      value={config.brandTag}
                      onChange={(e) => setConfig({ ...config, brandTag: e.target.value })}
                      className="w-full rounded-xl border border-neutral-700 bg-black px-3.5 py-2.5 text-xs text-[#FFB800] font-mono focus:border-[#FFB800] focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1">
                    Cost Per Player UID Check (BDT)
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      step="0.01"
                      min="0.01"
                      value={config.costPerCheck}
                      onChange={(e) => setConfig({ ...config, costPerCheck: parseFloat(e.target.value) || 0.05 })}
                      className="w-full rounded-xl border border-neutral-700 bg-black px-3.5 py-2.5 font-mono text-sm text-[#FFB800] focus:border-[#FFB800] focus:outline-none"
                    />
                    <span className="text-xs text-neutral-400 font-mono shrink-0">BDT / Check</span>
                  </div>
                  <span className="text-[10px] text-neutral-500 mt-1 block">
                    * This amount will be deducted automatically from client balance on each valid check.
                  </span>
                </div>
              </div>

              {/* DIRECT BACKGROUND IMAGE UPLOAD */}
              <div className="rounded-2xl border border-neutral-800 bg-[#0d0d14] p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-['Russo_One',sans-serif] text-sm text-[#FFB800] uppercase tracking-wider flex items-center gap-1.5">
                    <Upload className="h-4 w-4" />
                    <span>Upload Background Image</span>
                  </h4>
                  {config.backgroundUrl && (
                    <button
                      type="button"
                      onClick={() => setConfig({ ...config, backgroundUrl: '' })}
                      className="text-xs text-rose-400 hover:underline font-mono"
                    >
                      Reset to Default
                    </button>
                  )}
                </div>

                {uploadError && (
                  <div className="rounded-xl border border-rose-500/40 bg-rose-950/40 p-2.5 text-xs text-rose-300">
                    {uploadError}
                  </div>
                )}

                {/* Direct Upload Dropzone */}
                <div>
                  <input
                    type="file"
                    ref={fileInputRef}
                    accept="image/*"
                    onChange={handleImageFileChange}
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploadingImage}
                    className="w-full flex flex-col items-center justify-center p-6 rounded-2xl border-2 border-dashed border-neutral-700 bg-black/50 hover:border-[#FFB800] hover:bg-[#FFB800]/5 transition-all text-center group cursor-pointer"
                  >
                    <div className="h-10 w-10 rounded-xl bg-neutral-900 flex items-center justify-center text-[#FFB800] mb-2 group-hover:scale-110 transition-transform">
                      {uploadingImage ? (
                        <div className="h-5 w-5 animate-spin rounded-full border-2 border-[#FFB800] border-t-transparent" />
                      ) : (
                        <Upload className="h-5 w-5" />
                      )}
                    </div>
                    <span className="text-xs font-bold text-white uppercase tracking-wider font-['Russo_One',sans-serif]">
                      {uploadingImage ? 'Uploading Image...' : 'Click to Upload Background File'}
                    </span>
                    <span className="text-[11px] text-neutral-400 mt-0.5">
                      Supports JPG, PNG, WEBP (Max 10MB)
                    </span>
                  </button>
                </div>

                {/* Or Custom URL */}
                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1">
                    Or Enter Direct Image URL
                  </label>
                  <input
                    type="text"
                    placeholder="https://example.com/custom-bg.jpg"
                    value={config.backgroundUrl || ''}
                    onChange={(e) => {
                      const updated = { ...config, backgroundUrl: e.target.value };
                      setConfig(updated);
                      if (onConfigUpdated) onConfigUpdated(updated);
                    }}
                    className="w-full rounded-xl border border-neutral-700 bg-black px-3.5 py-2 text-xs text-white font-mono focus:border-[#FFB800] focus:outline-none"
                  />
                </div>

                {/* Image Preview */}
                {config.backgroundUrl && (
                  <div className="mt-2 rounded-xl overflow-hidden border border-neutral-800 h-28 relative">
                    <img 
                      src={config.backgroundUrl} 
                      alt="Background Preview" 
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-between p-3">
                      <span className="bg-black/90 px-2 py-0.5 rounded text-[10px] font-mono text-emerald-400 font-bold border border-emerald-500/40">
                        Active Background
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          const updated = { ...config, backgroundUrl: '' };
                          setConfig(updated);
                          if (onConfigUpdated) onConfigUpdated(updated);
                        }}
                        className="p-1 rounded bg-black/80 text-neutral-300 hover:text-rose-400"
                        title="Remove"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                )}

                {/* Presets */}
                <div>
                  <label className="block text-xs font-semibold text-neutral-400 mb-2">
                    Quick Preset Backgrounds:
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {backgroundPresets.map((bg, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => {
                          const updated = { ...config, backgroundUrl: bg.url };
                          setConfig(updated);
                          if (onConfigUpdated) onConfigUpdated(updated);
                        }}
                        className={`rounded-xl border p-2 text-left text-xs font-mono transition-colors ${
                          config.backgroundUrl === bg.url
                            ? 'border-[#FFB800] bg-[#FFB800]/10 text-[#FFB800]'
                            : 'border-neutral-800 bg-black text-neutral-300 hover:border-neutral-700'
                        }`}
                      >
                        {bg.name}
                      </button>
                    ))}
                  </div>
                </div>

              </div>

              {/* Payment Gateways & Telegram */}
              <div className="rounded-2xl border border-neutral-800 bg-[#0d0d14] p-5 space-y-4 lg:col-span-2">
                <h4 className="font-['Russo_One',sans-serif] text-sm text-[#FFB800] uppercase tracking-wider">
                  Official Merchant Numbers & Telegram Link
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-neutral-300 mb-1">
                      bKash Number
                    </label>
                    <input
                      type="text"
                      value={config.bkashNumber}
                      onChange={(e) => setConfig({ ...config, bkashNumber: e.target.value })}
                      className="w-full rounded-xl border border-neutral-700 bg-black px-3.5 py-2 font-mono text-xs text-white focus:border-[#FFB800] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-neutral-300 mb-1">
                      Nagad Number
                    </label>
                    <input
                      type="text"
                      value={config.nagadNumber}
                      onChange={(e) => setConfig({ ...config, nagadNumber: e.target.value })}
                      className="w-full rounded-xl border border-neutral-700 bg-black px-3.5 py-2 font-mono text-xs text-white focus:border-[#FFB800] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-neutral-300 mb-1">
                      Rocket Number
                    </label>
                    <input
                      type="text"
                      value={config.rocketNumber}
                      onChange={(e) => setConfig({ ...config, rocketNumber: e.target.value })}
                      className="w-full rounded-xl border border-neutral-700 bg-black px-3.5 py-2 font-mono text-xs text-white focus:border-[#FFB800] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-neutral-300 mb-1">
                      Telegram Bot URL
                    </label>
                    <input
                      type="text"
                      value={config.telegramLink}
                      onChange={(e) => setConfig({ ...config, telegramLink: e.target.value })}
                      className="w-full rounded-xl border border-neutral-700 bg-black px-3.5 py-2 font-mono text-xs text-white focus:border-[#FFB800] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-neutral-300 mb-1">
                      WhatsApp Admin Number (For Client Access Requests)
                    </label>
                    <input
                      type="text"
                      value={config.whatsappNumber || '01608880183'}
                      onChange={(e) => setConfig({ ...config, whatsappNumber: e.target.value })}
                      placeholder="01608880183"
                      className="w-full rounded-xl border border-neutral-700 bg-black px-3.5 py-2 font-mono text-xs text-white focus:border-[#FFB800] focus:outline-none"
                    />
                  </div>
                </div>
              </div>

            </div>

          </div>
        )}

        {/* ================= TAB 2: NOTICE BAR & COLOR CUSTOMIZATION ================= */}
        {activeTab === 'notice' && config && (
          <div className="space-y-6">
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-neutral-800 pb-4">
              <div>
                <h3 className="font-['Russo_One',sans-serif] text-lg text-white uppercase tracking-wider flex items-center gap-2">
                  <Palette className="h-5 w-5 text-[#FFB800]" />
                  <span>Announcement Notice Bar & Color Customization</span>
                </h3>
                <p className="text-xs text-neutral-400 mt-0.5">
                  Customize the announcement banner text, background color, and text color with real-time preview.
                </p>
              </div>

              <button
                onClick={handleSaveConfig}
                disabled={configSaving}
                className="flex items-center justify-center gap-2 rounded-xl bg-[#FFB800] hover:bg-[#FFA500] px-5 py-2.5 text-xs font-['Russo_One',sans-serif] tracking-wider text-black font-bold uppercase transition-all shadow-[0_0_15px_rgba(255,184,0,0.35)]"
              >
                <Save className="h-4 w-4" />
                <span>{configSaving ? 'Saving...' : 'Save Notice Settings'}</span>
              </button>
            </div>

            {/* LIVE PREVIEW OF NOTICE BAR */}
            <div className="rounded-2xl border border-neutral-800 bg-[#0d0d14] p-5 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-['Russo_One',sans-serif] text-neutral-300 uppercase tracking-wider">
                  Live Interactive Preview
                </span>
                <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold ${
                  config.noticeActive ? 'bg-emerald-500/20 text-emerald-400' : 'bg-neutral-800 text-neutral-400'
                }`}>
                  {config.noticeActive ? 'ENABLED' : 'DISABLED'}
                </span>
              </div>

              {/* Preview Bar */}
              <div 
                style={{
                  backgroundColor: config.noticeBgColor || '#FFB800',
                  color: config.noticeTextColor || '#000000'
                }}
                className="rounded-xl px-4 py-2.5 text-xs font-bold font-sans text-center flex items-center justify-center gap-2 tracking-wide shadow-md transition-all"
              >
                <Flame className="h-4 w-4 fill-current shrink-0" />
                <span className="truncate">{config.noticeText || 'Announcement notice text appears here...'}</span>
              </div>
            </div>

            {/* Notice Controls */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              {/* Notice Content & Status */}
              <div className="rounded-2xl border border-neutral-800 bg-[#0d0d14] p-5 space-y-4">
                <h4 className="font-['Russo_One',sans-serif] text-sm text-[#FFB800] uppercase tracking-wider">
                  Notice Content & Display Switch
                </h4>

                <div className="flex items-center justify-between bg-black p-3 rounded-xl border border-neutral-800">
                  <div>
                    <span className="text-xs font-bold text-white block">Enable Notice Bar</span>
                    <span className="text-[11px] text-neutral-400">Display this announcement at the top of the website</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setConfig({ ...config, noticeActive: !config.noticeActive })}
                    className={`px-3 py-1.5 rounded-lg text-xs font-['Russo_One',sans-serif] uppercase font-bold transition-colors ${
                      config.noticeActive
                        ? 'bg-emerald-500 text-black'
                        : 'bg-neutral-800 text-neutral-400'
                    }`}
                  >
                    {config.noticeActive ? 'Active' : 'Off'}
                  </button>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1">
                    Announcement Notice Text
                  </label>
                  <textarea
                    rows={3}
                    value={config.noticeText}
                    onChange={(e) => setConfig({ ...config, noticeText: e.target.value })}
                    className="w-full rounded-xl border border-neutral-700 bg-black px-3.5 py-2.5 text-xs text-white focus:border-[#FFB800] focus:outline-none"
                    placeholder="Enter broadcast announcement..."
                  />
                </div>
              </div>

              {/* Notice Color Controls */}
              <div className="rounded-2xl border border-neutral-800 bg-[#0d0d14] p-5 space-y-4">
                <h4 className="font-['Russo_One',sans-serif] text-sm text-[#FFB800] uppercase tracking-wider">
                  Custom Colors & Presets
                </h4>

                {/* Color Pickers */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                      Background Color
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={config.noticeBgColor || '#FFB800'}
                        onChange={(e) => setConfig({ ...config, noticeBgColor: e.target.value })}
                        className="h-10 w-12 rounded-lg bg-black border border-neutral-700 cursor-pointer p-0.5"
                      />
                      <input
                        type="text"
                        value={config.noticeBgColor || '#FFB800'}
                        onChange={(e) => setConfig({ ...config, noticeBgColor: e.target.value })}
                        className="w-full rounded-xl border border-neutral-700 bg-black px-3 py-2 font-mono text-xs text-white focus:border-[#FFB800] focus:outline-none uppercase"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                      Text & Icon Color
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={config.noticeTextColor || '#000000'}
                        onChange={(e) => setConfig({ ...config, noticeTextColor: e.target.value })}
                        className="h-10 w-12 rounded-lg bg-black border border-neutral-700 cursor-pointer p-0.5"
                      />
                      <input
                        type="text"
                        value={config.noticeTextColor || '#000000'}
                        onChange={(e) => setConfig({ ...config, noticeTextColor: e.target.value })}
                        className="w-full rounded-xl border border-neutral-700 bg-black px-3 py-2 font-mono text-xs text-white focus:border-[#FFB800] focus:outline-none uppercase"
                      />
                    </div>
                  </div>
                </div>

                {/* Quick Presets */}
                <div>
                  <label className="block text-xs font-semibold text-neutral-400 mb-2">
                    Quick Preset Color Schemes:
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {noticeColorPresets.map((scheme, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setConfig({
                          ...config,
                          noticeBgColor: scheme.bg,
                          noticeTextColor: scheme.text
                        })}
                        style={{ backgroundColor: scheme.bg, color: scheme.text }}
                        className="rounded-xl px-2.5 py-2 text-xs font-['Russo_One',sans-serif] uppercase tracking-wider font-bold transition-all shadow-sm hover:scale-[1.02] border border-black/20 truncate"
                      >
                        {scheme.name}
                      </button>
                    ))}
                  </div>
                </div>

              </div>

            </div>

          </div>
        )}

        {/* ================= TAB 3: HERO SLIDES MANAGEMENT (100% ENGLISH) ================= */}
        {activeTab === 'banners' && config && (
          <div className="space-y-6">
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-neutral-800 pb-4">
              <div>
                <h3 className="font-['Russo_One',sans-serif] text-lg text-white uppercase tracking-wider flex items-center gap-2">
                  <Image className="h-5 w-5 text-[#FFB800]" />
                  <span>Hero Slider Banners Manager</span>
                </h3>
                <p className="text-xs text-neutral-400 mt-0.5">
                  Manage headline titles, descriptions, button labels, and add or remove carousel slides.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    const newSlide: HeroSlideConfig = {
                      id: `slide-${Date.now()}`,
                      badge: 'NEW UPDATE',
                      badgeBn: 'NEW UPDATE',
                      mainTitle: 'GARENA FF',
                      subTitleTag: 'OFFICIAL API',
                      heading: 'Official Free Fire Player UID & Account Verification API',
                      headingEn: 'Official Free Fire Player UID & Account Verification API',
                      description: 'Instant 140ms Free Fire player UID lookup with verified in-game nickname, level, and regional server data.',
                      descriptionEn: 'Instant 140ms Free Fire player UID lookup with verified in-game nickname, level, and regional server data.',
                      ctaPrimary: 'Sign In',
                      ctaPrimaryEn: 'Sign In',
                      ctaSecondary: 'Live Sandbox',
                      ctaSecondaryEn: 'Live Sandbox',
                      tagline: 'OFFICIAL API',
                      themeColor: '#FFB800'
                    };
                    setConfig({
                      ...config,
                      heroSlides: [...config.heroSlides, newSlide]
                    });
                  }}
                  className="flex items-center gap-1.5 rounded-xl border border-neutral-700 bg-neutral-900 px-3.5 py-2 text-xs font-mono text-neutral-300 hover:text-white"
                >
                  <Plus className="h-4 w-4" />
                  <span>+ Add Slide</span>
                </button>

                <button
                  onClick={handleSaveConfig}
                  disabled={configSaving}
                  className="flex items-center justify-center gap-2 rounded-xl bg-[#FFB800] hover:bg-[#FFA500] px-5 py-2.5 text-xs font-['Russo_One',sans-serif] tracking-wider text-black font-bold uppercase transition-all shadow-[0_0_15px_rgba(255,184,0,0.35)]"
                >
                  <Save className="h-4 w-4" />
                  <span>{configSaving ? 'Saving...' : 'Save Banners'}</span>
                </button>
              </div>
            </div>

            <div className="space-y-4">
              {config.heroSlides.map((slide, idx) => (
                <div key={slide.id} className="rounded-2xl border border-neutral-800 bg-[#0d0d14] p-5 shadow-lg">
                  <div className="flex items-center justify-between border-b border-neutral-800/80 pb-3 mb-4">
                    <div className="flex items-center gap-2">
                      <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#FFB800] text-black font-['Russo_One',sans-serif] text-xs font-bold">
                        0{idx + 1}
                      </span>
                      <span className="font-['Russo_One',sans-serif] text-sm text-white uppercase tracking-wider">
                        {slide.mainTitle} · {slide.subTitleTag}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      {config.heroSlides.length > 1 && (
                        <button
                          type="button"
                          onClick={() => {
                            if (window.confirm('Delete this slide?')) {
                              setConfig({
                                ...config,
                                heroSlides: config.heroSlides.filter((_, i) => i !== idx)
                              });
                            }
                          }}
                          className="p-1 text-neutral-500 hover:text-rose-400"
                          title="Delete Slide"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] font-semibold text-neutral-300 mb-1">
                        Main Title (Large Font)
                      </label>
                      <input
                        type="text"
                        value={slide.mainTitle}
                        onChange={(e) => {
                          const updated = [...config.heroSlides];
                          updated[idx].mainTitle = e.target.value;
                          setConfig({ ...config, heroSlides: updated });
                        }}
                        className="w-full rounded-xl border border-neutral-700 bg-black px-3 py-2 text-xs font-['Russo_One',sans-serif] text-white focus:border-[#FFB800] focus:outline-none uppercase"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-neutral-300 mb-1">
                        Subtitle Tag (Gold Font)
                      </label>
                      <input
                        type="text"
                        value={slide.subTitleTag}
                        onChange={(e) => {
                          const updated = [...config.heroSlides];
                          updated[idx].subTitleTag = e.target.value;
                          setConfig({ ...config, heroSlides: updated });
                        }}
                        className="w-full rounded-xl border border-neutral-700 bg-black px-3 py-2 text-xs font-mono text-[#FFB800] focus:border-[#FFB800] focus:outline-none uppercase"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-[11px] font-semibold text-neutral-300 mb-1">
                        Headline Text
                      </label>
                      <input
                        type="text"
                        value={slide.heading}
                        onChange={(e) => {
                          const updated = [...config.heroSlides];
                          updated[idx].heading = e.target.value;
                          setConfig({ ...config, heroSlides: updated });
                        }}
                        className="w-full rounded-xl border border-neutral-700 bg-black px-3 py-2 text-xs text-white focus:border-[#FFB800] focus:outline-none"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-[11px] font-semibold text-neutral-300 mb-1">
                        Description
                      </label>
                      <textarea
                        rows={2}
                        value={slide.description}
                        onChange={(e) => {
                          const updated = [...config.heroSlides];
                          updated[idx].description = e.target.value;
                          setConfig({ ...config, heroSlides: updated });
                        }}
                        className="w-full rounded-xl border border-neutral-700 bg-black px-3 py-2 text-xs text-white focus:border-[#FFB800] focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-neutral-300 mb-1">
                        Primary CTA Button Label
                      </label>
                      <input
                        type="text"
                        value={slide.ctaPrimary}
                        onChange={(e) => {
                          const updated = [...config.heroSlides];
                          updated[idx].ctaPrimary = e.target.value;
                          setConfig({ ...config, heroSlides: updated });
                        }}
                        className="w-full rounded-xl border border-neutral-700 bg-black px-3 py-2 text-xs text-[#FFB800] focus:border-[#FFB800] focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-neutral-300 mb-1">
                        Secondary CTA Button Label
                      </label>
                      <input
                        type="text"
                        value={slide.ctaSecondary}
                        onChange={(e) => {
                          const updated = [...config.heroSlides];
                          updated[idx].ctaSecondary = e.target.value;
                          setConfig({ ...config, heroSlides: updated });
                        }}
                        className="w-full rounded-xl border border-neutral-700 bg-black px-3 py-2 text-xs text-white focus:border-[#FFB800] focus:outline-none"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>

          </div>
        )}

        {/* ================= TAB 4: USER MANAGEMENT & BALANCE (100% ENGLISH) ================= */}
        {activeTab === 'users' && (
          <div className="space-y-6">
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-neutral-800 pb-4">
              <div>
                <h3 className="font-['Russo_One',sans-serif] text-lg text-white uppercase tracking-wider flex items-center gap-2">
                  <UserIcon className="h-5 w-5 text-[#FFB800]" />
                  <span>Client Users & Wallet Balance Management</span>
                </h3>
                <p className="text-xs text-neutral-400 mt-0.5">
                  Create client login credentials, add or deduct wallet balance, and manage API keys.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={fetchUsers}
                  disabled={loadingUsers}
                  className="p-2 rounded-xl border border-neutral-700 bg-neutral-900 text-neutral-300 hover:text-white"
                  title="Refresh Users"
                >
                  <RefreshCw className={`h-4 w-4 ${loadingUsers ? 'animate-spin' : ''}`} />
                </button>

                <button
                  onClick={() => setShowCreateUserModal(true)}
                  className="flex items-center justify-center gap-1.5 rounded-xl bg-[#FFB800] hover:bg-[#FFA500] px-4 py-2.5 text-xs font-['Russo_One',sans-serif] tracking-wider text-black font-bold uppercase transition-all shadow-[0_0_12px_rgba(255,184,0,0.35)]"
                >
                  <Plus className="h-4 w-4" />
                  <span>+ Create Client User</span>
                </button>
              </div>
            </div>

            {/* Users Table */}
            <div className="overflow-x-auto rounded-2xl border border-neutral-800 bg-[#0d0d14]">
              <table className="w-full text-left text-xs font-mono">
                <thead className="border-b border-neutral-800 bg-black/80 text-neutral-400">
                  <tr>
                    <th className="py-3 px-3.5">User ID</th>
                    <th className="py-3 px-3.5">Password</th>
                    <th className="py-3 px-3.5">Client Store</th>
                    <th className="py-3 px-3.5 text-right">Wallet Balance</th>
                    <th className="py-3 px-3.5 text-center">Balance Action</th>
                    <th className="py-3 px-3.5">Master API Key</th>
                    <th className="py-3 px-3.5 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-800/60">
                  {users.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-12 text-center text-neutral-500 font-sans">
                        No client accounts found
                      </td>
                    </tr>
                  ) : (
                    users.map((u) => (
                      <tr key={u.id} className="hover:bg-neutral-850/50">
                        
                        {/* Username & ID */}
                        <td className="py-3 px-3.5">
                          <div className="font-bold text-white text-sm">{u.username}</div>
                          <div className="text-[10px] text-neutral-500 font-mono">{u.id}</div>
                        </td>

                        {/* Password with View toggle */}
                        <td className="py-3 px-3.5">
                          <div className="flex items-center gap-1.5">
                            <span className="text-neutral-300 font-bold">
                              {showPasswords[u.id] ? u.password : '••••••••'}
                            </span>
                            <button
                              type="button"
                              onClick={() => setShowPasswords({ ...showPasswords, [u.id]: !showPasswords[u.id] })}
                              className="text-neutral-500 hover:text-white"
                            >
                              {showPasswords[u.id] ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                            </button>
                            <button
                              type="button"
                              onClick={() => setPasswordModal({ isOpen: true, user: u, newPass: '' })}
                              className="text-[10px] text-[#FFB800] hover:underline ml-1"
                              title="Edit Password"
                            >
                              Edit
                            </button>
                          </div>
                        </td>

                        {/* Company / Name */}
                        <td className="py-3 px-3.5 text-neutral-300">
                          <div>{u.companyName}</div>
                          <div className="text-[10px] text-neutral-500">{u.phone}</div>
                        </td>

                        {/* Balance */}
                        <td className="py-3 px-3.5 text-right font-bold text-base text-[#FFB800] tabular-nums">
                          ৳{u.balance.toFixed(2)}
                        </td>

                        {/* Balance Control Buttons */}
                        <td className="py-3 px-3.5 text-center">
                          <div className="inline-flex items-center gap-1.5">
                            <button
                              onClick={() => setBalanceModal({ isOpen: true, user: u, action: 'add', amount: '100' })}
                              className="rounded-lg bg-emerald-500/20 border border-emerald-500/40 px-2.5 py-1 text-[11px] font-bold text-emerald-400 hover:bg-emerald-500/30"
                            >
                              + Add BDT
                            </button>
                            <button
                              onClick={() => setBalanceModal({ isOpen: true, user: u, action: 'deduct', amount: '50' })}
                              className="rounded-lg bg-rose-500/20 border border-rose-500/40 px-2.5 py-1 text-[11px] font-bold text-rose-400 hover:bg-rose-500/30"
                            >
                              - Deduct
                            </button>
                          </div>
                        </td>

                        {/* API Key */}
                        <td className="py-3 px-3.5">
                          <div className="flex items-center gap-1.5">
                            <code className="text-[11px] text-neutral-300 bg-black px-2 py-0.5 rounded border border-neutral-800">
                              {u.primaryApiKey.slice(0, 10)}•••
                            </code>
                            <button
                              onClick={() => handleResetKey(u.id)}
                              className="text-[10px] text-neutral-400 hover:text-white"
                              title="Reset Key"
                            >
                              Reset
                            </button>
                          </div>
                        </td>

                        {/* Delete User */}
                        <td className="py-3 px-3.5 text-center">
                          <button
                            onClick={() => handleDeleteUser(u.id)}
                            className="p-1.5 text-neutral-500 hover:text-rose-400 transition-colors"
                            title="Delete User"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </td>

                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

          </div>
        )}

        {/* ================= TAB 5: STATS & PLATFORM METRICS ================= */}
        {activeTab === 'stats' && (
          <div className="space-y-6">
            <h3 className="font-['Russo_One',sans-serif] text-lg text-white uppercase tracking-wider">
              Platform Analytics & Server Health
            </h3>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="rounded-2xl border border-neutral-800 bg-[#0d0d14] p-5">
                <span className="text-xs text-neutral-400">Total Client Users</span>
                <div className="mt-1 font-mono text-2xl font-bold text-[#FFB800]">{users.length}</div>
              </div>

              <div className="rounded-2xl border border-neutral-800 bg-[#0d0d14] p-5">
                <span className="text-xs text-neutral-400">Total System Balance</span>
                <div className="mt-1 font-mono text-2xl font-bold text-emerald-400">
                  ৳{users.reduce((acc, u) => acc + (u.balance || 0), 0).toFixed(2)}
                </div>
              </div>

              <div className="rounded-2xl border border-neutral-800 bg-[#0d0d14] p-5">
                <span className="text-xs text-neutral-400">Cost Per Check</span>
                <div className="mt-1 font-mono text-2xl font-bold text-white">
                  ৳{config?.costPerCheck.toFixed(2) || '0.05'}
                </div>
              </div>

              <div className="rounded-2xl border border-neutral-800 bg-[#0d0d14] p-5">
                <span className="text-xs text-neutral-400">Gateway Status</span>
                <div className="mt-1 font-mono text-2xl font-bold text-emerald-400">24/7 ONLINE</div>
              </div>
            </div>
          </div>
        )}

        {/* ================= TAB 6: ADMIN SECURITY & PASSWORD SETTINGS ================= */}
        {activeTab === 'security' && (
          <div className="space-y-6 max-w-4xl">
            <div>
              <h3 className="font-['Russo_One',sans-serif] text-lg text-white uppercase tracking-wider flex items-center gap-2">
                <KeyRound className="h-5 w-5 text-[#FFB800]" />
                <span>Admin Credentials & Security Settings</span>
              </h3>
              <p className="mt-1 text-xs text-neutral-400 font-sans">
                Change your ATX Master Admin login username and password. Changes take effect immediately across all sessions.
              </p>
            </div>

            {/* Success message */}
            {passChangeSuccess && (
              <div className="rounded-2xl border border-emerald-500/40 bg-emerald-950/30 p-4 text-xs text-emerald-300 flex items-center gap-3 shadow-lg">
                <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-400" />
                <span className="font-sans font-medium">{passChangeSuccess}</span>
              </div>
            )}

            {/* Error message */}
            {passChangeError && (
              <div className="rounded-2xl border border-rose-500/40 bg-rose-950/30 p-4 text-xs text-rose-300 flex items-center gap-3 shadow-lg">
                <AlertCircle className="h-5 w-5 shrink-0 text-rose-400" />
                <span className="font-sans font-medium">{passChangeError}</span>
              </div>
            )}

            {/* Form Card */}
            <div className="rounded-2xl border border-neutral-800 bg-[#0d0d14] p-6 sm:p-8 shadow-xl space-y-6">
              <form onSubmit={handleChangeAdminPassword} className="space-y-5">
                
                {/* Username Field */}
                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1.5 uppercase font-mono">
                    Admin Username
                  </label>
                  <input
                    type="text"
                    placeholder="ATX"
                    value={newAdminUser}
                    onChange={(e) => setNewAdminUser(e.target.value)}
                    className="w-full rounded-xl border border-neutral-700 bg-black px-4 py-2.5 font-mono text-sm text-[#FFB800] uppercase placeholder-neutral-600 focus:border-[#FFB800] focus:outline-none transition-colors"
                  />
                  <p className="mt-1 text-[11px] text-neutral-500 font-mono">
                    Optional: Leave blank to keep current username (ATX).
                  </p>
                </div>

                {/* Current Password Field */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-semibold text-neutral-300 uppercase font-mono">
                      Current Admin Password *
                    </label>
                    <button
                      type="button"
                      onClick={() => setShowCurrPass(!showCurrPass)}
                      className="text-[11px] text-neutral-400 hover:text-white flex items-center gap-1 font-mono transition-colors"
                    >
                      {showCurrPass ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                      <span>{showCurrPass ? 'Hide' : 'Show'}</span>
                    </button>
                  </div>
                  <input
                    type={showCurrPass ? 'text' : 'password'}
                    required
                    placeholder="Enter your current password (default: 112233)"
                    value={currAdminPass}
                    onChange={(e) => setCurrAdminPass(e.target.value)}
                    className="w-full rounded-xl border border-neutral-700 bg-black px-4 py-2.5 font-mono text-sm text-white placeholder-neutral-600 focus:border-[#FFB800] focus:outline-none transition-colors"
                  />
                </div>

                {/* New Password Field */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-semibold text-neutral-300 uppercase font-mono">
                      New Admin Password *
                    </label>
                    <button
                      type="button"
                      onClick={() => setShowNewPass(!showNewPass)}
                      className="text-[11px] text-neutral-400 hover:text-white flex items-center gap-1 font-mono transition-colors"
                    >
                      {showNewPass ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                      <span>{showNewPass ? 'Hide' : 'Show'}</span>
                    </button>
                  </div>
                  <input
                    type={showNewPass ? 'text' : 'password'}
                    required
                    placeholder="Enter new password (min. 4 characters)"
                    value={newAdminPass}
                    onChange={(e) => setNewAdminPass(e.target.value)}
                    className="w-full rounded-xl border border-neutral-700 bg-black px-4 py-2.5 font-mono text-sm text-[#FFB800] placeholder-neutral-600 focus:border-[#FFB800] focus:outline-none transition-colors"
                  />
                </div>

                {/* Confirm New Password Field */}
                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1.5 uppercase font-mono">
                    Confirm New Admin Password *
                  </label>
                  <input
                    type={showNewPass ? 'text' : 'password'}
                    required
                    placeholder="Re-type new password"
                    value={confirmAdminPass}
                    onChange={(e) => setConfirmAdminPass(e.target.value)}
                    className="w-full rounded-xl border border-neutral-700 bg-black px-4 py-2.5 font-mono text-sm text-[#FFB800] placeholder-neutral-600 focus:border-[#FFB800] focus:outline-none transition-colors"
                  />
                  {newAdminPass && confirmAdminPass && (
                    <div className="mt-1 text-[11px] font-mono">
                      {newAdminPass === confirmAdminPass ? (
                        <span className="text-emerald-400 flex items-center gap-1">
                          <Check className="h-3 w-3" /> Passwords match
                        </span>
                      ) : (
                        <span className="text-rose-400 flex items-center gap-1">
                          <AlertCircle className="h-3 w-3" /> Passwords do not match
                        </span>
                      )}
                    </div>
                  )}
                </div>

                {/* Submit button */}
                <div className="pt-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-t border-neutral-800">
                  <div className="text-[11px] text-neutral-500 font-mono flex items-center gap-1.5">
                    <Lock className="h-3.5 w-3.5 text-[#FFB800]" />
                    <span>Encrypted with SHA & Server Authentication Token</span>
                  </div>
                  <button
                    type="submit"
                    disabled={passChangeLoading}
                    className="flex items-center justify-center gap-2 rounded-xl bg-[#FFB800] hover:bg-[#FFA500] px-6 py-2.5 text-xs font-['Russo_One',sans-serif] tracking-wider text-black transition-all shadow-[0_0_15px_rgba(255,184,0,0.3)] uppercase font-bold disabled:opacity-50"
                  >
                    {passChangeLoading ? (
                      <RefreshCw className="h-4 w-4 animate-spin" />
                    ) : (
                      <Save className="h-4 w-4" />
                    )}
                    <span>Save New Password</span>
                  </button>
                </div>

              </form>
            </div>

            {/* Security Session Info Card */}
            <div className="rounded-2xl border border-neutral-800 bg-neutral-900/40 p-5 font-mono text-xs space-y-2">
              <div className="flex items-center justify-between text-neutral-400">
                <span>Access URL:</span>
                <span className="text-cyan-400 font-bold">/admin84326</span>
              </div>
              <div className="flex items-center justify-between text-neutral-400">
                <span>Admin Role:</span>
                <span className="text-[#FFB800] font-bold">MASTER SUPER_ADMIN</span>
              </div>
              <div className="flex items-center justify-between text-neutral-400">
                <span>Session Status:</span>
                <span className="text-emerald-400 font-bold">Active Authenticated Session</span>
              </div>
            </div>

          </div>
        )}

      </main>

      {/* ================= MODAL: CREATE USER ================= */}
      {showCreateUserModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-md">
          <div className="w-full max-w-md rounded-2xl border border-neutral-800 bg-[#0e0e14] p-6 shadow-2xl">
            <h3 className="font-['Russo_One',sans-serif] text-base text-white uppercase tracking-wider flex items-center gap-2">
              <UserIcon className="h-5 w-5 text-[#FFB800]" />
              <span>Create New Client User</span>
            </h3>
            <p className="mt-1 text-xs text-neutral-400">
              Generate credentials and allocate wallet balance. The client can immediately sign in and use the Garena API.
            </p>

            {createUserError && (
              <div className="mt-3 rounded-xl border border-rose-500/40 bg-rose-950/40 p-2.5 text-xs text-rose-300">
                {createUserError}
              </div>
            )}

            <form onSubmit={handleCreateUser} className="mt-4 space-y-3 font-sans">
              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1">
                  Username *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. diamond_shop_bd"
                  value={newUsername}
                  onChange={(e) => setNewUsername(e.target.value)}
                  className="w-full rounded-xl border border-neutral-700 bg-black px-3.5 py-2 font-mono text-xs text-[#FFB800] focus:border-[#FFB800] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1">
                  Login Password *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. securePass123"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full rounded-xl border border-neutral-700 bg-black px-3.5 py-2 font-mono text-xs text-white focus:border-[#FFB800] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1">
                  Starting Balance (BDT)
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min="0"
                    value={newBalance}
                    onChange={(e) => setNewBalance(e.target.value)}
                    className="w-full rounded-xl border border-neutral-700 bg-black px-3.5 py-2 font-mono text-xs text-emerald-400 focus:border-[#FFB800] focus:outline-none font-bold"
                  />
                  <span className="text-xs text-neutral-400 font-mono">BDT</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1">
                    Store Name
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Topup Hub"
                    value={newCompanyName}
                    onChange={(e) => setNewCompanyName(e.target.value)}
                    className="w-full rounded-xl border border-neutral-700 bg-black px-3 py-2 text-xs text-white focus:border-[#FFB800] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1">
                    Contact Phone
                  </label>
                  <input
                    type="text"
                    placeholder="017XXXXXXXX"
                    value={newPhone}
                    onChange={(e) => setNewPhone(e.target.value)}
                    className="w-full rounded-xl border border-neutral-700 bg-black px-3 py-2 font-mono text-xs text-white focus:border-[#FFB800] focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-neutral-800">
                <button
                  type="button"
                  onClick={() => setShowCreateUserModal(false)}
                  className="rounded-xl border border-neutral-700 px-4 py-2 text-xs text-neutral-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-[#FFB800] px-5 py-2 text-xs font-['Russo_One',sans-serif] text-black font-bold uppercase"
                >
                  Create User
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL: BALANCE UPDATE ================= */}
      {balanceModal.isOpen && balanceModal.user && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-md">
          <div className="w-full max-w-sm rounded-2xl border border-neutral-800 bg-[#0e0e14] p-6 shadow-2xl">
            <h3 className="font-['Russo_One',sans-serif] text-base text-white uppercase tracking-wider flex items-center gap-2">
              <Wallet className="h-5 w-5 text-[#FFB800]" />
              <span>
                {balanceModal.action === 'add' ? 'Add Balance (BDT)' : 'Deduct Balance (BDT)'}
              </span>
            </h3>

            <div className="mt-3 rounded-xl bg-black p-3 border border-neutral-800 text-xs font-mono">
              <div>User: <strong className="text-white">{balanceModal.user.username}</strong></div>
              <div>Current Balance: <strong className="text-[#FFB800]">৳{balanceModal.user.balance.toFixed(2)}</strong></div>
            </div>

            <div className="mt-4 space-y-3 font-sans">
              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1">
                  Amount (BDT)
                </label>
                <div className="flex gap-2 mb-2">
                  {['50', '100', '200', '500'].map((amt) => (
                    <button
                      key={amt}
                      type="button"
                      onClick={() => setBalanceModal({ ...balanceModal, amount: amt })}
                      className="rounded-lg bg-neutral-900 border border-neutral-800 px-2.5 py-1 text-xs font-mono text-neutral-300 hover:text-[#FFB800]"
                    >
                      ৳{amt}
                    </button>
                  ))}
                </div>
                <input
                  type="number"
                  min="1"
                  value={balanceModal.amount}
                  onChange={(e) => setBalanceModal({ ...balanceModal, amount: e.target.value })}
                  className="w-full rounded-xl border border-neutral-700 bg-black px-3.5 py-2.5 font-mono text-sm text-[#FFB800] focus:border-[#FFB800] focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-neutral-800">
                <button
                  type="button"
                  onClick={() => setBalanceModal({ isOpen: false, user: null, action: 'add', amount: '100' })}
                  className="rounded-xl border border-neutral-700 px-4 py-2 text-xs text-neutral-300"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleBalanceSubmit}
                  className={`rounded-xl px-5 py-2 text-xs font-['Russo_One',sans-serif] font-bold uppercase ${
                    balanceModal.action === 'add'
                      ? 'bg-emerald-500 text-black hover:bg-emerald-400'
                      : 'bg-rose-500 text-white hover:bg-rose-600'
                  }`}
                >
                  {balanceModal.action === 'add' ? 'Confirm Addition' : 'Confirm Deduction'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL: EDIT PASSWORD ================= */}
      {passwordModal.isOpen && passwordModal.user && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-md">
          <div className="w-full max-w-sm rounded-2xl border border-neutral-800 bg-[#0e0e14] p-6 shadow-2xl">
            <h3 className="font-['Russo_One',sans-serif] text-base text-white uppercase tracking-wider flex items-center gap-2">
              <Lock className="h-5 w-5 text-[#FFB800]" />
              <span>Update User Password</span>
            </h3>
            <p className="mt-1 text-xs text-neutral-400 font-mono">
              User: {passwordModal.user.username}
            </p>

            <div className="mt-4 space-y-3 font-sans">
              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1">
                  New Password
                </label>
                <input
                  type="text"
                  required
                  placeholder="Enter new password"
                  value={passwordModal.newPass}
                  onChange={(e) => setPasswordModal({ ...passwordModal, newPass: e.target.value })}
                  className="w-full rounded-xl border border-neutral-700 bg-black px-3.5 py-2.5 font-mono text-sm text-white focus:border-[#FFB800] focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-neutral-800">
                <button
                  type="button"
                  onClick={() => setPasswordModal({ isOpen: false, user: null, newPass: '' })}
                  className="rounded-xl border border-neutral-700 px-4 py-2 text-xs text-neutral-300"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handlePasswordSubmit}
                  className="rounded-xl bg-[#FFB800] px-5 py-2 text-xs font-['Russo_One',sans-serif] text-black font-bold uppercase"
                >
                  Save Password
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
