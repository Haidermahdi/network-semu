import React, { useState } from 'react';
import { 
  Layers, 
  Search, 
  ChevronDown, 
  ChevronRight, 
  FileText, 
  Activity, 
  CheckCircle2, 
  Info,
  Sliders
} from 'lucide-react';
import { WIRESHARK_TRACES } from '../data/wiresharkTraces';
import { WiresharkFrame } from '../types';

export const WiresharkInspector: React.FC = () => {
  const [selectedTraceKey, setSelectedTraceKey] = useState<string>('ospf-hello');
  const [selectedFrameIndex, setSelectedFrameIndex] = useState<number>(0);
  const [expandedLayers, setExpandedLayers] = useState<Record<string, boolean>>({
    'layer-0': true,
    'layer-1': true,
    'layer-2': true,
    'layer-3': true
  });

  const frames: WiresharkFrame[] = WIRESHARK_TRACES[selectedTraceKey] || [];
  const currentFrame = frames[selectedFrameIndex] || frames[0];

  const toggleLayer = (id: string) => {
    setExpandedLayers(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  return (
    <div className="space-y-4 font-sans">
      {/* Top Protocol Filter & Scenario Ribbon */}
      <div className="p-3 bg-slate-900/90 rounded-2xl border border-slate-800 flex flex-wrap items-center justify-between gap-3 shadow-lg">
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-cyan-400" />
          <span className="text-xs font-bold text-slate-300">مكتبة حزم Wireshark المسجلة (PCAP Traces):</span>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => {
              setSelectedTraceKey('ospf-hello');
              setSelectedFrameIndex(0);
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              selectedTraceKey === 'ospf-hello'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800'
            }`}
          >
            حزمة OSPFv2 Hello (Protocol 89)
          </button>

          <button
            onClick={() => {
              setSelectedTraceKey('dot1q-vlan-tag');
              setSelectedFrameIndex(0);
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              selectedTraceKey === 'dot1q-vlan-tag'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800'
            }`}
          >
            فريم IEEE 802.1Q Tagged (VLAN Trunk)
          </button>
        </div>
      </div>

      {/* Wireshark Main UI Pane */}
      <div className="rounded-2xl bg-slate-950 border border-slate-800 overflow-hidden shadow-2xl flex flex-col h-[600px]">
        {/* Wireshark Header Bar */}
        <div className="px-4 py-2 bg-slate-900 border-b border-slate-800 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 font-mono text-cyan-300 font-bold">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse" />
            <span>Wireshark v4.2 Network Protocol Dissector (Cisco Enterprise Capture)</span>
          </div>

          <div className="flex items-center gap-2 font-mono text-slate-400 text-[11px]">
            <span>Filter:</span>
            <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-600/40">
              {selectedTraceKey === 'ospf-hello' ? 'ospf.msg == 1' : 'vlan.id == 10'}
            </span>
          </div>
        </div>

        {/* 1. Packet List View (Top Pane) */}
        <div className="bg-[#0f172a] border-b border-slate-800 font-mono text-xs overflow-x-auto select-none">
          <table className="w-full text-left dir-ltr">
            <thead>
              <tr className="bg-slate-900 text-slate-400 text-[11px] border-b border-slate-800">
                <th className="py-1.5 px-3 w-16">No.</th>
                <th className="py-1.5 px-3 w-24">Time</th>
                <th className="py-1.5 px-3 w-36">Source</th>
                <th className="py-1.5 px-3 w-36">Destination</th>
                <th className="py-1.5 px-3 w-28">Protocol</th>
                <th className="py-1.5 px-3 w-20">Length</th>
                <th className="py-1.5 px-3">Info</th>
              </tr>
            </thead>
            <tbody>
              {frames.map((frame, idx) => (
                <tr
                  key={frame.frameNumber}
                  onClick={() => setSelectedFrameIndex(idx)}
                  className={`cursor-pointer transition-colors border-b border-slate-800/40 ${
                    selectedFrameIndex === idx
                      ? 'bg-indigo-900/60 text-white font-bold'
                      : 'text-slate-300 hover:bg-slate-800/50'
                  }`}
                >
                  <td className="py-1.5 px-3">{frame.frameNumber}</td>
                  <td className="py-1.5 px-3">{frame.timeOffset}</td>
                  <td className="py-1.5 px-3 text-cyan-300">{frame.source}</td>
                  <td className="py-1.5 px-3 text-amber-300">{frame.destination}</td>
                  <td className="py-1.5 px-3 font-bold text-indigo-300">{frame.protocol}</td>
                  <td className="py-1.5 px-3">{frame.length}</td>
                  <td className="py-1.5 px-3 truncate max-w-xs">{frame.info}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* 2. Packet Details Tree View (Middle Pane) */}
        <div className="flex-1 p-3 overflow-y-auto bg-[#0b0f19] font-mono text-xs space-y-2 dir-ltr text-left">
          {currentFrame.layers.map((layer, lIdx) => {
            const layerKey = `layer-${lIdx}`;
            const isExpanded = expandedLayers[layerKey] ?? true;

            return (
              <div key={layerKey} className="rounded-lg border border-slate-800/80 bg-slate-950/70 overflow-hidden">
                {/* Layer Header */}
                <button
                  onClick={() => toggleLayer(layerKey)}
                  className="w-full px-3 py-1.5 bg-slate-900/90 hover:bg-slate-800/80 flex items-center gap-2 text-slate-200 font-bold transition-colors text-left"
                >
                  {isExpanded ? (
                    <ChevronDown className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                  ) : (
                    <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  )}
                  <span>{layer.layerName}</span>
                </button>

                {/* Layer Fields */}
                {isExpanded && (
                  <div className="p-2.5 pl-6 space-y-1 bg-slate-950/40 text-slate-300 text-[11px]">
                    {layer.fields.map((f, fIdx) => (
                      <div key={fIdx} className="flex flex-wrap items-center justify-between gap-2 hover:bg-slate-900/40 px-1 py-0.5 rounded">
                        <div className="flex items-center gap-2">
                          <span className="text-slate-400">{f.key}:</span>
                          <span className="text-cyan-200 font-semibold">{f.value}</span>
                        </div>
                        {f.annotationAr && (
                          <span className="px-2 py-0.5 rounded bg-indigo-950/70 border border-indigo-500/30 text-indigo-300 text-[10px] font-sans dir-rtl text-right">
                            {f.annotationAr}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* 3. Raw Hex & ASCII Dump View (Bottom Pane) */}
        {currentFrame.rawHexPreview && (
          <div className="p-3 bg-slate-900/90 border-t border-slate-800 font-mono text-[11px] dir-ltr text-left">
            <div className="text-slate-400 mb-1 font-bold text-[10px]">Frame Raw Hex Dump (Wire Byte Stream):</div>
            <pre className="text-emerald-400/90 whitespace-pre-wrap leading-relaxed select-text bg-slate-950 p-2 rounded-lg border border-slate-800/80">
              {currentFrame.rawHexPreview}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
};
