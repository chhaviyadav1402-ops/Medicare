import React, { useState } from 'react';
import {
  Utensils,
  AlertTriangle,
  Heart,
  Droplets,
  ShieldCheck,
  Volume2,
  Clock,
  Sparkles,
  CheckCircle2,
  XCircle,
  Table,
  LayoutGrid,
  Search,
  Filter,
  Info,
  Activity,
  Apple,
  Ban,
  Stethoscope,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { EatingHabitGuideline, ProblemDietMapping, MealPhotoLog } from '../types';

interface EatingHabitsTabProps {
  eatingHabits: EatingHabitGuideline[];
  problemDiets?: ProblemDietMapping[];
  onSpeakText: (text: string) => void;
  onOpenMealCamera?: () => void;
  mealLogs?: MealPhotoLog[];
}

export const EatingHabitsTab: React.FC<EatingHabitsTabProps> = ({
  eatingHabits,
  problemDiets = [],
  onSpeakText,
  onOpenMealCamera,
  mealLogs = [],
}) => {
  const [selectedView, setSelectedView] = useState<'COLUMNS_TABLE' | 'CARDS' | 'ALL_GUIDELINES'>('COLUMNS_TABLE');
  const [problemSearch, setProblemSearch] = useState('');
  const [selectedProblemFilter, setSelectedProblemFilter] = useState<string>('ALL');
  const [expandedDietId, setExpandedDietId] = useState<string | null>(null);

  const getCategoryIcon = (cat: string) => {
    switch (cat) {
      case 'INTERACTION_ALERT':
        return <AlertTriangle className="w-5 h-5 text-rose-600" />;
      case 'FOODS_TO_AVOID':
        return <XCircle className="w-5 h-5 text-red-600" />;
      case 'FOODS_TO_EAT':
        return <CheckCircle2 className="w-5 h-5 text-emerald-600" />;
      case 'HYDRATION':
        return <Droplets className="w-5 h-5 text-blue-600" />;
      case 'MEAL_TIMING':
      default:
        return <Clock className="w-5 h-5 text-amber-600" />;
    }
  };

  const getCategoryBorder = (cat: string) => {
    switch (cat) {
      case 'INTERACTION_ALERT':
        return 'border-rose-300 bg-rose-50/40';
      case 'FOODS_TO_AVOID':
        return 'border-red-200 bg-red-50/30';
      case 'FOODS_TO_EAT':
        return 'border-emerald-200 bg-emerald-50/30';
      case 'HYDRATION':
        return 'border-blue-200 bg-blue-50/30';
      case 'MEAL_TIMING':
      default:
        return 'border-amber-200 bg-amber-50/30';
    }
  };

  const filteredProblemDiets = problemDiets.filter((pd) => {
    if (selectedProblemFilter !== 'ALL' && !pd.problem.toLowerCase().includes(selectedProblemFilter.toLowerCase())) {
      return false;
    }
    if (problemSearch) {
      const q = problemSearch.toLowerCase();
      const inProblem = pd.problem.toLowerCase().includes(q);
      const inDietName = pd.dietName.toLowerCase().includes(q);
      const inPrescribed = pd.prescribedDiet.toLowerCase().includes(q);
      const inEat = pd.foodsToEat.some((f) => f.toLowerCase().includes(q));
      const inAvoid = pd.foodsToAvoid.some((f) => f.toLowerCase().includes(q));
      return inProblem || inDietName || inPrescribed || inEat || inAvoid;
    }
    return true;
  });

  const handleSpeakProblemDiet = (pd: ProblemDietMapping) => {
    const text = `Diet plan for medical problem: ${pd.problem}. Prescribed diet: ${pd.dietName}. ${pd.prescribedDiet}. Foods to eat include: ${pd.foodsToEat.join(', ')}. Foods strictly to avoid include: ${pd.foodsToAvoid.join(', ')}. Clinical rationale: ${pd.clinicalRationale}. Meal timing advice: ${pd.mealTimingAdvice}`;
    onSpeakText(text);
  };

  const handleSpeakAllHabits = () => {
    const dietsSummary = problemDiets
      .map((d) => `For ${d.problem}, the doctor prescribes ${d.dietName}. Foods to eat: ${d.foodsToEat.slice(0, 2).join(' and ')}. Avoid: ${d.foodsToAvoid.slice(0, 2).join(' and ')}.`)
      .join(' ');
    onSpeakText(`Doctor's Particular Diet According to Problem Guide: ${dietsSummary}`);
  };

  const toggleExpand = (id: string) => {
    setExpandedDietId((prev) => (prev === id ? null : id));
  };

  return (
    <div id="eating-habits-tab" className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-teal-700">
              <Utensils className="w-4 h-4" />
              <span>Medical Nutrition & Condition Management</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mt-1">
              Particular Diet According to Problem
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
              Doctor-prescribed nutrition matrices mapping each specific health problem to its exact diet, foods to eat, foods strictly avoided, and clinical drug-food rules.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            {onOpenMealCamera && (
              <button
                id="diet-tab-take-meal-pic-btn"
                onClick={onOpenMealCamera}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs sm:text-sm shadow-sm transition-colors cursor-pointer"
                title="Take picture of meal to match against dietary plan"
              >
                <Sparkles className="w-4 h-4" />
                <span>Take Meal Photo (AI Match)</span>
              </button>
            )}

            <button
              id="read-diet-aloud-btn"
              onClick={handleSpeakAllHabits}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-teal-50 hover:bg-teal-100 text-teal-800 font-bold text-xs sm:text-sm border border-teal-200 transition-colors cursor-pointer"
              title="Listen to diet according to problem guide aloud"
            >
              <Volume2 className="w-4 h-4 text-teal-600" />
              <span>Read Diets Aloud</span>
            </button>
          </div>
        </div>

        {/* View Switcher & Search Bar */}
        <div className="mt-5 pt-5 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl w-fit">
            <button
              id="view-table-btn"
              onClick={() => setSelectedView('COLUMNS_TABLE')}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                selectedView === 'COLUMNS_TABLE'
                  ? 'bg-white text-teal-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Table className="w-3.5 h-3.5" />
              <span>Table Columns View</span>
            </button>
            <button
              id="view-cards-btn"
              onClick={() => setSelectedView('CARDS')}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                selectedView === 'CARDS'
                  ? 'bg-white text-teal-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span>Condition Cards</span>
            </button>
            <button
              id="view-guidelines-btn"
              onClick={() => setSelectedView('ALL_GUIDELINES')}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                selectedView === 'ALL_GUIDELINES'
                  ? 'bg-white text-teal-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Meal Timing Directives</span>
            </button>
          </div>

          <div className="relative flex-1 max-w-xs">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              id="problem-diet-search-input"
              type="text"
              placeholder="Search problem, food, or diet..."
              value={problemSearch}
              onChange={(e) => setProblemSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white"
            />
          </div>
        </div>
      </div>

      {/* PRIMARY VIEW 1: DEDICATED COLUMNS TABLE FOR PARTICULAR DIET ACCORDING TO PROBLEM */}
      {selectedView === 'COLUMNS_TABLE' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="p-4 sm:p-5 border-b border-slate-100 bg-slate-50/70 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="font-bold text-slate-900 text-base sm:text-lg flex items-center gap-2">
                <Table className="w-4 h-4 text-teal-700" />
                <span>Dietary Matrix: Particular Diet According to Problem</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Structured column comparison showing what each specific medical condition requires you to eat and avoid.
              </p>
            </div>

            <div className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-teal-100/70 text-teal-900 self-start sm:self-center">
              {filteredProblemDiets.length} Problems Mapped
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[900px]" id="problem-diet-column-table">
              <thead>
                <tr className="bg-slate-100/80 text-slate-700 text-xs uppercase tracking-wider font-bold border-b border-slate-200">
                  <th className="py-3.5 px-4 w-[22%]">
                    <div className="flex items-center gap-1.5">
                      <Activity className="w-3.5 h-3.5 text-teal-700" />
                      <span>Health Problem / Condition</span>
                    </div>
                  </th>
                  <th className="py-3.5 px-4 w-[24%]">
                    <div className="flex items-center gap-1.5">
                      <Utensils className="w-3.5 h-3.5 text-teal-700" />
                      <span>Particular Prescribed Diet</span>
                    </div>
                  </th>
                  <th className="py-3.5 px-4 w-[20%]">
                    <div className="flex items-center gap-1.5 text-emerald-800">
                      <Apple className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Foods to Eat (Include)</span>
                    </div>
                  </th>
                  <th className="py-3.5 px-4 w-[18%]">
                    <div className="flex items-center gap-1.5 text-rose-800">
                      <Ban className="w-3.5 h-3.5 text-rose-600" />
                      <span>Foods to Strictly Avoid</span>
                    </div>
                  </th>
                  <th className="py-3.5 px-4 w-[16%]">
                    <div className="flex items-center gap-1.5">
                      <Stethoscope className="w-3.5 h-3.5 text-teal-700" />
                      <span>Doctor Rationale & Timing</span>
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs sm:text-sm">
                {filteredProblemDiets.map((pd, index) => (
                  <tr
                    key={pd.id}
                    id={`problem-diet-row-${pd.id}`}
                    className={`hover:bg-teal-50/20 transition-colors ${
                      index % 2 === 0 ? 'bg-white' : 'bg-slate-50/40'
                    }`}
                  >
                    {/* COLUMN 1: Problem / Condition */}
                    <td className="py-4 px-4 align-top">
                      <div className="space-y-1">
                        <div className="font-bold text-slate-900 flex items-start gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-teal-600 mt-1.5 shrink-0" />
                          <span className="leading-snug">{pd.problem}</span>
                        </div>
                        {pd.severityOrTarget && (
                          <div className="text-[11px] font-semibold text-teal-800 bg-teal-50 px-2 py-0.5 rounded border border-teal-200/70 inline-block">
                            {pd.severityOrTarget}
                          </div>
                        )}
                        {pd.prescribingDoctor && (
                          <div className="text-[11px] text-slate-500 pt-0.5">
                            Doc: {pd.prescribingDoctor}
                          </div>
                        )}
                        <button
                          onClick={() => handleSpeakProblemDiet(pd)}
                          className="text-[11px] text-teal-700 hover:text-teal-900 font-bold inline-flex items-center gap-1 mt-1 hover:underline"
                        >
                          <Volume2 className="w-3 h-3" />
                          <span>Listen</span>
                        </button>
                      </div>
                    </td>

                    {/* COLUMN 2: Particular Prescribed Diet */}
                    <td className="py-4 px-4 align-top">
                      <div className="space-y-1.5">
                        <span className="inline-block text-xs font-bold px-2.5 py-0.5 rounded-md bg-amber-100 text-amber-900 border border-amber-300">
                          {pd.dietName}
                        </span>
                        <p className="text-xs text-slate-700 leading-relaxed font-medium">
                          {pd.prescribedDiet}
                        </p>
                      </div>
                    </td>

                    {/* COLUMN 3: Foods to Eat (What to Include) */}
                    <td className="py-4 px-4 align-top bg-emerald-50/20">
                      <ul className="space-y-1 text-xs text-slate-800">
                        {pd.foodsToEat.map((food, fIdx) => (
                          <li key={fIdx} className="flex items-start gap-1.5">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                            <span className="leading-tight">{food}</span>
                          </li>
                        ))}
                      </ul>
                    </td>

                    {/* COLUMN 4: Foods Strictly Avoided (What Not to Eat) */}
                    <td className="py-4 px-4 align-top bg-rose-50/20">
                      <ul className="space-y-1 text-xs text-rose-950 font-medium">
                        {pd.foodsToAvoid.map((food, fIdx) => (
                          <li key={fIdx} className="flex items-start gap-1.5">
                            <XCircle className="w-3.5 h-3.5 text-rose-600 shrink-0 mt-0.5" />
                            <span className="leading-tight">{food}</span>
                          </li>
                        ))}
                      </ul>
                    </td>

                    {/* COLUMN 5: Doctor Rationale & Timing Rule */}
                    <td className="py-4 px-4 align-top">
                      <div className="space-y-2">
                        <div className="text-xs text-slate-600 bg-white p-2.5 rounded-xl border border-slate-200">
                          <strong className="text-slate-800 block text-[11px] uppercase tracking-wider mb-0.5">
                            Clinical Rationale
                          </strong>
                          <span className="leading-relaxed">{pd.clinicalRationale}</span>
                        </div>
                        {pd.mealTimingAdvice && (
                          <div className="text-[11px] text-teal-900 bg-teal-50/60 p-2 rounded-lg border border-teal-200/80">
                            <strong>Timing:</strong> {pd.mealTimingAdvice}
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* VIEW 2: CONDITION CARDS (EXPANDABLE) */}
      {selectedView === 'CARDS' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredProblemDiets.map((pd) => {
            const isExpanded = expandedDietId === pd.id;

            return (
              <div
                key={pd.id}
                id={`problem-card-${pd.id}`}
                className="bg-white rounded-2xl border border-slate-200 hover:border-teal-300 p-5 shadow-xs transition-all space-y-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className="text-xs font-bold px-2 py-0.5 rounded bg-teal-50 text-teal-800 border border-teal-200">
                      Problem Specific Diet
                    </span>
                    <h3 className="text-base sm:text-lg font-bold text-slate-900 mt-1 leading-snug">
                      {pd.problem}
                    </h3>
                    {pd.severityOrTarget && (
                      <div className="text-xs font-semibold text-slate-500 mt-0.5">
                        {pd.severityOrTarget}
                      </div>
                    )}
                  </div>

                  <button
                    onClick={() => handleSpeakProblemDiet(pd)}
                    className="p-2 rounded-lg text-teal-700 hover:bg-teal-50 border border-teal-200 transition-colors shrink-0"
                    title="Listen to diet for this problem"
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="bg-amber-50/80 border border-amber-200/80 rounded-xl p-3">
                  <div className="text-xs font-bold text-amber-900 uppercase tracking-wide">
                    Particular Diet Prescribed:
                  </div>
                  <div className="text-sm font-bold text-slate-900 mt-0.5">{pd.dietName}</div>
                  <p className="text-xs text-slate-700 mt-1">{pd.prescribedDiet}</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <div className="bg-emerald-50/50 border border-emerald-200 rounded-xl p-3 space-y-2">
                    <div className="text-xs font-bold text-emerald-900 flex items-center gap-1.5 uppercase tracking-wide">
                      <Apple className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Foods to Eat</span>
                    </div>
                    <ul className="space-y-1 text-xs text-slate-800">
                      {pd.foodsToEat.slice(0, isExpanded ? pd.foodsToEat.length : 3).map((f, i) => (
                        <li key={i} className="flex items-start gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                          <span>{f}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="bg-rose-50/50 border border-rose-200 rounded-xl p-3 space-y-2">
                    <div className="text-xs font-bold text-rose-900 flex items-center gap-1.5 uppercase tracking-wide">
                      <Ban className="w-3.5 h-3.5 text-rose-600" />
                      <span>Foods to Avoid</span>
                    </div>
                    <ul className="space-y-1 text-xs text-rose-950 font-medium">
                      {pd.foodsToAvoid.slice(0, isExpanded ? pd.foodsToAvoid.length : 3).map((f, i) => (
                        <li key={i} className="flex items-start gap-1">
                          <XCircle className="w-3.5 h-3.5 text-rose-600 shrink-0 mt-0.5" />
                          <span>{f}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="text-xs text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-200">
                  <strong className="text-slate-800">Why Doctor Prescribed It:</strong>{' '}
                  <span>{pd.clinicalRationale}</span>
                </div>

                <div className="flex items-center justify-between pt-1 text-xs">
                  <span className="text-slate-500 font-medium">
                    {pd.prescribingDoctor ? `Prescribed by ${pd.prescribingDoctor}` : 'Doctor Prescription'}
                  </span>
                  <button
                    onClick={() => toggleExpand(pd.id)}
                    className="text-teal-700 hover:text-teal-900 font-bold inline-flex items-center gap-1"
                  >
                    <span>{isExpanded ? 'Show Less' : 'View Full Food List'}</span>
                    {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* VIEW 3: GENERAL MEAL TIMING & INTERACTION DIRECTIVES */}
      {selectedView === 'ALL_GUIDELINES' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {eatingHabits.map((habit) => (
            <div
              key={habit.id}
              id={`eating-habit-${habit.id}`}
              className={`rounded-2xl border p-5 shadow-xs transition-all bg-white hover:shadow-sm ${getCategoryBorder(
                habit.category
              )}`}
            >
              <div className="flex items-start gap-3.5">
                <div className="p-2 rounded-xl bg-white shadow-xs shrink-0 mt-0.5">
                  {getCategoryIcon(habit.category)}
                </div>

                <div className="space-y-2 flex-1">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-white border border-slate-200 text-slate-700">
                      Meal: {habit.targetMeal}
                    </span>
                    {habit.priority === 'MANDATORY' && (
                      <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-rose-100 text-rose-800 border border-rose-200 uppercase">
                        Mandatory Rule
                      </span>
                    )}
                  </div>

                  <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
                    {habit.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                    {habit.description}
                  </p>

                  {habit.prescribedReason && (
                    <div className="text-xs text-slate-600 bg-white/80 p-2.5 rounded-xl border border-slate-200/80">
                      <strong className="text-teal-900">Clinical Reason:</strong>{' '}
                      <span>{habit.prescribedReason}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Daily Meal Companion Table */}
      <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200 shadow-xs space-y-4">
        <h3 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-teal-600" />
          Quick Daily Meal Timetable Reference
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-amber-50/60 p-4 rounded-xl border border-amber-200">
            <div className="font-bold text-sm text-amber-900 mb-1">🌅 Breakfast Window</div>
            <div className="text-xs text-amber-800 font-semibold mb-2">08:00 AM - 08:45 AM</div>
            <p className="text-xs text-slate-700">
              Do not skip. Whole grain oats or eggs. Take morning blood pressure medicine before meal; take diabetes tablet with food.
            </p>
          </div>

          <div className="bg-emerald-50/60 p-4 rounded-xl border border-emerald-200">
            <div className="font-bold text-sm text-emerald-900 mb-1">☀️ Lunch Window</div>
            <div className="text-xs text-emerald-800 font-semibold mb-2">12:30 PM - 01:30 PM</div>
            <p className="text-xs text-slate-700">
              Low-sodium steamed vegetables, brown rice, or lentils. Reach 1.5L of water intake by lunch time.
            </p>
          </div>

          <div className="bg-indigo-50/60 p-4 rounded-xl border border-indigo-200">
            <div className="font-bold text-sm text-indigo-900 mb-1">🌆 Dinner & Bedtime Window</div>
            <div className="text-xs text-indigo-800 font-semibold mb-2">07:30 PM - 08:30 PM</div>
            <p className="text-xs text-slate-700">
              Light meal 2.5 hours before sleeping. Take evening Metformin with dinner. Take cholesterol tablet at bedtime with plain water (no citrus/grapefruit).
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
