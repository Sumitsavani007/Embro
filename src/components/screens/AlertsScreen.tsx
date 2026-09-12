import React, { useState } from 'react';
import {
  Bell,
  AlertTriangle,
  Info,
  CheckCircle2,
  Trash2,
  Check,
  Search,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const AlertsScreen: React.FC = () => {
  const { alerts, markAlertAsRead, markAllAlertsAsRead, clearAlert, setCurrentRoute, setSelectedMachineId } = useApp();
  const [filterSeverity, setFilterSeverity] = useState('ALL');
  const [filterRead, setFilterRead] = useState('ALL');

  const filteredAlerts = alerts.filter((a) => {
    const matchesSeverity = filterSeverity === 'ALL' || a.severity === filterSeverity;
    const matchesRead = filterRead === 'ALL' || (filterRead === 'UNREAD' ? !a.isRead : a.isRead);
    return matchesSeverity && matchesRead;
  });

  const getSeverityBadge = (sev: string) => {
    switch (sev) {
      case 'CRITICAL':
        return (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-800 border border-rose-200">
            Critical
          </span>
        );
      case 'WARNING':
        return (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-200">
            Warning
          </span>
        );
      default:
        return (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800 border border-blue-200">
            Info
          </span>
        );
    }
  };

  const getSeverityIcon = (sev: string) => {
    switch (sev) {
      case 'CRITICAL':
        return <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0" />;
      case 'WARNING':
        return <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />;
      default:
        return <Info className="w-5 h-5 text-blue-600 shrink-0" />;
    }
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="bg-white rounded-xl border border-slate-200/90 p-4 shadow-xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-bold text-slate-900 tracking-tight">
            Factory Floor Alerts & Notifications
          </h2>
          <p className="text-xs text-slate-500 font-medium">
            Real-time critical alarms, thread break notices, and maintenance reminders
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 text-xs">
          <select
            value={filterSeverity}
            onChange={(e) => setFilterSeverity(e.target.value)}
            className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg font-semibold text-slate-700 cursor-pointer"
          >
            <option value="ALL">All Severities</option>
            <option value="CRITICAL">Critical Only</option>
            <option value="WARNING">Warning Only</option>
            <option value="INFO">Info Only</option>
          </select>

          <select
            value={filterRead}
            onChange={(e) => setFilterRead(e.target.value)}
            className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg font-semibold text-slate-700 cursor-pointer"
          >
            <option value="ALL">All Alerts</option>
            <option value="UNREAD">Unread Only</option>
            <option value="READ">Read Only</option>
          </select>

          <button
            onClick={markAllAlertsAsRead}
            className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Check className="w-3.5 h-3.5 text-slate-600" />
            <span>Mark All as Read</span>
          </button>
        </div>
      </div>

      {/* Alert List */}
      <div className="space-y-3">
        {filteredAlerts.length > 0 ? (
          filteredAlerts.map((alert) => (
            <div
              key={alert.id}
              className={`p-4 rounded-xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                alert.isRead
                  ? 'bg-white border-slate-200/80 opacity-80'
                  : 'bg-white border-blue-200 shadow-xs ring-1 ring-blue-500/10'
              }`}
            >
              <div className="flex items-start gap-3.5">
                {getSeverityIcon(alert.severity)}
                <div>
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    {alert.machineNumber && (
                      <button
                        onClick={() => {
                          setSelectedMachineId(alert.machineNumber!);
                          setCurrentRoute('machine-detail');
                        }}
                        className="px-2 py-0.5 rounded font-mono font-bold text-xs bg-slate-100 text-slate-800 hover:bg-blue-100 hover:text-blue-700 transition-colors"
                      >
                        {alert.machineNumber}
                      </button>
                    )}
                    <h3 className="text-sm font-bold text-slate-900">{alert.title}</h3>
                    {getSeverityBadge(alert.severity)}
                    {!alert.isRead && (
                      <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
                    )}
                  </div>
                  <p className="text-xs text-slate-600">{alert.message}</p>
                  <span className="text-[11px] text-slate-400 font-mono mt-1 block">
                    {alert.timestamp}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                {!alert.isRead && (
                  <button
                    onClick={() => markAlertAsRead(alert.id)}
                    className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-semibold rounded-lg flex items-center gap-1 transition-colors cursor-pointer"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Acknowledge</span>
                  </button>
                )}
                <button
                  onClick={() => clearAlert(alert.id)}
                  className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                  title="Dismiss Alert"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
            <Bell className="w-8 h-8 text-slate-300 mx-auto mb-2" />
            <p className="text-slate-500 font-medium text-sm">
              No alerts match your filter criteria.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
