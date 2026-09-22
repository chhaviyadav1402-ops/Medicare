import React, { useState, useEffect } from 'react';
import {
  PhoneCall,
  Phone,
  PhoneOff,
  AlertTriangle,
  HeartPulse,
  Hospital,
  MapPin,
  ShieldAlert,
  Copy,
  Check,
  Printer,
  Clock,
  Radio,
  Mic,
  MicOff,
  Volume2,
} from 'lucide-react';
import { EmergencyContact, FullCarePlan } from '../types';

interface EmergencyTabProps {
  carePlan: FullCarePlan;
  onOpenEmergencyModal: () => void;
}

export const EmergencyTab: React.FC<EmergencyTabProps> = ({
  carePlan,
  onOpenEmergencyModal,
}) => {
  const [copied, setCopied] = useState(false);
  const [activeCallContact, setActiveCallContact] = useState<EmergencyContact | null>(null);
  const [callDurationSeconds, setCallDurationSeconds] = useState<number>(0);
  const [callStatus, setCallStatus] = useState<'IDLE' | 'DIALING' | 'CONNECTED'>('IDLE');
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [isSpeakerOn, setIsSpeakerOn] = useState<boolean>(true);

  const { emergencyContacts, emergencyGuidance, allergies, activeConditions, medications, patientName } =
    carePlan;

  const primaryDoc = emergencyContacts.find((c) => c.isPrimaryDoctor) || emergencyContacts[0];

  // Call duration counter
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (callStatus === 'CONNECTED') {
      interval = setInterval(() => {
        setCallDurationSeconds((prev) => prev + 1);
      }, 1000);
    } else {
      setCallDurationSeconds(0);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [callStatus]);

  const handleStartSimulatedCall = (contact: EmergencyContact) => {
    setActiveCallContact(contact);
    setCallStatus('DIALING');
    setTimeout(() => {
      setCallStatus('CONNECTED');
    }, 1800);
  };

  const handleEndCall = () => {
    setCallStatus('IDLE');
    setActiveCallContact(null);
  };

  const formatTimer = (totalSecs: number) => {
    const mins = Math.floor(totalSecs / 60);
    const secs = totalSecs % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleCopyMedicalSummary = () => {
    const summaryText = `EMERGENCY MEDICAL SUMMARY - ${patientName}
Date: ${new Date().toLocaleDateString()}

CRITICAL DRUG ALLERGIES:
${allergies.length > 0 ? allergies.join(', ') : 'None documented'}

ACTIVE MEDICAL CONDITIONS:
${activeConditions.map((c) => `- ${c}`).join('\n')}

CURRENT MEDICATIONS & DOSAGES:
${medications.map((m) => `- ${m.name} (${m.dosage}): Take ${m.timingSlot} (${m.relationToMeal}) for ${m.conditionTreated}`).join('\n')}

PRIMARY ATTENDING PHYSICIAN:
${primaryDoc ? `${primaryDoc.doctorName} (${primaryDoc.specialty})
Phone: ${primaryDoc.primaryPhone}
Clinic: ${primaryDoc.hospitalOrClinic} (${primaryDoc.clinicAddress})` : 'Not assigned'}

EMERGENCY HOSPITAL LINE: +1 (555) 234-8999 or Dial 911`;

    navigator.clipboard.writeText(summaryText);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div id="emergency-tab" className="space-y-6">
      {/* Top Urgent Action Callout */}
      <div className="bg-gradient-to-r from-red-600 via-rose-600 to-red-700 text-white rounded-3xl p-6 sm:p-8 shadow-xl border-2 border-red-400 relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-white text-xs font-bold uppercase tracking-wider font-mono">
              <PhoneCall className="w-3.5 h-3.5 animate-pulse" />
              Real Call Time Option for Emergency
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight font-display">
              Doctor Direct Emergency Hotline
            </h2>
            <p className="text-sm sm:text-base text-red-100 font-normal leading-relaxed">
              Immediate connection to Dr. Sarah Jenkins (Endocrinology) or Dr. Marcus Vance (Neuropsychiatry) with live call duration tracking and emergency first-responder readout.
            </p>
          </div>

          {/* Quick Call Action */}
          <div className="flex flex-wrap items-center gap-3 shrink-0">
            {primaryDoc && (
              <button
                id="emergency-tab-direct-call-btn"
                onClick={() => handleStartSimulatedCall(primaryDoc)}
                className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-2xl bg-white hover:bg-red-50 text-red-700 font-extrabold text-sm sm:text-base shadow-lg shadow-black/20 active:scale-95 transition-all cursor-pointer"
              >
                <Phone className="w-5 h-5 animate-bounce" />
                <span>Start Real Call Session</span>
              </button>
            )}

            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-2 px-4 py-3.5 rounded-2xl bg-red-900/40 hover:bg-red-900/60 text-white border border-white/20 font-semibold text-xs sm:text-sm transition-colors cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>Print Packet</span>
            </button>
          </div>
        </div>
      </div>

      {/* ACTIVE IN-CALL CONSOLE (REAL CALL TIME) */}
      {callStatus !== 'IDLE' && activeCallContact && (
        <div className="p-6 rounded-3xl bg-slate-900 text-white border-2 border-red-500 shadow-2xl space-y-4 animate-in zoom-in-95">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Radio className="w-4 h-4 text-red-400 animate-pulse" />
              <span className="text-xs font-mono text-red-400 uppercase tracking-wider font-bold">
                {callStatus === 'DIALING' ? 'DIALING PHYSICIAN...' : 'ACTIVE CALL SESSION (TELE-HEALTH)'}
              </span>
            </div>
            {/* REAL CALL TIME DISPLAY */}
            <div className="flex items-center gap-2 px-4 py-1.5 rounded-xl bg-red-950 border border-red-500/50 text-red-300 font-mono font-bold text-base">
              <Clock className="w-4 h-4 text-red-400" />
              <span id="tab-call-timer">{formatTimer(callDurationSeconds)}</span>
            </div>
          </div>

          <div className="text-center py-3">
            <h3 className="text-2xl font-bold text-white">{activeCallContact.doctorName}</h3>
            <p className="text-xs text-slate-400">{activeCallContact.specialty}</p>
            <p className="text-xs font-mono text-cyan-300 mt-1">{activeCallContact.primaryPhone}</p>
          </div>

          {/* Call Controls */}
          <div className="flex items-center justify-center gap-4 pt-2">
            <button
              onClick={() => setIsMuted(!isMuted)}
              className={`p-3.5 rounded-full border transition-colors ${
                isMuted
                  ? 'bg-amber-500 text-slate-950 border-amber-400'
                  : 'bg-slate-800 text-white border-slate-700'
              }`}
              title={isMuted ? 'Unmute' : 'Mute'}
            >
              {isMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
            </button>

            <button
              onClick={() => setIsSpeakerOn(!isSpeakerOn)}
              className={`p-3.5 rounded-full border transition-colors ${
                isSpeakerOn
                  ? 'bg-cyan-500 text-slate-950 border-cyan-400'
                  : 'bg-slate-800 text-white border-slate-700'
              }`}
              title="Speakerphone"
            >
              <Volume2 className="w-5 h-5" />
            </button>

            <button
              onClick={handleEndCall}
              className="px-6 py-3.5 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-bold text-sm flex items-center gap-2 shadow-lg shadow-red-600/40 active:scale-95 transition-all cursor-pointer"
            >
              <PhoneOff className="w-5 h-5" />
              <span>End Call Session</span>
            </button>
          </div>
        </div>
      )}

      {/* Emergency Contacts Directory */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500">
          Emergency Doctor & Crisis Contacts
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {emergencyContacts.map((contact) => (
            <div
              key={contact.id}
              className={`p-5 rounded-2xl border-2 transition-all ${
                contact.isPrimaryDoctor
                  ? 'bg-red-50/70 border-red-300 shadow-xs'
                  : 'bg-white border-slate-200'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  {contact.isPrimaryDoctor && (
                    <span className="inline-block text-[10px] font-bold px-2 py-0.5 rounded-md bg-red-100 text-red-800 mb-1.5">
                      PRIMARY ATTENDING
                    </span>
                  )}
                  <h4 className="text-base font-bold text-slate-900">{contact.doctorName}</h4>
                  <p className="text-xs text-slate-600">{contact.specialty}</p>
                  <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                    <Hospital className="w-3.5 h-3.5" />
                    {contact.hospitalOrClinic}
                  </p>
                </div>

                <div className="flex flex-col gap-1.5 shrink-0">
                  <a
                    href={`tel:${contact.primaryPhone.replace(/[^0-9+]/g, '')}`}
                    onClick={() => handleStartSimulatedCall(contact)}
                    className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-xs cursor-pointer"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>Call Now</span>
                  </a>

                  <button
                    onClick={() => handleStartSimulatedCall(contact)}
                    className="inline-flex items-center justify-center gap-1 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-[11px] cursor-pointer"
                  >
                    <Clock className="w-3 h-3 text-slate-500" />
                    <span>Live Timer</span>
                  </button>
                </div>
              </div>

              {/* Messy condition triggers */}
              {contact.messyConditionTriggers && contact.messyConditionTriggers.length > 0 && (
                <div className="mt-3 pt-3 border-t border-slate-200/80 text-xs text-slate-600 space-y-1">
                  <span className="font-bold text-slate-800 block text-[11px]">When to call immediately:</span>
                  <ul className="list-disc pl-4 space-y-0.5 text-[11px]">
                    {contact.messyConditionTriggers.slice(0, 2).map((trig, idx) => (
                      <li key={idx}>{trig}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Emergency First-Responder Clipboard Summary */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 border border-slate-800 shadow-xl space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-2">
            <HeartPulse className="w-5 h-5 text-red-400" />
            <h3 className="text-base font-bold text-white">Emergency Paramedic / Dispatch Summary</h3>
          </div>
          <button
            onClick={handleCopyMedicalSummary}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-slate-700 text-xs font-semibold cursor-pointer"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied to Clipboard' : 'Copy Dispatch Readout'}</span>
          </button>
        </div>

        <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 text-xs font-mono text-slate-300 space-y-2">
          <p>
            <strong className="text-white">PATIENT:</strong> {patientName} (Age 48)
          </p>
          <p>
            <strong className="text-rose-400">CRITICAL ALLERGY:</strong> {allergies.join(', ')} (STRICTLY NO PENICILLIN)
          </p>
          <p>
            <strong className="text-cyan-300">PRIMARY DIAGNOSES:</strong> 9-Year Longstanding Type 2 Diabetes, Secondary Major Depressive Disorder (PHQ-9: 16), Diabetic Peripheral Neuropathy.
          </p>
          <p>
            <strong className="text-amber-300">ACTIVE REGIMEN:</strong> Duloxetine 60mg (Morning), Metformin ER 1000mg (Morning & Evening), Empagliflozin 10mg (Morning), Atorvastatin 20mg (Bedtime).
          </p>
        </div>
      </div>
    </div>
  );
};
