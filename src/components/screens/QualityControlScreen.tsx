import React, { useState } from 'react';
import {
  ShieldCheck,
  AlertOctagon,
  CheckCircle2,
  Plus,
  Percent,
  Search,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { KpiCard } from '../common/KpiCard';
import { QCInspectionRecord, DefectCategory } from '../../types';

export const QualityControlScreen: React.FC = () => {
  const { qcRecords, addQCRecord, machines } = useApp();
  const [filterResult, setFilterResult] = useState('ALL');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form
  const [formOrder, setFormOrder] = useState('ORD-2025-01');
  const [formBatch, setFormBatch] = useState('LOT-901');
  const [formMachine, setFormMachine] = useState('M1');
  const [formSample, setFormSample] = useState(50);
  const [formDefects, setFormDefects] = useState(1);
  const [formCategory, setFormCategory] = useState<'MISSING_STITCH' | 'LOOPING' | 'THREAD_TENSION' | 'OIL_STAIN' | 'REGISTRATION_OFF'>('LOOPING');
  const [formInspector, setFormInspector] = useState('Anjali Sharma (Lead QC)');

  const totalInspected = qcRecords.reduce((acc, q) => acc + q.inspectedPieces, 0);
  const totalDefects = qcRecords.reduce((acc, q) => acc + q.rejectedPieces, 0);
  const fpy = (((totalInspected - totalDefects) / (totalInspected || 1)) * 100).toFixed(1);

  const filtered = qcRecords.filter((q) => {
    if (filterResult === 'ALL') return true;
    return (q.actionTaken === 'Scrapped' ? 'SCRAP' : q.actionTaken === 'Rework Required' ? 'REWORK' : 'PASS') === filterResult;
  });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const isPass = Number(formDefects) <= 1;
    const categories: Record<string, DefectCategory> = { MISSING_STITCH: 'Skipped Stitches', LOOPING: 'Thread Tension / Puckering', THREAD_TENSION: 'Thread Tension / Puckering', OIL_STAIN: 'Oil / Grease Stain', REGISTRATION_OFF: 'Misaligned Placement' };
    addQCRecord({
      orderNumber: formOrder, batchLot: formBatch, machineNumber: formMachine, inspectorName: formInspector,
      inspectedPieces: Number(formSample), rejectedPieces: Number(formDefects), passedPieces: Number(formSample) - Number(formDefects),
      defectCategory: categories[formCategory], defectReason: formCategory.replaceAll('_', ' '),
      actionTaken: isPass ? 'Passed with Touchup' : 'Rework Required',
    });
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="bg-white rounded-xl border border-slate-200/90 p-4 shadow-xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-bold text-slate-900 tracking-tight">
            Quality Control & Defect Taxonomy (AQL 1.5)
          </h2>
          <p className="text-xs text-slate-500 font-medium">
            First-pass yield monitoring, oil stain detection, and rework tracking
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 text-xs">
          <select
            value={filterResult}
            onChange={(e) => setFilterResult(e.target.value)}
            className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg font-semibold text-slate-700 cursor-pointer"
          >
            <option value="ALL">All Inspection Results</option>
            <option value="PASS">Pass Only</option>
            <option value="REWORK">Rework</option>
            <option value="SCRAP">Scrap</option>
          </select>

          <button
            onClick={() => setIsModalOpen(true)}
            className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Audit Batch Lot</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <KpiCard
          title="First-Pass Yield (FPY)"
          value={`${fpy}%`}
          subValue="Target >= 98.0% Benchmark"
          icon={Percent}
          iconColor="text-emerald-600"
          iconBg="bg-emerald-50"
        />
        <KpiCard
          title="Garments Inspected Today"
          value={totalInspected.toLocaleString()}
          subValue="AQL sampling inspection"
          icon={ShieldCheck}
          iconColor="text-blue-600"
          iconBg="bg-blue-50"
        />
        <KpiCard
          title="Total Rejections / Defects"
          value={totalDefects}
          subValue={`${((totalDefects / (totalInspected || 1)) * 100).toFixed(2)}% defect rate`}
          icon={AlertOctagon}
          iconColor="text-rose-600"
          iconBg="bg-rose-50"
        />
      </div>

      {/* QC Inspections Table */}
      <div className="bg-white rounded-xl border border-slate-200/90 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-400 font-semibold text-[11px] uppercase">
                <th className="py-3 px-4">Order #</th>
                <th className="py-3 px-3">Batch / Lot</th>
                <th className="py-3 px-3">Machine</th>
                <th className="py-3 px-3">Sample Size</th>
                <th className="py-3 px-3">Defects</th>
                <th className="py-3 px-3">Defect Category</th>
                <th className="py-3 px-3">Inspector</th>
                <th className="py-3 px-4 text-right">Result</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700 font-medium">
              {filtered.map((qc) => (
                <tr key={qc.id} className="hover:bg-slate-50">
                  <td className="py-3 px-4 font-bold text-slate-900">{qc.orderNumber}</td>
                  <td className="py-3 px-3 font-mono text-slate-600">{qc.batchLot || '—'}</td>
                  <td className="py-3 px-3 font-bold text-blue-600">{qc.machineNumber}</td>
                  <td className="py-3 px-3 tabular-nums">{qc.inspectedPieces} pcs</td>
                  <td className="py-3 px-3 font-bold text-rose-600 tabular-nums">
                    {qc.rejectedPieces} pcs
                  </td>
                  <td className="py-3 px-3">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-slate-100 text-slate-800">
                      {qc.defectCategory.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-slate-600">{qc.inspectorName}</td>
                  <td className="py-3 px-4 text-right">
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold ${
                        qc.actionTaken === 'Passed with Touchup'
                          ? 'bg-emerald-50 text-emerald-700'
                          : qc.actionTaken === 'Rework Required'
                          ? 'bg-amber-50 text-amber-700'
                          : 'bg-rose-50 text-rose-700'
                      }`}
                    >
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                      {qc.actionTaken === 'Scrapped' ? 'SCRAP' : qc.actionTaken === 'Rework Required' ? 'REWORK' : 'PASS'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-200 max-w-md w-full p-6 animate-in fade-in-50 zoom-in-95">
            <h3 className="text-base font-bold text-slate-900 mb-1">
              Record QC Garment Audit
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Enter sample size and defects for lot clearance
            </p>

            <form onSubmit={handleSave} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Order #</label>
                  <input
                    type="text"
                    value={formOrder}
                    onChange={(e) => setFormOrder(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg"
                    required
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Batch / Lot #</label>
                  <input
                    type="text"
                    value={formBatch}
                    onChange={(e) => setFormBatch(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Machine</label>
                  <select
                    value={formMachine}
                    onChange={(e) => setFormMachine(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg"
                  >
                    {machines.map((m) => (
                      <option key={m.id} value={m.machineNumber}>
                        {m.machineNumber}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Defect Type</label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value as any)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg"
                  >
                    <option value="LOOPING">Looping / Birdnesting</option>
                    <option value="MISSING_STITCH">Missing Stitch / Gap</option>
                    <option value="THREAD_TENSION">Thread Tension Tight / Loose</option>
                    <option value="OIL_STAIN">Needle Oil Stain</option>
                    <option value="REGISTRATION_OFF">Registration / Out of Frame</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Sample Size (Pcs)</label>
                  <input
                    type="number"
                    value={formSample}
                    onChange={(e) => setFormSample(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg"
                    required
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Defective Pieces</label>
                  <input
                    type="number"
                    value={formDefects}
                    onChange={(e) => setFormDefects(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Inspector</label>
                <input
                  type="text"
                  value={formInspector}
                  onChange={(e) => setFormInspector(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg"
                  required
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold cursor-pointer"
                >
                  Commit Audit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
