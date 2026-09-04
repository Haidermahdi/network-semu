import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Users, 
  MapPin, 
  Sparkles, 
  Play, 
  Pause, 
  RotateCcw, 
  SkipForward, 
  SkipBack, 
  BookOpen, 
  Cpu, 
  Layers, 
  MessageSquare, 
  Lightbulb, 
  ArrowRight,
  ArrowLeft,
  Shield,
  HelpCircle,
  CheckCircle2,
  Navigation,
  Compass,
  Terminal,
  Activity,
  Award,
  Radio,
  Send,
  Search,
  Filter,
  Info
} from 'lucide-react';
import { HUMAN_NETWORK_STORIES } from '../data/humanNetworkStoriesData';
import { HumanNetworkStory, StreetCharacter, StreetStoryStep, Language, CurriculumTrack } from '../types';
import { ContentPanel } from './ui/ContentDisplay';
import { 
  NetworkDeviceTooltip, 
  ComponentQuickTooltip, 
  inferDeviceTechnicalProfile 
} from './NetworkDeviceTooltip';
import { getLocalizedStory, STATIC_STORIES_TRANSLATIONS } from '../utils/storyTranslations';
import { pickText } from '../utils/localePick';

interface RealLifeNetworkProps {
  lang?: Language;
  userTrack?: CurriculumTrack;
  onNavigateToLab?: (scenarioId: string) => void;
}

type StoryCategory = 'all' | 'foundations' | 'switching' | 'routing' | 'security' | 'services' | 'cloud_overlay' | 'wan_advanced';

const CATEGORIES: { id: StoryCategory; labelAr: string; labelEn: string; icon: any }[] = [
  { id: 'all', labelAr: 'الكل', labelEn: 'All', icon: Layers },
  { id: 'foundations', labelAr: 'الأسس', labelEn: 'Foundations', icon: BookOpen },
  { id: 'switching', labelAr: 'L2', labelEn: 'L2', icon: Activity },
  { id: 'routing', labelAr: 'L3', labelEn: 'L3', icon: Navigation },
  { id: 'security', labelAr: 'أمن', labelEn: 'Security', icon: Shield },
  { id: 'services', labelAr: 'خدمات', labelEn: 'Services', icon: Radio },
  { id: 'cloud_overlay', labelAr: 'سحابة', labelEn: 'Cloud', icon: Cpu },
  { id: 'wan_advanced', labelAr: 'WAN', labelEn: 'WAN', icon: Compass }
];

const TRACK_LABEL: Record<CurriculumTrack, { ar: string; en: string; exam: string }> = {
  ccna: { ar: 'CCNA', en: 'CCNA', exam: '200-301' },
  ccnp: { ar: 'CCNP', en: 'CCNP', exam: 'ENCOR/ENARSI' },
  ccie: { ar: 'CCIE', en: 'CCIE', exam: 'EI' },
};

// Avatar helper based on avatarRole
const getAvatarIcon = (role: string) => {
  switch (role) {
    case 'pedestrian':
      return '🚶‍♂️';
    case 'courier':
      return '🛵';
    case 'officer':
      return '👮‍♂️';
    case 'guard':
      return '💂‍♂️';
    case 'driver':
      return '🚚';
    case 'chef':
      return '👨‍⚕️';
    case 'clerk':
      return '👨‍💼';
    case 'student':
      return '👩‍💻';
    default:
      return '👤';
  }
};

