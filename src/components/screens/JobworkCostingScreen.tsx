import React, { useState } from 'react';
import {
  Calculator,
  IndianRupee,
  DollarSign,
  Download,
  Layers,
  FileText,
  Printer,
  Plus,
} from 'lucide-react';
import { KpiCard } from '../common/KpiCard';

export const JobworkCostingScreen: React.FC = () => {
  // Costing calculator parameters (standard Indian/Global embroidery jobwork rates)
  const [currency, setCurrency] = useState<'INR' | 'USD'>('INR');
  const [customerName, setCustomerName] = useState('Surat Fashion Garments');
  const [jobDescription, setJobDescription] = useState('Heavy Zari Saree Pallu & Border');
  const [stitchCount, setStitchCount] = useState(38500); // 38.5k stitches
  const [orderQuantity, setOrderQuantity] = useState(250); // 250 pieces
  const [ratePer1000Stitches, setRatePer1000Stitches] = useState(0.45); // ₹0.45 or $0.45 per 1,000 stitches
  const [backingPaperCost, setBackingPaperCost] = useState(3.5); // Per piece
  const [threadCost, setThreadCost] = useState(4.2); // Per piece
  const [foilOrFoamCost, setFoilOrFoamCost] = useState(2.0); // Per piece
  const [operatorWagePerPiece, setOperatorWagePerPiece] = useState(3.0);
  const [marginPercent, setMarginPercent] = useState(25); // 25% profit margin

  // Computations
  const stitchJobRatePerPiece = (stitchCount / 1000) * ratePer1000Stitches;
  const rawMaterialCostPerPiece = backingPaperCost + threadCost + foilOrFoamCost;
  const baseCostPerPiece = stitchJobRatePerPiece + rawMaterialCostPerPiece + operatorWagePerPiece;
  const profitPerPiece = (baseCostPerPiece * marginPercent) / 100;
  const quotedPricePerPiece = baseCostPerPiece + profitPerPiece;
  const totalJobworkQuote = quotedPricePerPiece * orderQuantity;
  const currSymbol = currency === 'INR' ? '₹' : '$';

  const [savedQuotes, setSavedQuotes] = useState([
    {
      id: 'Q-101',
      customer: 'Zara Apparel Hub',
      job: 'Summer Polo Chest 8.5k Stitches',
      quantity: 1200,
      quoteTotal: 28350,
      currency: 'INR',
      date: '2025-04-20',
      status: 'APPROVED',
    },
    {
      id: 'Q-102',
      customer: 'Raymond Luxury Suiting',
      job: 'Blazer Crest Gold Zari 14.8k Stitches',
      quantity: 500,
      quoteTotal: 22400,
      currency: 'INR',
      date: '2025-04-19',
      status: 'PENDING',
    },
  ]);

  const handleSaveQuote = () => {
    const newQuote = {
      id: `Q-${100 + savedQuotes.length + 1}`,
      customer: customerName,
      job: `${jobDescription} (${(stitchCount / 1000).toFixed(1)}k St)`,
      quantity: orderQuantity,
      quoteTotal: Math.round(totalJobworkQuote),
      currency: currency,
      date: new Date().toISOString().split('T')[0],
      status: 'APPROVED',
    };
    setSavedQuotes([newQuote, ...savedQuotes]);
    alert(`Jobwork quotation ${newQuote.id} generated and saved to costing register.`);
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="bg-white rounded-xl border border-slate-200/90 p-4 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-bold text-slate-900 tracking-tight">
            Jobwork Costing & Rate Estimation (₹/1k Stitches)
          </h2>
          <p className="text-xs text-slate-500 font-medium">
            Calculate accurate per-piece embroidery job rates, backing costs, operator piece wages, and client estimates
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <div className="flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200">
            <button
              onClick={() => setCurrency('INR')}
              className={`px-3 py-1 rounded font-bold transition-colors cursor-pointer ${
                currency === 'INR' ? 'bg-white text-blue-600 shadow-xs' : 'text-slate-600'
              }`}
            >
              ₹ INR (Rupees)
            </button>
            <button
              onClick={() => setCurrency('USD')}
              className={`px-3 py-1 rounded font-bold transition-colors cursor-pointer ${
                currency === 'USD' ? 'bg-white text-blue-600 shadow-xs' : 'text-slate-600'
              }`}
            >
              $ USD (Dollars)
            </button>
          </div>

          <button
            onClick={() => {
              try {
                window.print();
              } catch (err) {
                console.warn('Print not supported in this frame:', err);
              }
            }}
            className="px-3 py-2 bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-lg font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Quotation</span>
          </button>
        </div>
      </div>

      {/* Calculator & Cost Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left 7 cols: Interactive Rate Calculator Inputs */}
        <div className="lg:col-span-7 bg-white rounded-xl border border-slate-200/90 p-5 shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
            <Calculator className="w-4 h-4 text-blue-600" />
            <h3 className="text-sm font-bold text-slate-900">
              Jobwork Parameters & Rate Formula
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Customer / Party Name</label>
              <input
                type="text"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg font-medium"
              />
            </div>
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Garment / Design Spec</label>
              <input
                type="text"
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg font-medium"
              />
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">Stitches per Piece</label>
              <input
                type="number"
                step="500"
                value={stitchCount}
                onChange={(e) => setStitchCount(Number(e.target.value))}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg font-mono font-bold"
              />
            </div>
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Total Order Pieces</label>
              <input
                type="number"
                value={orderQuantity}
                onChange={(e) => setOrderQuantity(Number(e.target.value))}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg font-mono font-bold"
              />
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">
                Stitch Rate ({currSymbol} per 1,000 stitches)
              </label>
              <input
                type="number"
                step="0.05"
                value={ratePer1000Stitches}
                onChange={(e) => setRatePer1000Stitches(Number(e.target.value))}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg font-mono font-bold text-blue-600"
              />
            </div>
            <div>
              <label className="font-semibold text-slate-700 block mb-1">
                Operator Piece Wage ({currSymbol}/piece)
              </label>
              <input
                type="number"
                step="0.5"
                value={operatorWagePerPiece}
                onChange={(e) => setOperatorWagePerPiece(Number(e.target.value))}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg font-mono font-medium"
              />
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">
                Backing Paper / Buckram ({currSymbol}/pc)
              </label>
              <input
                type="number"
                step="0.5"
                value={backingPaperCost}
                onChange={(e) => setBackingPaperCost(Number(e.target.value))}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg font-mono"
              />
            </div>
            <div>
              <label className="font-semibold text-slate-700 block mb-1">
                Thread & Bobbins Cost ({currSymbol}/pc)
              </label>
              <input
                type="number"
                step="0.5"
                value={threadCost}
                onChange={(e) => setThreadCost(Number(e.target.value))}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg font-mono"
              />
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">
                3D Foam / Water Soluble Film ({currSymbol}/pc)
              </label>
              <input
                type="number"
                step="0.5"
                value={foilOrFoamCost}
                onChange={(e) => setFoilOrFoamCost(Number(e.target.value))}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg font-mono"
              />
            </div>
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Target Profit Margin (%)</label>
              <input
                type="number"
                value={marginPercent}
                onChange={(e) => setMarginPercent(Number(e.target.value))}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg font-mono font-bold text-emerald-600"
              />
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <button
              onClick={handleSaveQuote}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold text-xs flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Commit Quotation to Ledger</span>
            </button>
          </div>
        </div>

        {/* Right 5 cols: Quotation Bill Preview */}
        <div className="lg:col-span-5 bg-gradient-to-br from-slate-900 to-slate-950 text-white rounded-xl border border-slate-800 p-5 shadow-md flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div>
                <span className="text-[10px] text-blue-400 uppercase font-mono font-bold tracking-wider">
                  Cost Estimation Slip
                </span>
                <h3 className="text-base font-bold text-white tracking-tight">
                  {customerName}
                </h3>
              </div>
              <span className="text-xs font-mono text-slate-400">
                {(stitchCount / 1000).toFixed(1)}k Stitches
              </span>
            </div>

            <div className="space-y-2.5 py-4 text-xs">
              <div className="flex items-center justify-between text-slate-400">
                <span>Stitch Machine Charge:</span>
                <span className="font-mono text-white">
                  {currSymbol}{stitchJobRatePerPiece.toFixed(2)} / pc
                </span>
              </div>
              <div className="flex items-center justify-between text-slate-400">
                <span>Raw Materials (Backing, Thread, Solvy):</span>
                <span className="font-mono text-white">
                  {currSymbol}{rawMaterialCostPerPiece.toFixed(2)} / pc
                </span>
              </div>
              <div className="flex items-center justify-between text-slate-400">
                <span>Operator Stitch Wage:</span>
                <span className="font-mono text-white">
                  {currSymbol}{operatorWagePerPiece.toFixed(2)} / pc
                </span>
              </div>
              <div className="flex items-center justify-between text-slate-400 pt-2 border-t border-slate-800">
                <span>Unit Cost Price:</span>
                <span className="font-mono font-bold text-slate-200">
                  {currSymbol}{baseCostPerPiece.toFixed(2)}
                </span>
              </div>
              <div className="flex items-center justify-between text-emerald-400">
                <span>Margin (+{marginPercent}%):</span>
                <span className="font-mono font-bold">
                  +{currSymbol}{profitPerPiece.toFixed(2)}
                </span>
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-800 space-y-3">
            <div className="bg-slate-800/80 p-3.5 rounded-xl border border-slate-700/80 flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block">
                  Quoted Selling Price
                </span>
                <span className="text-xl font-black text-white">
                  {currSymbol}{quotedPricePerPiece.toFixed(2)}
                  <span className="text-xs font-normal text-slate-400"> / piece</span>
                </span>
              </div>
              <div className="text-right">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">
                  Batch Total ({orderQuantity} pcs)
                </span>
                <span className="text-xl font-black text-emerald-400">
                  {currSymbol}{Math.round(totalJobworkQuote).toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Saved Quotations Register */}
      <div className="bg-white rounded-xl border border-slate-200/90 shadow-xs overflow-hidden">
        <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-600">
            Recent Jobwork Quotations Register
          </h3>
          <span className="text-xs text-slate-400 font-medium">Exportable format</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-400 font-semibold text-[11px] uppercase">
                <th className="py-2.5 px-4">Quote #</th>
                <th className="py-2.5 px-3">Customer</th>
                <th className="py-2.5 px-3">Job Description</th>
                <th className="py-2.5 px-3">Order Quantity</th>
                <th className="py-2.5 px-3">Quoted Amount</th>
                <th className="py-2.5 px-3">Date</th>
                <th className="py-2.5 px-4 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700 font-medium">
              {savedQuotes.map((q) => (
                <tr key={q.id} className="hover:bg-slate-50">
                  <td className="py-2.5 px-4 font-mono font-bold text-blue-600">{q.id}</td>
                  <td className="py-2.5 px-3 font-bold text-slate-900">{q.customer}</td>
                  <td className="py-2.5 px-3 text-slate-600">{q.job}</td>
                  <td className="py-2.5 px-3 font-semibold">{q.quantity.toLocaleString()} pcs</td>
                  <td className="py-2.5 px-3 font-bold text-emerald-600">
                    {q.currency === 'INR' ? '₹' : '$'}
                    {q.quoteTotal.toLocaleString()}
                  </td>
                  <td className="py-2.5 px-3 font-mono text-slate-400">{q.date}</td>
                  <td className="py-2.5 px-4 text-right">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      {q.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
