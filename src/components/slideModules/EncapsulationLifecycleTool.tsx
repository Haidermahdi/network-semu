import React, { useState } from 'react';
import { Layers, ArrowRight, ShieldAlert, Lock, RefreshCw, CheckCircle2, AlertTriangle } from 'lucide-react';
import { Language } from '../../types';

interface HopDetails {
  hopNumber: number;
  hopName: string;
  hopNameEn: string;
  fromDevice: string;
  toDevice: string;
  l2SrcMac: string;
  l2DstMac: string;
  l3SrcIp: string;
  l3DstIp: string;
  ttl: number;
  checksumStatus: string;
  checksumStatusEn: string;
}

const HOPS: HopDetails[] = [
  {
    hopNumber: 1,
    hopName: 'القفزة الأولى: من حاسوب المصدر إلى الراوتر الأول',
    hopNameEn: 'Hop 1: Host A to First-Hop Default Gateway (R1)',
    fromDevice: 'Host A (192.168.1.10)',
    toDevice: 'Router 1 (Default Gateway Gi0/0)',
    l2SrcMac: '00:1A:2B:3C:4D:5E (Host A MAC)',
    l2DstMac: 'AA:BB:CC:11:22:01 (R1 Gi0/0 MAC)',
    l3SrcIp: '192.168.1.10',
    l3DstIp: '172.16.1.100',
    ttl: 64,
    checksumStatus: 'تم حسابه لأول مرة (Initial Checksum)',
    checksumStatusEn: 'Initial calculated IPv4 checksum'
  },
  {
    hopNumber: 2,
    hopName: 'القفزة الثانية: عبر كابل الفايبر/WAN بين الراوترات',
    hopNameEn: 'Hop 2: WAN Core Fiber Link between R1 and R2',
    fromDevice: 'Router 1 (Gi0/1)',
    toDevice: 'Router 2 (Gi0/0)',
    l2SrcMac: 'AA:BB:CC:11:22:02 (R1 Gi0/1 MAC)',
    l2DstMac: 'DD:EE:FF:33:44:01 (R2 Gi0/0 MAC)',
    l3SrcIp: '192.168.1.10',
    l3DstIp: '172.16.1.100',
    ttl: 63,
    checksumStatus: 'أعيد حسابه لتغير الـ TTL (Recalculated)',
    checksumStatusEn: 'Checksum recalculated due to TTL decrement'
  },
  {
    hopNumber: 3,
    hopName: 'القفزة الثالثة: من الراوتر الثاني إلى السيرفر النهائي',
    hopNameEn: 'Hop 3: Egress Router (R2) to Destination Cloud Server',
    fromDevice: 'Router 2 (Gi0/1)',
    toDevice: 'Cloud Server (172.16.1.100)',
    l2SrcMac: 'DD:EE:FF:33:44:02 (R2 Gi0/1 MAC)',
    l2DstMac: '77:88:99:AA:BB:CC (Server MAC)',
    l3SrcIp: '192.168.1.10',
    l3DstIp: '172.16.1.100',
    ttl: 62,
    checksumStatus: 'أعيد حسابه مجدداً لتغير الـ TTL',
    checksumStatusEn: 'Recalculated again on R2 forward'
  }
];

interface EncapsulationLifecycleToolProps {
  lang?: Language;
}

