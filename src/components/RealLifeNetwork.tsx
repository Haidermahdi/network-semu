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
import { HumanNetworkStory, StreetCharacter, StreetStoryStep, Language } from '../types';
import { PageHeader, ContentPanel } from './ui/ContentDisplay';
import { 
  NetworkDeviceTooltip, 
  ComponentQuickTooltip, 
  inferDeviceTechnicalProfile 
} from './NetworkDeviceTooltip';
import { getLocalizedStory, STATIC_STORIES_TRANSLATIONS } from '../utils/storyTranslations';

interface RealLifeNetworkProps {
  lang?: Language;
  onNavigateToLab?: (scenarioId: string) => void;
}

type StoryCategory = 'all' | 'switching' | 'routing' | 'security' | 'services' | 'cloud_overlay' | 'wan_advanced';

const CATEGORIES: { id: StoryCategory; labelAr: string; labelEn: string; icon: any }[] = [
  { id: 'all', labelAr: 'جميع السيناريوهات', labelEn: 'All Stories', icon: Layers },
  { id: 'switching', labelAr: 'التبديل والطبقة الثانية (L2)', labelEn: 'Switching & L2', icon: Activity },
  { id: 'routing', labelAr: 'التوجيه والـ IPv6 (L3)', labelEn: 'Routing & L3', icon: Navigation },
  { id: 'security', labelAr: 'الأمن والجدران النارية', labelEn: 'Security & Firewalls', icon: Shield },
  { id: 'services', labelAr: 'الخدمات (DHCP / DNS / QoS)', labelEn: 'Network Services', icon: Radio },
  { id: 'cloud_overlay', labelAr: 'السحابة ومراكز البيانات (VXLAN)', labelEn: 'Cloud & Overlays', icon: Cpu },
  { id: 'wan_advanced', labelAr: 'الشبكات المتقدمة (MPLS / SD-WAN)', labelEn: 'Advanced WAN', icon: Compass }
];

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
  onNavigateToLab 
}) => {
  const [selectedStoryId, setSelectedStoryId] = useState<string>(HUMAN_NETWORK_STORIES[0].id);
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [selectedCharacter, setSelectedCharacter] = useState<StreetCharacter | null>(null);
  const [hoveredCharId, setHoveredCharId] = useState<string | null>(null);
  const [modalDeviceChar, setModalDeviceChar] = useState<StreetCharacter | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<StoryCategory>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

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

  // Get localized stories using static mappings or dynamic translations
  const localizedNetworkStories = React.useMemo(() => {
    return HUMAN_NETWORK_STORIES.map(story => {
      if (lang === 'ar') return story;
      
      // 1. If we have a dynamic Gemini translation, prefer it
      if (dynamicTranslations[story.id]) {
        return dynamicTranslations[story.id];
      }
      // 2. Otherwise, use static pre-translation or structural fallback
      return getLocalizedStory(story, lang);
    });
  }, [lang, dynamicTranslations]);

  const activeStory: HumanNetworkStory = localizedNetworkStories.find(s => s.id === selectedStoryId) || localizedNetworkStories[0];
  const currentStep: StreetStoryStep = activeStory.steps[currentStepIndex] || activeStory.steps[0];

  // Filtered stories logic
  const filteredStories = localizedNetworkStories.filter(story => {
    // Category match
    if (selectedCategory !== 'all') {
      if (story.category) {
        if (story.category !== selectedCategory) return false;
      } else {
        // Fallback inference for existing stories
        const matchesCategory = 
          (selectedCategory === 'switching' && (story.id.includes('arp') || story.id.includes('stp') || story.id.includes('vlan') || story.id.includes('port-security'))) ||
          (selectedCategory === 'routing' && (story.id.includes('ttl') || story.id.includes('dijkstra') || story.id.includes('bgp') || story.id.includes('eigrp') || story.id.includes('hsrp') || story.id.includes('ipv6'))) ||
          (selectedCategory === 'security' && (story.id.includes('ipsec') || story.id.includes('acl') || story.id.includes('port-security'))) ||
          (selectedCategory === 'services' && (story.id.includes('nat') || story.id.includes('tcp') || story.id.includes('dhcp') || story.id.includes('dns') || story.id.includes('qos'))) ||
          (selectedCategory === 'cloud_overlay' && (story.id.includes('vxlan'))) ||
          (selectedCategory === 'wan_advanced' && (story.id.includes('mpls') || story.id.includes('sdwan')));
        if (!matchesCategory) return false;
      }
    }

    // Search query match
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
    <div className={`space-y-5 ${lang === 'ar' ? 'dir-rtl text-right' : 'dir-ltr text-left'}`}>
      <PageHeader
        icon={<Compass className="w-5 h-5" />}
        title={lang === 'ar' ? 'شبكات من واقعنا: المكتبة الشاملة للسيناريوهات المعتمدة' : 'Real-Life Network Stories: Comprehensive Curriculum Library'}
        description={lang === 'ar'
          ? `شاهد أشخاصاً ومواقف حية تجسد بروتوكولات سيسكو (Switching, Routing, Security, Services, Cloud Overlays) وكأنك في شوارع ومطارات ومؤسسات واقعية (${HUMAN_NETWORK_STORIES.length} سيناريو متكامل).`
          : `Explore ${HUMAN_NETWORK_STORIES.length} comprehensive real-world scenarios representing Cisco CCNA, CCNP, and CCIE protocols in everyday analogies.`}
        badge={lang === 'ar' ? `${HUMAN_NETWORK_STORIES.length} سيناريو معتمد` : `${HUMAN_NETWORK_STORIES.length} Scenarios`}
        action={onNavigateToLab ? (
          <button
            onClick={() => onNavigateToLab(getRelatedLabScenarioId(activeStory.id))}
            className="btn-primary shrink-0"
          >
            <Cpu className="w-4 h-4" />
            <span>{lang === 'ar' ? 'جرّب في المعمل الحي' : 'Try in Live Lab'}</span>
          </button>
        ) : undefined}
      />

      {/* Category Filter Tabs & Search Bar */}
      <div className="space-y-3">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          {/* Categories */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1.5 scrollbar-thin">
            {CATEGORIES.map(cat => {
              const Icon = cat.icon;
              const isCatActive = selectedCategory === cat.id;
              // Count for this category
              const count = cat.id === 'all' 
                ? HUMAN_NETWORK_STORIES.length 
                : HUMAN_NETWORK_STORIES.filter(s => {
                    if (s.category) return s.category === cat.id;
                    if (cat.id === 'switching') return s.id.includes('arp') || s.id.includes('stp') || s.id.includes('vlan') || s.id.includes('port-security');
                    if (cat.id === 'routing') return s.id.includes('ttl') || s.id.includes('dijkstra') || s.id.includes('bgp') || s.id.includes('eigrp') || s.id.includes('hsrp') || s.id.includes('ipv6');
                    if (cat.id === 'security') return s.id.includes('ipsec') || s.id.includes('acl') || s.id.includes('port-security');
                    if (cat.id === 'services') return s.id.includes('nat') || s.id.includes('tcp') || s.id.includes('dhcp') || s.id.includes('dns') || s.id.includes('qos');
                    if (cat.id === 'cloud_overlay') return s.id.includes('vxlan');
                    if (cat.id === 'wan_advanced') return s.id.includes('mpls') || s.id.includes('sdwan');
                    return false;
                  }).length;

              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 shrink-0 transition-all border ${
                    isCatActive
                      ? 'bg-[var(--accent-text)] text-slate-950 border-[var(--accent-text)] shadow-sm font-bold'
                      : 'surface hover:border-[var(--border-default)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{lang === 'ar' ? cat.labelAr : cat.labelEn}</span>
                  <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                    isCatActive ? 'bg-slate-950/20 text-slate-950 font-mono font-bold' : 'bg-slate-800 text-slate-400 font-mono'
                  }`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Search Input */}
          <div className="relative min-w-[220px]">
            <Search className={`w-4 h-4 absolute top-1/2 -translate-y-1/2 ${lang === 'en' ? 'left-3' : 'right-3'} text-[var(--text-muted)] pointer-events-none`} />
            <input
              type="text"
              placeholder={lang === 'ar' ? 'بحث عن قصة أو بروتوكول...' : 'Search scenario or protocol...'}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`w-full bg-[var(--surface-sunken)] border border-[var(--border-subtle)] rounded-lg py-1.5 ${
                lang === 'en' ? 'pl-9 pr-3 text-left' : 'pr-9 pl-3 text-right'
              } text-xs text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:border-[var(--accent-text)]`}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className={`absolute top-1/2 -translate-y-1/2 ${lang === 'en' ? 'right-2' : 'left-2'} text-[10px] text-[var(--text-muted)] hover:text-[var(--text-primary)] px-1`}
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Stories Grid Selector */}
        {filteredStories.length === 0 ? (
          <div className="surface p-8 text-center rounded-xl border border-dashed border-[var(--border-subtle)]">
            <Filter className="w-8 h-8 mx-auto text-[var(--text-muted)] mb-2" />
            <p className="caption-text text-[var(--text-secondary)] mb-3">
              {lang === 'ar' ? 'لم يتم العثور على أي سيناريو يطابق معايير البحث' : 'No scenarios matched your search filter'}
            </p>
            <button
              onClick={() => { setSelectedCategory('all'); setSearchQuery(''); }}
              className="btn-secondary text-xs"
            >
              {lang === 'ar' ? 'إعادة ضبط الفلتر' : 'Reset Filter'}
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2 max-h-[220px] overflow-y-auto p-1 scrollbar-thin">
            {filteredStories.map(story => {
              const isSelected = selectedStoryId === story.id;
              const difficultyText = lang === 'ar'
                ? story.difficulty.split(' ')[0]
                : (story.difficultyEn || (story.difficulty.includes('Beginner') ? 'Beginner' : story.difficulty.includes('Intermediate') ? 'Intermediate' : story.difficulty.includes('Advanced') ? 'Advanced' : 'Expert'));
              return (
                <button
                  key={story.id}
                  onClick={() => handleStoryChange(story.id)}
                  className={`p-2.5 rounded-xl ${lang === 'en' ? 'text-left' : 'text-right'} transition-all border flex flex-col gap-1.5 cursor-pointer relative overflow-hidden ${
                    isSelected
                      ? 'surface-active border-[var(--accent-text)] ring-1 ring-[var(--accent-text)]/40 shadow-sm'
                      : 'surface hover:border-[var(--border-default)] text-[var(--text-muted)] hover:text-[var(--text-secondary)]'
                  }`}
                >
                  <div className="flex items-center justify-between w-full">
                    <span className="caption-text font-bold text-[10px]">{difficultyText}</span>
                    <span className="badge text-[10px] py-0 px-1.5 truncate max-w-[120px]">{story.protocolBadge.split('(')[0].trim()}</span>
                  </div>
                  <div className="heading-4 text-xs line-clamp-2 leading-snug font-medium">
                    {lang === 'ar' ? story.titleAr : story.titleEn}
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>

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

        {/* Interactive Step Progress & Timeline Bar (شريط التقدم في الخطوات وأزرار التحكم) */}
        <div className="relative z-10 my-3 p-3 surface-elevated rounded-2xl border border-[var(--border-subtle)] shadow-lg bg-slate-900/90 backdrop-blur-sm">
          {/* Top Row: Playback Controls & Progress Indicator */}
          <div className="flex flex-wrap items-center justify-between gap-3 mb-2.5">
            {/* Playback Action Buttons */}
            <div className="flex items-center gap-1.5">
              <button 
                onClick={handleReset} 
                title={lang === 'ar' ? 'إعادة من الخطوة الأولى' : 'Restart from Step 1'} 
                className="p-1.5 rounded-xl surface border border-[var(--border-subtle)] hover:border-amber-500/40 text-slate-300 transition-colors"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
              <button 
                onClick={handleStepBackward} 
                disabled={currentStepIndex === 0} 
                title={lang === 'ar' ? 'الخطوة السابقة' : 'Previous Step'} 
                className="p-1.5 rounded-xl surface border border-[var(--border-subtle)] hover:border-amber-500/40 disabled:opacity-30 text-slate-300 transition-colors"
              >
                <SkipBack className="w-4 h-4" />
              </button>
              <button 
                onClick={() => setIsPlaying(!isPlaying)} 
                className="btn-primary px-3.5 py-1.5 text-xs font-bold flex items-center gap-1.5 shadow-md shadow-amber-500/20"
              >
                {isPlaying ? (
                  <>
                    <Pause className="w-3.5 h-3.5" />
                    <span>{lang === 'ar' ? 'إيقاف مؤقت' : 'Pause'}</span>
                  </>
                ) : (
                  <>
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>{lang === 'ar' ? 'تشغيل تلقائي' : 'Auto Play'}</span>
                  </>
                )}
              </button>
              <button 
                onClick={handleStepForward} 
                disabled={currentStepIndex === activeStory.steps.length - 1} 
                title={lang === 'ar' ? 'الخطوة التالية' : 'Next Step'} 
                className="p-1.5 rounded-xl surface border border-[var(--border-subtle)] hover:border-amber-500/40 disabled:opacity-30 text-slate-300 transition-colors"
              >
                <SkipForward className="w-4 h-4" />
              </button>
            </div>

            {/* Current Step Label & Completion Percentage */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-[var(--accent-text)] font-bold hidden sm:inline-block">
                {lang === 'ar' 
                  ? `الخطوة ${currentStepIndex + 1} من ${activeStory.steps.length}`
                  : `Step ${currentStepIndex + 1} of ${activeStory.steps.length}`}
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                {Math.round(((currentStepIndex + 1) / activeStory.steps.length) * 100)}% {lang === 'ar' ? 'مكتمل' : 'Done'}
              </span>
            </div>
          </div>

          {/* Continuous Glowing Progress Track */}
          <div className="w-full h-2 bg-slate-950/80 rounded-full overflow-hidden mb-3 p-0.5 border border-slate-800">
            <motion.div 
              className="h-full bg-gradient-to-r from-amber-500 via-amber-400 to-cyan-400 rounded-full shadow-sm"
              initial={{ width: 0 }}
              animate={{ width: `${((currentStepIndex + 1) / activeStory.steps.length) * 100}%` }}
              transition={{ type: 'spring', stiffness: 100, damping: 18 }}
            />
          </div>

          {/* Interactive Step Milestones Pills (أزرار ومحطات الخطوات المباشرة) */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-thin">
            {activeStory.steps.map((st, idx) => {
              const isCurrent = currentStepIndex === idx;
              const isPast = currentStepIndex > idx;
              return (
                <button
                  key={st.stepNumber}
                  onClick={() => { setCurrentStepIndex(idx); setIsPlaying(false); }}
                  className={`group flex items-center gap-2 px-2.5 py-1.5 rounded-xl text-xs font-mono font-bold transition-all shrink-0 cursor-pointer ${
                    isCurrent
                      ? 'bg-[var(--accent)] text-slate-950 shadow-md shadow-amber-400/20 ring-2 ring-amber-400/50'
                      : isPast
                      ? 'bg-emerald-950/60 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-900/60'
                      : 'bg-slate-950/80 text-slate-400 border border-slate-800 hover:border-slate-700 hover:text-slate-200'
                  }`}
                  title={lang === 'ar' ? st.titleAr : (st.titleEn || st.titleAr)}
                >
                  <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] ${
                    isCurrent ? 'bg-slate-950 text-amber-400' : isPast ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-800 text-slate-400'
                  }`}>
                    {isPast ? '✓' : idx + 1}
                  </span>
                  <span className="text-[11px] font-sans font-medium whitespace-nowrap max-w-[130px] sm:max-w-[190px] truncate">
                    {(lang === 'ar' ? st.titleAr : (st.titleEn || st.titleAr)).replace(/^\d+\.\s*/, '')}
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
        {(lang === 'ar' ? currentStep.highlightedEventAr : (currentStep.highlightedEventEn || currentStep.highlightedEventAr)) && (
          <div className="relative z-10 mb-3 flex justify-center">
            <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-[var(--surface-sunken)] border border-[var(--border-subtle)] text-xs text-[var(--text-secondary)]">
              <Sparkles className="w-3.5 h-3.5 text-[var(--accent-text)] animate-pulse" />
              <span className="font-medium">
                {lang === 'ar' ? currentStep.highlightedEventAr : (currentStep.highlightedEventEn || currentStep.highlightedEventAr)}
              </span>
            </div>
          </div>
        )}

        {/* Physical Network Link & Transmission Animation (Shared LTR Coordinate Plane) */}
        <div className="relative w-full max-w-5xl mx-auto my-3 dir-ltr">
          {/* Transmission Wire Container */}
          <div className="relative h-12 flex items-center justify-center">
            {/* Base cable line with interactive Tooltip */}
            <ComponentQuickTooltip
              title={lang === 'ar' ? 'كابل ووسيط النقل الفيزيائي (Physical Transmission Medium - L1)' : 'Physical Cable Link (L1)'}
              category="Layer 1 Physical"
              description={lang === 'ar'
                ? 'كابل إيثرنت (Cat6 UTP / Fiber) ينقل نبضات الإشارات الكهربائية/الضوئية بنمط Full-Duplex لمنع التصادمات نهائياً.'
                : 'Copper/fiber medium carrying serialized electrical/optical pulses in Full-Duplex mode.'}
              ciscoConcept="Duplex: Full-Duplex | Speed: 1000Mbps"
              side="bottom"
              className="absolute left-6 right-6 h-1"
            >
              <div className="w-full h-1 bg-[var(--border-subtle)] rounded-full overflow-hidden cursor-help relative">
                {/* Active signal beam between sender and receiver */}
                <motion.div
                  className="h-full bg-gradient-to-r from-cyan-500 via-[var(--accent)] to-emerald-400"
                  animate={{
                    left: `${Math.min(senderPos, receiverPos)}%`,
                    width: `${Math.max(6, Math.abs(receiverPos - senderPos))}%`
                  }}
                  transition={{ type: 'spring', stiffness: 120, damping: 18 }}
                  style={{ position: 'absolute' }}
                />
              </div>
            </ComponentQuickTooltip>

            {/* Sender Node Port Indicator with Tooltip */}
            <div 
              className="absolute -translate-x-1/2 z-10"
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
              >
                <div className="w-5 h-5 rounded-full border-2 border-cyan-400 bg-slate-900 flex items-center justify-center cursor-help transition-all shadow-md shadow-cyan-500/20">
                  <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
                </div>
              </ComponentQuickTooltip>
            </div>

            {/* Receiver Node Port Indicator with Tooltip */}
            <div 
              className="absolute -translate-x-1/2 z-10"
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
              >
                <div className="w-5 h-5 rounded-full border-2 border-emerald-400 bg-slate-900 flex items-center justify-center cursor-help transition-all shadow-md shadow-emerald-500/20">
                  <div className="w-2 h-2 rounded-full bg-emerald-400" />
                </div>
              </ComponentQuickTooltip>
            </div>

            {/* Animated Packet / Frame Capsule with Tooltip */}
            <motion.div
              key={`${activeStory.id}-${currentStep.stepNumber}`}
              initial={{ 
                left: `${senderPos}%`, 
                scale: 0.85, 
                opacity: 0.5 
              }}
              animate={{ 
                left: isSameActor ? `${senderPos}%` : `${senderPos * 0.2 + receiverPos * 0.8}%`, 
                scale: 1, 
                opacity: 1 
              }}
              transition={{ 
                type: 'spring', 
                stiffness: 95, 
                damping: 15 
              }}
              className="absolute -translate-x-1/2 z-20"
            >
              <ComponentQuickTooltip
                title={lang === 'ar' ? `وحدة بيانات البروتوكول PDU (${currentStep.payloadType})` : `Protocol Data Unit (${currentStep.payloadType})`}
                category="L2 Frame & L3 Packet"
                description={lang === 'ar'
                  ? `حزمة مغلّفة تحتوي على ترويسة MAC L2، ترويسة IP L3، وحمولة البيانات: "${currentStep.payloadContentAr}".`
                  : `Encapsulated PDU with L2 MAC, L3 IP headers, and payload: ${currentStep.payloadType}`}
                ciscoConcept="Encapsulation: Ethernet II + IPv4/IPv6"
                side="bottom"
              >
                <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[var(--accent)] text-slate-950 text-xs font-bold shadow-lg border border-amber-300 cursor-help">
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
            const speech = currentStep.speechBubbles[char.id];
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
                {speech && (
                  <div className={`w-full mb-3 px-3 py-2 rounded-xl text-xs bg-amber-500/15 border border-amber-500/40 text-amber-300 relative shadow-sm ${lang === 'ar' ? 'text-right dir-rtl' : 'text-left dir-ltr'}`}>
                    <p className="line-clamp-3 leading-snug font-medium text-[11px]">{speech}</p>
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
                  <p className="caption-text text-[11px] text-[var(--text-muted)] line-clamp-1 mt-0.5">{lang === 'ar' ? char.roleAr : (char.roleEn || char.roleAr)}</p>
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

        {/* Step Controls Bar */}
        <div className="mt-6 pt-4 border-t border-[var(--border-subtle)] flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <button onClick={handleReset} title={lang === 'ar' ? 'إعادة تشغيل' : 'Reset'} className="btn-ghost p-2">
              <RotateCcw className="w-4 h-4" />
            </button>
            <button onClick={handleStepBackward} disabled={currentStepIndex === 0} title={lang === 'ar' ? 'الخطوة السابقة' : 'Previous'} className="btn-ghost p-2 disabled:opacity-30">
              <SkipBack className="w-4 h-4" />
            </button>
            <button onClick={() => setIsPlaying(!isPlaying)} className="btn-primary px-4">
              {isPlaying ? (
                <><Pause className="w-4 h-4" /><span>{lang === 'ar' ? 'إيقاف' : 'Pause'}</span></>
              ) : (
                <><Play className="w-4 h-4" /><span>{lang === 'ar' ? 'تشغيل' : 'Play'}</span></>
              )}
            </button>
            <button onClick={handleStepForward} disabled={currentStepIndex === activeStory.steps.length - 1} title={lang === 'ar' ? 'الخطوة التالية' : 'Next'} className="btn-ghost p-2 disabled:opacity-30">
              <SkipForward className="w-4 h-4" />
            </button>
          </div>

          {/* Numbered Step Buttons */}
          <div className="flex items-center gap-1.5 flex-wrap justify-center">
            {activeStory.steps.map((st, idx) => (
              <button
                key={st.stepNumber}
                onClick={() => { setCurrentStepIndex(idx); setIsPlaying(false); }}
                className={`w-8 h-8 rounded-lg text-xs font-bold font-mono transition-all cursor-pointer flex items-center justify-center ${
                  currentStepIndex === idx
                    ? 'bg-[var(--accent)] text-black shadow-sm font-black ring-2 ring-[var(--accent)]/40'
                    : currentStepIndex > idx
                    ? 'surface-active text-[var(--accent-text)] border border-[var(--accent-text)]/30'
                    : 'surface text-[var(--text-muted)] hover:text-[var(--text-secondary)] border border-[var(--border-subtle)]'
                }`}
              >
                {idx + 1}
              </button>
            ))}
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
          title={lang === 'ar' ? currentStep.titleAr : (currentStep.titleEn || currentStep.titleAr)}
        >
          {lang === 'ar' ? currentStep.storyNarrativeAr : (currentStep.storyNarrativeEn || currentStep.storyNarrativeAr)}
        </ContentPanel>
        <ContentPanel 
          label={lang === 'ar' ? 'المطابقة التقنية' : 'Technical Match'} 
          title={currentStep.ciscoProtocolTerm}
        >
          {lang === 'ar' ? currentStep.technicalAnalogyAr : (currentStep.technicalAnalogyEn || currentStep.technicalAnalogyAr)}
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
  );
};
