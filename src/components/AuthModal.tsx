import React, { useState } from 'react';
import { 
  LogIn, X, AlertCircle, 
  Lock, User as UserIcon, Eye, EyeOff, ShieldAlert, MessageCircle
} from 'lucide-react';
import { FreeFireIcon } from './FreeFireIcon';
import { apiClient } from '../lib/apiClient';
import { User } from '../types';

interface AuthModalProps {
  onClose: () => void;
  onSuccess: (user: User) => void;
  whatsappNumber?: string;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  onClose,
  onSuccess,
  whatsappNumber = '01608880183'
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  // Form states
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  // Clean and format WhatsApp phone number (BD default)
  const rawDigits = whatsappNumber.replace(/[^0-9]/g, '');
  const cleanPhone = rawDigits.startsWith('88') 
    ? rawDigits 
    : `88${rawDigits.startsWith('0') ? rawDigits : '0' + rawDigits}`;
  const whatsappUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent("Hello Admin, I need API access credentials for Garena API Gateway.")}`;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const res = await apiClient.login(username.trim(), password);
    setLoading(false);
    if (res.status && res.user) {
      onSuccess(res.user);
      onClose();
    } else {
      setError(res.message || 'Sign in failed. Please verify your username and password.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/85 p-0 sm:p-4 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-md rounded-t-3xl sm:rounded-2xl border-t sm:border border-neutral-800 bg-[#0e0e14] p-5 sm:p-7 shadow-2xl">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-full p-2 text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors z-10"
          aria-label="Close"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Modal Header */}
        <div className="text-center pt-1 sm:pt-0">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-black border border-[#FFB800]/40 text-[#FFB800] mb-2.5 shadow-[0_0_15px_rgba(255,184,0,0.3)] p-1.5">
            <FreeFireIcon className="h-7 w-7 fill-current text-[#FFB800]" />
          </div>
          <h2 className="text-xl sm:text-2xl font-['Russo_One',sans-serif] tracking-wide text-white uppercase">
            DEVELOPER SIGN IN
          </h2>
          <p className="mt-1 text-xs text-neutral-400 font-sans max-w-xs mx-auto">
            Enter your client credentials to access your API keys and wallet balance
          </p>
        </div>

        {error && (
          <div className="mt-3.5 rounded-xl border border-rose-500/40 bg-rose-950/40 p-3 text-xs text-rose-300 flex items-center gap-2 font-sans">
            <AlertCircle className="h-4 w-4 shrink-0 text-rose-400" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-5 space-y-4 font-sans">
          
          {/* Username Field */}
          <div>
            <label className="block text-xs font-semibold text-neutral-300 mb-1.5 flex items-center justify-between">
              <span>Username or Client ID</span>
            </label>
            <div className="relative">
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="e.g. garena_dev"
                className="w-full rounded-xl border border-neutral-700 bg-black pl-10 pr-4 py-2.5 text-xs text-white placeholder-neutral-600 focus:border-[#FFB800] focus:outline-none font-mono"
              />
              <UserIcon className="absolute left-3 top-3 h-4 w-4 text-neutral-500" />
            </div>
          </div>

          {/* Password Field */}
          <div>
            <label className="block text-xs font-semibold text-neutral-300 mb-1.5 flex items-center justify-between">
              <span>Password</span>
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-xl border border-neutral-700 bg-black pl-10 pr-10 py-2.5 text-xs text-white placeholder-neutral-600 focus:border-[#FFB800] focus:outline-none font-mono"
              />
              <Lock className="absolute left-3 top-3 h-4 w-4 text-neutral-500" />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-2.5 text-neutral-500 hover:text-white"
                tabIndex={-1}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 rounded-xl bg-[#FFB800] hover:bg-[#FFA500] py-3 text-xs font-['Russo_One',sans-serif] tracking-wider text-black transition-all shadow-[0_0_20px_rgba(255,184,0,0.35)] active:scale-[0.98] disabled:opacity-50 uppercase font-bold"
          >
            {loading ? (
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-black border-t-transparent" />
            ) : (
              <LogIn className="h-4 w-4" />
            )}
            <span>{loading ? 'Authenticating...' : 'Sign In to Portal'}</span>
          </button>

          {/* Notice to Contact Admin for Access - Redirects to WhatsApp */}
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="group block rounded-xl border border-neutral-800 hover:border-emerald-500/60 bg-[#07070b] hover:bg-emerald-950/20 p-3.5 text-center transition-all cursor-pointer shadow-md"
          >
            <div className="flex items-center justify-center gap-1.5 text-neutral-300 group-hover:text-emerald-400 font-mono text-xs font-semibold">
              <ShieldAlert className="h-4 w-4 text-[#FFB800] group-hover:text-emerald-400 transition-colors" />
              <span>Need API access credentials?</span>
            </div>
            <p className="mt-1 text-[11px] text-neutral-400 group-hover:text-neutral-300">
              New accounts are created directly by the system admin. Click below to get instant API credentials via WhatsApp.
            </p>
            <div className="mt-2.5 flex items-center justify-center gap-2 w-full rounded-lg bg-emerald-600 hover:bg-emerald-500 py-2.5 px-3 text-xs font-['Russo_One',sans-serif] text-white tracking-wider uppercase transition-colors shadow-md shadow-emerald-950/40">
              <MessageCircle className="h-4 w-4 fill-current shrink-0" />
              <span>Chat on WhatsApp: {whatsappNumber || '01608880183'}</span>
            </div>
          </a>

        </form>

      </div>
    </div>
  );
};
