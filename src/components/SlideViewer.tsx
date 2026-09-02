import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ChevronRight, 
  ChevronLeft, 
  Layers, 
  Play, 
  Sparkles, 
  BookOpen, 
  CheckCircle2, 
  Info,
  Maximize2,
  Table,
  Cpu
} from 'lucide-react';
import { SLIDES_DATA } from '../data/slidesData';
import { SIMULATION_SCENARIOS, INITIAL_NETWORK_NODES, NETWORK_LINKS, INITIAL_MAC_TABLE_SWITCH1, INITIAL_ROUTING_TABLE_ROUTER1, INITIAL_ARP_CACHE_HOST_A } from '../data/networkData';
import { NetworkCanvas } from './NetworkCanvas';
import { PacketInspector } from './PacketInspector';
import { RealWorldAnalogyCard } from './RealWorldAnalogyCard';
import { LiveTablesModal } from './LiveTablesModal';
import { QuizSection } from './QuizSection';
import { InteractiveLab } from './InteractiveLab';
import { NetworkNode } from '../types';

interface SlideViewerProps {
  currentSlideIndex: number;
  onSlideChange: (index: number) => void;
}

export const SlideViewer: React.FC<SlideViewerProps> = ({
  currentSlideIndex,
  onSlideChange
}) => {
  const currentSlide = SLIDES_DATA[currentSlideIndex];
  const [selectedStepIndex, setSelectedStepIndex] = useState(0);
  const [selectedNode, setSelectedNode] = useState<NetworkNode | null>(null);
  const [isTablesOpen, setIsTablesOpen] = useState(false);

  // Link slide to its corresponding simulation scenario
  const scenario = SIMULATION_SCENARIOS.find(s => s.id === currentSlide.interactiveScenarioId) || SIMULATION_SCENARIOS[0];
  const currentStep = scenario.steps[selectedStepIndex] || scenario.steps[0];

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

  return (
    <div className="space-y-6">
      {/* Slide Header Card */}
      <div className="p-5 sm:p-6 rounded-3xl bg-gradient-to-r from-slate-900 via-slate-900/90 to-indigo-950/40 border border-slate-800 shadow-2xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2.5 mb-2">
              <span className="px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-xs font-bold font-mono">
                السلايد {currentSlide.number} من {SLIDES_DATA.length}
              </span>
              <span className="px-3 py-1 rounded-full bg-slate-950 text-slate-300 border border-slate-800 text-xs font-medium">
                {currentSlide.categoryAr}
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl md:text-3xl font-black text-white tracking-tight">
              {currentSlide.titleAr}
            </h1>
            <p className="text-xs sm:text-sm text-cyan-300/90 font-mono mt-1 dir-ltr text-right">
              {currentSlide.titleEn}
            </p>
            <p className="text-xs sm:text-sm text-slate-300 mt-2 font-medium">
              {currentSlide.subtitleAr}
            </p>
          </div>

          {/* Quick Slide Navigation Buttons */}
          <div className="flex items-center gap-2 self-end md:self-auto">
            <button
              onClick={handlePrevSlide}
              disabled={currentSlideIndex === 0}
              className="p-2.5 rounded-xl bg-slate-950 hover:bg-slate-800 disabled:opacity-30 text-slate-300 border border-slate-800 transition-all flex items-center gap-1 text-xs font-bold"
            >
              <ChevronRight className="w-4 h-4" />
              <span>السابق</span>
            </button>

            <button
              onClick={handleNextSlide}
              disabled={currentSlideIndex === SLIDES_DATA.length - 1}
              className="p-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-30 text-white font-bold text-xs transition-all shadow-lg shadow-indigo-600/30 flex items-center gap-1"
            >
              <span>التالي</span>
              <ChevronLeft className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Special views for Interactive Lab / Quiz slides */}
      {currentSlide.category === 'interactive_lab' ? (
        <InteractiveLab initialScenarioId="cross-network-journey" />
      ) : currentSlide.category === 'quiz' ? (
        <QuizSection />
      ) : (
        /* Regular Interactive Animated Slide with Living Canvas */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left / Main Column: Living Interactive Canvas & Step Controller */}
          <div className="lg:col-span-7 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                <h3 className="text-sm font-bold text-slate-200">
                  نبض الشبكة الحي (Live Visual Simulation):
                </h3>
              </div>

              <button
                onClick={() => setIsTablesOpen(true)}
                className="px-3 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-cyan-300 text-xs font-mono flex items-center gap-1.5 transition-colors"
              >
                <Table className="w-3.5 h-3.5" />
                <span>فحص الذاكرة والجداول</span>
              </button>
            </div>

            {/* Interactive Canvas */}
            <NetworkCanvas
              nodes={INITIAL_NETWORK_NODES}
              links={NETWORK_LINKS}
              currentStep={currentStep}
              activeScenarioTitle={scenario.titleAr}
              onNodeClick={(node) => {
                setSelectedNode(node);
                setIsTablesOpen(true);
              }}
              selectedNodeId={selectedNode?.id}
            />

            {/* Scenario Step Navigation Controls */}
            <div className="p-3 bg-slate-900/95 rounded-2xl border border-slate-800 flex items-center justify-between gap-2">
              <span className="text-xs text-slate-400 font-bold">مراحل تدفق الحزمة:</span>
              <div className="flex items-center gap-1.5 overflow-x-auto py-1">
                {scenario.steps.map((st, idx) => (
                  <button
                    key={st.id}
                    onClick={() => setSelectedStepIndex(idx)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold font-mono transition-all flex items-center gap-1 ${
                      selectedStepIndex === idx
                        ? 'bg-amber-400 text-slate-950 shadow-md shadow-amber-400/20'
                        : 'bg-slate-950 text-slate-400 border border-slate-800 hover:text-slate-200'
                    }`}
                  >
                    <span>خطوة {idx + 1}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Packet Header Inspector */}
            <PacketInspector currentStep={currentStep} />
          </div>

          {/* Right Column: Real-World Metaphor, Story & Deep Concepts */}
          <div className="lg:col-span-5 space-y-4">
            <RealWorldAnalogyCard slide={currentSlide} />
          </div>
        </div>
      )}

      {/* Memory Tables Modal */}
      <LiveTablesModal
        isOpen={isTablesOpen}
        onClose={() => setIsTablesOpen(false)}
        selectedNode={selectedNode}
        macTable={INITIAL_MAC_TABLE_SWITCH1}
        routingTable={INITIAL_ROUTING_TABLE_ROUTER1}
        arpCache={INITIAL_ARP_CACHE_HOST_A}
      />
    </div>
  );
};
