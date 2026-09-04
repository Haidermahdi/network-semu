import React, { useState, useEffect } from 'react';
import { Terminal, Activity, X } from 'lucide-react';
import { TEACHING_SLIDES } from './components/SlideViewer';
import { SlideViewer } from './components/SlideViewer';
import { InteractiveLab } from './components/InteractiveLab';
import { QuizSection } from './components/QuizSection';
import { AiNetworkTutor } from './components/AiNetworkTutor';
import { CurriculumViewer } from './components/CurriculumViewer';
import { ProtocolStateMachine } from './components/ProtocolStateMachine';
import { WiresharkInspector } from './components/WiresharkInspector';
import { CiscoCliTerminal } from './components/CiscoCliTerminal';
import { RealLifeNetwork } from './components/RealLifeNetwork';
import { AuthScreen } from './components/AuthScreen';
import { UserProfileModal } from './components/UserProfileModal';
import { AppSidebar } from './components/AppSidebar';
import { AppTopBar } from './components/AppTopBar';
import { Language, UserProfile, CurriculumTrack } from './types';

export type AppMode = 'curriculum' | 'reallife' | 'slides' | 'protocols' | 'wireshark' | 'cli' | 'lab' | 'quiz' | 'ai';

export default function App() {
  const [lang, setLang] = useState<Language>('ar');
  const [currentMode, setCurrentMode] = useState<AppMode>('curriculum');
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [activeLabScenarioId, setActiveLabScenarioId] = useState<string>('cross-network-journey');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const [userProfile, setUserProfile] = useState<UserProfile | null>(() => {
    try {
      const activeEmail = localStorage.getItem('cisco_current_user_email');
      if (activeEmail) {
        const raw = localStorage.getItem(`cisco_user_${activeEmail.toLowerCase()}`);
        if (raw) return JSON.parse(raw);
      }
    } catch {
      // ignore
    }
    return null;
  });
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  const isRtl = lang === 'ar';

  const [splitPane, setSplitPane] = useState<'none' | 'cli' | 'wireshark'>('none');

  const handleJumpToLab = (scenarioId: string) => {
    setActiveLabScenarioId(scenarioId);
    setCurrentMode('lab');
    playNetworkTone('router');
  };

  const handleJumpToRealLife = () => {
    setCurrentMode('reallife');
    playNetworkTone('packet');
  };

  const playNetworkTone = (type: 'packet' | 'switch' | 'router') => {
    if (!soundEnabled) return;
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);

      if (type === 'packet') {
        osc.frequency.setValueAtTime(587.33, ctx.currentTime);
        gain.gain.setValueAtTime(0.04, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);
      } else if (type === 'switch') {
        osc.frequency.setValueAtTime(880, ctx.currentTime);
        gain.gain.setValueAtTime(0.03, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1);
      } else {
        osc.frequency.setValueAtTime(440, ctx.currentTime);
        gain.gain.setValueAtTime(0.05, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.2);
      }

      osc.start();
      osc.stop(ctx.currentTime + 0.2);
    } catch {
      // Audio context might be restricted before user gesture
    }
  };

  const handleModeChange = (mode: AppMode) => {
    if (mode === 'cli' || mode === 'wireshark') {
      setSplitPane(splitPane === mode ? 'none' : mode);
      playNetworkTone('switch');
    } else {
      setCurrentMode(mode);
      playNetworkTone('switch');
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (currentMode !== 'slides') return;
      const max = TEACHING_SLIDES.length - 1;
      if (e.key === 'ArrowLeft') {
        if (lang === 'ar') {
          if (currentSlideIndex < max) {
            setCurrentSlideIndex(prev => prev + 1);
            playNetworkTone('packet');
          }
        } else if (currentSlideIndex > 0) {
          setCurrentSlideIndex(prev => prev - 1);
          playNetworkTone('packet');
        }
      } else if (e.key === 'ArrowRight') {
        if (lang === 'ar') {
          if (currentSlideIndex > 0) {
            setCurrentSlideIndex(prev => prev - 1);
            playNetworkTone('packet');
          }
        } else if (currentSlideIndex < max) {
          setCurrentSlideIndex(prev => prev + 1);
          playNetworkTone('packet');
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentMode, currentSlideIndex, lang]);

  const handleLoginSuccess = (profile: UserProfile) => {
    setUserProfile(profile);
  };

  const handleUpdateUser = (updated: UserProfile) => {
    setUserProfile(updated);
    localStorage.setItem(`cisco_user_${updated.email}`, JSON.stringify(updated));
  };

  const handleLogout = () => {
    setUserProfile(null);
    localStorage.removeItem('cisco_current_user_email');
  };

  const handleSwitchTrack = (track: CurriculumTrack) => {
    if (userProfile) {
      handleUpdateUser({ ...userProfile, track });
    }
  };

  if (!userProfile) {
    return (
      <AuthScreen
        lang={lang}
        onLanguageChange={setLang}
        onLoginSuccess={handleLoginSuccess}
      />
    );
  }

  return (
    <div
      className={`min-h-screen bg-[#080b12] text-slate-100 flex font-sans selection:bg-amber-500/20 selection:text-amber-200 ${
        isRtl ? 'dir-rtl' : 'dir-ltr'
      }`}
    >
      {/* Ambient background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-amber-600/[0.03] rounded-full blur-[120px]" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-indigo-600/[0.04] rounded-full blur-[100px]" />
        <div
          className="absolute inset-0 opacity-[0.015]"
          style={{
            backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.4) 1px, transparent 0)',
            backgroundSize: '32px 32px',
          }}
        />
      </div>

      {/* Sidebar */}
      <AppSidebar
        lang={lang}
        currentMode={currentMode}
        splitPane={splitPane}
        onModeChange={handleModeChange}
        collapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        mobileOpen={mobileMenuOpen}
        onMobileClose={() => setMobileMenuOpen(false)}
        userProfile={userProfile}
        onOpenProfile={() => setIsProfileModalOpen(true)}
      />

      {/* Main Content Area */}
      <div
        className={`flex-1 flex flex-col min-h-screen relative transition-all duration-300 ${
          isRtl
            ? sidebarCollapsed ? 'lg:mr-[72px]' : 'lg:mr-[272px]'
            : sidebarCollapsed ? 'lg:ml-[72px]' : 'lg:ml-[272px]'
        }`}
      >
        <AppTopBar
          lang={lang}
          currentMode={currentMode}
          onLanguageChange={setLang}
          soundEnabled={soundEnabled}
          onToggleSound={() => setSoundEnabled(!soundEnabled)}
          onLogout={handleLogout}
          onOpenMobileMenu={() => setMobileMenuOpen(true)}
          userProfile={userProfile}
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          <div className="max-w-[1400px] mx-auto space-y-6">
            {currentMode === 'curriculum' && (
              <CurriculumViewer
                lang={lang}
                onNavigateToLab={handleJumpToLab}
                onNavigateToRealLife={handleJumpToRealLife}
                userProfile={userProfile}
                onUpdateUserProfile={handleUpdateUser}
              />
            )}

            {currentMode === 'reallife' && (
              <RealLifeNetwork lang={lang} userTrack={userProfile.track} onNavigateToLab={handleJumpToLab} />
            )}

            {currentMode === 'lab' && (
              <InteractiveLab initialScenarioId={activeLabScenarioId} lang={lang} userTrack={userProfile.track} />
            )}

            {currentMode === 'slides' && (
              <SlideViewer
                currentSlideIndex={currentSlideIndex}
                onSlideChange={(newIdx) => {
                  setCurrentSlideIndex(newIdx);
                  playNetworkTone('packet');
                }}
                lang={lang}
                onNavigateToLab={handleJumpToLab}
              />
            )}

            {currentMode === 'protocols' && <ProtocolStateMachine lang={lang} />}
            {currentMode === 'quiz' && <QuizSection lang={lang} />}
            {currentMode === 'ai' && <AiNetworkTutor lang={lang} />}
          </div>
        </main>

        {/* IDE Split Bottom Pane */}
        {splitPane !== 'none' && (
          <div className="h-[450px] border-t border-white/[0.08] bg-[#0c1018] flex flex-col relative z-20 shadow-[0_-10px_40px_rgba(0,0,0,0.5)]">
            <div className="flex items-center justify-between px-4 py-2 border-b border-white/[0.06] bg-slate-900/50">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-300 uppercase tracking-wider">
                {splitPane === 'cli' ? (
                  <><Terminal className="w-4 h-4 text-amber-400" /> {lang === 'ar' ? 'طرفية Cisco CLI' : 'Cisco CLI Terminal'}</>
                ) : (
                  <><Activity className="w-4 h-4 text-emerald-400" /> {lang === 'ar' ? 'محلل Wireshark' : 'Wireshark Inspector'}</>
                )}
              </div>
              <button 
                onClick={() => setSplitPane('none')}
                className="p-1.5 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="flex-1 overflow-auto p-4 custom-scrollbar">
              {splitPane === 'cli' && <CiscoCliTerminal lang={lang} />}
              {splitPane === 'wireshark' && <WiresharkInspector lang={lang} />}
            </div>
          </div>
        )}

        <footer className="border-t border-white/[0.06] py-4 px-6">
          <div className="max-w-[1400px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-slate-600">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>
                {lang === 'ar'
                  ? '© منصة الفريق السومري للتعلم — CCNA • CCNP • CCIE'
                  : '© Sumerian Team Learning Platform — CCNA • CCNP • CCIE'}
              </span>
            </div>
            <div className="flex items-center gap-3 text-slate-500 font-mono">
              <span>RFC</span>
              <span className="text-slate-700">•</span>
              <span>IOS-XE</span>
              <span className="text-slate-700">•</span>
              <span>IEEE 802.1</span>
            </div>
          </div>
        </footer>
      </div>

      <UserProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        user={userProfile}
        onUpdateUser={handleUpdateUser}
        onLogout={handleLogout}
        onSwitchTrack={handleSwitchTrack}
        lang={lang}
      />
    </div>
  );
}
