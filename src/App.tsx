import React, { useState, useEffect } from 'react';
import { User, SiteConfig } from './types';
import { Language } from './lib/translations';
import { apiClient } from './lib/apiClient';
import { Navbar } from './components/Navbar';
import { HeroSlider } from './components/HeroSlider';
import { LivePlayerChecker } from './components/LivePlayerChecker';
import { LivePlayground } from './components/LivePlayground';
import { SubApiIntegrationGuide } from './components/SubApiIntegrationGuide';
import { DashboardView } from './components/DashboardView';
import { AuthModal } from './components/AuthModal';
import { AdminPanel } from './components/AdminPanel';
import { Footer } from './components/Footer';

export default function App() {
  const [lang, setLang] = useState<Language>('en');
  const [activeView, setActiveView] = useState<'home' | 'dashboard' | 'playground' | 'docs'>('home');
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [adminPanelOpen, setAdminPanelOpen] = useState(false);
  const [siteConfig, setSiteConfig] = useState<SiteConfig | null>(null);

  // Check URL path, hash, or search for admin routes (/admin84326, /admin843267, /admin, etc.)
  useEffect(() => {
    const checkAdminRoute = () => {
      const fullUrl = (window.location.pathname + window.location.hash + window.location.search).toLowerCase();
      if (
        fullUrl.includes('admin84326') || 
        fullUrl.includes('admin843267') || 
        fullUrl.includes('/admin') ||
        fullUrl.includes('#admin') ||
        fullUrl.includes('?admin')
      ) {
        setAdminPanelOpen(true);
      }
    };

    // Run check immediately on mount
    checkAdminRoute();

    // Listen to route changes
    window.addEventListener('popstate', checkAdminRoute);
    window.addEventListener('hashchange', checkAdminRoute);
    return () => {
      window.removeEventListener('popstate', checkAdminRoute);
      window.removeEventListener('hashchange', checkAdminRoute);
    };
  }, []);

  // Fetch site config on mount
  useEffect(() => {
    apiClient.getSiteConfig().then((res) => {
      if (res.status && res.siteConfig) {
        setSiteConfig(res.siteConfig);
        if (res.siteConfig.siteTitle) {
          document.title = res.siteConfig.siteTitle;
        }
      }
    }).catch(() => {});
  }, []);

  // Load saved user
  useEffect(() => {
    const saved = localStorage.getItem('garena_api_user');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setCurrentUser(parsed);
        // Sync fresh profile from server
        apiClient.getProfile(parsed.id).then(res => {
          if (res.status && res.user) {
            setCurrentUser(res.user);
            localStorage.setItem('garena_api_user', JSON.stringify(res.user));
          }
        }).catch(() => {});
      } catch (e) {
        console.warn('Failed to parse saved user');
      }
    }
  }, []);

  const handleLoginSuccess = (user: User) => {
    setCurrentUser(user);
    localStorage.setItem('garena_api_user', JSON.stringify(user));
    setActiveView('dashboard');
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('garena_api_user');
    setActiveView('home');
  };

  const handleUpdateUser = (updated: User) => {
    setCurrentUser(updated);
    localStorage.setItem('garena_api_user', JSON.stringify(updated));
  };

  const handleNavigate = (view: 'home' | 'dashboard' | 'playground' | 'docs') => {
    if (view === 'dashboard' && !currentUser) {
      setAuthModalOpen(true);
      return;
    }
    setActiveView(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleConfigUpdated = (newConfig: SiteConfig) => {
    setSiteConfig(newConfig);
    if (newConfig.siteTitle) {
      document.title = newConfig.siteTitle;
    }
  };

  return (
    <div className="min-h-screen relative font-sans text-neutral-100 selection:bg-[#FFB800]/20 selection:text-[#FFB800] overflow-x-hidden">
      
      {/* Dynamic Global Background Image Layer */}
      {siteConfig?.backgroundUrl ? (
        <div 
          className="fixed inset-0 pointer-events-none z-0 bg-cover bg-center bg-no-repeat bg-fixed transition-all duration-700"
          style={{ backgroundImage: `url(${siteConfig.backgroundUrl})` }}
        >
          {/* Subtle darkening overlay so background is clearly visible while text stays 100% readable */}
          <div className="absolute inset-0 bg-black/65 backdrop-blur-[0.5px]" />
        </div>
      ) : (
        <div className="fixed inset-0 pointer-events-none z-0 bg-[#07070a]" />
      )}

      <div className="relative z-10 flex flex-col min-h-screen">
        {/* Top Navbar */}
        <Navbar
          lang={lang}
          onToggleLang={() => setLang(lang === 'bn' ? 'en' : 'bn')}
          currentUser={currentUser}
          activeView={activeView}
          onNavigate={handleNavigate}
          onOpenAuth={() => setAuthModalOpen(true)}
          onOpenAdmin={() => setAdminPanelOpen(true)}
          onLogout={handleLogout}
          siteConfig={siteConfig}
        />

      {/* Main View Router */}
      <main>
        {activeView === 'home' && (
          <>
            {/* Top Carousel Slider */}
            <HeroSlider
              lang={lang}
              onOpenLogin={() => setAuthModalOpen(true)}
              onOpenPlayground={() => handleNavigate('playground')}
              onOpenDocs={() => handleNavigate('docs')}
              onOpenDashboard={() => handleNavigate('dashboard')}
              hasUser={!!currentUser}
              siteConfig={siteConfig}
            />

            {/* Official Live Player UID Checker Console */}
            <div id="live-checker">
              <LivePlayerChecker lang={lang} />
            </div>
          </>
        )}

        {activeView === 'playground' && (
          <LivePlayground 
            lang={lang} 
            currentUser={currentUser} 
            onOpenAuth={() => setAuthModalOpen(true)} 
          />
        )}

        {activeView === 'docs' && (
          <div className="py-8">
            <SubApiIntegrationGuide 
              lang={lang} 
              onOpenLogin={() => setAuthModalOpen(true)} 
            />
          </div>
        )}

        {activeView === 'dashboard' && currentUser && (
          <DashboardView
            user={currentUser}
            lang={lang}
            onUpdateUser={handleUpdateUser}
            onLogout={handleLogout}
          />
        )}
      </main>

      {/* Footer */}
      <Footer 
        lang={lang} 
        onNavigate={handleNavigate} 
        onOpenAuth={() => setAuthModalOpen(true)} 
        onOpenAdmin={() => setAdminPanelOpen(true)}
      />

      {/* Auth Modal (Login only, self-registration removed) */}
      {authModalOpen && (
        <AuthModal
          onClose={() => setAuthModalOpen(false)}
          onSuccess={handleLoginSuccess}
          whatsappNumber={siteConfig?.whatsappNumber || '01608880183'}
        />
      )}

      {/* ATX Admin Panel Modal (URL: /admin843267) */}
      {adminPanelOpen && (
        <AdminPanel
          onClose={() => {
            setAdminPanelOpen(false);
            if (window.location.pathname.toLowerCase().includes('admin') || window.location.hash.toLowerCase().includes('admin')) {
              window.history.pushState({}, '', '/');
            }
          }}
          onConfigUpdated={handleConfigUpdated}
        />
      )}

      </div>
    </div>
  );
}
