import React, { useMemo, useEffect, useRef, useState } from 'react';
import {
  LayoutDashboard,
  Activity,
  Cpu,
  BarChart3,
  Play,
  Square,
  Scissors,
  Clock,
  Bell,
  Settings,
  LogOut,
  ChevronRight,
  ChevronDown,
  Layers,
  Users,
  Wrench,
  ShieldCheck,
  Package,
  Sparkles,
  Calculator,
  Grid,
  Truck,
  ClipboardCheck,
  AlertOctagon,
  Boxes,
  X,
  Zap,
  QrCode,
  MessageSquare,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react';
import { useApp, ScreenRoute } from '../../context/AppContext';

interface AppSidebarProps {
  onItemClick?: () => void;
  collapsed?: boolean;
  isMobileOpen?: boolean;
  onCloseMobile?: () => void;
}

interface NavItemConfig {
  id: ScreenRoute;
  label: string;
  labelGu: string;
  icon: React.ElementType;
  badge?: string | number;
  badgeColor?: string;
  dotColor?: string;
  description?: string;
}

interface NavGroupConfig {
  title: string;
  titleGu: string;
  items: NavItemConfig[];
}

export const AppSidebar: React.FC<AppSidebarProps> = ({
  onItemClick,
  isMobileOpen = false,
  onCloseMobile,
}) => {
  const {
    currentRoute,
    setCurrentRoute,
    unreadAlertCount,
    threadBreakages,
    currentUser,
    logout,
    language,
    selectedShift,
    isSimulating,
  } = useApp();

  const drawerRef = useRef<HTMLDivElement>(null);
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({
  });

  useEffect(() => {
    if (!isMobileOpen) return;
    const previous = document.activeElement as HTMLElement | null;
    const drawer = drawerRef.current;
    const controls = () => Array.from(drawer?.querySelectorAll<HTMLElement>('button, input, [tabindex="0"]') || []).filter(el => el.getClientRects().length);
    controls()[0]?.focus();
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') { event.preventDefault(); onCloseMobile?.(); }
      if (event.key === 'Tab') {
        const items = controls(); const first = items[0]; const last = items[items.length - 1];
        if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
        else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
      }
    };
    const media = window.matchMedia('(min-width: 1024px)');
    const onResize = () => { if (media.matches) onCloseMobile?.(); };
    document.addEventListener('keydown', onKey); media.addEventListener('change', onResize);
    return () => { document.removeEventListener('keydown', onKey); media.removeEventListener('change', onResize); previous?.focus(); };
  }, [isMobileOpen, onCloseMobile]);

  const navGroups: NavGroupConfig[] = useMemo(() => [
    {
      title: 'FACTORY WORKFLOW',
      titleGu: 'મુખ્ય & વર્કફ્લો',
      items: [
        {
          id: 'whatsapp-hub',
          label: 'WhatsApp Alerts Hub',
          labelGu: 'વોટ્સએપ ઓટોમેશન',
          icon: MessageSquare,
          badge: '1-Click',
          badgeColor: 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30',
          dotColor: 'bg-emerald-400',
        },
        {
          id: 'power-monitoring',
          label: 'Power & DG Analytics',
          labelGu: 'વીજળી & ડીજી વપરાશ',
          icon: Zap,
          badge: 'PF 0.98',
          badgeColor: 'bg-amber-500/20 text-amber-300 border border-amber-500/30',
          dotColor: 'bg-amber-400',
        },
        {
          id: 'machine-qr',
          label: 'Machine QR & Barcodes',
          labelGu: 'મશીન QR & બારકોડ',
          icon: QrCode,
          badge: 'Print',
          badgeColor: 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30',
          dotColor: 'bg-indigo-400',
        },
      ],
    },
    {
      title: 'LIVE MACHINE TRACKING',
      titleGu: 'શોપ ફ્લોર & મશીન ટેલિમેટ્રી',
      items: [
        {
          id: 'thread-breakage',
          label: 'Thread Breakages',
          labelGu: 'દોરો તૂટવો (બ્રેકેજ)',
          icon: Scissors,
          badge: threadBreakages.length > 0 ? threadBreakages.length : undefined,
          badgeColor: 'bg-rose-500/20 text-rose-300 border border-rose-500/30',
          dotColor: 'bg-rose-400',
        },
        {
          id: 'design-visualizer',
          label: 'DST Stitch Simulator',
          labelGu: 'DST સ્ટીચ સિમ્યુલેટર',
          icon: Sparkles,
          badge: 'DST',
          badgeColor: 'bg-sky-500/20 text-sky-300 border border-sky-500/30',
        },
      ],
    },
    {
      title: 'ORDERS & DELIVERY',
      titleGu: 'ઓર્ડર & કાચો માલ સ્ટોક',
      items: [
        {
          id: 'orders',
          label: 'Batch Orders & ETA',
          labelGu: 'બેચ ઓર્ડર્સ & ETA',
          icon: Layers,
        },
        {
          id: 'jobwork-costing',
          label: 'Jobwork Costing & Rates',
          labelGu: 'જોબવર્ક કોસ્ટિંગ & રેટ્સ',
          icon: Calculator,
          badge: '₹/1k St',
          badgeColor: 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30',
        },
        {
          id: 'thread-inventory',
          label: 'Thread & Bobbin Stock',
          labelGu: 'દોરા & બોબીન સ્ટોક',
          icon: Package,
        },
        {
          id: 'raw-materials',
          label: 'Buckram & Materials',
          labelGu: 'રો મટિરિયલ્સ & બકિંગ',
          icon: Boxes,
        },
        {
          id: 'dispatch-challan',
          label: 'Delivery & Gatepass',
          labelGu: 'ડિલિવરી & ગેટપાસ',
          icon: Truck,
          badge: 'Gatepass',
          badgeColor: 'bg-teal-500/20 text-teal-300 border border-teal-500/30',
        },
      ],
    },
    {
      title: 'OPERATIONS & QUALITY',
      titleGu: 'કામગીરી, ગુણવત્તા & રિપોર્ટ્સ',
      items: [
        {
          id: 'operators',
          label: 'Operators & Shifts',
          labelGu: 'ઓપરેટર રોસ્ટર & શિફ્ટ',
          icon: Users,
        },
        {
          id: 'shift-handover',
          label: 'Shift Handover Log',
          labelGu: 'શિફ્ટ હેન્ડઓવર લોગ',
          icon: ClipboardCheck,
        },
        {
          id: 'quality-control',
          label: 'Quality Control (QC)',
          labelGu: 'ક્વોલિટી કંટ્રોલ (QC)',
          icon: ShieldCheck,
        },
        {
          id: 'maintenance',
          label: 'Oiling & Hook Service',
          labelGu: 'ઓઇલિંગ & હૂક સર્વિસ',
          icon: Wrench,
        },
        {
          id: 'downtime-analytics',
          label: 'Downtime Pareto',
          labelGu: 'ડાઉનટાઇમ પારેટો',
          icon: AlertOctagon,
          badge: 'OEE',
          badgeColor: 'bg-amber-500/20 text-amber-300 border border-amber-500/30',
        },
      ],
    },
    {
      title: 'SYSTEM & ALERTS',
      titleGu: 'સિસ્ટમ & સેટિંગ્સ',
      items: [
        {
          id: 'alerts',
          label: 'Alerts & Events',
          labelGu: 'એલર્ટ્સ & નોટિફિકેશન',
          icon: Bell,
          badge: unreadAlertCount > 0 ? unreadAlertCount : undefined,
          badgeColor: 'bg-rose-500 text-white font-bold animate-pulse',
          dotColor: 'bg-rose-500',
        },
        {
          id: 'settings',
          label: 'Factory Settings',
          labelGu: 'સેટિંગ્સ & કન્ફિગરેશન',
          icon: Settings,
        },
      ],
    },
  ], [language, threadBreakages.length, unreadAlertCount]);

  useEffect(() => {
    const activeGroup = navGroups.find((group) => group.items.some((item) => item.id === currentRoute));
    if (activeGroup) setExpandedGroups((previous) => ({ ...previous, [activeGroup.title]: true }));
  }, [currentRoute, navGroups]);

  const filteredNavGroups = navGroups;

  const handleNav = (route: ScreenRoute) => {
    setCurrentRoute(route);
    if (onItemClick) onItemClick();
    if (onCloseMobile) onCloseMobile();
  };

  const renderNavItem = (item: NavItemConfig) => {
    const Icon = item.icon;
    const isActive = currentRoute === item.id || (item.id === 'machines' && currentRoute === 'machine-detail') || (item.id === 'production-reports' && currentRoute === 'shift-report');
    return <button key={item.id} aria-current={isActive ? 'page' : undefined} title={language === 'gu' ? item.labelGu : item.label} onClick={() => handleNav(item.id)} className={`saas-sidebar-item w-full flex items-center justify-between px-2.5 py-2.5 min-h-11 rounded-lg text-[13px] font-medium transition-all duration-150 group cursor-pointer relative ${isActive ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20' : 'text-slate-300 hover:text-white hover:bg-slate-800/60'}`}>
      {isActive && <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 bg-white rounded-r-full shadow-sm" />}
      <div className="flex items-center gap-2.5 min-w-0 pr-1"><div className={`p-0.5 rounded transition-colors shrink-0 ${isActive ? 'bg-white/15 text-white' : 'text-slate-400 group-hover:text-slate-200'}`}><Icon className="w-4 h-4" /></div><span className="saas-sidebar-label text-left leading-snug">{language === 'gu' ? item.labelGu : item.label}</span></div>
      <div className="flex items-center gap-1.5 shrink-0">{typeof item.badge === 'number' && item.badge > 0 && <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold tracking-tight shrink-0 ${item.badgeColor || 'bg-slate-800 text-slate-300'}`}>{item.badge}</span>}{!isActive && <ChevronRight className="w-3.5 h-3.5 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity" />}</div>
    </button>;
  };

  const sidebarContent = (
    <div className="saas-sidebar w-[280px] max-w-full text-slate-300 flex flex-col h-full shrink-0 border-r border-slate-800/80 select-none relative">
      {/* Decorative top ambient glow line */}
      <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-blue-500/80 to-transparent pointer-events-none" />

      {/* Brand Header */}
      <div className="px-4 pt-4 pb-3.5 border-b border-slate-800/80">
        <div className="flex items-center justify-between">
          <div className="flex min-w-0 items-center gap-2">
            {/* Custom Brand Logo with Stitch/Embroidery aesthetic */}
            <div className="relative w-10 h-10 rounded-2xl bg-gradient-to-br from-blue-500 via-indigo-600 to-blue-700 flex items-center justify-center text-white shadow-lg shadow-blue-600/30 shrink-0 border border-blue-400/30">
              <svg
                className="w-5 h-5 drop-shadow"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M3 19h18" />
                <path d="M5 19v-9a4 4 0 0 1 4-4h8a3 3 0 0 1 3 3v10" />
                <path d="M12 6V3.5" />
                <path d="M9 10h6" />
                <circle cx="16" cy="10" r="1.5" />
                <path d="M9 10v6" />
                <path d="M9 16l-1 1" />
              </svg>
              {isSimulating && (
                <span className="absolute -top-1 -right-1 flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500 border border-[#090F1E]" />
                </span>
              )}
            </div>
            <div className="min-w-0 overflow-hidden">
              <div className="flex items-center gap-1.5">
                <h1 className="text-white font-semibold text-[14px] tracking-tight leading-tight truncate">
                  Embroidery Track
                </h1>
                <span className="text-[9px] font-black uppercase tracking-wider px-1.5 py-0.2 rounded bg-blue-500/20 text-blue-300 border border-blue-400/30">
                  PRO
                </span>
              </div>
              <p className="text-[11px] text-slate-400 truncate font-medium flex items-center gap-1 mt-0.5">
                <span>Surat Industrial MES</span>
              </p>
            </div>
          </div>
          {onCloseMobile && (
            <button
              onClick={onCloseMobile}
              className="lg:hidden shrink-0 p-1.5 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors"
              aria-label="Close sidebar"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

      </div>

      {/* Navigation list with styled groupings */}
      <nav aria-label="Main navigation" className="flex-1 min-h-0 px-3 py-3 overflow-y-auto space-y-4 scrollbar-thin scrollbar-thumb-slate-800">
        <div className="space-y-0.5">
          {renderNavItem({ id: 'dashboard', label: 'Dashboard', labelGu: 'ડેશબોર્ડ', icon: LayoutDashboard })}
          {renderNavItem({ id: 'live-status', label: 'Live Machine Status', labelGu: 'લાઇવ મશીન સ્ટેટસ', icon: Activity })}
        </div>
        {filteredNavGroups.map((group, gIdx) => (
          <div key={gIdx} onMouseEnter={() => setExpandedGroups({ [group.title]: true })} onMouseLeave={() => setExpandedGroups((previous) => ({ ...previous, [group.title]: false }))} className="saas-sidebar-group space-y-1">
            <button
              type="button"
              onClick={() => setExpandedGroups((previous) => ({ ...previous, [group.title]: !previous[group.title] }))}
              className="w-full px-2.5 py-2 text-[10px] font-bold tracking-wider text-slate-400 uppercase flex items-center justify-between rounded-lg hover:bg-slate-900 hover:text-slate-200 transition-colors"
              aria-expanded={expandedGroups[group.title] === true}
            >
              <span>{language === 'gu' ? group.titleGu : group.title}</span>
              <ChevronDown className={`w-3.5 h-3.5 transition-transform ${expandedGroups[group.title] === true ? '' : '-rotate-90'}`} />
            </button>

            {expandedGroups[group.title] === true && <div className="saas-sidebar-items space-y-0.5">
              {group.items.map(renderNavItem)}
            </div>}
          </div>
        ))}

      </nav>

      {/* User profile footer with rich quick-actions */}
      <div className="p-3 border-t border-slate-800/90 bg-[#060B16] relative">
        <div className="flex items-center justify-between p-2 rounded-xl bg-slate-900/80 border border-slate-800/90 hover:border-slate-700/80 transition-all">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="relative shrink-0">
              {currentUser?.avatarUrl ? (
                <img
                  src={currentUser.avatarUrl}
                  alt={currentUser?.name || 'User'}
                  className="w-8 h-8 rounded-xl object-cover ring-1 ring-blue-500/40 shadow-sm"
                />
              ) : (
                <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-black text-xs flex items-center justify-center shadow-xs">
                  {currentUser?.name ? currentUser.name.slice(0, 2).toUpperCase() : 'HK'}
                </div>
              )}
              <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-[#060B16]" />
            </div>
            <div className="min-w-0 text-left">
              <p className="text-xs font-bold text-white truncate leading-tight">
                {currentUser?.name || 'User'}
              </p>
              <p className="text-[10px] text-slate-400 truncate flex items-center gap-1 font-medium">
                <span className="text-blue-400 font-semibold">{currentUser?.role ? currentUser.role.toUpperCase() : 'ADMIN'}</span>
                <span>•</span>
                <span>{selectedShift?.split ? selectedShift.split(' (')[0] : 'Day Shift'}</span>
              </p>
            </div>
          </div>
          <button
            onClick={logout}
            title={language === 'gu' ? 'લોગ આઉટ' : 'Sign Out'}
            className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors cursor-pointer"
            aria-label="Logout"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar (visible on lg+) */}
      <aside className="hidden lg:block h-dvh sticky top-0 shrink-0 z-30">
        {sidebarContent}
      </aside>

      {/* Mobile Drawer with smooth backdrop transition */}
      {isMobileOpen && (
        <div ref={drawerRef} id="mobile-navigation" role="dialog" aria-modal="true" aria-label="Navigation menu" className="lg:hidden fixed inset-0 z-50 flex">
          <div
            className="fixed inset-0 bg-slate-950/75 backdrop-blur-xs transition-opacity"
            onClick={onCloseMobile}
          />
          <div className="relative z-10 h-full w-[280px] max-w-[calc(100vw-32px)] shadow-2xl animate-in slide-in-from-left duration-200">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
};
