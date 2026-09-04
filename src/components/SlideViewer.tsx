import React, { useEffect, useMemo, useState } from 'react';
import { motion } from 'motion/react';
import {
  ChevronRight,
  ChevronLeft,
  Sparkles,
  BookOpen,
  CheckCircle2,
  Cpu,
  Lightbulb,
  ArrowRight,
} from 'lucide-react';
import { SLIDES_DATA } from '../data/slidesData';
import { RealWorldAnalogyCard } from './RealWorldAnalogyCard';
import { SubnetDecisionTool } from './slideModules/SubnetDecisionTool';
import { SwitchCamSimulator } from './slideModules/SwitchCamSimulator';
import { ArpDissectorTool } from './slideModules/ArpDissectorTool';
import { LongestPrefixMatchTool } from './slideModules/LongestPrefixMatchTool';
import { EncapsulationLifecycleTool } from './slideModules/EncapsulationLifecycleTool';
import { SwitchVsRouterMatrixTool } from './slideModules/SwitchVsRouterMatrixTool';
import { ExamTrapCard } from './slideModules/ExamTrapCard';
import { Language } from '../types';

/** Teaching deck only — lab/quiz embeds belong in their own tabs */
export const TEACHING_SLIDES = SLIDES_DATA.filter(
  (s) => s.category !== 'interactive_lab' && s.category !== 'quiz'
);

interface SlideViewerProps {
  currentSlideIndex: number;
  onSlideChange: (index: number) => void;
  lang?: Language;
  onNavigateToLab?: (scenarioId: string) => void;
}

