import React from 'react';
import {
  Cpu,
  Activity,
  AlertOctagon,
  Layers,
  Gauge,
  Clock,
  ArrowUpRight,
  ExternalLink,
  Users,
  Wrench,
  ShieldCheck,
  Package,
  ChevronRight,
  MessageSquare,
  Zap,
  QrCode,
  CreditCard,
  Send,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { KpiCard } from '../common/KpiCard';
import { StatusBadge } from '../common/StatusBadge';
import { HourlyProductionChart } from '../charts/HourlyProductionChart';
import { StatusDonutChart } from '../charts/StatusDonutChart';
import { HOURLY_PRODUCTION_DATA } from '../../data/mockData';

export const DashboardScreen: React.FC = () => {
  const {
    machines,
    totalMachines,
    runningCount,
    stoppedCount,
    idleCount,
    offlineCount,
    totalProductionStitches,
    averageEfficiency,
    averageSpeedSPM,
    setCurrentRoute,
    setSelectedMachineId,
    timelineEvents,
    sendOwnerDailyShiftReportWhatsApp,
    language,
    t,
  } = useApp();

  const handleMachineClick = (id: string) => {
    setSelectedMachineId(id);
    setCurrentRoute('machine-detail');
  };

  const runningPercent = totalMachines > 0 ? ((runningCount / totalMachines) * 100).toFixed(1) : '0';
  const stoppedPercent = totalMachines > 0 ? ((stoppedCount / totalMachines) * 100).toFixed(1) : '0';

  const displayedMachines = machines.slice(0, 8);

  return (
    <div className="space-y-6">
      {/* 1. Top KPI Cards Row */}
      <div className="grid grid-cols-2 sm:grid-cols-3 2xl:grid-cols-6 gap-3.5">
        <KpiCard
          title="Total Machines"
          value={totalMachines}
          subValue={
            <span className="truncate">
              <strong className="text-emerald-600">{runningCount} Running</strong> |{' '}
              <strong className="text-rose-600">{stoppedCount} Stopped</strong>
            </span>
          }
          icon={Cpu}
          iconColor="text-blue-600"
          iconBg="bg-blue-50"
          onClick={() => setCurrentRoute('machines')}
        />
        <KpiCard
          title="Running"
          value={runningCount}
          subValue={
            <span className="text-emerald-600 font-semibold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              {runningPercent}% Active
            </span>
          }
          icon={Activity}
          iconColor="text-emerald-600"
          iconBg="bg-emerald-50"
          onClick={() => setCurrentRoute('live-status')}
        />
        <KpiCard
          title="Stopped"
          value={stoppedCount}
          subValue={
            <span className="text-rose-600 font-semibold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
              {stoppedPercent}% Stopped
            </span>
          }
          icon={AlertOctagon}
          iconColor="text-rose-600"
          iconBg="bg-rose-50"
          onClick={() => setCurrentRoute('stop-time')}
        />
        <KpiCard
          title="Total Production"
          value={totalProductionStitches.toLocaleString()}
          subValue="Stitch Count"
          icon={Layers}
          iconColor="text-sky-600"
          iconBg="bg-sky-50"
          onClick={() => setCurrentRoute('production-reports')}
        />
        <KpiCard
          title="Efficiency"
          value={`${averageEfficiency}%`}
          subValue={`Avg Speed ${averageSpeedSPM} SPM`}
          icon={Gauge}
          iconColor="text-emerald-600"
          iconBg="bg-emerald-50"
          onClick={() => setCurrentRoute('production-reports')}
        />
        <KpiCard
          title="Running Time"
          value="18h 24m"
          subValue={<span className="text-amber-600">Downtime 2h 36m</span>}
          icon={Clock}
          iconColor="text-indigo-600"
          iconBg="bg-indigo-50"
          onClick={() => setCurrentRoute('runtime')}
        />
      </div>

      {/* Industrial Operations & Plant Management Quick Hub */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-2xs space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3 pb-2 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-600" />
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-700">
              {language === 'gu'
                ? 'ફેક્ટરી વર્કસ્પેસ'
                : 'Factory workspace'}
            </h2>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={sendOwnerDailyShiftReportWhatsApp}
              className="px-2.5 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
              {language === 'gu' ? 'ઓનર રિપોર્ટ મોકલો' : 'WhatsApp Owner Report'}
            </button>
          </div>
        </div>

        {/* 4 Core Requested SaaS Modules */}
        <div className="grid grid-cols-1 min-[380px]:grid-cols-2 xl:grid-cols-4 gap-3">
          <button
            onClick={() => setCurrentRoute('whatsapp-hub')}
            className="p-3 rounded-xl bg-emerald-50/60 hover:bg-emerald-100/70 border border-emerald-200/80 text-left transition-all group cursor-pointer"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="p-2 rounded-lg bg-emerald-600 text-white shadow-xs group-hover:scale-105 transition-transform">
                <MessageSquare className="w-4 h-4" />
              </div>
              <span className="text-[10px] font-bold px-1.5 py-0.5 bg-emerald-100 text-emerald-800 rounded">
                1-CLICK
              </span>
            </div>
            <span className="text-xs font-bold text-slate-900 group-hover:text-emerald-950 block">
              {language === 'gu' ? 'વોટ્સએપ એલર્ટ્સ' : 'WhatsApp Alerts'}
            </span>
            <span className="text-[10px] text-slate-500">Party updates & shift reports</span>
          </button>

          <button
            onClick={() => setCurrentRoute('power-monitoring')}
            className="p-3 rounded-xl bg-amber-50/60 hover:bg-amber-100/70 border border-amber-200/80 text-left transition-all group cursor-pointer"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="p-2 rounded-lg bg-amber-500 text-white shadow-xs group-hover:scale-105 transition-transform">
                <Zap className="w-4 h-4" />
              </div>
              <span className="text-[10px] font-bold px-1.5 py-0.5 bg-amber-100 text-amber-800 rounded">
                PF 0.98
              </span>
            </div>
            <span className="text-xs font-bold text-slate-900 group-hover:text-amber-950 block">
              {language === 'gu' ? 'વીજળી & DG પાવર' : 'Electricity & DG Run'}
            </span>
            <span className="text-[10px] text-slate-500">Power factor & DGVCL tariff</span>
          </button>

          <button
            onClick={() => setCurrentRoute('machine-qr')}
            className="p-3 rounded-xl bg-indigo-50/60 hover:bg-indigo-100/70 border border-indigo-200/80 text-left transition-all group cursor-pointer"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="p-2 rounded-lg bg-indigo-600 text-white shadow-xs group-hover:scale-105 transition-transform">
                <QrCode className="w-4 h-4" />
              </div>
              <span className="text-[10px] font-bold px-1.5 py-0.5 bg-indigo-100 text-indigo-800 rounded">
                PRINT
              </span>
            </div>
            <span className="text-xs font-bold text-slate-900 group-hover:text-indigo-950 block">
              {language === 'gu' ? 'મશીન QR & બારકોડ' : 'Machine QR & Barcodes'}
            </span>
            <span className="text-[10px] text-slate-500">Badges & cutting lot slips</span>
          </button>

          <button
            onClick={() => setCurrentRoute('operator-khata')}
            className="p-3 rounded-xl bg-teal-50/60 hover:bg-teal-100/70 border border-teal-200/80 text-left transition-all group cursor-pointer"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="p-2 rounded-lg bg-teal-600 text-white shadow-xs group-hover:scale-105 transition-transform">
                <CreditCard className="w-4 h-4" />
              </div>
              <span className="text-[10px] font-bold px-1.5 py-0.5 bg-teal-100 text-teal-800 rounded">
                KHATA
              </span>
            </div>
            <span className="text-xs font-bold text-slate-900 group-hover:text-teal-950 block">
              {language === 'gu' ? 'કારીગર ખાતાવહી & પગાર' : 'Operator Khata & Salary'}
            </span>
            <span className="text-[10px] text-slate-500">Biometric & upad register</span>
          </button>
        </div>

        {/* Existing Plant Floor Modules Row */}
        <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-5 gap-3 pt-2 border-t border-slate-100">
          <button
            onClick={() => setCurrentRoute('orders')}
            className="p-2.5 rounded-xl bg-slate-50 hover:bg-indigo-50/70 border border-slate-200/70 hover:border-indigo-200 text-left transition-all group cursor-pointer"
          >
            <div className="flex items-center justify-between mb-1.5">
              <div className="p-1.5 rounded-lg bg-indigo-100 text-indigo-700 group-hover:scale-105 transition-transform">
                <Layers className="w-3.5 h-3.5" />
              </div>
              <ChevronRight className="w-3 h-3 text-slate-300 group-hover:text-indigo-600 transition-colors" />
            </div>
            <span className="text-xs font-bold text-slate-800 group-hover:text-indigo-950 block">
              Batch Orders & ETA
            </span>
            <span className="text-[10px] text-slate-400">Pcs velocity & finish</span>
          </button>
          <button
            onClick={() => setCurrentRoute('jobwork-costing')}
            className="p-2.5 rounded-xl bg-slate-50 hover:bg-emerald-50/70 border border-slate-200/70 hover:border-emerald-200 text-left transition-all group cursor-pointer"
          >
            <div className="flex items-center justify-between mb-1.5">
              <div className="p-1.5 rounded-lg bg-emerald-100 text-emerald-700 group-hover:scale-105 transition-transform">
                <Users className="w-3.5 h-3.5" />
              </div>
              <ChevronRight className="w-3 h-3 text-slate-300 group-hover:text-emerald-600 transition-colors" />
            </div>
            <span className="text-xs font-bold text-slate-800 group-hover:text-emerald-950 block">
              Jobwork Costing
            </span>
            <span className="text-[10px] text-slate-400">₹/1k stitches rate</span>
          </button>
          <button
            onClick={() => setCurrentRoute('maintenance')}
            className="p-2.5 rounded-xl bg-slate-50 hover:bg-amber-50/70 border border-slate-200/70 hover:border-amber-200 text-left transition-all group cursor-pointer"
          >
            <div className="flex items-center justify-between mb-1.5">
              <div className="p-1.5 rounded-lg bg-amber-100 text-amber-700 group-hover:scale-105 transition-transform">
                <Wrench className="w-3.5 h-3.5" />
              </div>
              <ChevronRight className="w-3 h-3 text-slate-300 group-hover:text-amber-600 transition-colors" />
            </div>
            <span className="text-xs font-bold text-slate-800 group-hover:text-amber-950 block">
              Oiling & Service
            </span>
            <span className="text-[10px] text-slate-400">Rotary hook lubrication</span>
          </button>
          <button
            onClick={() => setCurrentRoute('quality-control')}
            className="p-2.5 rounded-xl bg-slate-50 hover:bg-teal-50/70 border border-slate-200/70 hover:border-teal-200 text-left transition-all group cursor-pointer"
          >
            <div className="flex items-center justify-between mb-1.5">
              <div className="p-1.5 rounded-lg bg-teal-100 text-teal-700 group-hover:scale-105 transition-transform">
                <ShieldCheck className="w-3.5 h-3.5" />
              </div>
              <ChevronRight className="w-3 h-3 text-slate-300 group-hover:text-teal-600 transition-colors" />
            </div>
            <span className="text-xs font-bold text-slate-800 group-hover:text-teal-950 block">
              Quality Control (QC)
            </span>
            <span className="text-[10px] text-slate-400">First-Pass Yield logs</span>
          </button>
          <button
            onClick={() => setCurrentRoute('thread-inventory')}
            className="p-2.5 rounded-xl bg-slate-50 hover:bg-purple-50/70 border border-slate-200/70 hover:border-purple-200 text-left transition-all group cursor-pointer"
          >
            <div className="flex items-center justify-between mb-1.5">
              <div className="p-1.5 rounded-lg bg-purple-100 text-purple-700 group-hover:scale-105 transition-transform">
                <Package className="w-3.5 h-3.5" />
              </div>
              <ChevronRight className="w-3 h-3 text-slate-300 group-hover:text-purple-600 transition-colors" />
            </div>
            <span className="text-xs font-bold text-slate-800 group-hover:text-purple-950 block">
              Thread & Bobbins
            </span>
            <span className="text-[10px] text-slate-400">Surat restock alerts</span>
          </button>
        </div>
      </div>

      {/* 2. Charts Row: Hourly Production (left) + Machine Status Donut (right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Hourly Production Bar Chart */}
        <div className="lg:col-span-7 xl:col-span-8 bg-white rounded-xl border border-slate-200/90 p-5 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4 pb-2 border-b border-slate-100">
            <div>
              <h2 className="text-base font-bold text-slate-900 tracking-tight">
                Production (Stitch Count)
              </h2>
              <p className="text-xs text-slate-500 font-medium">
                Hourly throughput comparison against shift quota
              </p>
            </div>
            {/* Chart Legend */}
            <div className="flex items-center gap-4 text-xs font-semibold text-slate-600">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-xs bg-blue-600 inline-block" />
                <span>Production</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-4 h-0.5 border-t-2 border-dashed border-sky-500 inline-block" />
                <span>Target</span>
              </div>
            </div>
          </div>
          <HourlyProductionChart data={HOURLY_PRODUCTION_DATA} height={230} />
        </div>

        {/* Machine Status Donut Chart */}
        <div className="lg:col-span-5 xl:col-span-4 bg-white rounded-xl border border-slate-200/90 p-5 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2 pb-2 border-b border-slate-100">
            <div>
              <h2 className="text-base font-bold text-slate-900 tracking-tight">
                Machine Status
              </h2>
              <p className="text-xs text-slate-500 font-medium">
                Real-time operational distribution
              </p>
            </div>
            <button
              onClick={() => setCurrentRoute('live-status')}
              className="text-xs text-blue-600 font-semibold hover:text-blue-700 flex items-center gap-1 cursor-pointer"
            >
              <span>View Live</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="my-auto py-2">
            <StatusDonutChart
              running={runningCount}
              idle={idleCount}
              stopped={stoppedCount}
              offline={offlineCount}
              total={totalMachines}
            />
          </div>
          <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Utilization Rate</span>
            <span className="font-bold text-emerald-600">
              {((runningCount / (totalMachines || 1)) * 100).toFixed(0)}% Capacity
            </span>
          </div>
        </div>
      </div>

      {/* 3. Bottom Row: Live Machine Status Table (left) + Recent Activity (right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Live Machine Status Table */}
        <div className="lg:col-span-8 bg-white rounded-xl border border-slate-200/90 p-5 shadow-xs">
          <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-100">
            <div>
              <h2 className="text-base font-bold text-slate-900 tracking-tight">
                Live Machine Status
              </h2>
              <p className="text-xs text-slate-500 font-medium">
                Real-time telemetry and current production runs
              </p>
            </div>
            <button
              onClick={() => setCurrentRoute('machines')}
              className="text-xs text-blue-600 font-semibold hover:text-blue-700 flex items-center gap-1 cursor-pointer"
            >
              <span>All Machines ({totalMachines})</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="overflow-x-auto -mx-5 px-5">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-200 text-slate-400 font-semibold text-[11px] uppercase tracking-wider">
                  <th className="py-2.5 pr-3">Machine No.</th>
                  <th className="py-2.5 px-3">Head/Needle</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3">Speed (SPM)</th>
                  <th className="py-2.5 px-3">Stitch Count</th>
                  <th className="py-2.5 px-3">Efficiency</th>
                  <th className="py-2.5 pl-3">Run Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {displayedMachines.map((m) => (
                  <tr
                    key={m.id}
                    onClick={() => handleMachineClick(m.id)}
                    className="hover:bg-slate-50/80 cursor-pointer transition-colors group"
                  >
                    <td className="py-3 pr-3 font-bold text-slate-900 flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-600 group-hover:scale-125 transition-transform" />
                      <span>{m.machineNumber}</span>
                    </td>
                    <td className="py-3 px-3 text-slate-500 font-medium">
                      {m.headCount}/{m.needleCount}
                    </td>
                    <td className="py-3 px-3">
                      <StatusBadge status={m.status} size="xs" />
                    </td>
                    <td className="py-3 px-3 font-semibold text-slate-800 tabular-nums">
                      {m.speed > 0 ? `${m.speed} SPM` : '0'}
                    </td>
                    <td className="py-3 px-3 font-semibold text-slate-800 tabular-nums">
                      {m.stitchCount.toLocaleString()}
                    </td>
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-2">
                        <div className="w-12 bg-slate-100 rounded-full h-1.5 overflow-hidden">
                          <div
                            className={`h-full rounded-full ${
                              m.efficiency >= 85
                                ? 'bg-emerald-500'
                                : m.efficiency > 0
                                ? 'bg-amber-500'
                                : 'bg-slate-300'
                            }`}
                            style={{ width: `${m.efficiency}%` }}
                          />
                        </div>
                        <span className="font-bold text-[11px] text-slate-700">
                          {m.efficiency}%
                        </span>
                      </div>
                    </td>
                    <td className="py-3 pl-3 text-slate-600 font-medium whitespace-nowrap">
                      {m.runtimeHours}h {m.runtimeMinutes}m
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Activity List */}
        <div className="lg:col-span-4 bg-white rounded-xl border border-slate-200/90 p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-100">
              <div>
                <h2 className="text-base font-bold text-slate-900 tracking-tight">
                  Recent Activity
                </h2>
                <p className="text-xs text-slate-500 font-medium">
                  Continuous factory event log
                </p>
              </div>
              <button
                onClick={() => setCurrentRoute('timeline')}
                className="text-xs text-blue-600 font-semibold hover:text-blue-700 cursor-pointer"
              >
                View all
              </button>
            </div>
            <div className="space-y-3">
              {timelineEvents.slice(0, 6).map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-2 rounded-lg hover:bg-slate-50 transition-colors text-xs"
                >
                  <div className="flex items-center gap-2.5 overflow-hidden">
                    <span className="text-slate-400 font-mono text-[11px] shrink-0">
                      {item.time}
                    </span>
                    <span className="px-1.5 py-0.5 bg-slate-100 text-slate-700 font-bold rounded text-[11px] shrink-0">
                      {item.machineNumber}
                    </span>
                    <span className="font-medium text-slate-800 truncate" title={item.description}>
                      {item.description}
                    </span>
                  </div>
                  <span
                    className={`text-[10px] font-semibold px-2 py-0.5 rounded-full shrink-0 ml-2 ${
                      item.status === 'Critical'
                        ? 'bg-rose-50 text-rose-700'
                        : item.status === 'Warning'
                        ? 'bg-amber-50 text-amber-700'
                        : 'bg-emerald-50 text-emerald-700'
                    }`}
                  >
                    {item.eventType.split(' ')[0]}
                  </span>
                </div>
              ))}
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 text-center">
            <button
              onClick={() => setCurrentRoute('timeline')}
              className="w-full py-2 bg-slate-50 hover:bg-slate-100 text-slate-700 font-semibold text-xs rounded-lg transition-colors cursor-pointer"
            >
              Full Machine Event Timeline
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
