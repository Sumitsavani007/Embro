import React, { useState } from 'react';
import {
  Calendar,
  Download,
  Layers,
  Gauge,
  Clock,
  ArrowUpRight,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { KpiCard } from '../common/KpiCard';
import { WEEKLY_PRODUCTION_DATA } from '../../data/mockData';
import { exportProductionReportToCsv } from '../../utils/exportCsv';

export const ProductionReportsScreen: React.FC = () => {
  const { machines, selectedFactory, setCurrentRoute } = useApp();
  const [dateRange] = useState('Apr 20, 2025 - Apr 26, 2025');
  const [shiftFilter, setShiftFilter] = useState('ALL');
  const [hoveredDayIdx, setHoveredDayIdx] = useState<number | null>(null);

  const handleExport = () => {
    exportProductionReportToCsv(machines, dateRange);
  };

  const maxVal = 600000;
  const chartW = 540;
  const chartH = 210;
  const padding = { top: 20, right: 20, bottom: 30, left: 45 };
  const innerW = chartW - padding.left - padding.right;
  const innerH = chartH - padding.top - padding.bottom;
  const barW = (innerW / WEEKLY_PRODUCTION_DATA.length) * 0.45;

  const getX = (idx: number) => padding.left + (idx + 0.5) * (innerW / WEEKLY_PRODUCTION_DATA.length);
  const getY = (val: number) => padding.top + innerH - (val / maxVal) * innerH;

  const targetLinePoints = WEEKLY_PRODUCTION_DATA.map((d, i) => `${getX(i)},${getY(d.target)}`).join(' ');

  return (
    <div className="space-y-5">
      {/* Filters & Export Header */}
      <div className="bg-white rounded-xl border border-slate-200/90 p-4 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-bold text-slate-900 tracking-tight">
            Production Report
          </h2>
          <p className="text-xs text-slate-500 font-medium">
            Aggregated factory metrics for {selectedFactory?.name || 'Surat Unit'}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 text-xs">
          {/* Shift Report Sub-tab trigger */}
          <button
            onClick={() => setCurrentRoute('shift-report')}
            className="px-3 py-2 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-lg font-semibold transition-colors flex items-center gap-1 cursor-pointer"
          >
            <span>Shift Breakdown Report</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>

          {/* Date Range Selector */}
          <div className="flex items-center gap-2 px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg font-semibold text-slate-700">
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            <span>{dateRange}</span>
          </div>

          {/* Shift Selector */}
          <select
            value={shiftFilter}
            onChange={(e) => setShiftFilter(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg font-semibold text-slate-700 cursor-pointer"
          >
            <option value="ALL">All Shifts</option>
            <option value="Shift A">Shift A (06:00 - 14:00)</option>
            <option value="Shift B">Shift B (14:00 - 22:00)</option>
            <option value="Shift C">Shift C (22:00 - 06:00)</option>
          </select>

          {/* Export button */}
          <button
            onClick={handleExport}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold flex items-center gap-1.5 shadow-xs shadow-blue-500/30 transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Top 4 KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard
          title="Total Production"
          value="5,48,320"
          subValue="Stitch Count (Weekly Total)"
          icon={Layers}
          iconColor="text-blue-600"
          iconBg="bg-blue-50"
        />
        <KpiCard
          title="Avg. Efficiency"
          value="87.6%"
          subValue="Factory Floor Overall"
          icon={Gauge}
          iconColor="text-emerald-600"
          iconBg="bg-emerald-50"
        />
        <KpiCard
          title="Total Run Time"
          value="70h 24m"
          subValue="Aggregate Active Spindle Hours"
          icon={Clock}
          iconColor="text-indigo-600"
          iconBg="bg-indigo-50"
        />
        <KpiCard
          title="Total Stop Time"
          value="13h 36m"
          subValue="Total Stoppage & Changeover"
          icon={Clock}
          iconColor="text-rose-600"
          iconBg="bg-rose-50"
        />
      </div>

      {/* Charts & Machine Table Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Production Trend (Apr 20 - Apr 26) */}
        <div className="lg:col-span-7 bg-white rounded-xl border border-slate-200/90 p-5 shadow-xs">
          <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-100">
            <div>
              <h3 className="text-sm font-bold text-slate-900 tracking-tight">
                Production Trend
              </h3>
              <p className="text-xs text-slate-400">
                Daily output stitches vs target line
              </p>
            </div>
            <div className="flex items-center gap-3 text-xs font-semibold text-slate-600">
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-xs bg-blue-600 inline-block" /> Production
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-0.5 border-t-2 border-dashed border-sky-400 inline-block" />{' '}
                Target
              </span>
            </div>
          </div>
          <div className="relative overflow-x-auto">
            <svg viewBox={`0 0 ${chartW} ${chartH}`} className="w-full h-auto max-h-[240px]">
              {/* Grid Lines */}
              {[0, 200000, 400000, 600000].map((t) => {
                const y = getY(t);
                return (
                  <g key={t}>
                    <line
                      x1={padding.left}
                      y1={y}
                      x2={chartW - padding.right}
                      y2={y}
                      stroke="#E2E8F0"
                      strokeDasharray="3 3"
                    />
                    <text
                      x={padding.left - 8}
                      y={y + 3}
                      textAnchor="end"
                      fontSize="10"
                      fill="#94A3B8"
                    >
                      {t === 0 ? '0' : `${t / 1000}k`}
                    </text>
                  </g>
                );
              })}

              {/* Bars */}
              {WEEKLY_PRODUCTION_DATA.map((d, i) => {
                const x = getX(i);
                const y = getY(d.stitches);
                const h = innerH - (y - padding.top);
                const isHovered = hoveredDayIdx === i;
                return (
                  <g
                    key={d.date}
                    className="cursor-pointer"
                    onMouseEnter={() => setHoveredDayIdx(i)}
                    onMouseLeave={() => setHoveredDayIdx(null)}
                  >
                    <rect
                      x={x - barW / 2}
                      y={y}
                      width={barW}
                      height={Math.max(2, h)}
                      rx="4"
                      fill={isHovered ? '#1D4ED8' : '#2563EB'}
                      className="transition-colors duration-150"
                    />
                    <text
                      x={x}
                      y={chartH - 8}
                      textAnchor="middle"
                      fontSize="10"
                      fill={isHovered ? '#0F172A' : '#64748B'}
                      fontWeight={isHovered ? '700' : '400'}
                    >
                      {d.date}
                    </text>
                  </g>
                );
              })}

              {/* Target Line */}
              <polyline
                points={targetLinePoints}
                fill="none"
                stroke="#0EA5E9"
                strokeWidth="2.5"
                strokeDasharray="4 4"
              />
              {WEEKLY_PRODUCTION_DATA.map((d, i) => (
                <circle
                  key={`pt-${i}`}
                  cx={getX(i)}
                  cy={getY(d.target)}
                  r="3.5"
                  fill="#0EA5E9"
                  stroke="#FFFFFF"
                  strokeWidth="1.5"
                />
              ))}
            </svg>
            {hoveredDayIdx !== null && (
              <div
                className="absolute top-2 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-xs px-3 py-1.5 rounded-lg shadow-md pointer-events-none"
              >
                <strong>{WEEKLY_PRODUCTION_DATA[hoveredDayIdx].date}: </strong>
                <span>{WEEKLY_PRODUCTION_DATA[hoveredDayIdx].stitches.toLocaleString()} stitches</span>
                <span className="text-emerald-400 ml-2">
                  ({WEEKLY_PRODUCTION_DATA[hoveredDayIdx].efficiency}% Eff)
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Machine Wise Production Table */}
        <div className="lg:col-span-5 bg-white rounded-xl border border-slate-200/90 p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-900 tracking-tight">
                Machine Wise Production
              </h3>
              <span className="text-xs text-slate-400 font-medium">Shift Total</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-400 font-semibold text-[10px] uppercase">
                    <th className="py-2 pr-2">Machine No.</th>
                    <th className="py-2 px-2">Production</th>
                    <th className="py-2 pl-2 text-right">Efficiency</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700 font-medium">
                  {machines.slice(0, 8).map((m) => (
                    <tr key={m.id} className="hover:bg-slate-50">
                      <td className="py-2 pr-2 font-bold text-slate-900">
                        {m.machineNumber}
                      </td>
                      <td className="py-2 px-2 tabular-nums">
                        {m.stitchCount > 0 ? m.stitchCount.toLocaleString() : '-'}
                      </td>
                      <td className="py-2 pl-2 text-right">
                        <span
                          className={`font-bold tabular-nums ${
                            m.efficiency >= 85
                              ? 'text-emerald-600'
                              : m.efficiency > 0
                              ? 'text-amber-600'
                              : 'text-slate-400'
                          }`}
                        >
                          {m.efficiency > 0 ? `${m.efficiency}%` : '0%'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <div className="pt-3 mt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-slate-800">
            <span>Total Stitch Output</span>
            <span className="text-blue-600 text-sm font-extrabold">5,48,320</span>
          </div>
        </div>
      </div>
    </div>
  );
};
