import React from 'react';
import {
  X,
  Bell,
  CheckCircle2,
  AlertTriangle,
  Info,
  ExternalLink,
  Trash2,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const AlertDrawer: React.FC = () => {
  const {
    isAlertDrawerOpen,
    setIsAlertDrawerOpen,
    alerts,
    machines,
    markAlertRead,
    markAllAlertsRead,
    setSelectedMachineId,
    setCurrentRoute,
    language,
  } = useApp();

  // Close on Escape key
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isAlertDrawerOpen) {
        setIsAlertDrawerOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isAlertDrawerOpen, setIsAlertDrawerOpen]);

  if (!isAlertDrawerOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 overflow-hidden bg-slate-900/50 backdrop-blur-xs flex justify-end transition-opacity"
      onClick={() => setIsAlertDrawerOpen(false)}
      role="dialog"
      aria-modal="true"
      aria-label="Factory alerts"
    >
      <div
        className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drawer Header */}
        <div className="p-4 border-b border-slate-100 flex flex-wrap gap-3 items-center justify-between">
          <div className="flex items-center gap-2">
            <Bell className="w-4 h-4 text-blue-600" />
            <h3 className="font-bold text-slate-900 text-sm">
              Factory Alerts & Alarms
            </h3>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700">
              {alerts.length} Total
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={markAllAlertsRead}
              className="text-[11px] font-semibold text-blue-600 hover:text-blue-800 cursor-pointer"
            >
              Mark all read
            </button>
            <button
              aria-label="Close alerts"
              onClick={() => setIsAlertDrawerOpen(false)}
              className="p-1 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Alerts List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 text-xs">
          {alerts.map((alert) => (
            <div
              key={alert.id}
              className={`p-3.5 rounded-xl border transition-all ${
                alert.isRead
                  ? 'bg-slate-50/70 border-slate-200 text-slate-600'
                  : alert.severity === 'CRITICAL'
                  ? 'bg-rose-50/60 border-rose-200 text-rose-950 shadow-xs'
                  : alert.severity === 'WARNING'
                  ? 'bg-amber-50/60 border-amber-200 text-amber-950 shadow-xs'
                  : 'bg-blue-50/60 border-blue-200 text-blue-950 shadow-xs'
              }`}
            >
              <div className="flex items-start justify-between gap-2 mb-1.5">
                <div className="flex items-center gap-2">
                  <span
                    className={`w-2 h-2 rounded-full ${
                      alert.severity === 'CRITICAL'
                        ? 'bg-rose-500 animate-ping'
                        : alert.severity === 'WARNING'
                        ? 'bg-amber-500'
                        : 'bg-blue-500'
                    }`}
                  />
                  <strong className="font-bold text-slate-900 text-xs">
                    {alert.title || `${alert.machineNumber || 'System'} · ${alert.severity === 'CRITICAL' ? 'Critical alert' : alert.severity === 'WARNING' ? 'Warning' : 'Notification'}`}
                  </strong>
                </div>
                <span className="text-[10px] font-mono text-slate-400">
                  {alert.time}
                </span>
              </div>

              <p className="text-slate-700 text-xs mb-3">{alert.message}</p>

              <div className="flex items-center justify-between pt-2 border-t border-slate-200/60 text-[11px]">
                {alert.machineNumber ? (
                  <button
                    onClick={() => {
                      setSelectedMachineId(machines.find(machine => machine.machineNumber === alert.machineNumber)?.id || alert.machineNumber!);
                      setCurrentRoute('machine-detail');
                      setIsAlertDrawerOpen(false);
                    }}
                    className="font-bold text-blue-600 hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <span>View {alert.machineNumber}</span>
                    <ExternalLink className="w-3 h-3" />
                  </button>
                ) : (
                  <span className="text-slate-400">System Notification</span>
                )}

                {!alert.isRead && (
                  <button
                    onClick={() => markAlertRead(alert.id)}
                    className="text-slate-500 hover:text-slate-800 font-semibold cursor-pointer"
                  >
                    Dismiss
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
