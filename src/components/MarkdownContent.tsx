import React from 'react';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import katex from 'katex';
import { 
  Terminal, 
  Layers, 
  Info,
  Sparkles,
  Calculator
} from 'lucide-react';
import { Language } from '../types';

interface MarkdownContentProps {
  content: string;
  lang?: Language;
}

// Helper to parse math tokens ($...$ or $$...$$) within text nodes
function parseMathAndText(node: React.ReactNode): React.ReactNode {
  if (typeof node !== 'string') {
    if (React.isValidElement(node) && (node.props as any) && (node.props as any).children) {
      return React.cloneElement(node as React.ReactElement<any>, {
        children: React.Children.map((node.props as any).children, parseMathAndText)
      });
    }
    if (Array.isArray(node)) {
      return node.map((child, idx) => <React.Fragment key={idx}>{parseMathAndText(child)}</React.Fragment>);
    }
    return node;
  }

  const text = node;
  const regex = /(\$\$[\s\S]+?\$\$|\$[^\$\n]+?\$)/g;
  if (!regex.test(text)) {
    return text;
  }
  regex.lastIndex = 0;

  const elements: React.ReactNode[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  let indexKey = 0;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      elements.push(text.substring(lastIndex, match.index));
    }

    const raw = match[0];
    const isBlock = raw.startsWith('$$');
    let mathContent = isBlock ? raw.slice(2, -2).trim() : raw.slice(1, -1).trim();

    // Clean up math text commands for nice display
    try {
      const html = katex.renderToString(mathContent, {
        displayMode: isBlock,
        throwOnError: false,
      });

      elements.push(
        <span
          key={`katex-${indexKey++}`}
          className={`inline-flex items-center gap-1 mx-1.5 px-2 py-0.5 rounded-lg bg-indigo-950/80 border border-indigo-500/40 text-cyan-200 font-mono text-[13px] shadow-sm dir-ltr align-middle select-text font-bold ${
            isBlock ? 'my-2 block w-fit mx-auto' : ''
          }`}
          dangerouslySetInnerHTML={{ __html: html }}
        />
      );
    } catch (e) {
      elements.push(
        <span key={`fallback-${indexKey++}`} className="inline-block px-1.5 py-0.5 rounded bg-slate-900 text-cyan-300 font-mono text-xs border border-slate-700 dir-ltr">
          {mathContent}
        </span>
      );
    }

    lastIndex = regex.lastIndex;
  }

  if (lastIndex < text.length) {
    elements.push(text.substring(lastIndex));
  }

  return elements;
}

