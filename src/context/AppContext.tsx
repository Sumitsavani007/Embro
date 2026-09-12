import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  Machine,
  Alert,
  ThreadBreakage,
  MachineEvent,
  Factory,
  User,
  BreakageReason,
  ProductionOrder,
  Operator,
  MachineMaintenanceTask,
  MaintenanceLogEntry,
  QCInspectionRecord,
  ThreadSpoolStock,
  AppRoute,
  EmbroideryDesign,
  JobworkCosting,
  MachineMultiHeadStatus,
  RawMaterialStockItem,
  ShiftHandoverRecord,
  DeliveryChallan,
  DowntimeRootCause,
  AppLanguage,
  MachinePowerMetric,
  DGRunLog,
  OperatorAttendanceRecord,
  OperatorKhataEntry,
  OperatorSalarySlip,
  BundleBarcodeTag,
} from '../types';
import {
  INITIAL_MACHINES,
  INITIAL_ALERTS,
  THREAD_BREAKAGES,
  TIMELINE_EVENTS,
  FACTORIES,
  CURRENT_USER,
  INITIAL_PRODUCTION_ORDERS,
  INITIAL_OPERATORS,
  INITIAL_MAINTENANCE_TASKS,
  INITIAL_MAINTENANCE_LOGS,
  INITIAL_QC_RECORDS,
  INITIAL_THREAD_STOCK,
  MOCK_EMBROIDERY_DESIGNS,
  MOCK_JOBWORK_COSTINGS,
  MOCK_MACHINE_MULTIHEAD,
  MOCK_RAW_MATERIALS,
  MOCK_SHIFT_HANDOVERS,
  MOCK_DELIVERY_CHALLANS,
  MOCK_DOWNTIME_ROOT_CAUSES,
  MOCK_POWER_METRICS,
  MOCK_DG_LOGS,
  MOCK_OPERATOR_ATTENDANCE,
  MOCK_OPERATOR_KHATA,
  MOCK_SALARY_SLIPS,
  MOCK_BUNDLE_TAGS,
  SURAT_THREAD_SUPPLIER,
} from '../data/mockData';
import { getTranslation } from '../utils/translations';

export type ScreenRoute = AppRoute;
export type DeviceMode = 'responsive' | 'desktop' | 'tablet' | 'mobile';

interface AppContextType {
  currentRoute: ScreenRoute;
  setCurrentRoute: (route: ScreenRoute) => void;
  selectedMachineId: string;
  setSelectedMachineId: (id: string) => void;
  machines: Machine[];
  updateMachine: (id: string, updates: Partial<Machine>) => void;
  addMachine: (newMachine: Omit<Machine, 'id' | 'lastUpdated'>) => void;
  deleteMachine: (id: string) => void;

  // Real-time simulation
  isSimulating: boolean;
  setIsSimulating: (val: boolean | ((prev: boolean) => boolean)) => void;
  triggerSimulatedEvent: (type: 'thread_break' | 'machine_start' | 'emergency_stop' | 'speed_boost') => void;

  // Authentication
  isAuthenticated: boolean;
  currentUser: User;
  login: (email: string, pass: string) => Promise<boolean>;
  logout: () => void;

  // Filters & State
  selectedFactory: Factory;
  setSelectedFactory: (factory: Factory) => void;
  selectedGroup: string;
  setSelectedGroup: (group: string) => void;
  selectedShift: string;
  setSelectedShift: (shift: string) => void;
  selectedDateText: string;
  setSelectedDateText: (dateText: string) => void;

  // Alerts
  alerts: Alert[];
  unreadAlertCount: number;
  markAlertRead: (id: string) => void;
  markAlertAsRead: (id: string) => void;
  markAllAlertsRead: () => void;
  markAllAlertsAsRead: () => void;
  clearAlert: (id: string) => void;

  // Thread Breakages
  threadBreakages: ThreadBreakage[];
  logBreakage: (breakage: Omit<ThreadBreakage, 'id' | 'time'>) => void;
  resolveBreakage: (id: string) => void;

  // Timeline Events
  timelineEvents: MachineEvent[];

  // Production Orders & Batch ETA
  orders: ProductionOrder[];
  addOrder: (order: Omit<ProductionOrder, 'id'>) => void;
  updateOrder: (id: string, updates: Partial<ProductionOrder>) => void;

  // Operators & Performance
  operators: Operator[];
  updateOperatorStatus: (id: string, status: Operator['status']) => void;
  assignOperatorMachine: (operatorId: string, machineNumber: string) => void;

