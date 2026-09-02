import React from 'react';

/* ─── Section Header ─── */
interface SectionHeaderProps {
  icon: React.ReactNode;
  title: string;
  subtitle?: string;
  badge?: string;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({ icon, title, subtitle, badge }) => (
  <div className="flex items-start gap-3 p-4 surface">
    <div className="p-2 rounded-lg bg-[var(--accent-muted)] text-[var(--accent-text)] shrink-0">
      {icon}
    </div>
    <div className="min-w-0 flex-1">
      <div className="flex items-center gap-2 flex-wrap">
        <h3 className="heading-3">{title}</h3>
        {badge && <span className="badge">{badge}</span>}
      </div>
      {subtitle && <p className="caption-text mt-1">{subtitle}</p>}
    </div>
  </div>
);

/* ─── Stat Card ─── */
interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: string | number;
}

export const StatCard: React.FC<StatCardProps> = ({ icon, label, value }) => (
  <div className="p-4 surface hover:border-[var(--border-default)] transition-all">
    <div className="w-8 h-8 rounded-lg bg-[var(--accent-muted)] flex items-center justify-center mb-3 text-[var(--accent-text)]">
      {icon}
    </div>
    <div className="heading-2">{value}</div>
    <div className="caption-text mt-0.5">{label}</div>
  </div>
);

/* ─── Progress Bar ─── */
interface ProgressBarProps {
  value: number;
  max: number;
  label?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ value, max, label }) => {
  const pct = max > 0 ? Math.round((value / max) * 100) : 0;
  return (
    <div className="space-y-1.5">
      {label && (
        <div className="flex justify-between caption-text">
          <span>{label}</span>
          <span className="mono-text font-bold text-[var(--text-secondary)]">{pct}%</span>
        </div>
      )}
      <div className="h-1 rounded-full bg-[var(--bg-elevated)] overflow-hidden">
        <div
          className="h-full rounded-full bg-[var(--accent)] transition-all duration-700 ease-out"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
};

/* ─── Tab Bar ─── */
interface TabItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
  count?: number;
}

interface TabBarProps {
  tabs: TabItem[];
  activeTab: string;
  onChange: (id: string) => void;
}

