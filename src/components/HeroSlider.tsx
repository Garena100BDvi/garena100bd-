import React from 'react';
import { SiteConfig } from '../types';
import { Language } from '../lib/translations';

interface HeroSliderProps {
  lang: Language;
  onOpenLogin: () => void;
  onOpenPlayground: () => void;
  onOpenDocs: () => void;
  onOpenDashboard: () => void;
  hasUser: boolean;
  siteConfig: SiteConfig | null;
}

export const HeroSlider: React.FC<HeroSliderProps> = ({ siteConfig }) => {
  const bgUrl = siteConfig?.backgroundUrl;

  return (
    <div 
      className="relative w-full h-[300px] sm:h-[450px] lg:h-[540px] bg-cover bg-center bg-no-repeat transition-all select-none border-b border-neutral-800/80 shadow-2xl"
      style={{
        backgroundImage: bgUrl ? `url(${bgUrl})` : undefined,
        backgroundColor: bgUrl ? 'transparent' : '#07070a'
      }}
    >
      {/* If no custom background is uploaded, sleek minimal default placeholder */}
      {!bgUrl && (
        <div className="absolute inset-0 bg-gradient-to-br from-neutral-900 via-[#09090f] to-black flex items-center justify-center">
          <div className="text-center opacity-30 select-none">
            <span className="font-['Russo_One',sans-serif] text-3xl sm:text-5xl text-neutral-400 tracking-widest uppercase">
              GARENA GATEWAY
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
