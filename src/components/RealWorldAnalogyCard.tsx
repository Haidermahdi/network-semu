import React from 'react';
import { motion } from 'motion/react';
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
  BookOpen
} from 'lucide-react';
import { SlideData } from '../types';

interface RealWorldAnalogyCardProps {
  slide: SlideData;
}

export const RealWorldAnalogyCard: React.FC<RealWorldAnalogyCardProps> = ({ slide }) => {
  const { realWorldMetaphor, keyConcepts, takeawayMessage } = slide;

  // Icon mapper
  const getIcon = (name: string) => {
    switch (name) {
      case 'Building2': return <Building2 className="w-5 h-5 text-amber-400" />;
      case 'Cpu': return <Cpu className="w-5 h-5 text-emerald-400" />;
      case 'Megaphone': return <Megaphone className="w-5 h-5 text-cyan-400" />;
      case 'Compass': return <Compass className="w-5 h-5 text-indigo-400" />;
      case 'Layers': return <Layers className="w-5 h-5 text-purple-400" />;
      case 'GitCompare': return <GitCompare className="w-5 h-5 text-rose-400" />;
      case 'Terminal': return <Terminal className="w-5 h-5 text-emerald-400" />;
      case 'Award': return <Award className="w-5 h-5 text-amber-400" />;
      default: return <BookOpen className="w-5 h-5 text-cyan-400" />;
    }
  };

  return (
    <div className="space-y-4">
      {/* Real-world Metaphor Box */}
      <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-slate-900/95 via-slate-900/80 to-slate-950/95 border border-slate-800 shadow-xl relative overflow-hidden">
        {/* Subtle decorative glow */}
        <div className="absolute top-0 left-0 w-32 h-32 bg-amber-500/5 rounded-full blur-2xl pointer-events-none" />

        <div className="flex items-center gap-2.5 mb-3 border-b border-slate-800/80 pb-2.5">
          <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/30">
            {getIcon(realWorldMetaphor.iconName)}
          </div>
          <div>
            <div className="text-[11px] font-bold text-amber-400 uppercase tracking-wider">
              تشبيه من الحياة الواقعية (Real-World Analogy)
            </div>
            <h3 className="text-base sm:text-lg font-bold text-slate-100">
              {realWorldMetaphor.titleAr}
            </h3>
          </div>
        </div>

        {/* Story */}
        <p className="text-sm sm:text-base text-slate-200 leading-relaxed mb-4 bg-slate-950/60 p-3.5 rounded-xl border border-slate-800/70">
          {realWorldMetaphor.storyAr}
        </p>

        {/* Key Lesson */}
        <div className="p-3 rounded-xl bg-cyan-950/30 border border-cyan-500/30 mb-4 flex items-start gap-2.5">
          <Sparkles className="w-4 h-4 text-cyan-400 shrink-0 mt-1" />
          <div className="text-xs sm:text-sm text-cyan-200">
            <strong className="text-cyan-300 font-bold">العبرة الهندسية: </strong>
            {realWorldMetaphor.lessonAr}
          </div>
        </div>

        {/* Side-by-Side Comparison Table */}
        <div className="mt-4">
          <div className="text-xs font-bold text-slate-400 mb-2 flex items-center gap-1.5">
            <GitCompare className="w-3.5 h-3.5 text-indigo-400" />
            <span>جدول المقارنة المباشرة:</span>
          </div>

          <div className="overflow-x-auto rounded-xl border border-slate-800">
            <table className="w-full text-xs text-right">
              <thead className="bg-slate-950/90 text-slate-400 border-b border-slate-800">
                <tr>
                  <th className="p-2.5 font-bold text-amber-400">في الحياة الواقعية (Real World)</th>
                  <th className="p-2.5 font-bold text-cyan-400">في عالم الشبكات (Network Reality)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 bg-slate-900/40">
                {realWorldMetaphor.comparison.map((item, idx) => (
                  <tr key={idx} className="hover:bg-slate-800/30 transition-colors">
                    <td className="p-2.5 text-slate-200">{item.realWorld}</td>
                    <td className="p-2.5 text-cyan-200 font-medium font-mono dir-ltr text-right">{item.networkWorld}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Key Concepts Mini-Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {keyConcepts.map((c, idx) => (
          <div 
            key={idx} 
            className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-slate-700 transition-all flex flex-col justify-between"
          >
            <div>
              <div className="text-[10px] font-mono text-slate-400 uppercase">{c.term}</div>
              <h4 className="text-xs sm:text-sm font-bold text-slate-100 mt-0.5">{c.title}</h4>
              <p className="text-[11px] sm:text-xs text-slate-400 mt-1.5 leading-relaxed">{c.desc}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Takeaway message */}
      <div className="p-3 rounded-xl bg-indigo-950/40 border border-indigo-500/30 text-xs text-indigo-200 flex items-center justify-between">
        <span className="font-semibold">💡 الخلاصة: {takeawayMessage}</span>
      </div>
    </div>
  );
};
