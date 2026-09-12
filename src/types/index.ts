export type MachineStatus = 'RUNNING' | 'IDLE' | 'STOPPED' | 'OFFLINE';

export type AlertSeverity = 'CRITICAL' | 'WARNING' | 'INFO';

export type BreakageReason =
  | 'Bobbin Breakage'
  | 'Upper Thread Breakage'
  | 'Needle Eye Jam'
  | 'Tension Failure'
  | 'Needle Break'
  | 'Bobbin Thread Jam'
  | 'Upper Thread Snap'
  | 'Tension Disk Misalignment'
  | 'Needle Tip Blunted / Strike'
  | 'Spool Empty';

export type BreakageStatus = 'Fixed' | 'Open' | 'Investigating' | 'Resolved' | 'RESOLVED';

export interface MachineJob {
  id: string;
  designName: string;
  designCode: string;
  totalStitches: number;
  currentStitches: number;
  startTime: string;
  estimatedEndTime?: string;
  status: 'In Progress' | 'Completed' | 'Queued';
  operator?: string;
}

export interface Machine {
  id: string;
  machineNumber: string; // e.g. "M1"
  name: string; // e.g. "Tajima TMBP-SC 1501"
  brand: string; // "Tajima" | "Barudan" | "Happy"
  model: string;
  headCount: number;
  needleCount: number;
  status: MachineStatus;
  speed: number; // SPM (Stitches per minute)
  stitchCount: number;
  efficiency: number; // percentage, e.g. 91.2
  currentJob: string;
  currentJobDetails?: MachineJob;
  runtimeHours: number; // in hours
  runtimeMinutes: number;
  stopTimeHours: number;
  stopTimeMinutes: number;
  temperature: number; // in Celsius e.g. 38.5
  threadStatus: 'Normal' | 'Low Thread' | 'Thread Break' | 'Bobbin Empty';
  group: string; // "Line A" | "Line B" | "Cap Specialty"
  factoryId: string;
  lastUpdated: string;
  maxSpeed?: number;
  operatorId?: string;
  lastMaintenance?: string;
  /** Connection metadata used by the live telemetry adapter. */
  telemetryProtocol?: 'MQTT' | 'WebSocket' | 'HTTP Polling' | 'OPC-UA' | string;
  telemetryEndpoint?: string;
  telemetryDeviceId?: string;
  telemetryApiKey?: string;
  telemetryPollingSeconds?: number;
  serialNumber?: string;
  ipAddress?: string;
  temperatureAlertCelsius?: number;
  lowEfficiencyAlertPercent?: number;
}

export interface ProductionRecord {
  timeLabel: string;
  actualStitches: number;
  targetStitches: number;
}

export interface DailyProductionRecord {
  date: string;
  stitches: number;
  target: number;
  efficiency: number;
  runtimeHours: number;
  stopTimeHours: number;
}

export interface Shift {
  id: string;
  name: string; // "Shift 1 (Shift A)", "Shift 2 (Shift B)", etc.
  timeRange: string;
  startTime: string;
  endTime: string;
  targetStitches: number;
  actualStitches: number;
  efficiency: number;
}

export interface DowntimeRecord {
  reason: string;
  percentage: number;
  minutes: number;
  color: string;
}

export interface ThreadBreakage {
  id: string;
  time: string;
  machineNumber: string;
  needleNumber: number;
  headNumber: number;
  threadColor: string;
  reason: BreakageReason | string;
  durationMinutes: number;
  status: BreakageStatus;
  operatorNotes?: string;
}

export interface MachineEvent {
  id: string;
  time: string;
  machineNumber: string;
  eventType:
    | 'Machine Started'
    | 'Machine Stopped'
    | 'Job Started'
    | 'Job Completed'
    | 'Thread Breakage'
    | 'Operator Stop'
    | 'Machine Fault'
    | 'Maintenance'
    | 'Machine Offline'
    | string;
  description: string;
  status: 'Normal' | 'Warning' | 'Critical' | 'Resolved' | string;
  type?: string;
  severity?: string;
}

export interface Alert {
  id: string;
  timestamp: string;
  time?: string;
  title?: string;
  machineNumber: string;
  message: string;
  severity: AlertSeverity;
  status: 'Unread' | 'Read' | 'Resolved';
  isRead?: boolean;
  acknowledgedBy?: string;
}

