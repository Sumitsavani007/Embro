import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Zap,
  Fuel,
  TrendingDown,
  AlertTriangle,
  Clock,
  Plus,
  FileSpreadsheet,
  CheckCircle2,
  HelpCircle,
  X,
  Sparkles,
} from 'lucide-react';
import { exportToCsv } from '../../utils/exportCsv';

export const PowerMonitoringScreen: React.FC = () => {
  const { powerMetrics, dgLogs, addDGLog, language, t } = useApp();
  const [isAddDGModalOpen, setIsAddDGModalOpen] = useState(false);

  // Form state for DG Log
  const [outageDuration, setOutageDuration] = useState('60');
  const [dieselLiters, setDieselLiters] = useState('12');
  const [dgStitches, setDgStitches] = useState('250000');
  const [outageReason, setOutageReason] = useState('DGVCL Feeder Line Tripping / Moisture Fault');

  // Computed power statistics
  const totalLiveKwh = powerMetrics.reduce((acc, m) => acc + m.currentKwh, 0);
  const totalHourlyCostINR = powerMetrics.reduce((acc, m) => acc + m.hourlyCostINR, 0);
  const avgPF = (
    powerMetrics.filter((m) => m.powerFactor > 0).reduce((acc, m) => acc + m.powerFactor, 0) /
    (powerMetrics.filter((m) => m.powerFactor > 0).length || 1)
  ).toFixed(2);

  const totalDieselLiters = dgLogs.reduce((acc, l) => acc + l.dieselConsumedLiters, 0);
  const totalDieselCost = dgLogs.reduce((acc, l) => acc + l.dieselCostINR, 0);
  const totalDgStitches = dgLogs.reduce((acc, l) => acc + l.stitchesProducedOnDG, 0);
  const overallDgCostPer1k = totalDgStitches > 0 ? ((totalDieselCost / totalDgStitches) * 1000).toFixed(2) : '4.35';

  const handleExportCSV = () => {
    const data = dgLogs.map((log) => ({
      ID: log.id,
      Date: log.date,
      TimeRange: log.timeRange,
      DurationMinutes: log.durationMinutes,
      DieselLiters: log.dieselConsumedLiters,
      DieselCostINR: log.dieselCostINR,
      StitchesRunOnDG: log.stitchesProducedOnDG,
      CostPer1kStitches: log.costPer1kStitchesDG,
      OutageReason: log.reason,
    }));
    exportToCsv(data, 'DG_Generator_Power_Outage_Report');
  };

  const handleCreateDGLog = (e: React.FormEvent) => {
    e.preventDefault();
    const duration = parseFloat(outageDuration) || 45;
    const liters = parseFloat(dieselLiters) || 10;
    const stitches = parseInt(dgStitches, 10) || 200000;
    const dieselCost = Math.round(liters * 92); // ₹92/liter diesel in Gujarat
    const costPer1k = parseFloat(((dieselCost / stitches) * 1000).toFixed(2));

    addDGLog({
      date: 'Today, ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      timeRange: 'Just logged',
      durationMinutes: duration,
      dieselConsumedLiters: liters,
      dieselCostINR: dieselCost,
      stitchesProducedOnDG: stitches,
      costPer1kStitchesDG: costPer1k,
      reason: outageReason,
    });

    setIsAddDGModalOpen(false);
  };

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto space-y-6">
      {/* Top Banner & Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 bg-amber-500/10 text-amber-600 rounded-lg">
              <Zap className="w-5 h-5" />
            </span>
            <h1 className="text-xl font-bold text-slate-800">
              {language === 'gu' ? 'વીજળી વપરાશ & ડીજી જનરેટર એનાલિટિક્સ' : 'Electricity & Power Factor (PF) Monitoring'}
            </h1>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            {language === 'gu'
              ? 'DGVCL / Torrent Power ગ્રીડ વપરાશ અને ડીઝલ જનરેટર રનિંગ કોસ્ટ ટ્રેકિંગ'
              : 'Real-time kWh telemetry, APFC Capacitor Bank Power Factor, and DG diesel run analytics.'}
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
            onClick={() => setIsAddDGModalOpen(true)}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 shadow-sm shadow-blue-500/20 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            {language === 'gu' ? 'ડીજી લોગ ઉમેરો' : 'Log DG Power Cut'}
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Total Live kWh */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium uppercase tracking-wider text-slate-500">
              {language === 'gu' ? 'લાઈવ વીજળી લોડ' : 'Total Grid Load'}
            </span>
            <Zap className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-bold text-slate-900">{totalLiveKwh.toFixed(1)} kWh</div>
          <div className="text-xs text-slate-500 mt-1 flex items-center justify-between">
            <span>Tariff: ₹7.80/unit</span>
            <span className="font-semibold text-slate-700">₹{totalHourlyCostINR.toFixed(0)}/hr</span>
          </div>
        </div>

        {/* Card 2: Average Power Factor */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium uppercase tracking-wider text-slate-500">
              {language === 'gu' ? 'પાવર ફેક્ટર (PF)' : 'Average Power Factor'}
            </span>
            <span
              className={`text-xs px-2 py-0.5 rounded-full font-bold ${
                parseFloat(avgPF) >= 0.95
                  ? 'bg-emerald-100 text-emerald-700'
                  : 'bg-amber-100 text-amber-700'
              }`}
            >
              {parseFloat(avgPF) >= 0.95 ? 'Optimum' : 'Check APFC'}
            </span>
          </div>
          <div className="text-2xl font-bold text-slate-900">{avgPF}</div>
          <div className="text-xs text-slate-500 mt-1">
            {parseFloat(avgPF) >= 0.95
              ? '✓ No DGVCL penalty (Target > 0.92)'
              : '⚠️ Capacitor bank service advised'}
          </div>
        </div>

        {/* Card 3: DG Generator Run Time */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium uppercase tracking-wider text-slate-500">
              {language === 'gu' ? 'કુલ ડીજી રન ટાઈમ' : 'DG Outage Time'}
            </span>
            <Fuel className="w-4 h-4 text-rose-500" />
          </div>
          <div className="text-2xl font-bold text-slate-900">
            {dgLogs.reduce((a, b) => a + b.durationMinutes, 0)} mins
          </div>
          <div className="text-xs text-slate-500 mt-1 flex items-center justify-between">
            <span>{totalDieselLiters} Liters Diesel</span>
            <span className="font-semibold text-rose-600">₹{totalDieselCost.toLocaleString('en-IN')}</span>
          </div>
        </div>

        {/* Card 4: DG Cost per 1,000 stitches */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs bg-gradient-to-br from-white to-amber-50/40">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium uppercase tracking-wider text-amber-700 font-semibold">
              {language === 'gu' ? 'ડીજી ખર્ચ / ૧,૦૦૦ ટાંકા' : 'DG Cost / 1k Stitches'}
            </span>
            <TrendingDown className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl font-bold text-amber-800">₹{overallDgCostPer1k}</div>
          <div className="text-xs text-slate-500 mt-1">
            vs. Grid cost ₹0.38 / 1k stitches (11.4x expensive)
          </div>
        </div>
      </div>

      {/* Main Grid: Machine-Wise Power Telemetry & DG Log */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Machine Power Consumption & PF Table */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="p-4 border-b border-slate-200 flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-800">
                {language === 'gu' ? 'મશીન વાઇઝ વીજળી & પાવર ફેક્ટર' : 'Machine-Level kWh & Power Factor Matrix'}
              </h2>
              <p className="text-xs text-slate-500">Sub-meter live readings updated continuously</p>
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 bg-blue-50 text-blue-700 border border-blue-200 rounded-lg">
              8 Machines Telemetry
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider">
                  <th className="py-3 px-4">Machine</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Load (kWh)</th>
                  <th className="py-3 px-4">Power Factor</th>
                  <th className="py-3 px-4">Cost Rate (₹/hr)</th>
                  <th className="py-3 px-4">APFC Health</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {powerMetrics.map((m) => {
                  const isHealthyPF = m.powerFactor >= 0.94;
                  return (
                    <tr key={m.machineNumber} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3 px-4 font-bold text-slate-800 flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                        {m.machineNumber}
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-2 py-0.5 rounded-full font-semibold text-[11px] ${
                            m.status === 'RUNNING'
                              ? 'bg-emerald-100 text-emerald-700'
                              : m.status === 'IDLE'
                              ? 'bg-amber-100 text-amber-700'
                              : 'bg-slate-100 text-slate-600'
                          }`}
                        >
                          {m.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-semibold text-slate-700">
                        {m.currentKwh.toFixed(1)} kWh
                        <div className="w-24 bg-slate-100 h-1.5 rounded-full mt-1 overflow-hidden">
                          <div
                            className="bg-amber-500 h-full rounded-full"
                            style={{ width: `${(m.currentKwh / 6) * 100}%` }}
                          ></div>
                        </div>
                      </td>
                      <td className="py-3 px-4 font-mono font-bold text-slate-800">
                        <span className={isHealthyPF ? 'text-emerald-600' : 'text-rose-600'}>
                          {m.powerFactor.toFixed(2)}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-slate-700 font-medium">₹{m.hourlyCostINR.toFixed(2)}</td>
                      <td className="py-3 px-4">
                        {m.status === 'STOPPED' ? (
                          <span className="text-slate-400">Idle / Off</span>
                        ) : isHealthyPF ? (
                          <span className="inline-flex items-center gap-1 text-emerald-600 font-medium">
                            <CheckCircle2 className="w-3.5 h-3.5" /> High Eff.
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-rose-600 font-semibold bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                            <AlertTriangle className="w-3.5 h-3.5" /> PF Penalty
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right 1 Col: Power Quality & Tariff Info Card */}
        <div className="space-y-4">
          <div className="bg-slate-900 text-white p-5 rounded-xl border border-slate-800 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs uppercase tracking-wider text-slate-400 font-semibold">
                Gujarat Textile Tariff
              </span>
              <span className="px-2 py-0.5 bg-blue-500/20 text-blue-400 text-[11px] font-bold rounded">
                DGVCL HT Industrial
              </span>
            </div>
            <div className="text-3xl font-extrabold text-white mb-1">₹7.80 <span className="text-xs font-normal text-slate-400">/ kWh</span></div>
            <p className="text-xs text-slate-400 mb-4 leading-relaxed">
              Industrial tariff including electricity duty and fuel charge adjustments (FPPPA). High PF incentive of 0.5% applicable if monthly PF &gt; 0.95.
            </p>

            <div className="border-t border-slate-800 pt-3 space-y-2 text-xs">
              <div className="flex justify-between text-slate-300">
                <span>Sanctioned Load:</span>
                <span className="font-semibold text-white">75 kW</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span>APFC Capacitor Bank:</span>
                <span className="font-semibold text-emerald-400">Online (40 kVAR)</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span>Estimated Today Bill:</span>
                <span className="font-semibold text-amber-400">₹{(totalHourlyCostINR * 12).toFixed(0)}</span>
              </div>
            </div>
          </div>

          <div className="bg-amber-50 border border-amber-200 p-4 rounded-xl text-amber-900 text-xs space-y-2">
            <div className="flex items-center gap-1.5 font-bold text-amber-800">
              <HelpCircle className="w-4 h-4 text-amber-600" />
              {language === 'gu' ? 'ફેક્ટરી માલિક માટે ફાયદાકારક ટીપ' : 'Owner Power Saving Tip'}
            </div>
            <p className="leading-relaxed text-amber-800">
              {language === 'gu'
                ? 'ડીઝલ જનરેટર પર ૧,૦૦૦ ટાંકા ચલાવવાનો ખર્ચ ₹૪.૪૨ થાય છે, જ્યારે સરકારી વીજળી પર ફક્ત ₹૦.૩૮ થાય છે. ડીજી ચાલતી વખતે ખાલી મોટા જરી વર્કના મશીન ચાલુ રાખો જેથી ડીઝલ બચે.'
                : 'DG fuel costs ₹4.42 per 1,000 stitches compared to ₹0.38 on grid electricity. During power cuts, prioritize high-value multi-zari machines to maximize yield.'}
            </p>
          </div>
        </div>
      </div>

      {/* DG Generator Outage History Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-base font-bold text-slate-800 flex items-center gap-2">
              <Fuel className="w-4 h-4 text-rose-600" />
              {language === 'gu' ? 'ડીજી જનરેટર રનિંગ & ડીઝલ વપરાશ લોગ' : 'DG Generator Outage & Diesel Consumption Logbook'}
            </h2>
            <p className="text-xs text-slate-500">Historical logs of grid power cuts and generator fuel expense</p>
          </div>
          <span className="text-xs text-slate-500">Showing {dgLogs.length} recent power cuts</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider">
                <th className="py-3 px-4">Date & Time</th>
                <th className="py-3 px-4">Outage Duration</th>
                <th className="py-3 px-4">Diesel Used</th>
                <th className="py-3 px-4">Fuel Expense</th>
                <th className="py-3 px-4">Stitches on DG</th>
                <th className="py-3 px-4">Cost / 1k Stitches</th>
                <th className="py-3 px-4">Reason / Notes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {dgLogs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3 px-4 font-semibold text-slate-800">
                    <div>{log.date}</div>
                    <div className="text-[11px] text-slate-400 font-normal">{log.timeRange}</div>
                  </td>
                  <td className="py-3 px-4 font-medium text-slate-700">
                    <span className="inline-flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      {log.durationMinutes} mins
                    </span>
                  </td>
                  <td className="py-3 px-4 font-bold text-slate-800">{log.dieselConsumedLiters} Liters</td>
                  <td className="py-3 px-4 font-bold text-rose-600">₹{log.dieselCostINR.toLocaleString('en-IN')}</td>
                  <td className="py-3 px-4 font-mono font-medium text-slate-700">
                    {log.stitchesProducedOnDG.toLocaleString()} stitches
                  </td>
                  <td className="py-3 px-4 font-bold text-amber-700 bg-amber-50/40">
                    ₹{log.costPer1kStitchesDG} <span className="text-[10px] font-normal text-slate-500">/ 1k</span>
                  </td>
                  <td className="py-3 px-4 text-slate-600 max-w-xs truncate">{log.reason}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: Add DG Run Log */}
      {isAddDGModalOpen && (
        <div
          onClick={() => setIsAddDGModalOpen(false)}
          className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200"
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <span className="p-2 bg-rose-100 text-rose-700 rounded-lg">
                  <Fuel className="w-5 h-5" />
                </span>
                <h3 className="text-base font-bold text-slate-900">
                  {language === 'gu' ? 'નવો ડીજી રન લોગ ઉમેરો' : 'Log DG Generator Outage'}
                </h3>
              </div>
              <button
                onClick={() => setIsAddDGModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateDGLog} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {language === 'gu' ? 'પાવર કટ સમયગાળો (મિનિટ)' : 'Outage Duration (Minutes)'}
                </label>
                <input
                  type="number"
                  required
                  value={outageDuration}
                  onChange={(e) => setOutageDuration(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-hidden"
                  placeholder="e.g. 60"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    {language === 'gu' ? 'ડીઝલ વપરાશ (લિટર)' : 'Diesel Consumed (Liters)'}
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    required
                    value={dieselLiters}
                    onChange={(e) => setDieselLiters(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-hidden"
                    placeholder="e.g. 12"
                  />
                  <span className="text-[10px] text-slate-500 mt-0.5 block">@ ₹92/L = ₹{(parseFloat(dieselLiters || '0') * 92).toFixed(0)}</span>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    {language === 'gu' ? 'ડીજી પર ટાંકા' : 'Stitches Produced'}
                  </label>
                  <input
                    type="number"
                    step="1000"
                    required
                    value={dgStitches}
                    onChange={(e) => setDgStitches(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-hidden"
                    placeholder="e.g. 250000"
                  />
                  <span className="text-[10px] text-amber-700 font-semibold mt-0.5 block">
                    Cost: ₹{((parseFloat(dieselLiters || '0') * 92) / (parseFloat(dgStitches || '1') / 1000)).toFixed(2)}/1k
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {language === 'gu' ? 'પાવર કટનું કારણ' : 'Power Outage Reason'}
                </label>
                <input
                  type="text"
                  required
                  value={outageReason}
                  onChange={(e) => setOutageReason(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-hidden"
                  placeholder="e.g. DGVCL Ring Road Substation Cable Repair"
                />
              </div>

              <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddDGModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg cursor-pointer"
                >
                  {t('common.cancel', 'Cancel')}
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm cursor-pointer"
                >
                  {language === 'gu' ? 'સેવ કરો & ગણતરી કરો' : 'Save & Calculate'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
