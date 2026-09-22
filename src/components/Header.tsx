import React from 'react';
import {
  Heart,
  PhoneCall,
  AlertCircle,
  ShieldAlert,
  CheckCircle2,
  Sparkles,
  Watch,
} from 'lucide-react';
import { EmergencyContact } from '../types';

interface HeaderProps {
  primaryDoctor?: EmergencyContact;
  patientName: string;
  onOpenEmergencyModal: () => void;
  criticalRestocksCount: number;
  onOpenDailyUpdate?: () => void;
  onOpenJarvisHUD?: () => void;
  onTriggerChuckVoice?: () => void;
  isJarvisSpeaking?: boolean;
  onStopSpeaking?: () => void;
  allergies: string[];
  watchConnected?: boolean;
  onSelectWatchTab?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  primaryDoctor,
  patientName,
  onOpenEmergencyModal,
  criticalRestocksCount,
  onOpenDailyUpdate,
  onOpenJarvisHUD,
  allergies,
  watchConnected,
  onSelectWatchTab,
}) => {
  const handleOpenDailyUpdate = onOpenDailyUpdate || onOpenJarvisHUD;

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-xs">
      {/* Top Banner for Critical Restocks or Allergies */}
      {(criticalRestocksCount > 0 || (allergies && allergies.length > 0)) && (
        <div className="bg-gradient-to-r from-amber-500/10 via-rose-500/10 to-amber-500/10 border-b border-amber-200/60 px-4 py-1.5 text-xs text-slate-700 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            {criticalRestocksCount > 0 && (
              <span className="inline-flex items-center gap-1 font-bold text-rose-700 bg-rose-100 px-2 py-0.5 rounded-md">
                <AlertCircle className="w-3.5 h-3.5" />
                {criticalRestocksCount} medicine{criticalRestocksCount > 1 ? 's' : ''} running low (restock required)
              </span>
            )}
            {allergies && allergies.length > 0 && (
              <span className="inline-flex items-center gap-1 font-semibold text-amber-800 bg-amber-100/80 px-2 py-0.5 rounded-md">
                <ShieldAlert className="w-3.5 h-3.5 text-amber-600" />
                Allergy Notice: {allergies.join(', ')}
              </span>
            )}
          </div>
          <div className="text-slate-500 hidden sm:block">
            Doctor emergency support is always 1-tap away.
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between gap-4">
        {/* Logo and Brand */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-teal-600 flex items-center justify-center text-white shadow-md shadow-teal-600/20 shrink-0">
            <Heart className="w-6 h-6 fill-white/20" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 font-display">
                MediCare Routine
              </h1>
              <span className="hidden md:inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-teal-100 text-teal-800">
                <CheckCircle2 className="w-3 h-3 text-teal-600" />
                Diabetic & Mood Care Plan Active
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium">
              Medical History, Daily Care Routine, Smartwatch &amp; Health Briefing
            </p>
          </div>
        </div>

        {/* Right side accessibility & emergency actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Smartwatch Quick Indicator */}
          {onSelectWatchTab && (
            <button
              onClick={onSelectWatchTab}
              className={`hidden sm:inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border transition-all ${
                watchConnected
                  ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
                  : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-600'
              }`}
              title="View Smartwatch Telemetry & Inactivity stream"
            >
              <Watch className="w-4 h-4 text-emerald-600" />
              <span>{watchConnected ? 'Watch Paired' : 'Attach Watch'}</span>
            </button>
          )}

          {/* Daily Health Update Button */}
          {handleOpenDailyUpdate && (
            <button
              id="header-daily-update-btn"
              onClick={handleOpenDailyUpdate}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold border transition-all shadow-xs bg-gradient-to-r from-teal-700 to-slate-800 hover:from-teal-600 hover:to-slate-700 text-white border-teal-600/40 active:scale-95 cursor-pointer"
              title="Click to view today's complete health briefing and clinical updates"
            >
              <Sparkles className="w-4 h-4 text-teal-300" />
              <span className="hidden sm:inline">Daily Update</span>
              <span className="sm:hidden">Update</span>
            </button>
          )}

          {/* EMERGENCY DOCTOR CALL BUTTON */}
          <button
            id="header-emergency-call-btn"
            onClick={onOpenEmergencyModal}
            className="inline-flex items-center gap-2 px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs sm:text-sm shadow-md shadow-red-600/20 active:scale-95 transition-all cursor-pointer"
            title="In any emergency or messy condition, call your doctor with real-time call timer"
          >
            <PhoneCall className="w-4 h-4 animate-bounce" />
            <span>Call Doctor</span>
            <span className="hidden lg:inline text-red-100 text-xs font-normal">
              ({primaryDoctor?.doctorName.split(',')[0] || 'Dr. Jenkins'})
            </span>
          </button>
        </div>
      </div>
    </header>
  );
};
