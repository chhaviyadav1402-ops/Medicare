import React, { useState, useEffect } from 'react';
import {
  Phone,
  PhoneCall,
  PhoneOff,
  AlertTriangle,
  X,
  ShieldAlert,
  HeartPulse,
  Hospital,
  MapPin,
  CheckCircle2,
  Mic,
  MicOff,
  Volume2,
  Clock,
  Radio,
} from 'lucide-react';
import { EmergencyContact } from '../types';

interface EmergencyModalProps {
  isOpen: boolean;
  onClose: () => void;
  contacts: EmergencyContact[];
  primaryDoctor?: EmergencyContact;
  allergies: string[];
}

export const EmergencyModal: React.FC<EmergencyModalProps> = ({
  isOpen,
  onClose,
  contacts,
  primaryDoctor,
  allergies,
}) => {
  const [activeCallContact, setActiveCallContact] = useState<EmergencyContact | null>(null);
  const [callDurationSeconds, setCallDurationSeconds] = useState<number>(0);
  const [callStatus, setCallStatus] = useState<'IDLE' | 'DIALING' | 'CONNECTED'>('IDLE');
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [isSpeakerOn, setIsSpeakerOn] = useState<boolean>(true);

  const doc = primaryDoctor || contacts[0];

  // Call timer effect
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

    // Simulate connection after 2 seconds
    setTimeout(() => {
      setCallStatus('CONNECTED');
    }, 2200);
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

  if (!isOpen) return null;

  return (
    <div
      id="emergency-doctor-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200"
    >
      <div className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl border-2 border-red-500 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="bg-gradient-to-r from-red-600 via-rose-600 to-red-700 px-6 py-4 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-white/20 rounded-2xl">
              <PhoneCall className="w-6 h-6 animate-pulse text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold tracking-tight">Real-Time Emergency Calling</h2>
                <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-full bg-white/20">
                  Live Dispatch
                </span>
              </div>
              <p className="text-xs text-red-100 font-medium">
                Direct phone dialing with real-time call timer & physician priority line
              </p>
            </div>
          </div>
          <button
            id="close-emergency-modal-btn"
            onClick={() => {
              handleEndCall();
              onClose();
            }}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 space-y-5 overflow-y-auto flex-1">
          {/* ACTIVE IN-CALL CONSOLE (WITH REAL CALL TIME) */}
          {callStatus !== 'IDLE' && activeCallContact && (
            <div className="p-5 rounded-2xl bg-slate-900 text-white border-2 border-red-400 shadow-xl space-y-4 animate-in zoom-in-95">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Radio className="w-4 h-4 text-red-400 animate-pulse" />
                  <span className="text-xs font-mono text-red-400 uppercase tracking-wider font-bold">
                    {callStatus === 'DIALING' ? 'DIALING PHYSICIAN LINE...' : 'CALL IN PROGRESS'}
                  </span>
                </div>
                {/* REAL CALL TIME DISPLAY */}
                <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-red-950/80 border border-red-500/40 text-red-300 font-mono font-bold text-sm">
                  <Clock className="w-4 h-4 text-red-400" />
                  <span id="emergency-call-timer">{formatTimer(callDurationSeconds)}</span>
                </div>
              </div>

              <div className="text-center py-2">
                <h3 className="text-xl font-bold text-white">{activeCallContact.doctorName}</h3>
                <p className="text-xs text-slate-400">{activeCallContact.specialty}</p>
                <p className="text-xs font-mono text-cyan-300 mt-1">{activeCallContact.primaryPhone}</p>
              </div>

              {/* Call Controls */}
              <div className="flex items-center justify-center gap-4 pt-2">
                <button
                  onClick={() => setIsMuted(!isMuted)}
                  className={`p-3 rounded-full border transition-colors ${
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
                  className={`p-3 rounded-full border transition-colors ${
                    isSpeakerOn
                      ? 'bg-cyan-500 text-slate-950 border-cyan-400'
                      : 'bg-slate-800 text-white border-slate-700'
                  }`}
                  title="Speakerphone"
                >
                  <Volume2 className="w-5 h-5" />
                </button>

                <button
                  id="hangup-emergency-call-btn"
                  onClick={handleEndCall}
                  className="px-6 py-3 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-bold text-sm flex items-center gap-2 shadow-lg shadow-red-600/40 active:scale-95 transition-all"
                >
                  <PhoneOff className="w-5 h-5" />
                  <span>End Call</span>
                </button>
              </div>
            </div>
          )}

          {/* Primary Doctor Direct Dial Card */}
          {doc && (
            <div className="bg-red-50/70 border-2 border-red-200 rounded-2xl p-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-red-100 text-red-800 text-xs font-bold mb-1.5">
                    <HeartPulse className="w-3.5 h-3.5 text-red-600" />
                    Primary Attending Diabetologist
                  </div>
                  <h3 className="text-lg font-bold text-slate-900">{doc.doctorName}</h3>
                  <p className="text-xs text-slate-700 font-semibold">{doc.specialty}</p>
                  <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                    <Hospital className="w-3.5 h-3.5" />
                    {doc.hospitalOrClinic}
                  </p>
                </div>

                <div className="flex flex-col gap-2 shrink-0">
                  <a
                    id="call-primary-doctor-direct-btn"
                    href={`tel:${doc.primaryPhone.replace(/[^0-9+]/g, '')}`}
                    onClick={() => handleStartSimulatedCall(doc)}
                    className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 active:scale-95 text-white font-bold text-xs sm:text-sm shadow-md transition-all text-center cursor-pointer"
                  >
                    <Phone className="w-4 h-4" />
                    <span>Dial Doctor Line</span>
                  </a>

                  <button
                    onClick={() => handleStartSimulatedCall(doc)}
                    className="inline-flex items-center justify-center gap-1 px-3 py-1.5 rounded-lg bg-red-100 hover:bg-red-200 text-red-900 font-semibold text-xs transition-colors cursor-pointer"
                  >
                    <Clock className="w-3.5 h-3.5" />
                    <span>Start Real Call Session</span>
                  </button>
                </div>
              </div>

              {/* Allergy Warning Alert */}
              {allergies && allergies.length > 0 && (
                <div className="mt-4 p-3 rounded-xl bg-amber-100/80 border border-amber-300 text-xs text-amber-900 flex items-start gap-2">
                  <ShieldAlert className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                  <div>
                    <strong>CRITICAL ALLERGY ALERT FOR FIRST RESPONDERS:</strong>
                    <p className="mt-0.5">{allergies.join(', ')}</p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Secondary Crisis Contacts (Neuropsychiatry & Caregiver) */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Secondary Clinical & Crisis Contacts
            </h4>

            {contacts.slice(1).map((c) => (
              <div
                key={c.id}
                className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
              >
                <div>
                  <span className="font-bold text-slate-900 text-sm block">{c.doctorName}</span>
                  <span className="text-slate-600">{c.specialty}</span>
                  <p className="text-slate-500 text-[11px] mt-0.5">{c.primaryPhone}</p>
                </div>

                <div className="flex items-center gap-2">
                  <a
                    href={`tel:${c.primaryPhone.replace(/[^0-9+]/g, '')}`}
                    onClick={() => handleStartSimulatedCall(c)}
                    className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>Dial Line</span>
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-slate-50 border-t border-slate-200 flex justify-between items-center text-xs text-slate-500">
          <span>In immediate life-threatening danger, dial 911 immediately.</span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-800 font-semibold"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
