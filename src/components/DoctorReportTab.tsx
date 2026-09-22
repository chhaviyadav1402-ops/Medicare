import React, { useState } from 'react';
import {
  FileText,
  AlertTriangle,
  Flame,
  Activity,
  Printer,
  Calendar,
  Pill,
  UserCheck,
  Stethoscope,
  HeartPulse,
  Camera,
  Download,
  CheckCircle2,
  Filter,
} from 'lucide-react';
import { FullCarePlan, SmartwatchData, MealPhotoLog, MedicalDocument } from '../types';

interface DoctorReportTabProps {
  carePlan: FullCarePlan;
  watchData: SmartwatchData;
  mealLogs: MealPhotoLog[];
  documents: MedicalDocument[];
  currentGlucoseMgDl: number;
}

export const DoctorReportTab: React.FC<DoctorReportTabProps> = ({
  carePlan,
  watchData,
  mealLogs,
  documents,
  currentGlucoseMgDl,
}) => {
  const [filterMode, setFilterMode] = useState<'CRITICAL_ONLY' | 'ALL_SUMMARY'>('CRITICAL_ONLY');

  const criticalRestocks = carePlan.medications.filter(
    (m) => m.restockAlertLevel === 'CRITICAL' || m.daysRemaining <= 3
  );

  const nonCompliantMeals = mealLogs.filter(
    (m) => !m.isCompliantWithDiabeticDiet || m.glucoseSpikeRisk === 'SEVERE'
  );

  const handlePrint = () => {
    window.print();
  };

  return (
    <div id="doctor-report-tab" className="space-y-6">
      {/* Header & Print Banner */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-teal-600 text-white flex items-center justify-center shadow-md shadow-teal-600/20 shrink-0">
            <Stethoscope className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 font-display">
                Physician Executive Briefing
              </h2>
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-teal-100 text-teal-800">
                Doctor Eyes Only
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              Strictly filters for the most critical clinical red flags, glucose spikes, and treatment hazards.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Filter Toggle */}
          <div className="inline-flex rounded-xl bg-slate-100 p-1 text-xs font-semibold">
            <button
              onClick={() => setFilterMode('CRITICAL_ONLY')}
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                filterMode === 'CRITICAL_ONLY'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Critical Red Flags Only
            </button>
            <button
              onClick={() => setFilterMode('ALL_SUMMARY')}
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                filterMode === 'ALL_SUMMARY'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Full Clinical Handoff
            </button>
          </div>

          <button
            id="print-doctor-report-btn"
            onClick={handlePrint}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-md transition-colors cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>Print Report</span>
          </button>
        </div>
      </div>

      {/* Patient Clinical Profile Header Bar */}
      <div className="bg-slate-900 text-white rounded-2xl p-5 border border-slate-800 shadow-md flex flex-wrap items-center justify-between gap-4 text-xs">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-base font-bold text-white">{carePlan.patientName}</span>
            <span className="text-slate-400 font-mono">DOB: 1978-04-12 (Age 48)</span>
            <span className="px-2 py-0.5 rounded-md bg-rose-500/20 text-rose-300 font-bold border border-rose-500/30">
              Penicillin Allergy!
            </span>
          </div>
          <p className="text-slate-300 font-medium">
            <strong>Diagnosis:</strong> 9-Year Longstanding Type 2 Diabetes Mellitus with Secondary Major Depressive Disorder (PHQ-9: 16) & Peripheral Neuropathy.
          </p>
        </div>

        <div className="flex items-center gap-4 text-right">
          <div>
            <span className="text-slate-400 block text-[11px]">Primary Attending Endocrinologist:</span>
            <strong className="text-teal-300 font-medium">Dr. Sarah Jenkins, MD</strong>
          </div>
          <div>
            <span className="text-slate-400 block text-[11px]">Consulting Neuropsychiatrist:</span>
            <strong className="text-indigo-300 font-medium">Dr. Marcus Vance, MD</strong>
          </div>
        </div>
      </div>

      {/* HIGH PRIORITY RED FLAGS SECTION (ONLY VERY IMPORTANT THINGS) */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-700 flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-rose-600" />
          Critical Clinical Red Flags & Actionable Alerts
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* 1. GLYCEMIC SPIKES & CONTROL */}
          <div className="bg-white rounded-2xl p-5 border-2 border-rose-300 shadow-xs">
            <div className="flex items-center justify-between pb-3 border-b border-rose-100">
              <span className="inline-flex items-center gap-1 text-xs font-bold text-rose-700 bg-rose-100 px-2.5 py-1 rounded-lg">
                <Flame className="w-3.5 h-3.5 text-rose-600" />
                Red Flag 1: Glycemic Volatility
              </span>
              <span className="text-xs font-bold text-slate-600">Recent Spike: {currentGlucoseMgDl} mg/dL</span>
            </div>

            <div className="mt-3 space-y-2 text-xs text-slate-700">
              <p>
                <strong>Latest HbA1c:</strong> <span className="text-rose-700 font-bold">8.2%</span> (Target &lt; 7.0%). Demonstrates glycemic escape.
              </p>
              <p>
                <strong>CGM Excursions:</strong> 3 post-prandial spikes exceeding 200 mg/dL logged over the past 7 days.
              </p>
              <p>
                <strong>Renal Biomarker:</strong> Urine Microalbumin-to-Creatinine ratio is <strong>42 mg/g</strong> (Mild persistent microalbuminuria).
              </p>
              <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-[11px] font-medium">
                Recommendation: Titrate Metformin ER or consider adding GLP-1 receptor agonist / SGLT2 adjustment for cardiorenal protection.
              </div>
            </div>
          </div>

          {/* 2. CHRONIC ILLNESS MAJOR DEPRESSION & NEUROPATHY */}
          <div className="bg-white rounded-2xl p-5 border-2 border-indigo-200 shadow-xs">
            <div className="flex items-center justify-between pb-3 border-b border-indigo-100">
              <span className="inline-flex items-center gap-1 text-xs font-bold text-indigo-700 bg-indigo-100 px-2.5 py-1 rounded-lg">
                <HeartPulse className="w-3.5 h-3.5 text-indigo-600" />
                Red Flag 2: 9-Yr Chronic Illness Depression
              </span>
              <span className="text-xs font-bold text-slate-600">PHQ-9 Score: 16/27</span>
            </div>

            <div className="mt-3 space-y-2 text-xs text-slate-700">
              <p>
                <strong>Psychiatric Status:</strong> Major Depressive Disorder secondary to chronic illness burden and emotional diabetes fatigue.
              </p>
              <p>
                <strong>Neuropathic Symptom:</strong> Bilateral burning paresthesias in feet interrupting nighttime sleep and amplifying depressive exhaustion.
              </p>
              <p>
                <strong>Therapy:</strong> Duloxetine (Cymbalta) 60mg morning dose taken with 94% compliance.
              </p>
              <div className="p-2.5 rounded-xl bg-indigo-50 border border-indigo-200 text-indigo-800 text-[11px] font-medium">
                Recommendation: Dr. Marcus Vance follow-up scheduled. Continue dual-action SNRI to address depression and neuropathic pain simultaneously.
              </div>
            </div>
          </div>

          {/* 3. CRITICAL RESTOCK & DEPLETION HAZARD */}
          <div className="bg-white rounded-2xl p-5 border-2 border-amber-300 shadow-xs">
            <div className="flex items-center justify-between pb-3 border-b border-amber-100">
              <span className="inline-flex items-center gap-1 text-xs font-bold text-amber-800 bg-amber-100 px-2.5 py-1 rounded-lg">
                <Pill className="w-3.5 h-3.5 text-amber-600" />
                Red Flag 3: Imminent Medicine Depletion
              </span>
              <span className="text-xs font-bold text-rose-600">Stockout Risk: HIGH</span>
            </div>

            <div className="mt-3 space-y-2 text-xs text-slate-700">
              {criticalRestocks.length > 0 ? (
                criticalRestocks.map((med) => (
                  <div key={med.id} className="flex items-center justify-between p-2 rounded-lg bg-amber-50">
                    <div>
                      <span className="font-bold text-slate-900">{med.name}</span>
                      <span className="text-slate-500 block text-[11px]">{med.dosage}</span>
                    </div>
                    <span className="px-2 py-0.5 rounded bg-rose-100 text-rose-700 font-bold text-[11px]">
                      Only {med.pillsRemaining} doses ({med.daysRemaining}d) left!
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-slate-500">No immediate depletion flags.</p>
              )}
              <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-[11px] font-medium">
                Urgent Action: Authorize pharmacy refill for Metformin ER to prevent rebound hyperglycemia and treatment interruption.
              </div>
            </div>
          </div>

          {/* 4. WATCH SEDENTARY ALERT & INACTIVITY */}
          <div className="bg-white rounded-2xl p-5 border-2 border-slate-200 shadow-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <span className="inline-flex items-center gap-1 text-xs font-bold text-slate-700 bg-slate-100 px-2.5 py-1 rounded-lg">
                <Activity className="w-3.5 h-3.5 text-slate-600" />
                Red Flag 4: Physical Inactivity / Sedentary
              </span>
              <span className="text-xs font-bold text-amber-600">Inactivity Warning</span>
            </div>

            <div className="mt-3 space-y-2 text-xs text-slate-700">
              <p>
                <strong>Smartwatch Activity:</strong> Current steps logged: <strong>{watchData.steps}</strong> (Goal: {watchData.stepGoal}).
              </p>
              <p>
                <strong>Sedentary Hours:</strong> Patient remained inactive for over 3 hours today, severely dropping muscle glucose disposal.
              </p>
              <p>
                <strong>Sleep Fragmentation:</strong> 5.7 hours average sleep with reduced REM phases, consistent with depression profile.
              </p>
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-700 text-[11px] font-medium">
                Recommendation: Prescribe structured 15-minute gentle post-meal walks to stimulate glucose transporters without overloading neuropathic feet.
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* MEAL PHOTO AI COMPLIANCE LOGS (RECORDED FROM MEAL CAMERA) */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Camera className="w-5 h-5 text-teal-600" />
            <h3 className="text-base font-bold text-slate-900">
              Meal Photo AI Dietary Log & Non-Compliance Flags
            </h3>
          </div>
          <span className="text-xs font-semibold text-slate-500">
            {mealLogs.length} meal photos analyzed
          </span>
        </div>

        {mealLogs.length === 0 ? (
          <p className="text-xs text-slate-500 py-4 text-center">
            No meal photos recorded yet. Patient can snap pictures of meals to match against the diet plan.
          </p>
        ) : (
          <div className="space-y-3">
            {mealLogs.map((m) => (
              <div
                key={m.id}
                className={`p-4 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs ${
                  !m.isCompliantWithDiabeticDiet
                    ? 'bg-rose-50/70 border-rose-300'
                    : 'bg-slate-50 border-slate-200'
                }`}
              >
                <div className="flex items-start gap-3">
                  <img
                    src={m.photoUrl}
                    alt={m.dishName}
                    className="w-14 h-14 object-cover rounded-xl border border-slate-300 shrink-0"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900 text-sm">{m.dishName}</span>
                      <span className="px-2 py-0.5 rounded-md bg-slate-200 text-slate-700 text-[10px] font-bold">
                        {m.mealType}
                      </span>
                      {!m.isCompliantWithDiabeticDiet && (
                        <span className="px-2 py-0.5 rounded-md bg-rose-100 text-rose-700 font-bold text-[10px]">
                          Non-Compliant (Spike Risk)
                        </span>
                      )}
                    </div>
                    <p className="text-slate-600 mt-0.5">
                      Carbs: <strong>{m.carbsGrams}g</strong> | Glycemic Index:{' '}
                      <strong className={m.glycemicIndex === 'HIGH' ? 'text-rose-600' : 'text-slate-700'}>
                        {m.glycemicIndex}
                      </strong>{' '}
                      | Calories: {m.calories} kcal | Fiber: {m.fiberGrams}g
                    </p>
                    <p className="text-slate-500 mt-0.5 text-[11px] italic">{m.aiRecommendation}</p>
                  </div>
                </div>

                <div className="sm:text-right shrink-0">
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${
                      m.complianceScore >= 70
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-rose-100 text-rose-800'
                    }`}
                  >
                    {m.complianceScore}% Dietary Compliance
                  </span>
                  <span className="text-slate-400 block text-[10px] mt-1">{m.timestamp}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* DOCTOR SIGN-OFF BLOCK */}
      <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs text-slate-600">
        <div>
          <span className="font-bold text-slate-800 block">Attending Physician Review Check:</span>
          <span>Report automatically compiled from EHR past history, CGM telemetry, and AI meal audits.</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-36 border-b border-slate-400 h-6"></div>
          <span className="text-[11px] text-slate-400 font-mono">Dr. Jenkins / Dr. Vance Signature</span>
        </div>
      </div>
    </div>
  );
};
