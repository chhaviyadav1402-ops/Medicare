import React, { useState } from 'react';
import {
  Pill,
  AlertTriangle,
  Clock,
  Calendar,
  Phone,
  PlusCircle,
  CheckCircle2,
  AlertCircle,
  Search,
  Filter,
  Package,
  Utensils,
} from 'lucide-react';
import { MedicationItem, RestockStatus } from '../types';

interface MedicationsTabProps {
  medications: MedicationItem[];
  onRefillMedication: (medId: string, pillCount: number) => void;
  onOpenEmergencyModal: () => void;
}

export const MedicationsTab: React.FC<MedicationsTabProps> = ({
  medications,
  onRefillMedication,
  onOpenEmergencyModal,
}) => {
  const [filter, setFilter] = useState<'ALL' | 'RESTOCK_NEEDED' | 'MORNING' | 'EVENING'>('ALL');
  const [searchTerm, setSearchTerm] = useState('');

  // Counts
  const criticalCount = medications.filter((m) => m.restockAlertLevel === 'CRITICAL').length;
  const warningCount = medications.filter((m) => m.restockAlertLevel === 'WARNING').length;

  const filteredMeds = medications.filter((med) => {
    // Search filter
    if (
      searchTerm &&
      !med.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      !med.conditionTreated.toLowerCase().includes(searchTerm.toLowerCase())
    ) {
      return false;
    }

    if (filter === 'RESTOCK_NEEDED') {
      return med.restockAlertLevel === 'CRITICAL' || med.restockAlertLevel === 'WARNING';
    }
    if (filter === 'MORNING') {
      return med.timingSlot === 'MORNING';
    }
    if (filter === 'EVENING') {
      return med.timingSlot === 'EVENING' || med.timingSlot === 'BEDTIME';
    }
    return true;
  });

  const getRestockBadge = (level: RestockStatus, days: number, date: string) => {
    switch (level) {
      case 'CRITICAL':
        return (
          <div className="bg-red-50 border border-red-300 rounded-xl p-2.5 flex items-start gap-2 text-red-900">
            <AlertTriangle className="w-5 h-5 text-red-600 shrink-0 mt-0.5 animate-pulse" />
            <div>
              <div className="font-bold text-xs uppercase tracking-wide text-red-700">
                Critical Restock Required!
              </div>
              <div className="text-xs font-semibold">
                Only {days} day{days !== 1 ? 's' : ''} left of medicine. Restock by {date}!
              </div>
            </div>
          </div>
        );
      case 'WARNING':
        return (
          <div className="bg-amber-50 border border-amber-300 rounded-xl p-2.5 flex items-start gap-2 text-amber-900">
            <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <div className="font-bold text-xs uppercase tracking-wide text-amber-700">
                Restock Soon
              </div>
              <div className="text-xs font-semibold">
                {days} days remaining. Plan refill by {date}.
              </div>
            </div>
          </div>
        );
      case 'GOOD':
      default:
        return (
          <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-2.5 flex items-start gap-2 text-emerald-900">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <div className="font-bold text-xs uppercase tracking-wide text-emerald-700">
                Well Stocked
              </div>
              <div className="text-xs font-semibold">
                {days} days supply remaining. Next refill around {date}.
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div id="medications-tab" className="space-y-6">
      {/* Overview Stats Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-teal-50 border border-teal-200 text-teal-700 flex items-center justify-center shrink-0">
            <Pill className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
              Active Prescriptions
            </div>
            <div className="text-2xl font-bold text-slate-900">{medications.length} Medicines</div>
            <div className="text-xs text-slate-500">Extracted from Doctor Notes</div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-red-50 border border-red-200 text-red-600 flex items-center justify-center shrink-0">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
              Needs Restock Soon
            </div>
            <div className="text-2xl font-bold text-red-600">
              {criticalCount + warningCount} Medicines
            </div>
            <div className="text-xs text-slate-500">
              {criticalCount > 0 ? `${criticalCount} critical (≤3 days left)` : 'No critical shortages'}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 flex items-center justify-center shrink-0">
            <Package className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
              Inventory Status
            </div>
            <div className="text-2xl font-bold text-emerald-700">
              {medications.length - (criticalCount + warningCount)} Stocked
            </div>
            <div className="text-xs text-slate-500">Safe supply for 2+ weeks</div>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search by medicine name or condition (e.g. Telmisartan, Blood Pressure)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm border border-slate-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-teal-500"
          />
        </div>

        <div className="flex flex-wrap gap-1.5">
          {[
            { id: 'ALL', label: 'All Medicines' },
            { id: 'RESTOCK_NEEDED', label: `⚠️ Needs Restock (${criticalCount + warningCount})` },
            { id: 'MORNING', label: 'Morning Doses' },
            { id: 'EVENING', label: 'Evening Doses' },
          ].map((btn) => (
            <button
              key={btn.id}
              onClick={() => setFilter(btn.id as any)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                filter === btn.id
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {btn.label}
            </button>
          ))}
        </div>
      </div>

      {/* Medications List */}
      <div className="space-y-4">
        {filteredMeds.map((med) => {
          const percentLeft = Math.min(
            100,
            Math.round((med.pillsRemaining / (med.totalPackSize || 30)) * 100)
          );

          return (
            <div
              key={med.id}
              id={`med-inventory-${med.id}`}
              className={`bg-white rounded-2xl border p-5 sm:p-6 shadow-xs transition-all ${
                med.restockAlertLevel === 'CRITICAL'
                  ? 'border-red-300 ring-2 ring-red-100'
                  : med.restockAlertLevel === 'WARNING'
                  ? 'border-amber-300'
                  : 'border-slate-200 hover:border-teal-300'
              }`}
            >
              <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-5">
                {/* Left details */}
                <div className="space-y-2 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-lg sm:text-xl font-bold text-slate-900">{med.name}</h3>
                    <span className="text-xs font-bold px-2.5 py-0.5 rounded-md bg-teal-50 text-teal-800 border border-teal-200">
                      {med.dosage}
                    </span>
                    <span className="text-xs font-semibold px-2.5 py-0.5 rounded-md bg-slate-100 text-slate-700">
                      {med.form}
                    </span>
                    <span className="text-xs font-medium px-2 py-0.5 rounded-md bg-blue-50 text-blue-800">
                      {med.relationToMeal}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs sm:text-sm text-slate-600 pt-1">
                    <div>
                      <strong className="text-slate-800">Condition Treated:</strong>{' '}
                      <span className="text-teal-900 font-semibold">{med.conditionTreated}</span>
                    </div>
                    <div>
                      <strong className="text-slate-800">Timing:</strong> {med.timingSlot} at{' '}
                      <span className="font-semibold text-slate-800">{med.exactTime}</span>
                    </div>
                    <div>
                      <strong className="text-slate-800">Prescribed By:</strong> {med.prescribingDoctor}
                    </div>
                    <div>
                      <strong className="text-slate-800">Refill Phone:</strong>{' '}
                      <a
                        href={`tel:${med.doctorPhone.replace(/[^0-9+]/g, '')}`}
                        className="text-teal-700 hover:underline font-bold"
                      >
                        {med.doctorPhone}
                      </a>
                    </div>

                    {med.particularDietForProblem && (
                      <div className="sm:col-span-2 bg-amber-50/80 border border-amber-200/90 p-2.5 rounded-xl flex items-start gap-2 text-xs">
                        <Utensils className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                        <div>
                          <strong className="text-amber-950 font-bold uppercase tracking-wide text-[11px] block">
                            A Particular Diet According to Problem:
                          </strong>
                          <span className="text-slate-800 font-semibold">{med.particularDietForProblem}</span>
                        </div>
                      </div>
                    )}
                  </div>

                  {med.specialInstructions && (
                    <div className="text-xs text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                      <strong className="text-slate-700">Doctor Instruction:</strong> "{med.specialInstructions}"
                    </div>
                  )}
                </div>

                {/* Right: Restock & Inventory Tracker */}
                <div className="lg:w-80 space-y-3 shrink-0 bg-slate-50/70 p-4 rounded-xl border border-slate-200">
                  {/* Status Banner */}
                  {getRestockBadge(med.restockAlertLevel, med.daysRemaining, med.restockByDate)}

                  {/* Stock progress */}
                  <div>
                    <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                      <span>Supply Remaining</span>
                      <span>
                        {med.pillsRemaining} of {med.totalPackSize || 30} {med.form.toLowerCase()}s
                      </span>
                    </div>
                    <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-300 ${
                          med.restockAlertLevel === 'CRITICAL'
                            ? 'bg-red-600'
                            : med.restockAlertLevel === 'WARNING'
                            ? 'bg-amber-500'
                            : 'bg-emerald-600'
                        }`}
                        style={{ width: `${percentLeft}%` }}
                      />
                    </div>
                  </div>

                  {/* Refill Button Action */}
                  <div className="flex items-center gap-2 pt-1">
                    <button
                      id={`refill-med-${med.id}-btn`}
                      onClick={() => onRefillMedication(med.id, 30)}
                      className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-2xs transition-colors"
                      title="Log a new pack refill of 30 pills"
                    >
                      <PlusCircle className="w-3.5 h-3.5" />
                      <span>+ Restocked (Add 30)</span>
                    </button>

                    <a
                      href={`tel:${med.doctorPhone.replace(/[^0-9+]/g, '')}`}
                      className="inline-flex items-center justify-center gap-1 px-3 py-2 rounded-xl bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 font-bold text-xs transition-colors"
                      title="Call clinic to request prescription refill"
                    >
                      <Phone className="w-3.5 h-3.5 text-teal-600" />
                      <span>Order</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