  // Preventive Maintenance
  maintenanceTasks: MachineMaintenanceTask[];
  maintenanceLogs: MaintenanceLogEntry[];
  logMaintenance: (entry: Omit<MaintenanceLogEntry, 'id'>) => void;
  performMaintenance: (taskId: string, notes?: string) => void;

  // Quality Control & Defects
  qcRecords: QCInspectionRecord[];
  addQCRecord: (record: Omit<QCInspectionRecord, 'id' | 'timestamp'>) => void;

  // Thread & Bobbin Inventory
  threadStock: ThreadSpoolStock[];
  updateThreadStock: (id: string, cones: number) => void;

  // 6. Embroidery Design Visualizer & Stitch Simulation
  designs: EmbroideryDesign[];
  activeDesign: EmbroideryDesign;
  setActiveDesign: (design: EmbroideryDesign) => void;

  // 7. Jobwork Rate & Costing Calculator
  jobworkCostings: JobworkCosting[];
  addJobworkCosting: (costing: Omit<JobworkCosting, 'id'>) => void;

  // 8. Multi-Head Isolation Matrix
  multiHeadFleet: MachineMultiHeadStatus[];
  toggleHeadStatus: (machineNumber: string, headNumber: number) => void;

  // 9. Raw Materials Stock (Backing, Solvy, Puff, Needles, Zari)
  rawMaterials: RawMaterialStockItem[];
  updateRawMaterialQuantity: (id: string, delta: number) => void;

  // 10. Shift Handover Register
  shiftHandovers: ShiftHandoverRecord[];
  addShiftHandover: (record: Omit<ShiftHandoverRecord, 'id' | 'timestamp' | 'acknowledged'>) => void;

  // 11. Delivery Challan & Dispatch Gatepass
  deliveryChallans: DeliveryChallan[];
  addDeliveryChallan: (challan: Omit<DeliveryChallan, 'id' | 'challanNumber' | 'dispatchDateTime'>) => void;

  // 12. Downtime Root-Cause Analytics
  downtimeRootCauses: DowntimeRootCause[];

  // Language Support (English / Gujarati)
  language: AppLanguage;
  setLanguage: (lang: AppLanguage) => void;
  t: (key: string, fallback?: string) => string;

  // 13. Electricity & Power Factor Monitoring
  powerMetrics: MachinePowerMetric[];
  dgLogs: DGRunLog[];
  addDGLog: (log: Omit<DGRunLog, 'id'>) => void;

  // 14. Operator Attendance, Khata & Salary Slip
  operatorAttendance: OperatorAttendanceRecord[];
  markAttendance: (id: string, status: OperatorAttendanceRecord['status'], otHours?: number) => void;
  operatorKhata: OperatorKhataEntry[];
  addKhataEntry: (entry: Omit<OperatorKhataEntry, 'id'>) => void;
  salarySlips: OperatorSalarySlip[];

  // 15. Bundle Barcode Tokens
  bundleTags: BundleBarcodeTag[];
  addBundleTag: (tag: Omit<BundleBarcodeTag, 'id' | 'createdAt'>) => void;
  assignBundleToMachine: (bundleId: string, machineNumber: string) => void;

  // 16. Instant WhatsApp Notifications
  sendPartyWhatsAppUpdate: (orderNumber: string, clientName: string, phone?: string) => void;
  sendOwnerDailyShiftReportWhatsApp: () => void;
  sendSuratSupplierThreadOrderWhatsApp: (shadeNumber: string, conesRequired: number) => void;
  sendSalarySlipWhatsApp: (operatorName: string, monthYear: string, netPayable: number, phone?: string) => void;

  // Global Omni Search (Ctrl+K)
  isOmniSearchOpen: boolean;
  setIsOmniSearchOpen: (open: boolean | ((prev: boolean) => boolean)) => void;

  // Responsive / Device frame mode
  deviceMode: DeviceMode;
  setDeviceMode: (mode: DeviceMode) => void;

  // Mobile menu / notifications drawer
  isAlertDrawerOpen: boolean;
  setIsAlertDrawerOpen: (open: boolean) => void;
  isFlutterCodeModalOpen: boolean;
  setIsFlutterCodeModalOpen: (open: boolean) => void;

