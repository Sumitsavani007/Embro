import React, { useState } from 'react';
import {
  Boxes,
  Plus,
  Search,
  AlertTriangle,
  Scissors,
  Layers,
  Sparkles,
} from 'lucide-react';
import { KpiCard } from '../common/KpiCard';

export const RawMaterialsScreen: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');

  const [inventory, setInventory] = useState([
    {
      id: 'RM-01',
      name: 'Non-Woven Tearaway Backing Paper',
      category: 'BACKING',
      spec: '45 GSM, 100cm × 100m Roll',
      quantity: 18,
      unit: 'Rolls',
      minThreshold: 5,
      location: 'Rack A-02',
      status: 'IN_STOCK',
    },
    {
      id: 'RM-02',
      name: 'Cutaway Heavyweight Buckram',
      category: 'BACKING',
      spec: '80 GSM, Cap Crown Stabilizer',
      quantity: 12,
      unit: 'Rolls',
      minThreshold: 4,
      location: 'Rack A-04',
      status: 'IN_STOCK',
    },
    {
      id: 'RM-03',
      name: 'Water-Soluble Solvy Film (PVA)',
      category: 'FILM',
      spec: '25 Micron, Saree & Velvet Topping',
      quantity: 3,
      unit: 'Rolls',
      minThreshold: 4,
      location: 'Rack B-01',
      status: 'LOW_STOCK',
    },
    {
      id: 'RM-04',
      name: '3D High-Density EVA Puff Foam',
      category: 'FOAM',
      spec: '3.0mm Sheet, 40cm × 60cm',
      quantity: 140,
      unit: 'Sheets',
      minThreshold: 50,
      location: 'Rack B-03',
      status: 'IN_STOCK',
    },
    {
      id: 'RM-05',
      name: 'Organ Needles DBxK5 (Chrome)',
      category: 'NEEDLES',
      spec: 'Size #75/11 Ball Point',
      quantity: 450,
      unit: 'Needles',
      minThreshold: 100,
      location: 'Tool Drawer 1',
      status: 'IN_STOCK',
    },
    {
      id: 'RM-06',
      name: 'Groz-Beckert GEBEDUR (Titanium)',
      category: 'NEEDLES',
      spec: 'Size #80/12 Sharp Point',
      quantity: 80,
      unit: 'Needles',
      minThreshold: 100,
      location: 'Tool Drawer 2',
      status: 'LOW_STOCK',
    },
    {
      id: 'RM-07',
      name: 'White Spindle Lubrication Oil',
      category: 'OIL',
      spec: 'ISO VG 10 Anti-Rust White Oil',
      quantity: 35,
      unit: 'Liters',
      minThreshold: 10,
      location: 'Chemical Locker',
      status: 'IN_STOCK',
    },
  ]);

  const filtered = inventory.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.spec.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = categoryFilter === 'ALL' || item.category === categoryFilter;
    return matchesSearch && matchesCat;
  });

  const lowStockCount = inventory.filter((i) => i.quantity <= i.minThreshold).length;

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="bg-white rounded-xl border border-slate-200/90 p-4 shadow-xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-bold text-slate-900 tracking-tight">
            Raw Materials, Backing & Needles Inventory
          </h2>
          <p className="text-xs text-slate-500 font-medium">
            Tearaway paper, cap buckram, PVA solvy film, 3D puff foam, and machine needle reserves
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 text-xs">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search material, needle spec..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs"
            />
          </div>

          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg font-semibold text-slate-700 cursor-pointer"
          >
            <option value="ALL">All Consumables</option>
            <option value="BACKING">Backing Paper / Buckram</option>
            <option value="FILM">Water-Soluble Solvy (PVA)</option>
            <option value="FOAM">3D Puff Foam</option>
            <option value="NEEDLES">Machine Needles</option>
            <option value="OIL">Spindle & Hook Oil</option>
          </select>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <KpiCard
          title="Consumable Stock Items"
          value={inventory.length}
          subValue="Active Factory SKUs"
          icon={Boxes}
          iconColor="text-blue-600"
          iconBg="bg-blue-50"
        />
        <KpiCard
          title="Low Stock Re-order Alerts"
          value={lowStockCount}
          subValue="Solvy film & Groz-Beckert needles"
          icon={AlertTriangle}
          iconColor="text-rose-600"
          iconBg="bg-rose-50"
        />
        <KpiCard
          title="Backing Paper on Floor"
          value="30 Rolls"
          subValue="Covers ~45,000 garment repeats"
          icon={Layers}
          iconColor="text-emerald-600"
          iconBg="bg-emerald-50"
        />
      </div>

      {/* Inventory Table */}
      <div className="bg-white rounded-xl border border-slate-200/90 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-400 font-semibold text-[11px] uppercase">
                <th className="py-3 px-4">Material Name</th>
                <th className="py-3 px-3">Category</th>
                <th className="py-3 px-3">Specification / Grade</th>
                <th className="py-3 px-3">Current Stock</th>
                <th className="py-3 px-3">Min Threshold</th>
                <th className="py-3 px-3">Storage Bin</th>
                <th className="py-3 px-4 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700 font-medium">
              {filtered.map((item) => {
                const isLow = item.quantity <= item.minThreshold;
                return (
                  <tr key={item.id} className="hover:bg-slate-50">
                    <td className="py-3 px-4 font-bold text-slate-900">{item.name}</td>
                    <td className="py-3 px-3">
                      <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-100 text-slate-700">
                        {item.category}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-slate-600 font-mono text-[11px]">{item.spec}</td>
                    <td className="py-3 px-3 font-bold text-slate-900 tabular-nums">
                      {item.quantity} {item.unit}
                    </td>
                    <td className="py-3 px-3 text-slate-400">{item.minThreshold} {item.unit}</td>
                    <td className="py-3 px-3 text-slate-600 font-mono">{item.location}</td>
                    <td className="py-3 px-4 text-right">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          isLow
                            ? 'bg-rose-100 text-rose-800 animate-pulse'
                            : 'bg-emerald-50 text-emerald-700'
                        }`}
                      >
                        {isLow ? 'Re-order Now' : 'Healthy Stock'}
                      </span>
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
