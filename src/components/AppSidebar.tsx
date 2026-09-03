import React from 'react';
import {
  BookOpen,
  Users,
  Cpu,
  Zap,
  GitCommit,
  Activity,
  Terminal,
  Award,
  Bot,
  ChevronLeft,
  ChevronRight,
  GraduationCap,
  Wrench,
  Target,
  X,
} from 'lucide-react';
import { AppMode } from '../App';
import { Language, UserProfile } from '../types';

interface NavItem {
  id: AppMode;
  icon: React.ReactNode;
  labelAr: string;
  labelEn: string;
}

interface NavGroup {
  titleAr: string;
  titleEn: string;
  icon: React.ReactNode;
  items: NavItem[];
}

const NAV_GROUPS: NavGroup[] = [
  {
    titleAr: 'التعلم والمناهج',
    titleEn: 'Learning',
    icon: <GraduationCap className="w-3.5 h-3.5" />,
    items: [
      { id: 'curriculum', icon: <BookOpen className="w-[18px] h-[18px]" />, labelAr: 'المنهج والكتب', labelEn: 'Curriculum & Books' },
      { id: 'reallife', icon: <Users className="w-[18px] h-[18px]" />, labelAr: 'شبكات من واقعنا', labelEn: 'Real-Life Stories' },
      { id: 'slides', icon: <Zap className="w-[18px] h-[18px]" />, labelAr: 'السلايدات التفاعلية', labelEn: 'Interactive Slides' },
    ],
  },
  {
    titleAr: 'الأدوات العملية',
    titleEn: 'Lab Tools',
    icon: <Wrench className="w-3.5 h-3.5" />,
    items: [
      { id: 'lab', icon: <Cpu className="w-[18px] h-[18px]" />, labelAr: 'المعمل الحي', labelEn: 'Live Lab' },
      { id: 'protocols', icon: <GitCommit className="w-[18px] h-[18px]" />, labelAr: 'آلة البروتوكولات', labelEn: 'Protocol State Machine' },
      { id: 'wireshark', icon: <Activity className="w-[18px] h-[18px]" />, labelAr: 'محلل Wireshark', labelEn: 'Wireshark Inspector' },
      { id: 'cli', icon: <Terminal className="w-[18px] h-[18px]" />, labelAr: 'طرفية Cisco CLI', labelEn: 'Cisco CLI Terminal' },
    ],
  },
  {
    titleAr: 'التقييم والمساعدة',
    titleEn: 'Assessment',
    icon: <Target className="w-3.5 h-3.5" />,
    items: [
      { id: 'quiz', icon: <Award className="w-[18px] h-[18px]" />, labelAr: 'تحدي الاختبار', labelEn: 'Exam Quiz' },
      { id: 'ai', icon: <Bot className="w-[18px] h-[18px]" />, labelAr: 'المساعد الذكي', labelEn: 'AI Tutor' },
    ],
  },
];

interface AppSidebarProps {
  lang: Language;
  currentMode: AppMode;
  splitPane?: 'none' | 'cli' | 'wireshark';
  onModeChange: (mode: AppMode) => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
  mobileOpen: boolean;
  onMobileClose: () => void;
  userProfile: UserProfile;
  onOpenProfile: () => void;
}

