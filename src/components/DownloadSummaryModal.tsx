import React, { useState, useRef } from 'react';
import {
  FileText,
  Printer,
  Download,
  Copy,
  Check,
  X,
  Calendar,
  User,
  Heart,
  Pill,
  Utensils,
  CloudSun,
  PhoneCall,
  ShieldAlert,
  Info,
} from 'lucide-react';
import { FullCarePlan, MedicalDocument, MoodLogEntry } from '../types';
import { WEATHER_CONFIGS } from '../data/defaultMoodData';
import { generateMedicalSummaryText, downloadTextFile } from '../utils/summaryExport';

interface DownloadSummaryModalProps {
  isOpen: boolean;
  onClose: () => void;
  carePlan: FullCarePlan;
  documents: MedicalDocument[];
  moodLogs: MoodLogEntry[];
}

export const DownloadSummaryModal: React.FC<DownloadSummaryModalProps> = ({
  isOpen,
  onClose,
  carePlan,
  documents,
  moodLogs,
}) => {
  const [copied, setCopied] = useState(false);
  const [includeCarePlan, setIncludeCarePlan] = useState(true);
  const [includeMedsHistory, setIncludeMedsHistory] = useState(true);
  const [includeDiet, setIncludeDiet] = useState(true);
  const [includeMoodTrends, setIncludeMoodTrends] = useState(true);
  const [includeDocArchive, setIncludeDocArchive] = useState(true);
  const [includeEmergency, setIncludeEmergency] = useState(true);

  const printRef = useRef<HTMLDivElement>(null);

  if (!isOpen) return null;

  const currentDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  const generatedTime = new Date().toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  });

  const primaryDoc =
    carePlan.emergencyContacts.find((c) => c.isPrimaryDoctor) || carePlan.emergencyContacts[0];

  const handleDownloadTxt = () => {
    const textContent = generateMedicalSummaryText(carePlan, documents, moodLogs);
    const sanitizedName = (carePlan.patientName || 'patient')
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '-');
    const filename = `medicare-summary-${sanitizedName}-${new Date().toISOString().split('T')[0]}.txt`;
    downloadTextFile(filename, textContent);
  };

  const handleCopyToClipboard = () => {
    const textContent = generateMedicalSummaryText(carePlan, documents, moodLogs);
    navigator.clipboard.writeText(textContent).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    });
  };

  const handlePrint = () => {
    window.print();
  };

  // Recent mood stats
  const totalMoods = moodLogs.length;
  const avgMood =
    totalMoods > 0
      ? (moodLogs.reduce((acc, m) => acc + m.moodRating, 0) / totalMoods).toFixed(1)
      : 'N/A';
  const avgEnergy =
    totalMoods > 0
      ? (moodLogs.reduce((acc, m) => acc + m.energyLevel, 0) / totalMoods).toFixed(1)
      : 'N/A';

  return (
    <div
      id="download-summary-modal-backdrop"
      className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-2 sm:p-4 overflow-y-auto print:static print:bg-white print:p-0 print:m-0 print:overflow-visible print:z-auto print:backdrop-blur-none print:inset-auto"
    >
      <div className="bg-white rounded-2xl max-w-4xl w-full border border-slate-200 shadow-2xl my-4 sm:my-8 flex flex-col max-h-[92vh] overflow-hidden print:shadow-none print:border-none print:max-w-none print:w-full print:max-h-none print:my-0 print:rounded-none print:overflow-visible">
        {/* Top Modal Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/80 shrink-0 print:hidden">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-teal-100 text-teal-800 rounded-xl">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-slate-900">
                Download & Print Medical Summary
              </h3>
              <p className="text-xs text-slate-500">
                Complete clinical care plan, medication history, and recent mood trends.
              </p>
            </div>
          </div>

          <button
            id="close-summary-modal-btn"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Action Toolbar & Configuration */}
        <div className="p-4 border-b border-slate-100 bg-white flex flex-col md:flex-row md:items-center justify-between gap-3 shrink-0 print:hidden">
          {/* Quick toggles */}
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="font-bold text-slate-500 uppercase tracking-wider text-[11px] mr-1">
              Include:
            </span>
            <label className="inline-flex items-center gap-1.5 cursor-pointer text-slate-700 font-medium">
              <input
                type="checkbox"
                checked={includeMedsHistory}
                onChange={(e) => setIncludeMedsHistory(e.target.checked)}
                className="w-3.5 h-3.5 rounded text-teal-600 focus:ring-teal-500"
              />
              <span>Medications</span>
            </label>
            <label className="inline-flex items-center gap-1.5 cursor-pointer text-slate-700 font-medium">
              <input
                type="checkbox"
                checked={includeCarePlan}
                onChange={(e) => setIncludeCarePlan(e.target.checked)}
                className="w-3.5 h-3.5 rounded text-teal-600 focus:ring-teal-500"
              />
              <span>Timetable</span>
            </label>
            <label className="inline-flex items-center gap-1.5 cursor-pointer text-slate-700 font-medium">
              <input
                type="checkbox"
                checked={includeDiet}
                onChange={(e) => setIncludeDiet(e.target.checked)}
                className="w-3.5 h-3.5 rounded text-teal-600 focus:ring-teal-500"
              />
              <span>Diet Plan</span>
            </label>
            <label className="inline-flex items-center gap-1.5 cursor-pointer text-slate-700 font-medium">
              <input
                type="checkbox"
                checked={includeMoodTrends}
                onChange={(e) => setIncludeMoodTrends(e.target.checked)}
                className="w-3.5 h-3.5 rounded text-teal-600 focus:ring-teal-500"
              />
              <span>Mood & Weather</span>
            </label>
            <label className="inline-flex items-center gap-1.5 cursor-pointer text-slate-700 font-medium">
              <input
                type="checkbox"
                checked={includeDocArchive}
                onChange={(e) => setIncludeDocArchive(e.target.checked)}
                className="w-3.5 h-3.5 rounded text-teal-600 focus:ring-teal-500"
              />
              <span>Records Vault</span>
            </label>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              id="copy-summary-text-btn"
              onClick={handleCopyToClipboard}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-bold transition-colors"
              title="Copy plain text summary to clipboard"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-emerald-700">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Text</span>
                </>
              )}
            </button>

            <button
              id="download-summary-txt-btn"
              onClick={handleDownloadTxt}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold shadow-xs transition-colors"
              title="Download full summary as formatted .txt file"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download Text File (.txt)</span>
            </button>

            <button
              id="print-summary-pdf-btn"
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold shadow-xs transition-colors"
              title="Open print dialog to print or Save as PDF"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / Save as PDF</span>
            </button>
          </div>
        </div>

        {/* Scrollable Printable Document Preview */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-slate-100 print:bg-white print:p-0 print:overflow-visible">
          <div
            ref={printRef}
            id="printable-summary-document"
            className="bg-white p-6 sm:p-10 rounded-xl shadow-xs border border-slate-200 max-w-3xl mx-auto space-y-6 text-slate-900 print:border-none print:shadow-none print:p-0 print:max-w-none print:rounded-none"
          >
            {/* Clinical Header */}
            <div className="border-b-2 border-teal-600 pb-5 flex flex-col sm:flex-row sm:items-start justify-between gap-4">
              <div>
                <div className="text-xs font-extrabold uppercase tracking-widest text-teal-800 flex items-center gap-1.5">
                  <Heart className="w-4 h-4 text-teal-600 fill-teal-100" />
                  <span>MediCare Routine • Clinical Care Summary</span>
                </div>
                <h1 className="text-xl sm:text-2xl font-black text-slate-900 mt-1">
                  Patient Health Dossier & Care Protocol
                </h1>
                <div className="text-xs text-slate-600 mt-1 flex flex-wrap items-center gap-3">
                  <span><strong>Date:</strong> {currentDate} ({generatedTime})</span>
                  <span>•</span>
                  <span><strong>Patient:</strong> {carePlan.patientName || 'Eleanor Vance'}</span>
                </div>
              </div>

              <div className="text-right sm:text-right text-xs text-slate-600 space-y-0.5 border-t sm:border-t-0 pt-2 sm:pt-0">
                <div className="font-bold text-slate-900 text-sm">{primaryDoc?.doctorName || 'Dr. Sarah Jenkins, MD'}</div>
                <div className="text-slate-500">{primaryDoc?.specialty || 'Cardiology & Internal Medicine'}</div>
                <div className="text-slate-500">{primaryDoc?.hospitalOrClinic || 'Memorial General Hospital'}</div>
                <div className="font-semibold text-teal-800">Emergency: {primaryDoc?.emergencyPhone || primaryDoc?.primaryPhone}</div>
              </div>
            </div>

            {/* Patient Clinical Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs">
              <div>
                <span className="font-bold text-slate-500 uppercase tracking-wider text-[10px]">
                  Active Diagnoses & Conditions:
                </span>
                <ul className="mt-1 space-y-1">
                  {carePlan.activeConditions.map((cond, i) => (
                    <li key={i} className="font-semibold text-slate-800 flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-teal-600" />
                      {cond}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <span className="font-bold text-slate-500 uppercase tracking-wider text-[10px]">
                  Known Allergies & Contraindications:
                </span>
                <div className="mt-1 flex flex-wrap gap-1.5">
                  {carePlan.allergies.length > 0 ? (
                    carePlan.allergies.map((allg, i) => (
                      <span
                        key={i}
                        className="px-2 py-0.5 rounded-md bg-rose-100 text-rose-800 font-bold border border-rose-200"
                      >
                        {allg}
                      </span>
                    ))
                  ) : (
                    <span className="text-slate-500 italic">None documented</span>
                  )}
                </div>
              </div>

              <div className="md:col-span-2 pt-2 border-t border-slate-200/80">
                <span className="font-bold text-slate-500 uppercase tracking-wider text-[10px]">
                  Physician Care Synthesis:
                </span>
                <p className="mt-0.5 text-slate-700 leading-relaxed">
                  {carePlan.summaryOverview}
                </p>
              </div>
            </div>

            {/* Section 1: Medications History & Schedule */}
            {includeMedsHistory && (
              <div className="space-y-3">
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2 border-b border-slate-200 pb-1.5">
                  <Pill className="w-4 h-4 text-teal-600" />
                  <span>1. Current Prescriptions & Medication History ({carePlan.medications.length})</span>
                </h3>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse border border-slate-200">
                    <thead>
                      <tr className="bg-slate-100 text-slate-700">
                        <th className="p-2 border border-slate-200 font-bold">Medication</th>
                        <th className="p-2 border border-slate-200 font-bold">Dosage & Form</th>
                        <th className="p-2 border border-slate-200 font-bold">Daily Timing</th>
                        <th className="p-2 border border-slate-200 font-bold">Indication / Condition</th>
                        <th className="p-2 border border-slate-200 font-bold">Stock & Refill</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      {carePlan.medications.map((med) => {
                        const isUrgent =
                          med.restockAlertLevel === 'CRITICAL' ||
                          med.restockAlertLevel === 'WARNING';
                        return (
                          <tr key={med.id} className="hover:bg-slate-50/80">
                            <td className="p-2 border border-slate-200">
                              <div className="font-bold text-slate-900">{med.name}</div>
                              <div className="text-[11px] text-slate-500">
                                {med.prescribingDoctor || 'Attending Physician'}
                              </div>
                            </td>
                            <td className="p-2 border border-slate-200">
                              <span className="font-medium">{med.dosage}</span> ({med.form})
                            </td>
                            <td className="p-2 border border-slate-200">
                              <div className="font-medium text-slate-800">
                                {med.timingSlot} at {med.exactTime}
                              </div>
                              <div className="text-[10px] text-teal-700 font-medium">
                                {med.relationToMeal}
                              </div>
                            </td>
                            <td className="p-2 border border-slate-200 text-slate-700">
                              <div>{med.conditionTreated}</div>
                              {med.particularDietForProblem && (
                                <div className="text-[10px] text-teal-800 font-semibold mt-0.5">
                                  Diet: {med.particularDietForProblem}
                                </div>
                              )}
                            </td>
                            <td className="p-2 border border-slate-200">
                              <div className="font-bold text-slate-800">
                                {med.pillsRemaining} pills ({med.daysRemaining}d left)
                              </div>
                              {isUrgent ? (
                                <span className="text-[10px] font-bold text-rose-700 uppercase">
                                  Refill Needed ({med.restockAlertLevel})
                                </span>
                              ) : (
                                <span className="text-[10px] text-emerald-700 font-semibold">
                                  Adequate Supply
                                </span>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Section 2: Daily Timetable Routine */}
            {includeCarePlan && (
              <div className="space-y-3">
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2 border-b border-slate-200 pb-1.5">
                  <Calendar className="w-4 h-4 text-teal-600" />
                  <span>2. Daily Timetable Routine</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {carePlan.dailyTimetable.map((slot) => (
                    <div
                      key={slot.slot}
                      className="p-3 rounded-lg border border-slate-200 bg-slate-50/50 space-y-1.5 text-xs"
                    >
                      <div className="flex items-center justify-between font-bold text-slate-900">
                        <span>{slot.label}</span>
                        <span className="text-teal-800 font-mono text-[11px]">{slot.timeRange}</span>
                      </div>
                      <div className="space-y-1">
                        {slot.medications.length > 0 ? (
                          slot.medications.map((m, mIdx) => (
                            <div key={mIdx} className="text-slate-800 font-medium flex items-center gap-1.5">
                              <span className="w-1.5 h-1.5 rounded-full bg-teal-500" />
                              <span>{m.name} {m.dosage} ({m.relationToMeal})</span>
                            </div>
                          ))
                        ) : (
                          <div className="text-slate-400 italic">No medications scheduled</div>
                        )}
                      </div>
                      {slot.eatingGuidelines.length > 0 && (
                        <div className="text-[11px] text-slate-600 pt-1 border-t border-slate-200">
                          <strong>Diet Note:</strong> {slot.eatingGuidelines[0]}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Section 3: Problem-Specific Eating Habits */}
            {includeDiet && (
              <div className="space-y-3">
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2 border-b border-slate-200 pb-1.5">
                  <Utensils className="w-4 h-4 text-teal-600" />
                  <span>3. Problem-Specific Nutrition & Dietary Directives</span>
                </h3>

                <div className="space-y-2.5">
                  {carePlan.problemDiets?.map((pd, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-lg border border-slate-200 bg-white space-y-1.5 text-xs"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-900">
                          {pd.problem} {pd.severityOrTarget ? `(${pd.severityOrTarget})` : ''}
                        </span>
                        <span className="text-[11px] text-teal-800 font-semibold">
                          Diet: {pd.dietName}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-600">
                        <strong>Protocol:</strong> {pd.prescribedDiet}
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
                        <div className="bg-emerald-50 p-2 rounded border border-emerald-200 text-emerald-900">
                          <strong className="block mb-0.5 text-emerald-950">Recommended:</strong>
                          <span>{pd.foodsToEat.slice(0, 3).join(', ')}</span>
                        </div>
                        <div className="bg-rose-50 p-2 rounded border border-rose-200 text-rose-900">
                          <strong className="block mb-0.5 text-rose-950">Avoid:</strong>
                          <span>{pd.foodsToAvoid.slice(0, 3).join(', ')}</span>
                        </div>
                      </div>
                      <div className="text-[11px] text-slate-600">
                        <strong>Clinical Rationale:</strong> {pd.clinicalRationale}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Section 4: Recent Mood Trends & Biometeorology */}
            {includeMoodTrends && (
              <div className="space-y-3">
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2 border-b border-slate-200 pb-1.5">
                  <CloudSun className="w-4 h-4 text-teal-600" />
                  <span>4. Recent Mood, Energy & Biometeorology Trends</span>
                </h3>

                <div className="p-3 rounded-lg bg-teal-50/70 border border-teal-200 flex flex-wrap items-center justify-between text-xs gap-3">
                  <div>
                    <span className="text-slate-600 font-medium">Logged Entries: </span>
                    <strong className="text-slate-900">{totalMoods} days</strong>
                  </div>
                  <div>
                    <span className="text-slate-600 font-medium">Average Mood: </span>
                    <strong className="text-teal-900">{avgMood} / 5.0</strong>
                  </div>
                  <div>
                    <span className="text-slate-600 font-medium">Average Energy: </span>
                    <strong className="text-amber-900">{avgEnergy} / 5.0</strong>
                  </div>
                  <div>
                    <span className="text-slate-600 font-medium">Key Finding: </span>
                    <span className="text-teal-900 font-semibold">
                      Higher vitality on sunny days; mild stiffness on rainy/low-pressure shifts.
                    </span>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse border border-slate-200">
                    <thead>
                      <tr className="bg-slate-100 text-slate-700">
                        <th className="p-1.5 border border-slate-200 font-bold">Date & Time</th>
                        <th className="p-1.5 border border-slate-200 font-bold">Mood & Energy</th>
                        <th className="p-1.5 border border-slate-200 font-bold">Weather</th>
                        <th className="p-1.5 border border-slate-200 font-bold">Physical Symptoms</th>
                        <th className="p-1.5 border border-slate-200 font-bold">Meds On-Time</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 text-[11px]">
                      {moodLogs.slice(0, 7).map((m) => (
                        <tr key={m.id} className="hover:bg-slate-50">
                          <td className="p-1.5 border border-slate-200 font-medium text-slate-900">
                            {m.date} {m.time}
                          </td>
                          <td className="p-1.5 border border-slate-200">
                            <span className="font-bold text-slate-800">{m.mood}</span> (Score {m.moodRating}/5, Energy {m.energyLevel}/5)
                          </td>
                          <td className="p-1.5 border border-slate-200">
                            {WEATHER_CONFIGS[m.weather]?.label.split('&')[0].trim() || m.weather} ({m.temperature})
                          </td>
                          <td className="p-1.5 border border-slate-200 text-slate-700">
                            {m.physicalFeelings.join(', ') || 'Normal'}
                          </td>
                          <td className="p-1.5 border border-slate-200">
                            {m.medsTakenOnTime ? (
                              <span className="text-emerald-700 font-bold">Yes</span>
                            ) : (
                              <span className="text-rose-700 font-bold">Missed</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Section 5: Medical Documents Vault Archive */}
            {includeDocArchive && (
              <div className="space-y-3">
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2 border-b border-slate-200 pb-1.5">
                  <FileText className="w-4 h-4 text-teal-600" />
                  <span>5. Source Medical Records & Prescriptions Archive ({documents.length})</span>
                </h3>

                <div className="space-y-2 text-xs">
                  {documents.map((doc, idx) => (
                    <div key={doc.id} className="p-2.5 rounded-lg border border-slate-200 bg-slate-50/50">
                      <div className="flex items-center justify-between font-bold text-slate-900">
                        <span>[DOC-{idx + 1}] {doc.title}</span>
                        <span className="text-slate-500 font-normal">{doc.date}</span>
                      </div>
                      <div className="text-[11px] text-slate-600 mt-0.5">
                        Physician: <strong>{doc.doctorName}</strong> ({doc.clinicOrHospital}) • Phone: {doc.doctorPhone}
                      </div>
                      <div className="text-[11px] text-slate-700 mt-1 line-clamp-2">
                        {doc.doctorNotesRaw}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Section 6: Emergency Guidance & Physician Contacts */}
            {includeEmergency && (
              <div className="p-4 rounded-xl border border-rose-200 bg-rose-50/50 space-y-2 text-xs">
                <div className="flex items-center gap-2 font-bold text-rose-950 uppercase tracking-wider">
                  <ShieldAlert className="w-4 h-4 text-rose-600" />
                  <span>Emergency Protocols & Immediate Action</span>
                </div>
                <div className="text-rose-900 text-[11px] leading-relaxed">
                  <strong>Red Flag Symptoms:</strong> {carePlan.emergencyGuidance.redFlagSymptoms.join('; ')}
                </div>
                <div className="text-slate-800 text-[11px] pt-1 border-t border-rose-200/60 flex flex-wrap items-center justify-between gap-2">
                  <span>
                    Emergency Hospital: <strong>{primaryDoc?.hospitalOrClinic}</strong>
                  </span>
                  <span>
                    Direct Physician Hotline: <strong className="text-rose-700">{primaryDoc?.emergencyPhone || primaryDoc?.primaryPhone}</strong>
                  </span>
                </div>
              </div>
            )}

            {/* Clinical Sign-Off Footer */}
            <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-2">
              <div>Generated via MediCare Routine System</div>
              <div className="italic">For patient personal review and primary physician consultation</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
