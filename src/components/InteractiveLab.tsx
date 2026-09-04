import React, { useState, useEffect, useMemo } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  SkipForward,
  SkipBack,
  Zap,
  Layers,
  Table,
  Radio,
  Search,
  Terminal,
  Server,
  Network,
  Cpu,
  ShieldCheck,
  Globe,
  Shield,
  ArrowRightLeft,
  Activity,
  Navigation,
  Compass,
  Boxes,
} from 'lucide-react';
import { NetworkCanvas } from './NetworkCanvas';
import { PacketInspector } from './PacketInspector';
import { LiveTablesModal } from './LiveTablesModal';
import { SIMULATION_SCENARIOS, INITIAL_MAC_TABLE_SWITCH1, INITIAL_ROUTING_TABLE_ROUTER1, INITIAL_ARP_CACHE_HOST_A } from '../data/networkData';
import { NETWORK_TOPOLOGIES, getTopologyForScenario } from '../data/networkTopologies';
import { NetworkNode, MacTableEntry, RoutingTableEntry, ArpTableEntry, Language, CurriculumTrack } from '../types';

interface InteractiveLabProps {
  initialScenarioId?: string;
  onOpenLiveTables?: () => void;
  lang?: Language;
  userTrack?: CurriculumTrack;
}

const TRACK_LABEL: Record<CurriculumTrack, { ar: string; en: string; exam: string }> = {
  ccna: { ar: 'CCNA', en: 'CCNA', exam: '200-301' },
  ccnp: { ar: 'CCNP', en: 'CCNP', exam: 'ENCOR/ENARSI' },
  ccie: { ar: 'CCIE', en: 'CCIE', exam: 'EI' },
};

/** Primary exam track for each lab scenario */
const SCENARIO_TRACK: Record<string, CurriculumTrack> = {
  'same-lan-switching': 'ccna',
  'arp-broadcast-resolution': 'ccna',
  'default-gateway-ping': 'ccna',
  'inter-vlan-routing': 'ccna',
  'stp-loop-prevention': 'ccna',
  'lacp-etherchannel-bundle': 'ccna',
  'ipv6-slaac-ndp-discovery': 'ccna',
  'cross-network-journey': 'ccna',
  'hsrp-gateway-failover': 'ccnp',
  'eigrp-dual-convergence': 'ccnp',
  'rstp-fast-convergence': 'ccnp',
  'enterprise-nat-pat': 'ccnp',
  'wan-failover-redundancy': 'ccnp',
  'bgp-ebgp-peering': 'ccie',
  'ipsec-vpn-tunnel': 'ccie',
  'mpls-l3vpn-label-switch': 'ccie',
};

const CATEGORIES = [
  { id: 'all', labelAr: 'الكل', labelEn: 'All', icon: Compass },
  { id: 'switching', labelAr: 'L2', labelEn: 'L2', icon: Activity },
  { id: 'routing', labelAr: 'L3', labelEn: 'L3', icon: Navigation },
  { id: 'services_security', labelAr: 'أمن/خدمات', labelEn: 'Sec/Svc', icon: Shield },
] as const;

type CategoryId = (typeof CATEGORIES)[number]['id'];
type DifficultyFilter = 'all' | 'simple' | 'intermediate' | 'complex' | 'advanced';

const getScenarioTrack = (id: string): CurriculumTrack => SCENARIO_TRACK[id] || 'ccna';

const getScenarioCategory = (scId: string): Exclude<CategoryId, 'all'> => {
  if (['same-lan-switching', 'arp-broadcast-resolution', 'inter-vlan-routing', 'stp-loop-prevention', 'rstp-fast-convergence', 'lacp-etherchannel-bundle'].includes(scId)) {
    return 'switching';
  }
  if (['cross-network-journey', 'default-gateway-ping', 'wan-failover-redundancy', 'eigrp-dual-convergence', 'bgp-ebgp-peering'].includes(scId)) {
    return 'routing';
  }
  return 'services_security';
};

const matchesDifficulty = (diff: string | undefined, filter: DifficultyFilter) => {
  if (filter === 'all') return true;
  if (filter === 'simple') return diff === 'simple';
  if (filter === 'intermediate') return diff === 'intermediate' || diff === 'complex';
  if (filter === 'complex') return diff === 'complex';
  if (filter === 'advanced') return diff === 'very_complex' || diff === 'expert';
  return true;
};

