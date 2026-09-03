import React, { useState } from 'react';
import { Layers, RotateCcw, Play, CheckCircle2, AlertTriangle, Radio, Shield, Network, Terminal } from 'lucide-react';
import { Language } from '../../types';

interface CamEntry {
  port: string;
  mac: string;
  vlan: number;
  type: 'DYNAMIC' | 'STATIC';
  ageSeconds: number;
}

interface SwitchCamSimulatorProps {
  lang?: Language;
}

export const SwitchCamSimulator: React.FC<SwitchCamSimulatorProps> = ({ lang = 'ar' }) => {
  const isEn = lang === 'en';
  const [camTable, setCamTable] = useState<CamEntry[]>([]);
  const [activeAction, setActiveAction] = useState<string>('idle');
  const [highlightPorts, setHighlightPorts] = useState<string[]>([]);
  const [explanationAr, setExplanationAr] = useState<string>(
    'جدول الـ CAM فارغ تماماً (كما عند تشغيل السويتش لأول مرة). جرّب النقر على الأزرار في الأسفل لتشاهد كيف يتعلم السويتش العناوين ديناميكياً.'
  );
  const [explanationEn, setExplanationEn] = useState<string>(
    'The CAM table is initially empty (power-on state). Click the test triggers below to watch how the switch learns MAC addresses dynamically.'
  );

  // Trigger 1: A sends to B when CAM is empty
  const handleHostAtoB = () => {
    setActiveAction('A_to_B_empty');
    setHighlightPorts(['Fa0/1', 'Fa0/2', 'Fa0/3', 'Fa0/4']);
    
    // Add Host A to CAM if not exists
    setCamTable(prev => {
      const exists = prev.some(e => e.mac === '00:00:00:AA:AA:01');
      if (exists) return prev;
      return [
        ...prev,
        { port: 'Fa0/1', mac: '00:00:00:AA:AA:01', vlan: 10, type: 'DYNAMIC', ageSeconds: 1 }
      ];
    });

    setExplanationAr(
      '📥 الخطوة 1: استلم السويتش فريم من Host A على منفذ Fa0/1. قام السويتش فوراً بفحص عنوان المصدر (Source MAC: AA:01) وسجله في جدول الـ CAM على منفذ Fa0/1. ثم فحص عنوان الوجهة (Dest MAC: BB:02) فوجده غير موجود في الجدول، فقام بعملية إفاضة مجهولة (Unknown Unicast Flooding) ونسخ الفريم لجميع المنافذ Fa0/2 و Fa0/3 و Fa0/4!'
    );
    setExplanationEn(
      '📥 Step 1: Switch receives a frame from Host A on port Fa0/1. It examines Source MAC (AA:01) and learns it in CAM associated with Fa0/1. It then inspects Destination MAC (BB:02); finding no entry, it executes Unknown Unicast Flooding, replicating the frame out ports Fa0/2, Fa0/3, and Fa0/4!'
    );
  };

  // Trigger 2: Host B replies to Host A
  const handleHostBReply = () => {
    setActiveAction('B_reply');
    setHighlightPorts(['Fa0/2', 'Fa0/1']);

    setCamTable(prev => {
      const filtered = prev.filter(e => e.mac !== '00:00:00:BB:BB:02');
      return [
        ...filtered,
        { port: 'Fa0/2', mac: '00:00:00:BB:BB:02', vlan: 10, type: 'DYNAMIC', ageSeconds: 1 }
      ];
    });

    setExplanationAr(
      '🎯 الخطوة 2: استلم السويتش رد Host B على منفذ Fa0/2. سجّل السويتش فوراً عنوان المصدر (BB:02) على منفذ Fa0/2. ثم فحص عنوان الوجهة (AA:01) فوجده مسجلاً مسبقاً على Fa0/1، لذلك قام بتمريره مباشرة وبشكل أحادي (Unicast Forwarding) إلى منفذ Fa0/1 فقط دون إزعاج باقي المنافذ!'
    );
    setExplanationEn(
      '🎯 Step 2: Switch receives Host B reply on port Fa0/2. It learns Host B MAC (BB:02) on port Fa0/2. It then inspects Destination MAC (AA:01) and discovers an existing entry on Fa0/1. It forwards the frame via Unicast Forwarding directly to Fa0/1 without disturbing other ports!'
    );
  };

  // Trigger 3: Broadcast frame
  const handleBroadcast = () => {
    setActiveAction('broadcast');
    setHighlightPorts(['Fa0/1', 'Fa0/2', 'Fa0/3', 'Fa0/4']);
    setExplanationAr(
      '📢 بث عام (Broadcast FF:FF:FF:FF:FF:FF): استلم السويتش فريم بث عام من Fa0/1. طبيعة البث تجبر السويتش على نسخ الفريم لجميع المنافذ النشطة في نفس الـ VLAN (Fa0/2, Fa0/3, Fa0/4) ما عدا المنفذ الذي دخل منه الفريم.'
    );
    setExplanationEn(
      '📢 Broadcast (FF:FF:FF:FF:FF:FF): Switch receives an all-ones broadcast frame on Fa0/1. Ethernet switches forward broadcasts out all member ports in the same VLAN (Fa0/2, Fa0/3, Fa0/4), strictly excluding the ingress port.'
    );
  };

  const handleClear = () => {
    setCamTable([]);
    setActiveAction('idle');
    setHighlightPorts([]);
    setExplanationAr('تم تفريغ جدول الـ CAM (Clear MAC-Address-Table). عاد السويتش إلى حالته الأولية.');
    setExplanationEn('CAM table cleared (clear mac address-table dynamic). Switch reset to unpopulated initial state.');
  };

  return (
    <div className={`bg-slate-900/90 rounded-3xl border border-white/[0.08] p-5 sm:p-6 shadow-2xl font-sans backdrop-blur-xl ${isEn ? 'text-left dir-ltr' : 'text-right dir-rtl'}`}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/[0.06] pb-4 mb-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-bold text-white">
              {isEn ? 'Switch Learning & Flooding Engine (CAM Table Simulator)' : 'محاكي تعلم وإفاضة السويتش (CAM Table Simulator)'}
            </h3>
            <p className="text-xs text-slate-400">
              {isEn 
                ? 'Observe how the switch auto-populates MAC bindings and differentiates unicast forwarding from flooding'
                : 'شاهد كيف يحفظ السويتش المنافذ تلقائياً ويميز بين التمرير المباشر والإفاضة (Flooding)'}
            </p>
          </div>
        </div>

        <button
          onClick={handleClear}
          className="px-3 py-1.5 rounded-xl bg-slate-950 hover:bg-slate-800 border border-white/[0.08] text-slate-400 hover:text-slate-200 text-xs font-mono flex items-center gap-1.5 transition-all self-start sm:self-auto cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>{isEn ? 'Clear CAM' : 'تفريغ الـ CAM'}</span>
        </button>
      </div>

      {/* Switch Physical Layout & Ports */}
      <div className="p-5 rounded-2xl bg-slate-950 border border-white/[0.06] mb-5">
        <div className="text-xs font-bold text-slate-400 mb-3 flex items-center justify-between">
          <span>{isEn ? 'Cisco Catalyst Switch (4 Active Ingress Ports):' : 'سويتش سيسكو Catalyst 2960 (4 منافذ نشطة):'}</span>
          <span className="font-mono text-[11px] text-cyan-400">VLAN 10 Active</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono dir-ltr text-left">
          {[
            { port: 'Fa0/1', host: 'Host A', mac: '00:00:00:AA:AA:01', ip: '192.168.1.10' },
            { port: 'Fa0/2', host: 'Host B', mac: '00:00:00:BB:BB:02', ip: '192.168.1.20' },
            { port: 'Fa0/3', host: 'Host C', mac: '00:00:00:CC:CC:03', ip: '192.168.1.30' },
            { port: 'Fa0/4', host: 'Host D', mac: '00:00:00:DD:DD:04', ip: '192.168.1.40' }
          ].map((item) => {
            const isHighlighted = highlightPorts.includes(item.port);
            return (
              <div
                key={item.port}
                className={`p-3 rounded-xl border transition-all ${
                  isHighlighted
                    ? 'bg-amber-500/10 border-amber-500/40 text-amber-300 shadow-lg shadow-amber-500/5'
                    : 'bg-slate-900/60 border-white/[0.04] text-slate-400'
                }`}
              >
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="font-bold text-white">{item.port}</span>
                  <span className="text-[10px] px-1.5 py-0.2 rounded bg-white/[0.05]">{item.host}</span>
                </div>
                <div className="text-[11px] text-cyan-300 truncate font-mono">{item.mac}</div>
                <div className="text-[10px] text-slate-500">{item.ip}</div>
                {isHighlighted && (
                  <div className="mt-2 text-[10px] text-amber-400 flex items-center gap-1 font-sans">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping" />
                    <span>{isEn ? 'Active Frame on Port' : 'فريم نشط بالمنفذ'}</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap items-center gap-2 mb-5">
        <button
          onClick={handleHostAtoB}
          className="px-4 py-2 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/30 text-emerald-300 text-xs font-bold transition-all flex items-center gap-2 cursor-pointer"
        >
          <Play className="w-3.5 h-3.5 fill-current" />
          <span>{isEn ? 'Send Frame: Host A → Host B' : 'إرسال فريم من Host A إلى Host B'}</span>
        </button>

        <button
          onClick={handleHostBReply}
          className="px-4 py-2 rounded-xl bg-cyan-500/15 hover:bg-cyan-500/25 border border-cyan-500/30 text-cyan-300 text-xs font-bold transition-all flex items-center gap-2 cursor-pointer"
        >
          <Play className="w-3.5 h-3.5 fill-current" />
          <span>{isEn ? 'Send Reply: Host B → Host A' : 'رد Host B على Host A'}</span>
        </button>

        <button
          onClick={handleBroadcast}
          className="px-4 py-2 rounded-xl bg-purple-500/15 hover:bg-purple-500/25 border border-purple-500/30 text-purple-300 text-xs font-bold transition-all flex items-center gap-2 cursor-pointer"
        >
          <Radio className="w-3.5 h-3.5" />
          <span>{isEn ? 'Send Broadcast (FF:FF:FF:FF:FF:FF)' : 'إرسال بث عام (Broadcast FF:FF:FF:FF:FF:FF)'}</span>
        </button>
      </div>

      {/* Real-time CAM Table & Narration */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Table View */}
        <div className="lg:col-span-2 p-4 rounded-2xl bg-slate-950 border border-white/[0.06] overflow-x-auto">
          <div className="flex items-center justify-between pb-2 mb-2 border-b border-white/[0.06] text-xs">
            <span className="font-bold text-white flex items-center gap-1.5">
              <Terminal className="w-3.5 h-3.5 text-cyan-400" />
              <span>{isEn ? 'Current CAM Table (show mac address-table):' : 'محتويات جدول الـ CAM الحالي (show mac address-table):'}</span>
            </span>
            <span className="text-[11px] font-mono text-slate-500">
              {isEn ? `${camTable.length} recorded entries` : `${camTable.length} سجلات مسجلة`}
            </span>
          </div>

          <table className={`w-full text-xs font-mono ${isEn ? 'text-left dir-ltr' : 'text-right dir-rtl'}`}>
            <thead>
              <tr className="text-slate-500 border-b border-white/[0.04]">
                <th className="py-2 px-3">VLAN</th>
                <th className="py-2 px-3">MAC Address</th>
                <th className="py-2 px-3">{isEn ? 'Type' : 'النوع (Type)'}</th>
                <th className="py-2 px-3">{isEn ? 'Port' : 'المنفذ (Port)'}</th>
              </tr>
            </thead>
            <tbody>
              {camTable.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-4 text-center text-slate-500 font-sans text-xs">
                    {isEn ? 'CAM Table is currently completely empty.' : 'الجدول فارغ تماماً حالياً.'}
                  </td>
                </tr>
              ) : (
                camTable.map((row) => (
                  <tr key={row.mac} className="border-b border-white/[0.02] text-slate-300">
                    <td className="py-2 px-3 text-cyan-400">{row.vlan}</td>
                    <td className="py-2 px-3 font-bold text-emerald-300 dir-ltr text-left">{row.mac}</td>
                    <td className="py-2 px-3 text-slate-400">{row.type}</td>
                    <td className="py-2 px-3 text-amber-300 font-bold">{row.port}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Cisco Logic Explanation Card */}
        <div className="p-4 rounded-2xl bg-slate-950/80 border border-white/[0.06] text-xs leading-relaxed text-slate-300 flex flex-col justify-between">
          <div>
            <span className="font-bold text-amber-300 block mb-2 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-amber-400" />
              <span>{isEn ? 'Real-Time Forwarding Analysis:' : 'تحليل قرار السويتش الفوري:'}</span>
            </span>
            <p>{isEn ? explanationEn : explanationAr}</p>
          </div>

          <div className="mt-4 pt-3 border-t border-white/[0.04] text-[11px] text-slate-500">
            {isEn 
              ? 'Cisco Golden Rule: The switch learns from the Source MAC, but forwards based on the Destination MAC.'
              : 'قاعدة سيسكو الذهبية: يتعلم السويتش من عنوان المصدر (Source MAC)، بينما يتخذ قرار التمرير بناءً على عنوان الوجهة (Destination MAC).'}
          </div>
        </div>
      </div>
    </div>
  );
};
