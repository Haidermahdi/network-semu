import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { 
  Award, 
  CheckCircle2, 
  XCircle, 
  HelpCircle, 
  RotateCcw, 
  ArrowLeft, 
  ArrowRight,
  Sparkles,
  Trophy,
  Lightbulb
} from 'lucide-react';
import { QUIZ_QUESTIONS } from '../data/slidesData';
import { Language } from '../types';

interface QuizSectionProps {
  lang?: Language;
}

export const QuizSection: React.FC<QuizSectionProps> = ({ lang = 'ar' }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [answeredMap, setAnsweredMap] = useState<{ [key: number]: number }>({});

  const currentQ = QUIZ_QUESTIONS[currentQuestionIndex];
  const isEn = lang === 'en';
  const options = (isEn && currentQ.optionsEn) ? currentQ.optionsEn : currentQ.optionsAr;
  const questionText = (isEn && currentQ.questionEn) ? currentQ.questionEn : currentQ.questionAr;
  const explanationText = (isEn && currentQ.explanationEn) ? currentQ.explanationEn : currentQ.explanationAr;
  const analogyText = (isEn && currentQ.realWorldAnalogyEn) ? currentQ.realWorldAnalogyEn : currentQ.realWorldAnalogyAr;
  const difficultyText = (isEn && currentQ.difficultyEn) ? currentQ.difficultyEn : currentQ.difficulty;

  const handleOptionSelect = (index: number) => {
    if (showResult) return;
    setSelectedOption(index);
    setShowResult(true);

    const isCorrect = index === currentQ.correctAnswerIndex;
    if (isCorrect) {
      setScore(prev => prev + 1);
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.7 }
      });
    }

    setAnsweredMap(prev => ({ ...prev, [currentQuestionIndex]: index }));
  };

  const handleNext = () => {
    if (currentQuestionIndex < QUIZ_QUESTIONS.length - 1) {
      const nextIndex = currentQuestionIndex + 1;
      setCurrentQuestionIndex(nextIndex);
      setSelectedOption(answeredMap[nextIndex] !== undefined ? answeredMap[nextIndex] : null);
      setShowResult(answeredMap[nextIndex] !== undefined);
    } else {
      setQuizCompleted(true);
      confetti({
        particleCount: 150,
        spread: 90,
        origin: { y: 0.6 }
      });
    }
  };

  const handlePrev = () => {
    if (currentQuestionIndex > 0) {
      const prevIndex = currentQuestionIndex - 1;
      setCurrentQuestionIndex(prevIndex);
      setSelectedOption(answeredMap[prevIndex]);
      setShowResult(true);
    }
  };

  const handleRestart = () => {
    setCurrentQuestionIndex(0);
    setSelectedOption(null);
    setShowResult(false);
    setScore(0);
    setQuizCompleted(false);
    setAnsweredMap({});
  };

  return (
    <div 
      className="bg-slate-900/90 rounded-2xl border border-slate-800 p-5 sm:p-6 shadow-2xl relative overflow-hidden"
      dir={isEn ? 'ltr' : 'rtl'}
    >
      {!quizCompleted ? (
        <div>
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4 mb-5">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400">
                <Award className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-bold text-slate-100">
                  {isEn ? 'Switching & Routing Mastery Challenge' : 'تحدي إتقان السويتشينغ والراوتينغ'}
                </h3>
                <p className="text-xs text-slate-400">
                  {isEn 
                    ? `Question ${currentQuestionIndex + 1} of ${QUIZ_QUESTIONS.length}`
                    : `السؤال ${currentQuestionIndex + 1} من ${QUIZ_QUESTIONS.length}`}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <span className="px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800 text-xs font-mono text-cyan-300">
                {isEn ? `Difficulty: ${difficultyText}` : `مستوى الصعوبة: ${difficultyText}`}
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-indigo-950 border border-indigo-500/30 text-xs font-bold text-indigo-300">
                {isEn ? `Score: ${score} / ${QUIZ_QUESTIONS.length}` : `النقاط: ${score} / ${QUIZ_QUESTIONS.length}`}
              </span>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full h-1.5 bg-slate-950 rounded-full mb-6 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-amber-500 to-emerald-500 rounded-full transition-all duration-300"
              style={{ width: `${((currentQuestionIndex + 1) / QUIZ_QUESTIONS.length) * 100}%` }}
            />
          </div>

          {/* Question Text */}
          <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800/80 mb-5">
            <h4 className="text-base sm:text-lg font-bold text-slate-100 leading-relaxed">
              {questionText}
            </h4>
            {!isEn && currentQ.questionEn && (
              <p className="text-xs text-slate-400 font-mono mt-1 dir-ltr text-right">
                {currentQ.questionEn}
              </p>
            )}
          </div>

          {/* Options */}
          <div className="space-y-3 mb-6">
            {options.map((option, idx) => {
              const isSelected = selectedOption === idx;
              const isCorrect = idx === currentQ.correctAnswerIndex;
              let optionStyle = 'bg-slate-950/60 hover:bg-slate-800/60 border-slate-800 text-slate-200';

              if (showResult) {
                if (isCorrect) {
                  optionStyle = 'bg-emerald-950/50 border-emerald-500 text-emerald-200 ring-1 ring-emerald-500';
                } else if (isSelected && !isCorrect) {
                  optionStyle = 'bg-rose-950/50 border-rose-500 text-rose-200 ring-1 ring-rose-500';
                }
              }

              return (
                <button
                  key={idx}
                  onClick={() => handleOptionSelect(idx)}
                  disabled={showResult}
                  className={`w-full ${isEn ? 'text-left' : 'text-right'} p-3.5 sm:p-4 rounded-xl border text-xs sm:text-sm font-medium transition-all flex items-center justify-between ${optionStyle}`}
                >
                  <span>{option}</span>
                  {showResult && isCorrect && <CheckCircle2 className={`w-5 h-5 text-emerald-400 shrink-0 ${isEn ? 'ml-2' : 'mr-2'}`} />}
                  {showResult && isSelected && !isCorrect && <XCircle className={`w-5 h-5 text-rose-400 shrink-0 ${isEn ? 'ml-2' : 'mr-2'}`} />}
                </button>
              );
            })}
          </div>

          {/* Explanation Box when answered */}
          {showResult && (
            <div className="p-4 rounded-xl bg-slate-950/90 border border-slate-700/80 space-y-2.5 mb-6 animate-fadeIn">
              <div className="flex items-center gap-1.5 text-xs font-bold text-amber-400">
                <Lightbulb className="w-4 h-4" />
                <span>{isEn ? 'Detailed Engineering Explanation:' : 'الشرح الهندسي المفصل:'}</span>
              </div>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                {explanationText}
              </p>
              {analogyText && (
                <div className="text-xs text-cyan-300 bg-cyan-950/30 p-2.5 rounded-lg border border-cyan-500/20">
                  <strong>{isEn ? 'Real-World Analogy: ' : 'تشبيه واقعي: '}</strong>{analogyText}
                </div>
              )}
            </div>
          )}

          {/* Navigation Controls */}
          <div className="flex items-center justify-between pt-2">
            <button
              onClick={handlePrev}
              disabled={currentQuestionIndex === 0}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-30 text-slate-300 text-xs font-bold transition-all flex items-center gap-1"
            >
              {isEn ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
              <span>{isEn ? 'Previous' : 'السابق'}</span>
            </button>

            <button
              onClick={handleNext}
              disabled={!showResult}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-cyan-600 hover:from-emerald-500 hover:to-cyan-500 disabled:opacity-40 text-white text-xs sm:text-sm font-bold shadow-lg shadow-emerald-500/20 transition-all flex items-center gap-1.5"
            >
              <span>{currentQuestionIndex === QUIZ_QUESTIONS.length - 1 ? (isEn ? 'View Final Result' : 'عرض النتيجة النهائية') : (isEn ? 'Next Question' : 'السؤال التالي')}</span>
              {isEn ? <ArrowRight className="w-4 h-4" /> : <ArrowLeft className="w-4 h-4" />}
            </button>
          </div>
        </div>
      ) : (
        /* Quiz Complete Screen */
        <div className="text-center py-8 px-4 space-y-5">
          <div className="inline-flex p-4 rounded-3xl bg-amber-500/20 border-2 border-amber-400/50 text-amber-300 shadow-2xl">
            <Trophy className="w-12 h-12 animate-bounce" />
          </div>

          <div>
            <h3 className="text-xl sm:text-2xl font-bold text-slate-100">
              {isEn ? 'Congratulations! Quiz Completed' : 'مبروك! أتممت اختبار السويتشينغ والراوتينغ'}
            </h3>
            <p className="text-sm text-slate-400 mt-1">
              {isEn 
                ? 'You have successfully navigated the data packet journey with high engineering precision.'
                : 'لقد استوعبت رحلة حزم البيانات بدقة هندسية عالية'}
            </p>
          </div>

          <div className="inline-block p-4 rounded-2xl bg-slate-950 border border-slate-800">
            <div className="text-3xl font-extrabold text-amber-400 font-mono">
              {score} / {QUIZ_QUESTIONS.length}
            </div>
            <div className="text-xs text-slate-400 mt-1">
              {isEn ? `Mastery Rate: ${Math.round((score / QUIZ_QUESTIONS.length) * 100)}%` : `نسبة الإتقان: ${Math.round((score / QUIZ_QUESTIONS.length) * 100)}%`}
            </div>
          </div>

          <div className="p-4 max-w-lg mx-auto rounded-xl bg-indigo-950/30 border border-indigo-500/30 text-xs sm:text-sm text-indigo-200 leading-relaxed">
            {score >= 4 
              ? (isEn 
                  ? '🌟 Excellent performance! You have a solid grasp of how Layer 2 switching and Layer 3 routing operate, and why MAC addresses change while IP addresses remain constant.'
                  : '🌟 مستوى ممتاز! أصبحت تفهم بوضوح كيف يعمل السويتش في Layer 2 وكيف يوجه الراوتر في Layer 3 ولماذا يتغير الـ MAC ويبقى الـ IP ثابتاً.')
              : (isEn 
                  ? '👍 Great start! You can review the interactive slides and re-watch the packet animation in the lab to cement your understanding 100%.'
                  : '👍 بداية ممتازة! يمكنك مراجعة السلايدات التفاعلية ومشاهدة حركة الحزم مرة أخرى لترسيخ الفهم 100%.')}
          </div>

          <div className="pt-3">
            <button
              onClick={handleRestart}
              className="px-6 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-sm inline-flex items-center gap-2 transition-all"
            >
              <RotateCcw className="w-4 h-4" />
              <span>{isEn ? 'Retake Quiz' : 'إعادة الاختبار'}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
