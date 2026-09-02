import React from 'react';
import {
  Menu,
  Languages,
  Volume2,
  VolumeX,
  LogOut,
  Flame,
} from 'lucide-react';
import { AppMode } from '../App';
import { Language, UserProfile } from '../types';
import { MODE_META } from './AppSidebar';

interface AppTopBarProps {
  lang: Language;
  currentMode: AppMode;
  onLanguageChange: (lang: Language) => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
  onLogout: () => void;
  onOpenMobileMenu: () => void;
  userProfile: UserProfile;
}

export const AppTopBar: React.FC<AppTopBarProps> = ({
  lang,
  currentMode,
  onLanguageChange,
  soundEnabled,
  onToggleSound,
  onLogout,
  onOpenMobileMenu,
  userProfile,
}) => {
  const meta = MODE_META[currentMode];

  return (
    <header className="sticky top-0 z-30 bg-[#080b12]/80 backdrop-blur-xl border-b border-white/[0.06]">
      <div className="flex items-center justify-between gap-4 px-4 sm:px-6 py-3.5">
        {/* Left: Mobile menu + Page title */}
        <div className="flex items-center gap-3 min-w-0 flex-1">
          <button
            onClick={onOpenMobileMenu}
            className="lg:hidden p-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-slate-300 border border-white/[0.06] transition-colors cursor-pointer shrink-0"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h2 className="text-base sm:text-lg font-black text-white truncate">
                {lang === 'ar' ? meta.titleAr : meta.titleEn}
              </h2>
              <span className="hidden sm:inline-flex px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-400 border border-amber-500/20 text-[10px] font-bold font-mono shrink-0">
                {userProfile.track.toUpperCase()}
              </span>
            </div>
            <p className="text-[11px] sm:text-xs text-slate-500 truncate mt-0.5 hidden sm:block">
              {lang === 'ar' ? meta.descAr : meta.descEn}
            </p>
          </div>
        </div>

        {/* Right: Controls */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {/* Streak */}
          <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
            <Flame className="w-3.5 h-3.5 fill-amber-400" />
            <span className="text-xs font-bold font-mono">{userProfile.studyStreakDays}</span>
            <span className="text-[10px] text-amber-400/70 hidden md:inline">
              {lang === 'ar' ? 'يوم' : 'days'}
            </span>
          </div>

          {/* Language */}
          <button
            onClick={() => onLanguageChange(lang === 'ar' ? 'en' : 'ar')}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-slate-300 border border-white/[0.06] transition-all text-xs font-bold cursor-pointer"
            title={lang === 'ar' ? 'Switch to English' : 'التبديل للعربية'}
          >
            <Languages className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline font-mono">{lang === 'ar' ? 'EN' : 'AR'}</span>
          </button>

          {/* Sound */}
          <button
            onClick={onToggleSound}
            className="p-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.06] transition-colors cursor-pointer"
            title={soundEnabled ? (lang === 'ar' ? 'كتم الصوت' : 'Mute') : (lang === 'ar' ? 'تفعيل الصوت' : 'Enable sound')}
          >
            {soundEnabled ? (
              <Volume2 className="w-4 h-4 text-[var(--accent-text)]" />
            ) : (
              <VolumeX className="w-4 h-4 text-[var(--text-muted)]" />
            )}
          </button>

          {/* Logout */}
          <button
            onClick={onLogout}
            className="p-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-[var(--text-muted)] hover:text-[var(--text-secondary)] border border-white/[0.06] transition-colors cursor-pointer"
            title={lang === 'ar' ? 'تسجيل الخروج' : 'Sign out'}
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Breadcrumb strip */}
      <div className="px-4 sm:px-6 pb-2.5 flex items-center gap-2 text-[11px] text-slate-600">
        <span className="text-amber-500/80 font-semibold">
          {lang === 'ar' ? 'منصة الفريق السومري للتعلم' : 'Sumerian Team Learning'}
        </span>
        <span className="text-slate-700">/</span>
        <span className="text-slate-400">{lang === 'ar' ? meta.titleAr : meta.titleEn}</span>
      </div>
    </header>
  );
};
