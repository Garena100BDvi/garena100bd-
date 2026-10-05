import React from 'react';
import { Terminal, Shield, CheckCircle2 } from 'lucide-react';
import { Language } from '../lib/translations';

interface FooterProps {
  lang: Language;
  onNavigate: (view: 'home' | 'dashboard' | 'playground' | 'docs') => void;
  onOpenAuth: () => void;
  onOpenAdmin: () => void;
}

export const Footer: React.FC<FooterProps> = ({ 
  onNavigate, 
  onOpenAuth, 
  onOpenAdmin 
}) => {
  return (
    <footer className="border-t border-neutral-800 bg-[#050507] py-12 text-neutral-400 font-sans">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Info */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2.5">
              <svg 
                viewBox="0 0 100 100" 
                className="h-8 w-8 drop-shadow-[0_0_10px_rgba(255,184,0,0.6)]"
              >
                <path 
                  d="M18 12 L84 12 L76 34 L42 34 L38 46 L70 46 L62 66 L32 66 L24 92 L2 92 Z" 
                  fill="#FFB800" 
                />
              </svg>
              <div className="flex items-center gap-1.5 font-['Russo_One',sans-serif] text-lg font-black tracking-wider text-white">
                <span>GARENA</span>
                <span className="text-[#FFB800]">API</span>
              </div>
            </div>
            <p className="text-xs text-neutral-400 max-w-md leading-relaxed">
              Official high-speed Free Fire player UID name and level verification gateway. Enterprise REST endpoint for top-up stores, e-commerce websites, and automated Telegram bots.
            </p>
            <div className="flex items-center gap-2 text-xs text-neutral-400 pt-1">
              <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>Gateway Status: All Systems Operational</span>
              <span aria-hidden="true">·</span>
              <span className="font-mono text-[#FFB800]">Uptime 99.98%</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-2">
            <h4 className="text-xs font-['Russo_One',sans-serif] uppercase tracking-wider text-white">
              Navigation
            </h4>
            <ul className="space-y-1.5 text-xs font-mono">
              <li>
                <button onClick={() => onNavigate('home')} className="hover:text-[#FFB800] transition-colors">
                  Home Gateway
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('playground')} className="hover:text-[#FFB800] transition-colors">
                  Live API Sandbox
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('docs')} className="hover:text-[#FFB800] transition-colors">
                  Sub-API Docs & SDK
                </button>
              </li>
              <li>
                <button onClick={onOpenAuth} className="hover:text-[#FFB800] transition-colors">
                  Client Portal Sign In
                </button>
              </li>
            </ul>
          </div>

          {/* System Info */}
          <div className="space-y-2">
            <h4 className="text-xs font-['Russo_One',sans-serif] uppercase tracking-wider text-white">
              Developers & Security
            </h4>
            <ul className="space-y-1.5 text-xs text-neutral-400 font-mono">
              <li className="flex items-center gap-1.5">
                <CheckCircle2 className="h-3 w-3 text-emerald-400" />
                <span>REST API v1.4 Ready</span>
              </li>
              <li className="flex items-center gap-1.5">
                <Shield className="h-3 w-3 text-[#FFB800]" />
                <span>Domain IP Whitelisting</span>
              </li>
              <li className="flex items-center gap-1.5">
                <Terminal className="h-3 w-3 text-cyan-400" />
                <span>PHP cURL & Node.js</span>
              </li>
              <li>
                <button
                  onClick={onOpenAdmin}
                  className="flex items-center gap-1.5 text-neutral-400 hover:text-[#FFB800] transition-colors"
                >
                  <Shield className="h-3 w-3 text-[#FFB800]" />
                  <span>Admin Gateway (/admin84326)</span>
                </button>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 border-t border-neutral-900 pt-6 flex flex-col sm:flex-row items-center justify-between text-[11px] text-neutral-500 font-mono">
          <p>© {new Date().getFullYear()} GARENA API GATEWAY · All rights reserved.</p>
          <div className="flex items-center gap-4 mt-2 sm:mt-0">
            <span>Server: SIN1/BD Cluster</span>
            <span>Latency: &lt;140ms</span>
            <button 
              onClick={onOpenAdmin} 
              className="text-neutral-500 hover:text-[#FFB800] transition-colors underline decoration-dotted"
            >
              Admin Access
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
};
