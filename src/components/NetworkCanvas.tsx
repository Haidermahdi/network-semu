import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Laptop, 
  Server as ServerIcon, 
  Network, 
  Radio, 
  Activity, 
  Globe, 
  Sparkles, 
  Info,
  ArrowRight,
  ArrowLeft,
  Send,
  Zap,
  CheckCircle2,
  Table,
  HardDrive,
  Cpu,
  Layers,
  Shield,
  ShieldAlert,
  Lock,
  Boxes
} from 'lucide-react';
import { NetworkNode, NetworkLink, SimulationStep, NetworkTopology, TopologyZone, Language } from '../types';
import { getLocalizedNodeName } from '../utils/packetTranslations';

interface NetworkCanvasProps {
  nodes: NetworkNode[];
  links: NetworkLink[];
  zones?: TopologyZone[];
  activeTopology?: NetworkTopology;
  currentStep?: SimulationStep;
  activeScenarioTitle?: string;
  onNodeClick?: (node: NetworkNode) => void;
  selectedNodeId?: string | null;
  isPlaying?: boolean;
  lang?: Language;
}

export const NetworkCanvas: React.FC<NetworkCanvasProps> = ({
  nodes,
  links,
  zones,
  activeTopology,
  currentStep,
  activeScenarioTitle,
  onNodeClick,
  selectedNodeId,
  isPlaying,
  lang = 'ar'
}) => {
  const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null);
  const isEn = lang === 'en';

  const getNode = (id: string) => nodes.find(n => n.id === id);

  const getPacketCoords = () => {
    if (!currentStep) return null;
    const fromNode = getNode(currentStep.fromNodeId);
    const toNode = getNode(currentStep.toNodeId);
    if (!fromNode || !toNode) return null;

    if (fromNode.id === toNode.id) {
      return { 
        x: fromNode.x, 
        y: fromNode.y, 
        fromNode, 
        toNode, 
        isSameNode: true,
        angle: 0
      };
    }

    const t = currentStep.progressPercentage;
    const currentX = fromNode.x + (toNode.x - fromNode.x) * t;
    const currentY = fromNode.y + (toNode.y - fromNode.y) * t;

    // Angle of motion
    const dx = toNode.x - fromNode.x;
    const dy = toNode.y - fromNode.y;
    const angle = (Math.atan2(dy, dx) * 180) / Math.PI;

    return { 
      x: currentX, 
      y: currentY, 
      fromNode, 
      toNode, 
      isSameNode: false,
      angle,
      isMovingRight: dx >= 0
    };
  };

  const packetCoords = getPacketCoords();

  // Find active link
  const activeLink = currentStep ? links.find(link => 
    (currentStep.fromNodeId === link.fromId && currentStep.toNodeId === link.toId) ||
    (currentStep.fromNodeId === link.toId && currentStep.toNodeId === link.fromId)
  ) : null;

  // Active zones: either passed via props or from activeTopology, fallback to default
  const activeZones = zones || activeTopology?.zones || [
    {
      id: 'default-lan',
      titleAr: 'VLAN 10 Engineering (LAN)',
      subtitleAr: 'Layer 2 Switched Domain',
      ipRange: '192.168.1.0/24',
      x: '1.5%',
      y: '8%',
      width: '33%',
      height: '84%',
      borderColor: 'border-cyan-500/20',
      bgColor: 'bg-cyan-950/10',
      textColor: 'text-cyan-300',
      badgeBg: 'border-cyan-500/30 text-cyan-300',
      pulseColor: 'bg-cyan-400'
    },
    {
      id: 'default-wan',
      titleAr: 'OSPF Area 0 WAN Core',
      subtitleAr: 'High-Speed Optical WAN Transit Backbone',
      ipRange: '203.0.113.0/30',
      x: '36%',
      y: '14%',
      width: '36%',
      height: '72%',
      borderColor: 'border-indigo-500/20',
      bgColor: 'bg-indigo-950/10',
      textColor: 'text-indigo-300',
      badgeBg: 'border-indigo-500/30 text-indigo-300',
      pulseColor: 'bg-indigo-400'
    },
    {
      id: 'default-dc',
      titleAr: 'VLAN 20 Servers: 10.0.0.0/24',
      subtitleAr: 'Enterprise Server Farm',
      ipRange: '10.0.0.0/24',
      x: '73.5%',
      y: '8%',
      width: '25%',
      height: '84%',
      borderColor: 'border-purple-500/20',
      bgColor: 'bg-purple-950/10',
      textColor: 'text-purple-300',
      badgeBg: 'border-purple-500/30 text-purple-300',
      pulseColor: 'bg-purple-400'
    }
  ];

  return (
    <div className="relative w-full h-[500px] sm:h-[540px] bg-gradient-to-b from-[#070a12] via-[#0b101d] to-[#070a12] rounded-3xl border border-white/[0.08] shadow-2xl overflow-hidden select-none font-sans dir-ltr">
      {/* Precision Engineering Cyber Grid Background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b18_1px,transparent_1px),linear-gradient(to_bottom,#1e293b18_1px,transparent_1px)] bg-[size:28px_28px] pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(245,158,11,0.04)_0%,transparent_70%)] pointer-events-none" />

      {/* Dynamic Network Domain Zones (Tailored per Topology Model) */}
      {activeZones.map((zone) => (
        <div
          key={zone.id}
          style={{
            left: zone.x,
            top: zone.y,
            width: zone.width,
            height: zone.height
          }}
          className={`absolute rounded-3xl border ${zone.borderColor || 'border-slate-800'} ${zone.bgColor || 'bg-slate-900/15'} backdrop-blur-[2px] pointer-events-none transition-all duration-300 shadow-inner`}
        >
          <div className="absolute top-3 right-3 sm:right-4 flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-950/90 border border-slate-700/60 text-[11px] sm:text-xs font-mono shadow-md">
            <span className={`w-2 h-2 rounded-full ${zone.pulseColor || 'bg-cyan-400'} animate-pulse`} />
            <span className={`font-bold ${zone.textColor || 'text-slate-200'}`}>
              {isEn ? (zone.titleEn || zone.titleAr) : zone.titleAr}
            </span>
            {zone.ipRange && (
              <span className="text-slate-400 text-[10px] hidden sm:inline">({zone.ipRange})</span>
            )}
          </div>
          {(isEn ? (zone.subtitleEn || zone.subtitleAr) : zone.subtitleAr) && (
            <div className={`absolute bottom-3 left-3 text-[10px] ${zone.textColor ? `${zone.textColor} opacity-70` : 'text-slate-400'} font-mono hidden sm:block`}>
              {isEn ? (zone.subtitleEn || zone.subtitleAr) : zone.subtitleAr}
            </div>
          )}
        </div>
      ))}

      {/* Structured Physical Links & Optical Fibers (SVG) */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none">
        <defs>
          {/* Copper Link Gradient */}
          <linearGradient id="copperLinkGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.8" />
            <stop offset="50%" stopColor="#10b981" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.8" />
          </linearGradient>
          
          {/* High-Speed Optical Fiber Gradient */}
          <linearGradient id="opticalFiberGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#818cf8" stopOpacity="0.9" />
            <stop offset="50%" stopColor="#c084fc" stopOpacity="1" />
            <stop offset="100%" stopColor="#e879f9" stopOpacity="0.9" />
          </linearGradient>

          {/* IPsec VPN Crypto Tunnel Gradient */}
          <linearGradient id="vpnTunnelGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#a855f7" stopOpacity="0.9" />
            <stop offset="50%" stopColor="#06b6d4" stopOpacity="1" />
            <stop offset="100%" stopColor="#a855f7" stopOpacity="0.9" />
          </linearGradient>

          {/* LACP Port-Channel Bundle Gradient */}
          <linearGradient id="lacpBundleGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.9" />
            <stop offset="50%" stopColor="#fbbf24" stopOpacity="1" />
            <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.9" />
          </linearGradient>

          {/* Active Flow Glow Filter */}
          <filter id="glowEffect" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {links.map((link) => {
          const from = getNode(link.fromId);
          const to = getNode(link.toId);
          if (!from || !to) return null;

          const isCurrentActiveLink = currentStep && (
            (currentStep.fromNodeId === link.fromId && currentStep.toNodeId === link.toId) ||
            (currentStep.fromNodeId === link.toId && currentStep.toNodeId === link.fromId)
          );

          const isBlocked = link.status === 'blocked';
          const isFiber = link.type === 'fiber';
          const isTunnel = link.type === 'tunnel';
          const isBundle = link.type === 'bundle';

          const midX = (from.x + to.x) / 2;
          const midY = (from.y + to.y) / 2;

          return (
            <g key={link.id} className="transition-all duration-300">
              {/* Outer Beam Halo when Active */}
              {isCurrentActiveLink && (
                <line
                  x1={`${from.x}%`}
                  y1={`${from.y}%`}
                  x2={`${to.x}%`}
                  y2={`${to.y}%`}
                  stroke={isTunnel ? '#a855f7' : isFiber ? '#c084fc' : isBundle ? '#f59e0b' : '#22d3ee'}
                  strokeWidth="8"
                  strokeOpacity="0.4"
                  filter="url(#glowEffect)"
                />
              )}

              {/* Special Link Types: Blocked (STP Loop), Tunnel (IPsec), Bundle (LACP), Fiber, or Copper */}
              {isBlocked ? (
                <>
                  {/* Blocked Link for STP */}
                  <line
                    x1={`${from.x}%`}
                    y1={`${from.y}%`}
                    x2={`${to.x}%`}
                    y2={`${to.y}%`}
                    stroke="#f43f5e"
                    strokeWidth="2.5"
                    strokeDasharray="6,6"
                    strokeOpacity="0.75"
                  />
                  {/* STP Blocked Badge in Center */}
                  <g className="cursor-pointer" transform={`translate(0, 0)`}>
                    <circle
                      cx={`${midX}%`}
                      cy={`${midY}%`}
                      r="11"
                      fill="#0f172a"
                      stroke="#f43f5e"
                      strokeWidth="2"
                    />
                    <text
                      x={`${midX}%`}
                      y={`${midY + 3.5}%`}
                      fill="#f43f5e"
                      fontSize="9.5"
                      fontWeight="bold"
                      fontFamily="monospace"
                      textAnchor="middle"
                    >
                      BLK
                    </text>
                  </g>
                </>
              ) : isTunnel ? (
                <>
                  {/* IPsec Crypto Tunnel Beam */}
                  <line
                    x1={`${from.x}%`}
                    y1={`${from.y}%`}
                    x2={`${to.x}%`}
                    y2={`${to.y}%`}
                    stroke="url(#vpnTunnelGrad)"
                    strokeWidth="4"
                    strokeDasharray="10,6"
                    strokeOpacity={isCurrentActiveLink ? '1' : '0.75'}
                    className="animate-[dash_1.5s_linear_infinite]"
                  />
                  {/* Tunnel Lock Badge in center */}
                  <g>
                    <rect
                      x={`${midX - 3.5}%`}
                      y={`${midY - 2.2}%`}
                      width="7%"
                      height="4.4%"
                      rx="6"
                      fill="#090d16"
                      stroke="#a855f7"
                      strokeWidth="1.5"
                    />
                    <text
                      x={`${midX}%`}
                      y={`${midY + 0.8}%`}
                      fill="#d8b4fe"
                      fontSize="9"
                      fontWeight="bold"
                      fontFamily="monospace"
                      textAnchor="middle"
                    >
                      🔒 IPsec ESP
                    </text>
                  </g>
                </>
              ) : isBundle ? (
                <>
                  {/* LACP Port-Channel Dual Parallel Lines */}
                  <line
                    x1={`${from.x}%`}
                    y1={`${from.y - 1.2}%`}
                    x2={`${to.x}%`}
                    y2={`${to.y - 1.2}%`}
                    stroke="url(#lacpBundleGrad)"
                    strokeWidth="2.5"
                    strokeOpacity={isCurrentActiveLink ? '1' : '0.75'}
                  />
                  <line
                    x1={`${from.x}%`}
                    y1={`${from.y + 1.2}%`}
                    x2={`${to.x}%`}
                    y2={`${to.y + 1.2}%`}
                    stroke="url(#lacpBundleGrad)"
                    strokeWidth="2.5"
                    strokeOpacity={isCurrentActiveLink ? '1' : '0.75'}
                  />
                  {/* Port-Channel Label in Center */}
                  <g>
                    <rect
                      x={`${midX - 4}%`}
                      y={`${midY - 2}%`}
                      width="8%"
                      height="4%"
                      rx="6"
                      fill="#090d16"
                      stroke="#f59e0b"
                      strokeWidth="1.5"
                    />
                    <text
                      x={`${midX}%`}
                      y={`${midY + 0.8}%`}
                      fill="#fbbf24"
                      fontSize="8.5"
                      fontWeight="bold"
                      fontFamily="monospace"
                      textAnchor="middle"
                    >
                      Po1 (2 Gbps)
                    </text>
                  </g>
                </>
              ) : (
                /* Standard Base Physical Cable (Copper or Fiber) */
                <line
                  x1={`${from.x}%`}
                  y1={`${from.y}%`}
                  x2={`${to.x}%`}
                  y2={`${to.y}%`}
                  stroke={isFiber ? 'url(#opticalFiberGrad)' : 'url(#copperLinkGrad)'}
                  strokeWidth={isFiber ? '3.5' : '2.5'}
                  strokeDasharray={isFiber ? '7,4' : 'none'}
                  strokeOpacity={isCurrentActiveLink ? '1' : '0.55'}
                />
              )}

              {/* High-Speed Signal Laser Pulse Animation */}
              {isCurrentActiveLink && !isBlocked && (
                <line
                  x1={`${from.x}%`}
                  y1={`${from.y}%`}
                  x2={`${to.x}%`}
                  y2={`${to.y}%`}
                  stroke="#ffffff"
                  strokeWidth={isFiber || isTunnel ? '3' : '2.5'}
                  strokeDasharray="8,16"
                  className="animate-[dash_0.6s_linear_infinite]"
                />
              )}

              {/* Interface Port Labels at Endpoints */}
              {link.fromPort && (
                <text
                  x={`${from.x + (to.x - from.x) * 0.18}%`}
                  y={`${from.y + (to.y - from.y) * 0.18 - 1.5}%`}
                  fill="#94a3b8"
                  fontSize="9.5"
                  fontFamily="monospace"
                  textAnchor="middle"
                  className="font-semibold select-none"
                >
                  {link.fromPort}
                </text>
              )}

              {link.toPort && (
                <text
                  x={`${to.x - (to.x - from.x) * 0.18}%`}
                  y={`${to.y - (to.y - from.y) * 0.18 - 1.5}%`}
                  fill="#94a3b8"
                  fontSize="9.5"
                  fontFamily="monospace"
                  textAnchor="middle"
                  className="font-semibold select-none"
                >
                  {link.toPort}
                </text>
              )}
            </g>
          );
        })}
      </svg>

      {/* Cisco Enterprise Hardware Nodes */}
      {nodes.map((node) => {
        const isCurrentActive = currentStep?.activeNodeId === node.id;
        const isFrom = currentStep?.fromNodeId === node.id;
        const isTo = currentStep?.toNodeId === node.id;
        const isSelected = selectedNodeId === node.id;
        const isHovered = hoveredNodeId === node.id;

        return (
          <div
            key={node.id}
            id={`node-${node.id}`}
            onClick={() => onNodeClick?.(node)}
            onMouseEnter={() => setHoveredNodeId(node.id)}
            onMouseLeave={() => setHoveredNodeId(null)}
            style={{ left: `${node.x}%`, top: `${node.y}%` }}
            className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer group z-20 focus:outline-none"
          >
            {/* Pulsing Active Action Rings */}
            {isCurrentActive && (
              <div className="absolute -inset-3 rounded-2xl border-2 border-amber-400 animate-ping opacity-60 pointer-events-none" />
            )}
            {(isFrom || isTo) && (
              <div className="absolute -inset-2 rounded-2xl border border-emerald-400/80 pointer-events-none animate-pulse" />
            )}

            {/* Hardware Chassis Body */}
            <motion.div
              whileHover={{ scale: 1.06 }}
              whileTap={{ scale: 0.97 }}
              className={`relative flex flex-col items-center justify-center p-3 sm:p-3.5 rounded-2xl transition-all duration-200 shadow-2xl backdrop-blur-md ${
                isSelected 
                  ? 'ring-2 ring-amber-400 bg-slate-900/95 border-amber-400 shadow-amber-500/20'
                  : isCurrentActive
                    ? 'bg-slate-900/95 border-2 border-amber-400 shadow-amber-400/25 ring-1 ring-amber-400/40'
                    : 'bg-slate-950/90 hover:bg-slate-900/95 border border-slate-800 hover:border-slate-700'
              }`}
            >
              {/* Role Badges (Sender / Receiver / Router L3) */}
              <div className="absolute -top-3 flex items-center gap-1 z-30">
                {isFrom && (
                  <span className="px-2 py-0.5 rounded-full text-[9px] font-bold font-mono bg-cyan-500 text-slate-950 shadow-md">
                    SRC
                  </span>
                )}
                {isTo && (
                  <span className="px-2 py-0.5 rounded-full text-[9px] font-bold font-mono bg-emerald-500 text-slate-950 shadow-md">
                    DEST
                  </span>
                )}
                {isCurrentActive && !isFrom && !isTo && (
                  <span className="px-2 py-0.5 rounded-full text-[9px] font-bold font-mono bg-amber-400 text-slate-950 shadow-md animate-pulse">
                    ACTIVE
                  </span>
                )}
              </div>

              {/* Hardware Status LEDs */}
              <div className="flex items-center gap-1 mb-1 bg-slate-950/80 px-2 py-0.5 rounded-full border border-slate-800/80">
                <span className={`w-1.5 h-1.5 rounded-full ${isCurrentActive ? 'bg-amber-400 animate-ping' : 'bg-emerald-400'}`} />
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
              </div>

              {/* Device Hardware Icon & Layer Badge */}
              <div className="relative my-1">
                {node.type === 'host' && (
                  <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                    <Laptop className="w-6 h-6" />
                  </div>
                )}
                {node.type === 'switch' && (
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                    <Network className="w-6 h-6" />
                  </div>
                )}
                {node.type === 'router' && (
                  <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
                    <Radio className="w-6 h-6" />
                  </div>
                )}
                {node.type === 'server' && (
                  <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400">
                    <ServerIcon className="w-6 h-6" />
                  </div>
                )}
              </div>

              {/* Hostname & Layer Tag */}
              <div className="text-center mt-1">
                <div className="text-xs font-mono font-bold text-slate-100 whitespace-nowrap">
                  {isEn
                    ? (node.nameEn ? node.nameEn.split('(')[0].trim() : node.name.replace(/\([\u0600-\u06FF\s0-9/-]+\)/g, '').trim())
                    : (node.arName?.split(' ')[0] || node.name.split(' ')[0])}
                </div>
                <div className="text-[10px] font-mono text-slate-400">
                  {node.type === 'switch' ? 'L2 Switch' : node.type === 'router' ? 'L3 Gateway' : node.type === 'server' ? 'L7 Cloud' : 'End Host'}
                </div>
              </div>
            </motion.div>

            {/* Sub-pill with IP Address */}
            <div className="absolute top-full mt-1.5 left-1/2 -translate-x-1/2 px-2.5 py-0.5 rounded-lg bg-slate-950/95 border border-slate-800 text-[10px] font-mono text-slate-300 whitespace-nowrap shadow-lg">
              {node.ip.split(' ')[0]}
            </div>

            {/* Rich Cisco Technical Hover Tooltip */}
            <AnimatePresence>
              {isHovered && (
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 4, scale: 0.95 }}
                  transition={{ duration: 0.15 }}
                  className={`absolute bottom-full mb-3 left-1/2 -translate-x-1/2 w-64 bg-slate-900/98 backdrop-blur-md text-slate-100 p-3 rounded-2xl border border-slate-700 shadow-2xl z-40 pointer-events-none font-mono text-xs ${isEn ? 'dir-ltr text-left' : 'dir-rtl text-right'}`}
                >
                  <div className="flex items-center justify-between border-b border-slate-800 pb-1.5 mb-2 dir-ltr">
                    <span className="font-bold text-cyan-400 font-sans text-xs">{getLocalizedNodeName(node, lang)}</span>
                    <span className="px-1.5 py-0.5 rounded bg-slate-800 text-[9px] text-slate-300 uppercase">{node.type}</span>
                  </div>

                  <div className="space-y-1 text-[11px] dir-ltr text-left">
                    <div className="flex justify-between">
                      <span className="text-slate-400">IP Addr:</span>
                      <span className="text-cyan-300 font-bold">{node.ip}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">MAC Addr:</span>
                      <span className="text-emerald-300 font-bold">{node.mac}</span>
                    </div>
                    {node.defaultGateway && (
                      <div className="flex justify-between">
                        <span className="text-slate-400">Def. Gateway:</span>
                        <span className="text-amber-300">{node.defaultGateway}</span>
                      </div>
                    )}
                    {node.ports && (
                      <div className="flex justify-between border-t border-slate-800/80 pt-1 mt-1 text-[10px]">
                        <span className="text-slate-400">Connected:</span>
                        <span className="text-slate-300">{node.ports.map(p => typeof p === 'string' ? p : (p.label || String(p.portNumber))).join(', ')}</span>
                      </div>
                    )}
                  </div>

                  <div className="mt-2 pt-1.5 border-t border-slate-800 text-[10px] text-emerald-400 font-sans flex items-center justify-center gap-1">
                    <Table className="w-3 h-3" />
                    <span>{isEn ? 'Click to inspect tables (CAM / ARP / Route)' : 'انقر لعرض الجداول (CAM / ARP / Route)'}</span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}

      {/* Dynamic Animated Flying Packet Capsule */}
      {packetCoords && (
        <motion.div
          animate={{
            left: `${packetCoords.x}%`,
            top: `${packetCoords.y}%`
          }}
          transition={{
            duration: isPlaying ? 0.9 : 0.25,
            ease: 'easeInOut'
          }}
          className="absolute -translate-x-1/2 -translate-y-1/2 z-30 pointer-events-none"
        >
          <div className="relative flex items-center justify-center">
            {/* Glowing Aura Ring */}
            <div className="absolute -inset-2 rounded-full bg-amber-400/20 blur-md animate-pulse" />
            
            {/* Packet Capsule */}
            <div className="relative flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-950 border-2 border-amber-400 text-amber-300 shadow-2xl text-xs font-bold font-mono">
              <Send className={`w-3.5 h-3.5 text-amber-400 ${packetCoords.isMovingRight ? '' : 'rotate-180'}`} />
              
              <div className="flex items-center gap-1">
                <span className="text-[9px] px-1 py-0.2 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40 uppercase">
                  {currentStep?.layer || 'L3'}
                </span>
                <span className="font-bold whitespace-nowrap text-[11px] text-amber-200">
                  {currentStep?.headers.payload.type || currentStep?.headers.l2.etherType || 'Packet'}
                </span>
              </div>

              {packetCoords.isMovingRight ? (
                <ArrowRight className="w-3.5 h-3.5 text-amber-400/80" />
              ) : (
                <ArrowLeft className="w-3.5 h-3.5 text-amber-400/80" />
              )}
            </div>
          </div>
        </motion.div>
      )}

      {/* Top HUD Status Bar */}
      <div className="absolute top-3 left-4 right-4 flex flex-wrap items-center justify-between gap-2 z-20 pointer-events-none" dir={isEn ? 'ltr' : 'rtl'}>
        <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-slate-950/90 border border-white/[0.08] text-xs shadow-xl backdrop-blur-md pointer-events-auto">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-slate-400">{isEn ? 'Scenario:' : 'السيناريو:'}</span>
          <span className="text-amber-300 font-bold font-sans">{activeScenarioTitle || (isEn ? 'Packet Flow Simulation' : 'محاكاة تدفق الحزم')}</span>
          {activeTopology && (
            <span className="mr-2 px-2 py-0.5 rounded-lg bg-indigo-950/90 border border-indigo-500/40 text-indigo-300 text-[10px] font-mono hidden md:inline">
              {isEn ? (activeTopology.badgeEn || activeTopology.titleEn) : activeTopology.badgeAr}
            </span>
          )}
        </div>

        {activeLink && (
          <div className="flex items-center gap-2 px-3 py-1 rounded-xl bg-slate-950/90 border border-white/[0.08] text-xs font-mono shadow-xl backdrop-blur-md pointer-events-auto">
            <Zap className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
            <span className="text-slate-400">Physical Link:</span>
            <span className="text-cyan-300 font-bold">{activeLink.bandwidth}</span>
            <span className="text-slate-500">({activeLink.type.toUpperCase()})</span>
            {activeLink.status === 'blocked' && (
              <span className="px-1.5 py-0.5 rounded bg-rose-950 text-rose-300 border border-rose-600 text-[9px] font-bold">
                BLOCKED (STP)
              </span>
            )}
          </div>
        )}
      </div>

      {/* Bottom HUD Legend & Guide */}
      <div className="absolute bottom-3 left-4 right-4 flex flex-wrap items-center justify-between gap-2 z-10 pointer-events-none text-[11px] font-sans" dir={isEn ? 'ltr' : 'rtl'}>
        <div className="flex items-center gap-3 bg-slate-950/90 px-3 py-1.5 rounded-xl border border-white/[0.08] text-slate-400 pointer-events-auto shadow-lg">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-1 rounded-full bg-cyan-400" />
            <span>{isEn ? 'RJ45 Copper (LAN)' : 'كابل RJ45 نحاسي'}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-1 rounded-full bg-purple-400" />
            <span>{isEn ? '10G Fiber (WAN)' : 'ألياف ضوئية 10G WAN'}</span>
          </div>
          {activeTopology?.id === 'stp-triangle' && (
            <div className="flex items-center gap-1.5 text-rose-400 font-bold">
              <span className="w-2.5 h-2.5 rounded-full border border-rose-500 flex items-center justify-center text-[8px]">✕</span>
              <span>{isEn ? 'STP Blocked Port (BLK)' : 'منفذ محجوب (BLK) لمنع الحلقات'}</span>
            </div>
          )}
          {activeTopology?.id === 'ipsec-vpn' && (
            <div className="flex items-center gap-1.5 text-purple-300 font-bold">
              <Lock className="w-3 h-3 text-purple-400" />
              <span>{isEn ? 'IPsec Encrypted Tunnel' : 'نفق مشفر (IPsec Tunnel)'}</span>
            </div>
          )}
          {activeTopology?.id === 'lacp-etherchannel' && (
            <div className="flex items-center gap-1.5 text-amber-300 font-bold">
              <Boxes className="w-3 h-3 text-amber-400" />
              <span>{isEn ? 'Bundled Port-Channel (2Gbps)' : 'حزمة مدمجة (Port-Channel 2Gbps)'}</span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-1.5 text-slate-300 bg-slate-950/90 px-3.5 py-1.5 rounded-xl border border-white/[0.08] pointer-events-auto shadow-lg">
          <Info className="w-3.5 h-3.5 text-cyan-400" />
          <span>{isEn ? 'Click any network device to inspect real-time CAM, ARP, and Route tables' : 'انقر فوق أي جهاز لمعاينة جداول الـ CAM والـ Routing والـ ARP التفاعلية'}</span>
        </div>
      </div>
    </div>
  );
};