export const TabBar: React.FC<TabBarProps> = ({ tabs, activeTab, onChange }) => (
  <div className="flex items-center gap-1 p-1 surface overflow-x-auto">
    {tabs.map((tab) => (
      <button
        key={tab.id}
        onClick={() => onChange(tab.id)}
        className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
          activeTab === tab.id
            ? 'surface-active text-[var(--accent-text)]'
            : 'text-[var(--text-muted)] hover:text-[var(--text-secondary)] hover:bg-[var(--bg-surface-hover)]'
        }`}
      >
        {tab.icon}
        <span>{tab.label}</span>
        {tab.count !== undefined && (
          <span className="badge">{tab.count}</span>
        )}
      </button>
    ))}
  </div>
);

/* ─── Info Callout ─── */
interface InfoCalloutProps {
  title: string;
  children: React.ReactNode;
  icon?: React.ReactNode;
}

export const InfoCallout: React.FC<InfoCalloutProps> = ({ title, children, icon }) => (
  <div className="p-4 surface-active flex items-start gap-3">
    {icon && <div className="shrink-0 mt-0.5 text-[var(--accent-text)]">{icon}</div>}
    <div>
      <h4 className="heading-4 text-[var(--accent-text)] mb-1.5">{title}</h4>
      <div className="body-text">{children}</div>
    </div>
  </div>
);

/* ─── Visual Mapping ─── */
interface MappingItem {
  realLife: string;
  networkTech: string;
  ciscoTerm: string;
}

interface VisualMappingProps {
  items: MappingItem[];
  lang?: 'ar' | 'en';
}

export const VisualMapping: React.FC<VisualMappingProps> = ({ items, lang = 'ar' }) => (
  <div className="space-y-2">
    {items.map((item, idx) => (
      <div key={idx} className="p-4 surface hover:border-[var(--border-default)] transition-all">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="space-y-1">
            <div className="label-text">{lang === 'ar' ? 'الواقع' : 'Real Life'}</div>
            <div className="body-text">{item.realLife}</div>
          </div>
          <div className="space-y-1 sm:border-x sm:border-[var(--border-subtle)] sm:px-3">
            <div className="label-text">{lang === 'ar' ? 'الشبكة' : 'Network'}</div>
            <div className="body-text text-[var(--text-primary)]">{item.networkTech}</div>
          </div>
          <div className="space-y-1">
            <div className="label-text">Cisco</div>
            <div className="mono-text text-[var(--text-primary)] font-bold">{item.ciscoTerm}</div>
          </div>
        </div>
      </div>
    ))}
  </div>
);

/* ─── Reference Card ─── */
interface ReferenceCardProps {
  type: string;
  code: string;
  title: string;
  citation: string;
}

export const ReferenceCard: React.FC<ReferenceCardProps> = ({ type, code, title, citation }) => (
  <div className="p-4 surface hover:border-[var(--border-default)] transition-all h-full flex flex-col">
    <div className="flex items-center justify-between gap-2 mb-3">
      <span className="badge badge-accent">{type}</span>
      <span className="mono-text font-bold">{code}</span>
    </div>
    <h4 className="heading-4 flex-1">{title}</h4>
    <p className="caption-text mt-2 italic">{citation}</p>
  </div>
);

/* ─── Highlight Grid ─── */
interface HighlightItem {
  text: string;
}

interface HighlightGridProps {
  items: HighlightItem[];
  columns?: 1 | 2 | 3;
}

export const HighlightGrid: React.FC<HighlightGridProps> = ({ items, columns = 2 }) => (
  <div className={`grid grid-cols-1 ${columns === 2 ? 'sm:grid-cols-2' : columns === 3 ? 'sm:grid-cols-3' : ''} gap-2`}>
    {items.map((item, idx) => (
      <div key={idx} className="flex items-start gap-2.5 p-3 surface">
        <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent)] shrink-0 mt-2" />
        <span className="body-text">{item.text}</span>
      </div>
    ))}
  </div>
);

/* ─── CLI Terminal Panel ─── */
interface CliPanelProps {
  deviceName: string;
  command: string;
  output: string;
  explanation: string;
  onCopy?: () => void;
  copied?: boolean;
  lang?: 'ar' | 'en';
}

export const CliPanel: React.FC<CliPanelProps> = ({
  deviceName, command, output, explanation, onCopy, copied, lang = 'ar',
}) => (
  <div className="rounded-xl border border-[var(--border-subtle)] overflow-hidden">
    <div className="px-4 py-2.5 bg-[#060911] border-b border-[var(--border-subtle)] flex items-center justify-between">
      <div className="flex items-center gap-2">
        <div className="flex gap-1.5">
          <span className="w-2 h-2 rounded-full bg-slate-600" />
          <span className="w-2 h-2 rounded-full bg-slate-600" />
          <span className="w-2 h-2 rounded-full bg-slate-600" />
        </div>
        <span className="mono-text text-[var(--text-primary)] font-bold">
          {deviceName}# {command}
        </span>
      </div>
      {onCopy && (
        <button onClick={onCopy} className="btn-ghost py-1 px-2">
          {copied ? '✓' : lang === 'ar' ? 'نسخ' : 'Copy'}
        </button>
      )}
    </div>
    <pre className="p-4 overflow-x-auto mono-text text-[var(--text-primary)] whitespace-pre leading-relaxed dir-ltr text-left select-text max-h-64 bg-[#0a0e16]">
      {output}
    </pre>
    <div className="px-4 py-3 border-t border-[var(--border-subtle)] flex items-start gap-2 bg-[var(--bg-surface)]">
      <span className="text-[var(--accent-text)] text-xs shrink-0">→</span>
      <span className="body-text">{explanation}</span>
    </div>
  </div>
);

/* ─── Page Header (used across modules) ─── */
interface PageHeaderProps {
  icon: React.ReactNode;
  title: string;
  description?: string;
  badge?: string;
  action?: React.ReactNode;
}

export const PageHeader: React.FC<PageHeaderProps> = ({ icon, title, description, badge, action }) => (
  <div className="p-5 surface space-y-3">
    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
      <div className="flex items-start gap-3">
        <div className="w-9 h-9 rounded-lg bg-[var(--accent-muted)] flex items-center justify-center text-[var(--accent-text)] shrink-0">
          {icon}
        </div>
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <h2 className="heading-2">{title}</h2>
            {badge && <span className="badge badge-accent">{badge}</span>}
          </div>
          {description && <p className="body-text mt-1">{description}</p>}
        </div>
      </div>
      {action}
    </div>
  </div>
);

/* ─── Content Panel (3-column breakdown) ─── */
interface ContentPanelProps {
  label: string;
  title?: string;
  children: React.ReactNode;
}

export const ContentPanel: React.FC<ContentPanelProps> = ({ label, title, children }) => (
  <div className="p-4 surface space-y-2 h-full">
    <div className="label-text">{label}</div>
    {title && <h4 className="heading-4">{title}</h4>}
    <div className="body-text">{children}</div>
  </div>
);
