import React from 'react';
import { DowntimeRecord } from '../../types';

interface DowntimeDonutChartProps {
  data: DowntimeRecord[];
}

export const DowntimeDonutChart: React.FC<DowntimeDonutChartProps> = ({ data }) => {
  const size = 160;
  const strokeWidth = 20;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  const totalMinutes = data.reduce((sum, item) => sum + item.minutes, 0);

  let accumulatedPercent = 0;
  const renderedSlices = data.map((item) => {
    const percent = item.percentage / 100;
    const strokeDasharray = `${percent * circumference} ${circumference}`;
    const strokeDashoffset = -accumulatedPercent * circumference;
    accumulatedPercent += percent;
    return {
      ...item,
      strokeDasharray,
      strokeDashoffset,
    };
  });

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-2">
      <div className="relative w-[160px] h-[160px] shrink-0">
        <svg
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
          className="rotate-[-90deg] transform"
        >
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="transparent"
            stroke="#F1F5F9"
            strokeWidth={strokeWidth}
          />
          {renderedSlices.map((slice) => (
            <circle
              key={slice.reason}
              cx={size / 2}
              cy={size / 2}
              r={radius}
              fill="transparent"
              stroke={slice.color}
              strokeWidth={strokeWidth}
              strokeDasharray={slice.strokeDasharray}
              strokeDashoffset={slice.strokeDashoffset}
              className="transition-all duration-300"
            />
          ))}
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center select-none pointer-events-none">
          <span className="text-xl font-bold text-slate-800 leading-tight">
            {Math.floor(totalMinutes / 60)}h {totalMinutes % 60}m
          </span>
          <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
            Total Stop
          </span>
        </div>
      </div>
      <div className="flex flex-col gap-2 w-full sm:w-auto">
        {data.map((item) => (
          <div key={item.reason} className="flex items-center justify-between text-xs gap-4">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
              <span className="text-slate-600 font-medium truncate max-w-[130px]">{item.reason}</span>
            </div>
            <div className="flex items-center gap-2 font-semibold text-slate-800">
              <span>{item.percentage}%</span>
              <span className="text-slate-400 font-normal">({item.minutes}m)</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
