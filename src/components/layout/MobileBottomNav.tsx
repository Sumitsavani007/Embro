import React from 'react';
import {
  LayoutDashboard,
  Activity,
  Cpu,
  BarChart3,
  MoreHorizontal,
} from 'lucide-react';
import { useApp, ScreenRoute } from '../../context/AppContext';

export const MobileBottomNav: React.FC<{ onMore: () => void }> = ({ onMore }) => {
  const { currentRoute, setCurrentRoute, unreadAlertCount, setIsAlertDrawerOpen, language } = useApp();

  const items: {
    id: ScreenRoute | 'more';
    label: string;
    icon: React.ElementType;
    badge?: number;
  }[] = [
    { id: 'dashboard', label: language === 'gu' ? 'ડેશબોર્ડ' : 'Dashboard', icon: LayoutDashboard },
    { id: 'live-status', label: language === 'gu' ? 'લાઇવ' : 'Live', icon: Activity },
    { id: 'machines', label: language === 'gu' ? 'મશીનો' : 'Machines', icon: Cpu },
    { id: 'production-reports', label: language === 'gu' ? 'રિપોર્ટ' : 'Reports', icon: BarChart3 },
    { id: 'more', label: language === 'gu' ? 'વધુ' : 'More', icon: MoreHorizontal,  },
  ];

  const handleClick = (id: ScreenRoute | 'more') => {
    if (id === 'more') {
      onMore();
    } else {
      setCurrentRoute(id);
    }
  };

  return (
    <div className="mobile-bottom-nav bg-white border-t border-slate-200 py-2 px-3 flex items-center justify-around shrink-0 z-30 shadow-lg">
      {items.map((item) => {
        const Icon = item.icon;
        const isActive =
          (item.id !== 'more' && currentRoute === item.id) ||
          (item.id === 'machines' && currentRoute === 'machine-detail') ||
          (item.id === 'production-reports' && currentRoute === 'shift-report');

        return (
          <button
            key={item.id}
            onClick={() => handleClick(item.id)}
            aria-current={isActive ? 'page' : undefined}
            className={`min-h-11 flex flex-col items-center justify-center flex-1 py-1 relative transition-colors cursor-pointer ${
              isActive ? 'text-blue-600 font-semibold' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <div className="relative">
              <Icon className="w-5 h-5" />
              {item.badge && item.badge > 0 ? (
                <span className="absolute -top-1 -right-2 bg-rose-500 text-white text-[9px] font-bold px-1 rounded-full">
                  {item.badge}
                </span>
              ) : null}
            </div>
            <span className="text-[10px] mt-1 tracking-tight">{item.label}</span>
          </button>
        );
      })}
    </div>
  );
};