export const AppSidebar: React.FC<AppSidebarProps> = ({
  lang,
  currentMode,
  splitPane = 'none',
  onModeChange,
  collapsed,
  onToggleCollapse,
  mobileOpen,
  onMobileClose,
  userProfile,
  onOpenProfile,
}) => {
  const isRtl = lang === 'ar';

  const handleNavClick = (mode: AppMode) => {
    onModeChange(mode);
    onMobileClose();
  };

  const sidebarContent = (
    <div className="flex flex-col h-full">
      {/* Brand Header */}
      <div className={`flex items-center gap-3 px-4 py-5 border-b border-white/[0.06] ${collapsed ? 'justify-center px-2' : ''}`}>
        <div className="relative shrink-0">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 via-amber-600 to-orange-700 flex items-center justify-center shadow-lg shadow-amber-900/40">
            <span className="text-lg font-black text-amber-50" style={{ fontFamily: 'serif' }}>𒀭</span>
          </div>
          <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-[var(--accent)] border-2 border-[#0c1018]" />
        </div>
        {!collapsed && (
          <div className="min-w-0 flex-1">
            <h1 className="text-sm font-black text-white leading-tight tracking-tight">
              {lang === 'ar' ? 'منصة الفريق السومري' : 'Sumerian Team'}
            </h1>
            <p className="text-[11px] font-semibold text-amber-400/90 mt-0.5">
              {lang === 'ar' ? 'للتعلم' : 'Learning Platform'}
            </p>
          </div>
        )}
        {!collapsed && (
          <button
            onClick={onToggleCollapse}
            className="hidden lg:flex p-1.5 rounded-lg text-slate-500 hover:text-slate-300 hover:bg-white/5 transition-colors cursor-pointer"
            title={lang === 'ar' ? 'طي القائمة' : 'Collapse sidebar'}
          >
            {isRtl ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        )}
      </div>

      {/* Track Badge & Progress */}
      {!collapsed && (
        <div className="px-4 py-3">
          <div className="px-3 py-2 rounded-xl bg-gradient-to-r from-amber-500/10 to-orange-500/5 border border-amber-500/20">
            <div className="flex items-center justify-between">
              <div className="text-[10px] font-bold text-amber-400/80 uppercase tracking-wider">
                {lang === 'ar' ? 'المسار النشط' : 'Active Track'}
              </div>
              <div className="text-[10px] font-bold text-amber-400">45%</div>
            </div>
            <div className="text-xs font-black text-white mt-0.5 uppercase">{userProfile.track}</div>
            <div className="text-[10px] text-slate-500 font-mono mt-0.5 mb-2">
              {userProfile.track === 'ccna' ? '200-301' : userProfile.track === 'ccnp' ? '350-401' : 'CCIE EI'}
            </div>
            {/* Progress Bar */}
            <div className="h-1.5 w-full bg-black/40 rounded-full overflow-hidden border border-white/5">
              <div 
                className="h-full bg-gradient-to-r from-amber-500 to-orange-500 rounded-full relative"
                style={{ width: '45%' }}
              >
                <div className="absolute inset-0 bg-white/20 w-full animate-[shimmer_2s_infinite]" />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-2 space-y-5 sidebar-scroll">
        {NAV_GROUPS.map((group) => (
          <div key={group.titleEn}>
            {!collapsed && (
              <div className="flex items-center gap-2 px-3 mb-2">
                <span className="text-slate-600">{group.icon}</span>
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                  {lang === 'ar' ? group.titleAr : group.titleEn}
                </span>
              </div>
            )}
            <div className="space-y-0.5">
              {group.items.map((item) => {
                const isActive = currentMode === item.id || splitPane === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleNavClick(item.id)}
                    title={collapsed ? (lang === 'ar' ? item.labelAr : item.labelEn) : undefined}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 cursor-pointer group relative ${
                      collapsed ? 'justify-center px-2' : ''
                    } ${
                      isActive
                        ? 'surface-active text-[var(--accent-text)]'
                        : 'text-[var(--text-muted)] hover:text-[var(--text-secondary)] hover:bg-[var(--bg-surface-hover)] border border-transparent'
                    }`}
                  >
                    {isActive && (
                      <span className={`absolute top-1/2 -translate-y-1/2 w-0.5 h-5 rounded-full bg-[var(--accent)] ${isRtl ? 'right-0' : 'left-0'}`} />
                    )}
                    <span className={`shrink-0 ${isActive ? 'text-[var(--accent-text)]' : 'text-[var(--text-muted)] group-hover:text-[var(--text-secondary)]'}`}>
                      {item.icon}
                    </span>
                    {!collapsed && (
                      <span className={`truncate flex-1 text-[13px] ${isRtl ? 'text-right' : 'text-left'}`}>
                        {lang === 'ar' ? item.labelAr : item.labelEn}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* User Footer */}
      <div className={`p-3 border-t border-white/[0.06] ${collapsed ? 'flex justify-center' : ''}`}>
        <button
          onClick={onOpenProfile}
          className={`w-full flex items-center gap-3 p-2.5 rounded-xl bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.06] hover:border-amber-500/20 transition-all cursor-pointer group ${
            collapsed ? 'justify-center p-2' : ''
          }`}
        >
          <img
            src={userProfile.avatar}
            alt={userProfile.name}
            className="w-9 h-9 rounded-lg bg-slate-800 border border-amber-500/30 shrink-0"
          />
          {!collapsed && (
            <div className="min-w-0 flex-1 text-right">
              <div className="text-xs font-bold text-white truncate">{userProfile.name}</div>
              <div className="text-[10px] text-slate-500 truncate">{userProfile.email}</div>
            </div>
          )}
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          onClick={onMobileClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 h-full z-50
          bg-[#0c1018]/95 backdrop-blur-xl
          border-white/[0.06]
          transition-all duration-300 ease-in-out
          ${isRtl ? 'right-0 border-l' : 'left-0 border-r'}
          ${collapsed ? 'w-[72px]' : 'w-[272px]'}
          ${mobileOpen
            ? 'translate-x-0'
            : isRtl
              ? 'translate-x-full lg:translate-x-0'
              : '-translate-x-full lg:translate-x-0'
          }
        `}
      >
        {/* Mobile close */}
        <button
          onClick={onMobileClose}
          className={`lg:hidden absolute top-4 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 cursor-pointer ${
            isRtl ? 'left-3' : 'right-3'
          }`}
        >
          <X className="w-5 h-5" />
        </button>

        {/* Collapsed expand button */}
        {collapsed && (
          <button
            onClick={onToggleCollapse}
            className="hidden lg:flex absolute -bottom-12 left-1/2 -translate-x-1/2 p-2 rounded-full bg-[#0c1018] border border-white/10 text-slate-400 hover:text-white cursor-pointer shadow-lg"
          >
            {isRtl ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
          </button>
        )}

        {sidebarContent}
      </aside>
    </>
  );
};

export const MODE_META: Record<AppMode, { titleAr: string; titleEn: string; descAr: string; descEn: string }> = {
  curriculum: {
    titleAr: 'المنهج والكتب',
    titleEn: 'Curriculum & Books',
    descAr: 'مناهج سيسكو الرسمية CCNA • CCNP • CCIE مع كتب تفاعلية متعددة الفصول',
    descEn: 'Official Cisco CCNA • CCNP • CCIE blueprints with multi-chapter interactive textbooks',
  },
  reallife: {
    titleAr: 'شبكات من واقعنا',
    titleEn: 'Real-Life Stories',
    descAr: 'قصص وتشبيهات من الحياة اليومية لشرح البروتوكولات والتقنيات',
    descEn: 'Everyday analogies and stories to explain networking protocols',
  },
  slides: {
    titleAr: 'السلايدات التفاعلية',
    titleEn: 'Interactive Slides',
    descAr: 'عروض تقديمية تفاعلية تغطي أساسيات السويتشينغ والراوتينغ',
    descEn: 'Interactive presentations covering switching and routing fundamentals',
  },
  lab: {
    titleAr: 'المعمل الحي',
    titleEn: 'Live Lab',
    descAr: 'محاكاة تفاعلية لحركة الحزم بين الأجهزة خطوة بخطوة',
    descEn: 'Interactive packet flow simulation across network devices',
  },
  protocols: {
    titleAr: 'آلة البروتوكولات',
    titleEn: 'Protocol State Machine',
    descAr: 'استكشاف حالات البروتوكولات: OSPF, BGP, STP وأكثر',
    descEn: 'Explore protocol state machines: OSPF, BGP, STP and more',
  },
  wireshark: {
    titleAr: 'محلل Wireshark',
    titleEn: 'Wireshark Inspector',
    descAr: 'تحليل الحزم الشبكية طبقة بطبقة كما في Wireshark',
    descEn: 'Layer-by-layer packet analysis like Wireshark',
  },
  cli: {
    titleAr: 'طرفية Cisco CLI',
    titleEn: 'Cisco CLI Terminal',
    descAr: 'محاكي أوامر Cisco IOS للتدريب العملي',
    descEn: 'Cisco IOS command simulator for hands-on practice',
  },
  quiz: {
    titleAr: 'تحدي الاختبار',
    titleEn: 'Exam Quiz',
    descAr: 'اختبارات تدريبية لقياس فهمك للمفاهيم',
    descEn: 'Practice exams to test your understanding',
  },
  ai: {
    titleAr: 'المساعد الذكي',
    titleEn: 'AI Tutor',
    descAr: 'مساعد ذكي متخصص في هندسة الشبكات',
    descEn: 'AI-powered network engineering tutor',
  },
};
