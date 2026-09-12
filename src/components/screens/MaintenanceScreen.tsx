import React, { useState } from 'react';
import {
  Wrench,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Plus,
  Droplets,
  Calendar,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { KpiCard } from '../common/KpiCard';

export const MaintenanceScreen: React.FC = () => {
  const { maintenanceLogs, logMaintenance, machines, setSelectedMachineId, setCurrentRoute } = useApp();
  const [filterType, setFilterType] = useState('ALL');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form state
  const [formMachine, setFormMachine] = useState('M1');
  const [formTaskType, setFormTaskType] = useState<'HOOK_OILING' | 'NEEDLE_REPLACE' | 'TIMING_CALIBRATION' | 'GREASING'>('HOOK_OILING');
  const [formDescription, setFormDescription] = useState('Rotary hook & needle bar 4-hour lubrication');
  const [formTechnician, setFormTechnician] = useState('Kishore Kumar (Master Mechanic)');

  const filteredLogs = maintenanceLogs.filter((log) => {
    if (filterType === 'ALL') return true;
    return log.taskType === filterType;
  });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    logMaintenance({
      timestamp: new Date().toLocaleString(),
      technicianName: formTechnician,
      taskPerformed: formDescription,
      notes: formDescription,
      machineNumber: formMachine,
      taskType: formTaskType,
      description: formDescription,
      performedBy: formTechnician,
      completedAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
      nextDueDate: new Date(Date.now() + 4 * 60 * 60 * 1000).toLocaleString(),
      status: 'DONE',
    });
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="bg-white rounded-xl border border-slate-200/90 p-4 shadow-xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-bold text-slate-900 tracking-tight">
            Preventive Maintenance & Oiling Schedule
          </h2>
          <p className="text-xs text-slate-500 font-medium">
            Rotary hook lubrication timer, needle bar inspection, and calibration logbook
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 text-xs">
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg font-semibold text-slate-700 cursor-pointer"
          >
            <option value="ALL">All Maintenance Tasks</option>
            <option value="HOOK_OILING">Hook Oiling (4h cycle)</option>
            <option value="NEEDLE_REPLACE">Needle Replacement</option>
            <option value="TIMING_CALIBRATION">Timing Calibration</option>
            <option value="GREASING">Gear Greasing</option>
          </select>

          <button
            onClick={() => setIsModalOpen(true)}
            className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Record Maintenance Service</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <KpiCard
          title="Hook Lubrication Compliance"
          value="98.4%"
          subValue="Completed within 4-hour window"
          icon={Droplets}
          iconColor="text-blue-600"
          iconBg="bg-blue-50"
        />
        <KpiCard
          title="Scheduled Tasks Due Today"
          value="4 Tasks"
          subValue="M3 timing check & M7 head oiling"
          icon={Calendar}
          iconColor="text-amber-600"
          iconBg="bg-amber-50"
        />
        <KpiCard
          title="Machine Health Score"
          value="94 / 100"
          subValue="Vibration and thermal sensor baseline"
          icon={Wrench}
          iconColor="text-emerald-600"
          iconBg="bg-emerald-50"
        />
      </div>

      {/* Maintenance Table */}
      <div className="bg-white rounded-xl border border-slate-200/90 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-400 font-semibold text-[11px] uppercase">
                <th className="py-3 px-4">Machine</th>
                <th className="py-3 px-3">Service Type</th>
                <th className="py-3 px-3">Description</th>
                <th className="py-3 px-3">Technician</th>
                <th className="py-3 px-3">Serviced At</th>
                <th className="py-3 px-3">Next Due</th>
                <th className="py-3 px-4 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700 font-medium">
              {filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50">
                  <td className="py-3 px-4 font-bold text-slate-900">
                    <button
                      onClick={() => {
                        setSelectedMachineId(machines.find(machine => machine.machineNumber === log.machineNumber)?.id || log.machineNumber);
                        setCurrentRoute('machine-detail');
                      }}
                      className="text-blue-600 hover:underline"
                    >
                      {log.machineNumber}
                    </button>
                  </td>
                  <td className="py-3 px-3">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-slate-100 text-slate-800">
                      {(log.taskType || log.taskPerformed).replaceAll('_', ' ')}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-slate-700">{log.description || log.taskPerformed}</td>
                  <td className="py-3 px-3 text-slate-600">{log.performedBy || log.technicianName}</td>
                  <td className="py-3 px-3 font-mono text-slate-500">{log.completedAt || log.timestamp}</td>
                  <td className="py-3 px-3 font-mono text-amber-700 font-semibold">{log.nextDueDate || '—'}</td>
                  <td className="py-3 px-4 text-right">
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold ${
                        (!log.status || log.status === 'DONE')
                          ? 'bg-emerald-50 text-emerald-700'
                          : 'bg-amber-50 text-amber-700'
                      }`}
                    >
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                      {log.status || 'DONE'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-200 max-w-md w-full p-6 animate-in fade-in-50 zoom-in-95">
            <h3 className="text-base font-bold text-slate-900 mb-1">
              Record Preventive Service / Oiling
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Add entry into machine digital service passport
            </p>

            <form onSubmit={handleSave} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Machine</label>
                  <select
                    value={formMachine}
                    onChange={(e) => setFormMachine(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg"
                  >
                    {machines.map((m) => (
                      <option key={m.id} value={m.machineNumber}>
                        {m.machineNumber} ({m.name})
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Task Category</label>
                  <select
                    value={formTaskType}
                    onChange={(e) => setFormTaskType(e.target.value as any)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg"
                  >
                    <option value="HOOK_OILING">Hook Oiling (White Spindle Oil)</option>
                    <option value="NEEDLE_REPLACE">Needle Replacement (DBxK5)</option>
                    <option value="TIMING_CALIBRATION">Hook-to-Needle Timing Check</option>
                    <option value="GREASING">Main Camshaft Greasing</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Notes / Description</label>
                <input
                  type="text"
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Mechanic / Performed By</label>
                <input
                  type="text"
                  value={formTechnician}
                  onChange={(e) => setFormTechnician(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg"
                  required
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold cursor-pointer"
                >
                  Log Maintenance
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
