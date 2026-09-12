import React, { useState } from 'react';
import {
  Grid,
  Power,
  PowerOff,
  AlertTriangle,
  Sliders,
  CheckCircle2,
  Cpu,
  RefreshCw,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const HeadIsolationScreen: React.FC = () => {
  const { machines } = useApp();
  const [selectedMachineNum, setSelectedMachineNum] = useState('M1');

  // Simulated state of 20 heads for the selected machine
  const [heads, setHeads] = useState<
    { headNumber: number; enabled: boolean; tensionGrams: number; status: 'NORMAL' | 'SNAGGED' | 'DISABLED' }[]
  >(() =>
    Array.from({ length: 20 }, (_, i) => ({
      headNumber: i + 1,
      enabled: i !== 3 && i !== 14, // Head 4 and 15 disabled for special border frame
      tensionGrams: 110 + Math.floor(Math.sin(i) * 15),
      status: i === 3 || i === 14 ? 'DISABLED' : i === 7 ? 'SNAGGED' : 'NORMAL',
    }))
  );

  const toggleHead = (headNum: number) => {
    setHeads((prev) =>
      prev.map((h) => {
        if (h.headNumber === headNum) {
          const nextEnabled = !h.enabled;
          return {
            ...h,
            enabled: nextEnabled,
            status: nextEnabled ? 'NORMAL' : 'DISABLED',
          };
        }
        return h;
      })
    );
  };

  const enableAll = () => {
    setHeads((prev) => prev.map((h) => ({ ...h, enabled: true, status: 'NORMAL' })));
  };

  const isolateAlternate = () => {
    // Alternate head embroidery (standard in large garment/border repeats)
    setHeads((prev) =>
      prev.map((h) => ({
        ...h,
        enabled: h.headNumber % 2 !== 0,
        status: h.headNumber % 2 !== 0 ? 'NORMAL' : 'DISABLED',
      }))
    );
  };

  const activeCount = heads.filter((h) => h.enabled).length;

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="bg-white rounded-xl border border-slate-200/90 p-4 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-bold text-slate-900 tracking-tight">
            Multi-Head Solenoid Isolation Matrix
          </h2>
          <p className="text-xs text-slate-500 font-medium">
            Electronically engage or isolate individual embroidery heads for custom spacing, border repeats, or needle repairs
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 text-xs">
          <select
            value={selectedMachineNum}
            onChange={(e) => setSelectedMachineNum(e.target.value)}
            className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg font-bold text-slate-800 cursor-pointer"
          >
            {machines.map((m) => (
              <option key={m.id} value={m.machineNumber}>
                {m.machineNumber} - {m.name} ({m.headCount} Heads)
              </option>
            ))}
          </select>

          <button
            onClick={isolateAlternate}
            className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-semibold transition-colors cursor-pointer"
          >
            Alternate Heads (50% Spacing)
          </button>

          <button
            onClick={enableAll}
            className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 rounded-lg font-semibold transition-colors cursor-pointer"
          >
            Enable All Heads
          </button>
        </div>
      </div>

      {/* Summary Chips */}
      <div className="flex items-center gap-3 text-xs">
        <span className="font-semibold text-slate-700">
          Active Heads: <strong className="text-emerald-600">{activeCount}</strong> / {heads.length}
        </span>
        <span className="text-slate-400">|</span>
        <span className="font-semibold text-slate-700">
          Isolated / Solenoid Locked: <strong className="text-rose-600">{heads.length - activeCount}</strong>
        </span>
        <span className="text-slate-400">|</span>
        <span className="text-slate-500">Target Thread Tension: 110g – 130g</span>
      </div>

      {/* 20-Head Matrix Interactive Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-10 gap-3">
        {heads.map((head) => {
          const isEnabled = head.enabled;
          const isWarning = head.status === 'SNAGGED';

          return (
            <div
              key={head.headNumber}
              onClick={() => toggleHead(head.headNumber)}
              className={`p-3.5 rounded-xl border text-center transition-all cursor-pointer relative group flex flex-col justify-between ${
                isEnabled
                  ? isWarning
                    ? 'bg-amber-50/70 border-amber-300 shadow-xs'
                    : 'bg-white border-emerald-300 shadow-xs hover:border-emerald-500'
                  : 'bg-slate-100/80 border-slate-200 opacity-60 hover:opacity-100'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[10px] font-mono font-bold text-slate-400">
                    H#{head.headNumber}
                  </span>
                  {isEnabled ? (
                    <Power className={`w-3.5 h-3.5 ${isWarning ? 'text-amber-500' : 'text-emerald-500'}`} />
                  ) : (
                    <PowerOff className="w-3.5 h-3.5 text-slate-400" />
                  )}
                </div>

                <span
                  className={`text-base font-black tracking-tight block ${
                    isEnabled ? 'text-slate-900' : 'text-slate-500'
                  }`}
                >
                  Head {head.headNumber}
                </span>

                <div className="mt-2 py-1 bg-slate-50 rounded border border-slate-100 text-[10px] font-mono">
                  <span className="text-slate-400 block text-[9px]">Tension</span>
                  <span
                    className={`font-bold ${
                      head.tensionGrams > 130 || head.tensionGrams < 95
                        ? 'text-rose-600'
                        : 'text-slate-700'
                    }`}
                  >
                    {isEnabled ? `${head.tensionGrams}g` : '0g'}
                  </span>
                </div>
              </div>

              <div className="mt-2 pt-1 border-t border-slate-100">
                <span
                  className={`text-[9px] font-bold uppercase tracking-wider block ${
                    isEnabled
                      ? isWarning
                        ? 'text-amber-700'
                        : 'text-emerald-700'
                      : 'text-slate-400'
                  }`}
                >
                  {isEnabled ? (isWarning ? 'Check Tension' : 'Active') : 'Isolated'}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Operator Safety Notice */}
      <div className="p-4 bg-blue-50/60 rounded-xl border border-blue-200/80 flex items-start gap-3 text-xs text-blue-900">
        <Cpu className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
        <div>
          <h4 className="font-bold mb-0.5">Automated Electronic Solenoid Interlock</h4>
          <p className="text-blue-800/80">
            Toggling head isolation instantly engages the magnetic solenoid clutch on {selectedMachineNum}. The jump bar prevents needle penetration on isolated heads without mechanical lever disengagement.
          </p>
        </div>
      </div>
    </div>
  );
};
