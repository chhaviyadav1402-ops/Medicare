import React, { useState, useEffect } from 'react';
import {
  Sun,
  Sunset,
  Moon,
  Sparkles,
  Camera,
  Heart,
  Activity,
  Droplet,
  AlertTriangle,
  Clock,
  Volume2,
  Calendar,
  CheckCircle2,
  TrendingUp,
  ShieldAlert,
} from 'lucide-react';
import { SmartwatchData } from '../types';

export type TimeOfDayPhase = 'DAWN' | 'MIDDAY' | 'TWILIGHT' | 'NIGHT';

interface CinematicHeroBannerProps {
  patientName: string;
  glucoseSpikeMgDl: number;
  bpReading: string;
  watchData: SmartwatchData;
  criticalRestockCount: number;
  onOpenDailyUpdate?: () => void;
  onOpenJarvisHUD?: () => void;
  onTriggerChuckVoice?: () => void;
  onOpenMealCamera: () => void;
  isJarvisSpeaking?: boolean;
}

export const CinematicHeroBanner: React.FC<CinematicHeroBannerProps> = ({
  patientName,
  glucoseSpikeMgDl,
  bpReading,
  watchData,
  criticalRestockCount,
  onOpenDailyUpdate,
  onOpenJarvisHUD,
  onOpenMealCamera,
}) => {
  const [selectedPhase, setSelectedPhase] = useState<TimeOfDayPhase>('DAWN');
  const [currentTimeStr, setCurrentTimeStr] = useState<string>('');

  const handleOpenUpdate = onOpenDailyUpdate || onOpenJarvisHUD;

  // Auto-detect phase based on client local time
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const hour = now.getHours();
      setCurrentTimeStr(
        now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      );

      if (hour >= 5 && hour < 11) {
        setSelectedPhase('DAWN');
      } else if (hour >= 11 && hour < 17) {
        setSelectedPhase('MIDDAY');
      } else if (hour >= 17 && hour < 21) {
        setSelectedPhase('TWILIGHT');
      } else {
        setSelectedPhase('NIGHT');
      }
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const getPhaseStyles = (phase: TimeOfDayPhase) => {
    switch (phase) {
      case 'DAWN':
        return {
          bg: 'from-amber-950 via-slate-900 to-indigo-950',
          border: 'border-amber-500/40',
          badge: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
          tag: 'Dawn Phase • Morning Protocol Active',
          accent: 'text-amber-400',
          desc: 'Morning Metformin with breakfast, fasting glucose calibration, and gentle 15-min sunlight walk.',
        };
      case 'MIDDAY':
        return {
          bg: 'from-slate-900 via-teal-950 to-slate-900',
          border: 'border-teal-500/40',
          badge: 'bg-teal-500/20 text-teal-300 border-teal-500/40',
          tag: 'Midday Phase • Post-Prandial Glycemic Watch',
          accent: 'text-teal-400',
          desc: 'Afternoon hydration goal (1.5L), sedentary circulation break, and post-lunch carb surveillance.',
        };
      case 'TWILIGHT':
        return {
          bg: 'from-slate-900 via-violet-950 to-indigo-950',
          border: 'border-violet-500/40',
          badge: 'bg-violet-500/20 text-violet-300 border-violet-500/40',
          tag: 'Twilight Phase • Evening Wind-Down & Low Carb Plate',
          accent: 'text-violet-400',
          desc: 'Light low-GI dinner (<30g net carbs), emotional destress pause, and evening Metformin dose.',
        };
      case 'NIGHT':
        return {
          bg: 'from-slate-950 via-indigo-950 to-slate-900',
          border: 'border-indigo-500/40',
          badge: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40',
          tag: 'Night Phase • Bedtime Statin & Recovery Stream',
          accent: 'text-indigo-400',
          desc: 'Atorvastatin 20mg at 10 PM (no grapefruit), nocturnal CGM spike alerts, and deep restorative sleep.',
        };
    }
  };

  const currentTheme = getPhaseStyles(selectedPhase);

  return (
    <div
      id="cinematic-hero-banner"
      className={`bg-gradient-to-r ${currentTheme.bg} rounded-3xl border ${currentTheme.border} p-6 sm:p-8 text-white shadow-2xl relative overflow-hidden transition-all duration-700`}
    >
      {/* Background ambient glow circles */}
      <div className="absolute top-0 right-0 -mt-10 -mr-10 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top Bar: Time Phase Switcher & Live Clock */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-4 relative z-10">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 bg-black/40 p-1 rounded-2xl border border-white/10 backdrop-blur-md">
            <button
              onClick={() => setSelectedPhase('DAWN')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                selectedPhase === 'DAWN'
                  ? 'bg-amber-500 text-white shadow-md shadow-amber-500/30'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <Sun className="w-3.5 h-3.5" />
              <span>Dawn</span>
            </button>
            <button
              onClick={() => setSelectedPhase('MIDDAY')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                selectedPhase === 'MIDDAY'
                  ? 'bg-teal-500 text-white shadow-md shadow-teal-500/30'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <Sun className="w-3.5 h-3.5" />
              <span>Midday</span>
            </button>
            <button
              onClick={() => setSelectedPhase('TWILIGHT')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                selectedPhase === 'TWILIGHT'
                  ? 'bg-violet-600 text-white shadow-md shadow-violet-600/30'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <Sunset className="w-3.5 h-3.5" />
              <span>Twilight</span>
            </button>
            <button
              onClick={() => setSelectedPhase('NIGHT')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                selectedPhase === 'NIGHT'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <Moon className="w-3.5 h-3.5" />
              <span>Night</span>
            </button>
          </div>

          <span
            className={`hidden sm:inline-flex items-center gap-1 text-xs font-bold px-3 py-1 rounded-full border ${currentTheme.badge}`}
          >
            {currentTheme.tag}
          </span>
        </div>

        {/* Live Clock readout */}
        <div className="flex items-center gap-2 font-mono text-xs text-slate-300 bg-black/30 px-3 py-1.5 rounded-xl border border-white/10">
          <Clock className="w-3.5 h-3.5 text-teal-400" />
          <span>Local Clock: {currentTimeStr}</span>
        </div>
      </div>

      {/* Main Greeting & Status Section */}
      <div className="mt-6 flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
        <div className="space-y-2 max-w-2xl">
          <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-teal-300">
            <span className="w-2 h-2 rounded-full bg-teal-400 animate-ping" />
            <span>Diabetic &amp; Mood Routine Stream</span>
          </div>

          <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight font-display text-white">
            Hello, {patientName || 'Kanika'}
          </h2>

          <p className="text-sm sm:text-base text-slate-200 leading-relaxed font-normal">
            {currentTheme.desc}
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-3 shrink-0">
          {handleOpenUpdate && (
            <button
              id="hero-daily-briefing-btn"
              onClick={handleOpenUpdate}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs sm:text-sm shadow-lg shadow-teal-500/25 active:scale-95 transition-all cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-slate-950" />
              <span>Today&apos;s Full Update</span>
            </button>
          )}

          <button
            id="hero-meal-camera-btn"
            onClick={onOpenMealCamera}
            className="inline-flex items-center gap-2 px-4 py-3 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-semibold text-xs sm:text-sm backdrop-blur-md active:scale-95 transition-all cursor-pointer"
          >
            <Camera className="w-4 h-4 text-teal-300" />
            <span>Snap Meal Photo</span>
          </button>
        </div>
      </div>

      {/* Bottom KPI Ticker Strip */}
      <div className="mt-8 pt-6 border-t border-white/10 grid grid-cols-2 sm:grid-cols-4 gap-4 relative z-10">
        {/* CGM Glucose */}
        <div className="bg-black/30 rounded-2xl p-3.5 border border-white/10 backdrop-blur-sm">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>CGM Glucose</span>
            <Droplet className="w-3.5 h-3.5 text-blue-400" />
          </div>
          <div className="mt-1 flex items-baseline gap-1.5">
            <span
              className={`text-xl sm:text-2xl font-black font-display ${
                watchData.cgmGlucoseMgDl > 180 ? 'text-rose-400' : 'text-white'
              }`}
            >
              {watchData.cgmGlucoseMgDl}
            </span>
            <span className="text-xs text-slate-400 font-mono">mg/dL</span>
          </div>
          <div className="text-[11px] text-slate-300 mt-0.5 truncate">
            Trend: {watchData.glucoseTrend}
          </div>
        </div>

        {/* Blood Pressure */}
        <div className="bg-black/30 rounded-2xl p-3.5 border border-white/10 backdrop-blur-sm">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Blood Pressure</span>
            <Heart className="w-3.5 h-3.5 text-rose-400" />
          </div>
          <div className="mt-1 text-xl sm:text-2xl font-black font-display text-white">
            {bpReading}
          </div>
          <div className="text-[11px] text-emerald-400 mt-0.5 truncate">
            Controlled on Protocol
          </div>
        </div>

        {/* Smartwatch Steps */}
        <div className="bg-black/30 rounded-2xl p-3.5 border border-white/10 backdrop-blur-sm">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Daily Steps</span>
            <Activity className="w-3.5 h-3.5 text-emerald-400" />
          </div>
          <div className="mt-1 text-xl sm:text-2xl font-black font-display text-white">
            {watchData.steps.toLocaleString()}
          </div>
          <div className="text-[11px] text-slate-300 mt-0.5 truncate">
            {watchData.sedentaryAlert ? (
              <span className="text-amber-400 font-semibold">Sedentary Alert</span>
            ) : (
              `${watchData.activeCalories} kcal burned`
            )}
          </div>
        </div>

        {/* Refills & Alarms */}
        <div className="bg-black/30 rounded-2xl p-3.5 border border-white/10 backdrop-blur-sm">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Refills / Restock</span>
            <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
          </div>
          <div className="mt-1 flex items-baseline gap-1.5">
            <span
              className={`text-xl sm:text-2xl font-black font-display ${
                criticalRestockCount > 0 ? 'text-amber-400' : 'text-white'
              }`}
            >
              {criticalRestockCount}
            </span>
            <span className="text-xs text-slate-400">Low stock</span>
          </div>
          <div className="text-[11px] text-slate-300 mt-0.5 truncate">
            Metformin &amp; Glimepiride
          </div>
        </div>
      </div>
    </div>
  );
};
