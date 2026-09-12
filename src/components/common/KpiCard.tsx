import React from 'react';
import { LucideIcon } from 'lucide-react';

interface KpiCardProps {
  title: string;
  value: string | number;
  subValue?: string | React.ReactNode;
  icon: LucideIcon;
  iconColor?: string;
  iconBg?: string;
  accentColor?: 'blue' | 'green' | 'rose' | 'amber' | 'slate';
  badge?: {
    text: string;
    type: 'success' | 'danger' | 'warning' | 'neutral' | 'primary';
  };
  onClick?: () => void;
}

export const KpiCard: React.FC<KpiCardProps> = ({
  title,
  value,
  subValue,
  icon: Icon,
  iconColor = 'text-blue-600',
  iconBg = 'bg-blue-50',
  badge,
  onClick,
}) => {
  return (
    <div
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={event => { if (onClick && (event.key === 'Enter' || event.key === ' ')) { event.preventDefault(); onClick(); } }}
      onClick={onClick}
      className={`bg-white rounded-xl border border-slate-200/90 min-w-0 p-3 sm:p-4 shadow-xs hover:shadow-sm transition-all duration-200 flex flex-col justify-between ${
        onClick ? 'cursor-pointer hover:border-blue-300' : ''
      }`}
    >
      <div className="flex items-center justify-between gap-2 mb-2">
        <span className="text-[11px] font-medium tracking-wide text-slate-500">
          {title}
        </span>
        <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${iconBg} ${iconColor} shrink-0`}>
          <Icon className="w-4 h-4" />
        </div>
      </div>
      <div className="mt-1">
        <div className="flex flex-wrap items-baseline gap-2">
          <span className="text-xl sm:text-3xl break-words font-bold tracking-tight text-slate-900">
            {value}
          </span>
          {badge && (
            <span
              className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                badge.type === 'success'
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                  : badge.type === 'danger'
                  ? 'bg-rose-50 text-rose-700 border border-rose-200'
                  : badge.type === 'warning'
                  ? 'bg-amber-50 text-amber-700 border border-amber-200'
                  : 'bg-slate-100 text-slate-700 border border-slate-200'
              }`}
            >
              {badge.text}
            </span>
          )}
        </div>
        {subValue && (
          <div className="mt-1.5 text-xs text-slate-500 font-medium flex items-center gap-1.5">
            {subValue}
          </div>
        )}
      </div>
    </div>
  );
};
