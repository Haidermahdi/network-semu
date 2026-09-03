import React, { useState } from 'react';
import { GitCompare, Cpu, Terminal, HelpCircle, CheckCircle2, XCircle, Sparkles, Layers } from 'lucide-react';
import { Language } from '../../types';

interface MatrixRow {
  parameter: string;
  parameterEn: string;
  switchSpec: string;
  switchSpecEn: string;
  routerSpec: string;
  routerSpecEn: string;
  category: 'core' | 'hardware' | 'cli';
}

const MATRIX_DATA: MatrixRow[] = [
  {
    parameter: 'الطبقة في نموذج OSI',
    parameterEn: 'OSI Model Layer',
    switchSpec: 'الطبقة الثانية (Layer 2 - Data Link)',
    switchSpecEn: 'Layer 2 (Data Link)',
    routerSpec: 'الطبقة الثالثة (Layer 3 - Network)',
    routerSpecEn: 'Layer 3 (Network)',
    category: 'core'
  },
  {
    parameter: 'وحدة نقل البيانات (PDU)',
    parameterEn: 'Protocol Data Unit (PDU)',
    switchSpec: 'إطار (Frame)',
    switchSpecEn: 'Frame',
    routerSpec: 'حزمة (Packet)',
    routerSpecEn: 'Packet',
    category: 'core'
  },
  {
    parameter: 'جدول اتخاذ القرار',
    parameterEn: 'Forwarding Decision Table',
    switchSpec: 'جدول عناوين الماك (CAM / MAC Address Table)',
    switchSpecEn: 'MAC Address Table (CAM)',
    routerSpec: 'جدول التوجيه وجدول CEF (Routing Table & FIB)',
    routerSpecEn: 'Routing Table (RIB) & CEF FIB',
    category: 'core'
  },
  {
    parameter: 'محرك المعالجة الفيزيائي',
    parameterEn: 'Hardware Forwarding Engine',
    switchSpec: 'شرائح ASIC مخصصة فائقة السرعة على مستوى العتاد',
    switchSpecEn: 'Dedicated hardware ASICs (line-rate speed)',
    routerSpec: 'معالجات عامة + محرك تسريع CEF (Cisco Express Forwarding)',
    routerSpecEn: 'General CPU + hardware-assisted CEF engine',
    category: 'hardware'
  },
  {
    parameter: 'التعامل مع البث العام (Broadcast)',
    parameterEn: 'Broadcast Handling',
    switchSpec: 'يفيض البث (Flooding) لجميع منافذ نفس الـ VLAN',
    switchSpecEn: 'Floods broadcast to all ports in same VLAN',
    routerSpec: 'يوقف البث تماماً ويعزل شبكات البث عن بعضها',
    routerSpecEn: 'Terminates broadcast at interface boundary',
    category: 'core'
  },
  {
    parameter: 'مجال التصادم (Collision Domain)',
    parameterEn: 'Collision Domain',
    switchSpec: 'كل منفذ في السويتش يمثل مجال تصادم مستقل (Full-Duplex)',
    switchSpecEn: 'Each port is an independent collision domain',
    routerSpec: 'كل منفذ موجه يمثل مجال تصادم ومجال بث مستقلين',
    routerSpecEn: 'Each routed interface isolates collision & broadcast',
    category: 'core'
  },
  {
    parameter: 'تعديل ترويسات الحزمة',
    parameterEn: 'Header Manipulation',
    switchSpec: 'لا يغير أي عنوان داخل الفريم أو الـ IP نهائياً',
    switchSpecEn: 'Does not modify L2/L3 payload or IP headers',
    routerSpec: 'يعيد كتابة عناوين الـ MAC بالكامل وينقص الـ TTL بمقدار 1',
    routerSpecEn: 'Rewrites L2 MAC headers, decrements TTL by 1',
    category: 'hardware'
  },
  {
    parameter: 'بروتوكول منع الحلقات (Loops)',
    parameterEn: 'Loop Prevention Mechanism',
    switchSpec: 'بروتوكول شجرة الامتداد STP (802.1D / 802.1w)',
    switchSpecEn: 'Spanning Tree Protocol (STP / 802.1w RSTP)',
    routerSpec: 'حقل زمن البقاء (TTL) وخوارزميات البروتوكولات (Split-Horizon)',
    routerSpecEn: 'IPv4 TTL / IPv6 Hop Limit, routing protocol split-horizon',
    category: 'hardware'
  },
  {
    parameter: 'أهم أوامر سيسكو للمعاينة (CLI)',
    parameterEn: 'Key Cisco CLI Verification',
    switchSpec: 'show mac address-table / show vlan brief',
    switchSpecEn: 'show mac address-table / show vlan brief',
    routerSpec: 'show ip route / show ip arp / show ip cef',
    routerSpecEn: 'show ip route / show ip arp / show ip cef',
    category: 'cli'
  }
];

