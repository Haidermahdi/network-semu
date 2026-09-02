import React, { useState } from 'react';
import { 
  GitCommit, 
  ArrowRight, 
  ArrowLeft, 
  CheckCircle2, 
  Layers, 
  Zap, 
  Radio, 
  FileText, 
  Cpu, 
  Activity,
  Sparkles,
  Info
} from 'lucide-react';
import { PROTOCOL_DEEP_DIVES } from '../data/ciscoCurriculumData';
import { ProtocolDetail } from '../types';

export const ProtocolStateMachine: React.FC = () => {
  const [selectedProtocolKey, setSelectedProtocolKey] = useState<string>('OSPF');
  const [activeStateIndex, setActiveStateIndex] = useState<number>(0);

  const protocol: ProtocolDetail = PROTOCOL_DEEP_DIVES[selectedProtocolKey] || PROTOCOL_DEEP_DIVES.OSPF;
  const states = protocol.stateMachine || [];
  const currentState = states[activeStateIndex] || states[0];

  const handleProtocolChange = (pKey: string) => {
    setSelectedProtocolKey(pKey);
    setActiveStateIndex(0);
  };

  const getDeviceContextLabel = (protoId: string, layer: string): string => {
    if (protoId === 'STP') return 'معالج السويتش (Switch CPU / Control Plane)';
    if (protoId === 'TCP') return 'مكدس البروتوكول ونظام التشغيل (TCP Stack / Host OS)';
    if (protoId === 'ARP') return 'معالج الجهاز أو السويتش (Host NIC / Switch Engine)';
    if (protoId === 'DHCP') return 'محرك العميل والخادم (DHCP Client / Server Engine)';
    if (protoId === 'ICMPv6_NDP') return 'مكدس IPv6 ومعالج الجهاز/الراوتر (IPv6 Stack / Router)';
    if (protoId === 'VXLAN') return 'معالج سويتش الـ Leaf / VTEP (VTEP Switch ASIC)';
    if (layer.toLowerCase().includes('layer 2')) return 'معالج السويتش (Switch CPU / Control Plane)';
    return 'معالج الراوتر (Router CPU / Control Plane)';
  };

  return (
    <div className="space-y-6">
      {/* Protocol Selector Tabs */}
      <div className="p-3 bg-slate-900/90 rounded-2xl border border-slate-800 flex flex-wrap items-center justify-between gap-3 shadow-lg">
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-emerald-400" />
          <span className="text-xs font-bold text-slate-300">محلل آلة الحالات البروتوكولية (Protocol State Machine):</span>
        </div>

        <div className="flex flex-wrap gap-2">
          {Object.keys(PROTOCOL_DEEP_DIVES).map(pKey => {
            const proto = PROTOCOL_DEEP_DIVES[pKey];
            return (
              <button
                key={pKey}
                onClick={() => handleProtocolChange(pKey)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold font-mono transition-all flex items-center gap-1.5 ${
                  selectedProtocolKey === pKey
                    ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg shadow-emerald-600/30'
                    : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800'
                }`}
              >
                <span>{proto.id}</span>
                <span className="text-[10px] opacity-75">({proto.layer.split(' ')[0]})</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Protocol Architecture Specs Header Card */}
      <div className="p-5 rounded-3xl bg-gradient-to-r from-slate-900 via-slate-900/90 to-emerald-950/30 border border-slate-800 shadow-xl space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-mono font-bold">
                {protocol.standard}
              </span>
              <span className="px-2.5 py-0.5 rounded-md bg-slate-950 text-slate-300 border border-slate-800 text-xs font-mono">
                {protocol.layer}
              </span>
              {protocol.adminDistance !== undefined && (
                <span className="px-2.5 py-0.5 rounded-md bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-xs font-mono font-bold">
                  AD = {protocol.adminDistance}
                </span>
              )}
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white mt-2">
              {protocol.name}
            </h2>
            <p className="text-xs text-slate-400 font-mono mt-1">
              الخوارزمية المحركة: <span className="text-emerald-300 font-semibold">{protocol.algorithm}</span>
            </p>
          </div>

          {/* Metric Formula Badge */}
          {protocol.metricEquation && (
            <div className="p-3 rounded-2xl bg-slate-950/80 border border-slate-800 text-xs font-mono max-w-md">
              <div className="text-slate-400 text-[10px] mb-1 font-sans">معادلة حساب التكلفة (Metric Formula):</div>
              <div className="text-amber-300 font-bold leading-relaxed">{protocol.metricEquation}</div>
            </div>
          )}
        </div>
      </div>

      {/* Interactive State Machine Timeline */}
      {states.length > 0 && (
        <div className="p-5 rounded-3xl bg-slate-900/95 border border-slate-800 shadow-xl space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <GitCommit className="w-5 h-5 text-emerald-400" />
              <h3 className="text-sm font-bold text-white">
                تتابع حالات البروتوكول ومراحل التقارب (Finite State Machine Transitions):
              </h3>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setActiveStateIndex(prev => Math.max(0, prev - 1))}
                disabled={activeStateIndex === 0}
                className="p-2 rounded-xl bg-slate-950 hover:bg-slate-800 disabled:opacity-30 text-slate-300 border border-slate-800 transition-colors text-xs font-bold flex items-center gap-1"
              >
                <ArrowRight className="w-4 h-4" />
                <span>الحالة السابقة</span>
              </button>

              <button
                onClick={() => setActiveStateIndex(prev => Math.min(states.length - 1, prev + 1))}
                disabled={activeStateIndex === states.length - 1}
                className="p-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-30 text-white transition-colors text-xs font-bold flex items-center gap-1 shadow-lg shadow-emerald-600/30"
              >
                <span>الحالة التالية</span>
                <ArrowLeft className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Stepper Visual Ribbon */}
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2">
            {states.map((st, idx) => (
              <button
                key={st.state}
                onClick={() => setActiveStateIndex(idx)}
                className={`p-3 rounded-2xl border text-right transition-all flex flex-col justify-between h-24 ${
                  activeStateIndex === idx
                    ? 'bg-emerald-950/90 border-emerald-500 text-white shadow-lg shadow-emerald-500/20 ring-1 ring-emerald-500'
                    : activeStateIndex > idx
                      ? 'bg-slate-950/80 border-slate-800 text-slate-300 hover:border-slate-700'
                      : 'bg-slate-950/40 border-slate-900 text-slate-500 opacity-60'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="w-5 h-5 rounded-full bg-slate-800 text-[11px] font-mono font-bold flex items-center justify-center">
                    {idx + 1}
                  </span>
                  {activeStateIndex === idx && (
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                  )}
                </div>
                <div className="font-mono text-xs font-bold truncate mt-2">
                  {st.state.split('. ')[1] || st.state}
                </div>
              </button>
            ))}
          </div>

          {/* Active State Deep Detail Card */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="text-xs text-emerald-400 font-bold flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" />
                <span>ماذا يحدث داخل {getDeviceContextLabel(protocol.id, protocol.layer)} في هذه الحالة ({currentState.state})؟</span>
              </div>
              <p className="text-xs text-slate-200 leading-relaxed font-sans">
                {currentState.descAr}
              </p>
            </div>

            <div className="space-y-2 border-t md:border-t-0 md:border-r border-slate-800 md:pr-4 pt-2 md:pt-0">
              <div className="text-xs text-amber-400 font-bold flex items-center gap-1.5">
                <Zap className="w-4 h-4" />
                <span>الشرط والحزمة المحفزة للانتقال للحالة التالية (Transition Trigger):</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed font-sans bg-slate-900/60 p-2.5 rounded-xl border border-slate-800/80">
                {currentState.triggerAr}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Packet Types & Header Matrix */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Packet Types Table */}
        <div className="lg:col-span-6 p-5 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-3">
          <div className="flex items-center gap-2 text-sm font-bold text-white">
            <FileText className="w-4 h-4 text-cyan-400" />
            <span>أنواع الحزم المعيارية (Protocol Packet Types):</span>
          </div>

          <div className="space-y-2">
            {protocol.packetTypes.map((pt, idx) => (
              <div key={idx} className="p-3 rounded-xl bg-slate-950/80 border border-slate-800/80 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-cyan-300">{pt.name}</span>
                  {pt.opcode && (
                    <span className="px-2 py-0.5 rounded bg-slate-900 text-slate-400 text-[10px] font-mono border border-slate-800">
                      {pt.opcode}
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">{pt.purposeAr}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Header Structure & Bit Allocation */}
        <div className="lg:col-span-6 p-5 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-3">
          <div className="flex items-center gap-2 text-sm font-bold text-white">
            <Layers className="w-4 h-4 text-amber-400" />
            <span>تشريح ترويسة البروتوكول بالبتات (Header Structure):</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-right">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 text-[11px]">
                  <th className="pb-2 font-mono">الحقل (Field)</th>
                  <th className="pb-2 font-mono text-center">الحجم (Bits/Bytes)</th>
                  <th className="pb-2">الوظيفة والوصف المعياري</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/50 font-sans">
                {protocol.headerStructure.map((hf, idx) => (
                  <tr key={idx} className="hover:bg-slate-950/40">
                    <td className="py-2.5 font-mono font-bold text-amber-300">{hf.field}</td>
                    <td className="py-2.5 font-mono text-slate-400 text-center">{hf.bits}</td>
                    <td className="py-2.5 text-slate-300 text-[11px] leading-relaxed">{hf.descAr}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Cisco Configuration Snippet & Real-World Parallels */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Cisco CLI Config */}
        <div className="lg:col-span-6 p-5 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm font-bold text-white">
              <Cpu className="w-4 h-4 text-emerald-400" />
              <span>نموذج إعدادات سيسكو المعتمدة (Cisco IOS Configuration):</span>
            </div>
          </div>

          <pre className="p-3.5 rounded-2xl bg-slate-950 font-mono text-xs text-emerald-300 border border-slate-800 whitespace-pre-wrap dir-ltr text-left leading-relaxed">
            {protocol.ciscoConfigSnippet}
          </pre>
        </div>

        {/* Real-World Metaphor */}
        <div className="lg:col-span-6 p-5 rounded-3xl bg-gradient-to-br from-slate-900 to-indigo-950/40 border border-indigo-500/30 shadow-xl space-y-3">
          <div className="flex items-center gap-2 text-sm font-bold text-indigo-300">
            <Sparkles className="w-4 h-4 text-indigo-400" />
            <span>التشبيه الهندسي من الواقع المعاش (Real-World Metaphor):</span>
          </div>

          <p className="text-xs text-slate-200 leading-relaxed bg-slate-950/70 p-3.5 rounded-2xl border border-slate-800">
            {protocol.realWorldAnalogyAr}
          </p>
        </div>
      </div>
    </div>
  );
};
