import React, { useState, useEffect, useMemo } from 'react';
import {
  BookOpen,
  Bookmark,
  CheckCircle2,
  Sparkles,
  Clock,
  Award,
  Lightbulb,
  ArrowLeft,
  ArrowRight,
  Check,
} from 'lucide-react';
import { CurriculumTopic, Language, BookChapterPage, CiscoCliCommand } from '../types';
import { MarkdownContent } from './MarkdownContent';
import { ProgressBar, InfoCallout, HighlightGrid } from './ui/ContentDisplay';

interface TopicBookReaderProps {
  topic: CurriculumTopic;
  lang: Language;
  onMarkTopicCompleted?: (topicId: string) => void;
  isCompleted?: boolean;
  onBookmarkToggle?: (topicId: string) => void;
  isBookmarked?: boolean;
  savedNote?: string;
  onSaveNote?: (topicId: string, note: string) => void;
  readPages?: number[];
  onTogglePageRead?: (topicId: string, pageNum: number) => void;
}

export const TopicBookReader: React.FC<TopicBookReaderProps> = ({
  topic,
  lang,
  onMarkTopicCompleted,
  isCompleted = false,
  onBookmarkToggle,
  isBookmarked = false,
  readPages = [],
  onTogglePageRead,
}) => {
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const [fontSize, setFontSize] = useState<'normal' | 'large' | 'xlarge'>('normal');

  useEffect(() => { setCurrentPageIndex(0); }, [topic.id]);

  const bookPages: BookChapterPage[] = useMemo(() => {
    if (topic.bookPages && topic.bookPages.length > 0) return topic.bookPages;

    const pages: BookChapterPage[] = [];

    pages.push({
      pageNumber: 1,
      chapterTitleAr: 'الفصل الأول: البنية المعمارية والمفاهيم التأسيسية العميقة',
      chapterTitleEn: 'Chapter 1: Architectural Foundation & Core Concepts',
      badgeAr: 'المفاهيم والنظريات',
      badgeEn: 'Concepts & Theories',
      estimatedReadTime: '4 دقائق',
      contentMarkdownAr: `### 🏛️ البنية التأسيسية للموضوع (${topic.titleAr})
يعتبر هذا الموضوع ركيزة أساسية في معايير سيسكو الرسمية (${topic.ciscoBlueprintRef}).

${topic.contentMarkdownAr}

---

### 🌐 التموضع الهندسي في مكدس الشبكات (Stack Positioning)
- **المستوى المعماري:** يخدم هذا البروتوكول طبقات النقل والتوجيه والربط الفيزيائي في الشبكات المؤسسية.
- **التوافقية المعيارية:** متوافق مع معايير IETF و IEEE الرسمية الموثقة في المراجع.
- **هدف التطبيق:** تأمين أعلى درجات التوافرية (High Availability)، تقليل زمن التأخير (Latency)، وضمان خلو البنية التحتية من الحلقات والاختناقات.`,
      contentMarkdownEn: topic.contentMarkdownEn || topic.contentMarkdownAr,
      keyTakeawaysAr: [
        `فهم الهدف المعماري للتقنية وسياقها في امتحان ${topic.level}.`,
        'الربط بين المعايير القياسية والتشغيل الفعلي على عتاد سيسكو.',
        'التعرف على الفروق الجوهرية مقارنة بالتقنيات والبروتوكولات السابقة.',
      ],
      ciscoTipAr: 'يركز امتحان سيسكو على فهم السيناريوهات التي تستدعي تفعيل هذه التقنية مقارنة بالبدائل المتاحة.',
    });

    pages.push({
      pageNumber: 2,
      chapterTitleAr: 'الفصل الثاني: التشريح الدقيق للترويسة والرياضيات الثنائية',
      chapterTitleEn: 'Chapter 2: Bit-Level Packet Header & Mathematics',
      badgeAr: 'التشريح بالبتات',
      badgeEn: 'Bit Dissection',
      estimatedReadTime: '5 دقائق',
      contentMarkdownAr: `### 🔬 التشريح الرياضي والهيكلي للبيانات
في هذا الفصل ندرس كيفية تشكيل الحزم والترويسات على مستوى البتات (Bits & Bytes) داخل العتاد وسرعة التبديل (ASIC Line Rate).

${topic.protocolDetails && topic.protocolDetails.length > 0 ? `
#### 📦 حقول الترويسة الرسمية (Official Header Fields):
${topic.protocolDetails[0].headerStructure.map(h => `- **${h.field} (${h.bits} Bits):** ${h.descAr}`).join('\n')}
` : `
#### 📐 القواعد الرياضية والهندسية:
- **المعادلات الحسابية:** تخضع كافة العمليات لقوانين البتات الرياضية الصارمة.
- **الاستقرار الرياضي:** تعتمد خوارزميات سيسكو على معادلات متوازنة تمنع التذبذب وتقصر زمن التقارب (Convergence Time).
`}

---

### ⚡ خوارزميات المعالجة في محركات التبديل (Hardware ASICs)
1. فحص مجاميع التحقق الدورية (Checksums / FCS) للكشف عن الأخطاء أثناء الإرسال.
2. مقارنة العناوين في جداول الذاكرة العشوائية السريعة جداً (TCAM Tables).
3. اتخاذ قرار إعادة التوجيه في أجزاء من الميكروثانية دون إشغال معالج التحكم (Control Plane CPU).`,
      contentMarkdownEn: topic.contentMarkdownEn || topic.contentMarkdownAr,
      keyTakeawaysAr: [
        'معرفة أحجام الحقول بالبتات ووظيفة كل حقل في الترويسة.',
        'القدرة على تطبيق القوانين الرياضية والحسابية دون أخطاء.',
        'فهم كيفية تخزين ومعالجة الترويسات في ذاكرة TCAM.',
      ],
      ciscoTipAr: 'احفظ أطوال الترويسات القياسية بالبايت، حيث تتكرر أسئلة مقارنة الأحجام في الامتحانات الدولية.',
    });

    pages.push({
      pageNumber: 3,
      chapterTitleAr: 'الفصل الثالث: التكوين العملي وأوامر التحقق في Cisco IOS',
      chapterTitleEn: 'Chapter 3: Real Cisco IOS CLI Configuration & Verification',
      badgeAr: 'التطبيق العملي',
      badgeEn: 'Lab Implementation',
      estimatedReadTime: '6 دقائق',
      contentMarkdownAr: `### 💻 إعدادات وتكوين أجهزة سيسكو (Cisco IOS-XE Configuration)
في هذا الفصل ننتقل إلى شاشات سيسكو التفاعلية (Cisco CLI) لتطبيق الإعدادات وفحص جداول الحالة الحية.

${topic.ciscoCliOutputs && topic.ciscoCliOutputs.length > 0 ? `
#### 🖥️ الأوامر التنفيذية المعتمدة ومخرجاتها الحقيقية:
${topic.ciscoCliOutputs.map((cmd: CiscoCliCommand) => `
\`\`\`cisco
${cmd.deviceName}(${cmd.mode})# ${cmd.command}
${cmd.output}
\`\`\`
> **💡 التحليل الهندسي للأمر:** ${cmd.explanationAr}
`).join('\n\n')}
` : `
#### 📝 هيكلية الأوامر الأساسية:
\`\`\`cisco
Router(config)# feature enable
Router(config)# interface GigabitEthernet0/0/1
Router(config-if)# ip address 192.168.10.1 255.255.255.0
Router(config-if)# no shutdown
\`\`\`
`}

---

### 🔍 أوامر الفحص والتحقق الأهم (Golden Verification Commands)
- أمر \`show ip route\` أو \`show mac address-table\` للتأكد من حالة التوجيه والتبديل.
- أمر \`show interfaces status\` لفحص الطبقة الفيزيائية ومعدل الأخطاء.`,
      contentMarkdownEn: topic.contentMarkdownEn || topic.contentMarkdownAr,
      keyTakeawaysAr: [
        'إتقان كتابة الأوامر بالصيغة الهندسية الصحيحة.',
        'قراءة وتحليل مخرجات أوامر show لاستخلاص حالة الشبكة.',
        'التمييز بين وضع التكوين العام (Global Config) وأوضاع الواجهات والموجهات.',
      ],
      ciscoTipAr: 'في أسئلة المختبرات العملية (Simulations)، تحقق دائماً من نتيجة كل أمر تكتبه عبر أمر show المقابل.',
    });

    pages.push({
      pageNumber: 4,
      chapterTitleAr: 'الفصل الرابع: استكشاف الأعطال وتشخيصات دعم سيسكو TAC',
      chapterTitleEn: 'Chapter 4: Troubleshooting & Cisco TAC Diagnostics',
      badgeAr: 'استكشاف الأعطال',
      badgeEn: 'Troubleshooting',
      estimatedReadTime: '5 دقائق',
      contentMarkdownAr: `### 🛠️ استكشاف الأعطال المعقدة (Troubleshooting Methodology)
يتبع مهندسو الدعم الفني في سيسكو (Cisco TAC) منهجية علمية منظمة تعتمد على عزل المشكلة من الطبقة الدنيا إلى الطبقة العليا.

| العرض والمشكلة (Symptom) | السبب الجذري المحتمل (Root Cause) | الإجراء التصحيحي الموصى به (Resolution) |
| :--- | :--- | :--- |
| انقطاع الاتصال أو عدم تشكل التجاور | عدم تطابق في المؤقتات (Timers) أو أقنعة الشبكة | التحقق من تطابق MTU والمؤقتات والـ Area IDs |
| بطء حاد وتذبذب في الحزم | وجود حلقة تكرارية أو انخفاض في سعة الرابط | مراجعة إعدادات STP أو الروابط المجمعة EtherChannel |
| إسقاط الحزم العشوائي | خطأ في إعدادات قوائم التحكم بالوصول (ACLs) | فحص عدادات الحزم بأمر \`show ip access-lists\` |

---

### 🩺 أوامر التشخيص الفوري (Real-Time Diagnostics)
- استخدام أوامر \`debug\` بحذر في بيئات الإنتاج مع قوائم تحكم لحماية المعالج.
- مراقبة سجلات النظام عبر \`show logging\` للتعرف على رسائل التحذير الفورية.`,
      contentMarkdownEn: topic.contentMarkdownEn || topic.contentMarkdownAr,
      keyTakeawaysAr: [
        'معرفة الأسباب الأكثر شيوعاً لفشل التقنية في الواقع العملي.',
        'استخدام منهجية عزل الطبقات لحل المشكلات بسرعة.',
        'تجنب الأخطاء الكارثية في أوامر debug داخل شبكات الشركات.',
      ],
      ciscoTipAr: 'عند حدوث خلل، ابدأ دائماً بالتحقق من الطبقة الأولى والثانية (Layer 1/2) قبل البحث في توجيه الطبقة الثالثة.',
    });

    pages.push({
      pageNumber: 5,
      chapterTitleAr: 'الفصل الخامس: ورقة المرجع السريع واستراتيجيات اجتياز الامتحان',
      chapterTitleEn: 'Chapter 5: Official Exam Blueprint & Quick Reference Sheet',
      badgeAr: 'ملخص الامتحان',
      badgeEn: 'Exam Cheat Sheet',
      estimatedReadTime: '3 دقائق',
      contentMarkdownAr: `### 🎯 ورقة المرجع السريع (Quick Reference Cheat Sheet)
نلخص هنا أهم الأرقام والمفاهيم الثابتة التي يجب أن يستحضرها مهندس سيسكو فوراً:

${(topic.technicalHighlights || []).map(h => `- ✅ **${h}**`).join('\n')}

---

### ⚠️ الفخاخ الامتحانية الشائعة (Common Exam Pitfalls):
1. **الخلط بين المصطلحات المتشابهة:** تأكد من التمييز الدقيق بين مسميات المعايير والبروتوكولات.
2. **إهمال العناوين الافتراضية:** تذكر دائماً العناوين المحجوزة مثل عناوين البث والشبكة والـ Loopback.
3. **أولويات المسارات:** تذكر قاعدة *Longest Prefix Match* وقيم المسافة الإدارية (Administrative Distance).`,
      contentMarkdownEn: topic.contentMarkdownEn || topic.contentMarkdownAr,
      keyTakeawaysAr: [
        'مراجعة سريعة لأهم الأرقام والقيم الثابتة.',
        'تثبيت الفروق الدقيقة قبل دخول قاعة الامتحان.',
        'امتلاك ثقة هندسية عالية في حل المسائل النظرية والعملية.',
      ],
      ciscoTipAr: 'اقرأ أسئلة الامتحان بالكامل حتى آخر كلمة، فغالباً ما تغير كلمة استثناء واحدة الإجابة الصحيحة بالكامل.',
    });

    return pages;
  }, [topic]);

  const currentPage = bookPages[currentPageIndex] || bookPages[0];
  const totalPages = bookPages.length;
  const isCurrentPageRead = readPages.includes(currentPage.pageNumber);
  const readCount = readPages.length;

  const getTextSizeClass = () => {
    if (fontSize === 'large') return 'text-base sm:text-lg';
    if (fontSize === 'xlarge') return 'text-lg sm:text-xl';
    return 'text-xs sm:text-sm';
  };

  return (
    <div className="space-y-4">
      {/* Reading Progress */}
      <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.06] space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-amber-400" />
            <span className="text-xs font-bold text-white">{topic.titleAr}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 p-0.5 rounded-lg bg-white/[0.04] border border-white/[0.06]">
              {(['normal', 'large', 'xlarge'] as const).map((size) => (
                <button
                  key={size}
                  onClick={() => setFontSize(size)}
                  className={`px-2 py-1 rounded-md text-[11px] font-bold transition-colors cursor-pointer ${
                    fontSize === size ? 'bg-amber-500/20 text-amber-300' : 'text-slate-500 hover:text-slate-300'
                  }`}
                >
                  {size === 'normal' ? 'A' : size === 'large' ? 'A+' : 'A++'}
                </button>
              ))}
            </div>
            {onBookmarkToggle && (
              <button
                onClick={() => onBookmarkToggle(topic.id)}
                className={`p-2 rounded-lg border transition-all cursor-pointer ${
                  isBookmarked ? 'bg-amber-500/15 text-amber-300 border-amber-500/30' : 'bg-white/[0.03] text-slate-500 border-white/[0.06]'
                }`}
              >
                <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-amber-400' : ''}`} />
              </button>
            )}
            {onMarkTopicCompleted && (
              <button
                onClick={() => onMarkTopicCompleted(topic.id)}
                className={`p-2 rounded-lg border transition-all cursor-pointer ${
                  isCompleted ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30' : 'bg-white/[0.03] text-slate-500 border-white/[0.06]'
                }`}
              >
                <CheckCircle2 className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
        <ProgressBar
          value={readCount}
          max={totalPages}
          label={lang === 'ar' ? `تقدم القراءة — ${readCount}/${totalPages} صفحات` : `Reading Progress — ${readCount}/${totalPages} pages`}
        />
      </div>

      {/* Book Layout: Chapter Stepper + Content */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
        {/* Chapter Navigation */}
        <div className="lg:col-span-3 space-y-1 p-3 rounded-2xl bg-white/[0.02] border border-white/[0.06]">
          <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider px-2 mb-2">
            {lang === 'ar' ? 'فصول الكتاب' : 'Chapters'}
          </div>
          {bookPages.map((page, idx) => {
            const isActive = idx === currentPageIndex;
            const isRead = readPages.includes(page.pageNumber);
            return (
              <button
                key={page.pageNumber}
                onClick={() => setCurrentPageIndex(idx)}
                className={`w-full flex items-center gap-2.5 p-2.5 rounded-xl text-right transition-all cursor-pointer ${
                  isActive
                    ? 'bg-amber-500/15 border border-amber-500/30'
                    : 'hover:bg-white/[0.04] border border-transparent'
                }`}
              >
                <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-[11px] font-black shrink-0 ${
                  isActive ? 'bg-amber-500 text-black' : isRead ? 'bg-emerald-500/20 text-emerald-400' : 'bg-white/[0.06] text-slate-500'
                }`}>
                  {isRead && !isActive ? '✓' : page.pageNumber}
                </div>
                <div className="min-w-0">
                  <div className={`text-[11px] font-bold truncate ${isActive ? 'text-amber-300' : isRead ? 'text-emerald-400' : 'text-slate-400'}`}>
                    {page.badgeAr}
                  </div>
                  <div className="text-[10px] text-slate-600 flex items-center gap-1 mt-0.5">
                    <Clock className="w-2.5 h-2.5" />
                    {page.estimatedReadTime}
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Page Content */}
        <div className="lg:col-span-9 space-y-4">
          <div className="p-5 sm:p-6 rounded-2xl bg-white/[0.02] border border-white/[0.06] space-y-5">
            {/* Chapter Header */}
            <div className="flex flex-wrap items-start justify-between gap-3 pb-4 border-b border-white/[0.06]">
              <div>
                <div className="flex items-center gap-2 text-[11px] text-amber-400 font-bold">
                  <span>{currentPage.badgeAr}</span>
                  <span className="text-slate-600">•</span>
                  <span className="flex items-center gap-1 text-slate-500">
                    <Clock className="w-3 h-3" />
                    {currentPage.estimatedReadTime}
                  </span>
                </div>
                <h3 className="text-base font-black text-white mt-1.5 leading-snug">
                  {currentPage.chapterTitleAr}
                </h3>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-mono text-amber-400/80 bg-amber-500/10 px-2.5 py-1 rounded-lg border border-amber-500/20">
                  {currentPage.pageNumber} / {totalPages}
                </span>
                {onTogglePageRead && (
                  <button
                    onClick={() => onTogglePageRead(topic.id, currentPage.pageNumber)}
                    className={`px-3 py-1 rounded-lg text-[11px] font-bold flex items-center gap-1 transition-all cursor-pointer ${
                      isCurrentPageRead
                        ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
                        : 'bg-white/[0.04] text-slate-400 border border-white/[0.06] hover:text-slate-200'
                    }`}
                  >
                    <Check className="w-3 h-3" />
                    {isCurrentPageRead ? (lang === 'ar' ? 'مقروء' : 'Read') : (lang === 'ar' ? 'تعليم مقروء' : 'Mark read')}
                  </button>
                )}
              </div>
            </div>

            {/* Markdown Body */}
            <div className={`book-text-body ${getTextSizeClass()} leading-relaxed`}>
              <MarkdownContent content={currentPage.contentMarkdownAr} lang={lang} />
            </div>

            {/* Cisco Tip */}
            {currentPage.ciscoTipAr && (
              <InfoCallout
                title={lang === 'ar' ? 'نصيحة ذهبية لمهندسي سيسكو' : 'Cisco Engineering Tip'}
                icon={<Lightbulb className="w-4 h-4" />}
              >
                {currentPage.ciscoTipAr}
              </InfoCallout>
            )}

            {/* Key Takeaways */}
            {currentPage.keyTakeawaysAr && currentPage.keyTakeawaysAr.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-cyan-300 flex items-center gap-2">
                  <Award className="w-4 h-4 text-cyan-400" />
                  {lang === 'ar' ? 'أهم مخرجات التعلم' : 'Key Learning Outcomes'}
                </h4>
                <HighlightGrid
                  items={currentPage.keyTakeawaysAr.map(t => ({ text: t }))}
                  columns={1}
                />
              </div>
            )}
          </div>

          {/* Page Navigation */}
          <div className="flex items-center justify-between gap-3">
            <button
              onClick={() => setCurrentPageIndex(prev => Math.max(0, prev - 1))}
              disabled={currentPageIndex === 0}
              className="px-4 py-2.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.06] text-slate-300 text-xs font-bold flex items-center gap-2 disabled:opacity-30 cursor-pointer transition-all"
            >
              <ArrowRight className="w-4 h-4" />
              {lang === 'ar' ? 'السابق' : 'Previous'}
            </button>

            <div className="flex items-center gap-1.5">
              {bookPages.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentPageIndex(idx)}
                  className={`h-2 rounded-full transition-all cursor-pointer ${
                    idx === currentPageIndex ? 'w-6 bg-amber-400' : readPages.includes(idx + 1) ? 'w-2 bg-emerald-500' : 'w-2 bg-white/[0.1] hover:bg-white/20'
                  }`}
                />
              ))}
            </div>

            <button
              onClick={() => setCurrentPageIndex(prev => Math.min(totalPages - 1, prev + 1))}
              disabled={currentPageIndex === totalPages - 1}
              className="px-4 py-2.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/30 text-amber-300 text-xs font-bold flex items-center gap-2 disabled:opacity-30 cursor-pointer transition-all"
            >
              {lang === 'ar' ? 'التالي' : 'Next'}
              <ArrowLeft className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Executive Summary */}
      <div className="p-5 rounded-2xl bg-gradient-to-br from-white/[0.03] to-white/[0.01] border border-white/[0.06] space-y-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-cyan-500/15 border border-cyan-500/25">
            <Sparkles className="w-4 h-4 text-cyan-400" />
          </div>
          <div>
            <h3 className="text-sm font-black text-white">
              {lang === 'ar' ? 'ملخص الموضوع التنفيذي' : 'Topic Executive Summary'}
            </h3>
            <p className="text-[11px] text-slate-500">{topic.titleAr}</p>
          </div>
        </div>
        <p className="text-xs text-slate-300 leading-relaxed">
          {topic.summaryAr || `يمثل موضوع ${topic.titleAr} (${topic.ciscoBlueprintRef}) حجر الأساس لشهادة سيسكو الرسمية.`}
        </p>
        {topic.technicalHighlights && topic.technicalHighlights.length > 0 && (
          <HighlightGrid
            items={topic.technicalHighlights.map(h => ({ text: h }))}
            columns={2}
          />
        )}
      </div>
    </div>
  );
};
