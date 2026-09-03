import React, { useState, useMemo } from 'react';
import {
  BookOpen,
  Terminal,
  Award,
  CheckCircle2,
  Sparkles,
  Bookmark,
  Cpu,
  Search,
  Layers,
  FileText,
  Lightbulb,
  GraduationCap,
  Sidebar,
  Maximize2,
} from 'lucide-react';
import { ALL_CURRICULUM_TRACKS } from '../data/ciscoCurriculumData';
import { CurriculumTrack, Language, UserProfile } from '../types';
import { TopicBookReader } from './TopicBookReader';
import {
  StatCard,
  ProgressBar,
  TabBar,
  SectionHeader,
  VisualMapping,
  ReferenceCard,
  CliPanel,
} from './ui/ContentDisplay';

interface CurriculumViewerProps {
  lang?: Language;
  onNavigateToLab?: (scenarioId: string) => void;
  onNavigateToRealLife?: (storyId?: string) => void;
  userProfile?: UserProfile | null;
  onUpdateUserProfile?: (profile: UserProfile) => void;
  onOpenAuthModal?: () => void;
}

type TopicTab = 'book' | 'references' | 'cli' | 'analogy';

export const CurriculumViewer: React.FC<CurriculumViewerProps> = ({
  lang = 'ar',
  onNavigateToLab,
  onNavigateToRealLife,
  userProfile,
  onUpdateUserProfile,
  onOpenAuthModal,
}) => {
  const [selectedTrack, setSelectedTrack] = useState<CurriculumTrack>(userProfile?.track || 'ccna');
  const [selectedUnitIndex, setSelectedUnitIndex] = useState<number>(0);
  const [selectedTopicIndex, setSelectedTopicIndex] = useState<number>(0);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [activeTopicTab, setActiveTopicTab] = useState<TopicTab>('book');
  const [isTopicsSidebarOpen, setIsTopicsSidebarOpen] = useState<boolean>(true);

  const activeTrackInfo = ALL_CURRICULUM_TRACKS[selectedTrack];
  const units = activeTrackInfo.sections;
  const currentUnit = units[selectedUnitIndex] || units[0];
  const currentTopic = currentUnit?.topics[selectedTopicIndex] || currentUnit?.topics[0];

  const totalTopics = useMemo(() => units.reduce((sum, u) => sum + u.topics.length, 0), [units]);
  const completedCount = useMemo(
    () => units.flatMap(u => u.topics).filter(t => userProfile?.completedTopicIds.includes(t.id)).length,
    [units, userProfile]
  );

  const handleCopyCode = (codeText: string, index: number) => {
    navigator.clipboard.writeText(codeText);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const getTopicLabScenarioId = (topicId: string): string => {
    if (topicId.includes('subnetting') || topicId.includes('ipv4')) return 'cross-network-journey';
    if (topicId.includes('vlan') || topicId.includes('trunk')) return 'vlan-segmentation';
    if (topicId.includes('ospf')) return 'ospf-convergence';
    if (topicId.includes('stp')) return 'stp-loop-prevention';
    if (topicId.includes('bgp')) return 'bgp-peering';
    if (topicId.includes('hsrp')) return 'hsrp-failover';
    if (topicId.includes('nat')) return 'nat-pat-translation';
    if (topicId.includes('vxlan')) return 'vxlan-evpn';
    return 'cross-network-journey';
  };

  const getTopicRealLifeStoryId = (topicId: string): string => {
    if (topicId.includes('subnetting') || topicId.includes('ipv4')) return 'postal-delivery-packet';
    if (topicId.includes('vlan')) return 'corporate-building-vlans';
    if (topicId.includes('ospf')) return 'traffic-gps-routing';
    if (topicId.includes('stp')) return 'roundabout-traffic-cop';
    if (topicId.includes('bgp')) return 'international-airport-hub';
    return 'postal-delivery-packet';
  };

  const handleMarkTopicCompleted = (topicId: string) => {
    if (!userProfile) { onOpenAuthModal?.(); return; }
    const isCompleted = userProfile.completedTopicIds.includes(topicId);
    const updated: UserProfile = {
      ...userProfile,
      completedTopicIds: isCompleted
        ? userProfile.completedTopicIds.filter(id => id !== topicId)
        : [...userProfile.completedTopicIds, topicId],
    };
    onUpdateUserProfile?.(updated);
  };

  const handleBookmarkToggle = (topicId: string) => {
    if (!userProfile) { onOpenAuthModal?.(); return; }
    const isBookmarked = userProfile.bookmarkedTopicIds.includes(topicId);
    const updated: UserProfile = {
      ...userProfile,
      bookmarkedTopicIds: isBookmarked
        ? userProfile.bookmarkedTopicIds.filter(id => id !== topicId)
        : [...userProfile.bookmarkedTopicIds, topicId],
    };
    onUpdateUserProfile?.(updated);
  };

  const handleSaveNote = (topicId: string, note: string) => {
    if (!userProfile) { onOpenAuthModal?.(); return; }
    const updated: UserProfile = {
      ...userProfile,
      personalNotes: { ...(userProfile.personalNotes || {}), [topicId]: note },
    };
    onUpdateUserProfile?.(updated);
  };

  const handleTogglePageRead = (topicId: string, pageNum: number) => {
    if (!userProfile) { onOpenAuthModal?.(); return; }
    const currentPages = userProfile.readPagesRecord?.[topicId] || [];
    const isRead = currentPages.includes(pageNum);
    const updated: UserProfile = {
      ...userProfile,
      readPagesRecord: {
        ...(userProfile.readPagesRecord || {}),
        [topicId]: isRead ? currentPages.filter(p => p !== pageNum) : [...currentPages, pageNum],
      },
    };
    onUpdateUserProfile?.(updated);
  };

  const topicTabs = [
    { id: 'book', label: lang === 'ar' ? 'الكتاب التفاعلي' : 'Interactive Book', icon: <BookOpen className="w-3.5 h-3.5" /> },
    { id: 'references', label: lang === 'ar' ? 'المراجع الرسمية' : 'References', icon: <FileText className="w-3.5 h-3.5" />, count: currentTopic?.officialReferences?.length },
    { id: 'cli', label: lang === 'ar' ? 'أوامر CLI' : 'CLI Commands', icon: <Terminal className="w-3.5 h-3.5" />, count: currentTopic?.ciscoCliOutputs?.length },
    { id: 'analogy', label: lang === 'ar' ? 'التشبيه الواقعي' : 'Real Analogy', icon: <Lightbulb className="w-3.5 h-3.5" /> },
  ];

  return (
    <div className="space-y-6 animate-fade-in-up">
      {/* ── Progress Dashboard ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <StatCard
          icon={<GraduationCap className="w-4 h-4" />}
          label={lang === 'ar' ? 'المسار النشط' : 'Active Track'}
          value={selectedTrack.toUpperCase()}
        />
        <StatCard
          icon={<Layers className="w-4 h-4" />}
          label={lang === 'ar' ? 'الوحدات' : 'Units'}
          value={units.length}
        />
        <StatCard
          icon={<BookOpen className="w-4 h-4" />}
          label={lang === 'ar' ? 'إجمالي المواضيع' : 'Total Topics'}
          value={totalTopics}
        />
        <StatCard
          icon={<CheckCircle2 className="w-4 h-4" />}
          label={lang === 'ar' ? 'مكتمل' : 'Completed'}
          value={completedCount}
        />
      </div>

      {/* ── Track Selector + Progress ── */}
      <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/[0.06] space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-base font-black text-white">
              {lang === 'ar' ? activeTrackInfo.titleAr : activeTrackInfo.titleEn}
            </h2>
            <p className="text-xs text-slate-500 mt-1 font-mono">{activeTrackInfo.examCode}</p>
          </div>
          <div className="flex items-center gap-1.5 p-1 rounded-xl bg-white/[0.03] border border-white/[0.06]">
            {(['ccna', 'ccnp', 'ccie'] as CurriculumTrack[]).map((trackKey) => (
              <button
                key={trackKey}
                onClick={() => { setSelectedTrack(trackKey); setSelectedUnitIndex(0); setSelectedTopicIndex(0); }}
                className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  selectedTrack === trackKey
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {trackKey.toUpperCase()}
              </button>
            ))}
          </div>
        </div>
        <ProgressBar
          value={completedCount}
          max={totalTopics}
          label={lang === 'ar' ? 'تقدم إنجاز المسار' : 'Track Progress'}
        />
      </div>

      {/* ── Main Layout ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* Units Sidebar */}
        {isTopicsSidebarOpen && (
          <div className="lg:col-span-4 space-y-3">
            <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.06] space-y-3">
              <div className="flex items-center justify-between gap-2 pb-1">
                <span className="text-xs font-bold text-slate-400 flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-amber-400" />
                  <span>{lang === 'ar' ? 'فهرس الوحدات والمواضيع' : 'Units & Topics'}</span>
                </span>
                <button
                  onClick={() => setIsTopicsSidebarOpen(false)}
                  className="p-1.5 rounded-lg bg-white/[0.03] hover:bg-white/[0.08] text-slate-400 hover:text-white text-[11px] font-bold flex items-center gap-1 transition-all cursor-pointer"
                  title={lang === 'ar' ? 'إخفاء الفهرس لتوسيع مساحة القراءة' : 'Collapse to expand reading canvas'}
                >
                  <Sidebar className="w-3 h-3 text-amber-400" />
                  <span className="hidden sm:inline">{lang === 'ar' ? 'إخفاء' : 'Collapse'}</span>
                </button>
              </div>
              <div className="relative">
                <Search className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={lang === 'ar' ? 'بحث في المواضيع...' : 'Search topics...'}
                  className="w-full pr-10 pl-4 py-2.5 rounded-xl bg-white/[0.03] border border-white/[0.06] text-xs text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-amber-500/40 transition-colors"
                />
              </div>

              <div className="space-y-2 max-h-[600px] overflow-y-auto sidebar-scroll">
              {searchQuery.trim() ? (
                units.flatMap((u, uIdx) =>
                  u.topics.map((t, tIdx) => {
                    const match = t.titleAr.toLowerCase().includes(searchQuery.toLowerCase()) ||
                      t.titleEn.toLowerCase().includes(searchQuery.toLowerCase());
                    if (!match) return null;
                    const isActive = selectedUnitIndex === uIdx && selectedTopicIndex === tIdx;
                    return (
                      <button
                        key={t.id}
                        onClick={() => { setSelectedUnitIndex(uIdx); setSelectedTopicIndex(tIdx); setActiveTopicTab('book'); }}
                        className={`w-full p-3 rounded-xl text-right text-xs transition-all cursor-pointer ${
                          isActive ? 'bg-amber-500/15 text-amber-300 border border-amber-500/30' : 'hover:bg-white/[0.04] text-slate-400'
                        }`}
                      >
                        <div className="font-bold truncate">{lang === 'ar' ? t.titleAr : t.titleEn}</div>
                        <div className="text-[10px] text-slate-500 font-mono mt-0.5">{t.ciscoBlueprintRef}</div>
                      </button>
                    );
                  })
                )
              ) : (
                units.map((unit, uIdx) => {
                  const unitCompleted = unit.topics.filter(t => userProfile?.completedTopicIds.includes(t.id)).length;
                  const isUnitActive = selectedUnitIndex === uIdx;
                  return (
                    <div
                      key={unit.id}
                      className={`rounded-xl border transition-all overflow-hidden ${
                        isUnitActive ? 'border-amber-500/25 bg-amber-500/5' : 'border-white/[0.06] bg-white/[0.01]'
                      }`}
                    >
                      <button
                        onClick={() => { setSelectedUnitIndex(uIdx); setSelectedTopicIndex(0); }}
                        className="w-full p-3 text-right flex items-center gap-3 cursor-pointer"
                      >
                        <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-sm font-black shrink-0 ${
                          isUnitActive ? 'bg-amber-500 text-black' : 'bg-white/[0.06] text-slate-400'
                        }`}>
                          {unit.unitNumber}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="text-[10px] font-mono text-amber-400/70">{unit.moduleBadge}</div>
                          <h3 className={`text-xs font-bold leading-tight truncate ${isUnitActive ? 'text-white' : 'text-slate-300'}`}>
                            {lang === 'ar' ? unit.unitTitleAr : unit.unitTitleEn}
                          </h3>
                          <div className="mt-1.5">
                            <ProgressBar value={unitCompleted} max={unit.topics.length} />
                          </div>
                        </div>
                      </button>

                      {isUnitActive && (
                        <div className="px-2 pb-2 space-y-0.5 border-t border-white/[0.04]">
                          {unit.topics.map((topic, tIdx) => {
                            const isCompleted = userProfile?.completedTopicIds.includes(topic.id);
                            const isBookmarked = userProfile?.bookmarkedTopicIds.includes(topic.id);
                            const isTopicActive = selectedTopicIndex === tIdx;
                            return (
                              <button
                                key={topic.id}
                                onClick={() => { setSelectedTopicIndex(tIdx); setActiveTopicTab('book'); }}
                                className={`w-full p-2.5 rounded-lg text-xs transition-all flex items-center gap-2 cursor-pointer ${
                                  isTopicActive
                                    ? 'bg-amber-500/15 text-amber-300 font-bold'
                                    : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.03]'
                                }`}
                              >
                                {isCompleted && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />}
                                {isBookmarked && <Bookmark className="w-3.5 h-3.5 text-amber-400 fill-amber-400 shrink-0" />}
                                <span className="truncate flex-1 text-right">
                                  {lang === 'ar' ? topic.titleAr : topic.titleEn}
                                </span>
                              </button>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      )}

        {/* Topic Content */}
        <div className={`${isTopicsSidebarOpen ? 'lg:col-span-8' : 'lg:col-span-12'} space-y-4`}>
          {currentTopic ? (
            <>
              {/* Topic Hero */}
              <div className="p-5 rounded-2xl bg-gradient-to-br from-white/[0.04] to-white/[0.01] border border-white/[0.08] space-y-4">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="space-y-2">
                    <div className="flex flex-wrap gap-2">
                      <span className="px-2.5 py-1 rounded-lg bg-amber-500/15 text-amber-400 border border-amber-500/25 text-[10px] font-mono font-bold">
                        {currentTopic.ciscoBlueprintRef}
                      </span>
                      <span className="px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-bold">
                        {currentTopic.level}
                      </span>
                    </div>
                    <h1 className="text-lg sm:text-xl font-black text-white leading-tight">
                      {lang === 'ar' ? currentTopic.titleAr : currentTopic.titleEn}
                    </h1>
                    <p className="text-xs text-slate-500 font-mono">
                      {lang === 'ar' ? currentTopic.titleEn : currentTopic.titleAr}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => setIsTopicsSidebarOpen(!isTopicsSidebarOpen)}
                      className={`px-3 py-2 rounded-xl border font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer ${
                        !isTopicsSidebarOpen
                          ? 'bg-amber-500/20 text-amber-300 border-amber-500/30 ring-1 ring-amber-500/20'
                          : 'bg-white/[0.04] hover:bg-white/[0.08] text-slate-300 border-white/[0.08]'
                      }`}
                      title={isTopicsSidebarOpen ? (lang === 'ar' ? 'إخفاء الفهرس وتوسيع مساحة القراءة' : 'Collapse Sidebar') : (lang === 'ar' ? 'إظهار فهرس المواضيع' : 'Show Topics')}
                    >
                      <Sidebar className="w-3.5 h-3.5 text-amber-400" />
                      <span>
                        {isTopicsSidebarOpen
                          ? (lang === 'ar' ? 'توسيع العرض' : 'Expand')
                          : (lang === 'ar' ? 'إظهار الفهرس' : 'Show Topics')}
                      </span>
                    </button>
                    {onNavigateToLab && (
                      <button
                        onClick={() => onNavigateToLab(getTopicLabScenarioId(currentTopic.id))}
                        className="px-3 py-2 rounded-xl bg-cyan-500/15 hover:bg-cyan-500/25 text-cyan-300 border border-cyan-500/25 font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer"
                      >
                        <Cpu className="w-3.5 h-3.5" />
                        <span>{lang === 'ar' ? 'المعمل الحي' : 'Live Lab'}</span>
                      </button>
                    )}
                    {onNavigateToRealLife && (
                      <button
                        onClick={() => onNavigateToRealLife(getTopicRealLifeStoryId(currentTopic.id))}
                        className="px-3 py-2 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 border border-amber-500/25 font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer"
                      >
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>{lang === 'ar' ? 'قصة واقعية' : 'Real Story'}</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Content Tabs */}
              <TabBar tabs={topicTabs} activeTab={activeTopicTab} onChange={(id) => setActiveTopicTab(id as TopicTab)} />

              {/* Tab Content */}
              {activeTopicTab === 'book' && (
                <TopicBookReader
                  topic={currentTopic}
                  lang={lang}
                  isCompleted={userProfile?.completedTopicIds.includes(currentTopic.id)}
                  onMarkTopicCompleted={handleMarkTopicCompleted}
                  isBookmarked={userProfile?.bookmarkedTopicIds.includes(currentTopic.id)}
                  onBookmarkToggle={handleBookmarkToggle}
                  savedNote={userProfile?.personalNotes?.[currentTopic.id] || ''}
                  onSaveNote={handleSaveNote}
                  readPages={userProfile?.readPagesRecord?.[currentTopic.id] || []}
                  onTogglePageRead={handleTogglePageRead}
                />
              )}

              {activeTopicTab === 'references' && currentTopic.officialReferences && (
                <div className="space-y-4">
                  <SectionHeader
                    icon={<Award className="w-5 h-5" />}
                    title={lang === 'ar' ? 'المراجع والمصادر الرسمية المعتمدة' : 'Official Standards & References'}
                    subtitle="RFC • Cisco OCG • IEEE Standards"
                  />
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {currentTopic.officialReferences.map((ref, idx) => (
                      <ReferenceCard
                        key={idx}
                        type={ref.type}
                        code={ref.code}
                        title={ref.title}
                        citation={ref.citation}
                      />
                    ))}
                  </div>
                </div>
              )}

              {activeTopicTab === 'cli' && currentTopic.ciscoCliOutputs && (
                <div className="space-y-4">
                  <SectionHeader
                    icon={<Terminal className="w-5 h-5" />}
                    title={lang === 'ar' ? 'أوامر التحقق من Cisco IOS' : 'Cisco IOS Verification Commands'}
                    subtitle={lang === 'ar' ? 'مخرجات حقيقية مع شرح هندسي' : 'Real outputs with engineering analysis'}
                  />
                  <div className="space-y-3">
                    {currentTopic.ciscoCliOutputs.map((cli, idx) => (
                      <CliPanel
                        key={idx}
                        deviceName={cli.deviceName}
                        command={cli.command}
                        output={cli.output}
                        explanation={lang === 'ar' ? cli.explanationAr : (cli.explanationEn || cli.explanationAr)}
                        onCopy={() => handleCopyCode(cli.output, idx)}
                        copied={copiedIndex === idx}
                        lang={lang}
                      />
                    ))}
                  </div>
                </div>
              )}

              {activeTopicTab === 'analogy' && currentTopic.realWorldAnalogy && (
                <div className="space-y-4">
                  <SectionHeader
                    icon={<Lightbulb className="w-5 h-5" />}
                    title={lang === 'ar' ? currentTopic.realWorldAnalogy.titleAr : (currentTopic.realWorldAnalogy.titleEn || currentTopic.realWorldAnalogy.titleAr)}
                    subtitle={lang === 'ar' ? 'تشبيه من الحياة الواقعية لفهم المفهوم' : 'Real-life analogy to understand the concept'}
                  />
                  <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/[0.06]">
                    <p className="text-sm text-slate-200 leading-relaxed">
                      {lang === 'ar' ? currentTopic.realWorldAnalogy.storyAr : (currentTopic.realWorldAnalogy.storyEn || currentTopic.realWorldAnalogy.storyAr)}
                    </p>
                  </div>
                  <VisualMapping items={currentTopic.realWorldAnalogy.mappingTable} lang={lang} />
                </div>
              )}
            </>
          ) : (
            <div className="p-12 rounded-2xl bg-white/[0.02] border border-white/[0.06] text-center">
              <BookOpen className="w-10 h-10 text-slate-600 mx-auto mb-3" />
              <p className="text-slate-500 text-sm">
                {lang === 'ar' ? 'اختر موضوعاً من القائمة الجانبية' : 'Select a topic from the sidebar'}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
