import React, { useState, useEffect, useMemo } from 'react';
import { 
  BookOpen, 
  ChevronRight, 
  ChevronLeft, 
  Bookmark, 
  CheckCircle2, 
  Sparkles, 
  Layers, 
  Terminal, 
  ShieldAlert, 
  HelpCircle, 
  Clock, 
  FileText, 
  ZoomIn, 
  ZoomOut, 
  Award, 
  Share2, 
  ArrowLeft, 
  ArrowRight,
  Lightbulb,
  ExternalLink,
  Edit,
  Save,
  Check
} from 'lucide-react';
import { CurriculumTopic, Language, BookChapterPage, CiscoCliCommand } from '../types';
import { MarkdownContent } from './MarkdownContent';

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
  savedNote = '',
  onSaveNote,
  readPages = [],
  onTogglePageRead
}) => {
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const [fontSize, setFontSize] = useState<'normal' | 'large' | 'xlarge'>('normal');
  const [noteText, setNoteText] = useState(savedNote);
  const [showNoteEditor, setShowNoteEditor] = useState(false);
  const [noteSavedFeedback, setNoteSavedFeedback] = useState(false);

  useEffect(() => {
    setNoteText(savedNote);
  }, [savedNote]);

  // Reset to first page when topic changes
  useEffect(() => {
    setCurrentPageIndex(0);
  }, [topic.id]);

  // Generate or retrieve multi-page book chapters
  const bookPages: BookChapterPage[] = useMemo(() => {
    if (topic.bookPages && topic.bookPages.length > 0) {
      return topic.bookPages;
    }

    // Comprehensive dynamic synthesis into a structured 5-page Cisco textbook
    const pages: BookChapterPage[] = [];

    // Page 1: Architecture & Theoretical Foundation
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
        'التعرف على الفروق الجوهرية مقارنة بالتقنيات والبروتوكولات السابقة.'
      ],
      ciscoTipAr: 'يركز امتحان سيسكو على فهم السيناريوهات التي تستدعي تفعيل هذه التقنية مقارنة بالبدائل المتاحة.'
    });

    // Page 2: Bit-Level Packet Dissection & Mathematics
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
- **المعادلات الحسابية:** تخضع كافة العمليات لقوانين البتات الرياضية الصارمة، مثل حسابات الإزاحة، أقنعة الشبكات الفرعية، وأوزان القياس المترية.
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
        'فهم كيفية تخزين ومعالجة الترويسات في ذاكرة TCAM.'
      ],
      ciscoTipAr: 'احفظ أطوال الترويسات القياسية بالبايت، حيث تتكرر أسئلة مقارنة الأحجام في الامتحانات الدولية.'
    });

    // Page 3: Real Configuration & Show Command Matrix
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
        'التمييز بين وضع التكوين العام (Global Config) وأوضاع الواجهات والموجهات.'
      ],
      ciscoTipAr: 'في أسئلة المختبرات العملية (Simulations)، تحقق دائماً من نتيجة كل أمر تكتبه عبر أمر show المقابل.'
    });

    // Page 4: Troubleshooting & TAC Diagnostic Scenarios
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
        'تجنب الأخطاء الكارثية في أوامر debug داخل شبكات الشركات.'
      ],
      ciscoTipAr: 'عند حدوث خلل، ابدأ دائماً بالتحقق من الطبقة الأولى والثانية (Layer 1/2) قبل البحث في توجيه الطبقة الثالثة.'
    });

    // Page 5: Official Exam Blueprint & Quick Reference
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
        'امتلاك ثقة هندسية عالية في حل المسائل النظرية والعملية.'
      ],
      ciscoTipAr: 'اقرأ أسئلة الامتحان بالكامل حتى آخر كلمة، فغالباً ما تغير كلمة استثناء واحدة الإجابة الصحيحة بالكامل.'
    });

    return pages;
  }, [topic]);

  const currentPage = bookPages[currentPageIndex] || bookPages[0];
  const totalPages = bookPages.length;
  const isCurrentPageRead = readPages.includes(currentPage.pageNumber);

  const nextPage = () => {
    if (currentPageIndex < totalPages - 1) {
      setCurrentPageIndex(prev => prev + 1);
    }
  };

  const prevPage = () => {
    if (currentPageIndex > 0) {
      setCurrentPageIndex(prev => prev - 1);
    }
  };

  const handleSaveNote = () => {
    if (onSaveNote) {
      onSaveNote(topic.id, noteText);
      setNoteSavedFeedback(true);
      setTimeout(() => setNoteSavedFeedback(false), 2000);
    }
  };

  const getTextSizeClass = () => {
    if (fontSize === 'large') return 'text-base sm:text-lg';
    if (fontSize === 'xlarge') return 'text-lg sm:text-xl';
    return 'text-xs sm:text-sm';
  };

  return (
    <div className="space-y-6">
      {/* LUXURY DIGITAL BOOK CONTAINER */}
      <div 
        className="rounded-3xl bg-gradient-to-b from-slate-900 via-[#0b1222] to-slate-950 border border-slate-700/80 shadow-2xl overflow-hidden text-right font-sans"
        dir="rtl"
      >
        {/* BOOK HEADER BAR */}
        <div className="px-6 py-4 bg-slate-950/90 border-b border-slate-800 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <div className="p-2.5 rounded-2xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 shrink-0">
              <BookOpen className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-[10px] font-bold font-mono">
                  {topic.ciscoBlueprintRef}
                </span>
                <span className="px-2 py-0.5 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-[10px] font-bold">
                  كتاب سيسكو التفاعلي المعتمد
                </span>
              </div>
              <h2 className="text-base sm:text-lg font-black text-white truncate mt-1">
                {topic.titleAr}
              </h2>
            </div>
          </div>

          {/* Reader Controls */}
          <div className="flex items-center gap-2">
            {/* Font size toggles */}
            <div className="flex items-center gap-1 p-1 rounded-xl bg-slate-900 border border-slate-800 text-xs">
              <button
                onClick={() => setFontSize('normal')}
                className={`px-2 py-1 rounded-lg text-[11px] font-bold transition-colors cursor-pointer ${fontSize === 'normal' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'}`}
                title="حجم خط قياسي"
              >
                A
              </button>
              <button
                onClick={() => setFontSize('large')}
                className={`px-2 py-1 rounded-lg text-xs font-bold transition-colors cursor-pointer ${fontSize === 'large' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'}`}
                title="حجم خط كبير"
              >
                A+
              </button>
              <button
                onClick={() => setFontSize('xlarge')}
                className={`px-2 py-1 rounded-lg text-sm font-bold transition-colors cursor-pointer ${fontSize === 'xlarge' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'}`}
                title="حجم خط موسع"
              >
                A++
              </button>
            </div>

            {/* Bookmark button */}
            {onBookmarkToggle && (
              <button
                onClick={() => onBookmarkToggle(topic.id)}
                className={`p-2 rounded-xl border text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                  isBookmarked
                    ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                    : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
                }`}
                title={isBookmarked ? 'إلغاء التفضيل' : 'حفظ كمرجع مفضل'}
              >
                <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-amber-400 text-amber-400' : ''}`} />
                <span className="hidden sm:inline">{isBookmarked ? 'مفضل' : 'حفظ'}</span>
              </button>
            )}

            {/* Topic completed toggle */}
            {onMarkTopicCompleted && (
              <button
                onClick={() => onMarkTopicCompleted(topic.id)}
                className={`p-2 rounded-xl border text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                  isCompleted
                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                    : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
                }`}
                title={isCompleted ? 'مكتمل' : 'تعليم كمكتمل'}
              >
                <CheckCircle2 className={`w-4 h-4 ${isCompleted ? 'text-emerald-400' : ''}`} />
                <span className="hidden sm:inline">{isCompleted ? 'مكتمل' : 'إتمام'}</span>
              </button>
            )}
          </div>
        </div>

        {/* BOOK CHAPTER TABS (TABLE OF CONTENTS) */}
        <div className="px-6 py-2.5 bg-slate-950/60 border-b border-slate-800/80 overflow-x-auto">
          <div className="flex items-center gap-2 min-w-max">
            {bookPages.map((page, idx) => {
              const isPageActive = idx === currentPageIndex;
              const isPageRead = readPages.includes(page.pageNumber);
              return (
                <button
                  key={page.pageNumber}
                  onClick={() => setCurrentPageIndex(idx)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
                    isPageActive
                      ? 'bg-gradient-to-r from-indigo-600 to-cyan-600 text-white shadow-md shadow-indigo-600/30'
                      : 'bg-slate-900/90 text-slate-400 hover:text-slate-200 border border-slate-800/80'
                  }`}
                >
                  <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-mono ${isPageActive ? 'bg-white/20 text-white' : 'bg-slate-800 text-slate-400'}`}>
                    {page.pageNumber}
                  </span>
                  <span>{page.badgeAr}</span>
                  {isPageRead && (
                    <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* BOOK PAGE CONTENT BODY */}
        <div className="p-6 sm:p-8 space-y-6">
          {/* Chapter Subheader */}
          <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-800/80">
            <div>
              <div className="text-xs text-indigo-400 font-bold flex items-center gap-2">
                <span>{currentPage.badgeAr}</span>
                <span className="text-slate-600">•</span>
                <span className="flex items-center gap-1 text-slate-400">
                  <Clock className="w-3.5 h-3.5" />
                  <span>وقت القراءة التقديري: {currentPage.estimatedReadTime}</span>
                </span>
              </div>
              <h3 className="text-base sm:text-lg font-black text-white mt-1">
                {currentPage.chapterTitleAr}
              </h3>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-cyan-400 bg-cyan-950/60 px-2.5 py-1 rounded-lg border border-cyan-800/40">
                صفحة {currentPage.pageNumber} من {totalPages}
              </span>

              {onTogglePageRead && (
                <button
                  onClick={() => onTogglePageRead(topic.id, currentPage.pageNumber)}
                  className={`px-3 py-1 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                    isCurrentPageRead
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                      : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-slate-200'
                  }`}
                >
                  <Check className={`w-3.5 h-3.5 ${isCurrentPageRead ? 'text-emerald-400' : ''}`} />
                  <span>{isCurrentPageRead ? 'تمت قراءة هذه الصفحة' : 'تعليم كمقروء'}</span>
                </button>
              )}
            </div>
          </div>

          {/* Core Markdown Textbook Body */}
          <div className={`book-text-body ${getTextSizeClass()} leading-relaxed`}>
            <MarkdownContent content={currentPage.contentMarkdownAr} lang={lang} />
          </div>

          {/* Chapter Cisco Golden Tip */}
          {currentPage.ciscoTipAr && (
            <div className="p-4 rounded-2xl bg-amber-950/30 border border-amber-500/30 flex items-start gap-3 shadow-inner">
              <Lightbulb className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-bold text-amber-300 mb-1">
                  نصيحة ذهبية لمهندسي سيسكو (Cisco Engineering Tip):
                </h4>
                <p className="text-xs text-amber-200/90 leading-relaxed">
                  {currentPage.ciscoTipAr}
                </p>
              </div>
            </div>
          )}

          {/* Chapter Key Takeaways */}
          {currentPage.keyTakeawaysAr && currentPage.keyTakeawaysAr.length > 0 && (
            <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2.5">
              <h4 className="text-xs font-bold text-cyan-300 flex items-center gap-2">
                <Award className="w-4 h-4 text-cyan-400" />
                <span>أهم مخرجات التعلم في هذه الصفحة:</span>
              </h4>
              <ul className="space-y-1.5 pr-2">
                {currentPage.keyTakeawaysAr.map((item, idx) => (
                  <li key={idx} className="text-xs text-slate-300 flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shrink-0 mt-1.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* BOOK FOOTER NAVIGATION BAR */}
        <div className="px-6 py-4 bg-slate-950/90 border-t border-slate-800 flex items-center justify-between gap-4">
          <button
            onClick={prevPage}
            disabled={currentPageIndex === 0}
            className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-200 text-xs font-bold flex items-center gap-2 disabled:opacity-30 disabled:pointer-events-none transition-all cursor-pointer"
          >
            <ArrowRight className="w-4 h-4" />
            <span>الصفحة السابقة</span>
          </button>

          {/* Progress bar dots */}
          <div className="flex items-center gap-1.5">
            {bookPages.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentPageIndex(idx)}
                className={`h-2 rounded-full transition-all cursor-pointer ${
                  idx === currentPageIndex
                    ? 'w-6 bg-cyan-400'
                    : readPages.includes(idx + 1)
                    ? 'w-2 bg-emerald-500'
                    : 'w-2 bg-slate-800 hover:bg-slate-700'
                }`}
                title={`انتقال للصفحة ${idx + 1}`}
              />
            ))}
          </div>

          <button
            onClick={nextPage}
            disabled={currentPageIndex === totalPages - 1}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white text-xs font-bold flex items-center gap-2 disabled:opacity-30 disabled:pointer-events-none transition-all cursor-pointer shadow-md"
          >
            <span>الصفحة التالية</span>
            <ArrowLeft className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* COMPREHENSIVE EXECUTIVE SUMMARY (أسفل الكتاب كما طلب المستخدم) */}
      <div 
        className="rounded-3xl bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-800 p-6 sm:p-8 space-y-4 text-right font-sans shadow-xl"
        dir="rtl"
      >
        <div className="flex items-center gap-3 pb-3 border-b border-slate-800">
          <div className="p-2.5 rounded-2xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-black text-white flex items-center gap-2">
              <span>ملخص الموضوع التنفيذي الشامل (Topic Executive Summary)</span>
            </h3>
            <p className="text-xs text-slate-400">
              خلاصة المرجع السريع وأهم النقاط الأساسية الخاصة بـ {topic.titleAr}
            </p>
          </div>
        </div>

        <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-sans">
          {topic.summaryAr || `يمثل موضوع ${topic.titleAr} (${topic.ciscoBlueprintRef}) حجر الأساس لشهادة سيسكو الرسمية. يضمن التطبيق السليم لهذه التقنية بناء شبكات عالية الموثوقية والأداء، مع سرعة استجابة فائقة وخلو من حلقات التكرار والاختناقات الأمنية.`}
        </p>

        {/* Technical Highlights list */}
        {topic.technicalHighlights && topic.technicalHighlights.length > 0 && (
          <div className="mt-4 pt-4 border-t border-slate-800/80">
            <h4 className="text-xs font-bold text-cyan-300 mb-2.5">
              أهم الركائز التقنية المعتمدة في هذا الموضوع:
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {topic.technicalHighlights.map((hl, idx) => (
                <div key={idx} className="p-3 rounded-xl bg-slate-950/80 border border-slate-800/90 flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span className="text-xs text-slate-300 leading-relaxed font-sans">{hl}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
