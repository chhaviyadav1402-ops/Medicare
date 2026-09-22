import React, { useState } from 'react';
import {
  Watch,
  Heart,
  Activity,
  Flame,
  Moon,
  Wind,
  Droplet,
  Smartphone,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Zap,
  TrendingUp,
  Sliders,
  BatteryCharging,
} from 'lucide-react';
import { SmartwatchData } from '../types';

interface WatchTelemetryTabProps {
  watchData: SmartwatchData;
  onUpdateWatchData: (updater: (prev: SmartwatchData) => SmartwatchData) => void;
  onOpenJarvisHUD?: () => void;
}

export const WatchTelemetryTab: React.FC<WatchTelemetryTabProps> = ({
  watchData,
  onUpdateWatchData,
  onOpenJarvisHUD,
}) => {
  const [isPairing, setIsPairing] = useState<boolean>(false);
  const [selectedDeviceType, setSelectedDeviceType] = useState<string>('Apple Watch Ultra 2');

  const supportedDevices = [
    'Apple Watch Ultra / Series',
    'Samsung Galaxy Watch 6 / 7',
    'Garmin Venu 3 / Forerunner',
    'Fitbit Sense 2 / Charge 6',
    'Google Pixel Watch 2',
  ];

  const handleTogglePair = () => {
    if (watchData.connected) {
      onUpdateWatchData((prev) => ({
        ...prev,
        connected: false,
      }));
    } else {
      setIsPairing(true);
      setTimeout(() => {
        setIsPairing(false);
        onUpdateWatchData((prev) => ({
          ...prev,
          connected: true,
          deviceName: selectedDeviceType,
          batteryLevel: 91,
          lastSync: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        }));
      }, 1200);
    }
  };

  // Preset biometric simulations
  const handleSimulateState = (type: 'NORMAL' | 'SPIKE' | 'SEDENTARY' | 'POST_WALK') => {
    onUpdateWatchData((prev) => {
      if (type === 'NORMAL') {
        return {
          ...prev,
          heartRate: 72,
          cgmGlucoseMgDl: 124,
          glucoseTrend: 'STABLE',
          steps: 4200,
          sedentaryAlert: false,
          sedentaryMinutes: 45,
          spO2: 98,
        };
      }
      if (type === 'SPIKE') {
        return {
          ...prev,
          heartRate: 98,
          cgmGlucoseMgDl: 218,
          glucoseTrend: 'SPIKING',
          sedentaryAlert: true,
          sedentaryMinutes: 180,
        };
      }
      if (type === 'SEDENTARY') {
        return {
          ...prev,
          steps: 1250,
          sedentaryAlert: true,
          sedentaryMinutes: 210,
          cgmGlucoseMgDl: 178,
          glucoseTrend: 'RISING',
        };
      }
      // POST_WALK
      return {
        ...prev,
        steps: 5400,
        heartRate: 84,
        cgmGlucoseMgDl: 135,
        glucoseTrend: 'FALLING',
        sedentaryAlert: false,
        sedentaryMinutes: 10,
        activeCalories: 280,
      };
    });
  };

  return (
    <div id="watch-telemetry-tab" className="space-y-6">
      {/* Top Banner & Device Pairing Card */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-3xl p-6 border border-indigo-500/30 shadow-xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="flex items-start sm:items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-indigo-500/20 border border-indigo-400/30 flex items-center justify-center text-indigo-300 shadow-inner shrink-0">
              <Watch className="w-8 h-8" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white font-display">
                  Smartwatch Biometric Stream
                </h2>
                {watchData.connected ? (
                  <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Paired & Live
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-0.5 rounded-full bg-slate-700 text-slate-300">
                    Disconnected
                  </span>
                )}
              </div>
              <p className="text-xs sm:text-sm text-slate-300 mt-1">
                Continuous real-time tracking of Steps, Heart Rate, Glucose CGM, and Sedentary Alerts for diabetic circulation.
              </p>
            </div>
          </div>

          {/* Pairing Controls */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2 bg-slate-800/80 px-3 py-1.5 rounded-xl border border-slate-700 text-xs">
              <BatteryCharging className="w-4 h-4 text-emerald-400" />
              <span className="font-mono text-slate-200">{watchData.batteryLevel}% Battery</span>
            </div>

            <button
              id="pair-watch-btn"
              onClick={handleTogglePair}
              disabled={isPairing}
              className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm shadow-md transition-all active:scale-95 ${
                watchData.connected
                  ? 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-600'
                  : 'bg-indigo-600 hover:bg-indigo-500 text-white'
              }`}
            >
              <RefreshCw className={`w-4 h-4 ${isPairing ? 'animate-spin' : ''}`} />
              <span>
                {isPairing ? 'Scanning Bluetooth...' : watchData.connected ? 'Disconnect Watch' : 'Attach Smartwatch'}
              </span>
            </button>
          </div>
        </div>

        {/* Device selection row */}
        {!watchData.connected && (
          <div className="mt-4 pt-4 border-t border-slate-800 flex flex-wrap items-center gap-2 text-xs">
            <span className="text-slate-400">Select your device model:</span>
            {supportedDevices.map((dev) => (
              <button
                key={dev}
                onClick={() => setSelectedDeviceType(dev)}
                className={`px-2.5 py-1 rounded-lg border transition-colors ${
                  selectedDeviceType === dev
                    ? 'bg-indigo-500/20 border-indigo-400 text-indigo-200 font-semibold'
                    : 'bg-slate-800/60 border-slate-700 text-slate-400 hover:text-white'
                }`}
              >
                {dev}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Live Telemetry KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* 1. HEART RATE */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Heart Rate</span>
            <div className="p-2 rounded-xl bg-rose-50 text-rose-600">
              <Heart className="w-5 h-5 animate-pulse" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl sm:text-4xl font-black text-slate-900 font-display">
              {watchData.heartRate}
            </span>
            <span className="text-xs font-semibold text-slate-500">BPM</span>
          </div>

          <div className="mt-2 text-xs text-slate-600 flex items-center justify-between">
            <span>Resting: {watchData.restingHeartRate} bpm</span>
            {watchData.heartRate > 95 ? (
              <span className="text-rose-600 font-bold">Elevated (Stress/Spike)</span>
            ) : (
              <span className="text-emerald-600 font-semibold">Normal Rhythm</span>
            )}
          </div>

          {/* Simple visual pulse bar */}
          <div className="w-full bg-slate-100 h-1.5 rounded-full mt-3 overflow-hidden">
            <div
              className="bg-rose-500 h-full rounded-full transition-all duration-500"
              style={{ width: `${Math.min(100, (watchData.heartRate / 140) * 100)}%` }}
            />
          </div>
        </div>

        {/* 2. STEPS & SEDENTARY INACTIVITY ALERT */}
        <div
          className={`rounded-2xl p-5 border shadow-xs relative overflow-hidden transition-colors ${
            watchData.sedentaryAlert
              ? 'bg-amber-50/70 border-amber-300'
              : 'bg-white border-slate-200'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Daily Steps (Circulation)
            </span>
            <div
              className={`p-2 rounded-xl ${
                watchData.sedentaryAlert ? 'bg-amber-100 text-amber-700' : 'bg-teal-50 text-teal-600'
              }`}
            >
              <Activity className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl sm:text-4xl font-black text-slate-900 font-display">
              {watchData.steps.toLocaleString()}
            </span>
            <span className="text-xs font-semibold text-slate-500">/ {watchData.stepGoal.toLocaleString()}</span>
          </div>

          <div className="mt-2 text-xs">
            {watchData.sedentaryAlert ? (
              <span className="text-amber-800 font-bold flex items-center gap-1">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                Sedentary Warning: Inactive {watchData.sedentaryMinutes}m! Walk 15m.
              </span>
            ) : (
              <span className="text-emerald-700 font-medium">
                {Math.round((watchData.steps / watchData.stepGoal) * 100)}% of circulation goal
              </span>
            )}
          </div>

          <div className="w-full bg-slate-100 h-1.5 rounded-full mt-3 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                watchData.sedentaryAlert ? 'bg-amber-500' : 'bg-teal-500'
              }`}
              style={{ width: `${Math.min(100, (watchData.steps / watchData.stepGoal) * 100)}%` }}
            />
          </div>
        </div>

        {/* 3. CONTINUOUS GLUCOSE MONITOR (CGM) */}
        <div
          className={`rounded-2xl p-5 border shadow-xs relative overflow-hidden transition-colors ${
            watchData.cgmGlucoseMgDl > 180
              ? 'bg-rose-50/80 border-rose-300'
              : 'bg-white border-slate-200'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Paired CGM Glucose
            </span>
            <div
              className={`p-2 rounded-xl ${
                watchData.cgmGlucoseMgDl > 180 ? 'bg-rose-100 text-rose-700' : 'bg-blue-50 text-blue-600'
              }`}
            >
              <Droplet className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span
              className={`text-3xl sm:text-4xl font-black font-display ${
                watchData.cgmGlucoseMgDl > 180 ? 'text-rose-700' : 'text-slate-900'
              }`}
            >
              {watchData.cgmGlucoseMgDl}
            </span>
            <span className="text-xs font-semibold text-slate-500">mg/dL</span>
          </div>

          <div className="mt-2 text-xs flex items-center justify-between">
            <span className="font-semibold text-slate-700">Trend: {watchData.glucoseTrend}</span>
            {watchData.cgmGlucoseMgDl > 180 ? (
              <span className="text-rose-700 font-bold flex items-center gap-0.5">
                <TrendingUp className="w-3.5 h-3.5" /> High Spike
              </span>
            ) : (
              <span className="text-emerald-600 font-semibold">Target Range</span>
            )}
          </div>

          <div className="w-full bg-slate-100 h-1.5 rounded-full mt-3 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                watchData.cgmGlucoseMgDl > 180 ? 'bg-rose-600' : 'bg-blue-500'
              }`}
              style={{
                width: `${Math.min(100, ((watchData.cgmGlucoseMgDl - 70) / 180) * 100)}%`,
              }}
            />
          </div>
        </div>

        {/* 4. SLEEP & RECOVERY (DEPRESSION PATTERN) */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Sleep & Recovery
            </span>
            <div className="p-2 rounded-xl bg-purple-50 text-purple-600">
              <Moon className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl sm:text-4xl font-black text-slate-900 font-display">
              {watchData.sleepHours}
            </span>
            <span className="text-xs font-semibold text-slate-500">Hours</span>
          </div>

          <div className="mt-2 text-xs text-purple-900 font-medium truncate">
            {watchData.sleepQuality}
          </div>

          <div className="mt-3 text-[11px] text-slate-500 flex items-center justify-between border-t border-slate-100 pt-2">
            <span>SpO2: {watchData.spO2}%</span>
            <span>Burned: {watchData.activeCalories} kcal</span>
          </div>
        </div>
      </div>

      {/* Interactive Telemetry Simulator & Action Console */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 border border-slate-800 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <Sliders className="w-5 h-5 text-indigo-400" />
              <h3 className="text-base sm:text-lg font-bold text-white">
                Biometric Simulator & State Tester
              </h3>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Simulate real-time events to see how live telemetry and clinical reports respond.
            </p>
          </div>

          {onOpenJarvisHUD && (
            <button
              onClick={onOpenJarvisHUD}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs transition-colors shrink-0 cursor-pointer"
            >
              <Zap className="w-4 h-4 text-slate-950" />
              <span>View Daily Health Briefing</span>
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 mt-4">
          <button
            id="sim-normal-btn"
            onClick={() => handleSimulateState('NORMAL')}
            className="p-3.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-left border border-slate-700 transition-colors"
          >
            <div className="flex items-center justify-between mb-1">
              <span className="font-bold text-xs text-emerald-300">1. Normal Stable</span>
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            </div>
            <p className="text-[11px] text-slate-400">
              Glucose 124 mg/dL, HR 72 bpm, 4,200 steps. No alerts.
            </p>
          </button>

          <button
            id="sim-spike-btn"
            onClick={() => handleSimulateState('SPIKE')}
            className="p-3.5 rounded-2xl bg-rose-950/40 hover:bg-rose-950/70 text-left border border-rose-600/40 transition-colors"
          >
            <div className="flex items-center justify-between mb-1">
              <span className="font-bold text-xs text-rose-300">2. Sudden Sugar Spike</span>
              <AlertTriangle className="w-4 h-4 text-rose-400" />
            </div>
            <p className="text-[11px] text-rose-200/80">
              Glucose spikes to 218 mg/dL, HR 98. Triggers Jarvis emergency alert.
            </p>
          </button>

          <button
            id="sim-sedentary-btn"
            onClick={() => handleSimulateState('SEDENTARY')}
            className="p-3.5 rounded-2xl bg-amber-950/40 hover:bg-amber-950/70 text-left border border-amber-600/40 transition-colors"
          >
            <div className="flex items-center justify-between mb-1">
              <span className="font-bold text-xs text-amber-300">3. Not Working Out</span>
              <Activity className="w-4 h-4 text-amber-400" />
            </div>
            <p className="text-[11px] text-amber-200/80">
              Only 1,250 steps, sedentary 3.5 hrs. Inactivity alarm.
            </p>
          </button>

          <button
            id="sim-postwalk-btn"
            onClick={() => handleSimulateState('POST_WALK')}
            className="p-3.5 rounded-2xl bg-teal-950/40 hover:bg-teal-950/70 text-left border border-teal-600/40 transition-colors"
          >
            <div className="flex items-center justify-between mb-1">
              <span className="font-bold text-xs text-teal-300">4. Post-Meal Walk</span>
              <TrendingUp className="w-4 h-4 text-teal-400" />
            </div>
            <p className="text-[11px] text-teal-200/80">
              Steps jump to 5,400. Glucose drops to 135 mg/dL.
            </p>
          </button>
        </div>
      </div>
    </div>
  );
};
