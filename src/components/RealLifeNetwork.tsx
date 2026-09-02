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
    <div className={`space-y-6 ${lang === 'ar' ? 'dir-rtl text-right' : 'dir-ltr text-left'}`}>
      {/* Header & Story Selector */}
      <div className="p-5 bg-slate-900/90 rounded-2xl border border-slate-800 shadow-xl space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-800 pb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
              <Compass className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-100 flex items-center gap-2">
                <span>{lang === 'ar' ? 'فهم الشبكات من مواقف الحياة (Human & Real-World Network Stories)' : 'Real-World Network Stories & Human Analogies'}</span>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  {lang === 'ar' ? 'قصص واقعية ممتعة' : 'Interactive Street Scene'}
                </span>
              </h2>
              <p className="text-xs sm:text-sm text-slate-400">
                {lang === 'ar' 
                  ? 'شاهد أشخاصاً حقيقيين في الشارع يحملون عناوين IP و MAC فوق رؤوسهم، لترى كيف تدور أعمق بروتوكولات سيسكو في الحياة اليومية!'
                  : 'Watch people on the street with IP & MAC addresses floating above their heads to intuitively grasp complex routing, switching, ARP, and NAT.'}
              </p>
            </div>
          </div>

          {onNavigateToLab && (
            <button
              onClick={() => onNavigateToLab(getRelatedLabScenarioId(activeStory.id))}
              className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-indigo-600/30 transition-all shrink-0"
            >
              <Cpu className="w-4 h-4" />
              <span>{lang === 'ar' ? 'جرّب هذا السيناريو في المعمل الحي 🚀' : 'Test Scenario in Live Lab 🚀'}</span>
            </button>
          )}
        </div>

        {/* Story Selector Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2.5">
          {HUMAN_NETWORK_STORIES.map(story => {
            const isSelected = selectedStoryId === story.id;
            return (
              <button
                key={story.id}
                onClick={() => handleStoryChange(story.id)}
                className={`p-3 rounded-xl ${lang === 'ar' ? 'text-right' : 'text-left'} transition-all border flex flex-col justify-between gap-2 ${
                  isSelected
                    ? 'bg-gradient-to-b from-amber-500/20 to-amber-950/40 border-amber-500 text-slate-100 ring-1 ring-amber-500/50 shadow-lg'
                    : 'bg-slate-950/60 border-slate-800/80 hover:border-slate-700 text-slate-400 hover:text-slate-200'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-amber-300 font-mono">
                    {story.difficulty.split(' ')[0]}
                  </span>
                  <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-slate-800 text-cyan-300">
                    {story.protocolBadge.split('(')[0]}
                  </span>
                </div>
                <div className="text-xs font-bold leading-tight line-clamp-2 text-slate-200">
                  {lang === 'ar' ? story.titleAr : story.titleEn}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Street Stage Canvas */}
      <div className="relative w-full min-h-[500px] bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 rounded-3xl border border-slate-800/80 p-6 overflow-hidden shadow-2xl">
        {/* Background Visual Grid */}
        <div className="absolute inset-0 bg-[radial-gradient(#334155_1px,transparent_1px)] [background-size:24px_24px] opacity-25 pointer-events-none" />
        
        {/* Scene Environment Tag */}
        <div className="flex flex-wrap items-center justify-between gap-2 relative z-10 mb-4">
          <div className="flex items-center gap-2 bg-slate-950/90 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-slate-800">
            <MapPin className="w-3.5 h-3.5 text-amber-400" />
            <span className="text-xs font-bold text-slate-200">
              {lang === 'ar' ? activeStory.titleAr : activeStory.titleEn}
            </span>
            <span className="text-slate-600">|</span>
            <span className="text-xs text-amber-300 font-mono font-bold">{activeStory.protocolBadge}</span>
          </div>

          <div className="text-xs font-bold text-slate-400 px-3 py-1 bg-slate-950/80 rounded-full border border-slate-800 font-mono">
            {lang === 'ar' ? `الخطوة ${currentStep.stepNumber} من ${activeStory.steps.length}` : `Step ${currentStep.stepNumber} of ${activeStory.steps.length}`}
          </div>
        </div>

        {/* Road & Sidewalk Illustration Line */}
        <div className="absolute bottom-16 left-0 right-0 h-28 bg-gradient-to-t from-slate-950/90 to-slate-900/40 border-t border-b border-slate-800/80 pointer-events-none">
          <div className="absolute top-1/2 left-0 right-0 h-0.5 border-t border-dashed border-slate-700/60" />
        </div>

        {/* Animated Moving Packet or Message Envelope across the street */}
        <div className="relative w-full h-8 z-20 my-2">
          <motion.div
            animate={{
              left: `${currentStep.packetPositionPercent}%`
            }}
            transition={{ type: 'spring', stiffness: 100, damping: 15 }}
            className="absolute -translate-x-1/2 -top-2 flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 text-xs font-bold shadow-lg shadow-amber-500/30"
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
                className={`relative cursor-pointer p-4 rounded-2xl border transition-all flex flex-col items-center text-center ${
                  isActive
                    ? 'bg-amber-950/60 border-amber-400 shadow-xl shadow-amber-500/20 ring-2 ring-amber-400/40'
                    : isReceiver
                    ? 'bg-cyan-950/60 border-cyan-400 shadow-lg ring-1 ring-cyan-400/30'
                    : isSelected
                    ? 'bg-slate-800/90 border-indigo-500'
                    : 'bg-slate-950/80 border-slate-800 hover:border-slate-700'
                }`}
              >
                {/* Speech Bubble Above Person */}
                {speech && (
                  <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-48 bg-slate-900 border border-amber-500/60 text-amber-200 text-[11px] p-2 rounded-xl shadow-xl z-30 pointer-events-none">
                    <p className="line-clamp-2 leading-snug">{speech}</p>
                    <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-slate-900 border-b border-r border-amber-500/60 rotate-45" />
                  </div>
                )}

                {/* Floating IP & MAC Badges over Character */}
                <div className="w-full flex flex-col items-center gap-1 mb-3">
                  <div className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 font-mono text-[11px] font-bold shadow-sm">
                    <span className="text-[9px] text-emerald-400">IP:</span>
                    <span>{char.ipAddress}</span>
                  </div>
                  <div className="text-[10px] font-mono text-slate-400 px-2 py-0.5 rounded bg-slate-900 border border-slate-800">
                    MAC: {char.macAddress}
                  </div>
                </div>

                {/* Character Avatar Icon & Role */}
                <div className="relative my-2">
                  <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-3xl shadow-inner border-2 ${
                    isActive 
                      ? 'bg-amber-500/30 border-amber-400 ring-4 ring-amber-500/20' 
                      : 'bg-slate-900 border-slate-700'
                  }`}>
                    {getAvatarIcon(char.avatarRole)}
                  </div>
                  
                  {isActive && (
                    <span className="absolute -top-2 -right-2 flex h-4 w-4">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-4 w-4 bg-amber-500 text-[9px] font-bold text-slate-950 items-center justify-center">!</span>
                    </span>
                  )}
                </div>

                {/* Name & Human Role */}
                <div className="mt-1">
                  <h4 className="text-sm font-bold text-slate-100">
                    {lang === 'ar' ? char.nameAr : char.nameEn}
                  </h4>
                  <p className="text-[11px] text-amber-300 font-medium">{char.roleAr}</p>
                </div>

                {/* Item being carried */}
                {char.carryingItem && (
                  <div className="mt-2.5 pt-2 border-t border-slate-800/80 w-full">
                    <span className="text-[10px] font-bold text-cyan-300 bg-cyan-950/60 px-2 py-0.5 rounded-md border border-cyan-800/60 block truncate">
                      {char.carryingItem}
                    </span>
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>

        {/* Step Navigation Controls */}
        <div className="mt-8 pt-4 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              onClick={handleReset}
              title={lang === 'ar' ? 'إعادة من البداية' : 'Reset to Start'}
              className="p-2 rounded-xl bg-slate-950 hover:bg-slate-800 text-slate-300 border border-slate-800 transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            <button
              onClick={handleStepBackward}
              disabled={currentStepIndex === 0}
              title={lang === 'ar' ? 'المشهد السابق' : 'Previous Step'}
              className="p-2 rounded-xl bg-slate-950 hover:bg-slate-800 disabled:opacity-30 text-slate-300 border border-slate-800 transition-colors"
            >
              <SkipBack className="w-4 h-4" />
            </button>

            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-2 shadow-lg shadow-amber-500/20 transition-all"
            >
              {isPlaying ? (
                <>
                  <Pause className="w-4 h-4" />
                  <span>{lang === 'ar' ? 'إيقاف القصة' : 'Pause Story'}</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-slate-950" />
                  <span>{lang === 'ar' ? 'سرد القصة تلقائياً' : 'Auto Play Story'}</span>
                </>
              )}
            </button>

            <button
              onClick={handleStepForward}
              disabled={currentStepIndex === activeStory.steps.length - 1}
              title={lang === 'ar' ? 'المشهد التالي' : 'Next Step'}
              className="p-2 rounded-xl bg-slate-950 hover:bg-slate-800 disabled:opacity-30 text-slate-300 border border-slate-800 transition-colors"
            >
              <SkipForward className="w-4 h-4" />
            </button>
          </div>

          {/* Step Pills */}
          <div className="flex items-center gap-1.5 flex-wrap justify-center">
            {activeStory.steps.map((st, idx) => (
              <button
                key={st.stepNumber}
                onClick={() => {
                  setCurrentStepIndex(idx);
                  setIsPlaying(false);
                }}
                className={`px-3 py-1 rounded-lg text-xs font-bold font-mono transition-all ${
                  currentStepIndex === idx
                    ? 'bg-amber-400 text-slate-950 shadow-md scale-105'
                    : currentStepIndex > idx
                    ? 'bg-emerald-950 text-emerald-300 border border-emerald-700'
                    : 'bg-slate-950 text-slate-500 border border-slate-800 hover:text-slate-300'
                }`}
              >
                {idx + 1}
              </button>
            ))}
          </div>

          {/* Cisco Command Snippet */}
          {currentStep.ciscoCommandSnippet && (
            <div className="flex items-center gap-1.5 bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800 font-mono text-[11px] text-emerald-400">
              <Terminal className="w-3.5 h-3.5 text-cyan-400" />
              <span>{currentStep.ciscoCommandSnippet}</span>
            </div>
          )}
        </div>
      </div>

      {/* Deep Conceptual Breakdown: Real Life Story vs Cisco Networking Reality */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Real Life Story Narrative */}
        <div className="p-5 bg-gradient-to-b from-amber-950/30 to-slate-900/90 rounded-2xl border border-amber-500/30 shadow-lg space-y-2">
          <div className="flex items-center gap-2 text-amber-300 font-bold text-sm">
            <Users className="w-4 h-4" />
            <span>{lang === 'ar' ? 'القصة والموقف الإنساني في الشارع:' : 'Human Street Story & Context:'}</span>
          </div>
          <h4 className="text-xs font-bold text-white">{currentStep.titleAr}</h4>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            {currentStep.storyNarrativeAr}
          </p>
        </div>

        {/* Cisco Technical Reality */}
        <div className="p-5 bg-gradient-to-b from-cyan-950/30 to-slate-900/90 rounded-2xl border border-cyan-500/30 shadow-lg space-y-2">
          <div className="flex items-center gap-2 text-cyan-300 font-bold text-sm">
            <Cpu className="w-4 h-4" />
            <span>{lang === 'ar' ? 'المطابقة التقنية في كروت وشبكات سيسكو:' : 'Cisco Enterprise Tech Correspondence:'}</span>
          </div>
          <div className="text-[11px] font-mono px-2 py-0.5 rounded bg-cyan-950 border border-cyan-800 text-cyan-300 inline-block">
            {currentStep.ciscoProtocolTerm}
          </div>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            {currentStep.technicalAnalogyAr}
          </p>
        </div>

        {/* Packet Header Details for this Step */}
        <div className="p-5 bg-gradient-to-b from-indigo-950/30 to-slate-900/90 rounded-2xl border border-indigo-500/30 shadow-lg space-y-2 font-mono text-xs">
          <div className="flex items-center gap-2 text-indigo-300 font-bold text-sm font-sans">
            <Layers className="w-4 h-4" />
            <span>{lang === 'ar' ? 'ترويسات الإطار والحزمة (L2 / L3 Headers):' : 'L2 / L3 Frame & Packet Headers:'}</span>
          </div>
          <div className="space-y-1.5 pt-1 text-slate-300">
            <div className="flex justify-between bg-slate-950 p-1.5 rounded border border-slate-800">
              <span className="text-slate-500">L2 Src MAC:</span>
              <span className="text-emerald-400">{currentStep.l2Src}</span>
            </div>
            <div className="flex justify-between bg-slate-950 p-1.5 rounded border border-slate-800">
              <span className="text-slate-500">L2 Dest MAC:</span>
              <span className="text-cyan-400">{currentStep.l2Dest}</span>
            </div>
            <div className="flex justify-between bg-slate-950 p-1.5 rounded border border-slate-800">
              <span className="text-slate-500">L3 Src IP:</span>
              <span className="text-amber-400">{currentStep.l3Src}</span>
            </div>
            <div className="flex justify-between bg-slate-950 p-1.5 rounded border border-slate-800">
              <span className="text-slate-500">L3 Dest IP:</span>
              <span className="text-amber-300">{currentStep.l3Dest}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Selected Character Deep Profile Card */}
      {selectedCharacter && (
        <div className="p-4 bg-slate-900/95 rounded-2xl border border-indigo-500/40 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="text-3xl p-3 bg-slate-950 rounded-2xl border border-slate-800">
              {getAvatarIcon(selectedCharacter.avatarRole)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-slate-100">
                  {lang === 'ar' ? selectedCharacter.nameAr : selectedCharacter.nameEn}
                </h3>
                <span className="text-xs px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono">
                  {selectedCharacter.ipAddress}
                </span>
                <span className="text-xs px-2 py-0.5 rounded bg-slate-800 text-slate-400 font-mono">
                  {selectedCharacter.macAddress}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">{selectedCharacter.initialSpeech}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setSelectedCharacter(null)}
              className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold"
            >
              {lang === 'ar' ? 'إغلاق' : 'Close'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
