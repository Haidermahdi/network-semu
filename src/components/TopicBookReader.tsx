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
  Network,
  HelpCircle,
  Maximize2,
} from 'lucide-react';
import { CurriculumTopic, Language, BookChapterPage, CiscoCliCommand } from '../types';
import { MarkdownContent } from './MarkdownContent';
import { ProgressBar, InfoCallout, HighlightGrid } from './ui/ContentDisplay';
import { generateRichBookChapters } from '../data/bookChaptersGenerator';
import { NetworkSchematicDiagram } from './NetworkSchematicDiagram';
import { FocusReadingModal } from './FocusReadingModal';

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
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState<boolean>(false);
  const [isFocusModeOpen, setIsFocusModeOpen] = useState<boolean>(false);

  useEffect(() => {
    setCurrentPageIndex(0);
    setSelectedAnswer(null);
    setIsAnswerSubmitted(false);
  }, [topic.id]);

  useEffect(() => {
    setSelectedAnswer(null);
    setIsAnswerSubmitted(false);
  }, [currentPageIndex]);

  const bookPages: BookChapterPage[] = useMemo(() => {
    return generateRichBookChapters(topic);
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
      {/* Reading Progress & Tool Actions */}
      <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.06] space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-amber-400" />
            <span className="text-xs font-bold text-white">{topic.titleAr}</span>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            {/* Focus Reading Mode Button */}
            <button
              onClick={() => setIsFocusModeOpen(true)}
              className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-amber-500/20 to-amber-600/15 hover:from-amber-500/30 hover:to-amber-600/25 border border-amber-500/30 text-amber-300 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-sm hover:shadow-amber-500/10"
              title={lang === 'ar' ? 'وضع القراءة أو التركيز على المحتوى (ملء الشاشة مع التنقل بين الشرائح)' : 'Focus Reading Mode'}
            >
              <Maximize2 className="w-3.5 h-3.5 text-amber-400" />
              <span>{lang === 'ar' ? 'وضع القراءة والتركيز' : 'Focus Reading Mode'}</span>
            </button>

            {/* Font Size Adjuster */}
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

            {/* Bookmark */}
            {onBookmarkToggle && (
              <button
                onClick={() => onBookmarkToggle(topic.id)}
                className={`p-2 rounded-lg border transition-all cursor-pointer ${
                  isBookmarked ? 'bg-amber-500/15 text-amber-300 border-amber-500/30' : 'bg-white/[0.03] text-slate-500 border-white/[0.06]'
                }`}
                title={lang === 'ar' ? 'حفظ في المفضلة' : 'Bookmark'}
              >
                <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-amber-400' : ''}`} />
              </button>
            )}

            {/* Mark Topic Completed */}
            {onMarkTopicCompleted && (
              <button
                onClick={() => onMarkTopicCompleted(topic.id)}
                className={`p-2 rounded-lg border transition-all cursor-pointer ${
                  isCompleted ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30' : 'bg-white/[0.03] text-slate-500 border-white/[0.06]'
                }`}
                title={lang === 'ar' ? 'تحديد الموضوع كمكتمل' : 'Mark Topic as Completed'}
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

      {/* Modern Horizontal Chapter Navigator (No vertical empty space) */}
      <div className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/[0.06] space-y-2.5">
        <div className="flex items-center justify-between gap-2 px-1">
          <div className="flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-amber-400" />
            <span className="text-xs font-bold text-slate-300">
              {lang === 'ar' ? 'فصول الكتاب المعتمد (8 فصول متسلسلة)' : 'Official Curriculum Chapters (8 Sections)'}
            </span>
          </div>
          <div className="flex items-center gap-2.5">
            <span className="text-[11px] font-mono text-amber-400/80 bg-amber-500/10 px-2 py-0.5 rounded-md border border-amber-500/20">
              {currentPageIndex + 1} / {totalPages}
            </span>
            <button
              onClick={() => setIsFocusModeOpen(true)}
              className="text-[11px] text-amber-400 hover:text-amber-300 font-bold flex items-center gap-1 cursor-pointer transition-colors"
            >
              <Maximize2 className="w-3 h-3" />
              <span>{lang === 'ar' ? 'ملء الشاشة' : 'Fullscreen'}</span>
            </button>
          </div>
        </div>

        {/* Responsive Grid of 8 Chapters */}
        <div className="grid grid-cols-2 sm:grid-cols-4 xl:grid-cols-8 gap-2">
          {bookPages.map((page, idx) => {
            const isActive = idx === currentPageIndex;
            const isRead = readPages.includes(page.pageNumber);
            return (
              <button
                key={page.pageNumber}
                onClick={() => setCurrentPageIndex(idx)}
                className={`p-2.5 rounded-xl border text-right transition-all flex flex-col justify-between gap-1.5 cursor-pointer ${
                  isActive
                    ? 'bg-amber-500/15 border-amber-500/40 ring-1 ring-amber-500/30 shadow-md shadow-amber-500/10'
                    : isRead
                    ? 'bg-emerald-500/5 hover:bg-emerald-500/10 border-emerald-500/20'
                    : 'bg-white/[0.02] hover:bg-white/[0.05] border-white/[0.06]'
                }`}
              >
                <div className="flex items-center justify-between gap-1 w-full">
                  <span className={`w-5 h-5 rounded-md flex items-center justify-center text-[10px] font-black shrink-0 ${
                    isActive ? 'bg-amber-500 text-black' : isRead ? 'bg-emerald-500/20 text-emerald-400' : 'bg-white/[0.06] text-slate-400'
                  }`}>
                    {isRead && !isActive ? '✓' : page.pageNumber}
                  </span>
                  <span className="text-[10px] text-slate-500 flex items-center gap-1 font-mono">
                    <Clock className="w-2.5 h-2.5" />
                    {page.estimatedReadTime}
                  </span>
                </div>
                <div className={`text-xs font-bold leading-snug line-clamp-2 ${
                  isActive ? 'text-amber-300' : isRead ? 'text-emerald-400' : 'text-slate-300'
                }`}>
                  {page.badgeAr}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Page Content (Full Width - Prominent and Spacious) */}
      <div className="space-y-4">
        <div className="p-5 sm:p-7 rounded-2xl bg-white/[0.02] border border-white/[0.06] space-y-6">
          {/* Chapter Header */}
          <div className="flex flex-wrap items-start justify-between gap-3 pb-4 border-b border-white/[0.06]">
            <div>
              <div className="flex items-center gap-2 text-[11px] text-amber-400 font-bold">
                <span className="px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/20">
                  {currentPage.badgeAr}
                </span>
                <span className="text-slate-600">•</span>
                <span className="flex items-center gap-1 text-slate-500">
                  <Clock className="w-3 h-3" />
                  {currentPage.estimatedReadTime}
                </span>
              </div>
              <h3 className="text-lg sm:text-xl font-black text-white mt-2 leading-snug">
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

            {/* Visual Engineering Diagram / Schematic */}
            {currentPage.diagram && (
              <div className="space-y-2 pt-2">
                <div className="flex items-center gap-2 text-xs font-bold text-amber-400">
                  <Network className="w-4 h-4" />
                  <span>{lang === 'ar' ? 'المخطط الهندسي التفاعلي المعتمد للفصل' : 'Chapter Interactive Engineering Schematic'}</span>
                </div>
                <NetworkSchematicDiagram diagram={currentPage.diagram} lang={lang} />
              </div>
            )}

            {/* Additional Diagrams if present */}
            {currentPage.additionalDiagrams && currentPage.additionalDiagrams.map((diag, dIdx) => (
              <div key={diag.id || dIdx} className="space-y-2 pt-2">
                <NetworkSchematicDiagram diagram={diag} lang={lang} />
              </div>
            ))}

            {/* Interactive Understanding Check */}
            {currentPage.interactiveCheck && (
              <div className="p-4 sm:p-5 rounded-2xl bg-amber-500/[0.04] border border-amber-500/20 space-y-3 mt-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-bold text-amber-300">
                    <HelpCircle className="w-4 h-4 text-amber-400" />
                    <span>{lang === 'ar' ? 'سؤال التحقق والفهم الفوري (Cisco Concept Check)' : 'Quick Concept Check'}</span>
                  </div>
                  <span className="badge badge-accent text-[10px]">
                    {lang === 'ar' ? 'فحص فهم المفهوم' : 'Knowledge Check'}
                  </span>
                </div>

                <p className="text-xs sm:text-sm text-white font-bold leading-relaxed">
                  {currentPage.interactiveCheck.questionAr}
                </p>

                <div className="space-y-2 pt-1">
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
                        className={`w-full p-3 rounded-xl border text-right text-xs transition-all cursor-pointer flex items-center justify-between gap-3 ${btnClass}`}
                      >
                        <div className="flex items-center gap-2.5">
                          <span className="w-5 h-5 rounded-full border border-current flex items-center justify-center text-[10px] shrink-0 font-mono">
                            {String.fromCharCode(65 + optIdx)}
                          </span>
                          <span>{option}</span>
                        </div>
                        {isAnswerSubmitted && isCorrect && (
                          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
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
                      className="btn-accent px-4 py-2 rounded-xl text-xs font-bold disabled:opacity-40 cursor-pointer"
                    >
                      {lang === 'ar' ? 'تحقق من الإجابة' : 'Submit Answer'}
                    </button>
                  ) : (
                    <div className="w-full p-3 rounded-xl bg-white/[0.03] border border-white/[0.08] text-xs text-slate-200 leading-relaxed animate-fadeIn">
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

      {/* Fullscreen Reading / Content Focus Mode Modal */}
      <FocusReadingModal
        isOpen={isFocusModeOpen}
        onClose={() => setIsFocusModeOpen(false)}
        topic={topic}
        bookPages={bookPages}
        currentPageIndex={currentPageIndex}
        onSelectPageIndex={setCurrentPageIndex}
        readPages={readPages}
        onTogglePageRead={onTogglePageRead}
        lang={lang}
        fontSize={fontSize}
        setFontSize={setFontSize}
        selectedAnswer={selectedAnswer}
        setSelectedAnswer={setSelectedAnswer}
        isAnswerSubmitted={isAnswerSubmitted}
        setIsAnswerSubmitted={setIsAnswerSubmitted}
      />
    </div>
  );
};