const FLASHCARDS = [
  {
    clue: 'يقوم بفحص حقل زمن الحياة (TTL) وإنقاصه بواحد قبل إعادة إرسال الحزمة.',
    clueEn: 'Inspects the Time-to-Live (TTL) header field and decrements it by 1 before re-forwarding.',
    correct: 'router',
    explanation: 'الراوتر هو الجهاز الوحيد في الطبقة الثالثة الذي يعدل حقل الـ TTL لحماية الشبكات من الحلقات اللانهائية.',
    explanationEn: 'The router is the Layer 3 device responsible for decrementing TTL to protect networks from routing loops.'
  },
  {
    clue: 'إذا استلم فريم موجه لعنوان غير موجود في جدول العناوين، يقوم بعملية إفاضة (Flooding) لجميع المنافذ.',
    clueEn: 'If a frame is received for a destination MAC not in the CAM table, it performs Unknown Unicast Flooding across all member ports.',
    correct: 'switch',
    explanation: 'هذا السلوك يسمى Unknown Unicast Flooding وهو خاص بالسويتش في الطبقة الثانية.',
    explanationEn: 'This behavior is Unknown Unicast Flooding, standard Layer 2 switch forwarding behavior.'
  },
  {
    clue: 'يستخدم خوارزمية شجرة الامتداد (STP) لحظر المنافذ الفائضة الزائدة.',
    clueEn: 'Uses the Spanning Tree Protocol (STP) algorithm to place redundant redundant ports into blocking mode.',
    correct: 'switch',
    explanation: 'بروتوكول STP هو درع الأمان للسويتشات لمنع العواصف البرمجية الناتجة عن الحلقات الفيزيائية.',
    explanationEn: 'STP is the Layer 2 loop-prevention shield running on Ethernet switches.'
  },
  {
    clue: 'يقوم بربط شبكتين فرعيتين مختلفتين كلياً (مثل 192.168.1.0/24 مع 10.0.0.0/8).',
    clueEn: 'Interconnects two completely different IP subnets (e.g., 192.168.1.0/24 with 10.0.0.0/8).',
    correct: 'router',
    explanation: 'الربط بين شبكات فرعية مختلفة (Inter-Subnet Routing) هو الوظيفة الأساسية للراوتر.',
    explanationEn: 'Interconnecting different IP subnets is the core defining function of a Layer 3 Router.'
  }
];

interface SwitchVsRouterMatrixToolProps {
  lang?: Language;
}

