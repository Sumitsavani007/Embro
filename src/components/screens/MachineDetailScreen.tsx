import React, { useState } from 'react';
import {
  ArrowLeft,
  Play,
  Pause,
  Thermometer,
  Gauge,
  Clock,
  Layers,
  CheckCircle2,
  Scissors,
  Grid,
  BarChart3,
  Square,
  Clock3,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { StatusBadge } from '../common/StatusBadge';
import { TrendLineChart, TrendDataPoint } from '../charts/TrendLineChart';

export const MachineDetailScreen: React.FC = () => {
  const {
    machines,
    selectedMachineId,
    setCurrentRoute,
    updateMachine,
    logBreakage,
    timelineEvents,
  } = useApp();

  const [activeTab, setActiveTab] = useState<
    'Production' | 'Stitch Count' | 'Speed' | 'Temperature' | 'Jobs' | 'Timeline'
  >('Production');

  const machine =
    machines.find((m) => m.id === selectedMachineId) || machines[0] || null;

  if (!machine) {
    return (
      <div className="p-8 text-center bg-white rounded-xl border border-slate-200">
        <p className="text-slate-500">Machine not found.</p>
        <button
          onClick={() => setCurrentRoute('live-status')}
          className="mt-3 px-4 py-2 bg-blue-600 text-white rounded-lg text-xs cursor-pointer"
        >
          Back to Machines
        </button>
      </div>
    );
  }

  // Simulated telemetry curves for this machine
  const productionTelemetry: TrendDataPoint[] = [
    { label: '8 AM', actual: 18000, target: 20000 },
    { label: '10 AM', actual: 42000, target: 40000 },
    { label: '12 PM', actual: 56000, target: 60000 },
    { label: '2 PM', actual: 78000, target: 75000 },
    { label: '4 PM', actual: 95000, target: 90000 },
    { label: '6 PM', actual: 112000, target: 105000 },
  ];

  const speedTelemetry: TrendDataPoint[] = [
    { label: '08:00', actual: 750, target: 800 },
    { label: '09:00', actual: 820, target: 800 },
    { label: '10:00', actual: 815, target: 800 },
    { label: '11:00', actual: 0, target: 800 },
    { label: '12:00', actual: 830, target: 800 },
    { label: '13:00', actual: 820, target: 800 },
  ];

  const tempTelemetry: TrendDataPoint[] = [
    { label: 'H1', actual: 38.5, target: 45 },
    { label: 'H2', actual: 39.1, target: 45 },
    { label: 'H3', actual: 40.2, target: 45 },
    { label: 'H4', actual: 38.8, target: 45 },
    { label: 'H5', actual: 41.5, target: 45 },
    { label: 'H6', actual: 39.7, target: 45 },
    { label: 'H7', actual: 38.9, target: 45 },
    { label: 'H8', actual: 40.4, target: 45 },
  ];

  const recentJobs = [
    {
      startTime: '12:20 PM',
      designName: 'Logo_01',
      stitchCount: 8320,
      status: 'Completed',
    },
    {
      startTime: '11:10 AM',
      designName: 'Cap_02',
      stitchCount: 7880,
      status: 'Completed',
    },
    {
      startTime: '10:05 AM',
      designName: 'Cap_01',
      stitchCount: 6420,
      status: 'Completed',
    },
    {
      startTime: '08:45 AM',
      designName: 'Polo_Emblem_09',
      stitchCount: 9150,
      status: 'Completed',
    },
  ];

  const isRunning = machine.status === 'RUNNING';

  const handleToggleState = () => {
    if (isRunning) {
      updateMachine(machine.id, {
        status: 'STOPPED',
        speed: 0,
      });
    } else {
      updateMachine(machine.id, {
        status: 'RUNNING',
        speed: 800,
      });
    }
  };

  const machineEvents = timelineEvents.filter((e) => e.machineNumber === machine.machineNumber);

  return (
    <div className="space-y-5">
      {/* Top Header Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => setCurrentRoute('live-status')}
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors shadow-xs cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5 text-slate-500" />
          <span>Back to Live Monitoring</span>
        </button>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setCurrentRoute('head-matrix')}
            className="px-3 py-1.5 rounded-lg bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border border-indigo-200 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Grid className="w-3.5 h-3.5" />
            Head Isolation
          </button>
          <button
            onClick={handleToggleState}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
              isRunning
                ? 'bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200'
                : 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-xs'
            }`}
          >
            {isRunning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            <span>{isRunning ? 'Emergency Stop' : 'Resume Machine'}</span>
          </button>
        </div>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-3 shadow-xs">
        <div className="mb-2 flex items-center justify-between">
          <div><p className="text-xs font-bold uppercase tracking-wide text-slate-500">Machine workspace</p><p className="text-[11px] text-slate-400">All operational data for {machine.machineNumber}</p></div>
          <span className="rounded-full bg-emerald-50 px-2 py-1 text-[10px] font-bold text-emerald-700">Selected machine</span>
        </div>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {([
            ['production-reports', 'Production', BarChart3],
            ['runtime', 'Runtime', Play],
            ['stop-time', 'Stop time', Square],
            ['timeline', 'Timeline', Clock3],
          ] as const).map(([route, label, Icon]) => <button key={route} onClick={() => setCurrentRoute(route)} className="flex min-h-10 items-center justify-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 px-2 py-2 text-xs font-semibold text-slate-700 hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700"><Icon className="h-3.5 w-3.5" />{label}</button>)}
        </div>
      </div>

      {/* Main Grid: Left Machine Profile Card + Right Tabs & Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left Column: Machine Card */}
        <div className="lg:col-span-4 bg-white rounded-xl border border-slate-200/90 p-5 shadow-xs flex flex-col justify-between">
          <div>
            {/* Machine Graphic & Title */}
            <div className="flex items-center gap-4 mb-4 pb-4 border-b border-slate-100">
              <div className="w-20 h-20 bg-slate-100 rounded-xl border border-slate-200 p-2 flex items-center justify-center shrink-0">
                <svg
                  className="w-14 h-14 text-slate-700"
                  viewBox="0 0 64 64"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.2"
                >
                  <rect x="8" y="38" width="48" height="18" rx="2" fill="#E2E8F0" />
                  <path d="M14 38V18a4 4 0 0 1 4-4h28a4 4 0 0 1 4 4v20" />
                  <circle cx="32" cy="24" r="5" fill="#3B82F6" stroke="none" />
                  <path d="M32 29v9" stroke="#1E293B" strokeWidth="2" />
                  <line x1="26" y1="46" x2="38" y2="46" stroke="#2563EB" strokeWidth="3" />
                  <circle cx="16" cy="14" r="3" fill="#10B981" />
                  <circle cx="24" cy="14" r="3" fill="#F59E0B" />
                  <circle cx="40" cy="14" r="3" fill="#EF4444" />
                  <circle cx="48" cy="14" r="3" fill="#3B82F6" />
                </svg>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
                    {machine.machineNumber}
                  </h2>
                  <StatusBadge status={machine.status} size="xs" />
                </div>
                <p className="text-xs font-semibold text-slate-700 mt-0.5">{machine.currentJob}</p>
                <p className="text-[11px] text-slate-400 font-medium">
                  {machine.brand} {machine.model}
                </p>
              </div>
            </div>

            {/* Telemetry Metrics List */}
            <div className="space-y-2.5 text-xs">
              <div className="flex items-center justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-400 font-medium">Head / Needle</span>
                <span className="font-bold text-slate-800">
                  {machine.headCount} Heads / {machine.needleCount} Needles
                </span>
              </div>
              <div className="flex items-center justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-400 font-medium flex items-center gap-1.5">
                  <Gauge className="w-3.5 h-3.5 text-blue-500" />
                  Current Speed
                </span>
                <span className="font-extrabold text-slate-900 text-sm tabular-nums">
                  {machine.speed} SPM
                </span>
              </div>
              <div className="flex items-center justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-400 font-medium flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-indigo-500" />
                  Stitch Count
                </span>
                <span className="font-extrabold text-slate-900 text-sm tabular-nums">
                  {machine.stitchCount.toLocaleString()}
                </span>
              </div>
              <div className="flex items-center justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-400 font-medium">Efficiency</span>
                <span className="font-bold text-emerald-600 text-sm">
                  {machine.efficiency}%
                </span>
              </div>
              <div className="flex items-center justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-400 font-medium flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  Run Time
                </span>
                <span className="font-semibold text-slate-700">
                  {machine.runtimeHours}h {machine.runtimeMinutes}m
                </span>
              </div>
              <div className="flex items-center justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-400 font-medium">Stop Time</span>
                <span className="font-semibold text-slate-500">
                  {machine.stopTimeHours}h {machine.stopTimeMinutes}m
                </span>
              </div>
              <div className="flex items-center justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-400 font-medium flex items-center gap-1.5">
                  <Thermometer className="w-3.5 h-3.5 text-amber-500" />
                  Motor Temp
                </span>
                <span className="font-semibold text-slate-800">
                  {machine.temperature} °C (Optimal)
                </span>
              </div>
              <div className="flex items-center justify-between py-1.5">
                <span className="text-slate-400 font-medium flex items-center gap-1.5">
                  <Scissors className="w-3.5 h-3.5 text-slate-400" />
                  Thread Status
                </span>
                <span
                  className={`font-semibold ${
                    machine.threadStatus === 'Normal' ? 'text-emerald-600' : 'text-rose-600'
                  }`}
                >
                  {machine.threadStatus}
                </span>
              </div>
            </div>
          </div>

          <div className="pt-4 mt-4 border-t border-slate-100">
            <span className="text-[11px] text-slate-400 block mb-2">
              Operator assigned: <strong>{machine.currentJobDetails?.operator || 'Ramesh Patel'}</strong>
            </span>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                onClick={() =>
                  logBreakage({
                    machineNumber: machine.machineNumber,
                    needleNumber: 3,
                    headNumber: 1,
                    threadColor: 'White #FFF',
                    reason: 'Bobbin Breakage',
                    durationMinutes: 10,
                    status: 'Open',
                  })
                }
                className="py-2 px-3 bg-slate-50 hover:bg-rose-50 text-slate-700 hover:text-rose-700 border border-slate-200 rounded-lg font-semibold transition-colors text-center cursor-pointer"
              >
                Report Breakage
              </button>
              <button
                onClick={() => alert(`Diagnostics diagnostic ping sent to ${machine.machineNumber} controller.`)}
                className="py-2 px-3 bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-lg font-semibold transition-colors text-center cursor-pointer"
              >
                Ping Telemetry
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Tabs & Telemetry Curves */}
        <div className="lg:col-span-8 bg-white rounded-xl border border-slate-200/90 p-5 shadow-xs flex flex-col justify-between">
          <div>
            {/* Tab navigation */}
            <div className="flex items-center gap-1 border-b border-slate-200 pb-2 mb-4 overflow-x-auto">
              {(['Production', 'Stitch Count', 'Speed', 'Temperature', 'Jobs', 'Timeline'] as const).map(
                (tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                      activeTab === tab
                        ? 'bg-blue-50 text-blue-600 shadow-xs'
                        : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
                    }`}
                  >
                    {tab}
                  </button>
                )
              )}
            </div>

            {/* Tab Content 1: Production (Stitch Count) over time */}
            {activeTab === 'Production' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">
                      Production (Stitch Count)
                    </h3>
                    <p className="text-xs text-slate-400">
                      Cumulative stitches produced today vs quota
                    </p>
                  </div>
                  <div className="flex items-center gap-3 text-xs font-medium text-slate-600">
                    <span className="flex items-center gap-1.5">
                      <span className="w-3 h-0.5 bg-blue-600 inline-block" /> Actual
                    </span>
                    <span className="flex items-center gap-1.5">
                      <span className="w-3 h-0.5 border-t-2 border-dashed border-sky-400 inline-block" />{' '}
                      Target
                    </span>
                  </div>
                </div>
                <TrendLineChart
                  data={productionTelemetry}
                  unit="stitches"
                  height={220}
                  color="#2563EB"
                  targetColor="#0EA5E9"
                />
              </div>
            )}

            {/* Tab Content 2: Stitch Count */}
            {activeTab === 'Stitch Count' && (
              <div className="space-y-3">
                <h3 className="text-sm font-bold text-slate-900">
                  Hourly Stitch Accumulator
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                    <span className="text-slate-400 block text-[11px]">Last 1 Hour</span>
                    <span className="text-lg font-bold text-slate-900">12,400</span>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                    <span className="text-slate-400 block text-[11px]">Today Total</span>
                    <span className="text-lg font-bold text-slate-900">{machine.stitchCount.toLocaleString()}</span>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                    <span className="text-slate-400 block text-[11px]">Shift Target</span>
                    <span className="text-lg font-bold text-slate-900">60,000</span>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                    <span className="text-slate-400 block text-[11px]">Quota Progress</span>
                    <span className="text-lg font-bold text-emerald-600">
                      {Math.min(100, Math.round((machine.stitchCount / 60000) * 100))}%
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Tab Content 3: Speed Telemetry */}
            {activeTab === 'Speed' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">
                      Speed Stability Telemetry (SPM)
                    </h3>
                    <p className="text-xs text-slate-400">
                      Target 800 SPM standard factory velocity
                    </p>
                  </div>
                </div>
                <TrendLineChart
                  data={speedTelemetry}
                  unit="SPM"
                  height={220}
                  color="#10B981"
                  targetColor="#94A3B8"
                />
              </div>
            )}

            {/* Tab Content 4: Temperature */}
            {activeTab === 'Temperature' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">
                      Head Thermal Sensors (°C)
                    </h3>
                    <p className="text-xs text-slate-400">
                      Safety thermal limit threshold: 45°C
                    </p>
                  </div>
                </div>
                <TrendLineChart
                  data={tempTelemetry}
                  unit="°C"
                  height={220}
                  color="#F59E0B"
                  targetColor="#EF4444"
                />
              </div>
            )}

            {/* Tab Content 5: Jobs Table */}
            {activeTab === 'Jobs' && (
              <div className="space-y-3">
                <h3 className="text-sm font-bold text-slate-900">
                  Recent Embroidery Jobs
                </h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-slate-200 text-slate-400 uppercase text-[10px]">
                        <th className="py-2">Start Time</th>
                        <th className="py-2">Design Name</th>
                        <th className="py-2">Stitch Count</th>
                        <th className="py-2">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-slate-700">
                      {recentJobs.map((j, idx) => (
                        <tr key={idx} className="hover:bg-slate-50">
                          <td className="py-2.5 font-mono text-slate-500">{j.startTime}</td>
                          <td className="py-2.5 font-bold text-slate-900">{j.designName}</td>
                          <td className="py-2.5 font-semibold text-slate-800">
                            {j.stitchCount.toLocaleString()}
                          </td>
                          <td className="py-2.5">
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700">
                              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                              {j.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Tab Content 6: Timeline */}
            {activeTab === 'Timeline' && (
              <div className="space-y-3">
                <h3 className="text-sm font-bold text-slate-900">
                  Telemetry Events for {machine.machineNumber}
                </h3>
                <div className="space-y-2">
                  {machineEvents.length > 0 ? (
                    machineEvents.map((ev) => (
                      <div
                        key={ev.id}
                        className="p-2.5 bg-slate-50 rounded-lg border border-slate-100 flex items-center justify-between text-xs"
                      >
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-[11px] text-slate-400">{ev.time}</span>
                          <span className="font-semibold text-slate-800">{ev.eventType}:</span>
                          <span className="text-slate-600">{ev.description}</span>
                        </div>
                        <span className="px-2 py-0.5 bg-white text-slate-700 text-[10px] rounded border font-medium">
                          {ev.status}
                        </span>
                      </div>
                    ))
                  ) : (
                    <p className="text-xs text-slate-400 py-4 text-center">
                      No abnormal events recorded for this machine today.
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Recent Jobs Sub-table below the chart */}
          {activeTab === 'Production' && (
            <div className="mt-5 pt-4 border-t border-slate-100">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">
                Recent Jobs
              </h4>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200 text-slate-400 uppercase text-[10px]">
                      <th className="py-2">Start Time</th>
                      <th className="py-2">Design Name</th>
                      <th className="py-2">Stitch Count</th>
                      <th className="py-2">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    {recentJobs.slice(0, 3).map((j, idx) => (
                      <tr key={idx} className="hover:bg-slate-50">
                        <td className="py-2 font-mono text-slate-500">{j.startTime}</td>
                        <td className="py-2 font-bold text-slate-900">{j.designName}</td>
                        <td className="py-2 font-semibold text-slate-800">
                          {j.stitchCount.toLocaleString()}
                        </td>
                        <td className="py-2">
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                            {j.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
