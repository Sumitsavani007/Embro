import React, { useState } from 'react';
import {
  Search,
  Maximize2,
  Minimize2,
  Gauge,
  Layers,
  Clock,
  Plus,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { StatusBadge } from '../common/StatusBadge';

export const LiveStatusScreen: React.FC = () => {
  const { machines, addMachine, setSelectedMachineId, setCurrentRoute, isSimulating } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [groupFilter, setGroupFilter] = useState<string>('ALL');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showAddMachine, setShowAddMachine] = useState(false);
  const [newMachine, setNewMachine] = useState({ number: '', name: '', model: '', deviceId: '', endpoint: '' });
  const [addError, setAddError] = useState('');

  const handleAddMachine = (event: React.FormEvent) => {
    event.preventDefault();
    if (Object.values(newMachine).some((value) => !value.trim())) { setAddError('All machine and live connection fields are required.'); return; }
    if (machines.some((machine) => machine.machineNumber.toLowerCase() === newMachine.number.trim().toLowerCase())) { setAddError('Machine number already exists.'); return; }
    addMachine({ machineNumber: newMachine.number.trim(), name: newMachine.name.trim(), brand: 'Other', model: newMachine.model.trim(), serialNumber: newMachine.deviceId.trim(), headCount: 1, needleCount: 1, maxSpeed: 1000, status: 'OFFLINE', speed: 0, stitchCount: 0, efficiency: 0, currentJob: 'Telemetry connection pending', runtimeHours: 0, runtimeMinutes: 0, stopTimeHours: 0, stopTimeMinutes: 0, temperature: 0, threadStatus: 'Normal', group: 'Line A', factoryId: 'f1', telemetryProtocol: 'HTTP Polling', telemetryEndpoint: newMachine.endpoint.trim(), telemetryDeviceId: newMachine.deviceId.trim(), telemetryPollingSeconds: 10 });
    setNewMachine({ number: '', name: '', model: '', deviceId: '', endpoint: '' }); setAddError(''); setShowAddMachine(false);
  };

  const filteredMachines = machines.filter((m) => {
    const matchesSearch =
      m.machineNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.currentJob.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || m.status === statusFilter;
    const matchesGroup = groupFilter === 'ALL' || m.group === groupFilter;
    return matchesSearch && matchesStatus && matchesGroup;
  });

  const handleCardClick = (id: string) => {
    setSelectedMachineId(id);
    setCurrentRoute('machine-detail');
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
      }
      setIsFullscreen(false);
    }
  };

  return (
    <div className={`space-y-5 ${isFullscreen ? 'p-6 bg-slate-900 text-white min-h-screen' : ''}`}>
      {/* Top Filter and Search Bar */}
      <div className="bg-white rounded-xl border border-slate-200/90 p-4 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* Search */}
        <div className="relative flex-1 min-w-[200px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search machine no. / name / job..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-800 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
          />
        </div>

        {/* Filter Controls */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg font-semibold text-slate-700 focus:outline-hidden focus:ring-2 focus:ring-blue-500 cursor-pointer"
          >
            <option value="ALL">All Status</option>
            <option value="RUNNING">Running Only</option>
            <option value="IDLE">Idle Only</option>
            <option value="STOPPED">Stopped Only</option>
            <option value="OFFLINE">Offline Only</option>
          </select>

          {/* Group Filter */}
          <select
            value={groupFilter}
            onChange={(e) => setGroupFilter(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg font-semibold text-slate-700 focus:outline-hidden focus:ring-2 focus:ring-blue-500 cursor-pointer"
          >
            <option value="ALL">All Lines</option>
            <option value="Line A">Line A</option>
            <option value="Line B">Line B</option>
            <option value="Cap Specialty">Cap Specialty</option>
          </select>

          <button onClick={() => setShowAddMachine(true)} className="px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"><Plus className="w-4 h-4" />Add Machine</button>
          {/* Fullscreen Kiosk Mode Toggle */}
          <button
            onClick={toggleFullscreen}
            className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
            title="Toggle Fullscreen Factory Floor Kiosk View"
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            <span className="hidden sm:inline">{isFullscreen ? 'Exit Kiosk' : 'Floor Kiosk'}</span>
          </button>
        </div>
      </div>

      {/* Summary Chips */}
      <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 font-medium">
        <span>Showing {filteredMachines.length} of {machines.length} machines</span>
        {isSimulating && (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[11px] font-semibold">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
            Live Stitch Telemetry Active
          </span>
        )}
      </div>

      {/* Grid of Live Machine Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredMachines.map((machine) => {
          const isRunning = machine.status === 'RUNNING';
          const isStopped = machine.status === 'STOPPED';

          return (
            <div
              key={machine.id}
              onClick={() => handleCardClick(machine.id)}
              className={`bg-white rounded-xl border p-4.5 shadow-xs hover:shadow-md transition-all duration-200 cursor-pointer relative group flex flex-col justify-between ${
                isRunning
                  ? 'border-emerald-200/80 hover:border-emerald-400'
                  : isStopped
                  ? 'border-rose-200/80 hover:border-rose-400'
                  : 'border-slate-200/90 hover:border-blue-400'
              }`}
            >
              {/* Card Header: Machine tag + Status Badge */}
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-base font-extrabold text-slate-900 tracking-tight">
                      {machine.machineNumber}
                    </span>
                    <span className="text-[11px] text-slate-400 font-medium truncate max-w-[100px]">
                      {machine.brand}
                    </span>
                  </div>
                  <StatusBadge status={machine.status} size="xs" />
                </div>

                {/* Current Job */}
                <div className="mb-4">
                  <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-0.5">
                    Current Job
                  </span>
                  <p className="text-sm font-bold text-slate-800 truncate" title={machine.currentJob}>
                    {machine.currentJob}
                  </p>
                </div>

                {/* Metrics Grid */}
                <div className="grid grid-cols-2 gap-3 py-2 border-t border-b border-slate-100 mb-3 text-xs">
                  <div>
                    <span className="text-slate-400 text-[11px] font-medium flex items-center gap-1">
                      <Gauge className="w-3 h-3 text-blue-500" />
                      Speed
                    </span>
                    <span className="text-sm font-extrabold text-slate-900 block mt-0.5 tabular-nums">
                      {machine.speed} <span className="text-[10px] font-normal text-slate-500">SPM</span>
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[11px] font-medium flex items-center gap-1">
                      <Layers className="w-3 h-3 text-indigo-500" />
                      Stitch Count
                    </span>
                    <span className="text-sm font-extrabold text-slate-900 block mt-0.5 tabular-nums">
                      {machine.stitchCount.toLocaleString()}
                    </span>
                  </div>
                </div>

                {/* Efficiency progress bar */}
                <div className="space-y-1 mb-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-500 font-medium text-[11px]">Efficiency</span>
                    <span className="font-bold text-slate-800">{machine.efficiency}%</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        machine.efficiency >= 85
                          ? 'bg-emerald-500'
                          : machine.efficiency > 0
                          ? 'bg-amber-500'
                          : 'bg-slate-300'
                      }`}
                      style={{ width: `${machine.efficiency}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Card Footer: Runtime info & Hover action hint */}
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                <div className="flex items-center gap-1">
                  <Clock className="w-3 h-3 text-slate-400" />
                  <span>
                    Run: <strong>{machine.runtimeHours}h {machine.runtimeMinutes}m</strong>
                  </span>
                </div>
                <span className="text-blue-600 font-semibold group-hover:translate-x-0.5 transition-transform">
                  View Detail &rarr;
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {filteredMachines.length === 0 && (
        <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
          <p className="text-slate-500 font-medium">No machines found matching your filter criteria.</p>
          <button
            onClick={() => {
              setSearchTerm('');
              setStatusFilter('ALL');
              setGroupFilter('ALL');
            }}
            className="mt-3 px-4 py-2 bg-blue-600 text-white rounded-lg text-xs font-semibold hover:bg-blue-700 transition-colors cursor-pointer"
          >
            Reset Filters
          </button>
        </div>
      )}

      {showAddMachine && <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4"><form onSubmit={handleAddMachine} className="w-full max-w-lg rounded-2xl bg-white p-5 shadow-2xl space-y-4"><div><h2 className="text-lg font-bold text-slate-900">Add machine to live monitoring</h2><p className="text-xs text-slate-500">Connect the machine now; detailed setup stays with its monitoring record.</p></div><div className="grid sm:grid-cols-2 gap-3">{([['number','Machine number'],['name','Machine name'],['model','Model'],['deviceId','Telemetry device ID'],['endpoint','Telemetry endpoint']] as const).map(([key,label]) => <label key={key} className="text-xs font-semibold text-slate-700">{label} *<input required value={newMachine[key]} onChange={(event) => setNewMachine((prev) => ({ ...prev, [key]: event.target.value }))} className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm font-normal" placeholder={key === 'endpoint' ? 'https:// or mqtt://' : ''} /></label>)}</div>{addError && <p className="rounded-lg bg-rose-50 p-2 text-xs font-semibold text-rose-700">{addError}</p>}<div className="flex justify-end gap-2"><button type="button" onClick={() => setShowAddMachine(false)} className="rounded-lg border px-4 py-2 text-sm font-semibold text-slate-600">Cancel</button><button type="submit" className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white">Add to live monitoring</button></div></form></div>}
    </div>
  );
};
