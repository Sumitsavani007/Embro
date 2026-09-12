import React from 'react';
import { MachineStatus } from '../../types';

interface StatusBadgeProps {
  status: MachineStatus;
  size?: 'xs' | 'sm' | 'md' | 'lg';
  showPulse?: boolean;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  size = 'sm',
  showPulse = true,
}) => {
  const getStyles = () => {
    switch (status) {
      case 'RUNNING':
        return {
          bg: 'bg-emerald-50 text-emerald-700 border-emerald-200/80',
          dot: 'bg-emerald-500',
          ping: 'bg-emerald-400',
          label: 'Running',
        };
      case 'IDLE':
        return {
          bg: 'bg-amber-50 text-amber-700 border-amber-200/80',
          dot: 'bg-amber-500',
          ping: 'bg-amber-400',
          label: 'Idle',
        };
      case 'STOPPED':
        return {
          bg: 'bg-rose-50 text-rose-700 border-rose-200/80',
          dot: 'bg-rose-500',
          ping: 'bg-rose-400',
          label: 'Stopped',
        };
      case 'OFFLINE':
      default:
        return {
          bg: 'bg-slate-100 text-slate-600 border-slate-200',
          dot: 'bg-slate-400',
          ping: 'bg-slate-300',
          label: 'Offline',
        };
    }
  };

  const { bg, dot, ping, label } = getStyles();

  const sizeClasses = {
    xs: 'px-1.5 py-0.5 text-[11px] gap-1',
    sm: 'px-2.5 py-1 text-xs gap-1.5',
    md: 'px-3 py-1.5 text-sm gap-2',
    lg: 'px-4 py-2 text-base gap-2.5',
  };

  const dotSizes = {
    xs: 'w-1.5 h-1.5',
    sm: 'w-2 h-2',
    md: 'w-2.5 h-2.5',
    lg: 'w-3 h-3',
  };

  return (
    <span
      className={`inline-flex items-center font-medium rounded-full border shadow-xs transition-all duration-200 ${bg} ${sizeClasses[size]}`}
    >
      <span className="relative flex items-center justify-center">
        {showPulse && status === 'RUNNING' && (
          <span
            className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${ping}`}
          />
        )}
        <span className={`relative inline-flex rounded-full ${dot} ${dotSizes[size]}`} />
      </span>
      <span>{label}</span>
    </span>
  );
};