export const SwitchVsRouterMatrixTool: React.FC<SwitchVsRouterMatrixToolProps> = ({ lang = 'ar' }) => {
  const isEn = lang === 'en';
  const [filterCategory, setFilterCategory] = useState<'all' | 'core' | 'hardware' | 'cli'>('all');
  const [activeCardIndex, setActiveCardIndex] = useState(0);
  const [selectedGuess, setSelectedGuess] = useState<'switch' | 'router' | null>(null);

  const filteredData = MATRIX_DATA.filter(item => {
    if (filterCategory === 'all') return true;
    return item.category === filterCategory;
  });

  const currentCard = FLASHCARDS[activeCardIndex];
  const isGuessCorrect = selectedGuess === currentCard.correct;

  return (
    <div className={`bg-slate-900/90 rounded-3xl border border-white/[0.08] p-5 sm:p-6 shadow-2xl font-sans backdrop-blur-xl ${isEn ? 'text-left dir-ltr' : 'text-right dir-rtl'}`}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/[0.06] pb-4 mb-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
            <GitCompare className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-bold text-white">
              {isEn ? 'Architectural Comparison: Switch vs Router' : 'مصفوفة المقارنة الهندسية الشاملة: السويتش مقابل الراوتر'}
            </h3>
            <p className="text-xs text-slate-400">
              {isEn 
                ? 'Precise breakdown of architectural, operational, and hardware differences in enterprise networks'
                : 'تحليل دقيق للفروقات المعمارية والوظيفية والتشغيلية في شبكات المؤسسات'}
            </p>
          </div>
        </div>

        {/* Filter Buttons */}
        <div className="flex flex-wrap items-center gap-1.5 self-start sm:self-auto text-xs font-mono">
          <button
            onClick={() => setFilterCategory('all')}
            className={`px-3 py-1.5 rounded-xl border transition-all cursor-pointer ${
              filterCategory === 'all'
                ? 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30 font-bold'
                : 'bg-slate-950 text-slate-400 border-white/[0.06] hover:text-slate-200'
            }`}
          >
            {isEn ? 'All' : 'الكل'}
          </button>
          <button
            onClick={() => setFilterCategory('core')}
            className={`px-3 py-1.5 rounded-xl border transition-all cursor-pointer ${
              filterCategory === 'core'
                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30 font-bold'
                : 'bg-slate-950 text-slate-400 border-white/[0.06] hover:text-slate-200'
            }`}
          >
            {isEn ? 'Core Concepts' : 'المفاهيم الأساسية'}
          </button>
          <button
            onClick={() => setFilterCategory('hardware')}
            className={`px-3 py-1.5 rounded-xl border transition-all cursor-pointer ${
              filterCategory === 'hardware'
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/30 font-bold'
                : 'bg-slate-950 text-slate-400 border-white/[0.06] hover:text-slate-200'
            }`}
          >
            {isEn ? 'Hardware & ASICs' : 'العتاد والمعالجة'}
          </button>
          <button
            onClick={() => setFilterCategory('cli')}
            className={`px-3 py-1.5 rounded-xl border transition-all cursor-pointer ${
              filterCategory === 'cli'
                ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30 font-bold'
                : 'bg-slate-950 text-slate-400 border-white/[0.06] hover:text-slate-200'
            }`}
          >
            {isEn ? 'CLI Commands' : 'أوامر الـ CLI'}
          </button>
        </div>
      </div>

      {/* Main Comparison Table */}
      <div className="p-4 rounded-2xl bg-slate-950 border border-white/[0.06] mb-6 overflow-x-auto">
        <table className={`w-full text-xs sm:text-sm font-sans ${isEn ? 'text-left dir-ltr' : 'text-right dir-rtl'}`}>
          <thead>
            <tr className="border-b border-white/[0.06] text-slate-400">
              <th className="py-2.5 px-3 font-bold">{isEn ? 'Technical Parameter' : 'المعيار التقني'}</th>
              <th className="py-2.5 px-3 font-bold text-emerald-300">{isEn ? 'Layer 2 Switch' : 'سويتش الطبقة الثانية (L2 Switch)'}</th>
              <th className="py-2.5 px-3 font-bold text-indigo-300">{isEn ? 'Layer 3 Router' : 'الراوتر (L3 Router)'}</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((row, idx) => (
              <tr key={idx} className="border-b border-white/[0.02] hover:bg-white/[0.02] transition-colors">
                <td className="py-3 px-3 font-bold text-white text-xs">{isEn ? row.parameterEn : row.parameter}</td>
                <td className="py-3 px-3 text-emerald-200/90 text-xs leading-relaxed">{isEn ? row.switchSpecEn : row.switchSpec}</td>
                <td className="py-3 px-3 text-indigo-200/90 text-xs leading-relaxed">{isEn ? row.routerSpecEn : row.routerSpec}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Interactive Micro-Challenge: Flashcards */}
      <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-slate-950 to-slate-900 border border-white/[0.08]">
        <div className="flex items-center justify-between pb-2 mb-3 border-b border-white/[0.06]">
          <span className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
            <Sparkles className="w-4 h-4" />
            <span>
              {isEn 
                ? `Rapid Architectural Challenge (Question ${activeCardIndex + 1} of ${FLASHCARDS.length}):`
                : `تحدي التمييز الهندسي السريع (سؤال ${activeCardIndex + 1} من ${FLASHCARDS.length}):`}
            </span>
          </span>
          <span className="text-[11px] font-mono text-slate-500">
            {isEn ? 'Identify the device responsible' : 'اختر الجهاز المناسب للوصف'}
          </span>
        </div>

        <p className="text-sm font-bold text-white mb-4 leading-relaxed">
          &ldquo;{isEn ? currentCard.clueEn : currentCard.clue}&rdquo;
        </p>

        {/* Choice Buttons */}
        <div className="flex flex-wrap items-center gap-3 mb-4">
          <button
            disabled={selectedGuess !== null}
            onClick={() => setSelectedGuess('switch')}
            className={`px-5 py-2.5 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
              selectedGuess === 'switch'
                ? currentCard.correct === 'switch'
                  ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300'
                  : 'bg-rose-500/20 border-rose-500 text-rose-300'
                : 'bg-slate-950 hover:bg-slate-800 border-white/[0.08] text-slate-300'
            }`}
          >
            {isEn ? 'Switch' : 'سويتش (Switch)'}
          </button>

          <button
            disabled={selectedGuess !== null}
            onClick={() => setSelectedGuess('router')}
            className={`px-5 py-2.5 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
              selectedGuess === 'router'
                ? currentCard.correct === 'router'
                  ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300'
                  : 'bg-rose-500/20 border-rose-500 text-rose-300'
                : 'bg-slate-950 hover:bg-slate-800 border-white/[0.08] text-slate-300'
            }`}
          >
            {isEn ? 'Router' : 'راوتر (Router)'}
          </button>

          {selectedGuess !== null && (
            <button
              onClick={() => {
                setSelectedGuess(null);
                setActiveCardIndex((prev) => (prev + 1) % FLASHCARDS.length);
              }}
              className={`px-4 py-2 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/40 text-cyan-300 text-xs font-bold transition-all ${isEn ? 'ml-auto' : 'mr-auto'} cursor-pointer`}
            >
              {isEn ? 'Next Question →' : 'السؤال التالي ←'}
            </button>
          )}
        </div>

        {/* Feedback Alert */}
        {selectedGuess !== null && (
          <div className={`p-3 rounded-xl border text-xs leading-relaxed ${
            isGuessCorrect
              ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-200'
              : 'bg-rose-950/30 border-rose-500/40 text-rose-200'
          }`}>
            <span className="font-bold block mb-1">
              {isGuessCorrect 
                ? (isEn ? '🎉 Correct Architectural Analysis!' : '🎉 إجابة هندسية عبقرية!') 
                : (isEn ? '❌ Review Needed:' : '❌ محاولة تحتاج مراجعة:')}
            </span>
            {isEn ? currentCard.explanationEn : currentCard.explanation}
          </div>
        )}
      </div>
    </div>
  );
};
