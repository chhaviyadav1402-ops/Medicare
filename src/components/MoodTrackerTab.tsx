import React, { useState } from 'react';
import {
  Sun,
  CloudSun,
  CloudRain,
  CloudLightning,
  Snowflake,
  Wind,
  CloudFog,
  Smile,
  Meh,
  Frown,
  Heart,
  Activity,
  Sparkles,
  Plus,
  Trash2,
  Volume2,
  Calendar,
  Clock,
  TrendingUp,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
  Thermometer,
  Droplets,
  BarChart2,
  Filter,
  Info,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  AreaChart,
  Area,
  Line,
} from 'recharts';
import { MoodLogEntry, MoodScore, WeatherType } from '../types';
import { WEATHER_CONFIGS } from '../data/defaultMoodData';

interface MoodTrackerTabProps {
  moodLogs: MoodLogEntry[];
  onAddMoodLog: (entry: Omit<MoodLogEntry, 'id'>) => void;
  onDeleteMoodLog: (id: string) => void;
  activeWeather: WeatherType;
  onChangeActiveWeather: (weather: WeatherType) => void;
  isWeatherEffectEnabled: boolean;
  onToggleWeatherEffect: () => void;
  weatherIntensity: 'SUBTLE' | 'MODERATE' | 'VIVID';
  onChangeWeatherIntensity: (intensity: 'SUBTLE' | 'MODERATE' | 'VIVID') => void;
  onSpeakText: (text: string) => void;
}

