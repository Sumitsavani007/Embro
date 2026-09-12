/**
 * Utility functions to export factory reports to CSV
 */

export function downloadCsv(filename: string, csvContent: string) {
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function exportMachinesToCsv(machines: any[]) {
  const headers = [
    'Machine No',
    'Name',
    'Brand',
    'Model',
    'Heads',
    'Needles',
    'Group',
    'Status',
    'Speed (SPM)',
    'Stitch Count',
    'Efficiency (%)',
    'Current Job',
    'Run Time',
    'Stop Time',
  ];

  const rows = machines.map((m) => [
    m.machineNumber,
    `"${m.name}"`,
    m.brand,
    m.model,
    m.headCount,
    m.needleCount,
    `"${m.group}"`,
    m.status,
    m.speed,
    m.stitchCount,
    m.efficiency,
    `"${m.currentJob}"`,
    `"${m.runtimeHours}h ${m.runtimeMinutes}m"`,
    `"${m.stopTimeHours}h ${m.stopTimeMinutes}m"`,
  ]);

  const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
  downloadCsv(`Embroidery_Machines_Export_${new Date().toISOString().slice(0, 10)}.csv`, csvContent);
}

export function exportProductionReportToCsv(machines: any[], dateRange: string) {
  const headers = ['Machine No', 'Current Job', 'Stitch Count', 'Efficiency (%)', 'Run Time', 'Stop Time'];
  const rows = machines.map((m) => [
    m.machineNumber,
    `"${m.currentJob}"`,
    m.stitchCount,
    m.efficiency,
    `"${m.runtimeHours}h ${m.runtimeMinutes}m"`,
    `"${m.stopTimeHours}h ${m.stopTimeMinutes}m"`,
  ]);

  const csvContent = [
    `# Production Report - ${dateRange}`,
    headers.join(','),
    ...rows.map((r) => r.join(',')),
  ].join('\n');
  downloadCsv(`Embroidery_Production_Report_${new Date().toISOString().slice(0, 10)}.csv`, csvContent);
}

export function exportShiftReportToCsv(shiftData: any[], shiftName: string) {
  const headers = ['Machine No', 'Production (Stitches)', 'Runtime', 'Stop Time', 'Efficiency (%)'];
  const rows = shiftData.map((s) => [s.machine, s.production, `"${s.runtime}"`, `"${s.stoptime}"`, s.efficiency]);
  const csvContent = [
    `# Shift Report - ${shiftName}`,
    headers.join(','),
    ...rows.map((r) => r.join(',')),
  ].join('\n');
  downloadCsv(`Embroidery_${shiftName.replace(/\s+/g, '_')}_Report.csv`, csvContent);
}

export function exportRunTimeToCsv(records: any[]) {
  const headers = ['Machine No', 'Run Time', 'Stop Time', 'Running %', 'Status'];
  const rows = records.map((r) => [r.machine, `"${r.runtime}"`, `"${r.stoptime}"`, `${r.runningPercent}%`, r.status]);
  const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
  downloadCsv(`Embroidery_Runtime_Report_${new Date().toISOString().slice(0, 10)}.csv`, csvContent);
}

export function exportThreadBreakagesToCsv(breakages: any[]) {
  const headers = ['ID', 'Time', 'Machine No', 'Head', 'Needle', 'Thread Color', 'Reason', 'Duration (Min)', 'Status'];
  const rows = breakages.map((b) => [
    b.id,
    `"${b.time}"`,
    b.machineNumber,
    b.headNumber,
    b.needleNumber,
    `"${b.threadColor}"`,
    `"${b.reason}"`,
    b.durationMinutes,
    b.status,
  ]);
  const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
  downloadCsv(`Embroidery_Thread_Breakage_Log_${new Date().toISOString().slice(0, 10)}.csv`, csvContent);
}

export const exportThreadBreakageToCsv = exportThreadBreakagesToCsv;

export function exportToCsv(data: Record<string, any>[], filename: string) {
  if (!data || data.length === 0) return;
  const headers = Object.keys(data[0]);
  const rows = data.map((item) =>
    headers.map((h) => {
      const val = item[h] !== undefined && item[h] !== null ? String(item[h]) : '';
      return `"${val.replace(/"/g, '""')}"`;
    }).join(',')
  );
  const csvContent = [headers.join(','), ...rows].join('\n');
  downloadCsv(`${filename}_${new Date().toISOString().slice(0, 10)}.csv`, csvContent);
}
