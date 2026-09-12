import React, { useState } from 'react';
import { ProductionRecord } from '../../types';

interface HourlyProductionChartProps {
  data: ProductionRecord[];
  height?: number;
}

export const HourlyProductionChart: React.FC<HourlyProductionChartProps> = ({
  data = [],
  height = 240,
}) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const safeData = data && Array.isArray(data) ? data : [];
  const safeLength = Math.max(1, safeData.length);
  const maxVal = Math.max(...safeData.map((d) => Math.max(d.actualStitches, d.targetStitches)), 36000);
  const minVal = 0;

  // Chart layout geometry
  const paddingLeft = 45;
  const paddingRight = 20;
  const paddingTop = 20;
  const paddingBottom = 30;
  const chartWidth = 620;
  const chartHeight = height;

  const innerWidth = chartWidth - paddingLeft - paddingRight;
  const innerHeight = chartHeight - paddingTop - paddingBottom;
  const barWidth = Math.min(22, (innerWidth / safeLength) * 0.55);

  const yTicks = [0, 10000, 20000, 30000];

  const getX = (index: number) => {
    return paddingLeft + (index + 0.5) * (innerWidth / safeLength);
  };

  const getY = (val: number) => {
    return paddingTop + innerHeight - ((val - minVal) / (maxVal - minVal)) * innerHeight;
  };

  const targetPoints = safeData.map((d, i) => `${getX(i)},${getY(d.targetStitches)}`).join(' ');

  return (
    <div className="w-full">
      <div className="relative w-full overflow-x-auto select-none">
        <svg
          viewBox={`0 0 ${chartWidth} ${chartHeight}`}
          className="w-full h-auto max-h-[260px] font-sans"
        >
          <defs>
            <linearGradient id="prodBarGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#2563EB" />
              <stop offset="100%" stopColor="#1D4ED8" />
            </linearGradient>
            <linearGradient id="hoverBarGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#3B82F6" />
              <stop offset="100%" stopColor="#1E40AF" />
            </linearGradient>
          </defs>

          {/* Grid lines and Y axis ticks */}
          {yTicks.map((tick) => {
            const y = getY(tick);
            return (
              <g key={tick}>
                <line
                  x1={paddingLeft}
                  y1={y}
                  x2={chartWidth - paddingRight}
                  y2={y}
                  stroke="#E2E8F0"
                  strokeDasharray="3 3"
                  strokeWidth="1"
                />
                <text
                  x={paddingLeft - 8}
                  y={y + 3}
                  textAnchor="end"
                  fontSize="11"
                  fill="#94A3B8"
                  fontWeight="500"
                >
                  {tick === 0 ? '0' : `${tick / 1000}k`}
                </text>
              </g>
            );
          })}

          {/* Actual Bars */}
          {safeData.map((item, i) => {
            const x = getX(i);
            const y = getY(item.actualStitches);
            const barHeight = innerHeight - (y - paddingTop);
            const isHovered = hoveredIndex === i;

            return (
              <g
                key={item.timeLabel}
                className="cursor-pointer transition-all duration-150"
                onMouseEnter={() => setHoveredIndex(i)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                {/* Invisible hover trigger area */}
                <rect
                  x={x - innerWidth / safeLength / 2}
                  y={paddingTop}
                  width={innerWidth / safeLength}
                  height={innerHeight}
                  fill="transparent"
                />
                
                {/* Background highlight when hovered */}
                {isHovered && (
                  <rect
                    x={x - innerWidth / safeLength / 2 + 2}
                    y={paddingTop}
                    width={innerWidth / safeLength - 4}
                    height={innerHeight}
                    fill="#EFF6FF"
                    opacity="0.7"
                    rx="4"
                  />
                )}

                {/* The Bar */}
                <rect
                  x={x - barWidth / 2}
                  y={y}
                  width={barWidth}
                  height={Math.max(2, barHeight)}
                  rx="3"
                  fill={isHovered ? 'url(#hoverBarGrad)' : 'url(#prodBarGrad)'}
                  className="transition-all duration-200"
                />

                {/* X axis labels */}
                <text
                  x={x}
                  y={chartHeight - 10}
                  textAnchor="middle"
                  fontSize="10"
                  fill={isHovered ? '#1E293B' : '#64748B'}
                  fontWeight={isHovered ? '600' : '400'}
                >
                  {item.timeLabel}
                </text>
              </g>
            );
          })}

          {/* Target Line (Dashed) */}
          <polyline
            points={targetPoints}
            fill="none"
            stroke="#0EA5E9"
            strokeWidth="2.5"
            strokeDasharray="4 4"
          />

          {/* Target Points */}
          {safeData.map((item, i) => {
            const x = getX(i);
            const y = getY(item.targetStitches);
            return (
              <circle
                key={`target-${i}`}
                cx={x}
                cy={y}
                r="3"
                fill="#0EA5E9"
                stroke="#FFFFFF"
                strokeWidth="1.5"
              />
            );
          })}
        </svg>

        {/* Floating Tooltip */}
        {hoveredIndex !== null && safeData[hoveredIndex] && (
          <div
            className="absolute z-20 pointer-events-none bg-slate-900/95 text-white text-xs px-3 py-2 rounded-lg shadow-lg backdrop-blur-xs border border-slate-700/50"
            style={{
              left: `${(hoveredIndex / safeLength) * 80 + 10}%`,
              top: '15%',
            }}
          >
            <div className="font-semibold text-slate-300 border-b border-slate-700 pb-1 mb-1">
              Time: {safeData[hoveredIndex].timeLabel}
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-xs bg-blue-500 inline-block" />
              <span>Actual: <strong>{(safeData[hoveredIndex].actualStitches ?? 0).toLocaleString()}</strong> stitches</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-xs bg-sky-400 inline-block" />
              <span>Target: <strong>{(safeData[hoveredIndex].targetStitches ?? 0).toLocaleString()}</strong> stitches</span>
            </div>
            <div className="text-[11px] text-emerald-400 mt-1 font-medium">
              {(safeData[hoveredIndex].actualStitches ?? 0) >= (safeData[hoveredIndex].targetStitches ?? 0) ? '+' : ''}
              {((safeData[hoveredIndex].actualStitches ?? 0) - (safeData[hoveredIndex].targetStitches ?? 0)).toLocaleString()} vs Target
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
