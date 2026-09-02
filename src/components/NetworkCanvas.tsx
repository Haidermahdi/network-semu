import React from 'react';
import { motion } from 'motion/react';
import { 
  Laptop, 
  Server as ServerIcon, 
  Network, 
  Radio, 
  Activity, 
  Globe, 
  Sparkles, 
  Info,
  ShieldCheck,
  Cpu
} from 'lucide-react';
import { NetworkNode, NetworkLink, SimulationStep } from '../types';

interface NetworkCanvasProps {
  nodes: NetworkNode[];
  links: NetworkLink[];
  currentStep?: SimulationStep;
  activeScenarioTitle?: string;
  onNodeClick?: (node: NetworkNode) => void;
  selectedNodeId?: string | null;
  isPlaying?: boolean;
}

export const NetworkCanvas: React.FC<NetworkCanvasProps> = ({
  nodes,
  links,
  currentStep,
  activeScenarioTitle,
  onNodeClick,
  selectedNodeId,
  isPlaying
}) => {
  const getNodeIcon = (type: string, isCurrentActive: boolean) => {
    switch (type) {
      case 'host':
        return <Laptop className={`w-6 h-6 sm:w-7 sm:h-7 ${isCurrentActive ? 'text-amber-300' : 'text-cyan-400'}`} />;
      case 'switch':
        return <Network className={`w-6 h-6 sm:w-7 sm:h-7 ${isCurrentActive ? 'text-emerald-300' : 'text-emerald-400'}`} />;
      case 'router':
        return <Radio className={`w-6 h-6 sm:w-7 sm:h-7 ${isCurrentActive ? 'text-indigo-300' : 'text-indigo-400'}`} />;
      case 'server':
        return <ServerIcon className={`w-6 h-6 sm:w-7 sm:h-7 ${isCurrentActive ? 'text-purple-300' : 'text-purple-400'}`} />;
      default:
        return <Activity className="w-6 h-6 text-slate-300" />;
    }
  };

  const getNode = (id: string) => nodes.find(n => n.id === id);

  const getPacketCoords = () => {
    if (!currentStep) return null;
    const fromNode = getNode(currentStep.fromNodeId);
    const toNode = getNode(currentStep.toNodeId);
    if (!fromNode || !toNode) return null;

    if (fromNode.id === toNode.id) {
      return { x: fromNode.x, y: fromNode.y };
    }

    const t = currentStep.progressPercentage;
    const currentX = fromNode.x + (toNode.x - fromNode.x) * t;
    const currentY = fromNode.y + (toNode.y - fromNode.y) * t;

    return { x: currentX, y: currentY, fromNode, toNode };
  };

  const packetCoords = getPacketCoords();

  return (
    <div className="relative w-full h-[420px] sm:h-[480px] bg-[#070b14] rounded-3xl border border-slate-800/90 overflow-hidden shadow-2xl p-4 select-none font-sans">
      {/* Precision Engineering Grid Background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b20_1px,transparent_1px),linear-gradient(to_bottom,#1e293b20_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />
      
      {/* Zone 1: VLAN 10 Engineering (192.168.1.0/24) */}
      <div className="absolute left-[2%] top-[8%] w-[40%] h-[84%] rounded-3xl border border-dashed border-cyan-500/30 bg-cyan-950/10 pointer-events-none transition-all">
        <div className="absolute top-3 right-4 flex items-center gap-1.5 px-3 py-1 rounded-xl bg-slate-950/90 border border-cyan-500/40 text-cyan-300 text-xs font-mono shadow-md">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
          <span className="font-bold">VLAN 10 Engineering:</span> 192.168.1.0/24
        </div>
      </div>

      {/* Zone 2: OSPF Area 0 WAN Core */}
      <div className="absolute left-[44%] top-[20%] w-[27%] h-[60%] rounded-2xl border border-dashed border-indigo-500/30 bg-indigo-950/10 pointer-events-none flex items-center justify-center transition-all">
        <div className="absolute -top-3.5 px-3 py-1 rounded-full bg-slate-950 border border-indigo-500/50 text-indigo-300 text-[11px] font-mono flex items-center gap-1.5 shadow-lg">
          <Globe className="w-3.5 h-3.5 text-indigo-400" />
          <span>OSPF Area 0 WAN Core (203.0.113.0/30)</span>
        </div>
      </div>

      {/* Zone 3: VLAN 20 Cloud Data Center (10.0.0.0/24) */}
      <div className="absolute right-[2%] top-[8%] w-[24%] h-[84%] rounded-3xl border border-dashed border-purple-500/30 bg-purple-950/10 pointer-events-none transition-all">
        <div className="absolute top-3 right-4 flex items-center gap-1.5 px-3 py-1 rounded-xl bg-slate-950/90 border border-purple-500/40 text-purple-300 text-xs font-mono shadow-md">
          <span className="w-2 h-2 rounded-full bg-purple-400 animate-pulse" />
          <span className="font-bold">VLAN 20 Servers:</span> 10.0.0.0/24
        </div>
      </div>

      {/* SVG Structured Cables & Optics */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none">
        <defs>
          <linearGradient id="copperLink" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.7" />
            <stop offset="100%" stopColor="#10b981" stopOpacity="0.7" />
          </linearGradient>
          <linearGradient id="fiberLink" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#6366f1" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#a855f7" stopOpacity="0.9" />
          </linearGradient>
        </defs>

        {links.map((link) => {
          const from = getNode(link.fromId);
          const to = getNode(link.toId);
          if (!from || !to) return null;

          const isCurrentActiveLink = currentStep && (
            (currentStep.fromNodeId === link.fromId && currentStep.toNodeId === link.toId) ||
            (currentStep.fromNodeId === link.toId && currentStep.toNodeId === link.fromId)
          );

          const isFiber = link.type === 'fiber';

          return (
            <g key={link.id}>
              {/* Cable Outer Aura */}
              {isCurrentActiveLink && (
                <line
                  x1={`${from.x}%`}
                  y1={`${from.y}%`}
                  x2={`${to.x}%`}
                  y2={`${to.y}%`}
                  stroke={isFiber ? '#a855f7' : '#10b981'}
                  strokeWidth="6"
                  strokeOpacity="0.4"
                />
              )}

              {/* Main Physical Cable Line */}
              <line
                x1={`${from.x}%`}
                y1={`${from.y}%`}
                x2={`${to.x}%`}
                y2={`${to.y}%`}
                stroke={isFiber ? 'url(#fiberLink)' : 'url(#copperLink)'}
                strokeWidth={isFiber ? '3' : '2'}
                strokeDasharray={isFiber ? '6,3' : 'none'}
              />

              {/* Active High-Speed Light Pulses */}
              {isCurrentActiveLink && (
                <line
                  x1={`${from.x}%`}
                  y1={`${from.y}%`}
                  x2={`${to.x}%`}
                  y2={`${to.y}%`}
                  stroke="#ffffff"
                  strokeWidth="2.5"
                  strokeDasharray="6,12"
                  className="animate-[dash_0.8s_linear_infinite]"
                />
              )}
            </g>
          );
        })}
      </svg>

      {/* Network Nodes (Cisco Enterprise Devices) */}
      {nodes.map((node) => {
        const isCurrentActive = currentStep?.activeNodeId === node.id;
        const isFrom = currentStep?.fromNodeId === node.id;
        const isTo = currentStep?.toNodeId === node.id;
        const isSelected = selectedNodeId === node.id;

        return (
          <div
            key={node.id}
            id={`node-${node.id}`}
            onClick={() => onNodeClick?.(node)}
            style={{ left: `${node.x}%`, top: `${node.y}%` }}
            className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer group z-20 focus:outline-none"
          >
            {/* Active Highlight Ring */}
            {isCurrentActive && (
              <div className="absolute -inset-3 rounded-2xl border-2 border-amber-400 animate-ping pointer-events-none" />
            )}
            {(isFrom || isTo) && (
              <div className="absolute -inset-2 rounded-2xl border border-emerald-400/60 pointer-events-none" />
            )}

            {/* Device Body Chassis */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              className={`relative flex flex-col items-center justify-center p-3 rounded-2xl transition-all duration-200 shadow-xl ${
                isSelected 
                  ? 'ring-2 ring-amber-400 bg-slate-900 border-slate-700'
                  : isCurrentActive
                    ? 'bg-slate-900 border-2 border-amber-400 shadow-amber-500/20'
                    : 'bg-slate-950/90 hover:bg-slate-900 border border-slate-800'
              }`}
            >
              {/* Port Activity LEDs for Switches/Routers */}
              {(node.type === 'switch' || node.type === 'router') && (
                <div className="absolute -top-2 flex gap-1 bg-slate-900 px-2 py-0.5 rounded-full border border-slate-700 shadow-sm">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                </div>
              )}

              {/* Device Icon */}
              <div className="relative">
                {getNodeIcon(node.type, isCurrentActive)}
              </div>

              {/* Hostname */}
              <span className="mt-1 text-xs font-mono font-bold text-slate-100 text-center whitespace-nowrap">
                {node.name.split(' ')[0]}
              </span>

              {/* Tooltip on Hover */}
              <div className="hidden group-hover:flex flex-col absolute bottom-full mb-2 bg-slate-900/98 text-slate-100 text-[11px] p-2.5 rounded-xl border border-slate-700 shadow-2xl z-30 pointer-events-none whitespace-nowrap font-mono">
                <div className="font-bold text-cyan-300 font-sans text-xs">{node.arName}</div>
                <div><span className="text-slate-400">IP:</span> {node.ip}</div>
                <div><span className="text-slate-400">MAC:</span> {node.mac}</div>
                {node.defaultGateway && (
                  <div><span className="text-slate-400">GW:</span> {node.defaultGateway}</div>
                )}
              </div>
            </motion.div>

            {/* Sub-label with IP Address */}
            <div className="absolute top-full mt-1.5 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded-lg bg-slate-950/90 border border-slate-800 text-[10px] font-mono text-slate-300 whitespace-nowrap shadow">
              {node.ip.split(' ')[0]}
            </div>
          </div>
        );
      })}

      {/* Animated Packet */}
      {packetCoords && (
        <motion.div
          animate={{
            left: `${packetCoords.x}%`,
            top: `${packetCoords.y}%`
          }}
          transition={{
            duration: isPlaying ? 1.0 : 0.3,
            ease: 'easeInOut'
          }}
          className="absolute -translate-x-1/2 -translate-y-1/2 z-30 pointer-events-none"
        >
          <div className="relative flex items-center justify-center">
            <div className="relative flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-950 border-2 border-amber-400 text-amber-300 shadow-2xl text-xs font-bold font-mono">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>{currentStep?.headers.payload.type || 'Data Frame'}</span>
            </div>
          </div>
        </motion.div>
      )}

      {/* Top Banner Status Bar */}
      <div className="absolute top-3 left-4 flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-slate-950/90 border border-slate-800 text-xs shadow-xl backdrop-blur-sm z-20">
        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
        <span className="text-slate-400">السيناريو:</span>
        <span className="text-amber-300 font-bold font-sans">{activeScenarioTitle || 'محاكاة تدفق الحزم'}</span>
      </div>

      {/* Bottom Hint */}
      <div className="absolute bottom-3 right-4 flex items-center gap-1.5 text-[11px] text-slate-400 bg-slate-950/90 px-3 py-1 rounded-xl border border-slate-800 z-10 font-sans">
        <Info className="w-3.5 h-3.5 text-cyan-400" />
        <span>انقر على أي جهاز لمعاينة جداول الـ CAM والـ Routing الحية</span>
      </div>
    </div>
  );
};
