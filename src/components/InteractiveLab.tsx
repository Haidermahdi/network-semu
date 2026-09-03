import React, { useState, useEffect, useMemo } from 'react';
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
  Radio,
  Search,
  Filter,
  Terminal,
  Server,
  Network,
  Cpu,
  ShieldCheck,
  ChevronDown,
  ChevronUp,
  SlidersHorizontal,
  BookmarkCheck,
  Globe,
  Boxes,
  Lock,
  Shield,
  ArrowRightLeft
} from 'lucide-react';
import { NetworkCanvas } from './NetworkCanvas';
import { PacketInspector } from './PacketInspector';
import { LiveTablesModal } from './LiveTablesModal';
import { SIMULATION_SCENARIOS, INITIAL_MAC_TABLE_SWITCH1, INITIAL_ROUTING_TABLE_ROUTER1, INITIAL_ARP_CACHE_HOST_A } from '../data/networkData';
import { NETWORK_TOPOLOGIES, getTopologyForScenario } from '../data/networkTopologies';
import { NetworkNode, MacTableEntry, RoutingTableEntry, ArpTableEntry, Language } from '../types';

interface InteractiveLabProps {
  initialScenarioId?: string;
  onOpenLiveTables?: () => void;
  lang?: Language;
}

export const InteractiveLab: React.FC<InteractiveLabProps> = ({ initialScenarioId, lang = 'ar' }) => {
  const isEn = lang === 'en';
  const [selectedScenarioId, setSelectedScenarioId] = useState(initialScenarioId || 'cross-network-journey');
  const [selectedTopologyId, setSelectedTopologyId] = useState<string>(() => {
    return getTopologyForScenario(initialScenarioId || 'cross-network-journey').id;
  });
  const [isAutoSyncTopology, setIsAutoSyncTopology] = useState<boolean>(true);
  const [difficultyFilter, setDifficultyFilter] = useState<'all' | 'simple' | 'complex' | 'very_complex'>('all');
  const [categoryFilter, setCategoryFilter] = useState<'all' | 'switching' | 'routing' | 'services_security'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1); // 1 = normal, 2 = fast, 0.5 = slow
  const [selectedNode, setSelectedNode] = useState<NetworkNode | null>(null);
  const [isTablesModalOpen, setIsTablesModalOpen] = useState(false);
  const [isSelectorExpanded, setIsSelectorExpanded] = useState(true);

  // Derive active topology
  const activeTopology = useMemo(() => {
    return NETWORK_TOPOLOGIES.find(t => t.id === selectedTopologyId) || NETWORK_TOPOLOGIES[0];
  }, [selectedTopologyId]);

  // Sync if initialScenarioId changes from outside
  useEffect(() => {
    if (initialScenarioId && initialScenarioId !== selectedScenarioId) {
      setSelectedScenarioId(initialScenarioId);
      setCurrentStepIndex(0);
      setIsPlaying(false);
      if (isAutoSyncTopology) {
        setSelectedTopologyId(getTopologyForScenario(initialScenarioId).id);
      }
    }
  }, [initialScenarioId, isAutoSyncTopology]);

  // Dynamic tables state
  const [macTable, setMacTable] = useState<MacTableEntry[]>(INITIAL_MAC_TABLE_SWITCH1);
  const [routingTable, setRoutingTable] = useState<RoutingTableEntry[]>(INITIAL_ROUTING_TABLE_ROUTER1);
  const [arpCache, setArpCache] = useState<ArpTableEntry[]>(INITIAL_ARP_CACHE_HOST_A);

  const activeScenario = SIMULATION_SCENARIOS.find(s => s.id === selectedScenarioId) || SIMULATION_SCENARIOS[0];
  const currentStep = activeScenario.steps[currentStepIndex];

  // Categorize scenarios
  const getScenarioCategory = (scId: string) => {
    if (['same-lan-switching', 'arp-broadcast-resolution', 'inter-vlan-routing', 'stp-loop-prevention', 'rstp-fast-convergence', 'lacp-etherchannel-bundle'].includes(scId)) {
      return 'switching';
    }
    if (['cross-network-journey', 'default-gateway-ping', 'wan-failover-redundancy', 'eigrp-dual-convergence', 'bgp-ebgp-peering'].includes(scId)) {
      return 'routing';
    }
    return 'services_security';
  };

  // Dynamic Counts
  const counts = useMemo(() => {
    return {
      all: SIMULATION_SCENARIOS.length,
      simple: SIMULATION_SCENARIOS.filter(s => s.difficulty === 'simple').length,
      complex: SIMULATION_SCENARIOS.filter(s => s.difficulty === 'complex').length,
      very_complex: SIMULATION_SCENARIOS.filter(s => s.difficulty === 'very_complex').length,
      switching: SIMULATION_SCENARIOS.filter(s => getScenarioCategory(s.id) === 'switching').length,
      routing: SIMULATION_SCENARIOS.filter(s => getScenarioCategory(s.id) === 'routing').length,
      services_security: SIMULATION_SCENARIOS.filter(s => getScenarioCategory(s.id) === 'services_security').length,
    };
  }, []);

  // Filtered scenarios
  const filteredScenarios = useMemo(() => {
    return SIMULATION_SCENARIOS.filter(sc => {
      // Difficulty match
      if (difficultyFilter !== 'all' && sc.difficulty !== difficultyFilter) {
        return false;
      }
      // Category match
      if (categoryFilter !== 'all' && getScenarioCategory(sc.id) !== categoryFilter) {
        return false;
      }
      // Search match
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesTitleAr = sc.titleAr.toLowerCase().includes(q);
        const matchesTitleEn = (sc.titleEn || '').toLowerCase().includes(q);
        const matchesPacket = (sc.packetType || '').toLowerCase().includes(q);
        const matchesId = sc.id.toLowerCase().includes(q);
        if (!matchesTitleAr && !matchesTitleEn && !matchesPacket && !matchesId) {
          return false;
        }
      }
      return true;
    });
  }, [difficultyFilter, categoryFilter, searchQuery]);

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
          if (!exists && entry.key1 && entry.key2) {
            return [{ vlan: 1, macAddress: entry.key1, type: 'DYNAMIC', port: entry.key2, ageSeconds: 0 }, ...prev];
          }
          return prev;
        });
      } else if (tableName === 'ARP Cache') {
        setArpCache(prev => {
          const exists = prev.some(e => e.ipAddress === entry.key1);
          if (!exists && entry.key1 && entry.key2) {
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
    if (isAutoSyncTopology) {
      const topo = getTopologyForScenario(id);
      setSelectedTopologyId(topo.id);
    }
  };

  const handleTopologyChange = (topoId: string) => {
    setSelectedTopologyId(topoId);
    const targetTopo = NETWORK_TOPOLOGIES.find(t => t.id === topoId);
    if (targetTopo) {
      if (!targetTopo.supportedScenarioIds.includes(selectedScenarioId)) {
        setSelectedScenarioId(targetTopo.defaultScenarioId);
        setCurrentStepIndex(0);
        setIsPlaying(false);
      }
    }
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

  // Generate dynamic Cisco CLI command for the current step
  const getCiscoCliSnippet = () => {
    if (!currentStep) return null;
    const nodeId = currentStep.activeNodeId;
    if (nodeId.includes('switch')) {
      if (currentStep.layer === 'L2') {
        return `Switch-1# show mac address-table dynamic\n          Mac Address Table\n-------------------------------------------\nVlan    Mac Address       Type        Ports\n----    -----------       --------    -----\n   1    ${currentStep.headers.l2.srcMac}    DYNAMIC     Fa0/1\nTotal Mac Addresses for this criterion: 1`;
      }
      return `Switch-1# show interfaces status\nPort      Name               Status       Vlan       Duplex  Speed Type\nFa0/1     connected to HostA connected    1          a-full  a-100 10/100BaseTX\nGi0/1     Trunk to Router-1  connected    trunk      a-full a-1000 1000BaseTX`;
    }
    if (nodeId.includes('router')) {
      if (currentStep.highlightEvent === 'ttl_decrement') {
        return `Router-1# debug ip packet detail\nIP: s=${currentStep.headers.l3.srcIp} (Gi0/0), d=${currentStep.headers.l3.destIp}, len 60, routed (TTL decreased to ${currentStep.headers.l3.ttl})\nRouter-1# show ip route ${currentStep.headers.l3.destIp}\nRouting entry for ${currentStep.headers.l3.destIp}/32\n  Known via "connected", distance 0, metric 0\n  Routing Descriptor Blocks:\n  * directly connected, via Serial0/1`;
      }
      return `Router-1# show ip route\nGateway of last resort is not set\n      10.0.0.0/24 is subnetted, 1 subnets\nO        10.0.0.0/24 [110/2] via 203.0.113.2, 00:14:22, Serial0/1\nC     192.168.1.0/24 is directly connected, GigabitEthernet0/0\nC     203.0.113.0/30 is directly connected, Serial0/1`;
    }
    return `Host-A> ping ${currentStep.headers.l3.destIp}\nPinging ${currentStep.headers.l3.destIp} with 32 bytes of data:\nReply from ${currentStep.headers.l3.destIp}: bytes=32 time=12ms TTL=${currentStep.headers.l3.ttl}\nHost-A> arp -a\n  Internet Address      Physical Address      Type\n  192.168.1.1           ${currentStep.headers.l2.destMac}     dynamic`;
  };

  return (
    <div className={`space-y-4 font-sans ${isEn ? 'text-left dir-ltr' : 'text-right dir-rtl'}`}>
      {/* Scenario Control Hub Card */}
      <div className="bg-slate-900/95 rounded-2xl border border-slate-800 p-4 shadow-xl space-y-3.5">
        {/* Top Header & Quick Actions */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Zap className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm sm:text-base font-bold text-slate-100">
                  {isEn ? 'Interactive Packet Lab' : 'معمل المحاكاة الشبكي الحي (Interactive Packet Lab)'}
                </h2>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-800">
                  {isEn ? `${counts.all} Enterprise Scenarios` : `${counts.all} سيناريوهات معتمدة`}
                </span>
              </div>
              <p className="text-xs text-slate-400 hidden sm:block">
                {isEn 
                  ? 'Select any scenario to inspect frame (L2) and packet (L3) dynamics and real-time CAM / Routing table convergence'
                  : 'اختر أي سيناريو لمشاهدة حركة الإطارات (L2) والحزم (L3) وتفاعل جداول الـ CAM والـ Routing لحظياً'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Live Tables Modal Trigger */}
            <button
              onClick={() => setIsTablesModalOpen(true)}
              className="px-3 py-1.5 rounded-xl bg-emerald-950/70 hover:bg-emerald-900/80 border border-emerald-500/40 text-emerald-300 text-xs font-bold flex items-center gap-1.5 transition-all shadow-md"
            >
              <Table className="w-3.5 h-3.5" />
              <span>{isEn ? 'Live Memory Tables (CAM / Route / ARP)' : 'جداول الذاكرة الحية (CAM / Route / ARP)'}</span>
            </button>

            {/* Toggle Expand/Collapse Selector */}
            <button
              onClick={() => setIsSelectorExpanded(!isSelectorExpanded)}
              className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors"
              title={isSelectorExpanded ? (isEn ? 'Collapse scenarios' : 'طي قائمة السيناريوهات') : (isEn ? 'Expand scenarios' : 'توسيع قائمة السيناريوهات')}
            >
              {isSelectorExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Filter Controls Bar */}
        <div className="flex flex-wrap items-center justify-between gap-2.5">
          {/* Search Box */}
          <div className="relative flex-1 min-w-[220px] max-w-md">
            <Search className={`absolute ${isEn ? 'left-3' : 'right-3'} top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none`} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={isEn ? 'Search by name or protocol (ARP, OSPF, BGP, STP, VLAN, NAT...)' : 'ابحث بالاسم أو البروتوكول (ARP, OSPF, BGP, STP, VLAN, NAT...)'}
              className={`w-full ${isEn ? 'pl-9 pr-3' : 'pl-3 pr-9'} py-1.5 rounded-xl bg-slate-950 border border-slate-800 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 text-xs text-slate-100 placeholder-slate-500 outline-none transition-all`}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className={`absolute ${isEn ? 'right-2.5' : 'left-2.5'} top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 text-xs`}
              >
                ✕
              </button>
            )}
          </div>

          {/* Category Tabs */}
          <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 overflow-x-auto max-w-full">
            <button
              onClick={() => setCategoryFilter('all')}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
                categoryFilter === 'all'
                  ? 'bg-slate-800 text-slate-100 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {isEn ? `All (${counts.all})` : `الكل (${counts.all})`}
            </button>
            <button
              onClick={() => setCategoryFilter('switching')}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
                categoryFilter === 'switching'
                  ? 'bg-emerald-900/70 text-emerald-200 border border-emerald-600/40 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {isEn ? `Switching & LAN (${counts.switching})` : `التبديل والـ LAN (${counts.switching})`}
            </button>
            <button
              onClick={() => setCategoryFilter('routing')}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
                categoryFilter === 'routing'
                  ? 'bg-indigo-900/70 text-indigo-200 border border-indigo-600/40 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {isEn ? `Routing & WAN (${counts.routing})` : `التوجيه والـ WAN (${counts.routing})`}
            </button>
            <button
              onClick={() => setCategoryFilter('services_security')}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
                categoryFilter === 'services_security'
                  ? 'bg-purple-900/70 text-purple-200 border border-purple-600/40 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {isEn ? `Security & Services (${counts.services_security})` : `الأمان والخدمات CCIE (${counts.services_security})`}
            </button>
          </div>

          {/* Difficulty Filter Pills */}
          <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
            <button
              onClick={() => setDifficultyFilter('all')}
              className={`px-2 py-0.5 rounded-lg text-[11px] font-bold transition-colors ${
                difficultyFilter === 'all'
                  ? 'bg-slate-700 text-white'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {isEn ? 'All' : 'الكل'}
            </button>
            <button
              onClick={() => setDifficultyFilter('simple')}
              className={`px-2 py-0.5 rounded-lg text-[11px] font-bold transition-colors ${
                difficultyFilter === 'simple'
                  ? 'bg-emerald-600 text-white'
                  : 'text-emerald-400 hover:text-emerald-300'
              }`}
            >
              {isEn ? `Fundamental (${counts.simple})` : `بسيط (${counts.simple})`}
            </button>
            <button
              onClick={() => setDifficultyFilter('complex')}
              className={`px-2 py-0.5 rounded-lg text-[11px] font-bold transition-colors ${
                difficultyFilter === 'complex'
                  ? 'bg-amber-600 text-white'
                  : 'text-amber-400 hover:text-amber-300'
              }`}
            >
              {isEn ? `Intermediate (${counts.complex})` : `متوسط (${counts.complex})`}
            </button>
            <button
              onClick={() => setDifficultyFilter('very_complex')}
              className={`px-2 py-0.5 rounded-lg text-[11px] font-bold transition-colors ${
                difficultyFilter === 'very_complex'
                  ? 'bg-rose-600 text-white'
                  : 'text-rose-400 hover:text-rose-300'
              }`}
            >
              {isEn ? `CCIE Advanced (${counts.very_complex})` : `متقدم CCIE (${counts.very_complex})`}
            </button>
          </div>
        </div>

        {/* Scenario Cards Grid (Collapsible) */}
        {isSelectorExpanded && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2.5 max-h-[340px] overflow-y-auto pr-1">
            {filteredScenarios.length === 0 ? (
              <div className="col-span-full py-6 text-center text-xs text-slate-400 bg-slate-950/60 rounded-xl border border-slate-800">
                {isEn ? 'No scenarios found matching your search query or selected filter.' : 'لم يتم العثور على أي سيناريو يطابق كلمة البحث أو التصنيف المحدد.'}
              </div>
            ) : (
              filteredScenarios.map(sc => {
                const isSelected = selectedScenarioId === sc.id;
                const diffBadgeClass = 
                  sc.difficulty === 'simple'
                    ? 'bg-emerald-950/80 text-emerald-400 border-emerald-800'
                    : sc.difficulty === 'complex'
                    ? 'bg-amber-950/80 text-amber-400 border-amber-800'
                    : 'bg-rose-950/80 text-rose-400 border-rose-800';

                return (
                  <button
                    key={sc.id}
                    onClick={() => handleScenarioChange(sc.id)}
                    className={`p-3 rounded-xl ${isEn ? 'text-left' : 'text-right'} transition-all border flex flex-col justify-between gap-2 relative ${
                      isSelected
                        ? 'bg-indigo-950/90 border-indigo-400 ring-2 ring-indigo-500/40 shadow-lg shadow-indigo-950/50'
                        : 'bg-slate-950/70 border-slate-800 hover:border-slate-700 hover:bg-slate-900/80 text-slate-300'
                    }`}
                  >
                    {isSelected && (
                      <div className={`absolute top-2 ${isEn ? 'right-2' : 'left-2'} w-2 h-2 rounded-full bg-amber-400 animate-pulse`} />
                    )}

                    {/* Top Row: Full Title & Difficulty */}
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-bold text-xs leading-snug text-slate-100 flex-1">
                        {isEn && sc.titleEn ? sc.titleEn : sc.titleAr}
                      </h3>
                      <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold shrink-0 border ${diffBadgeClass}`}>
                        {sc.difficulty === 'simple' ? (isEn ? 'Fundamental' : 'بسيط') : sc.difficulty === 'complex' ? (isEn ? 'Intermediate' : 'متوسط') : (isEn ? 'CCIE' : 'CCIE متقدم')}
                      </span>
                    </div>

                    {/* Bottom Row: Protocol & Step Count */}
                    <div className="flex items-center justify-between text-[11px] pt-1.5 border-t border-slate-800/80">
                      <span className="font-mono text-cyan-400 font-bold bg-cyan-950/60 px-2 py-0.5 rounded-md border border-cyan-800/60 text-[10px]">
                        {sc.packetType || 'Data'}
                      </span>
                      <span className="text-slate-400 text-[10px]">
                        {isEn ? `${sc.steps.length} steps` : `${sc.steps.length} خطوات تفاعلية`}
                      </span>
                    </div>
                  </button>
                );
              })
            )}
          </div>
        )}
      </div>

      {/* Topology Model Selection & Network Blueprint Hub */}
      <div className="bg-slate-900/95 rounded-2xl border border-slate-800 p-3.5 shadow-xl space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800/80 pb-2.5">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
              <Boxes className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs sm:text-sm font-bold text-slate-100 font-sans">
                  {isEn ? 'Simulator Topology Models (Physical & Logical Layouts)' : 'مخططات وطوبولوجيا المحاكي (Simulator Topology Models)'}
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                  {isEn ? `${NETWORK_TOPOLOGIES.length} Topologies` : `${NETWORK_TOPOLOGIES.length} مخططات هندسية مخصصة`}
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block">
                {isEn 
                  ? 'Each scenario runs on a dedicated topology matching its physical and logical architecture'
                  : 'كل سيناريو يعمل على مخطط شبكي مستقل ومناسب لاحتمالاته الفيزيائية والمنطقية'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsAutoSyncTopology(!isAutoSyncTopology)}
              className={`px-2.5 py-1 rounded-xl text-[11px] font-mono border flex items-center gap-1.5 transition-all ${
                isAutoSyncTopology
                  ? 'bg-cyan-950/80 text-cyan-300 border-cyan-500/40 shadow-sm'
                  : 'bg-slate-800 text-slate-400 border-slate-700'
              }`}
              title={isEn ? 'Auto-sync topology with active scenario' : 'مزامنة المخطط تلقائياً مع السيناريو المختار'}
            >
              <ArrowRightLeft className="w-3 h-3" />
              <span>{isEn ? `Scenario Sync: ${isAutoSyncTopology ? 'Automatic' : 'Manual'}` : `المزامنة مع السيناريو: ${isAutoSyncTopology ? 'مفعلة تلقائياً' : 'يدوية'}`}</span>
            </button>
          </div>
        </div>

        {/* Horizontal Topology Model Selector Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1.5 scrollbar-thin scrollbar-thumb-slate-700">
          {NETWORK_TOPOLOGIES.map((topo) => {
            const isSelected = activeTopology.id === topo.id;
            return (
              <button
                key={topo.id}
                onClick={() => handleTopologyChange(topo.id)}
                className={`flex items-center gap-2 px-3 py-2 rounded-xl ${isEn ? 'text-left' : 'text-right'} transition-all whitespace-nowrap border shrink-0 ${
                  isSelected
                    ? 'bg-gradient-to-r from-indigo-950/90 to-slate-900 border-amber-400 text-white shadow-lg shadow-indigo-950/60 ring-1 ring-amber-400/40'
                    : 'bg-slate-950/80 border-slate-800/90 hover:border-slate-700 text-slate-300 hover:text-white'
                }`}
              >
                <div className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 ${
                  isSelected ? 'bg-amber-400 text-slate-950 font-bold' : 'bg-slate-800 text-slate-400'
                }`}>
                  {topo.iconName === 'Globe' && <Globe className="w-3.5 h-3.5" />}
                  {topo.iconName === 'Network' && <Network className="w-3.5 h-3.5" />}
                  {topo.iconName === 'ShieldCheck' && <ShieldCheck className="w-3.5 h-3.5" />}
                  {topo.iconName === 'Layers' && <Layers className="w-3.5 h-3.5" />}
                  {topo.iconName === 'Shield' && <Shield className="w-3.5 h-3.5" />}
                  {topo.iconName === 'Cpu' && <Cpu className="w-3.5 h-3.5" />}
                  {topo.iconName === 'Zap' && <Zap className="w-3.5 h-3.5" />}
                  {topo.iconName === 'Server' && <Server className="w-3.5 h-3.5" />}
                  {topo.iconName === 'Radio' && <Radio className="w-3.5 h-3.5" />}
                </div>

                <div className={`flex flex-col ${isEn ? 'text-left' : 'text-right'}`}>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold leading-tight">
                      {isEn && topo.titleEn ? topo.titleEn.split('(')[0] : topo.titleAr.split('(')[0]}
                    </span>
                    {isSelected && (
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping" />
                    )}
                  </div>
                  <span className="text-[9.5px] font-mono text-slate-400">
                    {isEn ? `${topo.nodes.length} Nodes | ${topo.links.length} Links` : `${topo.nodes.length} أجهزة | ${topo.links.length} وصلات`}
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Active Topology Blueprint Overview Strip */}
        <div className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800 flex flex-wrap items-center justify-between gap-2.5 text-xs">
          <div className="flex items-center gap-2">
            <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-indigo-950 text-indigo-300 border border-indigo-800/80">
              {isEn && activeTopology.badgeEn ? activeTopology.badgeEn : activeTopology.badgeAr}
            </span>
            <span className="font-bold text-slate-200">
              {isEn && activeTopology.titleEn ? activeTopology.titleEn : activeTopology.titleAr}
            </span>
            <span className="text-slate-400 text-[11px] hidden lg:inline">
              — {isEn && activeTopology.descriptionEn ? activeTopology.descriptionEn : activeTopology.descriptionAr}
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-slate-400 text-[11px]">{isEn ? 'Scenarios for this topology:' : 'السيناريوهات التابعة لهذا المخطط:'}</span>
            <div className="flex items-center gap-1 flex-wrap">
              {activeTopology.supportedScenarioIds.map(scId => {
                const sc = SIMULATION_SCENARIOS.find(s => s.id === scId);
                const isActiveSc = selectedScenarioId === scId;
                return (
                  <button
                    key={scId}
                    onClick={() => handleScenarioChange(scId)}
                    className={`px-2 py-0.5 rounded-lg text-[10px] font-mono border transition-all ${
                      isActiveSc
                        ? 'bg-amber-400 text-slate-950 font-bold border-amber-300 shadow-sm'
                        : 'bg-slate-900 text-slate-300 border-slate-700 hover:border-slate-600'
                    }`}
                  >
                    {sc ? sc.packetType || (isEn && sc.titleEn ? sc.titleEn.slice(0, 14) : sc.titleAr.slice(0, 14)) : scId}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Primary Network Topology Canvas */}
      <NetworkCanvas
        nodes={activeTopology.nodes}
        links={activeTopology.links}
        zones={activeTopology.zones}
        activeTopology={activeTopology}
        currentStep={currentStep}
        activeScenarioTitle={isEn && activeScenario.titleEn ? activeScenario.titleEn : activeScenario.titleAr}
        onNodeClick={(node) => {
          setSelectedNode(node);
          setIsTablesModalOpen(true);
        }}
        selectedNodeId={selectedNode?.id}
        isPlaying={isPlaying}
        lang={lang}
      />

      {/* Simulation Timeline Controls Bar */}
      <div className="p-3.5 bg-slate-900/95 rounded-2xl border border-slate-800 shadow-xl flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Playback Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleReset}
            title={isEn ? 'Reset to beginning' : 'إعادة من البداية'}
            className="p-2 rounded-xl bg-slate-950 hover:bg-slate-800 text-slate-300 border border-slate-800 transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          <button
            onClick={handleStepBackward}
            disabled={currentStepIndex === 0}
            title={isEn ? 'Previous step' : 'الخطوة السابقة'}
            className="p-2 rounded-xl bg-slate-950 hover:bg-slate-800 disabled:opacity-30 text-slate-300 border border-slate-800 transition-colors"
          >
            <SkipBack className="w-4 h-4" />
          </button>

          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="px-5 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-extrabold text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-amber-500/20 transition-all"
          >
            {isPlaying ? (
              <>
                <Pause className="w-4 h-4" />
                <span>{isEn ? 'Pause' : 'إيقاف مؤقت'}</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-slate-950" />
                <span>{isEn ? 'Play Simulation' : 'تشغيل المحاكاة'}</span>
              </>
            )}
          </button>

          <button
            onClick={handleStepForward}
            disabled={currentStepIndex === activeScenario.steps.length - 1}
            title={isEn ? 'Next step' : 'الخطوة التالية'}
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
              className={`h-8 min-w-[32px] px-2.5 rounded-xl text-xs font-bold font-mono transition-all flex items-center justify-center gap-1.5 ${
                currentStepIndex === idx
                  ? 'bg-amber-400 text-slate-950 shadow-md shadow-amber-400/25 font-black ring-2 ring-amber-400/40'
                  : currentStepIndex > idx
                    ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-600/40'
                    : 'bg-slate-950 text-slate-500 border border-slate-800 hover:text-slate-300'
              }`}
              title={isEn && step.stageTitleEn ? step.stageTitleEn : step.stageTitleAr}
            >
              <span>{idx + 1}</span>
              {currentStepIndex === idx && (
                <span className="text-[10px] hidden sm:inline-block font-sans font-normal">
                  ({step.layer})
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Speed Controls */}
        <div className="flex items-center gap-1.5 text-xs text-slate-400">
          <span>{isEn ? 'Speed:' : 'سرعة المحاكاة:'}</span>
          {[0.5, 1, 2].map((s) => (
            <button
              key={s}
              onClick={() => setPlaybackSpeed(s)}
              className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold transition-all ${
                playbackSpeed === s
                  ? 'bg-slate-800 text-amber-300 border border-slate-700 shadow-sm'
                  : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              {s}x
            </button>
          ))}
        </div>
      </div>

      {/* Cisco Live Terminal Output Window */}
      {currentStep && (
        <div className="bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden shadow-xl dir-ltr text-left">
          <div className="bg-slate-900/90 px-4 py-2 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Terminal className="w-4 h-4 text-emerald-400" />
              <span className="text-xs font-mono text-slate-200 font-bold">
                Cisco IOS Execution Terminal — [Node: {currentStep.activeNodeId.toUpperCase()}]
              </span>
            </div>
            <span className="text-[10px] font-mono text-slate-400">
              Interactive Packet Dissection
            </span>
          </div>
          <pre className="p-3.5 text-xs font-mono text-emerald-400 bg-slate-950 overflow-x-auto whitespace-pre leading-relaxed selection:bg-emerald-900">
            {getCiscoCliSnippet()}
          </pre>
        </div>
      )}

      {/* Packet Inspector Card */}
      <PacketInspector currentStep={currentStep} lang={lang} />

      {/* Live Memory Tables Modal */}
      <LiveTablesModal
        isOpen={isTablesModalOpen}
        onClose={() => setIsTablesModalOpen(false)}
        selectedNode={selectedNode}
        macTable={macTable}
        routingTable={routingTable}
        arpCache={arpCache}
        lang={lang}
      />
    </div>
  );
};
