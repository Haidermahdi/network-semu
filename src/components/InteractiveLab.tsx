import React, { useState, useEffect } from 'react';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  SkipForward, 
  SkipBack, 
  Zap, 
  Layers, 
  Send, 
  Settings2, 
  Sparkles,
  Table,
  CheckCircle2,
  Radio
} from 'lucide-react';
import { NetworkCanvas } from './NetworkCanvas';
import { PacketInspector } from './PacketInspector';
import { LiveTablesModal } from './LiveTablesModal';
import { SIMULATION_SCENARIOS, INITIAL_NETWORK_NODES, NETWORK_LINKS, INITIAL_MAC_TABLE_SWITCH1, INITIAL_ROUTING_TABLE_ROUTER1, INITIAL_ARP_CACHE_HOST_A } from '../data/networkData';
import { NetworkNode, MacTableEntry, RoutingTableEntry, ArpTableEntry } from '../types';

interface InteractiveLabProps {
  initialScenarioId?: string;
  onOpenLiveTables?: () => void;
}

export const InteractiveLab: React.FC<InteractiveLabProps> = ({ initialScenarioId }) => {
  const [selectedScenarioId, setSelectedScenarioId] = useState(initialScenarioId || 'cross-network-journey');
  const [difficultyFilter, setDifficultyFilter] = useState<'all' | 'simple' | 'complex' | 'very_complex'>('all');
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1); // 1 = normal, 2 = fast, 0.5 = slow
  const [selectedNode, setSelectedNode] = useState<NetworkNode | null>(null);
  const [isTablesModalOpen, setIsTablesModalOpen] = useState(false);

  // Sync if initialScenarioId changes from outside (e.g. from Curriculum quick jump)
  useEffect(() => {
    if (initialScenarioId && initialScenarioId !== selectedScenarioId) {
      setSelectedScenarioId(initialScenarioId);
      setCurrentStepIndex(0);
      setIsPlaying(false);
    }
  }, [initialScenarioId]);

  // Dynamic tables state
  const [macTable, setMacTable] = useState<MacTableEntry[]>(INITIAL_MAC_TABLE_SWITCH1);
  const [routingTable, setRoutingTable] = useState<RoutingTableEntry[]>(INITIAL_ROUTING_TABLE_ROUTER1);
  const [arpCache, setArpCache] = useState<ArpTableEntry[]>(INITIAL_ARP_CACHE_HOST_A);

  const activeScenario = SIMULATION_SCENARIOS.find(s => s.id === selectedScenarioId) || SIMULATION_SCENARIOS[0];
  const currentStep = activeScenario.steps[currentStepIndex];

  // Filtered scenarios
  const filteredScenarios = SIMULATION_SCENARIOS.filter(sc => {
    if (difficultyFilter === 'all') return true;
    return sc.difficulty === difficultyFilter;
  });

  // Auto-play timer
  useEffect(() => {
    let interval: any = null;
    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentStepIndex(prev => {
          if (prev < activeScenario.steps.length - 1) {
            return prev + 1;
          } else {
            setIsPlaying(false);
            return prev;
          }
        });
      }, 3500 / playbackSpeed);
    }
    return () => clearInterval(interval);
  }, [isPlaying, activeScenario, playbackSpeed]);

  // Update dynamic tables when step updates
  useEffect(() => {
    if (currentStep?.tableUpdate) {
      const { tableName, entry } = currentStep.tableUpdate;
      if (tableName === 'MAC Address Table (CAM)') {
        setMacTable(prev => {
          const exists = prev.some(e => e.macAddress === entry.key1);
          if (!exists) {
            return [{ vlan: 1, macAddress: entry.key1, type: 'DYNAMIC', port: entry.key2, ageSeconds: 0 }, ...prev];
          }
          return prev;
        });
      } else if (tableName === 'ARP Cache') {
        setArpCache(prev => {
          const exists = prev.some(e => e.ipAddress === entry.key1);
          if (!exists) {
            return [{ ipAddress: entry.key1, macAddress: entry.key2, type: 'Dynamic', interface: 'eth0' }, ...prev];
          }
          return prev;
        });
      }
    }
  }, [currentStep]);

  const handleScenarioChange = (id: string) => {
    setSelectedScenarioId(id);
    setCurrentStepIndex(0);
    setIsPlaying(false);
  };

  const handleStepForward = () => {
    if (currentStepIndex < activeScenario.steps.length - 1) {
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

  return (
    <div className="space-y-4">
      {/* Scenario Selector Ribbon with Difficulty Filter */}
      <div className="p-3.5 bg-slate-900/90 rounded-2xl border border-slate-800 shadow-xl space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-2.5">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-amber-400" />
            <span className="text-xs font-bold text-slate-200">اختر سيناريو المحاكاة المنهجي:</span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-800">
              {SIMULATION_SCENARIOS.length} سيناريوهات
            </span>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-xl border border-slate-800">
            <button
              onClick={() => setDifficultyFilter('all')}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-colors ${
                difficultyFilter === 'all'
                  ? 'bg-slate-700 text-white'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              الكل ({SIMULATION_SCENARIOS.length})
            </button>
            <button
              onClick={() => setDifficultyFilter('simple')}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-colors ${
                difficultyFilter === 'simple'
                  ? 'bg-emerald-600 text-white'
                  : 'text-emerald-400 hover:text-emerald-300'
              }`}
            >
              بسيط (3)
            </button>
            <button
              onClick={() => setDifficultyFilter('complex')}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-colors ${
                difficultyFilter === 'complex'
                  ? 'bg-amber-600 text-white'
                  : 'text-amber-400 hover:text-amber-300'
              }`}
            >
              متوسط / معقد (2)
            </button>
            <button
              onClick={() => setDifficultyFilter('very_complex')}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-colors ${
                difficultyFilter === 'very_complex'
                  ? 'bg-rose-600 text-white'
                  : 'text-rose-400 hover:text-rose-300'
              }`}
            >
              متقدم جداً CCIE (2)
            </button>
          </div>

          <button
            onClick={() => setIsTablesModalOpen(true)}
            className="px-3 py-1.5 rounded-xl bg-emerald-950/60 hover:bg-emerald-900/60 border border-emerald-500/40 text-emerald-300 text-xs font-bold flex items-center gap-1.5 transition-colors"
          >
            <Table className="w-3.5 h-3.5" />
            <span>معاينة الجداول (CAM / Route / ARP)</span>
          </button>
        </div>

        {/* Scenario Buttons Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
          {filteredScenarios.map(sc => {
            const isSelected = selectedScenarioId === sc.id;
            const diffBadgeClass = 
              sc.difficulty === 'simple'
                ? 'bg-emerald-950 text-emerald-400 border-emerald-800'
                : sc.difficulty === 'complex'
                ? 'bg-amber-950 text-amber-400 border-amber-800'
                : 'bg-rose-950 text-rose-400 border-rose-800';

            return (
              <button
                key={sc.id}
                onClick={() => handleScenarioChange(sc.id)}
                className={`p-2.5 rounded-xl text-right transition-all border flex flex-col justify-between gap-1.5 ${
                  isSelected
                    ? 'bg-indigo-950/90 border-indigo-500 ring-1 ring-indigo-500/50 shadow-md'
                    : 'bg-slate-950/70 border-slate-800 hover:border-slate-700 hover:bg-slate-900/80 text-slate-300'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <span className="font-bold text-xs leading-snug line-clamp-1 text-slate-100">
                    {sc.titleAr}
                  </span>
                  <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold shrink-0 border ${diffBadgeClass}`}>
                    {sc.difficulty === 'simple' ? 'بسيط' : sc.difficulty === 'complex' ? 'متوسط' : 'CCIE متقدم'}
                  </span>
                </div>
                <div className="flex items-center justify-between text-[10px] text-slate-400">
                  <span className="font-mono text-cyan-400">{sc.packetType}</span>
                  <span className="text-slate-400">{sc.steps.length} خطوات تفاعلية</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Network Animated Canvas */}
      <NetworkCanvas
        nodes={INITIAL_NETWORK_NODES}
        links={NETWORK_LINKS}
        currentStep={currentStep}
        activeScenarioTitle={activeScenario.titleAr}
        onNodeClick={(node) => {
          setSelectedNode(node);
          setIsTablesModalOpen(true);
        }}
        selectedNodeId={selectedNode?.id}
        isPlaying={isPlaying}
      />

      {/* Simulation Timeline Controls */}
      <div className="p-3.5 bg-slate-900/95 rounded-2xl border border-slate-800 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-3">
        {/* Playback Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleReset}
            title="إعادة من البداية"
            className="p-2 rounded-xl bg-slate-950 hover:bg-slate-800 text-slate-300 border border-slate-800 transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          <button
            onClick={handleStepBackward}
            disabled={currentStepIndex === 0}
            title="الخطوة السابقة"
            className="p-2 rounded-xl bg-slate-950 hover:bg-slate-800 disabled:opacity-30 text-slate-300 border border-slate-800 transition-colors"
          >
            <SkipBack className="w-4 h-4" />
          </button>

          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-extrabold text-xs sm:text-sm flex items-center gap-1.5 shadow-lg shadow-amber-500/20 transition-all"
          >
            {isPlaying ? (
              <>
                <Pause className="w-4 h-4" />
                <span>إيقاف مؤقت</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-slate-950" />
                <span>تشغيل المحاكاة</span>
              </>
            )}
          </button>

          <button
            onClick={handleStepForward}
            disabled={currentStepIndex === activeScenario.steps.length - 1}
            title="الخطوة التالية"
            className="p-2 rounded-xl bg-slate-950 hover:bg-slate-800 disabled:opacity-30 text-slate-300 border border-slate-800 transition-colors"
          >
            <SkipForward className="w-4 h-4" />
          </button>
        </div>

        {/* Step Progression Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto max-w-full py-1">
          {activeScenario.steps.map((step, idx) => (
            <button
              key={step.id}
              onClick={() => {
                setCurrentStepIndex(idx);
                setIsPlaying(false);
              }}
              className={`h-7 px-2.5 rounded-lg text-xs font-bold font-mono transition-all flex items-center gap-1 ${
                currentStepIndex === idx
                  ? 'bg-amber-400 text-slate-950 shadow-md shadow-amber-400/20'
                  : currentStepIndex > idx
                    ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-600/40'
                    : 'bg-slate-950 text-slate-500 border border-slate-800 hover:text-slate-300'
              }`}
            >
              <span>{idx + 1}</span>
            </button>
          ))}
        </div>

        {/* Speed Controls */}
        <div className="flex items-center gap-1.5 text-xs text-slate-400">
          <span>السرعة:</span>
          {[0.5, 1, 2].map((s) => (
            <button
              key={s}
              onClick={() => setPlaybackSpeed(s)}
              className={`px-2 py-1 rounded-md text-[11px] font-mono font-bold ${
                playbackSpeed === s
                  ? 'bg-slate-800 text-amber-300 border border-slate-700'
                  : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              {s}x
            </button>
          ))}
        </div>
      </div>

      {/* Packet Inspector Card */}
      <PacketInspector currentStep={currentStep} />

      {/* Live Memory Tables Modal */}
      <LiveTablesModal
        isOpen={isTablesModalOpen}
        onClose={() => setIsTablesModalOpen(false)}
        selectedNode={selectedNode}
        macTable={macTable}
        routingTable={routingTable}
        arpCache={arpCache}
      />
    </div>
  );
};
