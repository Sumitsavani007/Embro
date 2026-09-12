import React, { useState } from 'react';
import {
  Search,
  Plus,
  Download,
  ArrowUpDown,
  Trash2,
  Eye,
  X,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { StatusBadge } from '../common/StatusBadge';
import { Machine } from '../../types';
import { exportMachinesToCsv } from '../../utils/exportCsv';

interface MachinesScreenProps {
  onAddMachineClick?: () => void;
}

export const MachinesScreen: React.FC<MachinesScreenProps> = ({ onAddMachineClick }) => {
  const { machines, deleteMachine, setSelectedMachineId, setCurrentRoute, addMachine } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [brandFilter, setBrandFilter] = useState<string>('ALL');
  const [sortBy, setSortBy] = useState<keyof Machine>('machineNumber');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [showAddModal, setShowAddModal] = useState(false);
  const emptyForm = { machineNumber: '', name: '', brand: 'Tajima', model: '', serialNumber: '', headCount: '12', needleCount: '12', maxSpeed: '1000', group: 'Line A', factoryId: 'f1', telemetryProtocol: 'MQTT', telemetryEndpoint: '', telemetryDeviceId: '', telemetryApiKey: '', telemetryPollingSeconds: '10', ipAddress: '', temperatureAlertCelsius: '45', lowEfficiencyAlertPercent: '70' };
  const [form, setForm] = useState(emptyForm);
  const [formError, setFormError] = useState('');

  const filteredMachines = machines
    .filter((m) => {
      const matchesSearch =
        m.machineNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        m.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
        m.currentJob.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'ALL' || m.status === statusFilter;
      const matchesBrand = brandFilter === 'ALL' || m.brand === brandFilter;
      return matchesSearch && matchesStatus && matchesBrand;
    })
    .sort((a, b) => {
      let valA = a[sortBy];
      let valB = b[sortBy];

      if (sortBy === 'machineNumber') {
        const numA = parseInt(a.machineNumber.replace(/\D/g, ''), 10) || 0;
        const numB = parseInt(b.machineNumber.replace(/\D/g, ''), 10) || 0;
        return sortOrder === 'asc' ? numA - numB : numB - numA;
      }

      if (typeof valA === 'string') {
        valA = (valA as string).toLowerCase();
        valB = ((valB as string) || '').toLowerCase();
      }

      if (valA < (valB as any)) return sortOrder === 'asc' ? -1 : 1;
      if (valA > (valB as any)) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

  const handleSort = (field: keyof Machine) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  const handleRowClick = (id: string) => {
    setSelectedMachineId(id);
    setCurrentRoute('machine-detail');
  };

  const handleExport = () => {
    exportMachinesToCsv(filteredMachines);
  };

  const updateForm = (key: keyof typeof form, value: string) => setForm((prev) => ({ ...prev, [key]: value }));
  const handleAddSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!form.machineNumber.trim() || !form.name.trim() || !form.model.trim() || !form.serialNumber.trim() || !form.telemetryEndpoint.trim() || !form.telemetryDeviceId.trim()) {
      setFormError('Identity, serial number and telemetry endpoint/device ID are required.');
      return;
    }
    if (machines.some((machine) => machine.machineNumber.toLowerCase() === form.machineNumber.trim().toLowerCase())) {
      setFormError('Machine number already exists.');
      return;
    }
    addMachine({ machineNumber: form.machineNumber.trim(), name: form.name.trim(), brand: form.brand, model: form.model.trim(), serialNumber: form.serialNumber.trim(), headCount: Number(form.headCount) || 1, needleCount: Number(form.needleCount) || 1, maxSpeed: Number(form.maxSpeed) || 1000, status: 'OFFLINE', speed: 0, stitchCount: 0, efficiency: 0, currentJob: 'Telemetry connection pending', runtimeHours: 0, runtimeMinutes: 0, stopTimeHours: 0, stopTimeMinutes: 0, temperature: 0, threadStatus: 'Normal', group: form.group, factoryId: form.factoryId, ipAddress: form.ipAddress.trim() || undefined, telemetryProtocol: form.telemetryProtocol, telemetryEndpoint: form.telemetryEndpoint.trim(), telemetryDeviceId: form.telemetryDeviceId.trim(), telemetryApiKey: form.telemetryApiKey.trim() || undefined, telemetryPollingSeconds: Math.max(1, Number(form.telemetryPollingSeconds) || 10), temperatureAlertCelsius: Number(form.temperatureAlertCelsius) || 45, lowEfficiencyAlertPercent: Number(form.lowEfficiencyAlertPercent) || 70 });
    setShowAddModal(false);
    setFormError('');
    setForm(emptyForm);
  };

  return (
    <div className="space-y-5">
      {/* Top Header & Actions */}
      <div className="bg-white rounded-xl border border-slate-200/90 p-4 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* Search */}
        <div className="relative flex-1 min-w-[220px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by machine, brand, job..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-800 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:bg-white"
          />
        </div>

        {/* Filter & Action Buttons */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg font-semibold text-slate-700 cursor-pointer"
          >
            <option value="ALL">All Status</option>
            <option value="RUNNING">Running</option>
            <option value="IDLE">Idle</option>
            <option value="STOPPED">Stopped</option>
            <option value="OFFLINE">Offline</option>
          </select>

          {/* Brand Filter */}
          <select
            value={brandFilter}
            onChange={(e) => setBrandFilter(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg font-semibold text-slate-700 cursor-pointer"
          >
            <option value="ALL">All Brands</option>
            <option value="Tajima">Tajima</option>
            <option value="Barudan">Barudan</option>
            <option value="Happy">Happy</option>
          </select>

          {/* Export CSV */}
          <button
            onClick={handleExport}
            className="px-3 py-2 bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-lg font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>

          {/* Add Machine Button */}
          <button onClick={onAddMachineClick || (() => setShowAddModal(true))}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold flex items-center gap-1.5 shadow-xs shadow-blue-500/30 transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Machine</span>
          </button>
        </div>
      </div>

      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-label="Add machine">
          <form onSubmit={handleAddSubmit} className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl bg-white shadow-2xl border border-slate-200 p-5 space-y-4">
            <div className="flex items-center justify-between"><div><h2 className="text-lg font-bold text-slate-900">Add machine</h2><p className="text-xs text-slate-500">Configure identity and live telemetry before connecting it.</p></div><button type="button" onClick={() => setShowAddModal(false)} aria-label="Close"><X className="w-5 h-5 text-slate-500" /></button></div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {([['machineNumber','Machine number *'],['name','Machine name *'],['model','Model *'],['serialNumber','Serial number *'],['telemetryDeviceId','Telemetry device ID *'],['telemetryEndpoint','Telemetry endpoint *']] as const).map(([key,label]) => <label key={key} className="text-xs font-semibold text-slate-700">{label}<input required value={form[key]} onChange={(e) => updateForm(key,e.target.value)} className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm font-normal focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder={key === 'telemetryEndpoint' ? 'mqtt://broker or https://...' : ''} /></label>)}
              <label className="text-xs font-semibold text-slate-700">Brand<select value={form.brand} onChange={(e) => updateForm('brand',e.target.value)} className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm font-normal"><option>Tajima</option><option>Barudan</option><option>Happy</option><option>Other</option></select></label>
              <label className="text-xs font-semibold text-slate-700">Protocol<select value={form.telemetryProtocol} onChange={(e) => updateForm('telemetryProtocol',e.target.value)} className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm font-normal"><option>MQTT</option><option>WebSocket</option><option>HTTP Polling</option><option>OPC-UA</option></select></label>
              {([['headCount','Heads'],['needleCount','Needles']] as const).map(([key,label]) => <label key={key} className="text-xs font-semibold text-slate-700">{label}<input type="number" min="1" required value={form[key]} onChange={(e) => updateForm(key,e.target.value)} className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm font-normal" /></label>)}
              {([['maxSpeed','Max speed (SPM)'],['telemetryPollingSeconds','Polling interval (sec)'],['temperatureAlertCelsius','Temperature alert (°C)'],['lowEfficiencyAlertPercent','Low efficiency alert (%)'],['ipAddress','IP address / host'],['telemetryApiKey','Telemetry API key (optional)']] as const).map(([key,label]) => <label key={key} className="text-xs font-semibold text-slate-700">{label}<input type={key === 'telemetryApiKey' ? 'password' : key === 'ipAddress' ? 'text' : 'number'} min={key === 'telemetryPollingSeconds' ? '1' : '0'} value={form[key]} onChange={(e) => updateForm(key,e.target.value)} className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm font-normal" /></label>)}
              <label className="text-xs font-semibold text-slate-700">Production line<select value={form.group} onChange={(e) => updateForm('group',e.target.value)} className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm font-normal"><option>Line A</option><option>Line B</option><option>Cap Specialty</option></select></label>
            </div>
            {formError && <p className="rounded-lg bg-rose-50 px-3 py-2 text-xs font-semibold text-rose-700">{formError}</p>}
            <div className="flex justify-end gap-2"><button type="button" onClick={() => setShowAddModal(false)} className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600">Cancel</button><button type="submit" className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700">Add and connect</button></div>
          </form>
        </div>
      )}

      {/* Machine Data Table */}
      <div className="bg-white rounded-xl border border-slate-200/90 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-500 font-semibold text-[11px] uppercase tracking-wider">
                <th
                  onClick={() => handleSort('machineNumber')}
                  className="py-3 px-4 cursor-pointer hover:text-slate-800 select-none"
                >
                  <div className="flex items-center gap-1">
                    <span>Machine No</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th className="py-3 px-3">Machine Name</th>
                <th className="py-3 px-3">Brand / Model</th>
                <th className="py-3 px-3 text-center">Head/Needle</th>
                <th
                  onClick={() => handleSort('status')}
                  className="py-3 px-3 cursor-pointer hover:text-slate-800 select-none"
                >
                  <div className="flex items-center gap-1">
                    <span>Status</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort('speed')}
                  className="py-3 px-3 cursor-pointer hover:text-slate-800 select-none"
                >
                  <div className="flex items-center gap-1">
                    <span>Speed (SPM)</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort('stitchCount')}
                  className="py-3 px-3 cursor-pointer hover:text-slate-800 select-none"
                >
                  <div className="flex items-center gap-1">
                    <span>Stitch Count</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort('efficiency')}
                  className="py-3 px-3 cursor-pointer hover:text-slate-800 select-none"
                >
                  <div className="flex items-center gap-1">
                    <span>Efficiency</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th className="py-3 px-3">Current Job</th>
                <th className="py-3 px-3">Run Time</th>
                <th className="py-3 px-3">Stop Time</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredMachines.map((m) => (
                <tr
                  key={m.id}
                  onClick={() => handleRowClick(m.id)}
                  className="hover:bg-slate-50/80 cursor-pointer transition-colors group"
                >
                  <td className="py-3 px-4 font-bold text-slate-900 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-blue-600 group-hover:scale-125 transition-transform" />
                    <span>{m.machineNumber}</span>
                  </td>
                  <td className="py-3 px-3 font-semibold text-slate-800 truncate max-w-[140px]">
                    {m.name}
                  </td>
                  <td className="py-3 px-3 text-slate-500 font-medium">
                    <span className="font-semibold text-slate-700">{m.brand}</span>{' '}
                    <span className="text-[10px] text-slate-400">({m.model})</span>
                  </td>
                  <td className="py-3 px-3 text-center text-slate-600 font-semibold">
                    {m.headCount}/{m.needleCount}
                  </td>
                  <td className="py-3 px-3">
                    <StatusBadge status={m.status} size="xs" />
                  </td>
                  <td className="py-3 px-3 font-bold text-slate-900 tabular-nums">
                    {m.speed > 0 ? `${m.speed} SPM` : '0'}
                  </td>
                  <td className="py-3 px-3 font-bold text-slate-900 tabular-nums">
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
                  <td className="py-3 px-3 text-slate-800 font-semibold truncate max-w-[130px]">
                    {m.currentJob}
                  </td>
                  <td className="py-3 px-3 text-slate-600 font-medium whitespace-nowrap">
                    {m.runtimeHours}h {m.runtimeMinutes}m
                  </td>
                  <td className="py-3 px-3 text-slate-500 font-medium whitespace-nowrap">
                    {m.stopTimeHours}h {m.stopTimeMinutes}m
                  </td>
                  <td
                    className="py-3 px-4 text-right"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => handleRowClick(m.id)}
                        className="p-1 text-slate-400 hover:text-blue-600 rounded hover:bg-slate-100 cursor-pointer"
                        title="View Telemetry"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => deleteMachine(m.id)}
                        className="p-1 text-slate-400 hover:text-rose-600 rounded hover:bg-slate-100 cursor-pointer"
                        title="Delete Machine"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {/* Table Footer */}
        <div className="px-4 py-3 border-t border-slate-200/80 bg-slate-50/50 flex items-center justify-between text-xs text-slate-500">
          <span>
            Showing <strong>{filteredMachines.length}</strong> of <strong>{machines.length}</strong> registered machines
          </span>
          <span className="text-[11px] text-slate-400">
            Click any row to open comprehensive machine telemetry and diagnostics
          </span>
        </div>
      </div>
    </div>
  );
};