export const SlideViewer: React.FC<SlideViewerProps> = ({
  currentSlideIndex,
  onSlideChange,
  lang = 'ar',
  onNavigateToLab,
}) => {
  const isEn = lang === 'en';
  const safeIndex = Math.min(Math.max(0, currentSlideIndex), TEACHING_SLIDES.length - 1);
  const currentSlide = TEACHING_SLIDES[safeIndex] || TEACHING_SLIDES[0];
  const progressPercent = ((safeIndex + 1) / TEACHING_SLIDES.length) * 100;

  const [activeSection, setActiveSection] = useState<'learn' | 'practice' | 'exam'>('learn');

  useEffect(() => {
    setActiveSection('learn');
  }, [safeIndex]);

  useEffect(() => {
    if (currentSlideIndex !== safeIndex) onSlideChange(safeIndex);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [safeIndex]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      if (e.key === 'ArrowRight') {
        if (safeIndex > 0) onSlideChange(safeIndex - 1);
      } else if (e.key === 'ArrowLeft') {
        if (safeIndex < TEACHING_SLIDES.length - 1) onSlideChange(safeIndex + 1);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [safeIndex, onSlideChange]);

  const specializedModule = useMemo(() => {
    switch (currentSlide.id) {
      case 'slide-1':
        return <SubnetDecisionTool lang={lang} />;
      case 'slide-2':
        return <SwitchCamSimulator lang={lang} />;
      case 'slide-3':
        return <ArpDissectorTool lang={lang} />;
      case 'slide-4':
        return <LongestPrefixMatchTool lang={lang} />;
      case 'slide-5':
        return <EncapsulationLifecycleTool lang={lang} />;
      case 'slide-6':
        return <SwitchVsRouterMatrixTool lang={lang} />;
      default:
        return null;
    }
  }, [currentSlide.id, lang]);

  const title = isEn ? currentSlide.titleEn : currentSlide.titleAr;
  const subtitle = isEn && currentSlide.subtitleEn ? currentSlide.subtitleEn : currentSlide.subtitleAr;
  const takeaway = isEn && currentSlide.takeawayMessageEn ? currentSlide.takeawayMessageEn : currentSlide.takeawayMessage;
  const category = isEn && currentSlide.categoryEn ? currentSlide.categoryEn : currentSlide.categoryAr;

  return (
    <div className={`space-y-4 font-sans ${isEn ? 'text-left dir-ltr' : 'text-right dir-rtl'}`}>
      {/* Deck header */}
      <div className="relative overflow-hidden rounded-2xl border border-white/[0.08] bg-slate-900/80 p-4 sm:p-5">
        <div className="absolute top-0 inset-x-0 h-1 bg-white/[0.04]">
          <motion.div
            className="h-full bg-gradient-to-r from-amber-500 to-cyan-400"
            animate={{ width: `${progressPercent}%` }}
            transition={{ duration: 0.25 }}
          />
        </div>

        <div className="flex flex-wrap items-start justify-between gap-3 pt-1">
          <div className="min-w-0 space-y-1.5 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2 py-0.5 rounded-md bg-amber-500/15 text-amber-300 border border-amber-500/25 text-[10px] font-mono font-bold">
                {isEn ? `Slide ${safeIndex + 1}/${TEACHING_SLIDES.length}` : `شريحة ${safeIndex + 1} من ${TEACHING_SLIDES.length}`}
              </span>
              <span className="px-2 py-0.5 rounded-md bg-white/[0.04] text-slate-400 border border-white/[0.06] text-[10px] font-bold">
                {category}
              </span>
            </div>
            <h2 className="text-lg sm:text-xl font-black text-white leading-snug">{title}</h2>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed max-w-3xl">{subtitle}</p>
          </div>

          <div className="flex items-center gap-1.5 shrink-0" dir="ltr">
            <button
              onClick={() => safeIndex > 0 && onSlideChange(safeIndex - 1)}
              disabled={safeIndex === 0}
              className="p-2 rounded-xl bg-white/[0.03] border border-white/[0.06] text-slate-300 disabled:opacity-30 hover:bg-white/[0.06] cursor-pointer"
              title={isEn ? 'Previous' : 'السابق'}
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => safeIndex < TEACHING_SLIDES.length - 1 && onSlideChange(safeIndex + 1)}
              disabled={safeIndex === TEACHING_SLIDES.length - 1}
              className="p-2 rounded-xl bg-amber-500 text-slate-950 disabled:opacity-30 hover:bg-amber-400 cursor-pointer"
              title={isEn ? 'Next' : 'التالي'}
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Lesson outline chips */}
        <div className="mt-4 flex gap-1.5 overflow-x-auto pb-0.5 scrollbar-thin">
          {TEACHING_SLIDES.map((s, idx) => {
            const active = idx === safeIndex;
            return (
              <button
                key={s.id}
                onClick={() => onSlideChange(idx)}
                className={`shrink-0 flex items-center gap-2 px-2.5 py-1.5 rounded-xl text-[11px] font-bold border transition-all cursor-pointer ${
                  active
                    ? 'bg-amber-500 text-slate-950 border-amber-400'
                    : 'bg-white/[0.02] text-slate-400 border-white/[0.06] hover:text-slate-200'
                }`}
              >
                <span className={`w-5 h-5 rounded-lg flex items-center justify-center font-mono text-[10px] ${
                  active ? 'bg-slate-950 text-amber-400' : 'bg-slate-800 text-slate-500'
                }`}>
                  {idx + 1}
                </span>
                <span className="max-w-[140px] truncate">
                  {isEn ? s.titleEn.split(':')[0] : s.titleAr.split(':')[0]}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Section tabs: Learn / Practice / Exam */}
      <div className="flex flex-wrap gap-1.5 p-1 rounded-2xl bg-white/[0.02] border border-white/[0.06] w-fit">
        {([
          { id: 'learn', ar: 'افهم الفكرة', en: 'Understand', icon: BookOpen },
          { id: 'practice', ar: 'جرّب بنفسك', en: 'Practice', icon: Cpu },
          { id: 'exam', ar: 'فخاخ الامتحان', en: 'Exam traps', icon: CheckCircle2 },
        ] as const).map((tab) => {
          const Icon = tab.icon;
          const active = activeSection === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveSection(tab.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                active ? 'bg-amber-500 text-slate-950' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              {isEn ? tab.en : tab.ar}
            </button>
          );
        })}
      </div>

      {/* LEARN */}
      {activeSection === 'learn' && (
        <div className="space-y-4">
          {/* Key concepts — previously unused */}
          {currentSlide.keyConcepts?.length > 0 && (
            <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-4 space-y-3">
              <div className="flex items-center gap-2">
                <Lightbulb className="w-4 h-4 text-amber-400" />
                <h3 className="text-sm font-bold text-white">
                  {isEn ? 'Key concepts in this slide' : 'المفاهيم الأساسية في هذه الشريحة'}
                </h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                {currentSlide.keyConcepts.map((c, i) => (
                  <div
                    key={i}
                    className="p-3 rounded-xl bg-slate-950/70 border border-white/[0.06] space-y-1.5"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-bold text-slate-100">
                        {isEn && c.titleEn ? c.titleEn : c.title}
                      </span>
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
                        {c.term}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 leading-relaxed">
                      {isEn && c.descEn ? c.descEn : c.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          <RealWorldAnalogyCard slide={currentSlide} lang={lang} />

          {takeaway && (
            <div className="rounded-2xl border border-amber-500/25 bg-amber-500/10 p-4 flex gap-3">
              <Sparkles className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <div className="text-xs font-bold text-amber-300 mb-1">
                  {isEn ? 'Takeaway' : 'الخلاصة الهندسية'}
                </div>
                <p className="text-sm text-amber-50/90 leading-relaxed">{takeaway}</p>
              </div>
            </div>
          )}

          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setActiveSection('practice')}
              className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold flex items-center gap-1.5 cursor-pointer"
            >
              <Cpu className="w-3.5 h-3.5" />
              {isEn ? 'Open interactive tool' : 'افتح الأداة التفاعلية'}
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
            {onNavigateToLab && currentSlide.interactiveScenarioId && (
              <button
                onClick={() => onNavigateToLab(currentSlide.interactiveScenarioId)}
                className="px-4 py-2 rounded-xl bg-cyan-500/15 hover:bg-cyan-500/25 text-cyan-300 border border-cyan-500/25 text-xs font-bold flex items-center gap-1.5 cursor-pointer"
              >
                <Cpu className="w-3.5 h-3.5" />
                {isEn ? 'See packets in Live Lab' : 'شاهد الحزم في المعمل الحي'}
              </button>
            )}
          </div>
        </div>
      )}

      {/* PRACTICE — hero interactive module */}
      {activeSection === 'practice' && (
        <div className="space-y-3">
          <div className="rounded-2xl border border-cyan-500/20 bg-cyan-500/5 px-4 py-3">
            <div className="text-xs font-bold text-cyan-300 mb-0.5">
              {isEn ? 'Hands-on practice' : 'تدريب عملي تفاعلي'}
            </div>
            <p className="text-[11px] text-slate-400">
              {isEn
                ? 'Use the tool below to apply the concept — this is the core of the Interactive Slides tab.'
                : 'استخدم الأداة أدناه لتطبيق المفهوم — هذا هو جوهر تبويب السلايدات التفاعلية.'}
            </p>
          </div>
          {specializedModule || (
            <div className="p-8 text-center text-sm text-slate-500 rounded-2xl border border-white/[0.06]">
              {isEn ? 'No interactive module for this slide.' : 'لا توجد أداة تفاعلية لهذه الشريحة.'}
            </div>
          )}
          {onNavigateToLab && currentSlide.interactiveScenarioId && (
            <button
              onClick={() => onNavigateToLab(currentSlide.interactiveScenarioId)}
              className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-cyan-500/15 hover:bg-cyan-500/25 text-cyan-300 border border-cyan-500/25 text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Cpu className="w-3.5 h-3.5" />
              {isEn
                ? 'Continue: simulate this concept with real packets in Live Lab'
                : 'التالي: حاكي هذا المفهوم بحزم حقيقية في المعمل الحي'}
            </button>
          )}
        </div>
      )}

      {/* EXAM */}
      {activeSection === 'exam' && (
        <div className="space-y-3">
          <ExamTrapCard slide={currentSlide} lang={lang} />
        </div>
      )}
    </div>
  );
};
