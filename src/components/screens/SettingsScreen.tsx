import React, { useState } from 'react';
import {
  Save,
  Bell,
  Sliders,
  Database,
  RefreshCw,
  Zap,
} from 'lucide-react';
import { FACTORIES } from '../../data/mockData';
import { useApp } from '../../context/AppContext';

export const SettingsScreen: React.FC = () => {
  const { isSimulating, setIsSimulating, selectedFactory, setSelectedFactory } = useApp();

  const [alertSound, setAlertSound] = useState(true);
  const [speedThreshold, setSpeedThreshold] = useState(600);
  const [tempThreshold, setTempThreshold] = useState(48);
  const [targetStitchesShift, setTargetStitchesShift] = useState(65000);
  const [isSaved, setIsSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <div className="max-w-4xl space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl border border-slate-200/90 p-4 shadow-xs flex items-center justify-between">
        <div>
          <h2 className="text-base font-bold text-slate-900 tracking-tight">
            System & Factory Settings
          </h2>
          <p className="text-xs text-slate-500 font-medium">
            Configure telemetry polling rates, safety alarm limits, and plant preferences
          </p>
        </div>
        {isSaved && (
          <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200">
            Settings Saved Successfully!
          </span>
        )}
      </div>

      <form onSubmit={handleSave} className="space-y-5 text-xs">
        {/* Plant Floor & Simulation Settings */}
        <div className="bg-white rounded-xl border border-slate-200/90 p-5 shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <Zap className="w-4 h-4 text-blue-600" />
            <h3 className="text-sm font-bold text-slate-900">
              Telemetry & Simulation Engine
            </h3>
          </div>

          <div className="flex items-center justify-between py-2">
            <div>
              <span className="font-bold text-slate-800 text-xs block">
                Live IoT Telemetry Loop
              </span>
              <p className="text-slate-500 text-[11px]">
                Simulate real-time stitch count increments and speed variances every 2.5s
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={isSimulating}
                onChange={(e) => setIsSimulating(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-200 peer-focus:outline-hidden rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600" />
            </label>
          </div>

          <div className="py-2 border-t border-slate-100">
            <label className="font-bold text-slate-800 text-xs block mb-1">
              Active Factory Unit
            </label>
            <select
              value={selectedFactory?.id || 'f1'}
              onChange={(e) => {
                const found = FACTORIES.find((f) => f.id === e.target.value);
                if (found) setSelectedFactory(found);
              }}
              className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg w-full max-w-sm font-medium"
            >
              {FACTORIES.map((f) => (
                <option key={f.id} value={f.id}>
                  {f.name} — {f.location}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Safety & Thresholds */}
        <div className="bg-white rounded-xl border border-slate-200/90 p-5 shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <Sliders className="w-4 h-4 text-amber-600" />
            <h3 className="text-sm font-bold text-slate-900">
              Alarm Thresholds & Shift Quotas
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">
                Minimum Operational Speed (SPM Alert)
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={speedThreshold}
                  onChange={(e) => setSpeedThreshold(Number(e.target.value))}
                  className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg w-full font-mono font-semibold"
                />
                <span className="text-slate-400 font-medium">SPM</span>
              </div>
              <span className="text-[10px] text-slate-400 mt-1 block">
                Triggers warning if machine runs below this speed for &gt; 5 mins
              </span>
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">
                Head Thermal Cutoff Limit (°C)
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={tempThreshold}
                  onChange={(e) => setTempThreshold(Number(e.target.value))}
                  className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg w-full font-mono font-semibold"
                />
                <span className="text-slate-400 font-medium">°C</span>
              </div>
              <span className="text-[10px] text-slate-400 mt-1 block">
                Triggers critical alarm and emergency stop alert
              </span>
            </div>

            <div className="sm:col-span-2">
              <label className="font-semibold text-slate-700 block mb-1">
                Target Stitch Quota per Machine per 8hr Shift
              </label>
              <input
                type="number"
                step="1000"
                value={targetStitchesShift}
                onChange={(e) => setTargetStitchesShift(Number(e.target.value))}
                className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg w-full max-w-sm font-mono font-semibold"
              />
            </div>
          </div>
        </div>

        {/* Audio & Notification Preferences */}
        <div className="bg-white rounded-xl border border-slate-200/90 p-5 shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <Bell className="w-4 h-4 text-emerald-600" />
            <h3 className="text-sm font-bold text-slate-900">
              Notification Preferences
            </h3>
          </div>

          <div className="flex items-center justify-between py-2">
            <div>
              <span className="font-bold text-slate-800 text-xs block">
                Audible Floor Chime on Thread Breakage
              </span>
              <p className="text-slate-500 text-[11px]">
                Plays sound alerts when machine halts unexpectedly
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={alertSound}
                onChange={(e) => setAlertSound(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-200 peer-focus:outline-hidden rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600" />
            </label>
          </div>
        </div>

        {/* Save button */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold flex items-center gap-2 shadow-xs transition-colors cursor-pointer text-xs"
          >
            <Save className="w-4 h-4" />
            <span>Save Configuration</span>
          </button>
        </div>
      </form>
    </div>
  );
};