export const RealLifeNetwork: React.FC<RealLifeNetworkProps> = ({ 
  lang = 'ar',
  userTrack = 'ccna',
  onNavigateToLab 
}) => {
  const trackStories = React.useMemo(
    () => HUMAN_NETWORK_STORIES.filter(s => (s.track || 'ccna') === userTrack),
    [userTrack]
  );

  const [selectedStoryId, setSelectedStoryId] = useState<string>(trackStories[0]?.id || HUMAN_NETWORK_STORIES[0].id);
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [selectedCharacter, setSelectedCharacter] = useState<StreetCharacter | null>(null);
  const [hoveredCharId, setHoveredCharId] = useState<string | null>(null);
  const [modalDeviceChar, setModalDeviceChar] = useState<StreetCharacter | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<StoryCategory>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  useEffect(() => {
    if (!trackStories.some(s => s.id === selectedStoryId) && trackStories[0]) {
      setSelectedStoryId(trackStories[0].id);
      setCurrentStepIndex(0);
      setIsPlaying(false);
      setSelectedCategory('all');
    }
  }, [userTrack, trackStories, selectedStoryId]);

  // Component state to cache dynamically translated stories from Gemini API
  const [dynamicTranslations, setDynamicTranslations] = useState<Record<string, HumanNetworkStory>>(() => {
    try {
      const cached = localStorage.getItem('story_translations_en');
      return cached ? JSON.parse(cached) : {};
    } catch {
      return {};
    }
  });

  const [isTranslating, setIsTranslating] = useState<boolean>(false);

  // Translate active story when language is changed to English
  useEffect(() => {
    if (lang !== 'en') return;

    // Check if we already have static translation
    const hasStatic = selectedStoryId in STATIC_STORIES_TRANSLATIONS;
    if (hasStatic) return;

    // Check if we already have dynamic translation
    if (dynamicTranslations[selectedStoryId]) return;

    const storyToTranslate = HUMAN_NETWORK_STORIES.find(s => s.id === selectedStoryId);
    if (!storyToTranslate) return;

    let isMounted = true;
    const fetchTranslation = async () => {
      setIsTranslating(true);
      try {
        const response = await fetch('/api/translate-story', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ story: storyToTranslate })
        });
        if (!response.ok) throw new Error('API error');
        const data = await response.json();
        if (data.status === 'success' && data.story && isMounted) {
          const updated = { ...dynamicTranslations, [selectedStoryId]: data.story };
          setDynamicTranslations(updated);
          localStorage.setItem('story_translations_en', JSON.stringify(updated));
        }
      } catch (err) {
        console.warn("Failed to translate via Gemini API, using local fallback", err);
      } finally {
        if (isMounted) setIsTranslating(false);
      }
    };

    fetchTranslation();
    return () => { isMounted = false; };
  }, [selectedStoryId, lang, dynamicTranslations]);

  // Get localized stories for the active certification track only
  const localizedNetworkStories = React.useMemo(() => {
    return trackStories.map(story => {
      if (lang === 'ar') return story;
      if (dynamicTranslations[story.id]) return dynamicTranslations[story.id];
      return getLocalizedStory(story, lang);
    });
  }, [lang, dynamicTranslations, trackStories]);

  const activeStory: HumanNetworkStory = localizedNetworkStories.find(s => s.id === selectedStoryId) || localizedNetworkStories[0] || getLocalizedStory(HUMAN_NETWORK_STORIES[0], lang);
  const currentStep: StreetStoryStep = activeStory.steps[currentStepIndex] || activeStory.steps[0];
  const trackInfo = TRACK_LABEL[userTrack];

  // Filtered stories within the active track
  const filteredStories = localizedNetworkStories.filter(story => {
    if (selectedCategory !== 'all') {
      const cat = story.category || (
        (story.id.includes('osi') || story.id.includes('subnet') || story.id.includes('encapsulation')) ? 'foundations' :
        (story.id.includes('arp') || story.id.includes('stp') || story.id.includes('vlan') || story.id.includes('lacp') || story.id.includes('cdp') || story.id.includes('wireless') || story.id.includes('port-security')) ? 'switching' :
        (story.id.includes('ttl') || story.id.includes('dijkstra') || story.id.includes('bgp') || story.id.includes('eigrp') || story.id.includes('hsrp') || story.id.includes('ipv6') || story.id.includes('ospf') || story.id.includes('static') || story.id.includes('cef') || story.id.includes('rr') || story.id.includes('pim')) ? 'routing' :
        (story.id.includes('ipsec') || story.id.includes('acl') || story.id.includes('copp') || story.id.includes('macsec') || story.id.includes('snooping')) ? 'security' :
        (story.id.includes('nat') || story.id.includes('dhcp') || story.id.includes('dns') || story.id.includes('qos') || story.id.includes('ntp') || story.id.includes('rest') || story.id.includes('pyats') || story.id.includes('tcp')) ? 'services' :
        (story.id.includes('vxlan') || story.id.includes('sda')) ? 'cloud_overlay' :
        (story.id.includes('mpls') || story.id.includes('dmvpn') || story.id.includes('sdwan') || story.id.includes('segment')) ? 'wan_advanced' :
        'all'
      );
      if (cat !== selectedCategory) return false;
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const matchAr = story.titleAr.toLowerCase().includes(q) || story.storySummaryAr.toLowerCase().includes(q);
      const matchEn = story.titleEn.toLowerCase().includes(q);
      const matchProto = story.protocolBadge.toLowerCase().includes(q);
      if (!matchAr && !matchEn && !matchProto) return false;
    }

    return true;
  });

  // Auto playback
  useEffect(() => {
    let interval: any = null;
    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentStepIndex(prev => {
          if (prev < activeStory.steps.length - 1) {
            return prev + 1;
          } else {
            setIsPlaying(false);
            return prev;
          }
        });
      }, 5500);
    }
    return () => clearInterval(interval);
  }, [isPlaying, activeStory]);

  const handleStoryChange = (id: string) => {
    setSelectedStoryId(id);
    setCurrentStepIndex(0);
    setIsPlaying(false);
    setSelectedCharacter(null);
  };

  const handleStepForward = () => {
    if (currentStepIndex < activeStory.steps.length - 1) {
      setCurrentStepIndex(prev => prev + 1);
    }
  };

  const handleStepBackward = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(prev => prev - 1);
    }
  };

  const handleReset = () => {
    setCurrentStepIndex(0);
    setIsPlaying(false);
  };

  // Map story to related lab scenario id
  const getRelatedLabScenarioId = (storyId: string) => {
    if (storyId.includes('arp')) return 'arp-broadcast-resolution';
    if (storyId.includes('stp')) return 'stp-loop-prevention';
    if (storyId.includes('nat')) return 'enterprise-nat-pat';
    if (storyId.includes('ospf')) return 'wan-failover-redundancy';
    if (storyId.includes('vlan')) return 'vlan-segmentation-routing';
    if (storyId.includes('dhcp')) return 'dhcp-ip-addressing';
    if (storyId.includes('acl')) return 'acl-firewall-security';
    return 'cross-network-journey';
  };

  // Accurate spatial positioning along the transmission link
  const charCount = activeStory.characters.length;
  const senderIndex = activeStory.characters.findIndex(c => c.id === currentStep.fromCharacterId);
  const receiverIndex = activeStory.characters.findIndex(c => c.id === currentStep.toCharacterId);
  
  const getSlotPercent = (idx: number) => {
    if (charCount <= 1) return 50;
    const clamped = Math.max(0, Math.min(charCount - 1, idx));
    return ((clamped + 0.5) / charCount) * 100;
  };

  const senderPos = senderIndex >= 0 ? getSlotPercent(senderIndex) : 25;
  const receiverPos = receiverIndex >= 0 ? getSlotPercent(receiverIndex) : 75;
  const isMovingRight = senderPos <= receiverPos;
  const isSameActor = senderIndex === receiverIndex;

  // Dynamic layout class based on character count
  const getCharactersContainerClass = () => {
    if (charCount === 2) {
      return 'grid grid-cols-1 sm:grid-cols-2 max-w-3xl mx-auto gap-6 sm:gap-12';
    }
    if (charCount === 3) {
      return 'grid grid-cols-1 sm:grid-cols-3 max-w-5xl mx-auto gap-4 sm:gap-6';
    }
    return 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 max-w-6xl mx-auto gap-4';
  };

  return (
    <div className={`space-y-4 ${lang === 'ar' ? 'dir-rtl text-right' : 'dir-ltr text-left'}`}>
      <div className="flex flex-wrap items-center justify-between gap-3 px-0.5">
        <div className="min-w-0 space-y-1">
          <div className="flex flex-wrap items-center gap-2">
            <Compass className="w-4 h-4 text-amber-400 shrink-0" />
            <h2 className="text-base sm:text-lg font-black text-white">
              {lang === 'ar' ? 'شبكات من واقعنا' : 'Real-Life Network Stories'}
            </h2>
            <span className="px-2 py-0.5 rounded-md bg-amber-500/15 text-amber-300 border border-amber-500/25 text-[10px] font-bold">
              {trackInfo.en} · {trackStories.length} {lang === 'ar' ? 'سيناريو' : 'stories'}
            </span>
          </div>
          <p className="text-[11px] text-slate-500">
            {lang === 'ar'
              ? `سيناريوهات مسار ${trackInfo.ar} فقط (${trackInfo.exam}) حسب مستواك الدراسي.`
              : `Only ${trackInfo.en} (${trackInfo.exam}) scenarios for your learning track.`}
          </p>
        </div>
        {onNavigateToLab ? (
          <button
            onClick={() => onNavigateToLab(getRelatedLabScenarioId(activeStory.id))}
            className="px-3 py-1.5 rounded-lg bg-cyan-500/15 hover:bg-cyan-500/25 text-cyan-300 border border-cyan-500/25 text-[11px] font-bold flex items-center gap-1.5 transition-all cursor-pointer shrink-0"
          >
            <Cpu className="w-3.5 h-3.5" />
            <span>{lang === 'ar' ? 'المعمل الحي' : 'Live Lab'}</span>
          </button>
        ) : null}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
        <aside className="lg:col-span-4 xl:col-span-3">
          <div className="p-3 rounded-2xl bg-white/[0.02] border border-white/[0.06] space-y-3">
            <div className="relative">
              <Search className={`w-3.5 h-3.5 absolute top-1/2 -translate-y-1/2 text-slate-500 ${lang === 'en' ? 'left-3' : 'right-3'}`} />
              <input
                type="text"
                placeholder={lang === 'ar' ? 'بحث ضمن المسار...' : 'Search in track...'}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`w-full py-2 rounded-xl bg-white/[0.03] border border-white/[0.06] text-xs text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-amber-500/40 ${
                  lang === 'en' ? 'pl-9 pr-3 text-left' : 'pr-9 pl-3 text-right'
                }`}
              />
            </div>

            <div className="flex flex-wrap gap-1">
              {CATEGORIES.map(cat => {
                const Icon = cat.icon;
                const accurateCount = cat.id === 'all'
                  ? localizedNetworkStories.length
                  : localizedNetworkStories.filter(s => {
                      const c = s.category || '';
                      if (c === cat.id) return true;
                      if (c) return false;
                      const id = s.id;
                      if (cat.id === 'foundations') return id.includes('osi') || id.includes('subnet') || id.includes('encapsulation');
                      if (cat.id === 'switching') return id.includes('arp') || id.includes('stp') || id.includes('vlan') || id.includes('lacp') || id.includes('cdp') || id.includes('wireless') || id.includes('port-security');
                      if (cat.id === 'routing') return id.includes('ttl') || id.includes('ospf') || id.includes('bgp') || id.includes('eigrp') || id.includes('hsrp') || id.includes('ipv6') || id.includes('static') || id.includes('dijkstra') || id.includes('cef') || id.includes('rr') || id.includes('pim');
                      if (cat.id === 'security') return id.includes('ipsec') || id.includes('acl') || id.includes('copp') || id.includes('macsec') || id.includes('snooping');
                      if (cat.id === 'services') return id.includes('nat') || id.includes('dhcp') || id.includes('dns') || id.includes('qos') || id.includes('ntp') || id.includes('rest') || id.includes('pyats') || id.includes('tcp');
                      if (cat.id === 'cloud_overlay') return id.includes('vxlan') || id.includes('sda');
                      if (cat.id === 'wan_advanced') return id.includes('mpls') || id.includes('dmvpn') || id.includes('sdwan') || id.includes('segment');
                      return false;
                    }).length;
                if (cat.id !== 'all' && accurateCount === 0) return null;
                const isCatActive = selectedCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`px-2 py-1 rounded-lg text-[10px] font-bold flex items-center gap-1 border transition-all cursor-pointer ${
                      isCatActive
                        ? 'bg-amber-500 text-black border-amber-400'
                        : 'bg-white/[0.03] text-slate-400 border-white/[0.06] hover:text-slate-200'
                    }`}
                  >
                    <Icon className="w-3 h-3" />
                    <span>{lang === 'ar' ? cat.labelAr : cat.labelEn}</span>
                    <span className="opacity-70">{accurateCount}</span>
                  </button>
                );
              })}
            </div>

            <div className="space-y-1 max-h-[62vh] overflow-y-auto sidebar-scroll">
              {filteredStories.length === 0 ? (
                <div className="p-4 text-center text-xs text-slate-500">
                  {lang === 'ar' ? 'لا نتائج في هذا المسار' : 'No matches in this track'}
                  <button
                    onClick={() => { setSelectedCategory('all'); setSearchQuery(''); }}
                    className="block mx-auto mt-2 text-amber-400 hover:underline"
                  >
                    {lang === 'ar' ? 'إعادة الضبط' : 'Reset'}
                  </button>
                </div>
              ) : (
                filteredStories.map(story => {
                  const isSelected = selectedStoryId === story.id;
                  const difficultyText = lang === 'ar'
                    ? story.difficulty.split(' ')[0]
                    : (story.difficultyEn || (story.difficulty.includes('Beginner') ? 'Beginner' : story.difficulty.includes('Intermediate') ? 'Intermediate' : story.difficulty.includes('Advanced') ? 'Advanced' : 'Expert'));
                  return (
                    <button
                      key={story.id}
                      onClick={() => handleStoryChange(story.id)}
                      className={`w-full p-2.5 rounded-xl border text-xs transition-all cursor-pointer ${
                        lang === 'en' ? 'text-left' : 'text-right'
                      } ${
                        isSelected
                          ? 'bg-amber-500/15 border-amber-500/40 text-amber-100'
                          : 'bg-white/[0.02] border-white/[0.06] text-slate-400 hover:text-slate-200 hover:bg-white/[0.04]'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <span className="text-[10px] font-bold text-slate-500">{difficultyText}</span>
                        <span className="text-[10px] font-mono text-amber-400/80 truncate max-w-[55%]">
                          {story.protocolBadge.split('(')[0].trim()}
                        </span>
                      </div>
                      <div className={`font-bold leading-snug line-clamp-2 ${isSelected ? 'text-white' : ''}`}>
                        {lang === 'ar' ? story.titleAr : story.titleEn}
                      </div>
                    </button>
                  );
                })
              )}
            </div>
          </div>
        </aside>

        <div className="lg:col-span-8 xl:col-span-9 space-y-3 min-w-0">
      {/* Main Street Stage */}
      <div className="relative w-full surface p-4 sm:p-6 overflow-hidden rounded-2xl border border-[var(--border-subtle)]">
        <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.03)_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />

        {/* Story & Step Header */}
        <div className="flex flex-wrap items-center justify-between gap-2 relative z-10 mb-2">
          <div className="flex items-center gap-2 surface-elevated px-3 py-1.5 rounded-full border border-[var(--border-subtle)]">
            <MapPin className="w-3.5 h-3.5 text-[var(--accent-text)]" />
            <span className="heading-4 text-xs sm:text-sm">{lang === 'ar' ? activeStory.titleAr : activeStory.titleEn}</span>
            <span className="text-[var(--border-subtle)]">|</span>
            <span className="mono-text text-[11px] text-[var(--text-muted)]">{activeStory.protocolBadge}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="caption-text mono-text px-3 py-1 surface-active text-[var(--accent-text)] rounded-full font-bold border border-[var(--border-subtle)]">
              {lang === 'ar' ? `الخطوة ${currentStep.stepNumber} من ${activeStory.steps.length}` : `Step ${currentStep.stepNumber} of ${activeStory.steps.length}`}
            </span>
          </div>
        </div>

        {/* Step navigator only — playback stays at the bottom so details stay visible */}
        <div className="relative z-10 my-3 px-1">
          <div className="flex flex-wrap items-center justify-between gap-2 mb-2" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
            <span className="text-[11px] font-mono text-amber-400/90 font-bold">
              {lang === 'ar'
                ? `الخطوة ${currentStepIndex + 1} من ${activeStory.steps.length}`
                : `Step ${currentStepIndex + 1} of ${activeStory.steps.length}`}
            </span>
            <div className="flex items-center gap-2 min-w-[120px] max-w-[180px] flex-1 sm:flex-none" dir="ltr">
              <div className="flex-1 h-1.5 bg-slate-950/80 rounded-full overflow-hidden border border-slate-800">
                <motion.div
                  className="h-full bg-gradient-to-r from-amber-500 to-cyan-400 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${((currentStepIndex + 1) / activeStory.steps.length) * 100}%` }}
                  transition={{ type: 'spring', stiffness: 100, damping: 18 }}
                />
              </div>
              <span className="text-[10px] font-mono text-slate-500 shrink-0">
                {Math.round(((currentStepIndex + 1) / activeStory.steps.length) * 100)}%
              </span>
            </div>
          </div>

          <div
            className={`flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-thin ${lang === 'ar' ? 'justify-end' : 'justify-start'}`}
            dir={lang === 'ar' ? 'rtl' : 'ltr'}
          >
            {activeStory.steps.map((st, idx) => {
              const isCurrent = currentStepIndex === idx;
              const isPast = currentStepIndex > idx;
              return (
                <button
                  key={st.stepNumber}
                  onClick={() => { setCurrentStepIndex(idx); setIsPlaying(false); }}
                  className={`group flex items-center gap-2 px-2.5 py-1.5 rounded-xl text-xs font-mono font-bold transition-all shrink-0 cursor-pointer ${
                    lang === 'ar' ? 'flex-row-reverse' : ''
                  } ${
                    isCurrent
                      ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-400/20'
                      : isPast
                      ? 'bg-emerald-950/60 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-900/60'
                      : 'bg-slate-950/80 text-slate-400 border border-slate-800 hover:border-slate-700 hover:text-slate-200'
                  }`}
                  title={pickText(lang, st.titleAr, st.titleEn, `Step ${st.stepNumber}`)}
                >
                  <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] ${
                    isCurrent ? 'bg-slate-950 text-amber-400' : isPast ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-800 text-slate-400'
                  }`}>
                    {isPast ? '✓' : idx + 1}
                  </span>
                  <span className="text-[11px] font-sans font-medium whitespace-nowrap max-w-[130px] sm:max-w-[190px] truncate">
                    {pickText(lang, st.titleAr, st.titleEn, `Step ${st.stepNumber}`).replace(/^\d+\.\s*/, '')}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Technical Tooltips Interactive Helper Guide */}
        <div className="relative z-10 mb-2.5 flex items-center justify-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-[11px] text-amber-300">
            <Info className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span>
              {lang === 'ar' 
                ? 'مرّر الفأرة فوق أي قطعة تقنية (الأجهزة، الكابل، المنافذ، أو الحزمة) لقراءة وظيفتها في الشبكة، أو انقر للمواصفات الكاملة'
                : 'Hover over any network component (Devices, Cable, Ports, or Packet) to inspect its technical role, or click for full specs'}
            </span>
          </div>
        </div>

        {/* Highlighted Event Banner */}
        {pickText(lang, currentStep.highlightedEventAr, currentStep.highlightedEventEn) && (
          <div className="relative z-10 mb-3 flex justify-center">
            <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-[var(--surface-sunken)] border border-[var(--border-subtle)] text-xs text-[var(--text-secondary)]">
              <Sparkles className="w-3.5 h-3.5 text-[var(--accent-text)] animate-pulse" />
              <span className="font-medium">
                {pickText(lang, currentStep.highlightedEventAr, currentStep.highlightedEventEn)}
              </span>
            </div>
          </div>
        )}

        {/* Physical Network Link & Transmission Animation */}
        <div className="relative w-full max-w-5xl mx-auto my-5 dir-ltr px-3 sm:px-6">
          <div className="relative h-16 w-full">
            {/* Full-width cable — plain elements so tooltip wrappers cannot collapse the bar */}
            <div
              className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-5 z-[1] pointer-events-none"
              aria-hidden
            >
              {/* Track bed */}
              <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-[6px] rounded-full bg-slate-800 border border-slate-500/70 shadow-[0_0_0_1px_rgba(15,23,42,0.8)]" />
              {/* Dashed copper cable — always visible */}
              <div
                className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-[5px] rounded-full"
                style={{
                  backgroundImage:
                    'repeating-linear-gradient(90deg, #fbbf24 0 12px, #0f172a 12px 20px)',
                }}
              />
              {/* Active segment between Tx / Rx */}
              <motion.div
                className="absolute top-1/2 -translate-y-1/2 h-[7px] rounded-full bg-gradient-to-r from-cyan-400 via-amber-400 to-emerald-400 shadow-[0_0_16px_rgba(34,211,238,0.7)]"
                animate={{
                  left: `${Math.min(senderPos, receiverPos)}%`,
                  width: `${Math.max(10, Math.abs(receiverPos - senderPos))}%`,
                }}
                transition={{ type: 'spring', stiffness: 120, damping: 18 }}
              />
            </div>

            <ComponentQuickTooltip
              title={lang === 'ar' ? 'كابل ووسيط النقل الفيزيائي (Physical Transmission Medium - L1)' : 'Physical Cable Link (L1)'}
              category="Layer 1 Physical"
              description={lang === 'ar'
                ? 'كابل إيثرنت (Cat6 UTP / Fiber) ينقل نبضات الإشارات الكهربائية/الضوئية بنمط Full-Duplex لمنع التصادمات نهائياً.'
                : 'Copper/fiber medium carrying serialized electrical/optical pulses in Full-Duplex mode.'}
              ciscoConcept="Duplex: Full-Duplex | Speed: 1000Mbps"
              side="bottom"
              className="!absolute left-0 right-0 top-1/2 -translate-y-1/2 !block w-auto h-4 z-[1] cursor-help"
              lang={lang}
            >
              <div className="w-full h-4" />
            </ComponentQuickTooltip>

            <div
              className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 z-10"
              style={{ left: `${senderPos}%` }}
            >
              <ComponentQuickTooltip
                title={lang === 'ar' ? 'منفذ واجهة الإرسال (Tx Interface Port)' : 'Tx Interface Port'}
                category="PHY / MAC Port"
                description={lang === 'ar'
                  ? 'المنفذ الفيزيائي الذي يقرأ الفريم من الذاكرة الوسيطة (Tx Buffer) ويقوم بتحويل البايتات إلى نبضات كهربائية/ضوئية نحو الكابل.'
                  : 'Hardware interface port transmitting serialized Ethernet frames from buffer onto physical wire.'}
                ciscoConcept="Interface Tx Counters & Queue"
                side="top"
                lang={lang}
              >
                <div className="w-7 h-7 rounded-full border-2 border-cyan-400 bg-slate-950 flex items-center justify-center cursor-help shadow-md shadow-cyan-500/40">
                  <div className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse" />
                </div>
              </ComponentQuickTooltip>
            </div>

            <div
              className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 z-10"
              style={{ left: `${receiverPos}%` }}
            >
              <ComponentQuickTooltip
                title={lang === 'ar' ? 'منفذ واجهة الاستقبال (Rx Interface Port)' : 'Rx Interface Port'}
                category="PHY / MAC Port"
                description={lang === 'ar'
                  ? 'المنفذ الفيزيائي الذي يستقبل الإشارات من السلك، ويتحقق من سلامة المجموع (FCS CRC Check) قبل تمرير الفريم لمعالج الجهاز.'
                  : 'Hardware interface port receiving signals and validating Frame Check Sequence (FCS) integrity.'}
                ciscoConcept="CRC / FCS Check | Rx Counters"
                side="top"
                lang={lang}
              >
                <div className="w-7 h-7 rounded-full border-2 border-emerald-400 bg-slate-950 flex items-center justify-center cursor-help shadow-md shadow-emerald-500/40">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                </div>
              </ComponentQuickTooltip>
            </div>

            <motion.div
              key={`${activeStory.id}-${currentStep.stepNumber}`}
              initial={{ left: `${senderPos}%`, scale: 0.85, opacity: 0.5 }}
              animate={{
                left: isSameActor ? `${senderPos}%` : `${senderPos * 0.2 + receiverPos * 0.8}%`,
                scale: 1,
                opacity: 1,
              }}
              transition={{ type: 'spring', stiffness: 95, damping: 15 }}
              className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 z-20"
            >
              <ComponentQuickTooltip
                title={lang === 'ar' ? `وحدة بيانات البروتوكول PDU (${currentStep.payloadType})` : `Protocol Data Unit (${currentStep.payloadType})`}
                category="L2 Frame & L3 Packet"
                description={lang === 'ar'
                  ? `حزمة مغلّفة تحتوي على ترويسة MAC L2، ترويسة IP L3، وحمولة البيانات: "${currentStep.payloadContentAr}".`
                  : `Encapsulated PDU with L2 MAC, L3 IP headers, and payload: ${currentStep.payloadType}`}
                ciscoConcept="Encapsulation: Ethernet II + IPv4/IPv6"
                side="bottom"
                lang={lang}
              >
                <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500 text-slate-950 text-xs font-bold shadow-lg border border-amber-300 cursor-help">
                  <Send className={`w-3.5 h-3.5 ${isMovingRight ? '' : 'rotate-180'}`} />
                  <span className="font-mono text-[11px] font-bold whitespace-nowrap">{currentStep.payloadType}</span>
                  {isMovingRight ? (
                    <ArrowRight className="w-3.5 h-3.5 text-slate-950/70" />
                  ) : (
                    <ArrowLeft className="w-3.5 h-3.5 text-slate-950/70" />
                  )}
                </div>
              </ComponentQuickTooltip>
            </motion.div>
          </div>
        </div>

        {/* Characters Positioned Across the Stage (Shared Dynamic Container) */}
        <div className={`relative z-10 ${getCharactersContainerClass()} mt-2 pt-2 dir-ltr`}>
          {activeStory.characters.map((char) => {
            const isActive = char.id === currentStep.activeCharacterId;
            const isSender = char.id === currentStep.fromCharacterId;
            const isReceiver = char.id === currentStep.toCharacterId;
            const speech = lang === 'ar'
              ? currentStep.speechBubbles[char.id]
              : (currentStep.speechBubblesEn?.[char.id] || currentStep.speechBubbles[char.id]);
            const localizedSpeech = pickText(
              lang,
              currentStep.speechBubbles[char.id],
              currentStep.speechBubblesEn?.[char.id],
              ''
            );
            // Prefer localizedSpeech for display when English
            const speechText = lang === 'en' ? localizedSpeech : speech;
            const isSelected = selectedCharacter?.id === char.id;
            const techProfile = inferDeviceTechnicalProfile(char, activeStory);
            const TechIcon = techProfile.icon;
            const isHovered = hoveredCharId === char.id;

            return (
              <motion.div
                key={char.id}
                onClick={() => {
                  setSelectedCharacter(char);
                  setModalDeviceChar(char);
                }}
                onMouseEnter={() => setHoveredCharId(char.id)}
                onMouseLeave={() => setHoveredCharId(null)}
                animate={{
                  scale: isActive ? 1.03 : 1,
                  y: isActive ? -4 : 0
                }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                className={`relative cursor-pointer p-4 rounded-xl border transition-all flex flex-col items-center text-center ${
                  isActive
                    ? 'surface-active border-[var(--accent-text)] ring-1 ring-[var(--accent-text)]/30'
                    : isSelected
                    ? 'surface-elevated border-cyan-500/50 ring-1 ring-cyan-500/30'
                    : 'surface hover:border-[var(--accent-text)]/60'
                }`}
                title={lang === 'ar' ? 'انقر لعرض المواصفات الهندسية وأوامر سيسكو' : 'Click to inspect technical network specs'}
              >
                {/* Interactive Hover Tooltip for Network Device */}
                <AnimatePresence>
                  {isHovered && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95, y: -6 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95, y: -6 }}
                      transition={{ duration: 0.16 }}
                      className="absolute bottom-full mb-3 left-1/2 -translate-x-1/2 z-40 w-72 p-3.5 rounded-2xl bg-slate-900/98 border border-amber-500/40 text-right shadow-2xl backdrop-blur-lg pointer-events-none text-slate-100 dir-rtl"
                    >
                      <div className="flex items-center justify-between gap-1 mb-1.5 pb-1.5 border-b border-slate-800">
                        <div className="flex items-center gap-1.5 min-w-0">
                          <TechIcon className="w-4 h-4 text-amber-400 shrink-0" />
                          <span className="text-xs font-bold text-slate-100 truncate">
                            {lang === 'ar' ? techProfile.deviceTypeNameAr : techProfile.deviceTypeNameEn}
                          </span>
                        </div>
                        <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 shrink-0">
                          {lang === 'ar' ? techProfile.osiLayerAr : techProfile.osiLayerEn}
                        </span>
                      </div>

                      <div className="text-[11px] text-slate-300 leading-relaxed mb-2 bg-slate-950/60 p-2 rounded-xl border border-slate-800">
                        <span className="text-amber-300 font-bold block mb-0.5">
                          {lang === 'ar' ? 'الوظيفة في الشبكة:' : 'Network Role:'}
                        </span>
                        {lang === 'ar' ? techProfile.functionExplanationAr : techProfile.functionExplanationEn}
                      </div>

                      <div className="flex items-center justify-between text-[10px] text-emerald-400 font-mono pt-1 border-t border-slate-800/80">
                        <span className="truncate max-w-[170px]">CLI: {techProfile.ciscoVerificationCmd.split('|')[0].trim()}</span>
                        <span className="text-amber-400 text-[10px] font-sans font-bold shrink-0">
                          {lang === 'ar' ? 'انقر للتفاصيل 🔍' : 'Click specs 🔍'}
                        </span>
                      </div>

                      {/* Tooltip downward pointer arrow */}
                      <div className="absolute left-1/2 -translate-x-1/2 -bottom-1.5 w-3 h-3 bg-slate-900 border-r border-b border-amber-500/40 rotate-45" />
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Device Type Engineering Badge */}
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-950/80 border border-amber-500/30 text-amber-300 text-[10px] font-bold mb-2 shadow-sm w-full justify-center">
                  <TechIcon className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span className="truncate max-w-[130px]">
                    {lang === 'ar' ? techProfile.deviceTypeNameAr.split('(')[0].trim() : techProfile.deviceTypeNameEn.split('(')[0].trim()}
                  </span>
                  <span className="text-[9px] px-1 py-0.2 rounded bg-amber-500/20 text-amber-200 border border-amber-500/40 font-mono">
                    {lang === 'ar' ? techProfile.osiLayerAr.split('(')[0].trim() : techProfile.osiLayerEn.split('(')[0].trim()}
                  </span>
                </div>

                {/* Speech Bubble Above Card */}
                {speechText && (
                  <div className={`w-full mb-3 px-3 py-2 rounded-xl text-xs bg-amber-500/15 border border-amber-500/40 text-amber-300 relative shadow-sm ${lang === 'ar' ? 'text-right dir-rtl' : 'text-left dir-ltr'}`}>
                    <p className="line-clamp-3 leading-snug font-medium text-[11px]">{speechText}</p>
                    <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-slate-900 border-r border-b border-amber-500/40 rotate-45" />
                  </div>
                )}

                {/* Status Badges */}
                <div className="flex items-center gap-1.5 mb-2 flex-wrap justify-center">
                  {isSender && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                      📤 {lang === 'ar' ? 'المصدر (Sender)' : 'Sender'}
                    </span>
                  )}
                  {isReceiver && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                      📥 {lang === 'ar' ? 'الوجهة (Receiver)' : 'Receiver'}
                    </span>
                  )}
                  {isActive && !isSender && !isReceiver && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">
                      ⚡ {lang === 'ar' ? 'جارِ المعالجة' : 'Active'}
                    </span>
                  )}
                </div>

                {/* IP & MAC Badges with Quick Tooltips */}
                <div className="w-full flex flex-col items-center gap-1 mb-3">
                  <ComponentQuickTooltip
                    title={lang === 'ar' ? 'عنوان IP المنطقي (Layer 3 Logical Address)' : 'Layer 3 IP Address'}
                    category="L3 Addressing"
                    description={lang === 'ar'
                      ? 'عنوان منطقي يُستخدم لتعريف موقع الجهاز في الشبكة وتوجيه الحزم عبر الراوترات والإنترنت.'
                      : 'Logical network address used for host identification and global inter-network routing.'}
                    ciscoConcept="IP Header: Src / Dest IP"
                    side="top"
                    className="w-full max-w-[220px]"
                  >
                    <div className="badge badge-accent mono-text text-[11px] w-full truncate cursor-help">
                      IP: {char.ipAddress}
                    </div>
                  </ComponentQuickTooltip>

                  <ComponentQuickTooltip
                    title={lang === 'ar' ? 'عنوان MAC الفيزيائي (Layer 2 Physical Hardware Address)' : 'Layer 2 MAC Address'}
                    category="L2 Addressing"
                    description={lang === 'ar'
                      ? 'عنوان فيزيائي فريد محفور عتادياً في بطاقة الشبكة (NIC) يُستخدم لتسليم الإطارات داخل الشبكة المحلية (LAN).'
                      : 'Hardware address burned into NIC ROM for local frame delivery on the Ethernet segment.'}
                    ciscoConcept="Ethernet Frame: Src / Dest MAC"
                    side="bottom"
                    className="w-full max-w-[220px]"
                  >
                    <div className="caption-text mono-text text-[10px] text-[var(--text-muted)] w-full truncate cursor-help">
                      MAC: {char.macAddress}
                    </div>
                  </ComponentQuickTooltip>
                </div>

                {/* Avatar Icon */}
                <div className="relative my-1">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl border transition-all ${
                    isActive ? 'bg-[var(--accent-text)]/10 border-[var(--accent-text)] shadow-md' : 'surface border-[var(--border-subtle)]'
                  }`}>
                    {getAvatarIcon(char.avatarRole)}
                  </div>
                  
                  {isActive && (
                    <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[var(--accent)] text-[10px] font-bold text-black flex items-center justify-center animate-bounce">
                      !
                    </span>
                  )}
                </div>

                {/* Character Name & Role */}
                <div className="mt-2 w-full text-center">
                  <h4 className="heading-4 text-xs font-bold line-clamp-1">{lang === 'ar' ? char.nameAr : char.nameEn}</h4>
                  <p className="caption-text text-[11px] text-[var(--text-muted)] line-clamp-1 mt-0.5">{pickText(lang, char.roleAr, char.roleEn, 'Network node')}</p>
                </div>

                {/* Carrying Item with Tooltip */}
                {char.carryingItem && (
                  <ComponentQuickTooltip
                    title={lang === 'ar' ? 'العنصر المحمول وحمولة البيانات' : 'Payload & Current Holding'}
                    category="Data / Context"
                    description={lang === 'ar'
                      ? `ما يحمله هذا العنصر حالياً أثناء مرحلة التوجيه أو المعالجة: "${char.carryingItem}".`
                      : `Entity holding item: "${char.carryingItemEn || char.carryingItem}"`}
                    side="top"
                    className="mt-3 pt-2 border-t border-[var(--border-subtle)] w-full"
                  >
                    <span className="badge text-[10px] block truncate max-w-[220px] mx-auto py-0.5 cursor-help">
                      📦 {lang === 'ar' ? char.carryingItem : (char.carryingItemEn || char.carryingItem)}
                    </span>
                  </ComponentQuickTooltip>
                )}
              </motion.div>
            );
          })}
        </div>

        {/* Playback controls — dir=ltr + order so Arabic numbers land on the physical right */}
        <div className="mt-6 pt-4 border-t border-[var(--border-subtle)] flex flex-row items-center justify-between gap-3 w-full" dir="ltr">
          <div
            className={`flex items-center gap-1.5 flex-wrap justify-center shrink-0 ${lang === 'ar' ? 'order-2' : 'order-1'}`}
            dir={lang === 'ar' ? 'rtl' : 'ltr'}
          >
            {activeStory.steps.map((st, idx) => (
              <button
                key={st.stepNumber}
                onClick={() => { setCurrentStepIndex(idx); setIsPlaying(false); }}
                className={`w-8 h-8 rounded-lg text-xs font-bold font-mono transition-all cursor-pointer flex items-center justify-center ${
                  currentStepIndex === idx
                    ? 'bg-amber-500 text-black shadow-sm ring-2 ring-amber-500/40'
                    : currentStepIndex > idx
                    ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
                    : 'bg-white/[0.03] text-slate-500 hover:text-slate-300 border border-white/[0.06]'
                }`}
              >
                {idx + 1}
              </button>
            ))}
          </div>

          <div className={`flex items-center gap-1.5 p-1 rounded-2xl bg-slate-950/60 border border-white/[0.06] ${lang === 'ar' ? 'order-1' : 'order-2'}`} dir="ltr">
            <button
              onClick={handleReset}
              title={lang === 'ar' ? 'إعادة من البداية' : 'Restart'}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/[0.06] transition-colors cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
            <button
              onClick={handleStepBackward}
              disabled={currentStepIndex === 0}
              title={lang === 'ar' ? 'الخطوة السابقة' : 'Previous'}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/[0.06] disabled:opacity-30 transition-colors cursor-pointer"
            >
              <SkipBack className="w-4 h-4" />
            </button>
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold flex items-center gap-1.5 shadow-md shadow-amber-500/20 transition-colors cursor-pointer"
            >
              {isPlaying ? (
                <><Pause className="w-4 h-4" /><span>{lang === 'ar' ? 'إيقاف' : 'Pause'}</span></>
              ) : (
                <><Play className="w-4 h-4 fill-current" /><span>{lang === 'ar' ? 'تشغيل تلقائي' : 'Auto Play'}</span></>
              )}
            </button>
            <button
              onClick={handleStepForward}
              disabled={currentStepIndex === activeStory.steps.length - 1}
              title={lang === 'ar' ? 'الخطوة التالية' : 'Next'}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/[0.06] disabled:opacity-30 transition-colors cursor-pointer"
            >
              <SkipForward className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Cisco CLI Command Snippet (Terminal Formatted) */}
        {currentStep.ciscoCommandSnippet && (
          <div className="w-full surface border border-[var(--border-subtle)] rounded-xl overflow-hidden dir-ltr text-left mt-4 shadow-inner">
            <div className="bg-[var(--surface-sunken)] px-3 py-1.5 border-b border-[var(--border-subtle)] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Terminal className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-xs font-mono text-[var(--text-secondary)] font-semibold">Cisco IOS CLI</span>
              </div>
              <span className="text-[10px] text-[var(--text-muted)] font-mono">Live Configuration Snippet</span>
            </div>
            <pre className="p-3 text-xs font-mono text-emerald-400 bg-slate-950/95 overflow-x-auto whitespace-pre-wrap leading-relaxed selection:bg-emerald-900">
              {currentStep.ciscoCommandSnippet}
            </pre>
          </div>
        )}
      </div>

      {/* Breakdown Panels */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <ContentPanel 
          label={lang === 'ar' ? 'القصة الواقعية' : 'Real Story'} 
          title={pickText(lang, currentStep.titleAr, currentStep.titleEn, `Step ${currentStep.stepNumber}`)}
        >
          {pickText(lang, currentStep.storyNarrativeAr, currentStep.storyNarrativeEn, 'Packet flow in progress.')}
        </ContentPanel>
        <ContentPanel 
          label={lang === 'ar' ? 'المطابقة التقنية' : 'Technical Match'} 
          title={currentStep.ciscoProtocolTerm}
        >
          {pickText(lang, currentStep.technicalAnalogyAr, currentStep.technicalAnalogyEn, currentStep.ciscoProtocolTerm)}
        </ContentPanel>
        <div className="p-4 surface space-y-2">
          <div className="flex items-center justify-between">
            <div className="label-text">{lang === 'ar' ? 'ترويسات L2 / L3' : 'L2 / L3 Headers'}</div>
            <span className="caption-text text-[10px] text-amber-400">
              {lang === 'ar' ? 'مرّر للمعاينة' : 'Hover for info'}
            </span>
          </div>
          <div className="space-y-1.5">
            {[
              {
                label: 'L2 Src MAC',
                val: currentStep.l2Src,
                title: lang === 'ar' ? 'عنوان الماك الفيزيائي للمصدر (L2 Src MAC)' : 'L2 Source MAC Address',
                desc: lang === 'ar' ? 'عنوان بطاقة شبكة الجهاز المرسل في القفزة الحالية. يستخدمه السويتش لتحديث جدول الـ CAM.' : 'Hardware address of current hop sender. Switch records this into CAM table.',
                cisco: 'show mac address-table'
              },
              {
                label: 'L2 Dest MAC',
                val: currentStep.l2Dest,
                title: lang === 'ar' ? 'عنوان الماك الفيزيائي للوجهة (L2 Dest MAC)' : 'L2 Destination MAC Address',
                desc: lang === 'ar' ? 'عنوان الماك للهدف التالي (Next-Hop). يعيد الراوتر كتابته عند كل قفزة شبكية.' : 'Target hardware address for current hop. Rewritten by routers at each L3 boundary.',
                cisco: 'Frame Check Sequence & Forwarding'
              },
              {
                label: 'L3 Src IP',
                val: currentStep.l3Src,
                title: lang === 'ar' ? 'عنوان IP المنطقي للمرسل الأصلي (L3 Src IP)' : 'L3 Source IP Address',
                desc: lang === 'ar' ? 'عنوان IP للجهاز المُنشئ للحزمة الأصلية. يبقى ثابتاً من المصدر للنهاية ما لم يتدخل NAT.' : 'Originator logical IP. Preserved across all router hops unless NAT translates it.',
                cisco: 'End-to-End Host IP'
              },
              {
                label: 'L3 Dest IP',
                val: currentStep.l3Dest,
                title: lang === 'ar' ? 'عنوان IP المنطقي للوجهة النهائية (L3 Dest IP)' : 'L3 Destination IP Address',
                desc: lang === 'ar' ? 'عنوان الهدف النهائي. يفحصه كل راوتر ويقارنه مع جدول التوجيه (Longest Prefix Match).' : 'Ultimate destination IP evaluated by routing table lookups.',
                cisco: 'show ip route (Longest Prefix Match)'
              }
            ].map((header) => (
              <ComponentQuickTooltip
                key={header.label}
                title={header.title}
                category="Packet Header"
                description={header.desc}
                ciscoConcept={header.cisco}
                side="left"
              >
                <div className="flex justify-between surface px-2.5 py-1.5 rounded-lg cursor-help hover:border-[var(--accent-text)]/40 transition-colors">
                  <span className="caption-text">{header.label}</span>
                  <span className="mono-text text-[var(--text-primary)]">{header.val}</span>
                </div>
              </ComponentQuickTooltip>
            ))}
          </div>
        </div>
      </div>

      {selectedCharacter && (
        <div className="p-4 surface flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="text-2xl p-3 surface rounded-xl">{getAvatarIcon(selectedCharacter.avatarRole)}</div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="heading-4">{lang === 'ar' ? selectedCharacter.nameAr : selectedCharacter.nameEn}</h3>
                <span className="badge badge-accent mono-text">{selectedCharacter.ipAddress}</span>
                <span className="badge mono-text">{selectedCharacter.macAddress}</span>
              </div>
              <p className="caption-text mt-0.5">{lang === 'ar' ? selectedCharacter.initialSpeech : (selectedCharacter.initialSpeechEn || selectedCharacter.initialSpeech)}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setModalDeviceChar(selectedCharacter)}
              className="btn-primary text-xs py-1.5 px-3"
            >
              {lang === 'ar' ? 'المواصفات التقنية وأوامر سيسكو 🔍' : 'Technical Specs & CLI 🔍'}
            </button>
            <button onClick={() => setSelectedCharacter(null)} className="btn-ghost text-xs py-1.5">
              {lang === 'ar' ? 'إغلاق' : 'Close'}
            </button>
          </div>
        </div>
      )}

      {/* Comprehensive Device Technical Profile Modal Tooltip */}
      <NetworkDeviceTooltip
        character={modalDeviceChar}
        story={activeStory}
        isOpen={!!modalDeviceChar}
        onClose={() => setModalDeviceChar(null)}
        lang={lang}
      />
        </div>
      </div>
    </div>
  );
};