export const EncapsulationLifecycleTool: React.FC<EncapsulationLifecycleToolProps> = ({ lang = 'ar' }) => {
  const isEn = lang === 'en';
  const [activeHopIndex, setActiveHopIndex] = useState(0);
  const [ttlZeroSimulated, setTtlZeroSimulated] = useState(false);

  const currentHop = HOPS[activeHopIndex];

  return (
    <div className={`bg-slate-900/90 rounded-3xl border border-white/[0.08] p-5 sm:p-6 shadow-2xl font-sans backdrop-blur-xl ${isEn ? 'text-left dir-ltr' : 'text-right dir-rtl'}`}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/[0.06] pb-4 mb-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-bold text-white">
              {isEn 
                ? 'Hop-by-Hop L2 Frame Rewriting & TTL Decrement Lifecycle'
                : 'محاكي إعادة تغليف الفريم وحركة الـ TTL (Hop-by-Hop Rewriting)'}
            </h3>
            <p className="text-xs text-slate-400">
              {isEn 
                ? 'Golden Rule: MAC addresses change at every routed hop; IP addresses remain constant end-to-end'
                : 'القاعدة الذهبية: عناوين الـ MAC تتغير عند كل راوتر، بينما الـ IP يبقى ثابتاً تماماً'}
            </p>
          </div>
        </div>

        {/* Hop Tabs */}
        <div className="flex items-center gap-1.5 self-start sm:self-auto text-xs font-mono">
          {HOPS.map((hop, index) => (
            <button
              key={hop.hopNumber}
              onClick={() => {
                setActiveHopIndex(index);
                setTtlZeroSimulated(false);
              }}
              className={`px-3 py-1.5 rounded-xl border transition-all cursor-pointer ${
                activeHopIndex === index
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 font-bold'
                  : 'bg-slate-950 text-slate-400 border-white/[0.06] hover:text-slate-200'
              }`}
            >
              {isEn ? `Hop ${hop.hopNumber}` : `القفزة ${hop.hopNumber}`}
            </button>
          ))}
        </div>
      </div>

      {/* Path Breadcrumb */}
      <div className="p-3.5 rounded-2xl bg-slate-950 border border-white/[0.06] mb-5 flex flex-wrap items-center justify-between gap-2 text-xs font-mono">
        <div className="text-slate-400 font-sans">
          {isEn ? 'Current Segment: ' : 'المسار الحالي: '}
          <strong className="text-white">{isEn ? currentHop.hopNameEn : currentHop.hopName}</strong>
        </div>
        <div className="flex items-center gap-2 text-slate-300 dir-ltr">
          <span className="px-2 py-0.5 rounded bg-white/[0.05]">{currentHop.fromDevice}</span>
          <ArrowRight className="w-3.5 h-3.5 text-amber-400" />
          <span className="px-2 py-0.5 rounded bg-white/[0.05] text-cyan-300">{currentHop.toDevice}</span>
        </div>
      </div>

      {/* Frame Inspection Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
        {/* Layer 2: Changes */}
        <div className="p-4 rounded-2xl bg-amber-950/20 border border-amber-500/30">
          <div className="flex items-center justify-between pb-2 mb-3 border-b border-amber-500/20">
            <span className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              <span>
                {isEn 
                  ? 'Layer 2 Header (Rewritten completely at every router):'
                  : 'ترويسة الطبقة الثانية L2 (تتغير بالكامل عند كل راوتر!):'}
              </span>
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-mono">
              Hop-by-Hop
            </span>
          </div>

          <div className="space-y-2.5 font-mono text-xs dir-ltr text-left">
            <div className="p-2.5 rounded-xl bg-slate-950/80 border border-white/[0.06]">
              <span className="text-slate-500 text-[10px] block">
                {isEn ? 'Source MAC (Rewritten):' : 'Source MAC (تغير!):'}
              </span>
              <span className="text-amber-300 font-bold">{currentHop.l2SrcMac}</span>
            </div>

            <div className="p-2.5 rounded-xl bg-slate-950/80 border border-white/[0.06]">
              <span className="text-slate-500 text-[10px] block">
                {isEn ? 'Destination MAC (Rewritten):' : 'Destination MAC (تغير!):'}
              </span>
              <span className="text-amber-300 font-bold">{currentHop.l2DstMac}</span>
            </div>
          </div>
        </div>

        {/* Layer 3: Stays Constant */}
        <div className="p-4 rounded-2xl bg-cyan-950/20 border border-cyan-500/30">
          <div className="flex items-center justify-between pb-2 mb-3 border-b border-cyan-500/20">
            <span className="text-xs font-bold text-cyan-300 flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-cyan-400" />
              <span>
                {isEn 
                  ? 'Layer 3 Header (Constant from source to destination):'
                  : 'ترويسة الطبقة الثالثة L3 (ثابتة تماماً من البداية للنهاية):'}
              </span>
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 font-mono">
              End-to-End
            </span>
          </div>

          <div className="space-y-2.5 font-mono text-xs dir-ltr text-left">
            <div className="p-2.5 rounded-xl bg-slate-950/80 border border-white/[0.06]">
              <span className="text-slate-500 text-[10px] block">
                {isEn ? 'Source IP (Preserved 🔒):' : 'Source IP (مغلق ومحمي 🔒):'}
              </span>
              <span className="text-cyan-300 font-bold">{currentHop.l3SrcIp}</span>
            </div>

            <div className="p-2.5 rounded-xl bg-slate-950/80 border border-white/[0.06]">
              <span className="text-slate-500 text-[10px] block">
                {isEn ? 'Destination IP (Preserved 🔒):' : 'Destination IP (مغلق ومحمي 🔒):'}
              </span>
              <span className="text-cyan-300 font-bold">{currentHop.l3DstIp}</span>
            </div>
          </div>
        </div>
      </div>

      {/* TTL & Checksum Sub-panel */}
      <div className="p-4 rounded-2xl bg-slate-950 border border-white/[0.06] mb-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-4 font-mono">
            <div>
              <span className="text-slate-500 text-[11px] block">
                {isEn ? 'Current TTL Value:' : 'قيمة الـ TTL الحالية:'}
              </span>
              <span className={`text-lg font-bold ${currentHop.ttl <= 62 ? 'text-amber-400' : 'text-emerald-400'}`}>
                {ttlZeroSimulated ? 0 : currentHop.ttl}
              </span>
            </div>
            <div className={`border-${isEn ? 'l pl-4' : 'r pr-4'} border-white/[0.1]`}>
              <span className="text-slate-500 text-[11px] block">IP Header Checksum:</span>
              <span className="text-slate-300 font-sans text-xs">
                {isEn ? currentHop.checksumStatusEn : currentHop.checksumStatus}
              </span>
            </div>
          </div>

          <button
            onClick={() => setTtlZeroSimulated(!ttlZeroSimulated)}
            className="px-3.5 py-2 rounded-xl bg-rose-500/15 hover:bg-rose-500/25 border border-rose-500/30 text-rose-300 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>
              {ttlZeroSimulated 
                ? (isEn ? 'Reset TTL Simulation' : 'إلغاء المحاكاة') 
                : (isEn ? 'Simulate TTL Expiry to 0 (Packet Dropped)' : 'تجربة وصول TTL إلى 0 (إسقاط الحزمة)')}
            </span>
          </button>
        </div>

        {ttlZeroSimulated && (
          <div className="mt-3 p-3.5 rounded-xl bg-rose-950/30 border border-rose-500/40 text-rose-200 text-xs leading-relaxed">
            <strong>{isEn ? '⚠️ Packet Dropped (TTL = 0)!' : '⚠️ تم إسقاط الحزمة (Packet Dropped)!'}</strong>
            <p className="mt-1">
              {isEn ? (
                <>
                  When the router received the packet with TTL = 1, it decremented it to 0. RFC standards forbid forwarding any packet with TTL = 0 to prevent perpetual loops. The router discards the packet immediately and transmits an 
                  <span className="font-mono font-bold text-rose-300 mx-1">ICMP Type 11 Code 0 (Time-to-Live Exceeded in Transit)</span> 
                  message back to the source host. This exact mechanism is what empowers the <span className="font-mono text-cyan-300">traceroute</span> tool to map out intermediate routers!
                </>
              ) : (
                <>
                  عندما استلم الراوتر الحزمة وجد أن TTL = 1، فأنقصها إلى 0. تمنع قواعد شبكات سيسكو والـ RFC تمرير أي حزمة بـ TTL=0 لمنع الحلقات المفرغة (Routing Loops). يقوم الراوتر بإتلاف الحزمة فوراً وإرسال رسالة 
                  <span className="font-mono font-bold text-rose-300 mx-1">ICMP Type 11 Code 0 (Time Exceeded)</span> 
                  إلى الحاسوب المصدر. وهذه هي الخدعة الذكية التي يعتمد عليها أمر <span className="font-mono text-cyan-300">traceroute</span> لاكتشاف الراوترات!
                </>
              )}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
