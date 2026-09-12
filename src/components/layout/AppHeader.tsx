import React, { useState, useEffect, useRef } from 'react';
import { Bell, ChevronDown, Building2, Layers, Radio, Menu, Search, Languages, Check, LogOut, Settings as SettingsIcon, Activity } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { FACTORIES } from '../../data/mockData';

interface AppHeaderProps { onMobileMenuToggle: () => void; }

export const AppHeader: React.FC<AppHeaderProps> = ({ onMobileMenuToggle }) => {
  const { currentRoute, setCurrentRoute, selectedFactory, setSelectedFactory, selectedShift, setSelectedShift,
    unreadAlertCount, setIsAlertDrawerOpen, isSimulating, setIsSimulating, triggerSimulatedEvent,
    setIsOmniSearchOpen, language, setLanguage, currentUser, logout, runningCount, totalMachines } = useApp();
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);
  const profileButtonRef = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    if (!profileOpen) return;
    const close = (event: PointerEvent) => {
      if (!profileRef.current?.contains(event.target as Node)) setProfileOpen(false);
    };
    const escape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') { setProfileOpen(false); profileButtonRef.current?.focus(); }
    };
    document.addEventListener('pointerdown', close);
    document.addEventListener('keydown', escape);
    return () => { document.removeEventListener('pointerdown', close); document.removeEventListener('keydown', escape); };
  }, [profileOpen]);
  useEffect(() => { setProfileOpen(false); }, [currentRoute]);
  const getPageTitle = () => {
    switch (currentRoute) {
      case 'dashboard':
        return {
          title: language === 'gu' ? 'ડેશબોર્ડ' : 'Dashboard',
          subtitle: language === 'gu' ? 'એમ્બ્રોઈડરી મશીનો અને પ્રોડક્શનનું લાઈવ ઓવરવ્યૂ' : 'Real-time overview of your embroidery machines',
        };
      case 'live-status':
        return {
          title: language === 'gu' ? 'લાઇવ મશીન સ્ટેટસ' : 'Live Machine Status',
          subtitle: language === 'gu' ? 'બધા સક્રિય મશીનોનું રિયલ-ટાઇમ મોનિટરિંગ' : 'Real-time status of all active machines',
        };
      case 'machines':
        return {
          title: language === 'gu' ? 'બધા મશીનો' : 'Machines',
          subtitle: language === 'gu' ? 'તમામ એમ્બ્રોઈડરી સાધનો અને ફ્લોર કંટ્રોલ' : 'Manage and monitor all embroidery equipment',
        };
      case 'orders':
        return {
          title: language === 'gu' ? 'બેચ ઓર્ડર્સ & લાઈવ ETA' : 'Batch Orders & Live ETA',
          subtitle: language === 'gu' ? 'ઓર્ડર કતાર, ગારમેન્ટ પૂર્ણતા દર અને અંદાજિત સમય' : 'Order queue, garment completion rates, and estimated finish times',
        };
      case 'design-visualizer':
        return {
          title: language === 'gu' ? 'DST સ્ટીચ સિમ્યુલેટર' : 'DST Stitch Simulator',
          subtitle: language === 'gu' ? 'એમ્બ્રોઈડરી ડિઝાઇન પ્લેયર, સોય ક્રમ અને ઘનતા' : 'Embroidery design player, needle sequence & density',
        };
      case 'jobwork-costing':
        return {
          title: language === 'gu' ? 'જોબવર્ક કોસ્ટિંગ & રેટ્સ' : 'Jobwork Costing & Rates',
          subtitle: language === 'gu' ? 'ટાંકા દર ગણતરી (₹/1k ટાંકા), વપરાશ અને જોબ સ્લિપ' : 'Stitch rate calculation (₹/1k stitches), consumables & job slips',
        };
      case 'head-matrix':
        return {
          title: language === 'gu' ? 'હેડ આઇસોલેશન મેટ્રિક્સ' : 'Head Isolation Matrix',
          subtitle: language === 'gu' ? 'મલ્ટી-હેડ સોલેનોઇડ આઇસોલેશન અને દોરા તણાવ સેન્સર' : 'Multi-head solenoid isolation & thread tension sensors',
        };
      case 'raw-materials':
        return {
          title: language === 'gu' ? 'રો મટિરિયલ્સ & બકિંગ' : 'Raw Materials & Backing',
          subtitle: language === 'gu' ? 'બુક્રમ, સોલ્વી ફિલ્મ, પફ ફોમ અને ઓર્ગન નીડલ સ્ટોક' : 'Buckram, solvy film, puff foam, and organ needle stock',
        };
      case 'shift-handover':
        return {
          title: language === 'gu' ? 'શિફ્ટ હેન્ડઓવર લોગ' : 'Shift Handover Log',
          subtitle: language === 'gu' ? 'સુપરવાઇઝર સહી રજિસ્ટર અને કામગીરી સાતત્ય' : 'Supervisor sign-off register and operational shift continuity',
        };
      case 'dispatch-challan':
        return {
          title: language === 'gu' ? 'ડિલિવરી & ગેટપાસ' : 'Delivery & Gatepass',
          subtitle: language === 'gu' ? 'કાર્ટન મેનિફેસ્ટ, વાહન રેકોર્ડ અને સત્તાવાર ચલણ' : 'Carton manifest, vehicle records & official dispatch passes',
        };
      case 'downtime-analytics':
        return {
          title: language === 'gu' ? 'ડાઉનટાઇમ પારેટો એનાલિટિક્સ' : 'Downtime Pareto Analytics',
          subtitle: language === 'gu' ? 'મૂળ કારણ વિશ્લેષણ, ગુમાવેલા કલાકો અને OEE સુધારો' : 'Root-cause analysis, lost machine hours & OEE optimization',
        };
      case 'operators':
        return {
          title: language === 'gu' ? 'ઓપરેટર રોસ્ટર & કામગીરી' : 'Operator Roster & Performance',
          subtitle: language === 'gu' ? 'શિફ્ટ ફાળવણી, ટાંકા ઉત્પાદન અને પ્રોત્સાહન બોનસ' : 'Shift allocations, stitch throughput, and piece-rate incentives',
        };
      case 'maintenance':
        return {
          title: language === 'gu' ? 'ઓઇલિંગ & સર્વિસ લોગ' : 'Preventive Maintenance & Oiling',
          subtitle: language === 'gu' ? 'રોટરી હૂક લુબ્રિકેશન સમયપત્રક અને ડિજિટલ લોગબુક' : 'Rotary hook lubrication schedule, needle checks & digital logbook',
        };
      case 'quality-control':
        return {
          title: language === 'gu' ? 'ક્વોલિટી કંટ્રોલ (QC)' : 'Quality Control (QC) & Defects',
          subtitle: language === 'gu' ? 'ફર્સ્ટ-પાસ યીલ્ડ ઓડિટિંગ અને ખામી લોગ' : 'First-Pass Yield auditing, defect taxonomy & scrap logs',
        };
      case 'thread-inventory':
        return {
          title: language === 'gu' ? 'દોરા & બોબીન સ્ટોક' : 'Thread & Bobbin Stock',
          subtitle: language === 'gu' ? 'કોન શેડ્સ, બોબીન રનઆઉટ આગાહી અને વપરાશ કેલ્ક્યુલેટર' : 'Cone shades, bobbin runout predictors & batch usage calculator',
        };
      case 'machine-detail':
        return {
          title: language === 'gu' ? 'મશીન વિગત' : 'Machine Detail',
          subtitle: language === 'gu' ? 'ડાયગ્નોસ્ટિક ટેલિમેટ્રી, સ્ટીચ ટેલિમેટ્રી અને જોબ્સ' : 'Diagnostic telemetry, stitch telemetry & jobs',
        };
      case 'production-reports':
        return {
          title: language === 'gu' ? 'પ્રોડક્શન રિપોર્ટ' : 'Production Report',
          subtitle: language === 'gu' ? 'વિગતવાર ઉત્પાદન અહેવાલો અને મેટ્રિક્સ' : 'View detailed production reports and metrics',
        };
      case 'shift-report':
        return {
          title: language === 'gu' ? 'શિફ્ટ રિપોર્ટ' : 'Shift Report',
          subtitle: language === 'gu' ? 'શિફ્ટ મુજબ વિભાજન, લક્ષ્યો વિરુદ્ધ વાસ્તવિક ઉત્પાદન' : 'Shift-wise breakdown, targets vs actual output',
        };
      case 'runtime':
        return {
          title: language === 'gu' ? 'રન ટાઇમ / સ્ટોપ ટાઇમ' : 'Run Time / Stop Time',
          subtitle: language === 'gu' ? 'ઓપરેટિંગ કલાકો અને મશીન વપરાશ એનાલિટિક્સ' : 'Operating hours and machine utilization analytics',
        };
      case 'stop-time':
        return {
          title: language === 'gu' ? 'ડાઉનટાઇમ વિશ્લેષણ' : 'Downtime Analysis',
          subtitle: language === 'gu' ? 'સમગ્ર અટકવાના કારણોનું વિશ્લેષણ' : 'Comprehensive stoppage reason breakdown',
        };
      case 'thread-breakage':
        return {
          title: language === 'gu' ? 'દોરો તૂટવો (બ્રેકેજ)' : 'Thread Breakage',
          subtitle: language === 'gu' ? 'રિયલ-ટાઇમ સેન્સર લોગ અને રિપેર સમયગાળો' : 'Real-time sensor logs and repair durations',
        };
      case 'timeline':
        return {
          title: language === 'gu' ? 'ઇવેન્ટ ટાઇમલાઇન' : 'Event Timeline',
          subtitle: language === 'gu' ? 'સમયાનુસાર ટેલિમેટ્રી અને મશીન ઓડિટ લોગ' : 'Chronological telemetry and machine audit logs',
        };
      case 'alerts':
        return {
          title: language === 'gu' ? 'એલર્ટ્સ & નોટિફિકેશન' : 'Alerts',
          subtitle: language === 'gu' ? 'તાજેતરના મશીન એલર્ટ્સ અને મહત્વપૂર્ણ સૂચનાઓ' : 'Recent machine alerts and critical notifications',
        };
      case 'power-monitoring':
        return {
          title: language === 'gu' ? 'વીજળી & ડીજી વપરાશ' : 'Electricity & DG Power Analytics',
          subtitle: language === 'gu' ? 'કુલ યુનિટ્સ, પાવર ફેક્ટર, ડીજી ડીઝલ લોગ અને કોસ્ટ એનાલિટિક્સ' : 'Real-time kWh, Power Factor, DGVCL grid tariff, and diesel generator run log',
        };
      case 'machine-qr':
        return {
          title: language === 'gu' ? 'મશીન QR & બંડલ બારકોડ' : 'Machine QR & Bundle Barcode Hub',
          subtitle: language === 'gu' ? 'મશીન પ્રિન્ટેબલ QR સ્ટીકર્સ અને ફેબ્રિક જોબવર્ક બંડલ ટ્રેકિંગ ટોકન્સ' : 'Printable floor badges, scanner simulator, and cutting lot tokens',
        };
      case 'operator-khata':
        return {
          title: language === 'gu' ? 'કારીગર હાજરી & ખાતાવહી' : 'Operator Attendance, Khata & Payroll',
          subtitle: language === 'gu' ? 'દૈનિક હાજરી, ટાંકા પ્રોત્સાહન (ઈન્સેન્ટિવ), ઉપાડ લેજર અને પગાર સ્લિપ' : 'Daily biometric register, stitch bonus pool, cash advance khata, and salary slips',
        };
      case 'whatsapp-hub':
        return {
          title: language === 'gu' ? 'વોટ્સએપ એલર્ટ્સ & ઓટોમેશન' : 'WhatsApp Automation & Instant Alerts',
          subtitle: language === 'gu' ? 'પાર્ટી/વેપારી ઓર્ડર અપડેટ, ઓનર શિફ્ટ રિપોર્ટ અને દોરા સપ્લાયર ઓર્ડર' : '1-Click messaging for merchants, daily shift reports for factory owners, and thread supplier restock',
        };
      case 'settings':
        return {
          title: language === 'gu' ? 'સેટિંગ્સ & કન્ફિગરેશન' : 'Settings',
          subtitle: language === 'gu' ? 'ફેક્ટરી પરિમાણો, થ્રેશોલ્ડ અને સૂચના સેટિંગ્સ' : 'Factory configurations, thresholds and notifications',
        };
      default:
        return {
          title: 'Embroidery Track',
          subtitle: 'Factory tracking dashboard',
        };
    }
  };

  const { title, subtitle } = getPageTitle();
  const initials = (currentUser?.name || 'User').split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase();

  return (
    <header className="app-header shrink-0 border-b border-slate-200 bg-white relative z-40">
      <div className="flex min-w-0 items-center gap-2 sm:gap-4 px-3 sm:px-6 py-3">
        <button onClick={onMobileMenuToggle} className="icon-button lg:hidden" aria-label="Open navigation menu" aria-controls="mobile-navigation"><Menu className="size-5" /></button>
        <div className="min-w-0 flex-1">
          <h1 className="text-base sm:text-xl font-semibold tracking-tight text-slate-900 leading-snug break-words">{title}</h1>
          <p className="hidden md:block text-xs text-slate-500 mt-1 truncate">{subtitle}</p>
        </div>
        <div className="flex items-center gap-1 sm:gap-2 shrink-0">
          <button onClick={() => setIsOmniSearchOpen(true)} className="search-trigger icon-button xl:w-72 xl:justify-start xl:px-3 xl:gap-3" aria-label="Search workspace">
            <Search className="size-5" /><span className="hidden xl:inline flex-1 text-left text-sm text-slate-500">{language === 'gu' ? 'મશીન, ઓર્ડર શોધો...' : 'Search machines, orders...'}</span><kbd className="hidden xl:inline rounded-md border border-slate-200 bg-white px-1.5 py-0.5 text-[10px] text-slate-400">⌘K</kbd>
          </button>
          <button onClick={() => { setIsAlertDrawerOpen(true); setProfileOpen(false); }} className="icon-button relative" aria-label="View alerts">
            <Bell className="size-5" />{unreadAlertCount > 0 && <span className="absolute right-1 top-1 min-w-4 h-4 px-1 rounded-full bg-rose-600 text-white text-[9px] flex items-center justify-center ring-2 ring-white">{unreadAlertCount > 99 ? '99+' : unreadAlertCount}</span>}
          </button>
          <div ref={profileRef} className="relative">
            <button ref={profileButtonRef} onClick={() => setProfileOpen(!profileOpen)} aria-label="Profile and preferences" aria-expanded={profileOpen} aria-controls="profile-preferences" className="flex min-h-11 items-center gap-2 rounded-xl p-1.5 hover:bg-slate-100 transition-colors">
              <span className="flex size-8 items-center justify-center rounded-full bg-blue-600 text-white text-xs font-semibold">{initials}</span>
              <span className="hidden 2xl:block text-sm font-medium max-w-24 truncate">{currentUser?.name?.split(' ')[0] || 'User'}</span>
              <ChevronDown className={`hidden sm:block size-3.5 text-slate-400 transition-transform ${profileOpen ? 'rotate-180' : ''}`} />
            </button>
            {profileOpen && <div id="profile-preferences" aria-label="Profile preferences" className="profile-panel absolute right-0 top-full mt-2 w-72 max-w-[calc(100vw-24px)] rounded-2xl border border-slate-200 bg-white shadow-xl p-2 text-sm">
              <div className="p-3 border-b border-slate-100 mb-2">
                <p className="font-semibold text-slate-900 break-words">{currentUser?.name || 'User'}</p>
                <p className="text-xs text-slate-500 mt-1 break-all">{currentUser?.email}</p>
                <span className="inline-block mt-2 rounded bg-slate-100 px-2 py-1 text-[10px] font-semibold uppercase text-slate-600">{currentUser?.role || 'Admin'}</span>
              </div>
              <fieldset className="p-2">
                <legend className="flex items-center gap-2 px-1 text-xs font-semibold text-slate-600"><Languages className="size-4" />{language === 'gu' ? 'ભાષા / Language' : 'Language / ભાષા'}</legend>
                <div className="grid grid-cols-2 gap-2 mt-1">
                  {([{id:'en', label:'English'}, {id:'gu', label:'ગુજરાતી'}] as const).map(option => <button key={option.id} onClick={() => setLanguage(option.id)} aria-pressed={language === option.id} className={`flex min-h-11 items-center justify-center gap-2 rounded-lg border text-sm ${language === option.id ? 'border-blue-200 bg-blue-50 text-blue-700 font-semibold' : 'border-slate-200 text-slate-600 hover:bg-slate-50'}`}>{option.label}{language === option.id && <Check className="size-3.5" />}</button>)}
                </div>
              </fieldset>
              <button onClick={() => { setCurrentRoute('settings'); setProfileOpen(false); }} className="profile-action"><SettingsIcon className="size-4" />{language === 'gu' ? 'સેટિંગ્સ' : 'Settings & preferences'}</button>
              <details className="my-1 border-t border-slate-100 pt-1">
                <summary className="profile-action cursor-pointer"><Activity className="size-4" />{language === 'gu' ? 'ડેમો કંટ્રોલ્સ' : 'Demo controls'}</summary>
                <div className="rounded-lg bg-slate-50 p-1 text-xs">
                  <button className="profile-action" onClick={() => setIsSimulating(prev => !prev)}><Radio className="size-4" />{isSimulating ? 'Pause live simulation' : 'Resume live simulation'}</button>
                  <button className="profile-action" onClick={() => triggerSimulatedEvent('thread_break')}>Trigger thread break</button>
                  <button className="profile-action" onClick={() => triggerSimulatedEvent('machine_start')}>Restart stopped machine</button>
                  <button className="profile-action" onClick={() => triggerSimulatedEvent('speed_boost')}>Speed boost</button>
                </div>
              </details>
              <button onClick={() => { setProfileOpen(false); logout(); }} className="profile-action text-rose-600 hover:bg-rose-50"><LogOut className="size-4" />{language === 'gu' ? 'લોગ આઉટ' : 'Sign out'}</button>
            </div>}
          </div>
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-2 px-3 sm:px-6 py-2 border-t border-slate-100 bg-slate-50/60">
        <label className="header-select flex-1 sm:flex-none"><Building2 className="size-4 shrink-0 text-slate-400" /><select aria-label="Factory" value={selectedFactory.id} onChange={event => { const factory = FACTORIES.find(item => item.id === event.target.value); if (factory) setSelectedFactory(factory); }}>{FACTORIES.map(factory => <option key={factory.id} value={factory.id}>{factory.name.split(' (')[0]}</option>)}</select></label>
        <label className="header-select flex-1 sm:flex-none"><Layers className="size-4 shrink-0 text-slate-400" /><select aria-label="Work shift" value={selectedShift} onChange={event => setSelectedShift(event.target.value)}><option value="Day Shift (06:00 - 18:00)">{language === 'gu' ? 'દિવસ શિફ્ટ' : 'Day Shift'} · 06:00–18:00</option><option value="Night Shift (18:00 - 06:00)">{language === 'gu' ? 'રાત શિફ્ટ' : 'Night Shift'} · 18:00–06:00</option></select></label>
        <span className="hidden sm:flex items-center gap-2 ml-auto text-xs text-slate-500 whitespace-nowrap"><span className={`size-1.5 rounded-full ${isSimulating ? 'bg-emerald-500' : 'bg-slate-400'}`} />{runningCount}/{totalMachines} {language === 'gu' ? 'મશીનો ચાલુ' : 'machines running'}</span>
      </div>
    </header>
  );
};