export interface Factory {
  id: string;
  name: string;
  location: string;
  totalMachines: number;
  timezone?: string;
}

export interface User {
  name: string;
  email: string;
  role: 'Admin' | 'Supervisor' | 'Operator';
  factory: string;
  avatarUrl?: string;
}

// 1. Orders & Batch Production with Live ETA
export interface ProductionOrder {
  id: string;
  orderNumber: string; // e.g. "ORD-8492"
  clientName?: string;
  customerName?: string;
  garmentType?: string;
  fabricType?: string;
  progressPercentage?: number;
  designName: string;
  designFile?: string;
  designFileUrl?: string;
  stitchCountPerPiece?: number;
  stitchesPerUnit?: number;
  totalStitches?: number;
  completedStitches?: number;
  totalPieces?: number;
  targetUnits?: number;
  completedPieces?: number;
  completedUnits?: number;
  quantityCompleted?: number;
  totalGarments?: number;
  assignedMachines?: string[];
  assignedMachine?: string;
  operatorName?: string;
  shift?: string;
  colorChanges?: number;
  targetDeadline?: string;
  estimatedHours?: number;
  estimatedCompletionDate?: string;
  threadColors?: string[];
  priority?: 'URGENT' | 'HIGH' | 'NORMAL' | string;
  status: 'IN_PROGRESS' | 'SCHEDULED' | 'COMPLETED' | 'PAUSED' | string;
}

// 2. Operators & Shift Performance
export interface Operator {
  id: string;
  code: string; // e.g. "OP-104"
  name: string;
  avatar: string;
  avatarUrl?: string;
  assignedMachine: string; // e.g. "M1"
  shift: 'Shift 1 (Day)' | 'Shift 2 (Evening)' | 'Shift 3 (Night)' | string;
  efficiency: number; // e.g. 92.4
  stitchesToday: number;
  stitchesProduced?: number;
  threadBreaksResolved: number;
  breakageCount?: number;
  piecesCompleted: number;
  incentiveBonusINR: number;
  bonusAccrued?: number;
  status: 'ON_DUTY' | 'ON_BREAK' | 'OFF_DUTY';
  rating: number; // 1-5
}

// 3. Preventive Maintenance & Oiling
export interface MachineMaintenanceTask {
  id: string;
  machineNumber: string;
  taskType:
    | 'ROTARY_HOOK_OILING'
    | 'NEEDLE_REPLACEMENT'
    | 'LINEAR_GUIDE_GREASE'
    | 'TIMING_BELT_INSPECTION'
    | 'THREAD_CUTTER_BLADE';
  taskTitle: string;
  intervalStitches?: number;
  intervalHours?: number;
  stitchesSinceLast: number;
  hoursSinceLast: number;
  lastServiceDate: string;
  status: 'GOOD' | 'DUE_SOON' | 'OVERDUE';
}

export interface MaintenanceLogEntry {
  id: string;
  timestamp: string;
  machineNumber: string;
  technicianName: string;
  taskPerformed: string;
  partsReplaced?: string;
  notes: string;
  taskType?: string;
  description?: string;
  performedBy?: string;
  completedAt?: string;
  nextDueDate?: string;
  status?: string;
}

// 4. Quality Control (QC) & Rejection Tracking
export type DefectCategory =
  | 'Thread Tension / Puckering'
  | 'Skipped Stitches'
  | 'Needle Hole / Fabric Cut'
  | 'Oil / Grease Stain'
  | 'Color Mismatch / Wrong Thread'
  | 'Misaligned Placement';

export interface QCInspectionRecord {
  batchLot?: string;
  id: string;
  timestamp: string;
  orderNumber: string;
  machineNumber: string;
  inspectorName: string;
  inspectedPieces: number;
  passedPieces: number;
  rejectedPieces: number;
  defectCategory: DefectCategory;
  defectReason: string;
  actionTaken: 'Rework Required' | 'Scrapped' | 'Passed with Touchup';
}

export interface QCInspection {
  id: string;
  orderNumber: string;
  batchLot: string;
  machineNumber: string;
  inspectorName: string;
  inspectedAt: string;
  sampleSize: number;
  defectivePieces: number;
  defectCategory: string;
  notes: string;
  result: 'PASS' | 'REWORK' | 'SCRAP';
}

