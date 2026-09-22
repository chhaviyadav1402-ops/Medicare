export type DocumentCategory = 'PAST_HISTORY' | 'RECENT_VISIT' | 'PRESCRIPTION' | 'LAB_REPORT';

export interface MedicalDocument {
  id: string;
  title: string;
  category: DocumentCategory;
  doctorName: string;
  doctorPhone: string;
  clinicOrHospital: string;
  date: string;
  doctorNotesRaw: string;
  diagnoses: string[];
  allergiesNoted?: string[];
  fileUrl?: string;
  fileType?: string;
  fileName?: string;
  createdAt: string;
}

export type TimeSlot = 'MORNING' | 'AFTERNOON' | 'EVENING' | 'BEDTIME';

export type RestockStatus = 'CRITICAL' | 'WARNING' | 'GOOD';

export interface MedicationItem {
  id: string;
  name: string;
  genericName?: string;
  dosage: string;
  form: 'Tablet' | 'Capsule' | 'Syrup' | 'Injection' | 'Inhaler' | 'Drops' | 'Cream';
  conditionTreated: string;
  timingSlot: TimeSlot;
  exactTime: string;
  relationToMeal: 'Before Meal' | 'With Meal' | 'After Meal' | 'Empty Stomach' | 'Anytime';
  specialInstructions: string;
  pillsRemaining: number;
  totalPackSize: number;
  dailyDoseCount: number;
  daysRemaining: number;
  restockAlertLevel: RestockStatus;
  restockByDate: string;
  prescribingDoctor: string;
  doctorPhone: string;
  sourceDocumentId?: string;
  particularDietForProblem?: string;
}

export interface ProblemDietMapping {
  id: string;
  problem: string; // The specific medical problem/condition
  severityOrTarget?: string; // Target biomarker or clinical status
  dietName: string; // Name of the particular diet
  prescribedDiet: string; // Detailed description of the diet plan
  foodsToEat: string[]; // Specific foods recommended
  foodsToAvoid: string[]; // Specific foods prohibited/restricted
  clinicalRationale: string; // Why this particular diet manages or heals this problem
  mealTimingAdvice: string; // When/how to eat in coordination with this problem
  prescribingDoctor?: string; // Attending doctor who recommended it
}

export interface EatingHabitGuideline {
  id: string;
  category: 'MEAL_TIMING' | 'FOODS_TO_EAT' | 'FOODS_TO_AVOID' | 'HYDRATION' | 'INTERACTION_ALERT';
  title: string;
  description: string;
  targetMeal: 'Breakfast' | 'Lunch' | 'Dinner' | 'Snacks' | 'All Day';
  prescribedReason: string;
  priority: 'MANDATORY' | 'RECOMMENDED';
  relatedProblem?: string;
}

export interface EmergencyContact {
  id: string;
  doctorName: string;
  specialty: string;
  hospitalOrClinic: string;
  primaryPhone: string;
  emergencyPhone?: string;
  clinicAddress: string;
  isPrimaryDoctor: boolean;
  messyConditionTriggers: string[];
  firstAidSteps: string[];
}

export interface TimetableMedicationCheck {
  medId: string;
  name: string;
  dosage: string;
  form: string;
  relationToMeal: string;
  exactTime: string;
  conditionTreated: string;
  instructions: string;
  taken: boolean;
  takenAt?: string;
  particularDietForProblem?: string;
}

export interface DailyScheduleSlot {
  slot: TimeSlot;
  label: string;
  timeRange: string;
  eatingGuidelines: string[];
  medications: TimetableMedicationCheck[];
  problemDietsInSlot?: { problem: string; diet: string }[];
}

export interface FullCarePlan {
  lastAnalyzed: string;
  patientName: string;
  summaryOverview: string;
  activeConditions: string[];
  allergies: string[];
  medications: MedicationItem[];
  eatingHabits: EatingHabitGuideline[];
  problemDiets: ProblemDietMapping[];
  dailyTimetable: DailyScheduleSlot[];
  emergencyContacts: EmergencyContact[];
  emergencyGuidance: {
    redFlagSymptoms: string[];
    urgentActions: string[];
  };
}

export type ActiveTab =
  | 'TIMETABLE'
  | 'DOCUMENTS'
  | 'MEDICATIONS'
  | 'EATING_HABITS'
  | 'MOOD_TRACKER'
  | 'WATCH_TELEMETRY'
  | 'DOCTOR_REPORT'
  | 'EMERGENCY';

export interface SmartwatchData {
  connected: boolean;
  deviceName: string;
  batteryLevel: number;
  heartRate: number;
  restingHeartRate: number;
  heartRateHistory: { time: string; bpm: number }[];
  steps: number;
  stepGoal: number;
  activeCalories: number;
  spO2: number;
  sleepHours: number;
  sleepQuality: 'Deep & Restful' | 'Fair' | 'Fragmented (Depressive Pattern)';
  sedentaryMinutes: number;
  sedentaryAlert: boolean;
  cgmGlucoseMgDl: number;
  glucoseTrend: 'STABLE' | 'RISING' | 'SPIKING' | 'FALLING';
  lastSync: string;
}

export interface MealPhotoLog {
  id: string;
  mealType: 'Breakfast' | 'Lunch' | 'Dinner' | 'Snack';
  timestamp: string;
  photoUrl: string;
  dishName: string;
  detectedFoods: string[];
  calories: number;
  carbsGrams: number;
  glycemicIndex: 'LOW' | 'MEDIUM' | 'HIGH';
  proteinGrams: number;
  fiberGrams: number;
  complianceScore: number; // 0 to 100
  isCompliantWithDiabeticDiet: boolean;
  glucoseSpikeRisk: 'MINIMAL' | 'MODERATE' | 'SEVERE';
  moodImpactNote: string;
  doctorFlag: boolean;
  aiRecommendation: string;
}

export interface EmergencyCallSession {
  inCall: boolean;
  callDurationSeconds: number;
  targetName: string;
  targetPhone: string;
  callType: 'PRIMARY_DOCTOR' | 'PSYCHIATRIST' | '911_DISPATCH';
  audioMuted: boolean;
  speakerOn: boolean;
  dispatchAddress: string;
  callStartedAt?: string;
}

export type WeatherType =
  | 'SUNNY'
  | 'PARTLY_CLOUDY'
  | 'RAINY'
  | 'THUNDERSTORM'
  | 'SNOWY'
  | 'WINDY'
  | 'MISTY';

export type MoodScore =
  | 'VIBRANT'
  | 'CALM'
  | 'TIRED'
  | 'ANXIOUS'
  | 'LOW'
  | 'IRRITABLE';

export interface MoodLogEntry {
  id: string;
  date: string; // YYYY-MM-DD
  time: string; // e.g. "09:30 AM"
  mood: MoodScore;
  moodRating: number; // 1 to 5
  weather: WeatherType;
  temperature: string; // e.g. "23°C / 73°F"
  energyLevel: number; // 1 to 5
  sleepQuality: 'POOR' | 'FAIR' | 'GOOD' | 'EXCELLENT';
  physicalFeelings: string[];
  notes?: string;
  medsTakenOnTime: boolean;
  weatherHealthImpact?: string;
}