  // Quick stats computed
  totalMachines: number;
  runningCount: number;
  idleCount: number;
  stoppedCount: number;
  offlineCount: number;
  totalProductionStitches: number;
  averageEfficiency: number;
  averageSpeedSPM: number;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentRoute, setCurrentRoute] = useState<ScreenRoute>('dashboard');
  const [selectedMachineId, setSelectedMachineId] = useState<string>('m1');
  const [machines, setMachines] = useState<Machine[]>(INITIAL_MACHINES);
  const [isSimulating, setIsSimulating] = useState<boolean>(true);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(true);
  const [currentUser, setCurrentUser] = useState<User>(CURRENT_USER);
  const [selectedFactory, setSelectedFactory] = useState<Factory>(FACTORIES[0]);
  const [selectedGroup, setSelectedGroup] = useState<string>('All Groups');
  const [selectedShift, setSelectedShift] = useState<string>('Shift 1 (Shift A)');
  const [selectedDateText, setSelectedDateText] = useState<string>('Apr 20, 2025');
  const [alerts, setAlerts] = useState<Alert[]>(INITIAL_ALERTS);
  const [threadBreakages, setThreadBreakages] = useState<ThreadBreakage[]>(THREAD_BREAKAGES);
  const [timelineEvents, setTimelineEvents] = useState<MachineEvent[]>(TIMELINE_EVENTS);
  const [deviceMode, setDeviceMode] = useState<DeviceMode>('responsive');
  const [isAlertDrawerOpen, setIsAlertDrawerOpen] = useState<boolean>(false);
  const [isFlutterCodeModalOpen, setIsFlutterCodeModalOpen] = useState<boolean>(false);

  // Industrial Modules States
  const [orders, setOrders] = useState<ProductionOrder[]>(INITIAL_PRODUCTION_ORDERS);
  const [operators, setOperators] = useState<Operator[]>(INITIAL_OPERATORS);
  const [maintenanceTasks, setMaintenanceTasks] = useState<MachineMaintenanceTask[]>(INITIAL_MAINTENANCE_TASKS);
  const [maintenanceLogs, setMaintenanceLogs] = useState<MaintenanceLogEntry[]>(INITIAL_MAINTENANCE_LOGS);
  const [qcRecords, setQcRecords] = useState<QCInspectionRecord[]>(INITIAL_QC_RECORDS);
  const [threadStock, setThreadStock] = useState<ThreadSpoolStock[]>(INITIAL_THREAD_STOCK);
  const [designs, setDesigns] = useState<EmbroideryDesign[]>(MOCK_EMBROIDERY_DESIGNS);
  const [activeDesign, setActiveDesign] = useState<EmbroideryDesign>(MOCK_EMBROIDERY_DESIGNS[0]);
  const [jobworkCostings, setJobworkCostings] = useState<JobworkCosting[]>(MOCK_JOBWORK_COSTINGS);
  const [multiHeadFleet, setMultiHeadFleet] = useState<MachineMultiHeadStatus[]>(MOCK_MACHINE_MULTIHEAD);
  const [rawMaterials, setRawMaterials] = useState<RawMaterialStockItem[]>(MOCK_RAW_MATERIALS);
  const [shiftHandovers, setShiftHandovers] = useState<ShiftHandoverRecord[]>(MOCK_SHIFT_HANDOVERS);
  const [deliveryChallans, setDeliveryChallans] = useState<DeliveryChallan[]>(MOCK_DELIVERY_CHALLANS);
  const [downtimeRootCauses, setDowntimeRootCauses] = useState<DowntimeRootCause[]>(MOCK_DOWNTIME_ROOT_CAUSES);
  const [isOmniSearchOpen, setIsOmniSearchOpen] = useState<boolean>(false);

  // Language Support (English / Gujarati)
  const [language, setLanguage] = useState<AppLanguage>(() => {
    try { return localStorage.getItem('embroidery-language') === 'gu' ? 'gu' : 'en'; } catch { return 'en'; }
  });
  useEffect(() => {
    document.documentElement.lang = language;
    try { localStorage.setItem('embroidery-language', language); } catch { /* Storage may be unavailable in private browsing. */ }
  }, [language]);
  const t = useCallback((key: string, fallback?: string) => {
    return getTranslation(language, key, fallback);
  }, [language]);

  // Power & DG Generator
  const [powerMetrics, setPowerMetrics] = useState<MachinePowerMetric[]>(MOCK_POWER_METRICS);
  const [dgLogs, setDgLogs] = useState<DGRunLog[]>(MOCK_DG_LOGS);

  const addDGLog = useCallback((newLogData: Omit<DGRunLog, 'id'>) => {
    const newLog: DGRunLog = {
      ...newLogData,
      id: `dg-${Date.now()}`,
    };
    setDgLogs((prev) => [newLog, ...prev]);
  }, []);

  // Operator Attendance, Khata & Salary
  const [operatorAttendance, setOperatorAttendance] = useState<OperatorAttendanceRecord[]>(MOCK_OPERATOR_ATTENDANCE);
  const [operatorKhata, setOperatorKhata] = useState<OperatorKhataEntry[]>(MOCK_OPERATOR_KHATA);
  const [salarySlips, setSalarySlips] = useState<OperatorSalarySlip[]>(MOCK_SALARY_SLIPS);

  const markAttendance = useCallback((id: string, status: OperatorAttendanceRecord['status'], otHours: number = 0) => {
    setOperatorAttendance((prev) =>
      prev.map((rec) =>
        rec.id === id
          ? {
              ...rec,
              status,
              overtimeHours: otHours,
              incentiveEarnedINR:
                status === 'PRESENT' && rec.stitchesLogged > rec.targetStitches
                  ? Math.round(((rec.stitchesLogged - rec.targetStitches) / 1000) * 0.8)
                  : rec.incentiveEarnedINR,
            }
          : rec
      )
    );
  }, []);

  const addKhataEntry = useCallback((entry: Omit<OperatorKhataEntry, 'id'>) => {
    const newEntry: OperatorKhataEntry = {
      ...entry,
      id: `khata-${Date.now()}`,
    };
    setOperatorKhata((prev) => [newEntry, ...prev]);
  }, []);

  // Jobwork Cutting Bundle Barcode Tokens
  const [bundleTags, setBundleTags] = useState<BundleBarcodeTag[]>(MOCK_BUNDLE_TAGS);

  const addBundleTag = useCallback((tag: Omit<BundleBarcodeTag, 'id' | 'createdAt'>) => {
    const newTag: BundleBarcodeTag = {
      ...tag,
      id: `bnd-${Date.now()}`,
      createdAt: 'Just now',
    };
    setBundleTags((prev) => [newTag, ...prev]);
  }, []);

  const assignBundleToMachine = useCallback((bundleId: string, machineNumber: string) => {
    setBundleTags((prev) =>
      prev.map((b) => (b.id === bundleId ? { ...b, assignedMachine: machineNumber } : b))
    );
  }, []);

  // WhatsApp Automation functions
  const sendPartyWhatsAppUpdate = useCallback((orderNumber: string, clientName: string, phone?: string) => {
    const cleanPhone = phone ? phone.replace(/[^0-9]/g, '') : '';
    const text = `🧵 *EMBROIDERY PRODUCTION STATUS UPDATE*\n\nDear *${clientName}*,\n\nYour production jobwork order *#${orderNumber}* is actively in production at Surat Textile Hub.\n\n✨ Status: In Production / Stitched & QC Verified\n🏭 Factory: Unit-1 (Surat Hub)\n📦 Dispatch Challan: Ready upon batch completion\n\n_Generated via Embroidery Track Industrial Suite_`;
    const targetUrl = cleanPhone ? `https://wa.me/${cleanPhone}?text=${encodeURIComponent(text)}` : `https://wa.me/?text=${encodeURIComponent(text)}`;
    try {
      window.open(targetUrl, '_blank');
    } catch (e) {
      console.warn('Unable to open window:', e);
    }
  }, []);

  const sendOwnerDailyShiftReportWhatsApp = useCallback(() => {
    const running = machines.filter((m) => m.status === 'RUNNING').length;
    const totalStitches = machines.reduce((acc, m) => acc + m.stitchCount, 0);
    const totalIncentive = operatorAttendance.reduce((a, b) => a + b.incentiveEarnedINR, 0);
    const text = `🏭 *FACTORY OWNER DAILY SHIFT HANDOVER REPORT*\n\n📅 Date: Today | Shift: Day Shift\n\n📊 *Production Summary*:\n• Total Stitches Produced: *${totalStitches.toLocaleString()}*\n• Active Running Machines: *${running} / ${machines.length}*\n• Average Speed: *760 SPM*\n• Thread Breakages Today: *${threadBreakages.length}*\n• Operator Incentive Earned: *₹${totalIncentive.toLocaleString()}*\n• Power DG Outage: *${dgLogs.length > 0 ? dgLogs[0].durationMinutes + ' mins logged' : 'Grid Nominal'}*\n\n✅ Factory operational health: 91.4% OEE\n_Generated via Embroidery Track Industrial Suite_`;
    try {
      window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
    } catch (e) {
      console.warn('Unable to open window:', e);
    }
  }, [machines, operatorAttendance, threadBreakages, dgLogs]);

  const sendSuratSupplierThreadOrderWhatsApp = useCallback((shadeNumber: string, conesRequired: number) => {
    const text = `🧵 *URGENT THREAD RESTOCK ORDER - SURAT EMBROIDERY*\n\nTo: *${SURAT_THREAD_SUPPLIER.name}*\nAttn: *${SURAT_THREAD_SUPPLIER.contactPerson}*\n\nUrgent re-order needed for Factory 1 (Surat Hub):\n• Shade Code / Color: *${shadeNumber}*\n• Quantity: *${conesRequired} Cones / Boxes*\n• Delivery: Same-day dispatch to Millennium Textile Market tempo stand\n\nPlease confirm availability and billing.\n\n_Embroidery Track Automated Procurement_`;
    try {
      window.open(`https://wa.me/919825104291?text=${encodeURIComponent(text)}`, '_blank');
    } catch (e) {
      console.warn('Unable to open window:', e);
    }
  }, []);

  const sendSalarySlipWhatsApp = useCallback((operatorName: string, monthYear: string, netPayable: number, phone?: string) => {
    const cleanPhone = phone ? phone.replace(/[^0-9]/g, '') : '';
    const text = `💰 *OPERATOR SALARY SLIP - EMBROIDERY TRACK*\n\nKarigar / Operator: *${operatorName}*\nWage Period: *${monthYear}*\n\n💵 *Net Payable Amount: ₹${netPayable.toLocaleString('en-IN')}*\n\nStatus: Approved & Credited\n_Surat Textile Hub Accounts Desk_`;
    const targetUrl = cleanPhone ? `https://wa.me/${cleanPhone}?text=${encodeURIComponent(text)}` : `https://wa.me/?text=${encodeURIComponent(text)}`;
    try {
      window.open(targetUrl, '_blank');
    } catch (e) {
      console.warn('Unable to open window:', e);
    }
  }, []);

  // Global Ctrl+K hotkey for Omni Search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsOmniSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Computed metrics
  const totalMachines = machines.length;
  const runningCount = machines.filter((m) => m.status === 'RUNNING').length;
  const idleCount = machines.filter((m) => m.status === 'IDLE').length;
  const stoppedCount = machines.filter((m) => m.status === 'STOPPED').length;
  const offlineCount = machines.filter((m) => m.status === 'OFFLINE').length;
  const totalProductionStitches = machines.reduce((acc, m) => acc + m.stitchCount, 0);

  const runningMachines = machines.filter((m) => m.status === 'RUNNING');
  const averageEfficiency =
    runningMachines.length > 0
      ? Number((runningMachines.reduce((acc, m) => acc + m.efficiency, 0) / runningMachines.length).toFixed(1))
      : 87.6;
  const averageSpeedSPM =
    runningMachines.length > 0
      ? Math.round(runningMachines.reduce((acc, m) => acc + m.speed, 0) / runningMachines.length)
      : 760;

  const unreadAlertCount = alerts.filter((a) => a.status === 'Unread' || a.isRead === false).length;

  const updateMachine = useCallback((id: string, updates: Partial<Machine>) => {
    setMachines((prev) =>
      prev.map((m) => (m.id === id ? { ...m, ...updates, lastUpdated: 'Just now' } : m))
    );
  }, []);

  const addMachine = useCallback((newMachineData: Omit<Machine, 'id' | 'lastUpdated'>) => {
    const newId = `m${Date.now()}`;
    const newM: Machine = {
      ...newMachineData,
      id: newId,
      lastUpdated: 'Just now',
    };
    setMachines((prev) => [newM, ...prev]);
  }, []);

  const deleteMachine = useCallback((id: string) => {
    setMachines((prev) => prev.filter((m) => m.id !== id));
  }, []);

  const markAlertRead = useCallback((id: string) => {
    setAlerts((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status: 'Read', isRead: true } : a))
    );
  }, []);

  const markAllAlertsRead = useCallback(() => {
    setAlerts((prev) => prev.map((a) => ({ ...a, status: 'Read', isRead: true })));
  }, []);

  const markAlertAsRead = markAlertRead;
  const markAllAlertsAsRead = markAllAlertsRead;

  const logBreakage = useCallback(
    (breakage: Omit<ThreadBreakage, 'id' | 'time'>) => {
      const now = new Date();
      const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      const newBreakage: ThreadBreakage = {
        ...breakage,
        id: `tb-${Date.now()}`,
        time: timeStr,
      };
      setThreadBreakages((prev) => [newBreakage, ...prev]);

      // Create an alert
      const newAlert: Alert = {
        id: `alt-${Date.now()}`,
        timestamp: timeStr,
        time: timeStr,
        machineNumber: breakage.machineNumber,
        message: `${breakage.reason} reported on head ${breakage.headNumber} needle ${breakage.needleNumber}`,
        severity: 'CRITICAL',
        status: 'Unread',
        isRead: false,
      };
      setAlerts((prev) => [newAlert, ...prev]);

      // Add to timeline
      const newEvent: MachineEvent = {
        id: `ev-${Date.now()}`,
        time: timeStr,
        machineNumber: breakage.machineNumber,
        eventType: 'Thread Breakage',
        description: `${breakage.reason} on needle ${breakage.needleNumber}`,
        status: 'Critical',
      };
      setTimelineEvents((prev) => [newEvent, ...prev]);

      // Set target machine to stopped
      const targetMachine = machines.find((m) => m.machineNumber === breakage.machineNumber);
      if (targetMachine) {
        updateMachine(targetMachine.id, {
          status: 'STOPPED',
          speed: 0,
          threadStatus: 'Thread Break',
        });
      }
    },
    [machines, updateMachine]
  );

  const resolveBreakage = useCallback((id: string) => {
    setThreadBreakages((prev) =>
      prev.map((tb) => (tb.id === id ? { ...tb, status: 'Fixed' } : tb))
    );
  }, []);

  // Production Orders actions
  const addOrder = useCallback((newOrder: Omit<ProductionOrder, 'id'>) => {
    const id = `ord-${Date.now()}`;
    setOrders((prev) => [{ ...newOrder, id }, ...prev]);
  }, []);

  const updateOrder = useCallback((id: string, updates: Partial<ProductionOrder>) => {
    setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, ...updates } : o)));
  }, []);

  // Operators actions
  const updateOperatorStatus = useCallback((id: string, status: Operator['status']) => {
    setOperators((prev) => prev.map((op) => (op.id === id ? { ...op, status } : op)));
  }, []);

  const assignOperatorMachine = useCallback((operatorId: string, machineNumber: string) => {
    setOperators((prev) =>
      prev.map((op) => (op.id === operatorId ? { ...op, assignedMachine: machineNumber } : op))
    );
  }, []);

  const clearAlert = useCallback((id: string) => setAlerts(previous => previous.filter(alert => alert.id !== id)), []);
  const logMaintenance = useCallback((entry: Omit<MaintenanceLogEntry, 'id'>) => {
    setMaintenanceLogs(previous => [{ ...entry, id: `maintenance-${Date.now()}` }, ...previous]);
  }, []);

  // Maintenance actions
  const performMaintenance = useCallback((taskId: string, notes?: string) => {
    const timeStr = 'Just now';
    setMaintenanceTasks((prev) =>
      prev.map((task) => {
        if (task.id === taskId) {
          const newLog: MaintenanceLogEntry = {
            id: `log-${Date.now()}`,
            timestamp: timeStr,
            machineNumber: task.machineNumber,
            technicianName: 'Harsh Kheni',
            taskPerformed: task.taskTitle,
            notes: notes || 'Service completed, lubrication replenished, and counters reset.',
          };
          setMaintenanceLogs((logs) => [newLog, ...logs]);
          return {
            ...task,
            stitchesSinceLast: 0,
            hoursSinceLast: 0,
            lastServiceDate: timeStr,
            status: 'GOOD',
          };
        }
        return task;
      })
    );
  }, []);

  // QC inspection actions
  const addQCRecord = useCallback((record: Omit<QCInspectionRecord, 'id' | 'timestamp'>) => {
    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const newRecord: QCInspectionRecord = {
      ...record,
      id: `qc-${Date.now()}`,
      timestamp: timeStr,
    };
    setQcRecords((prev) => [newRecord, ...prev]);
  }, []);

  // Thread stock actions
  const updateThreadStock = useCallback((id: string, cones: number) => {
    setThreadStock((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const newCones = Math.max(0, cones);
          const remainingMeters = newCones * 5000;
          let status: ThreadSpoolStock['status'] = 'IN_STOCK';
          if (newCones === 0) status = 'OUT_OF_STOCK';
          else if (newCones <= item.minThreshold) status = 'LOW_STOCK';
          return {
            ...item,
            conesInStock: newCones,
            remainingMetersApprox: remainingMeters,
            status,
          };
        }
        return item;
      })
    );
  }, []);

  // Jobwork costing actions
  const addJobworkCosting = useCallback((costing: Omit<JobworkCosting, 'id'>) => {
    const newCosting: JobworkCosting = {
      ...costing,
      id: `cst-${Date.now()}`,
    };
    setJobworkCostings((prev) => [newCosting, ...prev]);
  }, []);

  // Multi-Head status toggling (Isolate / Engage)
  const toggleHeadStatus = useCallback((machineNumber: string, headNumber: number) => {
    setMultiHeadFleet((prev) =>
      prev.map((m) => {
        if (m.machineNumber === machineNumber) {
          const updatedHeads = m.heads.map((h) => {
            if (h.headNumber === headNumber) {
              const newStatus = h.status === 'ISOLATED' ? 'ACTIVE' : 'ISOLATED';
              return { ...h, status: newStatus as 'ACTIVE' | 'ISOLATED' };
            }
            return h;
          });
          return { ...m, heads: updatedHeads };
        }
        return m;
      })
    );
    setTimelineEvents((prev) => [
      {
        id: `ev-${Date.now()}`,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        eventType: 'Operator Stop',
        machineNumber,
        description: `Head #${headNumber} toggled isolation state by floor operator.`,
        status: 'Warning',
      },
      ...prev,
    ]);
  }, []);

  // Raw materials stock update
  const updateRawMaterialQuantity = useCallback((id: string, delta: number) => {
    setRawMaterials((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const newQty = Math.max(0, item.quantityOnHand + delta);
          let status: RawMaterialStockItem['status'] = 'IN_STOCK';
          if (newQty <= item.minThreshold / 2) status = 'CRITICAL';
          else if (newQty <= item.minThreshold) status = 'LOW_STOCK';
          return { ...item, quantityOnHand: newQty, status };
        }
        return item;
      })
    );
  }, []);

  // Shift handover actions
  const addShiftHandover = useCallback(
    (record: Omit<ShiftHandoverRecord, 'id' | 'timestamp' | 'acknowledged'>) => {
      const newRec: ShiftHandoverRecord = {
        ...record,
        id: `sho-${Date.now()}`,
        timestamp: `Today, ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`,
        acknowledged: true,
      };
      setShiftHandovers((prev) => [newRec, ...prev]);
    },
    []
  );

  // Delivery challan actions
  const addDeliveryChallan = useCallback(
    (challan: Omit<DeliveryChallan, 'id' | 'challanNumber' | 'dispatchDateTime'>) => {
      const newChallan: DeliveryChallan = {
        ...challan,
        id: `chl-${Date.now()}`,
        challanNumber: `CH-2026-0${Math.floor(100 + Math.random() * 900)}`,
        dispatchDateTime: `Today, ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`,
      };
      setDeliveryChallans((prev) => [newChallan, ...prev]);
    },
    []
  );

  // Trigger simulated events for live testing
  const triggerSimulatedEvent = useCallback(
    (type: 'thread_break' | 'machine_start' | 'emergency_stop' | 'speed_boost') => {
      const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      if (type === 'thread_break') {
        const running = machines.filter((m) => m.status === 'RUNNING');
        if (running.length > 0) {
          const target = running[Math.floor(Math.random() * running.length)];
          const reasons: BreakageReason[] = ['Bobbin Breakage', 'Upper Thread Breakage', 'Needle Eye Jam'];
          const pickedReason = reasons[Math.floor(Math.random() * reasons.length)];
          logBreakage({
            machineNumber: target.machineNumber,
            needleNumber: Math.floor(Math.random() * 12) + 1,
            headNumber: Math.floor(Math.random() * target.headCount) + 1,
            threadColor: 'Navy Blue #000080',
            reason: pickedReason,
            durationMinutes: 5,
            status: 'Open',
            operatorNotes: 'Simulated realtime sensor event',
          });
        }
      } else if (type === 'machine_start') {
        const stopped = machines.filter((m) => m.status === 'STOPPED');
        if (stopped.length > 0) {
          const target = stopped[0];
          updateMachine(target.id, {
            status: 'RUNNING',
            speed: 750 + Math.floor(Math.random() * 80),
            threadStatus: 'Normal',
          });
          const newEvent: MachineEvent = {
            id: `ev-${Date.now()}`,
            time: now,
            machineNumber: target.machineNumber,
            eventType: 'Machine Started',
            description: 'Machine resumed operation after inspection',
            status: 'Normal',
          };
          setTimelineEvents((prev) => [newEvent, ...prev]);
        }
      } else if (type === 'emergency_stop') {
        const running = machines.filter((m) => m.status === 'RUNNING');
        if (running.length > 0) {
          const target = running[0];
          updateMachine(target.id, {
            status: 'STOPPED',
            speed: 0,
          });
          const newAlert: Alert = {
            id: `alt-${Date.now()}`,
            timestamp: now,
            time: now,
            machineNumber: target.machineNumber,
            message: 'Manual Emergency Stop button pressed by operator',
            severity: 'CRITICAL',
            status: 'Unread',
            isRead: false,
          };
          setAlerts((prev) => [newAlert, ...prev]);
        }
      } else if (type === 'speed_boost') {
        setMachines((prev) =>
          prev.map((m) =>
            m.status === 'RUNNING'
              ? {
                  ...m,
                  speed: Math.min(950, m.speed + 30),
                  efficiency: Math.min(98, m.efficiency + 1.2),
                }
              : m
          )
        );
      }
    },
    [machines, logBreakage, updateMachine]
  );

  // Live Simulation Loop (Tick every 2.5 seconds)
  useEffect(() => {
    if (!isSimulating) return;
    const interval = setInterval(() => {
      setMachines((prevMachines) =>
        prevMachines.map((m) => {
          if (m.status === 'RUNNING') {
            const addedStitches = Math.floor((m.speed / 60) * 2.5);
            const speedFlutter = Math.floor(Math.random() * 7) - 3;
            const newSpeed = Math.max(450, Math.min(920, m.speed + speedFlutter));
            const nextRuntimeMinutes = m.runtimeMinutes + 1;
            return {
              ...m,
              stitchCount: m.stitchCount + addedStitches,
              speed: newSpeed,
              runtimeHours: m.runtimeHours + (nextRuntimeMinutes >= 60 ? 1 : 0),
              runtimeMinutes: nextRuntimeMinutes >= 60 ? 0 : nextRuntimeMinutes,
              lastUpdated: 'Just now',
            };
          }
          if (m.status === 'STOPPED' || m.status === 'IDLE') {
            const nextStopMinutes = m.stopTimeMinutes + 1;
            return {
              ...m,
              stopTimeHours: m.stopTimeHours + (nextStopMinutes >= 60 ? 1 : 0),
              stopTimeMinutes: nextStopMinutes >= 60 ? 0 : nextStopMinutes,
              lastUpdated: 'Just now',
            };
          }
          return { ...m, lastUpdated: 'Just now' };
        })
      );
    }, 2500);
    return () => clearInterval(interval);
  }, [isSimulating]);

  const login = async (email: string, pass: string): Promise<boolean> => {
    if (email && pass) {
      setIsAuthenticated(true);
      setCurrentUser({
        name: email.includes('admin') ? 'Harsh Kheni' : 'Ramesh Patel',
        email,
        role: email.includes('admin') ? 'Admin' : 'Operator',
        factory: 'Factory 1 (Surat Textile Hub)',
        avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      });
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsAuthenticated(false);
  };

  return (
    <AppContext.Provider
      value={{
        currentRoute,
        setCurrentRoute,
        selectedMachineId,
        setSelectedMachineId,
        machines,
        updateMachine,
        addMachine,
        deleteMachine,
        isSimulating,
        setIsSimulating,
        triggerSimulatedEvent,
        isAuthenticated,
        currentUser,
        login,
        logout,
        selectedFactory,
        setSelectedFactory,
        selectedGroup,
        setSelectedGroup,
        selectedShift,
        setSelectedShift,
        selectedDateText,
        setSelectedDateText,
        alerts,
        clearAlert,
        unreadAlertCount,
        markAlertRead,
        markAlertAsRead,
        markAllAlertsRead,
        markAllAlertsAsRead,
        threadBreakages,
        logBreakage,
        resolveBreakage,
        timelineEvents,
        orders,
        addOrder,
        updateOrder,
        operators,
        updateOperatorStatus,
        assignOperatorMachine,
        maintenanceTasks,
        maintenanceLogs,
        logMaintenance,
        performMaintenance,
        qcRecords,
        addQCRecord,
        threadStock,
        updateThreadStock,
        designs,
        activeDesign,
        setActiveDesign,
        jobworkCostings,
        addJobworkCosting,
        multiHeadFleet,
        toggleHeadStatus,
        rawMaterials,
        updateRawMaterialQuantity,
        shiftHandovers,
        addShiftHandover,
        deliveryChallans,
        addDeliveryChallan,
        downtimeRootCauses,
        language,
        setLanguage,
        t,
        powerMetrics,
        dgLogs,
        addDGLog,
        operatorAttendance,
        markAttendance,
        operatorKhata,
        addKhataEntry,
        salarySlips,
        bundleTags,
        addBundleTag,
        assignBundleToMachine,
        sendPartyWhatsAppUpdate,
        sendOwnerDailyShiftReportWhatsApp,
        sendSuratSupplierThreadOrderWhatsApp,
        sendSalarySlipWhatsApp,
        isOmniSearchOpen,
        setIsOmniSearchOpen,
        deviceMode,
        setDeviceMode,
        isAlertDrawerOpen,
        setIsAlertDrawerOpen,
        isFlutterCodeModalOpen,
        setIsFlutterCodeModalOpen,
        totalMachines,
        runningCount,
        idleCount,
        stoppedCount,
        offlineCount,
        totalProductionStitches,
        averageEfficiency,
        averageSpeedSPM,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
