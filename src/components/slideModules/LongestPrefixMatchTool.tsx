import React, { useState } from 'react';
import { Compass, CheckCircle2, ArrowRight, Route, ShieldAlert, Cpu, Terminal } from 'lucide-react';
import { Language } from '../../types';

interface RouteEntry {
  prefix: string;
  maskLen: number;
  protocol: 'C' | 'S' | 'O' | 'D';
  protocolName: string;
  ad: number;
  metric: number;
  nextHop: string;
  interfaceName: string;
}

const ROUTING_TABLE: RouteEntry[] = [
  { prefix: '10.0.0.0', maskLen: 8, protocol: 'O', protocolName: 'OSPF', ad: 110, metric: 20, nextHop: '192.168.12.2', interfaceName: 'Gig0/1' },
  { prefix: '10.1.0.0', maskLen: 16, protocol: 'D', protocolName: 'EIGRP', ad: 90, metric: 15000, nextHop: '192.168.13.2', interfaceName: 'Gig0/2' },
  { prefix: '10.1.2.0', maskLen: 24, protocol: 'O', protocolName: 'OSPF', ad: 110, metric: 10, nextHop: '192.168.14.2', interfaceName: 'Gig0/3' },
  { prefix: '10.1.2.128', maskLen: 25, protocol: 'S', protocolName: 'Static', ad: 1, metric: 0, nextHop: '192.168.15.2', interfaceName: 'Gig0/4' },
  { prefix: '0.0.0.0', maskLen: 0, protocol: 'S', protocolName: 'Default', ad: 1, metric: 0, nextHop: '203.0.113.1', interfaceName: 'Gig0/0' }
];

interface LongestPrefixMatchToolProps {
  lang?: Language;
}

