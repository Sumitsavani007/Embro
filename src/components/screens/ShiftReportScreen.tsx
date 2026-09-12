import React, { useState } from 'react';
import {
  Download,
  Layers,
  Gauge,
  Clock,
  ArrowLeft,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { KpiCard } from '../common/KpiCard';
import { exportShiftReportToCsv } from '../../utils/exportCsv';

export const ShiftReportScreen: React.FC = () => {
  const { setCurrentRoute } = useApp();
  const [activeShiftTab, setActiveShiftTab] = useState<'Shift 1' | 'Shift 2' | 'Shift 3'>('Shift 1');

  const shiftKpis = {
    'Shift 1': {
      production: '2,16,450',
      efficiency: '86.2%',
      runtime: '28h 24m',
      stoptime: '4h 12m',
    },
    'Shift 2': {
      production: '2,32,100',
      efficiency: '89.4%',
      runtime: '30h 10m',
      stoptime: '2h 50m',
    },
    'Shift 3': {
      production: '1,78,900',
      efficiency: '82.5%',
      runtime: '24h 15m',
      stoptime: '6h 45m',
    },
  }[activeShiftTab];

  const shiftMachineData = [
    { machine: 'M1', production: 33450, runtime: '5h 12m', stoptime: '0h 48m', efficiency: 89 },
    { machine: 'M2', production: 28760, runtime: '4h 36m', stoptime: '0h 36m', efficiency: 86 },
    { machine: 'M3', production: 0, runtime: '0h 0m', stoptime: '2h 12m', efficiency: 0 },
    { machine: 'M4', production: 31220, runtime: '5h 48m', stoptime: '0h 43m', efficiency: 92 },
    { machine: 'M5', production: 27860, runtime: '5h 12m', stoptime: '0h 36m', efficiency: 85 },
    { machine: 'M6', production: 34100, runtime: '5h 24m', stoptime: '0h 18m', efficiency: 91 },
    { machine: 'M7', production: 32900, runtime: '5h 18m', stoptime: '0h 25m', efficiency: 88 },
    { machine: 'M8', production: 28160, runtime: '4h 50m', stoptime: '0h 40m', efficiency: 84 },
  ];

  const handleExport = () => {
    exportShiftReportToCsv(shiftMachineData, activeShiftTab);
  };

  return (
    <div className="space-y-5">
      {/* Header & Shift Selectors */}
      <div className="bg-white rounded-xl border border-slate-200/90 p-4 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setCurrentRoute('production-reports')}
            className="p-1.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-600 hover:bg-slate-100 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h2 className="text-base font-bold text-slate-900 tracking-tight">
              Shift Report
            </h2>
            <p className="text-xs text-slate-500 font-medium">
              Detailed shift-wise production log and efficiency audit
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <div className="flex items-center bg-slate-100 p-1 rounded-lg border border-slate-200">
            {(['Shift 1', 'Shift 2', 'Shift 3'] as const).map((s) => (
              <button
                key={s}
                onClick={() => setActiveShiftTab(s)}
                className={`px-3 py-1.5 rounded-md font-semibold transition-colors cursor-pointer ${
                  activeShiftTab === s
                    ? 'bg-white text-blue-600 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {s}
              </button>
            ))}
          </div>
          <button
            onClick={handleExport}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard
          title="Total Production"
          value={shiftKpis.production}
          subValue="Stitches Produced in Shift"
          icon={Layers}
          iconColor="text-blue-600"
          iconBg="bg-blue-50"
        />
        <KpiCard
          title="Avg. Efficiency"
          value={shiftKpis.efficiency}
          subValue="Quota Attainment Rate"
          icon={Gauge}
          iconColor="text-emerald-600"
          iconBg="bg-emerald-50"
        />
        <KpiCard
          title="Run Time"
          value={shiftKpis.runtime}
          subValue="Accumulated Production Time"
          icon={Clock}
          iconColor="text-indigo-600"
          iconBg="bg-indigo-50"
        />
        <KpiCard
          title="Stop Time"
          value={shiftKpis.stoptime}
          subValue="Maintenance & Thread Stops"
          icon={Clock}
          iconColor="text-rose-600"
          iconBg="bg-rose-50"
        />
      </div>

      {/* Shift Machine Table */}
      <div className="bg-white rounded-xl border border-slate-200/90 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-400 font-semibold text-[11px] uppercase">
                <th className="py-3 px-4">Machine No.</th>
                <th className="py-3 px-3">Production (Stitches)</th>
                <th className="py-3 px-3">Runtime</th>
                <th className="py-3 px-3">Stop Time</th>
                <th className="py-3 px-4">Efficiency</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700 font-medium">
              {shiftMachineData.map((row) => (
                <tr key={row.machine} className="hover:bg-slate-50/80">
                  <td className="py-3 px-4 font-bold text-slate-900">{row.machine}</td>
                  <td className="py-3 px-3 font-semibold tabular-nums text-slate-900">
                    {row.production > 0 ? row.production.toLocaleString() : '-'}
                  </td>
                  <td className="py-3 px-3 text-slate-600">{row.runtime}</td>
                  <td className="py-3 px-3 text-slate-500">{row.stoptime}</td>
                  <td className="py-3 px-4">
                    <span
                      className={`font-bold tabular-nums ${
                        row.efficiency >= 85
                          ? 'text-emerald-600'
                          : row.efficiency > 0
                          ? 'text-amber-600'
                          : 'text-slate-400'
                      }`}
                    >
                      {row.efficiency}%
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="bg-slate-50 font-bold text-slate-900 border-t-2 border-slate-200">
                <td className="py-3 px-4">Total ({activeShiftTab})</td>
                <td className="py-3 px-3 text-blue-600">{shiftKpis.production}</td>
                <td className="py-3 px-3">{shiftKpis.runtime}</td>
                <td className="py-3 px-3 text-rose-600">{shiftKpis.stoptime}</td>
                <td className="py-3 px-4 text-emerald-600">{shiftKpis.efficiency}</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  );
};
