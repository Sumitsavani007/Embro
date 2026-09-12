import React, { useState } from 'react';
import {
  Truck,
  FileText,
  Printer,
  Plus,
  Search,
  CheckCircle2,
  Package,
  Calendar,
  Layers,
} from 'lucide-react';
import { KpiCard } from '../common/KpiCard';

export const DispatchChallanScreen: React.FC = () => {
  const [challans, setChallans] = useState([
    {
      id: 'DC-2025-041',
      date: '2025-04-20',
      client: 'Zara Apparel Pvt Ltd',
      destAddress: 'Plot 44, GIDC Apparel Park, Surat',
      vehicleNo: 'GJ-05-AX-8910',
      driverName: 'Mohan Singh',
      items: [
        { desc: 'Summer Polo Chest Logo (Embroidery Finished)', cartons: 6, pieces: 1200, unit: 'Pcs' },
      ],
      totalPieces: 1200,
      totalCartons: 6,
      status: 'DISPATCHED',
      gatePassNo: 'GP-9102',
    },
    {
      id: 'DC-2025-040',
      date: '2025-04-19',
      client: 'Raymond Luxury Suiting',
      destAddress: 'Industrial Zone B, Ahmedabad',
      vehicleNo: 'GJ-01-TC-4412',
      driverName: 'Sanjay Rawat',
      items: [
        { desc: 'Navy Blazer Pocket Emblem (Gold Zari)', cartons: 3, pieces: 500, unit: 'Pcs' },
      ],
      totalPieces: 500,
      totalCartons: 3,
      status: 'DELIVERED',
      gatePassNo: 'GP-9098',
    },
  ]);

  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Modal form
  const [clientName, setClientName] = useState('FabIndia Textile Division');
  const [destAddress, setDestAddress] = useState('Ring Road Silk Market, Surat');
  const [vehicleNo, setVehicleNo] = useState('GJ-05-ZZ-1234');
  const [driverName, setDriverName] = useState('Vipul Prajapati');
  const [itemDesc, setItemDesc] = useState('Kurti Border Floral Zari (18k Stitches)');
  const [cartons, setCartons] = useState(4);
  const [pieces, setPieces] = useState(800);

  const handleCreateChallan = (e: React.FormEvent) => {
    e.preventDefault();
    const newChallan = {
      id: `DC-2025-0${40 + challans.length + 2}`,
      date: new Date().toISOString().split('T')[0],
      client: clientName,
      destAddress: destAddress,
      vehicleNo: vehicleNo,
      driverName: driverName,
      items: [{ desc: itemDesc, cartons: Number(cartons), pieces: Number(pieces), unit: 'Pcs' }],
      totalPieces: Number(pieces),
      totalCartons: Number(cartons),
      status: 'DISPATCHED',
      gatePassNo: `GP-${9100 + challans.length + 2}`,
    };
    setChallans([newChallan, ...challans]);
    setIsModalOpen(false);
  };

  const filtered = challans.filter(
    (c) =>
      c.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.client.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.vehicleNo.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="bg-white rounded-xl border border-slate-200/90 p-4 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-bold text-slate-900 tracking-tight">
            Delivery Challan & Factory Gatepass Register
          </h2>
          <p className="text-xs text-slate-500 font-medium">
            Generate dispatch slips, carton packing manifests, vehicle permits, and proof of dispatch
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 text-xs">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search challan, client, vehicle..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs"
            />
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="max-w-full px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Generate Delivery Challan</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <KpiCard
          title="Dispatched Pieces (Today)"
          value="1,700 Pcs"
          subValue="Across 9 export cartons"
          icon={Package}
          iconColor="text-blue-600"
          iconBg="bg-blue-50"
        />
        <KpiCard
          title="Active Gatepasses"
          value="2 Consignments"
          subValue="In transit via factory logistics"
          icon={Truck}
          iconColor="text-emerald-600"
          iconBg="bg-emerald-50"
        />
        <KpiCard
          title="Dispatch Compliance"
          value="100% On-Time"
          subValue="Against customer SLA deadlines"
          icon={CheckCircle2}
          iconColor="text-indigo-600"
          iconBg="bg-indigo-50"
        />
      </div>

      {/* Challans List */}
      <div className="space-y-4">
        {filtered.map((c) => (
          <div
            key={c.id}
            className="bg-white rounded-xl border border-slate-200/90 p-5 shadow-xs space-y-3"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
                  <FileText className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-slate-900 text-sm">{c.id}</span>
                    <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                      Gatepass: {c.gatePassNo}
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      {c.status}
                    </span>
                  </div>
                  <p className="text-xs font-bold text-slate-700 mt-0.5">
                    Client: {c.client}
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2 text-xs">
                <button
                  onClick={() => {
                    try {
                      window.print();
                    } catch (err) {
                      console.warn('Print not supported in this frame:', err);
                    }
                  }}
                  className="px-3 py-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg font-semibold flex items-center gap-1 text-slate-700 cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print Gatepass</span>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                <span className="text-[10px] text-slate-400 uppercase font-bold block mb-1">
                  Destination Address
                </span>
                <span className="text-slate-700 font-medium block">{c.destAddress}</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                <span className="text-[10px] text-slate-400 uppercase font-bold block mb-1">
                  Logistics & Transport
                </span>
                <span className="text-slate-800 font-bold block">Vehicle: {c.vehicleNo}</span>
                <span className="text-slate-500 text-[11px]">Driver: {c.driverName}</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                <span className="text-[10px] text-slate-400 uppercase font-bold block mb-1">
                  Quantity Shipped
                </span>
                <span className="text-base font-black text-slate-900 block">
                  {c.totalPieces.toLocaleString()} Pcs{' '}
                  <span className="text-xs font-normal text-slate-500">({c.totalCartons} Cartons)</span>
                </span>
              </div>
            </div>

            <div className="p-2.5 bg-slate-50/50 rounded-lg border border-slate-100 text-xs text-slate-600 flex items-center justify-between">
              <span>
                <strong>Manifest Item: </strong> {c.items[0].desc}
              </span>
              <span className="font-mono text-slate-400 text-[11px]">{c.date}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-200 max-w-md w-full p-6 animate-in fade-in-50 zoom-in-95">
            <h3 className="text-base font-bold text-slate-900 mb-1">
              Issue Delivery Challan & Security Gatepass
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Enter carton count and destination for security release
            </p>

            <form onSubmit={handleCreateChallan} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Client / Consignee</label>
                <input
                  type="text"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Destination Address</label>
                <input
                  type="text"
                  value={destAddress}
                  onChange={(e) => setDestAddress(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Vehicle #</label>
                  <input
                    type="text"
                    value={vehicleNo}
                    onChange={(e) => setVehicleNo(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg font-mono uppercase"
                    required
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Driver Name</label>
                  <input
                    type="text"
                    value={driverName}
                    onChange={(e) => setDriverName(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Item Description</label>
                <input
                  type="text"
                  value={itemDesc}
                  onChange={(e) => setItemDesc(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Total Garment Pcs</label>
                  <input
                    type="number"
                    value={pieces}
                    onChange={(e) => setPieces(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg"
                    required
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Cartons / Boxes</label>
                  <input
                    type="number"
                    value={cartons}
                    onChange={(e) => setCartons(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg"
                    required
                  />
                </div>
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
                  Issue Challan & Gatepass
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