export const LongestPrefixMatchTool: React.FC<LongestPrefixMatchToolProps> = ({ lang = 'ar' }) => {
  const isEn = lang === 'en';
  const [testIp, setTestIp] = useState('10.1.2.140');

  // Convert IP to 32-bit uint
  const ipToUint = (ip: string): number => {
    const parts = ip.trim().split('.').map(p => parseInt(p, 10));
    if (parts.length !== 4 || parts.some(isNaN)) return 0;
    return ((parts[0] << 24) | (parts[1] << 16) | (parts[2] << 8) | parts[3]) >>> 0;
  };

  const getMask = (len: number): number => {
    if (len === 0) return 0;
    return (~((1 << (32 - len)) - 1)) >>> 0;
  };

  const targetUint = ipToUint(testIp);

  // Check matching routes
  const matchedRoutes = ROUTING_TABLE.filter(route => {
    if (route.maskLen === 0) return true;
    const mask = getMask(route.maskLen);
    const routeUint = ipToUint(route.prefix);
    return (targetUint & mask) >>> 0 === (routeUint & mask) >>> 0;
  });

  // Longest prefix match wins
  const winningRoute = matchedRoutes.reduce((longest, curr) => {
    return curr.maskLen > (longest?.maskLen ?? -1) ? curr : longest;
  }, matchedRoutes[0]);

  return (
    <div className={`bg-slate-900/90 rounded-3xl border border-white/[0.08] p-5 sm:p-6 shadow-2xl font-sans backdrop-blur-xl ${isEn ? 'text-left dir-ltr' : 'text-right dir-rtl'}`}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/[0.06] pb-4 mb-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
            <Compass className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-bold text-white">
              {isEn ? 'Router FIB Engine: Longest Prefix Match (LPM)' : 'محرك اتخاذ قرار الراوتر: قاعدة أطول قناع (Longest Prefix Match)'}
            </h3>
            <p className="text-xs text-slate-400">
              {isEn 
                ? 'Observe how the router selects the winning route when multiple prefixes match the target IP'
                : 'شاهد كيف يختار الراوتر المسار الفائز عندما يتطابق الـ IP مع أكثر من مسار في جدول التوجيه'}
            </p>
          </div>
        </div>

        {/* Quick Test Presets */}
        <div className="flex flex-wrap items-center gap-1.5 self-start sm:self-auto text-xs font-mono">
          {['10.1.2.140', '10.1.2.50', '10.1.8.1', '8.8.8.8'].map((ip) => (
            <button
              key={ip}
              onClick={() => setTestIp(ip)}
              className={`px-3 py-1.5 rounded-xl border transition-all cursor-pointer ${
                testIp === ip
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 font-bold'
                  : 'bg-slate-950 text-slate-400 border-white/[0.06] hover:text-slate-200'
              }`}
            >
              {ip}
            </button>
          ))}
        </div>
      </div>

      {/* Input Field */}
      <div className="p-4 rounded-2xl bg-slate-950 border border-white/[0.06] mb-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <label className="text-xs text-slate-300 font-bold">
            {isEn 
              ? 'Enter any Destination IP to test router FIB decision:'
              : 'أدخل أي عنوان IP للوجهة (Destination IP) واختبر قرار الراوتر:'}
          </label>
          <div className="dir-ltr text-left">
            <input
              type="text"
              value={testIp}
              onChange={(e) => setTestIp(e.target.value)}
              className="bg-slate-900 border border-white/[0.1] rounded-xl px-4 py-2 text-sm text-cyan-300 font-mono font-bold focus:outline-none focus:border-cyan-400"
            />
          </div>
        </div>
      </div>

      {/* Routing Table Display */}
      <div className="p-4 rounded-2xl bg-slate-950 border border-white/[0.06] mb-5 overflow-x-auto">
        <div className="text-xs font-bold text-slate-400 mb-2 flex items-center justify-between">
          <span>{isEn ? 'Cisco Routing Table (show ip route):' : 'جدول توجيه سيسكو (Cisco Routing Table - show ip route):'}</span>
          <span className="font-mono text-[11px] text-amber-400">Rule: Longest Prefix Length Wins</span>
        </div>

        <table className={`w-full text-xs font-mono ${isEn ? 'text-left dir-ltr' : 'text-right dir-rtl'}`}>
          <thead>
            <tr className="text-slate-500 border-b border-white/[0.04]">
              <th className="py-2 px-3">{isEn ? 'Protocol' : 'البروتوكول'}</th>
              <th className="py-2 px-3">{isEn ? 'Prefix / Mask' : 'الشبكة والقناع (Prefix)'}</th>
              <th className="py-2 px-3">[AD / Metric]</th>
              <th className="py-2 px-3">{isEn ? 'Next-Hop' : 'القفزة التالية (Next-Hop)'}</th>
              <th className="py-2 px-3">{isEn ? 'Out Interface' : 'المنفذ الخارجي'}</th>
              <th className="py-2 px-3">{isEn ? 'Match Status' : 'حالة المطابقة'}</th>
            </tr>
          </thead>
          <tbody>
            {ROUTING_TABLE.map((route) => {
              const isMatch = matchedRoutes.some(r => r.prefix === route.prefix && r.maskLen === route.maskLen);
              const isWinner = winningRoute?.prefix === route.prefix && winningRoute?.maskLen === route.maskLen;

              return (
                <tr
                  key={`${route.prefix}/${route.maskLen}`}
                  className={`border-b border-white/[0.02] transition-all ${
                    isWinner
                      ? 'bg-emerald-500/15 text-emerald-200 font-bold'
                      : isMatch
                        ? 'bg-amber-500/5 text-amber-300'
                        : 'text-slate-400 opacity-60'
                  }`}
                >
                  <td className="py-2.5 px-3">
                    <span className="px-2 py-0.5 rounded bg-white/[0.06] text-white">
                      {route.protocol} ({route.protocolName})
                    </span>
                  </td>
                  <td className="py-2.5 px-3 dir-ltr font-bold text-white">
                    {route.prefix}/{route.maskLen}
                  </td>
                  <td className="py-2.5 px-3 text-slate-400 dir-ltr">
                    [{route.ad}/{route.metric}]
                  </td>
                  <td className="py-2.5 px-3 text-cyan-300 dir-ltr">{route.nextHop}</td>
                  <td className="py-2.5 px-3 text-slate-300">{route.interfaceName}</td>
                  <td className="py-2.5 px-3 font-sans">
                    {isWinner ? (
                      <span className="px-2 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[11px] font-bold flex items-center gap-1 w-max">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        {isEn ? `Winning Route (Longest /${route.maskLen})` : `المسار الفائز (الأطول / ${route.maskLen})`}
                      </span>
                    ) : isMatch ? (
                      <span className="text-amber-400 text-[11px]">{isEn ? 'Matched (Shorter prefix)' : 'مطابق لكنه أقصر'}</span>
                    ) : (
                      <span className="text-slate-600 text-[11px]">{isEn ? 'No match' : 'غير مطابق'}</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Decision Summary */}
      {winningRoute && (
        <div className="p-4 sm:p-5 rounded-2xl bg-emerald-950/20 border border-emerald-500/30 text-emerald-300 text-xs sm:text-sm leading-relaxed">
          <h4 className="font-bold text-white text-base mb-1">
            {isEn ? `🎯 Routing Decision for (${testIp}):` : `🎯 نتيجة توجيه الحزمة لـ (${testIp}):`}
          </h4>
          <p className="text-slate-300">
            {isEn ? (
              <>
                The destination IP matched <strong className="text-amber-300 font-mono">{matchedRoutes.length}</strong> routes in the table. 
                Route <strong className="text-emerald-300 font-mono">{winningRoute.prefix}/{winningRoute.maskLen}</strong> wins because its prefix length is the longest and most specific (/{winningRoute.maskLen}). 
                The router will immediately switch the packet to <strong className="text-cyan-300 font-mono">{winningRoute.nextHop}</strong> via interface <strong className="text-white font-mono">{winningRoute.interfaceName}</strong>.
              </>
            ) : (
              <>
                تطابقت الحزمة مع <strong className="text-amber-300 font-mono">{matchedRoutes.length}</strong> مسارات في الجدول. 
                فاز المسار <strong className="text-emerald-300 font-mono">{winningRoute.prefix}/{winningRoute.maskLen}</strong> لأن طول قناع الشبكة هو الأطول والأكثر دقة (/{winningRoute.maskLen}). 
                سيقوم الراوتر بتمرير الحزمة فوراً إلى <strong className="text-cyan-300 font-mono">{winningRoute.nextHop}</strong> عبر المنفذ <strong className="text-white font-mono">{winningRoute.interfaceName}</strong>.
              </>
            )}
          </p>
        </div>
      )}
    </div>
  );
};
