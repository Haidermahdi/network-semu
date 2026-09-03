import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Building2, 
  Cpu, 
  Megaphone, 
  Compass, 
  Layers, 
  GitCompare, 
  Terminal, 
  Award,
  Sparkles,
  ArrowRight,
  BookOpen,
  Copy,
  Check,
  Code2,
  ShieldCheck,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { SlideData, Language } from '../types';

interface RealWorldAnalogyCardProps {
  slide: SlideData;
  lang?: Language;
}

const CLI_SNIPPETS: Record<string, { title: string; titleEn: string; cmd: string; output: string; desc: string; descEn: string }[]> = {
  'slide-1': [
    {
      title: 'جدول الـ MAC بالسويتش (Layer 2)',
      titleEn: 'Switch MAC Address Table (Layer 2)',
      cmd: 'Switch# show mac address-table',
      output: `          Mac Address Table
-------------------------------------------
Vlan    Mac Address       Type        Ports
----    -----------       --------    -----
  10    0050.7966.6801    DYNAMIC     Fa0/1
  10    0050.7966.6802    DYNAMIC     Fa0/2
Total Mac Addresses for this criterion: 2`,
      desc: 'يعرض المنافذ الفيزيائية المقابلة لكل عنوان MAC محلي داخل شبكة الـ LAN.',
      descEn: 'Displays physical switch ports mapped to each learned local Layer 2 MAC address.'
    },
    {
      title: 'جدول التوجيه بالراوتر (Layer 3)',
      titleEn: 'Router IPv4 Routing Table (Layer 3)',
      cmd: 'Router# show ip route',
      output: `Codes: C - connected, S - static, R - RIP, O - OSPF
Gateway of last resort is not set

C    192.168.1.0/24 is directly connected, GigabitEthernet0/0
O    10.0.0.0/24 [110/2] via 203.0.113.2, 00:04:12, Serial0/1`,
      desc: 'يوضح المسارات العالمية لتوجيه الحزم بين الشبكات المختلفة واختيار أفضل ممر.',
      descEn: 'Shows global network routing prefixes for inter-subnet forwarding and optimal path selection.'
    }
  ],
  'slide-2': [
    {
      title: 'فحص التعلم الديناميكي في جدول CAM',
      titleEn: 'Dynamic MAC Learning in CAM Table',
      cmd: 'Switch# show mac address-table dynamic',
      output: `Vlan    Mac Address       Type        Ports    Age(s)
----    -----------       --------    -----    ------
  10    0050.7966.6801    DYNAMIC     Fa0/1        14
  10    0050.7966.6802    DYNAMIC     Fa0/2         3`,
      desc: 'يلاحظ المهندس أن السويتش حفظ الـ MAC تلقائياً بمجرد إرسال الفريم من المنفذ.',
      descEn: 'Verifies how the switch automatically records Source MAC as soon as an ingress frame arrives.'
    },
    {
      title: 'فحص حالة المنافذ ونمط الازدواج الكامل (Full-Duplex)',
      titleEn: 'Interface Status & Full-Duplex Verification',
      cmd: 'Switch# show interfaces status',
      output: `Port      Name          Status       Vlan       Duplex  Speed Type
Fa0/1     Host_A        connected    10         a-full  a-100 10/100BaseTX
Fa0/2     Host_B        connected    10         a-full  a-100 10/100BaseTX`,
      desc: 'عزل مجالات التصادم وتفعيل التمرير المتزامن ثنائي الاتجاه.',
      descEn: 'Isolates collision domains and activates simultaneous bidirectional frame forwarding.'
    }
  ],
  'slide-3': [
    {
      title: 'فحص ذاكرة الكاش لبروتوكول ARP في الجهاز',
      titleEn: 'Host ARP Cache Inspection',
      cmd: 'Host-A> arp -a',
      output: `Interface: 192.168.1.10 --- 0x2
  Internet Address      Physical Address      Type
  192.168.1.20          00-50-79-66-68-02     dynamic
  192.168.1.1           00-50-79-66-68-03     dynamic`,
      desc: 'الربط السريع بين عنوان الـ IP والـ MAC المستكشف عبر الـ Broadcast.',
      descEn: 'Binds local IPv4 addresses to hardware MACs discovered through ARP broadcast queries.'
    },
    {
      title: 'جدول الـ ARP في الراوتر',
      titleEn: 'Router ARP Mapping Table',
      cmd: 'Router# show ip arp',
      output: `Protocol  Address          Age (min)  Hardware Addr   Type   Interface
Internet  192.168.1.1             -   0050.7966.6803  ARPA   GigabitEthernet0/0
Internet  192.168.1.10            3   0050.7966.6801  ARPA   GigabitEthernet0/0`,
      desc: 'جدول ربط العناوين المحلية المنطقية بالعناوين الفيزيائية على المنفذ.',
      descEn: 'Maps local logical IPv4 addresses to interface physical MAC addresses.'
    }
  ],
  'slide-4': [
    {
      title: 'فحص مسار وجهة معينة وخوارزمية CEF',
      titleEn: 'Destination Path Lookup & CEF Switching',
      cmd: 'Router# show ip route 10.0.0.80',
      output: `Routing entry for 10.0.0.0/24
  Known via "ospf 1", distance 110, metric 2
  Last update from 203.0.113.2 on Serial0/1
  * 203.0.113.2, via Serial0/1
      Route metric is 2, share count 1`,
      desc: 'استعلام التوجيه لمعرفة القفزة التالية (Next-Hop) والمنفذ المخرج.',
      descEn: 'Queries the RIB/FIB for the winning next-hop address and designated exit interface.'
    }
  ],
  'slide-5': [
    {
      title: 'تتبع مسار القفزات وفحص انخفاض الـ TTL',
      titleEn: 'Traceroute Hop Inspection & TTL Decrement',
      cmd: 'Host-A> tracert 10.0.0.80',
      output: `Tracing route to 10.0.0.80 over a maximum of 30 hops:
  1    <1 ms    192.168.1.1 [Default Gateway - Router1]
  2     5 ms    203.0.113.2 [Core WAN Backbone - Router2]
  3    12 ms    10.0.0.80   [Destination Server - Cloud]
Trace complete.`,
      desc: 'إثبات عملي لانخفاض عداد الـ TTL في كل راوتر يعبر من خلاله الفريم.',
      descEn: 'Empirical proof of hop-by-hop TTL decrement at each intermediate Layer 3 boundary.'
    }
  ],
  'slide-6': [
    {
      title: 'التحقق من حالة نفق التشفير IPsec SA',
      titleEn: 'IPsec Security Association & Crypto Status',
      cmd: 'Router# show crypto session',
      output: `Crypto session current status
Interface: Serial0/1
Session status: UP-ACTIVE
Peer: 203.0.113.2 port 500
  IPsec SA: #pkts encaps: 1240, #pkts encrypt: 1240
            #pkts decaps: 1240, #pkts decrypt: 1240`,
      desc: 'تأكيد سلامة التشفير ومطابقة الحزم المحمية عبر شبكة الإنترنت.',
      descEn: 'Verifies encapsulation status and authenticated packet counters across the transit link.'
    }
  ]
};

