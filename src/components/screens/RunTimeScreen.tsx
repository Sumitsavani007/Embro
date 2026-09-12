import React from 'react';
import {
  Play,
  Square,
  Percent,
  Calendar,
  Download,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { KpiCard } from '../common/KpiCard';
import { StatusBadge } from '../common/StatusBadge';
import { exportRunTimeToCsv } from '../../utils/exportCsv';

export const RunTimeScreen: React.FC = () => {
  const { setCurrentRoute } = useApp();

  const runtimeRecords = [
    { machine: 'M1', runtime: '5h 12m', stoptime: '0h 18m', runningPercent: 95, status: 'RUNNING' as const },
    { machine: 'M2', runtime: '4h 36m', stoptime: '0h 24m', runningPercent: 92, status: 'RUNNING' as const },
    { machine: 'M3', runtime: '0h 0m', stoptime: '2h 48m', runningPercent: 0, status: 'STOPPED' as const },
    { machine: 'M4', runtime: '6h 02m', stoptime: '0h 12m', runningPercent: 98, status: 'RUNNING' as const },
    { machine: 'M5', runtime: '4h 16m', stoptime: '0h 42m', runningPercent: 86, status: 'RUNNING' as const },
    { machine: 'M6', runtime: '5h 24m', stoptime: '0h 18m', runningPercent: 95, status: 'RUNNING' as const },
    { machine: 'M7', runtime: '1h 48m', stoptime: '1h 12m', runningPercent: 60, status: 'RUNNING' as const },
    { machine: 'M8', runtime: '0h 0m', stoptime: '5h 30m', runningPercent: 0, status: 'OFFLINE' as const },
  ];

  const handleExport = () => {
    exportRunTimeToCsv(runtimeRecords);
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="bg-white rounded-xl border border-slate-200/90 p-4 shadow-xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-bold text-slate-900 tracking-tight">
            Run Time / Stop Time
          </h2>
          <p className="text-xs text-slate-500 font-medium">
            Active spindle utilization vs stoppage periods
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <div className="flex items-center gap-2 px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg font-semibold text-slate-700">
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            <span>Apr 20, 2025 - Apr 26, 2025</span>
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

      {/* Top 3 KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <KpiCard
          title="Total Run Time"
          value="70h 24m"
          subValue="Active Spindle In-Motion Time"
          icon={Play}
          iconColor="text-emerald-600"
          iconBg="bg-emerald-50"
        />
        <KpiCard
          title="Total Stop Time"
          value="13h 36m"
          subValue="Cumulative Pauses & Breaks"
          icon={Square}
          iconColor="text-rose-600"
          iconBg="bg-rose-50"
          onClick={() => setCurrentRoute('stop-time')}
        />
        <KpiCard
          title="Running %"
          value="83.7%"
          subValue="Floor Overall Utilization"
          icon={Percent}
          iconColor="text-blue-600"
          iconBg="bg-blue-50"
        />
      </div>

      {/* Machine Run Time Table */}
      <div className="bg-white rounded-xl border border-slate-200/90 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-400 font-semibold text-[11px] uppercase">
                <th className="py-3 px-4">Machine No.</th>
                <th className="py-3 px-3">Run Time</th>
                <th className="py-3 px-3">Stop Time</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-4">Running %</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700 font-medium">
              {runtimeRecords.map((m) => (
                <tr key={m.machine} className="hover:bg-slate-50">
                  <td className="py-3.5 px-4 font-bold text-slate-900">{m.machine}</td>
                  <td className="py-3.5 px-3 font-semibold text-emerald-700">{m.runtime}</td>
                  <td className="py-3.5 px-3 text-rose-600 font-semibold">{m.stoptime}</td>
                  <td className="py-3.5 px-3">
                    <StatusBadge status={m.status} size="xs" />
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-3">
                      <div className="flex-1 max-w-[200px] bg-slate-100 rounded-full h-2.5 overflow-hidden">
                        <div
                          className={`h-full rounded-full ${
                            m.runningPercent >= 80
                              ? 'bg-blue-600'
                              : m.runningPercent > 0
                              ? 'bg-amber-500'
                              : 'bg-slate-200'
                          }`}
                          style={{ width: `${m.runningPercent}%` }}
                        />
                      </div>
                      <span className="font-bold tabular-nums text-slate-800 text-xs min-w-[36px]">
                        {m.runningPercent}%
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
