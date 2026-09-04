import React, { useState, useEffect, useMemo } from 'react';
import {
  Bookmark,
  CheckCircle2,
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
import { CurriculumTopic, Language, BookChapterPage } from '../types';
import { MarkdownContent } from './MarkdownContent';
import { InfoCallout, HighlightGrid } from './ui/ContentDisplay';
import { generateRichBookChapters } from '../data/bookChaptersGenerator';
import { NetworkSchematicDiagram } from './NetworkSchematicDiagram';
import { FocusReadingModal } from './FocusReadingModal';
import { pickText, pickTextList, formatReadTime } from '../utils/localePick';

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
    <div className="space-y-3">
      {/* Single compact reading toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-2 px-0.5">
        <div className="flex items-center gap-2 min-w-0">
          <span className="text-[11px] font-mono text-amber-400/90 bg-amber-500/10 px-2 py-0.5 rounded-md border border-amber-500/20 shrink-0">
            {currentPageIndex + 1}/{totalPages}
          </span>
          <span className="text-[11px] text-slate-500 truncate">
            {lang === 'ar' ? `${readCount} مقروء` : `${readCount} read`}
          </span>
        </div>
        <div className="flex items-center gap-1.5 flex-wrap">
          <button
            onClick={() => setIsFocusModeOpen(true)}
            className="px-3 py-1.5 rounded-lg bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/30 text-amber-300 text-[11px] font-bold flex items-center gap-1.5 transition-all cursor-pointer"
            title={lang === 'ar' ? 'وضع القراءة المركّز' : 'Focus Reading Mode'}
          >
            <Maximize2 className="w-3.5 h-3.5" />
            <span>{lang === 'ar' ? 'قراءة مركّزة' : 'Focus Read'}</span>
          </button>
          <div className="flex items-center gap-0.5 p-0.5 rounded-lg bg-white/[0.04] border border-white/[0.06]">
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
              className={`p-1.5 rounded-lg border transition-all cursor-pointer ${
                isBookmarked ? 'bg-amber-500/15 text-amber-300 border-amber-500/30' : 'bg-white/[0.03] text-slate-500 border-white/[0.06]'
              }`}
              title={lang === 'ar' ? 'حفظ في المفضلة' : 'Bookmark'}
            >
              <Bookmark className={`w-3.5 h-3.5 ${isBookmarked ? 'fill-amber-400' : ''}`} />
            </button>
          )}
          {onMarkTopicCompleted && (
            <button
              onClick={() => onMarkTopicCompleted(topic.id)}
              className={`p-1.5 rounded-lg border transition-all cursor-pointer ${
                isCompleted ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30' : 'bg-white/[0.03] text-slate-500 border-white/[0.06]'
              }`}
              title={lang === 'ar' ? 'تحديد الموضوع كمكتمل' : 'Mark Topic as Completed'}
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Slim chapter pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5">
        {bookPages.map((page, idx) => {
          const isActive = idx === currentPageIndex;
          const isRead = readPages.includes(page.pageNumber);
          const label = pickText(lang, page.badgeAr, page.badgeEn, page.chapterTitleEn);
          return (
            <button
              key={page.pageNumber}
              onClick={() => setCurrentPageIndex(idx)}
              title={label}
              className={`shrink-0 px-2.5 py-1.5 rounded-lg text-[11px] font-bold transition-all cursor-pointer border ${
                isActive
                  ? 'bg-amber-500 text-black border-amber-400'
                  : isRead
                  ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/25'
                  : 'bg-white/[0.03] text-slate-400 border-white/[0.06] hover:text-slate-200'
              }`}
            >
              {page.pageNumber}. {label.split('&')[0].trim().slice(0, 18)}
            </button>
          );
        })}
      </div>

      {/* Page Content (Full Width - Prominent and Spacious) */}
      <div className="space-y-4">
        <div className="p-5 sm:p-7 rounded-2xl bg-white/[0.02] border border-white/[0.06] space-y-6">
          {/* Chapter Header */}
          <div className="flex flex-wrap items-start justify-between gap-3 pb-4 border-b border-white/[0.06]">
            <div>
              <div className="flex items-center gap-2 text-[11px] text-amber-400 font-bold">
                <span className="px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/20">
                  {pickText(lang, currentPage.badgeAr, currentPage.badgeEn, currentPage.chapterTitleEn)}
                </span>
                <span className="text-slate-600">•</span>
                <span className="flex items-center gap-1 text-slate-500">
                  <Clock className="w-3 h-3" />
                  {formatReadTime(lang, currentPage.estimatedReadTime)}
                </span>
              </div>
              <h3 className="text-lg sm:text-xl font-black text-white mt-2 leading-snug">
                {pickText(lang, currentPage.chapterTitleAr, currentPage.chapterTitleEn)}
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
              <MarkdownContent
                content={pickText(
                  lang,
                  currentPage.contentMarkdownAr,
                  currentPage.contentMarkdownEn,
                  topic.contentMarkdownEn || topic.contentMarkdownAr
                )}
                lang={lang}
              />
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
                  {pickText(
                    lang,
                    currentPage.interactiveCheck.questionAr,
                    currentPage.interactiveCheck.questionEn
                  )}
                </p>

                <div className="space-y-2 pt-1">
                  {pickTextList(
                    lang,
                    currentPage.interactiveCheck.optionsAr,
                    currentPage.interactiveCheck.optionsEn
                  ).map((option, optIdx) => {
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
                      {pickText(
                        lang,
                        currentPage.interactiveCheck.explanationAr,
                        currentPage.interactiveCheck.explanationEn
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Cisco Tip */}
            {(lang === 'ar' ? currentPage.ciscoTipAr : (currentPage.ciscoTipEn || currentPage.ciscoTipAr)) && (
              <InfoCallout
                title={lang === 'ar' ? 'نصيحة ذهبية لمهندسي سيسكو' : 'Cisco Engineering Tip'}
                icon={<Lightbulb className="w-4 h-4" />}
              >
                {pickText(lang, currentPage.ciscoTipAr, currentPage.ciscoTipEn)}
              </InfoCallout>
            )}

            {/* Key Takeaways */}
            {pickTextList(lang, currentPage.keyTakeawaysAr, currentPage.keyTakeawaysEn).length > 0 && (
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-cyan-300 flex items-center gap-2">
                  <Award className="w-4 h-4 text-cyan-400" />
                  {lang === 'ar' ? 'أهم مخرجات التعلم' : 'Key Learning Outcomes'}
                </h4>
                <HighlightGrid
                  items={pickTextList(lang, currentPage.keyTakeawaysAr, currentPage.keyTakeawaysEn).map(t => ({ text: t }))}
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
