import React, { useState } from 'react';
import { Binary, Radio, ShieldCheck, AlertCircle, RefreshCw, FileText, CheckCircle2, ArrowRight } from 'lucide-react';
import { Language } from '../../types';

interface ArpDissectorToolProps {
  lang?: Language;
}

export const ArpDissectorTool: React.FC<ArpDissectorToolProps> = ({ lang = 'ar' }) => {
  const isEn = lang === 'en';
  const [packetType, setPacketType] = useState<'request' | 'reply' | 'garp'>('request');

  return (
    <div className={`bg-slate-900/90 rounded-3xl border border-white/[0.08] p-5 sm:p-6 shadow-2xl font-sans backdrop-blur-xl ${isEn ? 'text-left dir-ltr' : 'text-right dir-rtl'}`}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/[0.06] pb-4 mb-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
            <Binary className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-bold text-white">
              {isEn ? 'RFC 826 ARP Packet Dissector & Wireshark Field Analysis' : 'محلل حزم بروتوكول ARP (RFC 826 Packet Dissector)'}
            </h3>
            <p className="text-xs text-slate-400">
              {isEn 
                ? 'Inspect the true raw fields of an ARP payload exactly as captured in Wireshark analyzers'
                : 'استكشف الحقول الحقيقية لحزمة الـ ARP كما تظهر تماماً في برنامج Wireshark'}
            </p>
          </div>
        </div>

        {/* Packet Mode Selector */}
        <div className="flex flex-wrap items-center gap-1.5 self-start sm:self-auto text-xs font-mono">
          <button
            onClick={() => setPacketType('request')}
            className={`px-3 py-1.5 rounded-xl border transition-all cursor-pointer ${
              packetType === 'request'
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/30 font-bold'
                : 'bg-slate-950 text-slate-400 border-white/[0.06] hover:text-slate-200'
            }`}
          >
            {isEn ? 'ARP Request (Broadcast)' : 'طلب ARP Request (بث عام)'}
          </button>
          <button
            onClick={() => setPacketType('reply')}
            className={`px-3 py-1.5 rounded-xl border transition-all cursor-pointer ${
              packetType === 'reply'
                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30 font-bold'
                : 'bg-slate-950 text-slate-400 border-white/[0.06] hover:text-slate-200'
            }`}
          >
            {isEn ? 'ARP Reply (Unicast)' : 'رد ARP Reply (أحادي Unicast)'}
          </button>
          <button
            onClick={() => setPacketType('garp')}
            className={`px-3 py-1.5 rounded-xl border transition-all cursor-pointer ${
              packetType === 'garp'
                ? 'bg-purple-500/20 text-purple-300 border-purple-500/30 font-bold'
                : 'bg-slate-950 text-slate-400 border-white/[0.06] hover:text-slate-200'
            }`}
          >
            {isEn ? 'Gratuitous ARP (GARP)' : 'ARP المجاني (GARP)'}
          </button>
        </div>
      </div>

      {/* Layer 2 Frame Enclosure Header */}
      <div className="p-3.5 rounded-2xl bg-slate-950 border border-white/[0.06] mb-4 text-xs font-mono dir-ltr text-left">
        <span className={`text-slate-400 text-[11px] block mb-1 font-sans ${isEn ? 'text-left dir-ltr' : 'text-right dir-rtl'}`}>
          {isEn 
            ? 'Enclosing Ethernet II Frame Header (Layer 2 Outer Carrier):'
            : 'إطار الإيثرنت الخارجي الحامل لحزمة الـ ARP (Layer 2 Ethernet II Header):'}
        </span>
        <div className="flex flex-wrap items-center gap-3">
          <div className="p-2 rounded-xl bg-slate-900 border border-white/[0.04]">
            <span className="text-slate-500 text-[10px] block">Destination MAC:</span>
            <span className={`font-bold ${packetType === 'reply' ? 'text-cyan-300' : 'text-amber-400'}`}>
              {packetType === 'reply' ? '00:1A:2B:3C:4D:5E (Host A)' : 'FF:FF:FF:FF:FF:FF (Broadcast)'}
            </span>
          </div>

          <div className="p-2 rounded-xl bg-slate-900 border border-white/[0.04]">
            <span className="text-slate-500 text-[10px] block">Source MAC:</span>
            <span className="text-emerald-400 font-bold">
              {packetType === 'reply' ? '00:9F:8E:7D:6C:5B (Host B)' : '00:1A:2B:3C:4D:5E (Host A)'}
            </span>
          </div>

          <div className="p-2 rounded-xl bg-slate-900 border border-white/[0.04]">
            <span className="text-slate-500 text-[10px] block">EtherType:</span>
            <span className="text-purple-300 font-bold">0x0806 (ARP)</span>
          </div>
        </div>
      </div>

      {/* Actual 28-Byte ARP Packet Body Dissection */}
      <div className="p-4 sm:p-5 rounded-2xl bg-slate-950/80 border border-white/[0.06] mb-5">
        <div className="text-xs font-bold text-slate-300 mb-3 flex items-center justify-between">
          <span>
            {isEn 
              ? 'RFC 826 Protocol Payload Breakdown (28-Byte Structure):' 
              : 'تشريح محتويات بايتات حزمة الـ ARP الداخلية (28 بايت):'}
          </span>
          <span className="font-mono text-[11px] text-cyan-400">
            Opcode: {packetType === 'request' ? '1 (Request)' : packetType === 'reply' ? '2 (Reply)' : '1 (Request / Announce)'}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 text-xs font-mono dir-ltr text-left">
          <div className="p-3 rounded-xl bg-slate-900 border border-white/[0.04]">
            <div className="text-slate-500 text-[10px]">Hardware Type:</div>
            <div className="text-cyan-300 font-bold mt-0.5">1 (Ethernet - 0x0001)</div>
          </div>

          <div className="p-3 rounded-xl bg-slate-900 border border-white/[0.04]">
            <div className="text-slate-500 text-[10px]">Protocol Type:</div>
            <div className="text-cyan-300 font-bold mt-0.5">0x0800 (IPv4)</div>
          </div>

          <div className="p-3 rounded-xl bg-slate-900 border border-white/[0.04]">
            <div className="text-slate-500 text-[10px]">Hardware / Protocol Size:</div>
            <div className="text-slate-200 font-bold mt-0.5">6 Bytes / 4 Bytes</div>
          </div>

          <div className={`p-3 rounded-xl border ${
            packetType === 'reply' ? 'bg-emerald-950/30 border-emerald-500/30 text-emerald-300' : 'bg-amber-950/30 border-amber-500/30 text-amber-300'
          }`}>
            <div className="text-[10px] opacity-75">Opcode:</div>
            <div className="font-bold mt-0.5 font-mono">
              {packetType === 'reply' ? '0x0002 (Reply)' : '0x0001 (Request)'}
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-900 border border-white/[0.04]">
            <div className="text-slate-500 text-[10px]">Sender Hardware Addr (MAC):</div>
            <div className="text-emerald-400 font-bold mt-0.5">
              {packetType === 'reply' ? '00:9F:8E:7D:6C:5B' : '00:1A:2B:3C:4D:5E'}
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-900 border border-white/[0.04]">
            <div className="text-slate-500 text-[10px]">Sender Protocol Addr (IP):</div>
            <div className="text-cyan-400 font-bold mt-0.5">
              {packetType === 'reply' ? '192.168.1.50' : '192.168.1.10'}
            </div>
          </div>

          <div className={`p-3 rounded-xl border ${
            packetType === 'request'
              ? 'bg-rose-950/20 border-rose-500/30 text-rose-300'
              : 'bg-slate-900 border-white/[0.04] text-slate-200'
          }`}>
            <div className="text-[10px] opacity-75">Target Hardware Addr (MAC):</div>
            <div className="font-bold mt-0.5">
              {packetType === 'request' ? (
                <span className="text-rose-400 font-bold">00:00:00:00:00:00 ({isEn ? 'Unknown!' : 'المجهول!'})</span>
              ) : packetType === 'reply' ? (
                '00:1A:2B:3C:4D:5E'
              ) : (
                '00:00:00:00:00:00'
              )}
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-900 border border-white/[0.04]">
            <div className="text-slate-500 text-[10px]">Target Protocol Addr (IP):</div>
            <div className="text-indigo-400 font-bold mt-0.5">
              {packetType === 'garp' ? `192.168.1.10 (${isEn ? 'Self!' : 'نفسه!'})` : packetType === 'reply' ? '192.168.1.10' : '192.168.1.50'}
            </div>
          </div>
        </div>
      </div>

      {/* Real-world Technical Insight */}
      <div className="p-4 rounded-2xl bg-amber-500/[0.08] border border-amber-500/25 text-xs sm:text-sm text-amber-200/90 leading-relaxed">
        <strong className="text-amber-300 font-bold block mb-1">
          {packetType === 'request' && (isEn ? '💡 The Target MAC Secret in ARP Request:' : '💡 سر حقل Target MAC في طلب الـ ARP:')}
          {packetType === 'reply' && (isEn ? '💡 The Unicast Nature of ARP Reply:' : '💡 سر رد الـ ARP Reply:')}
          {packetType === 'garp' && (isEn ? '💡 Gratuitous ARP (GARP) & IP Conflict Detection:' : '💡 سحر الـ Gratuitous ARP (GARP):')}
        </strong>
        {packetType === 'request' && (
          isEn
            ? 'Notice that the Target Hardware Address is set to all zeros (00:00:00:00:00:00) because the sending host does not know it yet! In contrast, the outer Ethernet frame header uses FF:FF:FF:FF:FF:FF broadcast so every host on the Layer 2 LAN receives and evaluates the query.'
            : 'لاحظ أن حقل Target MAC يوضع فيه أصفار كاملة (00:00:00:00:00:00) لأن جهازك يجهل عنوان الماك ويريد معرفته! بينما في ترويسة الإيثرنت الخارجية يوضع FF:FF:FF:FF:FF:FF لكي يستلم جميع الأجهزة في الـ LAN هذه الحزمة.'
        )}
        {packetType === 'reply' && (
          isEn
            ? 'An ARP Reply is strictly UNICAST! It is never flooded or broadcasted. It targets the requester MAC directly because the answering host learned the requester MAC from the incoming ARP Request header.'
            : 'رد الـ ARP Reply لا يكون بثاً عاماً إطلاقاً؛ بل يكون موجه أحادي (Unicast) مباشرة إلى عنوان MAC الجهاز الطالب فقط، لأن الجهاز المستجيب علم مسبقاً بعنوان MAC الطالب من حزمة الطلب!'
        )}
        {packetType === 'garp' && (
          isEn
            ? 'In a GARP packet, the host inserts its own IP into both Sender IP and Target IP simultaneously. If any device on the network replies, an IP address conflict exists, and the operating system immediately alerts the network administrator.'
            : 'في حزمة الـ GARP، يضع الجهاز عنوان الـ IP الخاص به في كل من Sender IP و Target IP معاً! إذا رد أي جهاز في الشبكة، فهذا يعني وجود تضارب كارثي في عناوين الـ IP (IP Address Conflict)، ويقوم نظام التشغيل بتحذيرك فوراً.'
        )}
      </div>
    </div>
  );
};