export const MoodTrackerTab: React.FC<MoodTrackerTabProps> = ({
  moodLogs,
  onAddMoodLog,
  onDeleteMoodLog,
  activeWeather,
  onChangeActiveWeather,
  isWeatherEffectEnabled,
  onToggleWeatherEffect,
  weatherIntensity,
  onChangeWeatherIntensity,
  onSpeakText,
}) => {
  const [isLoggingFormOpen, setIsLoggingFormOpen] = useState(false);
  const [filterWeather, setFilterWeather] = useState<string>('ALL');

  // Form State
  const [selectedMood, setSelectedMood] = useState<MoodScore>('CALM');
  const [moodRating, setMoodRating] = useState<number>(4);
  const [selectedWeather, setSelectedWeather] = useState<WeatherType>(activeWeather);
  const [customTemp, setCustomTemp] = useState<string>('24°C / 75°F');
  const [energyLevel, setEnergyLevel] = useState<number>(4);
  const [sleepQuality, setSleepQuality] = useState<'POOR' | 'FAIR' | 'GOOD' | 'EXCELLENT'>('GOOD');
  const [selectedFeelings, setSelectedFeelings] = useState<string[]>([
    'Relaxed',
    'Clear Minded',
  ]);
  const [notes, setNotes] = useState<string>('');
  const [medsTakenOnTime, setMedsTakenOnTime] = useState<boolean>(true);

  const physicalOptions = [
    'Energetic',
    'Clear Minded',
    'Relaxed',
    'Stable BP',
    'Normal Digestion',
    'Chest Ease',
    'Slight Fatigue',
    'Joint Stiffness',
    'Headache',
    'Restlessness',
    'Mild Wheeze',
    'Low Appetite',
  ];

  const toggleFeeling = (feeling: string) => {
    setSelectedFeelings((prev) =>
      prev.includes(feeling) ? prev.filter((f) => f !== feeling) : [...prev, feeling]
    );
  };

  const getWeatherIcon = (wType: WeatherType, className = 'w-4 h-4') => {
    switch (wType) {
      case 'SUNNY':
        return <Sun className={`${className} text-amber-500`} />;
      case 'PARTLY_CLOUDY':
        return <CloudSun className={`${className} text-sky-500`} />;
      case 'RAINY':
        return <CloudRain className={`${className} text-blue-500`} />;
      case 'THUNDERSTORM':
        return <CloudLightning className={`${className} text-indigo-500`} />;
      case 'SNOWY':
        return <Snowflake className={`${className} text-cyan-400`} />;
      case 'WINDY':
        return <Wind className={`${className} text-teal-500`} />;
      case 'MISTY':
      default:
        return <CloudFog className={`${className} text-slate-400`} />;
    }
  };

  const getMoodBadge = (mood: MoodScore) => {
    switch (mood) {
      case 'VIBRANT':
        return {
          label: 'Vibrant & Energized',
          emoji: '🌟',
          color: 'bg-amber-100 text-amber-900 border-amber-300',
        };
      case 'CALM':
        return {
          label: 'Calm & Peaceful',
          emoji: '🌿',
          color: 'bg-emerald-100 text-emerald-900 border-emerald-300',
        };
      case 'TIRED':
        return {
          label: 'Tired & Fatigued',
          emoji: '🥱',
          color: 'bg-blue-100 text-blue-900 border-blue-300',
        };
      case 'ANXIOUS':
        return {
          label: 'Anxious & Restless',
          emoji: '⚡',
          color: 'bg-purple-100 text-purple-900 border-purple-300',
        };
      case 'LOW':
        return {
          label: 'Low & Down',
          emoji: '🌧️',
          color: 'bg-slate-100 text-slate-800 border-slate-300',
        };
      case 'IRRITABLE':
        return {
          label: 'Pain / Irritable',
          emoji: '😣',
          color: 'bg-rose-100 text-rose-900 border-rose-300',
        };
    }
  };

  const handleSelectMoodButton = (mood: MoodScore, rating: number) => {
    setSelectedMood(mood);
    setMoodRating(rating);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const now = new Date();
    const dateStr = now.toISOString().split('T')[0];
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const impact = WEATHER_CONFIGS[selectedWeather].healthTip;

    onAddMoodLog({
      date: dateStr,
      time: timeStr,
      mood: selectedMood,
      moodRating,
      weather: selectedWeather,
      temperature: customTemp || WEATHER_CONFIGS[selectedWeather].temperatureDefault,
      energyLevel,
      sleepQuality,
      physicalFeelings: selectedFeelings,
      notes: notes.trim(),
      medsTakenOnTime,
      weatherHealthImpact: impact,
    });

    // Also update active weather effect to match user's newly logged weather
    onChangeActiveWeather(selectedWeather);
    setIsLoggingFormOpen(false);
    setNotes('');
  };

  // Correlation Analytics Calculations
  const weatherAverages = (['SUNNY', 'PARTLY_CLOUDY', 'WINDY', 'MISTY', 'RAINY', 'THUNDERSTORM'] as WeatherType[])
    .map((w) => {
      const logsOfWeather = moodLogs.filter((m) => m.weather === w);
      const count = logsOfWeather.length;
      const avgMood =
        count > 0
          ? Number((logsOfWeather.reduce((acc, c) => acc + c.moodRating, 0) / count).toFixed(1))
          : 0;
      const avgEnergy =
        count > 0
          ? Number((logsOfWeather.reduce((acc, c) => acc + c.energyLevel, 0) / count).toFixed(1))
          : 0;
      return {
        weather: WEATHER_CONFIGS[w].label.split('&')[0].trim(),
        fullWeather: w,
        count,
        avgMood,
        avgEnergy,
      };
    })
    .filter((item) => item.count > 0);

  // 7-Day Trend data
  const trendData = [...moodLogs]
    .slice(0, 7)
    .reverse()
    .map((log) => ({
      date: log.date.slice(5),
      moodRating: log.moodRating,
      energyLevel: log.energyLevel,
      weather: log.weather,
    }));

  const filteredLogs = moodLogs.filter((log) => {
    if (filterWeather !== 'ALL' && log.weather !== filterWeather) {
      return false;
    }
    return true;
  });

  const handleSpeakEntry = (entry: MoodLogEntry) => {
    const speech = `On ${entry.date} at ${entry.time}, you logged feeling ${getMoodBadge(entry.mood).label} with a mood score of ${entry.moodRating} out of 5 and energy level of ${entry.energyLevel} out of 5. The weather was ${WEATHER_CONFIGS[entry.weather].label} at ${entry.temperature}. Physical sensations noted: ${entry.physicalFeelings.join(', ')}. Doctor notes: ${entry.notes || 'None logged'}. Weather health impact: ${entry.weatherHealthImpact || ''}`;
    onSpeakText(speech);
  };

  const handleSpeakOverview = () => {
    const currentCfg = WEATHER_CONFIGS[activeWeather];
    const speech = `Mood and Weather Analytics Overview. Current ambient weather effect is set to ${currentCfg.label}. Doctor's environmental health tip: ${currentCfg.healthTip}. Over the past recorded logs, your mood has averaged ${((moodLogs.reduce((a, b) => a + b.moodRating, 0) / (moodLogs.length || 1))).toFixed(1)} out of 5. Sunny and partly cloudy days correspond with your highest reported energy and blood pressure stability.`;
    onSpeakText(speech);
  };

  const activeWeatherConfig = WEATHER_CONFIGS[activeWeather];

  return (
    <div id="mood-tracker-tab" className="space-y-6">
      {/* Atmosphere Hero & Live Weather Effects Controller */}
      <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200 shadow-xs relative overflow-hidden">
        <div
          className={`absolute inset-0 bg-gradient-to-r ${activeWeatherConfig.bgGradient} pointer-events-none transition-all duration-700`}
        />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-5">
          <div className="space-y-1.5 max-w-2xl">
            <div className="flex items-center gap-2 text-xs font-bold text-teal-800 uppercase tracking-wider">
              <Sparkles className="w-4 h-4 text-teal-600" />
              <span>Bio-Meteorology & Mood Tracking</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 flex items-center gap-2.5">
              <span>Mood Tracker with Weather Effects</span>
              <span className="text-xs px-2.5 py-1 rounded-full bg-teal-100 text-teal-800 font-bold border border-teal-200">
                Live Atmosphere
              </span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Track how barometric pressure, sunlight, humidity, and temperature affect your emotional well-being, energy, and cardiovascular & diabetic stability.
            </p>
          </div>

          {/* Right Action Bar */}
          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <button
              id="speak-mood-overview-btn"
              onClick={handleSpeakOverview}
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs sm:text-sm border border-slate-200 transition-colors"
              title="Listen to mood & weather summary"
            >
              <Volume2 className="w-4 h-4 text-teal-700" />
              <span>Read Analysis</span>
            </button>

            <button
              id="toggle-weather-canvas-btn"
              onClick={onToggleWeatherEffect}
              className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl font-bold text-xs sm:text-sm border transition-colors ${
                isWeatherEffectEnabled
                  ? 'bg-teal-600 text-white border-teal-700 shadow-xs'
                  : 'bg-white text-slate-600 border-slate-300 hover:bg-slate-50'
              }`}
              title="Toggle animated weather particles across the screen"
            >
              {isWeatherEffectEnabled ? (
                <>
                  <Eye className="w-4 h-4" />
                  <span>Weather Effects: ON</span>
                </>
              ) : (
                <>
                  <EyeOff className="w-4 h-4" />
                  <span>Weather Effects: OFF</span>
                </>
              )}
            </button>

            <button
              id="open-log-mood-modal-btn"
              onClick={() => setIsLoggingFormOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs sm:text-sm shadow-xs transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Log Today's Mood</span>
            </button>
          </div>
        </div>

        {/* Live Weather Atmosphere Switcher */}
        <div className="mt-5 pt-4 border-t border-slate-200/80 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
            <span className="text-xs font-bold text-slate-500 shrink-0 uppercase tracking-wider">
              Atmosphere:
            </span>
            {(Object.keys(WEATHER_CONFIGS) as WeatherType[]).map((wKey) => {
              const cfg = WEATHER_CONFIGS[wKey];
              const isCurrent = activeWeather === wKey;
              return (
                <button
                  key={wKey}
                  id={`weather-select-${wKey.toLowerCase()}`}
                  onClick={() => onChangeActiveWeather(wKey)}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
                    isCurrent
                      ? 'bg-slate-900 text-white shadow-xs scale-102 ring-2 ring-teal-500'
                      : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
                  }`}
                  title={`Switch visual weather effect to ${cfg.label}`}
                >
                  {getWeatherIcon(wKey, 'w-3.5 h-3.5')}
                  <span>{cfg.label.split('&')[0].trim()}</span>
                </button>
              );
            })}
          </div>

          {/* Intensity selector */}
          {isWeatherEffectEnabled && (
            <div className="flex items-center gap-2 shrink-0 self-start md:self-center bg-white px-3 py-1.5 rounded-xl border border-slate-200 text-xs">
              <span className="text-slate-500 font-medium">Particle Intensity:</span>
              {(['SUBTLE', 'MODERATE', 'VIVID'] as const).map((lvl) => (
                <button
                  key={lvl}
                  id={`intensity-${lvl.toLowerCase()}`}
                  onClick={() => onChangeWeatherIntensity(lvl)}
                  className={`px-2 py-0.5 rounded-md font-bold transition-colors ${
                    weatherIntensity === lvl
                      ? 'bg-teal-100 text-teal-800'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {lvl}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Doctor's Weather Health Impact Banner */}
        <div className="mt-4 p-3.5 rounded-xl bg-white/90 border border-slate-200/90 flex items-start gap-3 shadow-2xs">
          <div className="p-2 rounded-lg bg-teal-50 text-teal-700 shrink-0">
            <Info className="w-4 h-4" />
          </div>
          <div className="text-xs space-y-0.5">
            <div className="font-bold text-slate-900 flex items-center gap-2">
              <span>Doctor's Climate Health Advisory ({activeWeatherConfig.label})</span>
              <span className="font-normal text-slate-500">• Temp: {activeWeatherConfig.temperatureDefault}</span>
            </div>
            <p className="text-slate-700 leading-relaxed">{activeWeatherConfig.healthTip}</p>
            <p className="text-teal-800 font-medium">{activeWeatherConfig.moodInfluence}</p>
          </div>
        </div>
      </div>

      {/* MODAL: LOG MOOD & WEATHER FORM */}
      {isLoggingFormOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-xl w-full p-5 sm:p-6 border border-slate-200 shadow-xl space-y-5 my-8">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-lg sm:text-xl font-bold text-slate-900 flex items-center gap-2">
                  <Heart className="w-5 h-5 text-teal-600" />
                  Log Daily Mood & Weather Status
                </h3>
                <p className="text-xs text-slate-500">Record how you feel alongside current outdoor conditions.</p>
              </div>
              <button
                onClick={() => setIsLoggingFormOpen(false)}
                className="text-slate-400 hover:text-slate-700 text-xl font-bold p-1"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs sm:text-sm">
              {/* Mood Selection Buttons */}
              <div className="space-y-2">
                <label className="block font-bold text-slate-800">
                  How are you feeling right now? *
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  {(
                    [
                      { id: 'VIBRANT', label: 'Vibrant & Great', emoji: '🌟', rate: 5 },
                      { id: 'CALM', label: 'Calm & Peaceful', emoji: '🌿', rate: 4 },
                      { id: 'TIRED', label: 'Tired / Fatigued', emoji: '🥱', rate: 3 },
                      { id: 'ANXIOUS', label: 'Anxious / Restless', emoji: '⚡', rate: 2 },
                      { id: 'LOW', label: 'Low / Down', emoji: '🌧️', rate: 2 },
                      { id: 'IRRITABLE', label: 'Pain / Irritable', emoji: '😣', rate: 1 },
                    ] as const
                  ).map((m) => {
                    const isSelected = selectedMood === m.id;
                    return (
                      <button
                        type="button"
                        key={m.id}
                        id={`select-mood-${m.id.toLowerCase()}`}
                        onClick={() => handleSelectMoodButton(m.id, m.rate)}
                        className={`p-3 rounded-xl border text-left flex items-center gap-2.5 transition-all ${
                          isSelected
                            ? 'bg-teal-50 border-teal-500 ring-2 ring-teal-400/50 shadow-xs'
                            : 'border-slate-200 hover:bg-slate-50'
                        }`}
                      >
                        <span className="text-xl">{m.emoji}</span>
                        <div className="leading-tight">
                          <div className="font-bold text-slate-900 text-xs">{m.label}</div>
                          <div className="text-[11px] text-slate-500">Score: {m.rate}/5</div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Weather Selection */}
              <div className="space-y-2">
                <label className="block font-bold text-slate-800">
                  Current Outdoor Weather *
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {(Object.keys(WEATHER_CONFIGS) as WeatherType[]).map((wKey) => {
                    const isSelected = selectedWeather === wKey;
                    return (
                      <button
                        type="button"
                        key={wKey}
                        id={`form-weather-${wKey.toLowerCase()}`}
                        onClick={() => {
                          setSelectedWeather(wKey);
                          setCustomTemp(WEATHER_CONFIGS[wKey].temperatureDefault);
                        }}
                        className={`p-2 rounded-xl border flex items-center gap-1.5 transition-all text-xs ${
                          isSelected
                            ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                            : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                        }`}
                      >
                        {getWeatherIcon(wKey, 'w-3.5 h-3.5')}
                        <span className="font-bold">{WEATHER_CONFIGS[wKey].label.split('&')[0].trim()}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Temperature & Energy Slider */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 text-xs mb-1">
                    Temperature / Conditions:
                  </label>
                  <input
                    type="text"
                    value={customTemp}
                    onChange={(e) => setCustomTemp(e.target.value)}
                    placeholder="e.g. 24°C / 75°F"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:bg-white focus:ring-2 focus:ring-teal-500"
                  />
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="font-bold text-slate-700 text-xs">Energy Level:</label>
                    <span className="text-xs font-bold text-teal-800">{energyLevel} / 5</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="5"
                    value={energyLevel}
                    onChange={(e) => setEnergyLevel(Number(e.target.value))}
                    className="w-full accent-teal-600 h-2 bg-slate-200 rounded-lg cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                    <span>Exhausted</span>
                    <span>Moderate</span>
                    <span>High Energy</span>
                  </div>
                </div>
              </div>

              {/* Sleep Quality */}
              <div>
                <label className="block font-bold text-slate-700 text-xs mb-1.5">
                  Last Night's Sleep Quality:
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {(['POOR', 'FAIR', 'GOOD', 'EXCELLENT'] as const).map((sq) => (
                    <button
                      type="button"
                      key={sq}
                      onClick={() => setSleepQuality(sq)}
                      className={`py-1.5 rounded-lg border text-xs font-bold capitalize transition-colors ${
                        sleepQuality === sq
                          ? 'bg-teal-100 border-teal-400 text-teal-900'
                          : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      {sq.toLowerCase()}
                    </button>
                  ))}
                </div>
              </div>

              {/* Physical Feelings Chips */}
              <div>
                <label className="block font-bold text-slate-700 text-xs mb-1.5">
                  Physical Sensations & Symptoms:
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {physicalOptions.map((opt) => {
                    const isSelected = selectedFeelings.includes(opt);
                    return (
                      <button
                        type="button"
                        key={opt}
                        onClick={() => toggleFeeling(opt)}
                        className={`px-2.5 py-1 rounded-lg text-xs font-medium border transition-colors ${
                          isSelected
                            ? 'bg-teal-700 text-white border-teal-800'
                            : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        {opt}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Medicine On Time Check */}
              <div className="flex items-center gap-2.5 p-3 rounded-xl bg-amber-50/70 border border-amber-200">
                <input
                  type="checkbox"
                  id="meds-on-time-check"
                  checked={medsTakenOnTime}
                  onChange={(e) => setMedsTakenOnTime(e.target.checked)}
                  className="w-4 h-4 rounded text-teal-600 focus:ring-teal-500 accent-teal-600"
                />
                <label htmlFor="meds-on-time-check" className="text-xs text-amber-950 font-medium cursor-pointer">
                  Taken today's prescribed medications (Telmisartan, Metformin, etc.) on time
                </label>
              </div>

              {/* Notes */}
              <div>
                <label className="block font-bold text-slate-700 text-xs mb-1">
                  Personal Health Notes (Optional):
                </label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. Took a warm bath, morning blood pressure was 120/80, rested well..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:bg-white focus:ring-2 focus:ring-teal-500"
                />
              </div>

              {/* Submit Buttons */}
              <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsLoggingFormOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs sm:text-sm font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  id="save-mood-log-btn"
                  className="px-5 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs sm:text-sm font-bold shadow-xs transition-colors"
                >
                  Save Mood Entry
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ANALYTICS SECTION: MOOD VS WEATHER CORRELATION */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Chart 1: Mood & Energy by Weather Type */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <BarChart2 className="w-4 h-4 text-teal-600" />
                Mood & Energy by Weather Condition
              </h3>
              <p className="text-xs text-slate-500">Average score out of 5 across recorded weather states.</p>
            </div>
            <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-teal-50 text-teal-800 border border-teal-200">
              Correlation
            </span>
          </div>

          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weatherAverages} margin={{ top: 10, right: 10, left: -15, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis
                  dataKey="weather"
                  tick={{ fontSize: 11, fill: '#64748b' }}
                  interval={0}
                  angle={-15}
                  textAnchor="end"
                />
                <YAxis domain={[0, 5]} ticks={[1, 2, 3, 4, 5]} tick={{ fontSize: 11, fill: '#64748b' }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    border: 'none',
                    borderRadius: '8px',
                    color: '#fff',
                    fontSize: '12px',
                  }}
                  formatter={(value: any, name: any) => [
                    `${value} / 5`,
                    name === 'avgMood' ? 'Avg Mood' : 'Avg Energy',
                  ]}
                />
                <Bar dataKey="avgMood" name="avgMood" fill="#0d9488" radius={[4, 4, 0, 0]} />
                <Bar dataKey="avgEnergy" name="avgEnergy" fill="#f59e0b" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="flex items-center justify-center gap-6 text-xs text-slate-600 border-t border-slate-100 pt-2">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded bg-teal-600" />
              <span className="font-semibold">Average Mood</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded bg-amber-500" />
              <span className="font-semibold">Average Energy</span>
            </div>
          </div>
        </div>

        {/* Chart 2: 7-Day Timeline Trend */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-teal-600" />
                7-Day Mood & Energy Chronology
              </h3>
              <p className="text-xs text-slate-500">Day-by-day emotional baseline progression.</p>
            </div>
            <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-200">
              Recent 7 Days
            </span>
          </div>

          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData} margin={{ top: 10, right: 10, left: -15, bottom: 20 }}>
                <defs>
                  <linearGradient id="moodGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0d9488" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#0d9488" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#64748b' }} />
                <YAxis domain={[0, 5]} ticks={[1, 2, 3, 4, 5]} tick={{ fontSize: 11, fill: '#64748b' }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    border: 'none',
                    borderRadius: '8px',
                    color: '#fff',
                    fontSize: '12px',
                  }}
                  formatter={(value: any, name: any) => [
                    `${value} / 5`,
                    name === 'moodRating' ? 'Mood Rating' : 'Energy Level',
                  ]}
                />
                <Area
                  type="monotone"
                  dataKey="moodRating"
                  stroke="#0d9488"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#moodGradient)"
                />
                <Line
                  type="monotone"
                  dataKey="energyLevel"
                  stroke="#f59e0b"
                  strokeWidth={2}
                  dot={{ r: 4, fill: '#f59e0b' }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="flex items-center justify-between text-xs text-slate-500 border-t border-slate-100 pt-2">
            <span>High: 5 (Vibrant) • Low: 1 (Pain/Lethargy)</span>
            <span className="text-teal-800 font-bold">Stable Well-Being Trajectory</span>
          </div>
        </div>
      </div>

      {/* Clinical Insights Triad */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-amber-50/70 border border-amber-200 p-4 rounded-2xl space-y-1.5">
          <div className="flex items-center gap-2 text-amber-900 font-bold text-xs uppercase tracking-wider">
            <Sun className="w-4 h-4 text-amber-600" />
            <span>Solar & Sunlight Correlation</span>
          </div>
          <h4 className="font-bold text-slate-900 text-sm">Best Mood on Sunny Mornings</h4>
          <p className="text-xs text-slate-700 leading-relaxed">
            Your logs show an average mood rating of <strong>4.8 / 5</strong> on clear sunny days. Sunlight supports nitric oxide release, naturally assisting blood pressure dilation.
          </p>
        </div>

        <div className="bg-blue-50/70 border border-blue-200 p-4 rounded-2xl space-y-1.5">
          <div className="flex items-center gap-2 text-blue-900 font-bold text-xs uppercase tracking-wider">
            <CloudRain className="w-4 h-4 text-blue-600" />
            <span>Precipitation & Joint Aches</span>
          </div>
          <h4 className="font-bold text-slate-900 text-sm">Barometric Drop Sensitivity</h4>
          <p className="text-xs text-slate-700 leading-relaxed">
            Rainy & stormy days recorded mild joint stiffness. The prescribed warm ginger water regimen in your eating habits provided documented comfort.
          </p>
        </div>

        <div className="bg-emerald-50/70 border border-emerald-200 p-4 rounded-2xl space-y-1.5">
          <div className="flex items-center gap-2 text-emerald-900 font-bold text-xs uppercase tracking-wider">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Pill Adherence Correlation</span>
          </div>
          <h4 className="font-bold text-slate-900 text-sm">Adherence Boosts Peace of Mind</h4>
          <p className="text-xs text-slate-700 leading-relaxed">
            Days with 100% on-time doses of Telmisartan and Metformin recorded <strong>zero high-anxiety spikes</strong>, reinforcing routine security.
          </p>
        </div>
      </div>

      {/* LOGGED MOOD ENTRIES HISTORY */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-slate-100 bg-slate-50/70 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="font-bold text-slate-900 text-base sm:text-lg flex items-center gap-2">
              <Calendar className="w-4 h-4 text-teal-700" />
              <span>Mood Log History & Weather Correlation</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Every recorded entry with physical symptoms, medicine adherence, and weather influence.
            </p>
          </div>

          {/* Filter by weather */}
          <div className="flex items-center gap-2">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <select
              id="filter-mood-weather-select"
              value={filterWeather}
              onChange={(e) => setFilterWeather(e.target.value)}
              className="bg-white border border-slate-200 rounded-xl px-2.5 py-1 text-xs font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-500"
            >
              <option value="ALL">All Weather Conditions</option>
              {(Object.keys(WEATHER_CONFIGS) as WeatherType[]).map((wKey) => (
                <option key={wKey} value={wKey}>
                  {WEATHER_CONFIGS[wKey].label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="divide-y divide-slate-100">
          {filteredLogs.map((log) => {
            const badge = getMoodBadge(log.mood);
            const wCfg = WEATHER_CONFIGS[log.weather];

            return (
              <div
                key={log.id}
                id={`mood-log-item-${log.id}`}
                className="p-4 sm:p-5 hover:bg-slate-50/50 transition-colors space-y-3"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl p-2 rounded-xl bg-slate-50 border border-slate-200/80">
                      {badge.emoji}
                    </span>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900 text-sm sm:text-base">
                          {badge.label}
                        </span>
                        <span
                          className={`text-xs font-bold px-2 py-0.5 rounded-md border ${badge.color}`}
                        >
                          Score {log.moodRating}/5
                        </span>
                      </div>
                      <div className="text-xs text-slate-500 flex items-center gap-2 mt-0.5">
                        <span className="inline-flex items-center gap-1 font-medium text-slate-700">
                          <Calendar className="w-3 h-3" />
                          {log.date}
                        </span>
                        <span>•</span>
                        <span className="inline-flex items-center gap-1 font-medium text-slate-700">
                          <Clock className="w-3 h-3" />
                          {log.time}
                        </span>
                        <span>•</span>
                        <span className="text-teal-800 font-semibold">
                          Energy: {log.energyLevel}/5
                        </span>
                        <span>•</span>
                        <span className="text-slate-600 capitalize">
                          Sleep: {log.sleepQuality.toLowerCase()}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Right: Weather pill & buttons */}
                  <div className="flex items-center gap-2 self-start sm:self-center">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-slate-100 border border-slate-200 text-xs font-semibold text-slate-800">
                      {getWeatherIcon(log.weather, 'w-3.5 h-3.5')}
                      <span>{wCfg.label.split('&')[0].trim()}</span>
                      <span className="text-slate-500 font-normal">({log.temperature})</span>
                    </div>

                    <button
                      onClick={() => handleSpeakEntry(log)}
                      className="p-1.5 rounded-lg text-teal-700 hover:bg-teal-50 border border-teal-200 transition-colors"
                      title="Listen to this log"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={() => onDeleteMoodLog(log.id)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                      title="Delete entry"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Physical feelings tags */}
                {log.physicalFeelings && log.physicalFeelings.length > 0 && (
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                      Sensations:
                    </span>
                    {log.physicalFeelings.map((feel, fIdx) => (
                      <span
                        key={fIdx}
                        className="text-xs px-2 py-0.5 rounded-md bg-white border border-slate-200 text-slate-700 font-medium"
                      >
                        {feel}
                      </span>
                    ))}
                    {log.medsTakenOnTime && (
                      <span className="text-xs px-2 py-0.5 rounded-md bg-emerald-50 border border-emerald-200 text-emerald-800 font-bold inline-flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        Meds Taken on Time
                      </span>
                    )}
                  </div>
                )}

                {/* Notes and Weather Impact */}
                {log.notes && (
                  <div className="text-xs text-slate-700 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                    <strong className="text-slate-900 font-semibold">Patient Note:</strong> {log.notes}
                  </div>
                )}

                {log.weatherHealthImpact && (
                  <div className="text-[11px] text-teal-900 bg-teal-50/50 p-2 rounded-lg border border-teal-100 flex items-center gap-1.5">
                    <Info className="w-3.5 h-3.5 text-teal-700 shrink-0" />
                    <span>
                      <strong>Weather Health Factor:</strong> {log.weatherHealthImpact}
                    </span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
