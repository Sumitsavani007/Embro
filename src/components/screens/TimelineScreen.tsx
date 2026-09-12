import React, { useState } from 'react';
import {
  Clock,
  Filter,
  Play,
  Square,
  AlertTriangle,
  RefreshCw,
  Search,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const TimelineScreen: React.FC = () => {
  const { timelineEvents, setCurrentRoute, setSelectedMachineId } = useApp();
  const [filterType, setFilterType] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredEvents = timelineEvents.filter((ev) => {
    const matchesFilter = filterType === 'ALL' || ev.eventType === filterType;
    const matchesSearch =
      ev.machineNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ev.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ev.eventType.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const getEventIcon = (type: string, status: string) => {
    if (type.includes('Start') || status === 'Normal') {
      return <Play className="w-3.5 h-3.5 text-emerald-600" />;
    }
    if (type.includes('Stop') || status === 'Critical') {
      return <Square className="w-3.5 h-3.5 text-rose-600" />;
    }
    if (type.includes('Thread') || status === 'Warning') {
      return <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />;
    }
    return <RefreshCw className="w-3.5 h-3.5 text-blue-600" />;
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="bg-white rounded-xl border border-slate-200/90 p-4 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-bold text-slate-900 tracking-tight">
            Event Timeline
          </h2>
          <p className="text-xs text-slate-500 font-medium">
            Chronological audit log of all machine states, alarms, and operator triggers
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 text-xs">
          {/* Search */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search timeline..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs"
            />
          </div>

          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg font-semibold text-slate-700 cursor-pointer"
          >
            <option value="ALL">All Event Types</option>
            <option value="Machine Start">Machine Start</option>
            <option value="Machine Stop">Machine Stop</option>
            <option value="Thread Break">Thread Break</option>
            <option value="Job Change">Job Change</option>
          </select>
        </div>
      </div>

      {/* Timeline Stream */}
      <div className="bg-white rounded-xl border border-slate-200/90 p-6 shadow-xs">
        <div className="relative pl-6 border-l-2 border-slate-200 space-y-6">
          {filteredEvents.map((item) => (
            <div key={item.id} className="relative group">
              {/* Timeline marker node */}
              <div
                className={`absolute -left-[31px] top-1.5 w-6 h-6 rounded-full border-2 border-white shadow-xs flex items-center justify-center ${
                  item.status === 'Critical'
                    ? 'bg-rose-100'
                    : item.status === 'Warning'
                    ? 'bg-amber-100'
                    : 'bg-emerald-100'
                }`}
              >
                {getEventIcon(item.eventType, item.status)}
              </div>

              {/* Event card content */}
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 hover:border-blue-200 hover:bg-blue-50/30 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <button
                      onClick={() => {
                        setSelectedMachineId(item.machineNumber);
                        setCurrentRoute('machine-detail');
                      }}
                      className="font-extrabold text-blue-600 hover:underline text-xs"
                    >
                      {item.machineNumber}
                    </button>
                    <span className="font-bold text-slate-900 text-xs">{item.eventType}</span>
                    <span
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                        item.status === 'Critical'
                          ? 'bg-rose-100 text-rose-800'
                          : item.status === 'Warning'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-emerald-100 text-emerald-800'
                      }`}
                    >
                      {item.status}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600">{item.description}</p>
                </div>

                <div className="flex items-center gap-2 text-[11px] text-slate-400 font-mono shrink-0">
                  <Clock className="w-3 h-3" />
                  <span>{item.time}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
