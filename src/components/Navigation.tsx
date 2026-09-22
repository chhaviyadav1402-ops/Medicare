import React from 'react';
import {
  Clock,
  FileText,
  Pill,
  Utensils,
  PhoneCall,
  Watch,
  Stethoscope,
  CloudSun,
} from 'lucide-react';
import { ActiveTab } from '../types';

interface NavigationProps {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
  documentCount: number;
  medicationCount: number;
  restockWarningCount: number;
  moodCount?: number;
  watchConnected?: boolean;
  mealPhotoCount?: number;
}

export const Navigation: React.FC<NavigationProps> = ({
  activeTab,
  onTabChange,
  documentCount,
  medicationCount,
  restockWarningCount,
  moodCount,
  watchConnected,
  mealPhotoCount,
}) => {
  const tabs: {
    id: ActiveTab;
    label: string;
    icon: any;
    badge?: string;
    badgeColor?: string;
    description: string;
    highlight?: boolean;
  }[] = [
    {
      id: 'TIMETABLE',
      label: 'Daily Timetable',
      icon: Clock,
      description: 'When & how to take medicines',
    },
    {
      id: 'WATCH_TELEMETRY',
      label: 'Smartwatch Stream',
      icon: Watch,
      badge: watchConnected ? 'LIVE' : 'PAIR',
      badgeColor: watchConnected ? 'bg-emerald-100 text-emerald-800' : 'bg-indigo-100 text-indigo-700',
      description: 'Steps, heart rate & inactivity warning',
    },
    {
      id: 'DOCTOR_REPORT',
      label: "Doctor's Report",
      icon: Stethoscope,
      badge: 'URGENT FLAGS',
      badgeColor: 'bg-rose-100 text-rose-800',
      description: 'Critical events summary for physicians',
    },
    {
      id: 'DOCUMENTS',
      label: 'Medical Documents',
      icon: FileText,
      badge: documentCount.toString(),
      description: 'Past history & recent records',
    },
    {
      id: 'MEDICATIONS',
      label: 'Medicines & Restock',
      icon: Pill,
      badge: restockWarningCount > 0 ? `${restockWarningCount} restock` : `${medicationCount}`,
      badgeColor: restockWarningCount > 0 ? 'bg-rose-100 text-rose-700' : 'bg-slate-100 text-slate-700',
      description: 'Dosages & refill tracker',
    },
    {
      id: 'EATING_HABITS',
      label: 'Diet & Meal Camera',
      icon: Utensils,
      badge: mealPhotoCount ? `${mealPhotoCount} pics` : undefined,
      description: 'Doctor diet rules & photo matching',
    },
    {
      id: 'MOOD_TRACKER',
      label: 'Mood & Weather',
      icon: CloudSun,
      badge: moodCount ? `${moodCount}` : undefined,
      description: 'Atmosphere effects & daily wellness',
    },
    {
      id: 'EMERGENCY',
      label: 'Real-Time Call',
      icon: PhoneCall,
      highlight: true,
      description: 'Real call timer for emergency',
    },
  ];

  return (
    <nav className="bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex space-x-1 sm:space-x-2 overflow-x-auto py-2 no-scrollbar">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                id={`nav-tab-${tab.id.toLowerCase()}`}
                onClick={() => onTabChange(tab.id)}
                className={`flex items-center gap-2 px-3.5 sm:px-4 py-2.5 rounded-xl font-medium text-xs sm:text-sm whitespace-nowrap transition-all cursor-pointer ${
                  isActive
                    ? tab.highlight
                      ? 'bg-red-50 text-red-700 font-bold border border-red-200 shadow-xs'
                      : 'bg-teal-50 text-teal-900 font-bold border border-teal-200 shadow-xs'
                    : tab.highlight
                    ? 'text-red-700 hover:bg-red-50/50'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <Icon
                  className={`w-4 h-4 ${
                    isActive
                      ? tab.highlight
                        ? 'text-red-600'
                        : 'text-teal-600'
                      : tab.highlight
                      ? 'text-red-500'
                      : 'text-slate-400'
                  }`}
                />
                <span>{tab.label}</span>
                {tab.badge && (
                  <span
                    className={`text-[11px] font-bold px-1.5 py-0.5 rounded-full ${
                      tab.badgeColor || 'bg-slate-100 text-slate-700'
                    }`}
                  >
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
};