// 5. Thread & Bobbin Inventory Tracker
export interface ThreadSpoolStock {
  id: string;
  colorCode: string; // e.g. "Isacord #0010"
  shadeCode?: string; // alias
  threadType?: string;
  metersPerCone?: number;
  assignedMachines?: string[];
  colorName: string; // e.g. "Silky White"
  hexColor: string; // e.g. "#FFFFFF"
  hexCode?: string; // alias
  brand: 'Madeira' | 'Isacord' | 'Gunold' | 'Coats' | string;
  conesInStock: number;
  remainingMetersApprox: number;
  minThreshold: number;
  activeMachinesUsing: string[];
  activeMachines?: string[]; // alias
  status: 'IN_STOCK' | 'LOW_STOCK' | 'OUT_OF_STOCK';
}

// 6. DST / EMB Design Visualizer & Stitch Simulation
export interface DesignColorStop {
  needleNumber: number;
  colorHex: string;
  threadName: string;
  stitchCount: number;
}

export interface EmbroideryDesign {
  id: string;
  name: string;
  fileName: string;
  category:
    | 'Sportswear'
    | 'Ethnic Sarees'
    | 'Corporate Polo'
    | 'Headwear / Caps'
    | 'Monogram Badges'
    | string;
  totalStitches: number;
  widthMm: number;
  heightMm: number;
  colorStops: DesignColorStop[];
  densityRating: 'Normal (0.40mm)' | 'High (0.35mm)' | '3D Puff Heavy' | string;
  trimsCount: number;
  sampleSvgShapes: Array<{
    type: 'path' | 'circle' | 'rect';
    color: string;
    d?: string;
    cx?: number;
    cy?: number;
    r?: number;
    x?: number;
    y?: number;
    width?: number;
    height?: number;
    transform?: string;
  }>;
}

// 7. Jobwork Rate & Costing Engine
export interface JobworkCosting {
  id: string;
  clientName: string;
  orderNumber: string;
  garmentType: string;
  stitchCountPerUnit: number;
  piecesCount: number;
  ratePer1000StitchesINR: number; // e.g. 0.28
  topThreadCostPerUnitINR: number;
  bobbinCostPerUnitINR: number;
  backingPaperCostPerUnitINR: number;
  solvyCostPerUnitINR: number;
  electricityAndOverheadINR: number;
  laborPerUnitINR: number;
  fabricHandlingMarkupINR: number;
  gstPercent: number; // 5% or 18%
  profitMarginPercent: number;
}

// 8. Multi-Head Isolation Matrix
export interface HeadDiagnostic {
  headNumber: number;
  status: 'ACTIVE' | 'ISOLATED' | 'MAINTENANCE_DUE';
  threadBreaksToday: number;
  tensionGaugeGrams: number; // e.g. 24g
  currentNeedleIndex: number;
  currentNeedleType: string; // e.g. Organ DBxK5 #11 SES
  needleType?: string; // alias
  tensionGrams?: number; // alias
  breaksToday?: number; // alias
  notes?: string;
}

export interface MachineMultiHeadStatus {
  machineNumber: string;
  totalHeads: number;
  heads: HeadDiagnostic[];
}

// 9. Raw Materials Stock
export interface RawMaterialStockItem {
  id: string;
  name: string;
  category:
    | 'Backing Paper'
    | 'Solvy Film'
    | '3D Puff Foam'
    | 'Zari / Sequins'
    | 'Organ Needles'
    | 'BACKING_PAPER'
    | 'SOLVY_FILM'
    | 'PUFF_FOAM'
    | 'NEEDLES'
    | 'METALLIC_ZARI'
    | string;
  spec?: string;
  specifications?: string;
  quantityOnHand: number;
  unit: string;
  minThreshold: number;
  costPerUnitINR: number;
  supplier: string;
  status: 'IN_STOCK' | 'LOW_STOCK' | 'CRITICAL';
}

// 10. Shift Handover Register
export interface ShiftHandoverRecord {
  id: string;
  timestamp: string;
  outgoingShift: string;
  incomingShift: string;
  outgoingSupervisor: string;
  incomingSupervisor: string;
  activeFleetSummary?: string;
  runningMachinesCount?: number;
  machinesRunningCount?: number;
  stitchesAccomplished?: number;
  criticalNotes?: string;
  pendingOrdersToPrioritize?: string[];
  pendingJobsSummary?: string;
  keyMaintenanceAdvisories?: string;
  acknowledged: boolean;
}

