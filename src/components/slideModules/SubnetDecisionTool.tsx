import React, { useState } from 'react';
import { Network, ArrowRightLeft, ShieldAlert, CheckCircle2, Cpu, Globe, ArrowRight, Zap, Info } from 'lucide-react';
import { Language } from '../../types';

interface SubnetDecisionToolProps {
  lang?: Language;
}

export const SubnetDecisionTool: React.FC<SubnetDecisionToolProps> = ({ lang = 'ar' }) => {
  const isEn = lang === 'en';
  const [sourceIp, setSourceIp] = useState('192.168.1.10');
  const [subnetMask, setSubnetMask] = useState('255.255.255.0');
  const [destIp, setDestIp] = useState('192.168.1.50');

  // Convert dotted decimal to 32-bit number
  const ipToNumber = (ipStr: string): number => {
    const parts = ipStr.trim().split('.').map(p => parseInt(p, 10));
    if (parts.length !== 4 || parts.some(isNaN)) return 0;
    return ((parts[0] << 24) | (parts[1] << 16) | (parts[2] << 8) | parts[3]) >>> 0;
  };

  const numberToIp = (num: number): string => {
    return [
      (num >>> 24) & 255,
      (num >>> 16) & 255,
      (num >>> 8) & 255,
      num & 255
    ].join('.');
  };

  const srcNum = ipToNumber(sourceIp);
  const maskNum = ipToNumber(subnetMask);
  const destNum = ipToNumber(destIp);

  const srcNet = (srcNum & maskNum) >>> 0;
  const destNet = (destNum & maskNum) >>> 0;
  const isSameSubnet = srcNet === destNet;

  const handlePreset = (src: string, mask: string, dst: string) => {
    setSourceIp(src);
    setSubnetMask(mask);
    setDestIp(dst);
  };

  return (
    <div className={`bg-slate-900/90 rounded-3xl border border-white/[0.08] p-5 sm:p-6 shadow-2xl font-sans backdrop-blur-xl ${isEn ? 'text-left dir-ltr' : 'text-right dir-rtl'}`}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/[0.06] pb-4 mb-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
            <Cpu className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-bold text-white">
              {isEn ? 'Host Forwarding Decision Simulator: Switch vs Router?' : 'محاكي قرار الحاسوب: هل يحتاج لراوتر أم سويتش فقط؟'}
            </h3>
            <p className="text-xs text-slate-400">
              {isEn 
                ? 'Observe how the host executes Bitwise AND to determine local vs remote destination subnet'
                : 'شاهد كيف يقوم الحاسوب بعملية Bitwise AND لمعرفة هل الوجهة محلية أم خارجية'}
            </p>
          </div>
        </div>

        {/* Quick Presets */}
        <div className="flex flex-wrap items-center gap-1.5 self-start sm:self-auto text-xs font-mono">
          <button
            onClick={() => handlePreset('192.168.1.10', '255.255.255.0', '192.168.1.50')}
            className={`px-3 py-1.5 rounded-xl border transition-all cursor-pointer ${
              isSameSubnet ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30 font-bold' : 'bg-slate-950 text-slate-400 border-white/[0.06] hover:text-slate-200'
            }`}
          >
            {isEn ? 'Same LAN (Neighbor Host)' : 'نفس الـ LAN (حاسوب مجاور)'}
          </button>
          <button
            onClick={() => handlePreset('192.168.1.10', '255.255.255.0', '10.0.0.80')}
            className={`px-3 py-1.5 rounded-xl border transition-all cursor-pointer ${
              !isSameSubnet ? 'bg-amber-500/20 text-amber-300 border-amber-500/30 font-bold' : 'bg-slate-950 text-slate-400 border-white/[0.06] hover:text-slate-200'
            }`}
          >
            {isEn ? 'Cloud Server (Remote WAN)' : 'سيرفر سحابي (WAN Remote)'}
          </button>
        </div>
      </div>

      {/* Input Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-5 font-mono text-left dir-ltr">
        <div className="p-3.5 rounded-2xl bg-slate-950 border border-white/[0.06]">
          <label className="text-[11px] text-slate-400 block mb-1">{isEn ? 'Source IP (Your Host):' : 'Source IP (جهازك):'}</label>
          <input
            type="text"
            value={sourceIp}
            onChange={(e) => setSourceIp(e.target.value)}
            className="w-full bg-slate-900 border border-white/[0.08] rounded-xl px-3 py-2 text-sm text-cyan-300 font-bold focus:outline-none focus:border-cyan-400"
          />
        </div>

        <div className="p-3.5 rounded-2xl bg-slate-950 border border-white/[0.06]">
          <label className="text-[11px] text-slate-400 block mb-1">{isEn ? 'Subnet Mask:' : 'Subnet Mask (قناع الشبكة):'}</label>
          <input
            type="text"
            value={subnetMask}
            onChange={(e) => setSubnetMask(e.target.value)}
            className="w-full bg-slate-900 border border-white/[0.08] rounded-xl px-3 py-2 text-sm text-amber-300 font-bold focus:outline-none focus:border-amber-400"
          />
        </div>

        <div className="p-3.5 rounded-2xl bg-slate-950 border border-white/[0.06]">
          <label className="text-[11px] text-slate-400 block mb-1">{isEn ? 'Destination IP (Target):' : 'Destination IP (الهدف):'}</label>
          <input
            type="text"
            value={destIp}
            onChange={(e) => setDestIp(e.target.value)}
            className="w-full bg-slate-900 border border-white/[0.08] rounded-xl px-3 py-2 text-sm text-indigo-300 font-bold focus:outline-none focus:border-indigo-400"
          />
        </div>
      </div>

      {/* Logic Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-5 text-xs font-mono dir-ltr text-left">
        <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-white/[0.06] space-y-1.5">
          <span className="text-[11px] text-slate-400 font-sans block">
            {isEn ? '1. Compute Source Network ID:' : '1. حساب شبكة المصدر (Source Network ID):'}
          </span>
          <div className="text-slate-400">{sourceIp} <span className="text-amber-400">&amp;</span> {subnetMask}</div>
          <div className="text-cyan-400 font-bold text-sm bg-cyan-950/30 p-2 rounded-xl border border-cyan-500/20">
            = {numberToIp(srcNet)}
          </div>
        </div>

        <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-white/[0.06] space-y-1.5">
          <span className="text-[11px] text-slate-400 font-sans block">
            {isEn ? '2. Compute Destination Network ID:' : '2. حساب شبكة الوجهة (Dest Network ID):'}
          </span>
          <div className="text-slate-400">{destIp} <span className="text-amber-400">&amp;</span> {subnetMask}</div>
          <div className="text-indigo-400 font-bold text-sm bg-indigo-950/30 p-2 rounded-xl border border-indigo-500/20">
            = {numberToIp(destNet)}
          </div>
        </div>
      </div>

      {/* Decision Outcome Card */}
      <div className={`p-4 sm:p-5 rounded-2xl border transition-all ${
        isSameSubnet
          ? 'bg-emerald-950/20 border-emerald-500/30 text-emerald-300'
          : 'bg-amber-950/20 border-amber-500/30 text-amber-300'
      }`}>
        <div className="flex items-start gap-3">
          <div className={`p-2.5 rounded-xl shrink-0 mt-0.5 ${isSameSubnet ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'}`}>
            {isSameSubnet ? <CheckCircle2 className="w-5 h-5" /> : <Globe className="w-5 h-5" />}
          </div>
          <div className="space-y-1.5 text-xs sm:text-sm font-sans leading-relaxed">
            <h4 className="font-bold text-base text-white">
              {isSameSubnet
                ? (isEn ? '✅ Result: Target is on the SAME Local Subnet' : '✅ النتيجة: الوجهة في نفس الشبكة المحلية (Same Subnet)')
                : (isEn ? '🌐 Result: Target is on a DIFFERENT Remote Subnet' : '🌐 النتيجة: الوجهة في شبكة بعيدة مختلفة (Different Subnet)')}
            </h4>
            <p className="text-slate-300">
              {isSameSubnet
                ? (isEn
                  ? 'Both Network IDs match perfectly! The host knows the target shares the same local Layer 2 broadcast domain. It directly sends an ARP Request for the destination host MAC. Frames are switched at line-rate via Layer 2 without involving any router.'
                  : 'الحاسوب يقارن النتيجتين فيجدهما متطابقتين! يستنتج أن الجهاز الهدف يشاركه نفس السلك/السويتش. لذلك يقوم بإرسال ARP Request للبحث عن عنوان MAC الهدف مباشرة، ويقوم السويتش بتمرير الفريم (Layer 2 Switching) دون الحاجة للراوتر نهائياً.')
                : (isEn
                  ? 'Network IDs differ! The host recognizes it cannot deliver the packet locally, so it must forward it to its configured Default Gateway (192.168.1.1). It issues an ARP Request for the router MAC, allowing the router to handle inter-network routing (Layer 3).'
                  : 'الحاسوب يجد أن شبكة الهدف مختلفة عن شبكته! يعلم أنه عاجز عن الوصول إليه مباشرة، فيلجأ إلى البوابة الافتراضية (Default Gateway IP: 192.168.1.1). يرسل ARP لمعرفة MAC الراوتر فقط، ويسلمه الحزمة ليتولى الراوتر توجيهها (Layer 3 Routing).')}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
