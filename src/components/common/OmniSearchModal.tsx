import React, { useState, useEffect } from 'react';
import {
  Search,
  Cpu,
  Layers,
  Users,
  Package,
  Wrench,
  ShieldCheck,
  Calculator,
  Grid,
  Truck,
  ClipboardCheck,
  FileCode,
  X,
  ArrowRight,
  Zap,
  QrCode,
  CreditCard,
  MessageSquare,
} from 'lucide-react';
import { useApp, ScreenRoute } from '../../context/AppContext';

export const OmniSearchModal: React.FC = () => {
  const {
    isOmniSearchOpen,
    setIsOmniSearchOpen,
    machines,
    orders,
    operators,
    threadStock,
    setCurrentRoute,
    setSelectedMachineId,
    language,
    t,
  } = useApp();

  const [query, setQuery] = useState('');

  // Keyboard shortcut Ctrl+K / Cmd+K listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsOmniSearchOpen((prev) => !prev);
      } else if (e.key === 'Escape' && isOmniSearchOpen) {
        setIsOmniSearchOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOmniSearchOpen, setIsOmniSearchOpen]);

  if (!isOmniSearchOpen) return null;

  const q = query.toLowerCase().trim();

  // Navigation shortcuts
  const navShortcuts: { label: string; route: ScreenRoute; icon: React.ElementType }[] = [
    { label: 'WhatsApp Alerts & Instant Updates (વોટ્સએપ)', route: 'whatsapp-hub', icon: MessageSquare },
    { label: 'Electricity & DG Power Factor Monitoring (વીજળી)', route: 'power-monitoring', icon: Zap },
    { label: 'Machine QR Badges & Bundle Barcodes (QR કોડ)', route: 'machine-qr', icon: QrCode },
    { label: 'Operator Attendance & Khata Salary (કારીગર ખાતાવહી)', route: 'operator-khata', icon: CreditCard },
    { label: 'Live Status Screen', route: 'live-status', icon: Cpu },
    { label: 'DST Stitch Simulator', route: 'design-visualizer', icon: FileCode },
    { label: 'Jobwork Costing & Rate Calculator', route: 'jobwork-costing', icon: Calculator },
    { label: 'Multi-Head Solenoid Matrix', route: 'head-matrix', icon: Grid },
    { label: 'Batch Orders & Real-time ETA', route: 'orders', icon: Layers },
    { label: 'Delivery Challan & Gatepass', route: 'dispatch-challan', icon: Truck },
    { label: 'Shift Handover Register', route: 'shift-handover', icon: ClipboardCheck },
    { label: 'Downtime Pareto & OEE', route: 'downtime-analytics', icon: Wrench },
    { label: 'Thread & Bobbin Inventory', route: 'thread-inventory', icon: Package },
    { label: 'Quality Control (QC AQL 1.5)', route: 'quality-control', icon: ShieldCheck },
  ];

  const matchedScreens = navShortcuts.filter((s) => s.label.toLowerCase().includes(q));
  const matchedMachines = machines.filter(
    (m) =>
      m.machineNumber.toLowerCase().includes(q) ||
      m.name.toLowerCase().includes(q) ||
      m.model.toLowerCase().includes(q)
  );
  const matchedOrders = orders.filter(
    (o) =>
      o.orderNumber.toLowerCase().includes(q) ||
      (o.clientName ?? o.customerName ?? '').toLowerCase().includes(q) ||
      o.designName.toLowerCase().includes(q)
  );
  const matchedOperators = operators.filter(
    (op) =>
      op.name.toLowerCase().includes(q) ||
      op.assignedMachine.toLowerCase().includes(q) ||
      op.shift.toLowerCase().includes(q)
  );

  const handleSelectRoute = (route: ScreenRoute) => {
    setCurrentRoute(route);
    setIsOmniSearchOpen(false);
  };

  const handleSelectMachine = (machineNum: string) => {
    setSelectedMachineId(machines.find(machine => machine.machineNumber === machineNum)?.id || machineNum);
    setCurrentRoute('machine-detail');
    setIsOmniSearchOpen(false);
  };

  return (
    <div role="dialog" aria-modal="true" aria-label="Search workspace" onClick={() => setIsOmniSearchOpen(false)} className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-start justify-center pt-4 sm:pt-20 px-3 sm:px-4">
      <div onClick={event => event.stopPropagation()} className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-2xl w-full overflow-hidden animate-in fade-in-50 zoom-in-95">
        {/* Search Input Bar */}
        <div className="p-4 border-b border-slate-100 flex items-center gap-3 bg-slate-50/50">
          <Search className="w-5 h-5 text-slate-400 shrink-0" />
          <input
            type="text"
            placeholder="Search machines, orders, operators, or screen modules..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
            aria-label="Search workspace"
            className="min-w-0 w-full bg-transparent border-none outline-none text-sm font-semibold text-slate-900 placeholder:text-slate-400"
          />
          <button
            aria-label="Close search"
            onClick={() => setIsOmniSearchOpen(false)}
            className="p-1 rounded-lg hover:bg-slate-200 text-slate-400 hover:text-slate-700 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Results Body */}
        <div className="max-h-[60dvh] overflow-y-auto p-3 space-y-4 text-xs">
          {/* Screens Section */}
          {matchedScreens.length > 0 && (
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-2 block mb-1">
                Navigation Modules
              </span>
              <div className="space-y-1">
                {matchedScreens.slice(0, 4).map((s) => {
                  const Icon = s.icon;
                  return (
                    <button
                      key={s.route}
                      onClick={() => handleSelectRoute(s.route)}
                      className="w-full text-left p-2 rounded-lg hover:bg-blue-50 hover:text-blue-700 flex items-center justify-between transition-colors group cursor-pointer"
                    >
                      <div className="flex items-center gap-2.5">
                        <Icon className="w-4 h-4 text-slate-500 group-hover:text-blue-600" />
                        <span className="font-semibold text-slate-800 group-hover:text-blue-700">
                          {s.label}
                        </span>
                      </div>
                      <ArrowRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-blue-600" />
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Machines Section */}
          {matchedMachines.length > 0 && (
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-2 block mb-1">
                Embroidery Machines
              </span>
              <div className="grid grid-cols-2 gap-1.5">
                {matchedMachines.slice(0, 6).map((m) => (
                  <button
                    key={m.id}
                    onClick={() => handleSelectMachine(m.machineNumber)}
                    className="text-left p-2 rounded-lg hover:bg-slate-100 flex items-center justify-between border border-slate-100 cursor-pointer"
                  >
                    <div>
                      <span className="font-bold text-slate-900 block">{m.machineNumber}</span>
                      <span className="text-[11px] text-slate-500 truncate block max-w-[180px]">
                        {m.name}
                      </span>
                    </div>
                    <span
                      className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                        m.status === 'RUNNING'
                          ? 'bg-emerald-100 text-emerald-800'
                          : m.status === 'STOPPED'
                          ? 'bg-rose-100 text-rose-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {m.status}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Orders Section */}
          {matchedOrders.length > 0 && (
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-2 block mb-1">
                Production Orders
              </span>
              <div className="space-y-1">
                {matchedOrders.slice(0, 3).map((o) => (
                  <button
                    key={o.id}
                    onClick={() => handleSelectRoute('orders')}
                    className="w-full text-left p-2 rounded-lg hover:bg-slate-50 flex flex-wrap gap-2 items-center justify-between border border-slate-100 cursor-pointer"
                  >
                    <div>
                      <span className="font-mono font-bold text-blue-600 mr-2">{o.orderNumber}</span>
                      <span className="font-semibold text-slate-800">{o.clientName}</span>
                      <span className="text-slate-400 text-[11px] ml-2">({o.designName})</span>
                    </div>
                    <span className="font-bold text-slate-700">{o.quantityCompleted ?? o.completedUnits ?? o.completedPieces ?? 0} / {o.totalGarments ?? o.targetUnits ?? o.totalPieces ?? 0} pcs</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Operators */}
          {matchedOperators.length > 0 && (
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-2 block mb-1">
                Floor Operators
              </span>
              <div className="grid grid-cols-2 gap-1.5">
                {matchedOperators.slice(0, 4).map((op) => (
                  <button
                    key={op.id}
                    onClick={() => handleSelectRoute('operators')}
                    className="text-left p-2 rounded-lg hover:bg-slate-50 flex items-center gap-2 border border-slate-100 cursor-pointer"
                  >
                    <img src={op.avatarUrl || op.avatar} alt={op.name} className="w-6 h-6 rounded-full object-cover" />
                    <div>
                      <span className="font-bold text-slate-900 block">{op.name}</span>
                      <span className="text-[10px] text-slate-400">
                        {op.assignedMachine} • {op.shift}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {q && matchedScreens.length === 0 && matchedMachines.length === 0 && matchedOrders.length === 0 && matchedOperators.length === 0 && (
            <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 p-8 text-center">
              <Search className="mx-auto mb-2 h-6 w-6 text-slate-300" />
              <p className="text-sm font-semibold text-slate-700">No results found</p>
              <p className="mt-1 text-xs text-slate-400">Try a machine number, order, operator or module name.</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400 font-medium">
          <span>Press ESC to dismiss</span>
          <span>Tip: Jump directly to any machine or DST stitch file</span>
        </div>
      </div>
    </div>
  );
};
