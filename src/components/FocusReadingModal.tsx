import React, { useEffect, useState, useRef } from 'react';
import {
  X,
  Minimize2,
  Maximize,
  BookOpen,
  Check,
  CheckCircle2,
  Clock,
  ArrowLeft,
  ArrowRight,
  Network,
  HelpCircle,
  Lightbulb,
  Award,
  Sparkles,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { CurriculumTopic, Language, BookChapterPage } from '../types';
import { MarkdownContent } from './MarkdownContent';
import { NetworkSchematicDiagram } from './NetworkSchematicDiagram';
import { InfoCallout, HighlightGrid, ProgressBar } from './ui/ContentDisplay';

interface FocusReadingModalProps {
  isOpen: boolean;
  onClose: () => void;
  topic: CurriculumTopic;
  bookPages: BookChapterPage[];
  currentPageIndex: number;
  onSelectPageIndex: (index: number) => void;
  readPages: number[];
  onTogglePageRead?: (topicId: string, pageNum: number) => void;
  lang: Language;
  fontSize: 'normal' | 'large' | 'xlarge';
  setFontSize: (size: 'normal' | 'large' | 'xlarge') => void;
  selectedAnswer: number | null;
  setSelectedAnswer: (index: number | null) => void;
  isAnswerSubmitted: boolean;
  setIsAnswerSubmitted: (submitted: boolean) => void;
}

export const FocusReadingModal: React.FC<FocusReadingModalProps> = ({
  isOpen,
  onClose,
  topic,
  bookPages,
  currentPageIndex,
  onSelectPageIndex,
  readPages,
  onTogglePageRead,
  lang,
  fontSize,
  setFontSize,
  selectedAnswer,
  setSelectedAnswer,
  isAnswerSubmitted,
  setIsAnswerSubmitted,
}) => {
  const [isNativeFullscreen, setIsNativeFullscreen] = useState(false);
  const contentContainerRef = useRef<HTMLDivElement>(null);

  const currentPage = bookPages[currentPageIndex] || bookPages[0];
  const totalPages = bookPages.length;
  const isCurrentPageRead = readPages.includes(currentPage?.pageNumber || 1);

  // Scroll to top when chapter changes
  useEffect(() => {
    if (contentContainerRef.current) {
      contentContainerRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [currentPageIndex]);

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowLeft') {
        // In Arabic RTL, ArrowLeft navigates to Next, ArrowRight to Previous
        if (currentPageIndex < totalPages - 1) {
          onSelectPageIndex(currentPageIndex + 1);
        }
      } else if (e.key === 'ArrowRight') {
        if (currentPageIndex > 0) {
          onSelectPageIndex(currentPageIndex - 1);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, currentPageIndex, totalPages, onClose, onSelectPageIndex]);

  // Sync fullscreen state
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsNativeFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  const toggleNativeFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  };

  if (!isOpen) return null;

  const getTextSizeClass = () => {
    if (fontSize === 'large') return 'text-base sm:text-lg';
    if (fontSize === 'xlarge') return 'text-lg sm:text-xl';
    return 'text-sm sm:text-base';
  };

  return (
    <div
      id="focus-reading-modal"
      className="fixed inset-0 z-50 bg-[#060911] text-slate-100 flex flex-col overflow-hidden animate-fadeIn"
      dir={lang === 'ar' ? 'rtl' : 'ltr'}
    >
      {/* ── Top Header Navigation Bar ── */}
      <header className="h-16 px-4 sm:px-8 border-b border-white/[0.08] bg-[#090e1a]/95 backdrop-blur-md flex items-center justify-between gap-4 shrink-0">
        {/* Left: Topic & Chapter Meta */}
        <div className="flex items-center gap-3 min-w-0">
          <div className="p-2 rounded-xl bg-amber-500/15 border border-amber-500/25 shrink-0">
            <BookOpen className="w-5 h-5 text-amber-400" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded bg-amber-500/15 text-amber-300 font-mono text-[10px] font-bold">
                {topic.ciscoBlueprintRef}
              </span>
              <span className="text-[11px] font-bold text-slate-400 truncate hidden sm:inline">
                {lang === 'ar' ? topic.titleAr : topic.titleEn}
              </span>
            </div>
            <h2 className="text-xs sm:text-sm font-black text-white truncate flex items-center gap-2">
              <span className="text-amber-400 font-mono">
                {currentPage.pageNumber}/{totalPages}:
              </span>
              <span>{currentPage.chapterTitleAr}</span>
            </h2>
          </div>
        </div>

        {/* Right: Controls & Actions */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Font Size Adjuster */}
          <div className="flex items-center gap-1 p-1 rounded-xl bg-white/[0.04] border border-white/[0.08]">
            {(['normal', 'large', 'xlarge'] as const).map((size) => (
              <button
                key={size}
                onClick={() => setFontSize(size)}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  fontSize === size ? 'bg-amber-500/25 text-amber-300' : 'text-slate-500 hover:text-slate-300'
                }`}
                title={lang === 'ar' ? 'تغيير حجم الخط' : 'Change font size'}
              >
                {size === 'normal' ? 'A' : size === 'large' ? 'A+' : 'A++'}
              </button>
            ))}
          </div>

          {/* Mark Page Read */}
          {onTogglePageRead && (
            <button
              onClick={() => onTogglePageRead(topic.id, currentPage.pageNumber)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                isCurrentPageRead
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                  : 'bg-white/[0.04] text-slate-400 border border-white/[0.08] hover:text-slate-200'
              }`}
            >
              <Check className="w-3.5 h-3.5" />
              <span className="hidden md:inline">
                {isCurrentPageRead ? (lang === 'ar' ? 'تمت القراءة' : 'Read') : (lang === 'ar' ? 'تحديد كمقروء' : 'Mark as Read')}
              </span>
            </button>
          )}

          {/* Native Fullscreen Toggle */}
          <button
            onClick={toggleNativeFullscreen}
            className="p-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] text-slate-400 hover:text-white transition-all cursor-pointer"
            title={lang === 'ar' ? 'ملء الشاشة بالكامل' : 'Toggle Fullscreen'}
          >
            {isNativeFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
          </button>

          {/* Exit Focus Mode Button */}
          <button
            onClick={onClose}
            className="px-3 py-1.5 rounded-xl bg-rose-500/15 hover:bg-rose-500/25 border border-rose-500/30 text-rose-300 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
            title={lang === 'ar' ? 'الخروج من وضع القراءة (Esc)' : 'Exit Focus Mode (Esc)'}
          >
            <X className="w-4 h-4" />
            <span className="hidden sm:inline">{lang === 'ar' ? 'خروج' : 'Exit'}</span>
          </button>
        </div>
      </header>

      {/* ── Main Reading Content Canvas (Spacious & Centered) ── */}
      <main
        ref={contentContainerRef}
        className="flex-1 overflow-y-auto px-4 sm:px-8 py-8 sm:py-12 bg-gradient-to-b from-[#060911] to-[#090d18]"
      >
        <div className="max-w-4xl xl:max-w-5xl mx-auto space-y-8">
          {/* Chapter Meta Banner */}
          <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/[0.07] flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold text-amber-400 mb-2">
                <span className="px-2.5 py-0.5 rounded-full bg-amber-500/15 border border-amber-500/30">
                  {currentPage.badgeAr}
                </span>
                <span className="text-slate-600">•</span>
                <span className="flex items-center gap-1.5 text-slate-400">
                  <Clock className="w-3.5 h-3.5" />
                  {currentPage.estimatedReadTime}
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-black text-white leading-tight">
                {currentPage.chapterTitleAr}
              </h1>
              <p className="text-xs text-slate-500 font-mono mt-1">
                {currentPage.chapterTitleEn}
              </p>
            </div>
            <div className="flex items-center gap-2 text-sm font-mono text-amber-300 bg-amber-500/10 px-4 py-2 rounded-xl border border-amber-500/20">
              <span>{lang === 'ar' ? 'الفصل' : 'Chapter'}</span>
              <strong className="text-base">{currentPage.pageNumber}</strong>
              <span className="text-slate-600">/</span>
              <span>{totalPages}</span>
            </div>
          </div>

          {/* Markdown Main Text */}
          <article className={`book-text-body ${getTextSizeClass()} leading-loose text-slate-200`}>
            <MarkdownContent content={currentPage.contentMarkdownAr} lang={lang} />
          </article>

          {/* Engineering Diagram */}
          {currentPage.diagram && (
            <div className="space-y-3 pt-4">
              <div className="flex items-center gap-2 text-xs font-bold text-amber-400">
                <Network className="w-4 h-4" />
                <span>{lang === 'ar' ? 'المخطط الهندسي التفاعلي للفصل' : 'Chapter Interactive Engineering Schematic'}</span>
              </div>
              <NetworkSchematicDiagram diagram={currentPage.diagram} lang={lang} />
            </div>
          )}

          {/* Additional Diagrams */}
          {currentPage.additionalDiagrams && currentPage.additionalDiagrams.map((diag, dIdx) => (
            <div key={diag.id || dIdx} className="space-y-3 pt-2">
              <NetworkSchematicDiagram diagram={diag} lang={lang} />
            </div>
          ))}

          {/* Interactive Concept Check */}
          {currentPage.interactiveCheck && (
            <div className="p-6 rounded-2xl bg-amber-500/[0.04] border border-amber-500/25 space-y-4 my-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5 text-sm font-bold text-amber-300">
                  <HelpCircle className="w-5 h-5 text-amber-400" />
                  <span>{lang === 'ar' ? 'سؤال التحقق والفهم الفوري (Cisco Concept Check)' : 'Quick Concept Check'}</span>
                </div>
                <span className="badge badge-accent text-xs px-2.5 py-1">
                  {lang === 'ar' ? 'فحص فهم المفهوم' : 'Knowledge Check'}
                </span>
              </div>

              <p className="text-sm sm:text-base text-white font-bold leading-relaxed">
                {currentPage.interactiveCheck.questionAr}
              </p>

              <div className="space-y-2.5 pt-2">
                {currentPage.interactiveCheck.optionsAr.map((option, optIdx) => {
                  const isSelected = selectedAnswer === optIdx;
                  const isCorrect = optIdx === currentPage.interactiveCheck?.correctIndex;
                  let btnClass = 'bg-white/[0.03] border-white/[0.08] text-slate-300 hover:bg-white/[0.06] hover:border-white/[0.15]';

                  if (isAnswerSubmitted) {
                    if (isCorrect) {
                      btnClass = 'bg-emerald-500/20 border-emerald-500 text-emerald-300 font-bold';
                    } else if (isSelected) {
                      btnClass = 'bg-rose-500/20 border-rose-500 text-rose-300';
                    }
                  } else if (isSelected) {
                    btnClass = 'bg-amber-500/20 border-amber-500 text-amber-300 font-bold ring-1 ring-amber-500/30';
                  }

                  return (
                    <button
                      key={optIdx}
                      disabled={isAnswerSubmitted}
                      onClick={() => setSelectedAnswer(optIdx)}
                      className={`w-full p-4 rounded-xl border text-right text-xs sm:text-sm transition-all cursor-pointer flex items-center justify-between gap-3 ${btnClass}`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="w-6 h-6 rounded-full border border-current flex items-center justify-center text-xs shrink-0 font-mono">
                          {String.fromCharCode(65 + optIdx)}
                        </span>
                        <span>{option}</span>
                      </div>
                      {isAnswerSubmitted && isCorrect && (
                        <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>

              <div className="flex items-center justify-between pt-2">
                {!isAnswerSubmitted ? (
                  <button
                    disabled={selectedAnswer === null}
                    onClick={() => setIsAnswerSubmitted(true)}
                    className="btn-accent px-5 py-2.5 rounded-xl text-xs font-bold disabled:opacity-40 cursor-pointer"
                  >
                    {lang === 'ar' ? 'تحقق من الإجابة' : 'Submit Answer'}
                  </button>
                ) : (
                  <div className="w-full p-4 rounded-xl bg-white/[0.03] border border-white/[0.08] text-xs sm:text-sm text-slate-200 leading-relaxed animate-fadeIn">
                    <strong className="text-amber-300">
                      {lang === 'ar' ? '💡 التفسير الهندسي: ' : '💡 Technical Explanation: '}
                    </strong>
                    {currentPage.interactiveCheck.explanationAr}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Cisco Tip */}
          {currentPage.ciscoTipAr && (
            <InfoCallout
              title={lang === 'ar' ? 'نصيحة ذهبية لمهندسي سيسكو' : 'Cisco Engineering Tip'}
              icon={<Lightbulb className="w-5 h-5" />}
            >
              {currentPage.ciscoTipAr}
            </InfoCallout>
          )}

          {/* Key Takeaways */}
          {currentPage.keyTakeawaysAr && currentPage.keyTakeawaysAr.length > 0 && (
            <div className="space-y-3 pt-2">
              <h4 className="text-sm font-bold text-cyan-300 flex items-center gap-2">
                <Award className="w-4 h-4 text-cyan-400" />
                {lang === 'ar' ? 'أهم مخرجات التعلم للفصل' : 'Key Learning Outcomes'}
              </h4>
              <HighlightGrid
                items={currentPage.keyTakeawaysAr.map(t => ({ text: t }))}
                columns={1}
              />
            </div>
          )}
        </div>
      </main>

      {/* ── Bottom Deck Navigation (Slide Switcher) ── */}
      <footer className="h-20 px-4 sm:px-8 border-t border-white/[0.08] bg-[#090e1a]/95 backdrop-blur-md flex items-center justify-between gap-4 shrink-0">
        {/* Previous Button */}
        <button
          onClick={() => onSelectPageIndex(Math.max(0, currentPageIndex - 1))}
          disabled={currentPageIndex === 0}
          className="px-4 sm:px-6 py-2.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] text-slate-200 text-xs sm:text-sm font-bold flex items-center gap-2 disabled:opacity-25 cursor-pointer transition-all"
        >
          <ArrowRight className="w-4 h-4" />
          <span>{lang === 'ar' ? 'السابق' : 'Previous'}</span>
        </button>

        {/* Chapter Slide Thumbnails / Stepper */}
        <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto py-1 px-2 max-w-[60vw]">
          {bookPages.map((page, idx) => {
            const isActive = idx === currentPageIndex;
            const isRead = readPages.includes(page.pageNumber);
            return (
              <button
                key={page.pageNumber}
                onClick={() => onSelectPageIndex(idx)}
                className={`group relative h-9 px-3 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 cursor-pointer ${
                  isActive
                    ? 'bg-amber-500 text-black shadow-lg shadow-amber-500/20'
                    : isRead
                    ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
                    : 'bg-white/[0.03] text-slate-400 hover:text-white border border-white/[0.06]'
                }`}
                title={page.chapterTitleAr}
              >
                <span>{page.pageNumber}</span>
                <span className="hidden xl:inline text-[11px] font-normal truncate max-w-[90px]">
                  {page.badgeAr}
                </span>
                {isRead && !isActive && <Check className="w-3 h-3 text-emerald-400" />}
              </button>
            );
          })}
        </div>

        {/* Next Button */}
        <button
          onClick={() => onSelectPageIndex(Math.min(totalPages - 1, currentPageIndex + 1))}
          disabled={currentPageIndex === totalPages - 1}
          className="px-4 sm:px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black text-xs sm:text-sm font-black flex items-center gap-2 disabled:opacity-25 cursor-pointer transition-all shadow-md shadow-amber-500/20"
        >
          <span>{lang === 'ar' ? 'التالي' : 'Next'}</span>
          <ArrowLeft className="w-4 h-4" />
        </button>
      </footer>
    </div>
  );
};
