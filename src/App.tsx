import React, { useState, useRef, useEffect, useCallback } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { AppSidebar } from './components/layout/AppSidebar';
import { AppHeader } from './components/layout/AppHeader';
import { MobileBottomNav } from './components/layout/MobileBottomNav';
import { OmniSearchModal } from './components/common/OmniSearchModal';
import { AlertDrawer } from './components/common/AlertDrawer';

// Screen imports
import { DashboardScreen } from './components/screens/DashboardScreen';
import { LiveStatusScreen } from './components/screens/LiveStatusScreen';
import { MachinesScreen } from './components/screens/MachinesScreen';
import { MachineDetailScreen } from './components/screens/MachineDetailScreen';
import { OrdersScreen } from './components/screens/OrdersScreen';
import { DesignVisualizerScreen } from './components/screens/DesignVisualizerScreen';
import { JobworkCostingScreen } from './components/screens/JobworkCostingScreen';
import { HeadIsolationScreen } from './components/screens/HeadIsolationScreen';
import { RawMaterialsScreen } from './components/screens/RawMaterialsScreen';
import { ShiftHandoverScreen } from './components/screens/ShiftHandoverScreen';
import { DispatchChallanScreen } from './components/screens/DispatchChallanScreen';
import { DowntimeAnalyticsScreen } from './components/screens/DowntimeAnalyticsScreen';
import { OperatorsScreen } from './components/screens/OperatorsScreen';
import { MaintenanceScreen } from './components/screens/MaintenanceScreen';
import { QualityControlScreen } from './components/screens/QualityControlScreen';
import { ThreadInventoryScreen } from './components/screens/ThreadInventoryScreen';
import { ProductionReportsScreen } from './components/screens/ProductionReportsScreen';
import { ShiftReportScreen } from './components/screens/ShiftReportScreen';
import { RunTimeScreen } from './components/screens/RunTimeScreen';
import { StopTimeScreen } from './components/screens/StopTimeScreen';
import { ThreadBreakageScreen } from './components/screens/ThreadBreakageScreen';
import { TimelineScreen } from './components/screens/TimelineScreen';
import { AlertsScreen } from './components/screens/AlertsScreen';
import { SettingsScreen } from './components/screens/SettingsScreen';
import { PowerMonitoringScreen } from './components/screens/PowerMonitoringScreen';
import { MachineQRScreen } from './components/screens/MachineQRScreen';
import { WhatsAppHubScreen } from './components/screens/WhatsAppHubScreen';

const MainLayout: React.FC = () => {
  const { currentRoute } = useApp();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const closeMobileMenu = useCallback(() => setIsMobileMenuOpen(false), []);

  const renderScreen = () => {
    switch (currentRoute) {
      case 'dashboard':
        return <DashboardScreen />;
      case 'power-monitoring':
        return <PowerMonitoringScreen />;
      case 'machine-qr':
        return <MachineQRScreen />;
      case 'operator-khata':
        return <OperatorsScreen />;
      case 'whatsapp-hub':
        return <WhatsAppHubScreen />;
      case 'live-status':
        return <LiveStatusScreen />;
      case 'machines':
        return <MachinesScreen />;
      case 'machine-detail':
        return <MachineDetailScreen />;
      case 'orders':
        return <OrdersScreen />;
      case 'design-visualizer':
        return <DesignVisualizerScreen />;
      case 'jobwork-costing':
        return <JobworkCostingScreen />;
      case 'head-matrix':
        return <HeadIsolationScreen />;
      case 'raw-materials':
        return <RawMaterialsScreen />;
      case 'shift-handover':
        return <ShiftHandoverScreen />;
      case 'dispatch-challan':
      case 'delivery-challan':
        return <DispatchChallanScreen />;
      case 'downtime-analytics':
        return <DowntimeAnalyticsScreen />;
      case 'operators':
        return <OperatorsScreen />;
      case 'maintenance':
        return <MaintenanceScreen />;
      case 'quality-control':
        return <QualityControlScreen />;
      case 'thread-inventory':
        return <ThreadInventoryScreen />;
      case 'production-reports':
        return <ProductionReportsScreen />;
      case 'shift-report':
        return <ShiftReportScreen />;
      case 'runtime':
        return <RunTimeScreen />;
      case 'stop-time':
        return <StopTimeScreen />;
      case 'thread-breakage':
        return <ThreadBreakageScreen />;
      case 'timeline':
        return <TimelineScreen />;
      case 'alerts':
        return <AlertsScreen />;
      case 'settings':
        return <SettingsScreen />;
      default:
        return <DashboardScreen />;
    }
  };

  const mainRef = useRef<HTMLElement>(null);
  useEffect(() => { mainRef.current?.scrollTo({ top: 0 }); }, [currentRoute]);

  return (
    <div className="h-dvh bg-[#F4F6FA]">
      <div className="flex h-full w-full bg-[#F4F6FA] text-slate-800 overflow-hidden relative">
        {/* Unified Responsive Sidebar & Mobile Drawer */}
        <AppSidebar
          isMobileOpen={isMobileMenuOpen}
          onCloseMobile={closeMobileMenu}
        />

        {/* Main Workspace Area */}
        <div inert={isMobileMenuOpen} className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
          <AppHeader onMobileMenuToggle={() => setIsMobileMenuOpen(true)} />

          <main ref={mainRef} id="main-content" className="app-main flex-1 min-h-0 overflow-y-auto p-3 sm:p-5 xl:p-6">
            <div className="max-w-7xl mx-auto w-full">{renderScreen()}</div>
          </main>

          {/* Mobile Bottom Navigation */}
          <div className="lg:hidden">
            <MobileBottomNav onMore={() => setIsMobileMenuOpen(true)} />
          </div>
        </div>
      </div>

      {/* Global Overlays */}
      <OmniSearchModal />
      <AlertDrawer />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainLayout />
    </AppProvider>
  );
}