export const MarkdownContent: React.FC<MarkdownContentProps> = ({ 
  content, 
  lang = 'ar' 
}) => {
  const isRtl = lang === 'ar';

  return (
    <div className={`markdown-content ${isRtl ? 'dir-rtl text-right' : 'dir-ltr text-left'} text-slate-200 text-xs sm:text-sm leading-relaxed`}>
      <Markdown
        remarkPlugins={[remarkGfm]}
        components={{
          h1: ({ children }) => (
            <h1 className="text-lg sm:text-xl font-black text-white mt-6 mb-3 pb-2 border-b border-indigo-500/30 flex items-center gap-2">
              <span className="w-2 h-5 rounded-full bg-gradient-to-b from-indigo-500 to-cyan-400 shrink-0" />
              <span>{parseMathAndText(children)}</span>
            </h1>
          ),
          h2: ({ children }) => (
            <h2 className="text-base sm:text-lg font-black text-indigo-200 mt-5 mb-2.5 pb-1.5 border-b border-slate-800 flex items-center gap-2">
              <span className="w-2 h-4 rounded-full bg-indigo-500 shrink-0" />
              <span>{parseMathAndText(children)}</span>
            </h2>
          ),
          h3: ({ children }) => (
            <div className="mt-5 mb-2.5 p-3 rounded-2xl bg-gradient-to-r from-slate-950 via-slate-900/90 to-indigo-950/40 border border-slate-800/90 shadow-sm flex items-center justify-between gap-3">
              <h3 className="text-xs sm:text-sm font-extrabold text-cyan-300 flex items-center gap-2">
                <span className="p-1 rounded-lg bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 shrink-0">
                  <Layers className="w-3.5 h-3.5" />
                </span>
                <span>{parseMathAndText(children)}</span>
              </h3>
            </div>
          ),
          h4: ({ children }) => (
            <h4 className="text-xs sm:text-sm font-bold text-amber-300 mt-3.5 mb-1.5 flex items-center gap-1.5">
              <span className="w-1.5 h-3 rounded-full bg-amber-400 shrink-0" />
              <span>{parseMathAndText(children)}</span>
            </h4>
          ),
          p: ({ children }) => (
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed my-2.5">
              {parseMathAndText(children)}
            </p>
          ),
          ul: ({ children }) => (
            <ul className="my-2.5 space-y-2 pr-1 pl-1">
              {children}
            </ul>
          ),
          ol: ({ children }) => (
            <ol className="my-3 space-y-2.5 pr-1 pl-1 list-decimal list-inside text-slate-200 font-sans">
              {children}
            </ol>
          ),
          li: ({ children }) => (
            <li className="text-xs sm:text-sm text-slate-200 leading-relaxed group marker:text-indigo-400 marker:font-bold">
              <span className="inline-block">{parseMathAndText(children)}</span>
            </li>
          ),
          strong: ({ children }) => (
            <strong className="font-bold text-cyan-200 bg-slate-950/80 px-1.5 py-0.5 rounded border border-slate-800 font-mono text-[11px] sm:text-xs inline-block my-0.5 mx-0.5">
              {parseMathAndText(children)}
            </strong>
          ),
          em: ({ children }) => (
            <em className="text-amber-300 not-italic font-semibold px-0.5">
              {parseMathAndText(children)}
            </em>
          ),
          code: ({ className, children }) => {
            const isInline = !className;
            if (isInline) {
              const codeStr = String(children);
              // If code itself contains math equations
              if (codeStr.includes('$$') || codeStr.includes('$')) {
                return <>{parseMathAndText(codeStr)}</>;
              }
              return (
                <code className="px-1.5 py-0.5 rounded bg-slate-950 text-emerald-300 font-mono text-xs border border-slate-800 font-bold inline-block mx-0.5 dir-ltr">
                  {children}
                </code>
              );
            }
            return (
              <div className="my-3.5 rounded-2xl bg-[#090d16] border border-slate-800 overflow-hidden shadow-xl">
                <div className="px-4 py-1.5 bg-slate-950 border-b border-slate-800 flex items-center justify-between text-[11px] font-mono text-slate-400">
                  <div className="flex items-center gap-2">
                    <Terminal className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Cisco Terminal Code / Output</span>
                  </div>
                </div>
                <pre className="p-3.5 overflow-x-auto text-emerald-300 text-xs font-mono whitespace-pre leading-relaxed dir-ltr text-left select-text">
                  <code>{children}</code>
                </pre>
              </div>
            );
          },
          table: ({ children }) => (
            <div className="my-4 overflow-x-auto rounded-2xl border border-slate-800 shadow-xl bg-slate-950/80">
              <table className="w-full text-xs text-right border-collapse">
                {children}
              </table>
            </div>
          ),
          thead: ({ children }) => (
            <thead className="bg-slate-900/90 text-slate-200 uppercase font-mono text-[11px] border-b border-slate-800">
              {children}
            </thead>
          ),
          tbody: ({ children }) => (
            <tbody className="divide-y divide-slate-800/60">
              {children}
            </tbody>
          ),
          tr: ({ children }) => (
            <tr className="hover:bg-slate-900/40 transition-colors">
              {children}
            </tr>
          ),
          th: ({ children }) => (
            <th className="p-2.5 text-cyan-300 font-bold whitespace-nowrap">
              {parseMathAndText(children)}
            </th>
          ),
          td: ({ children }) => (
            <td className="p-2.5 text-slate-300 border-r border-slate-800/40 first:border-r-0">
              {parseMathAndText(children)}
            </td>
          ),
          hr: () => (
            <div className="my-5 flex items-center gap-3">
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-slate-700 to-transparent" />
              <Sparkles className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-slate-700 to-transparent" />
            </div>
          ),
          blockquote: ({ children }) => (
            <blockquote className="my-3 p-3.5 rounded-2xl bg-indigo-950/30 border-r-4 border-indigo-500 text-slate-300 text-xs sm:text-sm italic space-y-1">
              <div className="flex items-center gap-2 text-indigo-400 font-bold not-italic mb-1 text-xs">
                <Info className="w-3.5 h-3.5" />
                <span>ملاحظة هندسية (Engineering Note):</span>
              </div>
              <div>{parseMathAndText(children)}</div>
            </blockquote>
          )
        }}
      >
        {content}
      </Markdown>
    </div>
  );
};
