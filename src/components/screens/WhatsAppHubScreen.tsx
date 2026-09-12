import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  MessageSquare,
  Send,
  UserCheck,
  Building,
  Package,
  CheckCircle2,
  Phone,
  Share2,
  ExternalLink,
  Sparkles,
  RefreshCw,
  Copy,
  Check,
} from 'lucide-react';
import { SURAT_THREAD_SUPPLIER } from '../../data/mockData';

export const WhatsAppHubScreen: React.FC = () => {
  const {
    orders,
    machines,
    totalProductionStitches,
    runningCount,
    totalMachines,
    threadBreakages,
    operatorAttendance,
    dgLogs,
    sendPartyWhatsAppUpdate,
    sendOwnerDailyShiftReportWhatsApp,
    sendSuratSupplierThreadOrderWhatsApp,
    language,
    t,
  } = useApp();

  const [selectedRecipientType, setSelectedRecipientType] = useState<'party' | 'owner' | 'supplier' | 'mechanic'>('party');
  const [selectedOrderNumber, setSelectedOrderNumber] = useState(orders[0]?.orderNumber || 'ORD-8492');
  const [partyPhone, setPartyPhone] = useState('+91 98251 12345');
  const [copied, setCopied] = useState(false);

  // Supplier Draft State
  const [selectedShade, setSelectedShade] = useState('Golden Zari #1024 (King Thread)');
  const [boxQuantity, setBoxQuantity] = useState('20');

  const selectedOrder = orders.find((o) => o.orderNumber === selectedOrderNumber) || orders[0];

  // Formatted Message Generator
  const getMessageContent = () => {
    if (selectedRecipientType === 'party') {
      return `🧵 *EMBROIDERY JOBWORK PRODUCTION UPDATE*

Dear *${selectedOrder?.clientName || 'Merchant'}*,

Your Production Order *#${selectedOrder?.orderNumber}* is actively being processed on our multi-head machines.

• *Design*: ${selectedOrder?.designName}
• *Fabric*: ${selectedOrder?.fabricType}
• *Target*: ${selectedOrder?.totalPieces} pieces (${((selectedOrder?.totalStitches || 0) / 1000).toFixed(0)}k stitches/pc)
• *Status*: ${selectedOrder?.status} (${selectedOrder?.progressPercentage}% Completed)
• *Verified By*: Floor Supervisor Harsh Kheni

📍 *Factory*: Unit 1 - Surat Textile Hub
🔗 *Job Slip*: https://embroiderytrack.app/challan/${selectedOrder?.orderNumber}

_Thank you for choosing Embroidery Track!_`;
    }

    if (selectedRecipientType === 'owner') {
      const totalIncentive = operatorAttendance.reduce((a, b) => a + b.incentiveEarnedINR, 0);
      return `🏭 *FACTORY OWNER DAILY SHIFT HANDOVER REPORT*

📅 *Date*: Today | *Shift*: Day Shift (8 AM - 8 PM)
📍 *Factory*: Surat Hub, Ring Road

📊 *Production KPIs*:
• Total Stitches Produced: *${totalProductionStitches.toLocaleString()} stitches*
• Active Running Fleet: *${runningCount} / ${totalMachines} Machines*
• Fleet Average Speed: *760 SPM*
• Thread Snap Incidents: *${threadBreakages.length} breakages*
• Operator Incentive Bonus: *₹${totalIncentive.toLocaleString()}*
• Power Outage (DG Run): *${dgLogs[0]?.durationMinutes || 0} mins logged*

✅ *OEE Performance*: 91.4% (Optimal)
_Shift signed off by Floor Supervisor._`;
    }

    if (selectedRecipientType === 'supplier') {
      return `🧵 *URGENT THREAD PURCHASE ORDER - SURAT EMBROIDERY*

To: *${SURAT_THREAD_SUPPLIER.name}*
Attn: *${SURAT_THREAD_SUPPLIER.contactPerson}* (${SURAT_THREAD_SUPPLIER.phone})
Millennium Textile Market, Ring Road, Surat

Urgent re-order required for Factory 1:
• *Thread Shade*: ${selectedShade}
• *Box Quantity*: ${boxQuantity} Boxes (40 cones/box)
• *Required Delivery*: Today by 5:00 PM via Ring Road tempo

Please confirm availability and dispatch challan.`;
    }

    return `⚠️ *CRITICAL MACHINE MAINTENANCE NOTIFICATION*

Machine M3 (Tajima TFMX-15) has reported a needle snap and head isolation on Head 04.
Technician intervention requested on Floor Line 1.`;
  };

  const handleSendWhatsApp = () => {
    const text = getMessageContent();
    let targetUrl = `https://wa.me/?text=${encodeURIComponent(text)}`;

    if (selectedRecipientType === 'party') {
      const cleanPhone = partyPhone.replace(/[^0-9]/g, '');
      if (cleanPhone) {
        targetUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(text)}`;
      }
    } else if (selectedRecipientType === 'supplier') {
      targetUrl = `https://wa.me/919825104291?text=${encodeURIComponent(text)}`;
    }

    try {
      window.open(targetUrl, '_blank');
    } catch (e) {
      console.warn('Unable to open window:', e);
    }
  };

  const handleCopyText = async () => {
    try {
      if (navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(getMessageContent());
      } else {
        const textArea = document.createElement('textarea');
        textArea.value = getMessageContent();
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.warn('Copy failed:', err);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 bg-emerald-500/10 text-emerald-600 rounded-lg">
              <MessageSquare className="w-5 h-5" />
            </span>
            <h1 className="text-xl font-bold text-slate-800">
              {language === 'gu' ? 'વોટ્સએપ ઓટોમેશન & ઈન્સ્ટન્ટ એલર્ટ હબ' : 'WhatsApp Automation & Instant Dispatch Hub'}
            </h1>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            {language === 'gu'
              ? 'પાર્ટી/વેપારીને ૧-ક્લિક ઓર્ડર અપડેટ, ફેક્ટરી માલિકને શિફ્ટ રિપોર્ટ અને સુરત દોરા સપ્લાયર ઓર્ડર'
              : '1-Click WhatsApp messaging for merchants, daily shift reports for owners, and auto-procurement drafts for Surat thread suppliers.'}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={sendOwnerDailyShiftReportWhatsApp}
            className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 shadow-sm transition-colors cursor-pointer"
          >
            <Building className="w-4 h-4 text-emerald-400" />
            {language === 'gu' ? 'ઓનર ડેઈલી શિફ્ટ રિપોર્ટ' : 'Send Owner Daily Shift Report'}
          </button>
        </div>
      </div>

      {/* Recipient Selection Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <button
          onClick={() => setSelectedRecipientType('party')}
          className={`p-4 rounded-xl border text-left transition-all cursor-pointer flex items-center gap-3 ${
            selectedRecipientType === 'party'
              ? 'bg-emerald-50/80 border-emerald-500 text-emerald-950 shadow-xs'
              : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
          }`}
        >
          <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
            <UserCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="font-bold text-sm">
              {language === 'gu' ? '૧. પાર્ટી / વેપારી એલર્ટ' : '1. Party / Merchant Alert'}
            </div>
            <div className="text-xs text-slate-500">Order progress & job slip link</div>
          </div>
        </button>

        <button
          onClick={() => setSelectedRecipientType('owner')}
          className={`p-4 rounded-xl border text-left transition-all cursor-pointer flex items-center gap-3 ${
            selectedRecipientType === 'owner'
              ? 'bg-emerald-50/80 border-emerald-500 text-emerald-950 shadow-xs'
              : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
          }`}
        >
          <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center shrink-0">
            <Building className="w-5 h-5" />
          </div>
          <div>
            <div className="font-bold text-sm">
              {language === 'gu' ? '૨. ફેક્ટરી માલિક શિફ્ટ રિપોર્ટ' : '2. Factory Owner Report'}
            </div>
            <div className="text-xs text-slate-500">Stitches, OEE, DG outage summary</div>
          </div>
        </button>

        <button
          onClick={() => setSelectedRecipientType('supplier')}
          className={`p-4 rounded-xl border text-left transition-all cursor-pointer flex items-center gap-3 ${
            selectedRecipientType === 'supplier'
              ? 'bg-emerald-50/80 border-emerald-500 text-emerald-950 shadow-xs'
              : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
          }`}
        >
          <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
            <Package className="w-5 h-5" />
          </div>
          <div>
            <div className="font-bold text-sm">
              {language === 'gu' ? '૩. સુરત દોરા સપ્લાયર ડ્રાફ્ટ' : '3. Surat Thread Supplier'}
            </div>
            <div className="text-xs text-slate-500">Instant shade restock order</div>
          </div>
        </button>
      </div>

      {/* Main Workspace: Controls Left, WhatsApp Chat Preview Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Col: Config Parameters (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-xl border border-slate-200 shadow-xs p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-200 pb-3">
            <h2 className="text-base font-bold text-slate-800">
              {selectedRecipientType === 'party' && (language === 'gu' ? 'પાર્ટી ઓર્ડર વિગતો' : 'Select Party Order')}
              {selectedRecipientType === 'owner' && (language === 'gu' ? 'શિફ્ટ સમરી પેરામીટર્સ' : 'Owner Handover Parameters')}
              {selectedRecipientType === 'supplier' && (language === 'gu' ? 'દોરા રી-ઓર્ડર વિગતો' : 'Thread Restock Specs')}
            </h2>
            <span className="text-xs text-slate-500 font-medium">WhatsApp API Ready</span>
          </div>

          {selectedRecipientType === 'party' && (
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Select Active Production Order</label>
                <select
                  value={selectedOrderNumber}
                  onChange={(e) => setSelectedOrderNumber(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-hidden"
                >
                  {orders.map((o) => (
                    <option key={o.id} value={o.orderNumber}>
                      {o.orderNumber} - {o.clientName} ({o.designName})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Recipient WhatsApp Mobile Number</label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    value={partyPhone}
                    onChange={(e) => setPartyPhone(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-hidden"
                    placeholder="+91 98251 XXXXX"
                  />
                </div>
              </div>

              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs space-y-1.5 text-slate-600">
                <div className="flex justify-between">
                  <span>Design & Fabric:</span>
                  <span className="font-semibold text-slate-800">
                    {selectedOrder?.designName} ({selectedOrder?.fabricType})
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Batch Completion:</span>
                  <span className="font-semibold text-emerald-600">
                    {selectedOrder?.progressPercentage}% Completed
                  </span>
                </div>
              </div>
            </div>
          )}

          {selectedRecipientType === 'owner' && (
            <div className="space-y-3">
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs space-y-2">
                <div className="font-bold text-slate-800 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  Auto-aggregated from live factory machines:
                </div>
                <div className="grid grid-cols-2 gap-2 text-slate-600">
                  <div>• Stitches: <strong>{totalProductionStitches.toLocaleString()}</strong></div>
                  <div>• Active Fleet: <strong>{runningCount} / {totalMachines}</strong></div>
                  <div>• Thread Snaps: <strong>{threadBreakages.length}</strong></div>
                  <div>• DG Outage: <strong>{dgLogs[0]?.durationMinutes || 0} mins</strong></div>
                </div>
              </div>
              <p className="text-xs text-slate-500">
                This summary will be dispatched directly to the factory owner's private WhatsApp chat.
              </p>
            </div>
          )}

          {selectedRecipientType === 'supplier' && (
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Surat Thread Supplier</label>
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs">
                  <div className="font-bold text-slate-900">{SURAT_THREAD_SUPPLIER.name}</div>
                  <div className="text-slate-600">Contact: {SURAT_THREAD_SUPPLIER.contactPerson} ({SURAT_THREAD_SUPPLIER.phone})</div>
                  <div className="text-slate-500 text-[11px]">{SURAT_THREAD_SUPPLIER.location}</div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Thread Shade / Code</label>
                <select
                  value={selectedShade}
                  onChange={(e) => setSelectedShade(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-hidden"
                >
                  <option value="Golden Zari #1024 (King Thread)">Golden Zari #1024 (King Thread) - Low Stock &lt; 2 Cones</option>
                  <option value="Royal Blue Viscose #204">Royal Blue Viscose #204</option>
                  <option value="Metallic Silver Zari #1028">Metallic Silver Zari #1028</option>
                  <option value="Ruby Red Poly #108">Ruby Red Poly #108</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Box Quantity (40 cones per box)</label>
                <input
                  type="number"
                  value={boxQuantity}
                  onChange={(e) => setBoxQuantity(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-hidden"
                />
              </div>
            </div>
          )}

          <div className="pt-4 border-t border-slate-200 flex items-center gap-3">
            <button
              onClick={handleSendWhatsApp}
              className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold flex items-center justify-center gap-2 shadow-sm shadow-emerald-600/20 transition-all cursor-pointer"
            >
              <Send className="w-4 h-4" />
              {language === 'gu' ? 'વોટ્સએપ ખોલો & મોકલો' : 'Launch & Send on WhatsApp'}
            </button>
            <button
              onClick={handleCopyText}
              className="px-3.5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
              {copied ? 'Copied' : 'Copy Text'}
            </button>
          </div>
        </div>

        {/* Right Col: WhatsApp Visual Chat Bubble Simulator (5 cols) */}
        <div className="lg:col-span-5 bg-[#ECE5DD] p-4 rounded-xl border border-slate-300 shadow-inner flex flex-col justify-between min-h-[420px]">
          <div>
            {/* Mock WhatsApp Header */}
            <div className="bg-[#075E54] text-white p-3 rounded-lg flex items-center gap-3 shadow-xs mb-4">
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center font-bold text-xs">
                ET
              </div>
              <div className="overflow-hidden">
                <div className="text-xs font-bold truncate">
                  {selectedRecipientType === 'party' && (selectedOrder?.clientName || 'Merchant')}
                  {selectedRecipientType === 'owner' && 'Factory Owner (Private)'}
                  {selectedRecipientType === 'supplier' && SURAT_THREAD_SUPPLIER.name}
                </div>
                <div className="text-[10px] text-emerald-200">Online • Verified Business</div>
              </div>
            </div>

            {/* Chat Bubble */}
            <div className="bg-white p-3.5 rounded-lg rounded-tl-none shadow-xs border border-slate-200 max-w-sm text-xs space-y-2 text-slate-800 leading-relaxed font-sans whitespace-pre-line">
              {getMessageContent()}
              <div className="text-right text-[10px] text-slate-400 flex items-center justify-end gap-1 pt-1">
                <span>{new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                <span className="text-blue-500 font-bold">✓✓</span>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-2 border-t border-slate-300/60 text-center text-[11px] text-slate-500">
            End-to-end encrypted textile production dispatch notice
          </div>
        </div>
      </div>
    </div>
  );
};
