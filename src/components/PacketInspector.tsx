import React from 'react';
import { motion } from 'motion/react';
import { 
  Layers, 
  Binary, 
  Clock, 
  ShieldCheck, 
  ArrowRightLeft, 
  CheckCircle2, 
  AlertTriangle,
  FileCode,
  Tag,
  Radio,
  Network
} from 'lucide-react';
import { PacketHeaders, SimulationStep } from '../types';

interface PacketInspectorProps {
  currentStep?: SimulationStep;
}

export const PacketInspector: React.FC<PacketInspectorProps> = ({ currentStep }) => {
  if (!currentStep) return null;

  const { headers, explanation, highlightEvent, stageTitleAr, stageDescriptionAr } = currentStep;

  return (
    <div className="w-full bg-slate-900/90 rounded-2xl border border-slate-800 p-4 sm:p-5 shadow-xl">
      {/* Header & Step Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3 mb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 text-xs font-bold font-mono">
              Step #{currentStep.id}
            </span>
            <span className="text-xs text-slate-400 font-mono">
              [{currentStep.layer}]
            </span>
          </div>
          <h3 className="text-base sm:text-lg font-bold text-slate-100 mt-1">
            {stageTitleAr}
          </h3>
        </div>

        {/* Dynamic Event Badge */}
        {highlightEvent && (
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-indigo-950/80 border border-indigo-500/40 text-indigo-300 text-xs font-bold self-start sm:self-auto">
            {highlightEvent === 'mac_rewrite' && <ArrowRightLeft className="w-3.5 h-3.5 text-amber-400" />}
            {highlightEvent === 'ttl_decrement' && <Clock className="w-3.5 h-3.5 text-rose-400" />}
            {highlightEvent === 'arp_broadcast' && <Radio className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />}
            {highlightEvent === 'mac_learned' && <Network className="w-3.5 h-3.5 text-emerald-400" />}
            {highlightEvent === 'destination_reached' && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
            
            <span>
              {highlightEvent === 'mac_rewrite' && '🔄 تم تبديل عنوان الـ MAC'}
              {highlightEvent === 'ttl_decrement' && '⏳ تم إنقاص عداد الـ TTL (-1)'}
              {highlightEvent === 'arp_broadcast' && '📢 بث عام لبروتوكول ARP'}
              {highlightEvent === 'mac_learned' && '🧠 السويتش تعلم الـ MAC في جدول CAM'}
              {highlightEvent === 'destination_reached' && '🎯 وصول ناجح للمستلم'}
            </span>
          </div>
        )}
      </div>

      {/* Description text */}
      <p className="text-sm text-slate-300 leading-relaxed mb-4 bg-slate-950/60 p-3 rounded-xl border border-slate-800/80">
        {stageDescriptionAr}
      </p>

      {/* 2-Column Inspection Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Layer 2: Ethernet Frame Box */}
        <div className="p-3.5 rounded-xl bg-slate-950/80 border border-emerald-500/30">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-2.5">
            <div className="flex items-center gap-1.5 text-emerald-400 font-bold text-xs sm:text-sm">
              <Layers className="w-4 h-4" />
              <span>Layer 2: فريم الإيثرنت (Ethernet Frame)</span>
            </div>
            <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800 font-mono">
              Hop-by-Hop (محلي)
            </span>
          </div>

          <div className="space-y-2 text-xs font-mono">
            <div className="flex items-center justify-between p-1.5 rounded bg-slate-900/90 border border-slate-800">
              <span className="text-slate-400">Destination MAC:</span>
              <span className="text-emerald-300 font-bold text-right truncate max-w-[200px]" title={headers.l2.destMac}>
                {headers.l2.destMac}
              </span>
            </div>
            <div className="flex items-center justify-between p-1.5 rounded bg-slate-900/90 border border-slate-800">
              <span className="text-slate-400">Source MAC:</span>
              <span className="text-cyan-300 font-bold text-right truncate max-w-[200px]" title={headers.l2.srcMac}>
                {headers.l2.srcMac}
              </span>
            </div>
            <div className="flex items-center justify-between p-1.5 rounded bg-slate-900/90 border border-slate-800">
              <span className="text-slate-400">EtherType:</span>
              <span className="text-slate-300">{headers.l2.etherType}</span>
            </div>
          </div>
        </div>

        {/* Layer 3: IPv4 Packet Box */}
        <div className="p-3.5 rounded-xl bg-slate-950/80 border border-indigo-500/30">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-2.5">
            <div className="flex items-center gap-1.5 text-indigo-400 font-bold text-xs sm:text-sm">
              <Binary className="w-4 h-4" />
              <span>Layer 3: حزمة الـ IP (IPv4 Packet)</span>
            </div>
            <span className="text-[10px] px-2 py-0.5 rounded bg-indigo-950 text-indigo-300 border border-indigo-800 font-mono">
              End-to-End (عالمي)
            </span>
          </div>

          <div className="space-y-2 text-xs font-mono">
            <div className="flex items-center justify-between p-1.5 rounded bg-slate-900/90 border border-slate-800">
              <span className="text-slate-400">Destination IP:</span>
              <span className="text-indigo-300 font-bold text-right">{headers.l3.destIp}</span>
            </div>
            <div className="flex items-center justify-between p-1.5 rounded bg-slate-900/90 border border-slate-800">
              <span className="text-slate-400">Source IP:</span>
              <span className="text-cyan-300 font-bold text-right">{headers.l3.srcIp}</span>
            </div>
            <div className="flex items-center justify-between p-1.5 rounded bg-slate-900/90 border border-slate-800">
              <span className="text-slate-400">TTL (Time to Live):</span>
              <div className="flex items-center gap-2">
                <span className={`font-bold ${headers.l3.ttl <= 62 ? 'text-rose-400' : 'text-amber-400'}`}>
                  {headers.l3.ttl}
                </span>
                <div className="w-16 h-2 rounded-full bg-slate-800 overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-emerald-500 to-indigo-500 rounded-full transition-all duration-300"
                    style={{ width: `${(headers.l3.ttl / 64) * 100}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Golden Observation Banner */}
      {explanation && (
        <div className="mt-4 p-3 rounded-xl bg-amber-950/30 border border-amber-500/30 flex items-start gap-2.5">
          <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <div className="text-xs sm:text-sm text-amber-200/90">
            <strong className="text-amber-300 font-bold">الملاحظة الذهبية في هذه الخطوة: </strong>
            {typeof explanation === 'string' ? explanation : (explanation.keyObservation || explanation.whatIsHappening || '')}
          </div>
        </div>
      )}
    </div>
  );
};
