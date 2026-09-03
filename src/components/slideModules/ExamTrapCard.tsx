import React, { useState } from 'react';
import { ShieldAlert, Terminal, HelpCircle, CheckCircle2, XCircle, Copy, Check } from 'lucide-react';
import { SlideData, Language } from '../../types';

interface ExamTrapCardProps {
  slide: SlideData;
  lang?: Language;
}

export const ExamTrapCard: React.FC<ExamTrapCardProps> = ({ slide, lang = 'ar' }) => {
  const isEn = lang === 'en';
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const handleCopy = (cmd: string, idx: number) => {
    navigator.clipboard.writeText(cmd);
    setCopiedIndex(idx);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const hasTraps = slide.examTraps && slide.examTraps.length > 0;
  const hasCli = slide.ciscoCliDeepDive && slide.ciscoCliDeepDive.length > 0;
  const hasQuiz = slide.knowledgeCheck !== undefined;

  if (!hasTraps && !hasCli && !hasQuiz) return null;

  return (
    <div className={`space-y-4 font-sans ${isEn ? 'text-left dir-ltr' : 'text-right dir-rtl'}`}>
      {/* Cisco Exam Traps Section */}
      {hasTraps && (
        <div className="bg-slate-900/90 rounded-3xl border border-rose-500/20 p-5 sm:p-6 shadow-2xl backdrop-blur-xl">
          <div className="flex items-center gap-3 border-b border-white/[0.06] pb-3 mb-4">
            <div className="w-9 h-9 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-base font-bold text-white">
                {isEn ? 'CCNA Exam Traps & Gotchas' : 'فخاخ أسئلة امتحانات سيسكو (CCNA Exam Traps)'}
              </h4>
              <p className="text-xs text-slate-400">
                {isEn 
                  ? 'Common confusing exam questions Cisco candidates encounter on certification tests'
                  : 'أكثر الأسئلة المربكة التي يقع فيها الطلاب في اختبارات الاعتماد العالمية'}
              </p>
            </div>
          </div>

          <div className="space-y-3">
            {slide.examTraps!.map((trap, idx) => (
              <div key={idx} className="p-4 rounded-2xl bg-slate-950 border border-white/[0.06] space-y-2">
                <div className="text-xs font-bold text-rose-300 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-rose-400 animate-pulse" />
                  <span>{isEn && trap.trapTitleEn ? trap.trapTitleEn : trap.trapTitleAr}</span>
                </div>
                <div className="text-sm font-bold text-white leading-relaxed">
                  {isEn ? 'Question:' : 'السؤال:'} &ldquo;{isEn && trap.questionEn ? trap.questionEn : trap.questionAr}&rdquo;
                </div>
                <div className="p-3 rounded-xl bg-rose-950/20 border border-rose-500/30 text-xs text-rose-200/90 leading-relaxed">
                  <strong className="text-rose-400 font-bold block mb-1">
                    {isEn ? 'The Common Trap:' : 'الخدعة الشائعة (The Trap):'}
                  </strong>
                  {isEn && trap.trickEn ? trap.trickEn : trap.trickAr}
                </div>
                <div className="p-3 rounded-xl bg-emerald-950/20 border border-emerald-500/30 text-xs text-emerald-200/90 leading-relaxed">
                  <strong className="text-emerald-400 font-bold block mb-1">
                    {isEn ? 'Cisco Architectural Rule:' : 'القاعدة الهندسية الصحيحة (Cisco Rule):'}
                  </strong>
                  {isEn && trap.correctRuleEn ? trap.correctRuleEn : trap.correctRuleAr}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Cisco CLI Deep Dive Section */}
      {hasCli && (
        <div className="bg-slate-900/90 rounded-3xl border border-white/[0.08] p-5 sm:p-6 shadow-2xl backdrop-blur-xl">
          <div className="flex items-center gap-3 border-b border-white/[0.06] pb-3 mb-4">
            <div className="w-9 h-9 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
              <Terminal className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-base font-bold text-white">
                {isEn ? 'Cisco IOS Verification CLI' : 'أوامر المعاينة الميدانية في سيسكو (Cisco IOS Verification CLI)'}
              </h4>
              <p className="text-xs text-slate-400">
                {isEn 
                  ? 'Critical verification and troubleshooting commands used by network engineers'
                  : 'الأوامر التي يعتمد عليها مهندس الشبكات لمعاينة الحالة وتشخيص الأعطال'}
              </p>
            </div>
          </div>

          <div className="space-y-4">
            {slide.ciscoCliDeepDive!.map((cli, idx) => (
              <div key={idx} className="p-4 rounded-2xl bg-slate-950 border border-white/[0.06] space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-300">
                    {isEn && cli.contextEn ? cli.contextEn : cli.context}
                  </span>
                  <button
                    onClick={() => handleCopy(cli.command, idx)}
                    className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-[11px] text-cyan-300 font-mono flex items-center gap-1 border border-white/[0.06] transition-all cursor-pointer"
                  >
                    {copiedIndex === idx ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedIndex === idx ? (isEn ? 'Copied!' : 'تم النسخ!') : (isEn ? 'Copy Command' : 'نسخ الأمر')}</span>
                  </button>
                </div>

                <div className="p-3 rounded-xl bg-black border border-white/[0.06] font-mono text-xs text-left dir-ltr text-emerald-400 overflow-x-auto">
                  <div className="text-cyan-300 font-bold mb-1">Router# {cli.command}</div>
                  <pre className="text-slate-300 whitespace-pre font-mono text-[11px] leading-relaxed">
                    {cli.outputSample}
                  </pre>
                </div>

                <div className="text-xs text-slate-400 bg-slate-900/60 p-3 rounded-xl border border-white/[0.04] leading-relaxed">
                  <strong className="text-cyan-400 block mb-1">
                    {isEn ? 'Key Field Analysis:' : 'تحليل مخرجات الأمر:'}
                  </strong>
                  {isEn && cli.keyFieldExplanationEn ? cli.keyFieldExplanationEn : cli.keyFieldExplanationAr}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 1-Minute Micro Knowledge Check */}
      {hasQuiz && (
        <div className="bg-slate-900/90 rounded-3xl border border-amber-500/20 p-5 sm:p-6 shadow-2xl backdrop-blur-xl">
          <div className="flex items-center gap-3 border-b border-white/[0.06] pb-3 mb-4">
            <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
              <HelpCircle className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-base font-bold text-white">
                {isEn ? 'Micro Knowledge Check' : 'تحدي الفهم السريع (Micro Knowledge Check)'}
              </h4>
              <p className="text-xs text-slate-400">
                {isEn 
                  ? 'Verify your understanding before advancing to the next slide'
                  : 'تأكد من استيعابك للمفهوم قبل الانتقال للشريحة التالية'}
              </p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950 border border-white/[0.06] space-y-4">
            <p className="text-sm font-bold text-white leading-relaxed">
              {isEn && slide.knowledgeCheck!.questionEn ? slide.knowledgeCheck!.questionEn : slide.knowledgeCheck!.questionAr}
            </p>

            <div className="grid grid-cols-1 gap-2">
              {(isEn && slide.knowledgeCheck!.optionsEn ? slide.knowledgeCheck!.optionsEn : slide.knowledgeCheck!.optionsAr).map((option, optIdx) => {
                const isSelected = selectedOption === optIdx;
                const isCorrect = optIdx === slide.knowledgeCheck!.correctIndex;
                const showResult = selectedOption !== null;

                let btnStyle = 'bg-slate-900/80 border-white/[0.06] text-slate-300 hover:bg-slate-800';
                if (showResult) {
                  if (isCorrect) {
                    btnStyle = 'bg-emerald-950/40 border-emerald-500/50 text-emerald-200 font-bold';
                  } else if (isSelected) {
                    btnStyle = 'bg-rose-950/40 border-rose-500/50 text-rose-200';
                  } else {
                    btnStyle = 'bg-slate-950/40 border-white/[0.02] text-slate-500';
                  }
                }

                return (
                  <button
                    key={optIdx}
                    disabled={showResult}
                    onClick={() => setSelectedOption(optIdx)}
                    className={`p-3 rounded-xl border text-xs sm:text-sm ${isEn ? 'text-left' : 'text-right'} transition-all cursor-pointer flex items-start gap-3 ${btnStyle}`}
                  >
                    <span className="w-5 h-5 rounded-full border border-white/[0.1] flex items-center justify-center shrink-0 mt-0.5 text-[11px] font-mono">
                      {optIdx + 1}
                    </span>
                    <span className="leading-relaxed">{option}</span>
                  </button>
                );
              })}
            </div>

            {selectedOption !== null && (
              <div className={`p-3.5 rounded-xl border text-xs leading-relaxed ${
                selectedOption === slide.knowledgeCheck!.correctIndex
                  ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-200'
                  : 'bg-amber-950/30 border-amber-500/40 text-amber-200'
              }`}>
                <strong className="block font-bold mb-1">
                  {selectedOption === slide.knowledgeCheck!.correctIndex 
                    ? (isEn ? '✅ Excellent! Correct answer:' : '✅ أحسنت! إجابة صحيحة:') 
                    : (isEn ? '💡 Engineering Explanation:' : '💡 توضيح هندسي:')}
                </strong>
                {isEn && slide.knowledgeCheck!.explanationEn ? slide.knowledgeCheck!.explanationEn : slide.knowledgeCheck!.explanationAr}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
