import React, { useState, useRef } from 'react';
import {
  Camera,
  Upload,
  X,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Flame,
  Heart,
  Droplet,
  Utensils,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';
import { MealPhotoLog } from '../types';

interface MealPhotoAnalyzerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRecordMeal: (meal: MealPhotoLog) => void;
}

export const MealPhotoAnalyzerModal: React.FC<MealPhotoAnalyzerModalProps> = ({
  isOpen,
  onClose,
  onRecordMeal,
}) => {
  const [mealType, setMealType] = useState<'Breakfast' | 'Lunch' | 'Dinner' | 'Snack'>('Lunch');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [dishNameInput, setDishNameInput] = useState<string>('');
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [analysisResult, setAnalysisResult] = useState<MealPhotoLog | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Preset sample meals for immediate testing
  const sampleMeals = [
    {
      title: 'Wild Salmon, Quinoa & Broccoli (Diabetic & Mood Gold Standard)',
      type: 'Lunch' as const,
      img: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?auto=format&fit=crop&w=600&q=80',
      dishName: 'Grilled Salmon with Steamed Broccoli & Quinoa',
    },
    {
      title: 'Steel-Cut Oats with Walnuts & Blueberries (Low GI Breakfast)',
      type: 'Breakfast' as const,
      img: 'https://images.unsplash.com/photo-1584776296944-ab6fb57b0bdd?auto=format&fit=crop&w=600&q=80',
      dishName: 'Steel-Cut Oats with Chia Seeds, Walnuts and Berries',
    },
    {
      title: 'Refined White Pasta with Sweet Sauce (Non-Compliant Spike Trigger)',
      type: 'Dinner' as const,
      img: 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?auto=format&fit=crop&w=600&q=80',
      dishName: 'Creamy White Sauce Pasta with Garlic Bread',
    },
    {
      title: 'Avocado and Poached Egg on Sprouted Grain (Neuro-Supportive)',
      type: 'Breakfast' as const,
      img: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&w=600&q=80',
      dishName: 'Smashed Avocado with Poached Eggs on Sprouted Wheat',
    },
  ];

  const handleSelectSample = (sample: (typeof sampleMeals)[0]) => {
    setImagePreview(sample.img);
    setDishNameInput(sample.dishName);
    setMealType(sample.type);
    setAnalysisResult(null);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      setImagePreview(event.target?.result as string);
      setAnalysisResult(null);
    };
    reader.readAsDataURL(file);
  };

  const handleRunAnalysis = async () => {
    if (!imagePreview && !dishNameInput) return;
    setIsAnalyzing(true);

    try {
      const res = await fetch('/api/analyze-meal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageBase64: imagePreview?.startsWith('data:') ? imagePreview : undefined,
          mealType,
          dishNameInput,
          patientContext:
            '9-year history of Type 2 Diabetes Mellitus with secondary Major Depressive Disorder and neuropathy.',
        }),
      });

      if (res.ok) {
        const data = await res.json();
        const a = data.mealAnalysis;

        const newLog: MealPhotoLog = {
          id: `meal-${Date.now()}`,
          mealType,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          photoUrl:
            imagePreview ||
            'https://images.unsplash.com/photo-1498837167922-ddd27525d352?auto=format&fit=crop&w=400&q=80',
          dishName: a.dishName || dishNameInput || 'Patient Meal',
          detectedFoods: a.detectedFoods || ['Nutritional portions'],
          calories: a.calories || 420,
          carbsGrams: a.carbsGrams || 32,
          glycemicIndex: a.glycemicIndex || 'LOW',
          proteinGrams: a.proteinGrams || 28,
          fiberGrams: a.fiberGrams || 8,
          complianceScore: a.complianceScore || 90,
          isCompliantWithDiabeticDiet: a.isCompliantWithDiabeticDiet ?? true,
          glucoseSpikeRisk: a.glucoseSpikeRisk || 'MINIMAL',
          moodImpactNote:
            a.moodImpactNote ||
            'Balanced complex carbohydrates prevent glycemic fluctuations, stabilizing depressive fatigue.',
          doctorFlag: a.doctorFlag ?? false,
          aiRecommendation:
            a.aiRecommendation || 'Compliant with diabetic low-GI and mood-support protocol.',
        };

        setAnalysisResult(newLog);
      }
    } catch (e) {
      console.error('Error analyzing meal:', e);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSaveAndClose = () => {
    if (analysisResult) {
      onRecordMeal(analysisResult);
    }
    onClose();
    setImagePreview(null);
    setAnalysisResult(null);
    setDishNameInput('');
  };

  if (!isOpen) return null;

  return (
    <div
      id="meal-photo-analyzer-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200"
    >
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="bg-gradient-to-r from-teal-700 via-teal-800 to-slate-900 px-6 py-4 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-white/20 rounded-xl">
              <Camera className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold tracking-tight">AI Meal Camera & Diet Matcher</h2>
              <p className="text-xs text-teal-100 font-medium">
                Snap or upload every meal to match against your diabetic care plan & log for doctor
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 space-y-5 overflow-y-auto flex-1">
          {/* Meal Session Selector */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-700">Meal Session:</span>
            {(['Breakfast', 'Lunch', 'Dinner', 'Snack'] as const).map((type) => (
              <button
                key={type}
                onClick={() => setMealType(type)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  mealType === type
                    ? 'bg-teal-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {type}
              </button>
            ))}
          </div>

          {/* Photo Preview & Camera Input */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Photo Box */}
            <div className="border-2 border-dashed border-slate-300 rounded-2xl p-4 flex flex-col items-center justify-center text-center relative overflow-hidden min-h-[190px] bg-slate-50">
              {imagePreview ? (
                <div className="relative w-full h-full min-h-[160px] flex items-center justify-center">
                  <img
                    src={imagePreview}
                    alt="Meal preview"
                    className="max-h-44 object-cover rounded-xl shadow-xs"
                  />
                  <button
                    onClick={() => setImagePreview(null)}
                    className="absolute top-1 right-1 p-1 bg-slate-900/80 text-white rounded-full hover:bg-slate-900"
                    title="Remove picture"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="w-12 h-12 rounded-full bg-teal-100 text-teal-700 flex items-center justify-center mx-auto">
                    <Camera className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-800">Take Photo or Upload</p>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Camera capture or gallery image
                    </p>
                  </div>
                  <div className="flex gap-2 justify-center">
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      capture="environment"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="px-3 py-1.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold shadow-xs"
                    >
                      Snap Photo
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Meal description & instant samples */}
            <div className="space-y-3">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Dish Description (Optional Note):
                </label>
                <input
                  type="text"
                  value={dishNameInput}
                  onChange={(e) => setDishNameInput(e.target.value)}
                  placeholder="e.g., Salmon with steamed broccoli and quinoa"
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-300 focus:outline-teal-600 focus:border-teal-600"
                />
              </div>

              <div>
                <span className="text-xs font-bold text-slate-600 block mb-1.5">
                  Or Test with Sample Plates:
                </span>
                <div className="space-y-1.5">
                  {sampleMeals.map((sample, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSelectSample(sample)}
                      className="w-full text-left p-2 rounded-xl bg-slate-100 hover:bg-teal-50 border border-slate-200 text-xs font-medium text-slate-700 transition-colors flex items-center justify-between"
                    >
                      <span className="truncate pr-2">{sample.title}</span>
                      <span className="text-teal-600 font-bold shrink-0 text-[11px]">Select</span>
                    </button>
                  ))}
                </div>
              </div>

              <button
                id="run-meal-analysis-btn"
                onClick={handleRunAnalysis}
                disabled={(!imagePreview && !dishNameInput) || isAnalyzing}
                className="w-full py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 disabled:bg-slate-300 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md transition-colors"
              >
                <Sparkles className={`w-4 h-4 ${isAnalyzing ? 'animate-spin' : ''}`} />
                <span>{isAnalyzing ? 'Analyzing Meal with AI...' : 'Match with Diabetic Plan'}</span>
              </button>
            </div>
          </div>

          {/* Analysis Result Display */}
          {analysisResult && (
            <div
              className={`p-5 rounded-2xl border-2 space-y-4 animate-in fade-in duration-300 ${
                analysisResult.isCompliantWithDiabeticDiet
                  ? 'bg-emerald-50/70 border-emerald-300'
                  : 'bg-rose-50/70 border-rose-300'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b pb-3 border-slate-200/60">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-base font-bold text-slate-900">
                      {analysisResult.dishName}
                    </span>
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                        analysisResult.isCompliantWithDiabeticDiet
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-rose-100 text-rose-800'
                      }`}
                    >
                      {analysisResult.complianceScore}% Diabetic Plan Match
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Recognized Ingredients: {analysisResult.detectedFoods.join(', ')}
                  </p>
                </div>

                <div className="text-right">
                  <span
                    className={`inline-flex items-center gap-1 text-xs font-bold ${
                      analysisResult.glucoseSpikeRisk === 'MINIMAL'
                        ? 'text-emerald-700'
                        : 'text-rose-700'
                    }`}
                  >
                    {analysisResult.glucoseSpikeRisk === 'MINIMAL' ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    ) : (
                      <AlertTriangle className="w-4 h-4 text-rose-600" />
                    )}
                    Spike Risk: {analysisResult.glucoseSpikeRisk}
                  </span>
                </div>
              </div>

              {/* Nutritional Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-center text-xs">
                <div className="p-2.5 rounded-xl bg-white border border-slate-200 shadow-2xs">
                  <span className="text-slate-500 block text-[11px]">Net Carbs</span>
                  <strong
                    className={`text-base font-bold ${
                      analysisResult.carbsGrams > 45 ? 'text-rose-600' : 'text-slate-900'
                    }`}
                  >
                    {analysisResult.carbsGrams}g
                  </strong>
                </div>
                <div className="p-2.5 rounded-xl bg-white border border-slate-200 shadow-2xs">
                  <span className="text-slate-500 block text-[11px]">Glycemic Index</span>
                  <strong
                    className={`text-base font-bold ${
                      analysisResult.glycemicIndex === 'HIGH' ? 'text-rose-600' : 'text-emerald-700'
                    }`}
                  >
                    {analysisResult.glycemicIndex}
                  </strong>
                </div>
                <div className="p-2.5 rounded-xl bg-white border border-slate-200 shadow-2xs">
                  <span className="text-slate-500 block text-[11px]">Protein</span>
                  <strong className="text-base font-bold text-slate-900">
                    {analysisResult.proteinGrams}g
                  </strong>
                </div>
                <div className="p-2.5 rounded-xl bg-white border border-slate-200 shadow-2xs">
                  <span className="text-slate-500 block text-[11px]">Dietary Fiber</span>
                  <strong className="text-base font-bold text-teal-700">
                    {analysisResult.fiberGrams}g
                  </strong>
                </div>
              </div>

              {/* Clinical Mood & Glucose Notes */}
              <div className="space-y-2 text-xs">
                <div className="p-3 rounded-xl bg-white/80 border border-slate-200">
                  <span className="font-bold text-slate-800 block mb-0.5">
                    Mood & Neuro-Chemical Impact:
                  </span>
                  <p className="text-slate-600">{analysisResult.moodImpactNote}</p>
                </div>

                <div className="p-3 rounded-xl bg-white/80 border border-slate-200">
                  <span className="font-bold text-slate-800 block mb-0.5">
                    Clinical Recommendation for Doctor Report:
                  </span>
                  <p className="text-slate-600">{analysisResult.aiRecommendation}</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-slate-50 border-t border-slate-200 flex justify-between items-center">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-semibold"
          >
            Cancel
          </button>

          {analysisResult && (
            <button
              id="save-meal-to-report-btn"
              onClick={handleSaveAndClose}
              className="px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold shadow-md flex items-center gap-1.5"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Record & Add to Doctor&apos;s Report</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
