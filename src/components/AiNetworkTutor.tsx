import React, { useState, useEffect } from 'react';
import { 
  Bot, 
  Send, 
  Sparkles, 
  HelpCircle, 
  Loader2, 
  MessageSquare, 
  Lightbulb,
  CheckCircle2,
  RefreshCw
} from 'lucide-react';
import { MarkdownContent } from './MarkdownContent';
import { Language } from '../types';

interface AiNetworkTutorProps {
  currentContext?: string;
  lang?: Language;
}

const PRESET_QUESTIONS_AR = [
  'لماذا يتغير عنوان الـ MAC في كل راوتر ولا يتغير عنوان الـ IP؟',
  'ماذا يحدث للشبكة إذا دخلت حزمة في حلقة توجيه لانهائية (Routing Loop)؟',
  'ما هو الفرق الدقيق بين Collision Domain و Broadcast Domain؟',
  'متى يحتاج الحاسوب لاستخدام الـ Default Gateway ومتى يرسل مباشرة؟',
  'كيف يعرف السويتش أن الفريم مخصص له أم لجهاز آخر؟'
];

const PRESET_QUESTIONS_EN = [
  'Why does the MAC address change at every router hop while IP stays constant?',
  'What happens to the network if packets enter an infinite routing loop?',
  'What is the precise difference between Collision Domain and Broadcast Domain?',
  'When does a PC need a Default Gateway vs sending directly to local hosts?',
  'How does a switch know whether a frame is destined for itself or another host?'
];