// 11. Delivery Challan & Dispatch Gatepass
export interface DeliveryChallan {
  id: string;
  challanNumber: string; // e.g. CH-2026-0492
  orderNumber: string;
  clientName: string;
  deliveryLocation?: string;
  garmentDescription?: string;
  garmentItem?: string;
  dispatchedPieces?: number;
  quantityPieces?: number;
  cartonCount?: number;
  cartonsCount?: number;
  grossWeightKg?: number;
  transporterName?: string;
  vehicleNumber: string;
  driverName?: string;
  driverContact?: string;
  verifiedBySupervisor?: string;
  dispatchDateTime: string;
  status: 'DISPATCHED' | 'IN_TRANSIT' | 'DELIVERED' | 'GATEPASS_VERIFIED';
  gatepassVerified?: boolean;
}

// 12. Downtime Root-Cause Breakdown
export interface DowntimeRootCause {
  id?: string;
  category: string;
  minutesLostToday?: number;
  percentageOfDowntime?: number;
  totalMinutes?: number;
  percentageOfTotal?: number;
  incidentsCount?: number;
  incidentCount?: number;
  recommendation: string;
  colorHex?: string;
}

// 13. Electricity & Power Factor Monitoring
export interface MachinePowerMetric {
  machineNumber: string;
  currentKwh: number;
  powerFactor: number;
  hourlyCostINR: number;
  status: 'RUNNING' | 'IDLE' | 'STOPPED';
}

export interface DGRunLog {
  id: string;
  date: string;
  timeRange: string;
  durationMinutes: number;
  dieselConsumedLiters: number;
  dieselCostINR: number;
  stitchesProducedOnDG: number;
  costPer1kStitchesDG: number;
  reason: string;
}

// 14. Operator Attendance, Khata & Salary Slip
export interface OperatorAttendanceRecord {
  id: string;
  operatorId: string;
  operatorName: string;
  date: string;
  status: 'PRESENT' | 'ABSENT' | 'HALF_DAY' | 'ON_LEAVE';
  shift: string;
  inTime: string;
  outTime: string;
  overtimeHours: number;
  stitchesLogged: number;
  targetStitches: number;
  incentiveEarnedINR: number;
}

export interface OperatorKhataEntry {
  id: string;
  operatorId: string;
  operatorName: string;
  date: string;
  type: 'ADVANCE_TAKEN' | 'REPAYMENT_DEDUCTION';
  amountINR: number;
  reason: string;
  approvedBy: string;
}

export interface OperatorSalarySlip {
  id: string;
  operatorId: string;
  operatorName: string;
  monthYear: string;
  presentDays: number;
  absentDays: number;
  overtimeHours: number;
  baseSalaryINR: number;
  overtimePayINR: number;
  stitchIncentiveINR: number;
  grossSalaryINR: number;
  advanceDeductionINR: number;
  netPayableINR: number;
  status: 'PAID' | 'PENDING';
}

// 15. Bundle Barcode Tag
export interface BundleBarcodeTag {
  id: string;
  bundleLotNumber: string;
  orderNumber: string;
  clientName: string;
  designName: string;
  fabricColor: string;
  piecesInBundle: number;
  assignedMachine: string;
  barcodeValue: string;
  createdAt: string;
}

export type AppLanguage = 'en' | 'gu';

export type AppRoute =
  | 'dashboard'
  | 'live-status'
  | 'machines'
  | 'machine-detail'
  | 'orders'
  | 'design-visualizer'
  | 'jobwork-costing'
  | 'head-matrix'
  | 'raw-materials'
  | 'shift-handover'
  | 'delivery-challan'
  | 'dispatch-challan'
  | 'downtime-analytics'
  | 'power-monitoring'
  | 'machine-qr'
  | 'operator-khata'
  | 'whatsapp-hub'
  | 'operators'
  | 'maintenance'
  | 'quality-control'
  | 'thread-inventory'
  | 'production-reports'
  | 'shift-report'
  | 'runtime'
  | 'stop-time'
  | 'thread-breakage'
  | 'timeline'
  | 'alerts'
  | 'settings';
