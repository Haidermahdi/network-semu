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
  Shield,
  HelpCircle,
  CheckCircle2,
  Navigation,
  Compass,
  Terminal,
  Activity,
  Award,
  Radio,
  Send
} from 'lucide-react';
import { HUMAN_NETWORK_STORIES } from '../data/humanNetworkStoriesData';
import { HumanNetworkStory, StreetCharacter, StreetStoryStep, Language } from '../types';
import { PageHeader, ContentPanel } from './ui/ContentDisplay';

interface RealLifeNetworkProps {
  lang?: Language;
  onNavigateToLab?: (scenarioId: string) => void;
}

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

  const activeStory: HumanNetworkStory = HUMAN_NETWORK_STORIES.find(s => s.id === selectedStoryId) || HUMAN_NETWORK_STORIES[0];
  const currentStep: StreetStoryStep = activeStory.steps[currentStepIndex] || activeStory.steps[0];

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
    return 'cross-network-journey';
  };

  return (
    <div className={`space-y-5 ${lang === 'ar' ? 'dir-rtl text-right' : 'dir-ltr text-left'}`}>
      <PageHeader
        icon={<Compass className="w-5 h-5" />}
        title={lang === 'ar' ? 'شبكات من واقعنا' : 'Real-Life Network Stories'}
        description={lang === 'ar'
          ? 'شاهد أشخاصاً في مشاهد واقعية يحملون عناوين IP و MAC، لترى كيف تدور بروتوكولات سيسكو في الحياة اليومية.'
          : 'Watch people in real-world scenes with IP & MAC addresses to grasp routing, switching, ARP, and NAT.'}
        badge={lang === 'ar' ? 'قصص تفاعلية' : 'Interactive'}
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

      {/* Story Selector */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2">
        {HUMAN_NETWORK_STORIES.map(story => {
          const isSelected = selectedStoryId === story.id;
          return (
            <button
              key={story.id}
              onClick={() => handleStoryChange(story.id)}
              className={`p-3 rounded-xl text-right transition-all border flex flex-col gap-2 cursor-pointer ${
                isSelected
                  ? 'surface-active'
                  : 'surface hover:border-[var(--border-default)] text-[var(--text-muted)] hover:text-[var(--text-secondary)]'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="caption-text font-bold">{story.difficulty.split(' ')[0]}</span>
                <span className="badge">{story.protocolBadge.split('(')[0].trim()}</span>
              </div>
              <div className="heading-4 line-clamp-2 leading-snug">
                {lang === 'ar' ? story.titleAr : story.titleEn}
              </div>
            </button>
          );
        })}
      </div>

      {/* Main Street Stage */}
      <div className="relative w-full min-h-[480px] surface p-6 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.03)_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />

        <div className="flex flex-wrap items-center justify-between gap-2 relative z-10 mb-4">
          <div className="flex items-center gap-2 surface-elevated px-3 py-1.5 rounded-full">
            <MapPin className="w-3.5 h-3.5 text-[var(--accent-text)]" />
            <span className="heading-4">{lang === 'ar' ? activeStory.titleAr : activeStory.titleEn}</span>
            <span className="text-[var(--border-subtle)]">|</span>
            <span className="mono-text">{activeStory.protocolBadge}</span>
          </div>
          <span className="caption-text mono-text px-3 py-1 surface rounded-full">
            {lang === 'ar' ? `الخطوة ${currentStep.stepNumber} / ${activeStory.steps.length}` : `Step ${currentStep.stepNumber} / ${activeStory.steps.length}`}
          </span>
        </div>

        <div className="absolute bottom-16 left-0 right-0 h-24 bg-[var(--bg-surface)] border-t border-[var(--border-subtle)] pointer-events-none" />

        {/* Animated Moving Packet or Message Envelope across the street */}
        <div className="relative w-full h-8 z-20 my-2">
          <motion.div
            animate={{
              left: `${currentStep.packetPositionPercent}%`
            }}
            transition={{ type: 'spring', stiffness: 100, damping: 15 }}
            className="absolute -translate-x-1/2 -top-2 flex items-center gap-1.5 px-3 py-1 rounded-full bg-[var(--accent)] text-black text-xs font-bold"
          >
            <Send className="w-3 h-3 animate-pulse" />
            <span>{currentStep.payloadType}</span>
          </motion.div>
        </div>

        {/* Characters Positioned Across the Street Scene */}
        <div className="relative z-10 grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4 mt-4 pt-2">
          {activeStory.characters.map((char) => {
            const isActive = char.id === currentStep.activeCharacterId;
            const isSender = char.id === currentStep.fromCharacterId;
            const isReceiver = char.id === currentStep.toCharacterId;
            const speech = currentStep.speechBubbles[char.id];
            const isSelected = selectedCharacter?.id === char.id;

            return (
              <motion.div
                key={char.id}
                onClick={() => setSelectedCharacter(char)}
                animate={{
                  scale: isActive ? 1.04 : 1,
                  y: isActive ? -6 : 0
                }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                className={`relative cursor-pointer p-4 rounded-xl border transition-all flex flex-col items-center text-center ${
                  isActive
                    ? 'surface-active'
                    : isSelected
                    ? 'surface-elevated'
                    : 'surface hover:border-[var(--border-default)]'
                }`}
              >
                {speech && (
                  <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-44 surface-active text-[var(--accent-text)] text-[11px] p-2 rounded-xl z-30 pointer-events-none">
                    <p className="line-clamp-2 leading-snug">{speech}</p>
                  </div>
                )}

                <div className="w-full flex flex-col items-center gap-1 mb-3">
                  <div className="badge badge-accent mono-text">
                    IP: {char.ipAddress}
                  </div>
                  <div className="caption-text mono-text">
                    MAC: {char.macAddress}
                  </div>
                </div>

                <div className="relative my-2">
                  <div className={`w-14 h-14 rounded-xl flex items-center justify-center text-2xl border ${
                    isActive ? 'surface-active' : 'surface'
                  }`}>
                    {getAvatarIcon(char.avatarRole)}
                  </div>
                  
                  {isActive && (
                    <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-[var(--accent)] text-[9px] font-bold text-black flex items-center justify-center">!</span>
                  )}
                </div>

                <div className="mt-1">
                  <h4 className="heading-4">{lang === 'ar' ? char.nameAr : char.nameEn}</h4>
                  <p className="caption-text">{char.roleAr}</p>
                </div>

                {char.carryingItem && (
                  <div className="mt-2 pt-2 border-t border-[var(--border-subtle)] w-full">
                    <span className="badge block truncate">{char.carryingItem}</span>
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>

        <div className="mt-6 pt-4 border-t border-[var(--border-subtle)] flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button onClick={handleReset} className="btn-ghost p-2"><RotateCcw className="w-4 h-4" /></button>
            <button onClick={handleStepBackward} disabled={currentStepIndex === 0} className="btn-ghost p-2 disabled:opacity-30"><SkipBack className="w-4 h-4" /></button>
            <button onClick={() => setIsPlaying(!isPlaying)} className="btn-primary">
              {isPlaying ? <><Pause className="w-4 h-4" /><span>{lang === 'ar' ? 'إيقاف' : 'Pause'}</span></> : <><Play className="w-4 h-4" /><span>{lang === 'ar' ? 'تشغيل' : 'Play'}</span></>}
            </button>
            <button onClick={handleStepForward} disabled={currentStepIndex === activeStory.steps.length - 1} className="btn-ghost p-2 disabled:opacity-30"><SkipForward className="w-4 h-4" /></button>
          </div>

          <div className="flex items-center gap-1 flex-wrap justify-center">
            {activeStory.steps.map((st, idx) => (
              <button
                key={st.stepNumber}
                onClick={() => { setCurrentStepIndex(idx); setIsPlaying(false); }}
                className={`w-7 h-7 rounded-lg text-xs font-bold font-mono transition-all cursor-pointer ${
                  currentStepIndex === idx
                    ? 'bg-[var(--accent)] text-black'
                    : currentStepIndex > idx
                    ? 'surface-active text-[var(--accent-text)]'
                    : 'surface text-[var(--text-muted)]'
                }`}
              >
                {idx + 1}
              </button>
            ))}
          </div>

          {currentStep.ciscoCommandSnippet && (
            <div className="mono-text surface px-3 py-1.5 rounded-lg">
              {currentStep.ciscoCommandSnippet}
            </div>
          )}
        </div>
      </div>

      {/* Breakdown Panels */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <ContentPanel label={lang === 'ar' ? 'القصة الواقعية' : 'Real Story'} title={currentStep.titleAr}>
          {currentStep.storyNarrativeAr}
        </ContentPanel>
        <ContentPanel label={lang === 'ar' ? 'المطابقة التقنية' : 'Technical Match'} title={currentStep.ciscoProtocolTerm}>
          {currentStep.technicalAnalogyAr}
        </ContentPanel>
        <div className="p-4 surface space-y-2">
          <div className="label-text">{lang === 'ar' ? 'ترويسات L2 / L3' : 'L2 / L3 Headers'}</div>
          <div className="space-y-1.5">
            {[
              ['L2 Src MAC', currentStep.l2Src],
              ['L2 Dest MAC', currentStep.l2Dest],
              ['L3 Src IP', currentStep.l3Src],
              ['L3 Dest IP', currentStep.l3Dest],
            ].map(([label, val]) => (
              <div key={label} className="flex justify-between surface px-2.5 py-1.5 rounded-lg">
                <span className="caption-text">{label}</span>
                <span className="mono-text text-[var(--text-primary)]">{val}</span>
              </div>
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
              <p className="caption-text mt-0.5">{selectedCharacter.initialSpeech}</p>
            </div>
          </div>
          <button onClick={() => setSelectedCharacter(null)} className="btn-ghost">
            {lang === 'ar' ? 'إغلاق' : 'Close'}
          </button>
        </div>
      )}
    </div>
  );
};
