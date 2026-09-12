import React, { useState } from 'react';
import {
  AlertOctagon,
  BarChart3,
  TrendingDown,
  Clock,
  Gauge,
  ShieldCheck,
  Zap,
} from 'lucide-react';
import { KpiCard } from '../common/KpiCard';

export const DowntimeAnalyticsScreen: React.FC = () => {
  // Downtime categories sorted by minutes lost (Pareto Analysis)
  const [downtimeData] = useState([
    { reason: 'Thread & Bobbin Breaks', minutes: 340, percent: 41.5, cumulative: 41.5, occurrences: 48 },
    { reason: 'Needle Snags & Deflection', minutes: 165, percent: 20.1, cumulative: 61.6, occurrences: 19 },
    { reason: 'Job & Frame Changeover', minutes: 130, percent: 15.8, cumulative: 77.4, occurrences: 8 },
    { reason: 'Preventive Hook Oiling', minutes: 95, percent: 11.6, cumulative: 89.0, occurrences: 16 },
    { reason: 'Fabric Framing Lag', minutes: 55, percent: 6.7, cumulative: 95.7, occurrences: 12 },
    { reason: 'Network Controller Drop', minutes: 35, percent: 4.3, cumulative: 100.0, occurrences: 3 },
  ]);

  // Overall Equipment Effectiveness (OEE) components
  const availability = 85.2; // 85.2% uptime
  const performance = 92.4; // 92.4% speed efficiency
  const quality = 98.7; // 98.7% first-pass yield
  const oee = ((availability * performance * quality) / 10000).toFixed(1);

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="bg-white rounded-xl border border-slate-200/90 p-4 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-bold text-slate-900 tracking-tight">
            Downtime Pareto Analytics & OEE Performance
          </h2>
          <p className="text-xs text-slate-500 font-medium">
            80/20 root-cause Pareto classification, lost production hours, and world-class OEE metrics
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="px-3 py-1.5 bg-blue-50 text-blue-700 font-bold rounded-lg border border-blue-200">
            Current Floor OEE: {oee}% (World Class &gt; 85%)
          </span>
        </div>
      </div>

      {/* Top OEE Pillar Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <KpiCard
          title="Overall OEE"
          value={`${oee}%`}
          subValue="Availability × Perf × Quality"
          icon={Gauge}
          iconColor="text-blue-600"
          iconBg="bg-blue-50"
        />
        <KpiCard
          title="Availability (A)"
          value={`${availability}%`}
          subValue="Active Runtime / Planned Time"
          icon={Clock}
          iconColor="text-emerald-600"
          iconBg="bg-emerald-50"
        />
        <KpiCard
          title="Performance (P)"
          value={`${performance}%`}
          subValue="738 SPM avg / 800 SPM standard"
          icon={Zap}
          iconColor="text-indigo-600"
          iconBg="bg-indigo-50"
        />
        <KpiCard
          title="Quality Yield (Q)"
          value={`${quality}%`}
          subValue="Good Stitches / Total Stitches"
          icon={ShieldCheck}
          iconColor="text-teal-600"
          iconBg="bg-teal-50"
        />
      </div>

      {/* Pareto 80/20 Chart & Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left 7 cols: Pareto Bars + Cumulative 80% line */}
        <div className="lg:col-span-7 bg-white rounded-xl border border-slate-200/90 p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-sm font-bold text-slate-900 tracking-tight">
                Pareto Stoppage Minutes (80/20 Rule)
              </h3>
              <p className="text-xs text-slate-400">
                Top 2 causes account for 61.6% of all lost spindle capacity
              </p>
            </div>
            <div className="flex items-center gap-3 text-xs font-semibold text-slate-600">
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-xs bg-rose-500 inline-block" /> Lost Mins
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-0.5 border-t-2 border-dashed border-blue-600 inline-block" />{' '}
                Cumulative %
              </span>
            </div>
          </div>

          {/* SVG Pareto chart */}
          <div className="overflow-x-auto">
            <svg viewBox="0 0 540 220" className="w-full h-auto max-h-[240px]">
              {/* Grid */}
              {[0, 100, 200, 300, 400].map((val) => {
                const y = 190 - (val / 400) * 160;
                return (
                  <g key={val}>
                    <line x1="45" y1={y} x2="510" y2={y} stroke="#E2E8F0" strokeDasharray="3 3" />
                    <text x="38" y={y + 3} textAnchor="end" fontSize="10" fill="#94A3B8">
                      {val}m
                    </text>
                  </g>
                );
              })}

              {/* 80% threshold reference line */}
              <line
                x1="45"
                y1={190 - 0.8 * 160}
                x2="510"
                y2={190 - 0.8 * 160}
                stroke="#10B981"
                strokeWidth="1"
                strokeDasharray="4 2"
              />
              <text x="515" y={190 - 0.8 * 160 + 3} fontSize="9" fill="#10B981" fontWeight="bold">
                80% Line
              </text>

              {/* Bars */}
              {downtimeData.map((d, i) => {
                const barWidth = 42;
                const x = 70 + i * 75;
                const barHeight = (d.minutes / 400) * 160;
                const y = 190 - barHeight;
                return (
                  <g key={d.reason} className="cursor-pointer">
                    <rect
                      x={x - barWidth / 2}
                      y={y}
                      width={barWidth}
                      height={barHeight}
                      rx="4"
                      fill={i < 2 ? '#EF4444' : '#F59E0B'}
                    />
                    <text
                      x={x}
                      y={y - 6}
                      textAnchor="middle"
                      fontSize="10"
                      fontWeight="bold"
                      fill="#1E293B"
                    >
                      {d.minutes}m
                    </text>
                    <text
                      x={x}
                      y="205"
                      textAnchor="middle"
                      fontSize="9"
                      fill="#64748B"
                      fontWeight="500"
                    >
                      {d.reason.split(' ')[0]}
                    </text>
                  </g>
                );
              })}

              {/* Cumulative line */}
              <polyline
                points={downtimeData
                  .map((d, i) => `${70 + i * 75},${190 - (d.cumulative / 100) * 160}`)
                  .join(' ')}
                fill="none"
                stroke="#2563EB"
                strokeWidth="2.5"
              />
              {downtimeData.map((d, i) => (
                <circle
                  key={`c-${i}`}
                  cx={70 + i * 75}
                  cy={190 - (d.cumulative / 100) * 160}
                  r="3.5"
                  fill="#2563EB"
                  stroke="#FFFFFF"
                  strokeWidth="1.5"
                />
              ))}
            </svg>
          </div>
        </div>

        {/* Right 5 cols: Table with action items */}
        <div className="lg:col-span-5 bg-white rounded-xl border border-slate-200/90 p-5 shadow-xs space-y-3 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-900 tracking-tight">
                Loss Categories & Countermeasures
              </h3>
              <span className="text-xs text-slate-400">Target reduction</span>
            </div>

            <div className="space-y-2 pt-2">
              {downtimeData.slice(0, 4).map((d) => (
                <div
                  key={d.reason}
                  className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between text-xs"
                >
                  <div>
                    <span className="font-bold text-slate-800 block">{d.reason}</span>
                    <span className="text-[11px] text-slate-500">
                      {d.occurrences} incidents ({d.percent}% of loss)
                    </span>
                  </div>
                  <span className="font-mono font-bold text-rose-600 text-sm">
                    {d.minutes} mins
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="p-3.5 bg-emerald-50 rounded-xl border border-emerald-200 text-xs text-emerald-900">
            <strong className="font-bold block mb-1">Recommended TPM Action:</strong>
            <p className="text-emerald-800">
              Addressing thread tension checks on Line A could recover <strong>2.8 machine hours</strong> per shift, lifting factory output by ~22,000 stitches daily.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
