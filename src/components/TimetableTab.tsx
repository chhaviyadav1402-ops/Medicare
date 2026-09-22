import React from 'react';
import {
  Clock,
  CheckCircle2,
  Circle,
  Sun,
  SunMedium,
  Sunset,
  Moon,
  Utensils,
  AlertCircle,
  Pill,
  Volume2,
  Calendar,
  Sparkles,
  PhoneCall,
  Check,
} from 'lucide-react';
import { DailyScheduleSlot, TimeSlot } from '../types';

interface TimetableTabProps {
  schedule: DailyScheduleSlot[];
  onToggleMedication: (slot: TimeSlot, medId: string) => void;
  onSpeakText: (text: string) => void;
  onOpenEmergencyModal: () => void;
  lastAnalyzed?: string;
}

export const TimetableTab: React.FC<TimetableTabProps> = ({
  schedule,
  onToggleMedication,
  onSpeakText,
  onOpenEmergencyModal,
  lastAnalyzed,
}) => {
  // Calculate total doses and completed doses
  let totalMeds = 0;
  let takenMeds = 0;

  schedule.forEach((slot) => {
    slot.medications.forEach((m) => {
      totalMeds++;
      if (m.taken) takenMeds++;
    });
  });

  const completionPercent = totalMeds > 0 ? Math.round((takenMeds / totalMeds) * 100) : 0;

  const getSlotIcon = (slot: TimeSlot) => {
    switch (slot) {
      case 'MORNING':
        return <Sun className="w-5 h-5 text-amber-500" />;
      case 'AFTERNOON':
        return <SunMedium className="w-5 h-5 text-orange-500" />;
      case 'EVENING':
        return <Sunset className="w-5 h-5 text-indigo-500" />;
      case 'BEDTIME':
        return <Moon className="w-5 h-5 text-blue-500" />;
      default:
        return <Clock className="w-5 h-5 text-slate-500" />;
    }
  };

  const getSlotColorClasses = (slot: TimeSlot) => {
    switch (slot) {
      case 'MORNING':
        return 'border-amber-200 bg-amber-50/40 text-amber-900';
      case 'AFTERNOON':
        return 'border-orange-200 bg-orange-50/40 text-orange-900';
      case 'EVENING':
        return 'border-indigo-200 bg-indigo-50/40 text-indigo-900';
      case 'BEDTIME':
        return 'border-blue-200 bg-blue-50/40 text-blue-900';
      default:
        return 'border-slate-200 bg-slate-50 text-slate-900';
    }
  };

  const handleSpeakSlot = (slotItem: DailyScheduleSlot) => {
    const medsText = slotItem.medications
      .map(
        (m) =>
          `${m.name}, dosage ${m.dosage}, ${m.relationToMeal}, condition treated: ${m.conditionTreated}. Instructions: ${m.instructions}`
      )
      .join('. ');

    const dietText = slotItem.eatingGuidelines.join('. ');
    const fullSpeech = `${slotItem.label}, between ${slotItem.timeRange}. Eating habits: ${dietText}. Medications to take: ${medsText}`;
    onSpeakText(fullSpeech);
  };

  const formattedToday = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <div id="timetable-tab" className="space-y-6">
      {/* Today's Overview & Progress Card */}
      <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-teal-700">
              <Calendar className="w-4 h-4" />
              <span>{formattedToday}</span>
              <span className="text-slate-400">•</span>
              <span className="flex items-center gap-1 text-slate-500">
                <Sparkles className="w-3.5 h-3.5 text-teal-600" />
                Customized from Doctor Records
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mt-1">
              Today's Care & Medication Timetable
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
              Carefully organized by your doctor's exact writing: when to take each dose and what to eat with it.
            </p>
          </div>

          {/* Adherence Gauge */}
          <div className="bg-slate-50 rounded-xl p-3.5 sm:p-4 border border-slate-200 flex items-center gap-4 min-w-[220px]">
            <div className="relative w-12 h-12 flex items-center justify-center rounded-full bg-teal-100 text-teal-800 font-bold text-sm">
              {completionPercent}%
            </div>
            <div>
              <div className="text-xs text-slate-500 font-medium">Daily Adherence</div>
              <div className="text-sm font-bold text-slate-900">
                {takenMeds} of {totalMeds} Doses Taken
              </div>
              <div className="w-32 bg-slate-200 h-2 rounded-full overflow-hidden mt-1.5">
                <div
                  className="bg-teal-600 h-full rounded-full transition-all duration-500"
                  style={{ width: `${completionPercent}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Daily Timeline Slots */}
      <div className="space-y-5">
        {schedule.map((slotItem) => {
          const allTaken =
            slotItem.medications.length > 0 &&
            slotItem.medications.every((m) => m.taken);

          return (
            <div
              key={slotItem.slot}
              id={`timetable-slot-${slotItem.slot.toLowerCase()}`}
              className={`rounded-2xl border transition-all bg-white shadow-xs overflow-hidden ${
                allTaken ? 'border-emerald-200 ring-1 ring-emerald-100' : 'border-slate-200'
              }`}
            >
              {/* Slot Header Bar */}
              <div
                className={`px-5 py-3.5 border-b flex flex-wrap items-center justify-between gap-3 ${getSlotColorClasses(
                  slotItem.slot
                )}`}
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-white shadow-xs">
                    {getSlotIcon(slotItem.slot)}
                  </div>
                  <div>
                    <h3 className="font-bold text-base sm:text-lg tracking-tight">
                      {slotItem.label}
                    </h3>
                    <div className="flex items-center gap-2 text-xs font-semibold opacity-90">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{slotItem.timeRange}</span>
                      {allTaken && (
                        <span className="inline-flex items-center gap-1 text-emerald-700 bg-emerald-100/90 px-2 py-0.5 rounded-full font-bold">
                          <Check className="w-3 h-3" /> All Doses Taken
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Speak Slot Button */}
                <button
                  id={`listen-slot-${slotItem.slot.toLowerCase()}-btn`}
                  onClick={() => handleSpeakSlot(slotItem)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/80 hover:bg-white text-xs font-semibold text-slate-700 shadow-xs border border-slate-200 transition-colors"
                  title="Read aloud instructions for this time of day"
                >
                  <Volume2 className="w-3.5 h-3.5 text-teal-700" />
                  <span>Listen to Routine</span>
                </button>
              </div>

              <div className="p-5 space-y-4">
                {/* Doctor's Eating Habits for this Slot */}
                {slotItem.eatingGuidelines && slotItem.eatingGuidelines.length > 0 && (
                  <div className="bg-amber-50/60 border border-amber-200/80 rounded-xl p-3.5 space-y-2">
                    <div className="flex items-center gap-2 text-xs font-bold text-amber-900 uppercase tracking-wide">
                      <Utensils className="w-4 h-4 text-amber-700" />
                      <span>Doctor's Meal & Food Instructions for This Time</span>
                    </div>
                    <ul className="space-y-1 text-xs sm:text-sm text-slate-700">
                      {slotItem.eatingGuidelines.map((guide, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-2 shrink-0" />
                          <span>{guide}</span>
                        </li>
                      ))}
                    </ul>

                    {slotItem.problemDietsInSlot && slotItem.problemDietsInSlot.length > 0 && (
                      <div className="pt-2 border-t border-amber-200/60 flex flex-wrap gap-2 items-center">
                        <span className="text-[11px] font-bold text-amber-950 uppercase tracking-wider">
                          Diet According to Problem:
                        </span>
                        {slotItem.problemDietsInSlot.map((pd, pIdx) => (
                          <span
                            key={pIdx}
                            className="inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-md bg-white border border-amber-300 text-slate-800"
                          >
                            <span className="font-bold text-teal-800">{pd.problem}:</span> {pd.diet}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Medications List in this Slot */}
                <div className="space-y-3">
                  <div className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                    <Pill className="w-3.5 h-3.5 text-teal-600" />
                    <span>Medications To Take ({slotItem.medications.length})</span>
                  </div>

                  {slotItem.medications.map((med) => (
                    <div
                      key={med.medId}
                      id={`med-card-${med.medId}`}
                      className={`p-4 rounded-xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                        med.taken
                          ? 'bg-emerald-50/40 border-emerald-200 text-slate-600'
                          : 'bg-white border-slate-200 hover:border-teal-300'
                      }`}
                    >
                      <div className="flex items-start gap-3.5">
                        <button
                          id={`toggle-med-${med.medId}-btn`}
                          onClick={() => onToggleMedication(slotItem.slot, med.medId)}
                          className="mt-0.5 text-slate-400 hover:text-teal-600 transition-colors shrink-0"
                          title={med.taken ? 'Mark as not taken' : 'Mark as taken'}
                        >
                          {med.taken ? (
                            <CheckCircle2 className="w-6 h-6 text-emerald-600 fill-emerald-100" />
                          ) : (
                            <Circle className="w-6 h-6 hover:text-teal-600" />
                          )}
                        </button>

                        <div className="space-y-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <h4
                              className={`text-base sm:text-lg font-bold ${
                                med.taken ? 'line-through text-slate-500' : 'text-slate-900'
                              }`}
                            >
                              {med.name}
                            </h4>
                            <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-teal-50 text-teal-800 border border-teal-200">
                              {med.dosage}
                            </span>
                            <span className="text-xs font-medium px-2 py-0.5 rounded-md bg-slate-100 text-slate-700">
                              {med.relationToMeal}
                            </span>
                          </div>

                          <div className="text-xs text-slate-500 flex flex-wrap items-center gap-x-3 gap-y-1">
                            <span>
                              <strong className="text-slate-700">Problem:</strong> {med.conditionTreated}
                            </span>
                            <span>•</span>
                            <span>
                              <strong className="text-slate-700">Time:</strong> {med.exactTime}
                            </span>
                          </div>

                          {/* Particular Diet Column / Tag for this Problem */}
                          {med.particularDietForProblem && (
                            <div className="text-xs bg-amber-50/80 border border-amber-200/90 px-2.5 py-1 rounded-md text-amber-950 font-medium inline-flex items-center gap-1.5 mt-1">
                              <Utensils className="w-3.5 h-3.5 text-amber-700 shrink-0" />
                              <span>
                                <strong className="text-amber-900">Diet for this Problem:</strong>{' '}
                                {med.particularDietForProblem}
                              </span>
                            </div>
                          )}

                          {med.instructions && (
                            <div>
                              <p className="text-xs text-slate-600 mt-1 italic bg-slate-50 px-2.5 py-1 rounded-md border border-slate-100 inline-block">
                                "{med.instructions}"
                              </p>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-2 sm:self-center">
                        <button
                          id={`action-med-btn-${med.medId}`}
                          onClick={() => onToggleMedication(slotItem.slot, med.medId)}
                          className={`w-full sm:w-auto px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                            med.taken
                              ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                              : 'bg-teal-600 hover:bg-teal-700 text-white shadow-xs active:scale-95'
                          }`}
                        >
                          {med.taken ? '✓ Taken' : 'Mark as Taken'}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom Emergency Reassurance */}
      <div className="bg-slate-100 rounded-2xl p-4 sm:p-5 border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs sm:text-sm text-slate-700">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-red-100 text-red-600 shrink-0">
            <AlertCircle className="w-5 h-5" />
          </div>
          <div>
            <div className="font-bold text-slate-900">Feeling dizzy, nauseous, or experiencing side-effects?</div>
            <div className="text-slate-600">
              Never hesitate to contact your doctor if a dose causes unexpected reactions or a messy condition.
            </div>
          </div>
        </div>
        <button
          id="timetable-call-doctor-btn"
          onClick={onOpenEmergencyModal}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs whitespace-nowrap shadow-xs"
        >
          <PhoneCall className="w-4 h-4" />
          Call Doctor Immediately
        </button>
      </div>
    </div>
  );
};
