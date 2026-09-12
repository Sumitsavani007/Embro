import React, { useState } from 'react';
import {
  Scissors,
  Plus,
  Clock,
  CheckCircle2,
  AlertCircle,
  Filter,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { KpiCard } from '../common/KpiCard';
import { exportThreadBreakageToCsv } from '../../utils/exportCsv';

export const ThreadBreakageScreen: React.FC = () => {
  const { threadBreakages, logBreakage } = useApp();
  const [filterMachine, setFilterMachine] = useState('ALL');
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // New breakage form state
  const [formMachine, setFormMachine] = useState('M1');
  const [formNeedle, setFormNeedle] = useState('3');
  const [formHead, setFormHead] = useState('2');
  const [formColor, setFormColor] = useState('Red #FF0000');
  const [formReason, setFormReason] = useState('Top Thread Breakage');
  const [formDuration, setFormDuration] = useState('5');

  const filteredLogs = threadBreakages.filter((item) => {
    const matchesMachine = filterMachine === 'ALL' || item.machineNumber === filterMachine;
    const matchesStatus = filterStatus === 'ALL' || item.status === filterStatus;
    return matchesMachine && matchesStatus;
  });

  const totalBreakages = threadBreakages.length;
  const avgDowntime = Math.round(
    threadBreakages.reduce((acc, curr) => acc + curr.durationMinutes, 0) / (totalBreakages || 1)
  );

  const handleSaveBreakage = (e: React.FormEvent) => {
    e.preventDefault();
    logBreakage({
      machineNumber: formMachine,
      needleNumber: parseInt(formNeedle, 10) || 1,
      headNumber: parseInt(formHead, 10) || 1,
      threadColor: formColor,
      reason: formReason,
      durationMinutes: parseInt(formDuration, 10) || 5,
      status: 'Open',
    });
    setIsModalOpen(false);
  };

  const handleExport = () => {
    exportThreadBreakageToCsv(filteredLogs);
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="bg-white rounded-xl border border-slate-200/90 p-4 shadow-xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-bold text-slate-900 tracking-tight">
            Thread Breakage Telemetry
          </h2>
          <p className="text-xs text-slate-500 font-medium">
            Sensor-detected breakages, needle isolations, and rethreading durations
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 text-xs">
          <select
            value={filterMachine}
            onChange={(e) => setFilterMachine(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg font-semibold text-slate-700 cursor-pointer"
          >
            <option value="ALL">All Machines</option>
            <option value="M1">M1</option>
            <option value="M2">M2</option>
            <option value="M3">M3</option>
            <option value="M4">M4</option>
            <option value="M5">M5</option>
          </select>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg font-semibold text-slate-700 cursor-pointer"
          >
            <option value="ALL">All Status</option>
            <option value="Open">Open (Fixing)</option>
            <option value="Resolved">Resolved</option>
          </select>

          <button
            onClick={handleExport}
            className="px-3 py-2 bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-lg font-semibold transition-colors cursor-pointer"
          >
            Export CSV
          </button>

          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold flex items-center gap-1.5 shadow-xs shadow-blue-500/30 transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Log Breakage</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <KpiCard
          title="Total Breakages (Today)"
          value={totalBreakages}
          subValue="Across 8 production frames"
          icon={Scissors}
          iconColor="text-rose-600"
          iconBg="bg-rose-50"
        />
        <KpiCard
          title="Avg. Retreading Time"
          value={`${avgDowntime} min`}
          subValue="Operator response speed"
          icon={Clock}
          iconColor="text-amber-600"
          iconBg="bg-amber-50"
        />
        <KpiCard
          title="High-Risk Needle Spot"
          value="Head 1 - Needle 3"
          subValue="Tension regulator needs inspection"
          icon={AlertCircle}
          iconColor="text-blue-600"
          iconBg="bg-blue-50"
        />
      </div>

      {/* Breakages Table */}
      <div className="bg-white rounded-xl border border-slate-200/90 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-400 font-semibold text-[11px] uppercase">
                <th className="py-3 px-4">Time</th>
                <th className="py-3 px-3">Machine</th>
                <th className="py-3 px-3">Head / Needle</th>
                <th className="py-3 px-3">Thread / Color</th>
                <th className="py-3 px-3">Reason</th>
                <th className="py-3 px-3">Repair Duration</th>
                <th className="py-3 px-4 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700 font-medium">
              {filteredLogs.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50">
                  <td className="py-3 px-4 font-mono text-slate-500">{item.time}</td>
                  <td className="py-3 px-3 font-bold text-slate-900">{item.machineNumber}</td>
                  <td className="py-3 px-3">
                    Head {item.headNumber}, Needle #{item.needleNumber}
                  </td>
                  <td className="py-3 px-3">
                    <span className="inline-flex items-center gap-1.5 font-semibold text-slate-800">
                      <span className="w-2.5 h-2.5 rounded-full border border-slate-300 bg-slate-400" />
                      {item.threadColor}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-slate-600">{item.reason}</td>
                  <td className="py-3 px-3 font-semibold text-rose-600">
                    {item.durationMinutes} mins
                  </td>
                  <td className="py-3 px-4 text-right">
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold ${
                        item.status === 'Resolved'
                          ? 'bg-emerald-50 text-emerald-700'
                          : 'bg-rose-50 text-rose-700 animate-pulse'
                      }`}
                    >
                      {item.status === 'Resolved' ? (
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                      ) : (
                        <AlertCircle className="w-3 h-3 text-rose-600" />
                      )}
                      {item.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Manual Breakage Log Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-200 max-w-md w-full p-6 animate-in fade-in-50 zoom-in-95">
            <h3 className="text-base font-bold text-slate-900 mb-1">
              Log Thread Breakage Event
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Enter the needle position, thread shade, and cause to record factory downtime.
            </p>

            <form onSubmit={handleSaveBreakage} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Machine</label>
                  <select
                    value={formMachine}
                    onChange={(e) => setFormMachine(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg"
                  >
                    <option value="M1">M1</option>
                    <option value="M2">M2</option>
                    <option value="M3">M3</option>
                    <option value="M4">M4</option>
                    <option value="M5">M5</option>
                    <option value="M6">M6</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Head No.</label>
                  <input
                    type="number"
                    min="1"
                    max="30"
                    value={formHead}
                    onChange={(e) => setFormHead(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Needle No.</label>
                  <input
                    type="number"
                    min="1"
                    max="15"
                    value={formNeedle}
                    onChange={(e) => setFormNeedle(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Est. Duration (Mins)</label>
                  <input
                    type="number"
                    min="1"
                    value={formDuration}
                    onChange={(e) => setFormDuration(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Thread Color / Shade</label>
                <input
                  type="text"
                  value={formColor}
                  onChange={(e) => setFormColor(e.target.value)}
                  placeholder="e.g. Navy Blue #000080"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Breakage Reason</label>
                <select
                  value={formReason}
                  onChange={(e) => setFormReason(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg"
                >
                  <option value="Top Thread Breakage">Top Thread Breakage</option>
                  <option value="Bobbin Runout / Snag">Bobbin Runout / Snag</option>
                  <option value="Needle Deflection / Eye Burred">Needle Deflection / Eye Burred</option>
                  <option value="Thread Tension High">Thread Tension High</option>
                  <option value="Hook Timing Lag">Hook Timing Lag</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-semibold transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors cursor-pointer"
                >
                  Save Breakage Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
