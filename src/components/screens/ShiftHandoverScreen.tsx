import React, { useState } from 'react';
import {
  ClipboardCheck,
  CheckCircle2,
  AlertTriangle,
  Plus,
  User,
  Clock,
  Calendar,
  Layers,
  FileText,
} from 'lucide-react';
import { KpiCard } from '../common/KpiCard';

export const ShiftHandoverScreen: React.FC = () => {
  const [handovers, setHandovers] = useState([
    {
      id: 'HO-801',
      outgoingShift: 'Shift 1 (Day)',
      incomingShift: 'Shift 2 (Evening)',
      outgoingSupervisor: 'Ramesh Patel',
      incomingSupervisor: 'Dinesh Solanki',
      date: '2025-04-20 14:00',
      stitchesDone: 216450,
      activeJobs: 'Zara Polo Chest (Lot #4), Raymond Crest',
      pendingIssues: 'M3 Head 2 thread tension sensor loose; Mechanic alerted. M8 network controller rebooted.',
      oilCheckDone: true,
      wasteCleaned: true,
      signOffStatus: 'SIGNED_OFF',
    },
    {
      id: 'HO-800',
      outgoingShift: 'Shift 3 (Night)',
      incomingShift: 'Shift 1 (Day)',
      outgoingSupervisor: 'Sunil Verma',
      incomingSupervisor: 'Ramesh Patel',
      date: '2025-04-20 06:00',
      stitchesDone: 178900,
      activeJobs: 'Polo Chest run completed 420 pcs',
      pendingIssues: 'Needle stock DBxK5 #75 replenished from store.',
      oilCheckDone: true,
      wasteCleaned: true,
      signOffStatus: 'SIGNED_OFF',
    },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [outgoingSup, setOutgoingSup] = useState('Ramesh Patel');
  const [incomingSup, setIncomingSup] = useState('Dinesh Solanki');
  const [activeJobs, setActiveJobs] = useState('ORD-2025-01 in progress at 68%');
  const [pendingNotes, setPendingNotes] = useState('All machines running at 800 SPM. Bobbins restocked on Line A.');
  const [oilCheck, setOilCheck] = useState(true);
  const [cleanCheck, setCleanCheck] = useState(true);

  const handleCommit = (e: React.FormEvent) => {
    e.preventDefault();
    const newEntry = {
      id: `HO-${800 + handovers.length + 1}`,
      outgoingShift: 'Shift 1 (Day)',
      incomingShift: 'Shift 2 (Evening)',
      outgoingSupervisor: outgoingSup,
      incomingSupervisor: incomingSup,
      date: new Date().toISOString().replace('T', ' ').substring(0, 16),
      stitchesDone: 232000,
      activeJobs: activeJobs,
      pendingIssues: pendingNotes,
      oilCheckDone: oilCheck,
      wasteCleaned: cleanCheck,
      signOffStatus: 'SIGNED_OFF',
    };
    setHandovers([newEntry, ...handovers]);
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="bg-white rounded-xl border border-slate-200/90 p-4 shadow-xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-bold text-slate-900 tracking-tight">
            Shift Handover & Digital Supervisor Register
          </h2>
          <p className="text-xs text-slate-500 font-medium">
            Maintain seamless operational continuity, machine condition handoffs, and shift sign-offs
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold text-xs flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>New Shift Handover Log</span>
        </button>
      </div>

      {/* Handover Cards Stream */}
      <div className="space-y-4">
        {handovers.map((h) => (
          <div
            key={h.id}
            className="bg-white rounded-xl border border-slate-200/90 p-5 shadow-xs space-y-3.5"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <span className="font-mono font-bold text-blue-600 text-xs px-2 py-0.5 rounded bg-blue-50 border border-blue-200">
                  {h.id}
                </span>
                <span className="font-bold text-slate-900 text-sm">
                  {h.outgoingShift} &rarr; {h.incomingShift}
                </span>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                <span className="font-mono text-slate-500">{h.date}</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  Signed & Verified
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                <span className="text-[10px] text-slate-400 uppercase font-bold block mb-1">
                  Shift Stitches Produced
                </span>
                <span className="text-base font-extrabold text-slate-900">
                  {h.stitchesDone.toLocaleString()} Stitches
                </span>
              </div>
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                <span className="text-[10px] text-slate-400 uppercase font-bold block mb-1">
                  Supervisors
                </span>
                <span className="font-semibold text-slate-800 block truncate">
                  Out: <strong>{h.outgoingSupervisor}</strong>
                </span>
                <span className="font-semibold text-slate-800 block truncate">
                  In: <strong>{h.incomingSupervisor}</strong>
                </span>
              </div>
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                <span className="text-[10px] text-slate-400 uppercase font-bold block mb-1">
                  Active Jobs in Motion
                </span>
                <span className="text-slate-700 font-medium truncate block" title={h.activeJobs}>
                  {h.activeJobs}
                </span>
              </div>
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                <span className="text-[10px] text-slate-400 uppercase font-bold block mb-1">
                  Audit Checklist
                </span>
                <div className="flex items-center gap-3 text-emerald-700 font-semibold">
                  <span className="flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Hooks Oiled
                  </span>
                  <span className="flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Cleaned
                  </span>
                </div>
              </div>
            </div>

            <div className="p-3 bg-amber-50/60 rounded-lg border border-amber-200/70 text-xs text-amber-900 flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <strong className="font-bold">Handoff Notes & Flagged Items: </strong>
                <span>{h.pendingIssues}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-200 max-w-md w-full p-6 animate-in fade-in-50 zoom-in-95">
            <h3 className="text-base font-bold text-slate-900 mb-1">
              Submit Shift Handover Register Log
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Record floor status, active frame batches, and supervisor sign-off
            </p>

            <form onSubmit={handleCommit} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Outgoing Supervisor</label>
                  <input
                    type="text"
                    value={outgoingSup}
                    onChange={(e) => setOutgoingSup(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg"
                    required
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Incoming Supervisor</label>
                  <input
                    type="text"
                    value={incomingSup}
                    onChange={(e) => setIncomingSup(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Active Batch Jobs Running</label>
                <input
                  type="text"
                  value={activeJobs}
                  onChange={(e) => setActiveJobs(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Operational Handoff Notes & Issues</label>
                <textarea
                  rows={3}
                  value={pendingNotes}
                  onChange={(e) => setPendingNotes(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg"
                  required
                />
              </div>

              <div className="flex items-center gap-4 py-2">
                <label className="flex items-center gap-2 cursor-pointer font-medium text-slate-700">
                  <input
                    type="checkbox"
                    checked={oilCheck}
                    onChange={(e) => setOilCheck(e.target.checked)}
                    className="rounded text-blue-600"
                  />
                  <span>Hooks & Rotary Oiled</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer font-medium text-slate-700">
                  <input
                    type="checkbox"
                    checked={cleanCheck}
                    onChange={(e) => setCleanCheck(e.target.checked)}
                    className="rounded text-blue-600"
                  />
                  <span>Thread Trimmings Cleaned</span>
                </label>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
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
                  Sign & Commit Handover
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
