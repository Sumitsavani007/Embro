import React, { useState } from 'react';

export interface TrendDataPoint {
  label: string;
  actual: number;
  target?: number;
}

interface TrendLineChartProps {
  data: TrendDataPoint[];
  height?: number;
  unit?: string;
  color?: string;
  targetColor?: string;
  fillArea?: boolean;
}

export const TrendLineChart: React.FC<TrendLineChartProps> = ({
  data = [],
  height = 220,
  unit = 'stitches',
  color = '#2563EB',
  targetColor = '#0EA5E9',
  fillArea = true,
}) => {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  const safeData = data && Array.isArray(data) ? data : [];
  if (safeData.length === 0) {
    return (
      <div className="w-full flex items-center justify-center p-8 text-xs text-slate-400">
        No trend data available.
      </div>
    );
  }

  const values = safeData.flatMap((d) => [d.actual, d.target ?? d.actual]);
  const maxVal = Math.max(...values, 100);
  const minVal = 0;

  const chartWidth = 580;
  const padding = { top: 20, right: 25, bottom: 30, left: 45 };
  const innerW = chartWidth - padding.left - padding.right;
  const innerH = height - padding.top - padding.bottom;

  const getX = (idx: number) => padding.left + (idx / (safeData.length - 1 || 1)) * innerW;
  const getY = (val: number) => padding.top + innerH - ((val - minVal) / (maxVal - minVal || 1)) * innerH;

  const actualPoints = safeData.map((d, i) => `${getX(i)},${getY(d.actual)}`).join(' ');
  const targetPoints = safeData.map((d, i) => `${getX(i)},${getY(d.target ?? d.actual)}`).join(' ');

  const areaPath = `M ${getX(0)},${padding.top + innerH} L ${actualPoints} L ${getX(safeData.length - 1)},${padding.top + innerH} Z`;
  const yTicks = [0, Math.round(maxVal * 0.33), Math.round(maxVal * 0.66), maxVal];

  return (
    <div className="w-full relative select-none">
      <svg viewBox={`0 0 ${chartWidth} ${height}`} className="w-full h-auto max-h-[240px]">
        <defs>
          <linearGradient id="trendAreaGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.25" />
            <stop offset="100%" stopColor={color} stopOpacity="0.0" />
          </linearGradient>
        </defs>

        {/* Horizontal grid lines */}
        {yTicks.map((tick, i) => {
          const y = getY(tick);
          return (
            <g key={i}>
              <line
                x1={padding.left}
                y1={y}
                x2={chartWidth - padding.right}
                y2={y}
                stroke="#E2E8F0"
                strokeDasharray="3 3"
                strokeWidth="1"
              />
              <text
                x={padding.left - 8}
                y={y + 3}
                textAnchor="end"
                fontSize="10"
                fill="#94A3B8"
              >
                {tick >= 1000 ? `${(tick / 1000).toFixed(0)}k` : tick}
              </text>
            </g>
          );
        })}

        {/* Filled Area */}
        {fillArea && <path d={areaPath} fill="url(#trendAreaGrad)" />}

        {/* Target Line (if target exists) */}
        {data.some((d) => d.target !== undefined) && (
          <polyline
            points={targetPoints}
            fill="none"
            stroke={targetColor}
            strokeWidth="2"
            strokeDasharray="4 4"
          />
        )}

        {/* Actual Line */}
        <polyline
          points={actualPoints}
          fill="none"
          stroke={color}
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Data points & X-axis labels */}
        {data.map((d, i) => {
          const x = getX(i);
          const y = getY(d.actual);
          const isHovered = hoveredIdx === i;

          return (
            <g
              key={i}
              className="cursor-pointer"
              onMouseEnter={() => setHoveredIdx(i)}
              onMouseLeave={() => setHoveredIdx(null)}
            >
              <line
                x1={x}
                y1={padding.top}
                x2={x}
                y2={padding.top + innerH}
                stroke={isHovered ? '#94A3B8' : 'transparent'}
                strokeDasharray="2 2"
                strokeWidth="1"
              />
              <circle
                cx={x}
                cy={y}
                r={isHovered ? 5.5 : 4}
                fill={isHovered ? '#FFFFFF' : color}
                stroke={color}
                strokeWidth="2.5"
                className="transition-all duration-150"
              />
              <text
                x={x}
                y={height - 8}
                textAnchor="middle"
                fontSize="10"
                fill={isHovered ? '#0F172A' : '#64748B'}
                fontWeight={isHovered ? '600' : '400'}
              >
                {d.label}
              </text>
            </g>
          );
        })}
      </svg>

      {hoveredIdx !== null && safeData[hoveredIdx] && (
        <div
          className="absolute z-20 pointer-events-none bg-slate-900 text-white text-xs px-2.5 py-1.5 rounded-md shadow-lg"
          style={{
            left: `${(hoveredIdx / (safeData.length - 1 || 1)) * 75 + 12}%`,
            top: '20%',
          }}
        >
          <div className="font-semibold text-slate-300">{safeData[hoveredIdx].label}</div>
          <div>Actual: {(safeData[hoveredIdx].actual ?? 0).toLocaleString()} {unit}</div>
          {safeData[hoveredIdx].target !== undefined && (
            <div className="text-sky-300">Target: {(safeData[hoveredIdx].target ?? 0).toLocaleString()} {unit}</div>
          )}
        </div>
      )}
    </div>
  );
};