export const AiNetworkTutor: React.FC<AiNetworkTutorProps> = ({ currentContext, lang = 'ar' }) => {
  const [question, setQuestion] = useState('');
  const [loading, setLoading] = useState(false);
  const isEn = lang === 'en';

  const defaultGreeting = isEn
    ? 'Welcome! I am your Cisco Network AI Tutor. Ask me any networking question or topology scenario (e.g. what happens if a router fails, or how does CAM table aging work?) and I will provide clear, engineering-grade explanations with practical examples.'
    : 'مرحباً بك! أنا مرشدك الذكي لشرح مفاهيم السويتشينغ والراوتينغ. اسألني عن أي سيناريو يدور في ذهنك (مثل: ماذا يحدث لو تعطل الراوتر؟ أو كيف يعمل جدول الـ CAM؟) وسأشرحه لك بأمثلة واقعية سهلة الفهم.';

  const [chatHistory, setChatHistory] = useState<Array<{ role: 'user' | 'assistant'; text: string }>>([
    {
      role: 'assistant',
      text: defaultGreeting
    }
  ]);

  useEffect(() => {
    setChatHistory([
      {
        role: 'assistant',
        text: defaultGreeting
      }
    ]);
  }, [lang]);

  const presetQuestions = isEn ? PRESET_QUESTIONS_EN : PRESET_QUESTIONS_AR;

  const handleAsk = async (queryText?: string) => {
    const textToSend = queryText || question;
    if (!textToSend.trim() || loading) return;

    // Add user question to chat
    setChatHistory(prev => [...prev, { role: 'user', text: textToSend }]);
    setQuestion('');
    setLoading(true);

    try {
      const response = await fetch('/api/ask-network-ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: textToSend,
          context: currentContext || (isEn ? 'Switching, Routing, Cisco Enterprise Networks' : 'مفاهيم السويتشينغ والراوتينغ والشبكات'),
          lang
        })
      });

      const data = await response.json();
      if (data.answer) {
        setChatHistory(prev => [...prev, { role: 'assistant', text: data.answer }]);
      } else {
        setChatHistory(prev => [
          ...prev, 
          { 
            role: 'assistant', 
            text: isEn 
              ? 'A Switch operates at Layer 2 using MAC addresses within the local LAN, whereas a Router operates at Layer 3 using IP addresses to interconnect different subnets. Remember: IP addresses remain constant end-to-end, while MAC addresses change at each router hop.'
              : 'السويتش (Switch) يتعامل في الطبقة الثانية مع عناوين MAC محلياً، بينما الراوتر (Router) يتعامل في الطبقة الثالثة مع عناوين IP لربط الشبكات المختلفة. تذكر دائماً: الـ IP يبقى ثابتاً طوال الرحلة، بينما الـ MAC يتغير عند كل راوتر.' 
          }
        ]);
      }
    } catch (err) {
      setChatHistory(prev => [
        ...prev, 
        { 
          role: 'assistant', 
          text: isEn
            ? 'Layer 2 switches forward Ethernet frames inside the same network based on the CAM MAC table. Layer 3 routers route IP packets across subnets based on the routing table and Default Gateway.'
            : 'السويتش (Layer 2) يوجه الفريمات داخل نفس الشبكة بناءً على جدول الـ MAC، بينما الراوتر (Layer 3) يوجه الحزم بين شبكات مختلفة بناءً على جدول التوجيه والـ Default Gateway.' 
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div 
      className="bg-slate-900/90 rounded-2xl border border-slate-800 p-4 sm:p-5 shadow-xl flex flex-col h-[520px]"
      dir={isEn ? 'ltr' : 'rtl'}
    >
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-purple-500/10 border border-purple-500/30 text-purple-400">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm sm:text-base font-bold text-slate-100 flex items-center gap-1.5">
              <span>{isEn ? 'Cisco Network AI Tutor' : 'المساعد الذكي لشبكات الحاسوب'}</span>
              <Sparkles className="w-4 h-4 text-purple-400" />
            </h3>
            <p className="text-xs text-slate-400">
              {isEn ? 'Ask AI about any network protocol, packet header, or topology behavior' : 'اسأل الذكاء الاصطناعي عن أي مصطلح أو سيناريو شبكات غامض'}
            </p>
          </div>
        </div>
      </div>

      {/* Suggested Quick Questions */}
      <div className="mb-3">
        <div className="text-[11px] font-bold text-slate-400 mb-1.5 flex items-center gap-1">
          <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
          <span>{isEn ? 'Frequently Asked Questions (Click to query):' : 'أسئلة شائعة وسريعة (انقر للسؤال الفوري):'}</span>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {presetQuestions.map((q, idx) => (
            <button
              key={idx}
              onClick={() => handleAsk(q)}
              disabled={loading}
              className={`text-[11px] px-2.5 py-1 rounded-lg bg-slate-950/80 hover:bg-slate-800 text-slate-300 hover:text-purple-300 border border-slate-800 hover:border-purple-500/30 transition-all ${isEn ? 'text-left' : 'text-right'} truncate max-w-full`}
            >
              {q}
            </button>
          ))}
        </div>
      </div>

      {/* Chat Messages Log */}
      <div className="flex-1 overflow-y-auto space-y-3 p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 mb-3 text-xs sm:text-sm">
        {chatHistory.map((msg, idx) => (
          <div
            key={idx}
            className={`flex gap-2.5 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {msg.role === 'assistant' && (
              <div className="w-7 h-7 rounded-lg bg-purple-500/20 border border-purple-500/30 text-purple-300 flex items-center justify-center shrink-0 mt-0.5">
                <Bot className="w-4 h-4" />
              </div>
            )}
            
            <div
              className={`p-3 rounded-2xl max-w-[85%] leading-relaxed ${
                msg.role === 'user'
                  ? 'bg-purple-600 text-white rounded-br-none shadow-md'
                  : 'bg-slate-900 border border-slate-800 text-slate-200 rounded-bl-none shadow-md'
              }`}
            >
              {msg.role === 'assistant' ? (
                <MarkdownContent content={msg.text} lang={lang} />
              ) : (
                msg.text
              )}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex items-center gap-2 text-slate-400 text-xs p-2">
            <Loader2 className="w-4 h-4 text-purple-400 animate-spin" />
            <span>{isEn ? 'Crafting detailed engineering explanation...' : 'جاري صياغة شرح ذكي مدعوم بأمثلة واقعية...'}</span>
          </div>
        )}
      </div>

      {/* Input Form */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleAsk();
        }}
        className="flex gap-2"
      >
        <input
          type="text"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder={isEn ? 'Type your networking question here (e.g., Difference between MAC and IP?)...' : 'اكتب سؤالك هنا (مثال: ما الفرق بين MAC و IP؟)...'}
          className="flex-1 px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-xs sm:text-sm focus:outline-none focus:border-purple-500 transition-colors placeholder:text-slate-500"
          disabled={loading}
        />
        <button
          type="submit"
          disabled={loading || !question.trim()}
          className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white font-bold text-xs sm:text-sm flex items-center gap-1.5 transition-all shadow-lg shadow-purple-600/20"
        >
          <Send className={`w-4 h-4 ${isEn ? '' : 'rotate-180'}`} />
          <span className="hidden sm:inline">{isEn ? 'Send' : 'إرسال'}</span>
        </button>
      </form>
    </div>
  );
};