export const RealWorldAnalogyCard: React.FC<RealWorldAnalogyCardProps> = ({ slide, lang = 'ar' }) => {
  const isEn = lang === 'en';
  const { realWorldMetaphor, keyConcepts, takeawayMessage } = slide;
  const [activeTab, setActiveTab] = useState<'story' | 'comparison' | 'cli'>('story');
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const getIcon = (name: string) => {
    switch (name) {
      case 'Building2': return <Building2 className="w-5 h-5 text-amber-400" />;
      case 'Cpu': return <Cpu className="w-5 h-5 text-emerald-400" />;
      case 'Megaphone': return <Megaphone className="w-5 h-5 text-cyan-400" />;
      case 'Compass': return <Compass className="w-5 h-5 text-amber-400" />;
      case 'Layers': return <Layers className="w-5 h-5 text-emerald-400" />;
      case 'GitCompare': return <GitCompare className="w-5 h-5 text-amber-400" />;
      case 'Terminal': return <Terminal className="w-5 h-5 text-emerald-400" />;
      case 'Award': return <Award className="w-5 h-5 text-amber-400" />;
      default: return <BookOpen className="w-5 h-5 text-amber-400" />;
    }
  };

  const cliSnippets = CLI_SNIPPETS[slide.id] || CLI_SNIPPETS['slide-1'];

  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard?.writeText?.(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 1800);
  };

  return (
    <div className={`space-y-4 font-sans ${isEn ? 'text-left dir-ltr' : 'text-right dir-rtl'}`}>
      {/* Main Story & Analogy Card */}
      <div className="p-5 sm:p-6 rounded-3xl bg-slate-900/95 border border-white/[0.08] shadow-2xl relative overflow-hidden backdrop-blur-xl">
        {/* Ambient Top Glow */}
        <div className="absolute top-0 right-1/4 w-72 h-36 bg-amber-500/[0.07] rounded-full blur-3xl pointer-events-none" />

        {/* Card Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/[0.06] pb-4 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center shrink-0 shadow-lg shadow-amber-500/5">
              {getIcon(realWorldMetaphor.iconName)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider font-mono">
                  {isEn ? 'Real-World Metaphor' : 'تشبيه من واقع الحياة'}
                </span>
                <span className="text-[10px] text-slate-500 font-mono">
                  {isEn ? 'CONCEPTUAL ANALOGY' : 'REAL-WORLD ANALOGY'}
                </span>
              </div>
              <h3 className="text-lg font-bold text-white mt-0.5">
                {isEn && realWorldMetaphor.titleEn ? realWorldMetaphor.titleEn : realWorldMetaphor.titleAr}
              </h3>
            </div>
          </div>

          {/* Mode Pill Switcher */}
          <div className="flex items-center gap-1 p-1 rounded-xl bg-slate-950/80 border border-white/[0.06] self-start sm:self-auto">
            <button
              onClick={() => setActiveTab('story')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'story'
                  ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20 font-black'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>{isEn ? 'Story' : 'القصة'}</span>
            </button>
            <button
              onClick={() => setActiveTab('comparison')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'comparison'
                  ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20 font-black'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <GitCompare className="w-3.5 h-3.5" />
              <span>{isEn ? 'Comparison Matrix' : 'جدول المقارنة'}</span>
            </button>
            <button
              onClick={() => setActiveTab('cli')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'cli'
                  ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20 font-black'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Terminal className="w-3.5 h-3.5" />
              <span>{isEn ? 'Cisco CLI' : 'أوامر Cisco CLI'}</span>
            </button>
          </div>
        </div>

        {/* Tab 1: The Story & Engineering Lesson */}
        {activeTab === 'story' && (
          <motion.div
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            {/* Story narrative block */}
            <div className="p-4 sm:p-5 rounded-2xl bg-slate-950/70 border border-white/[0.05] relative">
              <div className="text-slate-200 text-sm sm:text-base leading-relaxed">
                {isEn && realWorldMetaphor.storyEn ? realWorldMetaphor.storyEn : realWorldMetaphor.storyAr}
              </div>
            </div>

            {/* Engineering Takeaway Box */}
            <div className="p-4 rounded-2xl bg-amber-500/[0.08] border border-amber-500/20 flex items-start gap-3">
              <div className="p-2 rounded-xl bg-amber-500/20 text-amber-300 shrink-0 mt-0.5">
                <Sparkles className="w-4 h-4" />
              </div>
              <div className="text-xs sm:text-sm text-amber-200/90 leading-relaxed">
                <strong className="text-amber-300 font-bold block mb-1">
                  {isEn ? 'Engineering Takeaway:' : 'العبرة الهندسية (Engineering Takeaway):'}
                </strong>
                {isEn && realWorldMetaphor.lessonEn ? realWorldMetaphor.lessonEn : realWorldMetaphor.lessonAr}
              </div>
            </div>
          </motion.div>
        )}

        {/* Tab 2: Comparative Table */}
        {activeTab === 'comparison' && (
          <motion.div
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-3"
          >
            <div className="overflow-hidden rounded-2xl border border-white/[0.06] bg-slate-950/60">
              <table className={`w-full text-xs sm:text-sm ${isEn ? 'text-left' : 'text-right'}`}>
                <thead className="bg-slate-950 text-slate-400 border-b border-white/[0.06]">
                  <tr>
                    <th className="p-3.5 font-bold text-amber-300 w-1/2">
                      {isEn ? 'Real World Analogy' : 'في الحياة الواقعية (Real World)'}
                    </th>
                    <th className="p-3.5 font-bold text-cyan-300 w-1/2">
                      {isEn ? 'Cisco Networking Reality' : 'في عالم شبكات سيسكو (Network Reality)'}
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.04]">
                  {realWorldMetaphor.comparison.map((item, idx) => (
                    <tr key={idx} className="hover:bg-white/[0.02] transition-colors">
                      <td className="p-3.5 text-slate-300 font-medium">
                        <div className="flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0" />
                          <span>{isEn && item.realWorldEn ? item.realWorldEn : item.realWorld}</span>
                        </div>
                      </td>
                      <td className={`p-3.5 text-cyan-200 font-mono text-xs dir-ltr ${isEn ? 'text-left' : 'text-right'}`}>
                        <span className="px-2.5 py-1 rounded-lg bg-cyan-950/40 border border-cyan-800/40 inline-block">
                          {isEn && item.networkWorldEn ? item.networkWorldEn : item.networkWorld}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <p className="text-[11px] text-slate-400 font-medium text-center">
              {isEn 
                ? 'Enterprise networking mastery is forged by connecting abstract packets to physical human logistics.' 
                : 'يُبنى فهم شبكات المؤسسات بربط المفاهيم المجردة بأنظمة المكاتب والبريد والنقل العالمية.'}
            </p>
          </motion.div>
        )}

        {/* Tab 3: Cisco IOS CLI Verification Snippets */}
        {activeTab === 'cli' && (
          <motion.div
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-3"
          >
            <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
              <span className="font-bold flex items-center gap-1.5 text-slate-300">
                <Code2 className="w-4 h-4 text-emerald-400" />
                <span>{isEn ? 'Official Cisco IOS Verification & Troubleshooting Commands:' : 'أوامر التحقق والتشخيص الرسمية في Cisco IOS:'}</span>
              </span>
              <span className="text-[11px] font-mono text-slate-500">Cisco CCNA Blueprint</span>
            </div>

            <div className="space-y-3">
              {cliSnippets.map((item, idx) => (
                <div key={idx} className="rounded-2xl bg-slate-950 border border-white/[0.08] overflow-hidden">
                  <div className="flex items-center justify-between px-3.5 py-2 border-b border-white/[0.06] bg-slate-900/80">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                      <span className="text-xs font-bold text-slate-200 font-sans">
                        {isEn && item.titleEn ? item.titleEn : item.title}
                      </span>
                    </div>

                    <button
                      onClick={() => copyToClipboard(item.cmd, idx)}
                      className="text-[11px] font-mono px-2 py-1 rounded-md bg-white/[0.05] hover:bg-white/[0.1] text-slate-300 flex items-center gap-1 transition-all cursor-pointer"
                    >
                      {copiedIndex === idx ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-400" />
                          <span className="text-emerald-400">{isEn ? 'Copied' : 'تم النسخ'}</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          <span>{isEn ? 'Copy Command' : 'نسخ الأمر'}</span>
                        </>
                      )}
                    </button>
                  </div>

                  <div className="p-3 font-mono text-xs dir-ltr text-left overflow-x-auto space-y-2">
                    <div className="text-emerald-400 font-bold">{item.cmd}</div>
                    <pre className="text-slate-300 text-[11px] leading-relaxed whitespace-pre font-mono">
                      {item.output}
                    </pre>
                  </div>

                  <div className="px-3.5 py-2 bg-slate-900/40 border-t border-white/[0.04] text-[11px] text-slate-400 font-sans">
                    💡 <strong className="text-slate-300 font-medium">{isEn ? 'Objective:' : 'الهدف:'}</strong> {isEn && item.descEn ? item.descEn : item.desc}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </div>

      {/* Key Concepts Triad */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {keyConcepts.map((c, idx) => (
          <div 
            key={idx} 
            className="p-4 rounded-2xl bg-slate-900/80 border border-white/[0.06] hover:border-amber-500/30 transition-all flex flex-col justify-between group shadow-lg"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="text-[10px] font-mono font-bold text-amber-400 uppercase tracking-wide px-2 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/20">
                  {c.term}
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              </div>
              <h4 className="text-xs sm:text-sm font-bold text-white group-hover:text-amber-300 transition-colors">
                {isEn && c.titleEn ? c.titleEn : c.title}
              </h4>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                {isEn && c.descEn ? c.descEn : c.desc}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Takeaway Golden Bar */}
      <div className="p-4 rounded-2xl bg-slate-900/90 border border-amber-500/20 text-xs sm:text-sm text-slate-200 flex items-center justify-between gap-3 shadow-lg">
        <div className="flex items-center gap-2.5">
          <Award className="w-4 h-4 text-amber-400 shrink-0" />
          <span className="leading-relaxed">
            <strong className="text-amber-300 font-bold ml-1">
              {isEn ? 'Architectural Core:' : 'الخلاصة المنهجية:'}
            </strong>
            {isEn && slide.takeawayMessageEn ? slide.takeawayMessageEn : takeawayMessage}
          </span>
        </div>
      </div>
    </div>
  );
};