const difficultyLabel = (diff: string | undefined, isEn: boolean) => {
  switch (diff) {
    case 'simple':
      return isEn ? 'Beginner' : 'مبتدئ';
    case 'intermediate':
      return isEn ? 'Intermediate' : 'متوسط';
    case 'complex':
      return isEn ? 'Complex' : 'متوسط+';
    case 'very_complex':
      return isEn ? 'Advanced' : 'متقدم';
    case 'expert':
      return isEn ? 'Expert' : 'خبير';
    default:
      return isEn ? 'Lab' : 'معمل';
  }
};

const difficultyBadgeClass = (diff: string | undefined) => {
  if (diff === 'simple') return 'text-emerald-300';
  if (diff === 'intermediate' || diff === 'complex') return 'text-amber-300';
  return 'text-rose-300';
};

export const InteractiveLab: React.FC<InteractiveLabProps> = ({
  initialScenarioId,
  lang = 'ar',
  userTrack = 'ccna',
}) => {
  const isEn = lang === 'en';
  const trackInfo = TRACK_LABEL[userTrack];

  const trackScenarios = useMemo(
    () => SIMULATION_SCENARIOS.filter(s => getScenarioTrack(s.id) === userTrack),
    [userTrack]
  );

  const [selectedScenarioId, setSelectedScenarioId] = useState(() => {
    const preferred = initialScenarioId || 'cross-network-journey';
    if (trackScenarios.some(s => s.id === preferred)) return preferred;
    return trackScenarios[0]?.id || preferred;
  });
  const [selectedTopologyId, setSelectedTopologyId] = useState<string>(() => {
    return getTopologyForScenario(initialScenarioId || 'cross-network-journey').id;
  });
  const [isAutoSyncTopology, setIsAutoSyncTopology] = useState(true);
  const [difficultyFilter, setDifficultyFilter] = useState<DifficultyFilter>('all');
  const [categoryFilter, setCategoryFilter] = useState<CategoryId>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [selectedNode, setSelectedNode] = useState<NetworkNode | null>(null);
  const [isTablesModalOpen, setIsTablesModalOpen] = useState(false);

  const [macTable, setMacTable] = useState<MacTableEntry[]>(INITIAL_MAC_TABLE_SWITCH1);
  const [routingTable, setRoutingTable] = useState<RoutingTableEntry[]>(INITIAL_ROUTING_TABLE_ROUTER1);
  const [arpCache, setArpCache] = useState<ArpTableEntry[]>(INITIAL_ARP_CACHE_HOST_A);

  // Reset selection when track changes
  useEffect(() => {
    if (!trackScenarios.some(s => s.id === selectedScenarioId)) {
      const next = trackScenarios[0]?.id;
      if (next) {
        setSelectedScenarioId(next);
        setCurrentStepIndex(0);
        setIsPlaying(false);
        if (isAutoSyncTopology) {
          setSelectedTopologyId(getTopologyForScenario(next).id);
        }
      }
    }
  }, [userTrack, trackScenarios]);

  useEffect(() => {
    if (initialScenarioId && initialScenarioId !== selectedScenarioId) {
      if (trackScenarios.some(s => s.id === initialScenarioId) || getScenarioTrack(initialScenarioId) === userTrack) {
        setSelectedScenarioId(initialScenarioId);
        setCurrentStepIndex(0);
        setIsPlaying(false);
        if (isAutoSyncTopology) {
          setSelectedTopologyId(getTopologyForScenario(initialScenarioId).id);
        }
      }
    }
  }, [initialScenarioId, isAutoSyncTopology]);

  const activeTopology = useMemo(
    () => NETWORK_TOPOLOGIES.find(t => t.id === selectedTopologyId) || NETWORK_TOPOLOGIES[0],
    [selectedTopologyId]
  );

  const activeScenario = SIMULATION_SCENARIOS.find(s => s.id === selectedScenarioId) || trackScenarios[0] || SIMULATION_SCENARIOS[0];
  const currentStep = activeScenario.steps[currentStepIndex];

  const filteredScenarios = useMemo(() => {
    return trackScenarios.filter(sc => {
      if (!matchesDifficulty(sc.difficulty, difficultyFilter)) return false;
      if (categoryFilter !== 'all' && getScenarioCategory(sc.id) !== categoryFilter) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const ok =
          sc.titleAr.toLowerCase().includes(q) ||
          (sc.titleEn || '').toLowerCase().includes(q) ||
          (sc.packetType || '').toLowerCase().includes(q) ||
          sc.id.toLowerCase().includes(q);
        if (!ok) return false;
      }
      return true;
    });
  }, [trackScenarios, difficultyFilter, categoryFilter, searchQuery]);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null;
    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentStepIndex(prev => {
          if (prev < activeScenario.steps.length - 1) return prev + 1;
          setIsPlaying(false);
          return prev;
        });
      }, 3500 / playbackSpeed);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPlaying, activeScenario, playbackSpeed]);

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
      setSelectedTopologyId(getTopologyForScenario(id).id);
    }
  };

  const handleTopologyChange = (topoId: string) => {
    setSelectedTopologyId(topoId);
    const targetTopo = NETWORK_TOPOLOGIES.find(t => t.id === topoId);
    if (targetTopo && !targetTopo.supportedScenarioIds.includes(selectedScenarioId)) {
      const inTrack = targetTopo.supportedScenarioIds.find(id => getScenarioTrack(id) === userTrack);
      const next = inTrack || targetTopo.defaultScenarioId;
      setSelectedScenarioId(next);
      setCurrentStepIndex(0);
      setIsPlaying(false);
    }
  };

  const handleStepForward = () => {
    if (currentStepIndex < activeScenario.steps.length - 1) setCurrentStepIndex(prev => prev + 1);
  };

  const handleStepBackward = () => {
    if (currentStepIndex > 0) setCurrentStepIndex(prev => prev - 1);
  };

  const handleReset = () => {
    setCurrentStepIndex(0);
    setIsPlaying(false);
  };

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

  const topologyIcons: Record<string, React.ReactNode> = {
    Globe: <Globe className="w-3.5 h-3.5" />,
    Network: <Network className="w-3.5 h-3.5" />,
    ShieldCheck: <ShieldCheck className="w-3.5 h-3.5" />,
    Layers: <Layers className="w-3.5 h-3.5" />,
    Shield: <Shield className="w-3.5 h-3.5" />,
    Cpu: <Cpu className="w-3.5 h-3.5" />,
    Zap: <Zap className="w-3.5 h-3.5" />,
    Server: <Server className="w-3.5 h-3.5" />,
    Radio: <Radio className="w-3.5 h-3.5" />,
  };

  const trackTopologies = useMemo(() => {
    return NETWORK_TOPOLOGIES.filter(t =>
      t.supportedScenarioIds.some(id => getScenarioTrack(id) === userTrack)
    );
  }, [userTrack]);

  return (
    <div className={`space-y-4 font-sans ${isEn ? 'text-left dir-ltr' : 'text-right dir-rtl'}`}>
      {/* Compact page header — same pattern as Real-Life Stories */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-0.5">
        <div className="min-w-0 space-y-1">
          <div className="flex flex-wrap items-center gap-2">
            <Zap className="w-4 h-4 text-amber-400 shrink-0" />
            <h2 className="text-base sm:text-lg font-black text-white">
              {isEn ? 'Live Packet Lab' : 'المعمل الحي'}
            </h2>
            <span className="px-2 py-0.5 rounded-md bg-amber-500/15 text-amber-300 border border-amber-500/25 text-[10px] font-bold">
              {trackInfo.en} · {trackScenarios.length} {isEn ? 'labs' : 'معامل'}
            </span>
          </div>
          <p className="text-[11px] text-slate-500">
            {isEn
              ? `Only ${trackInfo.en} (${trackInfo.exam}) packet labs for your learning track.`
              : `معامل مسار ${trackInfo.ar} فقط (${trackInfo.exam}) حسب مستواك الدراسي.`}
          </p>
        </div>

        <button
          onClick={() => setIsTablesModalOpen(true)}
          className="px-3 py-1.5 rounded-lg bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-300 border border-emerald-500/25 text-[11px] font-bold flex items-center gap-1.5 transition-all cursor-pointer shrink-0"
        >
          <Table className="w-3.5 h-3.5" />
          <span>{isEn ? 'Live Tables' : 'جداول الذاكرة'}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
        {/* Sidebar: search + filters + scenario list */}
        <aside className="lg:col-span-4 xl:col-span-3">
          <div className="p-3 rounded-2xl bg-white/[0.02] border border-white/[0.06] space-y-3">
            <div className="relative">
              <Search className={`w-3.5 h-3.5 absolute top-1/2 -translate-y-1/2 text-slate-500 ${isEn ? 'left-3' : 'right-3'}`} />
              <input
                type="text"
                placeholder={isEn ? 'Search in track...' : 'بحث ضمن المسار...'}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`w-full py-2 rounded-xl bg-white/[0.03] border border-white/[0.06] text-xs text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-amber-500/40 ${
                  isEn ? 'pl-9 pr-3 text-left' : 'pr-9 pl-3 text-right'
                }`}
              />
            </div>

            <div className="flex flex-wrap gap-1">
              {CATEGORIES.map(cat => {
                const Icon = cat.icon;
                const count =
                  cat.id === 'all'
                    ? trackScenarios.length
                    : trackScenarios.filter(s => getScenarioCategory(s.id) === cat.id).length;
                if (cat.id !== 'all' && count === 0) return null;
                const active = categoryFilter === cat.id;
                return (
                  <button
                    key={cat.id}
                    onClick={() => setCategoryFilter(cat.id)}
                    className={`px-2 py-1 rounded-lg text-[10px] font-bold flex items-center gap-1 border transition-all cursor-pointer ${
                      active
                        ? 'bg-amber-500 text-black border-amber-400'
                        : 'bg-white/[0.03] text-slate-400 border-white/[0.06] hover:text-slate-200'
                    }`}
                  >
                    <Icon className="w-3 h-3" />
                    <span>{isEn ? cat.labelEn : cat.labelAr}</span>
                    <span className="opacity-70">{count}</span>
                  </button>
                );
              })}
            </div>

            <div className="flex flex-wrap gap-1">
              {([
                { id: 'all', ar: 'الكل', en: 'All' },
                { id: 'simple', ar: 'مبتدئ', en: 'Beginner' },
                { id: 'intermediate', ar: 'متوسط', en: 'Mid' },
                { id: 'advanced', ar: 'متقدم', en: 'Advanced' },
              ] as const).map(d => {
                const active = difficultyFilter === d.id;
                return (
                  <button
                    key={d.id}
                    onClick={() => setDifficultyFilter(d.id)}
                    className={`px-2 py-0.5 rounded-md text-[10px] font-bold border transition-all cursor-pointer ${
                      active
                        ? 'bg-slate-700 text-white border-slate-500'
                        : 'bg-white/[0.02] text-slate-500 border-white/[0.06] hover:text-slate-300'
                    }`}
                  >
                    {isEn ? d.en : d.ar}
                  </button>
                );
              })}
            </div>

            <div className="space-y-1 max-h-[62vh] overflow-y-auto sidebar-scroll">
              {filteredScenarios.length === 0 ? (
                <div className="p-4 text-center text-xs text-slate-500">
                  {isEn ? 'No matches in this track' : 'لا نتائج في هذا المسار'}
                  <button
                    onClick={() => {
                      setCategoryFilter('all');
                      setDifficultyFilter('all');
                      setSearchQuery('');
                    }}
                    className="block mx-auto mt-2 text-amber-400 hover:underline cursor-pointer"
                  >
                    {isEn ? 'Reset' : 'إعادة الضبط'}
                  </button>
                </div>
              ) : (
                filteredScenarios.map(sc => {
                  const isSelected = selectedScenarioId === sc.id;
                  return (
                    <button
                      key={sc.id}
                      onClick={() => handleScenarioChange(sc.id)}
                      className={`w-full p-2.5 rounded-xl border text-xs transition-all cursor-pointer ${
                        isEn ? 'text-left' : 'text-right'
                      } ${
                        isSelected
                          ? 'bg-amber-500/15 border-amber-500/40 text-amber-100'
                          : 'bg-white/[0.02] border-white/[0.06] text-slate-400 hover:text-slate-200 hover:bg-white/[0.04]'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <span className={`text-[10px] font-bold ${difficultyBadgeClass(sc.difficulty)}`}>
                          {difficultyLabel(sc.difficulty, isEn)}
                        </span>
                        <span className="font-mono text-[10px] text-cyan-400/90 truncate max-w-[55%]">
                          {sc.packetType || 'Data'}
                        </span>
                      </div>
                      <div className="font-bold text-slate-100 leading-snug line-clamp-2">
                        {isEn && sc.titleEn ? sc.titleEn : sc.titleAr}
                      </div>
                      <div className="mt-1 text-[10px] text-slate-500">
                        {isEn ? `${sc.steps.length} steps` : `${sc.steps.length} خطوات`}
                      </div>
                    </button>
                  );
                })
              )}
            </div>
          </div>
        </aside>

        {/* Player column — topology-first packet workspace */}
        <div className="lg:col-span-8 xl:col-span-9 space-y-3 min-w-0">
          {/* Scenario briefing */}
          <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-3.5 space-y-2">
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div className="min-w-0 flex-1 space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-sm font-black text-white">
                    {isEn && activeScenario.titleEn ? activeScenario.titleEn : activeScenario.titleAr}
                  </span>
                  <span className="px-2 py-0.5 rounded-md bg-cyan-500/10 text-cyan-300 border border-cyan-500/25 text-[10px] font-mono font-bold">
                    {activeScenario.packetType || 'PDU'}
                  </span>
                  <span className={`text-[10px] font-bold ${difficultyBadgeClass(activeScenario.difficulty)}`}>
                    {difficultyLabel(activeScenario.difficulty, isEn)}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  {isEn
                    ? (activeScenario as { descriptionEn?: string }).descriptionEn || activeScenario.descriptionAr
                    : activeScenario.descriptionAr}
                </p>
                {activeScenario.realWorldAnalogyAr && (
                  <p className="text-[11px] text-amber-200/70 leading-relaxed border-t border-white/[0.04] pt-2">
                    <span className="font-bold text-amber-400/90">{isEn ? 'Why it matters: ' : 'لماذا يهم: '}</span>
                    {activeScenario.realWorldAnalogyAr}
                  </p>
                )}
              </div>
              <button
                onClick={() => setIsAutoSyncTopology(!isAutoSyncTopology)}
                className={`px-2.5 py-1 rounded-lg text-[10px] font-bold border flex items-center gap-1.5 transition-all cursor-pointer shrink-0 ${
                  isAutoSyncTopology
                    ? 'bg-cyan-500/15 text-cyan-300 border-cyan-500/30'
                    : 'bg-white/[0.03] text-slate-500 border-white/[0.06]'
                }`}
              >
                <ArrowRightLeft className="w-3 h-3" />
                <span>{isEn ? (isAutoSyncTopology ? 'Auto topology' : 'Manual topo') : (isAutoSyncTopology ? 'طوبولوجيا تلقائية' : 'طوبولوجيا يدوية')}</span>
              </button>
            </div>
          </div>

          {/* Topology briefing + chips */}
          <div className="rounded-2xl border border-indigo-500/20 bg-indigo-500/5 p-3 space-y-2.5">
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <Boxes className="w-3.5 h-3.5 text-indigo-300" />
                  <span className="text-xs font-bold text-indigo-100">
                    {isEn && activeTopology.titleEn ? activeTopology.titleEn : activeTopology.titleAr}
                  </span>
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-indigo-950 text-indigo-300 border border-indigo-500/30">
                    {isEn ? (activeTopology.badgeEn || 'Topology') : activeTopology.badgeAr}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  {isEn && activeTopology.descriptionEn ? activeTopology.descriptionEn : activeTopology.descriptionAr}
                </p>
              </div>
            </div>
            {activeTopology.featuresAr && activeTopology.featuresAr.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {activeTopology.featuresAr.map((f, i) => (
                  <span key={i} className="px-2 py-0.5 rounded-md text-[10px] bg-slate-950/60 text-slate-300 border border-white/[0.06]">
                    {f}
                  </span>
                ))}
              </div>
            )}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5 scrollbar-thin">
              {(trackTopologies.length ? trackTopologies : NETWORK_TOPOLOGIES).map(topo => {
                const isSelected = activeTopology.id === topo.id;
                return (
                  <button
                    key={topo.id}
                    onClick={() => handleTopologyChange(topo.id)}
                    className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-[11px] font-bold shrink-0 border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-amber-500/15 border-amber-500/40 text-amber-100'
                        : 'bg-white/[0.02] border-white/[0.06] text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <span className={`w-5 h-5 rounded-md flex items-center justify-center ${isSelected ? 'bg-amber-500 text-slate-950' : 'bg-slate-800 text-slate-400'}`}>
                      {topologyIcons[topo.iconName] || <Network className="w-3.5 h-3.5" />}
                    </span>
                    <span className="whitespace-nowrap">
                      {isEn && topo.titleEn ? topo.titleEn.split('(')[0].trim() : topo.titleAr.split('(')[0].trim()}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

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

          {/* Labeled step rail + playback */}
          <div className="p-3 rounded-2xl bg-white/[0.02] border border-white/[0.06] space-y-3">
            <div className={`flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-thin ${lang === 'ar' ? 'justify-end' : 'justify-start'}`} dir={lang === 'ar' ? 'rtl' : 'ltr'}>
              {activeScenario.steps.map((step, idx) => {
                const label = isEn
                  ? (step.stageTitleEn || step.titleEn || `Step ${idx + 1}`)
                  : (step.stageTitleAr || step.titleAr || `خطوة ${idx + 1}`);
                const short = label.replace(/^\d+[\.\):\-]\s*/, '').slice(0, 28);
                return (
                  <button
                    key={step.id ?? idx}
                    onClick={() => {
                      setCurrentStepIndex(idx);
                      setIsPlaying(false);
                    }}
                    className={`group flex items-center gap-2 px-2.5 py-1.5 rounded-xl text-xs font-bold shrink-0 border transition-all cursor-pointer ${
                      lang === 'ar' ? 'flex-row-reverse' : ''
                    } ${
                      currentStepIndex === idx
                        ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-md'
                        : currentStepIndex > idx
                          ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30'
                          : 'bg-white/[0.02] text-slate-400 border-white/[0.06] hover:text-slate-200'
                    }`}
                    title={label}
                  >
                    <span className={`w-5 h-5 rounded-lg flex items-center justify-center font-mono text-[10px] ${
                      currentStepIndex === idx ? 'bg-slate-950 text-amber-400' : 'bg-slate-800 text-slate-400'
                    }`}>
                      {idx + 1}
                    </span>
                    <span className="text-[11px] font-sans font-medium whitespace-nowrap max-w-[120px] truncate hidden sm:inline">
                      {short}
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="flex flex-row items-center justify-between gap-3" dir="ltr">
              <div className={`flex items-center gap-1 p-1 rounded-2xl bg-slate-950/60 border border-white/[0.06] ${lang === 'ar' ? 'order-1' : 'order-2'}`}>
                <button onClick={handleReset} title={isEn ? 'Reset' : 'إعادة'} className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/[0.06] cursor-pointer">
                  <RotateCcw className="w-4 h-4" />
                </button>
                <button onClick={handleStepBackward} disabled={currentStepIndex === 0} title={isEn ? 'Previous' : 'السابق'} className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/[0.06] disabled:opacity-30 cursor-pointer">
                  <SkipBack className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                >
                  {isPlaying ? (
                    <><Pause className="w-4 h-4" /><span>{isEn ? 'Pause' : 'إيقاف'}</span></>
                  ) : (
                    <><Play className="w-4 h-4 fill-current" /><span>{isEn ? 'Play' : 'تشغيل'}</span></>
                  )}
                </button>
                <button onClick={handleStepForward} disabled={currentStepIndex === activeScenario.steps.length - 1} title={isEn ? 'Next' : 'التالي'} className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/[0.06] disabled:opacity-30 cursor-pointer">
                  <SkipForward className="w-4 h-4" />
                </button>
              </div>
              <div className={`flex items-center gap-1 text-[10px] text-slate-500 ${lang === 'ar' ? 'order-2' : 'order-1'}`}>
                {[0.5, 1, 2].map(s => (
                  <button
                    key={s}
                    onClick={() => setPlaybackSpeed(s)}
                    className={`px-2 py-1 rounded-lg font-mono font-bold cursor-pointer ${
                      playbackSpeed === s ? 'bg-slate-800 text-amber-300' : 'hover:text-slate-300'
                    }`}
                  >
                    {s}x
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Learning triad for current step */}
          {currentStep && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5">
              <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-3 space-y-1.5">
                <div className="text-[10px] font-bold text-amber-400 uppercase tracking-wide">
                  {isEn ? 'What is happening' : 'ماذا يحدث الآن'}
                </div>
                <div className="text-xs font-bold text-white leading-snug">
                  {isEn
                    ? (currentStep.stageTitleEn || currentStep.titleEn || `Step ${currentStepIndex + 1}`)
                    : (currentStep.stageTitleAr || currentStep.titleAr || `الخطوة ${currentStepIndex + 1}`)}
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  {(() => {
                    const ex = currentStep.explanation;
                    if (typeof ex === 'string') return ex;
                    if (ex && typeof ex === 'object') {
                      return isEn
                        ? (ex.whatIsHappeningEn || ex.whatIsHappening || '')
                        : (ex.whatIsHappening || '');
                    }
                    return isEn
                      ? (currentStep.stageDescriptionEn || currentStep.actionAr || '')
                      : (currentStep.stageDescriptionAr || currentStep.actionAr || '');
                  })()}
                </p>
              </div>
              <div className="rounded-xl border border-cyan-500/20 bg-cyan-500/5 p-3 space-y-1.5">
                <div className="text-[10px] font-bold text-cyan-400 uppercase tracking-wide">
                  {isEn ? 'Why / Cisco term' : 'لماذا / مصطلح سيسكو'}
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {currentStep.layer && (
                    <span className="px-1.5 py-0.5 rounded bg-slate-950 text-cyan-300 border border-cyan-500/30 text-[10px] font-mono font-bold">
                      {currentStep.layer}
                    </span>
                  )}
                  {currentStep.highlightEvent && (
                    <span className="px-1.5 py-0.5 rounded bg-slate-950 text-amber-300 border border-amber-500/30 text-[10px] font-mono">
                      {currentStep.highlightEvent}
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  {(() => {
                    const ex = currentStep.explanation;
                    if (ex && typeof ex === 'object') {
                      return isEn
                        ? (ex.whyItHappensEn || ex.whyItHappens || ex.keyObservationEn || ex.keyObservation || '')
                        : (ex.whyItHappens || ex.keyObservation || '');
                    }
                    return currentStep.technicalDetailsAr || (isEn ? 'Inspect L2/L3 headers below.' : 'افحص ترويسات L2/L3 أدناه.');
                  })()}
                </p>
              </div>
              <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-3 space-y-1.5 dir-ltr text-left">
                <div className="text-[10px] font-bold text-emerald-400 uppercase tracking-wide">
                  Headers @ {currentStep.activeNodeId}
                </div>
                <div className="space-y-1 font-mono text-[10px] text-slate-300">
                  <div className="flex justify-between gap-2"><span className="text-slate-500">Src MAC</span><span className="truncate">{currentStep.headers?.l2?.srcMac || '—'}</span></div>
                  <div className="flex justify-between gap-2"><span className="text-slate-500">Dst MAC</span><span className="truncate">{currentStep.headers?.l2?.destMac || '—'}</span></div>
                  <div className="flex justify-between gap-2"><span className="text-slate-500">Src IP</span><span>{currentStep.headers?.l3?.srcIp || '—'}</span></div>
                  <div className="flex justify-between gap-2"><span className="text-slate-500">Dst IP</span><span>{currentStep.headers?.l3?.destIp || '—'}</span></div>
                </div>
              </div>
            </div>
          )}

          {currentStep && (
            <div className="bg-slate-950 rounded-2xl border border-white/[0.06] overflow-hidden dir-ltr text-left">
              <div className="bg-white/[0.02] px-3 py-1.5 border-b border-white/[0.06] flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Terminal className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-xs font-mono text-slate-300 font-bold">
                    Cisco IOS — {currentStep.activeNodeId.toUpperCase()}
                  </span>
                </div>
                <span className="text-[10px] font-mono text-slate-500">Live CLI</span>
              </div>
              <pre className="p-3 text-xs font-mono text-emerald-400 overflow-x-auto whitespace-pre leading-relaxed">
                {getCiscoCliSnippet()}
              </pre>
            </div>
          )}

          <PacketInspector currentStep={currentStep} scenarioId={activeScenario.id} lang={lang} />
        </div>
      </div>

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
