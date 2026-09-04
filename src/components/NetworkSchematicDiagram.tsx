import React, { useState, useEffect } from 'react';
import { 
  Layers, 
  Network, 
  ArrowRight, 
  ArrowLeft, 
  ChevronRight,
  ChevronLeft,
  Zap, 
  Server, 
  Router, 
  Cpu, 
  Maximize2, 
  Minimize2, 
  Info, 
  CheckCircle2, 
  ShieldAlert, 
  Radio, 
  Workflow, 
  Terminal,
  Activity,
  HardDrive
} from 'lucide-react';
import { DiagramData, DiagramNode, DiagramHeaderField, DiagramSequenceStep, Language } from '../types';
import { pickText } from '../utils/localePick';

interface NetworkSchematicDiagramProps {
  diagram: DiagramData;
  lang?: Language;
  className?: string;
}

export const NetworkSchematicDiagram: React.FC<NetworkSchematicDiagramProps> = ({
  diagram,
  lang = 'ar',
  className = ''
}) => {
  const [selectedNode, setSelectedNode] = useState<DiagramNode | null>(null);
  const [selectedHeaderField, setSelectedHeaderField] = useState<DiagramHeaderField | null>(null);
  const [activeStepIndex, setActiveStepIndex] = useState<number>(0);
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'visual' | 'table' | 'flow'>('visual');

  const nodes = diagram.nodes || [];
  const links = diagram.links || [];
  const headerFields = diagram.headerFields || [];
  const sequenceSteps = diagram.sequenceSteps || [];
  const currentStep: DiagramSequenceStep | undefined = sequenceSteps[activeStepIndex];

  // Reset active step when diagram changes
  useEffect(() => {
    setActiveStepIndex(0);
  }, [diagram.id]);

  // Helper icon for device roles
  const renderDeviceIcon = (role?: string) => {
    switch (role?.toLowerCase()) {
      case 'router':
        return <Router className="w-5 h-5 text-amber-400" />;
      case 'l3switch':
      case 'switch':
        return <Layers className="w-5 h-5 text-blue-400" />;
      case 'server':
        return <Server className="w-5 h-5 text-purple-400" />;
      case 'firewall':
        return <ShieldAlert className="w-5 h-5 text-rose-400" />;
      case 'cloud':
        return <Radio className="w-5 h-5 text-cyan-400" />;
      case 'host':
      default:
        return <HardDrive className="w-5 h-5 text-emerald-400" />;
    }
  };

  return (
    <div 
      className={`rounded-2xl border transition-all overflow-hidden ${
        isExpanded 
          ? 'fixed inset-4 z-50 bg-[#080b12] border-amber-500/40 flex flex-col p-6 shadow-2xl overflow-y-auto' 
          : 'surface p-5 space-y-4'
      } ${className}`}
    >
      {/* Header bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[var(--border-subtle)]">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/25 text-amber-400">
            {diagram.type === 'header' ? (
              <Cpu className="w-4 h-4" />
            ) : diagram.type === 'flow' ? (
              <Workflow className="w-4 h-4" />
            ) : (
              <Network className="w-4 h-4" />
            )}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="badge badge-accent uppercase tracking-wider text-[10px]">
                {diagram.type === 'topology' ? (lang === 'ar' ? 'مخطط طوبولوجي' : 'Topology Schematic') :
                 diagram.type === 'header' ? (lang === 'ar' ? 'تشريح الترويسة' : 'Header Dissection') :
                 diagram.type === 'flow' ? (lang === 'ar' ? 'مخطط تتابع الحزم' : 'Sequence Flow') :
                 (lang === 'ar' ? 'رسم تخطيطي' : 'Schematic')}
              </span>
              <span className="caption-text">•</span>
              <h4 className="heading-4 font-black text-white">{pickText(lang, diagram.titleAr, diagram.titleEn)}</h4>
            </div>
            {diagram.captionAr && (
              <p className="caption-text text-[11px] text-slate-400 mt-0.5">
                {pickText(lang, diagram.captionAr, diagram.captionEn, 'Interactive engineering schematic')}
              </p>
            )}
          </div>
        </div>

        {/* View Controls */}
        <div className="flex items-center gap-2">
          {diagram.headerFields && diagram.headerFields.length > 0 && (
            <div className="flex items-center rounded-lg bg-white/[0.04] p-1 border border-white/[0.06] text-xs">
              <button
                onClick={() => setActiveTab('visual')}
                className={`px-2.5 py-1 rounded-md font-bold transition-all cursor-pointer ${
                  activeTab === 'visual' ? 'bg-amber-500/20 text-amber-300' : 'text-slate-400 hover:text-white'
                }`}
              >
                {lang === 'ar' ? 'الرسم البصري' : 'Visual'}
              </button>
              <button
                onClick={() => setActiveTab('table')}
                className={`px-2.5 py-1 rounded-md font-bold transition-all cursor-pointer ${
                  activeTab === 'table' ? 'bg-amber-500/20 text-amber-300' : 'text-slate-400 hover:text-white'
                }`}
              >
                {lang === 'ar' ? 'جدول الحقول' : 'Fields'}
              </button>
            </div>
          )}

          <button
            onClick={() => setIsExpanded(!isExpanded)}
            title={isExpanded ? (lang === 'ar' ? 'تصغير' : 'Minimize') : (lang === 'ar' ? 'ملء الشاشة' : 'Fullscreen')}
            className="p-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.06] text-slate-300 cursor-pointer transition-all"
          >
            {isExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* -------------------------------------------------------------
          TYPE 1: NETWORK TOPOLOGY SCHEMATIC
          ------------------------------------------------------------- */}
      {diagram.type === 'topology' && (
        <div className="space-y-3">
          {/* Visual SVG Canvas Area */}
          <div className="relative w-full h-72 sm:h-84 rounded-xl bg-gradient-to-b from-[#06080e] to-[#0c101b] border border-white/[0.08] overflow-hidden p-4 select-none">
            {/* Grid Pattern */}
            <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.04)_1px,transparent_1px)] [background-size:20px_20px] pointer-events-none" />

            {/* SVG Connecting Links */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none">
              <defs>
                <linearGradient id="linkGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#d97706" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.8" />
                </linearGradient>
                <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="3" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
              </defs>

              {links.map((link, idx) => {
                const fromNode = nodes.find(n => n.id === link.from);
                const toNode = nodes.find(n => n.id === link.to);
                if (!fromNode || !toNode) return null;

                const x1 = `${fromNode.x}%`;
                const y1 = `${fromNode.y}%`;
                const x2 = `${toNode.x}%`;
                const y2 = `${toNode.y}%`;

                const isBlocked = link.status === 'blocked';
                const isForwarding = link.status === 'forwarding';

                return (
                  <g key={`${link.from}-${link.to}-${idx}`}>
                    {/* Underlying Glow or Active indicator */}
                    <line
                      x1={x1}
                      y1={y1}
                      x2={x2}
                      y2={y2}
                      stroke={isBlocked ? '#f43f5e' : isForwarding ? '#10b981' : '#d97706'}
                      strokeWidth={isBlocked ? 1.5 : 2.5}
                      strokeDasharray={isBlocked ? '4 4' : link.style === 'dashed' ? '6 4' : undefined}
                      strokeOpacity={isBlocked ? 0.4 : 0.75}
                    />

                    {/* Link Label Tag */}
                    {link.label && (
                      <text
                        x={`${(fromNode.x + toNode.x) / 2}%`}
                        y={`${(fromNode.y + toNode.y) / 2 - 2}%`}
                        fill="#94a3b8"
                        fontSize="10"
                        fontFamily="monospace"
                        textAnchor="middle"
                        className="bg-black/60 px-1"
                      >
                        {link.label}
                      </text>
                    )}
                  </g>
                );
              })}
            </svg>

            {/* Nodes Positioned on the Canvas */}
            {nodes.map(node => {
              const isSelected = selectedNode?.id === node.id;
              const isRoot = node.status === 'root';
              const isBlocked = node.status === 'blocked';

              return (
                <div
                  key={node.id}
                  onClick={() => setSelectedNode(node)}
                  style={{
                    left: `${node.x}%`,
                    top: `${node.y}%`,
                    transform: 'translate(-50%, -50%)'
                  }}
                  className={`absolute cursor-pointer flex flex-col items-center group transition-all duration-300 z-10 ${
                    isSelected ? 'scale-110' : 'hover:scale-105'
                  }`}
                >
                  {/* Status Indicator Badges */}
                  {isRoot && (
                    <span className="absolute -top-3.5 px-1.5 py-0.2 rounded-full bg-amber-500 text-black text-[9px] font-black tracking-wider animate-bounce shadow-md">
                      ROOT
                    </span>
                  )}
                  {isBlocked && (
                    <span className="absolute -top-3.5 px-1.5 py-0.2 rounded-full bg-rose-500 text-white text-[9px] font-black tracking-wider shadow-md">
                      BLOCKED
                    </span>
                  )}

                  {/* Device Box Icon */}
                  <div className={`p-2.5 rounded-xl border flex items-center justify-center transition-all shadow-lg ${
                    isSelected
                      ? 'bg-amber-500/20 border-amber-400 text-amber-300 ring-2 ring-amber-500/40'
                      : isRoot
                      ? 'bg-amber-500/15 border-amber-500/50 text-amber-300'
                      : 'bg-slate-900/90 border-slate-700 hover:border-slate-500 text-slate-200'
                  }`}>
                    {renderDeviceIcon(node.role)}
                  </div>

                  {/* Device Label */}
                  <div className="mt-1.5 text-center">
                    <div className="text-[11px] font-bold font-mono text-slate-200 leading-tight flex items-center gap-1 justify-center">
                      <span>{node.label}</span>
                    </div>
                    {node.subLabel && (
                      <div className="text-[9px] font-mono text-slate-400">
                        {node.subLabel}
                      </div>
                    )}
                    {node.ip && (
                      <div className="text-[9px] font-mono text-amber-400/80">
                        {node.ip}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Node Inspector Card */}
          {selectedNode ? (
            <div className="p-3.5 rounded-xl bg-white/[0.03] border border-amber-500/30 flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-amber-500/15 text-amber-400">
                  {renderDeviceIcon(selectedNode.role)}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white font-mono text-sm">{selectedNode.label}</span>
                    <span className="badge badge-accent uppercase text-[10px]">{selectedNode.role || 'Device'}</span>
                    {selectedNode.status && (
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        selectedNode.status === 'root' ? 'bg-amber-500/20 text-amber-300' :
                        selectedNode.status === 'blocked' ? 'bg-rose-500/20 text-rose-300' :
                        'bg-emerald-500/20 text-emerald-300'
                      }`}>
                        {selectedNode.status}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-3 mt-1 font-mono text-[11px] text-slate-400">
                    {selectedNode.ip && <span>IP: <strong className="text-slate-200">{selectedNode.ip}</strong></span>}
                    {selectedNode.mac && <span>MAC: <strong className="text-slate-200">{selectedNode.mac}</strong></span>}
                    {selectedNode.area && <span>OSPF Area: <strong className="text-amber-400">{selectedNode.area}</strong></span>}
                    {selectedNode.asNumber && <span>BGP AS: <strong className="text-cyan-400">{selectedNode.asNumber}</strong></span>}
                    {selectedNode.vlan && <span>VLAN: <strong className="text-emerald-400">{selectedNode.vlan}</strong></span>}
                  </div>
                </div>
              </div>
              <button
                onClick={() => setSelectedNode(null)}
                className="text-[11px] text-slate-400 hover:text-white px-2 py-1 rounded bg-white/[0.04] cursor-pointer"
              >
                {lang === 'ar' ? 'إغلاق' : 'Close'}
              </button>
            </div>
          ) : (
            <div className="text-[11px] text-slate-500 italic text-center py-1">
              {lang === 'ar' ? '💡 انقر على أي جهاز في المخطط لفحص تفاصيل التوجيه والعناوين والواجهات' : '💡 Click on any device to inspect interfaces, IP addresses, and routing roles'}
            </div>
          )}
        </div>
      )}

      {/* -------------------------------------------------------------
          TYPE 2: PACKET / FRAME HEADER DISSECTION
          ------------------------------------------------------------- */}
      {diagram.type === 'header' && (
        <div className="space-y-4">
          {activeTab === 'visual' ? (
            <div className="space-y-3">
              {/* Bit Position Header Scale (0 to 31 bits) */}
              <div className="flex justify-between items-center px-2 text-[10px] font-mono text-slate-500 border-b border-white/[0.06] pb-1">
                <span>Bit 0</span>
                <span>Bit 7</span>
                <span>Bit 15</span>
                <span>Bit 23</span>
                <span>Bit 31</span>
              </div>

              {/* Header Visual Field Blocks */}
              <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-2">
                {headerFields.map((field, idx) => {
                  const isSelected = selectedHeaderField?.name === field.name;
                  return (
                    <button
                      key={idx}
                      onClick={() => setSelectedHeaderField(field)}
                      className={`p-2.5 rounded-xl border text-right transition-all flex flex-col justify-between min-h-[72px] cursor-pointer ${
                        isSelected
                          ? 'bg-amber-500/20 border-amber-400 text-amber-300 ring-2 ring-amber-500/30'
                          : 'bg-white/[0.02] border-white/[0.08] hover:border-amber-500/40 text-slate-300'
                      }`}
                    >
                      <div className="flex items-center justify-between w-full">
                        <span className="font-mono text-[10px] text-amber-400/90 font-bold">{field.bits}</span>
                        {field.byteOffset && (
                          <span className="font-mono text-[9px] text-slate-500">[{field.byteOffset}]</span>
                        )}
                      </div>
                      <div className="font-bold text-xs mt-1 text-white truncate w-full">
                        {field.name}
                      </div>
                      {field.exampleValue && (
                        <div className="font-mono text-[9px] text-emerald-400 truncate mt-0.5">
                          Val: {field.exampleValue}
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Selected Field Explanation */}
              {selectedHeaderField && (
                <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 space-y-2 animate-fadeIn">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Cpu className="w-4 h-4 text-amber-400" />
                      <h5 className="font-bold font-mono text-amber-300 text-sm">{selectedHeaderField.name}</h5>
                      <span className="badge badge-accent font-mono text-[10px]">{selectedHeaderField.bits}</span>
                    </div>
                    {selectedHeaderField.exampleValue && (
                      <span className="font-mono text-xs text-slate-300">
                        {lang === 'ar' ? 'القيمة النموذجية:' : 'Example Value:'} <code className="text-emerald-400">{selectedHeaderField.exampleValue}</code>
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-200 leading-relaxed">
                    {pickText(lang, selectedHeaderField.descAr, selectedHeaderField.descEn)}
                  </p>
                </div>
              )}
            </div>
          ) : (
            /* Table View */
            <div className="overflow-x-auto rounded-xl border border-white/[0.08]">
              <table className="w-full text-xs text-right font-sans">
                <thead className="bg-white/[0.04] text-slate-400 border-b border-white/[0.08]">
                  <tr>
                    <th className="p-2.5 font-bold">{lang === 'ar' ? 'اسم الحقل' : 'Field Name'}</th>
                    <th className="p-2.5 font-bold font-mono">{lang === 'ar' ? 'الحجم' : 'Bits'}</th>
                    <th className="p-2.5 font-bold">{lang === 'ar' ? 'الوظيفة الهندسية والمعيارية' : 'Engineering Purpose'}</th>
                    <th className="p-2.5 font-bold font-mono">{lang === 'ar' ? 'قيمة نموذجية' : 'Example'}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.04]">
                  {headerFields.map((f, i) => (
                    <tr key={i} className="hover:bg-white/[0.02]">
                      <td className="p-2.5 font-bold font-mono text-white">{f.name}</td>
                      <td className="p-2.5 font-mono text-amber-400">{f.bits}</td>
                      <td className="p-2.5 text-slate-300">{pickText(lang, f.descAr, f.descEn)}</td>
                      <td className="p-2.5 font-mono text-emerald-400">{f.exampleValue || '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* -------------------------------------------------------------
          TYPE 3: SEQUENCE & PACKET FLOW LADDER
          ------------------------------------------------------------- */}
      {diagram.type === 'flow' && sequenceSteps.length > 0 && (
        <div className="space-y-4">
          {/* Stepper Navigation */}
          <div className="flex items-center justify-between gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/[0.06]">
            <div className="flex items-center gap-2">
              <span className="caption-text font-bold">
                {lang === 'ar' ? `المرحلة ${activeStepIndex + 1} من ${sequenceSteps.length}` : `Step ${activeStepIndex + 1} of ${sequenceSteps.length}`}
              </span>
              <span className="badge badge-accent font-mono text-xs">
                {currentStep?.protocolPacket}
              </span>
            </div>

            <div className="flex items-center gap-1.5" dir="ltr">
              <button
                onClick={() => setActiveStepIndex(prev => Math.max(0, prev - 1))}
                disabled={activeStepIndex === 0}
                className="px-2.5 py-1.5 rounded-lg bg-white/[0.04] text-slate-300 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed flex items-center gap-1 text-xs cursor-pointer transition-colors border border-white/[0.06]"
                title={lang === 'ar' ? 'المرحلة السابقة' : 'Previous Step'}
              >
                <ChevronLeft className="w-3.5 h-3.5" />
                <span>{lang === 'ar' ? 'السابق' : 'Prev'}</span>
              </button>
              <button
                onClick={() => setActiveStepIndex(prev => Math.min(sequenceSteps.length - 1, prev + 1))}
                disabled={activeStepIndex === sequenceSteps.length - 1}
                className="px-2.5 py-1.5 rounded-lg bg-amber-500/20 text-amber-300 hover:bg-amber-500/30 disabled:opacity-30 disabled:cursor-not-allowed flex items-center gap-1 text-xs font-bold cursor-pointer transition-colors border border-amber-500/30"
                title={lang === 'ar' ? 'المرحلة التالية' : 'Next Step'}
              >
                <span>{lang === 'ar' ? 'التالي' : 'Next'}</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Sequence Visual Ladder */}
          <div className="space-y-2">
            {sequenceSteps.map((step, idx) => {
              const isActive = idx === activeStepIndex;
              return (
                <div
                  key={idx}
                  onClick={() => setActiveStepIndex(idx)}
                  className={`p-3.5 rounded-xl border transition-all cursor-pointer flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 ${
                    isActive
                      ? 'bg-amber-500/15 border-amber-500/40 shadow-lg'
                      : 'bg-white/[0.02] border-white/[0.06] hover:bg-white/[0.04]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-mono font-bold shrink-0 ${
                      isActive ? 'bg-amber-500 text-black' : 'bg-white/[0.06] text-slate-400'
                    }`}>
                      {step.step}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xs text-white">
                          {pickText(lang, step.labelAr, step.labelEn, step.protocolPacket)}
                        </span>
                        <span className="font-mono text-[11px] text-amber-400/90 font-bold bg-amber-500/10 px-1.5 py-0.5 rounded">
                          {step.protocolPacket}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        {pickText(lang, step.detailsAr, step.detailsEn, `${step.fromNode} → ${step.toNode}`)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 font-mono text-xs text-slate-300 self-end sm:self-auto bg-black/40 px-3 py-1 rounded-lg border border-white/[0.06]">
                    <span className="text-amber-400">{step.fromNode}</span>
                    <span>──▶</span>
                    <span className="text-cyan-400">{step.toNode}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
