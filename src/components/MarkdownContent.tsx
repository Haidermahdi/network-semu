import React from 'react';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import katex from 'katex';
import { Terminal, Layers, Info } from 'lucide-react';
import { Language } from '../types';

interface MarkdownContentProps {
  content: string;
  lang?: Language;
}

function parseMathAndText(node: React.ReactNode): React.ReactNode {
  if (typeof node !== 'string') {
    if (React.isValidElement(node) && (node.props as any)?.children) {
      return React.cloneElement(node as React.ReactElement<any>, {
        children: React.Children.map((node.props as any).children, parseMathAndText),
      });
    }
    if (Array.isArray(node)) {
      return node.map((child, idx) => <React.Fragment key={idx}>{parseMathAndText(child)}</React.Fragment>);
    }
    return node;
  }

  const text = node;
  const regex = /(\$\$[\s\S]+?\$\$|\$[^\$\n]+?\$)/g;
  if (!regex.test(text)) return text;
  regex.lastIndex = 0;

  const elements: React.ReactNode[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  let indexKey = 0;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) elements.push(text.substring(lastIndex, match.index));
    const raw = match[0];
    const isBlock = raw.startsWith('$$');
    const mathContent = isBlock ? raw.slice(2, -2).trim() : raw.slice(1, -1).trim();
    try {
      const html = katex.renderToString(mathContent, { displayMode: isBlock, throwOnError: false });
      elements.push(
        <span
          key={`katex-${indexKey++}`}
          className={`inline-flex items-center mx-1 px-2 py-0.5 rounded-lg bg-[var(--bg-elevated)] border border-[var(--border-default)] mono-text text-[var(--text-primary)] dir-ltr align-middle ${isBlock ? 'my-2 block w-fit mx-auto' : ''}`}
          dangerouslySetInnerHTML={{ __html: html }}
        />
      );
    } catch {
      elements.push(<span key={`fallback-${indexKey++}`} className="mono-text dir-ltr">{mathContent}</span>);
    }
    lastIndex = regex.lastIndex;
  }
  if (lastIndex < text.length) elements.push(text.substring(lastIndex));
  return elements;
}

export const MarkdownContent: React.FC<MarkdownContentProps> = ({ content, lang = 'ar' }) => {
  const isRtl = lang === 'ar';

  return (
    <div className={`markdown-content ${isRtl ? 'dir-rtl text-right' : 'dir-ltr text-left'}`}>
      <Markdown
        remarkPlugins={[remarkGfm]}
        components={{
          h1: ({ children }) => (
            <h1 className="heading-1 mt-6 mb-4 pb-3 border-b border-[var(--border-subtle)] flex items-center gap-3">
              <span className="w-1 h-6 rounded-full bg-[var(--accent)] shrink-0" />
              <span>{parseMathAndText(children)}</span>
            </h1>
          ),
          h2: ({ children }) => (
            <h2 className="heading-2 mt-5 mb-3 flex items-center gap-2">
              <Layers className="w-4 h-4 text-[var(--accent-text)] shrink-0" />
              <span>{parseMathAndText(children)}</span>
            </h2>
          ),
          h3: ({ children }) => (
            <h3 className="heading-3 mt-4 mb-2 p-3 surface flex items-center gap-2">
              <span>{parseMathAndText(children)}</span>
            </h3>
          ),
          h4: ({ children }) => (
            <h4 className="heading-4 mt-3 mb-2 flex items-center gap-2">
              <span className="w-1 h-3.5 rounded-full bg-[var(--accent)] shrink-0" />
              <span>{parseMathAndText(children)}</span>
            </h4>
          ),
          p: ({ children }) => (
            <p className="body-text my-2.5">{parseMathAndText(children)}</p>
          ),
          ul: ({ children }) => <ul className="my-3 space-y-2">{children}</ul>,
          ol: ({ children }) => <ol className="my-3 space-y-2">{children}</ol>,
          li: ({ children }) => (
            <li className="body-text flex items-start gap-2.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent)] shrink-0 mt-2" />
              <span className="flex-1">{parseMathAndText(children)}</span>
            </li>
          ),
          strong: ({ children }) => (
            <strong className="font-bold text-[var(--text-primary)] mono-text px-1 py-0.5 rounded bg-[var(--bg-elevated)] border border-[var(--border-subtle)]">
              {parseMathAndText(children)}
            </strong>
          ),
          em: ({ children }) => (
            <em className="text-[var(--accent-text)] not-italic font-semibold">{parseMathAndText(children)}</em>
          ),
          code: ({ className, children }) => {
            const isInline = !className;
            if (isInline) {
              const codeStr = String(children);
              if (codeStr.includes('$$') || codeStr.includes('$')) return <>{parseMathAndText(codeStr)}</>;
              return <code className="mono-text text-[var(--text-primary)] px-1.5 py-0.5 rounded bg-[var(--bg-elevated)] border border-[var(--border-subtle)] dir-ltr">{children}</code>;
            }
            return (
              <div className="my-4 rounded-xl border border-[var(--border-subtle)] overflow-hidden">
                <div className="px-4 py-2 bg-[#060911] border-b border-[var(--border-subtle)] flex items-center gap-2">
                  <Terminal className="w-3.5 h-3.5 text-[var(--accent-text)]" />
                  <span className="caption-text">Cisco IOS Terminal</span>
                </div>
                <pre className="p-4 overflow-x-auto mono-text text-[var(--text-primary)] whitespace-pre leading-relaxed dir-ltr text-left select-text bg-[#0a0e16]">
                  <code>{children}</code>
                </pre>
              </div>
            );
          },
          table: ({ children }) => (
            <div className="my-4 overflow-x-auto rounded-xl border border-[var(--border-subtle)]">
              <table className="w-full text-right border-collapse bg-[var(--bg-surface)]">{children}</table>
            </div>
          ),
          thead: ({ children }) => (
            <thead className="bg-[var(--bg-elevated)] label-text border-b border-[var(--border-subtle)]">{children}</thead>
          ),
          tbody: ({ children }) => <tbody className="divide-y divide-[var(--border-subtle)]">{children}</tbody>,
          tr: ({ children }) => <tr className="hover:bg-[var(--bg-surface-hover)] transition-colors">{children}</tr>,
          th: ({ children }) => <th className="p-2.5 text-[var(--accent-text)] font-bold whitespace-nowrap body-text">{parseMathAndText(children)}</th>,
          td: ({ children }) => <td className="p-2.5 body-text border-r border-[var(--border-subtle)] first:border-r-0">{parseMathAndText(children)}</td>,
          hr: () => <hr className="section-divider" />,
          blockquote: ({ children }) => (
            <blockquote className="my-4 p-4 surface-active">
              <div className="flex items-center gap-2 label-text mb-2">
                <Info className="w-3.5 h-3.5" />
                <span>ملاحظة هندسية</span>
              </div>
              <div className="body-text">{parseMathAndText(children)}</div>
            </blockquote>
          ),
        }}
      >
        {content}
      </Markdown>
    </div>
  );
};
