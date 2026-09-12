import React, { useState } from 'react';
import {
  Package,
  Plus,
  Search,
  AlertTriangle,
  RefreshCw,
  Calculator,
  Layers,
  MessageSquare,
  Share2,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { KpiCard } from '../common/KpiCard';
import { SURAT_THREAD_SUPPLIER } from '../../data/mockData';

export const ThreadInventoryScreen: React.FC = () => {
  const { threadStock, updateThreadStock, sendSuratSupplierThreadOrderWhatsApp, language, t } = useApp();
  const threadInventory = threadStock.map(item => ({
    ...item, shadeCode: item.shadeCode ?? item.colorCode,
    hexCode: item.hexCode ?? item.hexColor,
    assignedMachines: item.assignedMachines ?? item.activeMachinesUsing,
  }));
  const [searchQuery, setSearchQuery] = useState('');
  const [filterBrand, setFilterBrand] = useState('ALL');

  // Interactive Batch Stitch Thread Calculator
  const [calcOrderStitches, setCalcOrderStitches] = useState(1500000); // 1.5 million stitches
  const [calcThreadLengthPer1k, setCalcThreadLengthPer1k] = useState(5.2); // meters per 1000 stitches
  const [calcConeLength, setCalcConeLength] = useState(5000); // 5000m cone

  const requiredMeters = (calcOrderStitches / 1000) * calcThreadLengthPer1k;
  const conesNeeded = (requiredMeters / calcConeLength).toFixed(1);

  const filteredItems = threadInventory.filter((t) => {
    const matchesSearch =
      t.colorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.shadeCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.brand.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesBrand = filterBrand === 'ALL' || t.brand === filterBrand;
    return matchesSearch && matchesBrand;
  });

  const lowStockCount = threadInventory.filter((t) => t.conesInStock <= t.minThreshold).length;

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="bg-white rounded-xl border border-slate-200/90 p-4 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-bold text-slate-900 tracking-tight">
            Thread & Bobbin Inventory Management
          </h2>
          <p className="text-xs text-slate-500 font-medium">
            Shade codes, cone inventory, prewound bobbins, and batch consumption estimator
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 text-xs">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search shade code / color..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs"
            />
          </div>

          <select
            value={filterBrand}
            onChange={(e) => setFilterBrand(e.target.value)}
            className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg font-semibold text-slate-700 cursor-pointer"
          >
            <option value="ALL">All Brands</option>
            <option value="Madeira">Madeira</option>
            <option value="Isacord">Isacord</option>
            <option value="Gunold">Gunold</option>
            <option value="Coats">Coats</option>
          </select>
        </div>
      </div>

      {/* Low Stock Urgent Alert Banner */}
      {lowStockCount > 0 && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
          <div className="flex items-center gap-3">
            <span className="p-2 bg-rose-100 text-rose-600 rounded-lg shrink-0">
              <AlertTriangle className="w-5 h-5 animate-pulse" />
            </span>
            <div>
              <h4 className="text-xs font-bold text-rose-900">
                {language === 'gu'
                  ? `ચેતવણી: ${lowStockCount} દોરાના શેડ્સમાં ૨ કરતાં ઓછા કોન બાકી છે!`
                  : `Critical Stock Alert: ${lowStockCount} Thread Shades Below Safe Buffer (< 3 cones)!`}
              </h4>
              <p className="text-[11px] text-rose-700 mt-0.5">
                Surat Supplier: {SURAT_THREAD_SUPPLIER.name} • Ring Road Market
              </p>
            </div>
          </div>

          <button
            onClick={() => sendSuratSupplierThreadOrderWhatsApp('Golden Zari #1024', 20)}
            className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg flex items-center justify-center gap-1.5 shadow-sm transition-colors cursor-pointer shrink-0"
          >
            <MessageSquare className="w-4 h-4" />
            {language === 'gu' ? 'સુરત સપ્લાયરને વોટ્સએપ ઓર્ડર કરો' : 'WhatsApp Surat Supplier Restock'}
          </button>
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <KpiCard
          title="Total Shade Cones in Stock"
          value={threadInventory.reduce((acc, t) => acc + t.conesInStock, 0)}
          subValue="Across 40 wt rayon & polyester"
          icon={Package}
          iconColor="text-blue-600"
          iconBg="bg-blue-50"
        />
        <KpiCard
          title="Low Stock Warning Items"
          value={lowStockCount}
          subValue="Below minimum threshold cones"
          icon={AlertTriangle}
          iconColor="text-rose-600"
          iconBg="bg-rose-50"
        />
        <KpiCard
          title="Active Spindle Needles Fed"
          value="128 Needles"
          subValue="Current live factory draw"
          icon={Layers}
          iconColor="text-emerald-600"
          iconBg="bg-emerald-50"
        />
      </div>

      {/* Interactive Batch Thread Calculator Box */}
      <div className="bg-white rounded-xl border border-blue-200 p-5 shadow-xs space-y-3">
        <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
          <Calculator className="w-4 h-4 text-blue-600" />
          <h3 className="text-sm font-bold text-slate-900">
            Batch Thread & Bobbin Estimator
          </h3>
          <span className="text-[11px] text-slate-400">
            (Calculate exactly how many 5,000m cones are required for an order)
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-xs">
          <div>
            <label className="font-semibold text-slate-700 block mb-1">
              Order Total Stitches
            </label>
            <input
              type="number"
              step="50000"
              value={calcOrderStitches}
              onChange={(e) => setCalcOrderStitches(Number(e.target.value))}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg font-mono font-semibold"
            />
          </div>

          <div>
            <label className="font-semibold text-slate-700 block mb-1">
              Thread Consumption (m/1k St)
            </label>
            <input
              type="number"
              step="0.1"
              value={calcThreadLengthPer1k}
              onChange={(e) => setCalcThreadLengthPer1k(Number(e.target.value))}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg font-mono font-semibold"
            />
          </div>

          <div>
            <label className="font-semibold text-slate-700 block mb-1">
              Cone Length (Meters)
            </label>
            <select
              value={calcConeLength}
              onChange={(e) => setCalcConeLength(Number(e.target.value))}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg font-semibold"
            >
              <option value="5000">5,000 Meters (Standard King Cone)</option>
              <option value="1000">1,000 Meters (Mini Spool)</option>
              <option value="10000">10,000 Meters (Jumbo Spool)</option>
            </select>
          </div>

          <div className="p-3 bg-blue-50/70 border border-blue-200 rounded-xl flex flex-col justify-between">
            <span className="text-[11px] font-semibold text-blue-700">Estimated Thread Needed</span>
            <div className="flex items-baseline gap-2">
              <span className="text-xl font-extrabold text-blue-900">{conesNeeded} Cones</span>
              <span className="text-[10px] text-blue-600 font-mono">({Math.round(requiredMeters).toLocaleString()}m)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Thread Cones Inventory Table */}
      <div className="bg-white rounded-xl border border-slate-200/90 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-400 font-semibold text-[11px] uppercase">
                <th className="py-3 px-4">Shade / Color</th>
                <th className="py-3 px-3">Shade Code</th>
                <th className="py-3 px-3">Brand / Type</th>
                <th className="py-3 px-3">Cones in Stock</th>
                <th className="py-3 px-3">Cone Size</th>
                <th className="py-3 px-3">Min Threshold</th>
                <th className="py-3 px-3">Assigned Machines</th>
                <th className="py-3 px-4 text-right">Stock Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700 font-medium">
              {filteredItems.map((item) => {
                const isLow = item.conesInStock <= item.minThreshold;
                return (
                  <tr key={item.id} className="hover:bg-slate-50">
                    <td className="py-3 px-4 font-bold text-slate-900 flex items-center gap-2">
                      <span
                        className="w-4 h-4 rounded-full border border-slate-300 shrink-0 shadow-2xs"
                        style={{ backgroundColor: item.hexCode }}
                      />
                      <span>{item.colorName}</span>
                    </td>
                    <td className="py-3 px-3 font-mono font-bold text-slate-700">
                      {item.shadeCode}
                    </td>
                    <td className="py-3 px-3 text-slate-600 font-medium">
                      {item.brand} ({item.threadType})
                    </td>
                    <td className="py-3 px-3">
                      <span
                        className={`font-bold tabular-nums ${
                          isLow ? 'text-rose-600' : 'text-slate-900'
                        }`}
                      >
                        {item.conesInStock} Cones
                      </span>
                      {isLow && (
                        <span className="ml-2 px-1.5 py-0.5 rounded text-[10px] font-bold bg-rose-100 text-rose-800">
                          Low Stock
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-3 text-slate-500">{item.metersPerCone}m</td>
                    <td className="py-3 px-3 text-slate-400">{item.minThreshold} Cones</td>
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-1">
                        {item.assignedMachines.map((m) => (
                          <span
                            key={m}
                            className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-slate-100 text-slate-700"
                          >
                            {m}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {isLow && (
                          <button
                            onClick={() =>
                              sendSuratSupplierThreadOrderWhatsApp(item.shadeCode, 20)
                            }
                            className="px-2 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-300 rounded font-semibold text-[11px] transition-colors cursor-pointer flex items-center gap-1"
                            title="WhatsApp Order to Surat Supplier"
                          >
                            <MessageSquare className="w-3 h-3 text-emerald-600" />
                            Order
                          </button>
                        )}
                        <button
                          onClick={() => updateThreadStock(item.id, item.conesInStock + 10)}
                          className="px-2.5 py-1 bg-slate-50 hover:bg-blue-50 text-blue-700 border border-slate-200 rounded font-semibold transition-colors cursor-pointer"
                        >
                          +10 Cones
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
