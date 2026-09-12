import React from 'react';
import {
  Square,
  AlertTriangle,
  Clock,
  PieChart,
  Calendar,
  AlertOctagon,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { KpiCard } from '../common/KpiCard';
import { DowntimeDonutChart } from '../charts/DowntimeDonutChart';
import { DOWNTIME_REASONS } from '../../data/mockData';

export const StopTimeScreen: React.FC = () => {
  const { setCurrentRoute } = useApp();

  const stoppageEvents = [
    { machine: 'M3', duration: '2h 48m', reason: 'Thread Breakage (Head 2)', time: '12:32 PM', status: 'Ongoing' },
    { machine: 'M4', duration: '1h 52m', reason: 'Bobbin Empty (Line B)', time: '12:45 PM', status: 'Resolved' },
    { machine: 'M8', duration: '5h 30m', reason: 'Network Controller Disconnected', time: '11:50 AM', status: 'Offline' },
    { machine: 'M5', duration: '0h 42m', reason: 'Job Setup: Jacket_Front', time: '07:30 AM', status: 'Resolved' },
    { machine: 'M2', duration: '0h 24m', reason: 'Needle Eye Cleaning', time: '08:15 AM', status: 'Resolved' },
  ];

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="bg-white rounded-xl border border-slate-200/90 p-4 shadow-xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-bold text-slate-900 tracking-tight">
            Stop Time & Downtime Analysis
          </h2>
          <p className="text-xs text-slate-500 font-medium">
            Root-cause breakdown and stoppage duration diagnostics
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <div className="flex items-center gap-2 px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg font-semibold text-slate-700">
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            <span>Apr 20, 2025</span>
          </div>
          <button
            onClick={() => setCurrentRoute('thread-breakage')}
            className="px-3 py-2 bg-rose-50 text-rose-700 hover:bg-rose-100 rounded-lg font-semibold transition-colors cursor-pointer"
          >
            Thread Breakage Log
          </button>
        </div>
      </div>

      {/* Top KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <KpiCard
          title="Total Stop Time"
          value="13h 36m"
          subValue="Across All Active Frames"
          icon={Square}
          iconColor="text-rose-600"
          iconBg="bg-rose-50"
        />
        <KpiCard
          title="Average Stop Time"
          value="1h 08m"
          subValue="Per Machine Average"
          icon={Clock}
          iconColor="text-amber-600"
          iconBg="bg-amber-50"
        />
        <KpiCard
          title="Downtime %"
          value="16.3%"
          subValue="Lost Floor Capacity"
          icon={AlertOctagon}
          iconColor="text-rose-600"
          iconBg="bg-rose-50"
        />
        <KpiCard
          title="Primary Cause"
          value="Thread Break"
          subValue="42% of all stoppage events"
          icon={AlertTriangle}
          iconColor="text-indigo-600"
          iconBg="bg-indigo-50"
          onClick={() => setCurrentRoute('thread-breakage')}
        />
      </div>

      {/* Donut Chart & Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        <div className="lg:col-span-6 bg-white rounded-xl border border-slate-200/90 p-5 shadow-xs">
          <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-100">
            <div>
              <h3 className="text-sm font-bold text-slate-900 tracking-tight">
                Downtime Category Distribution
              </h3>
              <p className="text-xs text-slate-400">
                Categorized reasons for non-productive hours
              </p>
            </div>
            <PieChart className="w-4 h-4 text-slate-400" />
          </div>
          <DowntimeDonutChart data={DOWNTIME_REASONS} />
        </div>

        {/* Recent Stoppages Table */}
        <div className="lg:col-span-6 bg-white rounded-xl border border-slate-200/90 p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-900 tracking-tight">
                Recent Stoppage Events
              </h3>
              <span className="text-xs text-slate-400">Latest records</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-400 font-semibold text-[10px] uppercase">
                    <th className="py-2">Machine</th>
                    <th className="py-2">Duration</th>
                    <th className="py-2">Reason</th>
                    <th className="py-2">Time</th>
                    <th className="py-2 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {stoppageEvents.map((ev, idx) => (
                    <tr key={idx} className="hover:bg-slate-50">
                      <td className="py-2.5 font-bold text-slate-900">{ev.machine}</td>
                      <td className="py-2.5 font-semibold text-rose-600">{ev.duration}</td>
                      <td className="py-2.5 text-slate-700">{ev.reason}</td>
                      <td className="py-2.5 font-mono text-slate-400">{ev.time}</td>
                      <td className="py-2.5 text-right">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                            ev.status === 'Ongoing'
                              ? 'bg-rose-50 text-rose-700'
                              : ev.status === 'Offline'
                              ? 'bg-slate-100 text-slate-600'
                              : 'bg-emerald-50 text-emerald-700'
                          }`}
                        >
                          {ev.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <div className="pt-3 border-t border-slate-100 text-center">
            <button
              onClick={() => setCurrentRoute('timeline')}
              className="text-xs text-blue-600 font-semibold hover:text-blue-700 cursor-pointer"
            >
              View Complete Stop Audit in Event Timeline &rarr;
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
