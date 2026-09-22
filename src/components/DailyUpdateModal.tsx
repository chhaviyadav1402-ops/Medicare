import React, { useState, useEffect } from 'react';
import {
  X,
  Sparkles,
  Flame,
  Activity,
  Calendar,
  Pill,
  Heart,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Printer,
  ChevronRight,
  Clock,
  ShieldCheck,
  TrendingUp,
  Droplet,
} from 'lucide-react';
import { SmartwatchData } from '../types';

export interface DailyUpdateModalProps {
  isOpen: boolean;
  onClose: () => void;
  patientName: string;
  glucoseSpikeMgDl: number;
  bpReading: string;
  watchData: SmartwatchData;
  criticalRestockNames: string[];
  nextAppointment: string;
  phq9Score: number;
  onOpenEmergencyModal?: () => void;
}

export const DailyUpdateModal: React.FC<DailyUpdateModalProps> = ({
  isOpen,
  onClose,
  patientName = 'Kanika',
  glucoseSpikeMgDl,
  bpReading,
  watchData,
  criticalRestockNames,
  nextAppointment,
  phq9Score,
  onOpenEmergencyModal,
}) => {
  const [briefingText, setBriefingText] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [lastUpdated, setLastUpdated] = useState<string>('');

  const getTimeGreeting = () => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) return 'Good morning';
    if (hour >= 12 && hour < 17) return 'Good afternoon';
    if (hour >= 17 && hour < 21) return 'Good evening';
    return 'Good night';
  };

  const generateLocalBriefing = () => {
    const greeting = getTimeGreeting();
    const urgentRestock =
      criticalRestockNames.length > 0
        ? `Pharmacy restock is urgently needed for ${criticalRestockNames.join(' and ')}.`
        : 'All core medications currently have adequate stock.';

    const glucoseNote =
      glucoseSpikeMgDl > 180
        ? `Continuous glucose telemetry flagged an elevated reading of ${glucoseSpikeMgDl} mg/dL (target is <140 post-prandial). Please prioritize hydration with fresh water and schedule a low-impact 15-minute walk.`
        : `Blood glucose is currently stable at ${glucoseSpikeMgDl} mg/dL.`;

    const activityNote =
      watchData.steps < 3000 || watchData.sedentaryAlert
        ? `Your smartwatch recorded ${watchData.steps.toLocaleString()} steps of your ${watchData.stepGoal.toLocaleString()} step goal. Inactivity was detected over the past 2.5 hours.`
        : `Physical activity is on track with ${watchData.steps.toLocaleString()} steps logged today.`;

    return `${greeting}, ${patientName}. Here is your complete clinical update for today. ${glucoseNote} ${activityNote} ${urgentRestock} Your next clinical follow-up is scheduled with Dr. Sarah Jenkins on ${nextAppointment}. Your emotional wellness and routine care are fully monitored.`;
  };

  const fetchDailyBriefing = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/generate-chuck-briefing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          patientName,
          currentHour: new Date().getHours(),
          glucoseMgDl: glucoseSpikeMgDl,
          bpSystolic: parseInt(bpReading.split('/')[0]) || 138,
          bpDiastolic: parseInt(bpReading.split('/')[1]) || 88,
          steps: watchData.steps,
          stepGoal: watchData.stepGoal,
          restockWarnings: criticalRestockNames,
          missedAppointments: [nextAppointment],
          phq9Score,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.speechScript) {
          setBriefingText(data.speechScript);
          setLastUpdated(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
          return;
        }
      }
    } catch (err) {
      console.warn('Fallback to local briefing:', err);
    } finally {
      setIsLoading(false);
    }

    setBriefingText(generateLocalBriefing());
    setLastUpdated(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
  };

  useEffect(() => {
    if (isOpen) {
      fetchDailyBriefing();
    }
  }, [isOpen, glucoseSpikeMgDl, watchData.steps, criticalRestockNames.length]);

  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div
      id="daily-update-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200"
    >
      <div className="relative w-full max-w-3xl bg-white text-slate-900 rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Top Header Bar */}
        <div className="bg-gradient-to-r from-teal-700 via-teal-800 to-slate-900 text-white px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-teal-200 shadow-inner">
              <Sparkles className="w-6 h-6 text-teal-200" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg sm:text-xl font-bold font-display tracking-tight text-white">
                  Today&apos;s Health Briefing &amp; Daily Update
                </h3>
                <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-teal-500/30 text-teal-100 border border-teal-400/40">
                  LIVE STATUS
                </span>
              </div>
              <p className="text-xs text-teal-100/80 mt-0.5">
                Comprehensive overview for <strong className="text-white">{patientName}</strong> • {new Date().toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white/80 hover:text-white transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 sm:p-7 overflow-y-auto space-y-6 flex-1 bg-slate-50/50">
          {/* Executive Summary Card */}
          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="p-1.5 rounded-lg bg-teal-50 text-teal-700">
                  <Clock className="w-4 h-4" />
                </span>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 font-mono">
                  Executive Daily Clinical Summary
                </h4>
              </div>
              {lastUpdated && (
                <span className="text-[11px] text-slate-400 font-mono">
                  Updated at {lastUpdated}
                </span>
              )}
            </div>

            <p className="text-sm sm:text-base text-slate-700 leading-relaxed font-normal bg-slate-50 p-4 rounded-xl border border-slate-100">
              {isLoading ? (
                <span className="flex items-center gap-2 text-slate-500">
                  <RefreshCw className="w-4 h-4 animate-spin text-teal-600" />
                  Synthesizing your complete daily medical update...
                </span>
              ) : (
                briefingText || generateLocalBriefing()
              )}
            </p>
          </div>

          {/* 4 Telemetry Status Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* 1. Blood Glucose & Cardiovascular */}
            <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col justify-between space-y-3">
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                    <Flame className="w-4 h-4 text-rose-500" />
                    Glycemic &amp; BP Status
                  </span>
                  <span
                    className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                      glucoseSpikeMgDl > 180
                        ? 'bg-rose-100 text-rose-800'
                        : 'bg-emerald-100 text-emerald-800'
                    }`}
                  >
                    {glucoseSpikeMgDl > 180 ? 'Elevated Spike' : 'Normal Range'}
                  </span>
                </div>
                <div className="mt-3 flex items-baseline gap-2">
                  <span className="text-3xl font-black font-display text-slate-900">
                    {glucoseSpikeMgDl}
                  </span>
                  <span className="text-xs font-semibold text-slate-500">mg/dL</span>
                  <span className="text-slate-300 font-light mx-1">|</span>
                  <span className="text-base font-bold text-slate-700">{bpReading}</span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-rose-50/60 border border-rose-100 text-xs text-rose-900 space-y-1">
                <p className="font-semibold flex items-center gap-1">
                  <Droplet className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                  Recommended Action:
                </p>
                <p className="text-[11px] text-rose-800">
                  {glucoseSpikeMgDl > 180
                    ? 'Drink 500ml water to assist kidneys with SGLT2 filtration and take a light 15-minute walk.'
                    : 'Target glycemic control maintained. Continue scheduled carbohydrate spacing.'}
                </p>
              </div>
            </div>

            {/* 2. Physical Activity & Smartwatch Movement */}
            <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col justify-between space-y-3">
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                    <Activity className="w-4 h-4 text-indigo-500" />
                    Smartwatch Activity
                  </span>
                  <span
                    className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                      watchData.sedentaryAlert
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-indigo-100 text-indigo-800'
                    }`}
                  >
                    {watchData.sedentaryAlert ? 'Sedentary Alert' : 'Active'}
                  </span>
                </div>
                <div className="mt-3 flex items-baseline gap-2">
                  <span className="text-3xl font-black font-display text-slate-900">
                    {watchData.steps.toLocaleString()}
                  </span>
                  <span className="text-xs font-semibold text-slate-500">
                    / {watchData.stepGoal.toLocaleString()} steps
                  </span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-indigo-50/60 border border-indigo-100 text-xs text-indigo-900 space-y-1">
                <p className="font-semibold flex items-center gap-1">
                  <TrendingUp className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                  Movement Goal:
                </p>
                <p className="text-[11px] text-indigo-800">
                  {watchData.sedentaryAlert
                    ? 'Inactivity detected. A brief 10-15 minute walk directly reduces insulin resistance and elevates mood.'
                    : `${Math.round((watchData.steps / watchData.stepGoal) * 100)}% of daily step goal achieved. Great steady pacing.`}
                </p>
              </div>
            </div>

            {/* 3. Pharmacy Restock Warnings */}
            <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col justify-between space-y-3">
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                    <Pill className="w-4 h-4 text-purple-500" />
                    Medication Stock Status
                  </span>
                  <span
                    className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                      criticalRestockNames.length > 0
                        ? 'bg-purple-100 text-purple-800'
                        : 'bg-emerald-100 text-emerald-800'
                    }`}
                  >
                    {criticalRestockNames.length > 0
                      ? `${criticalRestockNames.length} Urgent Refill`
                      : 'All Stocked'}
                  </span>
                </div>
                <div className="mt-3">
                  {criticalRestockNames.length > 0 ? (
                    <ul className="space-y-1.5">
                      {criticalRestockNames.map((name, i) => (
                        <li
                          key={i}
                          className="text-xs font-bold text-purple-900 flex items-center gap-1.5"
                        >
                          <AlertTriangle className="w-3.5 h-3.5 text-purple-600 shrink-0" />
                          <span>{name}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-xs font-medium text-emerald-700 flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      All current prescriptions have at least 7+ days supply remaining.
                    </p>
                  )}
                </div>
              </div>

              <div className="p-3 rounded-xl bg-purple-50/60 border border-purple-100 text-xs text-purple-900">
                <p className="text-[11px] text-purple-800">
                  {criticalRestockNames.length > 0
                    ? 'Please contact your pharmacy or physician to approve refills before stock reaches zero.'
                    : 'Remember to take evening doses with your main meal as scheduled.'}
                </p>
              </div>
            </div>

            {/* 4. Upcoming Doctor Appointment & Protocol */}
            <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col justify-between space-y-3">
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                    <Calendar className="w-4 h-4 text-sky-500" />
                    Next Doctor Appointment
                  </span>
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-sky-100 text-sky-800">
                    Apex Clinic
                  </span>
                </div>
                <div className="mt-3">
                  <h5 className="text-sm font-bold text-slate-800">{nextAppointment}</h5>
                  <p className="text-xs text-slate-500 mt-1">
                    Dr. Sarah Jenkins • Endocrinology &amp; Metabolic Care
                  </p>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-sky-50/60 border border-sky-100 text-xs text-sky-900 flex items-center justify-between">
                <span className="text-[11px] text-sky-800">
                  PHQ-9 Depression Protocol: Active (Score: {phq9Score}/27)
                </span>
                {onOpenEmergencyModal && (
                  <button
                    onClick={() => {
                      onClose();
                      onOpenEmergencyModal();
                    }}
                    className="text-[11px] font-bold text-red-600 hover:underline cursor-pointer"
                  >
                    Direct Line &rarr;
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Today's Key Action Items Checklist */}
          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 font-mono flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-teal-600" />
              Prescribed Action Protocol For Today
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs text-slate-700">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-slate-800 block">Maintain Hydration</span>
                  <span className="text-slate-500 text-[11px]">
                    Sip at least 2.5 liters of water to support kidneys with Empagliflozin filtration.
                  </span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-slate-800 block">15-Minute Post-Lunch Walk</span>
                  <span className="text-slate-500 text-[11px]">
                    Gently clears post-prandial glucose spike and elevates serotonin.
                  </span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-slate-800 block">Evening Metformin ER with Dinner</span>
                  <span className="text-slate-500 text-[11px]">
                    Must be taken with food to avoid gastrointestinal upset.
                  </span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-slate-800 block">Pharmacy Refill Request</span>
                  <span className="text-slate-500 text-[11px]">
                    Ensure Duloxetine 60mg prescription is submitted before evening.
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer Controls */}
        <div className="px-6 py-4 bg-white border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              onClick={fetchDailyBriefing}
              disabled={isLoading}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-xs font-semibold text-slate-700 transition-colors cursor-pointer disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-slate-500 ${isLoading ? 'animate-spin' : ''}`} />
              <span>Refresh Update</span>
            </button>

            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-xs font-semibold text-slate-700 transition-colors cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5 text-slate-500" />
              <span>Print / Save Summary</span>
            </button>
          </div>

          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs sm:text-sm transition-colors shadow-xs cursor-pointer"
          >
            Close Daily Update
          </button>
        </div>
      </div>
    </div>
  );
};
