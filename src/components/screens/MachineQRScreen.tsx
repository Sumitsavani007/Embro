import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  QrCode,
  Printer,
  Camera,
  Scan,
  CheckCircle2,
  ExternalLink,
  Plus,
  Layers,
  Sparkles,
  X,
  Tag,
  ArrowRight,
} from 'lucide-react';

export const MachineQRScreen: React.FC = () => {
  const { machines, bundleTags, addBundleTag, assignBundleToMachine, setCurrentRoute, setSelectedMachineId, language, t } = useApp();

  // Scanner Simulator State
  const [scannedResult, setScannedResult] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);

  // New Bundle Modal State
  const [isAddBundleModalOpen, setIsAddBundleModalOpen] = useState(false);
  const [bundleLot, setBundleLot] = useState('LOT-SURAT-8493-B1');
  const [bundleOrder, setBundleOrder] = useState('ORD-8493');
  const [bundleClient, setBundleClient] = useState('Keshav Fashions Surat');
  const [bundleDesign, setBundleDesign] = useState('Bridal Heavy Zari Border');
  const [bundleColor, setBundleColor] = useState('Maroon Velvet');
  const [bundlePieces, setBundlePieces] = useState('60');
  const [bundleMachine, setBundleMachine] = useState('M2');

  const handlePrint = () => {
    try {
      window.print();
    } catch (err) {
      console.warn('Print not supported in this frame:', err);
    }
  };

  const simulateScan = (code: string) => {
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
      setScannedResult(code);
    }, 600);
  };

  const handleCreateBundle = (e: React.FormEvent) => {
    e.preventDefault();
    const randomBarcode = '890400' + Math.floor(10000000 + Math.random() * 90000000);
    addBundleTag({
      bundleLotNumber: bundleLot,
      orderNumber: bundleOrder,
      clientName: bundleClient,
      designName: bundleDesign,
      fabricColor: bundleColor,
      piecesInBundle: parseInt(bundlePieces, 10) || 50,
      assignedMachine: bundleMachine,
      barcodeValue: randomBarcode,
    });
    setIsAddBundleModalOpen(false);
  };

  const scannedMachine = scannedResult
    ? machines.find(
        (m) =>
          m.id.toLowerCase() === scannedResult.toLowerCase() ||
          m.name.toLowerCase() === scannedResult.toLowerCase() ||
          scannedResult.includes(m.name)
      )
    : null;

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto space-y-6">
      {/* Printable Sheet Styling */}
      <style>{`
        @media print {
          body * {
            visibility: hidden;
          }
          #printable-qr-grid, #printable-qr-grid * {
            visibility: visible;
          }
          #printable-qr-grid {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            background: white !important;
          }
          .no-print {
            display: none !important;
          }
        }
      `}</style>

      {/* Top Banner & Header */}
      <div className="no-print flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 bg-indigo-500/10 text-indigo-600 rounded-lg">
              <QrCode className="w-5 h-5" />
            </span>
            <h1 className="text-xl font-bold text-slate-800">
              {language === 'gu' ? 'મશીન QR કોડ & જોબવર્ક બંડલ બારકોડ સિસ્ટમ' : 'Machine QR & Bundle Barcode Floor System'}
            </h1>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            {language === 'gu'
              ? 'દરેક મશીન માટે પ્રિન્ટેબલ QR સ્ટીકર અને કાપડના બંડલ ટ્રેકિંગ ટોકન્સ'
              : 'Printable floor stickers for machines and serialized barcode bundle slips for fabric cutting lots.'}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsAddBundleModalOpen(true)}
            className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            {language === 'gu' ? 'નવો બંડલ ટોકન' : 'New Bundle Token'}
          </button>
          <button
            onClick={handlePrint}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 shadow-sm shadow-indigo-500/20 transition-all cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            {language === 'gu' ? 'બધા QR સ્ટીકર પ્રિન્ટ કરો' : 'Print All QR Badges'}
          </button>
        </div>
      </div>

      {/* Scanner Simulator Box */}
      <div className="no-print bg-slate-900 text-white p-5 rounded-xl border border-slate-800 shadow-md">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center shrink-0">
              <Scan className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                {language === 'gu' ? 'મોબાઇલ QR & બારકોડ સ્કેનર સિમ્યુલેટર' : 'Live Floor QR Scanner Simulator'}
                <span className="text-[10px] px-2 py-0.5 bg-emerald-500/20 text-emerald-400 rounded-full font-mono">
                  CAMERA READY
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Click any machine button or bundle below to test immediate floor lookup
              </p>
            </div>
          </div>

          {/* Quick Demo Scan Buttons */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs text-slate-400 font-medium mr-1">Quick Scan:</span>
            {machines.slice(0, 5).map((m) => (
              <button
                key={m.id}
                onClick={() => simulateScan(m.name)}
                className="px-2.5 py-1 bg-slate-800 hover:bg-indigo-600 hover:text-white text-slate-300 text-xs font-semibold rounded-lg border border-slate-700 transition-colors cursor-pointer"
              >
                Scan {m.name}
              </button>
            ))}
            <button
              onClick={() => simulateScan('LOT-SURAT-8492-B1')}
              className="px-2.5 py-1 bg-slate-800 hover:bg-emerald-600 hover:text-white text-emerald-400 text-xs font-semibold rounded-lg border border-slate-700 transition-colors cursor-pointer"
            >
              Scan Bundle #8492
            </button>
          </div>
        </div>

        {/* Scan Result Dropdown / Drawer */}
        {isScanning && (
          <div className="mt-4 p-4 bg-slate-800/80 rounded-lg border border-indigo-500/30 flex items-center gap-3">
            <div className="w-4 h-4 border-2 border-indigo-400 border-t-transparent rounded-full animate-spin"></div>
            <span className="text-xs text-indigo-300 font-mono">Optical decoding in progress...</span>
          </div>
        )}

        {scannedResult && !isScanning && (
          <div className="mt-4 p-4 bg-slate-800 rounded-lg border border-emerald-500/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <span className="p-2 bg-emerald-500/20 text-emerald-400 rounded-lg">
                <CheckCircle2 className="w-5 h-5" />
              </span>
              <div>
                <div className="text-xs text-slate-400 font-mono">Decoded Payload: {scannedResult}</div>
                <div className="text-sm font-bold text-white">
                  {scannedMachine ? (
                    <span>
                      {scannedMachine.name} - {scannedMachine.brand} ({scannedMachine.status}) | Speed: {scannedMachine.speed} SPM
                    </span>
                  ) : (
                    <span>Fabric Bundle Lot: {scannedResult} - Verified by Floor Supervisor</span>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {scannedMachine && (
                <button
                  onClick={() => {
                    setSelectedMachineId(scannedMachine.id);
                    setCurrentRoute('machine-detail');
                  }}
                  className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-lg flex items-center gap-1 cursor-pointer"
                >
                  Go to Machine Detail <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}
              <button
                onClick={() => setScannedResult(null)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Printable Machine QR Badges Section */}
      <div id="printable-qr-grid" className="bg-white rounded-xl border border-slate-200 shadow-xs p-5 space-y-4">
        <div className="no-print flex items-center justify-between border-b border-slate-200 pb-3">
          <div>
            <h2 className="text-base font-bold text-slate-800 flex items-center gap-2">
              <QrCode className="w-4 h-4 text-indigo-600" />
              {language === 'gu' ? 'મશીન QR સ્ટીકર ગ્રીડ (પ્રિન્ટિંગ માટે તૈયાર)' : 'Printable Machine QR Badges'}
            </h2>
            <p className="text-xs text-slate-500">
              Paste these weatherproof badges onto the main control panel of each machine
            </p>
          </div>
          <span className="text-xs text-slate-500">8 Badges Formatted (A4 Sticker Sheet)</span>
        </div>

        {/* 8 Machine QR Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {machines.map((machine) => {
            const qrPayload = `embroiderytrack://machine/${machine.id}?name=${encodeURIComponent(machine.name)}`;
            return (
              <div
                key={machine.id}
                className="p-4 rounded-xl border-2 border-slate-800 bg-white text-slate-900 flex flex-col items-center text-center shadow-xs page-break-inside-avoid"
              >
                {/* Header Tag */}
                <div className="w-full flex items-center justify-between border-b border-slate-200 pb-2 mb-3">
                  <span className="font-extrabold text-sm tracking-tight text-slate-900">EMBROIDERY TRACK</span>
                  <span className="text-[10px] font-bold bg-slate-900 text-white px-2 py-0.5 rounded">
                    SURAT HUB
                  </span>
                </div>

                {/* SVG Vector QR Code */}
                <div className="p-2 bg-white border border-slate-300 rounded-lg shadow-inner mb-3">
                  <svg className="w-28 h-28" viewBox="0 0 100 100" fill="currentColor">
                    {/* SVG Realistic QR Matrix Pattern */}
                    <rect width="100" height="100" fill="#ffffff" />
                    {/* Top-Left Position Detection Pattern */}
                    <rect x="5" y="5" width="28" height="28" fill="#0f172a" rx="4" />
                    <rect x="9" y="9" width="20" height="20" fill="#ffffff" />
                    <rect x="13" y="13" width="12" height="12" fill="#0f172a" rx="2" />

                    {/* Top-Right Position Detection Pattern */}
                    <rect x="67" y="5" width="28" height="28" fill="#0f172a" rx="4" />
                    <rect x="71" y="9" width="20" height="20" fill="#ffffff" />
                    <rect x="75" y="13" width="12" height="12" fill="#0f172a" rx="2" />

                    {/* Bottom-Left Position Detection Pattern */}
                    <rect x="5" y="67" width="28" height="28" fill="#0f172a" rx="4" />
                    <rect x="9" y="71" width="20" height="20" fill="#ffffff" />
                    <rect x="13" y="75" width="12" height="12" fill="#0f172a" rx="2" />

                    {/* Data Pixels Representation */}
                    <rect x="38" y="10" width="6" height="6" fill="#0f172a" />
                    <rect x="48" y="10" width="6" height="6" fill="#0f172a" />
                    <rect x="38" y="22" width="6" height="6" fill="#0f172a" />
                    <rect x="52" y="22" width="8" height="6" fill="#0f172a" />

                    <rect x="10" y="38" width="6" height="6" fill="#0f172a" />
                    <rect x="22" y="38" width="8" height="6" fill="#0f172a" />
                    <rect x="38" y="38" width="14" height="14" fill="#0f172a" rx="1" />
                    <rect x="56" y="38" width="6" height="6" fill="#0f172a" />
                    <rect x="66" y="38" width="10" height="6" fill="#0f172a" />
                    <rect x="80" y="38" width="8" height="6" fill="#0f172a" />

                    <rect x="38" y="56" width="6" height="10" fill="#0f172a" />
                    <rect x="48" y="56" width="14" height="6" fill="#0f172a" />
                    <rect x="68" y="56" width="6" height="6" fill="#0f172a" />
                    <rect x="80" y="56" width="10" height="10" fill="#0f172a" />

                    <rect x="38" y="72" width="10" height="6" fill="#0f172a" />
                    <rect x="52" y="72" width="6" height="8" fill="#0f172a" />
                    <rect x="62" y="72" width="8" height="6" fill="#0f172a" />
                    <rect x="74" y="72" width="14" height="6" fill="#0f172a" />

                    <rect x="38" y="84" width="8" height="6" fill="#0f172a" />
                    <rect x="50" y="84" width="12" height="6" fill="#0f172a" />
                    <rect x="68" y="84" width="8" height="8" fill="#0f172a" />
                    <rect x="80" y="84" width="10" height="6" fill="#0f172a" />
                  </svg>
                </div>

                <div className="text-lg font-black tracking-tight text-slate-900">{machine.name}</div>
                <div className="text-xs font-semibold text-slate-600">{machine.brand} High-Speed</div>
                <div className="text-[11px] text-slate-500 mt-0.5">15 Heads • 120 Needles • 850 SPM Max</div>

                <div className="w-full mt-3 pt-2 border-t border-slate-200 flex items-center justify-between text-[10px] font-mono text-slate-500">
                  <span>ID: {machine.id.toUpperCase()}</span>
                  <span>IP: 192.168.1.{10 + parseInt(machine.id.replace(/\D/g, '') || '1', 10)}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Cutting Bundle Barcode Tokens Section */}
      <div className="no-print bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-base font-bold text-slate-800 flex items-center gap-2">
              <Tag className="w-4 h-4 text-emerald-600" />
              {language === 'gu' ? 'કાપડ જોબવર્ક બંડલ ટોકન્સ (બારકોડ સ્લિપ્સ)' : 'Fabric Jobwork Bundle Barcode Tokens'}
            </h2>
            <p className="text-xs text-slate-500">
              Track physical fabric cut-pieces from the hooping table to the embroidery machine with zero mixup
            </p>
          </div>
          <span className="text-xs text-slate-500">Active Lots: {bundleTags.length}</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider">
                <th className="py-3 px-4">Bundle Lot No</th>
                <th className="py-3 px-4">Order # / Merchant</th>
                <th className="py-3 px-4">Design & Fabric</th>
                <th className="py-3 px-4">Quantity</th>
                <th className="py-3 px-4">Assigned Machine</th>
                <th className="py-3 px-4">Barcode / Tag</th>
                <th className="py-3 px-4">Quick Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {bundleTags.map((bundle) => (
                <tr key={bundle.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3 px-4 font-mono font-bold text-indigo-700">
                    {bundle.bundleLotNumber}
                    <div className="text-[10px] text-slate-400 font-normal">{bundle.createdAt}</div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="font-bold text-slate-800">{bundle.clientName}</div>
                    <div className="text-[11px] text-slate-500">{bundle.orderNumber}</div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="font-semibold text-slate-700">{bundle.designName}</div>
                    <div className="text-[11px] text-slate-500">{bundle.fabricColor}</div>
                  </td>
                  <td className="py-3 px-4 font-bold text-slate-800">{bundle.piecesInBundle} pcs</td>
                  <td className="py-3 px-4">
                    <select
                      value={bundle.assignedMachine}
                      onChange={(e) => assignBundleToMachine(bundle.id, e.target.value)}
                      className="px-2 py-1 bg-slate-50 border border-slate-200 rounded text-xs font-semibold text-slate-700 cursor-pointer"
                    >
                      {machines.map((m) => (
                        <option key={m.id} value={m.name}>
                          {m.name}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="py-3 px-4 font-mono text-slate-600">
                    <div className="flex items-center gap-1.5">
                      <span className="w-1.5 h-6 bg-slate-900 inline-block"></span>
                      <span className="w-0.5 h-6 bg-slate-900 inline-block"></span>
                      <span className="w-1 h-6 bg-slate-900 inline-block"></span>
                      <span className="w-2 h-6 bg-slate-900 inline-block"></span>
                      <span className="w-0.5 h-6 bg-slate-900 inline-block"></span>
                      <span className="text-[11px] tracking-widest">{bundle.barcodeValue}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <button
                      onClick={() => simulateScan(bundle.bundleLotNumber)}
                      className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded text-[11px] transition-colors cursor-pointer"
                    >
                      Scan Tag
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: Add New Bundle Token */}
      {isAddBundleModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <span className="p-2 bg-indigo-100 text-indigo-700 rounded-lg">
                  <Tag className="w-5 h-5" />
                </span>
                <h3 className="text-base font-bold text-slate-900">
                  {language === 'gu' ? 'નવો જોબવર્ક બંડલ ટોકન બનાવો' : 'Generate Bundle Barcode Token'}
                </h3>
              </div>
              <button
                onClick={() => setIsAddBundleModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateBundle} className="mt-4 space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Bundle Lot Identifier</label>
                <input
                  type="text"
                  required
                  value={bundleLot}
                  onChange={(e) => setBundleLot(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-hidden"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Order Number</label>
                  <input
                    type="text"
                    required
                    value={bundleOrder}
                    onChange={(e) => setBundleOrder(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Pieces Count</label>
                  <input
                    type="number"
                    required
                    value={bundlePieces}
                    onChange={(e) => setBundlePieces(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Party / Merchant Name</label>
                <input
                  type="text"
                  required
                  value={bundleClient}
                  onChange={(e) => setBundleClient(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Design & Color</label>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    required
                    value={bundleDesign}
                    onChange={(e) => setBundleDesign(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg"
                    placeholder="Design"
                  />
                  <input
                    type="text"
                    required
                    value={bundleColor}
                    onChange={(e) => setBundleColor(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg"
                    placeholder="Fabric Color"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Initial Assigned Machine</label>
                <select
                  value={bundleMachine}
                  onChange={(e) => setBundleMachine(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-hidden"
                >
                  {machines.map((m) => (
                    <option key={m.id} value={m.name}>
                      {m.name} ({m.brand})
                    </option>
                  ))}
                </select>
              </div>

              <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddBundleModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg cursor-pointer"
                >
                  {t('common.cancel', 'Cancel')}
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm cursor-pointer"
                >
                  Generate Barcode Slip
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
