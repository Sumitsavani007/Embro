import React, { useState } from 'react';
import {
  Layers,
  Search,
  Plus,
  Clock,
  CheckCircle2,
  AlertCircle,
  FileCode,
  Calendar,
  User,
  Cpu,
  ArrowRight,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { ProductionOrder } from '../../types';

export const OrdersScreen: React.FC = () => {
  const { orders, addOrder, updateOrder, machines, setSelectedMachineId, setCurrentRoute } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [isNewOrderModalOpen, setIsNewOrderModalOpen] = useState(false);

  // New order form state
  const [newOrderNumber, setNewOrderNumber] = useState(`ORD-2025-${Math.floor(100 + Math.random() * 900)}`);
  const [newCustomer, setNewCustomer] = useState('Zara Apparel Inc');
  const [newDesign, setNewDesign] = useState('Summer_Polo_Chest_Logo');
  const [newDesignFile, setNewDesignFile] = useState('Summer_Polo.dst');
  const [newStitchesPerUnit, setNewStitchesPerUnit] = useState(8500);
  const [newTargetUnits, setNewTargetUnits] = useState(1200);
  const [newColorCount, setNewColorCount] = useState(4);
  const [newAssignedMachine, setNewAssignedMachine] = useState('M1');
  const [newPriority, setNewPriority] = useState<'URGENT' | 'HIGH' | 'NORMAL'>('NORMAL');

  const filteredOrders = orders.map(order => ({
    ...order,
    customerName: order.customerName ?? order.clientName ?? '',
    designFile: order.designFile ?? order.designName,
    completedUnits: order.completedUnits ?? order.completedPieces ?? 0,
    targetUnits: order.targetUnits ?? order.totalPieces ?? 0,
    stitchesPerUnit: order.stitchesPerUnit ?? order.stitchCountPerPiece ?? 0,
    assignedMachine: order.assignedMachine ?? order.assignedMachines?.[0] ?? '',
    estimatedCompletionDate: order.estimatedCompletionDate ?? order.targetDeadline ?? 'Not scheduled',
  })).filter((o) => {
    const matchesSearch =
      o.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.designName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.designFile.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || o.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleCreateOrder = (e: React.FormEvent) => {
    e.preventDefault();
    const newOrd: ProductionOrder = {
      id: `ord-${Date.now()}`,
      orderNumber: newOrderNumber,
      clientName: newCustomer,
      customerName: newCustomer,
      designName: newDesign,
      designFile: newDesignFile,
      stitchesPerUnit: Number(newStitchesPerUnit),
      totalStitches: Number(newStitchesPerUnit) * Number(newTargetUnits),
      completedStitches: 0,
      targetUnits: Number(newTargetUnits),
      completedUnits: 0,
      assignedMachine: newAssignedMachine,
      operatorName: 'Ramesh Patel',
      shift: 'Shift 1',
      status: 'SCHEDULED',
      priority: newPriority,
      estimatedHours: Math.round((Number(newStitchesPerUnit) * Number(newTargetUnits)) / 48000),
      estimatedCompletionDate: '2025-04-22 18:00',
      colorChanges: Number(newColorCount),
      threadColors: ['#000000', '#1E40AF', '#EF4444', '#F59E0B'],
    };
    addOrder(newOrd);
    setIsNewOrderModalOpen(false);
  };

  const getPriorityBadge = (p: string) => {
    switch (p) {
      case 'URGENT':
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-800">URGENT</span>;
      case 'HIGH':
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">HIGH</span>;
      default:
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700">NORMAL</span>;
    }
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="bg-white rounded-xl border border-slate-200/90 p-4 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-bold text-slate-900 tracking-tight">
            Batch Orders & Production ETA Tracking
          </h2>
          <p className="text-xs text-slate-500 font-medium">
            Schedule embroidery runs, monitor pieces vs target, and forecast job completion
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 text-xs">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search order, customer, DST file..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg font-semibold text-slate-700 cursor-pointer"
          >
            <option value="ALL">All Status</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="SCHEDULED">Scheduled</option>
            <option value="COMPLETED">Completed</option>
          </select>

          <button
            onClick={() => setIsNewOrderModalOpen(true)}
            className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Production Job</span>
          </button>
        </div>
      </div>

      {/* Orders Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {filteredOrders.map((ord) => {
          const progressPercent = Math.min(
            100,
            Math.round((ord.completedUnits / (ord.targetUnits || 1)) * 100)
          );
          return (
            <div
              key={ord.id}
              className="bg-white rounded-xl border border-slate-200/90 p-5 shadow-xs hover:border-blue-300 transition-all space-y-4"
            >
              <div className="flex flex-col sm:flex-row items-start justify-between gap-3">
                <div>
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <span className="font-extrabold text-blue-600 text-sm">{ord.orderNumber}</span>
                    {getPriorityBadge(ord.priority)}
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                        ord.status === 'IN_PROGRESS'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : ord.status === 'COMPLETED'
                          ? 'bg-blue-50 text-blue-700 border border-blue-200'
                          : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      {ord.status.replace('_', ' ')}
                    </span>
                  </div>
                  <h3 className="font-bold text-slate-900 text-sm break-all">{ord.designName}</h3>
                  <p className="text-xs text-slate-500 font-medium">Customer: {ord.customerName}</p>
                </div>

                <div className="text-left sm:text-right min-w-0 break-all">
                  <span className="text-[11px] text-slate-400 font-mono block flex items-center justify-end gap-1">
                    <FileCode className="w-3 h-3 text-indigo-500" />
                    {ord.designFile}
                  </span>
                  <span className="text-[10px] text-slate-500">
                    {ord.colorChanges} Thread Colors
                  </span>
                </div>
              </div>

              {/* Progress Bar & Piece counts */}
              <div className="space-y-1.5 bg-slate-50 p-3 rounded-lg border border-slate-100">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-700">
                    {ord.completedUnits.toLocaleString()} / {ord.targetUnits.toLocaleString()} Pcs Completed
                  </span>
                  <span className="font-extrabold text-slate-900">{progressPercent}%</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                  <div
                    className="h-full bg-blue-600 rounded-full transition-all duration-500"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
                <div className="flex items-center justify-between text-[11px] text-slate-500 pt-0.5">
                  <span>{(ord.stitchesPerUnit * ord.completedUnits).toLocaleString()} stitches done</span>
                  <span>{ord.stitchesPerUnit.toLocaleString()} Stitches/Piece</span>
                </div>
              </div>

              {/* Details & ETA */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs pt-1 border-t border-slate-100">
                <div>
                  <span className="text-slate-400 block text-[10px]">Assigned Unit</span>
                  <button
                    onClick={() => {
                      setSelectedMachineId(machines.find(machine => machine.machineNumber === ord.assignedMachine)?.id || ord.assignedMachine);
                      setCurrentRoute('machine-detail');
                    }}
                    className="font-bold text-blue-600 hover:underline flex items-center gap-1 mt-0.5"
                  >
                    <Cpu className="w-3 h-3" />
                    {ord.assignedMachine}
                  </button>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Assigned Operator</span>
                  <span className="font-semibold text-slate-800 flex items-center gap-1 mt-0.5">
                    <User className="w-3 h-3 text-slate-400" />
                    {ord.operatorName}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Est. Hours</span>
                  <span className="font-semibold text-slate-800 flex items-center gap-1 mt-0.5">
                    <Clock className="w-3 h-3 text-slate-400" />
                    {ord.estimatedHours}h
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Target ETA</span>
                  <span className="font-semibold text-emerald-700 flex items-center gap-1 mt-0.5">
                    <Calendar className="w-3 h-3 text-emerald-600" />
                    {ord.estimatedCompletionDate.split(' ')[0]}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* New Order Modal */}
      {isNewOrderModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-200 max-w-lg w-full p-6 animate-in fade-in-50 zoom-in-95 max-h-[90vh] overflow-y-auto">
            <h3 className="text-base font-bold text-slate-900 mb-1">
              Create New Production Job / Batch Order
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Schedule embroidery batch with DST file specs and machine allocation
            </p>

            <form onSubmit={handleCreateOrder} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Order #</label>
                  <input
                    type="text"
                    value={newOrderNumber}
                    onChange={(e) => setNewOrderNumber(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg"
                    required
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Customer / Brand</label>
                  <input
                    type="text"
                    value={newCustomer}
                    onChange={(e) => setNewCustomer(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Design Name</label>
                <input
                  type="text"
                  value={newDesign}
                  onChange={(e) => setNewDesign(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Design File (.DST/.EMB)</label>
                  <input
                    type="text"
                    value={newDesignFile}
                    onChange={(e) => setNewDesignFile(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg font-mono"
                    required
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Color Stops</label>
                  <input
                    type="number"
                    value={newColorCount}
                    onChange={(e) => setNewColorCount(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Stitches Per Piece</label>
                  <input
                    type="number"
                    value={newStitchesPerUnit}
                    onChange={(e) => setNewStitchesPerUnit(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg"
                    required
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Total Garment Pcs</label>
                  <input
                    type="number"
                    value={newTargetUnits}
                    onChange={(e) => setNewTargetUnits(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Assign Machine</label>
                  <select
                    value={newAssignedMachine}
                    onChange={(e) => setNewAssignedMachine(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg"
                  >
                    {machines.map((m) => (
                      <option key={m.id} value={m.machineNumber}>
                        {m.machineNumber} - {m.name} ({m.headCount}H)
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Priority</label>
                  <select
                    value={newPriority}
                    onChange={(e) => setNewPriority(e.target.value as any)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg"
                  >
                    <option value="NORMAL">Normal</option>
                    <option value="HIGH">High Priority</option>
                    <option value="URGENT">Urgent Express</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsNewOrderModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold cursor-pointer shadow-xs"
                >
                  Create & Schedule Order
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
