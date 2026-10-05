import React, { useState } from 'react';
import { 
  Globe, LogIn, LayoutDashboard, ExternalLink, Menu, X, 
  ChevronDown, Wallet, Terminal, Home, Zap, BookOpen, Shield, LogOut
} from 'lucide-react';
import { FreeFireIcon } from './FreeFireIcon';
import { User, SiteConfig } from '../types';
import { Language } from '../lib/translations';

interface NavbarProps {
  lang: Language;
  onToggleLang: () => void;
  currentUser: User | null;
  activeView: 'home' | 'dashboard' | 'playground' | 'docs';
  onNavigate: (view: 'home' | 'dashboard' | 'playground' | 'docs') => void;
  onOpenAuth: () => void;
  onOpenAdmin: () => void;
  onLogout: () => void;
  siteConfig: SiteConfig | null;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentUser,
  activeView,
  onNavigate,
  onOpenAuth,
  onOpenAdmin,
  onLogout,
  siteConfig
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showServicesDropdown, setShowServicesDropdown] = useState(false);

  const brandName = siteConfig?.brandName || 'GARENA';
  const brandTag = siteConfig?.brandTag || 'API';

  const handleMobileNav = (view: 'home' | 'dashboard' | 'playground' | 'docs') => {
    onNavigate(view);
    setMobileMenuOpen(false);
  };

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-neutral-800 bg-[#060608]/95 backdrop-blur-md">
        
        {/* Global Notice Bar (customizable from admin panel) */}
        {siteConfig?.noticeActive && siteConfig.noticeText && (
          <div 
            style={{
              backgroundColor: siteConfig.noticeBgColor || '#FFB800',
              color: siteConfig.noticeTextColor || '#000000'
            }}
            className="px-4 py-1.5 text-xs font-bold font-sans text-center flex items-center justify-center gap-2 tracking-wide shadow-sm"
          >
            <FreeFireIcon className="h-3.5 w-3.5 fill-current shrink-0" />
            <span className="truncate">{siteConfig.noticeText}</span>
          </div>
        )}

        <div className="mx-auto flex h-14 sm:h-16 max-w-7xl items-center justify-between px-3 sm:px-6 lg:px-8">
          
          {/* Left: Brand Logo + Wordmark */}
          <div className="flex items-center gap-2 sm:gap-6 shrink-0">
            <button
              onClick={() => onNavigate('home')}
              className="group flex items-center gap-2 text-left focus:outline-none"
            >
              {/* Free Fire Iconic Stylized Slanted 'F' Logo */}
              <div className="relative flex h-8 w-8 items-center justify-center">
                <svg 
                  viewBox="0 0 100 100" 
                  className="h-7 w-7 drop-shadow-[0_0_10px_rgba(255,184,0,0.6)] group-hover:scale-105 transition-transform"
                >
                  <path 
                    d="M18 12 L84 12 L76 34 L42 34 L38 46 L70 46 L62 66 L32 66 L24 92 L2 92 Z" 
                    fill="#FFB800" 
                  />
                  <polygon points="56,16 66,16 61,29 51,29" fill="#060608" opacity="0.25" />
                </svg>
              </div>

              <div className="flex flex-col">
                <div className="flex items-center gap-1">
                  <span className="font-['Russo_One',sans-serif] text-base sm:text-lg font-black tracking-wider text-white">
                    {brandName}
                  </span>
                  <span className="font-['Russo_One',sans-serif] text-base sm:text-lg font-black tracking-wider text-[#FFB800]">
                    {brandTag}
                  </span>
                </div>
                <span className="hidden xs:block text-[8px] font-bold tracking-[0.18em] text-neutral-400 uppercase -mt-1 font-mono">
                  Official Gateway
                </span>
              </div>
            </button>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center gap-6 text-xs font-bold uppercase tracking-wider text-neutral-300">
              <div 
                className="relative"
                onMouseEnter={() => setShowServicesDropdown(true)}
                onMouseLeave={() => setShowServicesDropdown(false)}
              >
                <button 
                  onClick={() => onNavigate('home')}
                  className="flex items-center gap-1 hover:text-[#FFB800] transition-colors py-2"
                >
                  <span>SERVICES</span>
                  <ChevronDown className="h-3 w-3 text-neutral-500" />
                </button>

                {showServicesDropdown && (
                  <div className="absolute top-full left-0 w-56 rounded-xl border border-neutral-800 bg-[#0d0d12] p-2 shadow-2xl backdrop-blur-xl">
                    <button
                      onClick={() => { onNavigate('home'); setShowServicesDropdown(false); }}
                      className="w-full text-left rounded-lg px-3 py-2 text-xs font-semibold text-neutral-200 hover:bg-neutral-800/80 hover:text-[#FFB800]"
                    >
                      Player UID Verification
                    </button>
                    <button
                      onClick={() => { onNavigate('docs'); setShowServicesDropdown(false); }}
                      className="w-full text-left rounded-lg px-3 py-2 text-xs font-semibold text-neutral-200 hover:bg-neutral-800/80 hover:text-[#FFB800]"
                    >
                      Multi-Site Sub-API Keys
                    </button>
                    <button
                      onClick={() => { onNavigate('playground'); setShowServicesDropdown(false); }}
                      className="w-full text-left rounded-lg px-3 py-2 text-xs font-semibold text-neutral-200 hover:bg-neutral-800/80 hover:text-[#FFB800]"
                    >
                      Live REST Sandbox
                    </button>
                  </div>
                )}
              </div>

              <button
                onClick={() => onNavigate('playground')}
                className={`hover:text-[#FFB800] transition-colors ${
                  activeView === 'playground' ? 'text-[#FFB800]' : ''
                }`}
              >
                LIVE CHECKER
              </button>

              <button
                onClick={() => onNavigate('docs')}
                className={`hover:text-[#FFB800] transition-colors ${
                  activeView === 'docs' ? 'text-[#FFB800]' : ''
                }`}
              >
                SUB-API DOCS
              </button>

              {currentUser && (
                <button
                  onClick={() => onNavigate('dashboard')}
                  className={`hover:text-[#FFB800] transition-colors flex items-center gap-1.5 ${
                    activeView === 'dashboard' ? 'text-[#FFB800]' : ''
                  }`}
                >
                  <LayoutDashboard className="h-3.5 w-3.5" />
                  <span>DASHBOARD</span>
                </button>
              )}

              <a
                href={siteConfig?.telegramLink || "https://t.me"}
                target="_blank"
                rel="noreferrer"
                className="hover:text-[#FFB800] transition-colors flex items-center gap-1 text-neutral-400"
              >
                <span>TELEGRAM</span>
                <ExternalLink className="h-3 w-3" />
              </a>
            </nav>
          </div>

          {/* Right Action Zone */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* User status */}
            {currentUser ? (
              <div className="flex items-center gap-1.5 sm:gap-2.5">
                {/* Mobile & Desktop Wallet Pill */}
                <button
                  onClick={() => onNavigate('dashboard')}
                  className="flex items-center gap-1.5 rounded-lg border border-[#FFB800]/40 bg-[#FFB800]/10 px-2.5 py-1.5 text-xs font-mono font-bold text-[#FFB800] hover:bg-[#FFB800]/20 transition-colors"
                  title="View Balance"
                >
                  <Wallet className="h-3.5 w-3.5 text-[#FFB800]" />
                  <span className="tabular-nums">৳{currentUser.balance.toFixed(2)}</span>
                </button>

                {/* Desktop Dashboard Button */}
                <button
                  onClick={() => onNavigate('dashboard')}
                  className="hidden md:flex items-center gap-1.5 rounded-lg bg-[#FFB800] hover:bg-[#FFA500] px-3.5 py-1.5 text-xs font-['Russo_One',sans-serif] tracking-wider text-black transition-all shadow-[0_0_12px_rgba(255,184,0,0.35)] uppercase font-bold"
                >
                  <LayoutDashboard className="h-3.5 w-3.5 text-black" />
                  <span className="truncate max-w-[100px]">{currentUser.username}</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-1.5 sm:gap-2">
                <button
                  onClick={onOpenAuth}
                  className="flex items-center gap-1.5 rounded-lg bg-[#FFB800] hover:bg-[#FFA500] px-3.5 sm:px-4 py-1.5 sm:py-2 text-[11px] sm:text-xs font-['Russo_One',sans-serif] tracking-wider text-black transition-all shadow-[0_0_15px_rgba(255,184,0,0.35)] uppercase font-bold whitespace-nowrap"
                >
                  <LogIn className="h-3.5 w-3.5 text-black shrink-0" />
                  <span>SIGN IN</span>
                </button>
              </div>
            )}

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="flex lg:hidden items-center justify-center h-9 w-9 rounded-xl border border-neutral-800 bg-neutral-900/90 text-neutral-200 hover:text-[#FFB800] hover:border-[#FFB800] transition-colors p-1 shrink-0"
              aria-label="Open mobile menu"
            >
              <Menu className="h-5 w-5" />
            </button>

          </div>

        </div>
      </header>

      {/* Pro Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div 
            onClick={() => setMobileMenuOpen(false)}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity" 
          />

          <div className="fixed inset-y-0 right-0 w-full max-w-xs bg-[#0b0b12] border-l border-neutral-800 p-5 shadow-2xl flex flex-col justify-between overflow-y-auto">
            
            {/* Top Bar of Drawer */}
            <div>
              <div className="flex items-center justify-between border-b border-neutral-800/80 pb-4">
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#FFB800] p-1 shadow-md">
                    <FreeFireIcon className="h-6 w-6 text-black fill-current" />
                  </div>
                  <div>
                    <span className="font-['Russo_One',sans-serif] text-base font-bold text-white tracking-wider">
                      {brandName} <span className="text-[#FFB800]">{brandTag}</span>
                    </span>
                    <span className="block text-[9px] text-neutral-400 font-mono">Mobile Gateway</span>
                  </div>
                </div>

                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="rounded-lg p-1.5 text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
                  aria-label="Close menu"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* User Account Info Card in Drawer */}
              {currentUser ? (
                <div className="mt-4 rounded-xl border border-neutral-800 bg-[#12121c] p-3.5 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-black border border-[#FFB800]/40 text-[#FFB800] font-['Russo_One',sans-serif] text-xs">
                        {currentUser.username.slice(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <div className="font-bold text-white text-xs">{currentUser.username}</div>
                        <div className="text-[10px] text-neutral-400 font-mono">ID: {currentUser.id}</div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between rounded-lg bg-black px-3 py-2 border border-neutral-800">
                    <div>
                      <span className="block text-[9px] text-neutral-400 font-mono uppercase">BALANCE</span>
                      <span className="font-mono text-sm font-bold text-[#FFB800] tabular-nums">
                        ৳{currentUser.balance.toFixed(2)}
                      </span>
                    </div>
                    <button
                      onClick={() => handleMobileNav('dashboard')}
                      className="rounded bg-[#FFB800] px-2.5 py-1 text-[10px] font-['Russo_One',sans-serif] text-black font-bold uppercase"
                    >
                      WALLET
                    </button>
                  </div>
                </div>
              ) : (
                <div className="mt-4">
                  <button
                    onClick={() => { onOpenAuth(); setMobileMenuOpen(false); }}
                    className="w-full rounded-xl bg-[#FFB800] py-3 text-center text-xs font-['Russo_One',sans-serif] font-bold text-black uppercase shadow-lg shadow-[#FFB800]/20"
                  >
                    SIGN IN
                  </button>
                </div>
              )}

              {/* Navigation Links List */}
              <div className="mt-5 space-y-1.5 font-['Russo_One',sans-serif] text-xs tracking-wider">
                <button
                  onClick={() => handleMobileNav('home')}
                  className={`w-full flex items-center gap-3 rounded-xl px-3.5 py-3 transition-colors ${
                    activeView === 'home'
                      ? 'bg-[#FFB800] text-black font-bold'
                      : 'text-neutral-300 hover:bg-neutral-900 hover:text-white'
                  }`}
                >
                  <Home className="h-4 w-4" />
                  <span>HOME</span>
                </button>

                <button
                  onClick={() => handleMobileNav('playground')}
                  className={`w-full flex items-center gap-3 rounded-xl px-3.5 py-3 transition-colors ${
                    activeView === 'playground'
                      ? 'bg-[#FFB800] text-black font-bold'
                      : 'text-neutral-300 hover:bg-neutral-900 hover:text-white'
                  }`}
                >
                  <Zap className="h-4 w-4" />
                  <span>LIVE CHECKER</span>
                </button>

                <button
                  onClick={() => handleMobileNav('docs')}
                  className={`w-full flex items-center gap-3 rounded-xl px-3.5 py-3 transition-colors ${
                    activeView === 'docs'
                      ? 'bg-[#FFB800] text-black font-bold'
                      : 'text-neutral-300 hover:bg-neutral-900 hover:text-white'
                  }`}
                >
                  <BookOpen className="h-4 w-4" />
                  <span>SUB-API DOCS & SDK</span>
                </button>

                {currentUser && (
                  <button
                    onClick={() => handleMobileNav('dashboard')}
                    className={`w-full flex items-center gap-3 rounded-xl px-3.5 py-3 transition-colors ${
                      activeView === 'dashboard'
                        ? 'bg-[#FFB800] text-black font-bold'
                        : 'text-neutral-300 hover:bg-neutral-900 hover:text-white'
                    }`}
                  >
                    <LayoutDashboard className="h-4 w-4" />
                    <span>DASHBOARD</span>
                  </button>
                )}

                <a
                  href={siteConfig?.telegramLink || "https://t.me"}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full flex items-center justify-between rounded-xl px-3.5 py-3 text-neutral-300 hover:bg-neutral-900 hover:text-white transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <Terminal className="h-4 w-4 text-[#FFB800]" />
                    <span>TELEGRAM BOT</span>
                  </div>
                  <ExternalLink className="h-3 w-3 text-neutral-500" />
                </a>
              </div>
            </div>

            {/* Bottom Section of Drawer */}
            <div className="pt-4 border-t border-neutral-800/80 space-y-3">
              {/* Logout Button */}
              {currentUser && (
                <button
                  onClick={() => { onLogout(); setMobileMenuOpen(false); }}
                  className="w-full flex items-center justify-center gap-2 rounded-xl border border-rose-500/30 bg-rose-950/20 py-2.5 text-xs font-bold text-rose-400 hover:bg-rose-950/40 transition-colors"
                >
                  <LogOut className="h-3.5 w-3.5" />
                  <span>SIGN OUT</span>
                </button>
              )}
            </div>

          </div>
        </div>
      )}
    </>
  );
};
