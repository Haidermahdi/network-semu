import React, { useState, useEffect } from 'react';
import { 
  Network, 
  Radio, 
  Layers, 
  Sparkles, 
  BookOpen, 
  Terminal, 
  Award, 
  Bot, 
  Sliders, 
  HelpCircle, 
  Cpu, 
  Globe, 
  ShieldCheck, 
  Zap, 
  ChevronRight, 
  ChevronLeft,
  Share2,
  Volume2,
  VolumeX,
  Activity,
  GitCommit,
  Search,
  FileCode,
  Users,
  Compass,
  Languages,
  User,
  Flame,
  LogOut
} from 'lucide-react';
import { SLIDES_DATA } from './data/slidesData';
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
import { Language, UserProfile, CurriculumTrack } from './types';

export type AppMode = 'curriculum' | 'reallife' | 'slides' | 'protocols' | 'wireshark' | 'cli' | 'lab' | 'quiz' | 'ai';

export default function App() {
  const [lang, setLang] = useState<Language>('ar');
  const [currentMode, setCurrentMode] = useState<AppMode>('curriculum');
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [activeLabScenarioId, setActiveLabScenarioId] = useState<string>('cross-network-journey');

  // User Management State (Authentication Gate)
  const [userProfile, setUserProfile] = useState<UserProfile | null>(() => {
    try {
      const activeEmail = localStorage.getItem('cisco_current_user_email');
      if (activeEmail) {
        const raw = localStorage.getItem(`cisco_user_${activeEmail.toLowerCase()}`);
        if (raw) return JSON.parse(raw);
      }
    } catch (e) {
      // ignore
    }
    return null;
  });
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  // Handle direct jump to Lab from Curriculum or Real Life Stories
  const handleJumpToLab = (scenarioId: string) => {
    setActiveLabScenarioId(scenarioId);
    setCurrentMode('lab');
    playNetworkTone('router');
  };

  // Handle direct jump to Real Life Story
  const handleJumpToRealLife = (_storyId?: string) => {
    setCurrentMode('reallife');
    playNetworkTone('packet');
  };

  // Play subtle sound effects via Web Audio API
  const playNetworkTone = (type: 'packet' | 'switch' | 'router') => {
    if (!soundEnabled) return;
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);

      if (type === 'packet') {
        osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
        gain.gain.setValueAtTime(0.04, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);
      } else if (type === 'switch') {
        osc.frequency.setValueAtTime(880, ctx.currentTime); // A5
        gain.gain.setValueAtTime(0.03, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1);
      } else {
        osc.frequency.setValueAtTime(440, ctx.currentTime); // A4
        gain.gain.setValueAtTime(0.05, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.2);
      }

      osc.start();
      osc.stop(ctx.currentTime + 0.2);
    } catch (e) {
      // Audio context might be restricted before user gesture
    }
  };

  // Keyboard navigation for slides
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (currentMode !== 'slides') return;
      if (e.key === 'ArrowLeft') {
        if (lang === 'ar') {
          if (currentSlideIndex < SLIDES_DATA.length - 1) {
            setCurrentSlideIndex(prev => prev + 1);
            playNetworkTone('packet');
          }
        } else {
          if (currentSlideIndex > 0) {
            setCurrentSlideIndex(prev => prev - 1);
            playNetworkTone('packet');
          }
        }
      } else if (e.key === 'ArrowRight') {
        if (lang === 'ar') {
          if (currentSlideIndex > 0) {
            setCurrentSlideIndex(prev => prev - 1);
            playNetworkTone('packet');
          }
        } else {
          if (currentSlideIndex < SLIDES_DATA.length - 1) {
            setCurrentSlideIndex(prev => prev + 1);
            playNetworkTone('packet');
          }
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
      const updated = { ...userProfile, track };
      handleUpdateUser(updated);
    }
  };

  // IF USER IS NOT LOGGED IN: DISPLAY DEDICATED FULL-SCREEN AUTHENTICATION PORTAL
  if (!userProfile) {
    return (
      <AuthScreen 
        lang={lang}
        onLanguageChange={setLang}
        onLoginSuccess={handleLoginSuccess}
      />
    );
  }

  // ONCE AUTHENTICATED: DISPLAY THE COMPLETE ACADEMY & ALL MODULES
  return (
    <div className={`min-h-screen bg-[#070b14] text-slate-100 flex flex-col font-sans selection:bg-indigo-500/30 selection:text-indigo-200 ${lang === 'ar' ? 'dir-rtl' : 'dir-ltr'}`}>
      {/* Top Navbar */}
      <header className="sticky top-0 z-50 bg-[#070b14]/90 backdrop-blur-lg border-b border-slate-800/90 px-4 sm:px-6 py-3">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-3">
          {/* Logo & Title */}
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-gradient-to-tr from-indigo-600 via-cyan-500 to-emerald-400 text-slate-950 shadow-lg shadow-indigo-500/20">
              <Network className="w-6 h-6 stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base sm:text-lg font-black text-white tracking-tight">
                  {lang === 'ar' ? 'المنظومة الهندسية المنهجية للشبكات' : 'Cisco Enterprise Network Academy'}
                </h1>
                <span className="px-2 py-0.5 rounded-md bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-[10px] font-bold font-mono">
                  CCNA • CCNP • CCIE
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                {lang === 'ar' 
                  ? 'مناهج سيسكو الرسمية، كتب تفاعلية متعددة الفصول، قصص واقعية، محاكي Packets، ومحلل Wireshark'
                  : 'Official Cisco Blueprints, Multi-Chapter Digital Books, Real Analogies, Packet Simulator & Wireshark Dissector'}
              </p>
            </div>
          </div>

          {/* Navigation Modes Switcher */}
          <div className="flex flex-wrap items-center justify-center gap-1.5 p-1.5 rounded-2xl bg-slate-900/90 border border-slate-800 text-xs font-bold shadow-inner">
            <button
              onClick={() => {
                setCurrentMode('curriculum');
                playNetworkTone('switch');
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
                currentMode === 'curriculum'
                  ? 'bg-gradient-to-r from-indigo-600 to-blue-600 text-white shadow-md shadow-indigo-600/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>{lang === 'ar' ? 'المنهج والكتب' : 'Curriculum & Books'}</span>
            </button>

            {/* Real Life Human Network Mode */}
            <button
              onClick={() => {
                setCurrentMode('reallife');
                playNetworkTone('switch');
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
                currentMode === 'reallife'
                  ? 'bg-gradient-to-r from-amber-600 to-orange-600 text-white shadow-md shadow-amber-600/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>{lang === 'ar' ? 'شبكات من واقعنا' : 'Real-Life Stories'}</span>
            </button>

            <button
              onClick={() => {
                setCurrentMode('lab');
                playNetworkTone('switch');
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
                currentMode === 'lab'
                  ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-md shadow-cyan-600/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <Cpu className="w-3.5 h-3.5" />
              <span>{lang === 'ar' ? 'المعمل الحي (Lab)' : 'Live Lab'}</span>
            </button>

            <button
              onClick={() => {
                setCurrentMode('slides');
                playNetworkTone('switch');
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
                currentMode === 'slides'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <Zap className="w-3.5 h-3.5" />
              <span>{lang === 'ar' ? 'السلايدات' : 'Slides'}</span>
            </button>

            <button
              onClick={() => {
                setCurrentMode('protocols');
                playNetworkTone('switch');
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
                currentMode === 'protocols'
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <GitCommit className="w-3.5 h-3.5" />
              <span>{lang === 'ar' ? 'آلة البروتوكولات' : 'Protocols'}</span>
            </button>

            <button
              onClick={() => {
                setCurrentMode('wireshark');
                playNetworkTone('switch');
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
                currentMode === 'wireshark'
                  ? 'bg-cyan-600 text-white shadow-md shadow-cyan-600/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <Activity className="w-3.5 h-3.5" />
              <span>{lang === 'ar' ? 'محلل Wireshark' : 'Wireshark'}</span>
            </button>

            <button
              onClick={() => {
                setCurrentMode('cli');
                playNetworkTone('switch');
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
                currentMode === 'cli'
                  ? 'bg-slate-800 text-emerald-400 border border-emerald-500/30 shadow-md'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <Terminal className="w-3.5 h-3.5" />
              <span>{lang === 'ar' ? 'طرفية Cisco CLI' : 'Cisco CLI'}</span>
            </button>

            <button
              onClick={() => {
                setCurrentMode('quiz');
                playNetworkTone('switch');
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
                currentMode === 'quiz'
                  ? 'bg-amber-600 text-white shadow-md shadow-amber-600/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <Award className="w-3.5 h-3.5" />
              <span>{lang === 'ar' ? 'تحدي الاختبار' : 'Exam Quiz'}</span>
            </button>

            <button
              onClick={() => {
                setCurrentMode('ai');
                playNetworkTone('switch');
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
                currentMode === 'ai'
                  ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <Bot className="w-3.5 h-3.5" />
              <span>{lang === 'ar' ? 'المساعد الذكي' : 'AI Tutor'}</span>
            </button>
          </div>

          {/* User Profile, Sound & Language Controls */}
          <div className="flex items-center gap-2">
            {/* Active User Profile Pill */}
            <button
              onClick={() => setIsProfileModalOpen(true)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-2xl bg-gradient-to-r from-slate-900 to-indigo-950/80 border border-indigo-500/40 hover:border-cyan-400 text-white text-xs font-bold transition-all shadow-md cursor-pointer"
              title="الملف الشخصي والإنجازات"
            >
              <img 
                src={userProfile.avatar} 
                alt={userProfile.name} 
                className="w-6 h-6 rounded-full bg-slate-800 border border-cyan-400"
              />
              <span className="max-w-[90px] truncate">{userProfile.name}</span>
              <span className="px-1.5 py-0.2 rounded bg-indigo-500/20 text-cyan-300 font-mono text-[10px] uppercase">
                {userProfile.track}
              </span>
              <span className="flex items-center gap-0.5 text-amber-400 text-[11px]">
                <Flame className="w-3 h-3 fill-amber-400" />
                <span>{userProfile.studyStreakDays}</span>
              </span>
            </button>

            {/* Quick Logout Button */}
            <button
              onClick={handleLogout}
              className="p-2 rounded-xl bg-slate-900 hover:bg-rose-950/50 text-slate-400 hover:text-rose-400 border border-slate-800 transition-colors text-xs cursor-pointer"
              title={lang === 'ar' ? 'تسجيل الخروج' : 'Sign Out'}
            >
              <LogOut className="w-4 h-4" />
            </button>

            {/* Language Switcher Button */}
            <button
              onClick={() => setLang(lang === 'ar' ? 'en' : 'ar')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-cyan-300 border border-slate-800 transition-all text-xs font-bold font-mono shadow-sm cursor-pointer"
              title={lang === 'ar' ? 'التبديل إلى الإنجليزية' : 'Switch to Arabic'}
            >
              <Languages className="w-3.5 h-3.5 text-cyan-400" />
              <span>{lang === 'ar' ? 'English (EN)' : 'العربية (AR)'}</span>
            </button>

            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              title={soundEnabled ? (lang === 'ar' ? 'كتم المؤثرات الصوتية' : 'Mute Audio') : (lang === 'ar' ? 'تفعيل المؤثرات الصوتية' : 'Enable Audio')}
              className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 transition-colors text-xs cursor-pointer"
            >
              {soundEnabled ? <Volume2 className="w-4 h-4 text-emerald-400" /> : <VolumeX className="w-4 h-4 text-slate-500" />}
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 space-y-6">
        {/* Mode 1: Curriculum Deep Dive */}
        {currentMode === 'curriculum' && (
          <CurriculumViewer 
            lang={lang}
            onNavigateToLab={handleJumpToLab} 
            onNavigateToRealLife={handleJumpToRealLife}
            userProfile={userProfile}
            onUpdateUserProfile={handleUpdateUser}
          />
        )}

        {/* Mode 2: Real Life Human Network Stories */}
        {currentMode === 'reallife' && (
          <RealLifeNetwork 
            lang={lang}
            onNavigateToLab={handleJumpToLab} 
          />
        )}

        {/* Mode 3: Open Sandbox Interactive Lab */}
        {currentMode === 'lab' && (
          <InteractiveLab initialScenarioId={activeLabScenarioId} />
        )}

        {/* Mode 4: Interactive Slides */}
        {currentMode === 'slides' && (
          <div>
            {/* Quick Slide Navigation Bar */}
            <div className="mb-4 p-2 rounded-2xl bg-slate-900/80 border border-slate-800/80 overflow-x-auto flex items-center gap-1.5">
              <span className="text-xs text-slate-400 font-bold px-2 shrink-0">
                {lang === 'ar' ? 'فهرس السلايدات:' : 'Slide Index:'}
              </span>
              {SLIDES_DATA.map((s, idx) => (
                <button
                  key={s.id}
                  onClick={() => {
                    setCurrentSlideIndex(idx);
                    playNetworkTone('packet');
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 shrink-0 cursor-pointer ${
                    currentSlideIndex === idx
                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                      : 'bg-slate-950 text-slate-400 hover:text-slate-200 hover:bg-slate-800 border border-slate-800'
                  }`}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  <span>{s.number}. {lang === 'ar' ? s.titleAr.split(':')[0] : s.titleEn.split(':')[0]}</span>
                </button>
              ))}
            </div>

            <SlideViewer
              currentSlideIndex={currentSlideIndex}
              onSlideChange={(newIdx) => {
                setCurrentSlideIndex(newIdx);
                playNetworkTone('packet');
              }}
            />
          </div>
        )}

        {/* Mode 5: Protocol State Machine */}
        {currentMode === 'protocols' && (
          <ProtocolStateMachine />
        )}

        {/* Mode 6: Wireshark Packet Dissector */}
        {currentMode === 'wireshark' && (
          <WiresharkInspector />
        )}

        {/* Mode 7: Cisco IOS CLI Terminal */}
        {currentMode === 'cli' && (
          <CiscoCliTerminal />
        )}

        {/* Mode 8: Exam Quiz */}
        {currentMode === 'quiz' && (
          <QuizSection />
        )}

        {/* Mode 9: AI Network Tutor */}
        {currentMode === 'ai' && (
          <AiNetworkTutor />
        )}
      </main>

      {/* User Profile & Progress Modal */}
      <UserProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        user={userProfile}
        onUpdateUser={handleUpdateUser}
        onLogout={handleLogout}
        onSwitchTrack={handleSwitchTrack}
      />

      {/* Footer */}
      <footer className="bg-slate-950 border-t border-slate-800/80 py-6 px-4 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>{lang === 'ar' ? 'المنظومة الهندسية التفاعلية للشبكات (Cisco CCNA / CCNP / CCIE)' : 'Interactive Enterprise Network Academy (Cisco CCNA / CCNP / CCIE)'}</span>
          </div>

          <div className="flex items-center gap-4 text-slate-400">
            <span>RFC Standards Compliant</span>
            <span>•</span>
            <span>Cisco IOS-XE Compatible</span>
            <span>•</span>
            <span>IEEE 802.1 & 802.3</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
