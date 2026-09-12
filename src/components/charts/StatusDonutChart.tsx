import React from 'react';

interface StatusDonutChartProps {
  running: number;
  idle: number;
  stopped: number;
  offline: number;
  total?: number;
}

export const StatusDonutChart: React.FC<StatusDonutChartProps> = ({
  running,
  idle,
  stopped,
  offline,
  total: customTotal,
}) => {
  const total = customTotal ?? (running + idle + stopped + offline || 1);

  const slices = [
    { label: 'Running', count: running, color: '#10B981', dotColor: 'bg-emerald-500' },
    { label: 'Idle', count: idle, color: '#F59E0B', dotColor: 'bg-amber-500' },
    { label: 'Stopped', count: stopped, color: '#EF4444', dotColor: 'bg-rose-500' },
    { label: 'Offline', count: offline, color: '#94A3B8', dotColor: 'bg-slate-400' },
  ];

  const size = 180;
  const strokeWidth = 24;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  let accumulatedPercent = 0;
  const renderedSlices = slices.map((s) => {
    const percent = total > 0 ? s.count / total : 0;
    const strokeDasharray = `${percent * circumference} ${circumference}`;
    const strokeDashoffset = -accumulatedPercent * circumference;
    accumulatedPercent += percent;
    return {
      ...s,
      percent,
      strokeDasharray,
      strokeDashoffset,
    };
  });

  return (
    <div className="flex flex-wrap items-center justify-around gap-6 p-2">
      {/* SVG Donut */}
      <div className="relative w-[180px] h-[180px] shrink-0">
        <svg
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
          className="rotate-[-90deg] transform"
        >
          {/* Base background circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="transparent"
            stroke="#F1F5F9"
            strokeWidth={strokeWidth}
          />
          {/* Slices */}
          {renderedSlices.map((slice) => {
            if (slice.count <= 0) return null;
            return (
              <circle
                key={slice.label}
                cx={size / 2}
                cy={size / 2}
                r={radius}
                fill="transparent"
                stroke={slice.color}
                strokeWidth={strokeWidth}
                strokeDasharray={slice.strokeDasharray}
                strokeDashoffset={slice.strokeDashoffset}
                strokeLinecap="round"
                className="transition-all duration-500 ease-out"
              />
            );
          })}
        </svg>
        {/* Center Text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center select-none pointer-events-none">
          <span className="text-3xl font-extrabold text-slate-800 tracking-tight leading-none">
            {total}
          </span>
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mt-1">
            Total Machines
          </span>
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-col gap-2.5 min-w-[130px]">
        {slices.map((item) => (
          <div
            key={item.label}
            className="flex items-center justify-between text-xs font-medium text-slate-600 gap-4"
          >
            <div className="flex items-center gap-2">
              <span className={`w-2.5 h-2.5 rounded-full ${item.dotColor}`} />
              <span>{item.label}</span>
            </div>
            <span className="font-bold text-slate-800 tabular-nums">{item.count}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
