import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
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
  Network,
  Cpu,
  Globe,
  Terminal,
  ChevronDown,
  ChevronUp,
  Activity,
  ArrowRight,
  Info
} from 'lucide-react';
import { PacketHeaders, SimulationStep, Language } from '../types';
import { getLocalizedStep, getLocalizedHeaderString } from '../utils/packetTranslations';

interface PacketInspectorProps {
  currentStep?: SimulationStep;
  scenarioId?: string;
  lang?: Language;
}

export const PacketInspector: React.FC<PacketInspectorProps> = ({ currentStep, scenarioId, lang = 'ar' }) => {
  const [selectedLayer, setSelectedLayer] = useState<'all' | 'l2' | 'l3' | 'l4' | 'payload'>('all');

  if (!currentStep) return null;

  const isEn = lang === 'en';
  const { headers, explanation, highlightEvent, activeNodeId, layer } = currentStep;
  const localized = getLocalizedStep(currentStep, scenarioId || 'cross-network-journey', Number(currentStep.id || 1) - 1, lang);

  // Visual Encapsulation Steps
  const layersList = [
    { id: 'l2', name: isEn ? 'Layer 2' : 'الطبقة 2', label: isEn ? 'Frame (MAC)' : 'إطار (MAC)', active: layer?.includes('2') || highlightEvent?.includes('mac') },
    { id: 'l3', name: isEn ? 'Layer 3' : 'الطبقة 3', label: isEn ? 'Packet (IP)' : 'حزمة (IP)', active: layer?.includes('3') || highlightEvent?.includes('ttl') },
    { id: 'l4', name: isEn ? 'Layer 4' : 'الطبقة 4', label: isEn ? 'Segment (Port)' : 'قطعة (Port)', active: layer?.includes('4') },
    { id: 'payload', name: isEn ? 'Layer 7' : 'الطبقة 7', label: isEn ? 'Data Payload' : 'بيانات التطبيق', active: layer?.includes('7') || layer?.includes('APP') }
  ];

  return (
    <div className={`w-full bg-slate-900/95 rounded-3xl border border-white/[0.08] p-5 sm:p-6 shadow-2xl font-sans ${isEn ? 'text-left dir-ltr' : 'text-right dir-rtl'} backdrop-blur-xl relative overflow-hidden`}>
      {/* Subtle background ambient */}
      <div className="absolute top-0 left-0 w-80 h-32 bg-cyan-500/[0.04] rounded-full blur-3xl pointer-events-none" />

      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/[0.06] pb-4 mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 shrink-0 shadow-lg shadow-cyan-500/5">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 text-xs font-mono font-bold">
                {isEn ? `Step #${currentStep.id || 1}` : `الخطوة #${currentStep.id || 1}`}
              </span>
              <span className="text-xs text-slate-400 font-mono">
                {isEn ? 'Processing Node: ' : 'العقدة المعالجة: '}<strong className="text-slate-200">{activeNodeId.toUpperCase()}</strong>
              </span>
            </div>
            <h3 className="text-base sm:text-lg font-bold text-white mt-0.5">
              {localized.title}
            </h3>
          </div>
        </div>

        {/* Dynamic Highlight Badge */}
        {highlightEvent && (
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-950/80 border border-white/[0.08] text-xs font-bold text-slate-200 self-start sm:self-auto shadow-md font-sans">
            {highlightEvent === 'mac_rewrite' && <ArrowRightLeft className="w-4 h-4 text-amber-400" />}
            {highlightEvent === 'ttl_decrement' && <Clock className="w-4 h-4 text-rose-400" />}
            {highlightEvent === 'arp_broadcast' && <Radio className="w-4 h-4 text-cyan-400 animate-pulse" />}
            {highlightEvent === 'mac_learned' && <Network className="w-4 h-4 text-emerald-400" />}
            {highlightEvent === 'destination_reached' && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
            
            <span>
              {highlightEvent === 'mac_rewrite' && (isEn ? '🔄 MAC address rewritten for next hop' : '🔄 تم تبديل عنوان الـ MAC للقفزة التالية')}
              {highlightEvent === 'ttl_decrement' && (isEn ? '⏳ TTL counter decremented (-1)' : '⏳ تم إنقاص عداد الـ TTL (-1)')}
              {highlightEvent === 'arp_broadcast' && (isEn ? '📢 ARP broadcast flooded in LAN' : '📢 بث عام لبروتوكول ARP في الـ LAN')}
              {highlightEvent === 'mac_learned' && (isEn ? '🧠 Port & MAC registered in CAM table' : '🧠 تسجيل المنفذ والـ MAC في جدول CAM')}
              {highlightEvent === 'destination_reached' && (isEn ? '🎯 Packet successfully reached destination' : '🎯 وصول ناجح لوجهة الحزمة')}
            </span>
          </div>
        )}
      </div>

      {/* Visual Encapsulation Pipeline (OSI Stack Flow) */}
      <div className="mb-4 p-3 rounded-2xl bg-slate-950/70 border border-white/[0.05]">
        <div className="flex items-center justify-between gap-2 mb-2 text-xs">
          <span className="text-slate-400 font-bold flex items-center gap-1.5">
            <Activity className="w-3.5 h-3.5 text-amber-400" />
            <span>{isEn ? 'PDU Encapsulation Flow:' : 'سلسلة تغليف البيانات (PDU Encapsulation Flow):'}</span>
          </span>
          <span className="text-[11px] text-slate-500 font-mono">End-to-End vs Hop-by-Hop</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {layersList.map((item) => (
            <button
              key={item.id}
              onClick={() => setSelectedLayer(selectedLayer === item.id ? 'all' : (item.id as any))}
              className={`p-2.5 rounded-xl border ${isEn ? 'text-left' : 'text-right'} transition-all flex flex-col justify-between cursor-pointer ${
                selectedLayer === item.id
                  ? 'bg-amber-500/15 border-amber-500/40 text-amber-300 shadow-md shadow-amber-500/10'
                  : item.active
                    ? 'bg-slate-900 border-cyan-500/30 text-cyan-200'
                    : 'bg-slate-900/40 border-white/[0.04] text-slate-400 hover:border-white/[0.08]'
              }`}
            >
              <div className="flex items-center justify-between text-[10px] font-mono">
                <span>{item.name}</span>
                {item.active && <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />}
              </div>
              <div className="text-xs font-bold mt-1 text-slate-200 font-sans">
                {item.label}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Step Narration */}
      <div className="p-4 rounded-2xl bg-slate-950/80 border border-white/[0.05] text-xs sm:text-sm text-slate-300 leading-relaxed mb-4">
        {localized.description}
      </div>

      {/* Layer Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
        {/* Layer 2: Data Link / Ethernet Frame */}
        {(selectedLayer === 'all' || selectedLayer === 'l2') && (
          <div className="p-4 rounded-2xl bg-slate-950 border border-emerald-500/20 flex flex-col justify-between shadow-lg">
            <div>
              <div className="flex items-center justify-between border-b border-white/[0.06] pb-2 mb-2.5">
                <div className="flex items-center gap-1.5 text-emerald-400 font-bold text-xs">
                  <Layers className="w-3.5 h-3.5" />
                  <span>{isEn ? 'Layer 2: Ethernet Frame' : 'Layer 2: إطار الإيثرنت'}</span>
                </div>
                <span className="text-[9px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 font-mono">
                  Hop-by-Hop
                </span>
              </div>

              <div className="space-y-2 text-xs font-mono dir-ltr text-left">
                <div className="p-2 rounded-xl bg-slate-900/90 border border-white/[0.04]">
                  <div className="text-slate-500 text-[10px]">Dest MAC (Next Hop):</div>
                  <div className="text-emerald-300 font-bold truncate mt-0.5" title={headers.l2.destMac}>
                    {getLocalizedHeaderString(headers.l2.destMac, lang)}
                  </div>
                </div>

                <div className="p-2 rounded-xl bg-slate-900/90 border border-white/[0.04]">
                  <div className="text-slate-500 text-[10px]">Src MAC (Current Hop):</div>
                  <div className="text-cyan-300 font-bold truncate mt-0.5" title={headers.l2.srcMac}>
                    {getLocalizedHeaderString(headers.l2.srcMac, lang)}
                  </div>
                </div>

                <div className="p-2 rounded-xl bg-slate-900/90 border border-white/[0.04] flex justify-between">
                  <span className="text-slate-500 text-[10px]">EtherType:</span>
                  <span className="text-slate-200 font-bold">{headers.l2.etherType}</span>
                </div>

                {headers.l2.vlanId && (
                  <div className="p-2 rounded-xl bg-cyan-950/30 border border-cyan-500/20 flex justify-between">
                    <span className="text-cyan-400 text-[10px]">802.1Q Tag:</span>
                    <span className="text-cyan-200 font-bold">VLAN {headers.l2.vlanId}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="mt-3 text-[10px] text-slate-500 font-sans border-t border-white/[0.04] pt-2">
              {isEn ? 'MAC address changes at every router hop (Hop-by-Hop).' : 'يتغير عنوان الـ MAC عند كل راوتر (Hop-by-Hop).'}
            </div>
          </div>
        )}

        {/* Layer 3: Network / IPv4 Packet */}
        {(selectedLayer === 'all' || selectedLayer === 'l3') && (
          <div className="p-4 rounded-2xl bg-slate-950 border border-indigo-500/20 flex flex-col justify-between shadow-lg">
            <div>
              <div className="flex items-center justify-between border-b border-white/[0.06] pb-2 mb-2.5">
                <div className="flex items-center gap-1.5 text-indigo-400 font-bold text-xs">
                  <Binary className="w-3.5 h-3.5" />
                  <span>{isEn ? 'Layer 3: IPv4 Packet' : 'Layer 3: حزمة IPv4'}</span>
                </div>
                <span className="text-[9px] px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 font-mono">
                  End-to-End
                </span>
              </div>

              <div className="space-y-2 text-xs font-mono dir-ltr text-left">
                <div className="p-2 rounded-xl bg-slate-900/90 border border-white/[0.04]">
                  <div className="text-slate-500 text-[10px]">Dest IP (Final Host):</div>
                  <div className="text-indigo-300 font-bold truncate mt-0.5">
                    {getLocalizedHeaderString(headers.l3.destIp, lang)}
                  </div>
                </div>

                <div className="p-2 rounded-xl bg-slate-900/90 border border-white/[0.04]">
                  <div className="text-slate-500 text-[10px]">Src IP (Sender):</div>
                  <div className="text-cyan-300 font-bold truncate mt-0.5">
                    {getLocalizedHeaderString(headers.l3.srcIp, lang)}
                  </div>
                </div>

                <div className="p-2 rounded-xl bg-slate-900/90 border border-white/[0.04] flex items-center justify-between">
                  <span className="text-slate-500 text-[10px]">TTL Counter:</span>
                  <div className="flex items-center gap-2">
                    <span className={`font-bold ${headers.l3.ttl <= 62 ? 'text-rose-400' : 'text-amber-400'}`}>
                      {headers.l3.ttl}
                    </span>
                    <div className="w-12 h-1.5 rounded-full bg-slate-800 overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-emerald-500 to-amber-500 rounded-full transition-all"
                        style={{ width: `${(headers.l3.ttl / 64) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>

                <div className="p-2 rounded-xl bg-slate-900/90 border border-white/[0.04] flex justify-between">
                  <span className="text-slate-500 text-[10px]">Protocol:</span>
                  <span className="text-slate-200 font-bold">{headers.l3.protocol}</span>
                </div>
              </div>
            </div>

            <div className="mt-3 text-[10px] text-slate-500 font-sans border-t border-white/[0.04] pt-2">
              {isEn ? 'IP addresses remain end-to-end unchanged across hops.' : 'عناوين الـ IP ثابتة من البداية حتى النهاية (End-to-End).'}
            </div>
          </div>
        )}

        {/* Layer 4: Transport / TCP & UDP */}
        {(selectedLayer === 'all' || selectedLayer === 'l4') && (
          <div className="p-4 rounded-2xl bg-slate-950 border border-amber-500/20 flex flex-col justify-between shadow-lg">
            <div>
              <div className="flex items-center justify-between border-b border-white/[0.06] pb-2 mb-2.5">
                <div className="flex items-center gap-1.5 text-amber-400 font-bold text-xs">
                  <Cpu className="w-3.5 h-3.5" />
                  <span>{isEn ? 'Layer 4: Transport & Ports' : 'Layer 4: النقل والتحكم'}</span>
                </div>
                <span className="text-[9px] px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/20 font-mono">
                  Port-to-Port
                </span>
              </div>

              <div className="space-y-2 text-xs font-mono dir-ltr text-left">
                <div className="p-2 rounded-xl bg-slate-900/90 border border-white/[0.04] flex justify-between">
                  <span className="text-slate-500 text-[10px]">Dest Port:</span>
                  <span className="text-amber-300 font-bold">
                    {headers.l4?.destPort || (headers.l3.protocol === 'TCP' ? '80 (HTTP)' : headers.l3.protocol === 'UDP' ? '53 (DNS)' : 'ICMP Echo')}
                  </span>
                </div>

                <div className="p-2 rounded-xl bg-slate-900/90 border border-white/[0.04] flex justify-between">
                  <span className="text-slate-500 text-[10px]">Src Port:</span>
                  <span className="text-cyan-300 font-bold">
                    {headers.l4?.srcPort || '49152 (Random)'}
                  </span>
                </div>

                <div className="p-2 rounded-xl bg-slate-900/90 border border-white/[0.04] flex justify-between">
                  <span className="text-slate-500 text-[10px]">Flags:</span>
                  <span className="text-emerald-300 font-bold">
                    {headers.l4?.flags ? headers.l4.flags.join(', ') : 'ACK, PSH'}
                  </span>
                </div>

                <div className="p-2 rounded-xl bg-slate-900/90 border border-white/[0.04] flex justify-between">
                  <span className="text-slate-500 text-[10px]">Checksum:</span>
                  <span className="text-slate-300">0x8B42 (Valid)</span>
                </div>
              </div>
            </div>

            <div className="mt-3 text-[10px] text-slate-500 font-sans border-t border-white/[0.04] pt-2">
              {isEn ? 'Directs packet to destination service or application port.' : 'توجيه الحزمة إلى التطبيق أو الخدمة المحددة.'}
            </div>
          </div>
        )}

        {/* Layer 7: Application / Payload */}
        {(selectedLayer === 'all' || selectedLayer === 'payload') && (
          <div className="p-4 rounded-2xl bg-slate-950 border border-purple-500/20 flex flex-col justify-between shadow-lg">
            <div>
              <div className="flex items-center justify-between border-b border-white/[0.06] pb-2 mb-2.5">
                <div className="flex items-center gap-1.5 text-purple-400 font-bold text-xs">
                  <Globe className="w-3.5 h-3.5" />
                  <span>{isEn ? 'Layer 7: Application Payload' : 'Layer 7: حمولة التطبيق'}</span>
                </div>
                <span className="text-[9px] px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-300 border border-purple-500/20 font-mono">
                  {headers.payload?.type || 'Data'}
                </span>
              </div>

              <div className="space-y-2 text-xs font-mono dir-ltr text-left">
                <div className="p-2 rounded-xl bg-slate-900/90 border border-white/[0.04]">
                  <div className="text-slate-500 text-[10px]">Payload Type:</div>
                  <div className="text-purple-300 font-bold truncate mt-0.5">
                    {headers.payload?.type || 'HTTP/1.1 GET /index.html'}
                  </div>
                </div>

                <div className="p-2 rounded-xl bg-slate-900/90 border border-white/[0.04]">
                  <div className="text-slate-500 text-[10px]">Summary:</div>
                  <div className="text-slate-300 text-[11px] line-clamp-3 mt-0.5 leading-relaxed font-sans">
                    {localized.payloadSummary || 'User request data packet transmitted successfully'}
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-3 text-[10px] text-slate-500 font-sans border-t border-white/[0.04] pt-2">
              {isEn ? 'Original application payload data transmitted.' : 'البيانات الأصلية التي يحتاجها المستخدم أو البرنامج.'}
            </div>
          </div>
        )}
      </div>

      {/* Golden Observation Callout */}
      {(localized.takeaway || explanation) && (
        <div className="mt-4 p-4 rounded-2xl bg-amber-500/[0.08] border border-amber-500/25 flex items-start gap-3 shadow-md">
          <div className="p-2 rounded-xl bg-amber-500/20 text-amber-300 shrink-0 mt-0.5">
            <AlertTriangle className="w-4 h-4" />
          </div>
          <div className="text-xs sm:text-sm text-amber-200/90 leading-relaxed">
            <strong className="text-amber-300 font-bold block mb-0.5">
              {isEn ? 'Golden Architectural Takeaway:' : 'الملاحظة المنهجية الذهبية (Golden Exam Takeaway):'}
            </strong>
            {localized.takeaway}
          </div>
        </div>
      )}
    </div>
  );
};
