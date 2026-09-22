import React, { useState, useEffect, useRef } from 'react';
import { Header } from './components/Header';
import { Navigation } from './components/Navigation';
import { CinematicHeroBanner } from './components/CinematicHeroBanner';
import { TimetableTab } from './components/TimetableTab';
import { DocumentsTab } from './components/DocumentsTab';
import { MedicationsTab } from './components/MedicationsTab';
import { EatingHabitsTab } from './components/EatingHabitsTab';
import { MoodTrackerTab } from './components/MoodTrackerTab';
import { WatchTelemetryTab } from './components/WatchTelemetryTab';
import { DoctorReportTab } from './components/DoctorReportTab';
import { EmergencyTab } from './components/EmergencyTab';
import { EmergencyModal } from './components/EmergencyModal';
import { AddDocumentModal } from './components/AddDocumentModal';
import { DailyUpdateModal } from './components/DailyUpdateModal';
import { MealPhotoAnalyzerModal } from './components/MealPhotoAnalyzerModal';
import { WeatherCanvasEffect } from './components/WeatherCanvasEffect';
import {
  ActiveTab,
  MedicalDocument,
  FullCarePlan,
  TimeSlot,
  MoodLogEntry,
  WeatherType,
  SmartwatchData,
  MealPhotoLog,
} from './types';
import { INITIAL_DOCUMENTS, INITIAL_CARE_PLAN } from './data/defaultMedicalData';
import { INITIAL_MOOD_LOGS } from './data/defaultMoodData';
import { INITIAL_SMARTWATCH_DATA, INITIAL_MEAL_LOGS } from './data/defaultWatchAndMealData';
import {
  speakWithFemaleMetroVoice,
  cancelSpeech,
} from './utils/audioUtils';

