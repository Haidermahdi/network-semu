import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ChevronRight, 
  ChevronLeft, 
  Layers, 
  Play, 
  Pause,
  RotateCcw,
  Sparkles, 
  BookOpen, 
  CheckCircle2, 
  Info,
  Maximize2,
  Minimize2,
  Table,
  Cpu,
  Monitor,
  Activity,
  Zap,
  FastForward,
  Terminal,
  Grid,
  Radio,
  ArrowRight,
  ArrowLeft
} from 'lucide-react';
import { SLIDES_DATA } from '../data/slidesData';
import { 
  SIMULATION_SCENARIOS, 
  INITIAL_NETWORK_NODES, 
  NETWORK_LINKS, 
  INITIAL_MAC_TABLE_SWITCH1, 
  INITIAL_ROUTING_TABLE_ROUTER1, 
  INITIAL_ARP_CACHE_HOST_A 
} from '../data/networkData';
import { NetworkCanvas } from './NetworkCanvas';
import { PacketInspector } from './PacketInspector';
import { RealWorldAnalogyCard } from './RealWorldAnalogyCard';
import { LiveTablesModal } from './LiveTablesModal';
import { QuizSection } from './QuizSection';
import { InteractiveLab } from './InteractiveLab';
import { NetworkNode, Language } from '../types';
import { SubnetDecisionTool } from './slideModules/SubnetDecisionTool';
import { SwitchCamSimulator } from './slideModules/SwitchCamSimulator';
import { ArpDissectorTool } from './slideModules/ArpDissectorTool';
import { LongestPrefixMatchTool } from './slideModules/LongestPrefixMatchTool';
import { EncapsulationLifecycleTool } from './slideModules/EncapsulationLifecycleTool';
import { SwitchVsRouterMatrixTool } from './slideModules/SwitchVsRouterMatrixTool';
import { ExamTrapCard } from './slideModules/ExamTrapCard';

interface SlideViewerProps {
  currentSlideIndex: number;
  onSlideChange: (index: number) => void;
  lang?: Language;
}

