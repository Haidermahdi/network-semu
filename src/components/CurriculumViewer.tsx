import React, { useState, useMemo } from 'react';
import { 
  BookOpen, 
  ChevronRight, 
  ChevronLeft, 
  Layers, 
  Terminal, 
  Award, 
  CheckCircle2, 
  Sparkles, 
  FileText, 
  ExternalLink,
  Table,
  Copy,
  Check,
  Cpu,
  Search,
  Bookmark,
  Shield,
  Layers3,
  Network
} from 'lucide-react';
import { ALL_CURRICULUM_TRACKS } from '../data/ciscoCurriculumData';
import { CurriculumTrack, Language, OfficialReference, UserProfile } from '../types';
import { TopicBookReader } from './TopicBookReader';

interface CurriculumViewerProps {
  lang?: Language;
  onNavigateToLab?: (scenarioId: string) => void;
  onNavigateToRealLife?: (storyId?: string) => void;
  userProfile?: UserProfile | null;
  onUpdateUserProfile?: (profile: UserProfile) => void;
  onOpenAuthModal?: () => void;
}

export const CurriculumViewer: React.FC<CurriculumViewerProps> = ({ 
  lang = 'ar',
  onNavigateToLab, 
  onNavigateToRealLife,
  userProfile,
  onUpdateUserProfile,
  onOpenAuthModal
}) => {
  const [selectedTrack, setSelectedTrack] = useState<CurriculumTrack>(userProfile?.track || 'ccna');
  const [selectedUnitIndex, setSelectedUnitIndex] = useState<number>(0);
  const [selectedTopicIndex, setSelectedTopicIndex] = useState<number>(0);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const activeTrackInfo = ALL_CURRICULUM_TRACKS[selectedTrack];
  const units = activeTrackInfo.sections;
  
  // Safe boundary check
  const currentUnit = units[selectedUnitIndex] || units[0];
  const currentTopic = currentUnit?.topics[selectedTopicIndex] || currentUnit?.topics[0];

  const handleCopyCode = (codeText: string, index: number) => {
    navigator.clipboard.writeText(codeText);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const getRefBadgeColor = (type: OfficialReference['type']) => {
    switch (type) {
      case 'RFC':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/30';
      case 'Cisco OCG':
        return 'bg-blue-500/10 text-blue-400 border-blue-500/30';
      case 'IEEE Standard':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
      case 'Cisco DevNet':
        return 'bg-purple-500/10 text-purple-400 border-purple-500/30';
      default:
        return 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30';
    }
  };

  // Helper map from topic ID to lab scenario
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

  // User Profile Actions
  const handleMarkTopicCompleted = (topicId: string) => {
    if (!userProfile) {
      if (onOpenAuthModal) onOpenAuthModal();
      return;
    }
    const isCompleted = userProfile.completedTopicIds.includes(topicId);
    const updatedCompleted = isCompleted
      ? userProfile.completedTopicIds.filter(id => id !== topicId)
      : [...userProfile.completedTopicIds, topicId];

    const updated: UserProfile = {
      ...userProfile,
      completedTopicIds: updatedCompleted
    };
    if (onUpdateUserProfile) onUpdateUserProfile(updated);
  };

  const handleBookmarkToggle = (topicId: string) => {
    if (!userProfile) {
      if (onOpenAuthModal) onOpenAuthModal();
      return;
    }
    const isBookmarked = userProfile.bookmarkedTopicIds.includes(topicId);
    const updatedBookmarks = isBookmarked
      ? userProfile.bookmarkedTopicIds.filter(id => id !== topicId)
      : [...userProfile.bookmarkedTopicIds, topicId];

    const updated: UserProfile = {
      ...userProfile,
      bookmarkedTopicIds: updatedBookmarks
    };
    if (onUpdateUserProfile) onUpdateUserProfile(updated);
  };

  const handleSaveNote = (topicId: string, note: string) => {
    if (!userProfile) {
      if (onOpenAuthModal) onOpenAuthModal();
      return;
    }
    const updatedNotes = {
      ...(userProfile.personalNotes || {}),
      [topicId]: note
    };
    const updated: UserProfile = {
      ...userProfile,
      personalNotes: updatedNotes
    };
    if (onUpdateUserProfile) onUpdateUserProfile(updated);
  };

  const handleTogglePageRead = (topicId: string, pageNum: number) => {
    if (!userProfile) {
      if (onOpenAuthModal) onOpenAuthModal();
      return;
    }
    const currentPages = userProfile.readPagesRecord?.[topicId] || [];
    const isRead = currentPages.includes(pageNum);
    const newPages = isRead ? currentPages.filter(p => p !== pageNum) : [...currentPages, pageNum];

    const updatedRecord = {
      ...(userProfile.readPagesRecord || {}),
      [topicId]: newPages
    };

    const updated: UserProfile = {
      ...userProfile,
      readPagesRecord: updatedRecord
    };
    if (onUpdateUserProfile) onUpdateUserProfile(updated);
  };

  return (
    <div className="space-y-6">
      {/* Top Certification Track Selector Bar */}
      <div className="p-4 sm:p-6 rounded-3xl bg-gradient-to-r from-slate-900 via-slate-900/90 to-indigo-950/40 border border-slate-800 shadow-2xl flex flex-wrap items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-2xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
              <Award className="w-5 h-5" />
            </span>
            <div>
              <h2 className="text-lg sm:text-xl font-black text-white flex items-center gap-2">
                <span>{lang === 'ar' ? 'المنهج الأكاديمي والكتب التفاعلية المعتمدة من سيسكو' : 'Official Cisco Academic Curriculum & Digital Books'}</span>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 font-mono">
                  {activeTrackInfo.examCode}
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                {lang === 'ar' ? activeTrackInfo.descriptionAr : activeTrackInfo.descriptionEn}
              </p>
            </div>
          </div>
        </div>

        {/* Track Switcher Pills */}
        <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-slate-950/80 border border-slate-800">
          {(['ccna', 'ccnp', 'ccie'] as CurriculumTrack[]).map((trackKey) => {
            const trackData = ALL_CURRICULUM_TRACKS[trackKey];
            const isSelected = selectedTrack === trackKey;
            return (
              <button
                key={trackKey}
                onClick={() => {
                  setSelectedTrack(trackKey);
                  setSelectedUnitIndex(0);
                  setSelectedTopicIndex(0);
                }}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                  isSelected
                    ? 'bg-gradient-to-r from-indigo-600 to-cyan-600 text-white shadow-lg shadow-indigo-600/30'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                }`}
              >
                <span>{trackKey.toUpperCase()}</span>
                <span className="text-[10px] opacity-75 font-mono">
                  ({trackData.sections.length} {lang === 'ar' ? 'وحدات' : 'Units'})
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Layout: Left Units Navigation + Right Topic Presentation */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Units and Topics Sidebar */}
        <div className="lg:col-span-4 space-y-4">
          <div className="p-4 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-4">
            {/* Search Input */}
            <div className="relative">
              <Search className="w-4 h-4 absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={lang === 'ar' ? 'بحث في مواضيع المنهج والبروتوكولات...' : 'Search blueprint topics & protocols...'}
                className="w-full pr-10 pl-4 py-2.5 rounded-2xl bg-slate-950 border border-slate-800 text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
              />
            </div>

            {/* Filtered Topics or Standard Units Accordion */}
            {searchQuery.trim() ? (
              <div className="space-y-1.5 max-h-[600px] overflow-y-auto pr-1">
                <div className="text-[11px] font-mono text-slate-400 mb-2 px-1">
                  {lang === 'ar' ? 'نتائج البحث:' : 'Search Results:'}
                </div>
                {units.flatMap((u, uIdx) => 
                  u.topics.map((t, tIdx) => {
                    const match = t.titleAr.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                  t.titleEn.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                  t.ciscoBlueprintRef.toLowerCase().includes(searchQuery.toLowerCase());
                    if (!match) return null;
                    return (
                      <button
                        key={t.id}
                        onClick={() => {
                          setSelectedUnitIndex(uIdx);
                          setSelectedTopicIndex(tIdx);
                        }}
                        className={`w-full p-2.5 rounded-xl text-right text-xs transition-all flex items-center justify-between ${
                          selectedUnitIndex === uIdx && selectedTopicIndex === tIdx
                            ? 'bg-indigo-600 text-white font-bold'
                            : 'bg-slate-950/60 text-slate-300 hover:bg-slate-800'
                        }`}
                      >
                        <div className="truncate">
                          <div>{lang === 'ar' ? t.titleAr : t.titleEn}</div>
                          <div className="text-[10px] text-slate-400 font-mono">{t.ciscoBlueprintRef}</div>
                        </div>
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-900 border border-slate-700 text-cyan-300">
                          {t.level}
                        </span>
                      </button>
                    );
                  })
                )}
              </div>
            ) : (
              <div className="space-y-2.5 max-h-[650px] overflow-y-auto pr-1">
                {units.map((unit, uIdx) => (
                  <div
                    key={unit.id}
                    className={`rounded-2xl border transition-all overflow-hidden ${
                      selectedUnitIndex === uIdx
                        ? 'bg-slate-950/90 border-indigo-500/40 shadow-lg'
                        : 'bg-slate-950/40 border-slate-800/80 hover:border-slate-700'
                    }`}
                  >
                    <button
                      onClick={() => {
                        setSelectedUnitIndex(uIdx);
                        setSelectedTopicIndex(0);
                      }}
                      className="w-full p-3 text-right flex items-center justify-between gap-2 cursor-pointer"
                    >
                      <div className="space-y-0.5">
                        <span className="text-[10px] font-mono font-bold text-indigo-400 uppercase">
                          {unit.moduleBadge}
                        </span>
                        <h3 className={`text-xs font-bold leading-tight ${selectedUnitIndex === uIdx ? 'text-white' : 'text-slate-300'}`}>
                          {lang === 'ar' ? unit.unitTitleAr : unit.unitTitleEn}
                        </h3>
                      </div>
                      <span className="w-5 h-5 rounded-full bg-slate-800 text-[11px] font-mono font-bold flex items-center justify-center shrink-0 text-slate-200">
                        {unit.unitNumber}
                      </span>
                    </button>

                    {/* Sub-topics list */}
                    {selectedUnitIndex === uIdx && (
                      <div className="p-2 pt-0 space-y-1 border-t border-slate-800/60 bg-slate-900/40">
                        {unit.topics.map((topic, tIdx) => {
                          const isCompleted = userProfile?.completedTopicIds.includes(topic.id);
                          const isBookmarked = userProfile?.bookmarkedTopicIds.includes(topic.id);
                          return (
                            <button
                              key={topic.id}
                              onClick={() => setSelectedTopicIndex(tIdx)}
                              className={`w-full p-2.5 rounded-xl text-xs transition-all flex items-center justify-between cursor-pointer ${
                                selectedTopicIndex === tIdx
                                  ? 'bg-indigo-600 text-white font-bold shadow-md shadow-indigo-600/30'
                                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                              }`}
                            >
                              <div className="flex items-center gap-1.5 truncate">
                                {isCompleted && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />}
                                {isBookmarked && <Bookmark className="w-3.5 h-3.5 text-amber-400 fill-amber-400 shrink-0" />}
                                <span className="truncate">
                                  {lang === 'ar' ? topic.titleAr : topic.titleEn}
                                </span>
                              </div>
                              <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-950/60 border border-slate-800 font-mono text-slate-300">
                                {topic.level}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Detailed Topic Presentation & Verification Body */}
        <div className="lg:col-span-8 space-y-6">
          {currentTopic ? (
            <>
              {/* Topic Hero Card */}
              <div className="p-6 rounded-3xl bg-gradient-to-r from-slate-900 via-slate-900/90 to-indigo-950/40 border border-slate-800 shadow-2xl space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-xs font-mono font-bold">
                      {currentTopic.ciscoBlueprintRef}
                    </span>
                    <span className="px-3 py-1 rounded-full bg-slate-950 text-emerald-400 border border-slate-800 text-xs font-mono font-bold">
                      {lang === 'ar' ? `المستوى: ${currentTopic.level}` : `Certification Tier: ${currentTopic.level}`}
                    </span>
                  </div>

                  {/* Navigation jump shortcuts */}
                  <div className="flex flex-wrap items-center gap-2">
                    {onNavigateToLab && (
                      <button
                        onClick={() => onNavigateToLab(getTopicLabScenarioId(currentTopic.id))}
                        className="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-lg shadow-indigo-600/30 transition-all cursor-pointer"
                      >
                        <Cpu className="w-3.5 h-3.5" />
                        <span>{lang === 'ar' ? 'انتقل للمعمل الحي لهذا الدرس 🚀' : 'Launch Interactive Lab 🚀'}</span>
                      </button>
                    )}

                    {onNavigateToRealLife && (
                      <button
                        onClick={() => onNavigateToRealLife(getTopicRealLifeStoryId(currentTopic.id))}
                        className="px-3.5 py-1.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer"
                      >
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>{lang === 'ar' ? 'القصة الواقعية 🏙️' : 'Real-Life Story 🏙️'}</span>
                      </button>
                    )}
                  </div>
                </div>

                <div>
                  <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                    {lang === 'ar' ? currentTopic.titleAr : currentTopic.titleEn}
                  </h1>
                  <p className="text-xs sm:text-sm text-cyan-300 font-mono mt-1">
                    {lang === 'ar' ? currentTopic.titleEn : currentTopic.titleAr}
                  </p>
                </div>
              </div>

              {/* Official Cisco & RFC Academic References */}
              {currentTopic.officialReferences && currentTopic.officialReferences.length > 0 && (
                <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-md space-y-2.5">
                  <div className="flex items-center gap-2 text-xs font-bold text-indigo-300">
                    <Bookmark className="w-4 h-4 text-indigo-400" />
                    <span>
                      {lang === 'ar' ? 'المراجع والمصادر الرسمية المعتمدة (Official Standards & RFC References):' : 'Official Academic Standards & Cert Guide References:'}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {currentTopic.officialReferences.map((ref, idx) => (
                      <div 
                        key={idx} 
                        className="p-3 rounded-xl bg-slate-950 border border-slate-800/90 text-xs space-y-1 flex flex-col justify-between"
                      >
                        <div className="flex items-center justify-between gap-2">
                          <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border ${getRefBadgeColor(ref.type)}`}>
                            {ref.type}
                          </span>
                          <span className="font-mono text-[11px] text-cyan-300 font-bold">
                            {ref.code}
                          </span>
                        </div>
                        <div className="font-bold text-slate-200 text-xs">{ref.title}</div>
                        <div className="text-[11px] text-slate-400 italic">{ref.citation}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* MULTI-PAGE CISCO DIGITAL TEXTBOOK READER & SUMMARY */}
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

              {/* Cisco CLI Verification Outputs */}
              {currentTopic.ciscoCliOutputs && currentTopic.ciscoCliOutputs.length > 0 && (
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-sm font-bold text-white">
                    <Terminal className="w-4 h-4 text-cyan-400" />
                    <span>
                      {lang === 'ar' ? 'مخرجات أوامر التحقق المعيارية من أنظمة سيسكو (Cisco IOS Verification):' : 'Cisco IOS-XE Verification Outputs & CLI Traces:'}
                    </span>
                  </div>

                  {currentTopic.ciscoCliOutputs.map((cli, idx) => (
                    <div key={idx} className="rounded-2xl bg-[#0b0f19] border border-slate-800 shadow-xl overflow-hidden font-mono text-xs">
                      {/* Terminal Top Bar */}
                      <div className="px-4 py-2 bg-slate-900 border-b border-slate-800 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-emerald-400" />
                          <span className="text-emerald-300 font-bold">{cli.deviceName}# {cli.command}</span>
                        </div>

                        <button
                          onClick={() => handleCopyCode(cli.output, idx)}
                          className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] flex items-center gap-1 font-sans cursor-pointer"
                        >
                          {copiedIndex === idx ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                          <span>{lang === 'ar' ? 'نسخ' : 'Copy'}</span>
                        </button>
                      </div>

                      {/* Output trace */}
                      <pre className="p-4 overflow-x-auto text-slate-300 whitespace-pre leading-relaxed dir-ltr text-left select-text">
                        {cli.output}
                      </pre>

                      {/* Explanation bar */}
                      <div className="p-3 bg-indigo-950/30 border-t border-slate-800/80 text-indigo-200 text-xs font-sans flex items-start gap-2">
                        <Cpu className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                        <span>{lang === 'ar' ? cli.explanationAr : (cli.explanationEn || cli.explanationAr)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Real World Analogy & Mapping Table (المثال الذكي والقصة الواقعية) */}
              {currentTopic.realWorldAnalogy && (
                <div className="p-6 rounded-3xl bg-gradient-to-br from-slate-900 to-indigo-950/40 border border-indigo-500/30 shadow-2xl space-y-4">
                  <div className="flex items-center gap-2 text-sm font-bold text-indigo-300">
                    <Sparkles className="w-4 h-4 text-amber-400" />
                    <span>
                      {lang === 'ar' ? `المثال الذكي من الحياة الواقعية: ${currentTopic.realWorldAnalogy.titleAr}` : `Real-World Analogy: ${currentTopic.realWorldAnalogy.titleEn || currentTopic.realWorldAnalogy.titleAr}`}
                    </span>
                  </div>

                  <p className="text-xs sm:text-sm text-slate-200 leading-relaxed bg-slate-950/80 p-4 rounded-2xl border border-slate-800">
                    {lang === 'ar' ? currentTopic.realWorldAnalogy.storyAr : (currentTopic.realWorldAnalogy.storyEn || currentTopic.realWorldAnalogy.storyAr)}
                  </p>

                  {/* Mapping table */}
                  <div className="space-y-2">
                    <div className="text-xs font-bold text-slate-300">
                      {lang === 'ar' ? 'جدول المطابقة المنهجية مع مصطلحات هندسة سيسكو:' : 'Syllabus Mapping with Cisco Technical Terminology:'}
                    </div>
                    <div className="overflow-x-auto">
                      <table className={`w-full text-xs bg-slate-950/90 rounded-xl border border-slate-800 ${lang === 'ar' ? 'text-right' : 'text-left'}`}>
                        <thead>
                          <tr className="border-b border-slate-800 text-slate-400 text-[11px]">
                            <th className="p-2.5">{lang === 'ar' ? 'المفهوم في الواقع المعاش' : 'Real-Life Everyday Concept'}</th>
                            <th className="p-2.5">{lang === 'ar' ? 'التقنية المقابلة في الشبكات' : 'Corresponding Network Tech'}</th>
                            <th className="p-2.5 font-mono">{lang === 'ar' ? 'مصطلح سيسكو المعتمد (Cisco Standard)' : 'Official Cisco Terminology'}</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800/50">
                          {currentTopic.realWorldAnalogy.mappingTable.map((mapItem, idx) => (
                            <tr key={idx} className="hover:bg-slate-900/40">
                              <td className="p-2.5 text-slate-200">{mapItem.realLife}</td>
                              <td className="p-2.5 text-cyan-300 font-semibold">{mapItem.networkTech}</td>
                              <td className="p-2.5 font-mono text-amber-300 font-bold">{mapItem.ciscoTerm}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="p-8 rounded-3xl bg-slate-900 border border-slate-800 text-center text-slate-400">
              {lang === 'ar' ? 'الرجاء اختيار موضوع من الفهرس' : 'Please select a topic from the curriculum index'}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