export function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('TIMETABLE');
  const [isEmergencyModalOpen, setIsEmergencyModalOpen] = useState(false);
  const [isAddDocModalOpen, setIsAddDocModalOpen] = useState(false);
  const [isDailyUpdateOpen, setIsDailyUpdateOpen] = useState(false);
  const [isMealCameraOpen, setIsMealCameraOpen] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isLocalSpeaking, setIsLocalSpeaking] = useState(false);

  // Weather Effects State
  const [activeWeather, setActiveWeather] = useState<WeatherType>('SUNNY');
  const [isWeatherEffectEnabled, setIsWeatherEffectEnabled] = useState<boolean>(true);
  const [weatherIntensity, setWeatherIntensity] = useState<'SUBTLE' | 'MODERATE' | 'VIVID'>('MODERATE');

  // Mood Logs State
  const [moodLogs, setMoodLogs] = useState<MoodLogEntry[]>(() => {
    try {
      const saved = localStorage.getItem('medicare_mood_logs_v2');
      return saved ? JSON.parse(saved) : INITIAL_MOOD_LOGS;
    } catch {
      return INITIAL_MOOD_LOGS;
    }
  });

  // Persistent Documents State
  const [documents, setDocuments] = useState<MedicalDocument[]>(() => {
    try {
      const saved = localStorage.getItem('medicare_documents_v2');
      return saved ? JSON.parse(saved) : INITIAL_DOCUMENTS;
    } catch {
      return INITIAL_DOCUMENTS;
    }
  });

  // Persistent Care Plan State
  const [carePlan, setCarePlan] = useState<FullCarePlan>(() => {
    try {
      const saved = localStorage.getItem('medicare_careplan_v2');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (!parsed.problemDiets || parsed.problemDiets.length === 0) {
          parsed.problemDiets = INITIAL_CARE_PLAN.problemDiets;
        }
        if (parsed.patientName === 'Alex Morgan' || parsed.patientName === 'Alex' || !parsed.patientName) {
          parsed.patientName = 'Kanika';
        }
        return parsed;
      }
      return INITIAL_CARE_PLAN;
    } catch {
      return INITIAL_CARE_PLAN;
    }
  });

  // Smartwatch Live Biometrics State
  const [watchData, setWatchData] = useState<SmartwatchData>(() => {
    try {
      const saved = localStorage.getItem('medicare_watch_telemetry_v2');
      return saved ? JSON.parse(saved) : INITIAL_SMARTWATCH_DATA;
    } catch {
      return INITIAL_SMARTWATCH_DATA;
    }
  });

  // Meal Photo AI Logs State
  const [mealLogs, setMealLogs] = useState<MealPhotoLog[]>(() => {
    try {
      const saved = localStorage.getItem('medicare_meal_photos_v2');
      return saved ? JSON.parse(saved) : INITIAL_MEAL_LOGS;
    } catch {
      return INITIAL_MEAL_LOGS;
    }
  });

  // Save to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('medicare_documents_v2', JSON.stringify(documents));
    } catch (e) {
      console.error('Error saving documents to localStorage:', e);
    }
  }, [documents]);

  useEffect(() => {
    try {
      localStorage.setItem('medicare_careplan_v2', JSON.stringify(carePlan));
    } catch (e) {
      console.error('Error saving carePlan to localStorage:', e);
    }
  }, [carePlan]);

  useEffect(() => {
    try {
      localStorage.setItem('medicare_mood_logs_v2', JSON.stringify(moodLogs));
    } catch (e) {
      console.error('Error saving moodLogs to localStorage:', e);
    }
  }, [moodLogs]);

  useEffect(() => {
    try {
      localStorage.setItem('medicare_watch_telemetry_v2', JSON.stringify(watchData));
    } catch (e) {
      console.error('Error saving watch telemetry:', e);
    }
  }, [watchData]);

  useEffect(() => {
    try {
      localStorage.setItem('medicare_meal_photos_v2', JSON.stringify(mealLogs));
    } catch (e) {
      console.error('Error saving meal photos:', e);
    }
  }, [mealLogs]);

  // Clean up speech synthesis on unmount
  useEffect(() => {
    return () => {
      cancelSpeech();
    };
  }, []);

  // Medication Checkbox Toggle
  const handleToggleMedication = (slot: TimeSlot, medId: string) => {
    setCarePlan((prev) => {
      const updatedTimetable = prev.dailyTimetable.map((slotItem) => {
        if (slotItem.slot !== slot) return slotItem;
        return {
          ...slotItem,
          medications: slotItem.medications.map((m) => {
            if (m.medId !== medId) return m;
            const willBeTaken = !m.taken;
            return {
              ...m,
              taken: willBeTaken,
              takenAt: willBeTaken
                ? new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                : undefined,
            };
          }),
        };
      });

      return {
        ...prev,
        dailyTimetable: updatedTimetable,
      };
    });
  };

  // Add Document and Synthesize
  const handleAddDocument = async (newDoc: MedicalDocument, analyzeImmediately: boolean) => {
    const updatedDocs = [newDoc, ...documents];
    setDocuments(updatedDocs);

    if (analyzeImmediately) {
      await synthesizeCarePlan(updatedDocs);
    }
  };

  // Delete Document
  const handleDeleteDocument = (docId: string) => {
    const updated = documents.filter((d) => d.id !== docId);
    setDocuments(updated);
  };

  // Re-synthesize Care Plan from stored documents
  const synthesizeCarePlan = async (docsList: MedicalDocument[]) => {
    setIsAnalyzing(true);
    try {
      const res = await fetch('/api/synthesize-care-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          documents: docsList,
          patientName: carePlan.patientName || 'Alex Morgan',
        }),
      });

      const json = await res.json();
      if (json.success && json.carePlan) {
        setCarePlan(json.carePlan);
      }
    } catch (err) {
      console.error('Failed to synthesize care plan:', err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Log a refill
  const handleRefillMedication = (medId: string, pillCount: number) => {
    setCarePlan((prev) => {
      const updatedMeds = prev.medications.map((med) => {
        if (med.id !== medId) return med;
        const newRemaining = med.pillsRemaining + pillCount;
        const dailyDose = med.dailyDoseCount || 1;
        const daysLeft = Math.floor(newRemaining / dailyDose);

        const newAlert: 'CRITICAL' | 'WARNING' | 'GOOD' =
          daysLeft <= 3 ? 'CRITICAL' : daysLeft <= 7 ? 'WARNING' : 'GOOD';

        const futureDate = new Date();
        futureDate.setDate(futureDate.getDate() + daysLeft);
        const restockByDate = futureDate.toISOString().split('T')[0];

        return {
          ...med,
          pillsRemaining: newRemaining,
          daysRemaining: daysLeft,
          restockAlertLevel: newAlert,
          restockByDate,
        };
      });

      return {
        ...prev,
        medications: updatedMeds,
      };
    });
  };

  // Mood Log Actions
  const handleAddMoodLog = (entry: Omit<MoodLogEntry, 'id'>) => {
    const newEntry: MoodLogEntry = {
      ...entry,
      id: `mood-${Date.now()}`,
    };
    setMoodLogs((prev) => [newEntry, ...prev]);
  };

  const handleDeleteMoodLog = (id: string) => {
    setMoodLogs((prev) => prev.filter((m) => m.id !== id));
  };

  // Meal Log Add Action
  const handleSaveMealLog = (newLog: MealPhotoLog) => {
    setMealLogs((prev) => [newLog, ...prev]);
  };

  // Reset to default rich data
  const handleResetToDefault = () => {
    if (window.confirm('Reset all medical records, smartwatch telemetry, and mood logs to standard diabetic/depression persona?')) {
      setDocuments(INITIAL_DOCUMENTS);
      setCarePlan(INITIAL_CARE_PLAN);
      setMoodLogs(INITIAL_MOOD_LOGS);
      setWatchData(INITIAL_SMARTWATCH_DATA);
      setMealLogs(INITIAL_MEAL_LOGS);
      localStorage.removeItem('medicare_documents_v2');
      localStorage.removeItem('medicare_careplan_v2');
      localStorage.removeItem('medicare_mood_logs_v2');
      localStorage.removeItem('medicare_watch_telemetry_v2');
      localStorage.removeItem('medicare_meal_photos_v2');
    }
  };

  const primaryDoctor =
    carePlan.emergencyContacts.find((c) => c.isPrimaryDoctor) || carePlan.emergencyContacts[0];

  const criticalRestocks = carePlan.medications.filter(
    (m) => m.restockAlertLevel === 'CRITICAL' || m.restockAlertLevel === 'WARNING'
  );
  const criticalRestocksCount = criticalRestocks.length;
  const criticalRestockNames = criticalRestocks.map(
    (m) => `${m.name} (${m.daysRemaining} days left)`
  );

  // Voice Read Aloud using simple browser voice for timetable item click
  const handleSpeakText = (text: string) => {
    setIsLocalSpeaking(true);
    speakWithFemaleMetroVoice(text, () => {
      setIsLocalSpeaking(false);
    });
  };

  const handleStopSpeaking = () => {
    cancelSpeech();
    setIsLocalSpeaking(false);
  };

  return (
    <div
      id="medicare-routine-root"
      className="min-h-screen bg-slate-50 text-slate-900 flex flex-col antialiased relative"
    >
      {/* Dynamic Animated Weather Effects Overlay */}
      <div className="print:hidden">
        <WeatherCanvasEffect
          weather={activeWeather}
          isEnabled={isWeatherEffectEnabled}
          intensity={weatherIntensity}
        />
      </div>

      {/* Header */}
      <div className="print:hidden">
        <Header
          primaryDoctor={primaryDoctor}
          patientName={carePlan.patientName}
          onOpenEmergencyModal={() => setIsEmergencyModalOpen(true)}
          criticalRestocksCount={criticalRestocksCount}
          onOpenDailyUpdate={() => setIsDailyUpdateOpen(true)}
          allergies={carePlan.allergies}
          watchConnected={watchData.connected}
          onSelectWatchTab={() => setActiveTab('WATCH_TELEMETRY')}
        />
      </div>

      {/* Navigation */}
      <div className="print:hidden">
        <Navigation
          activeTab={activeTab}
          onTabChange={setActiveTab}
          documentCount={documents.length}
          medicationCount={carePlan.medications.length}
          restockWarningCount={criticalRestocksCount}
          moodCount={moodLogs.length}
          watchConnected={watchData.connected}
          mealPhotoCount={mealLogs.length}
        />
      </div>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8 relative z-10 print:p-0 print:m-0 print:max-w-none space-y-6">
        {/* Cinematic High-Tech Hero Banner */}
        <div className="print:hidden">
          <CinematicHeroBanner
            patientName={carePlan.patientName}
            glucoseSpikeMgDl={watchData.cgmGlucoseMgDl}
            bpReading="138/88 mmHg"
            watchData={watchData}
            criticalRestockCount={criticalRestocksCount}
            onOpenDailyUpdate={() => setIsDailyUpdateOpen(true)}
            onOpenMealCamera={() => setIsMealCameraOpen(true)}
          />
        </div>

        {/* TAB 1: DAILY TIMETABLE */}
        {activeTab === 'TIMETABLE' && (
          <TimetableTab
            schedule={carePlan.dailyTimetable}
            onToggleMedication={handleToggleMedication}
            onSpeakText={handleSpeakText}
            onOpenEmergencyModal={() => setIsEmergencyModalOpen(true)}
            lastAnalyzed={carePlan.lastAnalyzed}
          />
        )}

        {/* TAB 2: SMARTWATCH TELEMETRY */}
        {activeTab === 'WATCH_TELEMETRY' && (
          <WatchTelemetryTab
            watchData={watchData}
            onUpdateWatchData={setWatchData}
            onOpenJarvisHUD={() => setIsDailyUpdateOpen(true)}
          />
        )}

        {/* TAB 3: MEDICAL DOCUMENTS & LABS */}
        {activeTab === 'DOCUMENTS' && (
          <DocumentsTab
            documents={documents}
            onOpenAddModal={() => setIsAddDocModalOpen(true)}
            onDeleteDocument={handleDeleteDocument}
            onReanalyzeAll={() => synthesizeCarePlan(documents)}
            isAnalyzing={isAnalyzing}
            onResetToDefault={handleResetToDefault}
            carePlan={carePlan}
            moodLogs={moodLogs}
          />
        )}

        {/* TAB 4: MEDICATIONS & RESTOCK ALERTS */}
        {activeTab === 'MEDICATIONS' && (
          <MedicationsTab
            medications={carePlan.medications}
            onRefillMedication={handleRefillMedication}
            onOpenEmergencyModal={() => setIsEmergencyModalOpen(true)}
          />
        )}

        {/* TAB 5: EATING HABITS & MEAL CAMERA */}
        {activeTab === 'EATING_HABITS' && (
          <EatingHabitsTab
            eatingHabits={carePlan.eatingHabits}
            problemDiets={carePlan.problemDiets || INITIAL_CARE_PLAN.problemDiets}
            onSpeakText={handleSpeakText}
            onOpenMealCamera={() => setIsMealCameraOpen(true)}
            mealLogs={mealLogs}
          />
        )}

        {/* TAB 6: DOCTOR'S EXECUTIVE SUMMARY REPORT */}
        {activeTab === 'DOCTOR_REPORT' && (
          <DoctorReportTab
            carePlan={carePlan}
            watchData={watchData}
            mealLogs={mealLogs}
            documents={documents}
            currentGlucoseMgDl={watchData.cgmGlucoseMgDl}
          />
        )}

        {/* TAB 7: MOOD & WEATHER ENVIRONMENT TRACKER */}
        {activeTab === 'MOOD_TRACKER' && (
          <MoodTrackerTab
            moodLogs={moodLogs}
            onAddMoodLog={handleAddMoodLog}
            onDeleteMoodLog={handleDeleteMoodLog}
            activeWeather={activeWeather}
            onChangeActiveWeather={setActiveWeather}
            isWeatherEffectEnabled={isWeatherEffectEnabled}
            onToggleWeatherEffect={() => setIsWeatherEffectEnabled(!isWeatherEffectEnabled)}
            weatherIntensity={weatherIntensity}
            onChangeWeatherIntensity={setWeatherIntensity}
            onSpeakText={handleSpeakText}
          />
        )}

        {/* TAB 8: EMERGENCY DIRECT LINE & REAL CALL TIMER */}
        {activeTab === 'EMERGENCY' && (
          <EmergencyTab
            carePlan={carePlan}
            onOpenEmergencyModal={() => setIsEmergencyModalOpen(true)}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-4 px-4 sm:px-6 text-center text-xs text-slate-500 print:hidden">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>MediCare Routine • High-Tech Autonomous Health Console</span>
          <span>
            Emergency Doctor Line:{' '}
            <a
              href={`tel:${primaryDoctor?.primaryPhone?.replace(/[^0-9+]/g, '') || '+15552348900'}`}
              className="text-red-600 font-bold hover:underline"
            >
              {primaryDoctor?.primaryPhone || '+1 (555) 234-8900'}
            </a>
          </span>
        </div>
      </footer>

      {/* TODAY'S COMPLETE DAILY HEALTH UPDATE MODAL */}
      <DailyUpdateModal
        isOpen={isDailyUpdateOpen}
        onClose={() => setIsDailyUpdateOpen(false)}
        patientName={carePlan.patientName || 'Kanika'}
        glucoseSpikeMgDl={watchData.cgmGlucoseMgDl}
        bpReading="138/88 mmHg"
        watchData={watchData}
        criticalRestockNames={criticalRestockNames}
        nextAppointment="Dec 12, 2026 - Apex Specialty Clinic (Dr. Sarah Jenkins)"
        phq9Score={16}
        onOpenEmergencyModal={() => {
          setIsDailyUpdateOpen(false);
          setIsEmergencyModalOpen(true);
        }}
      />

      {/* MEAL PHOTO ANALYZER & DIETARY PLAN MATCHER MODAL */}
      <MealPhotoAnalyzerModal
        isOpen={isMealCameraOpen}
        onClose={() => setIsMealCameraOpen(false)}
        onRecordMeal={handleSaveMealLog}
      />

      {/* DIRECT DOCTOR EMERGENCY CALL MODAL (WITH REAL CALL TIMER) */}
      <EmergencyModal
        isOpen={isEmergencyModalOpen}
        onClose={() => setIsEmergencyModalOpen(false)}
        contacts={carePlan.emergencyContacts}
        primaryDoctor={primaryDoctor}
        allergies={carePlan.allergies}
      />

      {/* UPLOAD & ADD DOCUMENT MODAL */}
      <AddDocumentModal
        isOpen={isAddDocModalOpen}
        onClose={() => setIsAddDocModalOpen(false)}
        onAddDocument={handleAddDocument}
      />
    </div>
  );
}

export default App;