export const SlideViewer: React.FC<SlideViewerProps> = ({
  currentSlideIndex,
  onSlideChange,
  lang = 'ar'
}) => {
  const isEn = lang === 'en';
  const currentSlide = SLIDES_DATA[currentSlideIndex] || SLIDES_DATA[0];
  const [selectedStepIndex, setSelectedStepIndex] = useState(0);
  const [selectedNode, setSelectedNode] = useState<NetworkNode | null>(null);
  const [isTablesOpen, setIsTablesOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'studio' | 'technical' | 'simulation' | 'concepts'>('studio');
  const [isPlaying, setIsPlaying] = useState(false);
  const [playSpeed, setPlaySpeed] = useState<1 | 1.5 | 2>(1);
  const [isSlideDrawerOpen, setIsSlideDrawerOpen] = useState(false);

  // Specialized interactive micro-module dispatcher for each technical slide
  const renderSpecializedModule = () => {
    switch (currentSlide.id) {
      case 'slide-1':
        return <SubnetDecisionTool lang={lang} />;
      case 'slide-2':
        return <SwitchCamSimulator lang={lang} />;
      case 'slide-3':
        return <ArpDissectorTool lang={lang} />;
      case 'slide-4':
        return <LongestPrefixMatchTool lang={lang} />;
      case 'slide-5':
        return <EncapsulationLifecycleTool lang={lang} />;
      case 'slide-6':
        return <SwitchVsRouterMatrixTool lang={lang} />;
      default:
        return null;
    }
  };

  // Link slide to its corresponding simulation scenario
  const scenario = SIMULATION_SCENARIOS.find(s => s.id === currentSlide.interactiveScenarioId) || SIMULATION_SCENARIOS[0];
  const totalSteps = scenario.steps.length;
  const currentStep = scenario.steps[selectedStepIndex] || scenario.steps[0];

  // Auto-play step animation
  useEffect(() => {
    let timer: any = null;
    if (isPlaying) {
      const intervalMs = 2600 / playSpeed;
      timer = setInterval(() => {
        setSelectedStepIndex((prev) => {
          if (prev >= totalSteps - 1) {
            setIsPlaying(false);
            return 0;
          }
          return prev + 1;
        });
      }, intervalMs);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isPlaying, playSpeed, totalSteps]);

  // Reset step index when slide changes
  useEffect(() => {
    setSelectedStepIndex(0);
    setIsPlaying(false);
  }, [currentSlideIndex]);

  // Keyboard navigation shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      if (e.key === 'ArrowRight') {
        if (currentSlideIndex > 0) {
          onSlideChange(currentSlideIndex - 1);
        }
      } else if (e.key === 'ArrowLeft') {
        if (currentSlideIndex < SLIDES_DATA.length - 1) {
          onSlideChange(currentSlideIndex + 1);
        }
      } else if (e.key === ' ') {
        e.preventDefault();
        setIsPlaying(p => !p);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentSlideIndex, onSlideChange]);

  const handleNextSlide = () => {
    if (currentSlideIndex < SLIDES_DATA.length - 1) {
      onSlideChange(currentSlideIndex + 1);
      setSelectedStepIndex(0);
    }
  };

  const handlePrevSlide = () => {
    if (currentSlideIndex > 0) {
      onSlideChange(currentSlideIndex - 1);
      setSelectedStepIndex(0);
    }
  };

  const handleNextStep = () => {
    if (selectedStepIndex < totalSteps - 1) {
      setSelectedStepIndex(selectedStepIndex + 1);
    } else {
      setSelectedStepIndex(0);
    }
  };

  const handlePrevStep = () => {
    if (selectedStepIndex > 0) {
      setSelectedStepIndex(selectedStepIndex - 1);
    }
  };

  // Calculate slide progress percentage
  const progressPercent = ((currentSlideIndex + 1) / SLIDES_DATA.length) * 100;

  return (
    <div className={`space-y-6 font-sans ${isEn ? 'text-left dir-ltr' : 'text-right dir-rtl'}`}>
      {/* ------------------------------------------------------------- */}
      {/* Sleek Presentation Deck Header                                */}
      {/* ------------------------------------------------------------- */}
      <div className="p-5 sm:p-6 rounded-3xl bg-slate-900/95 border border-white/[0.08] shadow-2xl relative overflow-hidden backdrop-blur-xl">
        {/* Top Progress Track */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-white/[0.04]">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progressPercent}%` }}
            transition={{ duration: 0.3 }}
            className="h-full bg-gradient-to-r from-amber-500 to-amber-300"
          />
        </div>

        {/* Ambient Top Glow */}
        <div className="absolute top-0 right-1/4 w-96 h-36 bg-amber-500/[0.06] rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5 relative z-10">
          {/* Slide Title & Meta Info */}
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/20 text-xs font-bold font-mono">
                {isEn 
                  ? `Slide ${currentSlide.number.toString().padStart(2, '0')} of ${SLIDES_DATA.length.toString().padStart(2, '0')}`
                  : `الشريحة ${currentSlide.number.toString().padStart(2, '0')} من ${SLIDES_DATA.length.toString().padStart(2, '0')}`}
              </span>
              <span className="px-3 py-1 rounded-full bg-slate-950/80 text-slate-300 border border-white/[0.06] text-xs font-semibold">
                {isEn && currentSlide.categoryEn ? currentSlide.categoryEn : currentSlide.categoryAr}
              </span>
              <span className="text-[11px] text-slate-500 font-mono hidden sm:inline">
                CCNA 200-301 Interactive Blueprint
              </span>
            </div>

            <h1 className="text-xl sm:text-2xl md:text-3xl font-black text-white tracking-tight leading-tight">
              {isEn ? currentSlide.titleEn : currentSlide.titleAr}
            </h1>

            <div className="flex flex-wrap items-center gap-3 text-xs">
              <span className="text-amber-400/90 font-mono">
                {isEn ? currentSlide.titleAr : currentSlide.titleEn}
              </span>
              <span className="w-1 h-1 rounded-full bg-slate-600 hidden sm:inline" />
              <span className="text-slate-300 font-medium">
                {isEn && currentSlide.subtitleEn ? currentSlide.subtitleEn : currentSlide.subtitleAr}
              </span>
            </div>
          </div>

          {/* Controls: View Mode Switcher + Navigation Buttons */}
          <div className="flex flex-wrap items-center gap-3 self-start lg:self-center">
            {/* View Mode Switcher */}
            {currentSlide.category !== 'interactive_lab' && currentSlide.category !== 'quiz' && (
              <div className="flex items-center p-1 rounded-2xl bg-slate-950/80 border border-white/[0.06] overflow-x-auto max-w-full">
                <button
                  onClick={() => setViewMode('studio')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shrink-0 ${
                    viewMode === 'studio'
                      ? 'bg-amber-500 text-slate-950 font-black shadow-md shadow-amber-500/20'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                  title={isEn ? 'All-in-one studio with lab, simulator, and traps' : 'عرض شامل يجمع المعمل التقني ومحاكي الشبكة وفخاخ سيسكو'}
                >
                  <Grid className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">{isEn ? 'All-in-One Studio' : 'العرض الشامل'}</span>
                  <span className="sm:hidden">{isEn ? 'Studio' : 'شامل'}</span>
                </button>

                <button
                  onClick={() => setViewMode('technical')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shrink-0 ${
                    viewMode === 'technical'
                      ? 'bg-amber-500 text-slate-950 font-black shadow-md shadow-amber-500/20'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                  title={isEn ? 'Engineering lab and CCNA exam traps' : 'الأداة الهندسية التفاعلية وفخاخ اختبار CCNA وأوامر CLI'}
                >
                  <Cpu className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">{isEn ? 'Lab & Exam Traps' : 'المعمل الهندسي وفخاخ CCNA'}</span>
                  <span className="sm:hidden">{isEn ? 'Lab' : 'المعمل'}</span>
                </button>

                <button
                  onClick={() => setViewMode('simulation')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shrink-0 ${
                    viewMode === 'simulation'
                      ? 'bg-amber-500 text-slate-950 font-black shadow-md shadow-amber-500/20'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                  title={isEn ? 'Packet flow simulator' : 'محاكي الشبكة وتدفق الحزم الحية عبر البنية التحتية'}
                >
                  <Activity className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">{isEn ? 'Packet Simulator' : 'محاكي مسار الحزمة'}</span>
                  <span className="sm:hidden">{isEn ? 'Simulator' : 'المسار'}</span>
                </button>

                <button
                  onClick={() => setViewMode('concepts')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shrink-0 ${
                    viewMode === 'concepts'
                      ? 'bg-amber-500 text-slate-950 font-black shadow-md shadow-amber-500/20'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                  title={isEn ? 'Concepts and real-world analogy' : 'المفاهيم والتشبيه الواقعي'}
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">{isEn ? 'Real-World Metaphor' : 'التشبيه الواقعي'}</span>
                  <span className="sm:hidden">{isEn ? 'Metaphor' : 'التشبيه'}</span>
                </button>
              </div>
            )}

            {/* Quick Slide Index Drawer Button */}
            <div className="relative">
              <button
                onClick={() => setIsSlideDrawerOpen(!isSlideDrawerOpen)}
                className="p-2 sm:px-3 rounded-2xl bg-slate-950/80 hover:bg-slate-900 border border-white/[0.08] text-slate-300 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
                title={isEn ? 'All slides index' : 'فهرس جميع الشرائح'}
              >
                <Layers className="w-4 h-4 text-amber-400" />
                <span className="hidden sm:inline">{isEn ? 'Index' : 'الفهرس'}</span>
              </button>

              {/* Popover Dropdown for Slide Jumping */}
              <AnimatePresence>
                {isSlideDrawerOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 4, scale: 0.96 }}
                    className={`absolute top-full mt-2 ${isEn ? 'left-0' : 'left-0 sm:left-auto sm:right-0'} w-80 bg-slate-900/98 border border-white/[0.1] rounded-2xl p-3 shadow-2xl z-50 backdrop-blur-2xl font-sans`}
                  >
                    <div className="flex items-center justify-between pb-2 mb-2 border-b border-white/[0.06] text-xs font-bold text-slate-400">
                      <span>{isEn ? 'Slide Deck Index' : 'فهرس الشرائح التفاعلية'}</span>
                      <span className="font-mono text-[11px] text-amber-400">{SLIDES_DATA.length} {isEn ? 'Slides' : 'شرائح'}</span>
                    </div>
                    <div className="space-y-1.5 max-h-72 overflow-y-auto pr-1">
                      {SLIDES_DATA.map((s, idx) => (
                        <button
                          key={s.id}
                          onClick={() => {
                            onSlideChange(idx);
                            setIsSlideDrawerOpen(false);
                          }}
                          className={`w-full p-2 rounded-xl ${isEn ? 'text-left' : 'text-right'} transition-all flex items-center justify-between text-xs cursor-pointer ${
                            currentSlideIndex === idx
                              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold'
                              : 'bg-white/[0.02] text-slate-300 hover:bg-white/[0.06] border border-transparent'
                          }`}
                        >
                          <div className="flex items-center gap-2 truncate">
                            <span className="w-5 h-5 rounded-lg bg-slate-950 flex items-center justify-center font-mono text-[10px] text-slate-400 shrink-0">
                              {s.number}
                            </span>
                            <span className="truncate">{isEn ? s.titleEn : s.titleAr}</span>
                          </div>
                          {s.category === 'interactive_lab' && (
                            <span className="px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-300 text-[10px] shrink-0 font-mono">
                              {isEn ? 'Lab' : 'معمل'}
                            </span>
                          )}
                          {s.category === 'quiz' && (
                            <span className="px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[10px] shrink-0 font-mono">
                              {isEn ? 'Quiz' : 'اختبار'}
                            </span>
                          )}
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Prev / Next Slide Navigation Buttons */}
            <div className="flex items-center gap-1.5 bg-slate-950/80 p-1 rounded-2xl border border-white/[0.06]">
              <button
                onClick={isEn ? handlePrevSlide : handlePrevSlide}
                disabled={currentSlideIndex === 0}
                className="p-2 sm:px-3 rounded-xl hover:bg-white/[0.06] disabled:opacity-20 text-slate-300 transition-all flex items-center gap-1.5 text-xs font-bold cursor-pointer disabled:cursor-not-allowed"
                title={isEn ? 'Previous slide' : 'السلايد السابق (السهم الأيمن)'}
              >
                {isEn ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                <span className="hidden sm:inline">{isEn ? 'Prev' : 'السابق'}</span>
              </button>

              <div className="w-[1px] h-4 bg-white/[0.08]" />

              <button
                onClick={handleNextSlide}
                disabled={currentSlideIndex === SLIDES_DATA.length - 1}
                className="p-2 sm:px-4 rounded-xl bg-amber-500 hover:bg-amber-400 disabled:opacity-20 text-slate-950 font-black text-xs transition-all shadow-md shadow-amber-500/20 flex items-center gap-1.5 cursor-pointer disabled:cursor-not-allowed"
                title={isEn ? 'Next slide' : 'السلايد التالي (السهم الأيسر)'}
              >
                <span>{isEn ? 'Next' : 'التالي'}</span>
                {isEn ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* Slide Body Views                                              */}
      {/* ------------------------------------------------------------- */}
      {currentSlide.category === 'interactive_lab' ? (
        <InteractiveLab initialScenarioId="cross-network-journey" lang={lang} />
      ) : currentSlide.category === 'quiz' ? (
        <QuizSection lang={lang} />
      ) : (
        <div className="space-y-6">
          {/* ========================================================= */}
          {/* SECTION 1: Specialized Technical Interactive Masterclass  */}
          {/* ========================================================= */}
          {(viewMode === 'studio' || viewMode === 'technical') && (
            <div className="space-y-6">
              {renderSpecializedModule()}
              <ExamTrapCard slide={currentSlide} lang={lang} />
            </div>
          )}

          {/* ========================================================= */}
          {/* SECTION 2: Interactive Simulation Studio & Packet Flow    */}
          {/* ========================================================= */}
          {(viewMode === 'studio' || viewMode === 'simulation') && (
            <div className="space-y-4">
              {/* Studio Canvas Bar */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-900/80 p-3.5 sm:p-4 rounded-3xl border border-white/[0.08]">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 shrink-0">
                    <Activity className="w-5 h-5 animate-pulse" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-white">
                        {isEn ? 'Packet Flow Simulator & Live Topology' : 'محاكي مسار الحزمة والشبكة الحية'}
                      </span>
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                    </div>
                    <p className="text-[11px] text-slate-400">
                      {isEn 
                        ? 'Trace real-time frames & packets crossing Cisco nodes step-by-step'
                        : 'تتبع حركة الفريمات والحزم عبر أجهزة سيسكو لحظة بلحظة'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-start sm:self-auto">
                  <button
                    onClick={() => setIsTablesOpen(true)}
                    className="px-3.5 py-1.5 rounded-xl bg-slate-950 hover:bg-slate-900 border border-cyan-500/30 text-cyan-300 text-xs font-mono flex items-center gap-1.5 transition-all shadow-md cursor-pointer"
                  >
                    <Table className="w-3.5 h-3.5 text-cyan-400" />
                    <span>{isEn ? 'Inspect Tables (CAM / ARP / Route)' : 'فحص الجداول (CAM / ARP / Route)'}</span>
                  </button>
                </div>
              </div>

              {/* The Network Topology Canvas */}
              <NetworkCanvas
                nodes={INITIAL_NETWORK_NODES}
                links={NETWORK_LINKS}
                currentStep={currentStep}
                activeScenarioTitle={isEn && scenario.titleEn ? scenario.titleEn : scenario.titleAr}
                onNodeClick={(node) => {
                  setSelectedNode(node);
                  setIsTablesOpen(true);
                }}
                selectedNodeId={selectedNode?.id}
                isPlaying={isPlaying}
                lang={lang}
              />

              {/* Interactive Simulation Playback Control Bar */}
              <div className="p-4 rounded-3xl bg-slate-900/95 border border-white/[0.08] shadow-2xl flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 backdrop-blur-xl">
                {/* Left: Play/Pause, Step Advance, Speed */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setIsPlaying(!isPlaying)}
                    className={`p-2.5 px-4 rounded-xl font-bold text-xs flex items-center gap-2 transition-all cursor-pointer ${
                      isPlaying
                        ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/25 font-black'
                        : 'bg-white/[0.06] hover:bg-white/[0.1] text-white border border-white/[0.08]'
                    }`}
                  >
                    {isPlaying ? (
                      <>
                        <Pause className="w-4 h-4 fill-current" />
                        <span>{isEn ? 'Pause' : 'إيقاف مؤقت'}</span>
                      </>
                    ) : (
                      <>
                        <Play className="w-4 h-4 fill-current" />
                        <span>{isEn ? 'Auto Play' : 'تشغيل تلقائي'}</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={handlePrevStep}
                    disabled={selectedStepIndex === 0}
                    className="p-2.5 rounded-xl bg-slate-950 hover:bg-slate-900 disabled:opacity-30 text-slate-300 border border-white/[0.06] text-xs font-bold transition-all cursor-pointer disabled:cursor-not-allowed"
                    title={isEn ? 'Previous step' : 'الخطوة السابقة'}
                  >
                    {isEn ? <ChevronLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
                  </button>

                  <button
                    onClick={handleNextStep}
                    disabled={selectedStepIndex === totalSteps - 1}
                    className="p-2.5 rounded-xl bg-slate-950 hover:bg-slate-900 disabled:opacity-30 text-slate-300 border border-white/[0.06] text-xs font-bold transition-all cursor-pointer disabled:cursor-not-allowed"
                    title={isEn ? 'Next step' : 'الخطوة التالية'}
                  >
                    {isEn ? <ChevronRight className="w-4 h-4" /> : <ArrowLeft className="w-4 h-4" />}
                  </button>

                  {/* Speed Selector */}
                  <div className="flex items-center p-1 rounded-xl bg-slate-950 border border-white/[0.06] text-[11px] font-mono">
                    {([1, 1.5, 2] as const).map(speed => (
                      <button
                        key={speed}
                        onClick={() => setPlaySpeed(speed)}
                        className={`px-2 py-1 rounded-lg transition-all cursor-pointer ${
                          playSpeed === speed
                            ? 'bg-amber-500/20 text-amber-300 font-bold'
                            : 'text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        {speed}x
                      </button>
                    ))}
                  </div>
                </div>

                {/* Center / Right: Step Timeline Pills */}
                <div className="flex items-center gap-1.5 overflow-x-auto py-1 max-w-full">
                  {scenario.steps.map((st, idx) => (
                    <button
                      key={st.id || idx}
                      onClick={() => {
                        setSelectedStepIndex(idx);
                        setIsPlaying(false);
                      }}
                      className={`px-3 py-2 rounded-xl text-xs font-mono font-bold transition-all flex items-center gap-1.5 shrink-0 cursor-pointer ${
                        selectedStepIndex === idx
                          ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20 font-black'
                          : 'bg-slate-950 text-slate-400 hover:text-slate-200 hover:bg-slate-900 border border-white/[0.06]'
                      }`}
                    >
                      <span>{isEn ? `Step ${idx + 1}` : `خطوة ${idx + 1}`}</span>
                      {selectedStepIndex === idx && (
                        <span className="w-1.5 h-1.5 rounded-full bg-slate-950 animate-pulse" />
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Packet Anatomy & OSI Header Inspector */}
              <PacketInspector currentStep={currentStep} lang={lang} />
            </div>
          )}

          {/* ========================================================= */}
          {/* SECTION 3: Real-World Analogy & Concepts Studio           */}
          {/* ========================================================= */}
          {(viewMode === 'studio' || viewMode === 'concepts') && (
            <div className="space-y-4">
              <RealWorldAnalogyCard slide={currentSlide} lang={lang} />
            </div>
          )}
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* Live Memory Tables Modal                                      */}
      {/* ------------------------------------------------------------- */}
      <LiveTablesModal
        isOpen={isTablesOpen}
        onClose={() => setIsTablesOpen(false)}
        selectedNode={selectedNode}
        macTable={INITIAL_MAC_TABLE_SWITCH1}
        routingTable={INITIAL_ROUTING_TABLE_ROUTER1}
        arpCache={INITIAL_ARP_CACHE_HOST_A}
        lang={lang}
      />
    </div>
  );
};
