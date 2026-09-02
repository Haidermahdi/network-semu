import React, { useState } from 'react';
import { 
  X, 
  Table, 
  Network, 
  Radio, 
  Laptop, 
  Clock, 
  ShieldCheck, 
  CheckCircle2, 
  Activity,
  Layers
} from 'lucide-react';
import { MacTableEntry, RoutingTableEntry, ArpTableEntry, NetworkNode } from '../types';

interface LiveTablesModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedNode?: NetworkNode | null;
  macTable: MacTableEntry[];
  routingTable: RoutingTableEntry[];
  arpCache: ArpTableEntry[];
}

export const LiveTablesModal: React.FC<LiveTablesModalProps> = ({
  isOpen,
  onClose,
  selectedNode,
  macTable,
  routingTable,
  arpCache
}) => {
  const [activeTab, setActiveTab] = useState<'mac' | 'routing' | 'arp'>(
    selectedNode?.type === 'switch' ? 'mac' : selectedNode?.type === 'router' ? 'routing' : 'arp'
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-3xl bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-800 bg-slate-950/70">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-indigo-500/10 border border-indigo-500/30 text-indigo-400">
              <Table className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-100">
                مستعرض الجداول الحية (Live Memory Tables Inspector)
              </h3>
              <p className="text-xs text-slate-400">
                {selectedNode ? `فحص جهاز: ${selectedNode.arName}` : 'فحص الجداول العتادية وقواعد التوجيه'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-800 bg-slate-950/40 p-2 gap-2">
          <button
            onClick={() => setActiveTab('mac')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'mac'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <Network className="w-3.5 h-3.5" />
            <span>جدول الـ MAC بالسويتش (CAM Table)</span>
          </button>

          <button
            onClick={() => setActiveTab('routing')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'routing'
                ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/40'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <Radio className="w-3.5 h-3.5" />
            <span>جدول التوجيه بالراوتر (Routing Table)</span>
          </button>

          <button
            onClick={() => setActiveTab('arp')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'arp'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <Laptop className="w-3.5 h-3.5" />
            <span>ذاكرة الـ ARP Cache بالحواسيب</span>
          </button>
        </div>

        {/* Table Content */}
        <div className="p-4 overflow-y-auto flex-1 text-xs">
          {activeTab === 'mac' && (
            <div>
              <div className="mb-3 p-2.5 rounded-xl bg-emerald-950/20 border border-emerald-500/30 text-emerald-200 text-xs">
                💡 <strong>جدول الـ CAM:</strong> يسجل السويتش هنا عناوين الـ MAC التي يتعلمها من المنافذ لتوجيه الفريمات بسرعة عتادية (L2 ASIC).
              </div>

              <div className="rounded-xl border border-slate-800 overflow-hidden font-mono">
                <table className="w-full text-right">
                  <thead className="bg-slate-950 text-slate-400 border-b border-slate-800 text-[11px]">
                    <tr>
                      <th className="p-2.5">VLAN</th>
                      <th className="p-2.5">MAC Address</th>
                      <th className="p-2.5">Type</th>
                      <th className="p-2.5">Port</th>
                      <th className="p-2.5">Age</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800 bg-slate-900/60 text-slate-200">
                    {macTable.map((entry, idx) => (
                      <tr key={idx} className="hover:bg-slate-800/40">
                        <td className="p-2.5 text-cyan-400">{entry.vlan}</td>
                        <td className="p-2.5 font-bold text-emerald-300">{entry.macAddress}</td>
                        <td className="p-2.5 text-slate-400">{entry.type}</td>
                        <td className="p-2.5 font-bold text-amber-300">{entry.port}</td>
                        <td className="p-2.5 text-slate-400">{entry.ageSeconds}s</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'routing' && (
            <div>
              <div className="mb-3 p-2.5 rounded-xl bg-indigo-950/20 border border-indigo-500/30 text-indigo-200 text-xs">
                💡 <strong>جدول التوجيه (FIB/RIB):</strong> خريطة الراوتر لتحديد المنفذ والقفزة التالية (Next-Hop) لكل شبكة فرعية (Subnet).
              </div>

              <div className="rounded-xl border border-slate-800 overflow-hidden font-mono">
                <table className="w-full text-right">
                  <thead className="bg-slate-950 text-slate-400 border-b border-slate-800 text-[11px]">
                    <tr>
                      <th className="p-2.5">Proto</th>
                      <th className="p-2.5">Destination Subnet</th>
                      <th className="p-2.5">Next-Hop IP</th>
                      <th className="p-2.5">Interface</th>
                      <th className="p-2.5">Metric</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800 bg-slate-900/60 text-slate-200">
                    {routingTable.map((entry, idx) => (
                      <tr key={idx} className="hover:bg-slate-800/40">
                        <td className="p-2.5 font-bold text-indigo-400">[{entry.protocol}]</td>
                        <td className="p-2.5 font-bold text-cyan-300">{entry.destinationNetwork}/{entry.subnetMask}</td>
                        <td className="p-2.5 text-amber-300">{entry.nextHopIp}</td>
                        <td className="p-2.5 text-slate-300">{entry.interface}</td>
                        <td className="p-2.5 text-slate-400">{entry.metric}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'arp' && (
            <div>
              <div className="mb-3 p-2.5 rounded-xl bg-cyan-950/20 border border-cyan-500/30 text-cyan-200 text-xs">
                💡 <strong>ذاكرة الـ ARP Cache:</strong> مفكرة الهاتف المخزنة في نظام التشغيل لربط عناوين IP بعناوين MAC الفيزيائية.
              </div>

              <div className="rounded-xl border border-slate-800 overflow-hidden font-mono">
                <table className="w-full text-right">
                  <thead className="bg-slate-950 text-slate-400 border-b border-slate-800 text-[11px]">
                    <tr>
                      <th className="p-2.5">IP Address</th>
                      <th className="p-2.5">Physical MAC Address</th>
                      <th className="p-2.5">Type</th>
                      <th className="p-2.5">Interface</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800 bg-slate-900/60 text-slate-200">
                    {arpCache.map((entry, idx) => (
                      <tr key={idx} className="hover:bg-slate-800/40">
                        <td className="p-2.5 font-bold text-indigo-300">{entry.ipAddress}</td>
                        <td className="p-2.5 font-bold text-cyan-300">{entry.macAddress}</td>
                        <td className="p-2.5 text-slate-400">{entry.type}</td>
                        <td className="p-2.5 text-slate-300">{entry.interface}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-slate-800 bg-slate-950/80 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs transition-colors"
          >
            إغلاق
          </button>
        </div>
      </div>
    </div>
  );
};
