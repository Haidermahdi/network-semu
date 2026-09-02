import React, { useState, useRef, useEffect } from 'react';
import { 
  Terminal, 
  Play, 
  RotateCcw, 
  HelpCircle, 
  Check, 
  Copy, 
  Server, 
  Layers, 
  Cpu,
  CornerDownLeft,
  BookOpen
} from 'lucide-react';
import { CISCO_CLI_RESPONSES } from '../data/ciscoCliDatabase';

interface CiscoCliTerminalProps {
  initialDevice?: string;
}

export const CiscoCliTerminal: React.FC<CiscoCliTerminalProps> = ({
  initialDevice = 'R1-CORE-ROUTER'
}) => {
  const [currentDevice, setCurrentDevice] = useState<string>(initialDevice);
  const [commandInput, setCommandInput] = useState('');
  const [history, setHistory] = useState<Array<{
    type: 'input' | 'output' | 'info';
    text: string;
    prompt?: string;
    explanation?: string;
  }>>([
    {
      type: 'info',
      text: `Cisco IOS Software, IOSv Software (VIOS-ADVENTERPRISEK9-M), Version 15.9(3)M3\nTechnical Support: http://www.cisco.com/techsupport\nType '?' or 'help' for a list of available verification and diagnostic commands.`
    }
  ]);

  const terminalEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const deviceList = Object.keys(CISCO_CLI_RESPONSES);
  const availableCommands = Object.keys(CISCO_CLI_RESPONSES[currentDevice] || {});

  const promptStr = `${currentDevice}#`;

  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history]);

  const executeCommand = (rawCmd: string) => {
    const cmd = rawCmd.trim();
    if (!cmd) return;

    if (cmd.toLowerCase() === 'clear') {
      setHistory([]);
      setCommandInput('');
      return;
    }

    if (cmd === '?' || cmd.toLowerCase() === 'help') {
      const helpList = availableCommands.map(c => `  ${c.padEnd(30, ' ')} -- Execute Cisco verification`).join('\n');
      setHistory(prev => [
        ...prev,
        { type: 'input', text: cmd, prompt: promptStr },
        { 
          type: 'output', 
          text: `Available Cisco IOS Commands for ${currentDevice}:\n${helpList}\n  clear                          -- Clear terminal screen` 
        }
      ]);
      setCommandInput('');
      return;
    }

    const matchedResponse = CISCO_CLI_RESPONSES[currentDevice]?.[cmd.toLowerCase()];

    if (matchedResponse) {
      setHistory(prev => [
        ...prev,
        { type: 'input', text: cmd, prompt: promptStr },
        { 
          type: 'output', 
          text: matchedResponse.output,
          explanation: matchedResponse.explanationAr 
        }
      ]);
    } else {
      setHistory(prev => [
        ...prev,
        { type: 'input', text: cmd, prompt: promptStr },
        { 
          type: 'output', 
          text: `% Invalid input detected at '^' marker.\nType '?' for supported Cisco show commands in this interactive simulator.` 
        }
      ]);
    }

    setCommandInput('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      executeCommand(commandInput);
    } else if (e.key === 'Tab') {
      e.preventDefault();
      // Auto-complete
      const match = availableCommands.find(c => c.startsWith(commandInput.toLowerCase()));
      if (match) {
        setCommandInput(match);
      }
    }
  };

  return (
    <div className="space-y-4">
      {/* Device Selector & Quick Command Bar */}
      <div className="p-3 bg-slate-900/90 rounded-2xl border border-slate-800 flex flex-wrap items-center justify-between gap-3 shadow-lg">
        {/* Device Switcher */}
        <div className="flex items-center gap-2">
          <Server className="w-4 h-4 text-cyan-400" />
          <span className="text-xs font-bold text-slate-300">اختر جهاز سيسكو:</span>
          <div className="flex gap-1.5">
            {deviceList.map(dev => (
              <button
                key={dev}
                onClick={() => {
                  setCurrentDevice(dev);
                  setHistory(prev => [
                    ...prev,
                    { type: 'info', text: `Switched active console session to ${dev}` }
                  ]);
                }}
                className={`px-3 py-1 rounded-xl text-xs font-mono font-bold transition-all ${
                  currentDevice === dev
                    ? 'bg-cyan-600 text-white shadow-md shadow-cyan-600/30'
                    : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800'
                }`}
              >
                {dev}
              </button>
            ))}
          </div>
        </div>

        {/* Preset Show Commands Quick-Buttons */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-[11px] text-slate-400 font-bold">أوامر سريعة:</span>
          {availableCommands.slice(0, 4).map(cmd => (
            <button
              key={cmd}
              onClick={() => executeCommand(cmd)}
              className="px-2.5 py-1 rounded-lg bg-slate-950 hover:bg-slate-800 text-amber-300 border border-slate-800 text-[11px] font-mono transition-colors"
            >
              {cmd}
            </button>
          ))}
        </div>
      </div>

      {/* Terminal Window */}
      <div 
        onClick={() => inputRef.current?.focus()}
        className="rounded-2xl bg-[#0b0f19] border border-slate-800 shadow-2xl overflow-hidden font-mono text-xs flex flex-col h-[520px]"
      >
        {/* Terminal Title Bar */}
        <div className="px-4 py-2.5 bg-slate-900 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex gap-1.5">
              <span className="w-3 h-3 rounded-full bg-rose-500/80 inline-block" />
              <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block" />
              <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block" />
            </div>
            <span className="text-slate-400 text-[11px] font-bold ml-2">
              Cisco IOS v15.9 CLI Console — {currentDevice} (SSH: 10.1.1.1)
            </span>
          </div>

          <button
            onClick={() => setHistory([])}
            title="مسح الشاشة"
            className="p-1 rounded bg-slate-800 text-slate-400 hover:text-slate-200"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Terminal Output Area */}
        <div className="flex-1 p-4 overflow-y-auto space-y-3 dir-ltr text-left select-text">
          {history.map((item, idx) => (
            <div key={idx} className="space-y-1">
              {item.type === 'input' && (
                <div className="flex items-center gap-2 text-emerald-400 font-bold">
                  <span>{item.prompt}</span>
                  <span className="text-white">{item.text}</span>
                </div>
              )}

              {item.type === 'output' && (
                <div className="space-y-2">
                  <pre className="text-slate-300 whitespace-pre-wrap font-mono leading-relaxed bg-slate-950/60 p-2.5 rounded-xl border border-slate-800/60">
                    {item.text}
                  </pre>
                  {item.explanation && (
                    <div className="p-2.5 rounded-xl bg-indigo-950/40 border border-indigo-500/30 text-indigo-200 text-xs font-sans dir-rtl text-right flex items-start gap-2">
                      <BookOpen className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                      <span>{item.explanation}</span>
                    </div>
                  )}
                </div>
              )}

              {item.type === 'info' && (
                <pre className="text-cyan-400/80 whitespace-pre-wrap text-[11px]">
                  {item.text}
                </pre>
              )}
            </div>
          ))}

          {/* Active Input Line */}
          <div className="flex items-center gap-2 text-emerald-400 font-bold pt-1">
            <span>{promptStr}</span>
            <input
              ref={inputRef}
              type="text"
              value={commandInput}
              onChange={(e) => setCommandInput(e.target.value)}
              onKeyDown={handleKeyDown}
              className="flex-1 bg-transparent border-none outline-none text-white font-mono text-xs focus:ring-0 p-0"
              placeholder="اكتب أمر سيسكو (مثال: show ip route) أو اضغط Tab للإكمال..."
              autoFocus
            />
            <button
              onClick={() => executeCommand(commandInput)}
              className="p-1 rounded bg-emerald-600/30 hover:bg-emerald-600/50 text-emerald-300"
            >
              <CornerDownLeft className="w-3.5 h-3.5" />
            </button>
          </div>

          <div ref={terminalEndRef} />
        </div>
      </div>
    </div>
  );
};
