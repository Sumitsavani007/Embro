import React, { useState } from 'react';
import {
  Users,
  Award,
  Search,
  Plus,
  Calendar,
  Layers,
  CheckCircle2,
  TrendingUp,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Operator } from '../../types';
import { KpiCard } from '../common/KpiCard';
import { OperatorKhataScreen } from './OperatorKhataScreen';

export const OperatorsScreen: React.FC = () => {
  const { operators, machines, setSelectedMachineId, setCurrentRoute } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [shiftFilter, setShiftFilter] = useState('ALL');

  const filteredOperators = operators.filter((op) => {
    const matchesSearch =
      op.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      op.assignedMachine.toLowerCase().includes(searchQuery.toLowerCase()) ||
      op.shift.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesShift = shiftFilter === 'ALL' || op.shift.includes(shiftFilter);
    return matchesSearch && matchesShift;
  });

  const avgEfficiency = Math.round(
    operators.reduce((acc, o) => acc + o.efficiency, 0) / (operators.length || 1)
  );

  const totalBonusAccrued = operators.reduce((acc, o) => acc + (o.bonusAccrued ?? o.incentiveBonusINR), 0);

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="bg-white rounded-xl border border-slate-200/90 p-4 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-bold text-slate-900 tracking-tight">
            Operator Rostering & Piece-Rate Performance
          </h2>
          <p className="text-xs text-slate-500 font-medium">
            Shift machine allocations, hourly stitch outputs, and efficiency bonus logs
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 text-xs">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search operator, machine..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs"
            />
          </div>

          <select
            value={shiftFilter}
            onChange={(e) => setShiftFilter(e.target.value)}
            className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg font-semibold text-slate-700 cursor-pointer"
          >
            <option value="ALL">All Shifts</option>
            <option value="Shift 1">Shift 1</option>
            <option value="Shift 2">Shift 2</option>
            <option value="Shift 3">Shift 3</option>
          </select>
        </div>
      </div>

      {/* Top 3 KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <KpiCard
          title="Active Floor Operators"
          value={operators.length}
          subValue="Present Across 3 Shifts"
          icon={Users}
          iconColor="text-blue-600"
          iconBg="bg-blue-50"
        />
        <KpiCard
          title="Mean Operator Efficiency"
          value={`${avgEfficiency}%`}
          subValue="Quota achievement factor"
          icon={TrendingUp}
          iconColor="text-emerald-600"
          iconBg="bg-emerald-50"
        />
        <KpiCard
          title="Total Piece Bonus (Today)"
          value={`₹${totalBonusAccrued.toLocaleString()}`}
          subValue="Accrued production incentive"
          icon={Award}
          iconColor="text-amber-600"
          iconBg="bg-amber-50"
        />
      </div>

      {/* Operator Roster Table */}
      <div className="bg-white rounded-xl border border-slate-200/90 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-400 font-semibold text-[11px] uppercase">
                <th className="py-3 px-4">Operator Name</th>
                <th className="py-3 px-3">Assigned Machine</th>
                <th className="py-3 px-3">Shift</th>
                <th className="py-3 px-3">Stitches Produced</th>
                <th className="py-3 px-3">Efficiency</th>
                <th className="py-3 px-3">Breakage Handling</th>
                <th className="py-3 px-4 text-right">Piece Bonus</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700 font-medium">
              {filteredOperators.map((op) => (
                <tr key={op.id} className="hover:bg-slate-50">
                  <td className="py-3 px-4 font-bold text-slate-900 flex items-center gap-2.5">
                    <img
                      src={(op.avatarUrl || op.avatar)}
                      alt={op.name}
                      className="w-7 h-7 rounded-full object-cover ring-1 ring-slate-200"
                    />
                    <span>{op.name}</span>
                  </td>
                  <td className="py-3 px-3">
                    <button
                      onClick={() => {
                        setSelectedMachineId(op.assignedMachine);
                        setCurrentRoute('machine-detail');
                      }}
                      className="font-bold text-blue-600 hover:underline"
                    >
                      {op.assignedMachine}
                    </button>
                  </td>
                  <td className="py-3 px-3 text-slate-600">{op.shift}</td>
                  <td className="py-3 px-3 font-bold text-slate-900 tabular-nums">
                    {(op.stitchesProduced ?? op.stitchesToday).toLocaleString()}
                  </td>
                  <td className="py-3 px-3">
                    <div className="flex items-center gap-2">
                      <div className="w-14 bg-slate-100 rounded-full h-1.5 overflow-hidden">
                        <div
                          className={`h-full rounded-full ${
                            op.efficiency >= 90
                              ? 'bg-emerald-500'
                              : op.efficiency >= 80
                              ? 'bg-blue-500'
                              : 'bg-amber-500'
                          }`}
                          style={{ width: `${op.efficiency}%` }}
                        />
                      </div>
                      <span className="font-bold text-slate-800">{op.efficiency}%</span>
                    </div>
                  </td>
                  <td className="py-3 px-3 text-slate-500">{op.breakageCount ?? op.threadBreaksResolved} breaks resolved</td>
                  <td className="py-3 px-4 text-right font-bold text-emerald-600">
                    +₹{op.bonusAccrued ?? op.incentiveBonusINR}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Unified operator workspace: attendance, khata and payroll stay in the same module. */}
      <OperatorKhataScreen />
    </div>
  );
};
