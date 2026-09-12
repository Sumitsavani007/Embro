import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Users,
  CalendarCheck,
  CreditCard,
  Receipt,
  Plus,
  Share2,
  Printer,
  Clock,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  DollarSign,
  X,
  FileSpreadsheet,
} from 'lucide-react';
import { exportToCsv } from '../../utils/exportCsv';

export const OperatorKhataScreen: React.FC = () => {
  const {
    operatorAttendance,
    markAttendance,
    operatorKhata,
    addKhataEntry,
    salarySlips,
    sendSalarySlipWhatsApp,
    language,
    t,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'attendance' | 'khata' | 'salary'>('attendance');
  const [isAddAdvanceModalOpen, setIsAddAdvanceModalOpen] = useState(false);

  // Advance Form State
  const [selectedOpName, setSelectedOpName] = useState('Ramesh Patel');
  const [advanceAmount, setAdvanceAmount] = useState('2000');
  const [advanceReason, setAdvanceReason] = useState('Personal family requirement');
  const [supervisorName, setSupervisorName] = useState('Harsh Kheni (Manager)');

  // Statistics
  const totalPresentToday = operatorAttendance.filter((o) => o.status === 'PRESENT').length;
  const totalIncentiveEarned = operatorAttendance.reduce((acc, o) => acc + o.incentiveEarnedINR, 0);
  const totalAdvancesOutstanding = operatorKhata
    .filter((k) => k.type === 'ADVANCE_TAKEN')
    .reduce((acc, k) => acc + k.amountINR, 0);

  const handleExportCSV = () => {
    if (activeTab === 'attendance') {
      const data = operatorAttendance.map((a) => ({
        Operator: a.operatorName,
        Date: a.date,
        Status: a.status,
        Shift: a.shift,
        InTime: a.inTime,
        OvertimeHours: a.overtimeHours,
        StitchesLogged: a.stitchesLogged,
        TargetStitches: a.targetStitches,
        IncentiveINR: a.incentiveEarnedINR,
      }));
      exportToCsv(data, 'Operator_Daily_Attendance_Sheet');
    } else if (activeTab === 'khata') {
      const data = operatorKhata.map((k) => ({
        Operator: k.operatorName,
        Date: k.date,
        TransactionType: k.type,
        AmountINR: k.amountINR,
        Reason: k.reason,
        ApprovedBy: k.approvedBy,
      }));
      exportToCsv(data, 'Operator_Khata_Advance_Ledger');
    } else {
      const data = salarySlips.map((s) => ({
        Operator: s.operatorName,
        Month: s.monthYear,
        PresentDays: s.presentDays,
        OvertimeHours: s.overtimeHours,
        BaseSalary: s.baseSalaryINR,
        OvertimePay: s.overtimePayINR,
        IncentiveBonus: s.stitchIncentiveINR,
        GrossSalary: s.grossSalaryINR,
        AdvanceDeduction: s.advanceDeductionINR,
        NetPayable: s.netPayableINR,
        Status: s.status,
      }));
      exportToCsv(data, 'Operator_Monthly_Salary_Payout_Report');
    }
  };

  const handleCreateAdvance = (e: React.FormEvent) => {
    e.preventDefault();
    addKhataEntry({
      operatorId: 'op-' + Math.floor(Math.random() * 100),
      operatorName: selectedOpName,
      date: 'Today, ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      type: 'ADVANCE_TAKEN',
      amountINR: parseFloat(advanceAmount) || 1000,
      reason: advanceReason,
      approvedBy: supervisorName,
    });
    setIsAddAdvanceModalOpen(false);
  };

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 bg-emerald-500/10 text-emerald-600 rounded-lg">
              <Users className="w-5 h-5" />
            </span>
            <h1 className="text-xl font-bold text-slate-800">
              {language === 'gu' ? 'કારીગર હાજરી, ખાતાવહી (ઉપાડ) & પગાર બુક' : 'Operator Attendance, Khata & Salary Book'}
            </h1>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            {language === 'gu'
              ? 'રોજિંદી હાજરી, વધારાના ટાંકાનું પ્રોત્સાહન (ઈન્સેન્ટિવ), ઉપાડ લેજર અને વોટ્સએપ સેલરી સ્લિપ'
              : 'Daily biometric attendance, stitch production incentive calculation, cash advance khata, and salary slips.'}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleExportCSV}
            className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
            {t('common.export', 'Export CSV')}
          </button>
          <button
            onClick={() => setIsAddAdvanceModalOpen(true)}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 shadow-sm shadow-emerald-500/20 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            {language === 'gu' ? 'નવો ઉપાડ (Advance)' : 'Give Cash Advance'}
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium uppercase tracking-wider text-slate-500">
              {language === 'gu' ? 'હાજર કારીગરો' : 'Floor Attendance'}
            </span>
            <CalendarCheck className="w-4 h-4 text-blue-500" />
          </div>
          <div className="text-2xl font-bold text-slate-900">
            {totalPresentToday} / {operatorAttendance.length} Present
          </div>
          <div className="text-xs text-emerald-600 font-medium mt-1">
            ✓ 100% Day Shift Machine Coverage
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium uppercase tracking-wider text-slate-500">
              {language === 'gu' ? 'ટાંકા ઈન્સેન્ટિવ આજે' : 'Stitch Incentive Pool'}
            </span>
            <TrendingUp className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-bold text-emerald-600">₹{totalIncentiveEarned}</div>
          <div className="text-xs text-slate-500 mt-1">Rate: ₹0.80 per 1,000 excess stitches</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium uppercase tracking-wider text-slate-500">
              {language === 'gu' ? 'કુલ બાકી ઉપાડ' : 'Outstanding Advances'}
            </span>
            <CreditCard className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-bold text-amber-700">₹{totalAdvancesOutstanding.toLocaleString('en-IN')}</div>
          <div className="text-xs text-slate-500 mt-1">Deducted automatically from month salary</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium uppercase tracking-wider text-slate-500">
              {language === 'gu' ? 'માસિક પે-રોલ' : 'August Payroll Total'}
            </span>
            <Receipt className="w-4 h-4 text-indigo-500" />
          </div>
          <div className="text-2xl font-bold text-slate-900">
            ₹{salarySlips.reduce((a, b) => a + b.netPayableINR, 0).toLocaleString('en-IN')}
          </div>
          <div className="text-xs text-slate-500 mt-1">3 Master Operators cleared</div>
        </div>
      </div>

      {/* Tabs Selection */}
      <div className="flex items-center gap-2 border-b border-slate-200 overflow-x-auto [&>button]:shrink-0">
        <button
          onClick={() => setActiveTab('attendance')}
          className={`px-4 py-2.5 text-xs font-bold transition-all border-b-2 cursor-pointer flex items-center gap-2 ${
            activeTab === 'attendance'
              ? 'border-emerald-600 text-emerald-700 bg-emerald-50/50'
              : 'border-transparent text-slate-600 hover:text-slate-900'
          }`}
        >
          <CalendarCheck className="w-4 h-4" />
          {language === 'gu' ? '૧. દૈનિક હાજરી & ઈન્સેન્ટિવ' : '1. Daily Attendance & Incentive'}
        </button>
        <button
          onClick={() => setActiveTab('khata')}
          className={`px-4 py-2.5 text-xs font-bold transition-all border-b-2 cursor-pointer flex items-center gap-2 ${
            activeTab === 'khata'
              ? 'border-emerald-600 text-emerald-700 bg-emerald-50/50'
              : 'border-transparent text-slate-600 hover:text-slate-900'
          }`}
        >
          <CreditCard className="w-4 h-4" />
          {language === 'gu' ? '૨. કારીગર ઉપાડ ખાતાવહી (Khata)' : '2. Operator Khata & Cash Advances'}
        </button>
        <button
          onClick={() => setActiveTab('salary')}
          className={`px-4 py-2.5 text-xs font-bold transition-all border-b-2 cursor-pointer flex items-center gap-2 ${
            activeTab === 'salary'
              ? 'border-emerald-600 text-emerald-700 bg-emerald-50/50'
              : 'border-transparent text-slate-600 hover:text-slate-900'
          }`}
        >
          <Receipt className="w-4 h-4" />
          {language === 'gu' ? '૩. માસિક પગાર સ્લિપ (WhatsApp Share)' : '3. Monthly Salary Slips'}
        </button>
      </div>

      {/* Tab 1: Daily Attendance Table */}
      {activeTab === 'attendance' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="p-4 border-b border-slate-200 flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-800">
              {language === 'gu' ? 'રોજિંદી હાજરી રજિસ્ટર (આજની તારીખ)' : 'Live Floor Attendance & Stitch Bonus Tracker'}
            </h2>
            <span className="text-xs text-slate-500 font-medium">Click status buttons to adjust record</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider">
                  <th className="py-3 px-4">Operator Name</th>
                  <th className="py-3 px-4">Shift & In-Time</th>
                  <th className="py-3 px-4">Attendance Status</th>
                  <th className="py-3 px-4">OT Hours</th>
                  <th className="py-3 px-4">Stitches Logged</th>
                  <th className="py-3 px-4">Target</th>
                  <th className="py-3 px-4">Incentive Earned</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {operatorAttendance.map((rec) => (
                  <tr key={rec.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-4 font-bold text-slate-800 flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs">
                        {rec.operatorName.charAt(0)}
                      </div>
                      {rec.operatorName}
                    </td>
                    <td className="py-3 px-4">
                      <div className="text-slate-800 font-medium">{rec.shift}</div>
                      <div className="text-[11px] text-slate-400">In: {rec.inTime}</div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => markAttendance(rec.id, 'PRESENT', rec.overtimeHours)}
                          className={`px-2 py-1 rounded text-[11px] font-bold cursor-pointer transition-colors ${
                            rec.status === 'PRESENT'
                              ? 'bg-emerald-600 text-white'
                              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                          }`}
                        >
                          P
                        </button>
                        <button
                          onClick={() => markAttendance(rec.id, 'HALF_DAY', 0)}
                          className={`px-2 py-1 rounded text-[11px] font-bold cursor-pointer transition-colors ${
                            rec.status === 'HALF_DAY'
                              ? 'bg-amber-500 text-white'
                              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                          }`}
                        >
                          HD
                        </button>
                        <button
                          onClick={() => markAttendance(rec.id, 'ABSENT', 0)}
                          className={`px-2 py-1 rounded text-[11px] font-bold cursor-pointer transition-colors ${
                            rec.status === 'ABSENT'
                              ? 'bg-rose-600 text-white'
                              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                          }`}
                        >
                          A
                        </button>
                      </div>
                    </td>
                    <td className="py-3 px-4 font-semibold text-slate-700">
                      {rec.status === 'PRESENT' ? (
                        <div className="flex items-center gap-2">
                          <span>{rec.overtimeHours} hrs</span>
                          <button
                            onClick={() =>
                              markAttendance(rec.id, 'PRESENT', Math.max(0, rec.overtimeHours + 1))
                            }
                            className="w-5 h-5 bg-slate-100 hover:bg-slate-200 rounded text-slate-600 flex items-center justify-center font-bold cursor-pointer"
                          >
                            +
                          </button>
                        </div>
                      ) : (
                        <span className="text-slate-400">-</span>
                      )}
                    </td>
                    <td className="py-3 px-4 font-mono font-medium text-slate-800">
                      {rec.stitchesLogged.toLocaleString()}
                    </td>
                    <td className="py-3 px-4 font-mono text-slate-500">{rec.targetStitches.toLocaleString()}</td>
                    <td className="py-3 px-4">
                      {rec.incentiveEarnedINR > 0 ? (
                        <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded font-bold">
                          +₹{rec.incentiveEarnedINR}
                        </span>
                      ) : (
                        <span className="text-slate-400">₹0</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 2: Khata (Cash Advances) Table */}
      {activeTab === 'khata' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="p-4 border-b border-slate-200 flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-slate-800">
                {language === 'gu' ? 'કારીગર ઉપાડ ખાતાવહી (Khata Book)' : 'Cash Advance & Repayment Ledger'}
              </h2>
              <p className="text-xs text-slate-500">All loans and salary adjustments recorded with supervisor approval</p>
            </div>
            <button
              onClick={() => setIsAddAdvanceModalOpen(true)}
              className="px-3 py-1.5 bg-emerald-600 text-white rounded-lg text-xs font-semibold hover:bg-emerald-700 cursor-pointer"
            >
              + Add Upad (ઉપાડ)
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider">
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Operator Name</th>
                  <th className="py-3 px-4">Transaction Type</th>
                  <th className="py-3 px-4">Amount (₹)</th>
                  <th className="py-3 px-4">Reason / Notes</th>
                  <th className="py-3 px-4">Authorized By</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {operatorKhata.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-4 text-slate-600">{item.date}</td>
                    <td className="py-3 px-4 font-bold text-slate-800">{item.operatorName}</td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                          item.type === 'ADVANCE_TAKEN'
                            ? 'bg-rose-100 text-rose-700'
                            : 'bg-emerald-100 text-emerald-700'
                        }`}
                      >
                        {item.type === 'ADVANCE_TAKEN' ? 'ADVANCE (ઉપાડ)' : 'SALARY DEDUCTION'}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-bold text-base text-slate-900">
                      ₹{item.amountINR.toLocaleString('en-IN')}
                    </td>
                    <td className="py-3 px-4 text-slate-600">{item.reason}</td>
                    <td className="py-3 px-4 font-medium text-slate-700">{item.approvedBy}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 3: Monthly Salary Slips */}
      {activeTab === 'salary' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {salarySlips.map((slip) => (
              <div
                key={slip.id}
                className="bg-white rounded-xl border border-slate-200 shadow-xs p-5 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between border-b border-slate-200 pb-2 mb-3">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                      {slip.monthYear}
                    </span>
                    <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 font-bold text-[10px] rounded">
                      {slip.status}
                    </span>
                  </div>

                  <h3 className="text-base font-extrabold text-slate-900">{slip.operatorName}</h3>
                  <div className="text-xs text-slate-500 mb-4">
                    {slip.presentDays} Days Worked • {slip.overtimeHours} OT Hours
                  </div>

                  <div className="space-y-1.5 text-xs border-t border-slate-100 pt-3">
                    <div className="flex justify-between text-slate-600">
                      <span>Base Wages:</span>
                      <span className="font-semibold text-slate-900">₹{slip.baseSalaryINR.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="flex justify-between text-slate-600">
                      <span>OT Pay:</span>
                      <span className="font-semibold text-slate-900">+₹{slip.overtimePayINR.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="flex justify-between text-emerald-700 font-medium">
                      <span>Stitch Bonus:</span>
                      <span className="font-bold">+₹{slip.stitchIncentiveINR.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="flex justify-between text-rose-600 font-medium">
                      <span>Advance (ઉપાડ) Deducted:</span>
                      <span className="font-bold">-₹{slip.advanceDeductionINR.toLocaleString('en-IN')}</span>
                    </div>
                  </div>

                  <div className="border-t border-slate-200 mt-4 pt-3 flex justify-between items-center">
                    <span className="font-bold text-xs text-slate-800">Net Payable:</span>
                    <span className="text-lg font-black text-emerald-600">
                      ₹{slip.netPayableINR.toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>

                <div className="mt-5 pt-3 border-t border-slate-100 flex items-center gap-2">
                  <button
                    onClick={() =>
                      sendSalarySlipWhatsApp(slip.operatorName, slip.monthYear, slip.netPayableINR)
                    }
                    className="flex-1 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 shadow-sm transition-colors cursor-pointer"
                  >
                    <Share2 className="w-3.5 h-3.5" />
                    Share on WhatsApp
                  </button>
                  <button
                    onClick={() => {
                      try {
                        window.print();
                      } catch (err) {
                        console.warn('Print not supported in this frame:', err);
                      }
                    }}
                    className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg cursor-pointer"
                    title="Print Slip"
                  >
                    <Printer className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modal: Add Advance / Upad */}
      {isAddAdvanceModalOpen && (
        <div
          onClick={() => setIsAddAdvanceModalOpen(false)}
          className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200"
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <span className="p-2 bg-emerald-100 text-emerald-700 rounded-lg">
                  <CreditCard className="w-5 h-5" />
                </span>
                <h3 className="text-base font-bold text-slate-900">
                  {language === 'gu' ? 'નવો ઉપાડ (Advance Cash Entry)' : 'Record Cash Advance to Karigar'}
                </h3>
              </div>
              <button
                onClick={() => setIsAddAdvanceModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateAdvance} className="mt-4 space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Select Operator / Karigar</label>
                <select
                  value={selectedOpName}
                  onChange={(e) => setSelectedOpName(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-hidden"
                >
                  {operatorAttendance.map((op) => (
                    <option key={op.id} value={op.operatorName}>
                      {op.operatorName}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Advance Amount (₹)</label>
                <input
                  type="number"
                  step="500"
                  required
                  value={advanceAmount}
                  onChange={(e) => setAdvanceAmount(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-hidden"
                  placeholder="e.g. 2000"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Reason / Notes</label>
                <input
                  type="text"
                  required
                  value={advanceReason}
                  onChange={(e) => setAdvanceReason(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-hidden"
                  placeholder="e.g. Emergency family medical expense"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Authorized Supervisor</label>
                <input
                  type="text"
                  required
                  value={supervisorName}
                  onChange={(e) => setSupervisorName(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-hidden"
                />
              </div>

              <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddAdvanceModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg cursor-pointer"
                >
                  {t('common.cancel', 'Cancel')}
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-sm cursor-pointer"
                >
                  Confirm & Credit Khata
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
